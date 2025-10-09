import React, { useState, useEffect } from 'react';
import { FiShield, FiUserX } from 'react-icons/fi';
import Modal from '../components/Modal';
import adminApi from '../api/admin';

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
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [roleModal, setRoleModal] = useState(null); // admin
  const [confirm, setConfirm] = useState(null); // { admin }

  // Fetch admins from API
  useEffect(() => {
    const loadAdmins = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getAdmins();
        // Normalize response shapes
        let list = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res?.admins)) {
          list = res.admins;
        } else if (Array.isArray(res?.data?.admins)) {
          list = res.data.admins;
        }

        setAdmins(list.length ? list : mockAdmins);
      } catch (err) {
        console.error('[admins] fetch error', err);
        setAdmins(mockAdmins);
      } finally {
        setLoading(false);
      }
    };
    loadAdmins();
  }, []);

  const handleAction = (action, admin) => {
    if (action === 'Update Role') setRoleModal(admin);
    if (action === 'Deactivate') setConfirm({ admin });
  };

  const applyRoleUpdate = async (id, role) => {
    try {
      const res = await adminApi.updateAdmin(id, { role });
      console.log('Admin role updated:', res);
      // Update local state
      setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, role } : a)));
    } catch (err) {
      console.error('Failed to update admin role:', err);
      throw err;
    }
  };

  const deactivateAdmin = (id) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Inactive' } : a)));
  };

  const openCreateAdminModal = () => {
    setCreateOpen(true);
  };

  const createNewAdmin = async (adminData) => {
    try {
      const res = await adminApi.createAdmin(adminData);
      console.log('Admin created:', res);
      // Add the new admin to the list
      if (res?.data) {
        setAdmins((prev) => [res.data, ...prev]);
      }
      return res;
    } catch (err) {
      console.error('Failed to create admin:', err);
      throw err;
    }
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
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-[var(--color-text-secondary)]">
                  Loading admins...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-[var(--color-text-secondary)]">
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction('Update Role', admin)}
                      className="text-amber-500 hover:text-amber-600 p-1.5 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/30"
                      title="Update Role"
                    >
                      <FiShield className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAction('Deactivate', admin)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                      title="Deactivate"
                    >
                      <FiUserX className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Create Admin Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Admin"
        size="md"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Cancel</button>
            <button
              onClick={async () => {
                const form = document.getElementById('create-admin-form');
                const fd = new FormData(form);
                const adminData = {
                  firstName: fd.get('firstName'),
                  lastName: fd.get('lastName'),
                  email: fd.get('email'),
                  password: fd.get('password'),
                  role: fd.get('role'),
                };

                try {
                  await createNewAdmin(adminData);
                  setCreateOpen(false);
                } catch (err) {
                  // Error is already logged in createNewAdmin
                  // Could show toast here if needed
                }
              }}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary-cyan)] text-white hover:opacity-90"
            >
              Create
            </button>
          </>
        }
      >
        <form id="create-admin-form" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">First Name</label>
              <input name="firstName" className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Last Name</label>
              <input name="lastName" className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Email</label>
            <input type="email" name="email" className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Password</label>
            <input type="password" name="password" className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Role</label>
            <select name="role" defaultValue="Moderator" className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
        </form>
      </Modal>
      {/* Update Role Modal */}
      <Modal
        isOpen={!!roleModal}
        onClose={() => setRoleModal(null)}
        title={roleModal ? `Update Role • ${roleModal.name}` : ''}
        size="sm"
        footer={
          <>
            <button onClick={() => setRoleModal(null)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Cancel</button>
            <button
              onClick={async () => {
                const form = document.getElementById('update-role-form');
                const fd = new FormData(form);
                const role = fd.get('role');

                try {
                  await applyRoleUpdate(roleModal.id, role);
                  setRoleModal(null);
                } catch (err) {
                  // Error is already logged in applyRoleUpdate
                  // Could show toast here if needed
                }
              }}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary-cyan)] text-white hover:opacity-90"
            >
              Save
            </button>
          </>
        }
      >
        {roleModal && (
          <form id="update-role-form" className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Role</label>
              <select name="role" defaultValue={roleModal.role} className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Moderator">Moderator</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
          </form>
        )}
      </Modal>

      {/* Deactivate Confirm Modal */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title="Deactivate Admin"
        size="sm"
        footer={
          <>
            <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Cancel</button>
            <button
              onClick={() => {
                if (!confirm) return;
                deactivateAdmin(confirm.admin.id);
                setConfirm(null);
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Deactivate
            </button>
          </>
        }
      >
        <p className="text-[var(--color-text-secondary)]">Are you sure you want to deactivate this admin?</p>
      </Modal>
    </div>
  );
}