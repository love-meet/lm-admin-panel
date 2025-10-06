import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiMessageSquare, FiCornerUpLeft, FiSend } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const initialTickets = [
  {
    id: 'TCK-3001',
    user: 'jane_doe',
    subject: 'Payment failed for subscription',
    status: 'Open',
    updatedAt: '2025-09-24T12:20:00Z',
    thread: [
      { from: 'jane_doe', at: '2025-09-24T10:10:00Z', text: 'Hi, my payment failed even though my card is valid.' },
      { from: 'admin', at: '2025-09-24T10:30:00Z', text: 'Thanks for reaching out. Could you confirm the last 4 digits of your card?' },
    ],
  },
  {
    id: 'TCK-3002',
    user: 'bob',
    subject: 'Question about invoice #842',
    status: 'Closed',
    updatedAt: '2025-09-22T09:00:00Z',
    thread: [
      { from: 'bob', at: '2025-09-21T19:15:00Z', text: 'Can I get a copy of invoice #842?' },
      { from: 'admin', at: '2025-09-21T19:30:00Z', text: 'Sure, I have emailed it to your registered address.' },
      { from: 'bob', at: '2025-09-21T20:00:00Z', text: 'Got it. Thanks!' },
    ],
  },
];

const StatusBadge = ({ status }) => (
  <span className="px-2 py-1 rounded text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">{status}</span>
);

const formatDate = (s) => new Date(s).toLocaleString();

const SupportTickets = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // selected ticket id
  const [reply, setReply] = useState('');
  const navigate = useNavigate();
  const { ticketId } = useParams();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tickets.filter((t) =>
      [t.id, t.user, t.subject, t.status].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [tickets, search]);

  // If URL param ticketId is present, ensure it's selected; update selection when param changes
  useEffect(() => {
    if (ticketId) {
      setSelected(ticketId);
    } else {
      setSelected(null);
    }
  }, [ticketId]);

  const current = tickets.find((t) => t.id === selected) || null;

  const sendReply = () => {
    if (!reply.trim() || !current) return;
    const newMessage = { from: 'admin', at: new Date().toISOString(), text: reply.trim() };
    setTickets((prev) =>
      prev.map((t) => (t.id === current.id ? { ...t, thread: [...t.thread, newMessage], updatedAt: newMessage.at, status: 'Open' } : t))
    );
    setReply('');
  };

  const closeTicket = (id) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Closed' } : t)));
  };

  const reopenTicket = (id) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Open' } : t)));
  };

  return (
    <div className="p-8 bg-[var(--color-bg-primary)] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Support Tickets</h2>
            <p className="text-[var(--color-text-secondary)]">View and reply to user issues about payment or other concerns.</p>
          </div>
        </div>

        {!current ? (
          <>
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg p-6 mb-6">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-[var(--color-text-muted)]" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, user, subject, or status"
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--color-bg-tertiary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--color-bg-tertiary)]">
                  <thead className="bg-[var(--color-bg-tertiary)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-bg-tertiary)]">
                    {filtered.map((t) => (
                      <tr key={t.id} className="hover:bg-[var(--color-bg-tertiary)] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{t.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{t.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{t.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={t.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">{formatDate(t.updatedAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/tickets/${t.id}`)}
                            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            title="View / Reply"
                          >
                            <FiMessageSquare className="w-4 h-4" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-text-secondary)]">No tickets found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-[var(--color-bg-tertiary)] flex items-center justify-between">
              <div>
                <button onClick={() => navigate('/tickets')} className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                  <FiCornerUpLeft className="w-4 h-4" /> Back to Tickets
                </button>
                <div className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">{current.subject}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Ticket {current.id} • {current.user} • <StatusBadge status={current.status} /></div>
              </div>
              <div className="flex gap-2">
                {current.status === 'Open' ? (
                  <button onClick={() => closeTicket(current.id)} className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Mark Closed</button>
                ) : (
                  <button onClick={() => reopenTicket(current.id)} className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] hover:opacity-90">Reopen</button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {current.thread.map((m, idx) => (
                <div key={idx} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${m.from === 'admin' ? 'bg-blue-600 text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'}`}>
                    <div className="text-xs opacity-80 mb-1">{m.from} • {formatDate(m.at)}</div>
                    <div>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[var(--color-bg-tertiary)]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button onClick={sendReply} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary-cyan)] text-white hover:opacity-90">
                  <FiSend className="w-4 h-4" /> Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
