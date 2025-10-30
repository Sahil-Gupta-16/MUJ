"""EyeBlink CNN-LSTM Temporal Model"""
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
import numpy as np
# Fixed imports('../..')
from models.base_model import BaseDeepfakeModel

class EyeBlinkDetector(BaseDeepfakeModel):
    def __init__(self):
        super().__init__(model_name='EYEBLINK-CNN-LSTM-V1', weight=0.12)
        self.load_model()
        self.sequence_length = 5
        self.frame_buffer = []
        
    def load_model(self):
        resnet = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
        self.feature_extractor = nn.Sequential(*list(resnet.children())[:-1])
        self.lstm = nn.LSTM(input_size=512, hidden_size=256, num_layers=2, batch_first=True, dropout=0.3)
        self.classifier = nn.Sequential(nn.Linear(256, 1), nn.Sigmoid())
        
        self.feature_extractor = self.feature_extractor.to(self.device)
        self.lstm = self.lstm.to(self.device)
        self.classifier = self.classifier.to(self.device)
        
        self.feature_extractor.eval()
        self.lstm.eval()
        self.classifier.eval()
        
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def preprocess(self, frame: np.ndarray) -> torch.Tensor:
        return self.transform(frame).unsqueeze(0).to(self.device)
    
    def predict_frame(self, frame: np.ndarray) -> float:
        with torch.no_grad():
            input_tensor = self.preprocess(frame)
            features = self.feature_extractor(input_tensor).squeeze()
            self.frame_buffer.append(features)
            if len(self.frame_buffer) > self.sequence_length:
                self.frame_buffer.pop(0)
            if len(self.frame_buffer) < self.sequence_length:
                return 0.5
            sequence = torch.stack(self.frame_buffer).unsqueeze(0)
            lstm_out, _ = self.lstm(sequence)
            prediction = self.classifier(lstm_out[:, -1, :])
            return prediction.item()
