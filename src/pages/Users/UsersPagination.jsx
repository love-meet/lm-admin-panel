import React from 'react';

const UsersPagination = ({ currentPage, setCurrentPage, totalPages }) => {
  if (totalPages <= 1) return null;

  return (
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
  );
};

export default UsersPagination;