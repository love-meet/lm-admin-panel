import React, { useState, useEffect, useMemo } from 'react';
import { getDashboardSummary } from '../api/admin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    data: {
      totalUsers: 0,
      postsToday: 0,
      totalRevenue: 0,
      newSignups: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardSummary();
        console.log('Dashboard summary data:', response);
        
        // FIXED: Access data directly from response.data
        if (response && response.data) {
          const dashboardData = response.data || {
            totalUsers: 0,
            postsToday: 0,
            totalRevenue: 0,
            newSignups: 0
          };
          
          setSummary({
            data: dashboardData
          });
        } else {
          console.warn('Empty response from getDashboardSummary');
          setSummary({
            data: {
              totalUsers: 0,
              postsToday: 0,
              totalRevenue: 0,
              newSignups: 0
            }
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Updated user growth data with all months
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 59, 80, 81, 56, 55, 40, 75, 82, 90, 95, 110],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Updated revenue data with all subscription plans
  const revenueByPlanData = {
    labels: ['Free', 'Orbit', 'Starlight', 'Nova', 'Equinox', 'Polaris', 'Orion', 'Cosmos'],
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: [0, 250, 500, 1000, 2000, 3500, 6500, 10000],
        backgroundColor: [
          'rgba(156, 163, 175, 0.7)',    // Free - gray
          'rgba(99, 102, 241, 0.7)',     // Orbit - indigo
          'rgba(59, 130, 246, 0.7)',     // Starlight - blue
          'rgba(16, 185, 129, 0.7)',     // Nova - green (recommended)
          'rgba(245, 158, 11, 0.7)',     // Equinox - amber
          'rgba(139, 92, 246, 0.7)',     // Polaris - purple
          'rgba(236, 72, 153, 0.7)',     // Orion - pink
          'rgba(239, 68, 68, 0.7)',      // Cosmos - red
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
      },
    ],
  };

  const stats = useMemo(() => {
    console.log('Current summary state:', summary);
    
    // Safely access the data
    const data = summary.data || {
      totalUsers: 0,
      postsToday: 0,
      totalRevenue: 0,
      newSignups: 0
    };
    
    return [
      { 
        title: 'Total Users', 
        value: loading ? 'Loading...' : (data.totalUsers || 0).toLocaleString(), 
        color: 'from-blue-500 to-blue-600', 
        icon: '👥' 
      },
      { 
        title: 'Total Posts Today', 
        value: loading ? 'Loading...' : (data.postsToday || 0).toLocaleString(), 
        color: 'from-green-500 to-green-600', 
        icon: '📝' 
      },
      { 
        title: 'Total Revenue', 
        value: loading ? 'Loading...' : `$${(data.totalRevenue || 0).toFixed(2)}`, 
        color: 'from-yellow-500 to-yellow-600', 
        icon: '💰' 
      },
      { 
        title: 'New Sign-ups', 
        value: loading ? 'Loading...' : (data.newSignups || 0).toLocaleString(), 
        color: 'from-purple-500 to-purple-600', 
        icon: '✨' 
      },
    ];
  }, [summary, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Error Loading Dashboard</h3>
          <p className="text-[var(--color-text-secondary)] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">Dashboard</h2>
          <p className="text-[var(--color-text-secondary)]">
            Welcome back! Here's an overview of the system.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${item.color} text-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm md:text-base font-medium opacity-90">{item.title}</h3>
                  <p className="text-xl md:text-2xl font-bold mt-1">{item.value}</p>
                </div>
                <div className="text-3xl md:text-4xl opacity-80">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Over Time */}
          <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              User Growth Over Time
            </h2>
            <div className="h-80">
              <Line
                data={userGrowthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: '#ffffff' },
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: '#ffffff' },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    },
                    y: {
                      ticks: { color: '#ffffff' },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Revenue by Subscription Plan */}
          <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Revenue by Subscription Plan
            </h2>
            <div className="h-80">
              <Bar
                data={revenueByPlanData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      ticks: { 
                        color: '#ffffff',
                        maxRotation: 45,
                        minRotation: 45
                      },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    },
                    y: {
                      ticks: {
                        color: '#ffffff',
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;