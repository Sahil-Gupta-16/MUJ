/**
 * src/pages/History.tsx
 * 
 * Past analysis reports and detection history
 * - List view of all analyzed videos/images
 * - Filter by status, type, date
 * - Search functionality
 * - Auto-updates when new reports added
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import theme from '../config/theme';
import { useReports, Report } from '../context/ReportContext';

// Report Row Component
const ReportRow: React.FC<{
  report: Report;
  index: number;
  onView: (report: Report) => void;
  onDelete: (id: number) => void;
}> = ({ report, index, onView, onDelete }) => {
  const statusColor = report.status === 'completed' ? theme.colors.success : report.status === 'failed' ? theme.colors.error : theme.colors.warning;
  const resultColor = report.isFake ? theme.colors.error : theme.colors.success;
  const MediaIcon = report.mediaType === 'video' ? VideoIcon : ImageIcon;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ backgroundColor: theme.colors.neutral.lightest }}
      style={{ cursor: 'pointer' }}
    >
      {/* Media Name & Type */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: theme.colors.blue[50] }}
          >
            <MediaIcon size={16} style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
              {report.mediaName}
            </p>
            <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
              {report.fileSize}
            </p>
          </div>
        </div>
      </td>

      {/* Title */}
      <td className="px-4 py-4">
        <p className="text-sm font-medium line-clamp-1" style={{ color: theme.colors.textPrimary }}>
          {report.title}
        </p>
      </td>

      {/* Model Used */}
      <td className="px-4 py-4">
        <p className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
          {report.model}
        </p>
      </td>

      {/* Result */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-2">
          {report.isFake ? (
            <AlertCircle size={16} style={{ color: theme.colors.error }} />
          ) : (
            <CheckCircle size={16} style={{ color: theme.colors.success }} />
          )}
          <span
            className="text-sm font-bold"
            style={{ color: resultColor }}
          >
            {report.isFake ? 'Deepfake' : 'Authentic'}
          </span>
        </div>
      </td>

      {/* Confidence */}
      <td className="px-4 py-4">
        <div
          className="px-3 py-1 rounded-full text-sm font-bold text-center"
          style={{
            backgroundColor: resultColor + '20',
            color: resultColor,
          }}
        >
          {report.confidence}%
        </div>
      </td>

      {/* Processing Time */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-1 text-sm" style={{ color: theme.colors.textSecondary }}>
          <Clock size={14} />
          <span>{report.processingTime}</span>
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-4">
        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
          {new Date(report.timestamp).toLocaleDateString()}
        </p>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className="px-2 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: statusColor + '20',
            color: statusColor,
          }}
        >
          {report.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onView(report);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="View Details"
          >
            <ChevronRight size={18} style={{ color: theme.colors.primary }} />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(report.id);
            }}
            className="p-2 rounded-lg hover:bg-red-100 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Delete Report"
          >
            <Trash2 size={18} style={{ color: theme.colors.error }} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const { reports, deleteReport } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed' | 'pending'>('all');
  const [filterResult, setFilterResult] = useState<'all' | 'fake' | 'authentic'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'confidence'>('recent');

  // Filter and Sort
  const filteredReports = useMemo(() => {
    let filtered = reports.filter((report) => {
      const matchesSearch =
        report.mediaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || report.mediaType === filterType;
      const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
      const matchesResult =
        filterResult === 'all' ||
        (filterResult === 'fake' && report.isFake) ||
        (filterResult === 'authentic' && !report.isFake);

      return matchesSearch && matchesType && matchesStatus && matchesResult;
    });

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      filtered.sort((a, b) => b.confidence - a.confidence);
    }

    return filtered;
  }, [reports, searchTerm, filterType, filterStatus, filterResult, sortBy]);

  const handleViewReport = (report: Report) => {
    navigate('/results', {
      state: {
        videoData: {
          id: report.id,
          thumbnail: 'https://via.placeholder.com/400x300/A0674B/FFFFFF?text=' + report.mediaType,
          title: report.title,
          channel: report.channel,
          sourceLink: '#',
          isFake: report.isFake,
          confidence: report.confidence,
          views: report.views,
          uploadDate: new Date(report.timestamp).toLocaleDateString(),
        },
      },
    });
  };

  const completedCount = reports.filter((r) => r.status === 'completed').length;
  const fakeCount = reports.filter((r) => r.isFake).length;
  const avgConfidence = reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.confidence, 0) / reports.length) : 0;

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-screen px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text  " style={{ fontFamily: theme.fonts.base }}>
            Analysis History
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            View and manage all past media analysis reports
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="p-4 rounded-lg bg-white"
            style={{ border: `1px solid ${theme.colors.neutral.light}` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>
              Total Reports
            </p>
            <p className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
              {reports.length}
            </p>
          </motion.div>

          <motion.div
            className="p-4 rounded-lg bg-white"
            style={{ border: `1px solid ${theme.colors.neutral.light}` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>
              Deepfakes Found
            </p>
            <p className="text-3xl font-bold" style={{ color: theme.colors.error }}>
              {fakeCount}
            </p>
          </motion.div>

          <motion.div
            className="p-4 rounded-lg bg-white"
            style={{ border: `1px solid ${theme.colors.neutral.light}` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>
              Avg Confidence
            </p>
            <p className="text-3xl font-bold" style={{ color: theme.colors.secondary }}>
              {avgConfidence}%
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          className="p-6 rounded-lg bg-white mb-6"
          style={{ border: `1px solid ${theme.colors.neutral.light}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textSecondary }} />
              <input
                type="text"
                placeholder="Search by filename or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-all text-sm"
                style={{
                  border: `2px solid ${theme.colors.neutral.light}`,
                  color: theme.colors.textPrimary,
                }}
                onFocus={(e) => (e.target.style.borderColor = theme.colors.primary)}
                onBlur={(e) => (e.target.style.borderColor = theme.colors.neutral.light)}
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all"
              style={{
                border: `2px solid ${theme.colors.neutral.light}`,
                color: theme.colors.textPrimary,
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all"
              style={{
                border: `2px solid ${theme.colors.neutral.light}`,
                color: theme.colors.textPrimary,
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Result Filter */}
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all"
              style={{
                border: `2px solid ${theme.colors.neutral.light}`,
                color: theme.colors.textPrimary,
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Results</option>
              <option value="fake">Deepfakes</option>
              <option value="authentic">Authentic</option>
            </select>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
              Sort by:
            </span>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'recent' ? 'text-white' : ''
              }`}
              style={{
                backgroundColor: sortBy === 'recent' ? theme.colors.primary : theme.colors.neutral.lightest,
                color: sortBy === 'recent' ? 'white' : theme.colors.textPrimary,
              }}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('confidence')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'confidence' ? 'text-white' : ''
              }`}
              style={{
                backgroundColor: sortBy === 'confidence' ? theme.colors.primary : theme.colors.neutral.lightest,
                color: sortBy === 'confidence' ? 'white' : theme.colors.textPrimary,
              }}
            >
              Confidence
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          className="mb-4 text-sm font-medium"
          style={{ color: theme.colors.textSecondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Showing <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{filteredReports.length}</span> results
        </motion.p>

        {/* Reports Table */}
        <motion.div
          className="p-6 rounded-lg bg-white"
          style={{ border: `1px solid ${theme.colors.neutral.light}` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `2px solid ${theme.colors.neutral.light}` }}>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    MEDIA
                  </th>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    TITLE
                  </th>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    MODEL
                  </th>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    RESULT
                  </th>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    CONFIDENCE
                  </th>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    TIME
                  </th>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    DATE
                  </th>
                  <th className="text-left px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    STATUS
                  </th>
                  <th className="text-right px-4 py-3 font-bold" style={{ color: theme.colors.textPrimary }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report, idx) => (
                      <ReportRow
                        key={report.id}
                        report={report}
                        index={idx}
                        onView={handleViewReport}
                        onDelete={deleteReport}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center">
                        <p style={{ color: theme.colors.textSecondary }}>
                          {reports.length === 0 ? 'No reports yet. Upload media to get started!' : 'No reports found matching your filters'}
                        </p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs mb-6" style={{ color: theme.colors.textSecondary }}>
          <p>© 2025 DeeFend. All Rights Reserved.</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default History;
