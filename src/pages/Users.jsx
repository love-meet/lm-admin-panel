import React from 'react';

// Mock data for users
const mockUsers = [
  {
    id: 'USR001',
    profilePic: 'https://i.pravatar.cc/150?img=1',
    fullName: 'Alice Johnson',
    email: 'alice.j@example.com',
    subscriptionPlan: 'Premium',
    dateJoined: '2023-01-15',
  },
  {
    id: 'USR002',
    profilePic: 'https://i.pravatar.cc/150?img=2',
    fullName: 'Bob Smith',
    email: 'bob.s@example.com',
    subscriptionPlan: 'Basic',
    dateJoined: '2023-02-20',
  },
  {
    id: 'USR003',
    profilePic: 'https://i.pravatar.cc/150?img=3',
    fullName: 'Charlie Brown',
    email: 'charlie.b@example.com',
    subscriptionPlan: 'Premium',
    dateJoined: '2023-03-10',
  },
];

export default function Users() {
  const handleAction = (action, user) => {
    alert(`${action} user: ${user.fullName}`);
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">User Management</h2>
      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
          <thead className="bg-[var(--color-bg-secondary)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Date Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={user.profilePic} alt="" />
                    <div className="ml-4 text-sm font-medium text-[var(--color-text-primary)]">{user.fullName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.subscriptionPlan === 'Premium' ? 'bg-[var(--color-accent-green)] text-white' : 'bg-[var(--color-accent-yellow)] text-white'
                    }`}
                  >
                    {user.subscriptionPlan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{user.dateJoined}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleAction('View', user)} className="text-[var(--color-primary-cyan)] hover:text-[var(--color-primary-purple)] transition-colors mr-3">
                    View
                  </button>
                  <button onClick={() => handleAction('Update', user)} className="text-[var(--color-accent-yellow)] hover:text-[var(--color-primary-purple)] transition-colors mr-3">
                    Update
                  </button>
                  <button onClick={() => handleAction('Suspend/Delete', user)} className="text-[var(--color-accent-red)] hover:text-[var(--color-primary-purple)] transition-colors">
                    Suspend/Delete
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