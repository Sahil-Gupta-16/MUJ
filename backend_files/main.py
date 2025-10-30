from deduplicator import VideoDeduplicator

# --- CONFIGURATION ---
# IMPORTANT: Replace with your actual PostgreSQL connection details.
DB_CONFIG = {
    "dbname": "jaipur_db",
    "user": "yeet",
    "password": "8454",
    "host": "localhost",
    "port": "5432",
}

# Define some video URLs for testing
# This is the full, original video
URL_FULL_VIDEO = "/mnt/Windows-SSD/Users/yvavi/yeet/coding/projects/jaipur/m.mp4"
# This is a re-upload of the same video (a duplicate)
URL_DUPLICATE = "/mnt/Windows-SSD/Users/yvavi/yeet/coding/projects/jaipur/m.mp4"
# This is a short clip taken from the original video
URL_SLICE = "/mnt/Windows-SSD/Users/yvavi/yeet/coding/projects/jaipur/m.mp4"
# This is a completely different video
URL_DIFFERENT = "/mnt/Windows-SSD/Users/yvavi/yeet/coding/projects/jaipur/m.mp4"


if __name__ == "__main__":
    # Initialize the deduplicator with a 90% similarity threshold
    # Note: videofingerprint library might have issues with age-restricted content
    # or videos that are not available. Use available video links.
    # The links above might not work forever.

    # Let's use more reliable sample videos
    URL_FULL_VIDEO = "/mnt/Windows-SSD/Users/yvavi/yeet/coding/projects/jaipur/m.mp4"  # 10h of white noise
    URL_SLICE = "/mnt/Windows-SSD/Users/yvavi/yeet/coding/projects/jaipur/m.mp4"  # 10s clip from the above

    dedupe = VideoDeduplicator(db_params=DB_CONFIG, similarity_threshold=90.0)

    print("\n--- 1. UPLOADING THE ORIGINAL FULL VIDEO ---")
    result = dedupe.upload(URL_FULL_VIDEO)
    print(result)

    print("\n--- 2. CHECKING IF THE DUPLICATE EXISTS ---")
    # We expect this to find a very strong match with the original
    result = dedupe.exists(URL_DUPLICATE)
    print(result)

    print("\n--- 4. CHECKING A COMPLETELY DIFFERENT VIDEO ---")
    result = dedupe.exists(URL_DIFFERENT)
    print(result)

    print("\n--- 5. TRYING TO UPLOAD A DUPLICATE (SHOULD BE SKIPPED) ---")
    result = dedupe.upload(URL_DUPLICATE)
    print(result)

    # Clean up the connection
    dedupe.close()
