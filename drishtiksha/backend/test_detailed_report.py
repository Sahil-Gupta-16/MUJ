import requests
import json

BASE_URL = "http://localhost:3000"
VIDEO_FILE = "Untitled.mp4"

with open(VIDEO_FILE, 'rb') as f:
    resp = requests.post(f"{BASE_URL}/api/analyze", files={'file': f})

data = resp.json()
analysis_id = data['analysis_id']

# Get detailed report
resp = requests.get(f"{BASE_URL}/api/results/{analysis_id}/detailed-report")
report = resp.json()

print("\n📊 DETAILED REPORT")
print("="*80)
print(f"Analysis ID: {analysis_id}")
print(f"\nSummary:")
for k, v in report['summary'].items():
    print(f"  {k}: {v}")

print(f"\nStatistics:")
for k, v in report['statistics'].items():
    print(f"  {k}: {v}")

print(f"\nScore Distribution (for histogram):")
for bucket, count in zip(report['score_distribution']['buckets'], report['score_distribution']['counts']):
    print(f"  {bucket}: {count}")

print(f"\nFrame Predictions (first 10):")
for pred in report['frame_predictions'][:10]:
    print(f"  Frame {pred['frame']}: {pred['prediction']} ({pred['confidence']:.4f})")

print(f"\nTrend Analysis (windows):")
for trend in report['trend_analysis']['smoothed_trend'][:5]:
    print(f"  {trend['frame_range']}: avg={trend['avg_score']:.4f}")

print("\n✅ All dashboard data ready!")
