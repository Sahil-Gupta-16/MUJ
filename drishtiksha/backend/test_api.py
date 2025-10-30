import requests
import json
import time
from pathlib import Path

BASE_URL = "http://localhost:3000"
VIDEO_FILE = "../Untitled.mp4"  # Adjust path if needed
MAX_FRAMES_TO_SHOW = 3


def print_header(text):
    print(f"\n{'='*70}\n  {text}\n{'='*70}\n")


def print_success(text):
    print(f"✅ {text}")


def print_error(text):
    print(f"❌ {text}")


def print_info(text):
    print(f"ℹ️  {text}")


def truncate_frames(data, max_frames=MAX_FRAMES_TO_SHOW):
    """Show only first N frames in output"""
    if 'frame_analysis' in data:
        total = len(data['frame_analysis'])
        data['frame_analysis'] = data['frame_analysis'][:max_frames]
        data['_frames_info'] = f"[Showing {max_frames} of {total} frames]"
    return data


# ============ ENDPOINT 1: /api/analyze (Force new analysis) ============
def test_endpoint_1():
    print_header("ENDPOINT 1: POST /api/analyze (Force New Analysis)")
    
    try:
        with open(VIDEO_FILE, 'rb') as f:
            resp = requests.post(f"{BASE_URL}/api/analyze", files={'file': f})
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return None
        
        data = truncate_frames(resp.json())
        
        print_success("Force analysis completed")
        print_info(f"Verdict: {data['verdict']}")
        print_info(f"Confidence: {data['confidence']:.2%}")
        print_info(f"Is Cached: {data['is_cached']}")
        print_info(f"Video: {data['video_info']['total_frames']} frames")
        
        return data['analysis_id']
    
    except Exception as e:
        print_error(str(e))
        return None


# ============ ENDPOINT 2: /api/analyze/cached (Smart with cache) ============
def test_endpoint_2():
    print_header("ENDPOINT 2: POST /api/analyze/cached (Smart with Cache)")
    
    try:
        with open(VIDEO_FILE, 'rb') as f:
            start = time.time()
            resp = requests.post(f"{BASE_URL}/api/analyze/cached", files={'file': f})
            elapsed = time.time() - start
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return False
        
        data = truncate_frames(resp.json())
        
        print_success("Smart analysis completed")
        print_info(f"Is Cached: {data['is_cached']} (took {elapsed:.2f}s)")
        print_info(f"Verdict: {data['verdict']}")
        print_info(f"Confidence: {data['confidence']:.2%}")
        
        if data['is_cached']:
            print_success("✓ Cache HIT!")
        else:
            print_info("Cache miss - new analysis performed")
        
        return True
    
    except Exception as e:
        print_error(str(e))
        return False


# ============ ENDPOINT 3: /api/videos (List all videos) ============
def test_endpoint_3():
    print_header("ENDPOINT 3: GET /api/videos (List All Videos)")
    
    try:
        resp = requests.get(f"{BASE_URL}/api/videos?limit=5&offset=0")
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return None
        
        data = resp.json()
        
        print_success("Video list retrieved")
        print_info(f"Total Videos: {data['total']}")
        print_info(f"Showing: {len(data['videos'])} videos")
        
        if data['videos']:
            print("\nVideos:")
            for v in data['videos']:
                print(f"  • ID {v['id']}: {v['filename']} - {v['overall_prediction']} ({v['overall_confidence']:.2%})")
                
            return data['videos'][0]['id']
        
        return None
    
    except Exception as e:
        print_error(str(e))
        return None


# ============ ENDPOINT 4: /api/videos/{video_id} (Get full report) ============
def test_endpoint_4(video_id):
    print_header(f"ENDPOINT 4: GET /api/videos/{video_id} (Get Full Report)")
    
    if not video_id:
        print_error("No video ID provided")
        return False
    
    try:
        resp = requests.get(f"{BASE_URL}/api/videos/{video_id}")
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return False
        
        data = truncate_frames(resp.json())
        
        print_success("Full report retrieved")
        print_info(f"Verdict: {data['verdict']}")
        print_info(f"Confidence: {data['confidence']:.2%}")
        print_info(f"Continuous Segments: {data['statistics']['total_segments']}")
        print_info(f"Total Frames: {data['video_info']['total_frames']}")
        
        if data.get('continuous_fake_segments'):
            print("\nFake Segments:")
            for seg in data['continuous_fake_segments'][:2]:
                print(f"  • Segment {seg['segment_id']}: Frames {seg['start_frame']}-{seg['end_frame']} ({seg['duration_seconds']:.2f}s, avg conf: {seg['avg_confidence']:.2%})")
        
        return True
    
    except Exception as e:
        print_error(str(e))
        return False


