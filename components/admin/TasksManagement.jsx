"use client";
import React, { useState, useEffect, useCallback } from "react";
import DailyMissionScheduler from "./DailyMissionScheduler";
import CommunityMissionScheduler from "./CommunityMissionScheduler";
import {
  Search, CheckCircle, XCircle, Clock, Trash2,
  ExternalLink, Image, Link2,
  Youtube, Twitter, Facebook, Instagram, MessageCircle, Hash,
  BookOpen, Linkedin, Pin, Music, BarChart3, Globe, Zap, Users,
  ThumbsUp, MessageSquare, Share2, Tag, Play, Film, UserPlus, RefreshCw,
  Star, Sun
} from "lucide-react";

const PLATFORMS = [
  { value: 'youtube',      label: 'YouTube',       color: '#FF0000', bg: '#FEE2E2', icon: Youtube },
  { value: 'twitter',      label: 'Twitter / X',   color: '#1DA1F2', bg: '#DBEAFE', icon: Twitter },
  { value: 'facebook',     label: 'Facebook',      color: '#1877F2', bg: '#DBEAFE', icon: Facebook },
  { value: 'instagram',    label: 'Instagram',     color: '#E4405F', bg: '#FCE7F3', icon: Instagram },
  { value: 'telegram',     label: 'Telegram',      color: '#0088CC', bg: '#CFFAFE', icon: MessageCircle },
  { value: 'discord',      label: 'Discord',       color: '#5865F2', bg: '#EDE9FE', icon: Hash },
  { value: 'medium',       label: 'Medium',        color: '#000000', bg: '#F1F5F9', icon: BookOpen },
  { value: 'linkedin',     label: 'LinkedIn',      color: '#0A66C2', bg: '#DBEAFE', icon: Linkedin },
  { value: 'pinterest',    label: 'Pinterest',     color: '#E60023', bg: '#FEE2E2', icon: Pin },
  { value: 'tiktok',       label: 'TikTok',        color: '#000000', bg: '#F1F5F9', icon: Music },
  { value: 'coinmarketcap',label: 'CoinMarketCap', color: '#17181B', bg: '#F1F5F9', icon: BarChart3 },
];

const TASK_TYPES = [
  { value: 'subscribe', label: 'Subscribe',        icon: UserPlus,      points: 150 },
  { value: 'follow',    label: 'Follow',            icon: UserPlus,      points: 150 },
  { value: 'join',      label: 'Join Group/Server', icon: Users,         points: 150 },
  { value: 'like',      label: 'Like',              icon: ThumbsUp,      points: 50  },
  { value: 'comment',   label: 'Comment',           icon: MessageSquare, points: 75  },
  { value: 'share',     label: 'Share / Repost',    icon: Share2,        points: 75  },
  { value: 'retweet',   label: 'Retweet',           icon: RefreshCw,     points: 50  },
  { value: 'watch',     label: 'Watch Video',       icon: Play,          points: 50  },
  { value: 'tag',       label: 'Tag a Friend',      icon: Tag,           points: 50  },
  { value: 'create_short',  label: 'Create a Short',        icon: Film,          points: 100 },
  { value: 'create_reel',   label: 'Create a Reel',         icon: Film,          points: 100 },
  { value: 'create_post',   label: 'Create a Post',         icon: MessageSquare, points: 75  },
  { value: 'create_video',  label: 'Create a Video',        icon: Film,          points: 150 },
  { value: 'create_thread', label: 'Create a Thread',       icon: MessageSquare, points: 75  },
  { value: 'story_mention', label: 'Post a Story / Mention',icon: Tag,           points: 75  },
  { value: 'review',        label: 'Write a Review',        icon: Star,          points: 100 },
];

const getPlatform = (v) => PLATFORMS.find(p => p.value === v) || { label: v, color: '#64748b', bg: '#f1f5f9', icon: Globe };
const getTaskType = (v) => TASK_TYPES.find(t => t.value === v) || { label: v, icon: Zap, points: 10 };

