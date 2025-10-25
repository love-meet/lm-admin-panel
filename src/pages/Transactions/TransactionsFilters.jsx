import React from 'react';

const TransactionsFilters = ({ search, setSearch, typeFilter, setTypeFilter }) => {
  return (
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
  );
};

export default TransactionsFilters;