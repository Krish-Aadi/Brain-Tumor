import os
import hashlib
from collections import defaultdict
from PIL import Image

def get_file_md5(filepath):
    """Compute MD5 hash of raw file bytes."""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def get_pixel_md5(filepath):
    """Compute MD5 hash of raw uncompressed image pixel array."""
    try:
        with Image.open(filepath) as img:
            img = img.convert('RGB')
            return hashlib.md5(img.tobytes()).hexdigest()
    except Exception as e:
        return get_file_md5(filepath)

def score_filepath(filepath):
    """
    Score filepath to decide which duplicate image to keep.
    Higher score = higher priority to keep.
    - Prefer 'train' over 'test' (prevents data leakage in test set).
    - Prefer original dataset files over 'dataset2_' or 'aug_'.
    - Prefer shorter filenames.
    """
    score = 0
    normalized = filepath.replace('\\', '/')
    
    if '/train/' in normalized:
        score += 100
    elif '/test/' in normalized:
        score += 50
        
    filename = os.path.basename(filepath)
    if not filename.startswith('aug_'):
        score += 20
    if not filename.startswith('dataset2_'):
        score += 10
        
    score -= len(filename)  # Tie-breaker: prefer shorter names
    return score

def scan_and_deduplicate(dataset_dir='dataset', dry_run=False):
    print(f"=== Starting Duplicate Image Audit in '{dataset_dir}' ===")
    
    all_images = []
    for root, dirs, files in os.walk(dataset_dir):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                all_images.append(os.path.join(root, f))
                
    total_scanned = len(all_images)
    print(f"Total image files found: {total_scanned}")
    
    print("Computing image hashes (checking raw pixel data)...")
    hash_map = defaultdict(list)
    for idx, path in enumerate(all_images):
        if (idx + 1) % 1000 == 0 or (idx + 1) == total_scanned:
            print(f"Hashed {idx + 1}/{total_scanned} images...", flush=True)
        h = get_pixel_md5(path)
        hash_map[h].append(path)
        
    duplicate_groups = {h: paths for h, paths in hash_map.items() if len(paths) > 1}
    total_dup_files = sum(len(paths) - 1 for paths in duplicate_groups.values())
    
    print("\n--- Audit Summary ---")
    print(f"Unique images: {len(hash_map)}")
    print(f"Duplicate groups found: {len(duplicate_groups)}")
    print(f"Total redundant duplicate files to delete: {total_dup_files}")
    
    if not duplicate_groups:
        print("No duplicates found! Dataset is completely clean.")
        return
        
    cross_split_count = 0
    cross_class_count = 0
    files_to_remove = []
    
    for h, paths in duplicate_groups.items():
        # Check splits and classes in group
        splits = set()
        classes = set()
        for p in paths:
            norm = p.replace('\\', '/')
            parts = norm.split('/')
            if len(parts) >= 3:
                splits.add(parts[-3])   # train or test
                classes.add(parts[-2])  # glioma, meningioma, etc.
                
        if len(splits) > 1:
            cross_split_count += 1
        if len(classes) > 1:
            cross_class_count += 1
            
        # Sort paths by priority score descending
        sorted_paths = sorted(paths, key=score_filepath, reverse=True)
        keeper = sorted_paths[0]
        to_delete = sorted_paths[1:]
        
        files_to_remove.extend(to_delete)
        
    print(f"Duplicate groups with Train-Test data leakage: {cross_split_count}")
    print(f"Duplicate groups with Cross-Class conflicts: {cross_class_count}")
    
    if dry_run:
        print(f"\n[DRY RUN] Would remove {len(files_to_remove)} duplicate files.")
    else:
        print(f"\nRemoving {len(files_to_remove)} duplicate files...")
        removed_count = 0
        for fpath in files_to_remove:
            try:
                os.remove(fpath)
                removed_count += 1
            except Exception as e:
                print(f"Failed to remove {fpath}: {e}")
                
        print(f"Successfully deleted {removed_count} duplicate image files.")
        
    # Print final counts per split and class
    print("\n=== Cleaned Dataset Inventory ===")
    for split in ['train', 'test']:
        split_dir = os.path.join(dataset_dir, split)
        if not os.path.exists(split_dir):
            continue
        print(f"\n[{split.upper()} SET]")
        split_total = 0
        for cls in sorted(os.listdir(split_dir)):
            cls_path = os.path.join(split_dir, cls)
            if os.path.isdir(cls_path):
                cnt = len([f for f in os.listdir(cls_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
                print(f"  {cls:<12}: {cnt} images")
                split_total += cnt
        print(f"  Total {split:<7}: {split_total} images")

if __name__ == '__main__':
    import sys
    dry_run = '--dry-run' in sys.argv
    scan_and_deduplicate('dataset', dry_run=dry_run)
