import React, { useState } from 'react';
import { FiEye, FiEdit2, FiSlash, FiTrash2 } from 'react-icons/fi';
import Modal from '../components/Modal';

// Mock data for users (copied from existing Users.jsx)
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

export default function UsersNew() {
  const [users, setUsers] = useState(mockUsers);
  const [query, setQuery] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type: 'suspend'|'delete', user }

  const applyUpdate = (payload) => {
    setUsers((prev) => prev.map((u) => (u.id === payload.id ? { ...u, ...payload } : u)));
  };

  const suspendUser = (user) => applyUpdate({ id: user.id, subscriptionPlan: 'Suspended' });
  const deleteUser = (user) => setUsers((prev) => prev.filter((u) => u.id !== user.id));

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">User Management</h2>
      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full sm:w-80 px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
          <thead className="bg-[var(--color-bg-secondary)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Date Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
            {users
              .filter((u) => {
                const q = query.trim().toLowerCase();
                if (!q) return true;
                return (
                  u.id.toLowerCase().includes(q) ||
                  u.fullName.toLowerCase().includes(q) ||
                  u.email.toLowerCase().includes(q) ||
                  u.subscriptionPlan.toLowerCase().includes(q)
                );
              })
              .map((user) => (
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
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.subscriptionPlan === 'Premium' ? 'bg-[var(--color-accent-green)] text-white' : user.subscriptionPlan === 'Suspended' ? 'bg-amber-600 text-white' : 'bg-[var(--color-accent-yellow)] text-white'}`}>
                    {user.subscriptionPlan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{user.dateJoined}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewUser(user)} className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30" title="View">
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button onClick={() => setEditUser(user)} className="text-amber-500 hover:text-amber-600 p-1.5 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/30" title="Edit">
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => setConfirm({ type: 'suspend', user })} className="text-rose-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30" title="Suspend">
                      <FiSlash className="w-5 h-5" />
                    </button>
                    <button onClick={() => setConfirm({ type: 'delete', user })} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title={viewUser ? `User Profile • ${viewUser.fullName}` : ''}
        size="lg"
        footer={<button onClick={() => setViewUser(null)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Close</button>}
      >
        {viewUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={viewUser.profilePic} alt="" className="h-12 w-12 rounded-full" />
              <div>
                <div className="text-[var(--color-text-primary)] font-semibold">{viewUser.fullName}</div>
                <div className="text-[var(--color-text-secondary)] text-sm">{viewUser.email}</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                <div className="text-xs text-[var(--color-text-secondary)]">User ID</div>
                <div className="text-[var(--color-text-primary)]">{viewUser.id}</div>
              </div>
              <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                <div className="text-xs text-[var(--color-text-secondary)]">Plan</div>
                <div className="text-[var(--color-text-primary)]">{viewUser.subscriptionPlan}</div>
              </div>
              <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                <div className="text-xs text-[var(--color-text-secondary)]">Date Joined</div>
                <div className="text-[var(--color-text-primary)]">{viewUser.dateJoined}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Recent Posts</div>
              <div className="rounded-lg border border-[var(--color-bg-tertiary)] divide-y divide-[var(--color-bg-tertiary)]">
                <div className="p-3 text-[var(--color-text-secondary)]">No posts loaded (mock).</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Recent Transactions</div>
              <div className="rounded-lg border border-[var(--color-bg-tertiary)] divide-y divide-[var(--color-bg-tertiary)]">
                <div className="p-3 text-[var(--color-text-secondary)]">No transactions loaded (mock).</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title={editUser ? `Update User • ${editUser.fullName}` : ''}
        size="md"
        footer={
          <>
            <button onClick={() => setEditUser(null)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Cancel</button>
            <button
              onClick={() => {
                const form = document.getElementById('edit-user-form');
                const fd = new FormData(form);
                applyUpdate({ id: editUser.id, fullName: fd.get('fullName'), subscriptionPlan: fd.get('subscriptionPlan') });
                setEditUser(null);
              }}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary-cyan)] text-white hover:opacity-90"
            >
              Save
            </button>
          </>
        }
      >
        {editUser && (
          <form id="edit-user-form" className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Full Name</label>
              <input name="fullName" defaultValue={editUser.fullName} className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Subscription Plan</label>
              <select name="subscriptionPlan" defaultValue={editUser.subscriptionPlan} className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm ? (confirm.type === 'delete' ? 'Delete User' : 'Suspend User') : ''}
        size="sm"
        footer={
          <>
            <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Cancel</button>
            <button
              onClick={() => {
                if (!confirm) return;
                if (confirm.type === 'delete') deleteUser(confirm.user);
                else suspendUser(confirm.user);
                setConfirm(null);
              }}
              className={`px-4 py-2 rounded-lg text-white ${confirm?.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              Confirm
            </button>
          </>
        }
      >
        {confirm && (
          <p className="text-[var(--color-text-secondary)]">
            {confirm.type === 'delete' ? 'This action will permanently delete the user.' : 'This action will suspend the user account.'}
          </p>
        )}
      </Modal>
    </div>
  );
}
