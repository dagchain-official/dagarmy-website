"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/* ── Neumorphic design tokens ───────────────────────────── */
const BG      = '#eef0f5';
const S_UP    = '6px 6px 14px rgba(0,0,0,0.12), -5px -5px 12px rgba(255,255,255,0.95)';
const S_UP_LG = '10px 10px 24px rgba(0,0,0,0.13), -8px -8px 20px rgba(255,255,255,1)';
const S_IN    = 'inset 5px 5px 12px rgba(0,0,0,0.11), inset -4px -4px 10px rgba(255,255,255,0.9)';
const S_IN_SM = 'inset 3px 3px 7px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)';
const PURPLE  = '#6366f1';
const S_PURPLE= '5px 5px 14px rgba(99,102,241,0.40), -3px -3px 8px rgba(255,255,255,0.6)';

const EVENT_COLORS = {
  workshop: { accent: '#6366f1', light: 'rgba(99,102,241,0.12)',  dot: '#6366f1' },
  quiz:     { accent: '#10b981', light: 'rgba(16,185,129,0.12)',  dot: '#10b981' },
  project:  { accent: '#f59e0b', light: 'rgba(245,158,11,0.12)',  dot: '#f59e0b' },
  meeting:  { accent: '#ec4899', light: 'rgba(236,72,153,0.12)',  dot: '#ec4899' },
  deadline: { accent: '#ef4444', light: 'rgba(239,68,68,0.12)',   dot: '#ef4444' },
};
const DEFAULT_COLOR = { accent: '#6366f1', light: 'rgba(99,102,241,0.12)', dot: '#6366f1' };

const TIER_LABELS = { DAG_LIEUTENANT: 'LIEUTENANT', DAG_SOLDIER: 'SOLDIER' };
const TIER_COLORS = {
  DAG_LIEUTENANT: { bg: 'rgba(245,158,11,0.13)', text: '#92400e' },
  DAG_SOLDIER:    { bg: 'rgba(99,102,241,0.12)', text: '#4f46e5' },
};

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function formatDateBadge(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
  };
}

function formatTime(t) {
  if (!t) return null;
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/* ── Neumorphic Capacity Bar ── */
function CapacityBar({ rsvpCount, maxCapacity }) {
  if (!maxCapacity) return null;
  const pct    = Math.min(100, (rsvpCount / maxCapacity) * 100);
  const isFull = rsvpCount >= maxCapacity;
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
        <span style={{ fontSize:'11px', fontWeight:'700', color: isFull ? '#ef4444' : '#64748b' }}>
          {isFull ? 'Full' : `${rsvpCount} / ${maxCapacity} spots`}
        </span>
        {isFull && (
          <span style={{ fontSize:'10px', fontWeight:'800', color:'#ef4444', padding:'2px 8px',
            background: BG, boxShadow: S_IN_SM, borderRadius:'100px' }}>FULL</span>
        )}
      </div>
      <div style={{ height:'6px', background: BG, borderRadius:'3px', boxShadow: S_IN_SM, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:'3px', transition:'width 0.6s ease',
          background: isFull ? '#ef4444' : `linear-gradient(90deg, ${PURPLE}, #8b5cf6)`,
          width:`${pct}%`,
        }} />
      </div>
    </div>
  );
}

