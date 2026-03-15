"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Users, Copy, Check, Crown, ChevronDown, GitBranch, TrendingUp, Clock, Award } from "lucide-react";

/* ── Neumorphic tokens ── */
const nm = {
  bg: '#f0f2f5',
  shadow:       '8px 8px 20px rgba(0,0,0,0.15), -6px -6px 16px rgba(255,255,255,0.95)',
  shadowSm:     '5px 5px 12px rgba(0,0,0,0.12), -4px -4px 10px rgba(255,255,255,0.9)',
  shadowXs:     '3px 3px 7px rgba(0,0,0,0.10), -2px -2px 6px rgba(255,255,255,0.85)',
  shadowInset:  'inset 5px 5px 12px rgba(0,0,0,0.12), inset -4px -4px 10px rgba(255,255,255,0.9)',
  shadowInsetSm:'inset 3px 3px 8px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)',
  accent:       '#4f46e5',
  accentLight:  'rgba(79,70,229,0.08)',
  textPrimary:  '#1e293b',
  textSecondary:'#64748b',
  textMuted:    '#94a3b8',
  border:       'rgba(0,0,0,0.06)',
};

export default function ReferralContent({ mounted }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [treeMeta, setTreeMeta] = useState(null);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());

  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalPointsEarned: 0,
    tier: 'DAG SOLDIER',
    usdEarned: 0,
  });

  useEffect(() => {
    const userStr = localStorage.getItem('dagarmy_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchReferralData(userData);
      fetchTreeData(userData.id);
    } else { setLoading(false); }
  }, []);

  const fetchTreeData = async (userId) => {
    try {
      setTreeLoading(true); setTreeError(null);
      const res = await fetch(`/api/referral/tree?userId=${userId}`);
      const data = await res.json();
      if (data.success) { setTreeData(data.tree); setTreeMeta(data.meta); }
      else setTreeError(data.error || 'Failed to load tree');
    } catch { setTreeError('Network error loading tree'); }
    finally { setTreeLoading(false); }
  };

  const fetchReferralData = async (userData) => {
    try {
      setLoading(true);
      const [rewardsRes, statsRes, codeRes] = await Promise.all([
        fetch(`/api/rewards/user?email=${encodeURIComponent(userData.email)}`),
        fetch(`/api/referral/stats?userId=${userData.id}`),
        fetch(`/api/referral/get-code?userId=${userData.id}`),
      ]);
      const [rewardsData, statsData, codeData] = await Promise.all([rewardsRes.json(), statsRes.json(), codeRes.json()]);
      const rewards = rewardsData.success ? rewardsData.data : {};
      const stats = statsData.success ? statsData.stats : {};
      const code = codeData.success ? codeData.code : (rewards.referralCode || '');
      setReferralData({
        referralCode: code || rewards.referralCode || '',
        totalReferrals: stats.total_referrals ?? rewards.totalReferrals ?? 0,
        successfulReferrals: stats.successful_referrals ?? 0,
        pendingReferrals: stats.pending_referrals ?? 0,
        totalPointsEarned: stats.total_points_earned ?? 0,
        tier: rewards.tier || 'DAG SOLDIER',
        usdEarned: rewards.usdEarned || 0,
      });
    } catch (error) { console.error('Error fetching referral data:', error); }
    finally { setLoading(false); }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://dagarmy.network/signup?ref=${referralData.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLieutenant = referralData.tier === 'DAG LIEUTENANT' || referralData.tier === 'DAG_LIEUTENANT';

  const toggleNode = (nodeId) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
      return next;
    });
  };

  /* ── Neumorphic tree node ── */
  const TreeNode = ({ node, isRoot = false, depth = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes.has(node.id);
    const joinDate = node.joinedAt ? new Date(node.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
    const initials = node.name && node.name !== 'Unknown' ? node.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
    const isLt = node.tier === 'DAG LIEUTENANT' || node.tier === 'DAG_LIEUTENANT';
    const statusMap = { rewarded: 'Rewarded', completed: 'Completed', pending: 'Pending' };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isRoot && (
            <div style={{ width: '28px', flexShrink: 0, position: 'relative', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.12)' }} />
            </div>
          )}
          <div
            style={{ background: nm.bg, borderRadius: '14px', padding: '12px 16px', minWidth: '200px', maxWidth: '260px', boxShadow: isRoot ? nm.shadow : nm.shadowXs, cursor: hasChildren ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
            onClick={hasChildren ? () => toggleNode(node.id) : undefined}
            onMouseEnter={e => { if (!isRoot) e.currentTarget.style.boxShadow = nm.shadowSm; }}
            onMouseLeave={e => { if (!isRoot) e.currentTarget.style.boxShadow = nm.shadowXs; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: isRoot ? '38px' : '32px', height: isRoot ? '38px' : '32px', borderRadius: '50%', background: nm.bg, boxShadow: isRoot ? nm.shadowSm : nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: isRoot ? '13px' : '11px', fontWeight: '800', color: isRoot ? nm.accent : nm.textPrimary, flexShrink: 0 }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>{isRoot ? 'You' : node.name}</span>
                  {isRoot && <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.accent, letterSpacing: '0.3px' }}>YOU</span>}
                  {isLt && <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.textPrimary }}>LT</span>}
                </div>
                <div style={{ fontSize: '11px', color: nm.textPrimary, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{node.email}</div>
                {!isRoot && node.referralStatus && (
                  <span style={{ display: 'inline-block', fontSize: '9px', fontWeight: '700', marginTop: '4px', padding: '2px 7px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {statusMap[node.referralStatus] || node.referralStatus}
                  </span>
                )}
              </div>
              {hasChildren && (
                <div style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                  <ChevronDown size={11} color={nm.textPrimary} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${nm.border}` }}>
              <span style={{ fontSize: '10px', color: nm.textPrimary, fontWeight: '500' }}>Joined {joinDate}</span>
              {hasChildren && <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary }}>{node.children.length} referral{node.children.length !== 1 ? 's' : ''}</span>}
            </div>
          </div>
        </div>
        {hasChildren && !isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', paddingLeft: isRoot ? '0' : '28px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: isRoot ? '19px' : '47px', top: '0', width: '1px', height: '20px', background: 'rgba(0,0,0,0.12)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px', paddingLeft: isRoot ? '38px' : '38px', position: 'relative' }}>
              {node.children.length > 1 && <div style={{ position: 'absolute', left: '19px', top: '0', width: '1px', height: 'calc(100% - 24px)', background: 'rgba(0,0,0,0.08)' }} />}
              {node.children.map((child) => <TreeNode key={child.id} node={child} isRoot={false} depth={depth + 1} />)}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── NmCard helper ── */
  const NmCard = useCallback(({ children, style = {}, hover = true, inset = false, delay = 0 }) => (
    <div style={{ background: nm.bg, borderRadius: '20px', padding: '28px', boxShadow: inset ? nm.shadowInset : nm.shadowSm, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)', transitionDelay: `${delay}ms`, ...style }}
      onMouseEnter={hover && !inset ? e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
      onMouseLeave={hover && !inset ? e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
    >{children}</div>
  ), [mounted]);

  /* ── Loading state ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: nm.bg, boxShadow: nm.shadowSm, border: `3px solid transparent`, borderTopColor: nm.accent, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: '13px', color: nm.textPrimary, fontWeight: '500' }}>Loading referral data...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );

  const referralLink = `https://dagarmy.network/signup?ref=${referralData.referralCode}`;

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Referrals', value: referralData.totalReferrals,                           sub: 'All time'          },
          { label: 'Successful',      value: referralData.successfulReferrals,                      sub: 'Completed sign-ups' },
          { label: 'Points Earned',   value: (referralData.totalPointsEarned || 0).toLocaleString(), sub: 'DAG Points'        },
        ].map((s, i) => (
          <NmCard key={s.label} delay={i * 50} style={{ padding: '22px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px' }}>{s.label}</p>
            <p style={{ fontSize: '30px', fontWeight: '800', color: i === 0 ? nm.accent : nm.textPrimary, letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: nm.textPrimary, margin: '8px 0 0' }}>{s.sub}</p>
          </NmCard>
        ))}
        {/* Referral code card */}
        <NmCard delay={150} style={{ padding: '22px 24px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 14px', textAlign: 'center' }}>Your Code</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <p style={{ fontSize: '24px', fontWeight: '800', color: nm.textPrimary, fontFamily: 'monospace', letterSpacing: '3px', lineHeight: 1, margin: 0 }}>
              {referralData.referralCode || '—'}
            </p>
            <button
              onClick={() => { navigator.clipboard.writeText(referralData.referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: nm.bg, boxShadow: copied ? nm.shadowInset : nm.shadowSm, color: copied ? nm.accent : nm.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s ease', flexShrink: 0 }}
              onMouseEnter={e => { if (!copied) e.currentTarget.style.boxShadow = nm.shadow; }}
              onMouseLeave={e => { if (!copied) e.currentTarget.style.boxShadow = nm.shadowSm; }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        </NmCard>
      </div>

      {/* ── Referral code card ── */}
      <NmCard delay={200} style={{ marginBottom: '16px', padding: '28px 32px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 20px' }}>My Referral Link</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Link */}
          <div style={{ flex: 1, minWidth: 0, background: nm.bg, borderRadius: '14px', padding: '16px 20px', boxShadow: nm.shadowInset }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: nm.textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{referralLink}</p>
          </div>

          {/* Copy link button */}
          <button
            onClick={copyReferralCode}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '16px 26px', borderRadius: '14px', border: 'none', background: nm.bg, boxShadow: copied ? nm.shadowInset : nm.shadowSm, color: copied ? nm.accent : nm.textPrimary, fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.25s ease', flexShrink: 0, letterSpacing: '0.2px' }}
            onMouseEnter={e => { if (!copied) e.currentTarget.style.boxShadow = nm.shadow; }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.boxShadow = nm.shadowSm; }}
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '48px', background: nm.border, flexShrink: 0 }} />

          {/* Share via — horizontal row */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>Share</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                {
                  name: 'WhatsApp',
                  href: () => `https://wa.me/?text=${encodeURIComponent(`Join DAGArmy using my referral link and start earning! ${referralLink}`)}`,
                  icon: (
                    <svg viewBox="0 0 32 32" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.75-1.813A11.94 11.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#25D366"/>
                      <path d="M21.5 18.5c-.3-.15-1.75-.863-2.02-.963-.27-.1-.467-.15-.663.15-.2.3-.763.963-.937 1.163-.17.2-.343.225-.637.075-.3-.15-1.262-.463-2.4-1.475-.888-.788-1.487-1.762-1.663-2.062-.175-.3-.018-.463.13-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.663-1.6-.913-2.188-.24-.575-.484-.496-.663-.505l-.563-.01c-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.9 1.225 3.1c.15.2 2.113 3.225 5.125 4.525.716.309 1.274.494 1.71.631.718.228 1.372.196 1.888.119.576-.086 1.75-.714 2-1.4.25-.688.25-1.275.175-1.4-.075-.125-.275-.2-.575-.35z" fill="#fff"/>
                    </svg>
                  ),
                },
                {
                  name: 'X',
                  href: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join DAGArmy using my referral link and start earning! ${referralLink}`)}`,
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
                    </svg>
                  ),
                },
                {
                  name: 'Telegram',
                  href: () => `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join DAGArmy using my referral link and start earning!')}`,
                  icon: (
                    <svg viewBox="0 0 32 32" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" rx="16" fill="#2AABEE"/>
                      <path d="M7 15.5l4.5 1.7 1.75 5.5 2.25-2.95 4.75 3.5 3.25-14-16 6.25z" fill="#fff"/>
                      <path d="M11.5 17.2l.5 5 1.75-5.25" fill="#d5e8f5"/>
                    </svg>
                  ),
                },
                {
                  name: 'Facebook',
                  href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
                  icon: (
                    <svg viewBox="0 0 32 32" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" rx="8" fill="#1877F2"/>
                      <path d="M21 16h-3v-2c0-.828.172-1 1-1h2V9h-3c-3 0-4 2-4 4v3h-2v4h2v9h4v-9h3l1-4z" fill="#fff"/>
                    </svg>
                  ),
                },
                {
                  name: 'Instagram',
                  href: () => { navigator.clipboard.writeText(`Join DAGArmy using my referral link and start earning! ${referralLink}`); return 'https://www.instagram.com/'; },
                  isInstagram: true,
                  icon: (
                    <svg viewBox="0 0 32 32" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="igGrad" cx="30%" cy="107%" r="150%">
                          <stop offset="0%" stopColor="#fdf497"/>
                          <stop offset="5%" stopColor="#fdf497"/>
                          <stop offset="45%" stopColor="#fd5949"/>
                          <stop offset="60%" stopColor="#d6249f"/>
                          <stop offset="90%" stopColor="#285AEB"/>
                        </radialGradient>
                      </defs>
                      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#igGrad)"/>
                      <circle cx="16" cy="16" r="6" fill="none" stroke="#fff" strokeWidth="2.2"/>
                      <circle cx="22.5" cy="9.5" r="1.5" fill="#fff"/>
                    </svg>
                  ),
                },
              ].map(platform => (
                <a
                  key={platform.name}
                  href={platform.href()}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Share on ${platform.name}`}
                  onClick={platform.isInstagram ? (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(`Join DAGArmy using my referral link and start earning! ${referralLink}`);
                    window.open('https://www.instagram.com/', '_blank');
                  } : undefined}
                  style={{ width: '44px', height: '44px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </NmCard>

      {/* ── Upgrade nudge ── */}
      {!isLieutenant && (
        <NmCard delay={240} style={{ marginBottom: '16px', padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Crown size={18} color={nm.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary, margin: '0 0 3px' }}>Upgrade to DAG Lieutenant</p>
              <p style={{ fontSize: '12px', color: nm.textPrimary, margin: 0 }}>Earn a 20% bonus on all referral points — 500 → 600 pts, 2500 → 3000 pts</p>
            </div>
            <a
              href="https://wa.me/message/DAGARMY" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowSm, color: nm.accent, fontSize: '12px', fontWeight: '700', textDecoration: 'none', flexShrink: 0, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = nm.shadow}
              onMouseLeave={e => e.currentTarget.style.boxShadow = nm.shadowSm}
            >
              Upgrade · $149
            </a>
          </div>
        </NmCard>
      )}

      {/* ── How it works ── */}
      <NmCard delay={280} hover={false} style={{ marginBottom: '16px', padding: '24px 28px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 18px' }}>How Referrals Work</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
          {[
            { step: '01', title: 'Share Your Link',  desc: 'Copy your unique referral link and share it with your network.' },
            { step: '02', title: 'They Sign Up',     desc: 'Your referral creates an account as a DAG SOLDIER using your code.' },
            { step: '03', title: 'Earn on Join',     desc: isLieutenant ? 'You earn 600 DAG Points (500 + 20% LT bonus) on each successful join.' : 'You earn 500 DAG Points when your referral successfully joins.' },
            { step: '04', title: 'Earn on Upgrade',  desc: isLieutenant ? 'You earn 3,000 DAG Points if your referral upgrades to DAG LIEUTENANT.' : 'You earn 2,500 DAG Points if your referral upgrades to DAG LIEUTENANT.' },
          ].map(item => (
            <div key={item.step} style={{ background: nm.bg, borderRadius: '14px', padding: '16px 18px', boxShadow: nm.shadowXs, display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowInsetSm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: nm.accent }}>{item.step}</span>
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary, margin: '0 0 4px' }}>{item.title}</p>
                <p style={{ fontSize: '12px', color: nm.textPrimary, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </NmCard>

      {/* ── Sales commission info ── */}
      <NmCard delay={320} style={{ marginBottom: '16px', padding: '20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ background: nm.bg, borderRadius: '14px', padding: '14px 20px', boxShadow: nm.shadowInset, textAlign: 'center' }}>
              <p style={{ fontSize: '26px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px', margin: 0, lineHeight: 1 }}>{isLieutenant ? '30' : '25'}</p>
              <p style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '4px 0 0' }}>pts / $</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: nm.textPrimary, margin: '0 0 4px' }}>Earn on Referral Sales</p>
            <p style={{ fontSize: '12px', color: nm.textPrimary, margin: 0, lineHeight: 1.6 }}>
              You earn <strong style={{ color: nm.textPrimary }}>{isLieutenant ? '30' : '25'} DAG Points per $</strong> on all sales made by your direct referrals.
              {isLieutenant && ' Your DAG LIEUTENANT status gives you a +20% bonus.'}
            </p>
          </div>
        </div>
      </NmCard>

      {/* ── Referral network tree ── */}
      <NmCard delay={360} hover={false} style={{ marginBottom: '16px', padding: '0', overflow: 'hidden' }}>
        {/* Tree header */}
        <div style={{ padding: '20px 28px 18px', borderBottom: `1px solid ${nm.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitBranch size={16} color={nm.accent} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '700', color: nm.textPrimary, margin: 0 }}>Referral Network Tree</p>
              <p style={{ fontSize: '11px', color: nm.textPrimary, margin: 0 }}>Click any node to expand or collapse</p>
            </div>
          </div>
          {treeMeta && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {[{ label: 'Total Network', val: treeMeta.totalDownline }, { label: 'Max Depth', val: treeMeta.maxDepth }].map(m => (
                <div key={m.label} style={{ textAlign: 'center', padding: '8px 16px', background: nm.bg, borderRadius: '10px', boxShadow: nm.shadowInsetSm }}>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: nm.textPrimary, letterSpacing: '-0.5px', margin: 0 }}>{m.val}</p>
                  <p style={{ fontSize: '10px', fontWeight: '600', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.4px', margin: 0 }}>{m.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Tree body */}
        <div style={{ padding: '24px 28px', overflowX: 'auto', minHeight: '180px' }}>
          {treeLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: nm.bg, boxShadow: nm.shadowXs, border: `2px solid transparent`, borderTopColor: nm.accent, animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '13px', color: nm.textPrimary }}>Building your network tree...</span>
            </div>
          ) : treeError ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ fontSize: '13px', color: nm.textPrimary, margin: 0 }}>{treeError}</p>
            </div>
          ) : !treeData || (treeData.children && treeData.children.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: nm.bg, boxShadow: nm.shadowInset, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Users size={22} color={nm.textPrimary} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: nm.textPrimary, margin: '0 0 6px' }}>No referrals yet</p>
              <p style={{ fontSize: '12px', color: nm.textPrimary, margin: 0 }}>Share your referral link to start building your network</p>
            </div>
          ) : (
            <div style={{ display: 'inline-block', minWidth: '100%' }}>
              <TreeNode node={treeData} isRoot depth={0} />
            </div>
          )}
        </div>
      </NmCard>

      {/* ── Earnings breakdown table ── */}
      <NmCard delay={400} inset hover={false} style={{ padding: '24px 28px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>Earnings Breakdown</p>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 12px', background: nm.bg, borderRadius: '8px', boxShadow: nm.shadowXs, marginBottom: '6px' }}>
          {['Scenario', 'Your Tier', 'DAG Points'].map((h, i) => (
            <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i === 2 ? 'right' : 'left' }}>{h}</span>
          ))}
        </div>
        {[
          { scenario: 'Referral joins',   tier: 'DAG SOLDIER',    points: 500,  isYou: !isLieutenant },
          { scenario: 'Referral joins',   tier: 'DAG LIEUTENANT', points: 600,  isYou: isLieutenant  },
          { scenario: 'Referral upgrades', tier: 'DAG SOLDIER',   points: 2500, isYou: !isLieutenant },
          { scenario: 'Referral upgrades', tier: 'DAG LIEUTENANT',points: 3000, isYou: isLieutenant  },
        ].map((row, idx) => (
          <div
            key={idx}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '11px 12px', alignItems: 'center', borderBottom: idx < 3 ? `1px solid ${nm.border}` : 'none', borderRadius: '6px', background: row.isYou ? nm.accentLight : 'transparent', transition: 'background 0.15s' }}
            onMouseEnter={e => { if (!row.isYou) e.currentTarget.style.background = 'rgba(0,0,0,0.025)'; }}
            onMouseLeave={e => { if (!row.isYou) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '12px', color: nm.textPrimary, fontWeight: '500' }}>{row.scenario}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: nm.bg, boxShadow: row.isYou ? nm.shadowInsetSm : nm.shadowXs, color: row.isYou ? nm.accent : nm.textPrimary }}>{row.tier}</span>
              {row.isYou && <span style={{ fontSize: '9px', fontWeight: '800', color: nm.accent }}>YOU</span>}
            </div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: row.isYou ? nm.accent : nm.textPrimary, textAlign: 'right', letterSpacing: '-0.3px' }}>+{row.points.toLocaleString()}</span>
          </div>
        ))}
      </NmCard>
    </div>
  );
}
