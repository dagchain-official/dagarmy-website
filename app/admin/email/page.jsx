"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import EmailSidebar, { STARRED_PATH } from "@/components/admin/email/EmailSidebar";
import MessageList from "@/components/admin/email/MessageList";
import MessageReader from "@/components/admin/email/MessageReader";
import ComposeModal from "@/components/admin/email/ComposeModal";

const LIMIT = 25;

export default function EmailPage() {
  const [adminData, setAdminData]           = useState(null);
  const [folders, setFolders]               = useState([]);
  const [activeFolder, setActiveFolder]     = useState('INBOX');
  const [messages, setMessages]             = useState([]);
  const [totalMessages, setTotalMessages]   = useState(0);
  const [currentPage, setCurrentPage]       = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedUid, setSelectedUid]       = useState(null);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showCompose, setShowCompose]       = useState(false);
  const [composeDefaults, setComposeDefaults] = useState({});
  const [searchQuery, setSearchQuery]       = useState('');
  const [error, setError]                   = useState('');

  // Load admin session
  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then(r => r.json())
      .then(d => { if (d.admin) setAdminData(d.admin); })
      .catch(() => {});
  }, []);

  // Load folders
  const loadFolders = useCallback(async () => {
    setLoadingFolders(true);
    setError('');
    try {
      const res  = await fetch('/api/admin/email/folders');
      const data = await res.json();
      if (res.ok) setFolders(data.folders || []);
      else        setError(data.error || 'Failed to load mailbox');
    } catch {
      setError('Could not connect to mailbox. Check credentials.');
    } finally {
      setLoadingFolders(false);
    }
  }, []);

  useEffect(() => { loadFolders(); }, [loadFolders]);

  const searchDebounceRef = useRef(null);
  const prefetchCache = useRef(new Map()); // uid -> Promise|data
  const prefetchTimeout = useRef(new Map()); // uid -> timeout

  // Core fetch — used by both normal load and search
  const fetchMessages = useCallback(async (folder, page, search = '') => {
    setLoadingMessages(true);
    try {
      let url;
      if (folder === STARRED_PATH) {
        url = `/api/admin/email/starred?page=${page}&limit=${LIMIT}`;
      } else {
        url = `/api/admin/email/messages?folder=${encodeURIComponent(folder)}&page=${page}&limit=${LIMIT}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      }
      const res  = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
        setTotalMessages(data.total || 0);
      } else {
        setError(data.error || 'Failed to load messages');
      }
    } catch {
      setError('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Load messages (no search)
  const loadMessages = useCallback(async (folder, page) => {
    setSelectedMessage(null);
    setSelectedUid(null);
    await fetchMessages(folder, page, '');
  }, [fetchMessages]);

  useEffect(() => {
    if (folders.length > 0 || activeFolder === STARRED_PATH) loadMessages(activeFolder, currentPage);
  }, [activeFolder, currentPage, folders.length, loadMessages]);

  // Handlers
  const handleFolderClick = (path) => {
    setActiveFolder(path);
    setCurrentPage(1);
    setSelectedMessage(null);
    setSelectedUid(null);
    setSearchQuery('');
    prefetchCache.current.clear();
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
  };

  const handleMoveMessage = async (uid, targetFolder) => {
    await fetch('/api/admin/email/message', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: activeFolder === STARRED_PATH ? (selectedMessage?.sourceFolder || 'INBOX') : activeFolder, uid, action: 'move', targetFolder }),
    });
    setMessages(prev => prev.filter(m => m.uid !== uid));
    if (selectedUid === uid) { setSelectedMessage(null); setSelectedUid(null); }
  };

  // Debounced server-side search handler
  const handleSearchChange = useCallback((q) => {
    setSearchQuery(q);
    setCurrentPage(1);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!q.trim()) {
      // Empty query — reload normal messages
      loadMessages(activeFolder, 1);
      return;
    }
    searchDebounceRef.current = setTimeout(() => {
      setLoadingMessages(true);
      fetchMessages(activeFolder, 1, q.trim());
    }, 400);
  }, [activeFolder, fetchMessages, loadMessages]);

  // Prefetch a message silently (called on mouse-enter after 80ms delay)
  const prefetchMessage = useCallback((msg) => {
    const key = `${activeFolder}::${msg.uid}`;
    if (prefetchCache.current.has(key)) return; // already fetching or fetched
    const t = setTimeout(() => {
      const promise = fetch(`/api/admin/email/message?folder=${encodeURIComponent(activeFolder)}&uid=${msg.uid}`)
        .then(r => r.json())
        .then(data => {
          if (data.message) {
            prefetchCache.current.set(key, data.message);
          }
          return data;
        })
        .catch(() => {});
      prefetchCache.current.set(key, promise); // store promise so we don't double-fetch
    }, 80);
    prefetchTimeout.current.set(key, t);
  }, [activeFolder]);

  const cancelPrefetch = useCallback((msg) => {
    const key = `${activeFolder}::${msg.uid}`;
    const t = prefetchTimeout.current.get(key);
    if (t) { clearTimeout(t); prefetchTimeout.current.delete(key); }
    // Only cancel if still a Promise (not resolved yet)
    const cached = prefetchCache.current.get(key);
    if (cached && typeof cached.then === 'function') prefetchCache.current.delete(key);
  }, [activeFolder]);

  const handleMessageClick = async (msg) => {
    if (selectedUid === msg.uid) return;
    setSelectedUid(msg.uid);
    // Optimistically mark as read in list immediately
    setMessages(prev => prev.map(m => m.uid === msg.uid ? { ...m, isRead: true } : m));

    const key = `${activeFolder}::${msg.uid}`;
    const cached = prefetchCache.current.get(key);

    // If prefetch already resolved to a plain object — instant!
    if (cached && typeof cached.then !== 'function') {
      setSelectedMessage({ ...cached, folder: activeFolder });
      setLoadingMessage(false);
      return;
    }

    setLoadingMessage(true);
    try {
      let data;
      if (cached && typeof cached.then === 'function') {
        // Prefetch in-flight — await it instead of making a new request
        data = await cached;
      } else {
        const res = await fetch(`/api/admin/email/message?folder=${encodeURIComponent(activeFolder)}&uid=${msg.uid}`);
        data = await res.json();
      }
      if (data?.message) {
        setSelectedMessage({ ...data.message, folder: activeFolder });
      }
    } catch { /* silent */ }
    finally { setLoadingMessage(false); }
  };

  const handleStar = async (e, msg) => {
    e.stopPropagation();
    const starred = !msg.isStarred;
    setMessages(prev => prev.map(m => m.uid === msg.uid ? { ...m, isStarred: starred } : m));
    if (selectedMessage?.uid === msg.uid) setSelectedMessage(prev => ({ ...prev, isStarred: starred }));
    await fetch('/api/admin/email/message', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: activeFolder, uid: msg.uid, action: starred ? 'star' : 'unstar' }),
    });
  };

  const handleToggleStar = async () => {
    if (!selectedMessage) return;
    handleStar({ stopPropagation: () => {} }, selectedMessage);
  };

  const handleMarkUnread = async () => {
    if (!selectedMessage) return;
    await fetch('/api/admin/email/message', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: activeFolder, uid: selectedMessage.uid, action: 'unread' }),
    });
    setMessages(prev => prev.map(m => m.uid === selectedMessage.uid ? { ...m, isRead: false } : m));
    setSelectedMessage(null);
    setSelectedUid(null);
  };

  const handleDelete = async (uid) => {
    await fetch(`/api/admin/email/message?folder=${encodeURIComponent(activeFolder)}&uid=${uid}`, { method: 'DELETE' });
    setMessages(prev => prev.filter(m => m.uid !== uid));
    if (selectedUid === uid) { setSelectedMessage(null); setSelectedUid(null); }
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    setComposeDefaults({
      defaultTo: selectedMessage.from?.address || '',
      defaultSubject: selectedMessage.subject?.startsWith('Re:')
        ? selectedMessage.subject
        : `Re: ${selectedMessage.subject}`,
      replyMode: true,
    });
    setShowCompose(true);
  };

  const handleForward = () => {
    if (!selectedMessage) return;
    setComposeDefaults({
      defaultSubject: `Fwd: ${selectedMessage.subject}`,
      defaultHtml: `<br/><br/><div style="border-left:3px solid #e2e8f0;padding:8px 16px;color:#64748b;margin-top:16px"><strong>---------- Forwarded message ----------</strong><br/>${selectedMessage.html || ''}</div>`,
    });
    setShowCompose(true);
  };

  const totalPages = Math.max(1, Math.ceil(totalMessages / LIMIT));

  return (
    <AdminLayout>
      {/* Error banner */}
      {error && (
        <div style={{
          marginBottom: '16px', padding: '12px 20px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: '12px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>{error}</span>
          </div>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* 3-panel email client */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 112px)',
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
      }}>
        {/* Panel 1: Folders */}
        <EmailSidebar
          accountEmail={adminData?.department_email}
          folders={folders}
          activeFolder={activeFolder}
          loadingFolders={loadingFolders}
          onFolderClick={handleFolderClick}
          onCompose={() => { setComposeDefaults({}); setShowCompose(true); }}
          onRefresh={() => loadMessages(activeFolder, currentPage)}
          onFoldersRefresh={loadFolders}
        />

        {/* Panel 2: Message list */}
        <MessageList
          folderName={activeFolder}
          messages={messages}
          totalMessages={totalMessages}
          currentPage={currentPage}
          totalPages={totalPages}
          selectedUid={selectedUid}
          loading={loadingMessages}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onMessageClick={handleMessageClick}
          onStar={handleStar}
          onPageChange={(p) => {
            setCurrentPage(p);
            fetchMessages(activeFolder, p, searchQuery);
          }}
          onMessageHover={prefetchMessage}
          onMessageHoverEnd={cancelPrefetch}
        />

        {/* Panel 3: Message reader */}
        <MessageReader
          message={selectedMessage}
          loading={loadingMessage}
          onReply={handleReply}
          onForward={handleForward}
          onDelete={handleDelete}
          onToggleStar={handleToggleStar}
          onMarkUnread={handleMarkUnread}
          onMove={handleMoveMessage}
          folders={folders}
        />
      </div>

      {/* Compose modal */}
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSent={() => loadMessages(activeFolder, currentPage)}
          {...composeDefaults}
        />
      )}
    </AdminLayout>
  );
}
