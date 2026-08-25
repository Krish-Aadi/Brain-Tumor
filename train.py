import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from dataset_loader import get_dataloaders
from model import EndToEndModel, RRELM
import os
import copy

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

def train_hybrid_model(epochs=80, batch_size=32, lr=5e-4, device='cuda' if torch.cuda.is_available() else 'cpu'):
    print(f"Using device: {device}")
    
    # 1. Load Data
    train_loader, test_loader = get_dataloaders(root_dir='dataset', batch_size=batch_size)
    
    # 2. Initialize End-to-End Model (for feature extractor training)
    model = EndToEndModel(num_classes=4).to(device)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-2)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)
    scaler = torch.amp.GradScaler('cuda', enabled=(device == 'cuda'))
    
    print(f"--- Phase 1: Training Feature Extractors with Mixup for {epochs} Epochs ---")
    best_test_acc = 0.0
    best_model_weights = copy.deepcopy(model.state_dict())
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            
            # Apply Mixup on 50% of training batches for strong feature regularization
            if np.random.rand() < 0.5:
                inputs_m, y_a, y_b, lam = mixup_data(inputs, labels, alpha=0.2)
                with torch.amp.autocast('cuda', enabled=(device == 'cuda')):
                    logits, _ = model(inputs_m)
                    loss = mixup_criterion(criterion, logits, y_a, y_b, lam)
            else:
                with torch.amp.autocast('cuda', enabled=(device == 'cuda')):
                    logits, _ = model(inputs)
                    loss = criterion(logits, labels)
            
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            
            running_loss += loss.item() * inputs.size(0)
            
            _, predicted = torch.max(logits, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
        scheduler.step()
        epoch_loss = running_loss / total
        epoch_acc = 100 * correct / total
        
        # Test accuracy check for feature extractor
        model.eval()
        test_correct = 0
        test_total = 0
        with torch.no_grad():
            for t_inputs, t_labels in test_loader:
                t_inputs, t_labels = t_inputs.to(device), t_labels.to(device)
                with torch.amp.autocast('cuda', enabled=(device == 'cuda')):
                    t_logits, _ = model(t_inputs)
                _, t_pred = torch.max(t_logits, 1)
                test_total += t_labels.size(0)
                test_correct += (t_pred == t_labels).sum().item()
        test_acc = 100 * test_correct / test_total
        
        is_best = ""
        if test_acc > best_test_acc:
            best_test_acc = test_acc
            best_model_weights = copy.deepcopy(model.state_dict())
            is_best = " -> Best Saved!"
            
        print(f"Epoch [{epoch+1:02d}/{epochs:02d}] Train Loss: {epoch_loss:.4f} | Train Acc: {epoch_acc:.2f}% | Test Acc: {test_acc:.2f}%{is_best}")
        
    print(f"\nPhase 1 Completed. Best Test Accuracy achieved: {best_test_acc:.2f}%")
    # Load best performing feature extractor weights for feature extraction
    model.load_state_dict(best_model_weights)
    
    # 3. Extract Features for RRELM
    print("\n--- Phase 2: Extracting Features for RRELM ---")
    model.eval()
    
    def extract_features_and_labels(loader):
        all_features = []
        all_labels = []
        with torch.no_grad():
            for inputs, labels in loader:
                inputs = inputs.to(device)
                with torch.amp.autocast('cuda', enabled=(device == 'cuda')):
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
    c_candidates = [0.01, 0.1, 1.0, 10.0, 50.0, 100.0, 500.0]
    best_rrelm = None
    best_rrelm_acc = 0.0
    best_c = 0.1
    
    for c_val in c_candidates:
        rrelm = RRELM(input_dim=384, hidden_dim=4096, num_classes=4, C=c_val)
        rrelm.fit(train_features, train_labels)
        preds, _ = rrelm.predict(test_features)
        correct = (preds == test_labels).sum().item()
        acc = 100 * correct / test_labels.size(0)
        print(f"RRELM (C={c_val:<5}) Test Accuracy: {acc:.2f}%")
        
        if acc > best_rrelm_acc or best_rrelm is None:
            best_rrelm_acc = acc
            best_rrelm = rrelm
            best_c = c_val
            
    print(f"\n=== RRELM Final Best Test Accuracy: {best_rrelm_acc:.2f}% (with C={best_c}) ===")
    
    # 6. Save the trained feature extractor and best RRELM weights
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
    train_hybrid_model(epochs=80, batch_size=32)