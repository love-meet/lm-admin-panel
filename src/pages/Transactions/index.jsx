import React from 'react';
import TransactionsFilters from './TransactionsFilters';
import TransactionsTable from './TransactionsTable';
import TransactionsPagination from './TransactionsPagination';
import useTransactionsData from './useTransactionsData';

const Transactions = () => {
  const {
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
    formatDate
  } = useTransactionsData();

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-800 to-purple-300 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <TransactionsFilters
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
        <TransactionsTable
          filtered={filtered}
          setSelected={setSelected}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
        <TransactionsPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Transactions;