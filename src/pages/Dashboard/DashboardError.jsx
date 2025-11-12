import React from 'react';

const DashboardError = ({ summaryError }) => (
  <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
    <div className="relative max-w-md w-full p-8 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border-2 border-transparent">
      {/* Gradient icon circle to match dashboard stats */}
      <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-red-500 to-red-500 shadow-2xl mb-4">
        <span className="text-4xl">⚠️</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200 mb-2 text-center">Error Loading Dashboard</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">{summaryError}</p>

      <div className="flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
);

export default DashboardError;