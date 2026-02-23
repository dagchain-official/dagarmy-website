"use client";
import React, { useRef, useEffect, useState } from "react";

function AttachmentBar({ message }) {
  const [downloading, setDownloading] = useState({});

  const handleDownload = async (att, idx) => {
    if (downloading[idx]) return;
    setDownloading(prev => ({ ...prev, [idx]: true }));
    try {
      const url = `/api/admin/email/download?folder=${encodeURIComponent(message.folder || 'INBOX')}&uid=${message.uid}&part=${idx + 1}&filename=${encodeURIComponent(att.filename)}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) { alert('Download failed'); return; }
      const json = await res.json();
      // Decode base64 → binary → Blob → object URL → trigger download
      const binary = atob(json.data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: json.mimeType });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = json.filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(objectUrl); document.body.removeChild(a); }, 1000);
    } catch { alert('Download failed'); }
    finally { setDownloading(prev => ({ ...prev, [idx]: false })); }
  };

  const getFileColor = (filename) => {
    const ext = (filename || '').split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '#ef4444' };
    if (['doc','docx'].includes(ext)) return { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb', icon: '#3b82f6' };
    if (['xls','xlsx','csv'].includes(ext)) return { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: '#22c55e' };
    if (['ppt','pptx'].includes(ext)) return { bg: '#fff7ed', border: '#fed7aa', color: '#ea580c', icon: '#f97316' };
    if (['png','jpg','jpeg','gif','webp','svg'].includes(ext)) return { bg: '#fdf4ff', border: '#e9d5ff', color: '#9333ea', icon: '#a855f7' };
    if (['zip','rar','7z'].includes(ext)) return { bg: '#fffbeb', border: '#fde68a', color: '#d97706', icon: '#f59e0b' };
    return { bg: '#f8fafc', border: '#e2e8f0', color: '#475569', icon: '#64748b' };
  };

  return (
    <div style={{
      padding: '10px 28px 12px',
      borderBottom: '1px solid #f1f5f9',
      background: '#fafbff',
      flexShrink: 0,
    }}>
      <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
        {message.attachments.length} Attachment{message.attachments.length > 1 ? 's' : ''}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {message.attachments.map((att, idx) => {
          const busy = !!downloading[idx];
          const fc = getFileColor(att.filename);
          const sizeStr = att.size < 1048576
            ? (att.size / 1024).toFixed(0) + ' KB'
            : (att.size / 1048576).toFixed(1) + ' MB';
          return (
            <button
              key={idx}
              onClick={() => handleDownload(att, idx)}
              disabled={busy}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 12px 7px 10px',
                background: busy ? fc.bg : '#fff',
                border: `1.5px solid ${busy ? fc.border : '#e8edf5'}`,
                borderRadius: '10px',
                maxWidth: '260px', cursor: busy ? 'wait' : 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => { if (!busy) { e.currentTarget.style.background = fc.bg; e.currentTarget.style.borderColor = fc.border; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}}
              onMouseLeave={e => { if (!busy) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}}
            >
              {/* File icon */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: fc.bg, border: `1px solid ${fc.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {busy ? (
                  <div style={{ width: '12px', height: '12px', border: `2px solid ${fc.icon}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'mrSpin 0.7s linear infinite' }}/>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={fc.icon} strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                )}
              </div>
              {/* Name + size */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: '12px', fontWeight: '600', color: busy ? fc.color : '#334155',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '160px',
                }}>
                  {busy ? 'Downloading...' : att.filename}
                </div>
                <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '500', marginTop: '1px' }}>
                  {sizeStr}
                </div>
              </div>
              {/* Download arrow */}
              {!busy && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const IcoReply   = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>;
const IcoForward = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg>;
const IcoDelete  = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IcoStarEmpty = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoStarFill  = <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoUnread  = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString([], {
    weekday: 'short', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function getInitials(from) {
  if (!from) return '?';
  const name = (from.name || from.address || '').trim();
  const parts = name.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || '?';
}

function getAvatarColor(str) {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#0d9488','#f97316'];
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function ActionBtn({ icon, label, onClick, danger = false, active = false }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '7px 14px',
        border: '1.5px solid',
        borderColor: danger ? '#fecaca' : active ? '#6366f1' : '#e8edf5',
        borderRadius: '9px',
        background: danger ? '#fff' : active ? '#eef2ff' : '#fff',
        color: danger ? '#ef4444' : active ? '#6366f1' : '#475569',
        fontSize: '12px', fontWeight: '600', cursor: 'pointer',
        transition: 'all 0.15s',
        letterSpacing: '0.1px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        if (danger) { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }
        else { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.color = '#4f46e5'; }
      }}
      onMouseLeave={e => {
        if (danger) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#ef4444'; }
        else { e.currentTarget.style.background = active ? '#eef2ff' : '#fff'; e.currentTarget.style.borderColor = active ? '#6366f1' : '#e8edf5'; e.currentTarget.style.color = active ? '#6366f1' : '#475569'; }
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export default function MessageReader({
  message,
  loading,
  onReply,
  onForward,
  onDelete,
  onToggleStar,
  onMarkUnread,
  onMove,
  folders = [],
}) {
  const iframeRef = useRef(null);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const moveMenuRef = useRef(null);

  useEffect(() => {
    if (!showMoveMenu) return;
    const handler = (e) => { if (moveMenuRef.current && !moveMenuRef.current.contains(e.target)) setShowMoveMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMoveMenu]);

  useEffect(() => {
    if (!iframeRef.current || !message?.html) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              font-size: 14px; line-height: 1.6; color: #1e293b;
              margin: 0; padding: 20px; word-break: break-word;
            }
            img { max-width: 100%; height: auto; }
            a { color: #0d9488; }
            pre { white-space: pre-wrap; font-family: inherit; }
            blockquote {
              border-left: 3px solid #e2e8f0; margin: 12px 0;
              padding: 8px 16px; color: #64748b;
            }
          </style>
        </head>
        <body>${message.html}</body>
      </html>
    `);
    doc.close();

    // Auto-resize iframe to content height
    const resize = () => {
      try {
        const h = doc.body?.scrollHeight || 400;
        iframeRef.current.style.height = Math.max(200, h + 40) + 'px';
      } catch {}
    };
    iframeRef.current.onload = resize;
    setTimeout(resize, 100);
  }, [message?.html, message?.uid]);

  // Empty state
  if (!message && !loading) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8faff 0%, #f1f5fd 100%)',
        flexDirection: 'column', gap: '20px',
      }}>
        <div style={{
          width: '88px', height: '88px', borderRadius: '24px',
          background: '#fff',
          boxShadow: '0 8px 32px rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '17px', fontWeight: '800', color: '#1e293b', marginBottom: '8px', letterSpacing: '-0.3px' }}>
            No message selected
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '220px' }}>
            Select a message from the list to read it here
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', background: '#fff', gap: '14px',
      }}>
        <div style={{
          width: '32px', height: '32px',
          border: '2.5px solid #e8edf5', borderTopColor: '#6366f1',
          borderRadius: '50%', animation: 'mrSpin 0.7s linear infinite',
        }}/>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Loading message...</span>
      </div>
    );
  }

  const senderStr = message.from?.name || message.from?.address || '';
  const avatarColor = getAvatarColor(senderStr);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{
        padding: '11px 24px', borderBottom: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
        background: '#fff',
      }}>
        <ActionBtn icon={IcoReply}   label="Reply"   onClick={onReply} />
        <ActionBtn icon={IcoForward} label="Forward" onClick={onForward} />
        <div style={{ width: '1px', height: '20px', background: '#e8edf5', margin: '0 2px' }}/>
        <ActionBtn icon={IcoUnread}  label="Mark Unread" onClick={onMarkUnread} />
        {/* Move to folder */}
        {onMove && folders.length > 0 && (
          <div ref={moveMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMoveMenu(v => !v)}
              title="Move to folder"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', border: '1.5px solid #e8edf5',
                borderRadius: '9px', background: showMoveMenu ? '#f5f3ff' : '#fff',
                color: showMoveMenu ? '#4f46e5' : '#475569',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.color = '#4f46e5'; }}
              onMouseLeave={e => { if (!showMoveMenu) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#475569'; } }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Move
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showMoveMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
                background: '#fff', borderRadius: '12px', padding: '6px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.14)', border: '1px solid #e8edf5',
                minWidth: '180px', maxHeight: '260px', overflowY: 'auto',
              }}>
                {folders
                  .filter(f => f.path !== (message?.folder || 'INBOX'))
                  .map(f => (
                    <button
                      key={f.path}
                      onClick={() => { onMove(message.uid, f.path); setShowMoveMenu(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 10px', border: 'none', borderRadius: '8px',
                        background: 'none', cursor: 'pointer', textAlign: 'left',
                        fontSize: '12.5px', fontWeight: '500', color: '#374151',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      {f.name.replace(/^INBOX\./i, '')}
                    </button>
                  ))
                }
              </div>
            )}
          </div>
        )}
        <button
          onClick={onToggleStar}
          title={message.isStarred ? 'Unstar' : 'Star'}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px',
            border: `1.5px solid ${message.isStarred ? '#fbbf24' : '#e8edf5'}`,
            borderRadius: '9px',
            background: message.isStarred ? '#fffbeb' : '#fff',
            color: message.isStarred ? '#d97706' : '#475569',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            transition: 'all 0.15s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.color = '#d97706'; }}
          onMouseLeave={e => { e.currentTarget.style.background = message.isStarred ? '#fffbeb' : '#fff'; e.currentTarget.style.borderColor = message.isStarred ? '#fbbf24' : '#e8edf5'; e.currentTarget.style.color = message.isStarred ? '#d97706' : '#475569'; }}
        >
          {message.isStarred ? IcoStarFill : IcoStarEmpty}
          {message.isStarred ? 'Starred' : 'Star'}
        </button>
        <div style={{ flex: 1 }}/>
        <ActionBtn icon={IcoDelete} label="Delete" onClick={() => onDelete(message.uid)} danger />
      </div>

      {/* Message header */}
      <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f8fafc', flexShrink: 0 }}>
        <h1 style={{
          fontSize: '19px', fontWeight: '800', color: '#0f172a',
          margin: '0 0 20px', lineHeight: '1.35', letterSpacing: '-0.4px',
        }}>
          {message.subject || '(no subject)'}
        </h1>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '13px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', fontWeight: '700', color: '#fff', flexShrink: 0,
            boxShadow: `0 4px 12px ${avatarColor}40`,
          }}>
            {getInitials(message.from)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '5px', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  {message.from?.name || message.from?.address || 'Unknown'}
                </span>
                {message.from?.name && message.from?.address && (
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>
                    &lt;{message.from.address}&gt;
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '11.5px', color: '#94a3b8', flexShrink: 0,
                background: '#f8fafc', borderRadius: '6px', padding: '3px 8px',
                fontWeight: '500',
              }}>
                {formatFullDate(message.date)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {message.to?.length > 0 && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  <span style={{ fontWeight: '600', color: '#94a3b8' }}>To </span>
                  {message.to.map(t => t.name || t.address || '').join(', ')}
                </div>
              )}
              {message.cc?.length > 0 && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  <span style={{ fontWeight: '600', color: '#94a3b8' }}>Cc </span>
                  {message.cc.map(t => t.name || t.address || '').join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attachments bar */}
      {message.attachments?.length > 0 && (
        <AttachmentBar message={message} />
      )}

      {/* Message body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <iframe
          ref={iframeRef}
          title="email-body"
          sandbox="allow-same-origin"
          style={{
            width: '100%', border: 'none', display: 'block',
            minHeight: '300px', background: '#fff',
          }}
        />
      </div>

      <style>{`@keyframes mrSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
