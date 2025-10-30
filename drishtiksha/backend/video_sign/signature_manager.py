import hashlib
import json
import psycopg2
from psycopg2.extras import RealDictCursor


class VideoSignatureManager:
    """Manages video signatures and caching"""
    
    def __init__(self, db_config):
        self.db_config = db_config
        self.init_db()
    
    def init_db(self):
        """Create tables if they don't exist"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cursor = conn.cursor()
            
            # Video signatures table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS video_signatures (
                    id SERIAL PRIMARY KEY,
                    video_hash VARCHAR(64) UNIQUE NOT NULL,
                    filename VARCHAR(255),
                    file_size BIGINT,
                    duration_seconds FLOAT,
                    fps FLOAT,
                    total_frames INT,
                    signature_hash VARCHAR(64),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Analysis results table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS analysis_results (
                    id SERIAL PRIMARY KEY,
                    video_signature_id INT REFERENCES video_signatures(id),
                    analysis_json JSONB,
                    overall_prediction VARCHAR(10),
                    overall_confidence FLOAT,
                    authentic_frames INT,
                    deepfake_frames INT,
                    fake_percentage FLOAT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Frame details table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS frame_details (
                    id SERIAL PRIMARY KEY,
                    analysis_id INT REFERENCES analysis_results(id),
                    frame_number INT,
                    timestamp FLOAT,
                    prediction VARCHAR(10),
                    confidence FLOAT,
                    model_scores JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()
            cursor.close()
            conn.close()
            print("✓ Database tables initialized")
        except Exception as e:
            print(f"✗ Database init error: {e}")
    
    def compute_video_hash(self, video_data):
        """Compute hash of video file"""
        return hashlib.sha256(video_data).hexdigest()
    
    def compute_signature_hash(self, analysis_result):
        """Compute hash of analysis result"""
        result_str = json.dumps(analysis_result, sort_keys=True, default=str)
        return hashlib.sha256(result_str.encode()).hexdigest()
    
    def save_analysis(self, video_hash, filename, file_size, analysis_result):
        """Save analysis to database"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cursor = conn.cursor()
            
            video_info = analysis_result['video_info']
            summary = analysis_result['summary']
            signature_hash = self.compute_signature_hash(analysis_result)
            
            # Insert or get video signature
            cursor.execute("""
                INSERT INTO video_signatures 
                (video_hash, filename, file_size, duration_seconds, fps, total_frames, signature_hash)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (video_hash) DO UPDATE SET signature_hash = EXCLUDED.signature_hash
                RETURNING id
            """, (
                video_hash, filename, file_size,
                video_info['duration_seconds'],
                video_info['fps'],
                video_info['total_frames'],
                signature_hash
            ))
            
            video_sig_id = cursor.fetchone()[0]
            
            # Insert analysis result
            cursor.execute("""
                INSERT INTO analysis_results 
                (video_signature_id, analysis_json, overall_prediction, overall_confidence, 
                 authentic_frames, deepfake_frames, fake_percentage)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                video_sig_id,
                json.dumps(analysis_result),
                summary['overall_prediction'],
                summary['overall_confidence'],
                summary['authentic_frames'],
                summary['deepfake_frames'],
                summary['fake_percentage']
            ))
            
            analysis_id = cursor.fetchone()[0]
            
            # Insert frame details
            for frame in analysis_result['frame_analysis']:
                cursor.execute("""
                    INSERT INTO frame_details 
                    (analysis_id, frame_number, timestamp, prediction, confidence, model_scores)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    analysis_id,
                    frame['frame_number'],
                    frame['timestamp'],
                    frame['prediction'],
                    frame['confidence'],
                    json.dumps(frame['model_scores'])
                ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {'video_signature_id': video_sig_id, 'analysis_id': analysis_id}
        except Exception as e:
            print(f"✗ Save error: {e}")
            return None
    
    def get_analysis_by_video_hash(self, video_hash):
        """Get cached analysis by video hash"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute("""
                SELECT ar.id as analysis_id, ar.analysis_json, ar.created_at,
                       ar.overall_prediction, ar.overall_confidence,
                       ar.authentic_frames, ar.deepfake_frames, ar.fake_percentage
                FROM video_signatures vs
                JOIN analysis_results ar ON vs.id = ar.video_signature_id
                WHERE vs.video_hash = %s
                ORDER BY ar.created_at DESC
                LIMIT 1
            """, (video_hash,))
            
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            return dict(result) if result else None
        except Exception as e:
            print(f"✗ Query error: {e}")
            return None
    
    def get_all_signatures(self, limit=50, offset=0):
        """Get all stored video signatures - FIXED"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            # Get latest analysis for each video
            cursor.execute("""
                SELECT 
                    vs.id, 
                    vs.filename, 
                    vs.file_size, 
                    vs.duration_seconds, 
                    vs.fps, 
                    vs.total_frames, 
                    vs.created_at,
                    COALESCE(ar.overall_prediction, 'UNKNOWN') as overall_prediction,
                    COALESCE(ar.overall_confidence, 0) as overall_confidence,
                    COALESCE(ar.authentic_frames, 0) as authentic_frames,
                    COALESCE(ar.deepfake_frames, 0) as deepfake_frames,
                    COALESCE(ar.fake_percentage, 0) as fake_percentage
                FROM video_signatures vs
                LEFT JOIN LATERAL (
                    SELECT 
                        overall_prediction,
                        overall_confidence,
                        authentic_frames,
                        deepfake_frames,
                        fake_percentage
                    FROM analysis_results
                    WHERE video_signature_id = vs.id
                    ORDER BY created_at DESC
                    LIMIT 1
                ) ar ON TRUE
                ORDER BY vs.created_at DESC
                LIMIT %s OFFSET %s
            """, (limit, offset))
            
            results = cursor.fetchall()
            
            # Get total count
            cursor.execute("SELECT COUNT(*) as total FROM video_signatures")
            total = cursor.fetchone()['total']
            
            cursor.close()
            conn.close()
            
            return {'total': total, 'videos': [dict(r) for r in results]}
        except Exception as e:
            print(f"✗ Query error in get_all_signatures: {e}")
            return None
    
    def get_signature_detail(self, video_sig_id):
        """Get detailed info about a signature"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute("""
                SELECT 
                    vs.id,
                    vs.video_hash,
                    vs.filename,
                    vs.file_size,
                    vs.duration_seconds,
                    vs.fps,
                    vs.total_frames,
                    vs.created_at,
                    ar.analysis_json,
                    ar.overall_prediction,
                    ar.overall_confidence
                FROM video_signatures vs
                LEFT JOIN LATERAL (
                    SELECT 
                        analysis_json,
                        overall_prediction,
                        overall_confidence
                    FROM analysis_results
                    WHERE video_signature_id = vs.id
                    ORDER BY created_at DESC
                    LIMIT 1
                ) ar ON TRUE
                WHERE vs.id = %s
            """, (video_sig_id,))
            
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            return dict(result) if result else None
        except Exception as e:
            print(f"✗ Query error in get_signature_detail: {e}")
            return None
