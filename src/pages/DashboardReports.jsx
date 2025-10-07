import React, { useEffect, useState } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';

const DashboardReports = () => {
  const [statistics, setStatistics] = useState(null);
  const [dailyReports, setDailyReports] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('statistics');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load all three endpoints simultaneously
        const [statsResponse, dailyResponse, monthlyResponse] = await Promise.all([
          adminApi.getDashboardStatistics(),
          adminApi.getDashboardReportsDaily(),
          adminApi.getDashboardReportsMonthly()
        ]);

        console.log('Dashboard Statistics:', statsResponse);
        console.log('Daily Reports:', dailyResponse);
        console.log('Monthly Reports:', monthlyResponse);

        // Handle statistics
        if (statsResponse) {
          if (statsResponse.data && typeof statsResponse.data === 'object') {
            setStatistics(statsResponse.data);
          } else if (typeof statsResponse === 'object') {
            setStatistics(statsResponse);
          }
        }

        // Handle daily reports
        if (dailyResponse) {
          if (dailyResponse.data && typeof dailyResponse.data === 'object') {
            setDailyReports(dailyResponse.data);
          } else if (typeof dailyResponse === 'object') {
            setDailyReports(dailyResponse);
          }
        }

        // Handle monthly reports
        if (monthlyResponse) {
          if (monthlyResponse.data && typeof monthlyResponse.data === 'object') {
            setMonthlyReports(monthlyResponse.data);
          } else if (typeof monthlyResponse === 'object') {
            setMonthlyReports(monthlyResponse);
          }
        }

      } catch (err) {
        console.error('Failed to load dashboard reports:', err);
        toast.error('Failed to load dashboard reports data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const renderStatistics = () => {
    if (!statistics || Object.keys(statistics).length === 0) {
      return (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          No statistics data available
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(statistics).map(([key, value]) => (
          <div key={key} className="bg-[var(--color-bg-tertiary)] rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm text-[var(--color-text-secondary)] capitalize mb-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-3xl font-bold text-[var(--color-text-primary)]">
              {typeof value === 'number' ? value.toLocaleString() :
               typeof value === 'object' ? JSON.stringify(value) :
               String(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReports = (data, title) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          No {title.toLowerCase()} data available
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-[var(--color-bg-tertiary)] rounded-lg p-6">
            <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-3 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="space-y-2">
              {typeof value === 'object' && value !== null ? (
                Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="flex justify-between items-center">
                    <span className="text-sm text-[var(--color-text-secondary)] capitalize">
                      {subKey.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {typeof subValue === 'number' ? subValue.toLocaleString() : subValue}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {typeof value === 'number' ? value.toLocaleString() :
                   typeof value === 'object' ? JSON.stringify(value) :
                   String(value)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Dashboard Reports
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Loading dashboard reports data...
            </p>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Dashboard Reports
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Comprehensive dashboard analytics and reporting
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-[var(--color-bg-tertiary)]">
            <nav className="flex space-x-8">
              {[
                { id: 'statistics', label: 'Statistics', endpoint: '/admin/dashboard/statistics' },
                { id: 'daily', label: 'Daily Reports', endpoint: '/admin/dashboard/reports/daily' },
                { id: 'monthly', label: 'Monthly Reports', endpoint: '/admin/dashboard/reports/monthly' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-secondary)]'
                  }`}
                >
                  {tab.label}
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {tab.endpoint}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6">
          {activeTab === 'statistics' && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                Dashboard Statistics
              </h2>
              {renderStatistics()}
            </div>
          )}

          {activeTab === 'daily' && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                Daily Reports
              </h2>
              {renderReports(dailyReports, 'Daily Reports')}
            </div>
          )}

          {activeTab === 'monthly' && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                Monthly Reports
              </h2>
              {renderReports(monthlyReports, 'Monthly Reports')}
            </div>
          )}
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-[var(--color-bg-secondary)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            API Endpoints Used
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Statistics
              </div>
              <code className="text-xs text-[var(--color-text-secondary)]">
                GET /admin/dashboard/statistics
              </code>
            </div>
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Daily Reports
              </div>
              <code className="text-xs text-[var(--color-text-secondary)]">
                GET /admin/dashboard/reports/daily
              </code>
            </div>
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Monthly Reports
              </div>
              <code className="text-xs text-[var(--color-text-secondary)]">
                GET /admin/dashboard/reports/monthly
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReports;