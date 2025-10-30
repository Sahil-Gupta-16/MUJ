import hashlib
import json
import numpy as np
from datetime import datetime


def compute_video_hash(video_data):
    """Compute SHA256 hash of video file"""
    return hashlib.sha256(video_data).hexdigest()


def extract_continuous_fake_segments(frame_analysis):
    """Extract continuous segments of fake frames"""
    segments = []
    current_segment = None
    
    for frame in frame_analysis:
        if frame['prediction'] == 'FAKE':
            if current_segment is None:
                # Start new segment
                current_segment = {
                    'start_frame': frame['frame_number'],
                    'start_timestamp': frame['timestamp'],
                    'confidences': [frame['confidence']]
                }
            else:
                # Continue segment
                current_segment['confidences'].append(frame['confidence'])
        else:
            # End segment
            if current_segment is not None:
                current_segment['end_frame'] = frame_analysis[frame['frame_number'] - 1]['frame_number']
                current_segment['end_timestamp'] = frame_analysis[frame['frame_number'] - 1]['timestamp']
                segments.append(current_segment)
                current_segment = None
    
    # Handle last segment
    if current_segment is not None:
        current_segment['end_frame'] = frame_analysis[-1]['frame_number']
        current_segment['end_timestamp'] = frame_analysis[-1]['timestamp']
        segments.append(current_segment)
    
    # Format segments with metrics
    formatted_segments = []
    for i, seg in enumerate(segments, 1):
        confidences = seg['confidences']
        formatted_segments.append({
            'segment_id': i,
            'start_frame': seg['start_frame'],
            'end_frame': seg['end_frame'],
            'start_timestamp': round(seg['start_timestamp'], 2),
            'end_timestamp': round(seg['end_timestamp'], 2),
            'duration_seconds': round(seg['end_timestamp'] - seg['start_timestamp'], 2),
            'avg_confidence': round(float(np.mean(confidences)), 4),
            'max_confidence': round(float(np.max(confidences)), 4),
            'min_confidence': round(float(np.min(confidences)), 4)
        })
    
    return formatted_segments


def build_report_json(analysis_result, analysis_id, is_cached=False):
    """Build complete report JSON with continuous segments"""
    
    frame_analysis = analysis_result['frame_analysis']
    continuous_segments = extract_continuous_fake_segments(frame_analysis)
    
    return {
        'verdict': analysis_result['summary']['overall_prediction'],
        'confidence': analysis_result['summary']['overall_confidence'],
        'is_cached': is_cached,
        'message': f"{analysis_result['summary']['overall_prediction']} detected with {analysis_result['summary']['overall_confidence']:.1%} confidence",
        'timestamp': datetime.now().isoformat(),
        'analysis_id': analysis_id,
        'video_info': {
            'total_frames': analysis_result['video_info']['total_frames'],
            'fps': analysis_result['video_info']['fps'],
            'duration_seconds': analysis_result['video_info']['duration_seconds'],
            'filename': analysis_result.get('filename', 'unknown'),
            'file_size': analysis_result.get('file_size', 0)
        },
        'summary': analysis_result['summary'],
        'continuous_fake_segments': continuous_segments,
        'frame_analysis': frame_analysis,
        'statistics': {
            'max_confidence': max([f['confidence'] for f in frame_analysis]),
            'min_confidence': min([f['confidence'] for f in frame_analysis]),
            'avg_confidence': analysis_result['summary']['overall_confidence'],
            'std_dev': round(float(np.std([f['confidence'] for f in frame_analysis])), 4),
            'total_segments': len(continuous_segments)
        }
    }
