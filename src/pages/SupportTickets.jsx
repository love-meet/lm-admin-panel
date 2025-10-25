import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiMessageSquare, FiSend, FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import { deleteTicket } from '../api/admin';

const formatDate = (s) => new Date(s).toLocaleString();

const StatusBadge = ({ status }) => {
  const color =
    status === 'open'
      ? 'text-green-400'
      : status === 'closed'
      ? 'text-gray-400'
      : 'text-yellow-400';
  return <span className={`${color} font-medium capitalize`}>{status}</span>;
};

const SupportTickets = () => {
  const { hasPermission, admin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const { ticketId } = useParams();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [joinedTickets, setJoinedTickets] = useState(new Set());

  const chatEndRef = useRef(null);

  const normalizeTicket = (ticket) => ({
    ...ticket,
    id: ticket.ticketId || ticket.id,
    user: typeof ticket.user === 'object' ? ticket.user.userName || ticket.user.email || 'Unknown' : ticket.user,
    thread: ticket.messages || ticket.thread || [],
    status: ticket.status || 'open',
    subject: ticket.description || ticket.subject || ticket.issueLabel || 'Support Request',
    category: ticket.issueLabel || ticket.category,
    issueType: ticket.issueType
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected, tickets]);

  useEffect(() => {
    if (ticketId) setSelected(ticketId);
  }, [ticketId]);

  // **FIX: Join ticket as admin when selecting**
  useEffect(() => {
    if (selected && admin && !joinedTickets.has(selected)) {
      console.log('🔄 Admin joining ticket:', selected);
      
      const adminId = admin?.userId || admin?._id || admin?.id;
      const adminName = admin?.name || admin?.username || 'Admin';
      
      // Use the correct backend event: admin-join-ticket
      socket.emit('admin-join-ticket', {
        ticketId: selected,
        adminId: adminId,
        adminName: adminName
      });

      // Mark this ticket as joined
      setJoinedTickets(prev => new Set(prev).add(selected));
    }
  }, [selected, admin, joinedTickets]);

  useEffect(() => {
    console.log('📡 Connecting to IssueTicket socket...');
    setLoading(true);

    socket.emit('get-all-tickets');

    socket.on('all-tickets', (data) => {
      console.log('🎟️ Received all tickets:', data);
      let ticketList = [];
      if (Array.isArray(data)) {
        ticketList = data;
      } else if (data?.tickets && Array.isArray(data.tickets)) {
        ticketList = data.tickets;
      }
      setTickets(ticketList.map(normalizeTicket));
      setLoading(false);
    });

    socket.on('new-ticket-alert', (alertData) => {
      console.log('🔔 New ticket alert:', alertData);
      const newTicket = normalizeTicket({
        ticketId: alertData.ticketId,
        id: alertData.ticketId,
        category: alertData.issueType,
        issueLabel: alertData.issueType,
        status: 'open',
        subject: alertData.description,
        description: alertData.description,
        user: alertData.user,
        updatedAt: alertData.createdAt,
        createdAt: alertData.createdAt,
        messages: [],
        priority: alertData.priority,
        issueType: alertData.issueId
      });
      setTickets((prev) => {
        const exists = prev.some(t => t.id === newTicket.id);
        if (!exists) {
          return [newTicket, ...prev];
        }
        return prev;
      });
    });

    // **FIX: Handle admin-joined event (when admin successfully joins)**
    socket.on('admin-joined', (data) => {
      console.log('✅ Admin successfully joined ticket:', data);
      if (data.ticket) {
        const normalizedTicket = normalizeTicket(data.ticket);
        setTickets((prev) =>
          prev.map((t) => (t.id === normalizedTicket.id ? normalizedTicket : t))
        );
      }
    });

    // **FIX: Enhanced message handling**
    const handleNewMessage = (msg) => {
      console.log('📨 Received new message:', msg);
      
      const mappedMsg = {
        from: msg.role === 'admin' ? 'admin' : msg.role === 'system' ? 'system' : 'user',
        text: msg.message,
        message: msg.message,
        sender: msg.sender,
        timestamp: msg.timestamp,
        at: msg.timestamp,
        time: msg.time,
        senderId: msg.senderId,
        role: msg.role,
        id: msg.id
      };

      console.log('✅ Adding message to ticket:', msg.ticketId);
      
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === msg.ticketId) {
            // Avoid duplicate messages by checking id
            const messageExists = t.thread?.some(m => m.id === mappedMsg.id);
            
            if (messageExists) {
              console.log('⏭️ Message already exists, skipping');
              return t;
            }

            const updatedThread = [...(t.thread || []), mappedMsg];
            return {
              ...t,
              thread: updatedThread,
              lastActivity: mappedMsg.timestamp,
              updatedAt: mappedMsg.timestamp
            };
          }
          return t;
        })
      );
    };

    socket.on('new-message', handleNewMessage);

    // Handle admin connected notification
    socket.on('admin-connected', (data) => {
      console.log('👨‍💼 Admin connected to ticket:', data);
    });

    socket.on('ticket-updated', (updatedTicket) => {
      console.log('🔄 Ticket updated:', updatedTicket);
      const normalized = normalizeTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) => (t.id === normalized.id ? normalized : t))
      );
    });

    socket.on('ticket-closed', (data) => {
      console.log('🔒 Ticket closed:', data);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === data.ticket?.ticketId || t.id === data.ticketId
            ? { ...t, status: 'closed', closeReason: data.ticket?.closeReason }
            : t
        )
      );
    });

    socket.on('user-typing', (data) => {
      console.log('⌨️ User typing:', data);
      // You can add typing indicator UI here if needed
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      if (error.message) {
        alert(error.message);
      }
    });

    socket.on('connect', () => console.log('✅ Connected to socket', socket.id));
    socket.on('disconnect', () => console.log('❌ Disconnected from socket'));
    socket.on('connect_error', (err) => {
      console.error('⚠️ Socket connection error:', err);
      setLoading(false);
    });

    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⏱️ Timeout: No response from socket');
        setLoading(false);
      }
    }, 6000);

    return () => {
      clearTimeout(timeout);
      socket.off('all-tickets');
      socket.off('new-ticket-alert');
      socket.off('admin-joined');
      socket.off('new-message');
      socket.off('admin-connected');
      socket.off('ticket-updated');
      socket.off('ticket-closed');
      socket.off('user-typing');
      socket.off('error');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [loading]);

  const current = tickets.find((t) => t.id === selected);

  const sendReply = () => {
    if (!reply.trim() || !current) return;

    console.log('📤 Admin sending reply to ticket:', current.id);

    const msg = {
      ticketId: current.id,
      message: reply.trim(),
      role: 'admin'
    };

    console.log('📤 Sending message:', msg);
    socket.emit('send-message', msg);
    
    setReply('');
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to permanently delete this ticket? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      if (selected === ticketId) {
        setSelected(null);
      }
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      alert('Failed to delete ticket. Please try again.');
    }
  };

  const handleCloseTicket = (ticketId, reason) => {
    socket.emit('close-ticket', {
      ticketId,
      reason: reason || 'Issue resolved'
    });
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (categoryFilter !== 'All' && ticket.category !== categoryFilter)
        return false;
      if (statusFilter !== 'All' && ticket.status !== statusFilter)
        return false;
      return true;
    });
  }, [tickets, categoryFilter, statusFilter]);

  const getCategoryLabel = (issueType) => {
    const categoryMap = {
      'deposit': 'Deposit',
      'withdrawal': 'Withdrawal',
      'subscription': 'Subscription',
      'kyc': 'KYC',
      'password': 'Password',
      'account': 'Account',
      'payment': 'Payment',
      'technical': 'Technical',
      'billing': 'Billing',
      'other': 'Issue'
    };
    return categoryMap[issueType] || issueType || 'Issue';
  };

  return (
    <div className="min-h-screen bg-[#0e0f11] text-white p-8">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Support Tickets</h2>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading support tickets...</p>
              </div>
            </div>
          )}

          {!loading && (
            <div className="mb-4 space-y-4">
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
                  {[
                    { label: 'Withdrawal Issues', value: 'withdrawal' },
                    { label: 'Deposit Issues', value: 'deposit' },
                    { label: 'Other', value: 'other' }
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategoryFilter(cat.label)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                        categoryFilter === cat.label
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-[#3a3b3f]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1a1b1e] border border-[#2a2b2f] text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}

          {!loading &&
            filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`rounded-xl p-5 bg-[#1a1b1e] border ${
                  selected === t.id
                    ? 'border-[#3b82f6]'
                    : 'border-transparent'
                } hover:border-[#3b82f6]/50 transition cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[15px] text-green-400 font-medium">
                    {t.category || getCategoryLabel(t.issueType)}
                  </span>
                  <div className="flex items-center gap-2">
                    {t.priority && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        t.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        t.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {t.priority}
                      </span>
                    )}
                    <StatusBadge status={t.status} />
                  </div>
                </div>
                <div className="text-lg font-semibold text-white">
                  {t.subject}
                </div>
                <div className="text-sm text-gray-400 mt-1 flex items-center justify-between">
                  <span>{t.user}</span>
                  <span>{formatDate(t.updatedAt || t.createdAt)}</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  ID: {t.id}
                </div>
              </div>
            ))}

          {!loading && filteredTickets.length === 0 && (
            <div className="text-gray-500 text-center py-10">
              No tickets found matching the selected filters.
            </div>
          )}
        </div>

        <div className="bg-[#1a1b1e] rounded-xl flex flex-col h-[80vh]">
          {!current ? (
            <div className="flex flex-col justify-center items-center flex-1 text-gray-400">
              <FiMessageSquare className="text-5xl mb-3" />
              <p>Select a ticket to view conversation</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-[#2a2b2f]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{current.subject}</div>
                    <div className="text-sm text-gray-400">
                      {current.user} • {current.id} •{' '}
                      <StatusBadge status={current.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {current.status !== 'closed' && hasPermission('respond_support_tickets') && (
                      <button
                        onClick={() => handleCloseTicket(current.id, 'Resolved by admin')}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded-lg transition-colors text-sm"
                        title="Close ticket"
                      >
                        Close
                      </button>
                    )}
                    {hasPermission('delete_support_tickets') && (
                      <button
                        onClick={() => handleDeleteTicket(current.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete ticket"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {current.thread && current.thread.length > 0 ? (
                  current.thread.map((m, i) => (
                    <div
                      key={m.id || i}
                      className={`flex ${
                        m.from === 'admin' || m.role === 'admin' ? 'justify-end' : 
                        m.from === 'system' || m.role === 'system' ? 'justify-center' : 
                        'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          m.from === 'admin' || m.role === 'admin'
                            ? 'bg-[#2563eb] text-white'
                            : m.from === 'system' || m.role === 'system'
                            ? 'bg-[#1a1b1e] text-gray-400 text-sm italic'
                            : 'bg-[#2a2b2f] text-gray-200'
                        }`}
                      >
                        <div className="text-xs opacity-75 mb-1">
                          {m.sender || m.from} • {m.time || formatDate(m.timestamp || m.at)}
                        </div>
                        <div>{m.message || m.text || 'Empty message'}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No messages yet. Admin will see messages once you join the ticket.
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-[#2a2b2f] flex items-center gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendReply()}
                  placeholder="Type your reply..."
                  disabled={current.status === 'closed'}
                  className="flex-1 px-3 py-2 bg-[#2a2b2f] border border-[#3a3b3e] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {hasPermission('respond_support_tickets') && (
                  <button
                    onClick={sendReply}
                    disabled={current.status === 'closed' || !reply.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend className="w-4 h-4" /> Send
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;