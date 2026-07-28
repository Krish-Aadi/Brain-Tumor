import os
import cv2
import torch
import numpy as np
from torch.utils.data import Dataset, DataLoader

class BrainTumorDataset(Dataset):
    def __init__(self, root_dir, split='train', transform=True):
        """
        root_dir: The dataset directory, e.g., 'dataset'
        split: 'train' or 'test'
        transform: Boolean, whether to apply data augmentation
        """
        self.root_dir = os.path.join(root_dir, split)
        self.transform = transform
        self.classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
        self.class_to_idx = {cls_name: i for i, cls_name in enumerate(self.classes)}
        
        self.image_paths = []
        self.labels = []
        
        for cls_name in self.classes:
            cls_dir = os.path.join(self.root_dir, cls_name)
            if not os.path.exists(cls_dir):
                continue
            for img_name in os.listdir(cls_dir):
                self.image_paths.append(os.path.join(cls_dir, img_name))
                self.labels.append(self.class_to_idx[cls_name])

    def __len__(self):
        return len(self.image_paths)

    def preprocess(self, img):
        # 1. Resize to exactly 124 x 124 pixels
        img = cv2.resize(img, (124, 124))
        
        # 2. CLAHE (Contrast Limited Adaptive Histogram Equalization)
        # Convert to LAB color space to apply CLAHE to the lightness channel
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
            
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        img_clahe = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)
        
        return img_clahe

    def augment(self, img):
        # Apply random rotations, flips, and shifts
        rows, cols, ch = img.shape
        
        # Random Flips (Horizontal and Vertical)
        if np.random.rand() > 0.5:
            img = cv2.flip(img, 1)
        if np.random.rand() > 0.5:
            img = cv2.flip(img, 0)
            
        # Random Rotation (-15 to 15 degrees)
        angle = np.random.uniform(-15, 15)
        M = cv2.getRotationMatrix2D((cols/2, rows/2), angle, 1)
        img = cv2.warpAffine(img, M, (cols, rows))
        
        # Random Shift (-10 to 10 pixels in x and y)
        tx = np.random.uniform(-10, 10)
        ty = np.random.uniform(-10, 10)
        M = np.float32([[1, 0, tx], [0, 1, ty]])
        img = cv2.warpAffine(img, M, (cols, rows))
        
        return img

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        
        # Read image
        img = cv2.imread(img_path)
        if img is None:
            img = np.zeros((124, 124, 3), dtype=np.uint8)
        else:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
        # Apply deterministic preprocessing
        img = self.preprocess(img)
        
        # Apply random augmentations if transform=True (for training only)
        if self.transform:
            img = self.augment(img)
            
        # 3. Normalization (Scale 0-255 to 0-1)
        img = img.astype(np.float32) / 255.0
        
        # 4. Tensor Conversion: PyTorch expects (Channels, Height, Width)
        # Convert (124, 124, 3) to (3, 124, 124)
        img = np.transpose(img, (2, 0, 1))
        tensor_img = torch.from_numpy(img)
        
        return tensor_img, label

def get_dataloaders(root_dir='dataset', batch_size=32):
    train_dataset = BrainTumorDataset(root_dir, split='train', transform=True)
    test_dataset = BrainTumorDataset(root_dir, split='test', transform=False)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    
    return train_loader, test_loader

if __name__ == "__main__":
    train_loader, test_loader = get_dataloaders()
    for imgs, labels in train_loader:
        print(f"Dataset successfully loaded.")
        print(f"Batch images shape: {imgs.shape}")
        print(f"Batch labels shape: {labels.shape}")
        break
