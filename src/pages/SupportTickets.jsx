import React, { useMemo, useState, useEffect } from 'react';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const initialTickets = [
  { id: 'TCK-3001', user: 'jane_doe', subject: 'Payment failed for subscription', status: 'Open', category: 'Issue', subcategory: 'Payment Issue', updatedAt: '2025-09-24T12:20:00Z', thread: [{ from: 'jane_doe', at: '2025-09-24T10:10:00Z', text: 'Hi, my payment failed even though my card is valid.' }] },
  { id: 'TCK-3002', user: 'bob', subject: 'Question about invoice #842', status: 'Closed', category: 'Issue', subcategory: 'Subscription Issue', updatedAt: '2025-09-22T09:00:00Z', thread: [{ from: 'bob', at: '2025-09-21T19:15:00Z', text: 'Can I get a copy of invoice #842?' }] },
  { id: 'TCK-3003', user: 'alice', subject: 'Cannot login to account', status: 'Open', category: 'Issue', subcategory: 'Login Issue', updatedAt: '2025-09-25T08:15:00Z', thread: [{ from: 'alice', at: '2025-09-25T08:00:00Z', text: 'I forgot my password and the reset link is not working.' }] },
  { id: 'TCK-3004', user: 'charlie', subject: 'Withdrawal request stuck', status: 'Open', category: 'Withdrawal', updatedAt: '2025-09-25T10:30:00Z', thread: [{ from: 'charlie', at: '2025-09-25T10:00:00Z', text: 'My withdrawal request has been pending for 3 days.' }] },
  { id: 'TCK-3005', user: 'diana', subject: 'Deposit not showing up', status: 'Closed', category: 'Deposit', updatedAt: '2025-09-23T14:20:00Z', thread: [{ from: 'diana', at: '2025-09-23T12:00:00Z', text: 'I made a deposit but it is not showing in my balance.' }] },
];

const formatDate = (s) => new Date(s).toLocaleString();

const StatusBadge = ({ status }) => {
  const color =
    status === 'Open'
      ? 'text-green-400'
      : status === 'Closed'
      ? 'text-gray-400'
      : 'text-red-400';
  return <span className={`${color} font-medium`}>{status}</span>;
};

const SupportTickets = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const { ticketId } = useParams();
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('All'); // All, Withdrawal, Deposit, Issue
  const [statusFilter, setStatusFilter] = useState('All'); // All, Open, Closed

  useEffect(() => {
    if (ticketId) setSelected(ticketId);
  }, [ticketId]);

  const current = tickets.find((t) => t.id === selected);

  const sendReply = () => {
    if (!reply.trim() || !current) return;
    const newMessage = { from: 'admin', at: new Date().toISOString(), text: reply.trim() };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === current.id
          ? { ...t, thread: [...t.thread, newMessage], updatedAt: newMessage.at }
          : t
      )
    );
    setReply('');
  };

  // Filter tickets based on category and status
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Category filter
      if (categoryFilter !== 'All' && ticket.category !== categoryFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'All' && ticket.status !== statusFilter) {
        return false;
      }
      
      return true;
    });
  }, [tickets, categoryFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-[#0e0f11] text-white p-8">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Support Tickets</h2>
          
          {/* Filter Controls */}
          <div className="mb-4 space-y-4">
            {/* Category Button Switch */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('All')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1a1b1e] text-gray-300 hover:bg-[#2a2b2f]'
                }`}
              >
                All
              </button>
              <div className="flex gap-1 p-1 bg-[#2a2b2f] rounded-full">
                <button
                  onClick={() => setCategoryFilter('Withdrawal')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                    categoryFilter === 'Withdrawal'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-[#3a3b3f]'
                  }`}
                >
                  Withdrawal
                </button>
                <button
                  onClick={() => setCategoryFilter('Deposit')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                    categoryFilter === 'Deposit'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-[#3a3b3f]'
                  }`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setCategoryFilter('Issue')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                    categoryFilter === 'Issue'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-[#3a3b3f]'
                  }`}
                >
                  Issues
                </button>
              </div>
            </div>
            
            {/* Status Dropdown Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1a1b1e] border border-[#2a2b2f] text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          
          {/* Ticket List */}
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`rounded-xl p-5 bg-[#1a1b1e] border ${
                selected === t.id ? 'border-[#3b82f6]' : 'border-transparent'
              } hover:border-[#3b82f6]/50 transition cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[15px] text-green-400 font-medium">
                  {t.category}
                </span>
                <StatusBadge status={t.status} />
              </div>
              <div className="text-lg font-semibold text-white">
                {t.subject}
              </div>
              <div className="text-sm text-gray-400 mt-1 flex items-center justify-between">
                <span>{t.user}</span>
                <span>{formatDate(t.updatedAt)}</span>
              </div>
              <div className="text-gray-500 text-xs mt-1">
                ID: {t.id}
                {t.subcategory ? ` • ${t.subcategory}` : ''}
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="text-gray-500 text-center py-10">No tickets found matching the selected filters.</div>
          )}
        </div>

        {/* Chat Area */}
        <div className="bg-[#1a1b1e] rounded-xl flex flex-col h-[80vh]">
          {!current ? (
            <div className="flex flex-col justify-center items-center flex-1 text-gray-400">
              <FiMessageSquare className="text-5xl mb-3" />
              <p>Select a ticket to view conversation</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-[#2a2b2f]">
                <div className="font-semibold text-lg">{current.subject}</div>
                <div className="text-sm text-gray-400">
                  {current.user} • {current.id} •{' '}
                  <StatusBadge status={current.status} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {current.thread.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      m.from === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        m.from === 'admin'
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-[#2a2b2f] text-gray-200'
                      }`}
                    >
                      <div className="text-xs opacity-75 mb-1">
                        {m.from} • {formatDate(m.at)}
                      </div>
                      <div>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#2a2b2f] flex items-center gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-3 py-2 bg-[#2a2b2f] border border-[#3a3b3e] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={sendReply}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm"
                >
                  <FiSend className="w-4 h-4" /> Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;