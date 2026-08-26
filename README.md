# 🧠 Brain Tumor MRI Classification with Hybrid CNN-ViT & RRELM

A state-of-the-art Deep Learning framework for multi-class Brain Tumor MRI image classification (`glioma`, `meningioma`, `notumor`, `pituitary`) integrating **Parallel Depthwise Separable Convolutional Neural Networks (PDSCNN)**, **Vision Transformers (ViT)**, and **Regularized Ridge Extreme Learning Machines (RRELM)** with **Grad-CAM & ViT Self-Attention visual interpretability**.

---

## 🌟 Key Highlights & Performance

* **5-Fold Stratified Cross-Validation:** **98.05% (±0.16%)** Mean Accuracy across all **13,994 patient MRI scans**.
* **High Precision & Generalization:**
  * **Glioma:** 98.05% Precision | 97.93% Recall
  * **Meningioma:** 97.95% Precision | 97.93% Recall
  * **Healthy (No Tumor):** 98.26% Precision | 99.80% Recall
  * **Pituitary:** 99.24% Precision | 97.18% Recall
* **Dataset Scale:** **13,994 total MRI scans** integrated across 5 open-source Kaggle datasets:
  * **12,000 Training Scans** (3,000 per class — 100% Balanced with CLAHE & Mixup augmentation)
  * **1,994 Independent Test Scans** (Multi-hospital benchmark evaluation)
* **Hardware Acceleration:** Native PyTorch support for **Apple Silicon GPU (MPS)** and **NVIDIA GPU (CUDA)**.
* **Explainable AI (XAI):** Dual-branch visual heatmaps combining **PDSCNN Grad-CAM** (local lesion boundaries) and **ViT Self-Attention Maps** (global contextual dependencies).
* **Interactive Cyber-Radiology Console:** Modern Web Dashboard featuring live MRI drag-and-drop, 1-click test gallery, side-by-side inspection, and printable PDF diagnostic reports.

---

## 🏗️ System Architecture

```
[ Input MRI Scan (124x124) ] ──► [ CLAHE Enhancement (clipLimit=2.0, tileGrid=8x8) ]
                                              │
               ┌──────────────────────────────┴──────────────────────────────┐
               ▼                                                             ▼
  [ 4-Layer PDSCNN Branch ]                                     [ Vision Transformer (ViT) Branch ]
 (Depthwise Separable Feature Extractor)                        (Patch Embed 16x16 + 8-Head Encoder)
               │                                                             │
               ▼ (256-dim features)                                          ▼ (128-dim features)
               └──────────────────────────────┬──────────────────────────────┘
                                              ▼
                             [ Hybrid Feature Fusion (384-dim) ]
                                              │
                                              ▼
                   [ Regularized Ridge Extreme Learning Machine (RRELM) ]
                                (4,096 Hidden Neurons, C=500.0)
                                              │
                                              ▼
                       [ Class Prediction & Dual-Branch Heatmap Overlay ]
```

---

## 📊 Stratified 5-Fold Cross-Validation Performance

Evaluated across all **13,994 scans** with 5 independent folds:

```
Fold     | Train Scans | Test Scans | Train Acc   | Test Acc   | Precision  | Recall     | F1-Score  
-------------------------------------------------------------------------------------------------
Fold 1   | 11195       | 2799       |  98.54%     |  97.93%    |  97.93%    |  97.93%    |  97.93%
Fold 2   | 11195       | 2799       |  98.45%     |  97.93%    |  97.95%    |  97.93%    |  97.93%
Fold 3   | 11195       | 2799       |  98.41%     |  98.25%    |  98.26%    |  98.25%    |  98.25%
Fold 4   | 11195       | 2799       |  98.49%     |  98.25%    |  98.26%    |  98.25%    |  98.24%
Fold 5   | 11196       | 2798       |  98.57%     |  97.89%    |  97.89%    |  97.89%    |  97.89%
=================================================================================================
AVERAGE  |             |            |  98.49%     |  98.05%    |  98.06%    |  98.05%    |  98.05% (±0.16%)
=================================================================================================
```

---

## 🛠️ Project Structure

```
├── dataset/                    # 13,994 total scans (12,000 train / 1,994 test)
├── weights/
│   └── model.pth               # Saved model checkpoint (~18.1 MB)
├── app.py                      # Flask Cyber-Radiology Backend & Web API
├── templates/
│   └── index.html              # Cyber-Radiology Diagnostic Web Dashboard
├── cross_validate.py           # Stratified K-Fold Cross Validation script
├── model.py                    # PDSCNN, ViTBranch, HybridFeatureExtractor & RRELM
├── dataset_loader.py           # CLAHE Preprocessing, Data Augmentation & DataLoader
├── train.py                    # End-to-End Mixup training & GPU-accelerated pipeline
├── gradcam.py                  # Grad-CAM & ViT Self-Attention heatmap generator
├── evaluate.py                 # Multi-split evaluation & confusion matrix generator
├── predict.py                  # Single-image CLI prediction script
├── download_dataset.py         # Kaggle API primary dataset downloader
├── download_to_12k_kaggle.py   # Bulk Kaggle dataset downloader
└── find_and_remove_duplicates.py # Image hash deduplication tool
```

---

## 🚀 Execution & Quick Start Guide

### 1. **Train Model on GPU**
Trains the hybrid feature extractor with Mixup data augmentation, extracts 384-dim features, computes analytical RRELM output weights ($C=500.0$), and saves `weights/model.pth`:
```bash
python3 train.py
```

### 2. **Run 5-Fold Stratified Cross-Validation**
Generates fold-by-fold accuracy metrics and saves `kfold_cv_results.png`:
```bash
python3 cross_validate.py --folds 5
```

### 3. **Evaluate Model**
```bash
# Evaluate on full combined dataset (13,994 scans)
python3 evaluate.py --split full

# Or evaluate all splits side-by-side
python3 evaluate.py --split all
```

### 4. **Single Image CLI Prediction with Explainable AI**
```bash
python3 predict.py --image dataset/test/glioma/Te-gl_224.jpg
```

### 5. **Launch Interactive Web Dashboard**
```bash
python3 app.py
```
Open **http://127.0.0.1:5001** (or **http://127.0.0.1:5000**) in your browser.

---

## 📜 Dataset Credits & Attributions

1. **[Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)** — Masoud Nickparvar
2. **[Brain Tumor Classification (MRI)](https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri)** — Sartaj Bhuvaji, Ankita Kadam et al.
3. **[Brain Tumor MRI Scans](https://www.kaggle.com/datasets/rm1000/brain-tumor-mri-scans)** — RM1000
4. **[Brain Tumors Dataset](https://www.kaggle.com/datasets/mohammadhossein77/brain-tumors-dataset)** — Mohammad Hossein
5. **[Brain Cancer MRI Dataset](https://www.kaggle.com/datasets/orvile/brain-cancer-mri-dataset)** — Orvile & Contributors
