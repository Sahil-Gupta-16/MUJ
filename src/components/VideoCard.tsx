/**
 * src/components/VideoCard.tsx
 * 
 * Professional video card component with comprehensive data display and rich animations.
 * Shows thumbnail, title, channel, source link, status badge, confidence score, views, and upload date.
 * Features hover effects, animated progress bars, play overlay, and interactive elements.
 * Navigates to detailed results page on "View Full Analysis" button click.
 * Supports playable video preview if media type is video.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Pause,
  ExternalLink,
  Shield,
  Activity,
  Video,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import theme from '../config/theme';

interface VideoCardProps {
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
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  thumbnail,
  title,
  channel,
  sourceLink,
  isFake,
  confidence,
  views,
  uploadDate,
  mediaType = 'image',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const statusColor = isFake ? theme.colors.error : theme.colors.success;
  const statusText = isFake ? 'Deepfake Detected' : 'Authentic';
  const StatusIcon = isFake ? AlertCircle : CheckCircle;
  const isVideo = mediaType === 'video';

  // Open source link in new tab
  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(sourceLink, '_blank', 'noopener,noreferrer');
  };

  // Navigate to results page with video data
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/results', { 
      state: { 
        videoData: {
          id,
          thumbnail,
          title,
          channel,
          sourceLink,
          isFake,
          confidence,
          views,
          uploadDate,
          mediaType,
        }
      } 
    });
  };

  // Video controls
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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
    <>
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer relative group"
        style={{
          border: `2px solid ${theme.colors.neutral.light}`,
          fontFamily: theme.fonts.base,
        }}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        whileHover={{
          scale: 1.05,
          boxShadow: theme.shadows.xl,
          borderColor: theme.colors.primary,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleViewDetails}
      >
        {/* Confidence Ring Indicator */}
        <motion.div
          className="absolute top-2 right-2 w-14 h-14 rounded-full flex items-center justify-center z-10"
          style={{
            background: `conic-gradient(${statusColor} ${confidence * 3.6}deg, ${theme.colors.neutral.light} 0deg)`,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
          whileHover={{ scale: 1.15, rotate: 360 }}
        >
          <div
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold shadow-sm"
            style={{ color: statusColor }}
          >
            <div className="text-center">
              <div className="text-xs leading-none">{confidence}</div>
              <div className="text-[8px] leading-none">%</div>
            </div>
          </div>
        </motion.div>

        {/* Thumbnail Section */}
        <div className="relative overflow-hidden h-52 bg-black">
          {isVideo ? (
            <div className="relative w-full h-full">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
          ) : (
            <motion.img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
            }}
          />

          {/* Play Overlay on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isVideo) {
                        setShowVideoPreview(true);
                      }
                    }}
                  >
                    <Play size={28} fill="white" color="white" />
                  </motion.div>
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `3px solid ${theme.colors.primary}`,
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Badge */}
          {isVideo && (
            <motion.div
              className="absolute top-3 left-3 px-2 py-1 rounded-full text-white font-bold text-xs shadow-lg flex items-center gap-1 backdrop-blur-sm"
              style={{ backgroundColor: theme.colors.primary + 'E6' }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Video size={12} />
              <span>Video</span>
            </motion.div>
          )}

          {/* Status Badge */}
          <motion.div
            className="absolute top-3 left-20 px-3 py-1.5 rounded-full text-white font-semibold text-xs shadow-lg flex items-center space-x-1.5 backdrop-blur-sm"
            style={{ backgroundColor: statusColor + 'E6' }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.1, y: -2 }}
          >
            <StatusIcon size={14} />
            <span>{statusText}</span>
          </motion.div>

          {/* Trending Indicator */}
          {confidence > 90 && (
            <motion.div
              className="absolute top-3 right-20 px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: theme.colors.warning + 'E6',
                color: 'white',
              }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <TrendingUp size={12} />
              <span className="text-xs font-bold">Hot</span>
            </motion.div>
          )}

          {/* Shield Icon for High Confidence Authentic */}
          {!isFake && confidence >= 95 && (
            <motion.div
              className="absolute bottom-3 left-3"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Shield size={24} style={{ color: theme.colors.success }} fill={theme.colors.success} />
            </motion.div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title with animation */}
          <motion.h3
            className="font-bold text-base line-clamp-2 min-h-[3rem]"
            style={{ color: theme.colors.textPrimary }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {title}
          </motion.h3>

          {/* Channel Name with Link */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-medium flex items-center space-x-1" style={{ color: theme.colors.textSecondary }}>
              <Video size={14} />
              <span>{channel}</span>
            </p>
            <motion.button
              onClick={handleSourceClick}
              className="p-1.5 rounded-full hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              title="View Source"
            >
              <ExternalLink size={16} style={{ color: theme.colors.primary }} />
            </motion.button>
          </motion.div>

          {/* Confidence Score Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1.5">
                <Activity size={14} style={{ color: theme.colors.textSecondary }} />
                <span className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                  Detection Score
                </span>
              </div>
              <motion.span
                className="font-bold text-base"
                style={{ color: statusColor }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.7 }}
              >
                {confidence}%
              </motion.span>
            </div>

            {/* Animated Progress Bar with Gradient */}
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.colors.neutral.light }}
            >
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${statusColor}, ${statusColor}DD)`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                    delay: 1.5,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Divider with Animation */}
          <motion.div
            className="border-t"
            style={{ borderColor: theme.colors.neutral.medium }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9 }}
          />

          {/* Meta Information */}
          <motion.div
            className="flex justify-between items-center text-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {/* Views */}
            <motion.div
              className="flex items-center space-x-1.5 px-2 py-1 rounded-lg"
              style={{ color: theme.colors.textSecondary }}
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: theme.colors.blue[50],
                color: theme.colors.primary 
              }}
            >
              <Eye size={14} />
              <span className="font-semibold">{views}</span>
            </motion.div>

            {/* Upload Date */}
            <motion.div
              className="flex items-center space-x-1.5 px-2 py-1 rounded-lg"
              style={{ color: theme.colors.textSecondary }}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: theme.colors.emerald[50],
                color: theme.colors.secondary 
              }}
            >
              <Calendar size={14} />
              <span className="font-semibold">{uploadDate}</span>
            </motion.div>
          </motion.div>

          {/* View Details Button (appears on hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                onClick={handleViewDetails}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-white"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.02, boxShadow: theme.shadows.md }}
                whileTap={{ scale: 0.98 }}
              >
                View Full Analysis
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Glow effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: `0 0 40px ${isFake ? theme.colors.error : theme.colors.success}80`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {showVideoPreview && isVideo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideoPreview(false)}
          >
            <motion.div
              className="bg-black rounded-xl overflow-hidden max-w-4xl w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setShowVideoPreview(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} color="white" />
              </motion.button>

              {/* Video Player */}
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  src={sourceLink}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="w-full h-full"
                />

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 space-y-3">
                  {/* Progress Bar */}
                  <div
                    className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all"
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

                  {/* Controls */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={togglePlay}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isPlaying ? (
                          <Pause size={20} fill="white" />
                        ) : (
                          <Play size={20} fill="white" />
                        )}
                      </motion.button>

                      <motion.button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isMuted ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </motion.button>

                      <span className="text-xs font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <span className="text-xs font-medium truncate max-w-xs">
                      {title}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoCard;
