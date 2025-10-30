import { Config } from 'tailwindcss'
import theme from './src/config/theme'

const tailwindConfig: Config = {
  // Remove darkMode option to disable dark mode
  // darkMode: 'class', 

  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        background: theme.colors.background.light, // Light background only
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        textPrimary: theme.colors.textPrimary,
        textSecondary: theme.colors.textSecondary,
        error: theme.colors.error,
        success: theme.colors.success,
        warning: theme.colors.warning,
      },
      spacing: { ...theme.spacing },
      borderRadius: { DEFAULT: theme.borderRadius },
      fontFamily: { sans: [theme.fonts.base, 'sans-serif'] },
    }
  },
  plugins: [],
}

export default tailwindConfig;