# ============ ENDPOINT 5: /api/videos/search (Search videos) ============
def test_endpoint_5():
    print_header("ENDPOINT 5: GET /api/videos/search (Search Videos)")
    
    try:
        resp = requests.get(
            f"{BASE_URL}/api/videos/search",
            params={
                'prediction': 'FAKE',
                'confidence_min': 0.5,
                'limit': 5
            }
        )
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return False
        
        data = resp.json()
        
        print_success("Search completed")
        print_info(f"Query: {data['query']}")
        print_info(f"Results: {data['total']} videos found")
        
        if data['videos']:
            print(f"\nResults ({len(data['videos'])} shown):")
            for v in data['videos']:
                print(f"  • {v['filename']} - {v['overall_prediction']} ({v['overall_confidence']:.2%})")
        else:
            print_info("No matching videos")
        
        return True
    
    except Exception as e:
        print_error(str(e))
        return False


# ============ ENDPOINT 6: /api/stats (Dashboard statistics) ============
def test_endpoint_6():
    print_header("ENDPOINT 6: GET /api/stats (Dashboard Statistics)")
    
    try:
        resp = requests.get(f"{BASE_URL}/api/stats")
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return False
        
        data = resp.json()
        
        print_success("Statistics retrieved")
        print_info(f"Total Videos Analyzed: {data['total_videos_analyzed']}")
        print_info(f"Fake Videos: {data['total_fake_videos']}")
        print_info(f"Real Videos: {data['total_real_videos']}")
        print_info(f"Fake Percentage: {data['fake_percentage']:.1f}%")
        print_info(f"Avg Confidence (Fake): {data['avg_confidence_fake']:.4f}")
        print_info(f"Avg Confidence (Real): {data['avg_confidence_real']:.4f}")
        
        return True
    
    except Exception as e:
        print_error(str(e))
        return False


# ============ ENDPOINT 7: /api/extension/check (Extension check) ============
def test_endpoint_7():
    print_header("ENDPOINT 7: POST /api/extension/check (Extension Check)")
    
    try:
        with open(VIDEO_FILE, 'rb') as f:
            resp = requests.post(f"{BASE_URL}/api/extension/check", files={'file': f})
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return False
        
        data = truncate_frames(resp.json())
        
        print_success("Extension check completed")
        print_info(f"Verdict: {data['verdict']}")
        print_info(f"Confidence: {data['confidence']:.2%}")
        print_info(f"Message: {data['message']}")
        print_info(f"Is Cached: {data['is_cached']}")
        
        return True
    
    except Exception as e:
        print_error(str(e))
        return False


# ============ ENDPOINT 8: /api/health (Health check) ============
def test_endpoint_8():
    print_header("ENDPOINT 8: GET /api/health (Health Check)")
    
    try:
        resp = requests.get(f"{BASE_URL}/api/health")
        
        if resp.status_code != 200:
            print_error(f"Status {resp.status_code}")
            return False
        
        data = resp.json()
        
        print_success("Server is healthy")
        print_info(f"Status: {data['status']}")
        print_info(f"Version: {data['version']}")
        print_info(f"Database: {data['database']}")
        
        return True
    
    except Exception as e:
        print_error(str(e))
        return False


# ============ MAIN ============
if __name__ == '__main__':
    print("\n" + "="*70)
    print("  🧪 DRISHTIKSHA API - 8 NEW ENDPOINTS TEST 🧪")
    print("="*70)
    
    results = {}
    
    # Check server
    print_header("PRE-TEST: Checking server")
    for i in range(5):
        try:
            requests.get(f"{BASE_URL}/api/health", timeout=2)
            print_success("Server is running ✓")
            break
        except:
            if i < 4:
                print_info(f"Waiting... ({i+1}/5)")
                time.sleep(1)
            else:
                print_error("Server not responding")
                exit(1)
    
    # Run tests
    try:
        results['1. Health Check'] = test_endpoint_8()
        results['2. Force Analysis'] = test_endpoint_1() is not None
        results['3. Cached Analysis'] = test_endpoint_2()
        
        video_id = test_endpoint_3()
        results['4. List Videos'] = video_id is not None
        results['5. Get Video Report'] = test_endpoint_4(video_id)
        results['6. Search Videos'] = test_endpoint_5()
        results['7. Dashboard Stats'] = test_endpoint_6()
        results['8. Extension Check'] = test_endpoint_7()
        
        # Summary
        print_header("📊 TEST SUMMARY")
        
        passed = sum(1 for v in results.values() if v)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅" if result else "❌"
            print(f"{status} {test_name}")
        
        print(f"\n{'='*70}")
        print(f"RESULT: {passed}/{total} tests passed")
        print(f"{'='*70}\n")
        
        if passed == total:
            print_success("🎉 ALL TESTS PASSED! 🎉\n")
        
    except Exception as e:
        print_error(f"Fatal: {e}\n")
