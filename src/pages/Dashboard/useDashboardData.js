import { useState, useEffect } from 'react';
import adminApi from '../../api/admin';

const useDashboardData = () => {
  const [summary, setSummary] = useState({
    data: {
      totalUsers: 0,
      postsToday: 0,
      totalRevenue: 0,
      newSignups: 0,
      maleUsers: 0,
      femaleUsers: 0,
      activeUsers: 0
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
          newSignups: 0,
          maleUsers: 0,
          femaleUsers: 0,
          activeUsers: 0
        };

        
        const payload = summaryResponse?.data && typeof summaryResponse.data === 'object'
          ? summaryResponse.data
          : (summaryResponse && typeof summaryResponse === 'object' ? summaryResponse : {});

        dashboardData = {
          ...dashboardData,
          totalUsers: payload.totalUsers ?? payload.total_users ?? payload.users_total ?? dashboardData.totalUsers,
          postsToday: payload.postsToday ?? payload.posts_today ?? payload.posts_today_count ?? dashboardData.postsToday,
          totalRevenue: payload.totalRevenue ?? payload.total_revenue ?? payload.revenue_total ?? dashboardData.totalRevenue,
          newSignups: payload.newSignups ?? payload.new_signups ?? payload.signups ?? dashboardData.newSignups,
          activeUsers: payload.activeUsers ?? payload.active_users ?? payload.active_count ?? payload.activeUsersToday ?? payload.active_users_today ?? dashboardData.activeUsers
        };

        setSummary({ data: dashboardData });

        // Fetch male users count
        try {
          const maleUsersResponse = await adminApi.getDashboardMaleUsers();
          console.log('Male users response:', maleUsersResponse);
          const maleCount = maleUsersResponse?.data?.count ?? maleUsersResponse?.count ?? 0;
          dashboardData = { ...dashboardData, maleUsers: maleCount };
          setSummary({ data: dashboardData });
        } catch (maleErr) {
          console.error('Male users fetch error:', maleErr);
          dashboardData = { ...dashboardData, maleUsers: 0 };
          setSummary({ data: dashboardData });
        }

        // Fetch female users count
        try {
          const femaleUsersResponse = await adminApi.getDashboardFemaleUsers();
          console.log('Female users response:', femaleUsersResponse);
          const femaleCount = femaleUsersResponse?.data?.count ?? femaleUsersResponse?.count ?? 0;
          dashboardData = { ...dashboardData, femaleUsers: femaleCount };
          setSummary({ data: dashboardData });
        } catch (femaleErr) {
          console.error('Female users fetch error:', femaleErr);
          dashboardData = { ...dashboardData, femaleUsers: 0 };
          setSummary({ data: dashboardData });
        }

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

          if (revenueResponse?.success) {
            let data = [];
            if (Array.isArray(revenueResponse.data)) {
              data = revenueResponse.data;
            } else if (revenueResponse.data && typeof revenueResponse.data === 'object') {
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