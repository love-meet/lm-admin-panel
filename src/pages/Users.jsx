import React, { useEffect, useState, useMemo } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortBy, setSortBy] = useState('newest');
  const [planFilter, setPlanFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');

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
      rawDateJoined: u.dateJoined ? new Date(u.dateJoined) : null,
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

        // Experiment: Fetch user growth and subscription revenue endpoints
        try {
          console.log('🔄 Experiment: Fetching /admin/user-growth...');
          const userGrowthResponse = await adminApi.getUserGrowth();
          console.log('✅ User growth response:', userGrowthResponse);
        } catch (growthErr) {
          console.error('❌ User growth fetch error:', growthErr);
        }

        try {
          console.log('🔄 Experiment: Fetching /admin/subscription-revenue...');
          const subscriptionRevenueResponse = await adminApi.getSubscriptionRevenue();
          console.log('✅ Subscription revenue response:', subscriptionRevenueResponse);
        } catch (revenueErr) {
          console.error('❌ Subscription revenue fetch error:', revenueErr);
        }

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

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((u) => {
        return (
          (u.id || '').toLowerCase().includes(q) ||
          (u.username || '').toLowerCase().includes(q) ||
          (u.fullName || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.subscriptionPlan || '').toLowerCase().includes(q)
        );
      });
    }
    if (planFilter !== 'all') {
      filtered = filtered.filter((u) => u.subscriptionPlan === planFilter);
    }
    if (verifiedFilter === 'verified') {
      filtered = filtered.filter((u) => u.verified);
    } else if (verifiedFilter === 'unverified') {
      filtered = filtered.filter((u) => !u.verified);
    }
    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => (b.rawDateJoined || 0) - (a.rawDateJoined || 0));
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => (a.rawDateJoined || 0) - (b.rawDateJoined || 0));
    }
    return filtered;
  }, [users, query, planFilter, verifiedFilter, sortBy]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">User Management</h2>
      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-md overflow-visible">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full sm:w-80 px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Plans</option>
              <option value="Free">Free</option>
              <option value="Orbit">Orbit</option>
              <option value="Starlight">Starlight</option>
              <option value="Nova">Nova</option>
              <option value="Equinox">Equinox</option>
              <option value="Polaris">Polaris</option>
              <option value="Orion">Orion</option>
              <option value="Cosmos">Cosmos</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
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
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer" onClick={() => handleView(user)}>
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
                    user.subscriptionPlan === 'Free' ? 'bg-[var(--color-accent-blue)] text-white' :
                    'bg-[var(--color-accent-green)] text-white'
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
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex justify-between items-center border-t border-[var(--color-bg-tertiary)]">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--color-text-primary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-[var(--color-bg-tertiary)] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
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
                <option value="Free">Free</option>
                <option value="Orbit">Orbit</option>
                <option value="Starlight">Starlight</option>
                <option value="Nova">Nova</option>
                <option value="Equinox">Equinox</option>
                <option value="Polaris">Polaris</option>
                <option value="Orion">Orion</option>
                <option value="Cosmos">Cosmos</option>
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