import React from 'react';

const DashboardError = ({ summaryError }) => (
  <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
    <div className="text-center p-6 max-w-md">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Error Loading Dashboard</h3>
      <p className="text-[var(--color-text-secondary)] mb-4">{summaryError}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

export default DashboardError;