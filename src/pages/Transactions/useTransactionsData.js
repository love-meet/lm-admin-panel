import { useMemo, useState, useEffect } from 'react';
import adminApi from '../../api/admin';
import { toast } from 'sonner';

const useTransactionsData = () => {
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
      setTotalPages(res?.pagination?.totalPages || Math.ceil(list.length / itemsPerPage) || 1);
    } catch (e) {
      console.error('Failed to fetch transactions:', e);
      toast.error('Failed to fetch transactions');
      setTransactions([]);
      setTotalPages(1);
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

  return {
    transactions,
    search,
    setSearch,
    selected,
    setSelected,
    currentPage,
    setCurrentPage,
    typeFilter,
    setTypeFilter,
    totalPages,
    filtered,
    formatCurrency,
    formatDate,
    loadTransactions
  };
};

export default useTransactionsData;