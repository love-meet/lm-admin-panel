import React, { useState } from 'react';
import { FiX, FiDollarSign, FiUser, FiCalendar, FiCreditCard, FiCheckCircle, FiXCircle, FiClock, FiHash, FiCopy } from 'react-icons/fi';
import { toast } from 'sonner';

const TransactionModal = ({ selectedTransaction, setSelectedTransaction, setQuery, formatCurrency, formatDate }) => {
  if (!selectedTransaction) return null;

  const closeModal = () => {
    setSelectedTransaction(null);
    if (setQuery) setQuery('transaction', null);
  };

  const copyToClipboard = async (text, label) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      toast.success(`${label} copied to clipboard`);
    } catch (e) {
      console.error('copy failed', e);
      toast.error('Failed to copy');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        icon: FiCheckCircle,
        gradient: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        label: 'Completed'
      },
      pending: {
        icon: FiClock,
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-500/20',
        text: 'text-amber-400',
        label: 'Pending'
      },
      failed: {
        icon: FiXCircle,
        gradient: 'from-red-500 to-rose-500',
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        label: 'Failed'
      },
      refunded: {
        icon: FiCheckCircle,
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        label: 'Refunded'
      }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getTypeConfig = (type) => {
    const configs = {
      deposit: {
        icon: '💰',
        color: 'text-emerald-400',
        label: 'Deposit'
      },
      withdrawal: {
        icon: '💸',
        color: 'text-rose-400',
        label: 'Withdrawal'
      },
      subscription: {
        icon: '⭐',
        color: 'text-violet-400',
        label: 'Subscription'
      },
      refund: {
        icon: '🔄',
        color: 'text-blue-400',
        label: 'Refund'
      },
      purchase: {
        icon: '🛒',
        color: 'text-purple-400',
        label: 'Purchase'
      }
    };
    return configs[type?.toLowerCase()] || { icon: '💳', color: 'text-gray-400', label: type };
  };

  const statusConfig = getStatusConfig(selectedTransaction.status);
  const typeConfig = getTypeConfig(selectedTransaction.type);
  const StatusIcon = statusConfig.icon;

  // Generate username from user name if not available
  const username = selectedTransaction.username || 
                   selectedTransaction.user?.toLowerCase().replace(/\s+/g, '') || 
                   'unknown_user';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-700/50 bg-gradient-to-r from-violet-600/10 to-purple-600/10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center`}>
              <StatusIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
              <p className="text-xs text-gray-400">ID: {selectedTransaction.id?.substring(0, 16)}...</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white rounded-xl p-2 hover:bg-gray-800 transition-all duration-200 transform hover:scale-110 hover:rotate-90"
            aria-label="Close transaction modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-5 custom-scrollbar">
          {/* Transaction Overview */}
          <div className="bg-gradient-to-br from-violet-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{typeConfig.icon}</span>
                  <div>
                    <p className="text-sm text-gray-400">Transaction Amount</p>
                    <p className={`text-4xl font-bold bg-gradient-to-r ${
                      selectedTransaction.type?.toLowerCase() === 'deposit' || selectedTransaction.type?.toLowerCase() === 'refund'
                        ? 'from-emerald-400 to-teal-400' 
                        : 'from-rose-400 to-pink-400'
                    } bg-clip-text text-transparent`}>
                      {selectedTransaction.type?.toLowerCase() === 'deposit' || selectedTransaction.type?.toLowerCase() === 'refund' ? '+' : '-'}
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.bg} ${statusConfig.text} font-semibold`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.label}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-200">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <FiHash className="w-3.5 h-3.5" />
                <span>Transaction ID</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-mono text-white truncate">
                  {selectedTransaction.id?.substring(0, 8)}...{selectedTransaction.id?.substring(selectedTransaction.id.length - 4)}
                </div>
                <button 
                  onClick={() => copyToClipboard(selectedTransaction.id, 'Transaction ID')} 
                  className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
                >
                  <FiCopy className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-200">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <FiCreditCard className="w-3.5 h-3.5" />
                <span>Type</span>
              </div>
              <div className={`text-sm font-semibold ${typeConfig.color}`}>
                {typeConfig.label}
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-200">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <FiCalendar className="w-3.5 h-3.5" />
                <span>Date</span>
              </div>
              <div className="text-sm font-semibold text-white">
                {formatDate(selectedTransaction.date)}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-violet-400" />
              User Information
            </h3>
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">User</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg ring-2 ring-violet-500/30">
                    {selectedTransaction.user?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{selectedTransaction.user || 'Unknown User'}</div>
                    <div className="text-sm text-gray-400">@{username}</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">User ID</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white font-mono text-sm">
                    {selectedTransaction.userId || selectedTransaction.id?.substring(0, 16)}
                  </div>
                  {selectedTransaction.userId && (
                    <button 
                      onClick={() => copyToClipboard(selectedTransaction.userId, 'User ID')} 
                      className="p-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors"
                    >
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-violet-400" />
              Transaction Details
            </h3>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Amount</label>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(selectedTransaction.amount)}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Transaction Type</label>
                  <div className={`text-white font-medium flex items-center gap-2`}>
                    <span className="text-2xl">{typeConfig.icon}</span>
                    <span>{typeConfig.label}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Status</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.text} font-semibold`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Payment Method</label>
                  <div className="text-white">{selectedTransaction.paymentMethod || 'Not specified'}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Reference Number</label>
                  <div className="flex items-center gap-2">
                    <div className="text-white font-mono text-sm">{selectedTransaction.reference || selectedTransaction.id?.substring(0, 16)}</div>
                    <button 
                      onClick={() => copyToClipboard(selectedTransaction.reference || selectedTransaction.id, 'Reference')} 
                      className="p-1 rounded hover:bg-gray-700 transition-colors"
                    >
                      <FiCopy className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Description</label>
                  <div className="text-white text-sm">{selectedTransaction.description || 'No description available'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(selectedTransaction.notes || selectedTransaction.metadata) && (
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Additional Information</h3>
              <div className="space-y-3">
                {selectedTransaction.notes && (
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Notes</label>
                    <div className="text-white whitespace-pre-wrap">{selectedTransaction.notes}</div>
                  </div>
                )}
                {selectedTransaction.metadata && (
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Metadata</label>
                    <pre className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(selectedTransaction.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4">Timestamps</h3>
            <div className="grid lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Transaction Date</label>
                <div className="text-white text-sm">
                  {selectedTransaction.date ? new Date(selectedTransaction.date).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }) : 'Not available'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Created At</label>
                <div className="text-white text-sm">
                  {selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }) : 'Not available'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Updated At</label>
                <div className="text-white text-sm">
                  {selectedTransaction.updatedAt ? new Date(selectedTransaction.updatedAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }) : 'Not available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50 flex justify-end gap-3 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <button
            onClick={closeModal}
            className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-xl hover:bg-gray-800 transition-all duration-200 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default TransactionModal;