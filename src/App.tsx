/**
 * src/app.tsx
 * 
 * Modified root app component for light theme only.
 * Removed dark mode toggle logic and dark mode CSS classes.
 * Simplifies UI and enforces consistent light theme.
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Trending from './pages/Trending'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Header from './layouts/Header'

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background text-gray-900 transition-colors duration-300">
        <Header/>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;
