import os
import torch
import torch.nn.functional as F
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix

from model import HybridFeatureExtractor
from dataset_loader import get_dataloaders

def evaluate_model():
    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: Model weights file '{weights_path}' not found. Run train.py first!")
        return

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Loading model checkpoint from '{weights_path}' on {device}...")

    checkpoint = torch.load(weights_path, map_location=device)

    # 1. Load Feature Extractor
    feature_extractor = HybridFeatureExtractor().to(device)
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    feature_extractor.eval()

    # 2. Load RRELM Weights
    rrelm_W = checkpoint['rrelm_W'].to(device)
    rrelm_b = checkpoint['rrelm_b'].to(device)
    rrelm_beta = checkpoint['rrelm_beta'].to(device)

    # 3. Load Test Data
    _, test_loader = get_dataloaders(root_dir='dataset', batch_size=32)
    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']

    all_preds = []
    all_targets = []

    print("\n--- Running Evaluation on Full Test Dataset ---")
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            
            # Extract features
            features = feature_extractor(inputs)  # [B, 384]
            
            # RRELM Forward
            H = F.relu(features @ rrelm_W + rrelm_b)  # [B, 4096]
            logits = H @ rrelm_beta                    # [B, 4]
            preds = torch.argmax(logits, dim=1)
            
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(labels.numpy())

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # 4. Print Classification Report
    print("\n" + "="*55)
    print("           FULL TEST DATASET CLASSIFICATION REPORT")
    print("="*55)
    report = classification_report(all_targets, all_preds, target_names=classes, digits=4)
    print(report)

    # 5. Plot & Save Confusion Matrix
    cm = confusion_matrix(all_targets, all_preds)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=classes, yticklabels=classes,
                cbar=True, annot_kws={"size": 14})
    
    plt.title("Brain Tumor MRI Classification - Confusion Matrix", fontsize=14, fontweight='bold')
    plt.xlabel("Predicted Class", fontsize=12, fontweight='bold')
    plt.ylabel("True Class", fontsize=12, fontweight='bold')
    plt.tight_layout()

    cm_filename = "confusion_matrix.png"
    plt.savefig(cm_filename, dpi=300)
    print(f"\nConfusion matrix saved successfully to '{cm_filename}'!")
    plt.close()

if __name__ == "__main__":
    evaluate_model()
