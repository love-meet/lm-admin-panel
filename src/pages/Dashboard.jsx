import React, { useMemo } from 'react';
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
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // User Growth Over Time Data (Line Chart)
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Users',
        data: [120, 190, 180, 210, 156, 175, 200],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Revenue by Subscription Plan Data (Bar Chart)
  // Revenue by Subscription Plan Data (Bar Chart)
const revenueByPlanData = {
  labels: [
    'Free',
    'Sprout',
    'Seedling',
    'Blossom',
    'Orchard',
    'Oasis',
    'Paradise',
    'Utopia',
    'Nirvana'
  ],
  datasets: [
    {
      label: 'Monthly Revenue ($)',
      data: [500, 1500, 2500, 4000, 6000, 8500, 12000, 16000, 20000],
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',   // Free
        'rgba(59, 130, 246, 0.7)',   // Sprout
        'rgba(16, 185, 129, 0.7)',   // Seedling
        'rgba(139, 92, 246, 0.7)',   // Blossom
        'rgba(245, 158, 11, 0.7)',   // Orchard
        'rgba(236, 72, 153, 0.7)',   // Oasis
        'rgba(34, 197, 94, 0.7)',    // Paradise
        'rgba(251, 191, 36, 0.7)',   // Utopia
        'rgba(168, 85, 247, 0.7)',   // Nirvana
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(168, 85, 247, 1)',
      ],
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
};


  const stats = useMemo(
    () => [
      { title: 'Total Users', value: '12,847', color: 'from-blue-500 to-blue-600', icon: '👥' },
      { title: 'Total Posts Today', value: '542', color: 'from-green-500 to-green-600', icon: '📝' },
      { title: 'Total Revenue', value: '$45,230', color: 'from-yellow-500 to-yellow-600', icon: '💰' },
      { title: 'New Sign-ups', value: '89', color: 'from-purple-500 to-purple-600', icon: '✨' },
    ],
    []
  );

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
                  },
                  scales: {
                    x: {
                      ticks: { color: '#fff' },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    },
                    y: {
                      ticks: { color: '#fff' },
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
                      ticks: { color: '#fff' },
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    },
                    y: {
                      ticks: {
                        color: '#fff',
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
