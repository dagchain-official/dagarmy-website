"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Filter, CheckCircle, XCircle, Clock, Eye, Trash2,
  Edit3, ExternalLink, Image, Link2, ChevronDown, X, Save, PenLine,
  Youtube, Twitter, Facebook, Instagram, MessageCircle, Hash,
  BookOpen, Linkedin, Pin, Music, BarChart3, Globe, Zap, Users,
  ThumbsUp, MessageSquare, Share2, Tag, Play, Film, UserPlus, RefreshCw
} from "lucide-react";

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube', color: '#FF0000', bg: '#FEE2E2', icon: Youtube },
  { value: 'twitter', label: 'Twitter / X', color: '#1DA1F2', bg: '#DBEAFE', icon: Twitter },
  { value: 'facebook', label: 'Facebook', color: '#1877F2', bg: '#DBEAFE', icon: Facebook },
  { value: 'instagram', label: 'Instagram', color: '#E4405F', bg: '#FCE7F3', icon: Instagram },
  { value: 'telegram', label: 'Telegram', color: '#0088CC', bg: '#CFFAFE', icon: MessageCircle },
  { value: 'discord', label: 'Discord', color: '#5865F2', bg: '#EDE9FE', icon: Hash },
  { value: 'medium', label: 'Medium', color: '#000000', bg: '#F1F5F9', icon: BookOpen },
  { value: 'linkedin', label: 'LinkedIn', color: '#0A66C2', bg: '#DBEAFE', icon: Linkedin },
  { value: 'pinterest', label: 'Pinterest', color: '#E60023', bg: '#FEE2E2', icon: Pin },
  { value: 'tiktok', label: 'TikTok', color: '#000000', bg: '#F1F5F9', icon: Music },
  { value: 'coinmarketcap', label: 'CoinMarketCap', color: '#17181B', bg: '#F1F5F9', icon: BarChart3 },
];

const TASK_TYPES = [
  { value: 'subscribe', label: 'Subscribe', icon: UserPlus, points: 150 },
  { value: 'follow', label: 'Follow', icon: UserPlus, points: 150 },
  { value: 'like', label: 'Like', icon: ThumbsUp, points: 10 },
  { value: 'comment', label: 'Comment', icon: MessageSquare, points: 10 },
  { value: 'share', label: 'Share', icon: Share2, points: 10 },
  { value: 'tag', label: 'Tag / Mention', icon: Tag, points: 10 },
  { value: 'watch_video', label: 'Watch Video', icon: Play, points: 10 },
  { value: 'create_shorts', label: 'Create Shorts', icon: Film, points: 50 },
  { value: 'create_video', label: 'Create Video (3min+)', icon: Film, points: 100 },
  { value: 'repost', label: 'Repost / Retweet', icon: RefreshCw, points: 10 },
  { value: 'join', label: 'Join Group/Server', icon: Users, points: 150 },
];

const getPlatform = (v) => PLATFORMS.find(p => p.value === v) || { label: v, color: '#64748b', bg: '#f1f5f9', icon: Globe };
const getTaskType = (v) => TASK_TYPES.find(t => t.value === v) || { label: v, icon: Zap, points: 10 };

