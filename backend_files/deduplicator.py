import videofingerprint
import psycopg2
from psycopg2 import sql
import textdistance


def find_best_match_position(query_fp: str, target_fp: str) -> dict:
    """
    Finds the best starting position of a query fingerprint within a larger target
    fingerprint using a sliding window and Levenshtein similarity.

    Args:
        query_fp: The fingerprint of the slice (the "needle").
        target_fp: The fingerprint of the full video (the "haystack").

    Returns:
        A dictionary containing the best position found and the similarity score
        at that position.
    """
    # --- Pre-computation ---
    query_len = len(query_fp)
    target_len = len(target_fp)

    if query_len == 0 or target_len == 0 or query_len > target_len:
        return {"position": -1, "similarity_percent": 0.0}

    # --- Sliding Window Search ---
    best_position = -1
    best_score = -1.0

    # The loop slides the window across the target fingerprint
    for i in range(target_len - query_len + 1):
        current_window = target_fp[i : i + query_len]
        similarity = textdistance.levenshtein.normalized_similarity(
            query_fp, current_window
        )

        if similarity > best_score:
            best_score = similarity
            best_position = i

        # Optimization: If we find a perfect match, we can stop searching.
        if best_score == 1.0:
            break

    return {"position": best_position, "similarity_percent": round(best_score * 100, 2)}


class VideoDeduplicator:
    """
    A class to manage video fingerprints in a PostgreSQL database,
    providing fast duplicate and slice detection.
    """

    def __init__(self, db_params: dict, similarity_threshold: float = 90.0):
        """
        Initializes the deduplicator with database parameters and a match threshold.
        """
        self.db_params = db_params
        # Convert threshold to a 0.0-1.0 scale for internal calculations
        self.threshold = similarity_threshold / 100.0
        self.conn = None
        self._connect()
        self._setup_database()

    def _connect(self):
        """Establishes a connection to the PostgreSQL database."""
        try:
            self.conn = psycopg2.connect(**self.db_params)
            print("Database connection established.")
        except psycopg2.OperationalError as e:
            print(f"Error connecting to database: {e}")
            raise

    def _setup_database(self):
        """
        Sets up the necessary table and GIN index for trigram similarity search.
        """
        with self.conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS videos (
                    id SERIAL PRIMARY KEY,
                    url TEXT UNIQUE NOT NULL,
                    fingerprint TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_videos_fingerprint_gin
                ON videos
                USING gin (fingerprint gin_trgm_ops);
            """)
        self.conn.commit()
        print("Database setup complete. Table 'videos' and GIN index are ready.")

    def _get_fingerprint(self, url: str) -> str | None:
        """Generates a fingerprint for a given video URL."""
        try:
            print(f"Generating fingerprint for: {url}")
            vp = videofingerprint.VideoFingerprint(url=url)
            print("Fingerprint generated successfully.")
            return vp.fingerprint
        except Exception as e:
            print(f"Could not generate fingerprint for {url}. Error: {e}")
            return None

    def upload(self, url: str) -> dict:
        """
        Uploads a video's fingerprint to the database unless the URL or a
        strong content duplicate already exists.

        Args:
            url (str): The URL of the video to process.

        Returns:
            A dictionary with the status of the operation.
        """
        # --- Step 1: Check for an exact URL match first ---
        with self.conn.cursor() as cur:
            cur.execute("SELECT id FROM videos WHERE url = %s;", (url,))
            if cur.fetchone():
                return {
                    "status": "skipped",
                    "message": "Exact URL already exists in the database.",
                }

        # --- Step 2: If no URL match, generate fingerprint and check for content match ---
        fp = self._get_fingerprint(url)
        if not fp:
            return {"status": "error", "message": "Fingerprint generation failed."}

        # Use the `exists` method to check for content duplicates
        existing_match = self.exists(url, fingerprint_to_check=fp)
        if existing_match["is_match"] and existing_match["similarity_percent"] > 99.5:
            return {
                "status": "skipped",
                "message": "Exact content duplicate already exists with a different URL.",
                "match_details": existing_match,
            }

        # --- Step 3: If no strong duplicates, insert the new video ---
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO videos (url, fingerprint) VALUES (%s, %s);",
                    (url, fp),
                )
            self.conn.commit()
            return {
                "status": "success",
                "message": "Video fingerprint uploaded successfully.",
            }
        except psycopg2.Error as e:
            self.conn.rollback()
            return {"status": "error", "message": f"Database error: {e}"}

    def exists(self, url: str, fingerprint_to_check: str = None) -> dict:
        """
        Checks if a video exists by first checking its URL, and then by
        checking for similar content fingerprints.
        """
        # --- Step 1: Check for an exact URL match (most efficient check) ---
        with self.conn.cursor() as cur:
            cur.execute("SELECT url FROM videos WHERE url = %s;", (url,))
            match = cur.fetchone()
            if match:
                return {
                    "is_match": True,
                    "match_type": "Exact URL Match",
                    "best_match_url": match[0],
                    "similarity_percent": 100.0,
                    "match_position_in_string": 0,
                    "message": "A perfect match was found based on the URL.",
                }

        # --- Step 2: If no URL match, proceed with fingerprint comparison ---
        query_fp = fingerprint_to_check or self._get_fingerprint(url)
        if not query_fp:
            return {
                "status": "error",
                "message": "Could not generate query fingerprint.",
            }

        sql_query = """
            SELECT url, fingerprint, similarity(fingerprint, %s) AS score
            FROM videos
            WHERE fingerprint %% %s OR %s %% fingerprint
            ORDER BY score DESC
            LIMIT 1;
        """

        with self.conn.cursor() as cur:
            cur.execute(sql_query, (query_fp, query_fp, query_fp))
            best_match = cur.fetchone()

        if not best_match:
            return {"is_match": False, "message": "No potential matches found."}

        match_url, match_fp, db_score = best_match

        is_match_overall = db_score >= self.threshold

        final_similarity = db_score * 100
        match_position = -1
        match_type = "Content Match"

        # If the query is potentially a slice of the database video...
        if len(query_fp) < len(match_fp):
            match_type = "Slice Match"
            print("Performing robust slice position search...")
            position_result = find_best_match_position(query_fp, match_fp)
            match_position = position_result["position"]
            final_similarity = position_result["similarity_percent"]
            # Re-evaluate match decision based on the more precise score
            is_match_overall = final_similarity >= (self.threshold * 100)

        return {
            "is_match": is_match_overall,
            "match_type": match_type,
            "best_match_url": match_url,
            "similarity_percent": round(final_similarity, 2),
            "match_position_in_string": match_position,
            "message": f"Best content match found with a similarity of {round(final_similarity, 2)}%."
            if is_match_overall
            else "A potential match was found, but it is below the threshold.",
        }

    def close(self):
        """Closes the database connection."""
        if self.conn:
            self.conn.close()
            print("Database connection closed.")
