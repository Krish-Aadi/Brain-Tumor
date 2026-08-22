import os
import cv2
import torch
import torch.nn.functional as F
import numpy as np
import matplotlib.pyplot as plt

from model import HybridFeatureExtractor
from dataset_loader import BrainTumorDataset

class GradCAM:
    def __init__(self, feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device='cpu'):
        """
        feature_extractor: Trained HybridFeatureExtractor model instance
        rrelm_W, rrelm_b, rrelm_beta: Tensors for RRELM classification layer
        """
        self.feature_extractor = feature_extractor.to(device)
        self.rrelm_W = rrelm_W.to(device)
        self.rrelm_b = rrelm_b.to(device)
        self.rrelm_beta = rrelm_beta.to(device)
        self.device = device
        
        self.gradients = None
        self.activations = None
        
        # Target layer for Grad-CAM is conv3 in PDSCNN
        target_layer = self.feature_extractor.cnn.conv3
        target_layer.register_forward_hook(self.save_activation)
        target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate_heatmap(self, input_tensor, target_class=None):
        """
        input_tensor: PyTorch Tensor [1, 3, 124, 124]
        target_class: int (0 to 3), if None takes predicted class
        """
        self.feature_extractor.eval()
        self.feature_extractor.zero_grad()
        
        input_tensor = input_tensor.to(self.device)
        input_tensor.requires_grad_(True)
        
        # 1. Forward Pass through Hybrid Feature Extractor
        features = self.feature_extractor(input_tensor)  # [1, 384]
        
        # 2. Differentiable RRELM Forward Pass
        H = F.relu(features @ self.rrelm_W + self.rrelm_b)  # [1, 4096]
        logits = H @ self.rrelm_beta                         # [1, 4]
        probs = F.softmax(logits, dim=1)
        
        if target_class is None:
            target_class = torch.argmax(probs, dim=1).item()
            
        confidence = probs[0, target_class].item()
        
        # 3. Backpropagate score for target class
        score = logits[0, target_class]
        score.backward()
        
        # 4. Extract Gradients & Activations
        gradients = self.gradients.data.cpu().numpy()[0]     # [C, H, W]
        activations = self.activations.data.cpu().numpy()[0] # [C, H, W]
        
        # 5. Compute global average pooling of gradients as weights
        weights = np.mean(gradients, axis=(1, 2))  # [C]
        
        # 6. Weighted combination of activation maps
        cam = np.zeros(activations.shape[1:], dtype=np.float32)  # [H, W]
        for i, w in enumerate(weights):
            cam += w * activations[i, :, :]
            
        # Apply ReLU to keep positive influence only
        cam = np.maximum(cam, 0)
        
        # Resize CAM to input image size (124, 124)
        cam = cv2.resize(cam, (124, 124))
        
        # Normalize between 0 and 1
        if cam.max() != 0:
            cam = cam / cam.max()
            
        return cam, target_class, confidence

def overlay_heatmap(original_img, cam, alpha=0.4):
    """
    original_img: numpy array [124, 124, 3] in RGB format (uint8 0-255)
    cam: numpy array [124, 124] float 0-1
    """
    # Convert heatmap to RGB using JET colormap
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    
    # Overlay on original image
    superimposed_img = np.float32(heatmap) * alpha + np.float32(original_img) * (1 - alpha)
    superimposed_img = np.uint8(np.clip(superimposed_img, 0, 255))
    
    return superimposed_img

class ViTAttentionMap:
    def __init__(self, feature_extractor, device='cpu'):
        """
        feature_extractor: Trained HybridFeatureExtractor model instance
        """
        self.feature_extractor = feature_extractor.to(device)
        self.device = device

    def generate_attention_map(self, input_tensor, method='rollout'):
        """
        input_tensor: PyTorch Tensor [1, 3, 124, 124]
        method: 'rollout' (Attention Rollout across layers) or 'last_layer'
        Returns: 2D numpy array [124, 124] normalized in range [0, 1]
        """
        self.feature_extractor.eval()
        with torch.no_grad():
            tensor = input_tensor.to(self.device)
            attn_weights_list = self.feature_extractor.get_vit_attention_maps(tensor)
            
            num_tokens = attn_weights_list[0].shape[-1]  # 65
            if method == 'rollout':
                rollout = torch.eye(num_tokens, device=self.device)
                for layer_attn in attn_weights_list:  # [1, num_heads, 65, 65]
                    attn_heads_mean = layer_attn[0].mean(dim=0)  # [65, 65]
                    attn_heads_mean = 0.5 * attn_heads_mean + 0.5 * torch.eye(num_tokens, device=self.device)
                    attn_heads_mean = attn_heads_mean / attn_heads_mean.sum(dim=-1, keepdim=True)
                    rollout = torch.matmul(attn_heads_mean, rollout)
                    
                cls_attn = rollout[0, 1:]  # [64] patches
            else:
                last_attn = attn_weights_list[-1][0].mean(dim=0)  # [65, 65]
                cls_attn = last_attn[0, 1:]  # [64] patches

            # Reshape 64 patches into 8x8 spatial grid
            attn_grid = cls_attn.reshape(8, 8).cpu().numpy()
            
            # Upsample / bicubic interpolate to full 124x124 resolution
            attn_map = cv2.resize(attn_grid, (124, 124), interpolation=cv2.INTER_CUBIC)
            attn_map = np.maximum(attn_map, 0)
            
            # Normalize between 0 and 1
            if attn_map.max() > attn_map.min():
                attn_map = (attn_map - attn_map.min()) / (attn_map.max() - attn_map.min())
            else:
                attn_map = np.zeros_like(attn_map)
                
            return attn_map

