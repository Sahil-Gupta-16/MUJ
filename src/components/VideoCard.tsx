/**
 * src/components/VideoCard.tsx
 * 
 * Reusable video card component displaying thumbnail, title, status, and confidence score.
 * Uses Framer Motion for smooth animations and interactions.
 */

import React from 'react';
import { motion } from 'framer-motion';
import theme from '../config/theme';

interface VideoCardProps {
  id: number;
  thumbnail: string;
  title: string;
  channel: string;
  isFake: boolean;
  confidence: number;
  views: string;
  uploadDate: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  thumbnail,
  title,
  channel,
  isFake,
  confidence,
  views,
  uploadDate,
}) => {
  const statusColor = isFake ? theme.colors.error : theme.colors.success;
  const statusText = isFake ? 'Deepfake Detected' : 'Authentic';

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer"
      style={{ 
        border: `2px solid ${theme.colors.neutral.light}`,
        fontFamily: theme.fonts.base 
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: theme.shadows.lg,
        borderColor: theme.colors.primary 
      }}
    >
      {/* Thumbnail */}
      <div className="relative">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: statusColor }}
        >
          {statusText}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 
          className="font-bold text-lg mb-2 line-clamp-2"
          style={{ color: theme.colors.textPrimary }}
        >
          {title}
        </h3>
        <p 
          className="text-sm mb-3"
          style={{ color: theme.colors.textSecondary }}
        >
          {channel}
        </p>

        {/* Confidence Score */}
        <div className="mb-3">
          <div className="flex justify-between mb-1 text-sm">
            <span style={{ color: theme.colors.textSecondary }}>Confidence</span>
            <span 
              className="font-semibold"
              style={{ color: statusColor }}
            >
              {confidence}%
            </span>
          </div>
          <div 
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: theme.colors.neutral.light }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: statusColor }}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div 
          className="flex justify-between text-xs"
          style={{ color: theme.colors.textSecondary }}
        >
          <span>{views} views</span>
          <span>{uploadDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
