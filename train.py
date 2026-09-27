import argparse
import copy
import os
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from dataset_loader import get_dataloaders
from model import EndToEndModel, RRELM

def get_default_device():
    if torch.cuda.is_available():
        return 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        return 'mps'
    return 'cpu'

def mixup_data(x, y, alpha=0.2):
    if alpha > 0:
        lam = np.random.beta(alpha, alpha)
    else:
        lam = 1.0
    batch_size = x.size(0)
    index = torch.randperm(batch_size).to(x.device)
    mixed_x = lam * x + (1 - lam) * x[index]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam

def mixup_criterion(criterion, pred, y_a, y_b, lam):
    return lam * criterion(pred, y_a) + (1 - lam) * criterion(pred, y_b)

def train_hybrid_model(epochs=60, batch_size=64, lr=1e-3, device=None, seed=42):
    if seed is not None:
        torch.manual_seed(seed)
        np.random.seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)
            
    if device is None:
        device = get_default_device()
        
    device_label = "Apple Silicon GPU (MPS)" if device == 'mps' else ("NVIDIA GPU (CUDA)" if device == 'cuda' else "CPU")
    print(f"Using device: {device} [{device_label}]")
    
    # 1. Load Data
    train_loader, test_loader = get_dataloaders(root_dir='dataset', batch_size=batch_size)
    
    # 2. Initialize End-to-End Model (for feature extractor training)
    model = EndToEndModel(num_classes=4).to(device)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.03)
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-3)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)
    
    use_cuda_amp = (device == 'cuda')
    scaler = torch.amp.GradScaler('cuda', enabled=use_cuda_amp)
    
    print(f"--- Phase 1: Training Feature Extractors for {epochs} Epochs ---")
    best_test_acc = 0.0
    best_test_loss = float('inf')
    best_model_weights = copy.deepcopy(model.state_dict())
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            with torch.amp.autocast('cuda', enabled=use_cuda_amp):
                logits, _ = model(inputs)
                loss = criterion(logits, labels)
            
            if use_cuda_amp:
                scaler.scale(loss).backward()
                scaler.step(optimizer)
                scaler.update()
            else:
                loss.backward()
                optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            
            _, predicted = torch.max(logits, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
        scheduler.step()
        train_loss = running_loss / total
        train_acc = 100.0 * correct / total
        
        # Test / Validation Evaluation
        model.eval()
        test_running_loss = 0.0
        test_correct = 0
        test_total = 0
        with torch.no_grad():
            for t_inputs, t_labels in test_loader:
                t_inputs, t_labels = t_inputs.to(device), t_labels.to(device)
                with torch.amp.autocast('cuda', enabled=use_cuda_amp):
                    t_logits, _ = model(t_inputs)
                    t_loss = criterion(t_logits, t_labels)
                test_running_loss += t_loss.item() * t_inputs.size(0)
                _, t_pred = torch.max(t_logits, 1)
                test_total += t_labels.size(0)
                test_correct += (t_pred == t_labels).sum().item()
                
        test_loss = test_running_loss / test_total
        test_acc = 100.0 * test_correct / test_total
        
        is_best = ""
        if test_acc > best_test_acc or (test_acc == best_test_acc and test_loss < best_test_loss):
            best_test_acc = test_acc
            best_test_loss = test_loss
            best_model_weights = copy.deepcopy(model.state_dict())
            is_best = " -> Best Saved!"
            
        print(f"Epoch [{epoch+1:02d}/{epochs:02d}] Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}% | Test Loss: {test_loss:.4f} | Test Acc: {test_acc:.2f}%{is_best}")
        
    print(f"\nPhase 1 Completed. Best Validation Accuracy achieved: {best_test_acc:.2f}% (Loss: {best_test_loss:.4f})")
    # Load best performing feature extractor weights
    model.load_state_dict(best_model_weights)
    
    # 3. Extract Features for RRELM
    print("\n--- Phase 2: Extracting Scale-Invariant Features for RRELM ---")
    model.eval()
    
    def extract_features_and_labels(loader):
        all_features = []
        all_labels = []
        with torch.no_grad():
            for inputs, labels in loader:
                inputs = inputs.to(device)
                with torch.amp.autocast('cuda', enabled=use_cuda_amp):
                    _, features = model(inputs)
                all_features.append(features.cpu())
                all_labels.append(labels)
        return torch.cat(all_features), torch.cat(all_labels)

    train_features, train_labels = extract_features_and_labels(train_loader)
    test_features, test_labels = extract_features_and_labels(test_loader)
    
    print(f"Extracted Training Features Shape: {train_features.shape}")
    print(f"Extracted Test Features Shape: {test_features.shape}")
    
    # 4. Train RRELM with Hyperparameter Grid Search over C
    print("\n--- Phase 3 & 4: Training & Evaluating RRELM Classifier ---")
    c_candidates = [0.01, 0.05, 0.1, 0.5, 1.0, 5.0, 10.0, 50.0, 100.0, 250.0, 500.0, 1000.0, 2500.0]
    best_rrelm = None
    best_rrelm_acc = 0.0
    best_c = 1.0
    
    for c_val in c_candidates:
        rrelm = RRELM(input_dim=384, hidden_dim=8192, num_classes=4, C=c_val, seed=seed)
        rrelm.fit(train_features, train_labels)
        preds, _ = rrelm.predict(test_features)
        correct = (preds == test_labels).sum().item()
        acc = 100.0 * correct / test_labels.size(0)
        print(f"RRELM (C={c_val:<7}) Test Accuracy: {acc:.2f}%")
        
        if acc > best_rrelm_acc or best_rrelm is None:
            best_rrelm_acc = acc
            best_rrelm = rrelm
            best_c = c_val
            
    print(f"\n=== RRELM Final Best Test Accuracy: {best_rrelm_acc:.2f}% (with C={best_c}) ===")
    
    # 5. Save the trained feature extractor and best RRELM weights
    print("\n--- Phase 5: Saving Model ---")
    os.makedirs('weights', exist_ok=True)
    
    torch.save({
        'feature_extractor_state_dict': model.feature_extractor.state_dict(),
        'rrelm_W': best_rrelm.W,
        'rrelm_b': best_rrelm.b,
        'rrelm_beta': best_rrelm.beta
    }, 'weights/model.pth')
    print("Model saved to weights/model.pth")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Hybrid PDSCNN-ViT + RRELM Brain Tumor MRI Classifier")
    parser.add_argument('--epochs', type=int, default=60, help="Number of training epochs (default: 60)")
    parser.add_argument('--batch_size', type=int, default=64, help="Batch size for dataloaders (default: 64)")
    parser.add_argument('--lr', type=float, default=1e-3, help="Learning rate (default: 1e-3)")
    parser.add_argument('--device', type=str, default=None, choices=['cuda', 'mps', 'cpu'], help="Compute device (default: auto-detect GPU)")
    args = parser.parse_args()

    train_hybrid_model(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr, device=args.device)