from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import cv2
import numpy as np
import torch
from pathlib import Path
import uuid
import json
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Optional

from video_sign.signature_manager import VideoSignatureManager
from video_sign.utils import compute_video_hash, build_report_json
from services.ensemble import EnsembleAnalyzer
from services.learned_router import ConfidenceRouter


# PostgreSQL config
DB_CONFIG = {
    "dbname": "videosign_db",
    "user": "videosign",
    "password": "secure_pass",
    "host": "localhost",
    "port": 5432,
}


import random

class FrameAnalysisEngine:
    def __init__(self, sig_manager, analyze_frames=5):
        self.analyzer = EnsembleAnalyzer()
        self.router = ConfidenceRouter()
        try:
            self.router.load_state_dict(torch.load('learned_router.pth'))
            self.router.eval()
        except:
            print("Warning: Could not load learned_router.pth")
        self.sig_manager = sig_manager
        self.analyze_frames = analyze_frames  # ← Only analyze 5 frames
    
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
        
        # ← SELECT ONLY 5 RANDOM FRAMES
        if len(frames) > self.analyze_frames:
            indices = sorted(random.sample(range(len(frames)), self.analyze_frames))
            selected_frames = [frames[i] for i in indices]
            selected_timestamps = [timestamps[i] for i in indices]
        else:
            selected_frames = frames
            selected_timestamps = timestamps
            indices = list(range(len(frames)))
        
        # Analyze only selected frames
        result = self.analyzer.analyze_video(selected_frames, selected_timestamps)
        
        frame_details = []
        for idx, (frame, ts, original_idx) in enumerate(zip(selected_frames, selected_timestamps, indices)):
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
                'frame_number': original_idx,  # Original frame number
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
        avg_confidence = np.mean([f['confidence'] for f in frame_details]) if frame_details else 0
        
        return {
            'video_info': {
                'total_frames': len(frames),  # Total frames in video
                'analyzed_frames': len(frame_details),  # Frames we analyzed
                'fps': round(fps, 2),
                'duration_seconds': round(len(frames) / fps, 2) if fps > 0 else 0
            },
            'summary': {
                'overall_prediction': 'FAKE' if avg_confidence > 0.5 else 'REAL',
                'overall_confidence': round(float(avg_confidence), 4),
                'authentic_frames': real_frames,
                'deepfake_frames': fake_frames,
                'fake_percentage': round(fake_frames / len(frame_details) * 100, 2) if frame_details else 0
            },
            'frame_analysis': frame_details
        }



# ============ LIFESPAN MANAGER ============
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Initializing Deepfake Detection API...")
    app.state.sig_manager = VideoSignatureManager(DB_CONFIG)
    app.state.engine = FrameAnalysisEngine(app.state.sig_manager)
    print("✓ API Ready")
    
    yield
    
    # Shutdown
    print("Shutting down...")


