import React, { useMemo, useState, useEffect } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';
import { FiSearch, FiEye } from 'react-icons/fi';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const loadTransactions = async (page = 1) => {
    try {
      const res = await adminApi.getTransactions({ page, perPage: itemsPerPage });
      console.log('[transactions] response', res);

      let list = res?.data ?? res?.data?.data ?? res ?? [];
      if (!Array.isArray(list)) list = [];

      const mapped = list.map((t) => ({
        id: t._id || t.id || t.transactionId || '',
        user: t.user || t.username || t.email || '',
        amount: Number(t.transactionAmount ?? t.balance ?? t.amount ?? 0),
        type: t.type || '',
        status: t.status || '',
        date: t.date || t.createdAt || '',
        details: t.name || t.details || '',
      }));

      setTransactions(mapped);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (e) {
      console.error('[transactions] load error', e);
      toast.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    loadTransactions(currentPage);
  }, [currentPage]);

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const formatDate = (s) => new Date(s).toLocaleString();

  const filtered = useMemo(() => {
    let data = transactions;
    if (typeFilter !== 'all') data = data.filter((t) => t.type === typeFilter);
    const q = search.toLowerCase();
    if (q) {
      data = data.filter((t) =>
        [t.id, t.user, t.type, t.status].some((v) =>
          String(v).toLowerCase().includes(q)
        )
      );
    }
    return data;
  }, [transactions, search, typeFilter]);

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions"
            className="px-3 py-2 border rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] w-full md:w-96"
          />
          <div className="flex gap-2">
            {['all', 'deposit', 'withdrawal'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  typeFilter === t
                    ? 'bg-blue-500 text-white'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                }`}
              >
                {t === 'all' ? 'All' : t === 'deposit' ? 'Incoming' : 'Outgoing'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
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

          {/* Pagination */}
          <div className="px-6 py-3 flex justify-between items-center border-t border-[var(--color-bg-tertiary)]">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--color-text-primary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
