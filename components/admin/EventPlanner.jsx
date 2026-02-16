"use client";
import React, { useState, useEffect, useCallback } from "react";

const EVENT_TYPES = [
  { value: 'workshop', label: 'Workshop', color: '#6366f1' },
  { value: 'quiz', label: 'Quiz', color: '#10b981' },
  { value: 'project', label: 'Project', color: '#f59e0b' },
  { value: 'meeting', label: 'Meeting', color: '#ec4899' },
  { value: 'deadline', label: 'Deadline', color: '#ef4444' },
];

const EVENT_COLORS = {
  workshop: '#6366f1', quiz: '#10b981', project: '#f59e0b',
  meeting: '#ec4899', deadline: '#ef4444', default: '#8b5cf6'
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ─── BentoCard ─── */
function BentoCard({ children, span = '1', rowSpan = '1', style = {}, hover = true, mounted = true, ...props }) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`, gridRow: `span ${rowSpan}`,
        background: '#fff', borderRadius: '20px', padding: '28px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative', overflow: 'hidden',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        ...style
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
      {...props}
    >{children}</div>
  );
}

export default function EventPlanner() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', event_date: '', event_time: '', end_time: '',
    event_type: 'workshop', location: '', is_online: true, meeting_link: '', is_published: true
  });

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/events?limit=200');
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const resetForm = () => {
    setFormData({
      title: '', description: '', event_date: '', event_time: '', end_time: '',
      event_type: 'workshop', location: '', is_online: true, meeting_link: '', is_published: true
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const openCreateForm = (date = null) => {
    resetForm();
    if (date) {
      setFormData(prev => ({ ...prev, event_date: date }));
    }
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      event_date: event.event_date || '',
      event_time: event.event_time ? event.event_time.slice(0, 5) : '',
      end_time: event.end_time ? event.end_time.slice(0, 5) : '',
      event_type: event.event_type || 'workshop',
      location: event.location || '',
      is_online: event.is_online !== undefined ? event.is_online : true,
      meeting_link: event.meeting_link || '',
      is_published: event.is_published !== undefined ? event.is_published : true
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.event_date) return;
    setSaving(true);
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const body = editingEvent ? { id: editingEvent.id, ...formData } : formData;
      const res = await fetch('/api/admin/events', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        await fetchEvents();
        resetForm();
      } else {
        console.error('Save failed:', data.error);
      }
    } catch (err) {
      console.error('Error saving event:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        await fetchEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const togglePublish = async (event) => {
    try {
      await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: event.id, is_published: !event.is_published })
      });
      await fetchEvents();
    } catch (err) {
      console.error('Error toggling publish:', err);
    }
  };

  // Calendar helpers
  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, inactive: true, events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.event_date === dateStr);
      days.push({ day: d, today: isToday, dateStr, events: dayEvents });
    }
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, inactive: true, events: [] });
      }
    }
    return days;
  };

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  const calendarDays = getCalendarDays();

  // Stats
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.is_published).length;
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date(new Date().toDateString())).length;
  const thisMonthEvents = events.filter(e => {
    const d = new Date(e.event_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div style={{ padding: '40px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: '#f6f8fb' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 24px' }}>
            <div style={{ position: 'absolute', inset: 0, border: '3px solid #f1f5f9', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
          <div style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '500' }}>Loading events...</div>
        </div>
        <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 36px', width: '100%', background: '#f6f8fb', minHeight: '100vh' }}>

      {/* ─── Header ─── */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>
            Event Planner
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0', fontWeight: '450' }}>
            Create and manage events for the student calendar
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '3px' }}>
            {[{ key: 'calendar', label: 'Calendar' }, { key: 'list', label: 'List' }].map(v => (
              <button key={v.key} onClick={() => setViewMode(v.key)} style={{
                padding: '7px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                background: viewMode === v.key ? '#fff' : 'transparent',
                color: viewMode === v.key ? '#0f172a' : '#94a3b8',
                boxShadow: viewMode === v.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}>{v.label}</button>
            ))}
          </div>
          <button onClick={() => openCreateForm()} style={{
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Event
          </button>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        {[
          { label: 'Total Events', value: totalEvents, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>), bg: '#ede9fe' },
          { label: 'Published', value: publishedEvents, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>), bg: '#dcfce7' },
          { label: 'Upcoming', value: upcomingEvents, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>), bg: '#fef3c7' },
          { label: 'This Month', value: thisMonthEvents, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>), bg: '#fce7f3' },
        ].map((stat, i) => (
          <BentoCard key={i} mounted={mounted} style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>{stat.label}</div>
            </div>
          </BentoCard>
        ))}
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 400px' : '1fr', gap: '18px' }}>

        {/* Calendar / List View */}
        <BentoCard mounted={mounted} hover={false} style={{ padding: '24px' }}>
          {viewMode === 'calendar' ? (
            <>
              {/* Calendar Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={prevMonth} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, minWidth: '200px', textAlign: 'center', letterSpacing: '-0.5px' }}>
                    {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                  </h2>
                  <button onClick={nextMonth} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
                <button onClick={() => setCalendarMonth(new Date())} style={{
                  padding: '7px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                  background: '#fff', color: '#64748b', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                }}>Today</button>
              </div>

              {/* Day Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, idx) => (
                  <div key={idx} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {calendarDays.map((date, idx) => (
                  <div key={idx}
                    onClick={() => { if (!date.inactive) { setSelectedDate(date.dateStr); openCreateForm(date.dateStr); } }}
                    style={{
                      minHeight: '90px', display: 'flex', flexDirection: 'column', padding: '6px',
                      borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: date.inactive ? 'default' : 'pointer',
                      background: date.today ? '#ede9fe' : selectedDate === date.dateStr ? '#f0f9ff' : date.inactive ? '#fafbfc' : '#fff',
                      border: date.today ? '2px solid #6366f1' : selectedDate === date.dateStr ? '2px solid #3b82f6' : '1px solid #f1f5f9',
                      color: date.inactive ? '#cbd5e1' : '#0f172a',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { if (!date.inactive && !date.today) e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { if (!date.inactive && !date.today) e.currentTarget.style.background = selectedDate === date.dateStr ? '#f0f9ff' : '#fff'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: date.today ? '800' : '600', color: date.today ? '#6366f1' : undefined }}>{date.day}</span>
                      {!date.inactive && date.events && date.events.length > 0 && (
                        <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700' }}>{date.events.length}</span>
                      )}
                    </div>
                    {date.events && date.events.slice(0, 3).map((event, eidx) => (
                      <div key={eidx}
                        onClick={(e) => { e.stopPropagation(); openEditForm(event); }}
                        style={{
                          background: EVENT_COLORS[event.event_type] || EVENT_COLORS.default,
                          color: '#fff', padding: '2px 5px', borderRadius: '4px',
                          fontSize: '9px', fontWeight: '600', marginBottom: '2px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          opacity: event.is_published ? 1 : 0.5,
                          cursor: 'pointer'
                        }}>{event.title}</div>
                    ))}
                    {date.events && date.events.length > 3 && (
                      <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>+{date.events.length - 3} more</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '11px', flexWrap: 'wrap' }}>
                {EVENT_TYPES.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: t.color }} />
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ─── List View ─── */
            <>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px 0' }}>All Events</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {events.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '14px' }}>
                    No events yet. Click "New Event" to create one.
                  </div>
                ) : events.sort((a, b) => new Date(b.event_date) - new Date(a.event_date)).map((event) => (
                  <div key={event.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', borderRadius: '14px', background: '#f8fafc',
                    border: '1px solid #f1f5f9', transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '3px', flexShrink: 0,
                      background: EVENT_COLORS[event.event_type] || EVENT_COLORS.default,
                      opacity: event.is_published ? 1 : 0.4
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{event.title}</span>
                        {!event.is_published && (
                          <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', padding: '2px 8px', background: '#f1f5f9', borderRadius: '100px' }}>Draft</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        {event.event_time && ` at ${event.event_time.slice(0, 5)}`}
                        {event.location && ` - ${event.location}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => togglePublish(event)} title={event.is_published ? 'Unpublish' : 'Publish'} style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: event.is_published ? '#10b981' : '#94a3b8', transition: 'all 0.2s'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {event.is_published ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}
                        </svg>
                      </button>
                      <button onClick={() => openEditForm(event)} style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', transition: 'all 0.2s'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => setDeleteConfirm(event.id)} style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #fecaca',
                        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ef4444', transition: 'all 0.2s'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </BentoCard>

        {/* ─── Event Form Sidebar ─── */}
        {showForm && (
          <BentoCard mounted={mounted} hover={false} style={{ padding: '24px', alignSelf: 'start', position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button onClick={resetForm} style={{
                width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Title *</label>
                <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Event title" style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box',
                    background: '#f8fafc'
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Event description" rows={3} style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    fontSize: '14px', color: '#0f172a', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                    transition: 'border 0.2s', boxSizing: 'border-box', background: '#f8fafc'
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Date *</label>
                  <input type="date" value={formData.event_date} onChange={e => setFormData(p => ({ ...p, event_date: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Event Type</label>
                  <select value={formData.event_type} onChange={e => setFormData(p => ({ ...p, event_type: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc', cursor: 'pointer' }}>
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Start Time</label>
                  <input type="time" value={formData.event_time} onChange={e => setFormData(p => ({ ...p, event_time: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>End Time</label>
                  <input type="time" value={formData.end_time} onChange={e => setFormData(p => ({ ...p, end_time: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Location</label>
                <input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Room 101 or Online" style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
                    fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc'
                  }}
                />
              </div>

              {/* Online toggle + Meeting link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div onClick={() => setFormData(p => ({ ...p, is_online: !p.is_online }))} style={{
                  width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
                  background: formData.is_online ? '#6366f1' : '#e2e8f0', transition: 'background 0.2s',
                  position: 'relative', flexShrink: 0
                }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: '2px', left: formData.is_online ? '20px' : '2px',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                  }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Online Event</span>
              </div>

              {formData.is_online && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Meeting Link</label>
                  <input value={formData.meeting_link} onChange={e => setFormData(p => ({ ...p, meeting_link: e.target.value }))}
                    placeholder="https://meet.google.com/..." style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
                      fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', background: '#f8fafc'
                    }}
                  />
                </div>
              )}

              {/* Published toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div onClick={() => setFormData(p => ({ ...p, is_published: !p.is_published }))} style={{
                  width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
                  background: formData.is_published ? '#10b981' : '#e2e8f0', transition: 'background 0.2s',
                  position: 'relative', flexShrink: 0
                }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: '2px', left: formData.is_published ? '20px' : '2px',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                  }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
                  {formData.is_published ? 'Published (visible to students)' : 'Draft (hidden from students)'}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button onClick={handleSave} disabled={saving || !formData.title || !formData.event_date} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                  background: (!formData.title || !formData.event_date) ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: (!formData.title || !formData.event_date) ? '#94a3b8' : '#fff',
                  fontSize: '14px', fontWeight: '700', cursor: (!formData.title || !formData.event_date) ? 'not-allowed' : 'pointer',
                  boxShadow: (!formData.title || !formData.event_date) ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                  transition: 'all 0.2s'
                }}>
                  {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                {editingEvent && (
                  <button onClick={() => setDeleteConfirm(editingEvent.id)} style={{
                    padding: '12px 16px', borderRadius: '12px', border: '1px solid #fecaca',
                    background: '#fff', color: '#ef4444', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </BentoCard>
        )}
      </div>

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }} onClick={() => setDeleteConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', textAlign: 'center', margin: '0 0 8px 0' }}>Delete Event?</h3>
            <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', margin: '0 0 24px 0' }}>
              This action cannot be undone. The event will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                background: '#fff', color: '#64748b', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{
                flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                background: '#ef4444', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
