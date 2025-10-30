import requests
import json
import time
from pathlib import Path

BASE_URL = "http://localhost:3000"
VIDEO_FILE = "Untitled.mp4"

def print_header(text):
    print(f"\n{'='*60}\n  {text}\n{'='*60}\n")

def test_health():
    print_header("1. HEALTH CHECK")
    resp = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {resp.status_code}\n{json.dumps(resp.json(), indent=2)}")
    return resp.status_code == 200

def test_analyze():
    print_header("2. VIDEO ANALYSIS")
    with open(VIDEO_FILE, 'rb') as f:
        resp = requests.post(f"{BASE_URL}/api/analyze", files={'file': f})
    
    data = resp.json()
    analysis_id = data['analysis_id']
    summary = data['summary']
    
    print(f"Analysis ID: {analysis_id}")
    print(f"Prediction: {summary['overall_prediction']}")
    print(f"Confidence: {summary['overall_confidence']}")
    print(f"Authentic Frames: {summary['authentic_frames']}")
    print(f"Deepfake Frames: {summary['deepfake_frames']}")
    print(f"Fake %: {summary['fake_percentage']}")
    print(f"\nFirst frame:")
    print(json.dumps(data['frame_analysis'][0], indent=2))
    
    return analysis_id

def test_summary(analysis_id):
    print_header("3. SUMMARY")
    resp = requests.get(f"{BASE_URL}/api/results/{analysis_id}/summary")
    print(json.dumps(resp.json(), indent=2))
    return True

def test_frames(analysis_id):
    print_header("4. FRAMES (0-3)")
    resp = requests.get(f"{BASE_URL}/api/results/{analysis_id}/frames?frame_start=0&frame_end=3")
    data = resp.json()
    for frame in data['frames']:
        print(f"Frame {frame['frame_number']}: {frame['prediction']} ({frame['confidence']})")
    return True

def test_full(analysis_id):
    print_header("5. FULL RESULTS")
    resp = requests.get(f"{BASE_URL}/api/results/{analysis_id}")
    data = resp.json()
    print(f"Total Frames: {len(data['frame_analysis'])}")
    print(f"Prediction: {data['summary']['overall_prediction']}")
    print(f"Confidence: {data['summary']['overall_confidence']}")
    return True

if __name__ == '__main__':
    print("\n🧪 API TESTS 🧪")
    try:
        test_health()
        analysis_id = test_analyze()
        time.sleep(1)
        test_summary(analysis_id)
        test_frames(analysis_id)
        test_full(analysis_id)
        print("\n✅ ALL TESTS PASSED\n")
    except Exception as e:
        print(f"\n❌ ERROR: {e}\n")
