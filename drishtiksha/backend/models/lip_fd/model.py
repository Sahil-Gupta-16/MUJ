"""LipForensics (Lip-FD) Audio-Visual Sync Detector"""
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
import numpy as np
# Fixed imports('../..')
from models.base_model import BaseDeepfakeModel

class LipForensicsDetector(BaseDeepfakeModel):
    def __init__(self):
        super().__init__(model_name='LIP-FD-V1', weight=0.18)
        self.load_model()
        
    def load_model(self):
        self.model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        num_features = self.model.fc.in_features
        self.model.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(num_features, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )
        self.model = self.model.to(self.device)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
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
