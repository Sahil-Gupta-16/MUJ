import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, CheckCircle, BarChart3, ArrowRight } from 'lucide-react';
import theme from '../../config/theme';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      number: 1,
      title: 'Upload or Stream',
      desc: 'Submit your video or image for analysis',
      color: '#3B82F6',
    },
    {
      icon: Zap,
      number: 2,
      title: 'Adaptive AI Analysis',
      desc: 'Our ensemble models analyze the media',
      color: '#F59E0B',
    },
    {
      icon: CheckCircle,
      number: 3,
      title: 'Verification',
      desc: 'Blockchain audit trail for authenticity',
      color: '#10B981',
    },
    {
      icon: BarChart3,
      number: 4,
      title: 'Get Results',
      desc: 'Receive detailed authenticity score',
      color: '#8B5CF6',
    },
  ];

  const features = [
    { title: 'Adaptive Ensemble AI', desc: 'Multiple models working together for accuracy' },
    { title: 'Dynamic Model Weighting', desc: 'Adjusts to different deepfake types' },
    { title: 'VideoSign Deduplication', desc: 'Prevents duplicate processing' },
    { title: 'Blockchain Audit', desc: 'Immutable verification records' },
    { title: 'Real-time Analysis', desc: '<2 seconds processing time' },
    { title: 'Detailed Reports', desc: 'Comprehensive metric breakdowns' },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <motion.section
        className="min-h-80 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.secondary}08 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 className="text-5xl font-black mb-6" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            How It Works
          </motion.h1>
          <motion.p className="text-lg" style={{ color: theme.colors.textSecondary }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            Simple, fast, and accurate deepfake detection in 4 steps
          </motion.p>
        </div>
      </motion.section>

      {/* Steps */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4"
                    style={{ backgroundColor: step.color }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.number}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute left-20 top-8 w-full h-0.5" style={{ backgroundColor: theme.colors.neutral.light }} />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                  {step.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-lightest">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Core Technology</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-white shadow-md border-l-4"
                style={{ borderColor: theme.colors.primary }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.textPrimary }}>
                  {feature.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HowItWorks;
