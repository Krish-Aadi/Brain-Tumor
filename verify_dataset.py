import matplotlib.pyplot as plt
import numpy as np
import torch
from dataset_loader import get_dataloaders

def imshow(img, title=None):
    # Convert from PyTorch tensor (C, H, W) back to numpy (H, W, C)
    npimg = img.numpy()
    npimg = np.transpose(npimg, (1, 2, 0))
    # Un-normalize not needed since it's already between 0-1
    plt.imshow(npimg)
    if title:
        plt.title(title)
    plt.axis('off')

if __name__ == "__main__":
    print("Loading the dataset...")
    # Get a batch from the training loader (with augmentations)
    train_loader, _ = get_dataloaders(batch_size=8)
    
    classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
    
    # Grab a single batch of images and labels
    dataiter = iter(train_loader)
    images, labels = next(dataiter)
    
    print(f"Batch Tensor Shape: {images.shape}")
    print(f"Labels Tensor Shape: {labels.shape}")
    
    # Plot the 8 images
    plt.figure(figsize=(12, 6))
    for i in range(8):
        plt.subplot(2, 4, i+1)
        imshow(images[i], title=classes[labels[i]])
        
    plt.suptitle("Verification: Processed & Augmented Training Batch (124x124, CLAHE)")
    plt.tight_layout()
    plt.show()
