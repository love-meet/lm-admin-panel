import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import adminApi from '../api/admin';
import { toast } from 'sonner';
import { FiCopy, FiEdit2 } from 'react-icons/fi';

const truncateMiddle = (s, head = 6, tail = 4) => {
  if (!s) return '';
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
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
  const symbol = '$';
  return `${symbol}${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val)}`;
};

export default function UserModal() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState(null);

  // parse URL query param
  const readQuery = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('user');
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const onPop = () => setUserId(readQuery());
    // initial
    const initial = readQuery();
    console.debug('[UserModal] initial query user ->', initial);
    setUserId(initial);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    console.debug('[UserModal] userId changed ->', userId);
    const load = async () => {
      if (!userId) {
        setUser(null);
        return;
      }
      setLoading(true);
      try {
        const res = await adminApi.getUserById(userId);
        let details = null;
        if (!res) details = null;
        else if (res?.user) details = res.user;
        else if (res?.data) details = res.data;
        else details = res;
        // reuse toShape-like minimal normalization
        const id = details?.userId || details?._id || details?.id || userId;
        const username = details?.username || (details?.email ? details.email.split('@')[0] : '');
        const first = details?.firstName || details?.first || '';
        const last = details?.lastName || details?.lastName || details?.last || '';
        const fullName = `${first} ${last}`.trim() || username;
        const planRaw = details?.subscriptionPlan ?? 'Free';
        const subscriptionPlan = planRaw && typeof planRaw === 'object' ? (planRaw.planName || planRaw.name || 'Free') : planRaw;

        const verifiedFlag = details?.verified ?? details?.isVerified ?? details?.profileVerification ?? false;
        const newUser = {
          id,
          username,
          profilePic: details?.picture || details?.profilePic || '',
          fullName,
          email: details?.email || '',
          subscriptionPlan,
          balance: typeof details?.balance !== 'undefined' ? details.balance : (details?.rawBalance || 0),
          isDisabled: details?.isDisabled || false,
          verified: !!verifiedFlag,
          dateJoined: details?.dateJoined ? new Date(details.dateJoined).toLocaleDateString() : (details?.dateJoinedString || ''),
          raw: details,
        };
        setUser(newUser);
        setFormState({
          fullName: newUser.fullName || '',
          username: newUser.username || '',
          email: newUser.email || '',
          subscriptionPlan: newUser.subscriptionPlan || 'Free',
          verified: !!newUser.verified,
        });
      } catch (err) {
        console.error('[user modal] fetch error', err);
        toast.error('Failed to load user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const close = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('user');
      window.history.pushState({}, '', url);
      setUserId(null);
      setUser(null);
      setEditing(false);
    } catch (e) {
      // fallback
      window.history.pushState({}, '', window.location.pathname);
      setUserId(null);
      setUser(null);
      setEditing(false);
    }
  };

  const onEditToggle = () => setEditing((s) => !s);

  const onChange = (k, v) => setFormState((s) => ({ ...(s || {}), [k]: v }));

  const save = async () => {
    if (!userId || !formState) return;
    setLoading(true);
    try {
      const body = {
        fullName: formState.fullName,
        username: formState.username,
        email: formState.email,
        subscriptionPlan: formState.subscriptionPlan,
        // backend expects isVerified/profileVerification flags
        isVerified: !!formState.verified,
        profileVerification: !!formState.verified,
      };
      const res = await adminApi.updateUser(userId, body);
      const updated = res?.user || res?.data || res?.updatedUser || res;
      if (updated) {
        // notify Users list to update
        window.dispatchEvent(new CustomEvent('admin:user-updated', { detail: updated }));
        toast.success('User updated');
        // reload details
        const reloaded = await adminApi.getUserById(userId);
        let details = null;
        if (!reloaded) details = null;
        else if (reloaded?.user) details = reloaded.user;
        else if (reloaded?.data) details = reloaded.data;
        else details = reloaded;
        const id = details?.userId || details?._id || details?.id || userId;
        const username = details?.username || (details?.email ? details.email.split('@')[0] : '');
        const first = details?.firstName || details?.first || '';
        const last = details?.lastName || details?.lastName || details?.last || '';
        const fullName = `${first} ${last}`.trim() || username;
        const planRaw = details?.subscriptionPlan ?? 'Free';
        const subscriptionPlan = planRaw && typeof planRaw === 'object' ? (planRaw.planName || planRaw.name || 'Free') : planRaw;
        const verifiedFlag = details?.verified ?? details?.isVerified ?? details?.profileVerification ?? false;
        const newUser = {
          id,
          username,
          profilePic: details?.picture || details?.profilePic || '',
          fullName,
          email: details?.email || '',
          subscriptionPlan,
          balance: typeof details?.balance !== 'undefined' ? details.balance : (details?.rawBalance || 0),
          isDisabled: details?.isDisabled || false,
          verified: !!verifiedFlag,
          dateJoined: details?.dateJoined ? new Date(details.dateJoined).toLocaleDateString() : (details?.dateJoinedString || ''),
          raw: details,
        };
        setUser(newUser);
        setFormState({
          fullName: newUser.fullName || '',
          username: newUser.username || '',
          email: newUser.email || '',
          subscriptionPlan: newUser.subscriptionPlan || 'Free',
          verified: !!newUser.verified,
        });
        setEditing(false);
      } else {
        toast.success('Updated (no payload returned)');
        setEditing(false);
      }
    } catch (err) {
      console.error('[user modal] update error', err);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      <button onClick={close} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Close</button>
      {!editing ? (
        <button onClick={onEditToggle} className="px-4 py-2 rounded-lg bg-[var(--color-primary-cyan)] text-white">Edit</button>
      ) : (
        <>
          <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)]">Cancel</button>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-[var(--color-accent-green)] text-white">Save</button>
        </>
      )}
    </>
  );

  return (
    <Modal
      isOpen={!!userId}
      onClose={close}
      title={user ? `User Profile • ${user.fullName}` : 'User Profile'}
      size="lg"
      footer={footer}
    >
      {loading ? (
        <div className="py-6 text-center text-[var(--color-text-secondary)]">Loading...</div>
      ) : user ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {(user.profilePic || user.raw?.picture) ? (
                <img src={user.profilePic || user.raw?.picture} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)]"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z" fill="currentColor"/></svg></div>
              )}
              <div>
                {!editing ? (
                  <>
                    <div className="text-[var(--color-text-primary)] font-semibold">{user.fullName}</div>
                    <div className="text-[var(--color-text-secondary)] text-sm">{user.email}</div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input className="w-full px-3 py-1 rounded border" value={formState?.fullName || ''} onChange={(e) => onChange('fullName', e.target.value)} />
                    <input className="w-full px-3 py-1 rounded border text-sm" value={formState?.email || ''} onChange={(e) => onChange('email', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--color-text-secondary)]">Balance</div>
              <div className="text-[var(--color-text-primary)] font-semibold">{formatBalance(user)}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-text-secondary)]">User ID</div>
              <div className="flex items-center gap-2">
                <div className="text-[var(--color-text-primary)] font-mono">{truncateMiddle(user.id || user.raw?.userId)}</div>
                <button onClick={() => copyId(user.id || user.raw?.userId)} title="Copy ID" className="p-1 rounded hover:bg-[var(--color-bg-tertiary)]">
                  <FiCopy className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </button>
              </div>
            </div>
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-text-secondary)]">Plan</div>
              {!editing ? (
                <div className="text-[var(--color-text-primary)]">{user.subscriptionPlan}{user.raw?.subscriptionPlan && typeof user.raw.subscriptionPlan === 'object' ? ` • ${user.raw.subscriptionPlan.planName || ''}` : ''}</div>
              ) : (
                <select className="w-full px-3 py-1 rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-bg-tertiary)]" value={formState?.subscriptionPlan} onChange={(e) => onChange('subscriptionPlan', e.target.value)}>
                  <option value="Free">Free</option>
                  <option value="Orbit">Orbit</option>
                  <option value="Starlight">Starlight</option>
                  <option value="Nova">Nova</option>
                  <option value="Equinox">Equinox</option>
                  <option value="Polaris">Polaris</option>
                  <option value="Orion">Orion</option>
                  <option value="Cosmos">Cosmos</option>
                </select>
              )}
            </div>
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-text-secondary)]">Status</div>
              {!editing ? (
                <div className="text-[var(--color-text-primary)]">{user.isDisabled ? 'Suspended' : user.verified ? 'Verified' : 'Active'}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <label className="text-sm">Verified</label>
                  <input type="checkbox" checked={!!formState?.verified} onChange={(e) => onChange('verified', e.target.checked)} />
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-text-secondary)]">Full Name</div>
              <div className="text-[var(--color-text-primary)]">{user.fullName}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Username</div>
              <div className="text-[var(--color-text-primary)]">{user.username || user.raw?.username}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Referral Code</div>
              <div className="text-[var(--color-text-primary)]">{user.raw?.referralCode || ''}</div>
            </div>

            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-text-secondary)]">Location</div>
              <div className="text-[var(--color-text-primary)]">{[user.raw?.city, user.raw?.state, user.raw?.country].filter(Boolean).join(', ')}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Distance</div>
              <div className="text-[var(--color-text-primary)]">{user.raw?.distance ?? ''} km</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Show Distance / Online</div>
              <div className="text-[var(--color-text-primary)]">{user.raw?.showDistance ? 'Yes' : 'No'} / {user.raw?.showOnlineStatus ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-text-secondary)]">Bio</div>
              <div className="text-[var(--color-text-primary)]">{user.raw?.bio || ''}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Hobbies</div>
              <div className="text-[var(--color-text-primary)]">{Array.isArray(user.raw?.hobbies) ? user.raw.hobbies.join(', ') : ''}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Interests</div>
              <div className="text-[var(--color-text-primary)]">{Array.isArray(user.raw?.interests) ? user.raw.interests.join(', ') : ''}</div>
            </div>

            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
              <div className="text-xs text-[var(--color-text-secondary)]">Affiliates</div>
              <div className="text-[var(--color-text-primary)]">{Array.isArray(user.raw?.affiliates) ? user.raw.affiliates.join(', ') : ''}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Blocked Users</div>
              <div className="text-[var(--color-text-primary)]">{Array.isArray(user.raw?.blockedUsers) ? user.raw.blockedUsers.join(', ') : ''}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-2">Profile Verification</div>
              <div className="text-[var(--color-text-primary)]">{user.raw?.profileVerification ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-[var(--color-text-secondary)]">No user selected</div>
      )}
    </Modal>
  );
}
