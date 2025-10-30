/**
 * theme.ts
 * 
 * Centralized theme configuration with blue-emerald civic admin dashboard palette.
 * Professional design tokens conveying trust, authority, and modern UI/UX standards.
 * Comprehensive gradient system for sophisticated visual hierarchy.
 */

const theme = {
  colors: {
    // Background colors
    background: {
      light: '#ffffff',      // Pure white for clean look
      gradient: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #ecfdf5)', // Blue-emerald gradient
    },
    
    // Primary - Blue gradient system for trust and authority
    primary: '#3b82f6',       // Blue-500 - main interactive elements
    
    // Secondary - Emerald for success and growth
    secondary: '#10b981',     // Emerald-500 for secondary UI
    
    // Text colors
    textPrimary: '#0f172a',   // Slate-900 for primary text (high contrast)
    textSecondary: '#64748b', // Slate-500 for secondary text
    
    // Accent and status colors
    accent: '#a855f7',        // Purple-500 for special highlights
    
    error: '#ef4444',         // Red-500 for errors
    success: '#22c55e',       // Green-500 for success
    warning: '#eab308',       // Yellow-500 for warnings
    info: '#3b82f6',          // Blue-500 for info
    
    // Neutral shades - Slate scale
    neutral: {
      lightest: '#f8fafc',    // Slate-50 for card backgrounds
      light: '#e2e8f0',       // Slate-200 for hover states
      medium: '#cbd5e1',      // Slate-300 for borders
      dark: '#64748b',        // Slate-500 for subtle text
    },
    
    // Extended color palette for badges and status
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      800: '#1e40af',
    },
    
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      500: '#10b981',
      600: '#059669',
      800: '#065f46',
    },
    
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      500: '#a855f7',
      600: '#9333ea',
    },
    
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      500: '#eab308',
    },
    
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      600: '#ea580c',
    },
  },
  
  // Gradient patterns
  gradients: {
    primary: 'linear-gradient(to right, #3b82f6, #10b981)',
    background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #ecfdf5)',
    card: 'linear-gradient(to bottom right, #eff6ff, #f0fdf4)',
  },
  
  fonts: {
    base: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    heading: '"Inter", "Roboto", sans-serif',
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
  },
  
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  transition: 'all 0.3s ease-in-out',
} as const;

export default theme;
