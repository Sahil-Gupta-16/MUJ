/**
 * src/pages/Dashboard.tsx
 * 
 * Main dashboard displaying detected deepfake videos.
 * Shows top 3 fake videos with option to view more on trending page.
 * Uses grid layout, stats cards, and video cards with Framer Motion animations.
 * Uses Lucide React icons throughout for professional appearance.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import trendingVideos from '../data/trending-videos.json';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  AlertTriangle, 
  Video, 
  ShieldAlert, 
  ShieldCheck, 
  BarChart3 
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import VideoCard from '../components/VideoCard';
import StatsCard from '../components/StatsCard';
import theme from '../config/theme';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Filter only fake videos and get top 3
  const fakeVideos = trendingVideos.filter((video) => video.isFake).slice(0, 3);
  
  // Calculate stats
  const totalVideos = trendingVideos.length;
  const totalFakes = trendingVideos.filter((v) => v.isFake).length;
  const totalAuthentic = trendingVideos.filter((v) => !v.isFake).length;
  const avgConfidence = Math.round(
    trendingVideos.reduce((sum, v) => sum + v.confidence, 0) / trendingVideos.length
  );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            style={{ fontFamily: theme.fonts.base }}
          >
            Deepfake Detection Dashboard
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Real-time monitoring of detected deepfake content across social media
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Videos Scanned"
            value={totalVideos.toString()}
            icon={<Video size={48} />}
            color={theme.colors.primary}
          />
          <StatsCard
            title="Deepfakes Detected"
            value={totalFakes.toString()}
            icon={<ShieldAlert size={42} />}
            color={theme.colors.error}
          />
          <StatsCard
            title="Authentic Videos"
            value={totalAuthentic.toString()}
            icon={<ShieldCheck size={42} />}
            color={theme.colors.success}
          />
          <StatsCard
            title="Avg Confidence"
            value={`${avgConfidence}%`}
            icon={<BarChart3 size={42} />}
            color={theme.colors.accent}
          />
        </div>

        {/* Alert Section for Detected Deepfakes */}
        <motion.div
          className="mb-6 p-4 rounded-xl"
          style={{
            backgroundColor: theme.colors.error + '15',
            border: `2px solid ${theme.colors.error}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.colors.error }}
            >
              <AlertTriangle size={20} color="white" />
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ color: theme.colors.error }}>
                Recent Deepfake Detections
              </h3>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                {totalFakes} suspicious videos detected in the last 42 hours
              </p>
            </div>
          </div>
        </motion.div>

        {/* Detected Deepfakes Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="text-2xl font-bold"
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.base,
            }}
          >
            Recently Detected Deepfakes
          </h2>
          <motion.button
            onClick={() => navigate('/trending')}
            className="flex items-center space-x-2 px-5 py-2 rounded-lg font-semibold text-white"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            }}
            whileHover={{ scale: 1.05, boxShadow: theme.shadows.md }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Trending</span>
            <ArrowRight size={18} />
          </motion.button>
        </div>

        {/* Fake Videos Grid - Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {fakeVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/trending')}
            className="px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-3"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
              color: 'white',
              boxShadow: theme.shadows.lg,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: theme.shadows.xl,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore All Videos</span>
            <ArrowRight size={42} />
          </motion.button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
