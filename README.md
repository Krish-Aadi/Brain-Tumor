# 🧠 Brain Tumor MRI Classification with Hybrid CNN-ViT & 5-Seed Ensemble RRELM

A state-of-the-art Deep Learning framework for multi-class Brain Tumor MRI image classification (`glioma`, `meningioma`, `notumor`, `pituitary`) integrating **Parallel Depthwise Separable Convolutional Neural Networks (PDSCNN)**, **Vision Transformers (ViT)**, and **5-Seed Ensemble Regularized Ridge Extreme Learning Machines (RRELM)** with **Grad-CAM & ViT Self-Attention visual interpretability**.

---

## 🌟 Key Highlights & Performance

* **5-Fold Stratified Cross-Validation:** **97.68% (±0.24%)** Mean Accuracy across all **13,994 patient MRI scans**.
* **High Precision & Generalization:**
  * **Glioma:** 98.81% Precision | 83.20% Recall
  * **Meningioma:** 92.90% Precision | 93.98% Recall
  * **Healthy (No Tumor):** 89.50% Precision | 99.60% Recall
  * **Pituitary:** 96.33% Precision | 99.58% Recall
* **Dataset Scale:** **13,994 total MRI scans** integrated across 5 open-source Kaggle datasets:
  * **12,000 Training Scans** (3,000 per class — 100% Balanced with CLAHE & Mixup augmentation)
  * **1,994 Independent Test Scans** (Multi-hospital benchmark evaluation)
* **Hardware Acceleration:** Native PyTorch support for **Apple Silicon GPU (MPS)** and **NVIDIA GPU (CUDA)**.
* **Explainable AI (XAI):** Dual-branch visual heatmaps combining **PDSCNN Grad-CAM** (local lesion boundaries) and **ViT Self-Attention Maps** (global contextual dependencies) with real-time quantitative lesion geometry.
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
               [ 5-Seed Bagging Ensemble Regularized Ridge ELM (Ensemble RRELM) ]
                 (5 Heads × 8,192 Hidden Neurons each, Kaiming scaled, C=0.1)
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
Fold 1   | 11195       | 2799       |  98.74%     |  97.50%    |  97.50%    |  97.50%    |  97.49%
Fold 2   | 11195       | 2799       |  98.70%     |  97.64%    |  97.66%    |  97.64%    |  97.64%
Fold 3   | 11195       | 2799       |  98.69%     |  97.36%    |  97.35%    |  97.36%    |  97.35%
Fold 4   | 11195       | 2799       |  98.55%     |  97.93%    |  97.93%    |  97.93%    |  97.92%
Fold 5   | 11196       | 2798       |  98.60%     |  97.96%    |  97.97%    |  97.96%    |  97.96%
=================================================================================================
AVERAGE  | 11195       | 2799       |  98.66%     |  97.68%    |  97.68%    |  97.68%    |  0.9767 (±0.24%)
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
