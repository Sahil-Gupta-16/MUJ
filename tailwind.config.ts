/**
 * tailwind.config.ts
 * 
 * Tailwind CSS configuration for Deepfake Detection Framework.
 * Blue-emerald civic admin dashboard theme with comprehensive color system.
 * Extends default Tailwind with custom design tokens from theme.ts.
 */

import { Config } from 'tailwindcss';
import theme from './src/config/theme';

const tailwindConfig: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core colors
        'background-light': theme.colors.background.light,
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        'text-primary': theme.colors.textPrimary,
        'text-secondary': theme.colors.textSecondary,
        accent: theme.colors.accent,
        error: theme.colors.error,
        success: theme.colors.success,
        warning: theme.colors.warning,
        info: theme.colors.info,
        
        // Neutral palette
        'neutral-lightest': theme.colors.neutral.lightest,
        'neutral-light': theme.colors.neutral.light,
        'neutral-medium': theme.colors.neutral.medium,
        'neutral-dark': theme.colors.neutral.dark,
        
        // Extended color scales
        blue: theme.colors.blue,
        emerald: theme.colors.emerald,
        purple: theme.colors.purple,
        yellow: theme.colors.yellow,
        orange: theme.colors.orange,
      },
      
      backgroundImage: {
        'gradient-main': theme.gradients.background,
        'gradient-primary': theme.gradients.primary,
        'gradient-card': theme.gradients.card,
      },
      
      spacing: {
        xs: theme.spacing.xs,
        sm: theme.spacing.sm,
        md: theme.spacing.md,
        lg: theme.spacing.lg,
        xl: theme.spacing.xl,
        xxl: theme.spacing.xxl,
      },
      
      borderRadius: {
        sm: theme.borderRadius.sm,
        md: theme.borderRadius.md,
        lg: theme.borderRadius.lg,
        xl: theme.borderRadius.xl,
        full: theme.borderRadius.full,
      },
      
      boxShadow: {
        sm: theme.shadows.sm,
        md: theme.shadows.md,
        lg: theme.shadows.lg,
        xl: theme.shadows.xl,
      },
      
      fontFamily: {
        sans: [theme.fonts.base, 'sans-serif'],
        heading: [theme.fonts.heading, 'sans-serif'],
      },
      
      transitionTimingFunction: {
        DEFAULT: 'ease-in-out',
      },
      
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
