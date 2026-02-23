"use client";
import React, { useState, useEffect } from "react";
import SubAdminLayout from "@/components/admin/SubAdminLayout";

const AUDIENCES = [
  { key: 'all',        label: 'All Members',     desc: 'Everyone on the platform',         color: '#6366f1', bg: '#eef2ff' },
  { key: 'student',   label: 'Students',         desc: 'All student accounts',             color: '#0d9488', bg: '#f0fdfa' },
  { key: 'instructor',label: 'Instructors',      desc: 'All instructor accounts',          color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'inactive',  label: 'Inactive Members', desc: 'No login in 30+ days',            color: '#f59e0b', bg: '#fffbeb' },
  { key: 'new',       label: 'New Members',      desc: 'Joined in the last 7 days',       color: '#10b981', bg: '#f0fdf4' },
];

const PRIORITIES = [
  { key: 'normal', label: 'Normal',  color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
  { key: 'high',   label: 'High',    color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { key: 'urgent', label: 'Urgent',  color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
];

const TEMPLATES = [
  { label: 'Welcome',          title: 'Welcome to DAG Army!', body: 'We\'re thrilled to have you on board. Explore your dashboard, complete your profile, and start your journey today.' },
  { label: 'Course Reminder',  title: 'Continue Your Learning', body: 'You have an unfinished course waiting for you. Pick up where you left off and keep making progress!' },
  { label: 'Inactivity Nudge', title: 'We Miss You!', body: 'It\'s been a while since your last visit. Come back and see what\'s new — new courses, updates, and more await you.' },
  { label: 'Cert Ready',       title: 'Your Certificate is Ready', body: 'Congratulations! Your certificate has been issued. Log in to download and share your achievement.' },
  { label: 'Maintenance',      title: 'Scheduled Maintenance Notice', body: 'We will be performing scheduled maintenance. The platform may be temporarily unavailable. We apologize for any inconvenience.' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function HRBroadcastPage() {
  const [audience, setAudience]   = useState('all');
  const [priority, setPriority]   = useState('normal');
  const [title, setTitle]         = useState('');
  const [body, setBody]           = useState('');
  const [sending, setSending]     = useState(false);
  const [preview, setPreview]     = useState(false);
  const [history, setHistory]     = useState([]);
  const [toast, setToast]         = useState(null);
  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        const users = d.users || [];
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sevenDaysAgo  = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        setUserCounts({
          all:        users.length,
          student:    users.filter(u => (u.role || 'student') === 'student').length,
          instructor: users.filter(u => u.role === 'instructor').length,
          inactive:   users.filter(u => new Date(u.last_sign_in_at || u.created_at) < thirtyDaysAgo).length,
          new:        users.filter(u => new Date(u.created_at) > sevenDaysAgo).length,
        });
      })
      .catch(() => {});
  }, []);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      showToast('Please fill in both title and message.', false);
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: body.trim(),
          audience,
          priority,
          type: 'broadcast',
        }),
      });
      if (!res.ok) throw new Error('Send failed');
      const entry = {
        id: Date.now(),
        title: title.trim(),
        body: body.trim(),
        audience,
        priority,
        sentAt: new Date().toISOString(),
        count: userCounts[audience] || 0,
      };
      setHistory(h => [entry, ...h].slice(0, 10));
      setTitle('');
      setBody('');
      setPreview(false);
      showToast(`Broadcast sent to ${entry.count} member${entry.count !== 1 ? 's' : ''}.`);
    } catch {
      showToast('Failed to send broadcast. Please try again.', false);
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (t) => {
    setTitle(t.title);
    setBody(t.body);
    setPreview(false);
  };

  const selectedAudience  = AUDIENCES.find(a => a.key === audience);
  const selectedPriority  = PRIORITIES.find(p => p.key === priority);
  const recipientCount    = userCounts[audience] ?? '—';

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', border: '1.5px solid #e8edf5', borderRadius: '10px',
    fontSize: '14px', color: '#0f172a', background: '#fff', outline: 'none',
    transition: 'border-color 0.15s', fontFamily: 'inherit',
  };

  return (
    <SubAdminLayout>
      <div style={{ maxWidth: '1100px' }}>

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
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Broadcast</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Send targeted announcements to your members</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

          {/* Left: Composer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Quick Templates */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Quick Templates</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TEMPLATES.map(t => (
                  <button key={t.label} onClick={() => applyTemplate(t)} style={{
                    padding: '7px 14px', border: '1.5px solid #e8edf5', borderRadius: '20px',
                    background: '#f8fafc', fontSize: '12px', fontWeight: '600', color: '#475569',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0fdfa'; e.currentTarget.style.borderColor = '#99f6e4'; e.currentTarget.style.color = '#0d9488'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#475569'; }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer card */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Compose Message</div>

              {/* Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Title</label>
                <input
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Important Update for All Members"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#0d9488'}
                  onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  maxLength={120}
                />
                <div style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'right', marginTop: '4px' }}>{title.length}/120</div>
              </div>

              {/* Body */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Message</label>
                <textarea
                  value={body} onChange={e => setBody(e.target.value)}
                  placeholder="Write your announcement here..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                  onFocus={e => e.target.style.borderColor = '#0d9488'}
                  onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  maxLength={1000}
                />
                <div style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'right', marginTop: '4px' }}>{body.length}/1000</div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setPreview(p => !p)} style={{
                  padding: '10px 20px', border: '1.5px solid #e8edf5', borderRadius: '10px',
                  background: preview ? '#f0fdfa' : '#fff', color: preview ? '#0d9488' : '#475569',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                  borderColor: preview ? '#99f6e4' : '#e8edf5',
                }}>
                  {preview ? 'Hide Preview' : 'Preview'}
                </button>
                <button onClick={handleSend} disabled={sending || !title.trim() || !body.trim()} style={{
                  padding: '10px 24px', border: 'none', borderRadius: '10px',
                  background: sending || !title.trim() || !body.trim() ? '#e2e8f0' : '#0d9488',
                  color: sending || !title.trim() || !body.trim() ? '#94a3b8' : '#fff',
                  fontSize: '13px', fontWeight: '700', cursor: sending || !title.trim() || !body.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s',
                  boxShadow: sending || !title.trim() || !body.trim() ? 'none' : '0 2px 8px rgba(13,148,136,0.3)',
                }}
                  onMouseEnter={e => { if (!sending && title.trim() && body.trim()) e.currentTarget.style.background = '#0f766e'; }}
                  onMouseLeave={e => { if (!sending && title.trim() && body.trim()) e.currentTarget.style.background = '#0d9488'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  {sending ? 'Sending...' : `Send to ${recipientCount} member${recipientCount !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #99f6e4', padding: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Preview</div>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '18px', border: '1px solid #e8edf5' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #0d9488, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{title || 'Your Title Here'}</span>
                        {priority !== 'normal' && (
                          <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: selectedPriority.bg, color: selectedPriority.color, border: `1px solid ${selectedPriority.border}` }}>
                            {selectedPriority.label.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.6' }}>{body || 'Your message will appear here...'}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>just now · DAG Army HR</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Settings + History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Audience */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Audience</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {AUDIENCES.map(a => (
                  <button key={a.key} onClick={() => setAudience(a.key)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 14px', borderRadius: '10px', cursor: 'pointer',
                    border: `1.5px solid ${audience === a.key ? a.color + '60' : '#e8edf5'}`,
                    background: audience === a.key ? a.bg : '#fff',
                    transition: 'all 0.15s', textAlign: 'left',
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: audience === a.key ? a.color : '#cbd5e1', flexShrink: 0, transition: 'background 0.15s' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: audience === a.key ? a.color : '#0f172a' }}>{a.label}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.desc}</div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: audience === a.key ? a.color : '#94a3b8', flexShrink: 0 }}>
                      {userCounts[a.key] ?? '—'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Priority</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {PRIORITIES.map(p => (
                  <button key={p.key} onClick={() => setPriority(p.key)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: '10px', cursor: 'pointer',
                    border: `1.5px solid ${priority === p.key ? p.border : '#e8edf5'}`,
                    background: priority === p.key ? p.bg : '#fff',
                    fontSize: '12px', fontWeight: '700',
                    color: priority === p.key ? p.color : '#94a3b8',
                    transition: 'all 0.15s',
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8edf5', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Sent History</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>This session only</div>
              </div>
              {history.length === 0 ? (
                <div style={{ padding: '28px 20px', textAlign: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto 10px', display: 'block' }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>No broadcasts sent yet</div>
                </div>
              ) : (
                <div style={{ padding: '8px 0' }}>
                  {history.map(h => {
                    const aud = AUDIENCES.find(a => a.key === h.audience);
                    const pri = PRIORITIES.find(p => p.key === h.priority);
                    return (
                      <div key={h.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{h.title}</div>
                          {h.priority !== 'normal' && (
                            <span style={{ padding: '1px 6px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: pri.bg, color: pri.color, flexShrink: 0 }}>{pri.label}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: aud?.color || '#64748b', fontWeight: '600', background: aud?.bg || '#f8fafc', padding: '2px 7px', borderRadius: '20px' }}>{aud?.label}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{h.count} sent · {timeAgo(h.sentAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </SubAdminLayout>
  );
}
