import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Smartphone, Globe, Zap, CheckCircle } from 'lucide-react';
import theme from '../../config/theme';

const Roadmap: React.FC = () => {
  const roadmapItems = [
    {
      quarter: 'Q1 2025',
      title: 'Mobile Application',
      features: [
        'iOS App Launch',
        'Android App Launch',
        'Offline Detection Mode',
      ],
      icon: Smartphone,
      status: 'current',
    },
    {
      quarter: 'Q2 2025',
      title: 'Global Expansion',
      features: [
        'Multi-language Support',
        'Regional Servers',
        '24/7 Support',
      ],
      icon: Globe,
      status: 'upcoming',
    },
    {
      quarter: 'Q3 2025',
      title: 'Advanced Features',
      features: [
        'Real-time Streaming',
        'Batch Processing',
        'Custom Model Training',
      ],
      icon: Zap,
      status: 'upcoming',
    },
    {
      quarter: 'Q4 2025',
      title: 'Enterprise Suite',
      features: [
        'API Pro Plans',
        'White Label Solution',
        'Advanced Analytics',
      ],
      icon: Rocket,
      status: 'upcoming',
    },
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
        <div className="max-w-screen mx-auto text-center">
          <motion.h1 className="text-5xl font-black mb-6" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            Future Roadmap
          </motion.h1>
          <motion.p className="text-lg" style={{ color: theme.colors.textSecondary }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            Exciting features coming soon to DeeFend
          </motion.p>
        </div>
      </motion.section>

      {/* Roadmap Timeline */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {roadmapItems.map((item, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-xl border-2"
                style={{
                  borderColor: item.status === 'current' ? theme.colors.primary : theme.colors.neutral.light,
                  backgroundColor: item.status === 'current' ? theme.colors.blue[50] : 'white',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: theme.colors.primary }}>
                      {item.quarter}
                    </p>
                    <h3 className="text-2xl font-bold" style={{ color: theme.colors.textPrimary }}>
                      {item.title}
                    </h3>
                  </div>
                  <item.icon size={32} style={{ color: theme.colors.primary }} />
                </div>
                <ul className="space-y-2">
                  {item.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle size={16} style={{ color: theme.colors.primary }} />
                      <span style={{ color: theme.colors.textSecondary }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                {item.status === 'current' && (
                  <div className="mt-4 px-3 py-1 rounded-full text-xs font-bold w-fit" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                    Current
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Roadmap;
