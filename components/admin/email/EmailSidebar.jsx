"use client";
import React, { useState, useEffect, useRef } from "react";

const FOLDER_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f43f5e',
  '#f97316','#f59e0b','#10b981','#06b6d4',
  '#3b82f6','#0d9488','#64748b','#84cc16',
];

export const STARRED_PATH = '__starred__';

function getFolderMeta(path, customColor) {
  const p = (path || '').toLowerCase();
  if (p === 'inbox') return {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
    color: customColor || '#6366f1',
  };
  if (p.includes('sent')) return {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    color: customColor || '#0d9488',
  };
  if (p.includes('draft')) return {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    color: customColor || '#f59e0b',
  };
  if (p.includes('junk') || p.includes('spam')) return {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    color: customColor || '#f97316',
  };
  if (p.includes('trash') || p.includes('deleted')) return {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    color: customColor || '#ef4444',
  };
  return {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    color: customColor || '#64748b',
  };
}

export default function EmailSidebar({
  accountEmail, folders, activeFolder, loadingFolders,
  activeView, onFolderClick, onCompose, onRefresh, onFoldersRefresh, onSignatureClick, onWebinarClick,
}) {
  const [refreshing, setRefreshing]         = useState(false);
  const [showCreate, setShowCreate]         = useState(false);
  const [newName, setNewName]               = useState('');
  const [newColor, setNewColor]             = useState('#6366f1');
  const [creating, setCreating]             = useState(false);
  const [createError, setCreateError]       = useState('');
  const [folderColors, setFolderColors]     = useState({});
  const [colorPickerFor, setColorPickerFor] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try { setFolderColors(JSON.parse(localStorage.getItem('mailFolderColors') || '{}')); } catch {}
  }, []);

  const saveColor = (path, color) => {
    const next = { ...folderColors, [path]: color };
    setFolderColors(next);
    try { localStorage.setItem('mailFolderColors', JSON.stringify(next)); } catch {}
  };

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true); setCreateError('');
    try {
      const res = await fetch('/api/admin/email/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error || 'Failed'); return; }
      saveColor(data.path, newColor);
      setShowCreate(false); setNewName(''); setNewColor('#6366f1');
      onFoldersRefresh?.();
    } catch { setCreateError('Network error'); }
    finally { setCreating(false); }
  };

  useEffect(() => { if (showCreate) setTimeout(() => inputRef.current?.focus(), 60); }, [showCreate]);

  const FolderRow = ({ path, label, meta, isActive }) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setColorPickerFor(null); onFolderClick(path); }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 28px 9px 12px', marginBottom: '2px',
          background: isActive ? '#fff' : 'transparent',
          border: 'none', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
          color: isActive ? '#1e293b' : '#64748b',
          fontSize: '13px', fontWeight: isActive ? '600' : '500',
          transition: 'all 0.15s',
          boxShadow: isActive ? '0 1px 8px rgba(0,0,0,0.07)' : 'none',
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.color = '#334155'; }}}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}}
      >
        <span style={{
          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isActive ? `${meta.color}18` : 'transparent',
          color: isActive ? meta.color : '#94a3b8', transition: 'all 0.15s',
        }}>
          {meta.icon}
        </span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      </button>
      {/* Color dot - only for real IMAP folders */}
      {path !== STARRED_PATH && (
        <button
          title="Change color"
          onClick={e => { e.stopPropagation(); setColorPickerFor(colorPickerFor === path ? null : path); }}
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            width: '11px', height: '11px', borderRadius: '50%',
            background: meta.color, border: '2px solid rgba(255,255,255,0.9)',
            cursor: 'pointer', padding: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.4)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        />
      )}
      {/* Inline color picker popover */}
      {colorPickerFor === path && (
        <div style={{
          position: 'absolute', left: '10px', top: 'calc(100% + 4px)', zIndex: 50,
          background: '#fff', borderRadius: '12px', padding: '10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.14)', border: '1px solid #e8edf5',
          display: 'flex', flexWrap: 'wrap', gap: '7px', width: '172px',
        }}>
          {FOLDER_COLORS.map(c => (
            <button key={c} onClick={() => { saveColor(path, c); setColorPickerFor(null); }}
              style={{
                width: '22px', height: '22px', borderRadius: '50%', background: c,
                border: folderColors[path] === c ? '2.5px solid #0f172a' : '2px solid transparent',
                cursor: 'pointer', padding: 0,
                boxShadow: folderColors[path] === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : 'none',
                transition: 'all 0.12s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{ width: '240px', background: 'linear-gradient(180deg,#f8faff 0%,#f1f5fd 100%)', borderRight: '1px solid #e8edf5', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}
      onClick={() => setColorPickerFor(null)}
    >
      {/* Account header */}
      <div style={{ padding: '22px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '18px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '2px' }}>Mailbox</div>
            <div style={{ fontSize: '11.5px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>{accountEmail || 'Loading...'}</div>
          </div>
        </div>
        <button onClick={onCompose} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Compose
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
        {/* Smart section */}
        <div style={{ padding: '0 8px 5px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Smart</span>
        </div>
        <FolderRow
          path={STARRED_PATH} label="Starred"
          isActive={activeFolder === STARRED_PATH}
          meta={{ color: '#f59e0b', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill={activeFolder === STARRED_PATH ? '#f59e0b' : 'none'} stroke={activeFolder === STARRED_PATH ? '#f59e0b' : 'currentColor'} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }}
        />

        {/* Folders section */}
        <div style={{ padding: '8px 8px 5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Folders</span>
          <button onClick={e => { e.stopPropagation(); setShowCreate(v => !v); setCreateError(''); }}
            title="New folder"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '2px', borderRadius: '4px', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        {/* Create folder panel */}
        {showCreate && (
          <div onClick={e => e.stopPropagation()} style={{ margin: '0 2px 8px', padding: '12px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e8edf5' }}>
            <input
              ref={inputRef}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowCreate(false); }}
              placeholder="Folder name..."
              style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e8edf5', borderRadius: '8px', fontSize: '12.5px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', background: '#f8faff' }}
              onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#e8edf5'; e.target.style.background = '#f8faff'; }}
            />
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Color</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {FOLDER_COLORS.map(c => (
                  <button key={c} onClick={() => setNewColor(c)} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, border: newColor === c ? '2.5px solid #0f172a' : '2px solid transparent', cursor: 'pointer', padding: 0, boxShadow: newColor === c ? `0 0 0 2px #fff, 0 0 0 3.5px ${c}` : 'none', transition: 'all 0.12s' }} />
                ))}
              </div>
            </div>
            {createError && <div style={{ fontSize: '11.5px', color: '#ef4444', marginTop: '6px' }}>{createError}</div>}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button onClick={handleCreate} disabled={creating || !newName.trim()} style={{ flex: 1, padding: '7px', background: creating || !newName.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: creating || !newName.trim() ? '#94a3b8' : '#fff', fontSize: '12px', fontWeight: '700', cursor: creating || !newName.trim() ? 'not-allowed' : 'pointer' }}>
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button onClick={() => { setShowCreate(false); setNewName(''); setCreateError(''); }} style={{ padding: '7px 12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#64748b', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {loadingFolders ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
            <div style={{ width: '22px', height: '22px', border: '2px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'sbSpin 0.7s linear infinite' }}/>
          </div>
        ) : folders.map(folder => {
          const isActive = activeFolder === folder.path;
          const customColor = folderColors[folder.path];
          const meta = getFolderMeta(folder.path, customColor);
          const displayName = folder.name.replace(/^INBOX\./i, '');
          return <FolderRow key={folder.path} path={folder.path} label={displayName} meta={meta} isActive={isActive} />;
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid #e8edf5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button onClick={onWebinarClick} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          padding: '9px', cursor: 'pointer', border: `1px solid ${activeView === 'webinar' ? '#a5b4fc' : '#c7d2fe'}`,
          borderRadius: '10px', fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
          background: activeView === 'webinar' ? '#eef2ff' : 'transparent',
          color: activeView === 'webinar' ? '#6366f1' : '#6366f1',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
          onMouseLeave={e => { e.currentTarget.style.background = activeView === 'webinar' ? '#eef2ff' : 'transparent'; e.currentTarget.style.borderColor = activeView === 'webinar' ? '#a5b4fc' : '#c7d2fe'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
          Webinar Invitation
        </button>
        <button onClick={onSignatureClick} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          padding: '9px', cursor: 'pointer', border: `1px solid ${activeView === 'signature' ? '#a5b4fc' : '#c7d2fe'}`,
          borderRadius: '10px', fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
          background: activeView === 'signature' ? '#eef2ff' : 'transparent',
          color: activeView === 'signature' ? '#6366f1' : '#6366f1',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
          onMouseLeave={e => { e.currentTarget.style.background = activeView === 'signature' ? '#eef2ff' : 'transparent'; e.currentTarget.style.borderColor = activeView === 'signature' ? '#a5b4fc' : '#c7d2fe'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          My Signature
        </button>
        <button onClick={handleRefresh} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '9px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
          <span style={{ display: 'flex', animation: refreshing ? 'sbSpin 0.7s linear infinite' : 'none' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </span>
          Refresh
        </button>
      </div>

      <style>{`@keyframes sbSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
