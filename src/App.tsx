/**
 * src/App.tsx
 * 
 * Main application component with routing configuration.
 * Defines all routes and their corresponding components.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Trending from './pages/Trending';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Home from './pages/Home';
import Header from './layouts/Header';
import SystemMonitoring from './pages/SystemMonitoring';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        <Route path="/home" element={<Home/>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Trending Videos */}
        <Route path="/trending" element={<Trending />} />

        {/* Upload Video */}
        <Route path="/upload" element={<Upload />} />

        {/* Results Page */}
        <Route path="/results" element={<Results />} />

        {/* Fallback - Redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

        <Route path="/monitoring" element={<SystemMonitoring />} />

      </Routes>
    </Router>
  );
}

export default App;
