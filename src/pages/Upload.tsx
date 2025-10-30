/**
 * src/pages/Upload.tsx
 * 
 * Professional media upload page supporting both video and image files.
 * Features drag-and-drop, animations, and detailed deepfake detection results.
 * Automatically saves analysis to history when completed.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, File, CheckCircle, AlertCircle, Download, X, Image as ImageIcon } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import theme from '../config/theme';
import { useReports } from '../context/ReportContext';

interface ScanResult {
  mediaName: string;
  mediaType: 'video' | 'image';
  isFake: boolean;
  confidence: number;
  details: Array<{ label: string; score: string }>;
  uploadTime: string;
  thumbnail: string;
  processingTime: string;
}

// Reusable Result Card Component
const ResultCard: React.FC<{
  title: string;
  value: string;
  color?: string;
}> = ({ title, value, color = theme.colors.textPrimary }) => (
  <motion.div
    className="p-4 rounded-lg"
    style={{ backgroundColor: theme.colors.neutral.lightest }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <p className="text-sm mb-1" style={{ color: theme.colors.textSecondary }}>
      {title}
    </p>
    <p className="font-semibold text-lg" style={{ color }}>
      {value}
    </p>
  </motion.div>
);

// Reusable Detail Item Component
const DetailItem: React.FC<{
  label: string;
  score: string;
  index: number;
}> = ({ label, score, index }) => {
  const scoreColor =
    score === 'High'
      ? theme.colors.error
      : score === 'Medium'
      ? theme.colors.warning
      : theme.colors.success;

  return (
    <motion.div
      className="flex justify-between p-4 rounded-lg"
      style={{
        backgroundColor: theme.colors.neutral.lightest,
        border: `1px solid ${theme.colors.neutral.medium}`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        borderColor: theme.colors.primary,
        boxShadow: theme.shadows.sm,
      }}
    >
      <span className="font-medium" style={{ color: theme.colors.textPrimary }}>
        {label}
      </span>
      <span className="font-bold" style={{ color: scoreColor }}>
        {score}
      </span>
    </motion.div>
  );
};

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getMediaType = (file: File): 'video' | 'image' => {
    return file.type.startsWith('video/') ? 'video' : 'image';
  };

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setProgress(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setResult(null);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate scan completion
    setTimeout(() => {
      setUploading(false);
      const isFake = Math.random() > 0.5;
      const mediaType = getMediaType(file);
      const processingTime = (Math.random() * 3 + 1).toFixed(1) + 's';
      const confidence = Math.floor(Math.random() * 20) + 80;

      const scanResult: ScanResult = {
        mediaName: file.name,
        mediaType,
        isFake,
        confidence,
        thumbnail: 'https://via.placeholder.com/400x300/3b82f6/FFFFFF?text=Scanned+Media',
        details: [
          { label: 'Lip-sync analysis', score: isFake ? 'High' : 'Low' },
          { label: 'Facial expression consistency', score: isFake ? 'Medium' : 'High' },
          { label: 'Temporal coherence', score: isFake ? 'High' : 'Low' },
          { label: 'Audio-visual alignment', score: isFake ? 'Medium' : 'High' },
          { label: 'Pixel artifacts detection', score: isFake ? 'High' : 'Low' },
          { label: 'Frequency analysis', score: isFake ? 'Medium' : 'High' },
        ],
        uploadTime: new Date().toLocaleString(),
        processingTime,
      };

      setResult(scanResult);

      // Add to history
      const models = ['COLOR-CUES-LSTM-V1', 'EFFICIENTNET-B7-V1', 'EYEBLINK-CNN-LSTM-V1', 'DISTIL-DIRE-V1', 'CROSS-EFFICIENT-VIT-GAN'];
      const selectedModel = models[Math.floor(Math.random() * models.length)];

      addReport({
        mediaName: file.name,
        mediaType,
        title: isFake ? 'Deepfake Detected - ' + file.name : 'Authentic Content - ' + file.name,
        channel: 'User Upload',
        confidence,
        isFake,
        status: 'completed',
        processingTime,
        timestamp: new Date().toISOString(),
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        model: selectedModel,
        views: '0',
      });
    }, 3500);
  };

  const downloadReport = () => {
    if (!result) return;
    const reportText = JSON.stringify(result, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name || 'scan-report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-screen px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: theme.fonts.base }}
          >
            Upload Media for Analysis
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Upload suspicious videos or images to detect deepfake manipulation with AI-powered analysis
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Uploads"
            value="2,547"
            icon={<UploadIcon size={24} />}
            color={theme.colors.primary}
          />
          <StatsCard
            title="Avg Scan Time"
            value="3.2s"
            icon={<File size={24} />}
            color={theme.colors.accent}
          />
          <StatsCard
            title="Success Rate"
            value="99.1%"
            icon={<CheckCircle size={24} />}
            color={theme.colors.success}
          />
        </div>

        {/* Upload Area Card */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          style={{
            border: `2px dashed ${isDragging ? theme.colors.primary : theme.colors.neutral.medium}`,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.01, boxShadow: theme.shadows.lg }}
          transition={{ duration: 0.2 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="upload-prompt"
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block mb-6"
                >
                  <UploadIcon size={64} style={{ color: theme.colors.primary }} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                  Drag & Drop Media Here
                </h3>
                <p className="mb-6" style={{ color: theme.colors.textSecondary }}>
                  Or click the button below to browse files
                </p>
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 rounded-lg font-semibold text-white"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  }}
                  whileHover={{ scale: 1.05, boxShadow: theme.shadows.md }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Files
                </motion.button>
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Supported Formats:
                  </p>
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <File size={16} style={{ color: theme.colors.primary }} />
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Video: MP4, AVI, MOV, WebM
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ImageIcon size={16} style={{ color: theme.colors.secondary }} />
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Image: JPG, PNG, GIF, BMP
                      </span>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    Max 500MB
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div
                  className="flex items-center justify-between p-4 rounded-lg mb-6"
                  style={{ backgroundColor: theme.colors.neutral.lightest }}
                >
                  <div className="flex items-center space-x-4">
                    {getMediaType(file) === 'video' ? (
                      <File size={40} style={{ color: theme.colors.primary }} />
                    ) : (
                      <ImageIcon size={40} style={{ color: theme.colors.secondary }} />
                    )}
                    <div>
                      <p className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                        {file.name}
                      </p>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                        {getMediaType(file) === 'video' ? 'Video' : 'Image'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={clearFile}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} style={{ color: theme.colors.error }} />
                  </motion.button>
                </div>

                {uploading && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span style={{ color: theme.colors.textSecondary }}>Analyzing media...</span>
                      <span className="font-semibold" style={{ color: theme.colors.primary }}>
                        {progress}%
                      </span>
                    </div>
                    <div
                      className="w-full h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: theme.colors.neutral.light }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {!uploading && !result && (
                  <motion.button
                    onClick={handleUpload}
                    className="w-full py-4 rounded-lg font-bold text-lg text-white"
                    style={{
                      background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    }}
                    whileHover={{ scale: 1.02, boxShadow: theme.shadows.lg }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Analysis
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section using Cards */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Result Header Card */}
              <motion.div
                className="bg-white rounded-xl shadow-xl p-8 mb-6"
                style={{
                  border: `3px solid ${result.isFake ? theme.colors.error : theme.colors.success}`,
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>
                    Analysis Complete
                  </h2>
                  {result.isFake ? (
                    <AlertCircle size={48} style={{ color: theme.colors.error }} />
                  ) : (
                    <CheckCircle size={48} style={{ color: theme.colors.success }} />
                  )}
                </div>

                {/* Info Cards Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <ResultCard title="Media Name" value={result.mediaName.substring(0, 20) + '...'} />
                  <ResultCard title="Type" value={result.mediaType === 'video' ? 'Video' : 'Image'} />
                  <ResultCard
                    title="Status"
                    value={result.isFake ? 'Deepfake Detected' : 'Authentic'}
                    color={result.isFake ? theme.colors.error : theme.colors.success}
                  />
                </div>

                {/* Confidence Score Card */}
                <div
                  className="p-6 rounded-xl mb-6"
                  style={{
                    backgroundColor: result.isFake ? theme.colors.error + '15' : theme.colors.success + '15',
                    border: `2px solid ${result.isFake ? theme.colors.error : theme.colors.success}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
                      Confidence Score
                    </span>
                    <span
                      className="text-4xl font-extrabold"
                      style={{ color: result.isFake ? theme.colors.error : theme.colors.success }}
                    >
                      {result.confidence}%
                    </span>
                  </div>
                  <div
                    className="w-full h-4 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'white' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: result.isFake ? theme.colors.error : theme.colors.success,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <div className="mt-3 text-sm" style={{ color: theme.colors.textSecondary }}>
                    Processing Time: {result.processingTime}
                  </div>
                </div>

                {/* Detailed Analysis using DetailItem cards */}
                <div className="mb-6">
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Detailed Analysis
                  </h3>
                  <div className="space-y-3">
                    {result.details.map((detail, idx) => (
                      <DetailItem key={idx} label={detail.label} score={detail.score} index={idx} />
                    ))}
                  </div>
                </div>

                {/* Success Message */}
                <motion.div
                  className="p-4 rounded-lg mb-6"
                  style={{
                    backgroundColor: theme.colors.success + '20',
                    border: `2px solid ${theme.colors.success}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p style={{ color: theme.colors.success }} className="font-semibold text-sm">
                    ✓ Report automatically saved to history
                  </p>
                </motion.div>

                {/* Download Button */}
                <motion.button
                  onClick={downloadReport}
                  className="w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 text-white"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  }}
                  whileHover={{ scale: 1.02, boxShadow: theme.shadows.lg }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={24} />
                  <span>Download Full Report (JSON)</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default Upload;
