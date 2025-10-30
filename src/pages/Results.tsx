/**
 * src/pages/Results.tsx
 * 
 * Detailed results page showing comprehensive deepfake detection analysis.
 * Modern, spacious layout with efficient space utilization.
 * Displays video information, confidence scores, detailed metrics with numeric scores, and downloadable PDF reports.
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
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DashboardLayout from '../layouts/DashboardLayout';
import theme from '../config/theme';

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
    if (s >= 75) return 'High';
    if (s >= 50) return 'Medium';
    return 'Low';
  };

  return (
    <motion.div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: theme.colors.neutral.lightest,
        border: `1px solid ${theme.colors.neutral.light}`,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        scale: 1.01,
        borderColor: theme.colors.primary,
        boxShadow: theme.shadows.sm,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm" style={{ color: theme.colors.textPrimary }}>
          {label}
        </span>
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: theme.colors.neutral.light }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.03 }}
            />
          </div>
          <div className="flex items-center space-x-1 min-w-fit">
            <span className="font-bold text-sm" style={{ color: scoreColor }}>
              {score}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ color: scoreColor, backgroundColor: scoreColor + '20' }}>
              {getSeverityLabel(score)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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

  const analysisDetails: AnalysisDetail[] = [
    { 
      label: 'Lip-sync analysis', 
      score: videoData.isFake ? 82 : 15,
    },
    { 
      label: 'Facial expression consistency', 
      score: videoData.isFake ? 68 : 88,
    },
    { 
      label: 'Temporal coherence', 
      score: videoData.isFake ? 79 : 12,
    },
    { 
      label: 'Audio-visual alignment', 
      score: videoData.isFake ? 71 : 25,
    },
    { 
      label: 'Frame-level artifacts', 
      score: videoData.isFake ? 85 : 8,
    },
    { 
      label: 'Background consistency', 
      score: videoData.isFake ? 62 : 92,
    },
  ];

  const downloadReportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`deepfake-analysis-${videoData.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleSourceClick = () => {
    window.open(videoData.sourceLink, '_blank', 'noopener,noreferrer');
  };

  const averageScore = Math.round(
    analysisDetails.reduce((sum, detail) => sum + detail.score, 0) / analysisDetails.length
  );

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-screen mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg"
          style={{
            color: theme.colors.primary,
            backgroundColor: theme.colors.blue[50],
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          <span className="font-semibold text-sm">Back</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          ref={reportRef}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          style={{
            border: `2px solid ${theme.colors.neutral.light}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Top Section - Hero with Status */}
          <div
            className="p-8"
            style={{
              background: `linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}05 100%)`,
              borderBottom: `2px solid ${statusColor}`,
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <motion.div
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: statusColor + '20' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <StatusIcon size={28} style={{ color: statusColor }} />
                </motion.div>
                <div>
                  <h1
                    className="text-3xl font-bold mb-1"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {videoData.isFake ? 'Deepfake Detected' : 'Authentic Video'}
                  </h1>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    Analysis completed at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Confidence Score - Large */}
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
                  Confidence
                </p>
                <p className="text-5xl font-black" style={{ color: statusColor }}>
                  {videoData.confidence}%
                </p>
              </div>
            </div>

            {/* Thumbnail */}
            <motion.img
              src={videoData.thumbnail}
              alt={videoData.title}
              className="w-full h-48 object-cover rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content Grid */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video Info */}
            <div className="lg:col-span-1">
              <h3 className="text-sm uppercase tracking-wide font-bold mb-4" style={{ color: theme.colors.textSecondary }}>
                Video Information
              </h3>
              <div className="space-y-4">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>
                    Title
                  </p>
                  <p className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                    {videoData.title}
                  </p>
                </motion.div>

                {/* Channel */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>
                    Channel
                  </p>
                  <p className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                    {videoData.channel}
                  </p>
                </motion.div>

                {/* Views */}
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Eye size={14} style={{ color: theme.colors.textSecondary }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: theme.colors.textSecondary }}>
                      Views
                    </p>
                    <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                      {videoData.views}
                    </p>
                  </div>
                </motion.div>

                {/* Date */}
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Calendar size={14} style={{ color: theme.colors.textSecondary }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: theme.colors.textSecondary }}>
                      Uploaded
                    </p>
                    <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                      {videoData.uploadDate}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column - Analysis */}
            <div className="lg:col-span-2">
              {/* Average Score */}
              <motion.div
                className="mb-6 p-5 rounded-lg"
                style={{
                  backgroundColor: theme.colors.secondary + '10',
                  border: `1px solid ${theme.colors.secondary}`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gauge size={18} style={{ color: theme.colors.secondary }} />
                    <div>
                      <p className="text-xs uppercase tracking-wide font-bold" style={{ color: theme.colors.textSecondary }}>
                        Average Analysis Score
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black" style={{ color: theme.colors.secondary }}>
                      {averageScore}
                    </p>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                      / 100
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Metrics Grid */}
              <div>
                <h3 className="text-sm uppercase tracking-wide font-bold mb-4" style={{ color: theme.colors.textSecondary }}>
                  Analysis Metrics
                </h3>
                <div className="space-y-2">
                  {analysisDetails.map((detail, idx) => (
                    <DetailMetric key={idx} label={detail.label} score={detail.score} index={idx} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-8 py-6 border-t flex flex-col sm:flex-row gap-3"
            style={{ borderColor: theme.colors.neutral.light }}
          >
            <motion.button
              onClick={downloadReportPDF}
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold text-white"
              style={{
                background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={18} />
              <span>Download PDF</span>
            </motion.button>

            <motion.button
              onClick={handleSourceClick}
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: theme.colors.blue[50],
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink size={18} />
              <span>View Source</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Results;
