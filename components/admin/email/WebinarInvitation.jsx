"use client";
import React, { useState, useEffect, useCallback } from 'react';

const BATCH_SIZE = 25;
const LS_SENT_KEY = 'webinar_sent_ids';
const LS_FAILED_KEY = 'webinar_failed_ids';

// Build a proper display name from user fields
function getDisplayName(u) {
  if (u.first_name && u.last_name) return `${u.first_name} ${u.last_name}`.trim();
  if (u.first_name) return u.first_name.trim();
  if (u.full_name && u.full_name.includes(' ') && !u.full_name.includes('@')) return u.full_name.trim();
  if (u.full_name && !u.full_name.includes('@') && u.full_name !== u.email?.split('@')[0]) return u.full_name.trim();
  return '';
}

// Persist helpers
function loadFromLS(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch { return new Set(); }
}

function saveToLS(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {}
}

export default function WebinarInvitation() {
  const [mode, setMode] = useState('test');
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Users list state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent sent/failed state (survives page refresh)
  const [sentUserIds, setSentUserIds] = useState(() => loadFromLS(LS_SENT_KEY));
  const [failedUserIds, setFailedUserIds] = useState(() => loadFromLS(LS_FAILED_KEY));

  // Manual checkbox selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Filter tab: 'all' | 'pending' | 'sent'
  const [viewTab, setViewTab] = useState('pending');

  // Load users on mount
  useEffect(() => {
    setLoadingUsers(true);
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        const allUsers = (d.users || [])
          .filter(u => u.email)
          .map(u => ({ ...u, displayName: getDisplayName(u) }));
        setUsers(allUsers);
      })
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, []);

  // Sync sent/failed to localStorage whenever they change
  useEffect(() => { saveToLS(LS_SENT_KEY, sentUserIds); }, [sentUserIds]);
  useEffect(() => { saveToLS(LS_FAILED_KEY, failedUserIds); }, [failedUserIds]);

  // Derived lists
  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  const pendingUsers = filteredUsers.filter(u => !sentUserIds.has(u.id));
  const sentUsers = filteredUsers.filter(u => sentUserIds.has(u.id));
  const displayedUsers = viewTab === 'sent' ? sentUsers : viewTab === 'pending' ? pendingUsers : filteredUsers;

  // Stats
  const totalUsers = users.length;
  const totalSent = sentUserIds.size;
  const totalRemaining = totalUsers - totalSent;

  // ── Checkbox logic ──────────────────────────────────────────
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      // Only select pending ones from current tab view
      displayedUsers
        .filter(u => !sentUserIds.has(u.id))
        .forEach(u => next.add(u.id));
      return next;
    });
  };

  const deselectAll = () => setSelectedIds(new Set());

  const selectNext25 = () => {
    const unsent = pendingUsers.filter(u => !selectedIds.has(u.id));
    const toSelect = unsent.slice(0, BATCH_SIZE);
    setSelectedIds(prev => {
      const next = new Set(prev);
      toSelect.forEach(u => next.add(u.id));
      return next;
    });
  };

  // How many of selected are actually pending (not already sent)
  const selectedPendingIds = [...selectedIds].filter(id => !sentUserIds.has(id));

  // ── Send selected ────────────────────────────────────────────
  const handleSendSelected = useCallback(async () => {
    if (selectedPendingIds.length === 0) {
      setError('No pending users selected. Please check at least one user to send.');
      return;
    }

    const toSend = selectedPendingIds.slice(0, BATCH_SIZE);
    if (selectedPendingIds.length > BATCH_SIZE) {
      const ok = window.confirm(
        `You selected ${selectedPendingIds.length} users but the limit is ${BATCH_SIZE} per batch.\n` +
        `Only the first ${BATCH_SIZE} will be sent. Continue?`
      );
      if (!ok) return;
    } else {
      const names = users
        .filter(u => toSend.includes(u.id))
        .slice(0, 3)
        .map(u => u.displayName || u.email)
        .join(', ');
      const ok = window.confirm(
        `Send webinar invitation to ${toSend.length} selected user(s)?\n\n` +
        `Preview: ${names}${toSend.length > 3 ? ` ...and ${toSend.length - 3} more` : ''}`
      );
      if (!ok) return;
    }

    setError('');
    setResult(null);
    setSending(true);

    try {
      const res = await fetch('/api/emails/webinar-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'batch', userIds: toSend }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Batch send failed');

      // Persist results
      setSentUserIds(prev => {
        const next = new Set(prev);
        (data.sentUserIds || []).forEach(id => next.add(id));
        return next;
      });
      setFailedUserIds(prev => {
        const next = new Set(prev);
        (data.failedUserIds || []).forEach(id => next.add(id));
        return next;
      });

      // Deselect successfully sent ones
      setSelectedIds(prev => {
        const next = new Set(prev);
        (data.sentUserIds || []).forEach(id => next.delete(id));
        return next;
      });

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }, [selectedPendingIds, users]);

  // ── Send test email ──────────────────────────────────────────
  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      setError('Please enter a test email address');
      return;
    }
    setError('');
    setResult(null);
    setSending(true);
    try {
      const res = await fetch('/api/emails/webinar-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'test', testEmail: testEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setResult(data);
      setTestEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // ── Reset sent state ─────────────────────────────────────────
  const handleResetSent = () => {
    if (!window.confirm('Reset all sent/failed tracking? This will NOT resend emails, but you will lose track of who was already sent.')) return;
    const empty = new Set();
    setSentUserIds(empty);
    setFailedUserIds(empty);
    setSelectedIds(new Set());
    saveToLS(LS_SENT_KEY, empty);
    saveToLS(LS_FAILED_KEY, empty);
  };

  // ── Styles ────────────────────────────────────────────────────
  const tabStyle = (active, color = '#0ea5e9') => ({
    padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '12px', fontWeight: '700',
    border: active ? `2px solid ${color}` : '1.5px solid #e2e8f0',
    background: active ? `${color}15` : '#fff',
    color: active ? color : '#94a3b8',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <div style={{
        padding: '18px 24px 14px',
        borderBottom: '1px solid #e8edf5',
        background: '#fff',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: '800', color: '#0f172a', margin: '0 0 3px' }}>
              Webinar Invitation Email
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Select recipients with checkboxes — progress is saved across page refreshes
            </p>
          </div>
          <button
            onClick={handleResetSent}
            title="Reset sent tracking (does not resend emails)"
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #fecaca',
              background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: '700',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            🔄 Reset Tracking
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 24px' }}>

        {/* Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
          {[
            { label: 'Total Users', value: totalUsers, color: '#6366f1', bg: '#eef2ff' },
            { label: 'Sent ✓', value: totalSent, color: '#10b981', bg: '#f0fdf4' },
            { label: 'Remaining', value: totalRemaining, color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Failed', value: failedUserIds.size, color: '#ef4444', bg: '#fef2f2' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: '12px', padding: '12px 14px',
              border: `1px solid ${s.color}25`,
            }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: s.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Persistence note */}
        <div style={{
          background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
          padding: '10px 14px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '15px' }}>💾</span>
          <span style={{ fontSize: '12px', color: '#15803d', fontWeight: '600' }}>
            Sent progress is automatically saved — refreshing this page will <strong>not</strong> lose your progress.
          </span>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={() => setMode('test')} style={tabStyle(mode === 'test', '#6366f1')}>
            🧪 Test Mode
          </button>
          <button onClick={() => setMode('batch')} style={tabStyle(mode === 'batch', '#0ea5e9')}>
            📧 Batch Send
          </button>
        </div>

        {/* ── Test Mode ── */}
        {mode === 'test' && (
          <div style={{
            background: '#fff', borderRadius: '14px', border: '1px solid #e8edf5',
            padding: '20px', marginBottom: '16px',
          }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>
              Test Email Address
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
                style={{
                  flex: 1, padding: '11px 14px', borderRadius: '10px',
                  border: '1.5px solid #e8edf5', fontSize: '14px', outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e8edf5'}
                onKeyDown={e => { if (e.key === 'Enter') handleSendTest(); }}
              />
              <button
                onClick={handleSendTest}
                disabled={sending || !testEmail.trim()}
                style={{
                  padding: '11px 24px', borderRadius: '10px', border: 'none',
                  background: sending || !testEmail.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: sending || !testEmail.trim() ? '#94a3b8' : '#fff',
                  fontSize: '13px', fontWeight: '700', cursor: sending || !testEmail.trim() ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {sending ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        )}

        {/* ── Batch Mode ── */}
        {mode === 'batch' && (
          <div style={{ marginBottom: '16px' }}>

            {/* Action bar */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: '14px',
              border: '2px solid #0ea5e9', padding: '16px 20px', marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0c4a6e', marginBottom: '3px' }}>
                    📧 Send to Selected Recipients
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    {selectedPendingIds.length > 0
                      ? <><strong style={{ color: '#0284c7' }}>{selectedPendingIds.length}</strong> user{selectedPendingIds.length !== 1 ? 's' : ''} selected (max {BATCH_SIZE}/batch)</>
                      : 'Tick checkboxes below to select who to send to'}
                  </div>
                </div>
                <button
                  onClick={handleSendSelected}
                  disabled={sending || selectedPendingIds.length === 0}
                  style={{
                    padding: '11px 24px', borderRadius: '10px', border: 'none',
                    background: sending || selectedPendingIds.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                    color: sending || selectedPendingIds.length === 0 ? '#94a3b8' : '#fff',
                    fontSize: '13px', fontWeight: '700',
                    cursor: sending || selectedPendingIds.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: selectedPendingIds.length > 0 && !sending ? '0 4px 12px rgba(14,165,233,0.3)' : 'none',
                    whiteSpace: 'nowrap', transition: 'all 0.15s',
                  }}
                >
                  {sending
                    ? `⏳ Sending ${selectedPendingIds.length}...`
                    : selectedPendingIds.length > 0
                      ? `✉️ Send to ${Math.min(selectedPendingIds.length, BATCH_SIZE)} Users`
                      : '✉️ Send Selected'}
                </button>
              </div>

              {/* Progress indicator while sending */}
              {sending && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: '600', marginBottom: '5px' }}>
                    Sending... Please wait, do NOT close this page
                  </div>
                  <div style={{ height: '5px', background: '#bae6fd', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: '100%',
                      background: 'linear-gradient(90deg,#0ea5e9,#0284c7)',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }} />
                  </div>
                </div>
              )}

              <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', color: '#92400e', fontWeight: '600' }}>
                  ⏱️ Max {BATCH_SIZE} emails per batch — wait ~1 hr between batches to avoid SMTP rate limits.
                </div>
              </div>
            </div>

            {/* Quick-select controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Quick Select:</span>
              <button onClick={selectNext25} style={{
                padding: '5px 12px', borderRadius: '6px', border: '1.5px solid #0ea5e9',
                background: '#f0f9ff', color: '#0284c7', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
              }}>
                ⚡ Next 25 Pending
              </button>
              <button onClick={selectAllVisible} style={{
                padding: '5px 12px', borderRadius: '6px', border: '1.5px solid #6366f1',
                background: '#eef2ff', color: '#6366f1', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
              }}>
                ☑️ Select All Visible
              </button>
              <button onClick={deselectAll} style={{
                padding: '5px 12px', borderRadius: '6px', border: '1.5px solid #e2e8f0',
                background: '#f8fafc', color: '#64748b', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
              }}>
                ✖ Deselect All
              </button>
              {selectedIds.size > 0 && (
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700', marginLeft: '4px' }}>
                  ({selectedIds.size} checked)
                </span>
              )}
            </div>

            {/* Search + View tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                style={{
                  flex: 1, minWidth: '180px', padding: '9px 13px', borderRadius: '9px',
                  border: '1.5px solid #e8edf5', fontSize: '13px', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                onBlur={e => e.target.style.borderColor = '#e8edf5'}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { key: 'pending', label: `⏳ Pending (${pendingUsers.length})`, color: '#f59e0b' },
                  { key: 'sent', label: `✅ Sent (${sentUsers.length})`, color: '#10b981' },
                  { key: 'all', label: `👥 All (${filteredUsers.length})`, color: '#6366f1' },
                ].map(t => (
                  <button key={t.key} onClick={() => setViewTab(t.key)} style={tabStyle(viewTab === t.key, t.color)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            {loadingUsers ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '13px' }}>
                Loading users...
              </div>
            ) : (
              <div style={{
                background: '#fff', borderRadius: '14px', border: '1px solid #e8edf5',
                overflow: 'hidden',
              }}>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '44px 36px 1fr 1fr 100px',
                  padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e8edf5',
                  fontSize: '10px', fontWeight: '700', color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  <div>✓</div>
                  <div>#</div>
                  <div>Full Name</div>
                  <div>Email</div>
                  <div style={{ textAlign: 'center' }}>Status</div>
                </div>

                {/* Rows */}
                <div style={{ maxHeight: '420px', overflow: 'auto' }}>
                  {displayedUsers.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      {searchQuery ? 'No users match your search' : viewTab === 'sent' ? 'No emails sent yet' : 'No pending users'}
                    </div>
                  ) : (
                    displayedUsers.map((u, i) => {
                      const isSent = sentUserIds.has(u.id);
                      const isFailed = failedUserIds.has(u.id);
                      const isSelected = selectedIds.has(u.id);

                      return (
                        <div
                          key={u.id}
                          onClick={() => { if (!isSent) toggleSelect(u.id); }}
                          style={{
                            display: 'grid', gridTemplateColumns: '44px 36px 1fr 1fr 100px',
                            padding: '10px 14px',
                            borderBottom: '1px solid #f1f5f9',
                            fontSize: '12.5px', color: isSent ? '#94a3b8' : '#334155',
                            background: isSelected
                              ? '#eff6ff'
                              : isSent
                                ? (i % 2 === 0 ? '#fafffe' : '#f5fdf8')
                                : (i % 2 === 0 ? '#fff' : '#fafbfc'),
                            cursor: isSent ? 'default' : 'pointer',
                            transition: 'background 0.1s',
                          }}
                        >
                          {/* Checkbox */}
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {isSent ? (
                              <span style={{ fontSize: '16px' }}>✅</span>
                            ) : (
                              <div
                                style={{
                                  width: '18px', height: '18px', borderRadius: '5px',
                                  border: isSelected ? '2px solid #0ea5e9' : '2px solid #cbd5e1',
                                  background: isSelected ? '#0ea5e9' : '#fff',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0, transition: 'all 0.1s',
                                }}
                              >
                                {isSelected && (
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Row number */}
                          <div style={{ color: '#94a3b8', fontSize: '11px', paddingTop: '1px' }}>{i + 1}</div>

                          {/* Name */}
                          <div style={{
                            fontWeight: isSent ? '400' : '600',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            textDecoration: isSent ? 'line-through' : 'none',
                            opacity: isSent ? 0.6 : 1,
                          }}>
                            {u.displayName || '—'}
                          </div>

                          {/* Email */}
                          <div style={{
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            color: isSent ? '#94a3b8' : '#64748b',
                            opacity: isSent ? 0.6 : 1,
                          }}>
                            {u.email}
                          </div>

                          {/* Status badge */}
                          <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isSent ? (
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', background: '#f0fdf4', padding: '3px 9px', borderRadius: '5px' }}>Sent ✓</span>
                            ) : isFailed ? (
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#ef4444', background: '#fef2f2', padding: '3px 9px', borderRadius: '5px' }}>Failed</span>
                            ) : isSelected ? (
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#0284c7', background: '#e0f2fe', padding: '3px 9px', borderRadius: '5px' }}>Selected</span>
                            ) : (
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#f59e0b', background: '#fffbeb', padding: '3px 9px', borderRadius: '5px' }}>Pending</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Webinar Details */}
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px',
          padding: '14px 16px', marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            📅 Webinar Details (embedded in email)
          </h3>
          <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.7' }}>
            <div><strong>Date:</strong> Wednesday, April 8, 2026</div>
            <div><strong>Platform:</strong> Zoom Webinar</div>
            <div><strong>Webinar ID:</strong> 827 8483 8030</div>
            <div><strong>Link:</strong>{' '}
              <a href="https://us05web.zoom.us/webinar/82784838030" target="_blank" rel="noopener noreferrer" style={{ color: '#4158f9' }}>
                Join Webinar
              </a>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', fontSize: '13px', fontWeight: '600',
            marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '18px', padding: '0 4px' }}>×</button>
          </div>
        )}

        {/* Success */}
        {result && (
          <div style={{
            padding: '14px 16px', borderRadius: '10px',
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
              ✅ {result.message}
            </div>
            {result.mode === 'test' && (
              <div style={{ fontSize: '12px', color: '#15803d' }}>Sent to: {result.recipient}</div>
            )}
            {result.mode === 'batch' && (
              <div style={{ fontSize: '12px', color: '#15803d' }}>
                Sent: {result.sent} • Failed: {result.failed} • Total: {result.total}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
