import React, { useState, useEffect, useMemo } from 'react';
import { FiShield, FiUserX, FiTrash2, FiUserCheck } from 'react-icons/fi';
import Modal from '../components/Modal';
import adminApi from '../api/admin';
import { toast } from 'sonner';

const mockAdmins = [
  {
    id: 'ADM001',
    name: 'Jane Doe',
    email: 'jane.d@example.com',
    role: 'super_admin',
    lastLogin: '2023-09-22',
    status: 'Active',
  },
  {
    id: 'ADM002',
    name: 'John Smith',
    email: 'john.s@example.com',
    role: 'moderator',
    lastLogin: '2023-09-21',
    status: 'Active',
  },
];

const formatRole = (role) => {
  const roleMap = {
    'super_admin': 'Super Admin',
    'admin': 'Admin',
    'moderator': 'Moderator',
    'support': 'Support'
  };
  return roleMap[role] || role;
};

export default function Admins() {
   const [admins, setAdmins] = useState([]);
   const [loading, setLoading] = useState(true);
   const [createOpen, setCreateOpen] = useState(false);
   const [roleModal, setRoleModal] = useState(null); // admin
   const [confirm, setConfirm] = useState(null); // { admin }
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;

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

        // Ensure all admins have a status field, defaulting to 'Active'
        const processedList = list.length ? list.map(admin => ({
          ...admin,
          status: admin.status || 'Active'
        })) : mockAdmins;
        setAdmins(processedList);
      } catch (err) {
        console.error('[admins] fetch error', err);
        setAdmins(mockAdmins);
      } finally {
        setLoading(false);
      }
    };
    loadAdmins();
  }, []);

  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return admins.slice(startIndex, startIndex + itemsPerPage);
  }, [admins, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(admins.length / itemsPerPage);

  const handleAction = (action, admin) => {
    if (action === 'Update Role') setRoleModal(admin);
    if (action === 'Deactivate') setConfirm({ admin, id: admin._id || admin.id, action: 'deactivate' });
    if (action === 'Activate') setConfirm({ admin, id: admin._id || admin.id, action: 'activate' });
    if (action === 'Delete') setConfirm({ admin, id: admin._id || admin.id, action: 'delete' });
  };

  const applyRoleUpdate = async (id, role) => {
    try {
      const res = await adminApi.updateAdmin(id, { role });
      console.log('Admin role updated:', res);
      // Update local state
      setAdmins((prev) => prev.map((a) => (a._id === id || a.id === id ? { ...a, role } : a)));
    } catch (err) {
      console.error('Failed to update admin role:', err);
      throw err;
    }
  };

  const toggleAdminStatus = async (id, action) => {
    try {
      const res = await adminApi.toggleAdminStatus(id, action);
      if (action === 'deactivate') {
        setAdmins((prev) => prev.map((a) => (a._id === id || a.id === id ? { ...a, status: 'Inactive' } : a)));
        toast.success('Admin deactivated successfully');
      } else if (action === 'activate') {
        setAdmins((prev) => prev.map((a) => (a._id === id || a.id === id ? { ...a, status: 'Active' } : a)));
        toast.success('Admin activated successfully');
      }
      console.log(`${action} response:`, res);
    } catch (err) {
      console.error(`Failed to ${action} admin:`, err);
      toast.error(`Failed to ${action} admin`);
    }
  };

  const deleteAdminUser = async (id) => {
    try {
      const res = await adminApi.deleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => (a._id !== id && a.id !== id)));
      toast.success('Admin deleted successfully');
      console.log('Delete response:', res);
    } catch (err) {
      console.error('Failed to delete admin:', err);
      toast.error('Failed to delete admin');
    }
  };

  const openCreateAdminModal = () => {
    setCreateOpen(true);
  };

  const createNewAdmin = async (adminData) => {
    try {
      // Collect selected permissions
      const permissions = [];
      const permissionCheckboxes = document.querySelectorAll('input[name="permissions"]:checked');
      permissionCheckboxes.forEach(checkbox => {
        permissions.push(checkbox.value);
      });

      const adminDataWithPermissions = {
        ...adminData,
        permissions: permissions
      };

      const res = await adminApi.createAdmin(adminDataWithPermissions);
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
              paginatedAdmins.map((admin) => (
                <tr key={admin._id || admin.id || `admin-${Math.random()}`} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]" title={admin._id}>{admin._id ? `${admin._id.substring(0, 8)}...` : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">{admin.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{formatRole(admin.role)}</td>
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
                        onClick={() => handleAction('Activate', admin)}
                        className="text-green-500 hover:text-green-700 p-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30"
                        title="Activate Admin"
                      >
                        <FiUserCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction('Deactivate', admin)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                        title="Deactivate Admin"
                      >
                        <FiUserX className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction('Delete', admin)}
                        className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                        title="Delete Admin"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-[var(--color-bg-secondary)] border-t border-[var(--color-bg-tertiary)] flex items-center justify-between">
          <div className="text-sm text-[var(--color-text-secondary)]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, admins.length)} of {admins.length} admins
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg-primary)]"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--color-text-primary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg-primary)]"
            >
              Next
            </button>
          </div>
        </div>
      )}
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
            <select name="role" defaultValue="moderator" className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="support">Support</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-3">Permissions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="users_view" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Users View</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="users_edit" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Users Edit</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="users_delete" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Users Delete</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="view_dashboard" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">View Dashboard</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="transactions_view" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Transactions View</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="transactions_refund" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Transactions Refund</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="reports_view" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Reports View</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="settings_edit" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Settings Edit</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="admin_create" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Admin Create</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="admin_delete" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Admin Delete</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="games_manage" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Games Manage</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="bonuses_manage" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Bonuses Manage</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="withdrawals_approve" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Withdrawals Approve</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="verify_users" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Verify Users</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="disable_users" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Disable Users</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="enable_users" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Enable Users</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="read_support_tickets" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Read Support Tickets</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="permissions" value="respond_support_tickets" className="rounded border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[var(--color-text-primary)]">Respond Support Tickets</span>
              </label>
            </div>
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
                  await applyRoleUpdate(roleModal._id || roleModal.id, role);
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
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="support">Support</option>
              </select>
            </div>
          </form>
        )}
      </Modal>

      {/* Action Confirm Modal */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title={
          confirm?.action === 'delete' ? 'Delete Admin' :
          confirm?.action === 'activate' ? 'Activate Admin' :
          'Deactivate Admin'
        }
        size="sm"
        footer={
          <>
            <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Cancel</button>
            <button
              onClick={async () => {
                if (!confirm) return;
                const id = confirm.id || confirm.admin._id || confirm.admin.id;

                if (confirm.action === 'delete') {
                  await deleteAdminUser(id);
                } else {
                  await toggleAdminStatus(id, confirm.action);
                }
                setConfirm(null);
              }}
              className={`px-4 py-2 rounded-lg text-white hover:opacity-90 ${
                confirm?.action === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                confirm?.action === 'activate' ? 'bg-green-600 hover:bg-green-700' :
                'bg-red-600 hover:bg-red-700'
              }`}
            >
              {confirm?.action === 'delete' ? 'Delete' :
               confirm?.action === 'activate' ? 'Activate' :
               'Deactivate'}
            </button>
          </>
        }
      >
        <p className="text-[var(--color-text-secondary)]">
          {confirm?.action === 'delete'
            ? 'Are you sure you want to permanently delete this admin? This action cannot be undone.'
            : confirm?.action === 'activate'
            ? 'Are you sure you want to activate this admin?'
            : 'Are you sure you want to deactivate this admin?'
          }
        </p>
      </Modal>
    </div>
  );
}