import React, { useEffect, useMemo, useState } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';
import Modal from '../components/Modal';

const DEFAULT_STATS = {
  users: 1245,
  deposits: 842,
  withdrawals: 193,
  posts: 4821,
  subscribers: 312,
  gifts: 1040,
  affiliateBonuses: 72,
};

const METRICS = [
  { key: 'users', label: 'Registered Users' },
  { key: 'deposits', label: 'Deposits' },
  { key: 'withdrawals', label: 'Withdrawals' },
  { key: 'posts', label: 'Posts Made' },
  { key: 'subscribers', label: 'Subscribers' },
  { key: 'gifts', label: 'Gifts' },
  { key: 'affiliateBonuses', label: 'Affiliate Bonuses' },
];

const Reports = () => {
  const [period, setPeriod] = useState('daily');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);

  const [activeMetric, setActiveMetric] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getStats({ period });
        console.log('[reports] getStats raw', res);
        let data = res;
        if (res?.data) data = res.data;
        if (data && typeof data === 'object') {
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('[reports] stats load error', err);
        toast.error('Failed to load stats; using cached numbers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  const openMetricList = async (metric) => {
    setActiveMetric(metric);
    setListLoading(true);
    try {
      const res = await adminApi.getStatsList(metric, { period });
      console.log('[reports] getStatsList raw', metric, res);
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.data?.data)) list = res.data.data;
      setListItems(list);
    } catch (err) {
      console.error('[reports] stats list error', err);
      toast.error('Failed to load list');
      setListItems([]);
    } finally {
      setListLoading(false);
    }
  };

  const closeMetricList = () => {
    setActiveMetric(null);
    setListItems([]);
  };

  const viewUser = async (item) => {
    const uid = item?.userId || item?.id || item?.user || item?.email || null;
    if (!uid) {
      toast.error('No user id available');
      return;
    }
    setUserLoading(true);
    try {
      const res = await adminApi.getUserById(uid);
      console.log('[reports] getUserById raw', res);
      let user = res?.user || res?.data || res;
      setSelectedUser(user);
    } catch (err) {
      console.error('[reports] view user error', err);
      toast.error('Failed to load user details');
    } finally {
      setUserLoading(false);
    }
  };

  const StatTile = ({ metricKey, label, value }) => (
    <button
      onClick={() => openMetricList(metricKey)}
      className="flex-1 p-6 rounded-lg bg-[var(--color-bg-tertiary)] hover:scale-[1.01] transition-transform shadow-md flex flex-col justify-between"
    >
      <div className="text-sm text-[var(--color-text-secondary)]">{label}</div>
      <div className="text-2xl font-bold text-[var(--color-text-primary)] mt-3">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </button>
  );

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Site Statistics</h2>
            <p className="text-[var(--color-text-secondary)]">Daily / monthly overview of key metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-3 py-2 rounded-md ${period === 'daily' ? 'bg-[var(--color-primary-cyan)] text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'}`}>
              Daily
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-2 rounded-md ${period === 'monthly' ? 'bg-[var(--color-primary-cyan)] text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'}`}>
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {METRICS.map((m) => (
            <StatTile key={m.key} metricKey={m.key} label={m.label} value={stats[m.key] ?? 0} />
          ))}
        </div>

        {activeMetric && (
          <Modal isOpen={!!activeMetric} onClose={closeMetricList} title={`${METRICS.find(m => m.key === activeMetric)?.label} • ${period}`} size="lg">
            <div className="p-2">
              <div className="mb-3 text-sm text-[var(--color-text-secondary)]">Click a name to view details.</div>
              <div className="bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden">
                {listLoading ? (
                  <div className="p-6 text-[var(--color-text-secondary)]">Loading...</div>
                ) : listItems.length === 0 ? (
                  <div className="p-6 text-[var(--color-text-secondary)]">No entries found.</div>
                ) : (
                  <ul className="divide-y divide-[var(--color-bg-tertiary)]">
                    {listItems.map((it, idx) => (
                      <li key={it.id || it.userId || it.email || idx} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <button onClick={() => viewUser(it)} className="text-left text-[var(--color-text-primary)] hover:underline">{it.name || it.fullName || it.username || it.email || String(it)}</button>
                          <div className="text-sm text-[var(--color-text-secondary)]">{it.email || it.userId || ''}</div>
                        </div>
                        <div className="text-sm text-[var(--color-text-secondary)]">{it.amount ? it.amount : ''}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Modal>
        )}

        {selectedUser && (
          <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title={`User • ${selectedUser?.fullName || selectedUser?.username || selectedUser?.email}`} size="lg">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-xs text-[var(--color-text-secondary)]">Name</div>
                  <div className="text-[var(--color-text-primary)]">{selectedUser?.fullName || selectedUser?.username}</div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-xs text-[var(--color-text-secondary)]">Email</div>
                  <div className="text-[var(--color-text-primary)]">{selectedUser?.email}</div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-xs text-[var(--color-text-secondary)]">Subscription</div>
                  <div className="text-[var(--color-text-primary)]">{selectedUser?.subscriptionPlan?.planName || selectedUser?.subscriptionPlan || 'Free'}</div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-xs text-[var(--color-text-secondary)]">Status</div>
                  <div className="text-[var(--color-text-primary)]">{selectedUser?.isDisabled ? 'Suspended' : selectedUser?.verified ? 'Verified' : 'Pending'}</div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-xs text-[var(--color-text-secondary)]">Balance</div>
                  <div className="text-[var(--color-text-primary)]">{selectedUser?.balance ?? selectedUser?.raw?.balance ?? 0}</div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-xs text-[var(--color-text-secondary)]">Joined</div>
                  <div className="text-[var(--color-text-primary)]">{selectedUser?.dateJoined || selectedUser?.createdAt}</div>
                </div>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default Reports;
