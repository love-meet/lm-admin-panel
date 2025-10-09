import React, { useMemo, useState, useEffect } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';
import { FiSearch, FiEye } from 'react-icons/fi';

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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'deposit', 'withdrawal'
  const itemsPerPage = 10;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getTransactions();
        console.log('[transactions] getTransactions raw', res);
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        // map server transaction objects to UI shape
        const mapped = list.map((t) => ({
          id: t._id || t.id || t.transactionId || t.txnId || t.reference || '',
          user: t.user || t.username || t.email || t.userId || (t.userObj && (t.userObj.username || t.userObj.email)) || '',
          amount: Number(t.transactionAmount ?? t.balance ?? t.amount ?? t.value ?? 0),
          type: t.type || (t.transactionType || ''),
          status: t.status || t.state || '',
          date: t.date || t.createdAt || t.timestamp || t.createdAtString || '',
          details: t.name || t.details || t.description || '',
          raw: t,
        }));
        if (mapped.length) setTransactions(mapped);

        // Check for URL param to restore modal state
        const transactionId = readQuery('transaction');
        if (transactionId) {
          const transaction = mapped.find(t => t.id === transactionId);
          if (transaction) {
            setSelected(transaction);
          }
        }
      } catch (e) {
        console.error('[transactions] load error', e);
      }
    };
    load();
  }, []);

  const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  const formatDate = (s) => new Date(s).toLocaleString();

  const filtered = useMemo(() => {
    let data = transactions;
    // Filter by type
    if (typeFilter !== 'all') {
      data = data.filter((t) => t.type === typeFilter);
    }
    // Filter by search
    const q = search.toLowerCase();
    if (q) {
      data = data.filter((t) =>
        [t.id, t.user, t.type, t.status].some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return data;
  }, [transactions, search, typeFilter]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Transactions</h2>
          <p className="text-[var(--color-text-secondary)]">Monitor and review financial transactions.</p>
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-[var(--color-text-muted)]" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, user, type, or status"
                className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  typeFilter === 'all'
                    ? 'bg-[var(--color-primary-cyan)] text-white'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('deposit')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  typeFilter === 'deposit'
                    ? 'bg-green-500 text-white'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                }`}
              >
                Incoming
              </button>
              <button
                onClick={() => setTypeFilter('withdrawal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  typeFilter === 'withdrawal'
                    ? 'bg-red-500 text-white'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]'
                }`}
              >
                Outgoing
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
              <thead className="bg-[var(--color-bg-tertiary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
                {paginatedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer" onClick={() => setSelected(t)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{t.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{t.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{formatCurrency(t.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{t.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">{t.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{formatDate(t.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(t); setQuery('transaction', t.id); }}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        title="View"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[var(--color-text-secondary)]">No transactions match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-[var(--color-bg-secondary)] border-t border-[var(--color-bg-tertiary)] flex items-center justify-between">
              <div className="text-sm text-[var(--color-text-secondary)]">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg-primary)]"
                >
                  Previous
                </button>
                <span className="text-sm text-[var(--color-text-primary)]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg-primary)]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-xl w-full max-w-lg">
              <div className="px-6 py-4 border-b border-[var(--color-bg-tertiary)] flex justify-between items-center">
                <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Transaction Details</h3>
                <button onClick={() => { setSelected(null); setQuery('transaction', null); }} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">✕</button>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">ID</span><span className="text-[var(--color-text-primary)]">{selected.id}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">User</span><span className="text-[var(--color-text-primary)]">{selected.user}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Amount</span><span className="text-[var(--color-text-primary)]">{formatCurrency(selected.amount)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Type</span><span className="text-[var(--color-text-primary)]">{selected.type}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Status</span><span className="text-[var(--color-text-primary)]">{selected.status}</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Date</span><span className="text-[var(--color-text-primary)]">{formatDate(selected.date)}</span></div>
                <div><span className="text-[var(--color-text-secondary)]">Details</span><p className="text-[var(--color-text-primary)] mt-1">{selected.details}</p></div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--color-bg-tertiary)] flex justify-end">
                <div className="flex items-center gap-3">
                  {selected?.status?.toLowerCase() === 'completed' && (
                    <button
                      onClick={async () => {
                        if (!window.confirm('Issue refund for this transaction?')) return;
                        try {
                          const resp = await adminApi.refundTransaction(selected.id || selected._id || selected.transactionId);
                          console.log('[transactions] refund response', resp);
                          toast.success('Refund issued');
                          // optimistic update: mark as refunded
                          setTransactions((prev) => prev.map((t) => (t.id === selected.id ? { ...t, status: 'Refunded' } : t)));
                          setSelected(null);
                        } catch (e) {
                          console.error('[transactions] refund error', e);
                          toast.error('Failed to issue refund');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                      Refund
                    </button>
                  )}
                  <button onClick={() => { setSelected(null); setQuery('transaction', null); }} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
