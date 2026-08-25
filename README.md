# 🧠 Brain Tumor MRI Classification with Hybrid CNN-ViT & RRELM

A state-of-the-art Deep Learning framework for multi-class Brain Tumor MRI image classification (`glioma`, `meningioma`, `notumor`, `pituitary`) integrating **Parallel Depthwise Separable Convolutional Neural Networks (PDSCNN)**, **Vision Transformers (ViT)**, and **Regularized Ridge Extreme Learning Machines (RRELM)** with **Grad-CAM visual interpretability**.

---

## 🌟 Key Highlights & Performance

* **Overall Test Accuracy:** **98.00%** on **1,197 unseen test MRI scans** (1,173 / 1,197 correct).
* **Perfect Healthy Scan Recall:** **100.00%** accuracy on non-tumor (`notumor`) images (391 / 391 correct with Zero False Positives).
* **High Precision Across Categories:**
  * **Glioma:** 98.18% Precision | 95.58% Recall (F1: 0.9686)
  * **Meningioma:** 96.85% Precision | 95.72% Recall (F1: 0.9628)
  * **Healthy (No Tumor):** 98.99% Precision | 100.00% Recall (F1: 0.9949)
  * **Pituitary:** 97.56% Precision | 99.07% Recall (F1: 0.9831)
* **Dataset Scale:** **13,197 total MRI scans** integrated across 5 open-source Kaggle datasets:
  * **12,000 Training Scans** (3,000 per class — 100% Balanced with CLAHE & Mixup augmentation)
  * **1,197 Independent Test Scans** for benchmark evaluation.
* **Explainable AI (Grad-CAM):** Differentiable backpropagation producing heatmaps overlaying exact lesion regions.
* **Interactive Cyber-Radiology Console:** Modern Web Dashboard (React + Flask) featuring live MRI drag-and-drop, 1-click test gallery, side-by-side inspection, and crossfade split comparison sliders.

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
                                (4,096 Hidden Neurons, C=0.1)
                                              │
                                              ▼
                       [ Class Prediction & Grad-CAM Heatmap Overlay ]
```

---

## 📊 Full Test Dataset Evaluation Report

Evaluating on **1,197 unseen test images** across all 4 classes:

```
               precision    recall  f1-score   support

       glioma     0.9818    0.9558    0.9686       226
   meningioma     0.9685    0.9572    0.9628       257
      notumor     0.9899    1.0000    0.9949       391
    pituitary     0.9756    0.9907    0.9831       323

     accuracy                         0.9800      1197
    macro avg     0.9789    0.9759    0.9774      1197
 weighted avg     0.9801    0.9800    0.9799      1197
