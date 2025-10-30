import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import type { VideoScanRequest, SocialScanRequest, ScanResult } from '../types/scan';

export const scanService = {
  async scanVideo(request: VideoScanRequest): Promise<ScanResult> {
    const { data } = await api.post(ENDPOINTS.VIDEO_SCAN, request);
    return data;
  },

  async scanSocialContent(request: SocialScanRequest): Promise<ScanResult> {
    const { data } = await api.post(ENDPOINTS.SOCIAL_SCAN, request);
    return data;
  },

  async getTrendingScans(): Promise<ScanResult[]> {
    const { data } = await api.get(ENDPOINTS.TRENDING);
    return data;
  },
};