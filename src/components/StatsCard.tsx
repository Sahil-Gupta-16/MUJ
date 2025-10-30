/**
 * src/components/StatsCard.tsx
 * 
 * Displays key metrics with animated count-up effect.
 * Theme-aware border color that adapts to light/dark themes.
 * Refreshes page when theme changes.
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import theme from '../config/theme';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  isDark?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, isDark = false }) => {
  // Detect theme changes and refresh page
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      // Small delay to ensure theme is updated
      setTimeout(() => {
        window.location.reload();
      }, 300);
    };

    // Listen for theme changes
    prefersDark.addEventListener('change', handleThemeChange);

    // Check for theme change in localStorage
    const storedTheme = localStorage.getItem('theme');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class') {
          const newTheme = localStorage.getItem('theme');
          if (newTheme !== storedTheme) {
            window.location.reload();
          }
        }
      });
    });

    // Observe document element for theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => {
      prefersDark.removeEventListener('change', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  // Determine border color based on theme
  const borderColor = isDark 
    ? theme.colors.neutral.light      // Light border for dark theme
    : theme.colors.neutral.lightest;  // Lightest border for light theme

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-md"
      style={{ 
        border: `2px solid ${borderColor}`,
        fontFamily: theme.fonts.base 
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: theme.shadows.lg,
        borderColor: color,
        backgroundColor: color + '08'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p 
            className="text-sm mb-1 font-medium"
            style={{ color: theme.colors.textSecondary }}
          >
            {title}
          </p>
          <p 
            className="text-3xl font-black"
            style={{ color }}
          >
            {value}
          </p>
        </div>
        <motion.div 
          className="text-4xl opacity-90 flex-shrink-0 ml-4"
          style={{ color }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
