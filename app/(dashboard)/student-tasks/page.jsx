"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Zap, CheckCircle, Clock, XCircle, ExternalLink, Link2,
  X, Send, Trophy, Target, Sun, Users,
  Youtube, Twitter, Facebook, Instagram, MessageCircle, Hash,
  BookOpen, Linkedin, Pin, Music, BarChart3, Globe,
  ThumbsUp, MessageSquare, Share2, Tag, Play, Film, UserPlus, RefreshCw
} from "lucide-react";

/* ─── Design tokens ─────────────────────────────────────── */
const BG       = '#eef0f5';
const S_UP     = '6px 6px 14px rgba(0,0,0,0.12), -5px -5px 12px rgba(255,255,255,0.95)';
const S_UP_LG  = '10px 10px 24px rgba(0,0,0,0.13), -8px -8px 20px rgba(255,255,255,1)';
const S_IN     = 'inset 5px 5px 12px rgba(0,0,0,0.11), inset -4px -4px 10px rgba(255,255,255,0.9)';
const S_IN_SM  = 'inset 3px 3px 7px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)';
const PURPLE   = '#6366f1';
const S_PURPLE = '5px 5px 14px rgba(99,102,241,0.40), -3px -3px 8px rgba(255,255,255,0.6)';

/* ─── Platform / type maps ──────────────────────────────── */
const PLATFORMS = [
  { value: 'youtube',       label: 'YouTube',       icon: Youtube      },
  { value: 'twitter',       label: 'Twitter / X',   icon: Twitter      },
  { value: 'facebook',      label: 'Facebook',      icon: Facebook     },
  { value: 'instagram',     label: 'Instagram',     icon: Instagram    },
  { value: 'telegram',      label: 'Telegram',      icon: MessageCircle},
  { value: 'discord',       label: 'Discord',       icon: Hash         },
  { value: 'medium',        label: 'Medium',        icon: BookOpen     },
  { value: 'linkedin',      label: 'LinkedIn',      icon: Linkedin     },
  { value: 'pinterest',     label: 'Pinterest',     icon: Pin          },
  { value: 'tiktok',        label: 'TikTok',        icon: Music        },
  { value: 'coinmarketcap', label: 'CoinMarketCap', icon: BarChart3    },
];

const TYPE_ICONS = {
  subscribe: UserPlus, follow: UserPlus, like: ThumbsUp, comment: MessageSquare,
  share: Share2, tag: Tag, watch: Play, watch_video: Play,
  create_shorts: Film, create_short: Film, create_reel: Film,
  create_video: Film, create_post: MessageSquare, create_thread: MessageSquare,
  story_mention: Tag, review: Trophy, repost: RefreshCw, retweet: RefreshCw, join: Users,
};

const getPlatform = (v) => PLATFORMS.find(p => p.value === v) || { label: v, icon: Globe };

/* ─── Status config ─────────────────────────────────────── */
const STATUS = {
  available: { label: 'Available',      dot: PURPLE,    text: PURPLE   },
  pending:   { label: 'Pending Review', dot: '#f59e0b', text: '#d97706'},
  completed: { label: 'Completed',      dot: '#10b981', text: '#059669'},
  expired:   { label: 'Expired',        dot: '#94a3b8', text: '#94a3b8'},
};

