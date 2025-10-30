from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import torch
from pathlib import Path
import uuid
import json
from datetime import datetime

# Import from video_sign module
from videosign.signature_manager import VideoSignatureManager
from videosign.endpoints import router as signature_router, setup_signature_routes

from services.ensemble import EnsembleAnalyzer
from services.learned_router import ConfidenceRouter


app = FastAPI(title="Drishtiksha Deepfake Detection API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL config
DB_CONFIG = {
    "dbname": "videosign_db",
    "user": "videosign",
    "password": "secure_pass",
    "host": "localhost",
    "port": 5432,
}


class FrameAnalysisEngine:
    def __init__(self, sig_manager):
        self.analyzer = EnsembleAnalyzer()
        self.router = ConfidenceRouter()
        self.router.load_state_dict(torch.load('learned_router.pth'))
        self.router.eval()
        self.sig_manager = sig_manager
    
    def analyze_video_detailed(self, video_path):
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        frames = []
        timestamps = []
        frame_idx = 0
        
        while True:
            ret, frame = cap.read()
            if not ret: break
            frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            timestamps.append(frame_idx / fps)
            frame_idx += 1
        
        cap.release()
        
        result = self.analyzer.analyze_video(frames, timestamps)
        
        frame_details = []
        for idx, (frame, ts) in enumerate(zip(frames, timestamps)):
            model_scores = {}
            confidences = []
            
            for model_name, score in result['model_scores'].items():
                model_scores[model_name] = score['avg_score']
                confidences.append(abs(score['avg_score'] - 0.5) * 2)
            
            confidences = np.array(confidences, dtype=np.float32)
            
            with torch.no_grad():
                learned_weights = self.router(torch.FloatTensor(confidences).unsqueeze(0))[0].numpy()
            
            final_score = (learned_weights * confidences).sum()
            
            frame_details.append({
                'frame_number': idx,
                'timestamp': round(ts, 2),
                'prediction': 'FAKE' if final_score > 0.5 else 'REAL',
                'confidence': round(float(final_score), 4),
                'model_scores': {k: round(v, 4) for k, v in model_scores.items()},
                'learned_weights': {
                    'ViT': round(float(learned_weights[0]), 4),
                    'EfficientNet': round(float(learned_weights[1]), 4),
                    'EyeBlink': round(float(learned_weights[2]), 4),
                    'DistilDIRE': round(float(learned_weights[3]), 4),
                    'LipFD': round(float(learned_weights[4]), 4),
                    'MFF-MOE': round(float(learned_weights[5]), 4),
                }
            })
        
        fake_frames = sum(1 for f in frame_details if f['prediction'] == 'FAKE')
        real_frames = len(frame_details) - fake_frames
        avg_confidence = np.mean([f['confidence'] for f in frame_details])
        
        return {
            'video_info': {
                'total_frames': len(frames),
                'fps': round(fps, 2),
                'duration_seconds': round(len(frames) / fps, 2)
            },
            'summary': {
                'overall_prediction': 'FAKE' if avg_confidence > 0.5 else 'REAL',
                'overall_confidence': round(float(avg_confidence), 4),
                'authentic_frames': real_frames,
                'deepfake_frames': fake_frames,
                'fake_percentage': round(fake_frames / len(frame_details) * 100, 2)
            },
            'frame_analysis': frame_details
        }


# Initialize managers
sig_manager = VideoSignatureManager(DB_CONFIG)
engine = FrameAnalysisEngine(sig_manager)

# Setup routes
setup_signature_routes(sig_manager, engine)
app.include_router(signature_router)


@app.post("/api/analyze")
async def analyze_video(file: UploadFile = File(...)):
    """Original analyze endpoint"""
    analysis_id = str(uuid.uuid4())[:8]
    temp_path = f"/tmp/{analysis_id}.mp4"
    
    file_data = await file.read()
    with open(temp_path, "wb") as f:
        f.write(file_data)
    
    result = engine.analyze_video_detailed(temp_path)
    video_hash = sig_manager.compute_video_hash(file_data)
    sig_manager.save_analysis(video_hash, file.filename, len(file_data), result)
    
    Path(temp_path).unlink()
    
    return {
        'analysis_id': analysis_id,
        'status': 'completed',
        'timestamp': datetime.now().isoformat(),
        **result
    }


@app.get("/api/health")
async def health():
    return {'status': 'ok', 'models_loaded': True}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=3000)
