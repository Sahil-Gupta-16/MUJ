/**
 * src/pages/Dashboard.tsx
 * 
 * Main dashboard page wrapped in DashboardLayout.
 */

import React from 'react';
import DashboardLayout from '../layouts/DashoardLayout.tsx';

const Dashboard: React.FC = () => (
  <DashboardLayout>
    <section className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-primary">Dashboard</h2>
      <p>Welcome to your Deepfake Detection framework dashboard.</p>
      {/* Add charts, summaries, or stats here */}
    </section>
  </DashboardLayout>
);

export default Dashboard;
