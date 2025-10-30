/**
 * src/layouts/DashboardLayout.tsx
 * 
 * Professional dashboard layout component.
 * Incorporates Header, Sidebar, Footer with consistent light theme styling using theme.ts.
 * Applies rounded borders, subtle shadows, and clean spacing for polished UI.
 */

import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import theme from '../config/theme';

interface Props {
  children: ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => (
  <div
    className="flex flex-col h-screen"
    style={{ backgroundColor: theme.colors.background.light, color: theme.colors.textPrimary }}
  >
    <Header />
    <div className="flex flex-1 overflow-hidden rounded-lg shadow-lg mx-4 my-4 bg-white">
      <Sidebar />
      <main
        className="flex-1 overflow-auto p-8 rounded-r-lg"
        style={{
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
          fontFamily: theme.fonts.base,
        }}
      >
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

export default DashboardLayout;
