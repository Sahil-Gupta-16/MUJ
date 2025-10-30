export interface ScanResult {
  id: string;
  isDeepfake: boolean;
  confidence: number;
  detectedFeatures: string[];
  timestamp: string;
}

export interface VideoScanRequest {
  videoUrl: string;
  options?: {
    fastScan?: boolean;
    detectFeatures?: boolean;
  };
}

export interface SocialScanRequest {
  platform: 'youtube' | 'tiktok' | 'instagram';
  contentId: string;
}

export type ScanStatus = 'idle' | 'loading' | 'success' | 'error';