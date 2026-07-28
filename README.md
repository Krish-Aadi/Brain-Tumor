# Brain Tumor MRI Dataset Preparation

This repository contains Python scripts to download, merge, and augment Brain Tumor MRI datasets for image classification tasks. The scripts prepare a dataset with four classes: glioma, meningioma, notumor, and pituitary.

## Prerequisites

1.  Python 3.x
2.  A [Kaggle](https://www.kaggle.com/) account and an API token (`kaggle.json`).

## Setup

1.  **Activate Virtual Environment:**
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
2.  **Install Dependencies:**
    You will need `kaggle` and `Pillow` (PIL).
    ```powershell
    pip install kaggle Pillow
    ```
3.  **Kaggle API Token:**
    - Go to your Kaggle account settings and click "Create New Token" to download `kaggle.json`.
    - Place the `kaggle.json` file in your `~/.kaggle/` directory.

## Usage

Run the scripts in the following order to prepare the complete dataset:

### 1. Download Initial Dataset
This script downloads the base `masoudnickparvar/brain-tumor-mri-dataset` from Kaggle and extracts it into a `dataset` directory.
```powershell
python download_dataset.py
```

### 2. Merge Second Dataset (Optional)
If you have a second dataset named `brain-tumor-classification-mri.zip` in the root directory, this script will extract and merge it into the existing `dataset` directory, mapping the class names correctly to avoid duplication.
```powershell
python merge_datasets.py
```

### 3. Augment Dataset
This script augments the training dataset by applying random flips and rotations to existing images until each class reaches a target of 2100 images. This results in a balanced training set of 8400 images (plus the original 1600 test images, for a total of 10,000 images).
```powershell
python augment_dataset.py
```

## Directory Structure

- `dataset/`: Contains the processed train and test image sets.
- `download_dataset.py`: Script to fetch the primary dataset via the Kaggle API.
- `merge_datasets.py`: Script to integrate an additional dataset zip file.
- `augment_dataset.py`: Script to perform image augmentation to balance classes.
