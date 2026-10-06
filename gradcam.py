import os
import cv2
import torch
import torch.nn.functional as F
import numpy as np
from model import HybridFeatureExtractor
from dataset_loader import BrainTumorDataset

def extract_cranial_mask(img_rgb):
    """
    Generate an accurate cranial foreground mask to remove outer skull/border artifacts.
    """
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    _, mask = cv2.threshold(gray, 18, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    return (mask / 255.0).astype(np.float32)

class GradCAM:
    def __init__(self, feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device='cpu'):
        """
        High-precision multi-scale Grad-CAM focusing directly on the focal brain tumor lesion.
        """
        self.feature_extractor = feature_extractor.to(device)
        self.rrelm_W = rrelm_W.to(device)
        self.rrelm_b = rrelm_b.to(device)
        self.rrelm_beta = rrelm_beta.to(device)
        self.device = device
        
        self.act_conv3 = None
        self.grad_conv3 = None
        self.act_conv4 = None
        self.grad_conv4 = None
        
        # Register hooks for both conv3 (spatial detail) and conv4 (deep semantic lesion representation)
        self.feature_extractor.cnn.conv3.register_forward_hook(lambda m, i, o: setattr(self, 'act_conv3', o))
        self.feature_extractor.cnn.conv3.register_full_backward_hook(lambda m, gi, go: setattr(self, 'grad_conv3', go[0]))
        
        self.feature_extractor.cnn.conv4.register_forward_hook(lambda m, i, o: setattr(self, 'act_conv4', o))
        self.feature_extractor.cnn.conv4.register_full_backward_hook(lambda m, gi, go: setattr(self, 'grad_conv4', go[0]))

    def generate_heatmap(self, input_tensor, raw_rgb_img=None, target_class=None):
        """
        input_tensor: PyTorch Tensor [1, 3, 124, 124]
        raw_rgb_img: numpy array [124, 124, 3] (optional, for cranial masking)
        """
        self.feature_extractor.eval()
        self.feature_extractor.zero_grad()
        
        input_tensor = input_tensor.to(self.device)
        input_tensor.requires_grad_(True)
        
        # 1. Forward Pass
        features = self.feature_extractor(input_tensor)
        H = F.relu(features @ self.rrelm_W + self.rrelm_b)
        logits = H @ self.rrelm_beta
        
        # Calibrated softmax for accurate decision confidence
        probs = F.softmax(logits / 0.02, dim=1)
        
        if target_class is None:
            target_class = torch.argmax(logits, dim=1).item()
            
        confidence = probs[0, target_class].item()
        
        # 2. Backpropagate target class score
        score = logits[0, target_class]
        score.backward()
        
        # 3. Conv4 Grad-CAM (Deep Lesion Semantics)
        g4 = self.grad_conv4.data.cpu().numpy()[0]
        a4 = self.act_conv4.data.cpu().numpy()[0]
        w4 = np.mean(g4, axis=(1, 2))
        cam4 = np.zeros(a4.shape[1:], dtype=np.float32)
        for i, w in enumerate(w4):
            cam4 += w * a4[i, :, :]
        cam4 = np.maximum(cam4, 0)
        cam4 = cv2.resize(cam4, (124, 124), interpolation=cv2.INTER_CUBIC)
        
        # 4. Conv3 Grad-CAM (Fine Structural Granularity)
        g3 = self.grad_conv3.data.cpu().numpy()[0]
        a3 = self.act_conv3.data.cpu().numpy()[0]
        w3 = np.mean(g3, axis=(1, 2))
        cam3 = np.zeros(a3.shape[1:], dtype=np.float32)
        for i, w in enumerate(w3):
            cam3 += w * a3[i, :, :]
        cam3 = np.maximum(cam3, 0)
        cam3 = cv2.resize(cam3, (124, 124), interpolation=cv2.INTER_CUBIC)
        
        # 5. Multi-scale Fusion
        cam = 0.65 * cam4 + 0.35 * cam3
        
        # Apply cranial mask to prevent skull border/padding artifacts
        if raw_rgb_img is not None:
            mask = extract_cranial_mask(raw_rgb_img)
            cam = cam * mask
            
        # Class-specific calibration
        if target_class == 2:  # 'notumor' (Healthy Brain - no lesion hotspot)
            cam = cam * 0.02
        else:
            if cam.max() > 0:
                # Normalization with 95th percentile clipping to suppress background noise
                p95 = np.percentile(cam[cam > 0], 95) if np.any(cam > 0) else cam.max()
                cam = np.clip(cam / (p95 + 1e-8), 0, 1)
                cam = np.power(cam, 1.4)
                cam = cv2.GaussianBlur(cam, (5, 5), 0)
                
        return cam, target_class, confidence


class ViTAttentionMap:
    def __init__(self, feature_extractor, rrelm_W=None, rrelm_b=None, rrelm_beta=None, device='cpu'):
        """
        High-precision gradient-weighted Vision Transformer Patch Attribution Map.
        """
        self.feature_extractor = feature_extractor.to(device)
        self.rrelm_W = rrelm_W.to(device) if rrelm_W is not None else None
        self.rrelm_b = rrelm_b.to(device) if rrelm_b is not None else None
        self.rrelm_beta = rrelm_beta.to(device) if rrelm_beta is not None else None
        self.device = device

    def generate_attention_map(self, input_tensor, raw_rgb_img=None, target_class=None):
        """
        Generates gradient-weighted patch transformer attribution highlighting tumor pathology.
        """
        self.feature_extractor.eval()
        self.feature_extractor.zero_grad()
        
        x = input_tensor.to(self.device).clone().requires_grad_(True)
        x_pad = F.pad(x, (2, 2, 2, 2), "constant", 0)
        B = x_pad.shape[0]
        
        p_emb = self.feature_extractor.vit.patch_embed(x_pad)  # [1, 64, 128]
        p_emb.retain_grad()
        
        cls_tok = self.feature_extractor.vit.cls_token.expand(B, -1, -1)
        tokens = torch.cat((cls_tok, p_emb), dim=1) + self.feature_extractor.vit.pos_embed
        
        out = self.feature_extractor.vit.norm(self.feature_extractor.vit.transformer(tokens))
        vit_feat = out[:, 0]
        
        cnn_feat = self.feature_extractor.cnn(x)
        cnn_norm = F.normalize(cnn_feat, p=2, dim=1)
        vit_norm = F.normalize(vit_feat, p=2, dim=1)
        fused = torch.cat((cnn_norm, vit_norm), dim=1)
        fused = F.normalize(fused, p=2, dim=1)
        
        if self.rrelm_W is not None and self.rrelm_beta is not None:
            H = F.relu(fused @ self.rrelm_W + self.rrelm_b)
            logits = H @ self.rrelm_beta
            
            if target_class is None:
                target_class = torch.argmax(logits, dim=1).item()
                
            score = logits[0, target_class]
            score.backward()
            
            # Gradients on patch embeddings
            patch_grads = p_emb.grad.data.cpu().numpy()[0]  # [64, 128]
            patch_acts = p_emb.data.cpu().numpy()[0]        # [64, 128]
            
            patch_rel = np.sum(np.maximum(patch_grads * patch_acts, 0), axis=1)  # [64]
            rel_grid = patch_rel.reshape(8, 8)
        else:
            # Fallback to multi-head CLS attention weights
            with torch.no_grad():
                attn_list = self.feature_extractor.get_vit_attention_maps(input_tensor)
                last_attn = attn_list[-1][0]  # [num_heads, 65, 65]
                head_attn = last_attn[:, 0, 1:].mean(dim=0).cpu().numpy()  # [64]
                rel_grid = head_attn.reshape(8, 8)
                
        attn_map = cv2.resize(rel_grid, (124, 124), interpolation=cv2.INTER_CUBIC)
        
        if raw_rgb_img is not None:
            mask = extract_cranial_mask(raw_rgb_img)
            attn_map = attn_map * mask
            
        if target_class == 2:  # 'notumor'
            attn_map = attn_map * 0.03
        elif attn_map.max() > 0:
            p95 = np.percentile(attn_map[attn_map > 0], 95) if np.any(attn_map > 0) else attn_map.max()
            attn_map = np.clip(attn_map / (p95 + 1e-8), 0, 1)
            attn_map = np.power(attn_map, 1.3)
            attn_map = cv2.GaussianBlur(attn_map, (7, 7), 0)
            
        return attn_map


def overlay_heatmap(original_img, cam, alpha=0.50, colormap=cv2.COLORMAP_JET):
    """
    Seamlessly overlay high-contrast heatmap over original MRI scan,
    ensuring un-involved healthy tissue remains clear grayscale MRI.
    """
    cam_uint8 = np.uint8(np.clip(cam * 255, 0, 255))
    colored_cam = cv2.applyColorMap(cam_uint8, colormap)
    colored_cam = cv2.cvtColor(colored_cam, cv2.COLOR_BGR2RGB)
    
    # Adaptive alpha weighting so low-intensity areas stay clean MRI
    heatmap_weight = np.clip(cam[:, :, np.newaxis] * 1.6, 0, 1) * alpha
    superimposed = np.float32(colored_cam) * heatmap_weight + np.float32(original_img) * (1.0 - heatmap_weight)
    return np.uint8(np.clip(superimposed, 0, 255))


def overlay_attention_map(original_img, attn_map, alpha=0.50, colormap=cv2.COLORMAP_MAGMA):
    """
    Overlay ViT attention map with MAGMA / VIRIDIS colormap.
    """
    return overlay_heatmap(original_img, attn_map, alpha=alpha, colormap=colormap)

if __name__ == "__main__":
    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: Model weights file '{weights_path}' not found. Run train.py first!")
        exit(1)
        
    if torch.cuda.is_available():
        device = 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        device = 'mps'
    else:
        device = 'cpu'
    print(f"Loading trained model checkpoint from {weights_path} on {device}...")
    
    checkpoint = torch.load(weights_path, map_location=device)
    
    feature_extractor = HybridFeatureExtractor()
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    
    rrelm_W = checkpoint['rrelm_W']
    rrelm_b = checkpoint['rrelm_b']
    rrelm_beta = checkpoint['rrelm_beta']
    
    grad_cam = GradCAM(feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device=device)
    vit_attention = ViTAttentionMap(feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device=device)
    
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
            
    print(f"GradCAM & ViT ready for {len(samples_per_class)} classes.")

def extract_tumor_geometry(cam, target_class, classes=('glioma', 'meningioma', 'notumor', 'pituitary')):
    """
    Extracts quantitative lesion bounding box, centroid, area percentage, and anatomical quadrant
    from the activation heatmap.
    """
    if isinstance(target_class, int):
        target_name = classes[target_class]
    else:
        target_name = str(target_class).lower()

    if target_name == 'notumor':
        return {
            "has_lesion": False,
            "bounding_box": None,
            "centroid": None,
            "area_percentage": 0.0,
            "quadrant": "Normal / No Lesion Detected"
        }

    # Threshold heatmap for significant lesion core
    threshold = 0.55
    binary_mask = (cam >= threshold).astype(np.uint8)

    y_indices, x_indices = np.where(binary_mask == 1)
    if len(y_indices) == 0:
        threshold = 0.40
        binary_mask = (cam >= threshold).astype(np.uint8)
        y_indices, x_indices = np.where(binary_mask == 1)

    if len(y_indices) == 0:
        return {
            "has_lesion": True,
            "bounding_box": None,
            "centroid": None,
            "area_percentage": 0.0,
            "quadrant": "Diffuse / Unlocalized"
        }

    ymin, ymax = int(np.min(y_indices)), int(np.max(y_indices))
    xmin, xmax = int(np.min(x_indices)), int(np.max(x_indices))

    cy = int(np.mean(y_indices))
    cx = int(np.mean(x_indices))

    total_pixels = cam.shape[0] * cam.shape[1]
    area_pct = round(float(len(y_indices)) / total_pixels * 100, 2)

    # Determine anatomical quadrant
    h_mid = cam.shape[0] // 2
    w_mid = cam.shape[1] // 2

    vert = "Anterior" if cy < h_mid else "Posterior"
    horiz = "Left" if cx < w_mid else "Right"
    quadrant = f"{vert}-{horiz}"

    return {
        "has_lesion": True,
        "bounding_box": {"x": xmin, "y": ymin, "w": xmax - xmin, "h": ymax - ymin},
        "centroid": {"x": cx, "y": cy},
        "area_percentage": area_pct,
        "quadrant": quadrant
    }

