import React from 'react';
import { FiSearch } from 'react-icons/fi';

const PostsFilters = ({ searchTerm, setSearchTerm, filter, setFilter, sortBy, setSortBy }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/10 transition-all duration-500 hover:border-blue-500/30 hover:shadow-blue-500/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 dark:text-gray-500 animate-pulse" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/10 shadow-inner"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-white/10 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:from-gray-700/80 hover:to-gray-600/80 hover:shadow-inner cursor-pointer"
          >
            <option value="all" className="bg-gray-900 text-gray-100">All Posts</option>
            <option value="reported" className="bg-gray-900 text-gray-100">Reported</option>
            <option value="withMedia" className="bg-gray-900 text-gray-100">With Media</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-white/10 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:from-gray-700/80 hover:to-gray-600/80 hover:shadow-inner cursor-pointer"
          >
            <option value="newest" className="bg-gray-900 text-gray-100">Sort by Newest</option>
            <option value="oldest" className="bg-gray-900 text-gray-100">Sort by Oldest</option>
            <option value="mostLiked" className="bg-gray-900 text-gray-100">Most Liked</option>
            <option value="mostCommented" className="bg-gray-900 text-gray-100">Most Commented</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PostsFilters;
