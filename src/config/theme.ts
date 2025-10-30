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
      light: 'var(--app-bg)',
      gradient: 'linear-gradient(to bottom right, var(--blue-50), #ffffff, var(--emerald-50))',
    },
    
    // Primary - Blue gradient system for trust and authority
    primary: 'var(--color-primary)',
    
    // Secondary - Emerald for success and growth
    secondary: 'var(--color-secondary)',
    
    // Text colors
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    
    // Accent and status colors
    accent: 'var(--color-accent)',
    
    error: 'var(--color-error)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    
    // Neutral shades - Slate scale
    neutral: {
      lightest: 'var(--neutral-lightest)',
      light: 'var(--neutral-light)',
      medium: 'var(--neutral-medium)',
      dark: 'var(--neutral-dark)',
    },
    
    // Extended color palette for badges and status
    blue: {
      50: 'var(--blue-50)',
      100: 'var(--blue-100)',
      200: 'var(--blue-200)',
      400: 'var(--blue-400)',
      500: 'var(--blue-500)',
      600: 'var(--blue-600)',
      800: 'var(--blue-800)',
    },
    
    emerald: {
      50: 'var(--emerald-50)',
      100: 'var(--emerald-100)',
      200: 'var(--emerald-200)',
      500: 'var(--emerald-500)',
      600: 'var(--emerald-600)',
      800: 'var(--emerald-800)',
    },
    
    purple: {
      50: 'var(--purple-50)',
      100: 'var(--purple-100)',
      200: 'var(--purple-200)',
      500: 'var(--purple-500)',
      600: 'var(--purple-600)',
    },
    
    yellow: {
      50: 'var(--yellow-50)',
      100: 'var(--yellow-100)',
      500: 'var(--yellow-500)',
    },
    
    orange: {
      50: 'var(--orange-50)',
      100: 'var(--orange-100)',
      600: 'var(--orange-600)',
    },
  },
  
  // Gradient patterns
  gradients: {
    primary: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
    background: 'linear-gradient(to bottom right, var(--blue-50), #ffffff, var(--emerald-50))',
    card: 'linear-gradient(to bottom right, var(--blue-50), var(--emerald-50))',
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
