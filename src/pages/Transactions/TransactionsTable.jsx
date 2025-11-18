import React from 'react';
import { FiEye, FiUser, FiDollarSign } from 'react-icons/fi';

const TransactionsTable = ({ filtered, setSelected, formatCurrency, formatDate }) => {
  const handleViewClick = (e, transaction) => {
    e.stopPropagation();
    setSelected(transaction);
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const configs = {
      completed: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30',
      pending: 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30',
      failed: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30',
      refunded: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
    };
    return configs[statusLower] || 'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/30';
  };

  const getTypeBadge = (type) => {
    const typeLower = type?.toLowerCase();
    const configs = {
      deposit: 'bg-emerald-500/10 text-emerald-400',
      withdrawal: 'bg-rose-500/10 text-rose-400',
      subscription: 'bg-violet-500/10 text-violet-400',
      refund: 'bg-blue-500/10 text-blue-400',
      purchase: 'bg-purple-500/10 text-purple-400'
    };
    return configs[typeLower] || 'bg-gray-500/10 text-gray-400';
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead className="bg-gradient-to-r from-gray-800/80 to-gray-800/60">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  User
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" />
                  Amount
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {filtered && filtered.length > 0 ? (
              filtered.map((t, idx) => (
                <tr
                  key={t.id || idx}
                  className="bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-200 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-white font-medium">
                      {t.id?.substring(0, 8)}...{t.id?.substring(t.id.length - 4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-violet-500/30">
                        {t.user?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{t.user || 'Unknown User'}</div>
                        <div className="text-xs text-gray-400">@{t.username || t.user?.toLowerCase().replace(/\s+/g, '')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-base font-bold ${
                      t.type?.toLowerCase() === 'deposit' || t.type?.toLowerCase() === 'refund'
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}>
                      {t.type?.toLowerCase() === 'deposit' || t.type?.toLowerCase() === 'refund' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getTypeBadge(t.type)}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusBadge(t.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        t.status?.toLowerCase() === 'completed' ? 'bg-emerald-400' :
                        t.status?.toLowerCase() === 'pending' ? 'bg-amber-400' :
                        t.status?.toLowerCase() === 'failed' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`}></span>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formatDate(t.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => handleViewClick(e, t)}
                      className="inline-flex items-center gap-2 p-2.5 text-violet-400 hover:text-violet-300 rounded-xl hover:bg-violet-500/20 transition-all duration-300 transform hover:scale-110 group-hover:ring-2 ring-violet-500/30"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                      <FiDollarSign className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-medium">No transactions found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Stats */}
      {filtered && filtered.length > 0 && (
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-800/40 px-6 py-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Showing <span className="font-semibold text-white">{filtered.length}</span> transactions
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-gray-400">
                  {filtered.filter(t => t.status?.toLowerCase() === 'completed').length} Completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-gray-400">
                  {filtered.filter(t => t.status?.toLowerCase() === 'pending').length} Pending
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-gray-400">
                  {filtered.filter(t => t.status?.toLowerCase() === 'failed').length} Failed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;