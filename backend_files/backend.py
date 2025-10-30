from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pantic import BaseModel, HttpUrl
import uvicorn
from contextlib import asynccontextmanager

from deduplicator import VideoDeduplicator, find_best_match_position
import textdistance

# --- CONFIGURATION ---
DB_CONFIG = {
    "dbname": "jaipur_db",
    "user": "yeet",
    "password": "8454",
    "host": "localhost",
    "port": "5432",
}


# --- Pydantic Model (remains the same) ---
class VideoCheckRequest(BaseModel):
    url: HttpUrl


# --- LIFESPAN MANAGER (The New, Correct Way) ---
# This async context manager will handle startup and shutdown logic.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Code to run on startup ---
    print("Connecting to database and setting up deduplicator...")
    # Store the deduplicator instance in the app's state
    app.state.dedupe = VideoDeduplicator(db_params=DB_CONFIG, similarity_threshold=90.0)
    print("Initialization complete. Server is ready.")

    yield  # The application runs while the lifespan manager is in the 'yield' state

    # --- Code to run on shutdown ---
    print("Closing database connection...")
    if hasattr(app.state, "dedupe") and app.state.dedupe.conn:
        app.state.dedupe.close()


# --- INITIALIZATION ---
print("Initializing FastAPI server...")
# Create the FastAPI app instance and pass our lifespan manager to it
app = FastAPI(
    title="Video Deduplication API",
    description="An API to check for video duplicates and slices.",
    version="1.0.0",
    lifespan=lifespan,  # <-- This is the new, correct way
)

# CORS Middleware (remains the same)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The old @app.on_event("startup") and @app.on_event("shutdown") decorators are removed.


# --- API ENDPOINT (remains exactly the same) ---
@app.post("/check_video")
async def check_video_endpoint(request: VideoCheckRequest):
    """
    This is the API endpoint that the Firefox extension will call.
    It receives a video URL, checks for duplicates, and returns the result.
    """
    video_url = str(request.url)
    print(f"Received request to check URL: {video_url}")

    try:
        result = app.state.dedupe.exists(url=video_url)
        # ... (rest of the verdict logic is identical) ...
        verdict = "Unknown"
        if result.get("is_match"):
            verdict = "DUPLICATE"
        elif result.get("match_type") and "Partial Match" in result["match_type"]:
            verdict = "PARTIAL MATCH (Intro/Outro?)"
        elif result.get("match_type") == "Slice Match" and result.get("is_match"):
            verdict = "SLICE DETECTED"
        elif result.get("is_match") is False:
            verdict = "UNIQUE"
        else:
            verdict = "ERROR CHECKING"

        final_response = {"verdict": verdict, **result}

        print(f"Sending response: {final_response}")
        return final_response

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))
