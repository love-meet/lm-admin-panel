import React from 'react';

const mockAdmins = [
  {
    id: 'ADM001',
    name: 'Jane Doe',
    email: 'jane.d@example.com',
    role: 'Super Admin',
    lastLogin: '2023-09-22',
    status: 'Active',
  },
  {
    id: 'ADM002',
    name: 'John Smith',
    email: 'john.s@example.com',
    role: 'Moderator',
    lastLogin: '2023-09-21',
    status: 'Active',
  },
];

export default function Admins() {
  const handleAction = (action, admin) => {
    alert(`${action} admin: ${admin.name}`);
  };

  const openCreateAdminModal = () => {
    alert('Create New Admin modal would open here.');
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Admin Management</h2>
        <button
          onClick={openCreateAdminModal}
          className="bg-[var(--color-primary-purple)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors"
        >
          Create New Admin
        </button>
      </div>
      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
          <thead className="bg-[var(--color-bg-secondary)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Admin ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
            {mockAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{admin.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">{admin.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{admin.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{admin.lastLogin}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${admin.status === 'Active' ? 'bg-[var(--color-accent-green)] text-white' : 'bg-[var(--color-accent-red)] text-white'
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleAction('Update Role', admin)} className="text-[var(--color-accent-yellow)] hover:text-[var(--color-primary-purple)] transition-colors mr-3">
                    Update Role
                  </button>
                  <button onClick={() => handleAction('Deactivate', admin)} className="text-[var(--color-accent-red)] hover:text-[var(--color-primary-purple)] transition-colors">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}