def overlay_attention_map(original_img, attn_map, alpha=0.45, colormap=cv2.COLORMAP_MAGMA):
    """
    original_img: numpy array [124, 124, 3] in RGB format (uint8 0-255)
    attn_map: numpy array [124, 124] float 0-1
    """
    heatmap = cv2.applyColorMap(np.uint8(255 * attn_map), colormap)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    
    superimposed_img = np.float32(heatmap) * alpha + np.float32(original_img) * (1 - alpha)
    superimposed_img = np.uint8(np.clip(superimposed_img, 0, 255))
    return superimposed_img

if __name__ == "__main__":
    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: Model weights file '{weights_path}' not found. Run train.py first!")
        exit(1)
        
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Loading trained model checkpoint from {weights_path} on {device}...")
    
    checkpoint = torch.load(weights_path, map_location=device)
    
    feature_extractor = HybridFeatureExtractor()
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    
    rrelm_W = checkpoint['rrelm_W']
    rrelm_b = checkpoint['rrelm_b']
    rrelm_beta = checkpoint['rrelm_beta']
    
    grad_cam = GradCAM(feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device=device)
    vit_attention = ViTAttentionMap(feature_extractor, device=device)
    
    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
    test_dataset = BrainTumorDataset(root_dir='dataset', split='test', transform=False)
    
    # Select 1 sample image per class from the test set
    samples_per_class = {}
    for i in range(len(test_dataset)):
        img_path = test_dataset.image_paths[i]
        label_idx = test_dataset.labels[i]
        cls_name = classes[label_idx]
        if cls_name not in samples_per_class:
            samples_per_class[cls_name] = (img_path, label_idx)
        if len(samples_per_class) == 4:
            break
            
    print("\n--- Generating Dual XAI (Grad-CAM & ViT Attention) Visualizations for Test Samples ---")
    fig, axes = plt.subplots(3, 4, figsize=(16, 12))
    
    for idx, cls_name in enumerate(classes):
        img_path, true_label = samples_per_class[cls_name]
        
        # Load and preprocess raw image
        raw_img = cv2.imread(img_path)
        raw_img_rgb = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
        processed_img = test_dataset.preprocess(raw_img_rgb)
        
        # Convert to tensor [1, 3, 124, 124]
        tensor_img = processed_img.astype(np.float32) / 255.0
        tensor_img = np.transpose(tensor_img, (2, 0, 1))
        tensor_img = torch.from_numpy(tensor_img).unsqueeze(0)
        
        # Generate Grad-CAM heatmap (CNN branch)
        cam, pred_class, conf = grad_cam.generate_heatmap(tensor_img)
        pred_label_name = classes[pred_class]
        overlaid_cam = overlay_heatmap(processed_img, cam, alpha=0.45)
        
        # Generate ViT Attention map (Transformer branch)
        attn_map = vit_attention.generate_attention_map(tensor_img)
        overlaid_attn = overlay_attention_map(processed_img, attn_map, alpha=0.45)
        
        # Row 1: Original Preprocessed MRI
        axes[0, idx].imshow(processed_img)
        axes[0, idx].set_title(f"True Class: {cls_name}", fontsize=12, fontweight='bold', color='navy')
        axes[0, idx].axis('off')
        
        # Row 2: CNN Grad-CAM Heatmap Overlay
        axes[1, idx].imshow(overlaid_cam)
        color = 'green' if pred_class == true_label else 'red'
        axes[1, idx].set_title(f"PDSCNN Grad-CAM\nPred: {pred_label_name} ({conf*100:.1f}%)", fontsize=11, fontweight='bold', color=color)
        axes[1, idx].axis('off')
        
        # Row 3: ViT Self-Attention Map Overlay
        axes[2, idx].imshow(overlaid_attn)
        axes[2, idx].set_title(f"ViT Attention Rollout\n(64 Patches Global Context)", fontsize=11, fontweight='bold', color='purple')
        axes[2, idx].axis('off')
        
    plt.suptitle("Dual Explainable AI (XAI): PDSCNN Grad-CAM & ViT Self-Attention Maps", fontsize=16, fontweight='bold', y=0.98)
    plt.tight_layout()
    
    output_filename = "gradcam_results.png"
    plt.savefig(output_filename, bbox_inches='tight', dpi=300)
    print(f"Dual XAI visual result saved successfully to '{output_filename}'!")
    plt.show()