export default function StudentMissionsPage() {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [tasks, setTasks]             = useState([]);
  const [stats, setStats]             = useState({ total_tasks:0, completed:0, pending:0, available:0, total_points_earned:0 });
  const [isLieutenant, setIsLT]       = useState(false);
  const [ltBonusRate, setLtRate]      = useState(20);
  const [activeTab, setActiveTab]     = useState('daily');
  const [statusFilter, setStatusFilter] = useState('all');
  const [submitModal, setSubmitModal] = useState(null);
  const [proofUrl, setProofUrl]       = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [message, setMessage]         = useState({ type:'', text:'' });
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  useEffect(() => {
    const u = localStorage.getItem('dagarmy_user');
    if (u) { const d = JSON.parse(u); setUser(d); fetchTasks(d.email); }
    else setLoading(false);
  }, []);

  const fetchTasks = async (email) => {
    try {
      setLoading(true);
      const res  = await fetch(`/api/social-tasks/user?user_email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks || []);
        setStats(data.stats || {});
        setIsLT(data.is_lieutenant || false);
        setLtRate(data.lt_bonus_rate || 20);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!proofUrl.trim()) { setMessage({ type:'error', text:'Please provide a proof URL' }); return; }
    setSubmitting(true);
    try {
      const res  = await fetch('/api/social-tasks/submit', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ task_id: submitModal.id, user_email: user.email, proof_url: proofUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type:'success', text:'Proof submitted! Waiting for admin review.' });
        setSubmitModal(null); setProofUrl('');
        fetchTasks(user.email);
      } else setMessage({ type:'error', text: data.error || 'Submission failed' });
    } catch (e) { setMessage({ type:'error', text: e.message }); }
    finally { setSubmitting(false); }
  };

  const dailyTasks     = tasks.filter(t => t.mission_type === 'daily');
  const communityTasks = tasks.filter(t => t.mission_type !== 'daily');
  const activeTasks    = activeTab === 'daily' ? dailyTasks : communityTasks;
  const filtered       = statusFilter === 'all' ? activeTasks : activeTasks.filter(t => t.user_status === statusFilter);
  const dailyDone      = dailyTasks.filter(t => t.user_status === 'completed').length;
  const communityDone  = communityTasks.filter(t => t.user_status === 'completed').length;

  /* ─── Loading ─────────────────────────────────────────── */
  if (loading) return (
    <div style={{ flex:1, background:BG, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'18px', background:BG, boxShadow:S_UP_LG, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <div style={{ width:'24px', height:'24px', border:`3px solid rgba(99,102,241,0.2)`, borderTopColor:PURPLE, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        </div>
        <p style={{ fontSize:'14px', color:'#64748b', fontWeight:'700', margin:0 }}>Loading missions...</p>
      </div>
    </div>
  );

  return (
    <div style={{ width:'100%', padding:'32px 36px', background:BG, minHeight:'100vh', boxSizing:'border-box' }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes nm-up   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.35), ${S_UP}; }
          50%       { box-shadow: 0 0 0 4px rgba(239,68,68,0.10), ${S_UP}; }
        }
        .nm-card:hover { box-shadow: ${S_UP_LG} !important; }
        .nm-btn-ghost:hover { box-shadow: ${S_UP_LG} !important; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'32px', animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
        <div style={{ width:'52px', height:'52px', borderRadius:'16px', background:BG, boxShadow:S_UP, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Target size={24} style={{ color:PURPLE }} />
        </div>
        <div>
          <h1 style={{ fontSize:'26px', fontWeight:'800', color:'#0f172a', margin:'0 0 2px', letterSpacing:'-0.5px', fontFamily:'Nasalization, sans-serif' }}>Missions</h1>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:0, fontWeight:'500' }}>
            Complete missions to earn DAG Points
            {isLieutenant && <span style={{ color:PURPLE, fontWeight:'700' }}> · +{ltBonusRate}% LT Bonus active</span>}
          </p>
        </div>
      </div>

      {/* ── Stat tiles ─────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'16px', marginBottom:'32px' }}>
        {[
          { label:'Daily',         value: dailyTasks.length,          icon: <Sun size={20} style={{ color:PURPLE }} /> },
          { label:'Community',     value: communityTasks.length,      icon: <Users size={20} style={{ color:PURPLE }} /> },
          { label:'Available',     value: stats.available,            icon: <Zap size={20} style={{ color:PURPLE }} /> },
          { label:'Pending',       value: stats.pending,              icon: <Clock size={20} style={{ color:PURPLE }} /> },
          { label:'Completed',     value: stats.completed,            icon: <CheckCircle size={20} style={{ color:PURPLE }} /> },
          { label:'Points Earned', value: stats.total_points_earned,  icon: <Trophy size={20} style={{ color:PURPLE }} /> },
        ].map((s, i) => {
          const isAvailableTile = i === 2;
          const tileHasAlert   = isAvailableTile && (stats.available > 0);
          return (
          <div key={i} style={{ background:BG, borderRadius:'18px', padding:'18px 14px', boxShadow:S_UP, display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
            animation: mounted ? `nm-up 0.38s ease-out ${i * 0.05}s both` : 'none', transition:'box-shadow 0.2s',
            ...(tileHasAlert ? { border:'1.5px solid #ef4444', animation: mounted ? `nm-up 0.38s ease-out ${i * 0.05}s both, pulse-ring 2s ease-in-out infinite` : 'none' } : { border:'1.5px solid transparent' }) }}
            className="nm-card">
            <div style={{ width:'40px', height:'40px', borderRadius:'13px', background:BG, boxShadow:S_IN, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {s.icon}
            </div>
            <div style={{ fontSize:'22px', fontWeight:'900', color:'#0f172a', letterSpacing:'-1px', lineHeight:1 }}>{s.value ?? 0}</div>
            <div style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.6px', textAlign:'center' }}>{s.label}</div>
          </div>
          );
        })}
      </div>

      {/* ── Message ────────────────────────────────────────── */}
      {message.text && (
        <div style={{ marginBottom:'20px', padding:'13px 18px', borderRadius:'14px', background:BG, boxShadow:S_IN,
          color: message.type === 'success' ? '#059669' : '#dc2626', fontSize:'13px', fontWeight:'600',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          animation:'nm-up 0.3s ease-out both' }}>
          {message.text}
          <button onClick={() => setMessage({ type:'', text:'' })} style={{ background:'none', border:'none', cursor:'pointer', color:'inherit', padding:'2px' }}><X size={14} /></button>
        </div>
      )}

      {/* ── Mission type tabs ──────────────────────────────── */}
      <div style={{ display:'inline-flex', gap:'0', marginBottom:'28px', background:BG, borderRadius:'18px', padding:'5px', boxShadow:S_IN,
        animation: mounted ? 'nm-up 0.4s ease-out 0.08s both' : 'none' }}>
        {[
          { key:'daily',     label:'Daily Missions',     icon: Sun,   count: dailyTasks.length,     done: dailyDone,     availCount: dailyTasks.filter(t=>t.user_status==='available').length     },
          { key:'community', label:'Community Missions', icon: Users, count: communityTasks.length, done: communityDone, availCount: communityTasks.filter(t=>t.user_status==='available').length },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          const tabHasAvail = tab.availCount > 0;
          return (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setStatusFilter('all'); }}
              style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 22px', borderRadius:'13px', cursor:'pointer', fontSize:'13px', fontWeight:'700', transition:'all 0.2s',
                background: active ? PURPLE : 'transparent',
                color:      active ? '#fff' : '#64748b',
                boxShadow:  active ? S_PURPLE : 'none',
                border: !active && tabHasAvail ? '1.5px solid #ef4444' : '1.5px solid transparent' }}>
              <Icon size={15} />
              {tab.label}
              <span style={{ fontSize:'11px', fontWeight:'800', padding:'2px 8px', borderRadius:'100px', transition:'all 0.2s',
                background: active ? 'rgba(255,255,255,0.22)' : BG,
                color:      active ? '#fff' : PURPLE,
                boxShadow:  active ? 'none' : S_IN_SM }}>
                {tab.done}/{tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Status filter pills ─────────────────────────────── */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'28px', animation: mounted ? 'nm-up 0.4s ease-out 0.12s both' : 'none' }}>
        {['all','available','pending','completed'].map(s => {
          const active = statusFilter === s;
          const isAvailPill = s === 'available';
          const pillHasAlert = isAvailPill && activeTasks.filter(t=>t.user_status==='available').length > 0;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding:'9px 20px', borderRadius:'12px', cursor:'pointer', fontSize:'12px', fontWeight:'700', textTransform:'capitalize', transition:'all 0.2s',
                background: active ? PURPLE : BG,
                color:      active ? '#fff' : '#64748b',
                boxShadow:  active ? S_PURPLE : S_UP,
                border: !active && pillHasAlert ? '1.5px solid #ef4444' : '1.5px solid transparent' }}>
              {s === 'all' ? 'All' : s.replace('_',' ')}
            </button>
          );
        })}
      </div>

      {/* ── Mission cards ──────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ background:BG, borderRadius:'24px', boxShadow:S_IN, padding:'64px', textAlign:'center' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:BG, boxShadow:S_UP, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <Target size={28} style={{ color:'#c7d2fe' }} />
          </div>
          <p style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 6px' }}>
            {tasks.length === 0 ? 'No missions available yet' : `No ${statusFilter === 'all' ? '' : statusFilter + ' '}${activeTab} missions`}
          </p>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>
            {tasks.length === 0 ? 'Check back soon — missions will appear here.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' }}>
          {filtered.map((task, i) => {
            const plat      = getPlatform(task.platform);
            const PlatIcon  = plat.icon;
            const TypeIcon  = TYPE_ICONS[task.task_type] || Zap;
            const sb        = STATUS[task.user_status] || STATUS.available;
            const isAvail   = task.user_status === 'available';
            return (
              <div key={task.id} className="nm-card"
                style={{ background: task.user_status === 'completed' ? 'rgba(226,232,240,0.6)' : BG,
                  borderRadius:'22px', overflow:'hidden',
                  boxShadow: task.user_status === 'available' ? `${S_UP}, 0 0 0 1.5px #ef4444` : task.user_status === 'completed' ? '4px 4px 12px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.8)' : S_UP,
                  border: task.user_status === 'available' ? '1.5px solid #ef4444' : task.user_status === 'completed' ? '1.5px solid #10b981' : '1.5px solid transparent',
                  opacity: task.user_status === 'completed' ? 0.72 : 1,
                  animation:`nm-up 0.35s ease-out ${i * 0.04}s both`, transition:'box-shadow 0.25s, opacity 0.25s' }}>

                {/* Card body */}
                <div style={{ padding:'22px 22px 16px' }}>

                  {/* Platform row */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      {/* Platform icon — inset circle */}
                      <div style={{ width:'42px', height:'42px', borderRadius:'14px', background:BG, boxShadow:S_IN, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <PlatIcon size={20} style={{ color:PURPLE }} />
                      </div>
                      <div>
                        <div style={{ fontSize:'11px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.6px' }}>{plat.label}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'3px' }}>
                          <TypeIcon size={11} style={{ color:PURPLE }} />
                          <span style={{ fontSize:'11px', fontWeight:'700', color:PURPLE, textTransform:'capitalize' }}>{task.task_type.replace(/_/g,' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 11px', borderRadius:'100px', background:BG, boxShadow:S_IN_SM }}>
                      <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:sb.dot, flexShrink:0 }} />
                      <span style={{ fontSize:'10px', fontWeight:'800', color:sb.text, textTransform:'uppercase', letterSpacing:'0.4px', whiteSpace:'nowrap' }}>{sb.label}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize:'14px', fontWeight:'800', color:'#0f172a', margin:'0 0 6px', lineHeight:1.4 }}>{task.title}</h3>

                  {/* Description */}
                  {task.description && (
                    <p style={{ fontSize:'12px', color:'#64748b', margin:'0 0 16px', lineHeight:1.6 }}>{task.description}</p>
                  )}

                  {/* Points display */}
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop: task.description ? 0 : '12px' }}>
                    <div style={{ padding:'8px 14px', borderRadius:'12px', background:BG, boxShadow:S_IN, display:'flex', alignItems:'baseline', gap:'5px' }}>
                      <span style={{ fontSize:'22px', fontWeight:'900', color:PURPLE, letterSpacing:'-0.5px' }}>{task.effective_points}</span>
                      <span style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8' }}>pts</span>
                    </div>
                    {task.lt_bonus > 0 && (
                      <div style={{ padding:'6px 12px', borderRadius:'10px', background:BG, boxShadow:S_IN_SM }}>
                        <span style={{ fontSize:'10px', fontWeight:'800', color:PURPLE }}>+{task.lt_bonus} LT bonus</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer */}
                <div style={{ margin:'0 16px 16px', borderRadius:'14px', background:BG, boxShadow:S_IN, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px' }}>
                  {/* Left: open link */}
                  {task.target_url ? (
                    <a href={task.target_url} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', fontWeight:'700', color:PURPLE, textDecoration:'none' }}>
                      <ExternalLink size={12} /> Open Link
                    </a>
                  ) : <span />}

                  {/* Right: action */}
                  {isAvail && (
                    <button onClick={() => { setSubmitModal(task); setProofUrl(''); }}
                      style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 18px', borderRadius:'10px', border:'none', background:PURPLE, color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer', boxShadow:S_PURPLE, transition:'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                      onMouseLeave={e => e.currentTarget.style.background = PURPLE}>
                      <Send size={12} /> Submit
                    </button>
                  )}
                  {task.user_status === 'pending' && (
                    <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:'700', color:'#d97706' }}>
                      <Clock size={12} /> Under Review
                    </span>
                  )}
                  {task.user_status === 'completed' && (
                    <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:'700', color:'#059669' }}>
                      <CheckCircle size={12} /> Completed
                    </span>
                  )}
                  {task.user_status === 'expired' && (
                    <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:'700', color:'#94a3b8' }}>
                      <XCircle size={12} /> Expired
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Submit Proof Modal ─────────────────────────────── */}
      {submitModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.45)', backdropFilter:'blur(8px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
          onClick={e => { if (e.target === e.currentTarget) setSubmitModal(null); }}>
          <div style={{ background:BG, borderRadius:'28px', width:'100%', maxWidth:'460px', boxShadow:'16px 16px 40px rgba(0,0,0,0.18), -10px -10px 30px rgba(255,255,255,0.95)', animation:'nm-up 0.3s ease-out both' }}>

            {/* Modal header */}
            <div style={{ padding:'24px 26px 16px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div>
                <h2 style={{ fontSize:'17px', fontWeight:'800', color:'#0f172a', margin:'0 0 4px' }}>Submit Proof</h2>
                <p style={{ fontSize:'12px', color:'#64748b', margin:0, maxWidth:'320px', lineHeight:1.4 }}>{submitModal.title}</p>
              </div>
              <button onClick={() => setSubmitModal(null)}
                style={{ width:'36px', height:'36px', borderRadius:'12px', border:'none', background:BG, boxShadow:S_UP, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b', flexShrink:0, marginLeft:'12px' }}
                onMouseEnter={e => e.currentTarget.style.color = PURPLE}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                <X size={15} />
              </button>
            </div>

            <div style={{ padding:'4px 26px 26px', display:'flex', flexDirection:'column', gap:'14px' }}>

              {/* Instruction box */}
              <div style={{ padding:'13px 16px', borderRadius:'14px', background:BG, boxShadow:S_IN, fontSize:'12px', color:'#64748b', lineHeight:1.65 }}>
                Complete the mission first, then paste a proof link below (screenshot URL, post link, profile link, etc.)
              </div>

              {/* Open link button */}
              {submitModal.target_url && (
                <a href={submitModal.target_url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', borderRadius:'14px', background:BG, boxShadow:S_UP, fontSize:'12px', fontWeight:'700', color:PURPLE, textDecoration:'none', transition:'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = S_UP_LG}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = S_UP}>
                  <ExternalLink size={14} /> Open mission link first
                </a>
              )}

              {/* Proof URL input */}
              <div>
                <label style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'8px', display:'block' }}>Proof URL</label>
                <div style={{ position:'relative' }}>
                  <Link2 size={14} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }} />
                  <input value={proofUrl} onChange={e => setProofUrl(e.target.value)} placeholder="https://..."
                    style={{ width:'100%', padding:'12px 14px 12px 38px', borderRadius:'14px', border:'none', outline:'none', fontSize:'13px', background:BG, boxShadow:S_IN, boxSizing:'border-box', color:'#0f172a' }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }} />
                </div>
              </div>

              {/* Points preview */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderRadius:'14px', background:BG, boxShadow:S_IN }}>
                <span style={{ fontSize:'12px', fontWeight:'700', color:'#64748b' }}>You will earn</span>
                <div style={{ display:'flex', alignItems:'baseline', gap:'4px' }}>
                  <span style={{ fontSize:'24px', fontWeight:'900', color:PURPLE, letterSpacing:'-0.5px' }}>{submitModal.effective_points}</span>
                  <span style={{ fontSize:'12px', fontWeight:'700', color:'#94a3b8' }}>DAG pts</span>
                </div>
              </div>

              {/* Submit button */}
              <button onClick={handleSubmit} disabled={submitting}
                style={{ width:'100%', padding:'14px', borderRadius:'16px', border:'none',
                  background: submitting ? BG : PURPLE,
                  color:      submitting ? '#94a3b8' : '#fff',
                  fontSize:'14px', fontWeight:'700', cursor: submitting ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  boxShadow: submitting ? S_IN : S_PURPLE, transition:'all 0.2s' }}>
                {submitting
                  ? <><div style={{ width:'16px', height:'16px', border:'2px solid rgba(100,116,139,0.3)', borderTopColor:'#64748b', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Submitting...</>
                  : <><Send size={15} /> Submit Proof</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

