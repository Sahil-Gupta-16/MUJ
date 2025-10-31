/**
 * src/pages/ModelReport.tsx
 * 
 * Detailed forensic analysis report for individual models.
 * Shows frame-by-frame insights with color-coded frames (red=fake, green=authentic)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Download, Play, Volume2, Maximize } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import theme from '../config/theme';
import { getModelData, ModelAnalysisData, ChartDataPoint } from '../data/modelReportData';

interface ModelScore {
  name: string;
  score: number;
  color: string;
}

const ModelReport: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { model = {}, videoData = {}, modelScores = [] } = (location.state as any) || {};
  const [activeTab, setActiveTab] = useState('area-plot');

  // Get model data
  const modelData = useMemo(() => {
    return getModelData((model as ModelScore).name) || null;
  }, [model]);

  if (!model.name || !modelData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p style={{ color: theme.colors.textSecondary }} className="text-lg">
            No model report data available
          </p>
          <motion.button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-bold text-white"
            style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            whileHover={{ scale: 1.05 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'area-plot', label: 'Area Plot' },
    { id: 'bar-chart', label: 'Bar Chart' },
    { id: 'trend-line', label: 'Trend Line' },
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'distribution', label: 'Distribution' },
  ];

  const analysisMetrics = [
    { label: 'Authentic Frames', value: modelData.authenticFrames, color: theme.colors.success },
    { label: 'Deepfake Frames', value: modelData.deepfakeFrames, color: theme.colors.error },
    { label: 'Total Analyzed', value: modelData.totalFrames, color: theme.colors.primary },
    { label: 'Avg. Fake Score', value: `${modelData.avgScore}%`, color: theme.colors.secondary },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="p-3 rounded-lg shadow-lg text-xs font-semibold"
          style={{
            backgroundColor: 'white',
            border: `2px solid ${data.frameColor}`,
          }}
        >
          <p style={{ color: theme.colors.textPrimary }}>
            Frame {data.frame}
          </p>
          <p style={{ color: data.frameColor }}>
            Fake Score: {data.fakeScore}%
          </p>
          <p style={{ color: theme.colors.textSecondary }}>
            {data.isDeepfake ? '🚨 DEEPFAKE' : '✓ AUTHENTIC'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Render different chart types
 const renderChart = () => {
  const data = modelData.data;
  const modelColor = (model as ModelScore).color;

  switch (activeTab) {
    case 'area-plot':
      return (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorFakeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.colors.error} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.colors.error} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.neutral.light} />
            <XAxis
              dataKey="frame"
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="fakeScore"
              stroke={modelColor}
              fill="url(#colorFakeGradient)"
              fillOpacity={1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'bar-chart':
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.neutral.light} />
            <XAxis
              dataKey="frame"
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="fakeScore" radius={[8, 8, 0, 0]} isAnimationActive={true}>
              {data.map((entry: ChartDataPoint, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.frameColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );

    case 'trend-line':
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.neutral.light} />
            <XAxis
              dataKey="frame"
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="fakeScore"
              stroke={modelColor}
              dot={({ cx, cy, payload }: any) => (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={payload.frameColor}
                  stroke="white"
                  strokeWidth={2}
                />
              )}
              activeDot={{ r: 7 }}
              strokeWidth={2}
              name="Fake Score"
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke={theme.colors.primary}
              dot={{ fill: theme.colors.primary, r: 3 }}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Confidence"
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'heatmap':
    // Create heatmap grid with color intensity based on score - straight line
    const cellSize = 50;
    const cellMargin = 6;

    return (
        <div className="w-full overflow-x-auto p-4">
        <div className="inline-flex gap-1.5 pb-4">
            {data.map((entry: ChartDataPoint, idx: number) => {
            // Calculate opacity based on fake score (0-1 scale)
            const opacity = entry.fakeScore / 100;
            // Base color is red for fake, green for authentic
            const baseColor = entry.isDeepfake ? theme.colors.error : theme.colors.success;
            
            return (
                <motion.div
                key={`heatmap-cell-${idx}`}
                className="rounded-lg flex flex-col items-center justify-center font-bold text-white cursor-pointer transition-all flex-shrink-0"
                style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: baseColor,
                    opacity: 0.3 + opacity * 0.7, // Range from 0.3 to 1
                    boxShadow: `0 2px 8px ${baseColor}60`,
                    border: `2px solid ${baseColor}`,
                }}
                whileHover={{
                    scale: 1.15,
                    boxShadow: `0 4px 16px ${baseColor}80`,
                    zIndex: 10,
                }}
                title={`Frame ${entry.frame}: ${entry.fakeScore}% fake score - ${entry.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}`}
                >
                <div className="text-xs font-bold">{entry.frame}</div>
                <div className="text-xs font-semibold">{entry.fakeScore}%</div>
                </motion.div>
            );
            })}
        </div>

        {/* Legend */}
        <div className="mt-8 space-y-4">
            <div className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
            Legend
            </div>
            <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
                <div
                className="rounded-lg"
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: theme.colors.error,
                    opacity: 0.3,
                    border: `2px solid ${theme.colors.error}`,
                }}
                />
                <div>
                <p className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Low Fake Score
                </p>
                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    Light intensity
                </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div
                className="rounded-lg"
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: theme.colors.error,
                    opacity: 1,
                    border: `2px solid ${theme.colors.error}`,
                }}
                />
                <div>
                <p className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
                    High Fake Score
                </p>
                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    Dark red - Deepfake
                </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div
                className="rounded-lg"
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: theme.colors.success,
                    opacity: 1,
                    border: `2px solid ${theme.colors.success}`,
                }}
                />
                <div>
                <p className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Authentic Frame
                </p>
                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    Green - Real content
                </p>
                </div>
            </div>
            </div>
        </div>
        </div>
    );

    case 'distribution':
      // Group frames by fake/authentic and calculate confidence distribution
      const fakeFrames = data.filter((d: ChartDataPoint) => d.isDeepfake);
      const authenticFrames = data.filter((d: ChartDataPoint) => !d.isDeepfake);

      // Create confidence bins (0-20, 20-40, 40-60, 60-80, 80-100)
      const confidenceBins = [
        { range: '0-20', label: '0-20%' },
        { range: '20-40', label: '20-40%' },
        { range: '40-60', label: '40-60%' },
        { range: '60-80', label: '60-80%' },
        { range: '80-100', label: '80-100%' },
      ];

      const getConfidenceBin = (confidence: number) => {
        if (confidence < 20) return 0;
        if (confidence < 40) return 1;
        if (confidence < 60) return 2;
        if (confidence < 80) return 3;
        return 4;
      };

      // Count frames in each bin
      const distributionData = confidenceBins.map((bin, idx) => {
        const fakeCount = fakeFrames.filter((f: ChartDataPoint) => getConfidenceBin(f.confidence) === idx).length;
        const authenticCount = authenticFrames.filter((a: ChartDataPoint) => getConfidenceBin(a.confidence) === idx).length;
        
        return {
          range: bin.label,
          Deepfake: fakeCount,
          Authentic: authenticCount,
        };
      });

      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.neutral.light} />
            <XAxis
              dataKey="range"
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
              label={{ value: 'Confidence Score Range', position: 'bottom', offset: 10 }}
            />
            <YAxis
              stroke={theme.colors.textSecondary}
              style={{ fontSize: '12px' }}
              label={{ value: 'Number of Frames', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: `2px solid ${theme.colors.neutral.light}`,
                borderRadius: '8px',
              }}
              formatter={(value: any) => `${value} frames`}
              labelFormatter={(label: string) => `Confidence: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar
              dataKey="Deepfake"
              fill={theme.colors.error}
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
            <Bar
              dataKey="Authentic"
              fill={theme.colors.success}
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
};

  return (
    <motion.div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8"
      style={{ backgroundColor: theme.colors.neutral.lightest }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-screen mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={24} style={{ color: theme.colors.primary }} />
            </motion.button>
            <div>
              <h1 className="text-3xl font-black" style={{ color: (model as ModelScore).color }}>
                {model.name} - Detailed Report
              </h1>
              <p style={{ color: theme.colors.textSecondary }} className="text-sm mt-1">
                A deep-dive forensic analysis for the file: {videoData.title || 'video.mp4'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              className="p-2 rounded-lg transition"
              style={{ backgroundColor: theme.colors.neutral.lightest }}
              whileHover={{ scale: 1.1 }}
              title="Refresh Data"
            >
              <RefreshCw size={20} style={{ color: theme.colors.primary }} />
            </motion.button>
            <motion.button
              className="p-2 rounded-lg transition"
              style={{ backgroundColor: theme.colors.neutral.lightest }}
              whileHover={{ scale: 1.1 }}
              title="Download Report"
            >
              <Download size={20} style={{ color: theme.colors.primary }} />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Video Player & Summary */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Video Player */}
            <motion.div
              className="bg-black rounded-xl overflow-hidden shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <Play size={48} className="text-white opacity-50" />
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <span className="text-sm font-semibold">00:00 / 08:16</span>
                <div className="flex gap-2">
                  <Volume2 size={18} className="cursor-pointer hover:opacity-70" />
                  <Maximize size={18} className="cursor-pointer hover:opacity-70" />
                </div>
              </div>
            </motion.div>

            {/* Analysis Summary Card */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg border-2"
              style={{ borderColor: theme.colors.neutral.light }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: theme.colors.textPrimary }}>
                  Analysis Summary
                </h3>
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: modelData.avgScore >= 60 ? theme.colors.error : theme.colors.success }}
                >
                  {modelData.avgScore >= 60 ? 'SUSPICIOUS' : 'REAL'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p style={{ color: theme.colors.textSecondary }} className="text-xs">
                    Model
                  </p>
                  <p className="font-bold" style={{ color: theme.colors.textPrimary }}>
                    {modelData.modelName}
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.colors.textSecondary }} className="text-xs">
                    Confidence
                  </p>
                  <p className="font-black text-2xl" style={{ color: (model as ModelScore).color }}>
                    {modelData.avgScore}%
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.colors.textSecondary }} className="text-xs">
                    Status
                  </p>
                  <p className="font-semibold text-green-600">Completed</p>
                </div>
                <div>
                  <p style={{ color: theme.colors.textSecondary }} className="text-xs">
                    Run Number
                  </p>
                  <p className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                    #1
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.colors.textSecondary }} className="text-xs">
                    Analyzed
                  </p>
                  <p className="font-semibold text-sm" style={{ color: theme.colors.textPrimary }}>
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <motion.button
                className="w-full mt-4 py-2 rounded-lg font-bold text-sm"
                style={{
                  backgroundColor: theme.colors.neutral.lightest,
                  color: theme.colors.primary,
                }}
                whileHover={{ backgroundColor: theme.colors.blue[50] }}
              >
                View All Analyses
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Analysis Details */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Analysis Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analysisMetrics.map((metric, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow-lg text-center border-2"
                  style={{ borderColor: metric.color + '40' }}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <p style={{ color: metric.color }} className="font-black text-2xl">
                    {metric.value}
                  </p>
                  <p style={{ color: theme.colors.textSecondary }} className="text-xs font-semibold mt-1">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Video Analysis Details Section */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-bold text-lg mb-4" style={{ color: theme.colors.textPrimary }}>
                Video Analysis Details
              </h3>
              <p style={{ color: theme.colors.textSecondary }} className="text-sm mb-4">
                Frame-by-frame insights into potential deepfake indicators. Red bars indicate deepfake frames, green indicates authentic frames.
              </p>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: activeTab === tab.id ? theme.colors.primary : theme.colors.neutral.lightest,
                      color: activeTab === tab.id ? 'white' : theme.colors.textPrimary,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Chart Area */}
              <motion.div
                className=" p-6 rounded-lg"
                style={{
                    background: `linear-gradient(135deg, ${theme.colors.neutral.lightest} 0%, ${theme.colors.primary}08 100%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {renderChart()}
              </motion.div>
            </motion.div>

            {/* Confidence Area Plot Description */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg border-2"
              style={{ borderColor: theme.colors.neutral.light }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.textPrimary }}>
                Color Legend
              </h3>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.error }}
                  />
                  <span style={{ color: theme.colors.textSecondary }}>Deepfake Frame</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.success }}
                  />
                  <span style={{ color: theme.colors.textSecondary }}>Authentic Frame</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center text-sm"
          style={{ color: theme.colors.textSecondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>© 2025 DeepfakeGuard. All Rights Reserved.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModelReport;
