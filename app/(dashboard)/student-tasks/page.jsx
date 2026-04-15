"use client";
import React, { useState, useEffect, useRef } from "react";
import { Zap, CheckCircle, Clock, XCircle, ExternalLink, X, Send, Trophy, Target, Sun, Users, Flame, Upload, Link2, ImageIcon } from "lucide-react";

/* ─── Design tokens ─────────────────────────────────────── */
const BG      = '#eef0f5';
const S_UP    = '6px 6px 14px rgba(0,0,0,0.12), -5px -5px 12px rgba(255,255,255,0.95)';
const S_UP_LG = '10px 10px 24px rgba(0,0,0,0.13), -8px -8px 20px rgba(255,255,255,1)';
const S_IN    = 'inset 5px 5px 12px rgba(0,0,0,0.11), inset -4px -4px 10px rgba(255,255,255,0.9)';
const S_IN_SM = 'inset 3px 3px 7px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)';
const PURPLE  = '#6366f1';
const S_PURPLE= '5px 5px 14px rgba(99,102,241,0.40), -3px -3px 8px rgba(255,255,255,0.6)';

/* ─── Official brand SVG icons ──────────────────────────── */
const BrandIcon = ({ platform, size = 22 }) => {
  const icons = {
    dagchain: (
      <img src="/images/logo/dagchain-logo.png" alt="DAGCHAIN"
        style={{ width: size, height: size, objectFit: 'contain' }} />
    ),
    dagarmy: (
      <img src="/images/logo/logo.png" alt="DAGARMY"
        style={{ width: size, height: size, objectFit: 'contain' }} />
    ),
    daggpt: (
      <img src="/images/logo/daggpt-logo.png" alt="DAGGPT"
        style={{ width: size, height: size, objectFit: 'contain' }} />
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433"/>
            <stop offset="25%" stopColor="#e6683c"/>
            <stop offset="50%" stopColor="#dc2743"/>
            <stop offset="75%" stopColor="#cc2366"/>
            <stop offset="100%" stopColor="#bc1888"/>
          </linearGradient>
        </defs>
        <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    twitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    linkedin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.89a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/>
      </svg>
    ),
    medium: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
    ),
  };
  return icons[platform] || (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );
};

/* ─── Platform label map ────────────────────────────────── */
const PLATFORM_LABELS = {
  dagchain: 'DAGCHAIN', dagarmy: 'DAGARMY', daggpt: 'DAGGPT',
  facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube',
  twitter: 'X (Twitter)', linkedin: 'LinkedIn', tiktok: 'TikTok', medium: 'Medium',
};

/* ─── Status config ─────────────────────────────────────── */
const STATUS = {
  available: { label: 'Available',      dot: PURPLE,    text: PURPLE   },
  pending:   { label: 'Pending Review', dot: '#f59e0b', text: '#d97706'},
  completed: { label: 'Completed',      dot: '#10b981', text: '#059669'},
  expired:   { label: 'Expired',        dot: '#94a3b8', text: '#94a3b8'},
};

