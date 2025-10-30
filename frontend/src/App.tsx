/**
 * src/App.tsx
 * 
 * Main application component with routing and context provider
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './layouts/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Trending from './pages/Trending';
import Upload from './pages/Upload';
import Results from './pages/Results';
import SystemMonitoring from './pages/SystemMonitoring';
import History from './pages/History';
import { ReportProvider } from './context/ReportContext';

function App() {
  return (
    <ReportProvider>
      <Router>
        {/* Header - Persistent across all pages */}
        <Header />

        {/* Main Routes */}
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Trending Videos */}
          <Route path="/trending" element={<Trending />} />

          {/* Upload Media */}
          <Route path="/upload" element={<Upload />} />

          {/* Results Page */}
          <Route path="/results" element={<Results />} />

          {/* System Monitoring */}
          <Route path="/monitoring" element={<SystemMonitoring />} />

          {/* History */}
          <Route path="/history" element={<History />} />

          {/* Fallback - Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ReportProvider>
  );
}

export default App;
