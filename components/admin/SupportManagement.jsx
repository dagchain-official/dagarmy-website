"use client";
import React, { useState, useEffect, useCallback } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_META = {
  open:            { label: 'Open',           color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe' },
  in_progress:     { label: 'In Progress',    color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  waiting_on_user: { label: 'Waiting on User',color: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe' },
  resolved:        { label: 'Resolved',       color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
  closed:          { label: 'Closed',         color: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb' },
};
const PRIORITY_META = {
  low:    { label: 'Low',    color: '#6b7280', bg: '#f3f4f6' },
  normal: { label: 'Normal', color: '#6366f1', bg: '#eef2ff' },
  high:   { label: 'High',   color: '#d97706', bg: '#fef3c7' },
  urgent: { label: 'Urgent', color: '#dc2626', bg: '#fee2e2' },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.open;
  return <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: m.bg, color: m.color, border: `1px solid ${m.border}`, whiteSpace: 'nowrap' }}>{m.label}</span>;
}
function PriorityBadge({ priority }) {
  const m = PRIORITY_META[priority] || PRIORITY_META.normal;
  return <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: m.bg, color: m.color, whiteSpace: 'nowrap' }}>{m.label}</span>;
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const inputStyle = { width: '100%', padding: '9px 13px', borderRadius: '9px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff', color: '#0f172a', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px', display: 'block' };

// ── Main Component ────────────────────────────────────────────────────────────
export default function SupportManagement() {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Stats
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const u = JSON.parse(stored);
        setAdminEmail(u.email || '');
        setAdminName(u.full_name || u.name || u.email || 'Admin');
      }
    } catch {}
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      if (filterStatus) params.set('status', filterStatus);
      if (filterPriority) params.set('priority', filterPriority);
      if (filterCategory) params.set('category', filterCategory);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/support/tickets?${params}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
        setTotal(data.total || 0);
        setOpenCount(data.openCount || 0);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filterStatus, filterPriority, filterCategory, search, page]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const openTicketDetail = useCallback(async (ticket) => {
    setActiveTicket(ticket);
    setMsgLoading(true);
    setReplyText('');
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`);
      const data = await res.json();
      if (data.success) { setActiveTicket(data.ticket); setMessages(data.messages || []); }
    } catch (e) { console.error(e); }
    finally { setMsgLoading(false); }
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/support/tickets/${activeTicket.id}/reply`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_type: 'admin', sender_email: adminEmail, sender_name: adminName, message: replyText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setReplyText('');
        // Refresh ticket status in list
        fetchTickets();
        // Update active ticket status locally
        setActiveTicket(prev => prev ? { ...prev, status: prev.status === 'open' ? 'in_progress' : prev.status } : prev);
      }
    } catch (e) { console.error(e); }
    finally { setReplying(false); }
  };

  const updateTicket = async (field, value) => {
    if (!activeTicket) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/support/tickets', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeTicket.id, [field]: value }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveTicket(data.ticket);
        setTickets(prev => prev.map(t => t.id === data.ticket.id ? data.ticket : t));
      }
    } catch (e) { console.error(e); }
    finally { setUpdating(false); }
  };

  const totalPages = Math.ceil(total / 25);

  return (
    <div style={{ padding: '32px 36px', background: '#f6f8fb', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            Support Tickets
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '6px 0 0 50px' }}>Manage and respond to user support requests</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {openCount > 0 && (
            <div style={{ padding: '8px 16px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', fontSize: '13px', fontWeight: '700' }}>
              {openCount} open ticket{openCount !== 1 ? 's' : ''}
            </div>
          )}
          <button onClick={fetchTickets} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            style={{ ...inputStyle, paddingLeft: '34px' }}
            placeholder="Search ticket#, email, subject..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select style={{ ...inputStyle, width: 'auto', minWidth: '130px' }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_on_user">Waiting on User</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select style={{ ...inputStyle, width: 'auto', minWidth: '120px' }} value={filterPriority} onChange={e => { setFilterPriority(e.target.value); setPage(1); }}>
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <select style={{ ...inputStyle, width: 'auto', minWidth: '130px' }} value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="course">Course</option>
          <option value="rewards">Rewards</option>
          <option value="account">Account</option>
          <option value="other">Other</option>
        </select>
        {(filterStatus || filterPriority || filterCategory || search) && (
          <button onClick={() => { setFilterStatus(''); setFilterPriority(''); setFilterCategory(''); setSearch(''); setPage(1); }} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Clear filters
          </button>
        )}
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: activeTicket ? '1fr 1.4fr' : '1fr', gap: '20px', alignItems: 'start' }}>

        {/* ── Ticket Table ── */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {loading ? 'Loading...' : `${total} ticket${total !== 1 ? 's' : ''}`}
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#475569', margin: '0 0 4px' }}>No tickets found</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {tickets.map(ticket => (
                <div key={ticket.id} onClick={() => openTicketDetail(ticket)}
                  style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: activeTicket?.id === ticket.id ? '#f5f3ff' : '#fff', borderLeft: activeTicket?.id === ticket.id ? '3px solid #6366f1' : '3px solid transparent', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (activeTicket?.id !== ticket.id) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { if (activeTicket?.id !== ticket.id) e.currentTarget.style.background = '#fff'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '5px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{ticket.user_email}</div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>{ticket.ticket_number}</span>
                    <span style={{ color: '#cbd5e1', fontSize: '10px' }}>•</span>
                    <PriorityBadge priority={ticket.priority} />
                    <span style={{ color: '#cbd5e1', fontSize: '10px' }}>•</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>{ticket.category}</span>
                    <span style={{ color: '#cbd5e1', fontSize: '10px' }}>•</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{timeAgo(ticket.created_at)}</span>
                  </div>
                </div>
              ))}
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Page {page} of {totalPages}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>Prev</button>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Ticket Detail Panel ── */}
        {activeTicket && (
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Detail header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', lineHeight: '1.4' }}>{activeTicket.subject}</h2>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{activeTicket.user_email} &bull; {fmtDate(activeTicket.created_at)}</div>
                </div>
                <button onClick={() => setActiveTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Controls row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>{activeTicket.ticket_number}</span>

                <select
                  value={activeTicket.status}
                  onChange={e => updateTicket('status', e.target.value)}
                  disabled={updating}
                  style={{ ...inputStyle, width: 'auto', fontSize: '11px', padding: '4px 10px', fontWeight: '700', color: STATUS_META[activeTicket.status]?.color || '#2563eb', background: STATUS_META[activeTicket.status]?.bg || '#dbeafe', border: `1px solid ${STATUS_META[activeTicket.status]?.border || '#bfdbfe'}`, borderRadius: '100px' }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_on_user">Waiting on User</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={activeTicket.priority}
                  onChange={e => updateTicket('priority', e.target.value)}
                  disabled={updating}
                  style={{ ...inputStyle, width: 'auto', fontSize: '11px', padding: '4px 10px', fontWeight: '700', color: PRIORITY_META[activeTicket.priority]?.color || '#6366f1', background: PRIORITY_META[activeTicket.priority]?.bg || '#eef2ff', borderRadius: '100px', border: '1px solid #e2e8f0' }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>{activeTicket.category}</span>

                {activeTicket.assigned_to && (
                  <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: '100px' }}>
                    Assigned: {activeTicket.assigned_to}
                  </span>
                )}
              </div>

              {/* Assign to me */}
              {adminEmail && activeTicket.assigned_to !== adminEmail && (
                <button onClick={() => updateTicket('assigned_to', adminEmail)} disabled={updating} style={{ marginTop: '8px', padding: '5px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                  Assign to me
                </button>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto' }}>
              {msgLoading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '24px' }}>Loading messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '24px' }}>No messages yet</div>
              ) : messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender_type === 'admin' ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: msg.sender_type === 'admin' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={msg.sender_type === 'admin' ? '#fff' : '#64748b'} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div style={{ maxWidth: '78%' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px', textAlign: msg.sender_type === 'admin' ? 'right' : 'left' }}>
                      {msg.sender_type === 'admin' ? (msg.sender_name || 'Admin') : (msg.sender_name || 'User')} &bull; {timeAgo(msg.created_at)}
                    </div>
                    <div style={{ padding: '9px 13px', borderRadius: msg.sender_type === 'admin' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: msg.sender_type === 'admin' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#f1f5f9', color: msg.sender_type === 'admin' ? '#fff' : '#0f172a', fontSize: '13px', lineHeight: '1.6' }}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder="Type your reply... (Enter to send, Shift+Enter for new line)"
                style={{ flex: 1, padding: '10px 13px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', resize: 'none', minHeight: '42px', maxHeight: '100px', lineHeight: '1.5' }}
                rows={2}
              />
              <button onClick={handleReply} disabled={replying || !replyText.trim()} style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: replying || !replyText.trim() ? 'not-allowed' : 'pointer', opacity: replying || !replyText.trim() ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                {replying ? '...' : 'Reply'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
