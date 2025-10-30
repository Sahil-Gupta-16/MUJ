/**
 * src/pages/Results.tsx
 * 
 * Loads deepfake scan report from JSON data file.
 * Displays report details and provides a downloadable text report.
 */

import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import scanReportJson from '../data/scan-report.json';

interface Detail {
  label: string;
  score: string;
}

interface ScanReport {
  videoName: string;
  detectionConfidence: number;
  result: string;
  details: Detail[];
}

const Results: React.FC = () => {
  const [report, setReport] = useState<ScanReport | null>(null);
  const [reportText, setReportText] = useState<string>('');

  useEffect(() => {
    // Load report JSON (replace with real async fetch if needed)
    setReport(scanReportJson);

    // Generate download text
    const content = `
Deepfake Detection Report
--------------------------
Video: ${scanReportJson.videoName}
Detection Confidence: ${scanReportJson.detectionConfidence}%
Result: ${scanReportJson.result}

Details:
${scanReportJson.details.map(d => `- ${d.label}: ${d.score}`).join('\n')}
`;
    setReportText(content);
  }, []);

  const handleDownload = () => {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report?.videoName ?? 'report'}-scan.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!report) return <p>Loading report...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-800 rounded shadow">
      <h2 className="text-3xl font-bold text-primary mb-4">Scan Results</h2>

      <div className="p-4 border border-secondary rounded bg-white dark:bg-gray-700">
        <h3 className="text-xl font-semibold mb-2">Video: {report.videoName}</h3>
        <p className="mb-2">
          <strong>Detection Confidence:</strong> {report.detectionConfidence}%
        </p>
        <p className="mb-4">
          <strong>Result:</strong> {report.result}
        </p>
        <div>
          <h4 className="font-semibold mb-2">Details:</h4>
          <ul className="list-disc list-inside space-y-1">
            {report.details.map((detail, idx) => (
              <li key={idx} className="flex justify-between px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                <span>{detail.label}</span>
                <span className="font-semibold">{detail.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleDownload}>Download Report</Button>
      </div>
    </div>
  );
};

export default Results;
