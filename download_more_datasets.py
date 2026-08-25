import os
import sys
import zipfile
import shutil
import subprocess

CLASS_MAP = {
    # Standard Kaggle 4-class naming
    'glioma_tumor': 'glioma',
    'meningioma_tumor': 'meningioma',
    'no_tumor': 'notumor',
    'pituitary_tumor': 'pituitary',
    'glioma': 'glioma',
    'meningioma': 'meningioma',
    'notumor': 'notumor',
    'pituitary': 'pituitary',
    'tumor': 'glioma',  # default fallback if binary
}

ADDITIONAL_DATASETS = [
    "sartajbhuvaji/brain-tumor-classification-mri",
]

def download_and_merge_additional():
    target_dir = 'dataset'
    temp_dir = 'temp_download'
    os.makedirs(temp_dir, exist_ok=True)
    
    for dataset_slug in ADDITIONAL_DATASETS:
        dataset_name = dataset_slug.split('/')[-1]
        print(f"\n==========================================")
        print(f"Downloading dataset: {dataset_slug}")
        print(f"==========================================")
        
        zip_path = os.path.join(temp_dir, f"{dataset_name}.zip")
        extract_path = os.path.join(temp_dir, dataset_name)
        
        try:
            subprocess.run(['kaggle', 'datasets', 'download', '-d', dataset_slug, '-p', temp_dir], check=True)
        except Exception as e:
            print(f"Failed to download {dataset_slug}: {e}")
            continue
            
        # Extract
        actual_zip = None
        for f in os.listdir(temp_dir):
            if f.endswith('.zip') and dataset_name in f:
                actual_zip = os.path.join(temp_dir, f)
                break
                
        if not actual_zip or not os.path.exists(actual_zip):
            print(f"Zip file for {dataset_slug} not found.")
            continue
            
        print(f"Extracting {actual_zip}...")
        with zipfile.ZipFile(actual_zip, 'r') as z:
            z.extractall(extract_path)
            
        # Process and merge into dataset/train
        print(f"Merging images into '{target_dir}/train'...")
        merged_files_count = 0
        
        for root, dirs, files in os.walk(extract_path):
            folder_name = os.path.basename(root).lower()
            mapped_class = CLASS_MAP.get(folder_name)
            
            if mapped_class:
                dst_class_dir = os.path.join(target_dir, 'train', mapped_class)
                os.makedirs(dst_class_dir, exist_ok=True)
                
                for f in files:
                    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                        src_file = os.path.join(root, f)
                        dst_file = os.path.join(dst_class_dir, f"extra_{dataset_name}_{f}")
                        if not os.path.exists(dst_file):
                            shutil.copy2(src_file, dst_file)
                            merged_files_count += 1
                            
        print(f"Merged {merged_files_count} images from {dataset_slug}.")
        
    # Cleanup temp download folder
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
        print("Cleaned up temporary download directory.")
        
    # Run automatic deduplication to prune duplicates & data leakage
    print("\nRunning automatic deduplication scan...")
    from find_and_remove_duplicates import scan_and_deduplicate
    scan_and_deduplicate(target_dir, dry_run=False)

if __name__ == '__main__':
    download_and_merge_additional()
