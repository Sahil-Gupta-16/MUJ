/**
 * src/pages/SystemMonitoring.tsx
 * 
 * System monitoring dashboard displaying:
 * - Live health metrics of deepfake detection models
 * - GPU and system resource utilization
 * - Processing queue statistics
 * - Historical health check data
 * 
 * All data loaded from JSON files
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  CheckCircle,
  Zap,
  BarChart3,
  HardDrive,
  Cpu,
  Activity,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import theme from '../config/theme';
import modelsData from '../data/models.json';
import metricsData from '../data/systemMetrics.json';

interface Model {
  id: number;
  name: string;
  description: string;
  status: string;
  mediaType: string[];
  device: string;
  version: string;
  health: number;
  performance: string;
  lastChecked: string;
}

interface SystemMetrics {
  systemHealth: { overallHealth: number; timestamp: string };
  gpuVitals: {
    name: string;
    cudaVersion: string;
    usedVRAM: string;
    totalVRAM: string;
    utilizationPercent: number;
  };
  systemResources: {
    platform: string;
    pythonVersion: string;
    usedRAM: string;
    totalRAM: string;
    cpuPercent: number;
  };
  processingQueue: {
    completedJobs: number;
    failedJobs: number;
    pendingJobs: number;
    averageProcessingTime: string;
  };
  healthCheckHistory: Array<{ time: string; value: number }>;
}

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}> = ({ icon, title, value, subtitle, color = theme.colors.primary }) => (
  <motion.div
    className="p-5 rounded-lg bg-white"
    style={{
      border: `1px solid ${theme.colors.neutral.light}`,
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>
          {title}
        </p>
        <p className="text-2xl font-bold" style={{ color }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            {subtitle}
          </p>
        )}
      </div>
      <div
        className="p-2 rounded-lg"
        style={{ backgroundColor: color + '20', color }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

// Model Card Component
const ModelCard: React.FC<{ model: Model; index: number }> = ({ model, index }) => {
  const healthColor =
    model.health >= 90
      ? theme.colors.success
      : model.health >= 70
      ? theme.colors.warning
      : theme.colors.error;

  return (
    <motion.div
      className="p-5 rounded-lg bg-white"
      style={{
        border: `1px solid ${theme.colors.neutral.light}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{
        scale: 1.02,
        boxShadow: theme.shadows.md,
        borderColor: theme.colors.primary,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-sm" style={{ color: theme.colors.textPrimary }}>
            {model.name}
          </h4>
          <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            {model.description}
          </p>
        </div>
        <div
          className="px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: healthColor + '20',
            color: healthColor,
          }}
        >
          {model.health}%
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.neutral.light }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: healthColor }}
          initial={{ width: 0 }}
          animate={{ width: `${model.health}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p style={{ color: theme.colors.textSecondary }} className="font-semibold">
            Status
          </p>
          <p style={{ color: theme.colors.textPrimary }} className="font-medium">
            {model.status}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.textSecondary }} className="font-semibold">
            Device
          </p>
          <p style={{ color: theme.colors.textPrimary }} className="font-medium">
            {model.device}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.textSecondary }} className="font-semibold">
            Media Type
          </p>
          <div className="flex space-x-1 flex-wrap">
            {model.mediaType.map((type) => (
              <span
                key={type}
                className="px-1.5 py-0.5 rounded text-xs font-semibold"
                style={{
                  backgroundColor: theme.colors.blue[100],
                  color: theme.colors.primary,
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ color: theme.colors.textSecondary }} className="font-semibold">
            Last Checked
          </p>
          <p style={{ color: theme.colors.textPrimary }} className="font-medium">
            {model.lastChecked}
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <CheckCircle size={14} style={{ color: model.status === 'loaded' ? theme.colors.success : theme.colors.warning }} />
        <span className="text-xs font-semibold capitalize" style={{ color: theme.colors.textSecondary }}>
          {model.status}
        </span>
      </div>
    </motion.div>
  );
};

const SystemMonitoring: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load JSON data
    setModels(modelsData.models);
    setMetrics(metricsData as SystemMetrics);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  if (!metrics) return null;

  const videoModels = models.filter((m) => m.mediaType.includes('video')).length;
  const imageModels = models.filter((m) => m.mediaType.includes('image')).length;

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-screen mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text  "
              style={{ fontFamily: theme.fonts.base }}
            >
              System Monitoring
            </h1>
            <p style={{ color: theme.colors.textSecondary }}>
              Live status and performance metrics for the analysis services
            </p>
          </div>
          <motion.button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold"
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={refreshing}
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
            >
              <RefreshCw size={18} />
            </motion.div>
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </motion.button>
        </div>

        {/* Overall Health */}
        <motion.div
          className="mb-8 p-6 rounded-xl bg-white"
          style={{
            border: `2px solid ${theme.colors.primary}`,
            background: `linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.secondary}10 100%)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: theme.colors.textPrimary }}>
                System Health
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                All systems operational and running smoothly
              </p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-black" style={{ color: theme.colors.primary }}>
                {metrics.systemHealth.overallHealth}%
              </p>
              <p className="text-sm mt-2" style={{ color: theme.colors.textSecondary }}>
                Overall Health
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Zap size={20} />}
            title="Active Models"
            value={models.length}
            subtitle={`${videoModels} Video • ${imageModels} Image`}
            color={theme.colors.secondary}
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            title="Completed Jobs"
            value={metrics.processingQueue.completedJobs}
            subtitle="Last 24 hours"
            color={theme.colors.success}
          />
          <StatCard
            icon={<AlertCircle size={20} />}
            title="Failed Jobs"
            value={metrics.processingQueue.failedJobs}
            subtitle="Pending review"
            color={theme.colors.warning}
          />
          <StatCard
            icon={<Activity size={20} />}
            title="Avg Processing"
            value={metrics.processingQueue.averageProcessingTime}
            subtitle="Per analysis"
            color={theme.colors.accent}
          />
        </div>

        {/* GPU and System Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* GPU Vitals */}
          <motion.div
            className="p-6 rounded-xl bg-white"
            style={{
              border: `1px solid ${theme.colors.neutral.light}`,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2" style={{ color: theme.colors.textPrimary }}>
              <HardDrive size={20} style={{ color: theme.colors.secondary }} />
              <span>GPU Vitals</span>
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
                  {metrics.gpuVitals.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p style={{ color: theme.colors.textSecondary }}>CUDA Version</p>
                  <p className="font-bold" style={{ color: theme.colors.textPrimary }}>
                    {metrics.gpuVitals.cudaVersion}
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.colors.textSecondary }}>Utilization</p>
                  <p className="font-bold" style={{ color: theme.colors.secondary }}>
                    {metrics.gpuVitals.utilizationPercent}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
                  VRAM Usage
                </p>
                <div className="mb-1 flex justify-between text-xs">
                  <span style={{ color: theme.colors.textPrimary }}>
                    {metrics.gpuVitals.usedVRAM} / {metrics.gpuVitals.totalVRAM}
                  </span>
                  <span style={{ color: theme.colors.secondary }} className="font-bold">
                    {Math.round((parseFloat(metrics.gpuVitals.usedVRAM) / parseFloat(metrics.gpuVitals.totalVRAM)) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.neutral.light }}>
                  <motion.div
                    className="h-full"
                    style={{
                      backgroundColor: theme.colors.secondary,
                      width: `${(parseFloat(metrics.gpuVitals.usedVRAM) / parseFloat(metrics.gpuVitals.totalVRAM)) * 100}%`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(parseFloat(metrics.gpuVitals.usedVRAM) / parseFloat(metrics.gpuVitals.totalVRAM)) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Resources */}
          <motion.div
            className="p-6 rounded-xl bg-white"
            style={{
              border: `1px solid ${theme.colors.neutral.light}`,
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2" style={{ color: theme.colors.textPrimary }}>
              <Cpu size={20} style={{ color: theme.colors.accent }} />
              <span>System Resources</span>
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>
                  {metrics.systemResources.platform}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p style={{ color: theme.colors.textSecondary }}>Python</p>
                  <p className="font-bold" style={{ color: theme.colors.textPrimary }}>
                    {metrics.systemResources.pythonVersion}
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.colors.textSecondary }}>CPU Usage</p>
                  <p className="font-bold" style={{ color: theme.colors.accent }}>
                    {metrics.systemResources.cpuPercent}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
                  RAM Usage
                </p>
                <div className="mb-1 flex justify-between text-xs">
                  <span style={{ color: theme.colors.textPrimary }}>
                    {metrics.systemResources.usedRAM} / {metrics.systemResources.totalRAM}
                  </span>
                  <span style={{ color: theme.colors.accent }} className="font-bold">
                    {Math.round((parseFloat(metrics.systemResources.usedRAM) / parseFloat(metrics.systemResources.totalRAM)) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.neutral.light }}>
                  <motion.div
                    className="h-full"
                    style={{
                      backgroundColor: theme.colors.accent,
                      width: `${(parseFloat(metrics.systemResources.usedRAM) / parseFloat(metrics.systemResources.totalRAM)) * 100}%`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(parseFloat(metrics.systemResources.usedRAM) / parseFloat(metrics.systemResources.totalRAM)) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Loaded Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
            Loaded AI Models
          </h2>
          <p className="mb-6" style={{ color: theme.colors.textSecondary }}>
            Currently loaded models in the ML service and their capabilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {models.map((model, idx) => (
                <ModelCard key={model.id} model={model} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs" style={{ color: theme.colors.textSecondary }}>
          <p>© 2025 DeeFend. Last updated: {new Date().toLocaleString()}</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SystemMonitoring;
