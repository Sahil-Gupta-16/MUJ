import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import theme from './config/theme'

// Set runtime CSS variables from theme.ts so CSS can use theme values (e.g. --app-bg)
const root = document.documentElement;
root.style.setProperty('--app-bg', theme.colors.background.light);
root.style.setProperty('--app-text-color', theme.colors.textPrimary);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
