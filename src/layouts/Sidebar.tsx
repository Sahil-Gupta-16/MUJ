/**
 * src/layouts/Sidebar.tsx
 *
 * Modern, collapsible sidebar with smooth animations and professional design.
 * Toggle button hidden when collapsed.
 * Responsive and elegant layout using Framer Motion.
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  TrendingUp,
  ChevronLeft,
  Clock,
  BarChart3,
} from 'lucide-react';
import theme from '../config/theme';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3, color: '#3B82F6' },
  { path: '/trending', label: 'Trending', icon: TrendingUp, color: '#F59E0B' },
  { path: '/upload', label: 'Upload', icon: Upload, color: '#10B981' },
  { path: '/monitoring', label: 'Monitoring', icon: BarChart3, color: '#8B5CF6' },
  { path: '/history', label: 'History', icon: Clock, color: '#EF4444' },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '100px' },
  };

  return (
    <motion.nav
      className="relative shadow-xl h-screen flex flex-col sticky top-0"
      style={{
        backgroundColor: theme.colors.neutral.lightest,
        borderRight: `3px solid ${theme.colors.neutral.light}`,
        fontFamily: theme.fonts.base,
      }}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Sidebar Header */}
      <div 
        className="p-4 border-b flex items-center justify-between gap-2" 
        style={{ borderColor: theme.colors.neutral.light }}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-header"
              className="flex items-center space-x-2 flex-1 min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
              >
                <BarChart3 size={20} color="white" />
              </div>
              <h2
                className="text-lg font-black whitespace-nowrap"
                style={{ color: theme.colors.primary }}
              >
                Menu
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-header"
              className="flex justify-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
              >
                <BarChart3 size={20} color="white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button (Hidden when collapsed) */}
        {!isCollapsed && (
          <motion.button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0"
            style={{
              color: theme.colors.primary,
              border: `2px solid ${theme.colors.primary}`,
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={18} />
          </motion.button>
        )}
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(({ path, label, icon: IconComponent, color }) => (
          <li key={path} className="relative">
            <NavLink
              to={path}
              onMouseEnter={() => setHoveredRoute(path)}
              onMouseLeave={() => setHoveredRoute(null)}
              className={({ isActive }) =>
                `flex items-center rounded-xl transition-all duration-300 relative group ${
                  isCollapsed ? 'justify-center p-4' : 'px-4 py-3.5'
                } ${isActive ? 'shadow-lg' : ''}`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? color + '20' : 'transparent',
                borderLeft: isActive ? `4px solid ${color}` : '4px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{
                        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                      }}
                      layoutId="activeBackground"
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                  )}

                  <motion.div
                    className="flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent
                      size={isCollapsed ? 28 : 24}
                      strokeWidth={isActive ? 2.5 : 2}
                      style={{
                        color: isActive ? color : theme.colors.textSecondary,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        className="ml-3 text-sm font-semibold"
                        style={{
                          color: isActive ? color : theme.colors.textSecondary,
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isCollapsed && isActive && (
                    <motion.div
                      className="absolute right-2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                      layoutId="activeDot"
                      transition={{ type: 'spring', stiffness: 200 }}
                    />
                  )}

                  <AnimatePresence>
                    {isCollapsed && hoveredRoute === path && (
                      <motion.div
                        className="absolute left-full ml-2 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 font-semibold"
                        style={{
                          backgroundColor: color,
                          color: 'white',
                          boxShadow: `0 8px 24px ${color}60`,
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div
        className="p-4 border-t mt-auto"
        style={{ borderColor: theme.colors.neutral.light }}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-footer"
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2">
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.colors.textSecondary }}>
                  Active Routes
                </p>
                <p className="text-2xl font-black mt-1" style={{ color: theme.colors.primary }}>
                  5
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              className="flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                5
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Sidebar;