/* ─── Screenshot uploader ───────────────────────────────── */
function ScreenshotUploader({ value, onChange, label = 'Screenshot' }) {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('bucket', 'bid-item-images');
      fd.append('folder', 'task-proofs');
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) { onChange(data.url); setPreview(data.url); }
    } catch (e) { console.error(e); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <label style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'8px', display:'block' }}>
        {label}
      </label>
      {preview || value ? (
        <div style={{ position:'relative', borderRadius:'14px', overflow:'hidden', boxShadow: S_IN }}>
          <img src={preview || value} alt="proof" style={{ width:'100%', maxHeight:'180px', objectFit:'cover', display:'block' }}/>
          <button onClick={() => { setPreview(null); onChange(''); }}
            style={{ position:'absolute', top:'8px', right:'8px', width:'28px', height:'28px', borderRadius:'50%', border:'none', background:'rgba(0,0,0,0.55)', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={13}/>
          </button>
        </div>
      ) : (
        <div onClick={() => ref.current?.click()}
          style={{ padding:'24px 16px', borderRadius:'14px', background:BG, boxShadow:S_IN, textAlign:'center', cursor:uploading?'default':'pointer', border:'2px dashed rgba(99,102,241,0.25)', transition:'border-color 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(99,102,241,0.55)'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(99,102,241,0.25)'}>
          {uploading
            ? <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',color:'#6366f1',fontSize:'13px',fontWeight:'600'}}><div style={{width:'16px',height:'16px',border:'2px solid rgba(99,102,241,0.25)',borderTopColor:PURPLE,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/> Uploading...</div>
            : <>
                <ImageIcon size={24} style={{color:'#94a3b8',marginBottom:'8px'}}/>
                <div style={{fontSize:'12px',fontWeight:'700',color:'#64748b'}}>Click to upload screenshot</div>
                <div style={{fontSize:'10px',color:'#94a3b8',marginTop:'4px'}}>PNG, JPG, WEBP (max 5MB)</div>
              </>
          }
          <input ref={ref} type="file" accept="image/*" style={{display:'none'}}
            onChange={e => handleFile(e.target.files?.[0])}/>
        </div>
      )}
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
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
  const [proofScreenshot, setProofScreenshot] = useState('');
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
    const pt = submitModal?.proof_type || 'url_only';
    if (pt === 'url_only' && !proofUrl.trim()) {
      setMessage({ type:'error', text:'Please provide a proof link.' }); return;
    }
    if (pt === 'screenshot_only' && !proofScreenshot) {
      setMessage({ type:'error', text:'Please upload a screenshot as proof.' }); return;
    }
    if (pt === 'url_and_screenshot' && (!proofUrl.trim() || !proofScreenshot)) {
      setMessage({ type:'error', text:'Please provide both a link and a screenshot.' }); return;
    }
    setSubmitting(true);
    try {
      const res  = await fetch('/api/social-tasks/submit', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          task_id: submitModal.id,
          user_email: user.email,
          proof_url: proofUrl.trim() || null,
          proof_screenshot_url: proofScreenshot || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type:'success', text:'Proof submitted! Waiting for admin review.' });
        setSubmitModal(null); setProofUrl(''); setProofScreenshot('');
        fetchTasks(user.email);
      } else setMessage({ type:'error', text: data.error || 'Submission failed' });
    } catch (e) { setMessage({ type:'error', text: e.message }); }
    finally { setSubmitting(false); }
  };

  const openModal = (task) => { setSubmitModal(task); setProofUrl(''); setProofScreenshot(''); };

  const dailyTasks     = tasks.filter(t => t.mission_type === 'daily');
  const streakTasks    = tasks.filter(t => t.mission_type === 'streak');
  const communityTasks = tasks.filter(t => t.mission_type === 'community');
  const tabTasks       = activeTab === 'daily' ? dailyTasks : activeTab === 'streak' ? streakTasks : communityTasks;
  const filtered       = statusFilter === 'all' ? tabTasks : tabTasks.filter(t => t.user_status === statusFilter);

  const tabDef = [
    { key:'daily',     label:'Daily Missions',   icon: Sun,   tasks: dailyTasks,     color: '#f59e0b' },
    { key:'streak',    label:'Login Streak',      icon: Flame, tasks: streakTasks,    color: '#ef4444' },
    { key:'community', label:'Community Tasks',   icon: Users, tasks: communityTasks, color: '#10b981' },
  ];

  /* ─── Loading ────────────────────────────────────────────── */
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
      `}</style>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'32px', animation: mounted?'nm-up 0.4s ease-out both':'none' }}>
        <div style={{ width:'52px', height:'52px', borderRadius:'16px', background:BG, boxShadow:S_UP, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Target size={24} style={{ color:PURPLE }} />
        </div>
        <div>
          <h1 style={{ fontSize:'26px', fontWeight:'800', color:'#0f172a', margin:'0 0 2px', letterSpacing:'-0.5px' }}>Missions</h1>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:0, fontWeight:'500' }}>
            Complete missions to earn DAG Points
            {isLieutenant && <span style={{ color:PURPLE, fontWeight:'700' }}> · +{ltBonusRate}% LT Bonus active</span>}
          </p>
        </div>
      </div>

      {/* ── Stat tiles ─────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'16px', marginBottom:'32px' }}>
        {[
          { label:'Daily',         value: dailyTasks.length,          icon: <Sun size={20} style={{ color:'#f59e0b' }} /> },
          { label:'Streak',        value: streakTasks.length,         icon: <Flame size={20} style={{ color:'#ef4444' }} /> },
          { label:'Community',     value: communityTasks.length,      icon: <Users size={20} style={{ color:'#10b981' }} /> },
          { label:'Pending',       value: stats.pending,              icon: <Clock size={20} style={{ color:PURPLE }} /> },
          { label:'Completed',     value: stats.completed,            icon: <CheckCircle size={20} style={{ color:PURPLE }} /> },
          { label:'Points Earned', value: stats.total_points_earned,  icon: <Trophy size={20} style={{ color:PURPLE }} /> },
        ].map((s, i) => (
          <div key={i} className="nm-card"
            style={{ background:BG, borderRadius:'18px', padding:'18px 14px', boxShadow:S_UP, display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
              border:'1.5px solid transparent', animation: mounted?`nm-up 0.38s ease-out ${i*0.05}s both`:'none', transition:'box-shadow 0.2s' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'13px', background:BG, boxShadow:S_IN, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {s.icon}
            </div>
            <div style={{ fontSize:'22px', fontWeight:'900', color:'#0f172a', letterSpacing:'-1px', lineHeight:1 }}>{s.value ?? 0}</div>
            <div style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.6px', textAlign:'center' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Message ────────────────────────────────────────── */}
      {message.text && (
        <div style={{ marginBottom:'20px', padding:'13px 18px', borderRadius:'14px', background:BG, boxShadow:S_IN,
          color: message.type==='success'?'#059669':'#dc2626', fontSize:'13px', fontWeight:'600',
          display:'flex', justifyContent:'space-between', alignItems:'center', animation:'nm-up 0.3s ease-out both' }}>
          {message.text}
          <button onClick={() => setMessage({ type:'', text:'' })} style={{ background:'none', border:'none', cursor:'pointer', color:'inherit', padding:'2px' }}><X size={14}/></button>
        </div>
      )}

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div style={{ display:'inline-flex', gap:'0', marginBottom:'28px', background:BG, borderRadius:'18px', padding:'5px', boxShadow:S_IN, animation: mounted?'nm-up 0.4s ease-out 0.08s both':'none' }}>
        {tabDef.map(tab => {
          const Icon   = tab.icon;
          const active = activeTab === tab.key;
          const done   = tab.tasks.filter(t=>t.user_status==='completed').length;
          const avail  = tab.tasks.filter(t=>t.user_status==='available').length;
          return (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setStatusFilter('all'); }}
              style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', borderRadius:'13px', cursor:'pointer', fontSize:'13px', fontWeight:'700', transition:'all 0.2s', whiteSpace:'nowrap',
                background: active ? PURPLE : 'transparent',
                color:      active ? '#fff'  : '#64748b',
                boxShadow:  active ? S_PURPLE : 'none',
                border: !active && avail>0 ? '1.5px solid #ef4444' : '1.5px solid transparent' }}>
              <Icon size={15}/>
              {tab.label}
              <span style={{ fontSize:'11px', fontWeight:'800', padding:'2px 8px', borderRadius:'100px', transition:'all 0.2s',
                background: active ? 'rgba(255,255,255,0.22)' : BG,
                color:      active ? '#fff' : PURPLE,
                boxShadow:  active ? 'none' : S_IN_SM }}>
                {done}/{tab.tasks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Streak info banner (when streak tab active) ─────── */}
      {activeTab === 'streak' && (
        <div style={{ marginBottom:'24px', padding:'16px 20px', borderRadius:'18px', background:BG, boxShadow:S_IN,
          display:'flex', alignItems:'flex-start', gap:'14px', animation:'nm-up 0.35s ease-out both' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'13px', background:BG, boxShadow:S_UP, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Flame size={20} style={{ color:'#ef4444' }}/>
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:'800', color:'#0f172a', marginBottom:'4px' }}>7-Day Login Challenge</div>
            <div style={{ fontSize:'12px', color:'#64748b', lineHeight:1.65 }}>
              Sign in to all 3 platforms (DAGCHAIN, DAGARMY, DAGGPT) every day <strong>Monday–Sunday</strong> without any break.
              Complete all 7 days consecutively and claim <strong>900 DAG Points total</strong> (300 per platform).
              Can be claimed once per week — up to <strong>52 times a year</strong>!
            </div>
          </div>
        </div>
      )}

      {/* ── Status filter pills ─────────────────────────────── */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'28px', animation: mounted?'nm-up 0.4s ease-out 0.12s both':'none' }}>
        {['all','available','pending','completed'].map(s => {
          const active = statusFilter === s;
          const pillHasAlert = s==='available' && tabTasks.filter(t=>t.user_status==='available').length>0;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding:'9px 20px', borderRadius:'12px', cursor:'pointer', fontSize:'12px', fontWeight:'700', textTransform:'capitalize', transition:'all 0.2s',
                background: active ? PURPLE : BG, color: active ? '#fff' : '#64748b',
                boxShadow: active ? S_PURPLE : S_UP,
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
            <Target size={28} style={{ color:'#c7d2fe' }}/>
          </div>
          <p style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 6px' }}>
            {tasks.length===0 ? 'No missions available yet' : `No ${statusFilter==='all'?'':statusFilter+' '}${activeTab} missions`}
          </p>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>
            {tasks.length===0 ? 'Check back soon — missions will appear here.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' }}>
          {filtered.map((task, i) => {
            const sb     = STATUS[task.user_status] || STATUS.available;
            const isAvail= task.user_status === 'available';
            const pt     = task.proof_type || 'url_only';
            const platLabel = PLATFORM_LABELS[task.platform] || task.platform;
            return (
              <div key={task.id} className="nm-card"
                style={{ background: task.user_status==='completed' ? 'rgba(226,232,240,0.6)' : BG,
                  borderRadius:'22px', overflow:'hidden',
                  boxShadow: task.user_status==='available' ? `${S_UP}, 0 0 0 1.5px #ef4444` : task.user_status==='completed' ? '4px 4px 12px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.8)' : S_UP,
                  border: task.user_status==='available' ? '1.5px solid #ef4444' : task.user_status==='completed' ? '1.5px solid #10b981' : '1.5px solid transparent',
                  opacity: task.user_status==='completed' ? 0.72 : 1,
                  animation:`nm-up 0.35s ease-out ${i*0.04}s both`, transition:'box-shadow 0.25s, opacity 0.25s' }}>

                {/* Card body */}
                <div style={{ padding:'22px 22px 16px' }}>

                  {/* Platform + status row */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:'46px', height:'46px', borderRadius:'14px', background:BG, boxShadow:S_IN, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <BrandIcon platform={task.platform} size={24}/>
                      </div>
                      <div>
                        <div style={{ fontSize:'11px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.6px' }}>{platLabel}</div>
                        <div style={{ fontSize:'11px', fontWeight:'700', color:PURPLE, marginTop:'3px', textTransform:'capitalize' }}>
                          {(task.task_type||'').replace(/_/g,' ')}
                        </div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 11px', borderRadius:'100px', background:BG, boxShadow:S_IN_SM }}>
                      <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:sb.dot, flexShrink:0 }}/>
                      <span style={{ fontSize:'10px', fontWeight:'800', color:sb.text, textTransform:'uppercase', letterSpacing:'0.4px', whiteSpace:'nowrap' }}>{sb.label}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize:'14px', fontWeight:'800', color:'#0f172a', margin:'0 0 6px', lineHeight:1.4 }}>{task.title}</h3>

                  {/* Description */}
                  {task.description && (
                    <p style={{ fontSize:'12px', color:'#64748b', margin:'0 0 14px', lineHeight:1.6 }}>{task.description}</p>
                  )}

                  {/* Proof type badge */}
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'14px' }}>
                    <div style={{ padding:'4px 10px', borderRadius:'8px', background:BG, boxShadow:S_IN_SM, display:'flex', alignItems:'center', gap:'5px' }}>
                      {pt==='screenshot_only' && <><ImageIcon size={10} style={{color:'#64748b'}}/><span style={{fontSize:'10px',fontWeight:'700',color:'#64748b'}}>Screenshot required</span></>}
                      {pt==='url_and_screenshot' && <><Link2 size={10} style={{color:'#64748b'}}/><ImageIcon size={10} style={{color:'#64748b'}}/><span style={{fontSize:'10px',fontWeight:'700',color:'#64748b'}}>Link + Screenshot required</span></>}
                      {pt==='url_only' && <><Link2 size={10} style={{color:'#64748b'}}/><span style={{fontSize:'10px',fontWeight:'700',color:'#64748b'}}>Link required</span></>}
                    </div>
                    {task.recurrence === 'daily' && <div style={{padding:'4px 10px',borderRadius:'8px',background:BG,boxShadow:S_IN_SM}}><span style={{fontSize:'10px',fontWeight:'700',color:'#64748b'}}>Daily</span></div>}
                    {task.recurrence === 'weekly' && <div style={{padding:'4px 10px',borderRadius:'8px',background:BG,boxShadow:S_IN_SM}}><span style={{fontSize:'10px',fontWeight:'700',color:'#64748b'}}>Weekly</span></div>}
                    {task.recurrence === 'once' && <div style={{padding:'4px 10px',borderRadius:'8px',background:BG,boxShadow:S_IN_SM}}><span style={{fontSize:'10px',fontWeight:'700',color:'#10b981'}}>One-time</span></div>}
                  </div>

                  {/* Points */}
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ padding:'8px 14px', borderRadius:'12px', background:BG, boxShadow:S_IN, display:'flex', alignItems:'baseline', gap:'5px' }}>
                      <span style={{ fontSize:'22px', fontWeight:'900', color:PURPLE, letterSpacing:'-0.5px' }}>{task.effective_points}</span>
                      <span style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8' }}>DAG Points</span>
                    </div>
                    <div style={{ padding:'6px 12px', borderRadius:'10px', background:BG, boxShadow:S_IN_SM, opacity: isLieutenant ? 1 : 0.45 }}>
                      <span style={{ fontSize:'10px', fontWeight:'800', color: isLieutenant ? PURPLE : '#94a3b8' }}>+100% LT Bonus</span>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div style={{ margin:'0 16px 16px', borderRadius:'14px', background:BG, boxShadow:S_IN, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px' }}>
                  {task.target_url ? (
                    <a href={task.target_url} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', fontWeight:'700', color:PURPLE, textDecoration:'none' }}>
                      <ExternalLink size={12}/> Open Link
                    </a>
                  ) : <span/>}
                  {isAvail && (
                    <button onClick={() => openModal(task)}
                      style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 18px', borderRadius:'10px', border:'none', background:PURPLE, color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer', boxShadow:S_PURPLE, transition:'all 0.15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#4f46e5'}
                      onMouseLeave={e=>e.currentTarget.style.background=PURPLE}>
                      <Send size={12}/>
                      {pt==='screenshot_only' ? 'Submit Screenshot' : pt==='url_and_screenshot' ? 'Submit Proof' : 'Submit Link'}
                    </button>
                  )}
                  {task.user_status==='pending' && <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:'700', color:'#64748b' }}><Clock size={12}/> Under Review</span>}
                  {task.user_status==='completed' && <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:'700', color:'#059669' }}><CheckCircle size={12}/> Completed</span>}
                  {task.user_status==='expired' && <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', fontWeight:'700', color:'#94a3b8' }}><XCircle size={12}/> Expired</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Submit Proof Modal ─────────────────────────────── */}
      {submitModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.45)', backdropFilter:'blur(8px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}
          onClick={e => { if (e.target===e.currentTarget) setSubmitModal(null); }}>
          <div style={{ background:BG, borderRadius:'28px', width:'100%', maxWidth:'500px', boxShadow:'16px 16px 40px rgba(0,0,0,0.18), -10px -10px 30px rgba(255,255,255,0.95)', animation:'nm-up 0.3s ease-out both', margin:'auto' }}>

            {/* Modal header */}
            <div style={{ padding:'24px 26px 16px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:BG, boxShadow:S_IN, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <BrandIcon platform={submitModal.platform} size={22}/>
                </div>
                <div>
                  <h2 style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 3px' }}>Submit Proof</h2>
                  <p style={{ fontSize:'11px', color:'#64748b', margin:0, lineHeight:1.4 }}>{submitModal.title}</p>
                </div>
              </div>
              <button onClick={() => setSubmitModal(null)}
                style={{ width:'36px', height:'36px', borderRadius:'12px', border:'none', background:BG, boxShadow:S_UP, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b', flexShrink:0 }}>
                <X size={15}/>
              </button>
            </div>

            <div style={{ padding:'4px 26px 26px', display:'flex', flexDirection:'column', gap:'16px' }}>

              {/* Instruction */}
              <div style={{ padding:'13px 16px', borderRadius:'14px', background:BG, boxShadow:S_IN, fontSize:'12px', color:'#64748b', lineHeight:1.65 }}>
                {submitModal.proof_type==='screenshot_only' && 'Complete the task, then upload a clear screenshot as proof.'}
                {submitModal.proof_type==='url_and_screenshot' && 'Complete the task, then paste the direct link to your post and upload a screenshot of it.'}
                {submitModal.proof_type==='url_only' && 'Complete the task, then paste a direct link to your submission as proof.'}
              </div>

              {/* Open link button */}
              {submitModal.target_url && (
                <a href={submitModal.target_url} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', borderRadius:'14px', background:BG, boxShadow:S_UP, fontSize:'12px', fontWeight:'700', color:PURPLE, textDecoration:'none', transition:'box-shadow 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow=S_UP_LG}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow=S_UP}>
                  <ExternalLink size={14}/> Open Task Link
                </a>
              )}

              {/* URL input (url_only or url_and_screenshot) */}
              {(submitModal.proof_type==='url_only' || submitModal.proof_type==='url_and_screenshot') && (
                <div>
                  <label style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:'8px', display:'block' }}>
                    {submitModal.proof_type==='url_and_screenshot' ? 'Post Link (URL)' : 'Proof Link'}
                  </label>
                  <div style={{ position:'relative' }}>
                    <Link2 size={14} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
                    <input value={proofUrl} onChange={e=>setProofUrl(e.target.value)} placeholder="https://..."
                      style={{ width:'100%', padding:'12px 14px 12px 38px', borderRadius:'14px', border:'none', outline:'none', fontSize:'13px', background:BG, boxShadow:S_IN, boxSizing:'border-box', color:'#0f172a' }}
                      onKeyDown={e=>{ if(e.key==='Enter') handleSubmit(); }}/>
                  </div>
                </div>
              )}

              {/* Screenshot upload (screenshot_only or url_and_screenshot) */}
              {(submitModal.proof_type==='screenshot_only' || submitModal.proof_type==='url_and_screenshot') && (
                <ScreenshotUploader
                  value={proofScreenshot}
                  onChange={setProofScreenshot}
                  label={submitModal.proof_type==='url_and_screenshot' ? 'Screenshot of your post' : 'Proof Screenshot'}
                />
              )}

              {/* Points preview */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderRadius:'14px', background:BG, boxShadow:S_IN }}>
                <span style={{ fontSize:'12px', fontWeight:'700', color:'#64748b' }}>You will earn</span>
                <div style={{ display:'flex', alignItems:'baseline', gap:'4px' }}>
                  <span style={{ fontSize:'24px', fontWeight:'900', color:PURPLE, letterSpacing:'-0.5px' }}>{submitModal.effective_points}</span>
                  <span style={{ fontSize:'12px', fontWeight:'700', color:'#94a3b8' }}>DAG Points</span>
                </div>
              </div>

              {/* Submit button */}
              <button onClick={handleSubmit} disabled={submitting}
                style={{ width:'100%', padding:'14px', borderRadius:'16px', border:'none',
                  background: submitting ? BG : PURPLE, color: submitting ? '#94a3b8' : '#fff',
                  fontSize:'14px', fontWeight:'700', cursor: submitting?'not-allowed':'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  boxShadow: submitting ? S_IN : S_PURPLE, transition:'all 0.2s' }}>
                {submitting
                  ? <><div style={{ width:'16px', height:'16px', border:'2px solid rgba(100,116,139,0.3)', borderTopColor:'#64748b', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/> Submitting...</>
                  : <><Send size={15}/> Submit Proof</>}
              </button>

              {/* Inline error in modal */}
              {message.text && message.type==='error' && (
                <div style={{ padding:'10px 14px', borderRadius:'12px', background:BG, boxShadow:S_IN, color:'#dc2626', fontSize:'12px', fontWeight:'600' }}>
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
