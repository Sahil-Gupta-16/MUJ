#!/bin/bash

echo "🧪 Testing Drishtiksha API on port 3000"
echo "========================================\n"

echo "1️⃣  Health Check:"
curl http://localhost:3000/api/health
echo -e "\n\n"

echo "2️⃣  Uploading video for analysis..."
RESULT=$(curl -s -X POST -F "file=@Untitled.mp4" http://localhost:3000/api/analyze)
echo "$RESULT" | head -c 500
echo -e "\n\n"

ANALYSIS_ID=$(echo "$RESULT" | grep -o '"analysis_id":"[^"]*' | cut -d'"' -f4)
echo "Analysis ID: $ANALYSIS_ID\n"

echo "3️⃣  Getting full results:"
curl http://localhost:3000/api/results/$ANALYSIS_ID | head -c 300
echo -e "\n\n"

echo "4️⃣  Getting summary:"
curl http://localhost:3000/api/results/$ANALYSIS_ID/summary
echo -e "\n\n"

echo "5️⃣  Getting frames 0-5:"
curl "http://localhost:3000/api/results/$ANALYSIS_ID/frames?frame_start=0&frame_end=5"
echo -e "\n\n"

echo "✅ All tests complete!"
