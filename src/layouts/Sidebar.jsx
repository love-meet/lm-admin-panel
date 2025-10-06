import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Users', to: '/users' },
  { name: 'Posts', to: '/posts' },
  { name: 'Transactions', to: '/transactions' },
  { name: 'Reports', to: '/reports' },
  { name: 'Support Tickets', to: '/tickets' },
  { name: 'Admins', to: '/admins' },
  { name: 'Agents', to: '/agents' },
];

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] flex flex-col shadow-lg overflow-hidden z-30">
      <div className="h-16 flex items-center px-6 text-2xl font-bold border-b border-[var(--color-bg-tertiary)]">Admin Panel</div>
      <nav className="flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-2 py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block px-6 py-3 hover:bg-[var(--color-bg-tertiary)] transition-colors ${
                    isActive ? 'bg-[var(--color-bg-tertiary)] font-semibold text-[var(--color-primary-cyan)]' : ''
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