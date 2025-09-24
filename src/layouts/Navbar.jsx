import React, { useState } from 'react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login'; // Simple redirect for demonstration
  };

  return (
    <nav className="bg-[var(--color-bg-secondary)] p-4 shadow-lg flex justify-between items-center z-10">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-cyan)]"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          🔔
        </button>
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
            <img
              src="https://via.placeholder.com/40"
              alt="Admin"
              className="h-10 w-10 rounded-full object-cover border-2 border-[var(--color-primary-cyan)]"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-tertiary)] rounded-md shadow-lg py-1 z-20">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;