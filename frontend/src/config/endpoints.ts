// API endpoints configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  VIDEO_SCAN: `${API_BASE_URL}/api/scan/video`,
  SOCIAL_SCAN: `${API_BASE_URL}/api/scan/social`,
  TRENDING: `${API_BASE_URL}/api/trending`,
} as const;