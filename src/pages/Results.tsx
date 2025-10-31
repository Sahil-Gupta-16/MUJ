/**
 * src/pages/Results.tsx
 * 
 * Detailed results page showing comprehensive deepfake detection analysis.
 * New layout with video preview, model charts, metadata, metrics, and action buttons.
 * Features embedded video player for preview and model confidence bar charts.
 */

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
  Calendar,
  Eye,
  Gauge,
  ExternalLink,
  BarChart3,
  Clapperboard,
  Image as ImageIcon,
  ClipboardList,
  FileText,
  Tv,
  Search,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DashboardLayout from '../layouts/DashboardLayout';
import theme from '../config/theme';

import {  ArrowRight } from 'lucide-react';


interface VideoData {
  id: number;
  thumbnail: string;
  title: string;
  channel: string;
  sourceLink: string;
  isFake: boolean;
  confidence: number;
  views: string;
  uploadDate: string;
  mediaType?: 'video' | 'image';
  modelScores?: Array<{ name: string; score: number; color: string }>;
}

interface AnalysisDetail {
  label: string;
  score: number;
  description?: string;
}

// Detail Metric Component with Numeric Score
const DetailMetric: React.FC<{
  label: string;
  score: number;
  index: number;
}> = ({ label, score, index }) => {
  let scoreColor: string;
  if (score >= 75) {
    scoreColor = theme.colors.error;
  } else if (score >= 50) {
    scoreColor = theme.colors.warning;
  } else {
    scoreColor = theme.colors.success;
  }

  const getSeverityLabel = (s: number): string => {
    if (s >= 75) return 'High Risk';
    if (s >= 50) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
   <motion.div
      className="flex items-center justify-between p-3 rounded-lg items-center"
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
      <div className="flex items-center gap-2">
        <div
          className="w-20 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: theme.colors.neutral.light }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
          />
        </div>
        <span className="font-bold text-sm" style={{ color: scoreColor, minWidth: '35px', textAlign: 'right' }}>
          {score}%
        </span>
      </div>
    </motion.div>
  );
};

// Model Score Bar Chart

