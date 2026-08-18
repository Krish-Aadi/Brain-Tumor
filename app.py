import os
import io
import base64
import cv2
import torch
import torch.nn.functional as F
import numpy as np
from flask import Flask, render_template, request, jsonify

from model import HybridFeatureExtractor
from dataset_loader import BrainTumorDataset
from gradcam import GradCAM, overlay_heatmap

app = Flask(__name__)

# Global variables for model and data helper
device = 'cuda' if torch.cuda.is_available() else 'cpu'
feature_extractor = None
rrelm_W = None
rrelm_b = None
rrelm_beta = None
grad_cam = None
dataset_helper = None
classes = ['glioma', 'meningioma', 'notumor', 'pituitary']

def load_model_and_weights():
    global feature_extractor, rrelm_W, rrelm_b, rrelm_beta, grad_cam, dataset_helper
    weights_path = os.path.join('weights', 'model.pth')
    if not os.path.exists(weights_path):
        print(f"Error: Weights file '{weights_path}' not found!")
        return False
        
    print(f"Loading weights from {weights_path} onto {device}...")
    checkpoint = torch.load(weights_path, map_location=device)
    
    feature_extractor = HybridFeatureExtractor().to(device)
    feature_extractor.load_state_dict(checkpoint['feature_extractor_state_dict'])
    feature_extractor.eval()
    
    rrelm_W = checkpoint['rrelm_W'].to(device)
    rrelm_b = checkpoint['rrelm_b'].to(device)
    rrelm_beta = checkpoint['rrelm_beta'].to(device)
    
    grad_cam = GradCAM(feature_extractor, rrelm_W, rrelm_b, rrelm_beta, device=device)
    dataset_helper = BrainTumorDataset(root_dir='dataset', split='test', transform=False)
    print("Model and weights successfully loaded!")
    return True

def numpy_to_base64(img_rgb):
    """Convert RGB numpy array to base64 data URL"""
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.png', img_bgr)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/png;base64,{b64_str}"

def process_and_predict(raw_img_bgr):
    raw_img_rgb = cv2.cvtColor(raw_img_bgr, cv2.COLOR_BGR2RGB)
    processed_img = dataset_helper.preprocess(raw_img_rgb)
    
    # Convert to Tensor [1, 3, 124, 124]
    tensor_img = processed_img.astype(np.float32) / 255.0
    tensor_img = np.transpose(tensor_img, (2, 0, 1))
    tensor_img = torch.from_numpy(tensor_img).unsqueeze(0).to(device)
    
    # Generate Grad-CAM Heatmap
    cam, pred_class, conf = grad_cam.generate_heatmap(tensor_img)
    overlaid_img = overlay_heatmap(processed_img, cam, alpha=0.45)
    
    # Compute full probabilities
    with torch.no_grad():
        feats = feature_extractor(tensor_img)
        H = F.relu(feats @ rrelm_W + rrelm_b)
        logits = H @ rrelm_beta
        probs = F.softmax(logits, dim=1).cpu().numpy()[0]
        
    probs_dict = {classes[i]: float(probs[i] * 100) for i in range(4)}
    
    orig_b64 = numpy_to_base64(processed_img)
    gradcam_b64 = numpy_to_base64(overlaid_img)
    
    return {
        "success": True,
        "predicted_class": classes[pred_class],
        "confidence": float(conf * 100),
        "probabilities": probs_dict,
        "original_image": orig_b64,
        "gradcam_image": gradcam_b64
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "Empty filename"}), 400
        
    in_memory_file = io.BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    raw_img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    
    if raw_img is None:
        return jsonify({"success": False, "error": "Invalid image file"}), 400
        
    result = process_and_predict(raw_img)
    return jsonify(result)

@app.route('/api/sample/<cls_name>', methods=['GET'])
def get_sample(cls_name):
    if cls_name not in classes:
        return jsonify({"success": False, "error": "Invalid class"}), 400
        
    cls_dir = os.path.join('dataset', 'test', cls_name)
    if not os.path.exists(cls_dir):
        return jsonify({"success": False, "error": "Sample directory not found"}), 400
        
    sample_files = os.listdir(cls_dir)
    if not sample_files:
        return jsonify({"success": False, "error": "No samples available"}), 400
        
    img_path = os.path.join(cls_dir, sample_files[0])
    raw_img = cv2.imread(img_path)
    
    result = process_and_predict(raw_img)
    result["sample_class"] = cls_name
    return jsonify(result)

if __name__ == '__main__':
    loaded = load_model_and_weights()
    if not loaded:
        print("Failed to initialize backend. Exiting...")
    else:
        print("\n Starting Brain Tumor Classification Web Dashboard on http://127.0.0.1:5000")
        app.run(host='127.0.0.1', port=5000, debug=False)
