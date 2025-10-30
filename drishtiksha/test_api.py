import requests
import json
import time
from pathlib import Path
import cv2
import numpy as np

# Configuration
BASE_URL = "http://localhost:3000"
TEST_VIDEO_PATH = "test_video.mp4"

# Colors for console output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ {msg}{Colors.RESET}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.RESET}")

def create_test_video(filename="test_video.mp4", duration_seconds=5, fps=30):
    """Create a simple test video file"""
    print_info(f"Creating test video: {filename}")
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(filename, fourcc, fps, (640, 480))
    
    total_frames = duration_seconds * fps
    for i in range(total_frames):
        # Create a frame with changing colors
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        frame[:, :] = (i % 255, (i * 2) % 255, (i * 3) % 255)
        
        # Add some text
        cv2.putText(frame, f"Frame {i}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2)
        out.write(frame)
    
    out.release()
    print_success(f"Test video created: {filename}")

def test_health():
    """Test 1: Health check endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST 1: Health Check")
    print(f"{'='*60}{Colors.RESET}")
    
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print_success(f"Health check passed: {response.json()}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Connection error: {e}")
        return False

def test_original_analyze():
    """Test 2: Original analyze endpoint"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST 2: Original Analyze Endpoint")
    print(f"{'='*60}{Colors.RESET}")
    
    if not Path(TEST_VIDEO_PATH).exists():
        create_test_video(TEST_VIDEO_PATH)
    
    try:
        with open(TEST_VIDEO_PATH, 'rb') as f:
            files = {'file': f}
            print_info("Uploading video to /api/analyze...")
            response = requests.post(f"{BASE_URL}/api/analyze", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Analysis completed")
            print_info(f"  Status: {data.get('status')}")
            print_info(f"  Overall Prediction: {data['summary']['overall_prediction']}")
            print_info(f"  Overall Confidence: {data['summary']['overall_confidence']}")
            print_info(f"  Fake Frames: {data['summary']['deepfake_frames']}")
            return data.get('analysis_id')
        else:
            print_error(f"Analysis failed: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print_error(f"Error: {e}")
        return None

def test_signature_analyze():
    """Test 3: Signature analyze endpoint (first run)"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST 3: Signature Analyze (First Run)")
    print(f"{'='*60}{Colors.RESET}")
    
    if not Path(TEST_VIDEO_PATH).exists():
        create_test_video(TEST_VIDEO_PATH)
    
    try:
        with open(TEST_VIDEO_PATH, 'rb') as f:
            files = {'file': f}
            print_info("Uploading video to /api/signature/analyze (first time)...")
            response = requests.post(f"{BASE_URL}/api/signature/analyze", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Signature analysis completed")
            print_info(f"  Status: {data.get('status')}")
            print_info(f"  Video Hash: {data.get('video_hash', 'N/A')[:16]}...")
            print_info(f"  Signature ID: {data.get('signature_id')}")
            print_info(f"  Overall Prediction: {data['summary']['overall_prediction']}")
            print_info(f"  Overall Confidence: {data['summary']['overall_confidence']}")
            return data.get('signature_id'), data.get('video_hash')
        else:
            print_error(f"Signature analysis failed: {response.status_code}")
            print(response.text)
            return None, None
    except Exception as e:
        print_error(f"Error: {e}")
        return None, None

def test_signature_analyze_cached(video_hash):
    """Test 4: Signature analyze endpoint (cached - should return instantly)"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST 4: Signature Analyze (Cached Run)")
    print(f"{'='*60}{Colors.RESET}")
    
    if not Path(TEST_VIDEO_PATH).exists():
        create_test_video(TEST_VIDEO_PATH)
    
    try:
        start_time = time.time()
        with open(TEST_VIDEO_PATH, 'rb') as f:
            files = {'file': f}
            print_info("Uploading SAME video to /api/signature/analyze (should be cached)...")
            response = requests.post(f"{BASE_URL}/api/signature/analyze", files=files)
        
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Signature analysis completed in {elapsed_time:.2f}s")
            print_info(f"  Status: {data.get('status')}")
            
            if data.get('status') == 'cached':
                print_success(f"✓ CACHE HIT - Result returned from database!")
                print_warning(f"  Elapsed time: {elapsed_time:.2f}s (should be much faster than first run)")
            else:
                print_warning(f"  New analysis (not cached)")
            
            return True
        else:
            print_error(f"Signature analysis failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_list_signatures():
    """Test 5: List all signatures"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST 5: List All Signatures")
    print(f"{'='*60}{Colors.RESET}")
    
    try:
        print_info("Fetching signatures list...")
        response = requests.get(f"{BASE_URL}/api/signature/list?limit=10&offset=0")
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Signatures retrieved")
            print_info(f"  Total videos: {data['total_videos']}")
            print_info(f"  Videos in response: {len(data['videos'])}")
            
            if data['videos']:
                print_info("  Recent videos:")
                for i, video in enumerate(data['videos'][:3], 1):
                    print_info(f"    {i}. {video['filename']} - {video['overall_prediction']} ({video['overall_confidence']:.2%})")
            
            return data['videos']
        else:
            print_error(f"Failed to list signatures: {response.status_code}")
            return None
    except Exception as e:
        print_error(f"Error: {e}")
        return None

def test_get_signature_detail(signature_id):
    """Test 6: Get specific signature detail"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST 6: Get Signature Detail")
    print(f"{'='*60}{Colors.RESET}")
    
    if signature_id is None:
        print_warning("Skipping - no signature ID available")
        return False
    
    try:
        print_info(f"Fetching signature detail for ID: {signature_id}")
        response = requests.get(f"{BASE_URL}/api/signature/{signature_id}")
        
        if response.status_code == 200:
            data = response.json()
            sig = data['signature']
            print_success(f"Signature detail retrieved")
            print_info(f"  Filename: {sig['filename']}")
            print_info(f"  File Size: {sig['file_size']} bytes")
            print_info(f"  Duration: {sig['duration_seconds']:.2f}s")
            print_info(f"  FPS: {sig['fps']}")
            print_info(f"  Total Frames: {sig['total_frames']}")
            print_info(f"  Overall Prediction: {sig['overall_prediction']}")
            print_info(f"  Overall Confidence: {sig['overall_confidence']:.4f}")
            
            return True
        else:
            print_error(f"Failed to get signature detail: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_query_by_hash(video_hash):
    """Test 7: Query by video hash"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST 7: Query by Video Hash")
    print(f"{'='*60}{Colors.RESET}")
    
    if video_hash is None:
        print_warning("Skipping - no video hash available")
        return False
    
    try:
        print_info(f"Querying by hash: {video_hash[:16]}...")
        response = requests.get(f"{BASE_URL}/api/signature/query?video_hash={video_hash}")
        
        if response.status_code == 200:
            data = response.json()
            analysis = data['analysis']
            print_success(f"Query by hash successful")
            print_info(f"  Analysis ID: {analysis['analysis_id']}")
            print_info(f"  Overall Prediction: {analysis['overall_prediction']}")
            print_info(f"  Overall Confidence: {analysis['overall_confidence']:.4f}")
            print_info(f"  Authentic Frames: {analysis['authentic_frames']}")
            print_info(f"  Deepfake Frames: {analysis['deepfake_frames']}")
            print_info(f"  Fake Percentage: {analysis['fake_percentage']:.2f}%")
            
            return True
        else:
            print_error(f"Failed to query by hash: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print(f"\n{Colors.BLUE}{'*'*60}")
    print("DRISHTIKSHA API TEST SUITE")
    print(f"{'*'*60}{Colors.RESET}")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Video: {TEST_VIDEO_PATH}\n")
    
    # Wait for server to be ready
    print_warning("Waiting for server to be ready...")
    for i in range(30):
        try:
            response = requests.get(f"{BASE_URL}/api/health", timeout=2)
            if response.status_code == 200:
                break
        except:
            pass
        if i > 0 and i % 5 == 0:
            print_info(f"  Still waiting... ({i}s)")
        time.sleep(1)
    
    results = {}
    
    # Test 1: Health
    results['Health Check'] = test_health()
    
    if not results['Health Check']:
        print_error("\nServer is not running. Please start the server first.")
        print_info("Run: python -m services.train_weights")
        return
    
    # Test 2: Original analyze
    results['Original Analyze'] = test_original_analyze() is not None
    
    # Test 3: Signature analyze (first run)
    sig_id, vid_hash = test_signature_analyze()
    results['Signature Analyze (New)'] = sig_id is not None
    
    # Test 4: Signature analyze (cached)
    results['Signature Analyze (Cached)'] = test_signature_analyze_cached(vid_hash)
    
    # Test 5: List signatures
    videos = test_list_signatures()
    results['List Signatures'] = videos is not None
    
    # Test 6: Get signature detail
    if sig_id:
        results['Get Signature Detail'] = test_get_signature_detail(sig_id)
    else:
        results['Get Signature Detail'] = False
    
    # Test 7: Query by hash
    if vid_hash:
        results['Query by Hash'] = test_query_by_hash(vid_hash)
    else:
        results['Query by Hash'] = False
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}{Colors.RESET}")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{Colors.GREEN}✓ PASS{Colors.RESET}" if result else f"{Colors.RED}✗ FAIL{Colors.RESET}"
        print(f"{status} - {test_name}")
    
    print(f"\n{Colors.BLUE}Total: {passed}/{total} tests passed{Colors.RESET}")
    
    if passed == total:
        print(f"{Colors.GREEN}All tests passed!{Colors.RESET}")
    else:
        print(f"{Colors.YELLOW}Some tests failed. Check the output above.{Colors.RESET}")

if __name__ == "__main__":
    run_all_tests()
