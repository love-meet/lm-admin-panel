import React from 'react';
import { FiEye } from 'react-icons/fi';

const TransactionsTable = ({ filtered, setSelected, formatCurrency, formatDate }) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
          <thead className="bg-[var(--color-bg-tertiary)]">
            <tr>
              {['ID', 'User', 'Amount', 'Type', 'Status', 'Date', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-[var(--color-bg-tertiary)] transition cursor-pointer"
                onClick={() => setSelected(t)}
              >
                <td className="px-6 py-3 text-sm">{t.id}</td>
                <td className="px-6 py-3 text-sm">{t.user}</td>
                <td className="px-6 py-3 text-sm">{formatCurrency(t.amount)}</td>
                <td className="px-6 py-3 text-sm">{t.type}</td>
                <td className="px-6 py-3 text-sm">{t.status}</td>
                <td className="px-6 py-3 text-sm">{formatDate(t.date)}</td>
                <td className="px-6 py-3 text-right text-sm">
                  <FiEye className="inline text-blue-500" />
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