import os
import random
from PIL import Image

def augment_class(class_dir, target_count):
    images = [f for f in os.listdir(class_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    current_count = len(images)
    needed = target_count - current_count
    
    if needed <= 0:
        print(f"Class {os.path.basename(class_dir)} already has {current_count} images. No augmentation needed.")
        return

    print(f"Augmenting {needed} images for class {os.path.basename(class_dir)}...")
    
    # We will randomly pick images from the existing set and apply a transformation
    # until we reach the required number of additional images.
    for i in range(needed):
        img_name = random.choice(images)
        img_path = os.path.join(class_dir, img_name)
        
        with Image.open(img_path) as img:
            # Apply a random transformation
            transform_choice = random.choice(['flip_lr', 'flip_tb', 'rotate_90', 'rotate_270'])
            
            if transform_choice == 'flip_lr':
                aug_img = img.transpose(Image.FLIP_LEFT_RIGHT)
            elif transform_choice == 'flip_tb':
                aug_img = img.transpose(Image.FLIP_TOP_BOTTOM)
            elif transform_choice == 'rotate_90':
                aug_img = img.transpose(Image.ROTATE_90)
            elif transform_choice == 'rotate_270':
                aug_img = img.transpose(Image.ROTATE_270)
                
            # Save the augmented image
            new_name = f"aug_{i}_{img_name}"
            aug_img.save(os.path.join(class_dir, new_name))

if __name__ == "__main__":
    # We want 10k total images.
    # Current dataset has 7,200 (Test: 1600, Train: 5600)
    # We will augment train set to have 2100 images per class.
    # Total train = 8400, Total test = 1600 -> Total = 10,000
    
    train_dir = os.path.join("dataset", "train")
    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
    target_per_class = 2100
    
    for cls in classes:
        cls_path = os.path.join(train_dir, cls)
        if os.path.exists(cls_path):
            augment_class(cls_path, target_per_class)
        else:
            print(f"Directory {cls_path} not found!")
            
    print("Augmentation complete!")
