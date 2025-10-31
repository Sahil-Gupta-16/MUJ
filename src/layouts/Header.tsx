/**
 * src/layouts/Header.tsx
 *
 * Professional animated header with notifications, user menu, search, theme toggle, and landing page navigation.
 * Features gradient effects, hover animations, and responsive design.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Shield,
  Moon,
  Sun,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import theme from '../config/theme';

// Landing navigation items
const landingNavItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/roadmap', label: 'Roadmap' },
  { path: '/contact', label: 'Contact' },
];

// App navigation items
const appNavItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/about', label: 'About' },
  { path: '/upload', label: 'Upload' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/contact', label: 'Contact' },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine if user is on landing pages
  const isLandingPage = ['/', '/about', '/how-it-works', '/roadmap', '/contact'].includes(location.pathname);
  const navItems = isLandingPage ? landingNavItems : appNavItems;

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New deepfake detected in trending video', time: '5m ago', unread: true, type: 'alert' },
    { id: 2, text: 'Your scan report is ready', time: '1h ago', unread: true, type: 'success' },
    { id: 3, text: 'System update completed', time: '2h ago', unread: false, type: 'info' },
    { id: 4, text: 'Monitoring alert: Suspicious activity detected', time: '3h ago', unread: true, type: 'warning' },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const closeAllDropdowns = () => {
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return 'Alert';
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      default:
        return 'Info';
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white shadow-lg w-full"
      style={{
        borderBottom: `3px solid transparent`,
        borderImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary}) 1`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              navigate('/');
              closeAllDropdowns();
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
              className="font-extrabold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline"
              style={{ fontFamily: theme.fonts.heading }}
            >
              DeepfakeGuard
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <motion.div key={path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <motion.button
                    onClick={() => {
                      navigate(path);
                      closeAllDropdowns();
                    }}
                    className="relative px-4 py-2 rounded-lg font-semibold transition-all"
                    style={{
                      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                      backgroundColor: isActive ? theme.colors.blue[50] : 'transparent',
                    }}
                    whileHover={{
                      color: theme.colors.primary,
                      backgroundColor: isActive ? theme.colors.blue[50] : theme.colors.blue[25],
                    }}
                  >
                    {label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: theme.colors.primary }}
                        layoutId="activeTab"
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </nav>

          {/* Center - Search Bar */}
          <motion.div
            className="flex-1 max-w-md hidden lg:flex"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSearch} className="relative w-full">
              <motion.div className="relative flex items-center">
                <Search size={18} style={{ color: theme.colors.textSecondary }} className="absolute left-3" />
                <input
                  type="text"
                  placeholder="Search videos, reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setSearchOpen(false)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 outline-none transition-all"
                  style={{
                    borderColor: searchOpen ? theme.colors.primary : theme.colors.neutral.light,
                    backgroundColor: theme.colors.neutral.lightest,
                  }}
                />
                {searchQuery && (
                  <motion.button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-lg"
                    whileHover={{ scale: 1.2 }}
                  >
                    ×
                  </motion.button>
                )}
              </motion.div>
            </form>
          </motion.div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Mobile */}
            <motion.button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-lightest transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search size={20} style={{ color: theme.colors.textSecondary }} />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-neutral-lightest transition"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? (
                <Sun size={20} style={{ color: theme.colors.warning }} />
              ) : (
                <Moon size={20} style={{ color: theme.colors.textSecondary }} />
              )}
            </motion.button>

            {/* Notifications */}
            {!isLandingPage && (
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserMenuOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-neutral-lightest transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell size={20} style={{ color: theme.colors.textSecondary }} />
                  {unreadCount > 0 && (
                    <motion.span
                      className="absolute top-1 right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
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
                      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl overflow-hidden"
                      style={{ border: `1px solid ${theme.colors.neutral.light}` }}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header */}
                      <div
                        className="p-4 border-b flex items-center justify-between"
                        style={{ borderColor: theme.colors.neutral.light }}
                      >
                        <h3 className="font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
                          Notifications
                        </h3>
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ backgroundColor: theme.colors.primary + '20', color: theme.colors.primary }}
                        >
                          {unreadCount} New
                        </span>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            className="p-4 hover:bg-neutral-lightest transition cursor-pointer border-b"
                            style={{ borderColor: theme.colors.neutral.light }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-sm font-bold" style={{ color: theme.colors.primary }}>
                                [{getNotificationIcon(notification.type)}]
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: theme.colors.textPrimary }}
                                >
                                  {notification.text}
                                </p>
                                <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                                  {notification.time}
                                </p>
                              </div>
                              {notification.unread && (
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                                  style={{ backgroundColor: theme.colors.primary }}
                                />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Footer */}
                      <motion.button
                        className="w-full p-3 text-sm font-semibold text-center border-t"
                        style={{ color: theme.colors.primary, borderColor: theme.colors.neutral.light }}
                        whileHover={{ backgroundColor: theme.colors.blue[50] }}
                      >
                        View All Notifications
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Menu */}
            {!isLandingPage && (
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-lightest transition"
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
                      color: theme.colors.textSecondary,
                      transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden"
                      style={{ border: `1px solid ${theme.colors.neutral.light}` }}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b" style={{ borderColor: theme.colors.neutral.light }}>
                        <p className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                          John Doe
                        </p>
                        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          admin@deepfakeguard.com
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
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-neutral-lightest transition text-left border-b"
                          style={{ borderColor: label === 'Logout' ? 'transparent' : theme.colors.neutral.light }}
                          whileHover={{ x: 5 }}
                        >
                          <Icon size={18} style={{ color: theme.colors.textSecondary }} />
                          <span style={{ color: theme.colors.textPrimary }}>{label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* CTA Button for Landing Pages */}
            {isLandingPage && (
              <motion.button
                onClick={() => navigate('/upload')}
                className="hidden sm:block px-6 py-2 rounded-lg font-bold text-white text-sm"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Demo
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <X size={24} style={{ color: theme.colors.textPrimary }} />
              ) : (
                <Menu size={24} style={{ color: theme.colors.textPrimary }} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="lg:hidden pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <form onSubmit={handleSearch}>
                <div className="relative flex items-center">
                  <Search size={18} style={{ color: theme.colors.textSecondary }} className="absolute left-3" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 outline-none"
                    style={{
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.neutral.lightest,
                    }}
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden pb-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navItems.map(({ path, label }) => (
                <motion.button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    closeAllDropdowns();
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg font-semibold transition"
                  style={{
                    color:
                      location.pathname === path ? theme.colors.primary : theme.colors.textSecondary,
                    backgroundColor:
                      location.pathname === path ? theme.colors.blue[50] : 'transparent',
                  }}
                  whileHover={{
                    backgroundColor: theme.colors.blue[50],
                    color: theme.colors.primary,
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
