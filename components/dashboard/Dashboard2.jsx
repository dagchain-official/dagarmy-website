"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/* ─── Circular Progress Ring ─── */
function ProgressRing({ value = 0, size = 64, strokeWidth = 5, color = '#6366f1' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const timer = setTimeout(() => setOffset(circumference - (value / 100) * circumference), 200);
    return () => clearTimeout(timer);
  }, [value, circumference]);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
    </svg>
  );
}

/* ─── SVG Sparkline ─── */
function Sparkline({ data, color = '#6366f1', width = 80, height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs><linearGradient id={`sp-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#sp-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard2() {
    const { userProfile, address } = useAuth();
    const [userName, setUserName] = useState('Student');
    const [userAvatar, setUserAvatar] = useState(null);
    const [userData, setUserData] = useState(null);
    const [referralCode, setReferralCode] = useState('LOADING...');
    const [referralStats, setReferralStats] = useState({
        total_referrals: 0,
        total_points_earned: 0
    });
    const [copySuccess, setCopySuccess] = useState(false);
    const [dagPoints, setDagPoints] = useState(0);
    const [userTier, setUserTier] = useState('DAG_SOLDIER');
    const [mounted, setMounted] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(null);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => setMounted(true), 100);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            if (!address) return;
            
            try {
                // Normalize wallet address to lowercase for consistent lookup
                const normalizedAddress = address.toLowerCase();
                const response = await fetch(`/api/auth/user?wallet=${normalizedAddress}`);
                const data = await response.json();
                
                if (data.user) {
                    setUserData(data.user);
                    const firstName = data.user.first_name || '';
                    const lastName = data.user.last_name || '';
                    const fullName = `${firstName} ${lastName}`.trim() || 'Student';
                    setUserName(fullName);
                    
                    if (data.user.avatar_url) {
                        setUserAvatar(data.user.avatar_url);
                    }
                    
                    // Set DAG Points and tier from user data
                    if (data.user.dag_points !== undefined) {
                        setDagPoints(data.user.dag_points);
                    }
                    if (data.user.tier) {
                        setUserTier(data.user.tier);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        
        fetchUserData();
    }, [address]);

    // Fetch referral code and stats
    useEffect(() => {
        async function fetchReferralData() {
            try {
                // Get user ID from userData
                if (!userData?.id) {
                    console.log('No user data yet, skipping referral fetch');
                    return;
                }

                console.log('Fetching referral data for user:', userData.id);

                // Fetch referral code
                const codeResponse = await fetch(`/api/referral/get-code?userId=${userData.id}`);
                const codeData = await codeResponse.json();
                if (codeData.success && codeData.code) {
                    setReferralCode(codeData.code);
                    console.log('Referral code fetched:', codeData.code);
                } else {
                    console.error('Failed to fetch referral code:', codeData);
                    setReferralCode('ERROR');
                }

                // Fetch referral stats
                const statsResponse = await fetch(`/api/referral/stats?userId=${userData.id}`);
                const statsData = await statsResponse.json();
                if (statsData.success && statsData.stats) {
                    setReferralStats(statsData.stats);
                }
            } catch (error) {
                console.error('Error fetching referral data:', error);
                setReferralCode('ERROR');
            }
        }

        fetchReferralData();
    }, [userData]);

    // Fetch events for calendar
    useEffect(() => {
        async function fetchEvents() {
            try {
                const year = calendarMonth.getFullYear();
                const month = calendarMonth.getMonth() + 1;
                const res = await fetch(`/api/events?year=${year}&month=${month}`);
                const data = await res.json();
                if (data.events) setEvents(data.events);
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        }
        fetchEvents();
    }, [calendarMonth]);

    // Handle copy referral code
    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(referralCode);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Error copying code:', error);
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
            days.push({ day: d, today: isToday, events: dayEvents });
        }
        const remaining = 7 - (days.length % 7);
        if (remaining < 7) {
            for (let i = 1; i <= remaining; i++) {
                days.push({ day: i, inactive: true, events: [] });
            }
        }
        return days;
    };

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
    const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

    const tierLabel = userTier === 'DAG_LIEUTENANT' ? 'DAG LIEUTENANT' : 'DAG SOLDIER';

    /* ─── BentoCard (matches Admin Dashboard) ─── */
    const BentoCard = useCallback(({ children, span = '1', rowSpan = '1', style = {}, hover = true, ...props }) => (
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
    ), [mounted]);

    const calendarDays = getCalendarDays();
    const upcomingEvents = events
        .filter(e => new Date(e.event_date) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
        .slice(0, 4);

    const EVENT_COLORS = {
        workshop: '#6366f1', quiz: '#10b981', project: '#f59e0b',
        meeting: '#ec4899', deadline: '#ef4444', default: '#8b5cf6'
    };

    return (
        <div style={{ padding: '32px 36px', width: '100%', background: '#f6f8fb', minHeight: '100vh' }}>

            {/* ─── Header ─── */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>
                            {greeting}, <span style={{ color: '#6366f1' }}>{userName}</span>
                        </h1>
                    </div>
                    <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: '450' }}>
                        {currentTime ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '\u00A0'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        padding: '10px 18px', background: '#fff', borderRadius: '14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.15)' }} />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
                            {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '\u00A0'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── Bento Grid ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(0, auto)', gap: '18px' }}>

                {/* ━━━ ROW 1: Welcome Hero (5 cols) ━━━ */}
                <BentoCard span="5" style={{
                    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                    border: 'none', padding: '32px', color: '#fff', minHeight: '200px'
                }}>
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', left: '20%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'rgba(99,102,241,0.2)', backdropFilter: 'blur(8px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                            }}>
                                {userAvatar ? (
                                    <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                ) : (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                            <div>
                                <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {tierLabel}
                                </span>
                            </div>
                        </div>
                        <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginBottom: '8px' }}>
                            Welcome back to DAGARMY
                        </div>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: '450', lineHeight: '1.6' }}>
                            Continue your learning journey. Master AI, Blockchain & Data Visualization.
                        </div>
                    </div>
                </BentoCard>

                {/* ━━━ ROW 1: Stat Cards (7 cols = 3 cards) ━━━ */}
                <BentoCard span="3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <Sparkline data={[10, 25, 18, 35, 42, 38, dagPoints || 50]} color="#6366f1" width={72} height={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '6px', fontVariantNumeric: 'tabular-nums' }}>
                            {dagPoints.toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>DAG Points</span>
                        </div>
                    </div>
                </BentoCard>

                <BentoCard span="2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                            {referralStats.total_referrals}
                        </div>
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', marginTop: '6px', display: 'block' }}>Referrals</span>
                    </div>
                </BentoCard>

                <BentoCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                        <ProgressRing value={68} size={80} strokeWidth={6} color="#6366f1" />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>68%</span>
                        </div>
                    </div>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Avg Progress</span>
                </BentoCard>

                {/* ━━━ ROW 2: Calendar (8 cols) + Sidebar (4 cols) ━━━ */}
                <BentoCard span="8" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Schedule Calendar</h3>
                            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', fontWeight: '500' }}>Your upcoming events and deadlines</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={prevMonth} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', minWidth: '140px', textAlign: 'center' }}>
                                {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                            </span>
                            <button onClick={nextMonth} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                        </div>
                    </div>

                    {/* Calendar Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, idx) => (
                            <div key={idx} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {calendarDays.map((date, idx) => (
                            <div key={idx} style={{
                                minHeight: '72px', display: 'flex', flexDirection: 'column', padding: '6px',
                                borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                background: date.today ? '#ede9fe' : date.inactive ? '#fafbfc' : '#fff',
                                border: date.today ? '2px solid #6366f1' : '1px solid #f1f5f9',
                                color: date.inactive ? '#cbd5e1' : '#0f172a',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => { if (!date.inactive) e.currentTarget.style.background = '#f8fafc'; }}
                            onMouseLeave={(e) => { if (!date.inactive) e.currentTarget.style.background = date.today ? '#ede9fe' : '#fff'; }}
                            >
                                <div style={{ marginBottom: '4px', fontWeight: date.today ? '800' : '600', color: date.today ? '#6366f1' : undefined }}>
                                    {date.day}
                                </div>
                                {date.events && date.events.slice(0, 2).map((event, eidx) => (
                                    <div key={eidx} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }} style={{
                                        background: EVENT_COLORS[event.event_type] || EVENT_COLORS.default,
                                        color: '#fff', padding: '2px 5px', borderRadius: '4px',
                                        fontSize: '9px', fontWeight: '600', marginBottom: '2px',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                    }}>{event.title}</div>
                                ))}
                                {date.events && date.events.length > 2 && (
                                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>+{date.events.length - 2} more</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '11px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Workshop', color: '#6366f1' },
                            { label: 'Quiz', color: '#10b981' },
                            { label: 'Project', color: '#f59e0b' },
                            { label: 'Meeting', color: '#ec4899' },
                            { label: 'Deadline', color: '#ef4444' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }} />
                                <span style={{ color: '#94a3b8', fontWeight: '600' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </BentoCard>

                {/* ━━━ Sidebar: Upcoming + Quick Actions (4 cols) ━━━ */}
                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Upcoming Events */}
                    <BentoCard span="1" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px 0' }}>Upcoming Events</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
                                <div key={idx} onClick={() => setSelectedEvent(event)} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 14px', borderRadius: '12px', background: '#f8fafc',
                                    borderLeft: `3px solid ${EVENT_COLORS[event.event_type] || EVENT_COLORS.default}`,
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{event.title}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            {event.event_time && ` at ${event.event_time.slice(0, 5)}`}
                                        </div>
                                    </div>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                        background: EVENT_COLORS[event.event_type] || EVENT_COLORS.default
                                    }} />
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '13px' }}>
                                    No upcoming events
                                </div>
                            )}
                        </div>
                    </BentoCard>

                    {/* Referral Card */}
                    <BentoCard span="1" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Referral Code</h3>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px',
                            background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'
                        }}>
                            <span style={{ flex: 1, fontSize: '15px', fontWeight: '700', color: '#0f172a', letterSpacing: '1px', fontVariantNumeric: 'tabular-nums' }}>
                                {referralCode}
                            </span>
                            <button onClick={handleCopyCode} style={{
                                padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '600',
                                background: copySuccess ? '#dcfce7' : '#6366f1', color: copySuccess ? '#10b981' : '#fff',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                {copySuccess ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                            <div style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px' }}>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{referralStats.total_referrals}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Referrals</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px' }}>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1' }}>{referralStats.total_points_earned}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Points Earned</div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Quick Actions */}
                    <BentoCard span="1" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 14px 0' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                { title: 'My Courses', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>), bg: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)', path: '/student-my-courses' },
                                { title: 'Assignments', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>), bg: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)', path: '/student-assignments' },
                                { title: 'Leaderboard', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>), bg: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)', path: '/student-leaderboard' },
                                { title: 'Get Help', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>), bg: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)', path: '/student-support' },
                            ].map((action, index) => (
                                <div key={index} onClick={() => window.location.href = action.path} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 14px', borderRadius: '12px',
                                    background: '#f8fafc', border: '1px solid transparent',
                                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = action.bg; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'transparent'; }}
                                >
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {action.icon}
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{action.title}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                                        <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </div>
            </div>

            {/* ─── Event Detail Modal ─── */}
            {selectedEvent && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }} onClick={() => setSelectedEvent(null)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: '#fff', borderRadius: '20px', padding: '0', maxWidth: '480px', width: '90%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden'
                    }}>
                        {/* Header bar */}
                        <div style={{
                            background: EVENT_COLORS[selectedEvent.event_type] || EVENT_COLORS.default,
                            padding: '20px 28px', color: '#fff'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85 }}>
                                        {selectedEvent.event_type || 'Event'}
                                    </span>
                                    <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '6px 0 0 0', letterSpacing: '-0.3px' }}>
                                        {selectedEvent.title}
                                    </h3>
                                </div>
                                <button onClick={() => setSelectedEvent(null)} style={{
                                    width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                                    background: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '24px 28px' }}>
                            {/* Date & Time */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        {new Date(selectedEvent.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {(selectedEvent.event_time || selectedEvent.end_time) && (
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                            {selectedEvent.event_time && selectedEvent.event_time.slice(0, 5)}
                                            {selectedEvent.end_time && ` - ${selectedEvent.end_time.slice(0, 5)}`}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {selectedEvent.description && (
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</div>
                                    <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                                        {selectedEvent.description}
                                    </p>
                                </div>
                            )}

                            {/* Location */}
                            {selectedEvent.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>Location</div>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{selectedEvent.location}</div>
                                    </div>
                                </div>
                            )}

                            {/* Online / Meeting Link */}
                            {selectedEvent.is_online && selectedEvent.meeting_link && (
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                                <path d="M15 10l5-3v10l-5-3z"/><rect x="2" y="6" width="13" height="12" rx="2" ry="2"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>Online Event</div>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>Join via meeting link below</div>
                                        </div>
                                    </div>
                                    <a href={selectedEvent.meeting_link} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        padding: '12px', borderRadius: '12px', border: 'none', width: '100%',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                                        textDecoration: 'none', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                                        transition: 'all 0.2s'
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                        </svg>
                                        Join Meeting
                                    </a>
                                </div>
                            )}

                            {/* Event type badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                                <div style={{
                                    width: '10px', height: '10px', borderRadius: '3px',
                                    background: EVENT_COLORS[selectedEvent.event_type] || EVENT_COLORS.default
                                }} />
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'capitalize' }}>
                                    {selectedEvent.event_type || 'Event'}
                                </span>
                                {selectedEvent.is_online && (
                                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#6366f1', padding: '2px 8px', background: '#ede9fe', borderRadius: '100px', marginLeft: '4px' }}>Online</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
