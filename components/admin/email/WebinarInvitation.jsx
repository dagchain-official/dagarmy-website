"use client";
import React, { useState, useEffect, useCallback } from 'react';

const BATCH_SIZE = 25;

// Build a proper display name from user fields
function getDisplayName(u) {
  // Prefer first_name + last_name if available
  if (u.first_name && u.last_name) return `${u.first_name} ${u.last_name}`.trim();
  if (u.first_name) return u.first_name.trim();
  // Fall back to full_name only if it looks like a real name (not an email prefix)
  if (u.full_name && u.full_name.includes(' ') && !u.full_name.includes('@')) return u.full_name.trim();
  if (u.full_name && !u.full_name.includes('@') && u.full_name !== u.email?.split('@')[0]) return u.full_name.trim();
  return '';
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
  const [sentUserIds, setSentUserIds] = useState(new Set());
  const [failedUserIds, setFailedUserIds] = useState(new Set());
  const [batchProgress, setBatchProgress] = useState(null); // { current, total, sent, failed }

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

  // Filter users by search
  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  // Separate pending and sent users
  const pendingUsers = filteredUsers.filter(u => !sentUserIds.has(u.id));
  const sentUsers = filteredUsers.filter(u => sentUserIds.has(u.id));

  // Send test email
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

  // Send next batch of 25
  const handleSendBatch = useCallback(async () => {
    const unsent = users.filter(u => u.email && !sentUserIds.has(u.id));
    if (unsent.length === 0) {
      setError('All users have already been sent invitations!');
      return;
    }

    const batch = unsent.slice(0, BATCH_SIZE);
    const batchIds = batch.map(u => u.id);

    const confirmed = window.confirm(
      `Send webinar invitations to the next ${batch.length} users?\n\n` +
      `First: ${batch[0].displayName || batch[0].email}\n` +
      `Last: ${batch[batch.length - 1].displayName || batch[batch.length - 1].email}\n\n` +
      `Total remaining: ${unsent.length} users`
    );
    if (!confirmed) return;

    setError('');
    setResult(null);
    setSending(true);
    setBatchProgress({ current: 0, total: batch.length, sent: 0, failed: 0 });

    try {
      const res = await fetch('/api/emails/webinar-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'batch', userIds: batchIds }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Batch send failed');

      // Mark successful users as sent
      const newSent = new Set(sentUserIds);
      const newFailed = new Set(failedUserIds);
      (data.sentUserIds || []).forEach(id => newSent.add(id));
      (data.failedUserIds || []).forEach(id => newFailed.add(id));
      setSentUserIds(newSent);
      setFailedUserIds(newFailed);

      setBatchProgress({
        current: batch.length,
        total: batch.length,
        sent: data.sent || 0,
        failed: data.failed || 0,
      });

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }, [users, sentUserIds, failedUserIds]);

  const totalUsers = users.filter(u => u.email).length;
  const totalSent = sentUserIds.size;
  const totalRemaining = totalUsers - totalSent;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid #e8edf5',
        background: '#fff',
        flexShrink: 0,
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
          Webinar Invitation Email
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Send webinar invitation emails — batch of {BATCH_SIZE} at a time
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>

        {/* Stats Bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px',
          marginBottom: '20px',
        }}>
          {[
            { label: 'Total Users', value: totalUsers, color: '#6366f1', bg: '#eef2ff' },
            { label: 'Sent', value: totalSent, color: '#10b981', bg: '#f0fdf4' },
            { label: 'Remaining', value: totalRemaining, color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Failed', value: failedUserIds.size, color: '#ef4444', bg: '#fef2f2' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: '12px', padding: '14px 16px',
              border: `1px solid ${s.color}20`,
            }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: s.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={() => setMode('test')} style={{
            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
            border: mode === 'test' ? '2px solid #6366f1' : '1px solid #e2e8f0',
            background: mode === 'test' ? '#eef2ff' : '#fff',
            color: mode === 'test' ? '#6366f1' : '#94a3b8',
            transition: 'all 0.15s',
          }}>
            🧪 Test Mode
          </button>
          <button onClick={() => setMode('batch')} style={{
            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
            border: mode === 'batch' ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
            background: mode === 'batch' ? '#f0f9ff' : '#fff',
            color: mode === 'batch' ? '#0ea5e9' : '#94a3b8',
            transition: 'all 0.15s',
          }}>
            📧 Batch Send ({BATCH_SIZE}/shot)
          </button>
        </div>

        {/* Test Mode */}
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

        {/* Batch Mode */}
        {mode === 'batch' && (
          <div style={{ marginBottom: '16px' }}>
            {/* Batch Send Button + Info */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: '14px',
              border: '2px solid #0ea5e9', padding: '20px', marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0c4a6e', marginBottom: '4px' }}>
                    📧 Send Next Batch
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    {totalRemaining > 0
                      ? `${Math.min(BATCH_SIZE, totalRemaining)} emails will be sent (${totalRemaining} remaining)`
                      : 'All users have been sent!'}
                  </div>
                </div>
                <button
                  onClick={handleSendBatch}
                  disabled={sending || totalRemaining === 0}
                  style={{
                    padding: '12px 28px', borderRadius: '10px', border: 'none',
                    background: sending || totalRemaining === 0 ? '#e2e8f0' : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                    color: sending || totalRemaining === 0 ? '#94a3b8' : '#fff',
                    fontSize: '14px', fontWeight: '700',
                    cursor: sending || totalRemaining === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: sending || totalRemaining === 0 ? 'none' : '0 4px 12px rgba(14,165,233,0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sending
                    ? `Sending batch...`
                    : totalRemaining === 0
                      ? '✅ All Sent'
                      : `Send Next ${Math.min(BATCH_SIZE, totalRemaining)} Emails`}
                </button>
              </div>

              {/* Progress bar during send */}
              {sending && batchProgress && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: '600', marginBottom: '6px' }}>
                    Sending batch... Please wait (do not close this page)
                  </div>
                  <div style={{ height: '6px', background: '#bae6fd', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: 'linear-gradient(90deg,#0ea5e9,#0284c7)',
                      borderRadius: '3px', transition: 'width 0.5s',
                      width: '100%', animation: 'pulse 1.5s ease-in-out infinite',
                    }} />
                  </div>
                </div>
              )}

              {/* Rate limit note */}
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '11px', color: '#92400e', fontWeight: '600' }}>
                  ⏱️ SMTP Rate Limit: Send {BATCH_SIZE} emails per batch, then wait 1 hour before sending the next batch.
                </div>
              </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: '1.5px solid #e8edf5', fontSize: '13px', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                onBlur={e => e.target.style.borderColor = '#e8edf5'}
              />
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
                  display: 'grid', gridTemplateColumns: '40px 1fr 1fr 100px',
                  padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e8edf5',
                  fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  <div>#</div>
                  <div>Full Name</div>
                  <div>Email</div>
                  <div style={{ textAlign: 'center' }}>Status</div>
                </div>

                {/* Pending users section */}
                {pendingUsers.length > 0 && (
                  <>
                    <div style={{ padding: '8px 16px', background: '#fffbeb', fontSize: '11px', fontWeight: '700', color: '#d97706', borderBottom: '1px solid #fde68a' }}>
                      ⏳ Pending ({pendingUsers.length})
                    </div>
                    <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                      {pendingUsers.map((u, i) => (
                        <div key={u.id} style={{
                          display: 'grid', gridTemplateColumns: '40px 1fr 1fr 100px',
                          padding: '10px 16px', borderBottom: '1px solid #f1f5f9',
                          fontSize: '12.5px', color: '#334155',
                          background: i % 2 === 0 ? '#fff' : '#fafbfc',
                        }}>
                          <div style={{ color: '#94a3b8', fontSize: '11px' }}>{i + 1}</div>
                          <div style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.displayName || '—'}
                          </div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>
                            {u.email}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            {failedUserIds.has(u.id) ? (
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: '4px' }}>Failed</span>
                            ) : (
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#f59e0b', background: '#fffbeb', padding: '2px 8px', borderRadius: '4px' }}>Pending</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Sent users section */}
                {sentUsers.length > 0 && (
                  <>
                    <div style={{ padding: '8px 16px', background: '#f0fdf4', fontSize: '11px', fontWeight: '700', color: '#16a34a', borderBottom: '1px solid #bbf7d0', borderTop: '1px solid #bbf7d0' }}>
                      ✅ Sent ({sentUsers.length})
                    </div>
                    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                      {sentUsers.map((u, i) => (
                        <div key={u.id} style={{
                          display: 'grid', gridTemplateColumns: '40px 1fr 1fr 100px',
                          padding: '8px 16px', borderBottom: '1px solid #f1f5f9',
                          fontSize: '12px', color: '#94a3b8',
                          background: i % 2 === 0 ? '#fafffe' : '#f5fdf8',
                        }}>
                          <div style={{ fontSize: '11px' }}>{i + 1}</div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.displayName || '—'}
                          </div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.email}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', background: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>Sent ✓</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {filteredUsers.length === 0 && (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    {searchQuery ? 'No users match your search' : 'No users found'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Webinar Details Preview */}
        <div style={{
          background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px',
          padding: '16px', marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>
            📅 Webinar Details (embedded in email)
          </h3>
          <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.7' }}>
            <div><strong>Date:</strong> Wednesday, April 8, 2026</div>
            <div><strong>Platform:</strong> Zoom Webinar</div>
            <div><strong>Webinar ID:</strong> 827 8483 8030</div>
            <div><strong>Link:</strong> <a href="https://us05web.zoom.us/webinar/82784838030" target="_blank" rel="noopener noreferrer" style={{ color: '#4158f9' }}>Join Webinar</a></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px',
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', fontSize: '13px', fontWeight: '600',
            marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '16px', padding: '0 4px' }}>×</button>
          </div>
        )}

        {/* Success Message */}
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
