import argparse
import os
import copy
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import DataLoader, Subset
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from dataset_loader import BrainTumorDataset
from model import HybridFeatureExtractor, EndToEndModel, RRELM
from train import mixup_data, mixup_criterion

def get_default_device():
    if torch.cuda.is_available():
        return 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        return 'mps'
    return 'cpu'

def load_combined_dataset(root_dir='dataset'):
    """Combines train and test splits into a single unified dataset for K-Fold splitting."""
    train_ds = BrainTumorDataset(root_dir=root_dir, split='train', transform=True)
    test_ds = BrainTumorDataset(root_dir=root_dir, split='test', transform=False)
    
    all_paths = train_ds.image_paths + test_ds.image_paths
    all_labels = train_ds.labels + test_ds.labels
    
    class UnifiedDataset(torch.utils.data.Dataset):
        def __init__(self, paths, labels, transform_fn=None):
            self.image_paths = paths
            self.labels = labels
            self.transform_fn = transform_fn
            self.classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
            self.helper = test_ds

        def __len__(self):
            return len(self.image_paths)

        def __getitem__(self, idx):
            path = self.image_paths[idx]
            label = self.labels[idx]
            import cv2
            img = cv2.imread(path)
            if img is None:
                img = np.zeros((124, 124, 3), dtype=np.uint8)
            else:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                
            img = self.helper.preprocess(img)
            if self.transform_fn:
                img = self.helper.augment(img)
                
            img = img.astype(np.float32) / 255.0
            img = np.transpose(img, (2, 0, 1))
            return torch.from_numpy(img), label

    return UnifiedDataset(all_paths, all_labels), np.array(all_labels)

def run_fast_feature_kfold(n_splits=5, device=None, root_dir='dataset', c_val=500.0):
    """
    Fast K-Fold: Extracts 384-dim features across all 13,994 scans
    and reports both Training Accuracy and Testing/Validation Accuracy for each fold.
    """
    if device is None:
        device = get_default_device()
        
    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: Trained weights '{weights_path}' not found! Run train.py first.")
        return

    print(f"\n=========================================================================================")
    print(f"               ⚡ {n_splits}-FOLD STRATIFIED CROSS-VALIDATION (TRAIN & TEST ACCURACY)")
    print(f"=========================================================================================")
    print(f"Compute Device : {device}")
    
    # 1. Load Feature Extractor
    checkpoint = torch.load(weights_path, map_location=device)
    feature_extractor = HybridFeatureExtractor().to(device)
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    feature_extractor.eval()

    # 2. Load Unified Dataset
    dataset, labels = load_combined_dataset(root_dir)
    total_samples = len(dataset)
    print(f"Total Dataset  : {total_samples} MRI Scans across 4 classes (Glioma, Meningioma, No-Tumor, Pituitary)")

    # 3. Extract all 384-dimensional features
    print("Extracting features across all scans...")
    loader = DataLoader(dataset, batch_size=64, shuffle=False)
    all_features = []
    
    with torch.no_grad():
        for imgs, _ in loader:
            imgs = imgs.to(device)
            feats = feature_extractor(imgs)
            all_features.append(feats.cpu())
            
    X = torch.cat(all_features)
    y = torch.tensor(labels, dtype=torch.long)

    # 4. Stratified K-Fold
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
    train_accuracies = []
    test_accuracies = []
    test_precisions = []
    test_recalls = []
    test_f1s = []

    print(f"\n{'Fold':<8} | {'Train Scans':<11} | {'Test Scans':<10} | {'Train Acc':<11} | {'Test Acc':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}")
    print("-" * 97)

    for fold_idx, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
        X_train, y_train = X[train_idx], y[train_idx]
        X_val, y_val = X[val_idx], y[val_idx]

        rrelm = RRELM(input_dim=384, hidden_dim=8192, num_classes=4, C=c_val)
        rrelm.fit(X_train, y_train)

        # Train Accuracy
        train_preds, _ = rrelm.predict(X_train)
        train_acc = accuracy_score(y_train.numpy(), train_preds.numpy()) * 100
        train_accuracies.append(train_acc)

        # Test/Validation Accuracy & Metrics
        val_preds, _ = rrelm.predict(X_val)
        preds_np = val_preds.numpy()
        y_val_np = y_val.numpy()

        test_acc = accuracy_score(y_val_np, preds_np) * 100
        prec, rec, f1, _ = precision_recall_fscore_support(y_val_np, preds_np, average='weighted', zero_division=0)
        
        test_accuracies.append(test_acc)
        test_precisions.append(prec * 100)
        test_recalls.append(rec * 100)
        test_f1s.append(f1 * 100)

        print(f"Fold {fold_idx:<3} | {len(train_idx):<11} | {len(val_idx):<10} | {train_acc:6.2f}%     | {test_acc:6.2f}%   | {prec*100:6.2f}%    | {rec*100:6.2f}%    | {f1*100:6.2f}%")

    print("=" * 97)
    print(f"AVERAGE (MEAN) OVER ALL {n_splits} FOLDS:")
    print(f"  🏋️ Mean Train Accuracy : {np.mean(train_accuracies):.2f}% ± {np.std(train_accuracies):.2f}%")
    print(f"  🧪 Mean Test Accuracy  : {np.mean(test_accuracies):.2f}% ± {np.std(test_accuracies):.2f}%")
    print(f"  🎯 Mean Test Precision : {np.mean(test_precisions):.2f}% ± {np.std(test_precisions):.2f}%")
    print(f"  🎯 Mean Test Recall    : {np.mean(test_recalls):.2f}% ± {np.std(test_recalls):.2f}%")
    print(f"  🎯 Mean Test F1-Score  : {np.mean(test_f1s):.2f}% ± {np.std(test_f1s):.2f}%")
    print("=" * 97)

    plot_kfold_summary(train_accuracies, test_accuracies, test_f1s, n_splits)

