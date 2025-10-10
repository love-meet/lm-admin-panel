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
          // Calculate date range for user growth (last 30 days) - using UTC
          const now = new Date();
          const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
          const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30));

          const userGrowthResponse = await adminApi.getUserGrowth({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          });
          console.log('✅ Raw user growth response:', userGrowthResponse);

          // FIXED: Access the nested data structure
          if (userGrowthResponse && userGrowthResponse.data && userGrowthResponse.data.userGrowth) {
            // Your API returns: {data: {userGrowth: Array(1), dateRange: {...}, interval: 'day'}}
            if (Array.isArray(userGrowthResponse.data.userGrowth) && userGrowthResponse.data.userGrowth.length > 0) {
              console.log('✅ User growth data found:', userGrowthResponse.data.userGrowth);

              // Use the data directly from the API - no transformation needed
              setUserGrowthApiData(userGrowthResponse.data.userGrowth);
            } else {
              console.warn('⚠️ User growth data is empty array:', userGrowthResponse.data.userGrowth);
              setUserGrowthApiData([]);
            }
          } else {
            console.warn('⚠️ No userGrowth property in response:', userGrowthResponse);
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
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
 {/* User Growth Over Time */}
<div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-4 md:p-6">
  <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
    User Growth Over Time
  </h2>

  <div className="h-80">
    <Line
      data={{
        labels: userGrowthApiData.length
          ? userGrowthApiData.map((d) => 
              new Date(d.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            )
          : ['Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 30', 'Oct 5', 'Oct 8'],
        datasets: [
          {
            label: 'Total Users',
            data: userGrowthApiData.length
              ? userGrowthApiData.map((d) => d.cumulativeTotal || d.totalUsers || 0)
              : [0, 0, 1, 1, 1, 1, 2],
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBackgroundColor: '#60a5fa',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
          {
            label: 'New Users',
            data: userGrowthApiData.length
              ? userGrowthApiData.map((d) => d.newUsers || 0)
              : [0, 0, 1, 0, 0, 0, 1],
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBackgroundColor: '#34d399',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          }
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { 
              color: '#ffffff',
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toLocaleString();
                }
                return label;
              }
            }
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            ticks: { 
              color: '#ffffff',
              maxRotation: 45,
            },
            grid: { 
              color: 'rgba(255,255,255,0.1)',
              drawBorder: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff',
              callback: (value) => value.toLocaleString(),
            },
            grid: { 
              color: 'rgba(255,255,255,0.1)',
              drawBorder: false,
            },
          },
        },
      }}
    />
    <div className="mt-4 flex flex-col items-center text-sm text-gray-300">
      {userGrowthApiData.length > 0 ? (
        <>
          <span>Live API Data • Date Range: {userGrowthApiData[0]?.date || 'N/A'} to {userGrowthApiData[userGrowthApiData.length - 1]?.date || 'N/A'}</span>
          <span className="text-xs text-gray-400 mt-1">
            Total Users: {userGrowthApiData.reduce((max, item) => Math.max(max, item.cumulativeTotal || 0), 0).toLocaleString()} • 
            New Users: {userGrowthApiData.reduce((sum, item) => sum + (item.newUsers || 0), 0).toLocaleString()}
          </span>
        </>
      ) : (
        <span>Sample Data • No API data available</span>
      )}
    </div>
  </div>
</div>

  {/* Revenue by Subscription Plan */}
  <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-4 md:p-6">
    <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
      Revenue by Subscription Plan
    </h2>

    <div className="h-80">
      <Bar
        data={{
          labels: subscriptionRevenueApiData.length
            ? subscriptionRevenueApiData.map((d) => d.planName)
            : ['Basic', 'Pro', 'Premium', 'Enterprise'],
          datasets: [
            {
              label: 'Revenue ($)',
              data: subscriptionRevenueApiData.length
                ? subscriptionRevenueApiData.map((d) => d.revenue)
                : [1200, 3500, 5400, 7200],
              backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'],
              borderRadius: 6,
              barThickness: 40,
            },
          ],
        }}
        options={{
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
              callbacks: {
                label: (context) => `$${context.parsed.y.toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: '#ffffff',
                maxRotation: 45,
                minRotation: 45,
              },
              grid: { color: 'rgba(255,255,255,0.1)' },
            },
            y: {
              ticks: {
                color: '#ffffff',
                callback: (value) => `$${value.toLocaleString()}`,
              },
              grid: { color: 'rgba(255,255,255,0.1)' },
            },
          },
        }}
      />
      <div className="mt-2 text-sm text-gray-300 text-center">
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