import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, Lightbulb } from 'lucide-react';
import theme from '../../config/theme';

const About: React.FC = () => {
  const values = [
    { icon: Target, title: 'Accuracy First', desc: 'Striving for 99%+ detection accuracy' },
    { icon: Users, title: 'User Centric', desc: 'Building for real-world needs' },
    { icon: Lightbulb, title: 'Innovation', desc: 'Cutting-edge AI technology' },
    { icon: Award, title: 'Trustworthy', desc: 'Transparent and ethical AI' },
  ];

  const timeline = [
    { year: '2023', event: 'DeeFend Founded', desc: 'Started with a vision to fight deepfakes' },
    { year: '2024', event: '98.5% Accuracy', desc: 'Achieved industry-leading detection rate' },
    { year: '2025', event: 'Expanding Globally', desc: 'Reaching users worldwide' },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <motion.section
        className="min-h-80 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.secondary}08 100%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-screen mx-auto text-center">
          <motion.h1
            className="text-5xl font-black mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            About DeeFend
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl"
            style={{ color: theme.colors.textSecondary }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Fighting misinformation with AI. One deepfake at a time.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-black mb-6" style={{ color: theme.colors.textPrimary }}>
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: theme.colors.textSecondary }}>
              In a world where deepfakes pose an existential threat to trust, DeeFend stands as a guardian of authenticity. We're building the most accurate, accessible, and ethical deepfake detection system.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: theme.colors.textSecondary }}>
              Our vision is to empower individuals and organizations to verify media authenticity instantly, ensuring trust in the digital age.
            </p>
          </motion.div>
          <motion.div
            className="text-6xl text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            🛡️
          </motion.div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-lightest">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-white shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <value.icon
                  size={40}
                  style={{ color: theme.colors.primary, margin: '0 auto 1rem' }}
                />
                <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.textPrimary }}>
                  {value.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-6 md:gap-12"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    }}
                  >
                    {item.year}
                  </motion.div>
                  {i < timeline.length - 1 && (
                    <div
                      className="w-1 h-12 mt-2"
                      style={{ backgroundColor: theme.colors.neutral.light }}
                    />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                    {item.event}
                  </h3>
                  <p style={{ color: theme.colors.textSecondary }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
