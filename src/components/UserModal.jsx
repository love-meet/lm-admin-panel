import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import adminApi from '../api/admin';
import { toast } from 'sonner';
import { FiCopy, FiEdit2, FiUser, FiMail, FiDollarSign, FiCalendar, FiMapPin, FiHeart, FiShield } from 'react-icons/fi';

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
          bio: newUser.raw?.bio || '',
          city: newUser.raw?.city || '',
          state: newUser.raw?.state || '',
          country: newUser.raw?.country || '',
          distance: newUser.raw?.distance || 50,
          showDistance: newUser.raw?.showDistance ?? true,
          showOnlineStatus: newUser.raw?.showOnlineStatus ?? true,
          hobbies: Array.isArray(newUser.raw?.hobbies) ? newUser.raw.hobbies : [],
          interests: Array.isArray(newUser.raw?.interests) ? newUser.raw.interests : [],
          gender: newUser.raw?.gender || '',
          dateOfBirth: newUser.raw?.dateOfBirth ? new Date(newUser.raw.dateOfBirth).toISOString().split('T')[0] : '',
          ageRange: newUser.raw?.ageRange || { start: 18, end: 35 },
          canWithdraw: newUser.raw?.canWithdraw ?? true,
          isDisabled: newUser.raw?.isDisabled ?? false,
          profileVerification: newUser.raw?.profileVerification ?? false,
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
      window.history.pushState({}, '', window.location.pathname);
      setUserId(null);
      setUser(null);
      setEditing(false);
    }
  };

  const onEditToggle = () => setEditing((s) => !s);

  const onChange = (k, v) => setFormState((s) => ({ ...(s || {}), [k]: v }));

  const onArrayChange = (k, v) => {
    const arr = v.split(',').map(s => s.trim()).filter(s => s);
    setFormState((s) => ({ ...(s || {}), [k]: arr }));
  };

  const save = async () => {
    if (!userId || !formState) return;
    setLoading(true);
    try {
      const body = {
        firstName: formState.fullName.split(' ')[0] || '',
        lastName: formState.fullName.split(' ').slice(1).join(' ') || '',
        username: formState.username,
        email: formState.email,
        subscriptionPlan: formState.subscriptionPlan,
        isVerified: !!formState.verified,
        profileVerification: !!formState.verified,
        bio: formState.bio,
        city: formState.city,
        state: formState.state,
        country: formState.country,
        distance: formState.distance,
        showDistance: formState.showDistance,
        showOnlineStatus: formState.showOnlineStatus,
        hobbies: formState.hobbies,
        interests: formState.interests,
        gender: formState.gender,
        dateOfBirth: formState.dateOfBirth ? new Date(formState.dateOfBirth).toISOString() : null,
        ageRange: formState.ageRange,
        canWithdraw: formState.canWithdraw,
        isDisabled: formState.isDisabled,
      };
      const res = await adminApi.updateUser(userId, body);
      const updated = res?.user || res?.data || res?.updatedUser || res;
      if (updated) {
        window.dispatchEvent(new CustomEvent('admin:user-updated', { detail: updated }));
        toast.success('User updated successfully');
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
          bio: newUser.raw?.bio || '',
          city: newUser.raw?.city || '',
          state: newUser.raw?.state || '',
          country: newUser.raw?.country || '',
          distance: newUser.raw?.distance || 50,
          showDistance: newUser.raw?.showDistance ?? true,
          showOnlineStatus: newUser.raw?.showOnlineStatus ?? true,
          hobbies: Array.isArray(newUser.raw?.hobbies) ? newUser.raw.hobbies : [],
          interests: Array.isArray(newUser.raw?.interests) ? newUser.raw.interests : [],
          gender: newUser.raw?.gender || '',
          dateOfBirth: newUser.raw?.dateOfBirth ? new Date(newUser.raw.dateOfBirth).toISOString().split('T')[0] : '',
          ageRange: newUser.raw?.ageRange || { start: 18, end: 35 },
          canWithdraw: newUser.raw?.canWithdraw ?? true,
          isDisabled: newUser.raw?.isDisabled ?? false,
          profileVerification: newUser.raw?.profileVerification ?? false,
        });
        setEditing(false);
      } else {
        toast.success('Updated successfully');
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
    <div className="flex items-center justify-end gap-3">
      <button 
        onClick={close} 
        className="px-6 py-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white font-medium transition-all duration-200 hover:scale-105"
      >
        Close
      </button>
      {!editing ? (
        <button 
          onClick={onEditToggle} 
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50 flex items-center gap-2"
        >
          <FiEdit2 className="w-4 h-4" />
          Edit Profile
        </button>
      ) : (
        <>
          <button 
            onClick={() => setEditing(false)} 
            className="px-6 py-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white font-medium transition-all duration-200 hover:scale-105"
          >
            Cancel
          </button>
          <button 
            onClick={save} 
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      )}
    </div>
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
        <div className="py-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-gray-400">Loading user data...</div>
        </div>
      ) : user ? (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-br from-violet-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                {(user.profilePic || user.raw?.picture) ? (
                  <div className="relative">
                    <img 
                      src={user.profilePic || user.raw?.picture} 
                      alt={user.fullName} 
                      className="h-20 w-20 rounded-2xl object-cover ring-4 ring-violet-500/50 shadow-lg shadow-violet-500/30" 
                    />
                    {user.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-1.5 ring-2 ring-gray-900">
                        <FiShield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center ring-4 ring-violet-500/50 shadow-lg shadow-violet-500/30">
                    <FiUser className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {!editing ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
                        {user.verified && (
                          <span className="px-2 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-lg">Verified</span>
                        )}
                        {user.isDisabled && (
                          <span className="px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-lg">Suspended</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiMail className="w-4 h-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <FiUser className="w-4 h-4" />
                        <span className="text-sm">@{user.username}</span>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        placeholder="Full Name"
                        value={formState?.fullName || ''} 
                        onChange={(e) => onChange('fullName', e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        placeholder="Email"
                        value={formState?.email || ''} 
                        onChange={(e) => onChange('email', e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        placeholder="Username"
                        value={formState?.username || ''} 
                        onChange={(e) => onChange('username', e.target.value)} 
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <FiDollarSign className="w-4 h-4" />
                  <span>Balance</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {formatBalance(user)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-200">
              <div className="text-xs text-gray-400 mb-1">User ID</div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-mono text-white truncate">{truncateMiddle(user.id || user.raw?.userId)}</div>
                <button 
                  onClick={() => copyId(user.id || user.raw?.userId)} 
                  title="Copy ID" 
                  className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FiCopy className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-200">
              <div className="text-xs text-gray-400 mb-1">Subscription Plan</div>
              {!editing ? (
                <div className="text-sm font-semibold text-white">{user.subscriptionPlan}</div>
              ) : (
                <select 
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none"
                  value={formState?.subscriptionPlan} 
                  onChange={(e) => onChange('subscriptionPlan', e.target.value)}
                >
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

            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-200">
              <div className="text-xs text-gray-400 mb-1">Status</div>
              {!editing ? (
                <div className="text-sm font-semibold text-white">
                  {user.isDisabled ? '🔴 Suspended' : user.verified ? '✅ Verified' : '⚪ Active'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="verified"
                    checked={!!formState?.verified} 
                    onChange={(e) => onChange('verified', e.target.checked)}
                    className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-violet-600 focus:ring-2 focus:ring-violet-500"
                  />
                  <label htmlFor="verified" className="text-sm text-white cursor-pointer">Verified</label>
                </div>
              )}
            </div>

            <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-200">
              <div className="text-xs text-gray-400 mb-1">Date Joined</div>
              <div className="text-sm font-semibold text-white">{user.dateJoined}</div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-violet-400" />
              Personal Information
            </h3>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Gender</label>
                  {!editing ? (
                    <div className="text-white">{user.raw?.gender || 'Not specified'}</div>
                  ) : (
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none"
                      value={formState?.gender || ''} 
                      onChange={(e) => onChange('gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Man">Man</option>
                      <option value="Woman">Woman</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Date of Birth</label>
                  {!editing ? (
                    <div className="text-white">{user.raw?.dateOfBirth ? new Date(user.raw.dateOfBirth).toLocaleDateString() : 'Not specified'}</div>
                  ) : (
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                      value={formState?.dateOfBirth || ''} 
                      onChange={(e) => onChange('dateOfBirth', e.target.value)} 
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Age Range Preference</label>
                  {!editing ? (
                    <div className="text-white">{user.raw?.ageRange ? `${user.raw.ageRange.start} - ${user.raw.ageRange.end} years` : 'Not specified'}</div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-20 px-3 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        value={formState?.ageRange?.start || 18} 
                        onChange={(e) => onChange('ageRange', { ...formState.ageRange, start: parseInt(e.target.value) })} 
                      />
                      <span className="text-gray-400">to</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-20 px-3 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        value={formState?.ageRange?.end || 35} 
                        onChange={(e) => onChange('ageRange', { ...formState.ageRange, end: parseInt(e.target.value) })} 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Referral Code</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white font-mono">
                      {user.raw?.referralCode || 'Not available'}
                    </div>
                    {user.raw?.referralCode && (
                      <button 
                        onClick={() => copyId(user.raw?.referralCode)} 
                        className="p-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors"
                      >
                        <FiCopy className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Can Withdraw</label>
                  {!editing ? (
                    <div className="text-white">{user.raw?.canWithdraw ? '✅ Yes' : '❌ No'}</div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="canWithdraw"
                        checked={!!formState?.canWithdraw} 
                        onChange={(e) => onChange('canWithdraw', e.target.checked)}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-violet-600 focus:ring-2 focus:ring-violet-500"
                      />
                      <label htmlFor="canWithdraw" className="text-sm text-white cursor-pointer">Allow withdrawals</label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Account Disabled</label>
                  {!editing ? (
                    <div className="text-white">{user.raw?.isDisabled ? '🔴 Yes' : '✅ No'}</div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="isDisabled"
                        checked={!!formState?.isDisabled} 
                        onChange={(e) => onChange('isDisabled', e.target.checked)}
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-2 focus:ring-red-500"
                      />
                      <label htmlFor="isDisabled" className="text-sm text-white cursor-pointer">Disable account</label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-violet-400" />
              Location & Preferences
            </h3>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Location</label>
                  {!editing ? (
                    <div className="text-white">{[user.raw?.city, user.raw?.state, user
                      .raw?.country].filter(Boolean).join(', ') || 'Not specified'}</div>
                  ) : (
                    <div className="space-y-2">
                      <input 
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        placeholder="City" 
                        value={formState?.city || ''} 
                        onChange={(e) => onChange('city', e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        placeholder="State" 
                        value={formState?.state || ''} 
                        onChange={(e) => onChange('state', e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        placeholder="Country" 
                        value={formState?.country || ''} 
                        onChange={(e) => onChange('country', e.target.value)} 
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Search Distance</label>
                  {!editing ? (
                    <div className="text-white">{user.raw?.distance ?? 50} km</div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                        value={formState?.distance || 50} 
                        onChange={(e) => onChange('distance', parseInt(e.target.value))} 
                      />
                      <span className="text-gray-400">km</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Privacy Settings</label>
                  {!editing ? (
                    <div className="space-y-2">
                      <div className="text-white">Show Distance: {user.raw?.showDistance ? '✅ Yes' : '❌ No'}</div>
                      <div className="text-white">Show Online Status: {user.raw?.showOnlineStatus ? '✅ Yes' : '❌ No'}</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="showDistance"
                          checked={!!formState?.showDistance} 
                          onChange={(e) => onChange('showDistance', e.target.checked)}
                          className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-violet-600 focus:ring-2 focus:ring-violet-500"
                        />
                        <label htmlFor="showDistance" className="text-sm text-white cursor-pointer">Show distance to others</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="showOnlineStatus"
                          checked={!!formState?.showOnlineStatus} 
                          onChange={(e) => onChange('showOnlineStatus', e.target.checked)}
                          className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-violet-600 focus:ring-2 focus:ring-violet-500"
                        />
                        <label htmlFor="showOnlineStatus" className="text-sm text-white cursor-pointer">Show online status</label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Interests */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiHeart className="w-5 h-5 text-violet-400" />
              Bio & Interests
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Bio</label>
                {!editing ? (
                  <div className="text-white whitespace-pre-wrap">{user.raw?.bio || 'No bio added yet'}</div>
                ) : (
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none" 
                    rows="4" 
                    placeholder="Write a bio..."
                    value={formState?.bio || ''} 
                    onChange={(e) => onChange('bio', e.target.value)} 
                  />
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Hobbies</label>
                  {!editing ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(user.raw?.hobbies) && user.raw.hobbies.length > 0 ? (
                        user.raw.hobbies.map((hobby, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-violet-500/20 text-violet-300 rounded-lg text-sm">
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No hobbies added</span>
                      )}
                    </div>
                  ) : (
                    <input 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                      placeholder="Comma separated (e.g., Reading, Gaming, Cooking)" 
                      value={formState?.hobbies?.join(', ') || ''} 
                      onChange={(e) => onArrayChange('hobbies', e.target.value)} 
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Interests</label>
                  {!editing ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(user.raw?.interests) && user.raw.interests.length > 0 ? (
                        user.raw.interests.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No interests added</span>
                      )}
                    </div>
                  ) : (
                    <input 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                      placeholder="Comma separated (e.g., Music, Travel, Sports)" 
                      value={formState?.interests?.join(', ') || ''} 
                      onChange={(e) => onArrayChange('interests', e.target.value)} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiCalendar className="w-5 h-5 text-violet-400" />
              Additional Information
            </h3>
            <div className="grid lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Affiliates</label>
                <div className="text-white">
                  {Array.isArray(user.raw?.affiliates) && user.raw.affiliates.length > 0 
                    ? user.raw.affiliates.join(', ') 
                    : 'None'}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Blocked Users</label>
                <div className="text-white">
                  {Array.isArray(user.raw?.blockedUsers) && user.raw.blockedUsers.length > 0 
                    ? user.raw.blockedUsers.length 
                    : '0'} users
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Profile Verification</label>
                {!editing ? (
                  <div className="text-white">{user.raw?.profileVerification ? '✅ Verified' : '⏳ Pending'}</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="profileVerification"
                      checked={!!formState?.profileVerification} 
                      onChange={(e) => onChange('profileVerification', e.target.checked)}
                      className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-violet-600 focus:ring-2 focus:ring-violet-500"
                    />
                    <label htmlFor="profileVerification" className="text-sm text-white cursor-pointer">Profile verified</label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4">Timestamps</h3>
            <div className="grid lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Account Created</label>
                <div className="text-white text-sm">
                  {user.raw?.createdAt ? new Date(user.raw.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }) : 'Not available'}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Last Updated</label>
                <div className="text-white text-sm">
                  {user.raw?.updatedAt ? new Date(user.raw.updatedAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }) : 'Not available'}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Date Joined</label>
                <div className="text-white text-sm">
                  {user.raw?.dateJoined ? new Date(user.raw.dateJoined).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }) : 'Not available'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="text-gray-400 mb-2">No user selected</div>
          <div className="text-sm text-gray-500">Select a user from the list to view their profile</div>
        </div>
      )}
    </Modal>
  );
}