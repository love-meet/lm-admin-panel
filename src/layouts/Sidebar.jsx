import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', permission: 'view_dashboard' },
  { name: 'Users', to: '/users', permission: 'users_view' },
  { name: 'Posts', to: '/posts', permission: 'view_post' },
  { name: 'Transactions', to: '/transactions', permission: 'transactions_view' },
  { name: 'Reports', to: '/reports', permission: 'reports_view' },
  { name: 'Support Tickets', to: '/tickets', permission: 'read_support_tickets' },
  { name: 'Admins', to: '/admins', permission: 'admin_create' },
  { name: 'Chat', to: '/chat' },
];

const Sidebar = () => {
  const { hasPermission } = useAuth();

  const filteredNavItems = navItems.filter(item =>
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-[var(--color-text-primary)] flex flex-col shadow-lg overflow-hidden z-30">
      <div className="h-16 flex items-center px-6 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
      <nav className="flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-2 py-4">
          {filteredNavItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block px-6 py-3 hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700 font-semibold text-[var(--color-primary-cyan)]' : ''
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;