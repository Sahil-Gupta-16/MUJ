/**
 * src/pages/Upload.tsx
 * 
 * Upload page allowing users to upload a video and see a simulated deepfake detection report.
 * Shows upload progress, result report, and provides a download report button.
 */

import React, { useState } from 'react';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setResult(null);

    // Simulate scan delay, replace with real API call later
    setTimeout(() => {
      setUploading(false);
      setResult(
        `Video: ${file.name}\n\nDeepfake Detected: 85% Confidence\n\nRecommendation: Further manual review advised.`
      );
    }, 3000);
  };

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name || 'scan-report'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold text-primary">Upload a Video to Scan</h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0 file:text-sm file:font-semibold
          file:bg-primary file:text-background hover:file:bg-primary/80"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-6 py-3 bg-primary text-background rounded disabled:opacity-50 hover:bg-primary/80 transition"
      >
        {uploading ? 'Scanning...' : 'Start Scan'}
      </button>
      {result && (
        <div className="mt-6 p-4 border border-secondary rounded whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 text-primary">
          {result}
        </div>
      )}
      {result && (
        <button
          onClick={downloadReport}
          className="mt-4 px-5 py-2 bg-secondary text-background rounded hover:bg-secondary/80 transition"
        >
          Download Report
        </button>
      )}
    </section>
  );
};

export default Upload;
