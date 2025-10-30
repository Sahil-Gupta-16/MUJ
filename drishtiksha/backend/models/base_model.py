"""Base model class for all deepfake detection models"""
from abc import ABC, abstractmethod
import torch
import numpy as np
from typing import Dict, List, Tuple

class BaseDeepfakeModel(ABC):
    def __init__(self, model_name: str, weight: float):
        self.model_name = model_name
        self.weight = weight
        self.model = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    @abstractmethod
    def load_model(self):
        """Load model weights"""
        pass
    
    @abstractmethod
    def preprocess(self, frame: np.ndarray) -> torch.Tensor:
        """Preprocess frame for model input"""
        pass
    
    @abstractmethod
    def predict_frame(self, frame: np.ndarray) -> float:
        """Predict fake probability for single frame"""
        pass
    
    def predict_video(self, frames: List[np.ndarray], timestamps: List[float]) -> Dict:
        """Predict fake probability for all frames"""
        predictions = []
        for frame in frames:
            fake_prob = self.predict_frame(frame)
            predictions.append(fake_prob)
        
        return {
            'model_name': self.model_name,
            'frame_scores': predictions,
            'timestamps': timestamps,
            'avg_score': float(np.mean(predictions)),
            'max_score': float(np.max(predictions)),
            'min_score': float(np.min(predictions)),
            'weight': self.weight
        }