export default function TasksManagement() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submissionFilter, setSubmissionFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [customPlatform, setCustomPlatform] = useState(false);
  const [customTaskType, setCustomTaskType] = useState(false);

  // Form state
  const [form, setForm] = useState({
    platform: 'youtube', task_type: 'subscribe', title: '', description: '',
    points: 150, target_url: '', max_completions_per_user: 1, expires_at: ''
  });

  const userEmail = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('dagarmy_user') || '{}').email : '';

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const sm = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/social-tasks?active=false');
      const data = await res.json();
      if (data.success) setTasks(data.tasks || []);
    } catch (e) { console.error(e); }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch(`/api/social-tasks/submissions?user_email=${encodeURIComponent(userEmail)}&status=${submissionFilter}`);
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions || []);
    } catch (e) { console.error(e); }
  }, [userEmail, submissionFilter]);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchSubmissions()]).finally(() => setLoading(false));
  }, [fetchTasks, fetchSubmissions]);

  useEffect(() => { if (activeTab === 'approvals') fetchSubmissions(); }, [activeTab, submissionFilter, fetchSubmissions]);

  const handleCreateOrUpdate = async () => {
    if (!form.title || !form.platform || !form.task_type) {
      sm('error', 'Title, platform, and task type are required');
      return;
    }
    try {
      const payload = { ...form, user_email: userEmail, points: parseInt(form.points) || 10 };
      let res;
      if (editingTask) {
        res = await fetch(`/api/social-tasks/${editingTask.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/social-tasks', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (data.success) {
        sm('success', editingTask ? 'Task updated' : 'Task created');
        setShowCreate(false);
        setEditingTask(null);
        setForm({ platform: 'youtube', task_type: 'subscribe', title: '', description: '', points: 150, target_url: '', max_completions_per_user: 1, expires_at: '' });
        fetchTasks();
      } else {
        sm('error', data.error || 'Failed');
      }
    } catch (e) { sm('error', e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task? All submissions will also be deleted.')) return;
    try {
      const res = await fetch(`/api/social-tasks/${id}?user_email=${encodeURIComponent(userEmail)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { sm('success', 'Task deleted'); fetchTasks(); }
      else sm('error', data.error);
    } catch (e) { sm('error', e.message); }
  };

  const handleToggleActive = async (task) => {
    try {
      const res = await fetch(`/api/social-tasks/${task.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail, is_active: !task.is_active })
      });
      const data = await res.json();
      if (data.success) { sm('success', data.task.is_active ? 'Task activated' : 'Task deactivated'); fetchTasks(); }
    } catch (e) { sm('error', e.message); }
  };

  const handleReview = async (submissionId, status, adminNotes) => {
    try {
      const res = await fetch(`/api/social-tasks/submissions/${submissionId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail, status, admin_notes: adminNotes || '' })
      });
      const data = await res.json();
      if (data.success) {
        sm('success', data.message);
        fetchSubmissions();
      } else sm('error', data.error);
    } catch (e) { sm('error', e.message); }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setForm({
      platform: task.platform, task_type: task.task_type, title: task.title,
      description: task.description || '', points: task.points,
      target_url: task.target_url || '', max_completions_per_user: task.max_completions_per_user || 1,
      expires_at: task.expires_at ? task.expires_at.slice(0, 16) : ''
    });
    setCustomPlatform(!PLATFORMS.some(p => p.value === task.platform));
    setCustomTaskType(!TASK_TYPES.some(t => t.value === task.task_type));
    setShowCreate(true);
  };

  /* ─── Reusable Components ─── */
  const BentoCard = useCallback(({ children, style = {}, hover = true, ...props }) => (
    <div style={{
      background: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)',
      transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', ...style
    }}
    onMouseEnter={hover ? e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
    onMouseLeave={hover ? e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
    {...props}>{children}</div>
  ), [mounted]);

  const pendingCount = submissions.length;

  const filteredTasks = tasks.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.platform.includes(q) || t.task_type.includes(q);
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Loading tasks...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px 36px', width: '100%', background: '#f6f8fb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} style={{ color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Social Tasks</h1>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Create and manage social media tasks for DAG point rewards</p>
        </div>
        <button onClick={() => { setShowCreate(true); setEditingTask(null); setCustomPlatform(false); setCustomTaskType(false); setForm({ platform: 'youtube', task_type: 'subscribe', title: '', description: '', points: 150, target_url: '', max_completions_per_user: 1, expires_at: '' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
          onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{ marginBottom: '16px', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
          background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: message.type === 'success' ? '#15803d' : '#dc2626',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#fff', borderRadius: '14px', padding: '4px', border: '1px solid rgba(0,0,0,0.06)', width: 'fit-content' }}>
        {[
          { key: 'tasks', label: 'All Tasks', icon: Zap },
          { key: 'approvals', label: 'Approval Queue', icon: Clock, badge: pendingCount },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
              background: activeTab === tab.key ? '#0f172a' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#64748b' }}>
            <tab.icon size={14} />
            {tab.label}
            {tab.badge > 0 && (
              <span style={{ padding: '1px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
                background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : '#fef2f2', color: activeTab === tab.key ? '#fff' : '#ef4444' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ TASKS TAB ═══ */}
      {activeTab === 'tasks' && (
        <>
          {/* Search */}
          <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tasks..."
              style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', background: '#fff', transition: 'border 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
          </div>

          {/* Task Grid */}
          {filteredTasks.length === 0 ? (
            <BentoCard style={{ padding: '60px', textAlign: 'center' }} hover={false}>
              <Zap size={40} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>No tasks yet</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Create your first social media task to get started</p>
            </BentoCard>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {filteredTasks.map(task => {
                const plat = getPlatform(task.platform);
                const tt = getTaskType(task.task_type);
                const PlatIcon = plat.icon;
                const TypeIcon = tt.icon;
                return (
                  <BentoCard key={task.id} style={{ padding: 0 }}>
                    {/* Card header */}
                    <div style={{ padding: '20px 22px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: plat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PlatIcon size={20} style={{ color: plat.color }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: '1.3' }}>{task.title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: plat.bg, color: plat.color, textTransform: 'uppercase' }}>{plat.label}</span>
                            <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>{tt.label}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.is_active ? '#10b981' : '#ef4444' }} />
                        <span style={{ fontSize: '10px', fontWeight: '700', color: task.is_active ? '#10b981' : '#ef4444', textTransform: 'uppercase' }}>
                          {task.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p style={{ padding: '0 22px', fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: '0 0 12px' }}>{task.description}</p>
                    )}

                    {/* Points & URL */}
                    <div style={{ padding: '0 22px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{task.points}</span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>DAG pts</span>
                      </div>
                      {task.target_url && (
                        <a href={task.target_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: '#6366f1', textDecoration: 'none' }}>
                          <ExternalLink size={12} /> View Target
                        </a>
                      )}
                    </div>

                    {/* Footer actions */}
                    <div style={{ padding: '12px 22px', borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfc' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => startEdit(task)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: '#64748b', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = '#64748b'; }}>
                          <Edit3 size={12} /> Edit
                        </button>
                        <button onClick={() => handleToggleActive(task)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: task.is_active ? '#f59e0b' : '#10b981', transition: 'all 0.15s' }}>
                          {task.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                      <button onClick={() => handleDelete(task.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', transition: 'all 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </BentoCard>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ APPROVALS TAB ═══ */}
      {activeTab === 'approvals' && (
        <>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            {['pending', 'approved', 'rejected'].map(s => (
              <button key={s} onClick={() => setSubmissionFilter(s)}
                style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s',
                  background: submissionFilter === s ? '#0f172a' : '#fff',
                  color: submissionFilter === s ? '#fff' : '#64748b',
                  boxShadow: submissionFilter === s ? 'none' : '0 1px 3px rgba(0,0,0,0.06)' }}>
                {s}
              </button>
            ))}
          </div>

          {submissions.length === 0 ? (
            <BentoCard style={{ padding: '60px', textAlign: 'center' }} hover={false}>
              <CheckCircle size={40} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>No {submissionFilter} submissions</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                {submissionFilter === 'pending' ? 'All caught up! No submissions waiting for review.' : `No ${submissionFilter} submissions found.`}
              </p>
            </BentoCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {submissions.map(sub => {
                const plat = sub.task ? getPlatform(sub.task.platform) : getPlatform('');
                const PlatIcon = plat.icon;
                return (
                  <BentoCard key={sub.id} style={{ padding: 0 }} hover={false}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', padding: '20px 24px', alignItems: 'center' }}>
                      {/* Left: user + task info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Avatar */}
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: plat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <PlatIcon size={22} style={{ color: plat.color }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                              {sub.user ? `${sub.user.first_name || ''} ${sub.user.last_name || ''}`.trim() || sub.user.email : 'Unknown'}
                            </span>
                            {sub.user?.tier === 'DAG_LIEUTENANT' && (
                              <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '100px', background: '#eef2ff', color: '#6366f1', textTransform: 'uppercase' }}>DAG LIEUTENANT</span>
                            )}
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {sub.task?.title || 'Unknown task'} - <span style={{ color: plat.color, fontWeight: '600' }}>{plat.label}</span>
                          </p>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                            {sub.proof_url && (
                              <a href={sub.proof_url} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: '#6366f1', textDecoration: 'none', padding: '3px 10px', borderRadius: '6px', background: '#eef2ff' }}>
                                <Link2 size={11} /> Proof Link
                              </a>
                            )}
                            {sub.proof_screenshot_url && (
                              <a href={sub.proof_screenshot_url} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: '#8b5cf6', textDecoration: 'none', padding: '3px 10px', borderRadius: '6px', background: '#f5f3ff' }}>
                                <Image size={11} /> Screenshot
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: points + actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right', marginRight: '8px' }}>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{sub.task?.points || 0}</span>
                          <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginLeft: '4px' }}>pts</span>
                          {sub.user?.tier === 'DAG_LIEUTENANT' && (
                            <div style={{ fontSize: '10px', fontWeight: '600', color: '#8b5cf6' }}>+20% LT bonus</div>
                          )}
                        </div>
                        {sub.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleReview(sub.id, 'approved')}
                              style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#10b981', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                              onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => handleReview(sub.id, 'rejected')}
                              style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fff', color: '#ef4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        )}
                        {sub.status === 'approved' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: '10px', background: '#f0fdf4', color: '#15803d', fontSize: '12px', fontWeight: '700' }}>
                            <CheckCircle size={14} /> Approved ({sub.points_awarded} pts)
                          </div>
                        )}
                        {sub.status === 'rejected' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', fontSize: '12px', fontWeight: '700' }}>
                            <XCircle size={14} /> Rejected
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Timestamp */}
                    <div style={{ padding: '8px 24px', borderTop: '1px solid rgba(0,0,0,0.04)', background: '#fafbfc', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Submitted {new Date(sub.created_at).toLocaleString()}</span>
                      {sub.reviewed_at && <span>Reviewed {new Date(sub.reviewed_at).toLocaleString()} by {sub.reviewer?.first_name || 'Admin'}</span>}
                    </div>
                  </BentoCard>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ CREATE/EDIT MODAL ═══ */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowCreate(false); setEditingTask(null); } }}>
          <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            {/* Modal header */}
            <div style={{ padding: '24px 28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button onClick={() => { setShowCreate(false); setEditingTask(null); }}
                style={{ width: '32px', height: '32px', borderRadius: '10px', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Platform */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform</label>
                  <button onClick={() => { setCustomPlatform(!customPlatform); if (customPlatform) { setForm(f => ({ ...f, platform: 'youtube' })); } }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', color: customPlatform ? '#6366f1' : '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: '6px', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                    onMouseLeave={e => { if (!customPlatform) e.currentTarget.style.color = '#94a3b8'; }}>
                    <PenLine size={10} /> {customPlatform ? 'Use Presets' : 'Custom'}
                  </button>
                </div>
                {customPlatform ? (
                  <input value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                    placeholder="e.g. threads, snapchat, reddit..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PLATFORMS.map(p => {
                      const Icon = p.icon;
                      return (
                        <button key={p.value} onClick={() => setForm(f => ({ ...f, platform: p.value }))}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', border: `1.5px solid ${form.platform === p.value ? p.color : 'rgba(0,0,0,0.06)'}`, background: form.platform === p.value ? p.bg : '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: form.platform === p.value ? p.color : '#64748b', transition: 'all 0.15s' }}>
                          <Icon size={14} /> {p.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Task Type */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Type</label>
                  <button onClick={() => { setCustomTaskType(!customTaskType); if (customTaskType) { setForm(f => ({ ...f, task_type: 'subscribe', points: 150 })); } }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700', color: customTaskType ? '#6366f1' : '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: '6px', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                    onMouseLeave={e => { if (!customTaskType) e.currentTarget.style.color = '#94a3b8'; }}>
                    <PenLine size={10} /> {customTaskType ? 'Use Presets' : 'Custom'}
                  </button>
                </div>
                {customTaskType ? (
                  <input value={form.task_type} onChange={e => setForm(f => ({ ...f, task_type: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                    placeholder="e.g. review, pin, bookmark..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {TASK_TYPES.map(t => {
                      const Icon = t.icon;
                      return (
                        <button key={t.value} onClick={() => setForm(f => ({ ...f, task_type: t.value, points: t.points }))}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', border: `1.5px solid ${form.task_type === t.value ? '#6366f1' : 'rgba(0,0,0,0.06)'}`, background: form.task_type === t.value ? '#eef2ff' : '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: form.task_type === t.value ? '#6366f1' : '#64748b', transition: 'all 0.15s' }}>
                          <Icon size={14} /> {t.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Subscribe to our YouTube channel"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description (optional)</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what the user needs to do..."
                  rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>

              {/* Points + Target URL row */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Points</label>
                  <input type="number" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target URL</label>
                  <input value={form.target_url} onChange={e => setForm(f => ({ ...f, target_url: e.target.value }))} placeholder="https://youtube.com/..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                </div>
              </div>

              {/* Max completions + Expiry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Max Completions</label>
                  <input type="number" value={form.max_completions_per_user} onChange={e => setForm(f => ({ ...f, max_completions_per_user: parseInt(e.target.value) || 1 }))} min={1}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expires At (optional)</label>
                  <input type="datetime-local" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                </div>
              </div>

              {/* Submit */}
              <button onClick={handleCreateOrUpdate}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
                <Save size={16} /> {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
