import torch
import torch.nn as nn
import numpy as np
import cv2
from pathlib import Path
from services.ensemble import EnsembleAnalyzer

class ConfidenceRouter(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(6, 32),
            nn.ReLU(),
            nn.Linear(32, 6)
        )
    
    def forward(self, model_confidences):
        return torch.softmax(self.fc(model_confidences), dim=-1)

class RouterTrainer:
    def __init__(self):
        self.router = ConfidenceRouter()
        self.optimizer = torch.optim.Adam(self.router.parameters(), lr=0.01)
        self.analyzer = EnsembleAnalyzer()
    
    def extract_model_confidences(self, video_path):
        cap = cv2.VideoCapture(video_path)
        frames = []
        while len(frames) < 5:
            ret, frame = cap.read()
            if not ret: break
            frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        cap.release()
        
        if not frames: return np.ones(6) / 6
        
        timestamps = [i * 0.1 for i in range(len(frames))]
        result = self.analyzer.analyze_video(frames, timestamps)
        
        confidences = []
        for model_name, data in result['model_scores'].items():
            conf = abs(data['avg_score'] - 0.5) * 2
            confidences.append(conf)
        
        return np.array(confidences, dtype=np.float32)
    
    def train(self, video_folder, num_epochs=10):
        reals = sorted(Path(video_folder).glob('real_*.mp4'))[:5]
        fakes = sorted(Path(video_folder).glob('fake_*.mp4'))[:5]
        
        print(f"\n🧠 Training Confidence Router on {len(reals)} real + {len(fakes)} fake videos\n")
        
        all_confidences = []
        all_labels = []
        
        for video in reals:
            conf = self.extract_model_confidences(str(video))
            all_confidences.append(conf)
            all_labels.append(0.0)
            print(f"  ✓ {video.name} | Model Confidences: {[f'{c:.2f}' for c in conf[:3]]}...")
        
        for video in fakes:
            conf = self.extract_model_confidences(str(video))
            all_confidences.append(conf)
            all_labels.append(1.0)
            print(f"  ✓ {video.name} | Model Confidences: {[f'{c:.2f}' for c in conf[:3]]}...")
        
        all_confidences = torch.FloatTensor(np.array(all_confidences))
        all_labels = torch.FloatTensor(np.array(all_labels)).unsqueeze(1)
        
        for epoch in range(num_epochs):
            total_loss = 0
            idx = np.random.permutation(len(all_confidences))
            
            for i in idx:
                conf = all_confidences[i:i+1]
                label = all_labels[i:i+1]
                
                weights = self.router(conf)
                weighted_pred = (weights * conf).sum(dim=1, keepdim=True)
                pred = torch.sigmoid(weighted_pred)
                
                loss = nn.BCELoss()(pred, label)
                self.optimizer.zero_grad()
                loss.backward()
                self.optimizer.step()
                total_loss += loss.item()
            
            avg_loss = total_loss / len(all_confidences)
            print(f"Epoch {epoch+1:2d}/{num_epochs} | Loss: {avg_loss:.4f}")
        
        torch.save(self.router.state_dict(), 'learned_router.pth')
        
        print(f"\n✅ Router trained!")
        self.router.eval()
        with torch.no_grad():
            dummy = torch.ones(1, 6)
            final_weights = self.router(dummy).detach().numpy()[0]
            model_names = ['ViT', 'EfficientNet', 'EyeBlink', 'DistilDIRE', 'LipFD', 'MFF-MOE']
            print("\n📊 Learned Router Weights:")
            for name, w in zip(model_names, final_weights):
                print(f"   {name:15s}: {w:.4f}")

trainer = RouterTrainer()
trainer.train('test_videos', num_epochs=10)
