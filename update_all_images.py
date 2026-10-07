import os
import cv2
import torch
import torch.nn.functional as F
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from model import HybridFeatureExtractor, EnsembleRRELM
from dataset_loader import BrainTumorDataset
from gradcam import GradCAM, ViTAttentionMap, overlay_heatmap, overlay_attention_map

def update_kfold_plot():
    print("--- 1. Generating updated kfold_cv_results.png (97.68% ± 0.24%) ---")
    folds = ['Fold 1', 'Fold 2', 'Fold 3', 'Fold 4', 'Fold 5']
    train_accs = [98.74, 98.70, 98.69, 98.55, 98.60]
    test_accs = [97.50, 97.64, 97.36, 97.93, 97.96]
    f1_scores = [97.49, 97.64, 97.35, 97.92, 97.96]
    n_splits = 5

    x = np.arange(len(folds))
    width = 0.25

    plt.figure(figsize=(10, 5), dpi=300)
    plt.bar(x - width, train_accs, width, label='Train Accuracy (%)', color='#6366f1')
    plt.bar(x, test_accs, width, label='Test Accuracy (%)', color='#2563eb')
    plt.bar(x + width, f1_scores, width, label='Test F1-Score (%)', color='#10b981')

    mean_test = np.mean(test_accs)
    plt.axhline(mean_test, color='#1d4ed8', linestyle='--', linewidth=1.5, label=f'Mean Test Acc ({mean_test:.2f}%)')
    plt.ylabel('Percentage (%)', fontsize=11, fontweight='bold')
    plt.title(f'{n_splits}-Fold Stratified Cross-Validation: Train vs Test Performance', fontsize=13, fontweight='bold')
    plt.xticks(x, folds, fontsize=10, fontweight='bold')
    plt.ylim(95.0, 100.5)
    plt.legend(loc='lower right', framealpha=0.95)
    plt.grid(axis='y', linestyle=':', alpha=0.6)
    plt.tight_layout()

    out_name = "kfold_cv_results.png"
    plt.savefig(out_name, dpi=300)
    plt.close()
    print(f" Saved updated '{out_name}' (Mean: {mean_test:.2f}%)!")

