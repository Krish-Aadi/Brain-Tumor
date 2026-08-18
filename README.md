# 🧠 Brain Tumor MRI Classification with Hybrid CNN-ViT & RRELM

A state-of-the-art Deep Learning framework for multi-class Brain Tumor MRI image classification (`glioma`, `meningioma`, `notumor`, `pituitary`) integrating **Parallel Depthwise Separable Convolutional Neural Networks (PDSCNN)**, **Vision Transformers (ViT)**, and **Regularized Ridge Extreme Learning Machines (RRELM)** with **Grad-CAM visual interpretability**.

---

## 🌟 Key Highlights & Performance

* **Overall Test Accuracy:** **90.47%** on **1,994 unseen test MRI scans** (1,804 / 1,994 correct).
* **Near-Perfect Healthy Scan Recall:** **99.41%** accuracy on non-tumor (`notumor`) images.
* **High Precision Across Tumor Categories:**
  * **Glioma:** 95.39% Precision
  * **Meningioma:** 92.86% Precision
  * **Pituitary:** 94.98% Precision | 95.78% Recall
* **Explainable AI (Grad-CAM):** Differentiable backpropagation to output heatmaps overlaying exact tumor regions.
* **Interactive Web Dashboard:** Modern Web UI for live MRI file drag-and-drop, 1-click test sample analysis, and side-by-side CLAHE MRI vs. Grad-CAM visualizer.

---

## 🏗️ System Architecture

```
[ Input MRI Scan (124x124) ] ──► [ CLAHE Enhancement & Preprocessing ]
                                              │
               ┌──────────────────────────────┴──────────────────────────────┐
               ▼                                                             ▼
  [ 4-Layer PDSCNN Branch ]                                     [ Vision Transformer (ViT) Branch ]
 (Depthwise Separable Feature Extractor)                        (Patch Embed 16x16 + Trans. Encoder)
               │                                                             │
               ▼ (256-dim features)                                          ▼ (128-dim features)
               └──────────────────────────────┬──────────────────────────────┘
                                              ▼
                             [ Hybrid Feature Fusion (384-dim) ]
                                              │
                                              ▼
                   [ Regularized Ridge Extreme Learning Machine (RRELM) ]
                                              │
                                              ▼
                       [ Class Prediction & Grad-CAM Heatmap Overlay ]
```

---

## 📊 Full Test Dataset Evaluation Report

Evaluating on **1,994 test images** across all 4 classes:

```
               precision    recall  f1-score   support

      glioma     0.9539    0.7860    0.8618       500
  meningioma     0.9286    0.8835    0.9055       515
     notumor     0.8176    0.9941    0.8972       505
   pituitary     0.9498    0.9578    0.9538       474

    accuracy                         0.9047      1994
   macro avg     0.9125    0.9053    0.9046      1994
weighted avg     0.9119    0.9047    0.9039      1994
```

---

## 🛠️ Project Structure

```
├── dataset/                    # Training and Testing image splits
├── weights/
│   └── model.pth               # Saved model weights checkpoint (~18.1 MB)
├── app.py                      # Flask Web Dashboard Backend Server
├── templates/
│   └── index.html              # Responsive Web Dashboard UI
├── model.py                    # PDSCNN, ViTBranch, HybridFeatureExtractor & RRELM
├── dataset_loader.py           # CLAHE Preprocessing, Data Augmentation & DataLoader
├── train.py                    # End-to-End Mixup training & RRELM Grid Search
├── gradcam.py                  # Grad-CAM heatmap generator & overlay visualizer
├── evaluate.py                 # Full test set evaluation & confusion matrix generator
├── predict.py                  # Single-image CLI prediction script
├── download_dataset.py         # Kaggle API primary dataset downloader
├── merge_datasets.py            # Dataset integration script
└── augment_dataset.py          # Class-balancing data augmentation script
```

---

## 🚀 Execution & Quick Start Guide

### 1. **Activate Environment & Dependencies**
```powershell
.\venv\Scripts\Activate.ps1
pip install torch torchvision numpy opencv-python matplotlib seaborn scikit-learn flask pillow
```

### 2. **Dataset Setup**
```powershell
python download_dataset.py
python merge_datasets.py
python augment_dataset.py
```

### 3. **Train Model**
Trains the hybrid feature extractor with Mixup data augmentation, extracts 384-dim features, computes analytical RRELM output weights, and saves `weights/model.pth`:
```powershell
python train.py
```

### 4. **Run Grad-CAM Explainability Visualizer**
Generates side-by-side heatmaps for test samples and saves `gradcam_results.png`:
```powershell
python gradcam.py
```

### 5. **Evaluate Model on Test Dataset**
Prints classification report and saves `confusion_matrix.png`:
```powershell
python evaluate.py
```

### 6. **Single Image Prediction**
```powershell
python predict.py --image dataset/test/pituitary/image.jpg
```

### 7. **Launch Interactive Web Dashboard**
```powershell
python app.py
```
Open **http://127.0.0.1:5000** in your browser to use the drag-and-drop Web interface!

---

## 📈 Visual Artifacts

* `gradcam_results.png`: Grad-CAM heatmaps showing tumor localization across classes.
* `confusion_matrix.png`: Confusion matrix heatmap evaluating 1,994 test images.
* `prediction_result.png`: Individual MRI prediction distribution bar chart and heatmap.
