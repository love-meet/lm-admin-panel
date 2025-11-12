import React, { useEffect, useState, useMemo } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';
import Modal from '../components/Modal';
import UserGrowthChart from '../components/UserGrowthChart';
import { useAuth } from '../context/AuthContext';

// Helper to read URL params
const readQuery = (key) => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  } catch (e) {
    return null;
  }
};

// Helper to set URL params
const setQuery = (key, value) => {
  try {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
  } catch (e) {
    // ignore
  }
};

const Reports = () => {
  const { hasPermission } = useAuth();
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalItemsPerPage = 10;

  // Second modal for full info
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [secondModalData, setSecondModalData] = useState(null);
  const [secondModalTitle, setSecondModalTitle] = useState('');

  const paginatedModalData = useMemo(() => {
    const startIndex = (modalCurrentPage - 1) * modalItemsPerPage;
    return modalData.slice(startIndex, startIndex + modalItemsPerPage);
  }, [modalData, modalCurrentPage, modalItemsPerPage]);

  const modalTotalPages = Math.ceil(modalData.length / modalItemsPerPage);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getDashboardReportsDaily();

        if (response?.data && Array.isArray(response.data)) {
          setReportsData(response.data);
        } else {
          setReportsData([]);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
        toast.error('Failed to load reports data');
        setReportsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    // FIXED: Process user growth data based on your actual API response
    console.log('🔄 Fetching user growth data...');
    const fetchUserGrowth = async () => {
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
            setUserGrowthData({
              userGrowth: userGrowthResponse.data.userGrowth,
              dateRange: userGrowthResponse.data.dateRange || { start: startDate.toISOString().split('T')[0], end: endDate.toISOString().split('T')[0] },
              interval: userGrowthResponse.data.interval || 'day'
            });
          } else {
            console.warn('⚠️ User growth data is empty array:', userGrowthResponse.data.userGrowth);
            setUserGrowthData(null);
          }
        } else {
          console.warn('⚠️ No userGrowth property in response:', userGrowthResponse);
          setUserGrowthData(null);
        }
      } catch (growthErr) {
        console.error('❌ User growth error:', growthErr.message);
        toast.error('Failed to load user growth data');
        setUserGrowthData(null);
      }
    };

    fetchUserGrowth();
  }, []);

  // Check for URL params to restore modal state on refresh
  useEffect(() => {
    const reportType = readQuery('reportType');
    const reportDate = readQuery('reportDate');
    if (reportType && reportDate && reportsData.length > 0) {
      // Find the report for the date
      const report = reportsData.find(r => r.date === reportDate);
      if (report) {
        handleValueClick(reportType, report[reportType], reportDate);
      }
    }
  }, [reportsData]);

  // Handle clicking on table values to open modal with details
  const handleValueClick = async (type, count, date) => {
    if (!count || count === 0 || count === '0') return;

    setModalType(type);
    setModalTitle(`${type.charAt(0).toUpperCase() + type.slice(1)} Details - ${new Date(date).toLocaleDateString()}`);

    try {
      let response;
      switch (type) {
        case 'users':
          response = await adminApi.getUsersReportsDaily({ date });
          break;
        case 'deposits':
          response = await adminApi.getTransactionReportsDaily({ date, type: 'deposit' });
          break;
        case 'withdrawals':
          response = await adminApi.getTransactionReportsDaily({ date, type: 'withdrawal' });
          break;
        case 'posts':
          response = await adminApi.getPostReportDaily({ date });
          break;
        case 'affiliateBonuses':
          response = await adminApi.getAffiliateReportDaily({ date });
          break;
        default:
          console.error(`Unknown type: ${type}`);
          return;
      }

      // Standardized response handling
      let data = [];
      if (response?.data) {
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data[type] && Array.isArray(response.data[type])) {
          data = response.data[type];
        } else if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (typeof response.data === 'object') {
          data = [response.data];
        }
      }

      setModalData(data);
      setModalCurrentPage(1);
      setModalOpen(true);
      setQuery('reportType', type);
      setQuery('reportDate', date);

    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      toast.error(`Failed to load ${type} data`);
      setModalData([]);
      setModalOpen(true);
    }
  };

  // Handle clicking on summary item to open full info modal
  const handleSummaryClick = (item, type) => {
    setSecondModalData(item);
    setSecondModalTitle(`${type.charAt(0).toUpperCase() + type.slice(1)} Full Details`);
    setSecondModalOpen(true);
  };

  // Render clickable value
  const renderClickableValue = (type, value, date) => {
    const numValue = Number(value) || 0;
    const displayValue = numValue.toLocaleString();

    if (numValue > 0) {
      return (
        <button
          onClick={() => handleValueClick(type, numValue, date)}
          className="text-blue-500 hover:text-blue-300 hover:underline font-medium cursor-pointer transition-colors"
          aria-label={`View ${type} details for ${new Date(date).toLocaleDateString()}`}
        >
          {displayValue}
        </button>
      );
    } else {
      return (
        <span className="text-[var(--color-text-primary)] cursor-default">
          {displayValue}
        </span>
      );
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-800 to-purple-300 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Reports
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Daily reports overview
          </p>
        </div>


        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
              <p className="text-[var(--color-text-secondary)]">Loading reports data...</p>
            </div>
          </div>
        )}

        {/* Reports Table */}
        {!loading && (
          <div className="bg-gradient-to-br from-gray-900 to-purple-200 rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Daily Reports
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Deposits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Withdrawals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Posts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                      Affiliate Bonuses
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {reportsData.length > 0 ? (
                    reportsData.map((report, index) => (
                      <tr key={report.date || index} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                          {report.date ? new Date(report.date).toLocaleDateString('en-US', { timeZone: 'UTC' }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                          {renderClickableValue('users', report.users, report.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                          {renderClickableValue('deposits', report.deposits, report.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                          {renderClickableValue('withdrawals', report.withdrawals, report.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                          {renderClickableValue('posts', report.posts, report.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                          {renderClickableValue('affiliateBonuses', report.affiliateBonuses, report.date)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center text-[var(--color-text-secondary)]">
                        No reports data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Details Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setQuery('reportType', null);
            setQuery('reportDate', null);
          }}
          title={modalTitle}
          size="xl"
        >
          <div className="max-h-96 overflow-y-auto">
            {modalData.length > 0 ? (
              <div className="space-y-3">
                {paginatedModalData.map((item, index) => (
                  <div key={item._id || item.id || item.userId || `${modalType}-${index}`} className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg">
                    {modalType === 'posts' ? (
                      // Special rendering for posts
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          {item.user?.userAvatar && (
                            <img src={item.user.userAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                          )}
                          <div>
                            <div className="text-[var(--color-text-primary)] font-semibold">{item.user?.username || 'Unknown'}</div>
                            <div className="text-[var(--color-text-secondary)] text-sm">{item.user?.badge || ''}</div>
                          </div>
                        </div>
                        <div className="text-[var(--color-text-primary)] whitespace-pre-line line-clamp-3">{item.content}</div>
                        {item.media && item.media.length > 0 && (
                          <div className="rounded-lg overflow-hidden bg-[var(--color-bg-primary)] flex items-center justify-center h-32">
                            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                              {item.media.length === 1 ? (
                                <img src={item.media[0].url || item.media[0]} alt="post media" className="object-contain max-h-full max-w-full" />
                              ) : (
                                <div className="grid grid-cols-2 gap-2 p-2 w-full h-full overflow-auto">
                                  {item.media.map((m, i) => (
                                    <img key={i} src={m.url || m} alt={`post media ${i + 1}`} className="object-cover w-full h-16 rounded" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] border-t border-b border-[var(--color-bg-primary)] py-2">
                          <span>Status: {item.status}</span>
                          <span>Approved: {item.approved ? 'Yes' : 'No'}</span>
                          <span>Created: {new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => handleSummaryClick(item, modalType)}
                          className="text-blue-500 hover:text-blue-300 text-sm font-medium"
                        >
                          View Full Details
                        </button>
                      </div>
                    ) : (
                      // Default key-value rendering for other types with summary
                      <div className="space-y-2 cursor-pointer" onClick={() => handleSummaryClick(item, modalType)}>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {/* Show ID and Balance as summary */}
                          <div>
                            <span className="font-medium text-[var(--color-text-secondary)]">ID:</span>
                            <span className="ml-2 text-[var(--color-text-primary)]">
                              {item._id || item.id || item.userId || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-[var(--color-text-secondary)]">Balance:</span>
                            <span className="ml-2 text-[var(--color-text-primary)]">
                              {item.balance || item.amount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Modal Pagination */}
                {modalTotalPages > 1 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-bg-tertiary)] flex justify-between items-center">
                    <button
                      disabled={modalCurrentPage <= 1}
                      onClick={() => setModalCurrentPage((p) => p - 1)}
                      className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-[var(--color-text-primary)]">
                      Page {modalCurrentPage} of {modalTotalPages}
                    </span>
                    <button
                      disabled={modalCurrentPage >= modalTotalPages}
                      onClick={() => setModalCurrentPage((p) => p + 1)}
                      className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                No details available
              </div>
            )}
          </div>
        </Modal>

        {/* Second Modal for Full Info */}
        <Modal
          isOpen={secondModalOpen}
          onClose={() => setSecondModalOpen(false)}
          title={secondModalTitle}
          size="xl"
        >
          <div className="max-h-96 overflow-y-auto">
            {secondModalData && (
              <div className="space-y-4">
                {modalType === 'posts' ? (
                  // Full rendering for posts
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {secondModalData.user?.userAvatar && (
                        <img src={secondModalData.user.userAvatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                      )}
                      <div>
                        <div className="text-[var(--color-text-primary)] font-semibold text-lg">{secondModalData.user?.username || 'Unknown'}</div>
                        <div className="text-[var(--color-text-secondary)]">{secondModalData.user?.badge || ''}</div>
                      </div>
                    </div>
                    <div className="text-[var(--color-text-primary)] whitespace-pre-line">{secondModalData.content}</div>
                    {secondModalData.media && secondModalData.media.length > 0 && (
                      <div className="rounded-lg overflow-hidden bg-[var(--color-bg-primary)] flex items-center justify-center h-64">
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                          {secondModalData.media.length === 1 ? (
                            <img src={secondModalData.media[0].url || secondModalData.media[0]} alt="post media" className="object-contain max-h-full max-w-full" />
                          ) : (
                            <div className="grid grid-cols-2 gap-2 p-2 w-full h-full overflow-auto">
                              {secondModalData.media.map((m, i) => (
                                <img key={i} src={m.url || m} alt={`post media ${i + 1}`} className="object-cover w-full h-24 rounded" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm text-[var(--color-text-secondary)] border-t border-b border-[var(--color-bg-primary)] py-4">
                      <span>Status: {secondModalData.status}</span>
                      <span>Approved: {secondModalData.approved ? 'Yes' : 'No'}</span>
                      <span>Created: {new Date(secondModalData.createdAt).toLocaleString()}</span>
                      <span>Updated: {new Date(secondModalData.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  // Full key-value rendering for other types
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {Object.entries(secondModalData)
                      .filter(([key]) => !['transactionHash', '__v'].includes(key))
                      .map(([key, value]) => (
                      <div key={key} className="bg-[var(--color-bg-tertiary)] p-3 rounded">
                        <span className="font-medium text-[var(--color-text-secondary)] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <div className="mt-1 text-[var(--color-text-primary)] break-words">
                          {typeof value === 'number' ? value.toLocaleString() :
                           typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                           Array.isArray(value) ? value.join(', ') :
                           typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) :
                           String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Reports;