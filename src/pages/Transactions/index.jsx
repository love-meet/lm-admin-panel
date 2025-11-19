import React from 'react';
import TransactionsFilters from './TransactionsFilters';
import TransactionsTable from './TransactionsTable';
import TransactionsPagination from './TransactionsPagination';
import TransactionModal from './TransactionModal'; // Add this import
import TransactionSettings from './TransactionSettings';
import useTransactionsData from './useTransactionsData';

const Transactions = () => {
  const {
    loading,
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
        <TransactionSettings />
        <div className="mt-6"></div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-[var(--color-text-secondary)]">Loading transactions...</p>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Add the TransactionModal here */}
      <TransactionModal
        selectedTransaction={selected}
        setSelectedTransaction={setSelected}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Transactions;