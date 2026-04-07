"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function WebinarInvitationPage() {
  const [mode, setMode] = useState('test');
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [lastSent, setLastSent] = useState(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        const users = d.users || [];
        setUserCount(users.filter(u => u.email).length);
      })
      .catch(() => {});
  }, []);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSend = async () => {
    if (mode === 'test' && !testEmail.trim()) {
      showToast('Please enter a test email address.', false);
      return;
    }

    const confirmMsg = mode === 'test' 
      ? `Send test webinar invitation to ${testEmail}?`
      : `Send webinar invitation to ALL ${userCount} users? This cannot be undone.`;

    if (!confirm(confirmMsg)) return;

    setSending(true);
    try {
      const res = await fetch('/api/emails/webinar-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          testEmail: mode === 'test' ? testEmail.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Send failed');
      }

      setLastSent({
        mode: data.mode,
        recipient: data.recipient,
        total: data.total,
        sent: data.sent,
        failed: data.failed,
        timestamp: new Date().toISOString(),
      });

      if (mode === 'test') {
        showToast(`Test email sent successfully to ${testEmail}`);
      } else {
        showToast(`Webinar invitations sent to ${data.sent} of ${data.total} users.`);
      }

    } catch (err) {
      showToast(err.message || 'Failed to send. Please try again.', false);
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', border: '1.5px solid #e8edf5', borderRadius: '10px',
    fontSize: '14px', color: '#0f172a', background: '#fff', outline: 'none',
    transition: 'border-color 0.15s', fontFamily: 'inherit',
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px' }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
            padding: '14px 20px', borderRadius: '12px',
            background: toast.ok ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${toast.ok ? '#bbf7d0' : '#fecaca'}`,
            color: toast.ok ? '#16a34a' : '#dc2626',
            fontSize: '13px', fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {toast.ok
                ? <><polyline points="20 6 9 17 4 12"/></>
                : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
            </svg>
            {toast.msg}
          </div>
        )}

        {/* Page header */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '22px 26px', marginBottom: '24px', border: '1px solid #e8edf5', boxShadow: '0 1px 8px rgba(99,102,241,0.06)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.3)', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: '800', color: '#0f172a', margin: '0 0 3px', letterSpacing: '-0.4px' }}>Webinar Invitation</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>Send webinar invitations to all users - April 8, 2026</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

          {/* Left: Main controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Webinar Details Card */}
            <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '16px', border: '2px solid #0ea5e9', padding: '22px 24px', boxShadow: '0 4px 12px rgba(14,165,233,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '3px', height: '18px', background: '#0284c7', borderRadius: '2px' }} />
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0c4a6e' }}>📅 Webinar Details</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                <p style={{ fontSize: '13px', lineHeight: '20px', color: '#475569', margin: '0 0 8px' }}>
                  <strong style={{ color: '#0c4a6e' }}>Date:</strong> Wednesday, April 8, 2026
                </p>
                <p style={{ fontSize: '13px', lineHeight: '20px', color: '#475569', margin: '0 0 8px' }}>
                  <strong style={{ color: '#0c4a6e' }}>Platform:</strong> Zoom Webinar
                </p>
                <p style={{ fontSize: '13px', lineHeight: '20px', color: '#475569', margin: '0 0 8px' }}>
                  <strong style={{ color: '#0c4a6e' }}>Webinar ID:</strong> 827 8483 8030
                </p>
                <p style={{ fontSize: '13px', lineHeight: '20px', color: '#475569', margin: '0' }}>
                  <strong style={{ color: '#0c4a6e' }}>Link:</strong>{' '}
                  <a href="https://us05web.zoom.us/webinar/82784838030" target="_blank" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>
                    Join Webinar
                  </a>
                </p>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '14px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#0369a1', margin: '0 0 8px' }}>
                  ⏰ Timezone Coverage:
                </p>
                <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '18px' }}>
                  USA (Pacific, Central, Eastern) • Canada • UK • UAE • India • Bangladesh • Pakistan
                </div>
              </div>
            </div>

            {/* Send Controls Card */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg,#0ea5e9,#0284c7)', borderRadius: '2px' }} />
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Send Invitation</div>
              </div>

              {/* Mode Selection */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '10px' }}>Mode</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setMode('test')} style={{
                    flex: 1, padding: '11px 16px', borderRadius: '10px', cursor: 'pointer',
                    border: `1.5px solid ${mode === 'test' ? '#0ea5e9' : '#e8edf5'}`,
                    background: mode === 'test' ? '#f0f9ff' : '#fff',
                    fontSize: '13px', fontWeight: '700',
                    color: mode === 'test' ? '#0284c7' : '#94a3b8',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                    Test Email
                  </button>
                  <button onClick={() => setMode('all')} style={{
                    flex: 1, padding: '11px 16px', borderRadius: '10px', cursor: 'pointer',
                    border: `1.5px solid ${mode === 'all' ? '#dc2626' : '#e8edf5'}`,
                    background: mode === 'all' ? '#fef2f2' : '#fff',
                    fontSize: '13px', fontWeight: '700',
                    color: mode === 'all' ? '#dc2626' : '#94a3b8',
                    transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                    All Users
                  </button>
                </div>
              </div>

              {/* Test Email Input */}
              {mode === 'test' && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '6px' }}>
                    Test Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  />
                </div>
              )}

              {/* Warning for All Mode */}
              {mode === 'all' && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '14px', marginBottom: '18px', display: 'flex', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
                      ⚠️ Bulk Send Warning
                    </div>
                    <div style={{ fontSize: '11px', color: '#991b1b', lineHeight: '16px' }}>
                      This will send the webinar invitation to <strong>{userCount} users</strong>. This action cannot be undone. Please test the email first before sending to all users.
                    </div>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <button onClick={handleSend} disabled={sending || (mode === 'test' && !testEmail.trim())} style={{
                width: '100%', padding: '12px 24px', border: 'none', borderRadius: '10px',
                background: sending || (mode === 'test' && !testEmail.trim()) ? '#e2e8f0' : mode === 'all' ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                color: sending || (mode === 'test' && !testEmail.trim()) ? '#94a3b8' : '#fff',
                fontSize: '14px', fontWeight: '700', cursor: sending || (mode === 'test' && !testEmail.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s',
                boxShadow: sending || (mode === 'test' && !testEmail.trim()) ? 'none' : mode === 'all' ? '0 2px 10px rgba(220,38,38,0.35)' : '0 2px 10px rgba(14,165,233,0.35)',
              }}
                onMouseEnter={e => { if (!sending && !(mode === 'test' && !testEmail.trim())) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = mode === 'all' ? '0 4px 16px rgba(220,38,38,0.45)' : '0 4px 16px rgba(14,165,233,0.45)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = sending || (mode === 'test' && !testEmail.trim()) ? 'none' : mode === 'all' ? '0 2px 10px rgba(220,38,38,0.35)' : '0 2px 10px rgba(14,165,233,0.35)'; }}
              >
                {sending ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    {mode === 'test' ? 'Send Test Email' : `Send to ${userCount} Users`}
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right: Info & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Stats Card */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg,#0ea5e9,#0284c7)', borderRadius: '2px' }} />
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Statistics</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Total Users</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{userCount}</div>
                </div>
              </div>
            </div>

            {/* Last Sent */}
            {lastSent && (
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '3px', height: '16px', background: 'linear-gradient(180deg,#10b981,#059669)', borderRadius: '2px' }} />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Last Sent</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    Mode: <strong style={{ color: lastSent.mode === 'test' ? '#0ea5e9' : '#dc2626' }}>
                      {lastSent.mode === 'test' ? 'Test' : 'All Users'}
                    </strong>
                  </div>
                  {lastSent.mode === 'test' ? (
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Sent to: <strong style={{ color: '#0f172a' }}>{lastSent.recipient}</strong>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                        Sent: <strong style={{ color: '#10b981' }}>{lastSent.sent}</strong> / {lastSent.total}
                      </div>
                      {lastSent.failed > 0 && (
                        <div style={{ fontSize: '12px', color: '#dc2626' }}>
                          Failed: <strong>{lastSent.failed}</strong>
                        </div>
                      )}
                    </>
                  )}
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                    {new Date(lastSent.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div style={{ background: '#fffbeb', borderRadius: '16px', border: '1.5px solid #fde68a', padding: '18px', boxShadow: '0 1px 4px rgba(251,191,36,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', marginBottom: '6px' }}>
                    💡 Best Practice
                  </div>
                  <div style={{ fontSize: '11px', color: '#78350f', lineHeight: '16px' }}>
                    Always send a test email to yourself first to verify the content, formatting, and all links before sending to all users.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

      </div>
    </AdminLayout>
  );
}
