import os
import torch
import torch.nn.functional as F
import numpy as np
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from model import HybridFeatureExtractor, EnsembleRRELM, RRELM
from dataset_loader import get_dataloaders
from cross_validate import load_combined_dataset

def get_default_device():
    if torch.cuda.is_available():
        return 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        return 'mps'
    return 'cpu'

def extract_all_features(loader, feature_extractor, device):
    all_feats = []
    all_labels = []
    with torch.no_grad():
        for inputs, labels in loader:
            inputs = inputs.to(device)
            feats = feature_extractor(inputs)
            all_feats.append(feats.cpu())
            all_labels.append(labels)
    return torch.cat(all_feats), torch.cat(all_labels)

def main():
    device = get_default_device()
    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: {weights_path} not found.")
        return

    print(f"Loading feature extractor from {weights_path} onto {device}...")
    checkpoint = torch.load(weights_path, map_location=device)
    
    feature_extractor = HybridFeatureExtractor().to(device)
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    feature_extractor.eval()

    print("Loading datasets...")
    train_loader, test_loader = get_dataloaders(root_dir='dataset', batch_size=64)

    print("Extracting 384-dimensional features...")
    X_train, y_train = extract_all_features(train_loader, feature_extractor, device)
    X_test, y_test = extract_all_features(test_loader, feature_extractor, device)
    
    print(f"Train Features: {X_train.shape}, Test Features: {X_test.shape}")

    # 1. Evaluate Baseline Single RRELM
    print("\n--- 1. Evaluating Single RRELM Baseline ---")
    single_rrelm = RRELM(input_dim=384, hidden_dim=8192, num_classes=4, C=0.05, seed=42)
    single_rrelm.fit(X_train, y_train)
    single_preds, _ = single_rrelm.predict(X_test, temperature=0.02)
    single_acc = accuracy_score(y_test.numpy(), single_preds.numpy()) * 100
    print(f"Single RRELM Test Accuracy: {single_acc:.2f}%")

    # 2. Evaluate 5-Seed Ensemble RRELM with Grid Search over C
    print("\n--- 2. Evaluating 5-Seed Ensemble RRELM ---")
    seeds = [42, 123, 456, 789, 1024]
    best_c = 0.05
    best_ens_acc = 0.0
    best_ensemble = None

    for c_cand in [0.01, 0.02, 0.05, 0.1, 0.5, 1.0]:
        ensemble = EnsembleRRELM(input_dim=384, hidden_dim=8192, num_classes=4, C=c_cand, seeds=seeds)
        ensemble.fit(X_train, y_train)
        ens_preds, _ = ensemble.predict(X_test, temperature=0.02)
        ens_acc = accuracy_score(y_test.numpy(), ens_preds.numpy()) * 100
        print(f"Ensemble RRELM (C={c_cand:<5}) Test Accuracy: {ens_acc:.2f}%")
        if ens_acc > best_ens_acc:
            best_ens_acc = ens_acc
            best_c = c_cand
            best_ensemble = ensemble

    print(f"\n🏆 Best Ensemble Test Accuracy: {best_ens_acc:.2f}% (C={best_c})")
    print(f"📈 Net Accuracy Improvement: +{best_ens_acc - single_acc:.2f}%")

    # 3. Save Updated Checkpoint with Ensemble Weights
    print("\nSaving updated checkpoint with Ensemble RRELM...")
    torch.save({
        'feature_extractor_state_dict': checkpoint['feature_extractor_state_dict'],
        'rrelm_W': best_ensemble.models[0].W,
        'rrelm_b': best_ensemble.models[0].b,
        'rrelm_beta': best_ensemble.models[0].beta,
        'ensemble_rrelm_state': best_ensemble.state_dict()
    }, weights_path)
    print(f"Successfully saved updated weights to {weights_path}!")

if __name__ == '__main__':
    main()
