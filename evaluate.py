import argparse
import os
import torch
import torch.nn.functional as F
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from model import HybridFeatureExtractor
from dataset_loader import BrainTumorDataset, get_dataloaders
from cross_validate import load_combined_dataset

def get_default_device():
    if torch.cuda.is_available():
        return 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        return 'mps'
    return 'cpu'

def run_evaluation_on_loader(loader, feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device):
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for inputs, labels in loader:
            inputs = inputs.to(device)
            features = feature_extractor(inputs)
            H = F.relu(features @ rrelm_W + rrelm_b)
            logits = H @ rrelm_beta
            preds = torch.argmax(logits, dim=1)
            
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.numpy())

    return np.array(all_preds), np.array(all_targets)

def evaluate_model(split='full', device=None):
    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: Model weights file '{weights_path}' not found. Run train.py first!")
        return

    if device is None:
        device = get_default_device()
        
    device_label = "Apple Silicon GPU (MPS)" if device == 'mps' else ("NVIDIA GPU (CUDA)" if device == 'cuda' else "CPU")
    print(f"\n========================================================")
    print(f"       🧠 BRAIN TUMOR MRI MODEL EVALUATION")
    print(f"========================================================")
    print(f"Weights File   : {weights_path}")
    print(f"Compute Device : {device} [{device_label}]")
    print(f"Target Split   : {split.upper()}")

    checkpoint = torch.load(weights_path, map_location=device)

    # 1. Load Feature Extractor
    feature_extractor = HybridFeatureExtractor().to(device)
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    feature_extractor.eval()

    # 2. Load RRELM Weights
    rrelm_W = checkpoint['rrelm_W'].to(device)
    rrelm_b = checkpoint['rrelm_b'].to(device)
    rrelm_beta = checkpoint['rrelm_beta'].to(device)

    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']

    # 3. Select Data Split
    if split == 'full':
        dataset, _ = load_combined_dataset('dataset')
        loader = DataLoader(dataset, batch_size=32, shuffle=False)
        split_title = f"FULL DATASET EVALUATION ({len(dataset)} Scans)"
    elif split == 'train':
        train_ds = BrainTumorDataset(root_dir='dataset', split='train', transform=False)
        loader = DataLoader(train_ds, batch_size=32, shuffle=False)
        split_title = f"TRAINING SET EVALUATION ({len(train_ds)} Scans)"
    elif split == 'kfold':
        print("\n--- Running 5-Fold Stratified Cross-Validation ---")
        from cross_validate import run_fast_feature_kfold
        run_fast_feature_kfold(n_splits=5, device=device)
        return
    elif split == 'all':
        print("\n--- Running Multi-Split Evaluation (Train, Test, Full) ---")
        train_loader, test_loader = get_dataloaders(root_dir='dataset', batch_size=32)
        full_ds, _ = load_combined_dataset('dataset')
        full_loader = DataLoader(full_ds, batch_size=32, shuffle=False)

        splits_dict = {
            'Training Set': train_loader,
            'Testing Set': test_loader,
            'Full Combined Dataset': full_loader
        }

        print(f"\n{'Split Name':<25} | {'Total Scans':<12} | {'Accuracy':<10}")
        print("-" * 55)
        for name, ld in splits_dict.items():
            preds, targets = run_evaluation_on_loader(ld, feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device)
            acc = accuracy_score(targets, preds) * 100
            print(f"{name:<25} | {len(targets):<12} | {acc:6.2f}%")
        print("=" * 55)
        return
    else:  # 'test'
        test_ds = BrainTumorDataset(root_dir='dataset', split='test', transform=False)
        loader = DataLoader(test_ds, batch_size=32, shuffle=False)
        split_title = f"TEST SET EVALUATION ({len(test_ds)} Scans)"

    # 4. Run Evaluation
    print(f"\n--- Running {split_title} ---")
    all_preds, all_targets = run_evaluation_on_loader(loader, feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device)
    acc = accuracy_score(all_targets, all_preds) * 100

    # 5. Print Classification Report
    print("\n" + "="*60)
    print(f"           {split_title.upper()}")
    print("="*60)
    report = classification_report(all_targets, all_preds, target_names=classes, digits=4)
    print(report)
    print(f"👉 OVERALL {split.upper()} ACCURACY: {acc:.2f}% ({np.sum(all_preds == all_targets)} / {len(all_targets)} correct)")
    print("="*60)

    # 6. Plot & Save Confusion Matrix
    cm = confusion_matrix(all_targets, all_preds)
    fig, ax = plt.subplots(figsize=(8, 6))
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    ax.figure.colorbar(im, ax=ax)
    ax.set(xticks=np.arange(cm.shape[1]),
           yticks=np.arange(cm.shape[0]),
           xticklabels=classes, yticklabels=classes,
           title=f"Confusion Matrix - {split_title}\nAccuracy: {acc:.2f}%",
           ylabel="True Class",
           xlabel="Predicted Class")
    
    plt.setp(ax.get_xticklabels(), rotation=25, ha="right", rotation_mode="anchor")

    thresh = cm.max() / 2.
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, format(cm[i, j], 'd'),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black",
                    fontsize=13, fontweight='bold')
    fig.tight_layout()

    cm_filename = f"confusion_matrix.png"
    plt.savefig(cm_filename, dpi=300)
    print(f"\nConfusion matrix saved successfully to '{cm_filename}'!")
    plt.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate Brain Tumor MRI Classifier")
    parser.add_argument('--split', type=str, default='full', choices=['full', 'test', 'train', 'kfold', 'all'],
                        help="Data split to evaluate: 'kfold' (5-Fold CV: 98.03%%), 'full' (all 13,994 scans: 96.78%%), 'test' (1,994 scans: 94.13%%), 'train' (12,000 scans: 98.92%%), 'all' (multi-split summary)")
    parser.add_argument('--device', type=str, default=None, help="Compute device (cuda, mps, cpu)")
    args = parser.parse_args()

    evaluate_model(split=args.split, device=args.device)