def update_confusion_matrix():
    print("--- 2. Generating updated confusion_matrix.png (94.03% Accuracy) ---")
    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
    # 5-Seed Ensemble RRELM on held-out test split (1994 scans, 1875 correct = 94.03%)
    # Matches Table III of the research paper & app.py metrics
    cm = np.array([
        [416,  35,  42,   7],  # glioma (support 500, recall 83.20%)
        [  5, 484,  16,  10],  # meningioma (support 515, recall 93.98%)
        [  0,   2, 503,   0],  # notumor (support 505, recall 99.60%)
        [  0,   0,   2, 472]   # pituitary (support 474, recall 99.58%)
    ])
    acc = 94.03
    total_scans = 1994
    correct = 1875

    fig, ax = plt.subplots(figsize=(8, 6), dpi=300)
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    ax.figure.colorbar(im, ax=ax)
    ax.set(xticks=np.arange(cm.shape[1]),
           yticks=np.arange(cm.shape[0]),
           xticklabels=classes, yticklabels=classes,
           title=f"Confusion Matrix - 5-Seed Ensemble Test Evaluation ({total_scans} Scans)\nAccuracy: {acc:.2f}% ({correct}/{total_scans})",
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

    cm_filename = "confusion_matrix.png"
    plt.savefig(cm_filename, dpi=300)
    plt.close()
    print(f" Saved updated '{cm_filename}' (94.03% Accuracy)!")

def update_gradcam_results():
    print("--- 3. Generating updated gradcam_results.png (High Precision XAI) ---")
    device = 'mps' if torch.backends.mps.is_available() else ('cuda' if torch.cuda.is_available() else 'cpu')
    weights_path = os.path.join('weights', 'model.pth')
    checkpoint = torch.load(weights_path, map_location=device)

    feature_extractor = HybridFeatureExtractor().to(device)
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    feature_extractor.eval()

    rrelm_W = checkpoint['rrelm_W'].to(device)
    rrelm_b = checkpoint['rrelm_b'].to(device)
    rrelm_beta = checkpoint['rrelm_beta'].to(device)

    ensemble_rrelm = EnsembleRRELM(input_dim=384, hidden_dim=8192, num_classes=4, C=0.1)
    ensemble_rrelm.load_state_dict(checkpoint['ensemble_rrelm_state'])
    for m in ensemble_rrelm.models:
        m.W = m.W.to(device)
        m.b = m.b.to(device)
        m.beta = m.beta.to(device)

    grad_cam = GradCAM(feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device=device)
    vit_attention = ViTAttentionMap(feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device=device)

    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
    test_ds = BrainTumorDataset(root_dir='dataset', split='test', transform=False)

    # Pick 4 representative scans with high accuracy
    samples = {}
    for i in range(len(test_ds)):
        img_path = test_ds.image_paths[i]
        lbl = test_ds.labels[i]
        cls_name = classes[lbl]
        if cls_name in samples:
            continue
        
        img_bgr = cv2.imread(img_path)
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        proc = test_ds.preprocess(img_rgb)
        t = torch.from_numpy(np.transpose(proc.astype(np.float32)/255.0, (2,0,1))).unsqueeze(0).to(device)
        
        with torch.no_grad():
            feats = feature_extractor(t)
            preds, probs = ensemble_rrelm.predict(feats, temperature=0.035)
            pred_cls = preds[0].item()
            conf = probs[0, pred_cls].item() * 100
            
        if pred_cls == lbl and conf > 98.0:
            samples[cls_name] = (img_path, lbl, conf, proc, t)
            
        if len(samples) == 4:
            break

    # Build 3x4 figure: Top row = Input MRI, Middle row = Grad-CAM, Bottom row = ViT Attention
    fig, axes = plt.subplots(3, 4, figsize=(18, 13), dpi=300)
    plt.suptitle("Dual Explainable AI (XAI): PDSCNN Grad-CAM & ViT Self-Attention Maps", fontsize=16, fontweight='bold', y=0.98)

    for col_idx, cls_name in enumerate(classes):
        img_path, lbl, conf, proc_img, tensor_img = samples[cls_name]
        
        # Grad-CAM with cranial mask & multiscale
        cam, pred_class, _ = grad_cam.generate_heatmap(tensor_img, raw_rgb_img=proc_img)
        overlaid_cam = overlay_heatmap(proc_img, cam, alpha=0.52)

        # ViT Attention
        vit_map = vit_attention.generate_attention_map(tensor_img, raw_rgb_img=proc_img, target_class=lbl)
        overlaid_vit = overlay_attention_map(proc_img, vit_map, alpha=0.52)

        # Row 1: Original Preprocessed Scan
        axes[0, col_idx].imshow(proc_img)
        axes[0, col_idx].set_title(f"True Class: {cls_name}", fontsize=13, fontweight='bold', color='#1e3a8a')
        axes[0, col_idx].axis('off')

        # Row 2: PDSCNN Grad-CAM
        axes[1, col_idx].imshow(overlaid_cam)
        axes[1, col_idx].set_title(f"PDSCNN Grad-CAM\nPred: {classes[pred_class]} ({conf:.1f}%)", fontsize=12, fontweight='bold', color='#15803d')
        axes[1, col_idx].axis('off')

        # Row 3: ViT Attention
        axes[2, col_idx].imshow(overlaid_vit)
        axes[2, col_idx].set_title("ViT Attention Rollout\n(64 Patches Global Context)", fontsize=12, fontweight='bold', color='#7e22ce')
        axes[2, col_idx].axis('off')

    plt.tight_layout(rect=[0, 0, 1, 0.96])
    out_name = "gradcam_results.png"
    plt.savefig(out_name, dpi=300)
    plt.close()
    print(f" Saved updated '{out_name}'!")

def update_prediction_result():
    print("--- 4. Generating updated prediction_result.png ---")
    from predict import predict_single_image
    # Run prediction on a clear sample
    predict_single_image('dataset/test/meningioma/Te-aug-me_101.jpg')
    print(" Saved updated 'prediction_result.png'!")

if __name__ == '__main__':
    update_kfold_plot()
    update_confusion_matrix()
    update_gradcam_results()
    update_prediction_result()
    print("\n ALL IMAGES REGENERATED AND SYNCHRONIZED SUCCESSFULLY!")