export default function TasksManagement() {
  const [tasks, setTasks]                   = useState([]);
  const [submissions, setSubmissions]       = useState([]);
  const [loading, setLoading]               = useState(true);
  const [activeTab, setActiveTab]           = useState('tasks');
  const [message, setMessage]               = useState({ type: '', text: '' });
  const [submissionFilter, setSubmissionFilter] = useState('pending');
  const [searchQuery, setSearchQuery]       = useState('');
  const [mounted, setMounted]               = useState(false);
  const [missionFilter, setMissionFilter]   = useState('all');

  const userEmail = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('dagarmy_user') || '{}').email : '';

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

  useEffect(() => {
    if (activeTab === 'approvals') fetchSubmissions();
  }, [activeTab, submissionFilter, fetchSubmissions]);

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
      if (data.success) { sm('success', data.message); fetchSubmissions(); }
      else sm('error', data.error);
    } catch (e) { sm('error', e.message); }
  };

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
    if (missionFilter !== 'all' && t.mission_type !== missionFilter) return false;
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
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Missions</h1>
        </div>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage Daily &amp; Community missions - use the schedulers to create new tasks</p>
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
          { key: 'tasks',              label: 'All Tasks',            icon: Zap },
          { key: 'daily_schedule',     label: 'Daily Scheduler',      icon: Sun },
          { key: 'community_schedule', label: 'Community Scheduler',  icon: Users },
          { key: 'approvals',          label: 'Approval Queue',       icon: Clock, badge: pendingCount },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
              background: activeTab === tab.key ? '#0f172a' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#64748b' }}>
            <tab.icon size={14} />
            {tab.label}
            {tab.badge > 0 && (
              <span style={{ padding: '1px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
                background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : '#fef2f2',
                color: activeTab === tab.key ? '#fff' : '#ef4444' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ ALL TASKS TAB ═══ */}
      {activeTab === 'tasks' && (
        <>
          {/* Mission type filter */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {[{v:'all',l:'All Missions'},{v:'daily',l:'Daily'},{v:'community',l:'Community'}].map(f => (
              <button key={f.v} onClick={() => setMissionFilter(f.v)}
                style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s',
                  background: missionFilter === f.v ? '#0f172a' : '#fff',
                  color: missionFilter === f.v ? '#fff' : '#64748b',
                  boxShadow: missionFilter === f.v ? 'none' : '0 1px 3px rgba(0,0,0,0.06)' }}>
                {f.l}
              </button>
            ))}
          </div>

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
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Use the Daily or Community Scheduler tabs to create missions</p>
            </BentoCard>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {filteredTasks.map(task => {
                const plat = getPlatform(task.platform);
                const tt   = getTaskType(task.task_type);
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
                            <TypeIcon size={11} style={{ color: '#94a3b8' }} />
                            <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>{tt.label}</span>
                            <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px',
                              background: task.mission_type === 'daily' ? '#eef2ff' : '#f0fdf4',
                              color:      task.mission_type === 'daily' ? '#6366f1' : '#15803d',
                              textTransform: 'uppercase' }}>{task.mission_type || 'community'}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
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

                    {/* Footer */}
                    <div style={{ padding: '12px 22px', borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfc' }}>
                      <button onClick={() => handleToggleActive(task)}
                        style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                          color: task.is_active ? '#f59e0b' : '#10b981', transition: 'all 0.15s' }}>
                        {task.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(task.id)}
                        style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', transition: 'all 0.15s' }}
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

      {/* ═══ DAILY SCHEDULER TAB ═══ */}
      {activeTab === 'daily_schedule' && (
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', padding: '28px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <DailyMissionScheduler />
        </div>
      )}

      {/* ═══ COMMUNITY SCHEDULER TAB ═══ */}
      {activeTab === 'community_schedule' && (
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', padding: '28px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <CommunityMissionScheduler />
        </div>
      )}

      {/* ═══ APPROVALS TAB ═══ */}
      {activeTab === 'approvals' && (
        <>
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
                {submissionFilter === 'pending' ? 'All caught up!' : `No ${submissionFilter} submissions found.`}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: plat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <PlatIcon size={22} style={{ color: plat.color }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                              {sub.user ? `${sub.user.first_name || ''} ${sub.user.last_name || ''}`.trim() || sub.user.email : 'Unknown'}
                            </span>
                            {sub.user?.tier === 'DAG_LIEUTENANT' && (
                              <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '100px', background: '#eef2ff', color: '#6366f1', textTransform: 'uppercase' }}>LT</span>
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

    </div>
  );
}
