import os
import sys
import zipfile
import shutil
import subprocess

# List of top Kaggle datasets with original real Brain Tumor MRI images (4-class)
KAGGLE_DATASETS = [
    "masoudnickparvar/brain-tumor-mri-dataset",
    "sartajbhuvaji/brain-tumor-classification-mri",
    "denizkoko/brain-tumor",
    "ahmedhamada0/brain-tumor-detection",
    "obulisrinivasan/brain-tumor-dataset",
]

CLASS_MAP = {
    'glioma_tumor': 'glioma',
    'meningioma_tumor': 'meningioma',
    'no_tumor': 'notumor',
    'pituitary_tumor': 'pituitary',
    'glioma': 'glioma',
    'meningioma': 'meningioma',
    'notumor': 'notumor',
    'pituitary': 'pituitary',
    'tumor': 'glioma',
}

def check_kaggle_auth():
    kaggle_dir = os.path.expanduser('~/.kaggle')
    kaggle_file = os.path.join(kaggle_dir, 'kaggle.json')
    if not os.path.exists(kaggle_file):
        print("==========================================================")
        print("🔐 Kaggle API Authentication Token Required")
        print("==========================================================")
        print("To download datasets automatically from Kaggle:")
        print("1. Go to https://www.kaggle.com/settings/api")
        print("2. Click 'Create New Token' to download 'kaggle.json'")
        print(f"3. Place 'kaggle.json' inside: {kaggle_dir}")
        print("==========================================================")
        return False
    return True

def download_and_merge_kaggle():
    target_dir = 'dataset'
    temp_dir = 'temp_kaggle_downloads'
    os.makedirs(temp_dir, exist_ok=True)
    
    auth_ok = check_kaggle_auth()
    if not auth_ok:
        print("\nChecking for manually downloaded Kaggle zip files in current folder...")
        
    for ds_slug in KAGGLE_DATASETS:
        ds_name = ds_slug.split('/')[-1]
        zip_file = os.path.join(temp_dir, f"{ds_name}.zip")
        
        # Check if local zip exists
        local_zip = f"{ds_name}.zip"
        if os.path.exists(local_zip):
            print(f"Found local zip: {local_zip}")
            shutil.copy2(local_zip, zip_file)
        elif auth_ok:
            print(f"\nDownloading dataset from Kaggle: {ds_slug}...")
            try:
                subprocess.run(['kaggle', 'datasets', 'download', '-d', ds_slug, '-p', temp_dir], check=True)
            except Exception as e:
                print(f"Download failed for {ds_slug}: {e}")
                continue
        else:
            continue
            
        # Locate zip
        actual_zip = None
        for f in os.listdir(temp_dir):
            if f.endswith('.zip') and ds_name in f:
                actual_zip = os.path.join(temp_dir, f)
                break
                
        if not actual_zip or not os.path.exists(actual_zip):
            continue
            
        print(f"Extracting {actual_zip}...")
        extract_target = os.path.join(temp_dir, ds_name)
        with zipfile.ZipFile(actual_zip, 'r') as z:
            z.extractall(extract_target)
            
        print(f"Merging original MRI scans from {ds_slug} into dataset/train...")
        merged_count = 0
        for root, dirs, files in os.walk(extract_target):
            folder_name = os.path.basename(root).lower()
            mapped_class = CLASS_MAP.get(folder_name)
            
            if mapped_class:
                dst_class_dir = os.path.join(target_dir, 'train', mapped_class)
                os.makedirs(dst_class_dir, exist_ok=True)
                
                for f in files:
                    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                        src_file = os.path.join(root, f)
                        dst_file = os.path.join(dst_class_dir, f"kaggle_{ds_name}_{f}")
                        if not os.path.exists(dst_file):
                            shutil.copy2(src_file, dst_file)
                            merged_count += 1
                            
        print(f"Successfully merged {merged_count} original images from {ds_slug}.")

    # Clean temp download directory
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
        
    print("\nRunning automatic deduplication scan...")
    from find_and_remove_duplicates import scan_and_deduplicate
    scan_and_deduplicate(target_dir, dry_run=False)

if __name__ == '__main__':
    download_and_merge_kaggle()
