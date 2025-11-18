import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Dating App Analytics</h2>
          <p className="text-white-400 mt-1">
            Comprehensive metrics for user growth, matching, engagement, and revenue
          </p>
        </div>

        

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <DashboardStats summary={summary} summaryLoading={summaryLoading} />
            <DashboardCharts
              userGrowthApiData={userGrowthApiData}
              subscriptionRevenueApiData={subscriptionRevenueApiData}
            />
          </>
        )}

        {activeTab === 'users' && (
          <UserMetrics data={userMetrics} loading={metricsLoading || summaryLoading} />
        )}

        {activeTab === 'matching' && (
          <MatchingMetrics data={matchingMetrics} loading={metricsLoading || summaryLoading} />
        )}

        {activeTab === 'engagement' && (
          <EngagementMetrics data={engagementMetrics} loading={metricsLoading || summaryLoading} />
        )}

        {activeTab === 'revenue' && (
          <RevenueMetrics data={revenueMetrics} loading={metricsLoading || summaryLoading} />
        )}

        {activeTab === 'safety' && (
          <SafetyMetrics data={safetyMetrics} loading={metricsLoading || summaryLoading} />
        )}

        {activeTab === 'behavior' && (
          <BehaviorInsights data={behaviorMetrics} loading={metricsLoading || summaryLoading} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;