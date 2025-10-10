import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserGrowthChart = ({ data }) => {
  // Process the API data - matching Dashboard.jsx implementation
  const processChartData = () => {
    if (!data?.userGrowth || data.userGrowth.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Handle multiple data points like Dashboard.jsx
    const labels = data.userGrowth.map((d) =>
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    const newUsers = data.userGrowth.map((d) => d.newUsers || 0);
    const cumulativeUsers = data.userGrowth.map((d) => d.cumulativeTotal || 0);

    return {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: newUsers,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Cumulative Total',
          data: cumulativeUsers,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `User Growth (${data?.dateRange?.start} to ${data?.dateRange?.end})`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Users'
        },
        beginAtZero: true
      }
    }
  };

  const chartData = processChartData();

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Line data={chartData} options={chartOptions} />

      {/* Display summary statistics */}
      {data?.userGrowth && data.userGrowth.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>Summary</h3>
          {data.userGrowth.length === 1 ? (
            // Single data point
            <>
              <p><strong>Date:</strong> {data.userGrowth[0].date}</p>
              <p><strong>New Users:</strong> {data.userGrowth[0].newUsers}</p>
              <p><strong>Cumulative Total:</strong> {data.userGrowth[0].cumulativeTotal}</p>
            </>
          ) : (
            // Multiple data points - show latest and totals
            <>
              <p><strong>Latest Date:</strong> {data.userGrowth[data.userGrowth.length - 1].date}</p>
              <p><strong>Latest New Users:</strong> {data.userGrowth[data.userGrowth.length - 1].newUsers}</p>
              <p><strong>Current Total Users:</strong> {data.userGrowth[data.userGrowth.length - 1].cumulativeTotal}</p>
              <p><strong>Total New Users (Period):</strong> {data.userGrowth.reduce((sum, item) => sum + (item.newUsers || 0), 0)}</p>
            </>
          )}
          <p><strong>Date Range:</strong> {data.dateRange?.start} to {data.dateRange?.end}</p>
          <p><strong>Interval:</strong> {data.interval}</p>
        </div>
      )}
    </div>
  );
};

export default UserGrowthChart;