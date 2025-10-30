/**
 * src/layouts/Sidebar.tsx
 *
 * Modern, collapsible sidebar with Lucide React icons and smooth animations.
 * Shows icons when collapsed, full menu when expanded.
 * Hover shows tooltips on collapsed state.
 * Uses brown/beige theme colors and Framer Motion animations.
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  TrendingUp,
  FileText,
  Menu,
  X,
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
      className="relative shadow-lg h-screen"
      style={{
        backgroundColor: theme.colors.neutral.lightest,
        borderRight: `2px solid ${theme.colors.neutral.medium}`,
        fontFamily: theme.fonts.base,
      }}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-6 z-10 bg-white rounded-full p-2 shadow-lg"
        style={{
          border: `2px solid ${theme.colors.primary}`,
          color: theme.colors.primary,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </motion.div>
      </motion.button>

      {/* Sidebar Header */}
      <div className="p-6 border-b" style={{ borderColor: theme.colors.neutral.medium }}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.h2
              key="expanded"
              className="text-xl font-bold"
              style={{ color: theme.colors.primary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Navigation
            </motion.h2>
          ) : (
            <motion.div
              key="collapsed"
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Folder size={28} style={{ color: theme.colors.primary }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <ul className="p-4 space-y-2">
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
                    backgroundColor: isActive ? theme.colors.primary : 'transparent',
                    color: isActive ? theme.colors.background.light : theme.colors.textPrimary,
                    fontWeight: isActive ? 'bold' : 'normal',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent size={24} />
                      </motion.div>

                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            className="ml-3"
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
                            className="absolute left-full ml-2 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50"
                            style={{
                              backgroundColor: theme.colors.primary,
                              color: theme.colors.background.light,
                              boxShadow: theme.shadows.md,
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {name}
                            {/* Arrow pointer */}
                            <div
                              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
        className="absolute bottom-4 left-0 right-0 px-4"
        style={{ borderTop: `1px solid ${theme.colors.neutral.medium}`, paddingTop: '1rem' }}
      >
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.p
              className="text-xs text-center"
              style={{ color: theme.colors.textSecondary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              v1.0.0
            </motion.p>
          ) : (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Settings size={16} style={{ color: theme.colors.textSecondary }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Sidebar;
