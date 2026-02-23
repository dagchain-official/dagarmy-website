"use client";
import React, { useState } from "react";

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffMs < 86400000 && d.getDate() === now.getDate())
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffMs < 604800000)
    return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getInitials(from) {
  if (!from) return '?';
  const name = (from.name || from.address || '').trim();
  const parts = name.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || '?';
}

function getAvatarGradient(str) {
  const palettes = [
    ['#6366f1','#8b5cf6'],['#ec4899','#f43f5e'],['#f59e0b','#f97316'],
    ['#10b981','#06b6d4'],['#3b82f6','#6366f1'],['#0d9488','#10b981'],
    ['#8b5cf6','#ec4899'],['#f97316','#eab308'],
  ];
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return palettes[Math.abs(h) % palettes.length];
}

function isSentLike(f) {
  const s = (f || '').toLowerCase();
  return s.includes('sent') || s.includes('draft');
}

export default function MessageList({
  folderName, messages, totalMessages, currentPage, totalPages,
  selectedUid, loading, searchQuery, onSearchChange, onMessageClick, onStar, onPageChange,
  onMessageHover, onMessageHoverEnd,
}) {
  const showRecipient = isSentLike(folderName);
  const [hoveredUid, setHoveredUid] = useState(null);
  const displayFolder = (folderName || '').replace(/^INBOX\./i, '') || 'Inbox';

  return (
    <div style={{ width: '340px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0, background: '#f0f2f8', height: '100%' }}>

      {/* Header */}
      <div style={{ padding: '20px 16px 14px', background: '#fff', borderBottom: '1px solid #edf0f7', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>
            {displayFolder}
          </h2>
          {totalMessages > 0 && (
            <span style={{
              fontSize: '11px', fontWeight: '700', color: '#fff',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '20px', padding: '3px 10px',
              boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
              letterSpacing: '0.2px',
            }}>{totalMessages}</span>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search messages..."
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              border: '1.5px solid #e8edf5', borderRadius: '12px',
              fontSize: '13px', outline: 'none', background: '#f8faff',
              boxSizing: 'border-box', color: '#0f172a', transition: 'all 0.18s',
            }}
            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#e8edf5'; e.target.style.background = '#f8faff'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px 8px' }} className="ml-scroll">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '14px' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e8edf5', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'mlSpin 0.7s linear infinite' }}/>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(99,102,241,0.12)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>All clear</div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>No messages in this folder</div>
          </div>
        ) : messages.map(msg => {
          const isSelected = selectedUid === msg.uid;
          const isHovered = hoveredUid === msg.uid;
          const displayContact = showRecipient ? (msg.to?.[0] || msg.from) : msg.from;
          const senderStr = displayContact?.name || displayContact?.address || '';
          const [g1, g2] = getAvatarGradient(senderStr);
          const initials = getInitials(displayContact);
          const displayName = displayContact?.name || displayContact?.address || 'Unknown';
          const hasAttachments = msg.hasAttachments || msg.attachments?.length > 0;

          return (
            <div
              key={msg.uid}
              onClick={() => onMessageClick(msg)}
              onMouseEnter={() => { setHoveredUid(msg.uid); onMessageHover?.(msg); }}
              onMouseLeave={() => { setHoveredUid(null); onMessageHoverEnd?.(msg); }}
              style={{
                marginBottom: '5px',
                borderRadius: '14px',
                cursor: 'pointer',
                background: isSelected ? 'linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%)' : '#fff',
                border: isSelected ? '1.5px solid #a5b4fc' : isHovered ? '1.5px solid #e0e7ff' : '1.5px solid transparent',
                boxShadow: isSelected
                  ? '0 4px 20px rgba(99,102,241,0.14), 0 1px 4px rgba(0,0,0,0.04)'
                  : isHovered
                    ? '0 4px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)'
                    : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s cubic-bezier(0.4,0,0.2,1)',
                transform: isHovered && !isSelected ? 'translateY(-1px)' : 'translateY(0)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Unread glow strip */}
              {!msg.isRead && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                  background: `linear-gradient(180deg, ${g1}, ${g2})`,
                  borderRadius: '14px 0 0 14px',
                }}/>
              )}

              <div style={{ padding: '12px 12px 12px 14px', display: 'flex', gap: '11px', alignItems: 'flex-start' }}>

                {/* Avatar */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${g1}, ${g2})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '800', color: '#fff',
                  letterSpacing: '-0.5px',
                  boxShadow: `0 3px 10px ${g1}50`,
                  position: 'relative',
                }}>
                  {initials}
                  {/* Unread dot on avatar */}
                  {!msg.isRead && (
                    <div style={{
                      position: 'absolute', top: '-2px', right: '-2px',
                      width: '9px', height: '9px', borderRadius: '50%',
                      background: g1,
                      border: '2px solid #fff',
                      boxShadow: `0 0 0 1px ${g1}40`,
                    }}/>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>

                  {/* Row 1: sender + time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: msg.isRead ? '500' : '700',
                      color: msg.isRead ? '#374151' : '#0d0f1a',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1, marginRight: '8px', letterSpacing: '-0.2px',
                    }}>
                      {displayName}
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: msg.isRead ? '400' : '600',
                      color: msg.isRead ? '#9ca3af' : g1,
                      flexShrink: 0, letterSpacing: '0.1px',
                    }}>
                      {formatDate(msg.date)}
                    </span>
                  </div>

                  {/* Row 2: subject */}
                  <div style={{
                    fontSize: '12.5px',
                    fontWeight: msg.isRead ? '400' : '600',
                    color: msg.isRead ? '#6b7280' : '#111827',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: '4px', letterSpacing: '-0.1px',
                  }}>
                    {msg.subject || '(no subject)'}
                  </div>

                  {/* Row 3: preview + icons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '11.5px', color: '#9ca3af', fontWeight: '400',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1, lineHeight: '1.4',
                    }}>
                      {msg.preview || ''}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      {hasAttachments && (
                        <span style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '18px', height: '18px', borderRadius: '5px',
                          background: '#f1f5f9', color: '#94a3b8',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        </span>
                      )}
                      <button
                        onClick={e => onStar(e, msg)}
                        style={{
                          background: msg.isStarred ? '#fffbeb' : 'none',
                          border: 'none', cursor: 'pointer',
                          width: '20px', height: '20px', borderRadius: '5px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: msg.isStarred ? '#f59e0b' : '#d1d5db',
                          transition: 'all 0.15s', flexShrink: 0,
                          padding: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.color = '#f59e0b'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = msg.isStarred ? '#fffbeb' : 'none'; e.currentTarget.style.color = msg.isStarred ? '#f59e0b' : '#d1d5db'; }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={msg.isStarred ? '#f59e0b' : 'none'} stroke={msg.isStarred ? '#f59e0b' : 'currentColor'} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div style={{ padding: '10px 12px 12px', borderTop: '1px solid #e8edf5', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 14px', border: 'none', borderRadius: '20px',
            background: currentPage <= 1 ? 'transparent' : '#f1f5f9',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            color: currentPage <= 1 ? '#d1d5db' : '#475569',
            fontSize: '12px', fontWeight: '600', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (currentPage > 1) { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#6366f1'; }}}
          onMouseLeave={e => { if (currentPage > 1) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Prev
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
          <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: '600' }}>
            {totalMessages === 0 ? '0' : `${(currentPage - 1) * 25 + 1}–${Math.min(currentPage * 25, totalMessages)}`}
            <span style={{ color: '#94a3b8', fontWeight: '400' }}> of </span>
            {totalMessages}
          </span>
          {totalPages > 1 && (
            <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '500' }}>
              page {currentPage} of {totalPages}
            </span>
          )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 14px', border: 'none', borderRadius: '20px',
            background: currentPage >= totalPages ? 'transparent' : '#f1f5f9',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            color: currentPage >= totalPages ? '#d1d5db' : '#475569',
            fontSize: '12px', fontWeight: '600', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (currentPage < totalPages) { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#6366f1'; }}}
          onMouseLeave={e => { if (currentPage < totalPages) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}}
        >
          Next
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <style>{`
        @keyframes mlSpin { to { transform: rotate(360deg); } }
        .ml-scroll::-webkit-scrollbar { width: 3px; }
        .ml-scroll::-webkit-scrollbar-track { background: transparent; }
        .ml-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .ml-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
