/**
 * src/pages/Trending.tsx
 * 
 * Professional trending videos page with real-time deepfake detection results.
 * Uses list format with VideoItem components, filters, animations, and live updates.
 * Features search, category filters, and engaging visual feedback.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  AlertTriangle,
  Eye,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import theme from '../config/theme';

interface VideoScan {
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

// Mock trending data
const trendingVideos: VideoScan[] = [
  {
    id: 1,
    thumbnail: 'https://via.placeholder.com/150x100/C1694F/FFFFFF?text=Deepfake',
    title: 'Celebrity Interview Goes Viral - Manipulation Detected',
    channel: 'Entertainment News',
    sourceLink: 'https://www.youtube.com',
    isFake: true,
    confidence: 92,
    views: '3.2M',
    uploadDate: '2 hours ago',
  },
  {
    id: 2,
    thumbnail: 'https://via.placeholder.com/150x100/8B9474/FFFFFF?text=Verified',
    title: 'Breaking News Report - Authenticity Confirmed',
    channel: 'Global News Network',
    sourceLink: 'https://www.youtube.com',
    isFake: false,
    confidence: 96,
    views: '1.8M',
    uploadDate: '4 hours ago',
  },
  {
    id: 3,
    thumbnail: 'https://via.placeholder.com/150x100/C1694F/FFFFFF?text=Suspicious',
    title: 'Political Speech Analysis - High Manipulation Score',
    channel: 'Politics Today',
    sourceLink: 'https://www.youtube.com',
    isFake: true,
    confidence: 88,
    views: '2.5M',
    uploadDate: '6 hours ago',
  },
  {
    id: 4,
    thumbnail: 'https://via.placeholder.com/150x100/8B9474/FFFFFF?text=Safe',
    title: 'Tech Product Launch - Original Content Verified',
    channel: 'TechReview Channel',
    sourceLink: 'https://www.youtube.com',
    isFake: false,
    confidence: 98,
    views: '890K',
    uploadDate: '8 hours ago',
  },
  {
    id: 5,
    thumbnail: 'https://via.placeholder.com/150x100/C1694F/FFFFFF?text=Warning',
    title: 'Viral Dance Challenge - Synthetic Media Detected',
    channel: 'Entertainment Hub',
    sourceLink: 'https://www.youtube.com',
    isFake: true,
    confidence: 85,
    views: '4.1M',
    uploadDate: '10 hours ago',
  },
  {
    id: 6,
    thumbnail: 'https://via.placeholder.com/150x100/8B9474/FFFFFF?text=Authentic',
    title: 'Educational Documentary - No Manipulation Found',
    channel: 'Learn Academy',
    sourceLink: 'https://www.youtube.com',
    isFake: false,
    confidence: 95,
    views: '654K',
    uploadDate: '12 hours ago',
  },
  {
    id: 7,
    thumbnail: 'https://via.placeholder.com/150x100/C1694F/FFFFFF?text=Alert',
    title: 'Financial Advice Video - Deepfake Technology Used',
    channel: 'Money Matters',
    sourceLink: 'https://www.youtube.com',
    isFake: true,
    confidence: 91,
    views: '1.2M',
    uploadDate: '14 hours ago',
  },
  {
    id: 8,
    thumbnail: 'https://via.placeholder.com/150x100/8B9474/FFFFFF?text=Clear',
    title: 'Sports Highlights Reel - Original Footage Confirmed',
    channel: 'Sports Network',
    sourceLink: 'https://www.youtube.com',
    isFake: false,
    confidence: 97,
    views: '2.9M',
    uploadDate: '16 hours ago',
  },
];

// Reusable Video List Item Component
const VideoListItem: React.FC<{ video: VideoScan; index: number }> = ({ video, index }) => {
  const navigate = useNavigate();
  const statusColor = video.isFake ? theme.colors.error : theme.colors.success;
  const StatusIcon = video.isFake ? AlertCircle : CheckCircle;

  const handleViewDetails = () => {
    navigate('/results', {
      state: {
        videoData: video,
      },
    });
  };

  const handleViewSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(video.sourceLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="bg-white rounded-lg p-5 mb-3 flex items-stretch space-x-5"
      style={{
        border: `1px solid ${theme.colors.neutral.light}`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        scale: 1.01,
        boxShadow: theme.shadows.md,
        borderColor: theme.colors.primary,
      }}
    >
      {/* Thumbnail */}
      <motion.div
        className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Main Content - Left Section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        {/* Title */}
        <h3
          className="font-bold text-base line-clamp-2"
          style={{ color: theme.colors.textPrimary }}
        >
          {video.title}
        </h3>

        {/* Channel - Single Row */}
        <div className="flex items-center space-x-2 text-sm mt-2" style={{ color: theme.colors.textSecondary }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.colors.textSecondary }} />
          <span className="truncate">{video.channel}</span>
        </div>

        {/* Status and Badges - Bottom */}
        <div className="flex items-center space-x-2 mt-3">
          {/* Status Badge */}
          <motion.div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: statusColor }}
            whileHover={{ scale: 1.05 }}
          >
            <StatusIcon size={12} />
            <span>{video.isFake ? 'Deepfake' : 'Authentic'}</span>
          </motion.div>

          
        </div>
      </div>

      {/* Meta Info - Middle Section */}
      <div className="flex-shrink-0 flex flex-col justify-between py-1 px-4 border-l" style={{ borderColor: theme.colors.neutral.light }}>
        <div className="flex items-center space-x-1 text-sm" style={{ color: theme.colors.textSecondary }}>
          <Eye size={16} />
          <span className="font-semibold">{video.views}</span>
        </div>

        <div className="flex items-center space-x-1 text-sm" style={{ color: theme.colors.textSecondary }}>
          <Calendar size={16} />
          <span className="font-semibold text-xs">{video.uploadDate}</span>
        </div>

        {/* Confidence Indicator */}
       <div className='flex items-center space-x-2'>
         <div className="w-16 h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.neutral.light }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: statusColor }}
            initial={{ width: 0 }}
            animate={{ width: `${video.confidence}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {/* Confidence Badge */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: statusColor + '20',
              color: statusColor,
            }}
          >
            <span>{video.confidence}%</span>
          </div>
       </div>
      </div>

      {/* Action Buttons - Right Section */}
      <div className="flex-shrink-0 flex flex-col space-y-2 justify-between py-1">
        {/* View Details Button */}
        <motion.button
          onClick={handleViewDetails}
          className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg font-semibold text-sm text-white"
          style={{
            background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
          }}
          whileHover={{ scale: 1.05, boxShadow: theme.shadows.md }}
          whileTap={{ scale: 0.95 }}
          title="View Full Analysis"
        >
          <span>Details</span>
          <ChevronRight size={16} />
        </motion.button>

        {/* View Source Button */}
        <motion.button
          onClick={handleViewSource}
          className="flex items-center justify-center space-x-1.5 p-2 rounded-lg"
          style={{
            backgroundColor: theme.colors.blue[50],
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.primary}`,
          }}
          whileHover={{ scale: 1.05, backgroundColor: theme.colors.blue[100] }}
          whileTap={{ scale: 0.95 }}
          title="View Source"
        >
          <ExternalLink size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

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
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                style={{ fontFamily: theme.fonts.base }}
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
                  color: 'white',
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
            icon={<Filter size={24} />}
            color={theme.colors.primary}
          />
          <StatsCard
            title="Deepfakes Found"
            value={fakeCount.toString()}
            icon={<AlertTriangle size={24} />}
            color={theme.colors.error}
          />
          <StatsCard
            title="Authentic Videos"
            value={authenticCount.toString()}
            icon={<CheckCircle size={24} />}
            color={theme.colors.success}
          />
          <StatsCard
            title="Detection Rate"
            value="94.7%"
            icon={<TrendingUp size={24} />}
            color={theme.colors.accent}
          />
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-8"
          style={{ border: `1px solid ${theme.colors.neutral.light}` }}
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
                placeholder="Search videos by title or channel..."
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
                  className="px-6 py-3 rounded-lg font-semibold capitalize transition-all flex items-center space-x-2"
                  style={{
                    backgroundColor:
                      filter === filterType ? theme.colors.primary : theme.colors.neutral.lightest,
                    color:
                      filter === filterType ? 'white' : theme.colors.textPrimary,
                    border: `2px solid ${
                      filter === filterType ? theme.colors.primary : theme.colors.neutral.medium
                    }`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filterType === 'all' && <Filter size={16} />}
                  {filterType === 'fake' && <AlertTriangle size={16} />}
                  {filterType === 'authentic' && <CheckCircle size={16} />}
                  <span>{filterType}</span>
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
            Showing <span className="font-bold" style={{ color: theme.colors.primary }}>{filteredVideos.length}</span> results
          </p>
        </motion.div>

        {/* Video List */}
        <AnimatePresence mode="popLayout">
          {filteredVideos.length > 0 ? (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredVideos.map((video, idx) => (
                <VideoListItem key={video.id} video={video} index={idx} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16 bg-white rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AlertTriangle size={48} style={{ color: theme.colors.textSecondary, margin: '0 auto 1rem' }} />
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
