import torch
import torch.nn as nn
import numpy as np
import json
import cv2
from pathlib import Path
from services.ensemble import EnsembleAnalyzer




class EnsembleWeightOptimizer:
    """Train weights on ensemble loss"""
    
    def __init__(self, num_models=6, lr=0.01, epochs=10):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = nn.Parameter(torch.ones(num_models) / num_models, requires_grad=True)
        self.optimizer = torch.optim.Adam([self.model], lr=lr)
        self.criterion = nn.BCELoss()
        self.epochs = epochs
        self.history = []
    
    def prepare_training_data(self, video_predictions_list):
        self.training_data = video_predictions_list
        print(f"📊 Training data: {len(video_predictions_list)} videos")
    
    def train(self):
        print(f"\n🧠 Training Ensemble Weights ({self.epochs} epochs)")
        print("="*60)
        
        for epoch in range(self.epochs):
            total_loss = 0
            
            for video_idx, video_data in enumerate(self.training_data):
                predictions = torch.FloatTensor(video_data['predictions']).to(self.device)
                true_label = torch.FloatTensor([video_data['label']]).to(self.device)
                
                weights = torch.softmax(self.model, dim=0)
                ensemble_pred = torch.matmul(predictions, weights)
                ensemble_pred_avg = ensemble_pred.mean()
                loss = self.criterion(ensemble_pred_avg, true_label)
                
                self.optimizer.zero_grad()
                loss.backward()
                self.optimizer.step()
                
                total_loss += loss.item()
            
            avg_loss = total_loss / len(self.training_data)
            weights = torch.softmax(self.model, dim=0).detach().cpu().numpy()
            
            self.history.append({
                'epoch': epoch + 1,
                'loss': avg_loss,
                'weights': weights.tolist()
            })
            
            print(f"Epoch {epoch+1:2d}/{self.epochs} | Loss: {avg_loss:.4f}")
            print(f"  Weights: {[f'{w:.3f}' for w in weights]}")
        
        return torch.softmax(self.model, dim=0).detach().cpu().numpy()
    
    def save_weights(self, filepath='learned_weights.json'):
        weights = torch.softmax(self.model, dim=0).detach().cpu().numpy()
        data = {
            'weights': weights.tolist(),
            'model_names': [
                'CROSS-EFFICIENT-VIT-GAN',
                'EFFICIENTNET-B7-V1',
                'EYEBLINK-CNN-LSTM-V1',
                'DISTIL-DIRE-V1',
                'LIP-FD-V1',
                'MFF-MOE-V1'
            ],
            'history': self.history
        }
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"\n💾 Weights saved to: {filepath}")

def extract_all_predictions(video_path, analyzer):
    """Extract predictions from all 6 models for one video"""
    cap = cv2.VideoCapture(video_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(video_fps / 3)
    
    frames = []
    frame_count = 0
    extracted = 0
    
    while cap.isOpened() and extracted < 20:
        ret, frame = cap.read()
        if not ret: break
        
        if frame_count % frame_interval == 0:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(frame_rgb)
            extracted += 1
        frame_count += 1
    
    cap.release()
    
    all_predictions = []
    for model_name, model in analyzer.models:
        preds = []
        for frame in frames:
            pred = model.predict_frame(frame)
            preds.append(pred)
        all_predictions.append(preds)
    
    return np.array(all_predictions).T

def prepare_training_dataset(video_folder, analyzer):
    """Load 10-15 videos for training"""
    training_data = []
    
    real_videos = list(Path(video_folder).glob("real_*.mp4"))[:5]
    for video_path in real_videos:
        try:
            predictions = extract_all_predictions(str(video_path), analyzer)
            training_data.append({
                'predictions': predictions,
                'label': 0,
                'video': str(video_path)
            })
            print(f"  ✓ {video_path.name} (REAL)")
        except Exception as e:
            print(f"  ✗ {video_path.name} failed: {e}")
    
    fake_videos = list(Path(video_folder).glob("fake_*.mp4"))[:5]
    for video_path in fake_videos:
        try:
            predictions = extract_all_predictions(str(video_path), analyzer)
            training_data.append({
                'predictions': predictions,
                'label': 1,
                'video': str(video_path)
            })
            print(f"  ✓ {video_path.name} (FAKE)")
        except Exception as e:
            print(f"  ✗ {video_path.name} failed: {e}")
    
    return training_data

if __name__ == "__main__":
    from services.ensemble import EnsembleAnalyzer
    
    print("="*60)
    print("🧠 TRAINING ENSEMBLE WEIGHTS")
    print("="*60)
    
    analyzer = EnsembleAnalyzer()
    
    print("\n📹 Preparing training data...")
    training_data = prepare_training_dataset("../test_videos", analyzer)
    
    if len(training_data) < 2:
        print("\n❌ Need at least 2 videos! Create:")
        print("   test_videos/real_1.mp4, real_2.mp4, ...")
        print("   test_videos/fake_1.mp4, fake_2.mp4, ...")
        exit(1)
    
    optimizer = EnsembleWeightOptimizer(num_models=6, lr=0.01, epochs=10)
    optimizer.prepare_training_data(training_data)
    final_weights = optimizer.train()
    
    optimizer.save_weights('../learned_weights.json')
    
    print(f"\n✅ Training complete!")
    print(f"Final weights:")
    model_names = [
        'CROSS-EFFICIENT-VIT-GAN',
        'EFFICIENTNET-B7-V1', 
        'EYEBLINK-CNN-LSTM-V1',
        'DISTIL-DIRE-V1',
        'LIP-FD-V1',
        'MFF-MOE-V1'
    ]
    for name, w in zip(model_names, final_weights):
        print(f"  {name}: {w:.4f}")
