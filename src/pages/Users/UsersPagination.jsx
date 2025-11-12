import React from 'react';

const UsersPagination = ({ currentPage, setCurrentPage, totalPages }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-b-2xl p-4 border-t border-transparent hover:border-white/10 flex justify-between items-center">
      <button
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage((p) => Math.max(Number(p) - 1, 1))}
        className="px-3 py-1 rounded-md bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
        aria-label="Previous page"
      >
        Previous
      </button>

      <span className="text-sm text-[var(--color-text-primary)]">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage((p) => Math.min(Number(p) + 1, totalPages))}
        className="px-3 py-1 rounded-md bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default UsersPagination;