const ModelScoreChart: React.FC<{ 
  modelScores: Array<{ name: string; score: number; color: string }>;
  videoData?: any;
}> = ({ modelScores, videoData }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/model-details', {
      state: {
        modelScores,
        videoData,
      },
    });
  };

  return (
    <motion.div
      className="relative w-full rounded-xl bg-white p-6 shadow-lg min-h-[400px]"
      style={{ border: `1px solid ${theme.colors.neutral.light}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Header with View Details Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
          <BarChart3 size={18} />
          Model Confidence Scores
        </h3>
        <motion.button
          onClick={handleViewDetails}
          className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
          style={{
            backgroundColor: theme.colors.primary,
            color: 'white',
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 8px 16px ${theme.colors.primary}40` }}
          whileTap={{ scale: 0.95 }}
        >
          View Details
          <ArrowRight size={16} />
        </motion.button>
      </div>
      
      <div className="space-y-5">
        {modelScores.map((model, idx) => (
          <motion.div
            key={idx}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + idx * 0.08 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                {model.name}
              </p>
              <p className="text-sm font-black" style={{ color: model.color }}>
                {model.score}%
              </p>
            </div>
            <div
              className="w-full h-4 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.colors.neutral.light }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: model.color,
                  boxShadow: `0 2px 8px ${model.color}40`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${model.score}%` }}
                transition={{ duration: 1, delay: 0.6 + idx * 0.15, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Average Score Footer */}
      <motion.div
        className="mt-6 pt-4 border-t"
        style={{ borderColor: theme.colors.neutral.light }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: theme.colors.textSecondary }}>
            Average Score
          </p>
          <p className="text-2xl font-black" style={{ color: theme.colors.primary }}>
            {Math.round(modelScores.reduce((acc, m) => acc + m.score, 0) / modelScores.length)}%
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Metadata Card Component
const MetadataCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  index: number;
}> = ({ title, value, icon, index }) => (
  <motion.div
    className="p-3 rounded-lg"
    style={{ backgroundColor: theme.colors.neutral.lightest }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center gap-2 mb-1">
      <div style={{ color: theme.colors.primary }}>{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.colors.textSecondary }}>
        {title}
      </p>
    </div>
    <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
      {value}
    </p>
  </motion.div>
);

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.videoData) {
      setVideoData(location.state.videoData);
    } else {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  if (!videoData) {
    return null;
  }

  const statusColor = videoData.isFake ? theme.colors.error : theme.colors.success;
  const StatusIcon = videoData.isFake ? AlertCircle : CheckCircle;
  const isVideo = videoData.mediaType === 'video' || videoData.sourceLink.includes('youtube') || videoData.sourceLink.includes('vimeo') || videoData.sourceLink.includes('embed');

  const analysisDetails: AnalysisDetail[] = [
    { label: 'Lip-sync analysis', score: videoData.isFake ? 82 : 80 },
    { label: 'Facial expression consistency', score: videoData.isFake ? 98 : 88 },
    { label: 'Temporal coherence', score: videoData.isFake ? 79 : 92 },
    { label: 'Audio-visual alignment', score: videoData.isFake ? 71 : 69 },
    { label: 'Frame-level artifacts', score: videoData.isFake ? 85 : 83 },
    { label: 'Background consistency', score: videoData.isFake ? 62 : 92 },
  ];

  const modelScores = videoData.modelScores || [
    { name: 'COLOR-CUES-LSTM-V1', score: 85, color: '#EF4444' },
    { name: 'EFFICIENTNET-B7-V1', score: 78, color: '#F97316' },
    { name: 'EYEBLINK-CNN-LSTM-V1', score: 92, color: '#EAB308' },
    { name: 'DISTIL-DIRE-V1', score: 81, color: '#22C55E' },
    { name: 'CROSS-EFFICIENT-VIT-GAN', score: 87, color: '#06B6D4' },
  ];

  const averageScore = Math.round(
    analysisDetails.reduce((sum, detail) => sum + detail.score, 0) / analysisDetails.length
  );

  const downloadReportPDF = async () => {
  if (!reportRef.current) return;

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, contentWidth);
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += fontSize * 0.4;
      });
      yPosition += 5;
    };

    // Header with gradient effect (simulated)
    pdf.setFillColor(34, 211, 238); // Primary color
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DeepfakeGuard Analysis Report', margin, 25);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 35);

    // Reset text color
    pdf.setTextColor(0, 0, 0);
    yPosition = 50;

    // Status Section
    const statusColor = videoData.isFake ? [239, 68, 68] : [16, 185, 129];
    pdf.setFillColor(...statusColor);
    pdf.roundedRect(margin, yPosition, contentWidth, 20, 3, 3, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      videoData.isFake ? '⚠ DEEPFAKE DETECTED' : '✓ AUTHENTIC VIDEO',
      pageWidth / 2,
      yPosition + 12,
      { align: 'center' }
    );
    
    pdf.setTextColor(0, 0, 0);
    yPosition += 30;

    // Confidence Score
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Confidence Score:', margin + 10, yPosition + 10);
    
    pdf.setFontSize(20);
    pdf.setTextColor(...statusColor);
    pdf.text(`${videoData.confidence}%`, margin + 10, yPosition + 20);
    
    pdf.setTextColor(0, 0, 0);
    yPosition += 35;

    // Video Information Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('📊 Video Information', margin, yPosition);
    yPosition += 8;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    const videoInfo = [
      ['Title:', videoData.title],
      ['Channel:', videoData.channel],
      ['Views:', videoData.views],
      ['Upload Date:', videoData.uploadDate],
    ];

    pdf.setFontSize(10);
    videoInfo.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(value, contentWidth - 40);
      pdf.text(lines, margin + 40, yPosition);
      yPosition += 7;
    });

    yPosition += 5;

    // Analysis Metrics Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🔍 Analysis Metrics', margin, yPosition);
    yPosition += 8;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    const analysisDetails: AnalysisDetail[] = [
      { label: 'Lip-sync analysis', score: videoData.isFake ? 82 : 15 },
      { label: 'Facial expression consistency', score: videoData.isFake ? 68 : 88 },
      { label: 'Temporal coherence', score: videoData.isFake ? 79 : 12 },
      { label: 'Audio-visual alignment', score: videoData.isFake ? 71 : 25 },
      { label: 'Frame-level artifacts', score: videoData.isFake ? 85 : 8 },
      { label: 'Background consistency', score: videoData.isFake ? 62 : 92 },
    ];

    pdf.setFontSize(10);
    analysisDetails.forEach((detail) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      // Metric label
      pdf.setFont('helvetica', 'normal');
      pdf.text(detail.label, margin, yPosition);

      // Score bar background
      const barWidth = 60;
      const barHeight = 5;
      const barX = pageWidth - margin - barWidth - 20;
      
      pdf.setFillColor(230, 230, 230);
      pdf.roundedRect(barX, yPosition - 3, barWidth, barHeight, 2, 2, 'F');

      // Score bar fill
      const scoreColor = detail.score >= 75 ? [239, 68, 68] : detail.score >= 50 ? [251, 191, 36] : [16, 185, 129];
      pdf.setFillColor(...scoreColor);
      pdf.roundedRect(barX, yPosition - 3, (barWidth * detail.score) / 100, barHeight, 2, 2, 'F');

      // Score value
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...scoreColor);
      pdf.text(`${detail.score}%`, pageWidth - margin - 15, yPosition);
      pdf.setTextColor(0, 0, 0);

      yPosition += 10;
    });

    yPosition += 5;

    // Average Score
    const averageScore = Math.round(
      analysisDetails.reduce((sum, detail) => sum + detail.score, 0) / analysisDetails.length
    );

    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(margin, yPosition, contentWidth, 15, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Average Analysis Score:', margin + 10, yPosition + 10);
    
    pdf.setFontSize(14);
    pdf.setTextColor(34, 211, 238);
    pdf.text(`${averageScore} / 100`, pageWidth - margin - 10, yPosition + 10, { align: 'right' });
    
    pdf.setTextColor(0, 0, 0);
    yPosition += 25;

    // Footer Section
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ℹ️ Additional Information', margin, yPosition);
    yPosition += 8;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    
    const footerText = [
      'This report was generated using AI-powered deepfake detection technology.',
      'Results are based on advanced machine learning models and should be used as guidance.',
      'For critical decisions, please consult with media forensics experts.',
      '',
      `Report ID: DF-${videoData.id}-${Date.now()}`,
      `Source: ${videoData.sourceLink}`,
    ];

    footerText.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });

    // Page numbers
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    pdf.save(`DeepfakeGuard-Report-${videoData.id}-${Date.now()}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};


  const handleSourceClick = () => {
    window.open(videoData.sourceLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-screen px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-semibold text-sm"
          style={{
            color: theme.colors.primary,
            backgroundColor: theme.colors.blue[50],
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </motion.button>

        {/* Header Section */}
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8 mb-8"
          style={{
            border: `3px solid ${statusColor}`,
            background: `linear-gradient(135deg, ${statusColor}08 0%, transparent 100%)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-4">
              <motion.div
                className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: statusColor + '20' }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <StatusIcon size={32} style={{ color: statusColor }} />
              </motion.div>
              <div>
                <h1
                  className="text-3xl font-black mb-1"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {videoData.isFake ? (
                    <span className="inline-flex items-center gap-2">
                      <AlertCircle size={22} />
                      Deepfake Detected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle size={22} />
                      Authentic Content
                    </span>
                  )}
                </h1>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Analysis completed at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            <motion.div
              className="text-center p-4 rounded-lg"
              style={{ backgroundColor: statusColor + '10' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: theme.colors.textSecondary }}>
                Confidence
              </p>
              <p
                className="text-5xl font-black"
                style={{ color: statusColor }}
              >
                {videoData.confidence}%
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8" ref={reportRef}>
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            {/* Left Upper - Video Preview */}
            <motion.div
              className="rounded-xl overflow-hidden shadow-xl bg-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isVideo ? (
                <div className="relative aspect-video bg-black">
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-xs font-bold z-20" style={{ backgroundColor: theme.colors.primary }}>
                    <span className="inline-flex items-center gap-1"><Clapperboard size={14} /> Video</span>
                  </div>
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoData.sourceLink}
                    title={videoData.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: 'none' }}
                  />
                </div>
              ) : (
                <div className="relative aspect-video">
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-xs font-bold z-20" style={{ backgroundColor: theme.colors.secondary }}>
                    <span className="inline-flex items-center gap-1"><ImageIcon size={14} /> Image</span>
                  </div>
                  <img
                    src={videoData.thumbnail}
                    alt={videoData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>

            {/* Left Bottom - Model Score Chart */}
            <ModelScoreChart modelScores={modelScores} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Right Upper - Metadata */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              style={{ border: `1px solid ${theme.colors.neutral.light}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
                <ClipboardList size={18} />
                Metadata
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <MetadataCard title="Title" value={videoData.title.substring(0, 20) + '...'} icon={<FileText size={16} />} index={0} />
                <MetadataCard title="Channel" value={videoData.channel} icon={<Tv size={16} />} index={1} />
                <MetadataCard 
                  title="Views" 
                  value={videoData.views || '0'} 
                  icon={<Eye size={16} />} 
                  index={2} 
                />
                <MetadataCard 
                  title="Date" 
                  value={videoData.uploadDate} 
                  icon={<Calendar size={16} />} 
                  index={3} 
                />
              </div>
            </motion.div>

            {/* Right Middle - Analysis Metrics */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              style={{ border: `1px solid ${theme.colors.neutral.light}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
                  <Search size={18} />
                  Analysis Metrics
                </h3>
                <motion.div
                  className="text-center px-3 py-1 rounded-lg"
                  style={{
                    backgroundColor: theme.colors.secondary + '10',
                    border: `1px solid ${theme.colors.secondary}`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-xs uppercase font-bold" style={{ color: theme.colors.secondary }}>
                    Avg: {averageScore}%
                  </p>
                </motion.div>
              </div>
              <div className="space-y-2">
                {analysisDetails.map((detail, idx) => (
                  <DetailMetric key={idx} label={detail.label} score={detail.score} index={idx} />
                ))}
              </div>
            </motion.div>

            {/* Right Bottom - Download & View Source Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <motion.button
                onClick={downloadReportPDF}
                className="flex-1 py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 text-sm"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 20px 40px ${theme.colors.primary}40`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
                Download PDF Report
              </motion.button>

              <motion.button
                onClick={handleSourceClick}
                className="flex-1 py-4 rounded-lg font-bold flex items-center justify-center gap-2 text-sm"
                style={{
                  backgroundColor: theme.colors.blue[50],
                  color: theme.colors.primary,
                  border: `2px solid ${theme.colors.primary}`,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: theme.colors.blue[100],
                  boxShadow: `0 20px 40px ${theme.colors.primary}20`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={20} />
                View Source
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <motion.div
          className="h-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Results;
