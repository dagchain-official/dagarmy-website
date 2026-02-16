"use client";
import React, { useState, useEffect, useCallback } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import {
  Zap, CheckCircle, Clock, XCircle, ExternalLink, Link2, Image,
  Upload, X, Send, Filter, Trophy, TrendingUp, Star,
  Youtube, Twitter, Facebook, Instagram, MessageCircle, Hash,
  BookOpen, Linkedin, Pin, Music, BarChart3, Globe,
  ThumbsUp, MessageSquare, Share2, Tag, Play, Film, UserPlus, RefreshCw, Users
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

const TASK_TYPE_ICONS = {
  subscribe: UserPlus, follow: UserPlus, like: ThumbsUp, comment: MessageSquare,
  share: Share2, tag: Tag, watch_video: Play, create_shorts: Film,
  create_video: Film, repost: RefreshCw, join: Users
};

const getPlatform = (v) => PLATFORMS.find(p => p.value === v) || { label: v, color: '#64748b', bg: '#f1f5f9', icon: Globe };

export default function StudentTasksPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total_tasks: 0, completed: 0, pending: 0, available: 0, total_points_earned: 0 });
  const [isLieutenant, setIsLieutenant] = useState(false);
  const [ltBonusRate, setLtBonusRate] = useState(20);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [submitModal, setSubmitModal] = useState(null);
  const [proofUrl, setProofUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('dagarmy_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchTasks(userData.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTasks = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/social-tasks/user?user_email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks || []);
        setStats(data.stats || {});
        setIsLieutenant(data.is_lieutenant || false);
        setLtBonusRate(data.lt_bonus_rate || 20);
      }
    } catch (e) {
      console.error('Error fetching tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!proofUrl.trim()) {
      setMessage({ type: 'error', text: 'Please provide a proof URL or screenshot link' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/social-tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: submitModal.id,
          user_email: user.email,
          proof_url: proofUrl.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Proof submitted! Waiting for admin review.' });
        setSubmitModal(null);
        setProofUrl('');
        fetchTasks(user.email);
      } else {
        setMessage({ type: 'error', text: data.error || 'Submission failed' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (platformFilter !== 'all' && t.platform !== platformFilter) return false;
    if (statusFilter !== 'all' && t.user_status !== statusFilter) return false;
    return true;
  });

  // Group by platform
  const groupedByPlatform = {};
  filteredTasks.forEach(t => {
    if (!groupedByPlatform[t.platform]) groupedByPlatform[t.platform] = [];
    groupedByPlatform[t.platform].push(t);
  });

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

  const statusColors = {
    available: { bg: '#f0fdf4', color: '#15803d', label: 'Available' },
    pending: { bg: '#fffbeb', color: '#b45309', label: 'Pending Review' },
    completed: { bg: '#eef2ff', color: '#4338ca', label: 'Completed' },
    expired: { bg: '#f1f5f9', color: '#64748b', label: 'Expired' },
  };

  if (loading) {
    return (
      <div id="wrapper">
        <Header2 />
        <div className="main-content pt-0">
          <div className="page-inner" style={{ padding: "0" }}>
            <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
              <div style={{ width: "240px", flexShrink: 0, padding: "24px 16px", position: "sticky", top: "0", height: "100vh", overflowY: "auto", background: "#fff" }}>
                <DashboardNav2 />
              </div>
              <div style={{ flex: 1, padding: "40px", background: "#f6f8fb", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Loading tasks...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </div>
    );
  }

  return (
    <div id="wrapper">
      <Header2 />
      <div className="main-content pt-0">
        <div className="page-inner" style={{ padding: "0" }}>
          <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
            <div style={{ width: "240px", flexShrink: 0, background: "#fff", padding: "32px 16px", position: "sticky", top: "0", height: "100vh", overflowY: "auto" }}>
              <DashboardNav2 />
            </div>
            <div style={{ flex: 1, padding: '32px 36px', background: '#f6f8fb', minHeight: '100vh' }}>

              {/* Header */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={20} style={{ color: '#fff' }} />
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Social Tasks</h1>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                  Complete social media tasks to earn DAG Points
                  {isLieutenant && <span style={{ color: '#6366f1', fontWeight: '600' }}> (+{ltBonusRate}% DAG LIEUTENANT bonus)</span>}
                </p>
              </div>

              {/* Message */}
              {message.text && (
                <div style={{ marginBottom: '16px', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                  background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: message.type === 'success' ? '#15803d' : '#dc2626',
                  border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {message.text}
                  <button onClick={() => setMessage({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '2px' }}><X size={14} /></button>
                </div>
              )}

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
                {[
                  { label: 'Available', value: stats.available, color: '#10b981', bg: '#f0fdf4', icon: Zap },
                  { label: 'Pending', value: stats.pending, color: '#f59e0b', bg: '#fffbeb', icon: Clock },
                  { label: 'Completed', value: stats.completed, color: '#6366f1', bg: '#eef2ff', icon: CheckCircle },
                  { label: 'Points Earned', value: stats.total_points_earned, color: '#8b5cf6', bg: '#f5f3ff', icon: Trophy },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <BentoCard key={i} style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' }}>{s.label}</p>
                          <p style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{s.value}</p>
                        </div>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={20} style={{ color: s.color }} />
                        </div>
                      </div>
                    </BentoCard>
                  );
                })}
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Platform filter */}
                <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '12px', padding: '4px', border: '1px solid rgba(0,0,0,0.06)', flexWrap: 'wrap' }}>
                  <button onClick={() => setPlatformFilter('all')}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                      background: platformFilter === 'all' ? '#0f172a' : 'transparent', color: platformFilter === 'all' ? '#fff' : '#64748b' }}>
                    All
                  </button>
                  {PLATFORMS.map(p => {
                    const Icon = p.icon;
                    const count = tasks.filter(t => t.platform === p.value).length;
                    if (count === 0) return null;
                    return (
                      <button key={p.value} onClick={() => setPlatformFilter(p.value)}
                        style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px',
                          background: platformFilter === p.value ? p.bg : 'transparent', color: platformFilter === p.value ? p.color : '#64748b' }}>
                        <Icon size={12} /> {p.label}
                      </button>
                    );
                  })}
                </div>

                {/* Status filter */}
                <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '12px', padding: '4px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {['all', 'available', 'pending', 'completed'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize',
                        background: statusFilter === s ? '#0f172a' : 'transparent', color: statusFilter === s ? '#fff' : '#64748b' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              {filteredTasks.length === 0 ? (
                <BentoCard style={{ padding: '60px', textAlign: 'center' }} hover={false}>
                  <Zap size={40} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>No tasks found</p>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    {tasks.length === 0 ? 'No social tasks available yet. Check back soon!' : 'Try adjusting your filters.'}
                  </p>
                </BentoCard>
              ) : (
                Object.entries(groupedByPlatform).map(([platform, platformTasks]) => {
                  const plat = getPlatform(platform);
                  const PlatIcon = plat.icon;
                  return (
                    <div key={platform} style={{ marginBottom: '28px' }}>
                      {/* Platform header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: plat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PlatIcon size={16} style={{ color: plat.color }} />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{plat.label}</h2>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>{platformTasks.length} task{platformTasks.length !== 1 ? 's' : ''}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                        {platformTasks.map(task => {
                          const st = statusColors[task.user_status] || statusColors.available;
                          const TypeIcon = TASK_TYPE_ICONS[task.task_type] || Zap;
                          return (
                            <BentoCard key={task.id} style={{ padding: 0 }}>
                              <div style={{ padding: '20px 22px 14px' }}>
                                {/* Status badge + type */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <TypeIcon size={14} style={{ color: '#64748b' }} />
                                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'capitalize' }}>
                                      {task.task_type.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: st.bg, color: st.color, textTransform: 'uppercase' }}>
                                    {st.label}
                                  </span>
                                </div>

                                {/* Title */}
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px', lineHeight: '1.4' }}>{task.title}</h3>
                                {task.description && (
                                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: '0 0 14px' }}>{task.description}</p>
                                )}

                                {/* Points */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{task.effective_points}</span>
                                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>DAG pts</span>
                                  {task.lt_bonus > 0 && (
                                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#6366f1', marginLeft: '6px', padding: '2px 6px', borderRadius: '100px', background: '#eef2ff' }}>
                                      +{task.lt_bonus} LT bonus
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Footer */}
                              <div style={{ padding: '12px 22px', borderTop: '1px solid rgba(0,0,0,0.04)', background: '#fafbfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {task.target_url && (
                                  <a href={task.target_url} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: plat.color, textDecoration: 'none' }}>
                                    <ExternalLink size={12} /> Open Link
                                  </a>
                                )}
                                {!task.target_url && <span />}

                                {task.user_status === 'available' && (
                                  <button onClick={() => { setSubmitModal(task); setProofUrl(''); }}
                                    style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
                                    <Send size={12} /> Submit Proof
                                  </button>
                                )}
                                {task.user_status === 'pending' && (
                                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} /> Awaiting review
                                  </span>
                                )}
                                {task.user_status === 'completed' && (
                                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle size={12} /> Done
                                  </span>
                                )}
                              </div>
                            </BentoCard>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Submit Proof Modal */}
              {submitModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                  onClick={e => { if (e.target === e.currentTarget) setSubmitModal(null); }}>
                  <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
                    {/* Modal header */}
                    <div style={{ padding: '24px 28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>Submit Proof</h2>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{submitModal.title}</p>
                      </div>
                      <button onClick={() => setSubmitModal(null)}
                        style={{ width: '32px', height: '32px', borderRadius: '10px', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <X size={16} />
                      </button>
                    </div>

                    <div style={{ padding: '20px 28px 28px' }}>
                      {/* Instructions */}
                      <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '16px' }}>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                          <strong style={{ color: '#0f172a' }}>How to submit:</strong> Complete the task, then paste the proof URL below (e.g., your comment link, screenshot URL, or profile link showing the follow/subscription).
                        </p>
                      </div>

                      {/* Target link */}
                      {submitModal.target_url && (
                        <a href={submitModal.target_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#6366f1', textDecoration: 'none', marginBottom: '16px', padding: '10px 14px', borderRadius: '10px', background: '#eef2ff' }}>
                          <ExternalLink size={14} /> Open task link to complete the action first
                        </a>
                      )}

                      {/* Proof URL input */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proof URL</label>
                        <div style={{ position: 'relative' }}>
                          <Link2 size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input value={proofUrl} onChange={e => setProofUrl(e.target.value)} placeholder="https://..."
                            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
                            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }} />
                        </div>
                      </div>

                      {/* Points preview */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: '#f0fdf4', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#15803d' }}>Points you will earn</span>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#15803d' }}>{submitModal.effective_points} pts</span>
                      </div>

                      {/* Submit button */}
                      <button onClick={handleSubmit} disabled={submitting}
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: submitting ? '#94a3b8' : '#0f172a', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                        {submitting ? (
                          <>
                            <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            Submitting...
                          </>
                        ) : (
                          <><Send size={16} /> Submit Proof</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer1 />
    </div>
  );
}
