import os
import sys
import zipfile
import shutil
import subprocess

# Set Kaggle API Token from user
os.environ["KAGGLE_API_TOKEN"] = "KGAT_4ff79f5555bba4825b1149a5c1a6c214"

# Key Kaggle Brain Tumor MRI datasets containing original scans
KAGGLE_DATASETS = [
    "rm1000/brain-tumor-mri-scans",
    "mohammadhossein77/brain-tumors-dataset",
    "orvile/brain-cancer-mri-dataset",
    "deeppythonist/brain-tumor-mri-dataset",
    "adityakomaravolu/brain-tumor-mri-images",
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
    'healthy': 'notumor',
    'normal': 'notumor',
    'brain_glioma': 'glioma',
    'brain_men': 'meningioma',
    'brain_pit': 'pituitary',
    'brain_notumor': 'notumor',
}

def download_and_merge_to_12k():
    target_dir = 'dataset'
    temp_dir = 'temp_kaggle_downloads'
    os.makedirs(temp_dir, exist_ok=True)
    
    print("=== Bulk Downloading Real Original Kaggle Datasets ===")
    
    for ds_slug in KAGGLE_DATASETS:
        ds_name = ds_slug.split('/')[-1]
        print(f"\n--------------------------------------------------")
        print(f"Downloading from Kaggle: {ds_slug}")
        print(f"--------------------------------------------------")
        
        try:
            subprocess.run(['kaggle', 'datasets', 'download', '-d', ds_slug, '-p', temp_dir], check=True)
        except Exception as e:
            print(f"Download failed for {ds_slug}: {e}")
            continue
            
        # Locate downloaded zip file
        actual_zip = None
        for f in os.listdir(temp_dir):
            if f.endswith('.zip') and ds_name in f:
                actual_zip = os.path.join(temp_dir, f)
                break
                
        if not actual_zip or not os.path.exists(actual_zip):
            print(f"Zip file for {ds_slug} not found.")
            continue
            
        print(f"Extracting {actual_zip}...")
        extract_target = os.path.join(temp_dir, ds_name)
        with zipfile.ZipFile(actual_zip, 'r') as z:
            z.extractall(extract_target)
            
        print(f"Merging images from {ds_slug} into '{target_dir}/train'...")
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
                        dst_file = os.path.join(dst_class_dir, f"kg_{ds_name}_{f}")
                        if not os.path.exists(dst_file):
                            shutil.copy2(src_file, dst_file)
                            merged_count += 1
                            
        print(f"Merged {merged_count} images from {ds_slug}.")
        
        # Clean extracted folder to save disk space
        if os.path.exists(extract_target):
            shutil.rmtree(extract_target)
        if os.path.exists(actual_zip):
            os.remove(actual_zip)
            
    # Clean temp download directory
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
        
    print("\n==================================================")
    print("Running automatic deduplication scan across all datasets...")
    print("==================================================")
    from find_and_remove_duplicates import scan_and_deduplicate
    scan_and_deduplicate(target_dir, dry_run=False)

if __name__ == '__main__':
    download_and_merge_to_12k()
