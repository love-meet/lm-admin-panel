import React from 'react';

const TransactionsFilters = ({ search, setSearch, typeFilter, setTypeFilter }) => {
  return (
    <div className="bg-gray-800 backdrop-blur-xl rounded-xl shadow-lg p-6 mb-6 border border-white/20 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions"
            className="w-full px-4 py-2 bg-gray-800 backdrop-blur-sm border border-white/20 rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'deposit', 'withdrawal'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                typeFilter === t
                  ? 'bg-white/20 text-white shadow-lg transform hover:scale-105'
                  : 'bg-white/5 text-[var(--color-text-primary)] hover:bg-white/10 border border-white/20'
              }`}
            >
              {t === 'all' ? 'All' : t === 'deposit' ? 'Incoming' : 'Outgoing'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilters;