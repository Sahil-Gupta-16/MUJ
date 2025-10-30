/**
 * src/pages/Upload.tsx
 * 
 * Professional media upload page supporting both video and image files.
 * Features drag-and-drop, animations, and detailed deepfake detection results.
 * Shows modal with each model's processing progress.
 * Automatically redirects to results page when complete.
 * Includes playable video preview with controls and model score charts.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, File, CheckCircle, AlertCircle, Download, X, Image as ImageIcon, Loader, Play, Pause, ExternalLink } from 'lucide-react';
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
  videoUrl?: string;
  modelScores?: Array<{ name: string; score: number; color: string }>;
}

interface ModelProgress {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  processingTime: string;
  confidence?: number;
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
    <p className="text-xs mb-1 uppercase tracking-wide font-semibold" style={{ color: theme.colors.textSecondary }}>
      {title}
    </p>
    <p className="font-bold text-lg" style={{ color }}>
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

  const getSeverityLabel = (s: string): string => {
    if (s === 'High') return 'High Risk';
    if (s === 'Medium') return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <motion.div
      className="flex items-center justify-between p-3 rounded-lg"
      style={{
        backgroundColor: scoreColor + '10',
        border: `1px solid ${scoreColor}30`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        scale: 1.02,
        borderColor: scoreColor,
        boxShadow: `0 4px 12px ${scoreColor}20`,
      }}
    >
      <span className="font-medium text-sm" style={{ color: theme.colors.textPrimary }}>
        {label}
      </span>
      <span className="font-bold text-xs px-2 py-1 rounded-full" style={{ color: scoreColor, backgroundColor: scoreColor + '20' }}>
        {getSeverityLabel(score)}
      </span>
    </motion.div>
  );
};

// Model Progress Row Component
const ModelProgressRow: React.FC<{ model: ModelProgress; index: number }> = ({ model, index }) => {
  const getStatusColor = () => {
    switch (model.status) {
      case 'completed':
        return theme.colors.success;
      case 'failed':
        return theme.colors.error;
      case 'processing':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (model.status) {
      case 'completed':
        return <CheckCircle size={18} />;
      case 'failed':
        return <AlertCircle size={18} />;
      case 'processing':
        return <Loader size={18} className="animate-spin" />;
      default:
        return <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300" />;
    }
  };

  const statusColor = getStatusColor();

  return (
    <motion.div
      className="p-4 rounded-lg mb-3"
      style={{
        backgroundColor: theme.colors.neutral.lightest,
        border: `1px solid ${theme.colors.neutral.light}`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3 flex-1">
          <div style={{ color: statusColor }}>
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: theme.colors.textPrimary }}>
              {model.name}
            </p>
            <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
              {model.processingTime}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold" style={{ color: statusColor }}>
            {model.progress}%
          </p>
        </div>
      </div>

      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: theme.colors.neutral.light }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: statusColor }}
          initial={{ width: 0 }}
          animate={{ width: `${model.progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {model.status === 'completed' && model.confidence && (
        <div className="mt-2 text-xs flex items-center justify-between" style={{ color: theme.colors.textSecondary }}>
          <span>Score</span>
          <span className="font-bold" style={{ color: theme.colors.primary }}>
            {model.confidence}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Processing Modal Component
const ProcessingModal: React.FC<{
  isOpen: boolean;
  models: ModelProgress[];
  overallProgress: number;
  mediaName: string;
}> = ({ isOpen, models, overallProgress, mediaName }) => {
  const completedModels = models.filter((m) => m.status === 'completed').length;
  const totalModels = models.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                Analyzing Media
              </h2>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                {mediaName}
              </p>
            </div>

            <motion.div
              className="mb-6 p-4 rounded-lg"
              style={{
                backgroundColor: theme.colors.primary + '15',
                border: `2px solid ${theme.colors.primary}`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                  Overall Progress
                </span>
                <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                  {completedModels}/{totalModels} Models
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
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: theme.colors.textSecondary }}>
                {overallProgress}% Complete
              </p>
            </motion.div>

            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3" style={{ color: theme.colors.textPrimary }}>
                Model Processing Status
              </h3>
              <div className="space-y-0 max-h-64 overflow-y-auto">
                {models.map((model, idx) => (
                  <ModelProgressRow key={idx} model={model} index={idx} />
                ))}
              </div>
            </div>

            <motion.div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: theme.colors.neutral.lightest }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader size={16} style={{ color: theme.colors.primary }} />
                </motion.div>
                <p className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                  Processing your media...
                </p>
              </div>
              <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                This may take a few moments depending on file size
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Video Player Component
const VideoPlayer: React.FC<{ videoUrl: string; mediaName: string }> = ({ videoUrl, mediaName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <motion.div
      className="relative w-full rounded-xl overflow-hidden bg-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <motion.div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-xs font-bold z-20"
        style={{ backgroundColor: theme.colors.primary }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        🎬 Video Preview
      </motion.div>

      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />

        <motion.div
          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all group flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="p-4 space-y-3 bg-gradient-to-t from-black to-transparent">
            <div
              className="group/progress h-1 bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all"
              onClick={handleProgressClick}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: theme.colors.primary,
                  width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                }}
              />
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={togglePlay}
                  className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause size={20} fill="white" />
                  ) : (
                    <Play size={20} fill="white" />
                  )}
                </motion.button>

                <span className="text-xs font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <span className="text-xs font-medium truncate max-w-xs">
                {mediaName}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Model Score Bar Chart
const ModelScoreChart: React.FC<{ 
  modelScores: Array<{ name: string; score: number; color: string }>;
}> = ({ modelScores }) => {
  return (
    <motion.div
      className="relative w-full rounded-xl bg-white p-6"
      style={{ border: `1px solid ${theme.colors.neutral.light}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
        Model Confidence Scores
      </h3>
      
      <div className="space-y-3">
        {modelScores.map((model, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + idx * 0.05 }}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
                {model.name}
              </p>
              <p className="text-xs font-bold" style={{ color: model.color }}>
                {model.score}%
              </p>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.colors.neutral.light }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: model.color }}
                initial={{ width: 0 }}
                animate={{ width: `${model.score}%` }}
                transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [modelProgress, setModelProgress] = useState<ModelProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const models = [
    'COLOR-CUES-LSTM-V1',
    'EFFICIENTNET-B7-V1',
    'EYEBLINK-CNN-LSTM-V1',
    'DISTIL-DIRE-V1',
    'CROSS-EFFICIENT-VIT-GAN',
  ];

  const modelColors = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#06B6D4', // Cyan
  ];

  const getMediaType = (file: File): 'video' | 'image' => {
    return file.type.startsWith('video/') ? 'video' : 'image';
  };

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
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

    const initialProgress: ModelProgress[] = models.map((model) => ({
      name: model,
      status: 'pending',
      progress: 0,
      processingTime: '0.0s',
    }));

    setModelProgress(initialProgress);
    setOverallProgress(0);
    setIsProcessingModalOpen(true);
    setResult(null);

    const videoUrl = URL.createObjectURL(file);
    let completedCount = 0;
    const baseDelay = 800;
    const isFake = Math.random() > 0.5;

    models.forEach((model, modelIndex) => {
      setTimeout(() => {
        setModelProgress((prev) =>
          prev.map((m, idx) =>
            idx === modelIndex ? { ...m, status: 'processing', progress: 10 } : m
          )
        );

        const progressInterval = setInterval(() => {
          setModelProgress((prev) => {
            const updated = [...prev];
            if (updated[modelIndex].progress < 90) {
              updated[modelIndex].progress += Math.random() * 20;
              if (updated[modelIndex].progress > 90) updated[modelIndex].progress = 90;
            }
            return updated;
          });
        }, 300);

        setTimeout(() => {
          clearInterval(progressInterval);
          const modelConfidence = Math.floor(Math.random() * 20) + 80;
          const processingTime = (Math.random() * 1.5 + 1).toFixed(1) + 's';

          setModelProgress((prev) => {
            const updated = [...prev];
            updated[modelIndex] = {
              ...updated[modelIndex],
              status: 'completed',
              progress: 100,
              confidence: modelConfidence,
              processingTime,
            };
            return updated;
          });

          completedCount++;
          setOverallProgress(Math.round((completedCount / models.length) * 100));

          if (completedCount === models.length) {
            setTimeout(() => {
              setIsProcessingModalOpen(false);

              const mediaType = getMediaType(file);
              const totalProcessingTime = (Math.random() * 3 + 2).toFixed(1) + 's';
              const confidence = Math.floor(Math.random() * 20) + 80;
              const selectedModel = models[Math.floor(Math.random() * models.length)];

              const modelScores = models.map((name, idx) => ({
                name,
                score: Math.floor(Math.random() * 20) + 75,
                color: modelColors[idx],
              }));

              const scanResult: ScanResult = {
                mediaName: file.name,
                mediaType,
                isFake,
                confidence,
                thumbnail: 'https://via.placeholder.com/400x300/3b82f6/FFFFFF?text=Scanned+Media',
                videoUrl: mediaType === 'video' ? videoUrl : undefined,
                modelScores,
                details: [
                  { label: 'Lip-sync analysis', score: isFake ? 'High' : 'Low' },
                  { label: 'Facial expression consistency', score: isFake ? 'Medium' : 'High' },
                  { label: 'Temporal coherence', score: isFake ? 'High' : 'Low' },
                  { label: 'Audio-visual alignment', score: isFake ? 'Medium' : 'High' },
                  { label: 'Pixel artifacts detection', score: isFake ? 'High' : 'Low' },
                  { label: 'Frequency analysis', score: isFake ? 'Medium' : 'High' },
                ],
                uploadTime: new Date().toLocaleString(),
                processingTime: totalProcessingTime,
              };

              setResult(scanResult);

              addReport({
                mediaName: file.name,
                mediaType,
                title: isFake ? 'Deepfake Detected - ' + file.name : 'Authentic Content - ' + file.name,
                channel: 'User Upload',
                confidence,
                isFake,
                status: 'completed',
                processingTime: totalProcessingTime,
                timestamp: new Date().toISOString(),
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                model: selectedModel,
                views: '0',
              });

              setTimeout(() => {
                navigate('/results', {
                  state: {
                    videoData: {
                      id: Date.now(),
                      thumbnail: scanResult.thumbnail,
                      title: scanResult.mediaName,
                      channel: 'User Upload',
                      sourceLink: mediaType === 'video' ? videoUrl : '#',
                      isFake: scanResult.isFake,
                      confidence: scanResult.confidence,
                      views: '0',
                      uploadDate: new Date().toLocaleDateString(),
                      mediaType: mediaType,
                    },
                  },
                });
              }, 2000);
            }, 500);
          }
        }, 2000 + modelIndex * 500);
      }, baseDelay + modelIndex * 1000);
    });
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
                    disabled={isProcessingModalOpen}
                  >
                    <X size={24} style={{ color: theme.colors.error }} />
                  </motion.button>
                </div>

                {!isProcessingModalOpen && (
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

        
      </motion.div>

      {/* Processing Modal */}
      <ProcessingModal
        isOpen={isProcessingModalOpen}
        models={modelProgress}
        overallProgress={overallProgress}
        mediaName={file?.name || 'Unknown'}
      />
    </DashboardLayout>
  );
};

export default Upload;
