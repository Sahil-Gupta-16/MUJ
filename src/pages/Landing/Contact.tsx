import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import theme from '../../config/theme';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'contact@DeeFend.com' },
    { icon: Phone, title: 'Phone', value: '+91 98765 43210' },
    { icon: MapPin, title: 'Location', value: 'India' },
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
            Get in Touch
          </motion.h1>
          <motion.p className="text-lg" style={{ color: theme.colors.textSecondary }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            Have questions? We'd love to hear from you
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Info & Form */}
      <motion.section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-neutral-lightest"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <info.icon size={28} style={{ color: theme.colors.primary, marginBottom: '1rem' }} />
                <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.textPrimary }}>
                  {info.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>{info.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="md:col-span-2 p-8 rounded-xl shadow-lg"
            style={{ backgroundColor: theme.colors.neutral.lightest }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 outline-none transition"
                  style={{ borderColor: theme.colors.neutral.light }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 outline-none transition"
                  style={{ borderColor: theme.colors.neutral.light }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border-2 outline-none transition resize-none"
                  style={{ borderColor: theme.colors.neutral.light }}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message <Send size={18} />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.section>

      {/* Social Links */}
      <motion.section className="py-8 text-center border-t" style={{ borderColor: theme.colors.neutral.light }}>
        <p style={{ color: theme.colors.textSecondary }} className="mb-4">
          Follow us on social media
        </p>
        <div className="flex justify-center gap-4">
          {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
            <motion.a
              key={i}
              href="#"
              className="px-4 py-2 rounded-lg font-semibold"
              style={{
                backgroundColor: theme.colors.blue[50],
                color: theme.colors.primary,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {social}
            </motion.a>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
