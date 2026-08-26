import argparse
import os
import cv2
import torch
import torch.nn.functional as F
import numpy as np
import matplotlib.pyplot as plt

from model import HybridFeatureExtractor
from dataset_loader import BrainTumorDataset
from gradcam import GradCAM, ViTAttentionMap, overlay_heatmap, overlay_attention_map

def get_default_device():
    if torch.cuda.is_available():
        return 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        return 'mps'
    return 'cpu'

def predict_single_image(image_path, device=None):
    if not os.path.exists(image_path):
        print(f"Error: Image path '{image_path}' does not exist.")
        return

    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: Model weights file '{weights_path}' not found. Run train.py first!")
        return

    if device is None:
        device = get_default_device()
    checkpoint = torch.load(weights_path, map_location=device)

    # 1. Load Feature Extractor
    feature_extractor = HybridFeatureExtractor().to(device)
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])

    # 2. Load RRELM Weights
    rrelm_W = checkpoint['rrelm_W']
    rrelm_b = checkpoint['rrelm_b']
    rrelm_beta = checkpoint['rrelm_beta']

    # 3. Read and Preprocess Image
    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
    dataset_helper = BrainTumorDataset(root_dir='dataset', split='test', transform=False)

    raw_img = cv2.imread(image_path)
    if raw_img is None:
        print(f"Error: Unable to load image from '{image_path}'. Ensure valid image format.")
        return

    raw_img_rgb = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
    processed_img = dataset_helper.preprocess(raw_img_rgb)

    # Convert to Tensor [1, 3, 124, 124]
    tensor_img = processed_img.astype(np.float32) / 255.0
    tensor_img = np.transpose(tensor_img, (2, 0, 1))
    tensor_img = torch.from_numpy(tensor_img).unsqueeze(0)

    # 4. Run Grad-CAM & Prediction
    grad_cam = GradCAM(feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device=device)
    cam, pred_class, confidence = grad_cam.generate_heatmap(tensor_img)
    predicted_label = classes[pred_class]

    # 5. Run ViT Attention Map
    vit_attention = ViTAttentionMap(feature_extractor, device=device)
    vit_map = vit_attention.generate_attention_map(tensor_img)

    # Get calibrated probabilities for all classes
    with torch.no_grad():
        feats = feature_extractor(tensor_img.to(device))
        H = F.relu(feats @ rrelm_W.to(device) + rrelm_b.to(device))
        logits = H @ rrelm_beta.to(device)
        probs = F.softmax(logits / 0.15, dim=1).cpu().numpy()[0]
        confidence = probs[pred_class]

    # Superimpose heatmaps
    overlaid_cam = overlay_heatmap(processed_img, cam, alpha=0.45)
    overlaid_vit = overlay_attention_map(processed_img, vit_map, alpha=0.45)

    # Print Results
    print("\n" + "="*45)
    print("        BRAIN TUMOR PREDICTION RESULT")
    print("="*45)
    print(f"Image File   : {image_path}")
    print(f"Prediction   : {predicted_label.upper()}")
    print(f"Confidence   : {confidence * 100:.2f}%\n")
    print("Class Probabilities:")
    for cls_name, prob in zip(classes, probs):
        bar = "#" * int(prob * 20)
        print(f"  - {cls_name:<12}: {prob*100:5.2f}% {bar}")
    print("="*45)

    # Plot Visualizing Image, Grad-CAM, ViT Attention & Probabilities
    fig, axes = plt.subplots(1, 4, figsize=(20, 5))

    # Preprocessed MRI
    axes[0].imshow(processed_img)
    axes[0].set_title("Input MRI (CLAHE Enhanced)", fontsize=11, fontweight='bold')
    axes[0].axis('off')

    # Grad-CAM Overlay
    axes[1].imshow(overlaid_cam)
    axes[1].set_title(f"PDSCNN Grad-CAM\n{predicted_label.upper()} ({confidence*100:.1f}%)", 
                       fontsize=11, fontweight='bold', color='green')
    axes[1].axis('off')

    # ViT Attention Overlay
    axes[2].imshow(overlaid_vit)
    axes[2].set_title(f"ViT Attention Map\n(64 Patches Global Context)", 
                       fontsize=11, fontweight='bold', color='purple')
    axes[2].axis('off')

    # Class Probabilities Bar Chart
    colors = ['gray', 'gray', 'gray', 'gray']
    colors[pred_class] = '#2ca02c'
    y_pos = np.arange(len(classes))
    axes[3].barh(y_pos, probs * 100, color=colors, edgecolor='black')
    axes[3].set_yticks(y_pos)
    axes[3].set_yticklabels(classes, fontsize=10, fontweight='bold')
    axes[3].invert_yaxis()  # top-down
    axes[3].set_xlabel('Probability (%)', fontsize=10, fontweight='bold')
    axes[3].set_title('Prediction Distribution', fontsize=11, fontweight='bold')

    plt.tight_layout()
    output_path = "prediction_result.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"\nPrediction plot saved successfully to '{output_path}'!")
    plt.show()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict Brain Tumor from MRI Image")
    parser.add_argument("--image", type=str, help="Path to input MRI image file")
    args = parser.parse_args()

    if args.image:
        predict_single_image(args.image)
    else:
        # Default test sample fallback if no image path provided
        default_path = os.path.join('dataset', 'test', 'glioma', os.listdir(os.path.join('dataset', 'test', 'glioma'))[0])
        print(f"No --image argument specified. Using default sample: {default_path}")
        predict_single_image(default_path)
