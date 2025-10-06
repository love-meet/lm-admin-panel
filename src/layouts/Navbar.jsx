import React, { useEffect, useRef, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { notifications, notificationsList, userEmail, logout } = useAuth();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleBellClick = () => {
    setBellOpen((prev) => !prev);
  };

  // Close bell dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    if (bellOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [bellOpen]);

  // avatar fallback handling: try public screenshot, then placeholder
  const avatarCandidates = ['/Screenshot 2025-09-25 151345.png', 'https://via.placeholder.com/40'];
  const [avatarIdx, setAvatarIdx] = useState(0);

  return (
    <nav className="fixed top-0 left-64 right-0 h-16 bg-[var(--color-bg-secondary)] px-4 border-b border-[var(--color-bg-tertiary)] flex justify-between items-center z-50 overflow-x-auto overflow-y-hidden">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-cyan)]"
        />
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative" ref={bellRef}>
          <button onClick={handleBellClick} className="relative text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer">
            <FiBell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-primary-cyan)] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                {notifications}
              </span>
            )}
          </button>
          {bellOpen && (
            <div className="fixed right-24 top-16 mt-2 w-72 bg-[var(--color-bg-tertiary)] rounded-lg shadow-xl z-[300] overflow-hidden">
              <div className="px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-bg-tertiary)]/60">
                Notifications
              </div>
              <ul className="py-1">
                {Array.isArray(notificationsList) && notificationsList.length > 0 ? (
                  notificationsList.map((n, idx) => (
                    <li key={idx}>
                      <Link
                        to={n.to}
                        className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[var(--color-bg-secondary)]"
                        onClick={() => setBellOpen(false)}
                      >
                        <span className="text-[var(--color-text-primary)]">{n.label}</span>
                        <span className="ml-3 inline-flex items-center justify-center text-xs text-white bg-[var(--color-primary-cyan)] rounded-full px-2 py-0.5">
                          {n.count}
                        </span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">No notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center space-x-3 focus:outline-none">
            <img
              src={avatarCandidates[avatarIdx]}
              alt="Admin"
              className="h-10 w-10 rounded-full object-cover border-0 ring-0"
              onError={() => setAvatarIdx((i) => (i + 1 < avatarCandidates.length ? i + 1 : i))}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">{userEmail || 'Admin'}</span>
          </button>
          {isDropdownOpen && (
            <div className="fixed right-4 top-16 mt-2 w-48 bg-[var(--color-bg-tertiary)] rounded-md shadow-lg py-1 z-[300]">
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
      {/* anchored dropdown rendered above */}
    </nav>
  );
};

export default Navbar;