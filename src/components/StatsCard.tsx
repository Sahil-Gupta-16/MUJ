/**
 * src/components/StatsCard.tsx
 * 
 * Displays key metrics with animated count-up effect.
 */

import React from 'react';
import { motion } from 'framer-motion';
import theme from '../config/theme';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <motion.div
    className="bg-white rounded-xl p-6 shadow-md"
    style={{ 
      border: `2px solid ${theme.colors.neutral.light}`,
      fontFamily: theme.fonts.base 
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    whileHover={{ 
      scale: 1.05, 
      boxShadow: theme.shadows.lg,
      borderColor: color 
    }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p 
          className="text-sm mb-1"
          style={{ color: theme.colors.textSecondary }}
        >
          {title}
        </p>
        <p 
          className="text-3xl font-bold"
          style={{ color }}
        >
          {value}
        </p>
      </div>
      <div 
        className="text-4xl opacity-[.9"
        style={{ color }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

export default StatsCard;
