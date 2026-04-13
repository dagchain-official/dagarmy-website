"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import LieutenantUpgradeModal from "@/components/dashboard/LieutenantUpgradeModal";

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
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
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
            <defs><linearGradient id={`sp-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient></defs>
            <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#sp-${color.replace('#', '')})`} />
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
    const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
    // Redeem card state
    const [redeemType, setRedeemType] = useState('dgcc');
    const [redeemAmount, setRedeemAmount] = useState(1);
    const [redeeming, setRedeeming] = useState(false);
    const [redeemMsg, setRedeemMsg] = useState(null);
    // Withdraw card state
    const [usdEarned, setUsdEarned] = useState(0);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [withdrawHistory, setWithdrawHistory] = useState([]);
    const [withdrawMonth, setWithdrawMonth] = useState(() => {
        const d = new Date(); d.setMonth(d.getMonth() - 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const [withdrawPayoutMethod, setWithdrawPayoutMethod] = useState('bank');
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawMsg, setWithdrawMsg] = useState(null);
    const [dagPoints, setDagPoints] = useState(0);
    const [dgccBalance, setDgccBalance] = useState(0);
    const [userTier, setUserTier] = useState('DAG_SOLDIER');
    const [currentRank, setCurrentRank] = useState('None');
    const [mounted, setMounted] = useState(false);
    const [pageOrigin, setPageOrigin] = useState('https://dagarmy.network');
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(null);
    const [stripeLoading, setStripeLoading] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dagchainData, setDagchainData] = useState(null);
    const [dagchainLoading, setDagchainLoading] = useState(false);
    const [dagchainCopied, setDagchainCopied] = useState(false);
    const [showRankBurnModal, setShowRankBurnModal] = useState(false);
    const [calendarWeekOffset, setCalendarWeekOffset] = useState(0);
    const [calendarPopup, setCalendarPopup] = useState(null);
    const [eventCarouselIdx, setEventCarouselIdx] = useState(0);
    const [upgrading, setUpgrading] = useState(false);
    const [upgradeResult, setUpgradeResult] = useState(null);
    // DGCC Transfer modal
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferDest, setTransferDest] = useState(null);
    const [transferAmount, setTransferAmount] = useState(1);
    const [transferring, setTransferring] = useState(false);
    const [transferMsg, setTransferMsg] = useState(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => { setMounted(true); setPageOrigin(window.location.origin); }, 100);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            try {
                let url = null;
                if (address) {
                    url = `/api/auth/user?wallet=${address.toLowerCase()}`;
                } else {
                    const stored = typeof window !== 'undefined' ? localStorage.getItem('dagarmy_user') : null;
                    const storedUser = stored ? JSON.parse(stored) : null;
                    if (storedUser?.email) {
                        url = `/api/auth/user?email=${encodeURIComponent(storedUser.email)}`;
                    } else if (storedUser?.wallet_address) {
                        url = `/api/auth/user?wallet=${storedUser.wallet_address.toLowerCase()}`;
                    }
                }
                if (!url) return;

                const response = await fetch(url);
                const data = await response.json();

                if (data.user) {
                    // Redirect to profile completion if not yet done
                    if (!data.user.profile_completed) {
                        window.dispatchEvent(new CustomEvent('dagarmy:show-profile-completion', {
                            detail: {
                                email: data.user.email,
                                walletAddress: data.user.wallet_address
                            }
                        }));
                        window.location.href = '/';
                        return;
                    }
                    setUserData(data.user);
                    const fullName = data.user.full_name ||
                        (`${data.user.first_name || ''} ${data.user.last_name || ''}`).trim() ||
                        'Student';
                    setUserName(fullName);
                    if (data.user.avatar_url) {
                        setUserAvatar(data.user.avatar_url);
                    }
                    if (data.user.tier) {
                        setUserTier(data.user.tier);
                    }
                    if (data.user.current_rank !== undefined) {
                        setCurrentRank(data.user.current_rank || 'None');
                    }
                    setDagPoints(data.user.dag_points || 0);
                    setDgccBalance(data.user.dgcc_balance || 0);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUserData();
    }, [address, userProfile]);

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

    const handleRankUpgrade = async () => {
        if (upgrading) return;
        setUpgrading(true);
        setUpgradeResult(null);
        try {
            const stored = typeof window !== 'undefined' ? localStorage.getItem('dagarmy_user') : null;
            const storedUser = stored ? JSON.parse(stored) : null;
            const body = (userData?.email || storedUser?.email)
                ? { action: 'rank_burn', user_email: userData?.email || storedUser?.email }
                : { action: 'rank_burn', wallet_address: (address || storedUser?.wallet_address || '').toLowerCase() };
            const res = await fetch('/api/rewards/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                setUpgradeResult({ type: 'success', newRank: data.newRank, pointsBurned: data.pointsBurned, availablePoints: data.availablePoints });
                setCurrentRank(data.newRank);
                setDagPoints(data.availablePoints);
                setTimeout(() => { setShowRankBurnModal(false); setUpgradeResult(null); }, 3000);
            } else {
                setUpgradeResult({ type: 'error', message: data.error || 'Upgrade failed' });
            }
        } catch (err) {
            setUpgradeResult({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setUpgrading(false);
        }
    };

    // Fetch payment info, withdraw history, and USD earned
    useEffect(() => {
        if (!userData?.id) return;
        async function fetchPaymentAndWithdraw() {
            try {
                const [piRes, whRes] = await Promise.all([
                    fetch(`/api/user/payment-info?userId=${userData.id}`),
                    fetch(`/api/rewards/withdraw?userId=${userData.id}`),
                ]);
                const piData = await piRes.json();
                if (piData.success) {
                    setPaymentInfo(piData.paymentInfo);
                    setWithdrawPayoutMethod(piData.paymentInfo?.preferred_payout || 'bank');
                }
                const whData = await whRes.json();
                if (whData.success) setWithdrawHistory(whData.requests || []);
            } catch (err) {
                console.error('Error fetching payment/withdraw data:', err);
            }
        }
        async function fetchUsdEarned() {
            if (!userData?.id) return;
            try {
                const res = await fetch(`/api/rewards/user?userId=${userData.id}`);
                const data = await res.json();
                if (data.success) setUsdEarned(data.data?.usdEarned || 0);
            } catch (err) {
                console.error('Error fetching USD earned:', err);
            }
        }
        fetchPaymentAndWithdraw();
        fetchUsdEarned();
    }, [userData]);

    // Fetch DAGChain status
    useEffect(() => {
        async function fetchDagchainStatus() {
            if (!userData?.email && !address) return;
            setDagchainLoading(true);
            try {
                const param = userData?.email
                    ? `email=${encodeURIComponent(userData.email)}`
                    : `userId=${userData?.id || ''}`;
                const res = await fetch(`/api/dagchain/status?${param}`);
                const data = await res.json();
                if (data.success && data.linked) {
                    setDagchainData(data.dagchain);
                }
            } catch (err) {
                console.error('DAGChain status fetch error:', err);
            } finally {
                setDagchainLoading(false);
            }
        }
        fetchDagchainStatus();
    }, [userData]);

    const handleCopyDagchainCode = async () => {
        const code = dagchainData?.referralCode;
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setDagchainCopied(true);
            setTimeout(() => setDagchainCopied(false), 2000);
        } catch { }
    };

    // Fetch events for calendar (admin events + joined user events)
    useEffect(() => {
        async function fetchEvents() {
            try {
                const year = calendarMonth.getFullYear();
                const month = calendarMonth.getMonth() + 1;
                const [adminRes, userRes] = await Promise.all([
                    fetch(`/api/events?year=${year}&month=${month}`),
                    userData?.id
                        ? fetch(`/api/user-events?userId=${userData.id}&joined=true&filter=all`)
                        : Promise.resolve(null),
                ]);
                const adminData = await adminRes.json();
                const adminEvents = (adminData.events || []).map(e => ({ ...e, _source: 'admin' }));

                let userEvents = [];
                if (userRes) {
                    const userdata = await userRes.json();
                    userEvents = (userdata.events || []).map(e => ({
                        id: e.id,
                        title: e.title,
                        event_date: e.event_date,
                        event_time: e.event_time,
                        end_time: e.end_time,
                        event_type: e.event_type,
                        description: e.description,
                        location: e.location,
                        is_online: e.is_online,
                        meeting_link: e.meeting_link,
                        _source: 'user',
                        _color: '#0ea5e9',
                    }));
                }

                setEvents([...adminEvents, ...userEvents]);
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        }
        fetchEvents();
    }, [calendarMonth, userData]);

    // Redeem DAG Points handler
    const REDEEM_CONFIG = {
        dgcc: { ratio: 2500, label: 'DGCC Coins', unit: 'Coin', color: '#f59e0b', light: '#fffbeb' },
    };
    const handleDashboardRedeem = async () => {
        if (!userData?.email) return;
        const cfg = REDEEM_CONFIG[redeemType] || REDEEM_CONFIG.dgcc;
        const pointsCost = redeemAmount * cfg.ratio;
        if (pointsCost > dagPoints) return;
        setRedeeming(true);
        setRedeemMsg(null);
        try {
            const res = await fetch('/api/rewards/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_email: userData.email, redemption_type: 'dgcc', amount: redeemAmount }),
            });
            const data = await res.json();
            if (data.success) {
                setRedeemMsg({ type: 'success', text: data.message });
                setDagPoints(data.availablePoints);
                setDgccBalance(data.dgcc_balance ?? (dgccBalance + redeemAmount));
                setTimeout(() => { setRedeemMsg(null); setRedeemAmount(1); }, 3000);
            } else {
                setRedeemMsg({ type: 'error', text: data.error || 'Redemption failed' });
            }
        } catch (err) {
            setRedeemMsg({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setRedeeming(false);
        }
    };

    // DGCC Transfer handler
    const handleDgccTransfer = async () => {
        if (!userData?.email || !transferDest) return;
        const amt = Number(transferAmount);
        if (!Number.isInteger(amt) || amt <= 0 || amt > dgccBalance) return;
        setTransferring(true);
        setTransferMsg(null);
        try {
            const res = await fetch('/api/rewards/dgcc/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_email: userData.email, destination: transferDest, amount: amt }),
            });
            const data = await res.json();
            if (data.success) {
                setTransferMsg({ type: 'success', text: data.message });
                setDgccBalance(data.new_dgcc_balance);
                setTimeout(() => { setShowTransferModal(false); setTransferMsg(null); setTransferAmount(1); setTransferDest(null); }, 3000);
            } else {
                setTransferMsg({ type: 'error', text: data.error || 'Transfer failed' });
            }
        } catch (err) {
            setTransferMsg({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setTransferring(false);
        }
    };

    // Withdraw handler
    const handleDashboardWithdraw = async () => {
        if (!userData?.id) return;
        setWithdrawing(true);
        setWithdrawMsg(null);
        try {
            const res = await fetch('/api/rewards/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userData.id, rewardMonth: withdrawMonth, amountUsd: usdEarned, payoutMethod: withdrawPayoutMethod }),
            });
            const data = await res.json();
            if (data.success) {
                setWithdrawMsg({ type: 'success', text: data.message });
                const whRes = await fetch(`/api/rewards/withdraw?userId=${userData.id}`);
                const whData = await whRes.json();
                if (whData.success) setWithdrawHistory(whData.requests || []);
                setTimeout(() => setWithdrawMsg(null), 4000);
            } else {
                setWithdrawMsg({ type: 'error', text: data.error || 'Withdrawal failed' });
            }
        } catch (err) {
            setWithdrawMsg({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setWithdrawing(false);
        }
    };

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

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleStripeUpgrade = async (test = false) => {
        if (!userData?.id || !userData?.email) return;
        setStripeLoading(test ? 'test' : 'full');
        try {
            const res = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userData.id, userEmail: userData.email, test }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Could not start checkout. Please try again.');
            }
        } catch (err) {
            console.error('Stripe checkout error:', err);
            alert('Network error. Please try again.');
        } finally {
            setStripeLoading(false);
        }
    };

    const prevMonth = () => { setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)); setCalendarWeekOffset(0); };
    const nextMonth = () => { setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)); setCalendarWeekOffset(0); };

    const tierLabel = (userTier === 'DAG_LIEUTENANT' || userTier === 'DAG LIEUTENANT') ? 'DAG LIEUTENANT' : 'DAG SOLDIER';

    const RANKS = [
        { name: 'INITIATOR', cost: 700, color: '#6b7280' },
        { name: 'VANGUARD', cost: 1500, color: '#10b981' },
        { name: 'GUARDIAN', cost: 3200, color: '#3b82f6' },
        { name: 'STRIKER', cost: 7000, color: '#8b5cf6' },
        { name: 'INVOKER', cost: 10000, color: '#ec4899' },
        { name: 'COMMANDER', cost: 15000, color: '#f59e0b' },
        { name: 'CHAMPION', cost: 20000, color: '#ef4444' },
        { name: 'CONQUEROR', cost: 30000, color: '#dc2626' },
        { name: 'PARAGON', cost: 40000, color: '#7c3aed' },
        { name: 'MYTHIC', cost: 50000, color: '#fbbf24' },
    ];
    const isLieutenant = userTier === 'DAG_LIEUTENANT' || userTier === 'DAG LIEUTENANT';
    const currentRankIdx = currentRank === 'None' ? -1 : RANKS.findIndex(r => r.name === currentRank);
    const nextRankIdx = currentRankIdx + 1;
    const nextRankData = nextRankIdx < RANKS.length ? RANKS[nextRankIdx] : null;
    const currentRankData = currentRankIdx >= 0 ? RANKS[currentRankIdx] : null;
    const rankProgress = nextRankData
        ? (currentRankData
            ? Math.min(100, Math.max(0, ((dagPoints - currentRankData.cost) / (nextRankData.cost - currentRankData.cost)) * 100))
            : Math.min(100, Math.max(0, (dagPoints / nextRankData.cost) * 100)))
        : 100;

    /* ─── Neumorphic tokens ─── */
    const nm = {
        bg: '#f0f2f5',
        shadow: '8px 8px 20px rgba(0,0,0,0.16), -6px -6px 16px rgba(255,255,255,0.95)',
        shadowSm: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)',
        shadowInset: 'inset 5px 5px 12px rgba(0,0,0,0.13), inset -4px -4px 10px rgba(255,255,255,0.9)',
        shadowInsetAccent: 'inset 5px 5px 12px rgba(99,102,241,0.22), inset -4px -4px 10px rgba(255,255,255,0.9)',
    };

    /* ─── NmCard ─── */
    const NmCard = useCallback(({ children, span = '1', rowSpan = '1', style = {}, hover = true, inset = false, ...props }) => (
        <div
            style={{
                gridColumn: `span ${span}`, gridRow: `span ${rowSpan}`,
                background: nm.bg, borderRadius: '20px', padding: '24px',
                boxShadow: inset ? nm.shadowInset : nm.shadowSm,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative', overflow: 'hidden',
                opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                ...style
            }}
            onMouseEnter={hover && !inset ? (e) => {
                e.currentTarget.style.boxShadow = nm.shadow;
                e.currentTarget.style.transform = 'translateY(-2px)';
            } : undefined}
            onMouseLeave={hover && !inset ? (e) => {
                e.currentTarget.style.boxShadow = nm.shadowSm;
                e.currentTarget.style.transform = 'translateY(0)';
            } : undefined}
            {...props}
        >{children}</div>
    ), [mounted]);

    const calendarDays = getCalendarDays();
    const upcomingEvents = events
        .filter(e => new Date(e.event_date) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    const EVENT_COLORS = {
        workshop: '#6366f1', quiz: '#10b981', project: '#f59e0b',
        meeting: '#ec4899', deadline: '#ef4444', default: '#8b5cf6'
    };
    const getEventColor = (event) => {
        if (event._color) return event._color;
        return EVENT_COLORS[event.event_type] || EVENT_COLORS.default;
    };

    return (
        <div style={{ padding: 'clamp(16px, 3vw, 32px) clamp(16px, 3vw, 36px)', width: '100%', background: '#f0f2f5', minHeight: '100vh' }}>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* ─── Rank Burn Confirmation Modal ─── */}
            {showRankBurnModal && (() => {
                const canUpgrade = rankProgress >= 100;
                const nextName = nextRankData?.name || '';
                const burnCost = nextRankData?.cost || 0;
                return (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget && !upgrading) { setShowRankBurnModal(false); setUpgradeResult(null); } }}>
                        <div style={{ width: '420px', background: '#f0f2f5', borderRadius: '24px', padding: '36px 32px', boxShadow: '20px 20px 60px rgba(0,0,0,0.25), -8px -8px 24px rgba(255,255,255,0.7)', position: 'relative' }}>

                            {/* Close */}
                            {!upgrading && !upgradeResult && (
                                <button onClick={() => { setShowRankBurnModal(false); setUpgradeResult(null); }}
                                    style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#64748b' }}>✕</button>
                            )}

                            {upgradeResult?.type === 'success' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎉</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>Rank Achieved!</div>
                                    <div style={{ fontSize: '14px', color: '#6366f1', fontWeight: '700', marginBottom: '4px' }}>{upgradeResult.newRank}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>{upgradeResult.pointsBurned.toLocaleString()} pts burned · {upgradeResult.availablePoints.toLocaleString()} pts remaining</div>
                                </div>
                            ) : upgradeResult?.type === 'error' ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626', marginBottom: '8px' }}>Upgrade Failed</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>{upgradeResult.message}</div>
                                    <button onClick={() => { setShowRankBurnModal(false); setUpgradeResult(null); }}
                                        style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: '700', color: '#64748b' }}>Close</button>
                                </div>
                            ) : (
                                <>
                                    {/* Badge */}
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                        {(() => {
                                            const badgeMap = { initiator: '/images/badges/dag-initiator.svg', vanguard: '/images/badges/dag-vanguard.svg', guardian: '/images/badges/dag-guardian.svg', striker: '/images/badges/dag-striker.svg', invoker: '/images/badges/dag-invoker.svg', commander: '/images/badges/dag-commander.svg', champion: '/images/badges/dag-champion.svg', conqueror: '/images/badges/dag-conqueror.svg', paragon: '/images/badges/dag-paragon.svg', mythic: '/images/badges/dag-mythic.svg' };
                                            const src = badgeMap[nextName.toLowerCase()];
                                            return src ? <img src={src} alt={nextName} style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 6px 16px rgba(99,102,241,0.3))' }} /> : null;
                                        })()}
                                    </div>
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Next Rank</div>
                                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>{nextName}</div>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', background: canUpgrade ? 'rgba(99,102,241,0.1)' : 'rgba(239,68,68,0.08)' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill={canUpgrade ? '#6366f1' : '#ef4444'} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: canUpgrade ? '#6366f1' : '#ef4444' }}>{burnCost.toLocaleString()} DAG Points will be burned</span>
                                        </div>
                                    </div>
                                    {!canUpgrade && (
                                        <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>Insufficient points — you need {(burnCost - dagPoints).toLocaleString()} more DAG Points</div>
                                        </div>
                                    )}
                                    <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px' }}>
                                        <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', textAlign: 'center' }}>⚠️ This action is permanent and cannot be undone</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => { setShowRankBurnModal(false); setUpgradeResult(null); }}
                                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#e2e8f0', cursor: 'pointer', fontWeight: '700', color: '#64748b', fontSize: '14px', boxShadow: '3px 3px 8px rgba(0,0,0,0.1), -2px -2px 6px rgba(255,255,255,0.8)' }}>Cancel</button>
                                        <button onClick={handleRankUpgrade} disabled={!canUpgrade || upgrading}
                                            style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: canUpgrade ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#cbd5e1', cursor: canUpgrade ? 'pointer' : 'not-allowed', fontWeight: '800', color: '#fff', fontSize: '14px', boxShadow: canUpgrade ? '4px 4px 12px rgba(99,102,241,0.4), -2px -2px 6px rgba(255,255,255,0.7)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            {upgrading ? (<><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />Burning...</>) : `Burn & Upgrade`}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* ─── DGCC Transfer Modal ─── */}
            {showTransferModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget && !transferring) { setShowTransferModal(false); setTransferMsg(null); setTransferDest(null); } }}>
                    <div style={{ width: '460px', background: '#f0f2f5', borderRadius: '24px', padding: '36px 32px', boxShadow: '20px 20px 60px rgba(0,0,0,0.25), -8px -8px 24px rgba(255,255,255,0.7)', position: 'relative' }}>
                        {!transferring && !transferMsg && (
                            <button onClick={() => { setShowTransferModal(false); setTransferMsg(null); setTransferDest(null); }}
                                style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#64748b' }}>✕</button>
                        )}

                        {transferMsg?.type === 'success' ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎉</div>
                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>Transfer Successful!</div>
                                <div style={{ fontSize: '14px', color: '#10b981', fontWeight: '700', marginBottom: '4px' }}>{transferMsg.text}</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>New balance: <strong>{dgccBalance} DGCC</strong></div>
                            </div>
                        ) : transferMsg?.type === 'error' ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626', marginBottom: '8px' }}>Transfer Failed</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>{transferMsg.text}</div>
                                <button onClick={() => setTransferMsg(null)} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: '700', color: '#64748b' }}>Try Again</button>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/>
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.4px' }}>Transfer DGCC Coins</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Available: <strong style={{ color: '#92400e' }}>{dgccBalance} DGCC</strong></div>
                                </div>

                                {/* Destination Picker */}
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Choose Destination</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {[
                                            { key: 'daggpt', label: 'DAGGPT', icon: '🤖', desc: 'Use for AI generation', accent: '#6366f1' },
                                            { key: 'dagchain', label: 'DAGChain', icon: '⛓️', desc: 'DAGChain blockchain', accent: '#10b981' },
                                        ].map(opt => (
                                            <button key={opt.key} onClick={() => setTransferDest(opt.key)}
                                                style={{ padding: '16px 12px', borderRadius: '14px', border: `2px solid ${transferDest === opt.key ? opt.accent : '#e2e8f0'}`, background: transferDest === opt.key ? `${opt.accent}10` : '#f0f2f5', cursor: 'pointer', textAlign: 'left', boxShadow: transferDest === opt.key ? `0 0 0 4px ${opt.accent}15` : 'none', transition: 'all 0.2s' }}>
                                                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{opt.icon}</div>
                                                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{opt.label}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{opt.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Amount */}
                                {transferDest && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Amount (DGCC Coins)</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <input type="number" min="1" max={dgccBalance} value={transferAmount}
                                                onChange={e => setTransferAmount(Math.max(1, Math.min(dgccBalance, parseInt(e.target.value) || 1)))}
                                                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '18px', fontWeight: '800', color: '#0f172a', textAlign: 'center', outline: 'none', background: '#fff', boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.05)' }}
                                            />
                                            <button onClick={() => setTransferAmount(dgccBalance)}
                                                style={{ padding: '12px 16px', borderRadius: '12px', border: 'none', background: '#f0f2f5', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#64748b', boxShadow: '4px 4px 10px rgba(0,0,0,0.1)' }}>MAX</button>
                                        </div>
                                        {transferAmount > dgccBalance && (
                                            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', marginTop: '6px' }}>Exceeds balance ({dgccBalance} DGCC)</div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => { setShowTransferModal(false); setTransferMsg(null); setTransferDest(null); }}
                                        style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#e2e8f0', cursor: 'pointer', fontWeight: '700', color: '#64748b', fontSize: '14px' }}>Cancel</button>
                                    <button onClick={handleDgccTransfer}
                                        disabled={!transferDest || !transferAmount || Number(transferAmount) > dgccBalance || transferring}
                                        style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: (!transferDest || transferring) ? '#cbd5e1' : 'linear-gradient(135deg,#f59e0b,#d97706)', cursor: (!transferDest || transferring) ? 'not-allowed' : 'pointer', fontWeight: '800', color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: transferDest ? '4px 4px 12px rgba(245,158,11,0.4)' : 'none' }}>
                                        {transferring ? (<><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />Transferring...</>) : `Transfer ${transferAmount} DGCC`}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ─── Header ─── */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>
                            {greeting}, <span style={{ color: '#6366f1' }}>{userName}</span>
                        </h1>
                    </div>
                    <p style={{ fontSize: '14px', color: '#0f172a', margin: 0, fontWeight: '450' }}>
                        {currentTime ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '\u00A0'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!isLieutenant && (
                        <>
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                disabled={!!stripeLoading}
                                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#f0f2f5', color: '#4f46e5', fontSize: '13px', fontWeight: '700', cursor: stripeLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', boxShadow: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)', transition: 'all 0.2s ease' }}
                                onMouseEnter={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.16), -6px -6px 16px rgba(255,255,255,0.95)'; } }}
                                onMouseLeave={e => { if (!stripeLoading) { e.currentTarget.style.boxShadow = '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)'; } }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 4l3 12h14l3-12" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 4v8m-4-4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                {stripeLoading === 'full' ? 'Redirecting...' : 'Upgrade to Lieutenant'}
                                <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '5px', background: '#eef2ff', color: '#6366f1' }}>$149</span>
                            </button>
                        </>
                    )}
                    <div style={{
                        padding: '10px 18px', background: '#f0f2f5', borderRadius: '14px',
                        boxShadow: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.15)' }} />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                            {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '\u00A0'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── Bento Grid ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'minmax(0, auto)', gap: '18px' }}>

                {/* ━━━ ROW 1: 6 equal cards (span 2 each) ━━━ */}

                {/* Card 1: Welcome / Profile */}
                <NmCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', gap: '12px' }} hover={false}>
                    <div style={{
                        width: '96px', height: '96px', borderRadius: '50%',
                        background: '#f0f2f5',
                        boxShadow: '5px 5px 12px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                    }}>
                        {userAvatar ? (
                            <img src={userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                    <span style={{ padding: '4px 14px', borderRadius: '100px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', color: '#6366f1', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {userName}
                    </span>
                </NmCard>

                {/* Card 2: Tier Badge */}
                <NmCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', gap: '12px' }}>
                    <img
                        src={isLieutenant ? '/images/badges/dag-lieutenant.svg' : '/images/badges/dag-soldier.svg'}
                        alt={tierLabel}
                        style={{ width: '96px', height: '96px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}
                    />
                    <span style={{ padding: '4px 14px', borderRadius: '100px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', color: '#6366f1', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {tierLabel}
                    </span>
                </NmCard>

                {/* Card 3: Commission Rate */}
                <NmCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1 / 1', gap: '8px', padding: '20px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.2), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-2px', lineHeight: 1 }}>
                        {isLieutenant ? '20' : '15'}<span style={{ fontSize: '18px' }}>%</span>
                    </div>
                    <span style={{ padding: '4px 14px', borderRadius: '100px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', color: '#6366f1', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        L1 Commission
                    </span>
                </NmCard>

                {/* Card 4: DAG Points */}
                <NmCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', aspectRatio: '1 / 1', padding: '20px 20px 28px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.2), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#6366f1" stroke="none">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                            {dagPoints.toLocaleString()}
                        </div>
                    </div>
                    <span style={{ padding: '4px 14px', borderRadius: '100px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', color: '#6366f1', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        DAG Points
                    </span>
                </NmCard>

                {/* Card 5: DGCC Coins */}
                <NmCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', aspectRatio: '1 / 1', padding: '20px 20px 28px', cursor: 'pointer' }}
                  onClick={() => { setShowTransferModal(true); setTransferDest(null); setTransferAmount(1); setTransferMsg(null); }}
                >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(245,158,11,0.2), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="8" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="10" x2="16" y2="10" />
                                <line x1="8" y1="14" x2="16" y2="14" />
                            </svg>
                        </div>
                        {dgccBalance > 0 && (
                            <span style={{ fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '100px', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tap to Transfer</span>
                        )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: dgccBalance > 0 ? '#92400e' : '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                            {dgccBalance > 0 ? dgccBalance.toLocaleString() : '00'}
                        </div>
                    </div>
                    <span style={{ padding: '4px 14px', borderRadius: '100px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(245,158,11,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', color: '#f59e0b', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        DGCC Coins
                    </span>
                </NmCard>

                {/* Card 6: Referrals */}
                <NmCard span="2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', aspectRatio: '1 / 1', padding: '20px 20px 28px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.2), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                            {referralStats.total_referrals === 0 ? '00' : referralStats.total_referrals}
                        </div>
                    </div>
                    <span style={{ padding: '4px 14px', borderRadius: '100px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', color: '#6366f1', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Referrals
                    </span>
                </NmCard>

                {/* ━━━ ROW 1.5: Tier Benefits Strip ━━━ */}
                <NmCard span="12" hover={false} inset={true} style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'stretch', gap: '20px' }}>

                        {/* Left: Tier identity */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', flexShrink: 0, minWidth: '130px', padding: '10px 20px', background: '#f0f2f5', borderRadius: '16px', boxShadow: '4px 4px 10px rgba(0,0,0,0.11), -3px -3px 8px rgba(255,255,255,0.88)' }}>
                            <img
                                src={isLieutenant ? '/images/badges/dag-lieutenant.svg' : '/images/badges/dag-soldier.svg'}
                                alt={tierLabel}
                                style={{ width: '56px', height: '56px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.14))' }}
                            />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '9px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '3px' }}>Active Tier</div>
                                <div style={{ fontSize: '13px', fontWeight: '900', color: '#4f46e5', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>{tierLabel}</div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ width: '1px', background: 'rgba(0,0,0,0.07)', flexShrink: 0, alignSelf: 'stretch' }} />

                        {/* Rate cards grid */}
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                            {[
                                { label: 'L1 Commission', value: `${isLieutenant ? 20 : 15}%`, sub: 'on direct sales', color: '#4f46e5' },
                                { label: 'L2 Commission', value: '3%', sub: 'on 2nd downline', color: '#10b981' },
                                { label: 'L3 Commission', value: '2%', sub: 'on 3rd downline', color: '#f59e0b' },
                                { label: 'Spend Earn Rate', value: `${isLieutenant ? 50 : 25}`, sub: 'pts per $1 spent', color: '#8b5cf6' },
                                { label: 'Task Multiplier', value: isLieutenant ? '2×' : '1×', sub: isLieutenant ? 'LT bonus active' : 'base rate', color: '#06b6d4' },
                            ].map(r => (
                                <div key={r.label} style={{ textAlign: 'center', padding: '14px 12px', background: '#f0f2f5', borderRadius: '14px', boxShadow: '4px 4px 10px rgba(0,0,0,0.11), -3px -3px 8px rgba(255,255,255,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.label}</div>
                                    <div style={{ fontSize: '26px', fontWeight: '900', color: r.color, letterSpacing: '-1px', lineHeight: 1 }}>{r.value}</div>
                                    <div style={{ fontSize: '10px', fontWeight: '500', color: '#94a3b8' }}>{r.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{ width: '1px', background: 'rgba(0,0,0,0.07)', flexShrink: 0, alignSelf: 'stretch' }} />

                        {/* Right: Pool status + optional upgrade button */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', flexShrink: 0, minWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f0f2f5', borderRadius: '12px', boxShadow: '4px 4px 10px rgba(0,0,0,0.09), -3px -3px 8px rgba(255,255,255,0.88)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16,185,129,0.15)', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>Fortune 500 Pool</div>
                                    <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', marginTop: '1px' }}>Enrolled ✓</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f0f2f5', borderRadius: '12px', boxShadow: '4px 4px 10px rgba(0,0,0,0.09), -3px -3px 8px rgba(255,255,255,0.88)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLieutenant ? '#7c3aed' : '#cbd5e1', boxShadow: isLieutenant ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>Elite Pool</div>
                                    <div style={{ fontSize: '10px', color: isLieutenant ? '#7c3aed' : '#94a3b8', fontWeight: '700', marginTop: '1px' }}>{isLieutenant ? 'Eligible · MainNet' : 'LT Only'}</div>
                                </div>
                            </div>
                            {!isLieutenant && (
                                <button onClick={() => setShowUpgradeModal(true)} style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', background: 'linear-gradient(145deg, #7c7ff5, #5a5de8)', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '4px 4px 10px rgba(99,102,241,0.4), -2px -2px 6px rgba(255,255,255,0.7)', textAlign: 'center' }}>
                                    Upgrade to LT — $149
                                </button>
                            )}
                        </div>

                    </div>
                </NmCard>



                {/* ━━━ ROW 2: Calendar — full width ━━━ */}
                <NmCard span="12" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Schedule Calendar</h3>
                            <p style={{ fontSize: '12px', color: '#0f172a', margin: '4px 0 0 0', fontWeight: '500' }}>Your upcoming events and deadlines</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={prevMonth} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#f0f2f5', boxShadow: '5px 5px 12px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                            </button>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', minWidth: '140px', textAlign: 'center' }}>
                                {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                            </span>
                            <button onClick={nextMonth} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#f0f2f5', boxShadow: '5px 5px 12px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Calendar Header — 7 day labels */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', paddingBottom: '10px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid — all weeks, fixed cell height */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {calendarDays.map((date, idx) => (
                            <div key={idx} style={{
                                height: '72px', display: 'flex', flexDirection: 'column', padding: '6px', overflow: 'visible', position: 'relative',
                                borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: date.inactive ? 'default' : 'pointer',
                                background: date.today ? '#f0f2f5' : date.inactive ? '#e8eaed' : '#f0f2f5',
                                boxShadow: date.today ? 'inset 5px 5px 12px rgba(99,102,241,0.25), inset -3px -3px 8px rgba(255,255,255,0.9)' : date.inactive ? 'none' : '5px 5px 12px rgba(0,0,0,0.11), -4px -4px 10px rgba(255,255,255,0.9)',
                                color: date.inactive ? '#cbd5e1' : '#0f172a',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={(e) => { if (!date.inactive && !date.today) e.currentTarget.style.boxShadow = '7px 7px 16px rgba(0,0,0,0.16), -5px -5px 14px rgba(255,255,255,0.95)'; }}
                                onMouseLeave={(e) => { if (!date.inactive && !date.today) e.currentTarget.style.boxShadow = '5px 5px 12px rgba(0,0,0,0.11), -4px -4px 10px rgba(255,255,255,0.9)'; }}
                            >
                                <div style={{ marginBottom: '3px', fontWeight: date.today ? '800' : '600', color: date.today ? '#6366f1' : undefined }}>{date.day}</div>
                                {date.events && date.events.length > 0 && (
                                    <div onClick={(e) => { e.stopPropagation(); setSelectedEvent(date.events[0]); }} style={{ background: getEventColor(date.events[0]), color: '#fff', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                                        {date.events[0].title}
                                    </div>
                                )}
                                {date.events && date.events.length > 1 && (() => {
                                    const isOpen = calendarPopup === idx;
                                    return (
                                        <>
                                            <div onClick={(e) => { e.stopPropagation(); setCalendarPopup(isOpen ? null : idx); }} style={{ marginTop: '3px', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '700', background: '#e0e7ff', color: '#4f46e5', cursor: 'pointer', width: 'fit-content' }}>
                                                +{date.events.length - 1} more
                                            </div>
                                            {isOpen && (
                                                <div style={{ position: 'absolute', top: '72px', left: 0, zIndex: 50, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: '180px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {date.events.map((ev, ei) => (
                                                        <div key={ei} onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); setCalendarPopup(null); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', background: '#f8fafc' }}
                                                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                                            onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                                                        >
                                                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: getEventColor(ev), flexShrink: 0 }} />
                                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Events Carousel — 4 at a time, flanking arrows */}
                    {upcomingEvents.length > 0 && (() => {
                        const PAGE = 4;
                        const maxIdx = Math.max(0, upcomingEvents.length - PAGE);
                        const visible = upcomingEvents.slice(eventCarouselIdx, eventCarouselIdx + PAGE);
                        return (
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Upcoming Events</span>
                                    <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: '600' }}>{eventCarouselIdx + 1}–{Math.min(eventCarouselIdx + PAGE, upcomingEvents.length)} of {upcomingEvents.length}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {/* Left arrow */}
                                    <button disabled={eventCarouselIdx === 0} onClick={() => setEventCarouselIdx(i => Math.max(0, i - PAGE))} style={{ width: '30px', height: '30px', flexShrink: 0, borderRadius: '8px', border: 'none', background: '#f0f2f5', boxShadow: eventCarouselIdx === 0 ? 'none' : '4px 4px 10px rgba(0,0,0,0.1), -3px -3px 8px rgba(255,255,255,0.9)', cursor: eventCarouselIdx === 0 ? 'default' : 'pointer', opacity: eventCarouselIdx === 0 ? 0.35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>
                                    {/* Event cards */}
                                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${Math.min(visible.length, PAGE)}, 1fr)`, gap: '8px' }}>
                                        {visible.map((event, i) => (
                                            <div key={i} onClick={() => setSelectedEvent(event)} style={{
                                                display: 'flex', flexDirection: 'column', gap: '6px',
                                                padding: '10px 12px', borderRadius: '12px',
                                                background: '#f0f2f5',
                                                boxShadow: '5px 5px 12px rgba(0,0,0,0.11), -4px -4px 10px rgba(255,255,255,0.9)',
                                                borderTop: `3px solid ${EVENT_COLORS[event.event_type] || EVENT_COLORS.default}`,
                                                cursor: 'pointer', transition: 'all 0.2s ease'
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '7px 7px 16px rgba(0,0,0,0.16), -5px -5px 14px rgba(255,255,255,0.95)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '5px 5px 12px rgba(0,0,0,0.11), -4px -4px 10px rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: `${EVENT_COLORS[event.event_type] || EVENT_COLORS.default}22`, flexShrink: 0 }}>
                                                    <span style={{ fontSize: '13px', fontWeight: '800', color: EVENT_COLORS[event.event_type] || EVENT_COLORS.default }}>{new Date(event.event_date).getDate()}</span>
                                                </div>
                                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                                                <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>
                                                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    {event.event_time && ` · ${event.event_time.slice(0, 5)}`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Right arrow */}
                                    <button disabled={eventCarouselIdx >= maxIdx} onClick={() => setEventCarouselIdx(i => Math.min(maxIdx, i + PAGE))} style={{ width: '30px', height: '30px', flexShrink: 0, borderRadius: '8px', border: 'none', background: '#f0f2f5', boxShadow: eventCarouselIdx >= maxIdx ? 'none' : '4px 4px 10px rgba(0,0,0,0.1), -3px -3px 8px rgba(255,255,255,0.9)', cursor: eventCarouselIdx >= maxIdx ? 'default' : 'pointer', opacity: eventCarouselIdx >= maxIdx ? 0.35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </NmCard>

                {/* ━━━ ROW 3: Referral + Redeem + Withdraw — 3 equal columns ━━━ */}
                <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', alignItems: 'stretch' }}>

                    {/* Referral Card */}
                    <NmCard span="1" style={{ padding: '24px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Referral</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{referralStats.total_referrals}</div>
                                    <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>Referred</div>
                                </div>
                                <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#6366f1' }}>{referralStats.total_points_earned}</div>
                                    <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>Points</div>
                                </div>
                            </div>
                        </div>

                        {/* Referral Code */}
                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Referral Code</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f0f2f5', borderRadius: '10px', boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.1), inset -3px -3px 8px rgba(255,255,255,0.9)' }}>
                                <span style={{ flex: 1, fontSize: '14px', fontWeight: '800', color: '#0f172a', letterSpacing: '2px', fontVariantNumeric: 'tabular-nums' }}>{referralCode}</span>
                                <button onClick={handleCopyCode} style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', fontSize: '11px', fontWeight: '700', background: copySuccess ? '#dcfce7' : '#6366f1', color: copySuccess ? '#10b981' : '#fff', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
                                    {copySuccess ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Referral Link */}
                        <div style={{ marginBottom: '18px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Referral Link</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f0f2f5', borderRadius: '10px', boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.1), inset -3px -3px 8px rgba(255,255,255,0.9)' }}>
                                <span style={{ flex: 1, fontSize: '11px', fontWeight: '600', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {`${pageOrigin}/register?ref=${referralCode}`}
                                </span>
                                <button onClick={async () => {
                                    const link = `${window.location.origin}/register?ref=${referralCode}`;
                                    try { await navigator.clipboard.writeText(link); setCopyLinkSuccess(true); setTimeout(() => setCopyLinkSuccess(false), 2000); } catch (e) { }
                                }} style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', fontSize: '11px', fontWeight: '700', background: copyLinkSuccess ? '#dcfce7' : '#f0f2f5', color: copyLinkSuccess ? '#10b981' : '#0f172a', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, boxShadow: copyLinkSuccess ? 'none' : '3px 3px 8px rgba(0,0,0,0.1), -2px -2px 6px rgba(255,255,255,0.9)' }}>
                                    {copyLinkSuccess ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Share via */}
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>Share via</div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                {[
                                    {
                                        name: 'WhatsApp',
                                        color: '#25D366',
                                        href: () => `https://wa.me/?text=${encodeURIComponent(`Join DAGArmy using my referral link and start earning! ${typeof window !== 'undefined' ? window.location.origin : 'https://dagarmy.network'}/register?ref=${referralCode}`)}`,
                                        icon: (
                                            <svg viewBox="0 0 32 32" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.75-1.813A11.94 11.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#25D366" />
                                                <path d="M21.5 18.5c-.3-.15-1.75-.863-2.02-.963-.27-.1-.467-.15-.663.15-.2.3-.763.963-.937 1.163-.17.2-.343.225-.637.075-.3-.15-1.262-.463-2.4-1.475-.888-.788-1.487-1.762-1.663-2.062-.175-.3-.018-.463.13-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.663-1.6-.913-2.188-.24-.575-.484-.496-.663-.505l-.563-.01c-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.9 1.225 3.1c.15.2 2.113 3.225 5.125 4.525.716.309 1.274.494 1.71.631.718.228 1.372.196 1.888.119.576-.086 1.75-.714 2-1.4.25-.688.25-1.275.175-1.4-.075-.125-.275-.2-.575-.35z" fill="#fff" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'X',
                                        color: '#000000',
                                        href: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join DAGArmy using my referral link and start earning! ${typeof window !== 'undefined' ? window.location.origin : 'https://dagarmy.network'}/register?ref=${referralCode}`)}`,
                                        icon: (
                                            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'Instagram',
                                        color: '#E1306C',
                                        href: () => { if (typeof window !== 'undefined') navigator.clipboard.writeText(`Join DAGArmy using my referral link and start earning! ${window.location.origin}/register?ref=${referralCode}`); return 'https://www.instagram.com/'; },
                                        icon: (
                                            <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <radialGradient id="igGrad1" cx="30%" cy="107%" r="150%">
                                                        <stop offset="0%" stopColor="#fdf497" />
                                                        <stop offset="5%" stopColor="#fdf497" />
                                                        <stop offset="45%" stopColor="#fd5949" />
                                                        <stop offset="60%" stopColor="#d6249f" />
                                                        <stop offset="90%" stopColor="#285AEB" />
                                                    </radialGradient>
                                                </defs>
                                                <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#igGrad1)" />
                                                <circle cx="16" cy="16" r="6" fill="none" stroke="#fff" strokeWidth="2.2" />
                                                <circle cx="22.5" cy="9.5" r="1.5" fill="#fff" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'Facebook',
                                        color: '#1877F2',
                                        href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://dagarmy.network'}/register?ref=${referralCode}`)}`,
                                        icon: (
                                            <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="32" height="32" rx="8" fill="#1877F2" />
                                                <path d="M21 16h-3v-2c0-.828.172-1 1-1h2V9h-3c-3 0-4 2-4 4v3h-2v4h2v9h4v-9h3l1-4z" fill="#fff" />
                                            </svg>
                                        )
                                    },
                                    {
                                        name: 'Telegram',
                                        color: '#2AABEE',
                                        href: () => `https://t.me/share/url?url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://dagarmy.network'}/register?ref=${referralCode}`)}&text=${encodeURIComponent('Join DAGArmy using my referral link and start earning!')}`,
                                        icon: (
                                            <svg viewBox="0 0 32 32" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="32" height="32" rx="16" fill="#2AABEE" />
                                                <path d="M7 15.5l4.5 1.7 1.75 5.5 2.25-2.95 4.75 3.5 3.25-14-16 6.25z" fill="#fff" />
                                                <path d="M11.5 17.2l.5 5 1.75-5.25" fill="#d5e8f5" />
                                            </svg>
                                        )
                                    },
                                ].map((platform) => (
                                    <a key={platform.name} href="#" target="_blank" rel="noopener noreferrer"
                                        title={`Share on ${platform.name}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (typeof window !== 'undefined') {
                                                const url = typeof platform.href === 'function' ? platform.href() : '#';
                                                if (platform.name === 'Instagram') {
                                                    navigator.clipboard.writeText(`Join DAGArmy using my referral link and start earning! ${window.location.origin}/register?ref=${referralCode}`);
                                                    window.open('https://www.instagram.com/', '_blank');
                                                } else {
                                                    window.open(url, '_blank');
                                                }
                                            }
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '12px', background: '#f0f2f5', boxShadow: '4px 4px 10px rgba(0,0,0,0.1), -3px -3px 8px rgba(255,255,255,0.9)', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s ease', flexShrink: 0 }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 14px ${platform.color}44`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.1), -3px -3px 8px rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        {platform.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </NmCard>

                    {/* Redeem DAG Points card */}
                    <NmCard span="1" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#f0f2f5', boxShadow: '4px 4px 10px rgba(0,0,0,0.1), -3px -3px 8px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Redeem</div>
                                <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>Exchange for rewards</div>
                            </div>
                        </div>

                        {/* Available points */}
                        <div style={{ background: '#f0f2f5', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.1), inset -3px -3px 8px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a' }}>Available</span>
                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#6366f1', letterSpacing: '-0.5px' }}>{dagPoints.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a' }}>pts</span></span>
                        </div>

                        {/* DGCC Coins info */}
                        <div style={{ background: '#f0f2f5', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -3px -3px 8px rgba(255,255,255,0.9)' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>DGCC Coins</div>
                            <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>2500 pts = 1 DGCC Coin · Use in DAGGPT or DAGChain</div>
                        </div>

                        {/* Stepper */}
                        {(() => {
                            const cfg = REDEEM_CONFIG[redeemType] || REDEEM_CONFIG.dgcc;
                            const pointsCost = redeemAmount * cfg.ratio;
                            const maxAmount = Math.floor(dagPoints / cfg.ratio);
                            const canRedeem = redeemAmount > 0 && pointsCost <= dagPoints && maxAmount > 0;
                            return (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <button onClick={() => setRedeemAmount(a => Math.max(1, a - 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f0f2f5', boxShadow: '3px 3px 7px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>−</button>
                                        <div style={{ flex: 1, textAlign: 'center', padding: '6px 0', background: '#f0f2f5', borderRadius: '8px', boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.09), inset -2px -2px 5px rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{redeemAmount}</div>
                                        <button onClick={() => setRedeemAmount(a => Math.min(Math.max(1, maxAmount), a + 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f0f2f5', boxShadow: '3px 3px 7px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>+</button>
                                    </div>
                                    <div style={{ fontSize: '11px', color: canRedeem ? '#0f172a' : '#ef4444', fontWeight: '600', textAlign: 'center', marginBottom: '12px' }}>
                                        Costs <strong style={{ color: canRedeem ? '#0f172a' : '#ef4444' }}>{pointsCost.toLocaleString()} pts</strong>
                                        {!canRedeem && maxAmount === 0 && ' — insufficient points'}
                                        {!canRedeem && maxAmount > 0 && ` — need ${(pointsCost - dagPoints).toLocaleString()} more`}
                                    </div>
                                    {redeemMsg && (
                                        <div style={{ marginBottom: '10px', padding: '8px 12px', borderRadius: '8px', background: '#f0f2f5', boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)', color: redeemMsg.type === 'success' ? '#6366f1' : '#ef4444', fontSize: '11px', fontWeight: '600' }}>
                                            {redeemMsg.text}
                                        </div>
                                    )}
                                    <button onClick={handleDashboardRedeem} disabled={!canRedeem || redeeming} style={{ width: '100%', marginTop: 'auto', padding: '10px', borderRadius: '10px', border: 'none', background: canRedeem && !redeeming ? '#6366f1' : '#f0f2f5', color: canRedeem && !redeeming ? '#fff' : '#94a3b8', fontSize: '12px', fontWeight: '700', cursor: canRedeem && !redeeming ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: canRedeem && !redeeming ? '5px 5px 12px rgba(99,102,241,0.3), -3px -3px 8px rgba(255,255,255,0.9)' : 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)' }}>
                                        {redeeming ? 'Processing…' : 'Redeem DAG Points'}
                                    </button>
                                </>
                            );
                        })()}
                    </NmCard>

                    {/* Withdraw USD / USDT card */}
                    <NmCard span="1" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#f0f2f5', boxShadow: '4px 4px 10px rgba(0,0,0,0.1), -3px -3px 8px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Withdraw</div>
                                <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>USD or USDT payout</div>
                            </div>
                        </div>

                        {/* Earnings */}
                        <div style={{ background: '#f0f2f5', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.1), inset -3px -3px 8px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a' }}>Earned</span>
                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#6366f1', letterSpacing: '-0.5px' }}>${usdEarned.toFixed(2)}</span>
                        </div>

                        {/* Month picker */}
                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '5px' }}>Reward Month</div>
                            <input type="month" value={withdrawMonth} onChange={e => setWithdrawMonth(e.target.value)}
                                max={(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })()}
                                style={{ width: '100%', padding: '7px 10px', border: 'none', borderRadius: '8px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', background: '#f0f2f5', boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.09), inset -2px -2px 5px rgba(255,255,255,0.9)', color: '#0f172a' }}
                                onFocus={e => e.target.style.boxShadow = 'inset 3px 3px 7px rgba(99,102,241,0.15), inset -2px -2px 5px rgba(255,255,255,0.9)'} onBlur={e => e.target.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.09), inset -2px -2px 5px rgba(255,255,255,0.9)'}
                            />
                        </div>

                        {/* Payout method */}
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '5px' }}>Payout via</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                <button type="button" onClick={() => setWithdrawPayoutMethod('bank')} style={{ padding: '8px', borderRadius: '9px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', border: 'none', background: '#f0f2f5', boxShadow: withdrawPayoutMethod === 'bank' ? 'inset 4px 4px 9px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)' : '4px 4px 9px rgba(0,0,0,0.09), -3px -3px 7px rgba(255,255,255,0.9)' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: withdrawPayoutMethod === 'bank' ? '#6366f1' : '#0f172a', marginBottom: '2px' }}>Bank</div>
                                    {paymentInfo?.bank_account_name
                                        ? <div style={{ fontSize: '10px', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{paymentInfo.bank_name || 'Saved'}</div>
                                        : <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>Not set</div>
                                    }
                                </button>
                                <button type="button" onClick={() => setWithdrawPayoutMethod('crypto')} style={{ padding: '8px', borderRadius: '9px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', border: 'none', background: '#f0f2f5', boxShadow: withdrawPayoutMethod === 'crypto' ? 'inset 4px 4px 9px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)' : '4px 4px 9px rgba(0,0,0,0.09), -3px -3px 7px rgba(255,255,255,0.9)' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: withdrawPayoutMethod === 'crypto' ? '#6366f1' : '#0f172a', marginBottom: '2px' }}>USDT</div>
                                    {paymentInfo?.bep20_address
                                        ? <div style={{ fontSize: '10px', color: '#0f172a', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{paymentInfo.bep20_address.slice(0, 10)}…</div>
                                        : <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>Not set</div>
                                    }
                                </button>
                            </div>
                            {withdrawPayoutMethod === 'bank' && !paymentInfo?.bank_account_name && (
                                <div style={{ marginTop: '6px', fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>Add bank details in <a href="/student-setting" style={{ color: '#6366f1' }}>Settings</a></div>
                            )}
                            {withdrawPayoutMethod === 'crypto' && !paymentInfo?.bep20_address && (
                                <div style={{ marginTop: '6px', fontSize: '10px', color: '#0f172a', fontWeight: '600' }}>Add BEP20 wallet in <a href="/student-setting" style={{ color: '#6366f1' }}>Settings</a></div>
                            )}
                        </div>

                        {/* Duplicate request notice */}
                        {withdrawHistory.some(r => r.reward_month === withdrawMonth) && (
                            <div style={{ marginBottom: '10px', padding: '7px 10px', borderRadius: '8px', background: '#f0f2f5', boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)', fontSize: '10px', fontWeight: '600', color: '#6366f1' }}>
                                Request already submitted for {withdrawMonth} — Status: <strong>{withdrawHistory.find(r => r.reward_month === withdrawMonth)?.status}</strong>
                            </div>
                        )}

                        {withdrawMsg && (
                            <div style={{ marginBottom: '10px', padding: '8px 12px', borderRadius: '8px', background: '#f0f2f5', boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)', color: withdrawMsg.type === 'success' ? '#6366f1' : '#ef4444', fontSize: '11px', fontWeight: '600' }}>
                                {withdrawMsg.text}
                            </div>
                        )}

                        {(() => {
                            const noDetails = withdrawPayoutMethod === 'bank' ? !paymentInfo?.bank_account_name : !paymentInfo?.bep20_address;
                            const alreadyExists = withdrawHistory.some(r => r.reward_month === withdrawMonth);
                            const disabled = withdrawing || noDetails || alreadyExists || usdEarned < 10;
                            return (
                                <button onClick={handleDashboardWithdraw} disabled={disabled} style={{ width: '100%', marginTop: 'auto', padding: '10px', borderRadius: '10px', border: 'none', background: disabled ? '#f0f2f5' : '#6366f1', color: disabled ? '#94a3b8' : '#fff', fontSize: '12px', fontWeight: '700', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: disabled ? 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)' : '5px 5px 12px rgba(99,102,241,0.3), -3px -3px 8px rgba(255,255,255,0.9)' }}>
                                    {withdrawing ? 'Submitting…' : usdEarned < 10 ? `Min. $10 required` : 'Request Withdrawal'}
                                </button>
                            );
                        })()}
                    </NmCard>

                </div>

                {/* ━━━ DAGChain Integration Panel ━━━ */}
                {false && dagchainData && (
                    <NmCard span="12" hover={false} style={{ padding: '0', overflow: 'hidden', marginTop: '4px' }}>
                        {/* Header */}
                        <div style={{ padding: '20px 28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>DAGChain Account</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '1px' }}>Linked — synced from dagchain.network</div>
                                </div>
                            </div>
                            <a href="https://dagchain.network" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#6366f1', textDecoration: 'none', padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#f0f2f5', boxShadow: '5px 5px 12px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)' }}>
                                Open DAGChain
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                            </a>
                        </div>

                        {dagchainLoading ? (
                            <div style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94a3b8', fontSize: '13px' }}>
                                <div style={{ width: '18px', height: '18px', border: '2px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                Loading DAGChain data...
                            </div>
                        ) : (
                            <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>

                                {/* Referral Code */}
                                <div style={{ background: '#f0f2f5', borderRadius: '14px', padding: '16px', boxShadow: 'inset 5px 5px 12px rgba(0,0,0,0.13), inset -4px -4px 10px rgba(255,255,255,0.9)' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '10px' }}>Referral Code</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '2px', flex: 1 }}>
                                            {dagchainData?.referralCode || '—'}
                                        </div>
                                        {dagchainData?.referralCode && (
                                            <button onClick={handleCopyDagchainCode} style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #c7d2fe', background: dagchainCopied ? '#eef2ff' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', color: '#6366f1', transition: 'all 0.15s' }}>
                                                {dagchainCopied ? (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                ) : (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                                )}
                                                {dagchainCopied ? 'Copied' : 'Copy'}
                                            </button>
                                        )}
                                    </div>
                                    {dagchainData?.referredBy && (
                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>Referred by: <span style={{ fontWeight: '700', color: '#475569' }}>{dagchainData.referredBy}</span></div>
                                    )}
                                </div>

                                {/* Nodes */}
                                <div style={{ background: '#f0f2f5', borderRadius: '14px', padding: '16px', boxShadow: 'inset 5px 5px 12px rgba(0,0,0,0.13), inset -4px -4px 10px rgba(255,255,255,0.9)' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '10px' }}>Nodes Owned</div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                                        <div style={{ flex: 1, background: '#f0f2f5', borderRadius: '10px', padding: '10px 12px', boxShadow: '5px 5px 12px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{dagchainData?.nodes?.validatorCount || 0}</div>
                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Validator</div>
                                        </div>
                                        <div style={{ flex: 1, background: '#f0f2f5', borderRadius: '10px', padding: '10px 12px', boxShadow: '5px 5px 12px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{dagchainData?.nodes?.storageCount || 0}</div>
                                            <div style={{ fontSize: '10px', fontWeight: '700', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Storage</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total: <span style={{ fontWeight: '700', color: '#0f172a' }}>{dagchainData?.nodes?.total || 0}</span> nodes</div>
                                </div>

                                {/* Referral Journey */}
                                <div style={{ background: '#f0f2f5', borderRadius: '14px', padding: '16px', boxShadow: 'inset 5px 5px 12px rgba(0,0,0,0.13), inset -4px -4px 10px rgba(255,255,255,0.9)' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '10px' }}>Referral Journey</div>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, marginBottom: '6px' }}>
                                        {dagchainData?.referralCount || 0}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginBottom: '8px' }}>People referred on DAGChain</div>
                                    {dagchainData?.referralStats && (
                                        <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>
                                            Earnings: <span style={{ color: '#10b981' }}>${(dagchainData.referralStats.totalEarnings || 0).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* DAG Points + Rewards */}
                                <div style={{ background: '#f0f2f5', borderRadius: '14px', padding: '16px', boxShadow: 'inset 5px 5px 12px rgba(0,0,0,0.13), inset -4px -4px 10px rgba(255,255,255,0.9)' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '10px' }}>DAGChain Points</div>
                                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
                                        {(dagchainData?.points || 0).toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', marginBottom: '8px' }}>Points earned on DAGChain</div>
                                    {dagchainData?.rewards?.pending && (
                                        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700' }}>
                                            Pending rewards available
                                        </div>
                                    )}
                                    {dagchainData?.syncedAt && (
                                        <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '6px' }}>
                                            Last synced: {new Date(dagchainData.syncedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </NmCard>
                )}

            </div>

            {/* ─── Event Detail Modal ─── */}
            {selectedEvent && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }} onClick={() => setSelectedEvent(null)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: '#f0f2f5', borderRadius: '20px', padding: '0', maxWidth: '480px', width: '90%',
                        boxShadow: '14px 14px 32px rgba(0,0,0,0.18), -6px -6px 16px rgba(255,255,255,0.95)', overflow: 'hidden'
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
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '24px 28px' }}>
                            {/* Date & Time */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0f2f5', boxShadow: 'inset 5px 5px 10px rgba(0,0,0,0.13), inset -3px -3px 8px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
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
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0f2f5', boxShadow: 'inset 5px 5px 10px rgba(0,0,0,0.13), inset -3px -3px 8px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
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
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0f2f5', boxShadow: 'inset 5px 5px 10px rgba(99,102,241,0.22), inset -3px -3px 8px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                                <path d="M15 10l5-3v10l-5-3z" /><rect x="2" y="6" width="13" height="12" rx="2" ry="2" />
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
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                        Join Meeting
                                    </a>
                                </div>
                            )}

                            {/* Event type badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
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

            {/* ── Lieutenant Upgrade Perks Modal ── */}
            {showUpgradeModal && (
                <LieutenantUpgradeModal
                    onClose={() => setShowUpgradeModal(false)}
                    onConfirm={() => { setShowUpgradeModal(false); handleStripeUpgrade(false); }}
                    loading={stripeLoading === 'full'}
                />
            )}
        </div>
    );
}
