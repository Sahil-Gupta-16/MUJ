"""Ensemble Service - Combines all models"""
import numpy as np
from scipy.ndimage import gaussian_filter1d
from typing import Dict, List

# ✅ Correct imports (since models are in drishtiksha/backend/models)
from models.efficientnet_b7.model import EfficientNetB7Detector
from models.cross_efficient_vit.model import CrossEfficientViT
from models.eyeblink_cnn_lstm.model import EyeBlinkDetector
from models.distil_dire.model import DistilDIREDetector
from models.lip_fd.model import LipForensicsDetector
from models.mff_moe.model import MFFMoEDetector


class EnsembleAnalyzer:
    def __init__(self):
        print("🔄 Loading all models...")
        self.models = [
            CrossEfficientViT(),
            EfficientNetB7Detector(),
            EyeBlinkDetector(),
            DistilDIREDetector(),
            LipForensicsDetector(),
            MFFMoEDetector()
        ]
        print("✅ All models loaded!")
    
    def analyze_video(self, frames: List[np.ndarray], timestamps: List[float]) -> Dict:
        print(f"📊 Analyzing {len(frames)} frames...")
        model_results = []
        for model in self.models:
            result = model.predict_video(frames, timestamps)
            model_results.append(result)
            print(f"  ✓ {model.model_name}: {result['avg_score']:.3f}")
        
        ensemble_scores = self._compute_ensemble(model_results)
        smoothed_scores = gaussian_filter1d(ensemble_scores, sigma=2)
        fake_segments = self._detect_segments(smoothed_scores, timestamps)
        avg_confidence = float(np.mean(smoothed_scores))
        prediction = 'FAKE' if avg_confidence > 0.5 else 'REAL'
        authentic_frames = sum(1 for s in smoothed_scores if s <= 0.5)
        fake_frames = len(smoothed_scores) - authentic_frames
        
        return {
            'prediction': prediction,
            'confidence': avg_confidence,
            'authentic_frames': authentic_frames,
            'fake_frames': fake_frames,
            'total_frames': len(frames),
            'frame_predictions': smoothed_scores.tolist(),
            'timestamps': timestamps,
            'fake_segments': fake_segments,
            'model_scores': {
                r['model_name']: {
                    'avg_score': r['avg_score'],
                    'frame_scores': r['frame_scores'],
                    'weight': r['weight']
                }
                for r in model_results
            },
            'duration': timestamps[-1] if timestamps else 0
        }
    
    def _compute_ensemble(self, model_results: List[Dict]) -> np.ndarray:
        ensemble = np.zeros(len(model_results[0]['frame_scores']))
        for result in model_results:
            weight = result['weight']
            scores = np.array(result['frame_scores'])
            ensemble += weight * scores
        return ensemble
    
    def _detect_segments(self, scores: np.ndarray, timestamps: List[float], 
                         threshold: float = 0.5, min_duration: float = 0.5) -> List[Dict]:
        segments = []
        in_fake = False
        start_idx = None
        for i, score in enumerate(scores):
            if score > threshold and not in_fake:
                start_idx = i
                in_fake = True
            elif score <= threshold and in_fake:
                duration = timestamps[i] - timestamps[start_idx]
                if duration >= min_duration:
                    segments.append({
                        'start': round(timestamps[start_idx], 2),
                        'end': round(timestamps[i], 2),
                        'confidence': round(float(np.mean(scores[start_idx:i])), 3),
                        'duration': round(duration, 2)
                    })
                in_fake = False
        return segments
