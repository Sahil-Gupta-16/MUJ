import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3 } from 'lucide-react';
import theme from '../../config/theme';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: '98.5%', desc: 'Detection Accuracy' },
    { label: '<2s', desc: 'Analysis Time' },
    { label: '50K+', desc: 'Videos Analyzed' },
    { label: '99.1%', desc: 'Success Rate' },
  ];

  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Analyze videos in under 2 seconds' },
    { icon: Shield, title: 'Highly Accurate', desc: '98.5% detection accuracy rate' },
    { icon: BarChart3, title: 'Detailed Reports', desc: 'Comprehensive analysis metrics' },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.secondary}08 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: theme.colors.primary }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: theme.colors.secondary }} />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className="text-5xl md:text-6xl font-black mb-6"
              style={{ fontFamily: theme.fonts.heading }}
            >
              Detect the{' '}
              <span
                style={{
                  background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Unreal
              </span>
              — Instantly
            </h1>
            <p
              className="text-lg md:text-xl mb-8 leading-relaxed"
              style={{ color: theme.colors.textSecondary }}
            >
              DeeFend uses cutting-edge AI to detect deepfakes and manipulated media in seconds. Protect yourself from misinformation with our 98.5% accurate detection technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => navigate('/upload')}
                className="px-8 py-4 rounded-lg font-bold text-white text-lg flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${theme.colors.primary}40` }}
                whileTap={{ scale: 0.95 }}
              >
                Try Demo Now <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={() => navigate('/about')}
                className="px-8 py-4 rounded-lg font-bold border-2"
                style={{
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary,
                }}
                whileHover={{ scale: 1.05, backgroundColor: theme.colors.blue[50] }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                { icon: CheckCircle, text: 'Fast Detection' },
                { icon: Shield, text: 'Highly Accurate' },
                { icon: Zap, text: 'Real-time Analysis' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <item.icon size={18} style={{ color: theme.colors.primary }} />
                  <span style={{ color: theme.colors.textPrimary }} className="font-semibold">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            className="hidden md:flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative w-full h-96"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  opacity: 0.1,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🎬</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-lightest">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl font-black text-center mb-12"
            style={{ color: theme.colors.textPrimary }}
          >
            Trusted by Thousands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-6 rounded-xl bg-white shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl font-black mb-2" style={{ color: theme.colors.primary }}>
                  {stat.label}
                </p>
                <p style={{ color: theme.colors.textSecondary }} className="font-semibold">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl font-black text-center mb-12"
            style={{ color: theme.colors.textPrimary }}
          >
            Why Choose DeeFend?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-xl bg-white shadow-lg border-2"
                style={{ borderColor: theme.colors.neutral.light }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, borderColor: theme.colors.primary }}
              >
                <feature.icon
                  size={40}
                  style={{ color: theme.colors.primary, marginBottom: '1rem' }}
                />
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        }}
      >
        <h2 className="text-4xl font-black mb-6">Ready to Detect Deepfakes?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Start analyzing videos and images today. No credit card required.
        </p>
        <motion.button
          onClick={() => navigate('/upload')}
          className="px-8 py-4 rounded-lg font-bold text-lg bg-white"
          style={{ color: theme.colors.primary }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Now
        </motion.button>
      </motion.section>
    </div>
  );
};

export default Home;
