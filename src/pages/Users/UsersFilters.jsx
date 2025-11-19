import React from 'react';

const UsersFilters = ({
  query,
  setQuery,
  sortBy,
  setSortBy,
  planFilter,
  setPlanFilter,
  verifiedFilter,
  setVerifiedFilter
}) => {
  const selectStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' 
      fill='none' viewBox='0 0 24 24' stroke='%23fff'%3E%3Cpath stroke-linecap='round' 
      stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundSize: '1.25rem',
    backgroundPosition: 'right 0.5rem center'
  };

  const baseSelectClass =
    "px-3 py-2 rounded-md border border-transparent bg-gray-800/50 dark:bg-gray-700/50 text-gray-200 " +
    "focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer appearance-none bg-no-repeat bg-right pr-8";

  return (
    <div className="relative bg-gray-900/95 rounded-lg p-4 border border-transparent">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {/* Search Input */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          aria-label="Search users"
          className="w-full sm:w-64 md:w-80 px-3 py-2 rounded-md border border-transparent bg-white/5 dark:bg-gray-800/50 
          text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] 
          focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort by"
          className={baseSelectClass}
          style={selectStyles}
        >
          <option value="newest" className="bg-gray-800 text-gray-200">Newest</option>
          <option value="oldest" className="bg-gray-800 text-gray-200">Oldest</option>
        </select>

        {/* Plan Filter Dropdown */}
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          aria-label="Filter by plan"
          className={baseSelectClass}
          style={selectStyles}
        >
          <option value="all" className="bg-gray-800 text-gray-200">All Plans</option>
          <option value="Free" className="bg-gray-800 text-gray-200">Free</option>
          <option value="Orbit" className="bg-gray-800 text-gray-200">Orbit</option>
          <option value="Starlight" className="bg-gray-800 text-gray-200">Starlight</option>
          <option value="Nova" className="bg-gray-800 text-gray-200">Nova</option>
          <option value="Equinox" className="bg-gray-800 text-gray-200">Equinox</option>
          <option value="Polaris" className="bg-gray-800 text-gray-200">Polaris</option>
          <option value="Orion" className="bg-gray-800 text-gray-200">Orion</option>
          <option value="Cosmos" className="bg-gray-800 text-gray-200">Cosmos</option>
        </select>

        {/* Status Filter Dropdown */}
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          aria-label="Filter by status"
          className={baseSelectClass}
          style={selectStyles}
        >
          <option value="all" className="bg-gray-800 text-gray-200">All Users</option>
          <option value="verified" className="bg-gray-800 text-gray-200">Verified</option>
          <option value="unverified" className="bg-gray-800 text-gray-200">Unverified</option>
          <option value="male" className="bg-gray-800 text-gray-200">Male</option>
          <option value="female" className="bg-gray-800 text-gray-200">Female</option>
        </select>
      </div>
    </div>
  );
};

export default UsersFilters;
