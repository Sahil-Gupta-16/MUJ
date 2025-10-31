export const API_BASE_URL = 'https://own.vikasrajyadav.com';

export interface AnalyzeSummary {
  overall_prediction: 'FAKE' | 'REAL';
  overall_confidence: number; // expected 0..1
}

export interface AnalyzeReport {
  status?: string;
  summary: AnalyzeSummary;
  // other fields are ignored for now
}

export const uploadVideoToAPI = async (file: File): Promise<AnalyzeReport> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Upload failed: ${response.status} ${response.statusText} ${text}`);
  }

  return response.json();
};
