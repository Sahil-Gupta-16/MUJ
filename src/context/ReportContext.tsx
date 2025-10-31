/**
 * src/context/ReportContext.tsx
 * 
 * Global context for managing reports across the application
 * - Add new reports
 * - Retrieve all reports
 * - Persist to localStorage
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Report {
  id: number;
  mediaName: string;
  mediaType: 'video' | 'image';
  title: string;
  channel: string;
  confidence: number;
  isFake: boolean;
  status: 'completed' | 'failed' | 'pending';
  processingTime: string;
  timestamp: string;
  fileSize: string;
  model: string;
  views: string;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id'>) => void;
  deleteReport: (id: number) => void;
  updateReport: (id: number, updates: Partial<Report>) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('analysisReports');
    if (stored) {
      try {
        setReports(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading reports from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('analysisReports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (report: Omit<Report, 'id'>) => {
    const newReport: Report = {
      ...report,
      id: Date.now(), // Use timestamp as unique ID
    };
    setReports((prev) => [newReport, ...prev]); // Add to beginning
  };

  const deleteReport = (id: number) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };

  const updateReport = (id: number, updates: Partial<Report>) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, ...updates } : report
      )
    );
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, deleteReport, updateReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
