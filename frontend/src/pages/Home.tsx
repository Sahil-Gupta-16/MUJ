/**
 * src/pages/Home.tsx
 * 
 * Home page component.
 * Provides a welcoming introduction to the Deepfake Detection Framework.
 * Briefly describes project goals and functionality.
 * Includes navigation links to Upload and Trending pages.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <section className="max-w-screen mx-auto p-4 space-y-6">
      <h2 className="text-4xl font-bold text-primary">Welcome to the Deepfake Detection Framework</h2>
      <p className="text-lg text-secondary">
        Protect yourself from manipulated media with our AI-driven multimodal detection platform.
        Analyze images, videos, and audio for deepfake content using cutting-edge machine learning technology.
      </p>
      <ul className="list-disc list-inside text-secondary space-y-2">
        <li>Upload videos for instant deepfake scanning.</li>
        <li>Scan trending social media content in real-time.</li>
        <li>Get confidence scores and alerts with intuitive tags.</li>
      </ul>
      <div className="space-x-4">
        <Link
          to="/upload"
          className="px-5 py-3 bg-primary text-background rounded hover:bg-primary/80 transition"
        >
          Upload Video
        </Link>
        <Link
          to="/trending"
          className="px-5 py-3 border border-primary text-primary rounded hover:bg-primary hover:text-background transition"
        >
          View Trending Scans
        </Link>
      </div>
    </section>
  );
};

export default Home;
