/**
 * src/layouts/DashboardLayout.tsx
 * 
 * Modern dashboard layout with improved structure.
 * Clean, spacious design with proper background and content separation.
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
    className="flex flex-col min-h-screen"
    style={{ 
      backgroundColor: theme.colors.background.light,
      fontFamily: theme.fonts.base 
    }}
  >
    {/* <Header /> */}
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

export default DashboardLayout;
