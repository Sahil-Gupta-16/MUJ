/**
 * src/layouts/Sidebar.tsx
 *
 * Modern, collapsible sidebar with smooth animations and professional design.
 * Fixed toggle button positioning, enhanced navigation with proper icons.
 * Responsive layout that doesn't break header or page flow.
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  Folder,
  Settings,
} from 'lucide-react';
import theme from '../config/theme';
import { routes } from '../routes';

// Icon mapping for routes using Lucide React icons
const routeIcons: Record<string, React.ElementType> = {
  '/dashboard': LayoutDashboard,
  '/upload': Upload,
  '/trending': TrendingUp,
  '/results': FileText,
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const sidebarVariants = {
    expanded: { width: '256px' },
    collapsed: { width: '80px' },
  };

  return (
    <motion.nav
      className="relative shadow-lg h-screen flex flex-col"
      style={{
        backgroundColor: theme.colors.neutral.lightest,
        borderRight: `2px solid ${theme.colors.neutral.light}`,
        fontFamily: theme.fonts.base,
      }}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Sidebar Header with Toggle */}
      <div 
        className="p-4 border-b flex items-center justify-between" 
        style={{ borderColor: theme.colors.neutral.light }}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Folder size={24} style={{ color: theme.colors.primary }} />
              <h2
                className="text-lg font-bold"
                style={{ color: theme.colors.primary }}
              >
                Menu
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              className="flex justify-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Folder size={24} style={{ color: theme.colors.primary }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button - Inside Sidebar */}
        {!isCollapsed && (
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white transition-colors"
            style={{
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.neutral.medium}`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} />
          </motion.button>
        )}
        
        {/* Collapsed Toggle Button */}
        {isCollapsed && (
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-4 p-1.5 bg-white rounded-full shadow-lg z-10"
            style={{
              color: theme.colors.primary,
              border: `2px solid ${theme.colors.primary}`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ChevronRight size={16} />
          </motion.button>
        )}
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 p-3 space-y-1 overflow-y-auto">
        {routes
          .filter(({ name, hideInNav }) => !hideInNav && name)
          .map(({ path, name }) => {
            const IconComponent = routeIcons[path] || FileText;
            
            return (
              <li key={path} className="relative">
                <NavLink
                  to={path}
                  onMouseEnter={() => setHoveredRoute(path)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg transition-all duration-300 ${
                      isCollapsed ? 'justify-center p-3' : 'px-4 py-3'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive 
                      ? `linear-gradient(to right, ${theme.colors.blue[100]}, ${theme.colors.emerald[100]})`
                      : 'transparent',
                    color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                    fontWeight: isActive ? '600' : 'normal',
                    borderLeft: isActive ? `3px solid ${theme.colors.primary}` : '3px solid transparent',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        className="flex items-center justify-center"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent 
                          size={22} 
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </motion.div>

                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            className="ml-3 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state */}
                      <AnimatePresence>
                        {isCollapsed && hoveredRoute === path && (
                          <motion.div
                            className="absolute left-full ml-3 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50"
                            style={{
                              backgroundColor: theme.colors.primary,
                              color: 'white',
                              boxShadow: theme.shadows.lg,
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center space-x-2">
                              <IconComponent size={16} />
                              <span className="font-medium">{name}</span>
                            </div>
                            {/* Arrow pointer */}
                            <div
                              className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2"
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: '6px solid transparent',
                                borderBottom: '6px solid transparent',
                                borderRight: `6px solid ${theme.colors.primary}`,
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
      </ul>

      {/* Footer Section */}
      <div
        className="p-4 border-t"
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
            >
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                  Version
                </span>
                <span className="text-xs font-bold" style={{ color: theme.colors.primary }}>
                  v1.0.0
                </span>
              </div>
              <motion.button
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white transition-colors"
                style={{ color: theme.colors.textSecondary }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings size={16} />
                <span className="text-sm">Settings</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Settings size={20} style={{ color: theme.colors.primary }} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Sidebar;
