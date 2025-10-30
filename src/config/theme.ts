/**
 * theme.ts
 * 
 * Centralized theme configuration with brown and beige color palette.
 * Professional, warm, and sophisticated design tokens for the Deepfake Detection Framework.
 * Supports light mode with earthy, neutral tones that convey trust and elegance.
 */

const theme = {
  colors: {
    // Background colors - warm beige for clean, sophisticated look
    background: {
      light: '#FAF5EF',      // Soft warm beige (main background)
    //   dark: '#8B5A3C',       // Rich brown for accents or future dark mode
    },
    
    // Primary color - medium warm brown for buttons and highlights
    primary: '#7E513B',       // Warm terracotta brown - main interactive elements
    
    // Secondary color - lighter brown for borders, secondary UI
    secondary: '#C8B6A6',     // Light taupe brown for subtle elements
    
    // Text colors
    textPrimary: '#3E2723',   // Deep dark brown for primary text (high contrast)
    textSecondary: '#6D4C41', // Medium brown for secondary text
    
    // Accent and status colors
    accent: '#D4A574',        // Golden beige for special highlights
    
    error: '#C1694F',         // Muted terracotta red for errors
    success: '#8B9474',       // Sage olive green for success (complements brown)
    warning: '#D4A056',       // Golden amber for warnings
    
    // Neutral shades for cards, borders, and dividers
    neutral: {
      lightest: '#F5F0E8',    // Very light beige for card backgrounds
      light: '#E8DED2',       // Light beige for hover states
      medium: '#D1C4B5',      // Medium beige for borders
      dark: '#A89583',        // Darker neutral for subtle text
    },
  },
  
  fonts: {
    base: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif', // Clean modern sans-serif
    heading: '"Playfair Display", "Georgia", serif',                 // Elegant serif for headings (optional)
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
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 3px rgba(62, 39, 35, 0.12)',
    md: '0 4px 6px rgba(62, 39, 35, 0.15)',
    lg: '0 10px 20px rgba(62, 39, 35, 0.2)',
    xl: '0 20px 40px rgba(62, 39, 35, 0.25)',
  },
  
  transition: 'all 0.3s ease-in-out',
} as const;

export default theme;
