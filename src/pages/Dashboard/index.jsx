import React from 'react';
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

import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import DashboardLoading from './DashboardLoading';
import DashboardError from './DashboardError';
import useDashboardData from './useDashboardData';

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
  const {
    summary,
    summaryLoading,
    summaryError,
    userGrowthApiData,
    subscriptionRevenueApiData,
    loading
  } = useDashboardData();

  if (summaryLoading && loading) {
    return <DashboardLoading />;
  }

  if (summaryError) {
    return <DashboardError summaryError={summaryError} />;
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-800 to-purple-300 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-white-400 mt-1">
            Welcome back! Here's an overview of the system.
          </p>
        </div>

        <DashboardStats summary={summary} summaryLoading={summaryLoading} />
        <DashboardCharts
          userGrowthApiData={userGrowthApiData}
          subscriptionRevenueApiData={subscriptionRevenueApiData}
        />
      </div>
    </div>
  );
};

export default Dashboard;