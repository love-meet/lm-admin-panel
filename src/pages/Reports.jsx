import React, { useMemo, useState, useEffect } from 'react';
import adminApi from '../api/admin';
import { toast } from 'sonner';
import { FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';

const Reports = () => {
  const [reports, setReports] = useState([
    { id: 'RPT-2001', item: 'Post #1892', by: 'jane_doe', reason: 'Harassment', date: '2025-09-24T08:30:00Z', contentId: 'POST-1892', preview: 'This is offensive content...' },
    { id: 'RPT-2002', item: 'Comment #339', by: 'bob', reason: 'Spam', date: '2025-09-23T13:15:00Z', contentId: 'CMT-339', preview: 'Click here to win $$$' },
    { id: 'RPT-2003', item: 'User @troll', by: 'alice', reason: 'Abusive language', date: '2025-09-22T19:00:00Z', contentId: 'USR-troll', preview: 'Reported user profile' },
  ]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getReports();
        console.log('[reports] getReports raw', res);
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        if (list.length) setReports(list);
      } catch (e) {
        console.error('[reports] load error', e);
      }
    };
    load();
  }, []);

  const formatDate = (s) => new Date(s).toLocaleString();

  const filtered = useMemo(() => {
    const q = search.toLowerCase(); 
    return reports.filter((r) =>
      [r.id, r.item, r.by, r.reason].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [reports, search]);

  const deleteReport = (id) => {
    if (window.confirm('Delete this report?')) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Report deleted');
      console.log('[reports] local delete report', id);
      // TODO: call backend delete endpoint if available
    }
  };

  const reviewAction = (action) => {
    // Try to map actions to backend endpoints where possible
    (async () => {
      const id = selected?.id;
      try {
        if (action === 'Dismiss Report') {
          // No clear server endpoint available in adminApi — perform local dismiss
          setReports((prev) => prev.filter((r) => r.id !== id));
          toast.success('Report dismissed');
          console.log('[reports] dismissed report', id);
        } else if (action === 'Delete Content') {
          // Backend endpoint unknown. Local cleanup + log.
          setReports((prev) => prev.filter((r) => r.id !== id));
          toast.success('Content deleted (local)');
          console.log('[reports] delete content (local) for', id);
          // TODO: call server endpoint to delete content when available
        } else if (action === 'Suspend User') {
          // Map to adminApi.disableUser if report contains user id
          const reportedBy = selected?.by;
          // Attempt to find numeric/uuid id in selected.contentId or selected.by; if not available we log
          const maybeUserId = selected?.contentId || reportedBy || null;
          if (!maybeUserId) {
            toast.error('No user id available to suspend');
            return;
          }
          try {
            await adminApi.disableUser(maybeUserId);
            toast.success('User suspended');
            console.log('[reports] suspended user', maybeUserId);
            // Optionally remove report from list
            setReports((prev) => prev.filter((r) => r.id !== id));
          } catch (err) {
            console.error('[reports] suspend user error', err);
            toast.error('Failed to suspend user');
          }
        }
      } catch (err) {
        console.error('[reports] reviewAction error', err);
        toast.error('Action failed');
      } finally {
        setSelected(null);
      }
    })();
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Reports</h2>
          <p className="text-[var(--color-text-secondary)]">Review user-reported content and take action.</p>
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-6 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[var(--color-text-muted)]" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, item, reporter, or reason"
              className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
              <thead className="bg-[var(--color-bg-tertiary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Report ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Reported Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{r.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{r.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{r.by}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{r.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{formatDate(r.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelected(r)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        title="Review"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteReport(r.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                        title="Delete Report"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[var(--color-text-secondary)]">No reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-xl w-full max-w-2xl">
              <div className="px-6 py-4 border-b border-[var(--color-bg-tertiary)] flex justify-between items-center">
                <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Review Report {selected.id}</h3>
                <button onClick={() => setSelected(null)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                  <div className="text-sm text-[var(--color-text-secondary)]">Reported Item</div>
                  <div className="text-[var(--color-text-primary)] font-medium">{selected.item} ({selected.contentId})</div>
                  <div className="mt-2 text-sm text-[var(--color-text-secondary)]">Preview</div>
                  <div className="text-[var(--color-text-primary)]">{selected.preview}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-[var(--color-text-secondary)]">Reported By</span><div className="text-[var(--color-text-primary)]">{selected.by}</div></div>
                  <div><span className="text-[var(--color-text-secondary)]">Reason</span><div className="text-[var(--color-text-primary)]">{selected.reason}</div></div>
                  <div><span className="text-[var(--color-text-secondary)]">Date</span><div className="text-[var(--color-text-primary)]">{formatDate(selected.date)}</div></div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => reviewAction('Dismiss Report')} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-90">Dismiss Report</button>
                  <button onClick={() => reviewAction('Delete Content')} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Delete Content</button>
                  <button onClick={() => reviewAction('Suspend User')} className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">Suspend User</button>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--color-bg-tertiary)] flex justify-end">
                <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