# ============ FASTAPI APP ============
app = FastAPI(
    title="Drishtiksha Deepfake Detection API",
    description="Complete deepfake detection system with 8 endpoints",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ ENDPOINT 1: /api/analyze (Force new analysis) ============
@app.post("/api/analyze")
async def analyze_video(file: UploadFile = File(...)):
    """Force new analysis - always runs models even if cached"""
    temp_path = f"/tmp/{uuid.uuid4()}.mp4"
    
    try:
        file_data = await file.read()
        with open(temp_path, "wb") as f:
            f.write(file_data)
        
        # Always run analysis (ignore cache)
        result = app.state.engine.analyze_video_detailed(temp_path)
        video_hash = compute_video_hash(file_data)
        save_result = app.state.sig_manager.save_analysis(video_hash, file.filename, len(file_data), result)
        
        analysis_id = save_result['analysis_id']
        report = build_report_json(result, analysis_id, is_cached=False)
        report['filename'] = file.filename
        report['file_size'] = len(file_data)
        
        return report
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if Path(temp_path).exists():
            Path(temp_path).unlink()


# ============ ENDPOINT 2: /api/analyze/cached (Smart analyze with cache) ============
@app.post("/api/analyze/cached")
async def analyze_video_cached(file: UploadFile = File(...)):
    """Smart analyze - checks cache first, then analyzes if needed"""
    temp_path = f"/tmp/{uuid.uuid4()}.mp4"
    
    try:
        file_data = await file.read()
        with open(temp_path, "wb") as f:
            f.write(file_data)
        
        video_hash = compute_video_hash(file_data)
        
        # Check if analysis already exists
        cached = app.state.sig_manager.get_analysis_by_video_hash(video_hash)
        if cached:
            analysis_json = json.loads(cached['analysis_json']) if isinstance(cached['analysis_json'], str) else cached['analysis_json']
            report = build_report_json(analysis_json, cached['analysis_id'], is_cached=True)
            return report
        
        # Run new analysis
        result = app.state.engine.analyze_video_detailed(temp_path)
        save_result = app.state.sig_manager.save_analysis(video_hash, file.filename, len(file_data), result)
        
        analysis_id = save_result['analysis_id']
        report = build_report_json(result, analysis_id, is_cached=False)
        report['filename'] = file.filename
        report['file_size'] = len(file_data)
        
        return report
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if Path(temp_path).exists():
            Path(temp_path).unlink()


# ============ ENDPOINT 3: /api/videos (List all videos) ============
@app.get("/api/videos")
async def list_videos(limit: int = Query(50), offset: int = Query(0)):
    """List all analyzed videos with summaries"""
    try:
        data = app.state.sig_manager.get_all_signatures(limit=limit, offset=offset)
        
        if data is None:
            raise HTTPException(status_code=500, detail="Database error")
        
        return {
            'status': 'success',
            'total': data['total'],
            'limit': limit,
            'offset': offset,
            'videos': [
                {
                    'id': v['id'],
                    'filename': v['filename'],
                    'overall_prediction': v['overall_prediction'],
                    'overall_confidence': v['overall_confidence'],
                    'created_at': str(v['created_at']) if v['created_at'] else None
                }
                for v in data['videos']
            ]
        }
    except Exception as e:
        print(f"Error in list_videos: {e}")
        raise HTTPException(status_code=500, detail=str(e))





# ============ ENDPOINT 5: /api/videos/search (Search videos) ============
@app.get("/api/videos/search")
async def search_videos(
    prediction: Optional[str] = Query(None),
    confidence_min: Optional[float] = Query(None),
    confidence_max: Optional[float] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0)
):
    """Search videos by prediction type and confidence range"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        where_clauses = []
        params = []
        
        if prediction and prediction.strip():
            where_clauses.append("ar.overall_prediction = %s")
            params.append(prediction.upper().strip())
        
        if confidence_min is not None:
            where_clauses.append("ar.overall_confidence >= %s")
            params.append(float(confidence_min))
        
        if confidence_max is not None:
            where_clauses.append("ar.overall_confidence <= %s")
            params.append(float(confidence_max))
        
        where_clause = " AND ".join(where_clauses) if where_clauses else "1=1"
        
        query = f"""
            SELECT vs.id, vs.filename, vs.file_size, vs.created_at,
                   ar.overall_prediction, ar.overall_confidence
            FROM video_signatures vs
            LEFT JOIN LATERAL (
                SELECT overall_prediction, overall_confidence
                FROM analysis_results
                WHERE video_signature_id = vs.id
                ORDER BY created_at DESC
                LIMIT 1
            ) ar ON TRUE
            WHERE {where_clause}
            ORDER BY vs.created_at DESC 
            LIMIT %s OFFSET %s
        """
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        # Get total count
        count_query = f"""
            SELECT COUNT(*) as total FROM video_signatures vs
            LEFT JOIN LATERAL (
                SELECT overall_prediction, overall_confidence
                FROM analysis_results
                WHERE video_signature_id = vs.id
                ORDER BY created_at DESC
                LIMIT 1
            ) ar ON TRUE
            WHERE {where_clause}
        """
        cursor.execute(count_query, params[:-2])
        total = cursor.fetchone()['total']
        
        cursor.close()
        conn.close()
        
        return {
            'status': 'success',
            'total': total,
            'limit': limit,
            'offset': offset,
            'query': {
                'prediction': prediction,
                'confidence_min': confidence_min,
                'confidence_max': confidence_max
            },
            'videos': [dict(r) for r in results]
        }
    
    except Exception as e:
        print(f"Error in search_videos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============ ENDPOINT 4: /api/videos/{video_id} (Get full report) ============
@app.get("/api/videos/{video_id}")
async def get_video_report(video_id: int):
    """Get full report (REPORT JSON) of a stored video"""
    try:
        data = app.state.sig_manager.get_signature_detail(video_id)
        
        if data is None or data.get('analysis_json') is None:
            raise HTTPException(status_code=404, detail="Video or analysis not found")
        
        analysis_json = json.loads(data['analysis_json']) if isinstance(data['analysis_json'], str) else data['analysis_json']
        
        report = build_report_json(analysis_json, video_id, is_cached=True)
        report['filename'] = data['filename']
        report['file_size'] = data['file_size']
        
        return report
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_video_report: {e}")
        raise HTTPException(status_code=500, detail=str(e))



# ============ ENDPOINT 6: /api/stats (Dashboard statistics) ============
@app.get("/api/stats")
async def get_statistics():
    """Get dashboard statistics"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get total videos
        cursor.execute("SELECT COUNT(*) as total FROM video_signatures")
        total = cursor.fetchone()['total']
        
        # Get fake/real counts
        cursor.execute("""
            SELECT 
                overall_prediction,
                COUNT(*) as count,
                AVG(overall_confidence) as avg_conf
            FROM analysis_results
            GROUP BY overall_prediction
        """)
        predictions = cursor.fetchall()
        
        fake_count = 0
        real_count = 0
        fake_avg = 0
        real_avg = 0
        
        for pred in predictions:
            if pred['overall_prediction'] == 'FAKE':
                fake_count = pred['count']
                fake_avg = pred['avg_conf']
            elif pred['overall_prediction'] == 'REAL':
                real_count = pred['count']
                real_avg = pred['avg_conf']
        
        # Get recent analysis
        cursor.execute("""
            SELECT vs.id, vs.filename, ar.overall_prediction, ar.overall_confidence, ar.created_at
            FROM video_signatures vs
            LEFT JOIN analysis_results ar ON vs.id = ar.video_signature_id
            ORDER BY ar.created_at DESC
            LIMIT 10
        """)
        recent = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return {
            'status': 'success',
            'total_videos_analyzed': total,
            'total_fake_videos': fake_count,
            'total_real_videos': real_count,
            'avg_confidence_fake': round(fake_avg, 4) if fake_avg else 0,
            'avg_confidence_real': round(real_avg, 4) if real_avg else 0,
            'fake_percentage': round((fake_count / total * 100), 2) if total > 0 else 0,
            'recent_analysis': [dict(r) for r in recent]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============ ENDPOINT 7: /api/extension/check (Extension quick check) ============
@app.post("/api/extension/check")
async def extension_check(file: UploadFile = File(...)):
    """Extension endpoint - returns full REPORT JSON"""
    temp_path = f"/tmp/{uuid.uuid4()}.mp4"
    
    try:
        file_data = await file.read()
        with open(temp_path, "wb") as f:
            f.write(file_data)
        
        video_hash = compute_video_hash(file_data)
        
        # Check cache first
        cached = app.state.sig_manager.get_analysis_by_video_hash(video_hash)
        if cached:
            analysis_json = json.loads(cached['analysis_json']) if isinstance(cached['analysis_json'], str) else cached['analysis_json']
            report = build_report_json(analysis_json, cached['analysis_id'], is_cached=True)
            return report
        
        # Run analysis
        result = app.state.engine.analyze_video_detailed(temp_path)
        save_result = app.state.sig_manager.save_analysis(video_hash, file.filename, len(file_data), result)
        
        analysis_id = save_result['analysis_id']
        report = build_report_json(result, analysis_id, is_cached=False)
        report['filename'] = file.filename
        
        return report
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if Path(temp_path).exists():
            Path(temp_path).unlink()


# ============ ENDPOINT 8: /api/health (Server status) ============
@app.get("/api/health")
async def health_check():
    """Server health check"""
    return {
        'status': 'ok',
        'version': '1.0',
        'timestamp': datetime.now().isoformat(),
        'database': 'connected'
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=3000)
