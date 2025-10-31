/**
 * src/layouts/Header.tsx
 *
 * Professional animated header with navigation, notifications, user menu, and mobile support.
 * Features gradient effects, hover animations, and responsive design.
 * Upload button navigates to /upload page for consistent file upload experience.
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Menu,
  X,
  Bell,
  User,
  Settings,
  LogOut,
  Shield,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Book,
  Sun,
  Moon,
  Home,
  Info,
  HelpCircle,
  Rocket,
  Mail,
} from 'lucide-react';
import theme from '../config/theme';
import path from 'path';

// Navigation items with icons (Landing sections)
const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: Info },
  { path: '/how-it-works', label: 'How It Works', icon: HelpCircle },
  { path: '/roadmap', label: 'Roadmap', icon: Rocket },
  { path: '/contact', label: 'Contact', icon: Mail },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('dg-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('dg-theme', next ? 'dark' : 'light');
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New deepfake detected in trending video', time: '5m ago', unread: true },
    { id: 2, text: 'Your scan report is ready', time: '1h ago', unread: true },
    { id: 3, text: 'System update completed', time: '2h ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  const closeAllDropdowns = () => {
    setNotificationsOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 shadow-lg w-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}
      style={{
        borderBottom: `3px solid transparent`,
        borderImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary}) 1`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              navigate('/');
              closeAllDropdowns();
              setMobileMenuOpen(false);
            }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
              >
                <Shield size={24} color="white" />
              </div>
            </motion.div>
            <span
              className={`font-extrabold text-2xl hover:opacity-80 transition ${isDark ? 'text-white' : 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'}`}
              style={{ fontFamily: theme.fonts.heading }}
            >
              DeeFend
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <motion.div key={path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={path}
                    onClick={closeAllDropdowns}
                    className="relative px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2"
                    style={{
                      color: isActive ? theme.colors.primary : (isDark ? '#e5e7eb' : theme.colors.textSecondary),
                      backgroundColor: isActive ? (isDark ? '#1f2937' : theme.colors.blue[50]) : 'transparent',
                    }}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: theme.colors.primary }}
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full"
              style={{
                backgroundColor: isDark ? '#111827' : theme.colors.neutral.lightest,
                border: `1px solid ${isDark ? '#374151' : theme.colors.neutral.light}`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun size={18} style={{ color: '#fbbf24' }} />
              ) : (
                <Moon size={18} style={{ color: theme.colors.textSecondary }} />
              )}
            </motion.button>
            {/* Upload Button (Desktop) - Navigates to Upload Page */}
            <motion.button
              onClick={() => {
                navigate('/upload');
                closeAllDropdowns();
              }}
              className="hidden md:flex items-center space-x-2 px-5 py-2 rounded-lg font-semibold text-white shadow-md"
              style={{
                background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
              }}
              whileHover={{ scale: 1.05, boxShadow: theme.shadows.lg }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload size={18} />
              <span>Upload Video</span>
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 rounded-full hover:bg-neutral-lightest transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell size={22} style={{ color: isDark ? '#cbd5e1' : theme.colors.textSecondary }} />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute top-0 right-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: theme.colors.error }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                    style={{ border: `1px solid ${theme.colors.neutral.light}` }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b" style={{ borderColor: theme.colors.neutral.light }}>
                      <h3 className="font-bold text-lg" style={{ color: isDark ? '#e5e7eb' : theme.colors.textPrimary }}>
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className={`p-4 transition cursor-pointer border-b ${isDark ? 'hover:bg-slate-700' : 'hover:bg-neutral-lightest'}`}
                          style={{ borderColor: theme.colors.neutral.light }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-start space-x-3">
                            {notification.unread && (
                              <div
                                className="w-2 h-2 rounded-full mt-2"
                                style={{ backgroundColor: theme.colors.primary }}
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm" style={{ color: isDark ? '#e5e7eb' : theme.colors.textPrimary }}>
                                {notification.text}
                              </p>
                              <p className="text-xs mt-1" style={{ color: isDark ? '#94a3b8' : theme.colors.textSecondary }}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className={`flex items-center space-x-2 p-2 rounded-full transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-neutral-lightest'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <User size={18} color="white" />
                </div>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    color: isDark ? '#cbd5e1' : theme.colors.textSecondary,
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                    style={{ border: `1px solid ${theme.colors.neutral.light}` }}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b" style={{ borderColor: theme.colors.neutral.light }}>
                      <p className="font-semibold" style={{ color: isDark ? '#e5e7eb' : theme.colors.textPrimary }}>
                        John Doe
                      </p>
                      <p className="text-sm" style={{ color: isDark ? '#94a3b8' : theme.colors.textSecondary }}>
                        admin@DeeFend.com
                      </p>
                    </div>
                    {[
                      { icon: Settings, label: 'Settings', path: '/settings' },
                      { icon: LogOut, label: 'Logout', path: '/logout' },
                    ].map(({ icon: Icon, label, path }) => (
                      <motion.button
                        key={label}
                        onClick={() => {
                          navigate(path);
                          setUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 transition text-left ${isDark ? 'hover:bg-slate-700' : 'hover:bg-neutral-lightest'}`}
                        whileHover={{ x: 5 }}
                      >
                        <Icon size={18} style={{ color: isDark ? '#cbd5e1' : theme.colors.textSecondary }} />
                        <span style={{ color: isDark ? '#e5e7eb' : theme.colors.textPrimary }}>{label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                closeAllDropdowns();
              }}
              className="md:hidden p-2 rounded-lg"
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <X size={24} style={{ color: isDark ? '#e5e7eb' : theme.colors.textPrimary }} />
              ) : (
                <Menu size={24} style={{ color: isDark ? '#e5e7eb' : theme.colors.textPrimary }} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`md:hidden border-t ${isDark ? 'bg-slate-900' : 'bg-white'}`}
            style={{ borderColor: theme.colors.neutral.light }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <motion.div key={path} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition"
                    style={{
                      backgroundColor: location.pathname === path ? (isDark ? '#1f2937' : theme.colors.blue[50]) : 'transparent',
                      color: location.pathname === path ? theme.colors.primary : (isDark ? '#e5e7eb' : theme.colors.textSecondary),
                    }}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
