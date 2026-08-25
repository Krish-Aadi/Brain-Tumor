import os
import shutil
import random
from collections import defaultdict

def trim_dataset_to_balanced(target_per_class=3000, seed=42):
    random.seed(seed)
    train_dir = 'dataset/train'
    test_dir = 'dataset/test'
    
    print(f"=== Trimming Dataset to ~12k-15k Balanced Original Scans ===")
    
    # 1. Check current counts
    class_files = defaultdict(list)
    for class_name in os.listdir(train_dir):
        class_path = os.path.join(train_dir, class_name)
        if os.path.isdir(class_path):
            files = [f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            class_files[class_name] = files
            print(f"Current {class_name}: {len(files)} images")
            
    # 2. Trim each class in train to target_per_class (e.g. 3000)
    trimmed_total = 0
    removed_total = 0
    
    for class_name, files in class_files.items():
        if len(files) > target_per_class:
            random.shuffle(files)
            keep_files = set(files[:target_per_class])
            remove_files = files[target_per_class:]
            
            class_path = os.path.join(train_dir, class_name)
            for f in remove_files:
                os.remove(os.path.join(class_path, f))
                
            removed_total += len(remove_files)
            print(f"Trimmed {class_name}: kept {target_per_class}, removed {len(remove_files)}")
            trimmed_total += target_per_class
        else:
            trimmed_total += len(files)
            print(f"Kept all {len(files)} for {class_name}")
            
    print(f"\nSuccessfully removed {removed_total} extra files.")
    
    # 3. Print Final Inventory
    print("\n================ Clean Final Inventory ================")
    total_train = 0
    print("[TRAIN SET]")
    for class_name in sorted(os.listdir(train_dir)):
        class_path = os.path.join(train_dir, class_name)
        if os.path.isdir(class_path):
            count = len([f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
            total_train += count
            print(f"  {class_name:<11}: {count} images")
    print(f"  Total train  : {total_train} images")
    
    total_test = 0
    print("\n[TEST SET]")
    for class_name in sorted(os.listdir(test_dir)):
        class_path = os.path.join(test_dir, class_name)
        if os.path.isdir(class_path):
            count = len([f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
            total_test += count
            print(f"  {class_name:<11}: {count} images")
    print(f"  Total test   : {total_test} images")
    
    grand_total = total_train + total_test
    print(f"\n========================================================")
    print(f"GRAND TOTAL DATASET SIZE: {grand_total} unique real images")
    print(f"========================================================")

if __name__ == '__main__':
    trim_dataset_to_balanced(target_per_class=3000)
