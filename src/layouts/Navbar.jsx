import React, { useEffect, useRef, useState } from 'react';
import { FiBell, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { notifications, notificationsList, userEmail, logout, admin } = useAuth();
  const [bellOpen, setBellOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
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

  // Close user dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isDropdownOpen]);

  // avatar fallback handling: try public screenshot, then placeholder
  const avatarCandidates = ['/Screenshot 2025-09-25 151345.png', 'https://via.placeholder.com/40'];
  const [avatarIdx, setAvatarIdx] = useState(0);

  return (
    <nav className="fixed top-0 left-64 right-0 h-16 bg-gray-800 px-4 border-b border-gray-700 flex justify-between items-center z-50 overflow-x-auto overflow-y-hidden">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-700 text-[var(--color-text-primary)] rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-cyan)]"
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
                        <span className="ml-3 inline-flex items-center justify-center text-xs text-white bg-gray-700 rounded-full px-2 py-0.5">
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
        <div className="relative user-dropdown">
          <button onClick={toggleDropdown} className="flex items-center space-x-3 focus:outline-none">
            <img
              src={avatarCandidates[avatarIdx]}
              alt="Admin"
              className="h-10 w-10 rounded-full object-cover border-0 ring-0"
              onError={() => setAvatarIdx((i) => (i + 1 < avatarCandidates.length ? i + 1 : i))}
            />
            <span
              className="text-sm text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text-primary)]"
              onClick={() => setProfileModal(true)}
            >
              {userEmail || 'Admin'}
            </span>
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

      {/* Profile Modal */}
      <Modal
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
        title="My Profile"
        size="md"
      >
        {admin && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Admin ID:</span>
                    <p className="text-sm text-[var(--color-text-primary)] font-mono">{admin._id || admin.id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Username:</span>
                    <p className="text-sm text-[var(--color-text-primary)]">{admin.username || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Email:</span>
                    <p className="text-sm text-[var(--color-text-primary)]">{admin.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Role:</span>
                    <p className="text-sm text-[var(--color-text-primary)]">{admin.role === 'super_admin' ? 'Super Admin' : admin.role === 'admin' ? 'Admin' : admin.role || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Status:</span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Permissions</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {admin.permissions && admin.permissions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {admin.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-[var(--color-text-primary)] capitalize">
                            {permission.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--color-text-secondary)]">No specific permissions assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* anchored dropdown rendered above */}
    </nav>
  );
};

export default Navbar;