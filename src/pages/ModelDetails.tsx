/**
 * src/pages/ModelDetails.tsx
 * 
 * Detailed page showing individual model scores and analysis.
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ArrowLeft, TrendingUp } from 'lucide-react';
import theme from '../config/theme';

interface ModelScore {
  name: string;
  score: number;
  color: string;
}

const ModelDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { modelScores = [], videoData = {} } = (location.state as any) || {};

  if (!modelScores || modelScores.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p style={{ color: theme.colors.textSecondary }} className="text-lg">
            No model data available
          </p>
          <motion.button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-bold text-white"
            style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            whileHover={{ scale: 1.05 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const averageScore = Math.round(
    modelScores.reduce((acc: number, m: ModelScore) => acc + m.score, 0) / modelScores.length
  );

  const handleModelClick = (model: ModelScore) => {
    navigate('/model-report', {
      state: {
        model,
        videoData,
        modelScores,
      },
    });
  };

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={24} style={{ color: theme.colors.primary }} />
            </motion.button>
            <div>
              <h1 className="text-4xl font-black" style={{ color: theme.colors.textPrimary }}>
                Model Analysis Details
              </h1>
              <p style={{ color: theme.colors.textSecondary }} className="mt-1">
                Click on any model to view detailed forensic analysis
              </p>
            </div>
          </div>
        </motion.div>

        {/* Video Info Card */}
        {videoData.title && (
          <motion.div
            className="p-6 rounded-xl bg-white shadow-lg border-2"
            style={{ borderColor: theme.colors.neutral.light }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-3" style={{ color: theme.colors.textPrimary }}>
              Video Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Title
                </p>
                <p className="font-semibold line-clamp-2" style={{ color: theme.colors.textPrimary }}>
                  {videoData.title}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Channel
                </p>
                <p className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                  {videoData.channel}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Views
                </p>
                <p className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                  {videoData.views}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  Status
                </p>
                <p
                  className="font-semibold"
                  style={{ color: videoData.isFake ? theme.colors.error : theme.colors.success }}
                >
                  {videoData.isFake ? 'Deepfake' : 'Authentic'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Average Score Card */}
        <motion.div
          className="p-8 rounded-xl shadow-lg text-white"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90">Overall Model Confidence</p>
              <p className="text-5xl font-black mt-2">{averageScore}%</p>
            </div>
            <TrendingUp size={48} />
          </div>
        </motion.div>

        {/* Individual Model Scores - Clickable */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {modelScores.map((model: ModelScore, idx: number) => (
            <motion.button
              key={idx}
              onClick={() => handleModelClick(model)}
              className="p-6 rounded-xl bg-white shadow-lg border-2 text-left cursor-pointer group transition-all"
              style={{ borderColor: model.color + '40' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 10px 30px ${model.color}30`,
                borderColor: model.color,
              }}
            >
              {/* Model Name */}
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.textPrimary }}>
                <BarChart3 size={20} style={{ color: model.color }} />
                {model.name}
                <span className="text-xs ml-auto px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition" style={{ backgroundColor: model.color + '20', color: model.color }}>
                  Click to explore
                </span>
              </h3>

              {/* Large Score Display */}
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <p style={{ color: theme.colors.textSecondary }} className="text-sm mb-1">
                    Confidence Score
                  </p>
                  <p className="text-5xl font-black" style={{ color: model.color }}>
                    {model.score}%
                  </p>
                </div>

                {/* Status Badge */}
                <div
                  className="px-4 py-2 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: model.color }}
                >
                  {model.score >= 75 ? 'High' : model.score >= 50 ? 'Medium' : 'Low'}
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: theme.colors.neutral.light }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: model.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${model.score}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Details */}
              <motion.div
                className="mt-6 space-y-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Reliability</span>
                  <span style={{ color: model.color }} className="font-semibold">
                    {model.score >= 80 ? 'Very High' : model.score >= 60 ? 'High' : 'Moderate'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Confidence Level</span>
                  <span style={{ color: model.color }} className="font-semibold">
                    {Math.round(model.score / 10)} / 10
                  </span>
                </div>
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

        {/* Analysis Summary */}
        <motion.div
          className="p-6 rounded-xl bg-white shadow-lg border-2"
          style={{ borderColor: theme.colors.neutral.light }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
            Summary
          </h3>
          <p style={{ color: theme.colors.textSecondary }} className="leading-relaxed">
            The analysis shows that the video has an average model confidence score of <strong>{averageScore}%</strong>.
            {videoData.isFake
              ? ' Multiple models have detected synthetic or manipulated content with high confidence.'
              : ' The models consistently indicate the video appears to be authentic with minimal artifacting.'}
            Click on any model to view detailed forensic analysis and frame-by-frame insights.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModelDetails;
