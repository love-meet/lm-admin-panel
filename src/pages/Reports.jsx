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
  } catch (e) {}
};

const Reports = () => {
  const { hasPermission } = useAuth();
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userGrowthData, setUserGrowthData] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalItemsPerPage = 10;

  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [secondModalData, setSecondModalData] = useState(null);
  const [secondModalTitle, setSecondModalTitle] = useState('');

  const paginatedModalData = useMemo(() => {
    const startIndex = (modalCurrentPage - 1) * modalItemsPerPage;
    return modalData.slice(startIndex, startIndex + modalItemsPerPage);
  }, [modalData, modalCurrentPage]);

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
        toast.error('Failed to load reports');
        setReportsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        const now = new Date();
        const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30));

        const userGrowthResponse = await adminApi.getUserGrowth({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });

        if (userGrowthResponse?.data?.userGrowth?.length > 0) {
          setUserGrowthData({
            userGrowth: userGrowthResponse.data.userGrowth,
            dateRange: userGrowthResponse.data.dateRange,
            interval: userGrowthResponse.data.interval
          });
        } else {
          setUserGrowthData(null);
        }
      } catch (err) {
        toast.error('Failed to load user growth');
      }
    };

    fetchUserGrowth();
  }, []);

  useEffect(() => {
    const reportType = readQuery('reportType');
    const reportDate = readQuery('reportDate');

    if (reportType && reportDate && reportsData.length > 0) {
      const report = reportsData.find(r => r.date === reportDate);
      if (report) {
        handleValueClick(reportType, report[reportType], reportDate);
      }
    }
  }, [reportsData]);

  const handleValueClick = async (type, count, date) => {
    if (!count || count === 0) return;

    setModalType(type);
    setModalTitle(
      `${type.charAt(0).toUpperCase() + type.slice(1)} Details - ${new Date(
        date
      ).toLocaleDateString()}`
    );

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
          return;
      }

      let data = [];
      if (response?.data) {
        if (Array.isArray(response.data)) data = response.data;
        else if (response.data[type]) data = response.data[type];
        else if (response.data.data) data = response.data.data;
        else if (typeof response.data === 'object') data = [response.data];
      }

      setModalData(data);
      setModalCurrentPage(1);
      setModalOpen(true);

      setQuery('reportType', type);
      setQuery('reportDate', date);
    } catch (err) {
      toast.error(`Failed to load ${type} data`);
      setModalData([]);
      setModalOpen(true);
    }
  };

  const handleSummaryClick = (item, type) => {
    setSecondModalData(item);
    setSecondModalTitle(`${type.charAt(0).toUpperCase() + type.slice(1)} Full Details`);
    setSecondModalOpen(true);
  };

  const renderClickableValue = (type, value, date) => {
    const num = Number(value) || 0;
    const display = num.toLocaleString();

    if (num > 0) {
      return (
        <button
          onClick={() => handleValueClick(type, num, date)}
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-medium transition"
        >
          {display}
        </button>
      );
    }

    return <span className="text-gray-300">{display}</span>;
  };

  return (
    <div className="p-6 bg-[#0b0f19] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow">
            Reports
          </h1>
          <p className="text-gray-400 mt-1">
            Daily system activity overview
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-gray-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl shadow-xl border border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Daily Reports</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/50">
                  <tr>
                    {['Date','Users','Deposits','Withdrawals','Posts','Affiliate Bonuses'].map((th,i)=>(
                      <th key={i} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {reportsData.map((report, i) => (
                    <tr key={i} className="hover:bg-gray-800/40 transition">
                      <td className="px-6 py-4 text-sm text-white">
                        {new Date(report.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                      </td>
                      <td className="px-6 py-4 text-sm">{renderClickableValue('users', report.users, report.date)}</td>
                      <td className="px-6 py-4 text-sm">{renderClickableValue('deposits', report.deposits, report.date)}</td>
                      <td className="px-6 py-4 text-sm">{renderClickableValue('withdrawals', report.withdrawals, report.date)}</td>
                      <td className="px-6 py-4 text-sm">{renderClickableValue('posts', report.posts, report.date)}</td>
                      <td className="px-6 py-4 text-sm">{renderClickableValue('affiliateBonuses', report.affiliateBonuses, report.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MAIN MODAL */}
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
          <div className="max-h-[420px] overflow-y-auto p-2 space-y-4">
            {paginatedModalData.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/60 border border-gray-700 p-4 rounded-lg hover:bg-gray-800/80 transition cursor-pointer"
                onClick={() => handleSummaryClick(item, modalType)}
              >
                <pre className="text-gray-200 text-sm whitespace-pre-wrap">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}

            {modalTotalPages > 1 && (
              <div className="flex justify-between items-center py-4 border-t border-gray-700">
                <button
                  disabled={modalCurrentPage <= 1}
                  onClick={() => setModalCurrentPage(p => p - 1)}
                  className="bg-gray-700 text-white px-4 py-1 rounded disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-gray-300">
                  Page {modalCurrentPage} of {modalTotalPages}
                </span>

                <button
                  disabled={modalCurrentPage >= modalTotalPages}
                  onClick={() => setModalCurrentPage(p => p + 1)}
                  className="bg-gray-700 text-white px-4 py-1 rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </Modal>

        {/* SECOND MODAL */}
        <Modal
          isOpen={secondModalOpen}
          onClose={() => setSecondModalOpen(false)}
          title={secondModalTitle}
          size="xl"
        >
          <div className="max-h-[420px] overflow-y-auto p-3">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap">
              {JSON.stringify(secondModalData, null, 2)}
            </pre>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default Reports;
