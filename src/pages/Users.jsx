import React, { useEffect, useState } from 'react';
import { FiEye, FiEdit2, FiSlash, FiTrash2, FiLock, FiCheck, FiMoreVertical, FiUser, FiCopy } from 'react-icons/fi';
import Modal from '../components/Modal';
import UserModal from '../components/UserModal';
import adminApi from '../api/admin';
import { toast } from 'sonner';



export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  // viewUser is now handled via URL query param in UserModal
  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type: 'suspend'|'delete'|'enable'|'verify', user }
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Helpers to normalize backend user objects into the UI shape
  const toShape = (u) => {
    if (!u) return null;
    const id = u.userId || u._id || u.id || '';
    const username = u.username || (u.email ? u.email.split('@')[0] : '');
    const first = u.firstName || u.first || '';
    const last = u.lastName || u.lastName || u.last || '';
    const fullName = `${first} ${last}`.trim() || username;
    // normalize subscriptionPlan to a string (backend may return an object)
    let plan = u.subscriptionPlan ?? 'Free';
    if (plan && typeof plan === 'object') {
      plan = plan.planName || plan.name || String(plan) || 'Free';
    }
    if (!plan) plan = 'Free';

    // normalize verification flags from multiple backend shapes
    const verifiedFlag = u.verified ?? u.isVerified ?? u.profileVerification ?? false;

    return {
      id,
      username,
      profilePic: u.picture || u.profilePic || '',
      fullName,
      email: u.email || '',
      subscriptionPlan: plan,
      balance: typeof u.balance !== 'undefined' ? u.balance : (u.rawBalance || 0),
      isDisabled: u.isDisabled || false,
      verified: !!verifiedFlag,
      dateJoined: u.dateJoined ? new Date(u.dateJoined).toLocaleDateString() : (u.dateJoinedString || ''),
      raw: u,
    };
  };

  const truncateMiddle = (s, head = 6, tail = 4) => {
    if (!s) return '';
    if (s.length <= head + tail + 3) return s;
    return `${s.slice(0, head)}...${s.slice(-tail)}`;
  };

  const truncateRight = (s, len = 12) => {
    if (!s) return '';
    return s.length > len ? s.slice(0, len) + '...' : s;
  };

  const copyId = async (id) => {
    if (!id) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(id);
      } else {
        const ta = document.createElement('textarea');
        ta.value = id;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      toast.success('ID copied to clipboard');
    } catch (e) {
      console.error('copy failed', e);
      toast.error('Failed to copy ID');
    }
  };

  const formatBalance = (u) => {
    const raw = u?.raw || u;
    const val = Number(raw?.balance ?? u?.balance ?? 0) || 0;
    const isNigeria = raw?.country === 'Nigeria';
    const symbol =  '$';
    return `${symbol}${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val)}`;
  };

  const applyUpdate = (payload) => {
    setUsers((prev) => prev.map((u) => (u.id === payload.id ? { ...u, ...payload } : u)));
  };

  // Fetch users from API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getAllUsers();
        // Normalize response shapes:
        // 1) interceptor returns array -> res === [..]
        // 2) interceptor returns payload -> res === { data: [...], message }
        // 3) full axios response -> res.data === { data: [...] }
        let list = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res?.users)) {
          list = res.users;
        } else if (Array.isArray(res?.data?.users)) {
          list = res.data.users;
        }

        setUsers(list.length ? list.map(toShape) : mockUsers.map(toShape));
      } catch (err) {
        console.error('[users] fetch error', err);
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const onUpdated = (e) => {
      const updated = e?.detail;
      if (!updated) return;
      try {
        const shaped = toShape(updated);
        applyUpdate(shaped);
      } catch (err) {
        console.error('failed to apply user-updated event', err);
      }
    };
    window.addEventListener('admin:user-updated', onUpdated);
    return () => window.removeEventListener('admin:user-updated', onUpdated);
  }, []);

  const suspendUser = async (user) => {
    setActionLoading(true);
    try {
      const res = await adminApi.disableUser(user.id);
      // try to extract updated user from response
      const updated = res?.user || res?.data || res?.updatedUser || res;
      if (updated) {
        applyUpdate(toShape(updated));
      } else {
        applyUpdate({ id: user.id, isDisabled: true, subscriptionPlan: 'Suspended' });
      }
      toast.success('User suspended');
    } catch (err) {
      console.error('[users] suspend error', err);
      toast.error('Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleView = async (user) => {
    // open modal by pushing ?user=<id> so it survives refresh/navigation
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('user', user.id);
      console.debug('[Users] open modal url ->', url.toString(), 'userId ->', user.id);
      // pushState doesn't fire popstate; fire one so UserModal's popstate listener updates immediately
      window.history.pushState({}, '', url.toString());
      try {
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch (e) {
        // older browsers: fallback to a custom event
        window.dispatchEvent(new Event('popstate'));
      }
      console.debug('[Users] pushState + popstate dispatched');
    } catch (e) {
      console.error('failed to open user modal via url', e);
    }
  };

  const deleteUser = async (user) => {
    setActionLoading(true);
    try {
      await adminApi.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success('User deleted');
    } catch (err) {
      console.error('[users] delete error', err);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const enableUser = async (user) => {
    setActionLoading(true);
    try {
      const res = await adminApi.enableUser(user.id);
      const updated = res?.user || res?.data || res?.updatedUser || res;
      if (updated) {
        applyUpdate(toShape(updated));
      } else {
        applyUpdate({ id: user.id, isDisabled: false, subscriptionPlan: user.subscriptionPlan || 'Free' });
      }
      toast.success('User enabled');
    } catch (err) {
      console.error('[users] enable error', err);
      toast.error('Failed to enable user');
    } finally {
      setActionLoading(false);
    }
  };

  const verifyUser = async (user) => {
    setActionLoading(true);
    try {
      const res = await adminApi.verifyUser(user.id);
      const updated = res?.user || res?.data || res?.updatedUser || res;
      if (updated) {
        applyUpdate(toShape(updated));
      } else {
        applyUpdate({ id: user.id, verified: true });
      }
      toast.success('User verified');
    } catch (err) {
      console.error('[users] verify error', err);
      toast.error('Failed to verify user');
    } finally {
      setActionLoading(false);
    }
  };

  const unverifyUserHandler = async (user) => {
    setActionLoading(true);
    try {
      const res = await adminApi.unverifyUser(user.id);
      const updated = res?.user || res?.data || res?.updatedUser || res;
      if (updated) {
        applyUpdate(toShape(updated));
      } else {
        applyUpdate({ id: user.id, verified: false });
      }
      toast.success('User unverified');
    } catch (err) {
      console.error('[users] unverify error', err);
      toast.error('Failed to unverify user');
    } finally {
      setActionLoading(false);
    }
  };

  // expose a temporary global for the menu button to call (keeps inline JSX smaller)
  // and remove on unmount
  useEffect(() => {
    window.__unverifyTemp = unverifyUserHandler;
    return () => { try { delete window.__unverifyTemp; } catch {} };
  }, []);

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">User Management</h2>
      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-md overflow-visible">
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
                Status
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
            {users
              .filter((u) => {
                const q = query.trim().toLowerCase();
                if (!q) return true;
                return (
                  (u.id || '').toLowerCase().includes(q) ||
                  (u.username || '').toLowerCase().includes(q) ||
                  (u.fullName || '').toLowerCase().includes(q) ||
                  (u.email || '').toLowerCase().includes(q) ||
                  (u.subscriptionPlan || '').toLowerCase().includes(q)
                );
              })
              .map((user) => (
              <tr key={user.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                  <div className="flex items-center gap-2">
                    <div className="font-mono">{truncateMiddle(user.id)}</div>
                    <button onClick={() => copyId(user.id)} title="Copy ID" className="p-1 rounded hover:bg-[var(--color-bg-tertiary)]">
                      <FiCopy className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.profilePic ? (
                      <img className="h-10 w-10 rounded-full object-cover" src={user.profilePic} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)]">
                        <FiUser className="w-5 h-5" />
                      </div>
                    )}
                    <div className="ml-4 text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
                      <span>{truncateRight(user.username || user.fullName)}</span>
                      {user.verified && (
                        <span title="Verified" className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white">
                          <FiCheck className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.subscriptionPlan === 'Premium' ? 'bg-[var(--color-accent-green)] text-white' : 
                    user.subscriptionPlan === 'Basic' ? 'bg-[var(--color-accent-yellow)] text-white' :
                    'bg-[var(--color-accent-blue)] text-white'
                  }`}>
                    {user.subscriptionPlan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isDisabled ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-600 text-white">
                      Suspended
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-600 text-white">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{user.dateJoined}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} 
                      className="p-1 rounded-full hover:bg-[var(--color-bg-tertiary)] transition-all duration-200 transform hover:scale-110"
                    >
                      <FiMoreVertical className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    </button>
                    {openMenuId === user.id && (
                      <div className="absolute right-0 mt-2 w-52 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg shadow-xl z-50 flex flex-col divide-y divide-[var(--color-border)] overflow-hidden animate-fadeIn">
                        <button 
                          onClick={() => { handleView(user); setOpenMenuId(null); }} 
                          className="block w-full text-left px-4 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 transition-colors"
                        >
                          <FiEye className="w-4 h-4" /> View Profile
                        </button>
                        <button 
                          onClick={() => { setEditUser(user); setOpenMenuId(null); }} 
                          className="block w-full text-left px-4 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" /> Edit User
                        </button>
                        {!user.isDisabled ? (
                          <>
                            <button 
                              onClick={() => { setConfirm({ type: 'suspend', user }); setOpenMenuId(null); }} 
                              className="block w-full text-left px-4 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 transition-colors"
                            >
                              <FiSlash className="w-4 h-4 text-amber-500" /> Suspend User
                            </button>
                            <button 
                              onClick={() => { verifyUser(user); setOpenMenuId(null); }} 
                              className="block w-full text-left px-4 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 transition-colors"
                            >
                              <FiCheck className="w-4 h-4 text-green-500" /> Verify User
                            </button>
                            <button 
                              onClick={() => { /* unverify */ window.__unverifyTemp && window.__unverifyTemp(user); setOpenMenuId(null); }} 
                              className="block w-full text-left px-4 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 transition-colors"
                            >
                              <FiLock className="w-4 h-4 text-yellow-500" /> Unverify User
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => { enableUser(user); setOpenMenuId(null); }} 
                            className="block w-full text-left px-4 py-3 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 transition-colors"
                          >
                            <FiLock className="w-4 h-4 text-green-500" /> Enable User
                          </button>
                        )}
                        <button 
                          onClick={() => { setConfirm({ type: 'delete', user }); setOpenMenuId(null); }} 
                          className="block w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" /> Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* User modal is now a separate component which reads ?user=<id> from the URL */}
      <UserModal />

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
                applyUpdate({ 
                  id: editUser.id, 
                  fullName: fd.get('fullName'), 
                  subscriptionPlan: fd.get('subscriptionPlan'),
                  verified: fd.get('verified') === 'true'
                });
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
                <option value="Free">Free</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Verified Status</label>
                <select name="verified" defaultValue={editUser.verified.toString()} className="w-full px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="true">Verified</option>
                <option value="false">Active</option>
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