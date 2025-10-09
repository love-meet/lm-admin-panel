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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Starting dashboard data fetch...');

        // Fetch summary data
        const summaryResponse = await adminApi.getDashboardSummary();
        console.log('✅ Dashboard summary data:', summaryResponse);

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

        // FIXED: Process user growth data based on your actual API response
        console.log('🔄 Fetching user growth data...');
        try {
          const userGrowthResponse = await adminApi.getUserGrowth();
          console.log('✅ User growth response:', userGrowthResponse);
          
          if (userGrowthResponse && userGrowthResponse.success) {
            // Based on your console: {success: true, data: Array(1)} with {_id: null, totalUsers: $}
            if (Array.isArray(userGrowthResponse.data)) {
              // Process the actual data structure from your API
              const processedData = userGrowthResponse.data.map(item => {
                // Handle the structure: {_id: null, totalUsers: $}
                return {
                  month: item._id || 'All Time',
                  count: item.totalUsers || 0
                };
              });
              setUserGrowthApiData(processedData);
            } else {
              console.warn('User growth data is not an array:', userGrowthResponse.data);
              setUserGrowthApiData([]);
            }
          } else {
            setUserGrowthApiData([]);
          }
        } catch (growthErr) {
          console.error('❌ User growth error:', growthErr.message);
          setUserGrowthApiData([]);
        }

        // FIXED: Process subscription revenue data based on your actual API response
        console.log('🔄 Fetching subscription revenue data...');
        try {
          const revenueResponse = await adminApi.getSubscriptionRevenue();
          console.log('✅ Subscription revenue response:', revenueResponse);
          
          if (revenueResponse && revenueResponse.success) {
            // Based on your console: {success: true, data: Array(1)} with {revenue: 1.137..., all: null}
            if (Array.isArray(revenueResponse.data)) {
              // Process the actual data structure from your API
              const processedData = revenueResponse.data.map(item => {
                // Handle the structure: {revenue: 1.137..., all: null}
                return {
                  plan: item.all || 'Total',
                  revenue: item.revenue || 0
                };
              });
              setSubscriptionRevenueApiData(processedData);
            } else {
              console.warn('Subscription revenue data is not an array:', revenueResponse.data);
              setSubscriptionRevenueApiData([]);
            }
          } else {
            setSubscriptionRevenueApiData([]);
          }
        } catch (revenueErr) {
          console.error('❌ Subscription revenue error:', revenueErr.message);
          setSubscriptionRevenueApiData([]);
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

  // User growth data - FIXED to handle your actual API response structure
  const userGrowthData = useMemo(() => {
    console.log('Processing user growth data:', userGrowthApiData);
    
    if (userGrowthApiData && userGrowthApiData.length > 0) {
      // Handle your actual API structure: [{_id: null, totalUsers: $}]
      const labels = userGrowthApiData.map(item => {
        // If _id is null, use a default label, otherwise format it
        return item.month === null ? 'All Time' : (item.month || 'Unknown');
      });
      
      const data = userGrowthApiData.map(item => item.count || item.totalUsers || 0);
      
      console.log('Processed user growth labels:', labels);
      console.log('Processed user growth data:', data);
      
      return {
        labels,
        datasets: [
          {
            label: 'Total Users',
            data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.3,
          },
        ],
      };
    } else {
      // Fallback to hardcoded data with better labels
      console.log('Using fallback user growth data');
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

  // Revenue data - FIXED to handle your actual API response structure
  const revenueByPlanData = useMemo(() => {
    console.log('Processing revenue data:', subscriptionRevenueApiData);
    
    if (subscriptionRevenueApiData && subscriptionRevenueApiData.length > 0) {
      // Handle your actual API structure: [{revenue: 1.137..., all: null}]
      const labels = subscriptionRevenueApiData.map(item => {
        // If all is null, use a default label
        return item.plan === null ? 'Total Revenue' : (item.plan || 'Unknown Plan');
      });
      
      const data = subscriptionRevenueApiData.map(item => item.revenue || 0);
      
      console.log('Processed revenue labels:', labels);
      console.log('Processed revenue data:', data);
      
      const backgroundColors = subscriptionRevenueApiData.map((item, index) => {
        const colors = [
          'rgba(59, 130, 246, 0.7)',     // Blue for total
          'rgba(16, 185, 129, 0.7)',     // Green
          'rgba(245, 158, 11, 0.7)',     // Amber
          'rgba(139, 92, 246, 0.7)',     // Purple
        ];
        return colors[index % colors.length];
      });
      
      const borderColors = subscriptionRevenueApiData.map((item, index) => {
        const colors = [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ];
        return colors[index % colors.length];
      });

      return {
        labels,
        datasets: [
          {
            label: 'Revenue ($)',
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
      console.log('Using fallback revenue data');
      return {
        labels: ['Free', 'Orbit', 'Starlight', 'Nova', 'Equinox', 'Polaris', 'Orion', 'Cosmos'],
        datasets: [
          {
            label: 'Monthly Revenue ($)',
            data: [0, 250, 500, 1000, 2000, 3500, 6500, 10000],
            backgroundColor: [
              'rgba(156, 163, 175, 0.7)',
              'rgba(99, 102, 241, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(236, 72, 153, 0.7)',
              'rgba(239, 68, 68, 0.7)',
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
                      labels: { color: 'var(--color-text-primary)' },
                    },
                    tooltip: {
                      backgroundColor: 'var(--color-bg-secondary)',
                      titleColor: 'var(--color-text-primary)',
                      bodyColor: 'var(--color-text-primary)',
                      borderColor: 'var(--color-bg-tertiary)',
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: 'var(--color-text-secondary)' },
                      grid: { color: 'var(--color-bg-tertiary)' },
                    },
                    y: {
                      ticks: { color: 'var(--color-text-secondary)' },
                      grid: { color: 'var(--color-bg-tertiary)' },
                    },
                  },
                }}
              />
              <div className="mt-2 text-sm text-[var(--color-text-secondary)] text-center">
                {userGrowthApiData.length > 0 ? 'Live API Data' : 'Sample Data'}
              </div>
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
                    tooltip: {
                      backgroundColor: 'var(--color-bg-secondary)',
                      titleColor: 'var(--color-text-primary)',
                      bodyColor: 'var(--color-text-primary)',
                      borderColor: 'var(--color-bg-tertiary)',
                    },
                  },
                  scales: {
                    x: {
                      ticks: { 
                        color: 'var(--color-text-secondary)',
                        maxRotation: 45,
                        minRotation: 45
                      },
                      grid: { color: 'var(--color-bg-tertiary)' },
                    },
                    y: {
                      ticks: {
                        color: 'var(--color-text-secondary)',
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                      grid: { color: 'var(--color-bg-tertiary)' },
                    },
                  },
                }}
              />
              <div className="mt-2 text-sm text-[var(--color-text-secondary)] text-center">
                {subscriptionRevenueApiData.length > 0 ? 'Live API Data' : 'Sample Data'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;