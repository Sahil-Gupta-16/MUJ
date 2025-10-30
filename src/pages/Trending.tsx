/**
 * src/pages/Trending.tsx
 * 
 * Professional trending videos page with real-time deepfake detection results.
 * Uses VideoCard components, filters, animations, and live update simulation.
 * Features search, category filters, and engaging visual feedback.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import VideoCard from '../components/VideoCard';
import StatsCard from '../components/StatsCard';
import theme from '../config/theme';

interface VideoScan {
  id: number;
  thumbnail: string;
  title: string;
  channel: string;
  isFake: boolean;
  confidence: number;
  views: string;
  uploadDate: string;
}

// Mock trending data - replace with real API
const trendingVideos: VideoScan[] = [
  {
    id: 1,
    thumbnail: 'https://via.placeholder.com/400x300/C1694F/FFFFFF?text=Deepfake+Alert',
    title: 'Celebrity Interview Goes Viral - Manipulation Detected',
    channel: 'Entertainment News',
    isFake: true,
    confidence: 92,
    views: '3.2M',
    uploadDate: '2 hours ago',
  },
  {
    id: 2,
    thumbnail: 'https://via.placeholder.com/400x300/8B9474/FFFFFF?text=Verified',
    title: 'Breaking News Report - Authenticity Confirmed',
    channel: 'Global News Network',
    isFake: false,
    confidence: 96,
    views: '1.8M',
    uploadDate: '4 hours ago',
  },
  {
    id: 3,
    thumbnail: 'https://via.placeholder.com/400x300/C1694F/FFFFFF?text=Suspicious',
    title: 'Political Speech Analysis - High Manipulation Score',
    channel: 'Politics Today',
    isFake: true,
    confidence: 88,
    views: '2.5M',
    uploadDate: '6 hours ago',
  },
  {
    id: 4,
    thumbnail: 'https://via.placeholder.com/400x300/8B9474/FFFFFF?text=Safe',
    title: 'Tech Product Launch - Original Content Verified',
    channel: 'TechReview Channel',
    isFake: false,
    confidence: 98,
    views: '890K',
    uploadDate: '8 hours ago',
  },
  {
    id: 5,
    thumbnail: 'https://via.placeholder.com/400x300/C1694F/FFFFFF?text=Warning',
    title: 'Viral Dance Challenge - Synthetic Media Detected',
    channel: 'Entertainment Hub',
    isFake: true,
    confidence: 85,
    views: '4.1M',
    uploadDate: '10 hours ago',
  },
  {
    id: 6,
    thumbnail: 'https://via.placeholder.com/400x300/8B9474/FFFFFF?text=Authentic',
    title: 'Educational Documentary - No Manipulation Found',
    channel: 'Learn Academy',
    isFake: false,
    confidence: 95,
    views: '654K',
    uploadDate: '12 hours ago',
  },
  {
    id: 7,
    thumbnail: 'https://via.placeholder.com/400x300/C1694F/FFFFFF?text=Alert',
    title: 'Financial Advice Video - Deepfake Technology Used',
    channel: 'Money Matters',
    isFake: true,
    confidence: 91,
    views: '1.2M',
    uploadDate: '14 hours ago',
  },
  {
    id: 8,
    thumbnail: 'https://via.placeholder.com/400x300/8B9474/FFFFFF?text=Clear',
    title: 'Sports Highlights Reel - Original Footage Confirmed',
    channel: 'Sports Network',
    isFake: false,
    confidence: 97,
    views: '2.9M',
    uploadDate: '16 hours ago',
  },
  {
    id: 9,
    thumbnail: 'https://via.placeholder.com/400x300/C1694F/FFFFFF?text=Fake',
    title: 'Celebrity Endorsement - AI Generated Content Detected',
    channel: 'Ad Watch',
    isFake: true,
    confidence: 89,
    views: '1.5M',
    uploadDate: '18 hours ago',
  },
];

const Trending: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'fake' | 'authentic'>('all');
  const [videos, setVideos] = useState(trendingVideos);
  const [newScanCount, setNewScanCount] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNewScanCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'fake' && video.isFake) ||
      (filter === 'authentic' && !video.isFake);
    return matchesSearch && matchesFilter;
  });

  const fakeCount = videos.filter((v) => v.isFake).length;
  const authenticCount = videos.filter((v) => !v.isFake).length;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: theme.colors.primary, fontFamily: theme.fonts.base }}
              >
                Trending Deepfake Scans
              </h1>
              <p style={{ color: theme.colors.textSecondary }}>
                Real-time analysis of viral social media content
              </p>
            </div>
            {newScanCount > 0 && (
              <motion.div
                className="flex items-center space-x-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: theme.colors.success,
                  color: theme.colors.background.light,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Clock size={20} />
                <span className="font-semibold">+{newScanCount} new scans</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Scans"
            value={videos.length.toString()}
            icon="📊"
            color={theme.colors.primary}
          />
          <StatsCard
            title="Deepfakes Found"
            value={fakeCount.toString()}
            icon="⚠️"
            color={theme.colors.error}
          />
          <StatsCard
            title="Authentic Videos"
            value={authenticCount.toString()}
            icon="✅"
            color={theme.colors.success}
          />
          <StatsCard
            title="Detection Rate"
            value="94.7%"
            icon="🎯"
            color={theme.colors.accent}
          />
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          style={{ border: `1px solid ${theme.colors.neutral.medium}` }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: theme.colors.textSecondary }}
              />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all"
                style={{
                  border: `2px solid ${theme.colors.neutral.medium}`,
                  fontFamily: theme.fonts.base,
                  color: theme.colors.textPrimary,
                }}
                onFocus={(e) => (e.target.style.borderColor = theme.colors.primary)}
                onBlur={(e) => (e.target.style.borderColor = theme.colors.neutral.medium)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {(['all', 'fake', 'authentic'] as const).map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className="px-6 py-3 rounded-lg font-semibold capitalize transition-all"
                  style={{
                    backgroundColor:
                      filter === filterType ? theme.colors.primary : theme.colors.neutral.lightest,
                    color:
                      filter === filterType
                        ? theme.colors.background.light
                        : theme.colors.textPrimary,
                    border: `2px solid ${
                      filter === filterType ? theme.colors.primary : theme.colors.neutral.medium
                    }`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filterType === 'all' && <Filter size={16} className="inline mr-2" />}
                  {filterType === 'fake' && <AlertTriangle size={16} className="inline mr-2" />}
                  {filterType === 'authentic' && <TrendingUp size={16} className="inline mr-2" />}
                  {filterType}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.base }}>
            Showing <span className="font-bold">{filteredVideos.length}</span> results
          </p>
        </motion.div>

        {/* Video Grid using VideoCard */}
        <AnimatePresence mode="popLayout">
          {filteredVideos.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <VideoCard {...video} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-semibold mb-2" style={{ color: theme.colors.textPrimary }}>
                No videos found
              </p>
              <p style={{ color: theme.colors.textSecondary }}>
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default Trending;
