import React, { useState } from 'react';
import adminApi from '../../api/admin';

const TransactionSettings = () => {
  const [loading, setLoading] = useState({});
  const [messages, setMessages] = useState({});

  const handleAction = async (action, apiCall) => {
    setLoading(prev => ({ ...prev, [action]: true }));
    setMessages(prev => ({ ...prev, [action]: '' }));
    try {
      await apiCall();
      setMessages(prev => ({ ...prev, [action]: 'Success!' }));
    } catch (err) {
      console.error(`Error in ${action}:`, err);
      setMessages(prev => ({ ...prev, [action]: 'Error: ' + (err?.response?.data?.message || err?.message || 'Unknown error') }));
    } finally {
      setLoading(prev => ({ ...prev, [action]: false }));
    }
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Transaction Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Withdrawals</h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleAction('disableWithdrawals', adminApi.disableWithdrawals)}
              disabled={loading.disableWithdrawals}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
            >
              {loading.disableWithdrawals ? 'Disabling...' : 'Disable Withdrawals'}
            </button>
            <button
              onClick={() => handleAction('enableWithdrawals', adminApi.enableWithdrawals)}
              disabled={loading.enableWithdrawals}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
            >
              {loading.enableWithdrawals ? 'Enabling...' : 'Enable Withdrawals'}
            </button>
          </div>
          {messages.disableWithdrawals && <p className="text-sm text-red-400">{messages.disableWithdrawals}</p>}
          {messages.enableWithdrawals && <p className="text-sm text-green-400">{messages.enableWithdrawals}</p>}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Tips</h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleAction('disableTips', adminApi.disableTips)}
              disabled={loading.disableTips}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
            >
              {loading.disableTips ? 'Disabling...' : 'Disable Tips'}
            </button>
            <button
              onClick={() => handleAction('enableTips', adminApi.enableTips)}
              disabled={loading.enableTips}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
            >
              {loading.enableTips ? 'Enabling...' : 'Enable Tips'}
            </button>
          </div>
          {messages.disableTips && <p className="text-sm text-red-400">{messages.disableTips}</p>}
          {messages.enableTips && <p className="text-sm text-green-400">{messages.enableTips}</p>}
        </div>
      </div>
    </div>
  );
};

export default TransactionSettings;