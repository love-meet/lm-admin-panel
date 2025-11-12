import React from 'react';

const PostsPagination = ({ currentPage, setCurrentPage, totalPages }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-3 flex justify-between items-center border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <button
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 text-sm font-medium backdrop-blur-sm border border-white/10 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-sm text-[var(--color-text-primary)] px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 text-sm font-medium backdrop-blur-sm border border-white/10 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default PostsPagination;