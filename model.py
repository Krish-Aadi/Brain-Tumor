import torch
import torch.nn as nn
import torch.nn.functional as F

class PDSCNN(nn.Module):
    def __init__(self):
        super(PDSCNN, self).__init__()
        # Parallel Deep Separable Convolutional Neural Network (Simplified)
        # Input: 3 x 124 x 124
        
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.bn4 = nn.BatchNorm2d(256)
        
        self.pool = nn.MaxPool2d(2, 2)
        self.global_pool = nn.AdaptiveAvgPool2d((1, 1))
        
        self.fc = nn.Linear(256, 256)
        
    def forward(self, x):
        # x: [B, 3, 124, 124]
        x = self.pool(F.relu(self.bn1(self.conv1(x))))  # 62x62
        x = self.pool(F.relu(self.bn2(self.conv2(x))))  # 31x31
        x = self.pool(F.relu(self.bn3(self.conv3(x))))  # 15x15
        
        # Save this feature map for Grad-CAM later
        self.target_layer_activation = x 
        
        x = self.pool(F.relu(self.bn4(self.conv4(x))))  # 7x7
        x = self.global_pool(x)                         # 1x1
        x = x.view(x.size(0), -1)                       # [B, 256]
        x = self.fc(x)                                  # [B, 256]
        return x

class PatchEmbedding(nn.Module):
    def __init__(self, in_channels=3, patch_size=16, embed_dim=128):
        super().__init__()
        self.patch_size = patch_size
        self.proj = nn.Conv2d(in_channels, embed_dim, kernel_size=patch_size, stride=patch_size)

    def forward(self, x):
        x = self.proj(x)  # [B, embed_dim, H', W']
        x = x.flatten(2).transpose(1, 2)  # [B, N, embed_dim]
        return x

class ViTBranch(nn.Module):
    def __init__(self, in_channels=3, patch_size=16, embed_dim=128, num_heads=4, num_layers=4):
        super(ViTBranch, self).__init__()
        self.patch_embed = PatchEmbedding(in_channels, patch_size, embed_dim)
        
        # 128x128 padded input / 16 = 8. 8x8 = 64 patches + 1 cls_token = 65
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))
        self.pos_embed = nn.Parameter(torch.zeros(1, 65, embed_dim))
        
        encoder_layer = nn.TransformerEncoderLayer(d_model=embed_dim, nhead=num_heads, batch_first=True)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        
        self.norm = nn.LayerNorm(embed_dim)

    def forward(self, x):
        # Pad 124x124 to 128x128 to get exactly 64 patches of 16x16
        # Pad (left, right, top, bottom)
        x = F.pad(x, (2, 2, 2, 2), "constant", 0) 
        
        B = x.shape[0]
        x = self.patch_embed(x)  # [B, 64, 128]
        
        cls_tokens = self.cls_token.expand(B, -1, -1)  # [B, 1, 128]
        x = torch.cat((cls_tokens, x), dim=1)          # [B, 65, 128]
        x = x + self.pos_embed                         # [B, 65, 128]
        
        x = self.transformer(x)
        x = self.norm(x)
        
        # Extract the cls_token for global representation
        cls_output = x[:, 0]  # [B, 128]
        return cls_output

    def get_attention_maps(self, x):
        """
        Extract self-attention matrices from each transformer encoder layer.
        x: [B, 3, 124, 124]
        Returns list of attention tensors, each of shape [B, num_heads, 65, 65]
        """
        x = F.pad(x, (2, 2, 2, 2), "constant", 0)
        B = x.shape[0]
        x = self.patch_embed(x)  # [B, 64, 128]
        cls_tokens = self.cls_token.expand(B, -1, -1)  # [B, 1, 128]
        x = torch.cat((cls_tokens, x), dim=1)          # [B, 65, 128]
        x = x + self.pos_embed                         # [B, 65, 128]

        attention_maps = []
        cur = x
        for layer in self.transformer.layers:
            attn_out, attn_weights = layer.self_attn(cur, cur, cur, need_weights=True, average_attn_weights=False)
            attention_maps.append(attn_weights)
            cur = layer.norm1(cur + attn_out)
            cur = layer.norm2(cur + layer.linear2(layer.dropout(F.relu(layer.linear1(cur)))))
        return attention_maps

class HybridFeatureExtractor(nn.Module):
    def __init__(self):
        super(HybridFeatureExtractor, self).__init__()
        self.cnn = PDSCNN()
        self.vit = ViTBranch()
        
    def forward(self, x):
        cnn_features = self.cnn(x)  # [B, 256]
        vit_features = self.vit(x)  # [B, 128]
        
        # Concatenate features
        fused_features = torch.cat((cnn_features, vit_features), dim=1)  # [B, 384]
        return fused_features

    def get_vit_attention_maps(self, x):
        return self.vit.get_attention_maps(x)

class EndToEndModel(nn.Module):
    """
    Used for training the feature extractors using backpropagation.
    The final Linear layer will be discarded in favor of RRELM after training.
    """
    def __init__(self, num_classes=4):
        super(EndToEndModel, self).__init__()
        self.feature_extractor = HybridFeatureExtractor()
        self.classifier = nn.Linear(384, num_classes)
        
    def forward(self, x):
        features = self.feature_extractor(x)
        logits = self.classifier(features)
        return logits, features

class RRELM:
    """
    Regularized Ridge Extreme Learning Machine
    """
    def __init__(self, input_dim=384, hidden_dim=1024, num_classes=4, C=1.0):
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.num_classes = num_classes
        self.C = C  # Regularization parameter
        
        # Randomly initialize hidden weights and biases (never updated)
        # Using a fixed seed ensures reproducibility if needed, but we'll let it be random here
        self.W = torch.randn(input_dim, hidden_dim)
        self.b = torch.randn(hidden_dim)
        
        # Output weights (computed analytically)
        self.beta = None
        
    def fit(self, X, y):
        """
        X: Feature matrix [N, 384]
        y: Labels [N] (integers 0 to 3)
        """
        N = X.size(0)
        
        # One-hot encode targets
        Y = F.one_hot(y, num_classes=self.num_classes).float()
        
        # Hidden layer output
        H = torch.relu(X @ self.W + self.b)  # [N, hidden_dim]
        
        # Ridge Regression: beta = (H^T H + C * I)^-1 H^T Y
        I = torch.eye(self.hidden_dim)
        
        # Solve using Moore-Penrose pseudo inverse with ridge penalty
        H_T = H.t()
        inv_term = torch.inverse(H_T @ H + self.C * I)
        self.beta = inv_term @ H_T @ Y  # [hidden_dim, num_classes]
        
        print("RRELM weights analytically computed.")
        
    def predict(self, X, temperature=0.15):
        if self.beta is None:
            raise ValueError("RRELM has not been fitted yet.")
            
        H = torch.relu(X @ self.W + self.b)
        logits = H @ self.beta
        
        # Use calibrated softmax to convert regression outputs to confidence probabilities
        probs = F.softmax(logits / temperature, dim=1)
        preds = torch.argmax(probs, dim=1)
        
        return preds, probs
