import React, { useMemo } from 'react';

const DashboardStats = ({ summary, summaryLoading }) => {
  const stats = useMemo(() => {
    const data = summary.data || {
      totalUsers: 0,
      postsToday: 0,
      totalRevenue: 0,
      newSignups: 0
    };

    return [
      {
        title: 'Total Users',
        value: summaryLoading ? 'Loading...' : (data.totalUsers || 0).toLocaleString(),
        color: 'from-blue-500 to-blue-600',
        icon: '👥'
      },
      {
        title: 'Total Posts Today',
        value: summaryLoading ? 'Loading...' : (data.postsToday || 0).toLocaleString(),
        color: 'from-green-500 to-green-600',
        icon: '📝'
      },
      {
        title: 'Total Revenue',
        value: summaryLoading ? 'Loading...' : `$${(data.totalRevenue || 0).toFixed(2)}`,
        color: 'from-yellow-500 to-yellow-600',
        icon: '💰'
      },
      {
        title: 'New Sign-ups',
        value: summaryLoading ? 'Loading...' : (data.newSignups || 0).toLocaleString(),
        color: 'from-purple-500 to-purple-600',
        icon: '✨'
      },
    ];
  }, [summary, summaryLoading]);

  return (
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
  );
};

export default DashboardStats;