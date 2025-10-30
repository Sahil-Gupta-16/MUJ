"""Cross-Efficient-ViT Hybrid Model"""
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
import numpy as np
# Fixed imports('../..')
from models.base_model import BaseDeepfakeModel

class CrossEfficientViT(BaseDeepfakeModel):
    def __init__(self):
        super().__init__(model_name='CROSS-EFFICIENT-VIT-GAN', weight=0.22)
        self.load_model()
        
    def load_model(self):
        self.model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
        num_features = self.model.classifier[1].in_features
        self.model.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 1),
            nn.Sigmoid()
        )
        self.model = self.model.to(self.device)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((256, 256)),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def preprocess(self, frame: np.ndarray) -> torch.Tensor:
        return self.transform(frame).unsqueeze(0).to(self.device)
    
    def predict_frame(self, frame: np.ndarray) -> float:
        with torch.no_grad():
            input_tensor = self.preprocess(frame)
            output = self.model(input_tensor)
            return output.item()
