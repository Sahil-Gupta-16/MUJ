/**
 * src/pages/Landing.tsx
 * 
 * Enhanced landing page with Framer Motion animations, KPI stats, and professional card components.
 * Uses theme.ts colors, shadow effects, and smooth animations for premium UX.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import theme from '../config/theme';
import Loading from '../components/Loading';

// Reusable animated Section component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.section
    className="max-w-screen mx-auto my-20 px-6"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <h2
      className="text-4xl font-extrabold mb-12 text-center"
      style={{ color: theme.colors.primary, fontFamily: theme.fonts.base }}
    >
      {title}
    </h2>
    {children}
  </motion.section>
);

// Animated Feature Card with hover effects and shadows
const FeatureCard: React.FC<{ title: string; description: string; delay?: number }> = ({
  title,
  description,
  delay = 0,
}) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg p-8 transition-all"
    style={{
      fontFamily: theme.fonts.base,
      border: `2px solid ${theme.colors.secondary}`,
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      borderColor: theme.colors.primary,
    }}
  >
    <h3 className="text-2xl font-bold mb-3" style={{ color: theme.colors.primary }}>
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

// KPI Stat Card with animated counter effect
const KPICard: React.FC<{ value: string; label: string; delay?: number }> = ({ value, label, delay = 0 }) => (
  <motion.div
    className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-8 text-center"
    style={{ border: `2px solid ${theme.colors.primary}` }}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.08, boxShadow: '0 25px 50px rgba(34, 211, 238, 0.3)' }}
  >
    <div className="text-5xl font-extrabold mb-2" style={{ color: theme.colors.primary }}>
      {value}
    </div>
    <div className="text-lg text-gray-600 font-semibold">{label}</div>
  </motion.div>
);

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      {/* Hero Section with Video Background */}
      <div className="relative h-screen w-screen overflow-hidden Back">
        <image
          className="absolute inset-0 w-full h-full object-cover"
          href ='/home/rs/Projects/MUJ/src/assets/bg.jpg'
        //   alt='loading'
        //   autoPlay
        //   muted
        //   loop
        //   playsInline
        
        />
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-4"
          style={{
    backgroundImage: `url('/home/rs/Projects/MUJ/src/assets/bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
          <motion.h1
            className="text-6xl font-extrabold mb-6"
            style={{ color: theme.colors.primary, fontFamily: theme.fonts.base }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Advanced Deepfake Detection Framework
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 mb-8 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Protect yourself from synthetic media with AI-powered detection technology
          </motion.p>
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="px-10 py-5 rounded-xl text-xl font-bold shadow-2xl"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background.light,
              fontFamily: theme.fonts.base,
            }}
            whileHover={{ scale: 1.1, boxShadow: '0 15px 30px rgba(34, 211, 238, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Go to Dashboard
          </motion.button>
        </div>
      </div>

      {/* KPI Stats Section */}
      <Section title="Our Impact">
        <div className="grid md:grid-cols-3 gap-10">
          <KPICard value="10M+" label="Videos Analyzed" delay={0} />
          <KPICard value="98.7%" label="Detection Accuracy" delay={0.2} />
          <KPICard value="500K+" label="Active Users" delay={0.4} />
        </div>
      </Section>

      {/* How It Works Section */}
      <Section title="How It Works">
        <motion.div
          className="text-lg text-gray-700 leading-relaxed space-y-6 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p>
            Our Deepfake Detection Framework uses a state-of-the-art multimodal AI model that analyzes video, audio, and
            image data to detect synthetic media. By combining visual and audio cues with advanced machine learning, we
            provide reliable confidence scores and alerts to help you identify manipulated content before sharing.
          </p>
          <p>
            Upload any suspicious video for an instant scan or browse trending social media content already analyzed by our
            platform. Stay protected with real-time detection that adapts to evolving deepfake techniques.
          </p>
        </motion.div>
      </Section>

      {/* Core Features Section */}
      <Section title="Our Core Features">
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            title="Multimodal Analysis"
            description="Combines video and audio data for comprehensive deepfake detection leveraging AI advances."
            delay={0}
          />
          <FeatureCard
            title="Real-Time Trending Scans"
            description="Continuously scans trending social media videos to warn users instantly of suspicious content."
            delay={0.2}
          />
          <FeatureCard
            title="Downloadable Reports"
            description="Detailed scan reports available for download to assist manual verification and record-keeping."
            delay={0.4}
          />
        </div>
      </Section>
    </>
  );
};

export default Landing;