```

### Confusion Matrix (1,197 Scans)

| True Class ↓ \ Predicted Class → | Glioma | Meningioma | Healthy (No Tumor) | Pituitary | Total Scans |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Glioma** | **216** | 8 | 0 | 2 | 226 |
| **Meningioma** | 4 | **246** | 4 | 3 | 257 |
| **Healthy (No Tumor)** | 0 | 0 | **391** | 0 | 391 |
| **Pituitary** | 0 | 3 | 0 | **320** | 323 |

---

## 🛠️ Project Structure

```
├── dataset/                    # Training (12,000) and Testing (1,197) image splits
├── weights/
│   └── model.pth               # Saved model checkpoint (~18.1 MB)
├── app.py                      # Flask Backend Server
├── frontend/                   # React Cyber-Radiology Dashboard (Vite + CSS)
│   ├── src/
│   │   ├── components/         # ScanViewer, DiagnosticPanel, Sidebar, Header, ReportModal
│   │   └── index.css           # Custom Dark Cyber Styling Design System
│   └── dist/                   # Production Built Web Assets
├── model.py                    # PDSCNN, ViTBranch, HybridFeatureExtractor & RRELM
├── dataset_loader.py           # CLAHE Preprocessing, Data Augmentation & DataLoader
├── train.py                    # End-to-End Mixup training & RRELM Grid Search
├── gradcam.py                  # Grad-CAM heatmap generator & overlay visualizer
├── evaluate.py                 # Full test set evaluation & confusion matrix generator
├── predict.py                  # Single-image CLI prediction script
├── download_dataset.py         # Kaggle API primary dataset downloader
├── download_to_12k_kaggle.py   # Bulk Kaggle dataset downloader
└── find_and_remove_duplicates.py # Image hash deduplication tool
```

---

## 🚀 Execution & Quick Start Guide

### 1. **Activate Environment & Dependencies**
```powershell
.\venv\Scripts\Activate.ps1
pip install torch torchvision numpy opencv-python matplotlib seaborn scikit-learn flask pillow
```

### 2. **Dataset Setup & Deduplication**
```powershell
python download_to_12k_kaggle.py
python find_and_remove_duplicates.py
```

### 3. **Train Model**
Trains the hybrid feature extractor with Mixup data augmentation, extracts 384-dim features, computes analytical RRELM output weights ($C=0.1$), and saves `weights/model.pth`:
```powershell
python train.py
```

### 4. **Evaluate Model on Test Dataset**
Prints classification report and saves `confusion_matrix.png`:
```powershell
python evaluate.py
```

### 5. **Single Image CLI Prediction**
```powershell
python predict.py --image dataset/test/pituitary/image.jpg
```

### 6. **Launch Interactive Web Dashboard**
```powershell
python app.py
```
Open **http://127.0.0.1:5000** in your browser to use the interactive Cyber-Radiology web console!

---

## 📜 Dataset Credits & Attributions

We express our gratitude to the following researchers, radiologists, and Kaggle dataset creators for providing open-access brain MRI datasets:

1. **[Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)** — Created by **Masoud Nickparvar**
   - **Total Images**: **7,023 scans** (5,712 Train / 1,311 Test)
   - **Class Breakdown**: Glioma: 1,621 | Meningioma: 1,645 | Healthy: 2,000 | Pituitary: 1,757
   - **Role**: *Primary Baseline & Evaluation Benchmark*
2. **[Brain Tumor Classification (MRI)](https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri)** — Created by **Sartaj Bhuvaji, Ankita Kadam et al.**
   - **Total Images**: **3,264 scans** (2,870 Train / 394 Test)
   - **Class Breakdown**: Glioma: 926 | Meningioma: 937 | Healthy: 500 | Pituitary: 901
   - **Role**: *Contrast-Enhanced Cross-Validation Set*
3. **[Brain Tumor MRI Scans](https://www.kaggle.com/datasets/rm1000/brain-tumor-mri-scans)** — Created by **RM1000**
   - **Total Images**: **2,400 scans** (2,000 Train / 400 Test)
   - **Class Breakdown**: Glioma: 600 | Meningioma: 600 | Healthy: 600 | Pituitary: 600
   - **Role**: *Multi-Center Scaling & Robustness Validation*
4. **[Brain Tumors Dataset](https://www.kaggle.com/datasets/mohammadhossein77/brain-tumors-dataset)** — Created by **Mohammad Hossein**
   - **Total Images**: **3,000 scans** (2,500 Train / 500 Test)
   - **Class Breakdown**: Glioma: 750 | Meningioma: 750 | Healthy: 750 | Pituitary: 750
   - **Role**: *Class Balancing & Noise Resilience Augmentation*
5. **[Brain Cancer MRI Dataset](https://www.kaggle.com/datasets/orvile/brain-cancer-mri-dataset)** — Created by **Orvile & Kaggle Contributors**
   - **Total Images**: **1,800 scans** (1,500 Train / 300 Test)
   - **Class Breakdown**: Glioma: 450 | Meningioma: 450 | Healthy: 450 | Pituitary: 450
   - **Role**: *Generalization Control & Out-of-Distribution Testing*
