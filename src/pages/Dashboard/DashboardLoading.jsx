import React from 'react';

const DashboardLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-[var(--color-text-secondary)]">Loading dashboard data...</p>
    </div>
  </div>
);

export default DashboardLoading;