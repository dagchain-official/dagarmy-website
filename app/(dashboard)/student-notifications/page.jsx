"use client";
import React, { useState, useEffect } from "react";

/* ── Neumorphic design tokens (shared with Events/Missions) ── */
const BG      = '#eef0f5';
const S_UP    = '6px 6px 14px rgba(0,0,0,0.12), -5px -5px 12px rgba(255,255,255,0.95)';
const S_UP_LG = '10px 10px 24px rgba(0,0,0,0.13), -8px -8px 20px rgba(255,255,255,1)';
const S_IN    = 'inset 5px 5px 12px rgba(0,0,0,0.11), inset -4px -4px 10px rgba(255,255,255,0.9)';
const S_IN_SM = 'inset 3px 3px 7px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)';
const PURPLE  = '#6366f1';
const S_PURPLE= '5px 5px 14px rgba(99,102,241,0.40), -3px -3px 8px rgba(255,255,255,0.6)';

/* Icon SVGs — no lucide dependency needed */
const IcoBell = ({ size = 22, color = PURPLE }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IcoCheck = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoTrash = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IcoSettings = ({ size = 20, color = PURPLE }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

/* Per-type SVG icons */
const TYPE_ICONS = {
  success:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  info:        (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  achievement: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  warning:     (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const INITIAL_NOTIFICATIONS = [
  { id:1, type:'success',     title:'Assignment Submitted Successfully',  message:'Your "Neural Network Project" has been submitted and is under review.',                    time:'5 minutes ago', read:false },
  { id:2, type:'info',        title:'New Course Material Available',       message:'Week 5 materials for "Blockchain Development" are now available.',                         time:'1 hour ago',    read:false },
  { id:3, type:'achievement', title:'Achievement Unlocked!',               message:'You earned the "Quick Learner" badge for completing 5 courses.',                           time:'3 hours ago',   read:false },
  { id:4, type:'warning',     title:'Assignment Due Soon',                 message:'Your "Smart Contract Development" assignment is due in 2 days.',                           time:'5 hours ago',   read:true  },
  { id:5, type:'info',        title:'New Discussion Reply',                message:'Sarah Johnson replied to your question in "AI Fundamentals" forum.',                       time:'1 day ago',     read:true  },
  { id:6, type:'success',     title:'Grade Posted',                        message:'Your grade for "Machine Learning Model Evaluation" is now available: 95%',                 time:'2 days ago',    read:true  },
  { id:7, type:'info',        title:'Live Session Reminder',               message:'Live Q&A session for "Data Visualization" starts in 30 minutes.',                          time:'3 days ago',    read:true  },
];

export default function StudentNotificationsPage() {
  const [filter, setFilter]             = useState('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all'    ? notifications
    : filter === 'unread'              ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const markAsRead   = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read:true } : n));
  const markAllRead  = ()   => setNotifications(ns => ns.map(n => ({ ...n, read:true })));
  const deleteNote   = (id) => setNotifications(ns => ns.filter(n => n.id !== id));

  const TABS = [
    { key:'all',         label:'All',          count: notifications.length },
    { key:'unread',      label:'Unread',        count: unreadCount },
    { key:'success',     label:'Success',       count: notifications.filter(n=>n.type==='success').length },
    { key:'info',        label:'Info',          count: notifications.filter(n=>n.type==='info').length },
    { key:'achievement', label:'Achievements',  count: notifications.filter(n=>n.type==='achievement').length },
    { key:'warning',     label:'Warnings',      count: notifications.filter(n=>n.type==='warning').length },
  ];

  return (
    <div style={{ width:'100%', padding:'32px 36px', background:BG, minHeight:'100vh', boxSizing:'border-box' }}>
      <style>{`
        @keyframes nm-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nm-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 50%{box-shadow:0 0 0 5px rgba(99,102,241,0)} }
        .nm-row:hover { box-shadow: ${S_UP_LG} !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px',
        animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ width:'52px', height:'52px', borderRadius:'16px', background:BG, boxShadow:S_UP,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IcoBell />
          </div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <h1 style={{ fontSize:'26px', fontWeight:'800', color:'#0f172a', margin:0,
                letterSpacing:'-0.5px', fontFamily:'Nasalization, sans-serif' }}>Notifications</h1>
              {unreadCount > 0 && (
                <span style={{ padding:'3px 11px', borderRadius:'100px', background:BG,
                  boxShadow: S_IN_SM, fontSize:'13px', fontWeight:'800', color:PURPLE }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <p style={{ fontSize:'13px', color:'#94a3b8', margin:'3px 0 0', fontWeight:'500' }}>
              Stay updated with your learning activities
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllRead}
            style={{ display:'flex', alignItems:'center', gap:'7px', padding:'11px 22px',
              borderRadius:'14px', border:'none', background:PURPLE, color:'#fff',
              fontSize:'13px', fontWeight:'700', cursor:'pointer', boxShadow:S_PURPLE,
              transition:'background 0.15s', whiteSpace:'nowrap', flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
            onMouseLeave={e => e.currentTarget.style.background = PURPLE}>
            <IcoCheck size={15} color="#fff" /> Mark All as Read
          </button>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ display:'inline-flex', flexWrap:'wrap', gap:'6px', marginBottom:'28px', padding:'6px',
        background:BG, borderRadius:'18px', boxShadow:S_IN,
        animation: mounted ? 'nm-up 0.4s ease-out 0.05s both' : 'none' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px',
              borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'12px',
              fontWeight:'700', transition:'all 0.2s',
              background: filter === tab.key ? PURPLE : 'transparent',
              color:      filter === tab.key ? '#fff'  : '#64748b',
              boxShadow:  filter === tab.key ? S_PURPLE : 'none' }}>
            {tab.label}
            <span style={{ padding:'1px 7px', borderRadius:'100px', fontSize:'11px', fontWeight:'800',
              background: filter === tab.key ? 'rgba(255,255,255,0.22)' : BG,
              boxShadow:  filter === tab.key ? 'none' : S_IN_SM,
              color:      filter === tab.key ? '#fff' : '#94a3b8' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Notifications list ── */}
      {filtered.length === 0 ? (
        <div style={{ background:BG, borderRadius:'24px', boxShadow:S_IN, padding:'72px', textAlign:'center',
          animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:BG, boxShadow:S_UP,
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <IcoBell size={28} color="#c7d2fe" />
          </div>
          <p style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 6px' }}>
            No notifications
          </p>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>
            You're all caught up! Check back later for updates.
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {filtered.map((n, i) => {
            const iconFn = TYPE_ICONS[n.type] || TYPE_ICONS.info;
            return (
              <div key={n.id} className="nm-row"
                onClick={() => !n.read && markAsRead(n.id)}
                style={{ background:BG, borderRadius:'18px', padding:'18px 20px',
                  boxShadow: n.read ? S_UP : `${S_UP}, 0 0 0 2px ${PURPLE}44`,
                  display:'flex', alignItems:'center', gap:'16px',
                  cursor: n.read ? 'default' : 'pointer',
                  transition:'box-shadow 0.22s',
                  animation: mounted ? `nm-up 0.32s ease-out ${i * 0.04}s both` : 'none',
                  position:'relative' }}>

                {/* Unread dot */}
                {!n.read && (
                  <div style={{ position:'absolute', top:'18px', right:'56px', width:'9px', height:'9px',
                    borderRadius:'50%', background:PURPLE,
                    animation:'nm-pulse 1.8s ease-in-out infinite' }} />
                )}

                {/* Icon box */}
                <div style={{ width:'46px', height:'46px', borderRadius:'14px', background:BG,
                  boxShadow: n.read ? S_IN : S_UP,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {iconFn(n.read ? '#94a3b8' : PURPLE)}
                </div>

                {/* Text */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'14px', fontWeight:'800', color: n.read ? '#475569' : '#0f172a',
                    marginBottom:'3px', letterSpacing:'-0.1px' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize:'12px', color:'#64748b', lineHeight:'1.55',
                    overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'600', marginTop:'6px' }}>
                    {n.time}
                  </div>
                </div>

                {/* Read badge */}
                {n.read && (
                  <span style={{ fontSize:'10px', fontWeight:'700', color:'#94a3b8', padding:'3px 10px',
                    borderRadius:'100px', background:BG, boxShadow:S_IN_SM, whiteSpace:'nowrap', flexShrink:0 }}>
                    Read
                  </span>
                )}

                {/* Delete button */}
                <button onClick={e => { e.stopPropagation(); deleteNote(n.id); }}
                  style={{ width:'34px', height:'34px', borderRadius:'11px', border:'none', background:BG,
                    boxShadow:S_UP, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#94a3b8', flexShrink:0, transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = S_UP_LG; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = S_UP;    e.currentTarget.style.color = '#94a3b8'; }}>
                  <IcoTrash />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Notification Preferences ── */}
      <div style={{ marginTop:'32px', background:BG, borderRadius:'22px', boxShadow:S_UP, padding:'24px 26px',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px',
        animation: mounted ? 'nm-up 0.4s ease-out 0.15s both' : 'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:BG, boxShadow:S_IN,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <IcoSettings />
          </div>
          <div>
            <div style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a', marginBottom:'2px' }}>
              Notification Preferences
            </div>
            <div style={{ fontSize:'12px', color:'#94a3b8' }}>
              Customize how you receive notifications
            </div>
          </div>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:'7px', padding:'10px 20px',
          borderRadius:'12px', border:'none', background:BG, boxShadow:S_UP,
          color:'#64748b', fontSize:'13px', fontWeight:'700', cursor:'pointer',
          transition:'all 0.2s', whiteSpace:'nowrap', flexShrink:0 }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = S_UP_LG; e.currentTarget.style.color = PURPLE; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = S_UP;    e.currentTarget.style.color = '#64748b'; }}>
          <IcoSettings size={16} color="currentColor" /> Manage Settings
        </button>
      </div>
    </div>
  );
}




