import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';

const DashboardCharts = ({ userGrowthApiData, subscriptionRevenueApiData }) => {
  // User growth data - Simplified and robust processing
  const userGrowthData = useMemo(() => {
    if (userGrowthApiData && userGrowthApiData.length > 0) {
      // Handle various API response structures
      const labels = userGrowthApiData.map((item, index) => {
        // Try different date fields
        const date = item.date || item.month || item._id || `Day ${index + 1}`;
        if (date && typeof date === 'string' && date.includes('-')) {
          return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return date || `Entry ${index + 1}`;
      });

      const data = userGrowthApiData.map(item =>
        item.count || item.totalUsers || item.cumulativeTotal || item.newUsers || 0
      );

      return {
        labels,
        datasets: [{
          label: 'Total Users',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
        }],
      };
    }

    // Fallback data
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Users',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }],
    };
  }, [userGrowthApiData]);

  // Revenue data - Handle various API response structures
  const revenueByPlanData = useMemo(() => {
    if (subscriptionRevenueApiData && subscriptionRevenueApiData.length > 0) {
      const labels = subscriptionRevenueApiData.map(item =>
        item.planName || item.plan || item.all || 'Total'
      );

      const data = subscriptionRevenueApiData.map(item => item.revenue || 0);

      const backgroundColors = subscriptionRevenueApiData.map((item, index) => {
        const colors = [
          'rgba(59, 130, 246, 0.7)',     // Blue for total
          'rgba(16, 185, 129, 0.7)',     // Green
          'rgba(245, 158, 11, 0.7)',     // Amber
          'rgba(139, 92, 246, 0.7)',     // Purple
          'rgba(236, 72, 153, 0.7)',     // Pink
          'rgba(239, 68, 68, 0.7)',      // Red
          'rgba(34, 197, 94, 0.7)',      // Emerald
          'rgba(168, 85, 247, 0.7)',     // Violet
        ];
        return colors[index % colors.length];
      });

      const borderColors = subscriptionRevenueApiData.map((item, index) => {
        const colors = [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
        ];
        return colors[index % colors.length];
      });

      return {
        labels,
        datasets: [{
          label: 'Revenue ($)',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 4,
        }],
      };
    }

    // Fallback data with all plan types
    return {
      labels: ['Free', 'Orbit', 'Starlight', 'Nova', 'Equinox', 'Polaris', 'Orion', 'Cosmos'],
      datasets: [{
        label: 'Monthly Revenue ($)',
        data: [0, 250, 500, 1000, 2000, 3500, 6500, 10000],
        backgroundColor: [
          'rgba(156, 163, 175, 0.7)',  // Gray for Free
          'rgba(99, 102, 241, 0.7)',   // Indigo for Orbit
          'rgba(59, 130, 246, 0.7)',   // Blue for Starlight
          'rgba(16, 185, 129, 0.7)',   // Emerald for Nova
          'rgba(245, 158, 11, 0.7)',   // Amber for Equinox
          'rgba(139, 92, 246, 0.7)',   // Purple for Polaris
          'rgba(236, 72, 153, 0.7)',   // Pink for Orion
          'rgba(239, 68, 68, 0.7)',    // Red for Cosmos
        ],
        borderColor: [
          'rgba(156, 163, 175, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
        borderRadius: 4,
      }],
    };
  }, [subscriptionRevenueApiData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* User Growth Over Time */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
          User Growth Over Time
        </h2>
        <div className="h-80">
          <Line data={userGrowthData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#ffffff', usePointStyle: true, padding: 20 } },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`
                }
              },
            },
            scales: {
              x: { ticks: { color: '#ffffff', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.1)' } },
              y: { beginAtZero: true, ticks: { color: '#ffffff', callback: (value) => Math.round(value).toString() }, grid: { color: 'rgba(255,255,255,0.1)' } },
            },
          }} />
          <div className="mt-4 text-center text-sm text-gray-300">
            {userGrowthApiData.length > 0 ? 'Live API Data' : 'Sample Data'}
          </div>
        </div>
      </div>

      {/* Revenue by Subscription Plan */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
          Revenue by Subscription Plan
        </h2>
        <div className="h-80">
          <Bar data={revenueByPlanData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                callbacks: { label: (context) => `$${context.parsed.y.toLocaleString()}` },
              },
            },
            scales: {
              x: { ticks: { color: '#ffffff', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.1)' } },
              y: { ticks: { color: '#ffffff', callback: (value) => `$${value.toLocaleString()}` }, grid: { color: 'rgba(255,255,255,0.1)' } },
            },
          }} />
          <div className="mt-2 text-center text-sm text-gray-300">
            {subscriptionRevenueApiData.length > 0 ? 'Live API Data' : 'Sample Data'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;