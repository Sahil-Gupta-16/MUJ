/**
 * src/layouts/Header.tsx
 *
 * Professional site header with logo, app title, navigation links and upload button.
 * Clean, modern design using theme colors and rounded buttons for better UX.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import theme from '../config/theme';

// Replace with your real logo URL or import an SVG/image component
const logoUrl = 'https://dummyimage.com/40x40/22d3ee/ffffff&text=DF';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header
      className="flex justify-between items-center px-6 py-3 bg-white shadow-md sticky top-0 z-50"
      style={{ borderBottom: `2px solid ${theme.colors.primary}` }}
    >
      <div className="flex items-center space-x-3">
        <img src={logoUrl} alt="Deepfake Detection Logo" className="w-10 h-10 rounded-full" />
        <Link
          to="/dashboard"
          className="text-primary font-extrabold text-2xl hover:text-primary/80 transition"
          style={{ fontFamily: theme.fonts.base }}
        >
          Deepfake Detection
        </Link>
      </div>

      <nav className="hidden md:flex space-x-6 text-gray-700 font-medium" style={{ fontFamily: theme.fonts.base }}>
        <Link to="/dashboard" className="hover:text-primary transition">
          Dashboard
        </Link>
        <Link to="/trending" className="hover:text-primary transition">
          Trending
        </Link>
        <Link to="/about" className="hover:text-primary transition" title="Learn more about us">
          About
        </Link>
      </nav>

      <button
        onClick={() => navigate('/upload')}
        className="px-5 py-2 bg-primary text-background rounded-lg font-semibold shadow-md hover:bg-primary/90 transition"
        style={{ fontFamily: theme.fonts.base }}
      >
        Upload Video
      </button>
    </header>
  );
};

export default Header;
