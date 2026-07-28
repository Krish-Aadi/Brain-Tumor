import zipfile
import os
import shutil

def merge_datasets():
    zip_path = 'brain-tumor-classification-mri.zip'
    temp_dir = 'temp_extract'
    target_dir = 'dataset'
    
    # Class mapping from the new dataset to the existing dataset
    class_map = {
        'glioma_tumor': 'glioma',
        'meningioma_tumor': 'meningioma',
        'no_tumor': 'notumor',
        'pituitary_tumor': 'pituitary'
    }
    
    # Extract
    print("Extracting second dataset...")
    with zipfile.ZipFile(zip_path, 'r') as z:
        z.extractall(temp_dir)
        
    # Merge
    print("Merging into the main dataset...")
    for split in ['Training', 'Testing']:
        split_path = os.path.join(temp_dir, split)
        target_split = 'train' if split == 'Training' else 'test'
        
        if not os.path.exists(split_path):
            continue
            
        for class_dir in os.listdir(split_path):
            src_class_path = os.path.join(split_path, class_dir)
            if not os.path.isdir(src_class_path):
                continue
                
            mapped_class = class_map.get(class_dir)
            if not mapped_class:
                print(f"Skipping unknown class {class_dir}")
                continue
                
            dst_class_path = os.path.join(target_dir, target_split, mapped_class)
            os.makedirs(dst_class_path, exist_ok=True)
            
            # Copy all files
            files = os.listdir(src_class_path)
            for f in files:
                src_file = os.path.join(src_class_path, f)
                # Ensure unique name by prefixing with 'dataset2_'
                dst_file = os.path.join(dst_class_path, f"dataset2_{f}")
                shutil.copy2(src_file, dst_file)
                
    # Cleanup
    print("Cleaning up...")
    shutil.rmtree(temp_dir)
    os.remove(zip_path)
    
    # Count total
    total_files = 0
    for root, dirs, files in os.walk(target_dir):
        total_files += len([f for f in files if f.endswith(('.jpg', '.png', '.jpeg'))])
        
    print(f"Merge complete. Total images in dataset: {total_files}")

if __name__ == '__main__':
    merge_datasets()
