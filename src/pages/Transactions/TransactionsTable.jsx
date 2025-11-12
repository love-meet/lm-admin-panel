import React from 'react';
import { FiEye } from 'react-icons/fi';

const TransactionsTable = ({ filtered, setSelected, formatCurrency, formatDate }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-gray-800 backdrop-blur-sm">
            <tr>
              {['ID', 'User', 'Amount', 'Type', 'Status', 'Date', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-[var(--color-bg-tertiary)]">
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelected(t)}
              >
                <td className="px-6 py-3 text-sm font-medium">{t.id}</td>
                <td className="px-6 py-3 text-sm">{t.user}</td>
                <td className="px-6 py-3 text-sm font-medium">{formatCurrency(t.amount)}</td>
                <td className="px-6 py-3 text-sm">{t.type}</td>
                <td className="px-6 py-3 text-sm">{t.status}</td>
                <td className="px-6 py-3 text-sm">{formatDate(t.date)}</td>
                <td className="px-6 py-3 text-right text-sm">
                  <button
                    className="p-2 text-blue-500 hover:text-blue-400 rounded-full hover:bg-blue-500/20 transition-all duration-300 transform hover:scale-110"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;