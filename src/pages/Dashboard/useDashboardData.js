import { useState, useEffect } from 'react';
import adminApi from '../../api/admin';

const useDashboardData = () => {
  const [summary, setSummary] = useState({
    data: {
      totalUsers: 0,
      postsToday: 0,
      totalRevenue: 0,
      newSignups: 0
    }
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [userGrowthApiData, setUserGrowthApiData] = useState([]);
  const [subscriptionRevenueApiData, setSubscriptionRevenueApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);

        const summaryResponse = await adminApi.getDashboardSummary();

        let dashboardData = {
          totalUsers: 0,
          postsToday: 0,
          totalRevenue: 0,
          newSignups: 0
        };

        if (summaryResponse?.data && typeof summaryResponse.data === 'object') {
          dashboardData = { ...dashboardData, ...summaryResponse.data };
        } else if (summaryResponse && typeof summaryResponse === 'object') {
          dashboardData = { ...dashboardData, ...summaryResponse };
        }

        setSummary({ data: dashboardData });

        // Fetch user growth data
        try {
          const now = new Date();
          const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
          const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30));

          const userGrowthResponse = await adminApi.getUserGrowth({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          });

          if (userGrowthResponse?.data?.userGrowth && Array.isArray(userGrowthResponse.data.userGrowth)) {
            setUserGrowthApiData(userGrowthResponse.data.userGrowth);
          } else {
            setUserGrowthApiData([]);
          }
        } catch (growthErr) {
          console.error('User growth fetch error:', growthErr);
          setUserGrowthApiData([]);
        }

        // Fetch subscription revenue data
        try {
          const revenueResponse = await adminApi.getSubscriptionRevenue();
          console.log('Revenue API response:', revenueResponse);

          if (revenueResponse?.success) {
            // Based on your API response, it returns an empty array in data
            // The data might be in a different property or structure
            let data = [];
            if (Array.isArray(revenueResponse.data)) {
              data = revenueResponse.data;
            } else if (revenueResponse.data && typeof revenueResponse.data === 'object') {
              // Try to extract data from object properties
              data = Object.values(revenueResponse.data).filter(Array.isArray);
              data = data.length > 0 ? data[0] : [];
            }

            if (data.length > 0) {
              const processedData = data.map(item => ({
                plan: item.plan || item.all || item.planName || 'Total',
                revenue: item.revenue || item.amount || 0
              }));
              setSubscriptionRevenueApiData(processedData);
            } else {
              // If no data, still show fallback but log it
              console.log('No revenue data available, using fallback');
              setSubscriptionRevenueApiData([]);
            }
          } else {
            setSubscriptionRevenueApiData([]);
          }
        } catch (revenueErr) {
          console.error('Subscription revenue fetch error:', revenueErr);
          setSubscriptionRevenueApiData([]);
        }

        setSummaryError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard summary:', err);
        setSummaryError('Failed to load dashboard data: ' + (err.message || 'Unknown error'));
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    summary,
    summaryLoading,
    summaryError,
    userGrowthApiData,
    subscriptionRevenueApiData,
    loading,
    error
  };
};

export default useDashboardData;