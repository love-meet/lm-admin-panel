import React, { useState, useEffect, useMemo } from 'react';
import adminApi from '../api/admin';
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
  const [userGrowthApiData, setUserGrowthApiData] = useState([]);
  const [subscriptionRevenueApiData, setSubscriptionRevenueApiData] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch summary data
        const summaryResponse = await adminApi.getDashboardSummary();
        console.log('Dashboard summary data:', summaryResponse);

        let dashboardData = {
          totalUsers: 0,
          postsToday: 0,
          totalRevenue: 0,
          newSignups: 0
        };

        if (summaryResponse) {
          if (summaryResponse.data && typeof summaryResponse.data === 'object') {
            dashboardData = { ...dashboardData, ...summaryResponse.data };
          } else if (typeof summaryResponse === 'object') {
            dashboardData = { ...dashboardData, ...summaryResponse };
          }
        }

        setSummary({
          data: dashboardData
        });

        // Fetch user growth data
        try {
          const userGrowthResponse = await adminApi.getDashboardUserGrowth();
          console.log('User growth data:', userGrowthResponse);
          if (userGrowthResponse) {
            if (Array.isArray(userGrowthResponse.data)) {
              setUserGrowthApiData(userGrowthResponse.data);
            } else if (Array.isArray(userGrowthResponse)) {
              setUserGrowthApiData(userGrowthResponse);
            }
          }
        } catch (growthErr) {
          console.error('Failed to fetch user growth data:', growthErr);
        }

        // Fetch subscription revenue data
        try {
          const revenueResponse = await adminApi.getDashboardSubscriptionRevenue();
          console.log('Subscription revenue data:', revenueResponse);
          if (revenueResponse) {
            if (Array.isArray(revenueResponse.data)) {
              setSubscriptionRevenueApiData(revenueResponse.data);
            } else if (Array.isArray(revenueResponse)) {
              setSubscriptionRevenueApiData(revenueResponse);
            }
          }
        } catch (revenueErr) {
          console.error('Failed to fetch subscription revenue data:', revenueErr);
        }

        // Fetch statistics
        try {
          const statsResponse = await adminApi.getDashboardStatistics();
          console.log('Dashboard statistics:', statsResponse);
          if (statsResponse) {
            if (statsResponse.data && typeof statsResponse.data === 'object') {
              setStatistics(statsResponse.data);
            } else if (typeof statsResponse === 'object') {
              setStatistics(statsResponse);
            }
          }
        } catch (statsErr) {
          console.error('Failed to fetch dashboard statistics:', statsErr);
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

  // User growth data - use API data if available, else fallback to hardcoded
  const userGrowthData = useMemo(() => {
    if (userGrowthApiData && userGrowthApiData.length > 0) {
      // Assuming API returns array of objects with month and count
      const labels = userGrowthApiData.map(item => item.month || item.label);
      const data = userGrowthApiData.map(item => item.count || item.value || 0);
      return {
        labels,
        datasets: [
          {
            label: 'New Users',
            data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.3,
          },
        ],
      };
    } else {
      // Fallback to hardcoded data
      return {
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
    }
  }, [userGrowthApiData]);

  // Revenue data - use API data if available, else fallback to hardcoded
  const revenueByPlanData = useMemo(() => {
    if (subscriptionRevenueApiData && subscriptionRevenueApiData.length > 0) {
      // Assuming API returns array of objects with plan and revenue
      const labels = subscriptionRevenueApiData.map(item => item.plan || item.label);
      const data = subscriptionRevenueApiData.map(item => item.revenue || item.value || 0);
      const backgroundColors = subscriptionRevenueApiData.map((item, index) => {
        const colors = [
          'rgba(156, 163, 175, 0.7)',    // Free - gray
          'rgba(99, 102, 241, 0.7)',     // Orbit - indigo
          'rgba(59, 130, 246, 0.7)',     // Starlight - blue
          'rgba(16, 185, 129, 0.7)',     // Nova - green (recommended)
          'rgba(245, 158, 11, 0.7)',     // Equinox - amber
          'rgba(139, 92, 246, 0.7)',     // Polaris - purple
          'rgba(236, 72, 153, 0.7)',     // Orion - pink
          'rgba(239, 68, 68, 0.7)',      // Cosmos - red
        ];
        return colors[index % colors.length];
      });
      const borderColors = subscriptionRevenueApiData.map((item, index) => {
        const colors = [
          'rgba(156, 163, 175, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(239, 68, 68, 1)',
        ];
        return colors[index % colors.length];
      });

      return {
        labels,
        datasets: [
          {
            label: 'Monthly Revenue ($)',
            data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      };
    } else {
      // Fallback to hardcoded data
      return {
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
    }
  }, [subscriptionRevenueApiData]);

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

        {/* Statistics Section */}
        {Object.keys(statistics).length > 0 && (
          <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Dashboard Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(statistics).map(([key, value]) => (
                <div key={key} className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-sm text-[var(--color-text-secondary)] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                    {typeof value === 'number' ? value.toLocaleString() :
                     typeof value === 'object' ? JSON.stringify(value) :
                     String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;