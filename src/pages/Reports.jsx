import React, { useEffect, useState } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';

const Reports = () => {
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch reports data using the backend API endpoints
        const reportsResponse = period === 'daily'
          ? await adminApi.getDashboardReportsDaily()
          : await adminApi.getDashboardReportsMonthly();

        console.log('[reports] reports data:', reportsResponse);

        if (reportsResponse) {
          if (reportsResponse.data && typeof reportsResponse.data === 'object') {
            setReportsData(reportsResponse.data);
          } else if (typeof reportsResponse === 'object') {
            setReportsData(reportsResponse);
          }
        }

        // Fetch statistics using the backend API endpoint
        const statsResponse = await adminApi.getDashboardStatistics();
        console.log('[reports] statistics data:', statsResponse);

        if (statsResponse) {
          if (statsResponse.data && typeof statsResponse.data === 'object') {
            setStatistics(statsResponse.data);
          } else if (typeof statsResponse === 'object') {
            setStatistics(statsResponse);
          }
        }
      } catch (err) {
        console.error('[reports] load error', err);
        toast.error('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  // Helper function to extract total from collection data
  const getTotalFromCollection = (collectionData) => {
    if (!collectionData || !Array.isArray(collectionData) || collectionData.length === 0) {
      return 0;
    }
    
    // Sum up all totals from the collection
    return collectionData.reduce((sum, item) => {
      return sum + (item.total || 0);
    }, 0);
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Reports
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Backend-driven analytics and reporting
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-[var(--color-text-secondary)]">Period:</span>
            <button
              onClick={() => setPeriod('daily')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'daily'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                period === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-[var(--color-text-secondary)]">Loading reports data...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="space-y-8">
            {/* Statistics Section */}
            {statistics && Object.keys(statistics).length > 0 && (
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                  Dashboard Statistics
                </h2>
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
              </div>
            )}

            {/* Reports Section - UPDATED */}
            {reportsData && Object.keys(reportsData).length > 0 && (
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                  {period === 'daily' ? 'Daily Reports' : 'Monthly Reports'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* User Reports - Only Total */}
                  {reportsData.User && (
                    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-6">
                      <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                        👥 Users
                      </div>
                      <div className="text-3xl font-bold text-[var(--color-text-primary)] text-center">
                        {getTotalFromCollection(reportsData.User).toLocaleString()}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] text-center mt-2">
                        Total Users
                      </div>
                    </div>
                  )}

                  {/* Deposit Reports - Only Total */}
                  {reportsData.Deposit && (
                    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-6">
                      <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                        💰 Deposits
                      </div>
                      <div className="text-3xl font-bold text-[var(--color-text-primary)] text-center">
                        {getTotalFromCollection(reportsData.Deposit).toLocaleString()}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] text-center mt-2">
                        Total Deposits
                      </div>
                    </div>
                  )}

                  {/* Withdrawal Reports */}
                  {reportsData.Withdrawal && (
                    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-6">
                      <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                        🏦 Withdrawals
                      </div>
                      <div className="text-3xl font-bold text-[var(--color-text-primary)] text-center">
                        {getTotalFromCollection(reportsData.Withdrawal).toLocaleString()}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] text-center mt-2">
                        Total Withdrawals
                      </div>
                    </div>
                  )}

                  {/* Post Reports */}
                  {reportsData.Post && (
                    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-6">
                      <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                        📝 Posts
                      </div>
                      <div className="text-3xl font-bold text-[var(--color-text-primary)] text-center">
                        {getTotalFromCollection(reportsData.Post).toLocaleString()}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] text-center mt-2">
                        Total Posts
                      </div>
                    </div>
                  )}

                  {/* AffiliationCount Reports */}
                  {reportsData.AffiliationCount && (
                    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-6">
                      <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                        🤝 Affiliations
                      </div>
                      <div className="text-3xl font-bold text-[var(--color-text-primary)] text-center">
                        {getTotalFromCollection(reportsData.AffiliationCount).toLocaleString()}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)] text-center mt-2">
                        Total Affiliations
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Data State */}
            {(!statistics || Object.keys(statistics).length === 0) &&
             (!reportsData || Object.keys(reportsData).length === 0) && (
              <div className="text-center py-16 bg-[var(--color-bg-secondary)] rounded-lg">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  No Reports Data Available
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  No data could be loaded from the backend APIs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;