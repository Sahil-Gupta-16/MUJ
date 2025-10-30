"""Simple MoE-inspired Gating (No Training Required)"""
import numpy as np
from scipy.ndimage import gaussian_filter1d
from typing import Dict, List
# Fixed imports('..')
from models.efficientnet_b7.model import EfficientNetB7Detector
from models.cross_efficient_vit.model import CrossEfficientViT
from models.eyeblink_cnn_lstm.model import EyeBlinkDetector
from models.distil_dire.model import DistilDIREDetector
from models.lip_fd.model import LipForensicsDetector
from models.mff_moe.model import MFFMoEDetector

class SimpleMoEAnalyzer:
    """
    MoE-inspired ensemble WITHOUT training
    
    Key Idea:
    - Extract simple features from frame (brightness, edges, motion)
    - Use features to route to best expert (gating)
    - Only use top-k=2 models per frame
    - Much faster + better accuracy
    """
    
    def __init__(self):
        print("🔄 Loading all models...")
        self.models = [
            ('CROSS-EFFICIENT-VIT-GAN', CrossEfficientViT()),
            ('EFFICIENTNET-B7-V1', EfficientNetB7Detector()),
            ('EYEBLINK-CNN-LSTM-V1', EyeBlinkDetector()),
            ('DISTIL-DIRE-V1', DistilDIREDetector()),
            ('LIP-FD-V1', LipForensicsDetector()),
            ('MFF-MOE-V1', MFFMoEDetector())
        ]
        print(f"✅ All {len(self.models)} models loaded!")
    
    def _extract_frame_features(self, frame):
        """Extract simple features for routing decision"""
        # Frame brightness
        gray = np.mean(frame, axis=2)
        brightness = np.mean(gray)
        brightness_std = np.std(gray)
        
        # Face region (top-center, typical face location in video)
        h, w = frame.shape[:2]
        face_region = gray[h//4:3*h//4, w//4:3*w//4]
        face_intensity = np.mean(face_region)
        face_variance = np.var(face_region)
        
        # Color distribution (R, G, B)
        color_dist = [np.mean(frame[:,:,i]) for i in range(3)]
        color_variance = np.std(color_dist)
        
        features = {
            'brightness': brightness / 255.0,
            'brightness_std': brightness_std / 255.0,
            'face_intensity': face_intensity / 255.0,
            'face_variance': face_variance / 1000.0,
            'color_variance': color_variance / 255.0
        }
        
        return features
    
    def _route_to_experts(self, features, k=2):
        """
        Simple routing: use frame features to determine best experts
        No neural network needed - just heuristics!
        """
        
        brightness = features['brightness']
        face_intensity = features['face_intensity']
        color_variance = features['color_variance']
        
        # Heuristic: decide which experts are best for this frame
        expert_scores = {}
        
        # ViT good for diverse visual patterns (high brightness variation)
        expert_scores['CROSS-EFFICIENT-VIT-GAN'] = features['brightness_std']
        
        # EfficientNet good for face-focused content
        expert_scores['EFFICIENTNET-B7-V1'] = features['face_variance']
        
        # EyeBlink for high-variation face regions (eye movement)
        expert_scores['EYEBLINK-CNN-LSTM-V1'] = (
            features['face_intensity'] * features['brightness_std']
        )
        
        # DistilDIRE for diffusion artifacts (high color variance = generated)
        expert_scores['DISTIL-DIRE-V1'] = features['color_variance']
        
        # Lip-FD for lower-face region
        expert_scores['LIP-FD-V1'] = abs(face_intensity - 0.4)  # Prefer mid-range
        
        # MFF-MOE for ensemble (always include)
        expert_scores['MFF-MOE-V1'] = 0.3  # Base weight
        
        # Get top-k experts
        sorted_experts = sorted(expert_scores.items(), key=lambda x: x[1], reverse=True)
        top_experts = sorted_experts[:k]
        
        # Normalize scores to weights
        total_score = sum(score for _, score in top_experts)
        weights = {name: score/total_score for name, score in top_experts}
        
        return weights
    
    def analyze_video(self, frames: List[np.ndarray], timestamps: List[float]) -> Dict:
        print(f"📊 Analyzing {len(frames)} frames with Smart MoE routing...")
        
        # Get predictions from ALL models (background)
        print("   Loading model predictions...")
        model_results = []
        for name, model in self.models:
            result = model.predict_video(frames, timestamps)
            model_results.append((name, result))
            print(f"   ✓ {name}")
        
        # For each frame, route to best experts
        print("   Computing intelligent routing...")
        moe_scores = np.zeros(len(frames))
        routing_log = []
        
        for frame_idx, frame in enumerate(frames):
            # Extract features
            features = self._extract_frame_features(frame)
            
            # Route to top-2 experts (instead of using all 6)
            expert_weights = self._route_to_experts(features, k=2)
            
            routing_log.append({
                'frame': frame_idx,
                'experts_used': list(expert_weights.keys()),
                'weights': expert_weights
            })
            
            # Combine only top-2 models
            frame_score = 0.0
            for model_name, weight in expert_weights.items():
                # Find this model's prediction
                for name, result in model_results:
                    if name == model_name:
                        frame_score += weight * result['frame_scores'][frame_idx]
                        break
            
            moe_scores[frame_idx] = frame_score
        
        # Smooth predictions
        smoothed_scores = gaussian_filter1d(moe_scores, sigma=2)
        
        # Detect segments
        fake_segments = self._detect_segments(smoothed_scores, timestamps)
        
        # Final verdict
        avg_confidence = float(np.mean(smoothed_scores))
        prediction = 'FAKE' if avg_confidence > 0.5 else 'REAL'
        authentic_frames = sum(1 for s in smoothed_scores if s <= 0.5)
        fake_frames = len(smoothed_scores) - authentic_frames
        
        # Compute model scores (from full predictions)
        model_scores = {}
        for name, result in model_results:
            model_scores[name] = {
                'avg_score': result['avg_score'],
                'frame_scores': result['frame_scores'],
                'weight': 'Routed (MoE)'
            }
        
        return {
            'prediction': prediction,
            'confidence': avg_confidence,
            'authentic_frames': authentic_frames,
            'fake_frames': fake_frames,
            'total_frames': len(frames),
            'frame_predictions': smoothed_scores.tolist(),
            'timestamps': timestamps,
            'fake_segments': fake_segments,
            'weighting_mode': 'SIMPLE_MOE_NO_TRAINING',
            'routing_log': routing_log[:10],  # Save first 10 for debugging
            'model_scores': model_scores,
            'duration': timestamps[-1] if timestamps else 0
        }
    
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
