# 🧠 Brain Tumor MRI Classification with Hybrid PDSCNN-ViT & RRELM

[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg?style=flat&logo=pytorch)](https://pytorch.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-000000.svg?style=flat&logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance Deep Learning and Computer Vision framework for 4-class Brain Tumor MRI classification (`glioma`, `meningioma`, `notumor`, `pituitary`). The system integrates **Parallel Depthwise Separable Convolutional Neural Networks (PDSCNN)** with **Squeeze-and-Excitation (SE)** channel attention, **Vision Transformers (ViT)**, and **Regularized Ridge Extreme Learning Machines (RRELM)**, complemented by **Dual-Branch Visual Explainable AI (Grad-CAM & ViT Self-Attention Rollout)** and a clinical-grade Cyber-Radiology interactive web platform.

---

## 🌟 Key Highlights & Empirical Performance

* **5-Fold Stratified Cross-Validation:** **96.13% (±0.17%)** Mean Test Accuracy across all **13,994 patient MRI scans**.
* **High Multi-Class Precision & Recall (Test Set - 1,994 Scans):**
  * **Glioma:** 98.58% Precision | 83.40% Recall | F1: 0.9036
  * **Meningioma:** 92.37% Precision | 93.98% Recall | F1: 0.9317
  * **Healthy Control (No Tumor):** 89.78% Precision | 99.21% Recall | F1: 0.9426
  * **Pituitary:** 96.52% Precision | 99.58% Recall | F1: 0.9803
* **Dataset Scale:** **13,994 total MRI scans** consolidated across 5 curated multi-center Kaggle repositories:
  * **12,000 Training Scans** (3,000 per class — 100% class-balanced with CLAHE & Mixup augmentation)
  * **1,994 Independent Test Scans** (Multi-hospital benchmark evaluation)
* **Dual-Branch Visual Explainable AI (XAI):**
  * **PDSCNN Grad-CAM:** Multi-scale spatial gradient attribution highlighting focal tumor boundaries.
  * **ViT Self-Attention Rollout:** Global patch-level contextual dependency heatmaps.
  * **Morphological Cranial Masking:** Strips skull/border background noise for clinically accurate lesion localization.
* **Closed-Form Analytic Classifier (RRELM):** 8,192 hidden neurons initialized with Kaiming-scaled random projection weights and closed-form Ridge Regression ($C=0.05$).
* **Hardware Accelerated:** Native automatic dispatch for **Apple Silicon GPU (MPS)**, **NVIDIA GPU (CUDA)**, and multi-threaded CPU.
* **Interactive Cyber-Radiology Console:** Modern React + Vite dashboard featuring live MRI drag-and-drop, 1-click test gallery, side-by-side XAI comparison, and printable PDF clinical diagnostic reports.

---

## 🏗️ System Architecture & Workflow Pipeline

```
                              [ Input MRI Scan (124x124 RGB) ]
                                             │
                      [ CLAHE Preprocessing (L-channel, clipLimit=2.0, tileGrid=8x8) ]
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
       [ 4-Layer SE-PDSCNN Branch ]                   [ Vision Transformer (ViT) Branch ]
  (Stage 1: Stem Conv 3x3, 64-d)                 (Pad 128x128 -> Patch Embed 16x16 -> 64 tokens)
  (Stage 2: SE-Depthwise Sep Block 128-d)        (+ Learnable [CLS] Token + Positional Embedding)
  (Stage 3: SE-Depthwise Sep Block 256-d)        (4 Transformer Encoder Layers, 8 Attention Heads)
  (Stage 4: SE-Depthwise Sep Block 512-d)                       │
  (Adaptive Avg Pool + Linear -> 256-d)                         ▼
                      │                                 [ CLS Token Extraction (128-d) ]
                      ▼                                             │
             [ L2-Normalized (256-d) ]                     [ L2-Normalized (128-d) ]
                      └──────────────────────┬──────────────────────┘
                                             ▼
                           [ Feature Concatenation & L2 Norm (384-d) ]
                                             │
                                             ▼
                 [ Regularized Ridge Extreme Learning Machine (RRELM) ]
                 - Hidden Dimension: 8,192 Neurons (Kaiming Normal W, b)
                 - Analytical Ridge Output: β = (H^T H + C * I)^(-1) H^T Y  (C = 0.05)
                 - Temperature-Calibrated Softmax Probabilities (T = 0.02)
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
       [ 4-Class Diagnostic Prediction ]              [ Dual-Branch Explainable AI (XAI) ]
     (Glioma, Meningioma, No Tumor, Pituitary)       - Multi-Scale Grad-CAM (Conv3 + Conv4)
                                                     - ViT Attention Rollout Heatmap
                                                     - Cranial Foreground Masking
```

---

## 📊 Stratified 5-Fold Cross-Validation Benchmark

Evaluated across all **13,994 MRI scans** with 5 independent stratified folds:

| Fold | Train Scans | Test Scans | Train Accuracy | Test Accuracy | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Fold 1** | 11,195 | 2,799 | 96.15% | **96.18%** | 96.22% | 96.18% | 96.17% |
| **Fold 2** | 11,195 | 2,799 | 96.16% | **96.14%** | 96.17% | 96.14% | 96.13% |
| **Fold 3** | 11,195 | 2,799 | 96.15% | **96.21%** | 96.27% | 96.21% | 96.21% |
| **Fold 4** | 11,195 | 2,799 | 96.14% | **96.32%** | 96.35% | 96.32% | 96.32% |
| **Fold 5** | 11,196 | 2,798 | 96.23% | **95.82%** | 95.87% | 95.82% | 95.80% |
| **MEAN (± STD)** | — | — | **96.17% (±0.04%)** | **96.13% (±0.17%)** | **96.18%** | **96.13%** | **96.13%** |

---

## 🔬 Comparison with Base Paper

| Parameter / Feature | Base Paper (Scientific Reports, 2025) | **Our Proposed Architecture** |
| :--- | :--- | :--- |
| **Dataset Scale** | 3,264 – 7,023 scans (Single Kaggle source) | **13,994 scans (5 Multi-Center sources)** |
| **Feature Extraction Backbone** | PDSCNN only (256-d local features) | **Hybrid SE-PDSCNN (256-d) + ViT (128-d) = 384-d** |
| **Global Attention Mechanism** | None | **8-Head Multi-Layer Vision Transformer (ViT)** |
| **Classifier** | RRELM ($C=1.0$) | **RRELM (8,192 Neurons, $C=0.05$, Kaiming Scaling)** |
| **Cross-Validation Accuracy** | 99.22% (on smaller 7k dataset) | **96.13% (±0.17% on scaled 14k multi-center dataset)** |
| **Explainable AI (XAI)** | SHAP (Global tabular attribution) | **Dual-Branch Visual XAI (Grad-CAM + ViT Attention + Cranial Masking)** |
| **Web & Clinical Interface** | None / Static script | **Interactive Cyber-Radiology Console + PDF Reports** |

---

## 🛠️ Project Structure

```
├── dataset/                                   # 13,994 total scans (12,000 train / 1,994 test)
│   ├── train/                                 # 12,000 training scans (3,000 per class)
│   └── test/                                  # 1,994 independent benchmark scans
├── weights/
│   └── model.pth                              # Saved model checkpoint (~24.8 MB)
├── frontend/                                  # React + Vite Cyber-Radiology Dashboard
│   ├── src/                                   # React UI components, styling, charts
│   ├── dist/                                  # Production frontend build
│   ├── package.json                           # Frontend dependencies
│   └── vite.config.js                         # Vite build configuration
├── app.py                                     # Flask REST API & Web Server
├── model.py                                   # SE-PDSCNN, ViTBranch, HybridFeatureExtractor & RRELM
├── dataset_loader.py                          # CLAHE Preprocessing, Data Augmentation & DataLoader
├── train.py                                   # End-to-End Mixup training & GPU-accelerated pipeline
├── cross_validate.py                          # 5-Fold Stratified Cross-Validation script
├── gradcam.py                                 # Multi-scale Grad-CAM & ViT Attention Map generator
├── evaluate.py                                # Multi-split evaluation & confusion matrix generator
├── predict.py                                 # Single-image CLI prediction script
├── confusion_matrix.png                       # Test evaluation confusion matrix plot
└── kfold_cv_results.png                       # 5-Fold Cross-Validation accuracy bar chart
```

---

## 💻 Installation & Environment Setup

### 1. Prerequisites
- Python 3.9+ 
- Node.js 18+ (for frontend dashboard development)
- PyTorch with CUDA or Apple Silicon MPS support

### 2. Python Dependencies
Install required packages using pip:
```bash
pip install torch torchvision numpy opencv-python scikit-learn matplotlib flask requests
```

### 3. Frontend Dependencies (Optional, for building React UI)
```bash
cd frontend
npm install
npm run build
cd ..
```

---

## 🚀 Execution & Quick Start Guide

### 1. **Train Model on GPU / Apple Silicon**
Trains the SE-PDSCNN and ViT feature extractors with Mixup regularization, extracts 384-dim scale-invariant representations, performs hyperparameter grid search over Ridge parameter $C$, and saves checkpoint to `weights/model.pth`:
```bash
python3 train.py --epochs 60 --batch_size 64 --lr 0.001
```

### 2. **Run 5-Fold Stratified Cross-Validation**
Executes 5-fold cross-validation across all 13,994 MRI scans, prints fold-by-fold train/test metrics, and saves `kfold_cv_results.png`:
```bash
python3 cross_validate.py --folds 5
```

### 3. **Evaluate Model & Generate Confusion Matrix**
```bash
# Evaluate on full combined dataset (13,994 scans)
python3 evaluate.py --split full

# Evaluate on independent test benchmark (1,994 scans)
python3 evaluate.py --split test

# Evaluate all splits side-by-side
python3 evaluate.py --split all
```

### 4. **Single Image CLI Prediction with Explainable AI**
Run inference on any individual MRI image to display classification probabilities and save XAI visual overlays:
```bash
python3 predict.py --image dataset/test/glioma/Te-gl_224.jpg
```

### 5. **Launch Cyber-Radiology Web Dashboard**
Start the backend server:
```bash
python3 app.py
```
Open **http://127.0.0.1:5001** in your web browser.

---

## 🌐 API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/predict` | `POST` | Accepts multipart `file` image, returns class prediction, confidence, probability distribution, and base64-encoded Grad-CAM and ViT attention maps. |
| `/api/stats` | `GET` | Returns 5-fold cross-validation metrics, hardware device, and class performance stats. |
| `/api/training-report` | `GET` | Returns detailed training history, hyperparameter grid search, confusion matrix, and dataset credits. |
| `/api/sample/<cls_name>` | `GET` | Returns real-time inference on pre-loaded gallery test samples for `glioma`, `meningioma`, `notumor`, or `pituitary`. |

---

## 📜 Dataset Credits & Attributions

1. **[Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)** — Masoud Nickparvar (7,023 scans)
2. **[Brain Tumor Classification (MRI)](https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri)** — Sartaj Bhuvaji, Ankita Kadam et al. (3,264 scans)
3. **[Brain Tumor MRI Scans](https://www.kaggle.com/datasets/rm1000/brain-tumor-mri-scans)** — RM1000 Multi-Center Repository (2,400 scans)
4. **[Brain Tumors Dataset](https://www.kaggle.com/datasets/mohammadhossein77/brain-tumors-dataset)** — Mohammad Hossein (3,000 scans)
5. **[Brain Cancer MRI Dataset](https://www.kaggle.com/datasets/orvile/brain-cancer-mri-dataset)** — Orvile & Contributors (1,800 scans)