def plot_kfold_summary(train_accs, test_accs, f1_scores, n_splits):
    folds = [f"Fold {i+1}" for i in range(n_splits)]
    x = np.arange(len(folds))
    width = 0.25

    plt.figure(figsize=(10, 5))
    plt.bar(x - width, train_accs, width, label='Train Accuracy (%)', color='#6366f1')
    plt.bar(x, test_accs, width, label='Test Accuracy (%)', color='#2563eb')
    plt.bar(x + width, f1_scores, width, label='Test F1-Score (%)', color='#10b981')

    plt.axhline(np.mean(test_accs), color='#1d4ed8', linestyle='--', linewidth=1.5, label=f'Mean Test Acc ({np.mean(test_accs):.2f}%)')
    plt.ylabel('Percentage (%)', fontsize=11, fontweight='bold')
    plt.title(f'{n_splits}-Fold Stratified Cross-Validation: Train vs Test Performance', fontsize=13, fontweight='bold')
    plt.xticks(x, folds, fontsize=10, fontweight='bold')
    plt.ylim(min(train_accs + test_accs + f1_scores) - 3, 101)
    plt.legend(loc='lower right')
    plt.grid(axis='y', linestyle=':', alpha=0.6)
    plt.tight_layout()

    out_name = "kfold_cv_results.png"
    plt.savefig(out_name, dpi=300)
    print(f"\nSaved cross-validation performance plot to '{out_name}'!")
    plt.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Stratified K-Fold Cross-Validation for Brain Tumor MRI")
    parser.add_argument('--folds', type=int, default=5, help="Number of folds (default: 5)")
    parser.add_argument('--c', type=float, default=500.0, help="RRELM Ridge Parameter C (default: 500.0)")
    parser.add_argument('--device', type=str, default=None, help="Device (cuda, mps, cpu)")
    args = parser.parse_args()

    run_fast_feature_kfold(n_splits=args.folds, device=args.device, c_val=args.c)