/* ── Neumorphic Event Card ── */
function EventCard({ event, onJoin, onDelete, joining }) {
  const color    = EVENT_COLORS[event.event_type] || DEFAULT_COLOR;
  const badge    = formatDateBadge(event.event_date);
  const tierSt   = TIER_COLORS[event.creator_tier] || TIER_COLORS.DAG_SOLDIER;

  return (
    <div className="nm-card" style={{
      background: BG, borderRadius:'22px', boxShadow: S_UP,
      display:'flex', flexDirection:'column', overflow:'hidden',
      transition:'box-shadow 0.25s',
    }}>

      {/* ── Top accent strip ── */}
      <div style={{
        height:'5px', flexShrink:0,
        background:`linear-gradient(90deg, ${color.accent}, ${color.accent}88)`,
      }} />

      {/* ── Card body ── */}
      <div style={{ padding:'20px 22px 0' }}>

        {/* Date badge + type pill row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'16px' }}>

          {/* Date badge — inset box */}
          <div style={{ background: BG, boxShadow: S_IN, borderRadius:'14px', padding:'10px 14px', textAlign:'center', minWidth:'52px' }}>
            <div style={{ fontSize:'9px', fontWeight:'800', color: color.accent, letterSpacing:'1px' }}>{badge.month}</div>
            <div style={{ fontSize:'24px', fontWeight:'900', color:'#0f172a', lineHeight:1, letterSpacing:'-1px' }}>{badge.day}</div>
            <div style={{ fontSize:'9px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.5px', marginTop:'1px' }}>{badge.weekday}</div>
          </div>

          {/* Right side: type pill + online badge */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px', paddingTop:'4px' }}>
            <span style={{
              fontSize:'10px', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.7px',
              padding:'4px 12px', borderRadius:'100px', background: BG, boxShadow: S_IN_SM,
              color: color.accent,
            }}>
              {event.event_type || 'event'}
            </span>
            {event.is_online && (
              <span style={{ fontSize:'10px', fontWeight:'700', color:'#64748b', display:'flex', alignItems:'center', gap:'4px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Online
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize:'15px', fontWeight:'800', color:'#0f172a', margin:'0 0 8px', lineHeight:'1.4', letterSpacing:'-0.2px' }}>
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p style={{ fontSize:'12px', color:'#64748b', margin:'0 0 14px', lineHeight:'1.6',
            overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
            {event.description}
          </p>
        )}

        {/* Meta chips row */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'7px', marginBottom:'16px' }}>
          {(event.event_time || event.end_time) && (
            <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 11px',
              borderRadius:'10px', background: BG, boxShadow: S_IN_SM, fontSize:'11px', fontWeight:'700', color:'#475569' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatTime(event.event_time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ''}
            </div>
          )}
          {!event.is_online && (event.location || true) && (
            <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 11px',
              borderRadius:'10px', background: BG, boxShadow: S_IN_SM, fontSize:'11px', fontWeight:'700', color:'#475569' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {event.location || 'Location TBD'}
            </div>
          )}
        </div>

        {/* Capacity bar */}
        {event.max_capacity && <div style={{ marginBottom:'16px' }}><CapacityBar rsvpCount={event.rsvp_count} maxCapacity={event.max_capacity} /></div>}
      </div>

      {/* ── Footer ── */}
      <div style={{ margin:'0 16px 16px', borderRadius:'14px', background: BG, boxShadow: S_IN,
        padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px' }}>

        {/* Host info */}
        <div style={{ display:'flex', alignItems:'center', gap:'9px', minWidth:0 }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'10px', flexShrink:0, background: BG,
            boxShadow: S_UP, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'11px', fontWeight:'900', color: color.accent }}>
            {getInitials(event.creator_name)}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#0f172a',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {event.creator_name}
            </div>
            <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 7px', borderRadius:'100px',
              background: tierSt.bg, color: tierSt.text, letterSpacing:'0.4px' }}>
              {TIER_LABELS[event.creator_tier] || 'SOLDIER'}
            </span>
          </div>
        </div>

        {/* CTA */}
        {event.is_creator ? (
          <div style={{ display:'flex', alignItems:'center', gap:'7px', flexShrink:0 }}>
            <span style={{ fontSize:'11px', fontWeight:'700', color:'#059669', padding:'5px 11px',
              background: BG, boxShadow: S_IN_SM, borderRadius:'10px' }}>
              Hosting
            </span>
            <button onClick={() => onDelete(event.id)} title="Delete event"
              style={{ width:'32px', height:'32px', borderRadius:'10px', border:'none', background: BG,
                boxShadow: S_UP, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                color:'#ef4444', flexShrink:0, transition:'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = S_UP_LG}
              onMouseLeave={e => e.currentTarget.style.boxShadow = S_UP}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        ) : event.has_joined ? (
          <button onClick={() => onJoin(event.id, 'unjoin')} disabled={joining === event.id}
            style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 16px',
              borderRadius:'11px', border:'none', background: BG, boxShadow: S_IN_SM,
              color:'#059669', fontSize:'12px', fontWeight:'700', cursor:'pointer',
              whiteSpace:'nowrap', flexShrink:0, transition:'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = S_UP}
            onMouseLeave={e => e.currentTarget.style.boxShadow = S_IN_SM}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Going
          </button>
        ) : event.is_full ? (
          <span style={{ fontSize:'11px', fontWeight:'700', color:'#94a3b8', padding:'8px 16px',
            background: BG, boxShadow: S_IN_SM, borderRadius:'11px' }}>
            Full
          </span>
        ) : (
          <button onClick={() => onJoin(event.id, 'join')} disabled={joining === event.id}
            style={{ display:'flex', alignItems:'center', gap:'5px', padding:'8px 18px',
              borderRadius:'11px', border:'none', background: PURPLE, color:'#fff',
              fontSize:'12px', fontWeight:'700', cursor: joining === event.id ? 'not-allowed' : 'pointer',
              whiteSpace:'nowrap', flexShrink:0, boxShadow: S_PURPLE,
              opacity: joining === event.id ? 0.7 : 1, transition:'all 0.15s' }}
            onMouseEnter={e => { if (joining !== event.id) e.currentTarget.style.background = '#4f46e5'; }}
            onMouseLeave={e => e.currentTarget.style.background = PURPLE}>
            {joining === event.id ? 'Joining...' : 'Join'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Neumorphic Create Event Modal ── */
function CreateEventModal({ onClose, onCreated, userId }) {
  const [form, setForm] = useState({
    title:'', description:'', event_date:'', event_time:'', end_time:'',
    event_type:'workshop', location:'', is_online:true, meeting_link:'', max_capacity:'',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.event_date) { setError('Title and date are required'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/user-events', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ ...form, userId }),
      });
      const data = await res.json();
      if (data.success) onCreated(data.event);
      else setError(data.error || 'Failed to create event');
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const nmInput = {
    width:'100%', padding:'11px 14px', borderRadius:'12px', border:'none',
    fontSize:'13px', color:'#0f172a', outline:'none',
    background: BG, boxShadow: S_IN, boxSizing:'border-box',
    fontFamily:'inherit',
  };
  const lbl = { fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase',
    letterSpacing:'0.7px', marginBottom:'7px', display:'block' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.45)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:'20px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div style={{ background: BG, borderRadius:'28px', width:'100%', maxWidth:'520px',
        maxHeight:'90vh', overflowY:'auto',
        boxShadow:'16px 16px 40px rgba(0,0,0,0.18), -10px -10px 30px rgba(255,255,255,0.95)',
        animation:'nm-up 0.3s ease-out both' }}>

        {/* Modal header */}
        <div style={{ padding:'26px 28px 20px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <h2 style={{ fontSize:'18px', fontWeight:'800', color:'#0f172a', margin:'0 0 4px', fontFamily:'Nasalization, sans-serif' }}>Create Event</h2>
            <p style={{ fontSize:'12px', color:'#94a3b8', margin:0 }}>Schedule a community event for others to join</p>
          </div>
          <button onClick={onClose}
            style={{ width:'36px', height:'36px', borderRadius:'12px', border:'none', background: BG,
              boxShadow: S_UP, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              color:'#64748b', flexShrink:0, marginLeft:'12px', transition:'box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = S_UP_LG; e.currentTarget.style.color = PURPLE; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = S_UP;    e.currentTarget.style.color = '#64748b'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding:'4px 28px 28px', display:'flex', flexDirection:'column', gap:'16px' }}>

          {error && (
            <div style={{ padding:'12px 16px', background: BG, boxShadow: S_IN,
              borderRadius:'12px', fontSize:'12px', color:'#dc2626', fontWeight:'600' }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label style={lbl}>Title *</label>
            <input style={nmInput} value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Intro to Blockchain" required />
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description</label>
            <textarea style={{ ...nmInput, minHeight:'80px', resize:'vertical' }}
              value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What will you be teaching or discussing?" />
          </div>

          {/* Date / Time row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' }}>
            <div>
              <label style={lbl}>Date *</label>
              <input type="date" style={nmInput} value={form.event_date}
                onChange={e => set('event_date', e.target.value)} required />
            </div>
            <div>
              <label style={lbl}>Start Time</label>
              <input type="time" style={nmInput} value={form.event_time}
                onChange={e => set('event_time', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>End Time</label>
              <input type="time" style={nmInput} value={form.end_time}
                onChange={e => set('end_time', e.target.value)} />
            </div>
          </div>

          {/* Type / Capacity row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={lbl}>Event Type</label>
              <select style={{ ...nmInput, cursor:'pointer' }} value={form.event_type}
                onChange={e => set('event_type', e.target.value)}>
                <option value="workshop">Workshop</option>
                <option value="quiz">Quiz</option>
                <option value="project">Project</option>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Max Capacity</label>
              <input type="number" min="1" style={nmInput} value={form.max_capacity}
                onChange={e => set('max_capacity', e.target.value)} placeholder="Unlimited" />
            </div>
          </div>

          {/* Online toggle */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 16px', borderRadius:'14px', background: BG, boxShadow: S_IN }}>
            <div>
              <div style={{ fontSize:'13px', fontWeight:'700', color:'#0f172a' }}>Online Event</div>
              <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px' }}>Attendees join via meeting link</div>
            </div>
            <button type="button" onClick={() => set('is_online', !form.is_online)}
              style={{ width:'46px', height:'26px', borderRadius:'100px', border:'none', cursor:'pointer',
                background: form.is_online ? PURPLE : '#cbd5e1',
                position:'relative', transition:'background 0.25s', flexShrink:0,
                boxShadow: form.is_online ? S_PURPLE : S_IN_SM }}>
              <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#fff',
                position:'absolute', top:'3px', transition:'left 0.25s',
                left: form.is_online ? '23px' : '3px',
                boxShadow:'0 1px 4px rgba(0,0,0,0.22)' }} />
            </button>
          </div>

          {/* Link / Location */}
          {form.is_online ? (
            <div>
              <label style={lbl}>Meeting Link</label>
              <input style={nmInput} value={form.meeting_link}
                onChange={e => set('meeting_link', e.target.value)} placeholder="https://meet.google.com/..." />
            </div>
          ) : (
            <div>
              <label style={lbl}>Location</label>
              <input style={nmInput} value={form.location}
                onChange={e => set('location', e.target.value)} placeholder="e.g. Room 101 or address" />
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'14px', borderRadius:'16px', border:'none',
              background: loading ? BG : PURPLE,
              color: loading ? '#94a3b8' : '#fff',
              fontSize:'14px', fontWeight:'700', cursor: loading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
              boxShadow: loading ? S_IN : S_PURPLE, transition:'all 0.2s', marginTop:'4px' }}>
            {loading ? (
              <><div style={{ width:'16px', height:'16px', border:'2px solid rgba(100,116,139,0.3)',
                borderTopColor:'#64748b', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Creating...</>
            ) : (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Event</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function StudentEventsPage() {
  const { address } = useAuth();
  const [userData,   setUserData]   = useState(null);
  const [events,     setEvents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('upcoming');
  const [joining,    setJoining]    = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast,      setToast]      = useState(null);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    async function fetchUser() {
      if (!address) return;
      try {
        const res  = await fetch(`/api/auth/user?wallet=${address.toLowerCase()}`);
        const data = await res.json();
        if (data.user) setUserData(data.user);
      } catch {}
    }
    fetchUser();
  }, [address]);

  const fetchEvents = useCallback(async () => {
    if (!userData?.id) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/user-events?userId=${userData.id}&filter=${filter}`);
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch {}
    finally { setLoading(false); }
  }, [userData, filter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleJoin = async (eventId, action) => {
    if (!userData?.id) return;
    setJoining(eventId);
    try {
      const res  = await fetch('/api/user-events/rsvp', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ userId: userData.id, eventId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(action === 'join' ? "You're going!" : 'Removed from attendees');
        fetchEvents();
      } else showToast(data.error || 'Something went wrong', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setJoining(null); }
  };

  const handleDelete = async (eventId) => {
    if (!userData?.id || !confirm('Delete this event? This cannot be undone.')) return;
    try {
      const res  = await fetch(`/api/user-events/${eventId}?userId=${userData.id}`, { method:'DELETE' });
      const data = await res.json();
      if (data.success) { showToast('Event deleted'); fetchEvents(); }
      else showToast(data.error || 'Could not delete', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const handleCreated = () => {
    setShowCreate(false);
    showToast('Event created! Others can now join.');
    fetchEvents();
  };

  const upcomingCount = events.filter(e => !e.is_past).length;
  const myCount       = events.filter(e => e.has_joined || e.is_creator).length;

  return (
    <>
      <div style={{ width:'100%', padding:'32px 36px', background: BG, minHeight:'100vh', boxSizing:'border-box' }}>
        <style>{`
          @keyframes spin  { to { transform:rotate(360deg); } }
          @keyframes nm-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes nm-sk { 0%,100%{opacity:0.55} 50%{opacity:0.85} }
          .nm-card:hover { box-shadow: ${S_UP_LG} !important; }
        `}</style>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px',
          animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ width:'52px', height:'52px', borderRadius:'16px', background: BG, boxShadow: S_UP,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
                <line x1="8"  y1="2" x2="8"  y2="6" strokeLinecap="round"/>
                <line x1="3"  y1="10" x2="21" y2="10" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize:'26px', fontWeight:'800', color:'#0f172a', margin:'0 0 2px',
                letterSpacing:'-0.5px', fontFamily:'Nasalization, sans-serif' }}>Community Events</h1>
              <p style={{ fontSize:'13px', color:'#94a3b8', margin:0, fontWeight:'500' }}>
                Browse, join and host learning sessions with the DAGARMY community
              </p>
            </div>
          </div>

          {/* Create Event button */}
          <button onClick={() => setShowCreate(true)}
            style={{ display:'flex', alignItems:'center', gap:'7px', padding:'11px 22px',
              borderRadius:'14px', border:'none', background: PURPLE, color:'#fff',
              fontSize:'13px', fontWeight:'700', cursor:'pointer', boxShadow: S_PURPLE,
              whiteSpace:'nowrap', transition:'all 0.15s', flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
            onMouseLeave={e => e.currentTarget.style.background = PURPLE}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Event
          </button>
        </div>

        {/* ── Stat tiles ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px', maxWidth:'480px' }}>
          {[
            { label:'Total Events', value: events.length,   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            { label:'Upcoming',     value: filter === 'upcoming' ? events.length : 0, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round"/></svg> },
            { label:'My Events',    value: myCount,          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" strokeLinecap="round"/></svg> },
          ].map((s, i) => (
            <div key={i} className="nm-card" style={{ background: BG, borderRadius:'18px', padding:'18px 14px',
              boxShadow: S_UP, display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
              animation: mounted ? `nm-up 0.38s ease-out ${i * 0.05}s both` : 'none', transition:'box-shadow 0.2s' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'13px', background: BG,
                boxShadow: S_IN, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {s.icon}
              </div>
              <div style={{ fontSize:'22px', fontWeight:'900', color:'#0f172a', letterSpacing:'-1px', lineHeight:1 }}>{s.value ?? 0}</div>
              <div style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.6px', textAlign:'center' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ display:'inline-flex', marginBottom:'28px', background: BG, borderRadius:'18px',
          padding:'5px', boxShadow: S_IN, animation: mounted ? 'nm-up 0.4s ease-out 0.1s both' : 'none' }}>
          {['upcoming','past'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:'10px 28px', borderRadius:'13px', border:'none', cursor:'pointer',
                fontSize:'13px', fontWeight:'700', textTransform:'capitalize', transition:'all 0.2s',
                background: filter === f ? PURPLE : 'transparent',
                color:      filter === f ? '#fff'  : '#64748b',
                boxShadow:  filter === f ? S_PURPLE : 'none' }}>
              {f === 'upcoming' ? 'Upcoming' : 'Past Events'}
            </button>
          ))}
        </div>

        {/* ── Events grid ── */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: BG, borderRadius:'22px', height:'320px',
                boxShadow: S_UP, animation:'nm-sk 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div style={{ background: BG, borderRadius:'24px', boxShadow: S_IN, padding:'72px', textAlign:'center',
            animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'20px', background: BG,
              boxShadow: S_UP, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a', margin:'0 0 6px' }}>
              {filter === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </p>
            <p style={{ fontSize:'13px', color:'#94a3b8', margin:'0 0 24px' }}>
              {filter === 'upcoming' ? 'Be the first to create one!' : 'Events you attended will appear here.'}
            </p>
            {filter === 'upcoming' && (
              <button onClick={() => setShowCreate(true)}
                style={{ padding:'11px 28px', borderRadius:'14px', border:'none', background: PURPLE,
                  color:'#fff', fontSize:'13px', fontWeight:'700', cursor:'pointer', boxShadow: S_PURPLE }}>
                Create First Event
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px' }}>
            {events.map((event, i) => (
              <div key={event.id} style={{ animation: mounted ? `nm-up 0.35s ease-out ${i * 0.04}s both` : 'none' }}>
                <EventCard event={event} onJoin={handleJoin} onDelete={handleDelete} joining={joining} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create Modal ── */}
      {showCreate && userData?.id && (
        <CreateEventModal userId={userData.id} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:99999,
          padding:'13px 20px', borderRadius:'14px',
          background: BG,
          boxShadow: toast.type === 'error'
            ? '6px 6px 16px rgba(220,38,38,0.18), -4px -4px 12px rgba(255,255,255,0.9)'
            : '6px 6px 16px rgba(16,185,129,0.18), -4px -4px 12px rgba(255,255,255,0.9)',
          color: toast.type === 'error' ? '#dc2626' : '#059669',
          fontSize:'13px', fontWeight:'700',
          animation:'nm-up 0.3s ease-out both',
          display:'flex', alignItems:'center', gap:'8px' }}>
          {toast.type === 'error'
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </>
  );
}









