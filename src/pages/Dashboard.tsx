/**
 * src/pages/Dashboard.tsx
 * 
 * Main dashboard displaying trending videos with deepfake detection results.
 * Uses grid layout, stats cards, and video cards with Framer Motion animations.
 */

import React from 'react';
import trendingVideos from '../data/trending-videos.json';
import { motion } from 'framer-motion';
import DashboardLayout from '/home/rs/Projects/MUJ/src/layouts/DashoardLayout.tsx';
import VideoCard from '../components/VideoCard';
import StatsCard from '../components/StatCard.tsx';
import theme from '../config/theme';

// Mock data - replace with real API data
// const trendingVideos = [
//   {
//     id: 1,
//     thumbnail: 'https://via.placeholder.com/400x300/A0674B/FFFFFF?text=Video+1',
//     title: 'Celebrity Interview Goes Viral - Authenticity Verified',
//     channel: 'News Network',
//     isFake: false,
//     confidence: 94,
//     views: '2.4M',
//     uploadDate: '2 days ago',
//   },
//   {
//     id: 2,
//     thumbnail: 'https://via.placeholder.com/400x300/C1694F/FFFFFF?text=Video+2',
//     title: 'Political Speech - Deepfake Alert Detected',
//     channel: 'Politics Today',
//     isFake: true,
//     confidence: 87,
//     views: '1.8M',
//     uploadDate: '1 day ago',
//   },
//   {
//     id: 3,
//     thumbnail: 'https://via.placeholder.com/400x300/A0674B/FFFFFF?text=Video+3',
//     title: 'Tech Product Review - Authentic Content',
//     channel: 'Tech Reviews',
//     isFake: false,
//     confidence: 96,
//     views: '890K',
//     uploadDate: '3 hours ago',
//   },
//   {
//     id: 4,
//     thumbnail: 'https://via.placeholder.com/400x300/C1694F/FFFFFF?text=Video+4',
//     title: 'Viral Dance Challenge - Manipulated Video Warning',
//     channel: 'Entertainment Hub',
//     isFake: true,
//     confidence: 92,
//     views: '3.2M',
//     uploadDate: '5 hours ago',
//   },
//   {
//     id: 5,
//     thumbnail: 'https://via.placeholder.com/400x300/A0674B/FFFFFF?text=Video+5',
//     title: 'Breaking News Report - Verified Authentic',
//     channel: 'Global News',
//     isFake: false,
//     confidence: 98,
//     views: '1.2M',
//     uploadDate: '1 hour ago',
//   },
//   {
//     id: 6,
//     thumbnail: 'https://via.placeholder.com/400x300/A0674B/FFFFFF?text=Video+6',
//     title: 'Educational Tutorial - Safe to Share',
//     channel: 'Learn Academy',
//     isFake: false,
//     confidence: 95,
//     views: '456K',
//     uploadDate: '6 hours ago',
//   },
// ];

const Dashboard: React.FC = () => (
  <DashboardLayout>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ 
            color: theme.colors.primary,
            fontFamily: theme.fonts.base 
          }}
        >
          Trending Videos Dashboard
        </h1>
        <p style={{ color: theme.colors.textSecondary }}>
          Real-time deepfake detection on trending social media content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Videos Scanned" 
          value="10.2M" 
          icon="📹" 
          color={theme.colors.primary} 
        />
        <StatsCard 
          title="Deepfakes Detected" 
          value="2.4K" 
          icon="⚠️" 
          color={theme.colors.error} 
        />
        <StatsCard 
          title="Authentic Videos" 
          value="9.8M" 
          icon="✅" 
          color={theme.colors.success} 
        />
        <StatsCard 
          title="Avg Confidence" 
          value="94%" 
          icon="📊" 
          color={theme.colors.accent} 
        />
      </div>

      {/* Trending Videos Grid */}
      <div className="mb-6">
        <h2 
          className="text-2xl font-bold mb-4"
          style={{ 
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.base 
          }}
        >
          Trending Now
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingVideos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </motion.div>
  </DashboardLayout>
);

export default Dashboard;
