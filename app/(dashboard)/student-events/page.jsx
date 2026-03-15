"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";

const EVENT_COLORS = {
  workshop: { bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', badge: '#ede9fe', text: '#6366f1' },
  quiz:     { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', badge: '#dcfce7', text: '#10b981' },
  project:  { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', badge: '#fef3c7', text: '#f59e0b' },
  meeting:  { bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', badge: '#fce7f3', text: '#ec4899' },
  deadline: { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', badge: '#fee2e2', text: '#ef4444' },
};
const DEFAULT_COLOR = { bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', badge: '#ede9fe', text: '#6366f1' };

const TIER_LABELS = { DAG_LIEUTENANT: 'LIEUTENANT', DAG_SOLDIER: 'SOLDIER' };
const TIER_COLORS = { DAG_LIEUTENANT: { bg: '#fef3c7', text: '#92400e' }, DAG_SOLDIER: { bg: '#ede9fe', text: '#6366f1' } };

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateBadge(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
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

function CapacityBar({ rsvpCount, maxCapacity }) {
  if (!maxCapacity) return null;
  const pct = Math.min(100, (rsvpCount / maxCapacity) * 100);
  const isFull = rsvpCount >= maxCapacity;
  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: isFull ? '#ef4444' : '#64748b' }}>
          {isFull ? 'Full' : `${rsvpCount} / ${maxCapacity} spots`}
        </span>
        {isFull && (
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#ef4444', padding: '1px 6px', background: '#fee2e2', borderRadius: '100px' }}>FULL</span>
        )}
      </div>
      <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          background: isFull ? '#ef4444' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          width: `${pct}%`, transition: 'width 0.6s ease'
        }} />
      </div>
    </div>
  );
}

function EventCard({ event, onJoin, onDelete, joining }) {
  const color = EVENT_COLORS[event.event_type] || DEFAULT_COLOR;
  const badge = formatDateBadge(event.event_date);
  const tierStyle = TIER_COLORS[event.creator_tier] || TIER_COLORS.DAG_SOLDIER;

  return (
    <div style={{
      background: '#fff', borderRadius: '18px', overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.07)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
      transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)'; }}
    >
      {/* Colour strip header */}
      <div style={{ background: color.bg, padding: '20px 20px 16px', position: 'relative', minHeight: '80px' }}>
        {/* Date badge */}
        <div style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)',
          borderRadius: '10px', padding: '6px 10px', textAlign: 'center', minWidth: '44px',
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#fff', letterSpacing: '0.8px' }}>{badge.month}</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', lineHeight: 1 }}>{badge.day}</div>
        </div>

        {/* Event type badge */}
        <span style={{
          display: 'inline-block', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
          letterSpacing: '0.8px', color: '#fff', background: 'rgba(255,255,255,0.2)',
          padding: '3px 10px', borderRadius: '100px', marginBottom: '10px'
        }}>
          {event.event_type || 'Event'}
        </span>

        {/* Title */}
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0, lineHeight: '1.35', paddingRight: '56px', letterSpacing: '-0.2px' }}>
          {event.title}
        </h3>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Description */}
        {event.description && (
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5',
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {event.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {(event.event_time || event.end_time) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatTime(event.event_time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ''}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
            {event.is_online ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l5-3v10l-5-3z"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg>
                Online Event
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {event.location || 'Location TBD'}
              </>
            )}
          </div>
        </div>

        {/* Capacity bar */}
        <CapacityBar rsvpCount={event.rsvp_count} maxCapacity={event.max_capacity} />

        {/* Divider */}
        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '2px' }} />

        {/* Host row + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {/* Host */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: color.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '800', color: '#fff'
            }}>
              {getInitials(event.creator_name)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {event.creator_name}
              </div>
              <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '100px', background: tierStyle.bg, color: tierStyle.text }}>
                {TIER_LABELS[event.creator_tier] || 'SOLDIER'}
              </span>
            </div>
          </div>

          {/* CTA */}
          {event.is_creator ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', padding: '4px 10px', background: '#dcfce7', borderRadius: '8px' }}>
                You're hosting
              </span>
              <button
                onClick={() => onDelete(event.id)}
                title="Delete event"
                style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          ) : event.has_joined ? (
            <button
              onClick={() => onJoin(event.id, 'unjoin')}
              disabled={joining === event.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px',
                borderRadius: '10px', border: '1.5px solid #bbf7d0', background: '#f0fdf4',
                color: '#16a34a', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; e.currentTarget.style.borderColor = '#86efac'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Going
            </button>
          ) : event.is_full ? (
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', padding: '7px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              Full
            </span>
          ) : (
            <button
              onClick={() => onJoin(event.id, 'join')}
              disabled={joining === event.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px',
                borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: '12px', fontWeight: '700', cursor: joining === event.id ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                opacity: joining === event.id ? 0.7 : 1,
              }}
            >
              {joining === event.id ? 'Joining...' : 'Join'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateEventModal({ onClose, onCreated, userId }) {
  const [form, setForm] = useState({
    title: '', description: '', event_date: '', event_time: '', end_time: '',
    event_type: 'workshop', location: '', is_online: true, meeting_link: '', max_capacity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.event_date) { setError('Title and date are required'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/user-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }),
      });
      const data = await res.json();
      if (data.success) { onCreated(data.event); }
      else { setError(data.error || 'Failed to create event'); }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a',
    outline: 'none', background: '#fff', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '5px', display: 'block' };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Create Event</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '3px 0 0' }}>Schedule a community event for others to join</p>
          </div>
          <button onClick={onClose} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ padding: '10px 14px', background: '#fee2e2', borderRadius: '10px', fontSize: '13px', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Intro to Blockchain" required
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What will you be teaching or discussing?"
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Date *</label>
              <input type="date" style={inputStyle} value={form.event_date} onChange={e => set('event_date', e.target.value)} required
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" style={inputStyle} value={form.event_time} onChange={e => set('event_time', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input type="time" style={inputStyle} value={form.end_time} onChange={e => set('end_time', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Event Type</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.event_type} onChange={e => set('event_type', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                <option value="workshop">Workshop</option>
                <option value="quiz">Quiz</option>
                <option value="project">Project</option>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Max Capacity</label>
              <input type="number" min="1" style={inputStyle} value={form.max_capacity} onChange={e => set('max_capacity', e.target.value)} placeholder="Unlimited"
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Online toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Online Event</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Attendees will join via meeting link</div>
            </div>
            <button type="button" onClick={() => set('is_online', !form.is_online)} style={{
              width: '44px', height: '24px', borderRadius: '100px', border: 'none', cursor: 'pointer',
              background: form.is_online ? '#6366f1' : '#e2e8f0', position: 'relative', transition: 'background 0.2s', flexShrink: 0
            }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '3px', transition: 'left 0.2s',
                left: form.is_online ? '23px' : '3px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          {form.is_online ? (
            <div>
              <label style={labelStyle}>Meeting Link</label>
              <input style={inputStyle} value={form.meeting_link} onChange={e => set('meeting_link', e.target.value)} placeholder="https://meet.google.com/..."
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          ) : (
            <div>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Room 101 or address"
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: loading ? '#c7d2fe' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
            transition: 'all 0.2s', marginTop: '4px'
          }}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StudentEventsPage() {
  const { userProfile, address } = useAuth();
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [joining, setJoining] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch logged-in user data
  useEffect(() => {
    async function fetchUser() {
      if (!address) return;
      try {
        const res = await fetch(`/api/auth/user?wallet=${address.toLowerCase()}`);
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
      const res = await fetch(`/api/user-events?userId=${userData.id}&filter=${filter}`);
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
      const res = await fetch('/api/user-events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id, eventId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(action === 'join' ? "You're going!" : 'Removed from attendees');
        fetchEvents();
      } else {
        showToast(data.error || 'Something went wrong', 'error');
      }
    } catch { showToast('Network error', 'error'); }
    finally { setJoining(null); }
  };

  const handleDelete = async (eventId) => {
    if (!userData?.id || !confirm('Delete this event? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/user-events/${eventId}?userId=${userData.id}`, { method: 'DELETE' });
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

  const tabStyle = (active) => ({
    padding: '8px 18px', borderRadius: '10px', border: 'none',
    background: active ? '#6366f1' : 'transparent',
    color: active ? '#fff' : '#64748b',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <>
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: '0', height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
        <DashboardNav2 />
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: '32px 36px', background: '#f0f2f5' }}>

              {/* Page header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                    Community Events
                  </h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '5px 0 0', fontWeight: '500' }}>
                    Browse, join and host learning sessions with the DAGARMY community
                  </p>
                </div>
                <button
                  onClick={() => setShowCreate(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px',
                    borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Create Event
                </button>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
                {['upcoming', 'past'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={tabStyle(filter === f)}>
                    {f === 'upcoming' ? 'Upcoming' : 'Past'}
                  </button>
                ))}
              </div>

              {/* Events grid */}
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ background: '#fff', borderRadius: '18px', height: '280px', animation: 'pulse 1.5s ease-in-out infinite', border: '1px solid #f1f5f9' }} />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
                    {filter === 'upcoming' ? 'No upcoming events' : 'No past events'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 20px' }}>
                    {filter === 'upcoming' ? 'Be the first to create one!' : 'Events you attended will appear here.'}
                  </p>
                  {filter === 'upcoming' && (
                    <button onClick={() => setShowCreate(true)} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      Create First Event
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {events.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onJoin={handleJoin}
                      onDelete={handleDelete}
                      joining={joining}
                    />
                  ))}
                </div>
              )}
      </div>
    </div>

      {/* Create modal */}
      {showCreate && userData?.id && (
        <CreateEventModal
          userId={userData.id}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999,
          padding: '12px 20px', borderRadius: '12px',
          background: toast.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: toast.type === 'error' ? '#dc2626' : '#16a34a',
          fontSize: '13px', fontWeight: '700',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </>
  );
}









