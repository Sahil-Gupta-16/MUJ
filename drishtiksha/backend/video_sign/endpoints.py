from fastapi import APIRouter, File, UploadFile, Query
from fastapi.responses import JSONResponse
from pathlib import Path
import uuid
from datetime import datetime


router = APIRouter(prefix="/api/signature", tags=["signature"])


def setup_signature_routes(sig_manager, engine):
    """Setup video signature routes"""
    
    @router.post("/analyze")
    async def analyze_with_signature(file: UploadFile = File(...)):
        """Analyze video and create signature - returns cached results if exists"""
        temp_path = f"/tmp/{uuid.uuid4()}.mp4"
        
        try:
            file_data = await file.read()
            with open(temp_path, "wb") as f:
                f.write(file_data)
            
            video_hash = sig_manager.compute_video_hash(file_data)
            
            # Check if analysis already exists
            cached = sig_manager.get_analysis_by_video_hash(video_hash)
            if cached:
                return {
                    'status': 'cached',
                    'message': 'Result retrieved from cache',
                    'cached_analysis': cached,
                    'timestamp': datetime.now().isoformat()
                }
            
            # Run new analysis
            result = engine.analyze_video_detailed(temp_path)
            save_result = sig_manager.save_analysis(video_hash, file.filename, len(file_data), result)
            
            return {
                'status': 'completed',
                'video_hash': video_hash,
                'signature_id': save_result['video_signature_id'],
                'analysis_id': save_result['analysis_id'],
                'timestamp': datetime.now().isoformat(),
                **result
            }
        
        except Exception as e:
            return JSONResponse({'error': str(e)}, status_code=500)
        
        finally:
            if Path(temp_path).exists():
                Path(temp_path).unlink()

    @router.get("/list")
    async def list_signatures(limit: int = Query(50), offset: int = Query(0)):
        """Get all stored video signatures with analysis summary"""
        data = sig_manager.get_all_signatures(limit=limit, offset=offset)
        
        if data is None:
            return JSONResponse({'error': 'Database error'}, status_code=500)
        
        return {
            'status': 'success',
            'total_videos': data['total'],
            'limit': limit,
            'offset': offset,
            'videos': data['videos']
        }

    @router.get("/{video_sig_id}")
    async def get_signature_detail(video_sig_id: int):
        """Get detailed analysis for a specific signature"""
        data = sig_manager.get_signature_detail(video_sig_id)
        
        if data is None:
            return JSONResponse({'error': 'Signature not found'}, status_code=404)
        
        return {
            'status': 'success',
            'signature': data
        }

    @router.get("/query/hash")
    async def query_by_hash(video_hash: str):
        """Query analysis by video hash"""
        cached = sig_manager.get_analysis_by_video_hash(video_hash)
        
        if cached is None:
            return JSONResponse({'error': 'Video hash not found'}, status_code=404)
        
        return {
            'status': 'found',
            'analysis': cached
        }
