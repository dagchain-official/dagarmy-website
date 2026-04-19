"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentReferralPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/my-team'); }, []);
  return null;
}

function _OriginalStudentReferralPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
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
    lastReferralAt: null,
    tier: 'DAG SOLDIER',
    usdEarned: 0,
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    const userStr = localStorage.getItem('dagarmy_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchReferralData(userData);
      fetchTreeData(userData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTreeData = async (userId) => {
    try {
      setTreeLoading(true);
      setTreeError(null);
      const res = await fetch(`/api/referral/tree?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setTreeData(data.tree);
        setTreeMeta(data.meta);
      } else {
        setTreeError(data.error || 'Failed to load tree');
      }
    } catch (err) {
      setTreeError('Network error loading tree');
    } finally {
      setTreeLoading(false);
    }
  };

  const fetchReferralData = async (userData) => {
    try {
      setLoading(true);
      const [rewardsRes, statsRes, codeRes] = await Promise.all([
        fetch(`/api/rewards/user?email=${encodeURIComponent(userData.email)}`),
        fetch(`/api/referral/stats?userId=${userData.id}`),
        fetch(`/api/referral/get-code?userId=${userData.id}`),
      ]);
      const [rewardsData, statsData, codeData] = await Promise.all([
        rewardsRes.json(),
        statsRes.json(),
        codeRes.json(),
      ]);

      const rewards = rewardsData.success ? rewardsData.data : {};
      const stats = statsData.success ? statsData.stats : {};
      const code = codeData.success ? codeData.code : (rewards.referralCode || '');

      setReferralData({
        referralCode: code || rewards.referralCode || '',
        totalReferrals: stats.total_referrals ?? rewards.totalReferrals ?? 0,
        successfulReferrals: stats.successful_referrals ?? 0,
        pendingReferrals: stats.pending_referrals ?? 0,
        totalPointsEarned: stats.total_points_earned ?? 0,
        lastReferralAt: stats.last_referral_at ?? null,
        tier: rewards.tier || 'DAG SOLDIER',
        usdEarned: rewards.usdEarned || 0,
      });
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    const referralLink = `https://dagarmy.network/signup?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLieutenant = referralData.tier === 'DAG LIEUTENANT' || referralData.tier === 'DAG_LIEUTENANT';

  const toggleNode = (nodeId) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const TIER_STYLE = {
    'DAG_LIEUTENANT': { color: '#d97706', bg: '#fef3c7', border: '#fde68a', label: 'LIEUTENANT' },
    'DAG LIEUTENANT': { color: '#d97706', bg: '#fef3c7', border: '#fde68a', label: 'LIEUTENANT' },
    'DAG_SOLDIER':    { color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', label: 'SOLDIER' },
    'DAG SOLDIER':    { color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', label: 'SOLDIER' },
  };

  const STATUS_STYLE = {
    rewarded:  { color: '#10b981', bg: '#f0fdf4', label: 'Rewarded' },
    completed: { color: '#3b82f6', bg: '#eff6ff', label: 'Completed' },
    pending:   { color: '#f59e0b', bg: '#fffbeb', label: 'Pending' },
  };

  const DEPTH_COLORS = ['#6366f1','#10b981','#f59e0b','#8b5cf6','#ef4444','#0ea5e9'];

  // Recursive tree node component
  const TreeNode = ({ node, isRoot = false, isLast = false, depth = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes.has(node.id);
    const tierStyle = TIER_STYLE[node.tier] || TIER_STYLE['DAG SOLDIER'];
    const statusStyle = node.referralStatus ? (STATUS_STYLE[node.referralStatus] || STATUS_STYLE.pending) : null;
    const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];
    const joinDate = node.joinedAt ? new Date(node.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
    const initials = node.name && node.name !== 'Unknown'
      ? node.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      : '?';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
        {/* Node card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', position: 'relative' }}>
          {/* Vertical + horizontal connector for non-root */}
          {!isRoot && (
            <div style={{ width: '32px', flexShrink: 0, position: 'relative', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
              {/* Horizontal line to node */}
              <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: `${depthColor}40` }} />
            </div>
          )}

          {/* Card */}
          <div
            style={{
              background: isRoot ? `linear-gradient(135deg, ${depthColor}15, ${depthColor}08)` : '#fff',
              border: `1.5px solid ${isRoot ? depthColor + '50' : '#e2e8f0'}`,
              borderRadius: '14px',
              padding: '12px 16px',
              minWidth: '220px',
              maxWidth: '280px',
              boxShadow: isRoot ? `0 4px 20px ${depthColor}20` : '0 1px 4px rgba(0,0,0,0.04)',
              position: 'relative',
              cursor: hasChildren ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            onClick={hasChildren ? () => toggleNode(node.id) : undefined}
            onMouseEnter={e => { if (!isRoot) { e.currentTarget.style.borderColor = depthColor + '60'; e.currentTarget.style.boxShadow = `0 4px 16px ${depthColor}18`; } }}
            onMouseLeave={e => { if (!isRoot) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Avatar */}
              <div style={{ width: isRoot ? '40px' : '34px', height: isRoot ? '40px' : '34px', borderRadius: '50%', background: `linear-gradient(135deg, ${depthColor}, ${depthColor}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: isRoot ? '14px' : '12px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: isRoot ? '14px' : '13px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                    {isRoot ? 'You' : node.name}
                  </span>
                  {isRoot && <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 7px', borderRadius: '20px', background: depthColor, color: '#fff' }}>YOU</span>}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{node.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px', background: tierStyle.bg, color: tierStyle.color, border: `1px solid ${tierStyle.border}` }}>{tierStyle.label}</span>
                  {!isRoot && statusStyle && (
                    <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px', background: statusStyle.bg, color: statusStyle.color }}>{statusStyle.label}</span>
                  )}
                  {!isRoot && node.pointsEarned > 0 && (
                    <span style={{ fontSize: '9px', fontWeight: '700', color: '#10b981' }}>+{node.pointsEarned.toLocaleString()} pts</span>
                  )}
                </div>
              </div>
              {/* Collapse toggle */}
              {hasChildren && (
                <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', background: depthColor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                  <ChevronDown size={12} color={depthColor} />
                </div>
              )}
            </div>
            {/* Join date + child count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>Joined {joinDate}</span>
              {hasChildren && (
                <span style={{ fontSize: '10px', fontWeight: '700', color: depthColor }}>
                  {node.children.length} referral{node.children.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '0', paddingLeft: isRoot ? '0' : '32px', position: 'relative' }}>
            {/* Vertical stem line down from parent */}
            <div style={{ position: 'absolute', left: isRoot ? '20px' : '52px', top: '0', width: '2px', height: '24px', background: `${DEPTH_COLORS[(depth + 1) % DEPTH_COLORS.length]}40` }} />
            {/* Horizontal bar connecting children */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px', paddingLeft: isRoot ? '40px' : '40px', position: 'relative' }}>
              {/* Vertical line along left of children group */}
              {node.children.length > 1 && (
                <div style={{ position: 'absolute', left: isRoot ? '20px' : '20px', top: '0', width: '2px', height: `calc(100% - 28px)`, background: `${DEPTH_COLORS[(depth + 1) % DEPTH_COLORS.length]}30` }} />
              )}
              {node.children.map((child, idx) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  isRoot={false}
                  isLast={idx === node.children.length - 1}
                  depth={depth + 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const nm = {
    bg: '#f0f2f5',
    shadow: '8px 8px 20px rgba(0,0,0,0.16), -6px -6px 16px rgba(255,255,255,0.95)',
    shadowSm: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)',
    shadowInset: 'inset 5px 5px 12px rgba(0,0,0,0.13), inset -4px -4px 10px rgba(255,255,255,0.9)',
  };

  const NmCard = useCallback(({ children, style = {}, hover = true, inset = false, delay = 0 }) => (
    <div
      style={{
        background: nm.bg,
        borderRadius: '20px',
        padding: '28px',
        boxShadow: inset ? nm.shadowInset : nm.shadowSm,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${delay}ms`,
        ...style
      }}
      onMouseEnter={hover && !inset ? (e) => {
        e.currentTarget.style.boxShadow = nm.shadow;
        e.currentTarget.style.transform = 'translateY(-3px)';
      } : undefined}
      onMouseLeave={hover && !inset ? (e) => {
        e.currentTarget.style.boxShadow = nm.shadowSm;
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
    >{children}</div>
  ), [mounted]);

  if (loading) {
    return (
      <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
        <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: '0', height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
          <DashboardNav2 />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(0,0,0,0.08)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Loading referral data...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  const referralLink = `https://dagarmy.network/signup?ref=${referralData.referralCode}`;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: '248px', flexShrink: 0, position: 'sticky', top: '0', height: '100vh', overflowY: 'auto', background: '#f0f2f5' }}>
        <DashboardNav2 />
      </div>
      <div style={{ flex: 1, padding: '32px 36px', background: '#f0f2f5', minHeight: '100vh' }}>

              {/* Page Header */}
              <div style={{ marginBottom: '28px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-8px)', transition: 'all 0.5s ease', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={22} color="#fff" />
                    </div>
                    My Referrals
                  </h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '8px 0 0 52px', fontWeight: '450' }}>
                    Share your referral link and earn DAG Points for every successful referral
                  </p>
                </div>
                {!isLieutenant && (
                  <a
                    href="https://wa.me/message/DAGARMY"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #e0e7ff', background: '#fff', color: '#4f46e5', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textDecoration: 'none', letterSpacing: '0.2px', whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(99,102,241,0.08)', flexShrink: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#a5b4fc'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e0e7ff'; }}
                  >
                    <Crown size={15} />
                    Upgrade to DAG Lieutenant
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 7px', borderRadius: '6px', background: '#eef2ff', color: '#6366f1' }}>$149</span>
                  </a>
                )}
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>

                {/* Total Referrals */}
                <NmCard delay={50} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '8px 8px 20px rgba(0,0,0,0.18), -4px -4px 12px rgba(255,255,255,0.5)' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ position: 'relative' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '16px' }}>Total Referrals</span>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{referralData.totalReferrals}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>All time</p>
                  </div>
                </NmCard>

                {/* Successful */}
                <NmCard delay={100}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '16px' }}>Successful</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: '#10b981', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{referralData.successfulReferrals}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Completed sign-ups</p>
                </NmCard>

                {/* Pending */}
                <NmCard delay={150}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '16px' }}>Pending</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{referralData.pendingReferrals}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Awaiting completion</p>
                </NmCard>

                {/* Points Earned from Referrals */}
                <NmCard delay={200}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '16px' }}>Points Earned</span>
                  <p style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', lineHeight: 1, margin: 0 }}>{(referralData.totalPointsEarned || 0).toLocaleString()}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>DAG Points from referrals</p>
                </NmCard>
              </div>

              {/* Referral Code Bar */}
              <NmCard delay={250} style={{ marginBottom: '20px', padding: '24px 28px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>Your Referral Code</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Share this code or link to invite others to DAG Army</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={20} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Code</p>
                    <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '3px', margin: 0 }}>
                      {referralData.referralCode || '-'}
                    </p>
                  </div>
                  <div style={{ flex: 2, minWidth: '200px', background: 'rgba(0,0,0,0.04)', borderRadius: '10px', padding: '10px 14px', boxShadow: 'inset 3px 3px 7px rgba(0,0,0,0.08), inset -2px -2px 5px rgba(255,255,255,0.9)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Referral Link</p>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#475569', margin: 0, wordBreak: 'break-all' }}>{referralLink}</p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    style={{
                      background: copied ? '#10b981' : '#6366f1',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      letterSpacing: '0.3px',
                      flexShrink: 0,
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </NmCard>

              {/* How Referrals Work */}
              <NmCard delay={300} hover={false} style={{ marginBottom: '20px', padding: '28px 32px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>How Referrals Work</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Earn DAG Points every time someone joins using your link</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {[
                    {
                      step: '01',
                      title: 'Share Your Link',
                      desc: 'Copy your unique referral link and share it with friends, family, or your network.',
                      color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
                      icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684 6.632 3.316m-6.632-6 6.632-3.316m0 0a3 3 0 1 0 5.367-2.684 3 3 0 0 0-5.367 2.684zm0 9.316a3 3 0 1 0 5.368 2.684 3 3 0 0 0-5.368-2.684z',
                    },
                    {
                      step: '02',
                      title: 'They Sign Up',
                      desc: 'Your referral creates an account as a DAG SOLDIER using your code.',
                      color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0',
                      icon: 'M18 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
                    },
                    {
                      step: '03',
                      title: 'Earn on Join',
                      desc: isLieutenant
                        ? 'As a DAG LIEUTENANT, you earn 600 DAG Points when your referral joins (500 base + 20% bonus).'
                        : 'You earn 500 DAG Points when your referral successfully joins as a DAG SOLDIER.',
                      color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
                      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
                    },
                    {
                      step: '04',
                      title: 'Earn on Upgrade',
                      desc: isLieutenant
                        ? 'If your referral upgrades to DAG LIEUTENANT, you earn an additional 3,000 DAG Points (2,500 base + 20% bonus).'
                        : 'If your referral upgrades to DAG LIEUTENANT, you earn an additional 2,500 DAG Points.',
                      color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe',
                      icon: 'M5 3l14 9-14 9V3z',
                    },
                  ].map((item) => (
                    <div key={item.step} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: '14px', padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '800', color: item.color, letterSpacing: '0.5px' }}>STEP {item.step}</span>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{item.title}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </NmCard>

              {/* Sales DAG Points Info Card */}
              <NmCard delay={350} hover={false} style={{ marginBottom: '20px', padding: '20px 28px', background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)', boxShadow: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                    <ShoppingCart size={20} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#065f46', margin: '0 0 4px' }}>Earn DAG Points on Your Referrals' Sales</h3>
                    <p style={{ fontSize: '12px', color: '#047857', margin: 0, lineHeight: 1.5 }}>
                      You earn <strong>25 DAG Points per $</strong> on sales made by your direct referrals.
                      {isLieutenant && (
                        <span> As a <strong>DAG LIEUTENANT</strong>, you receive a <strong>+20% bonus</strong> - earning <strong>30 pts/$</strong> on referral sales.</span>
                      )}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981', letterSpacing: '-1px' }}>
                      {isLieutenant ? '30' : '25'}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>pts per $</div>
                  </div>
                </div>
              </NmCard>

              {/* ══ REFERRAL TREE ══ */}
              <div style={{ marginBottom: '20px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.5s ease 450ms' }}>
                <div style={{ background: '#f0f2f5', borderRadius: '20px', boxShadow: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 12px rgba(255,255,255,0.9)', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GitBranch size={18} color="#fff" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Referral Network Tree</h2>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Your full downline - click any node to expand or collapse</p>
                      </div>
                    </div>
                    {treeMeta && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0f2f5', borderRadius: '10px', boxShadow: 'inset 4px 4px 9px rgba(0,0,0,0.12), inset -3px -3px 7px rgba(255,255,255,0.9)' }}>
                          <div style={{ fontSize: '18px', fontWeight: '900', color: '#6366f1', letterSpacing: '-0.5px' }}>{treeMeta.totalDownline}</div>
                          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total Network</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0f2f5', borderRadius: '10px', boxShadow: 'inset 4px 4px 9px rgba(0,0,0,0.12), inset -3px -3px 7px rgba(255,255,255,0.9)' }}>
                          <div style={{ fontSize: '18px', fontWeight: '900', color: '#10b981', letterSpacing: '-0.5px' }}>{treeMeta.maxDepth}</div>
                          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Max Depth</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Depth legend */}
                  <div style={{ padding: '12px 28px', background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Levels:</span>
                    {['You', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5+'].map((label, i) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: DEPTH_COLORS[i % DEPTH_COLORS.length] }} />
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tree body */}
                  <div style={{ padding: '28px', overflowX: 'auto', minHeight: '200px' }}>
                    {treeLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Building your network tree...</span>
                        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                      </div>
                    ) : treeError ? (
                      <div style={{ textAlign: 'center', padding: '48px 0', color: '#ef4444' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.5 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{treeError}</p>
                      </div>
                    ) : !treeData || (treeData.children && treeData.children.length === 0) ? (
                      <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                          <GitBranch size={24} color="#cbd5e1" />
                        </div>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>No referrals yet</p>
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Share your referral link to start building your network</p>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block', minWidth: '100%' }}>
                        <TreeNode node={treeData} isRoot={true} depth={0} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Referral Earnings Breakdown */}
              <NmCard delay={400} inset={true} hover={false} style={{ padding: '28px 32px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Referral Earnings Breakdown</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>DAG Points you earn per referral scenario</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {/* Table header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 14px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', marginBottom: '4px' }}>
                    {['Scenario', 'Your Tier', 'DAG Points Earned'].map((h, i) => (
                      <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i === 2 ? 'right' : 'left' }}>{h}</span>
                    ))}
                  </div>
                  {[
                    { scenario: 'Referral joins as DAG SOLDIER', tier: 'DAG SOLDIER', points: 500, color: '#6366f1', bg: '#eef2ff' },
                    { scenario: 'Referral joins as DAG SOLDIER', tier: 'DAG LIEUTENANT', points: 600, color: '#10b981', bg: '#f0fdf4', highlight: isLieutenant },
                    { scenario: 'Referral upgrades to DAG LIEUTENANT', tier: 'DAG SOLDIER', points: 2500, color: '#f59e0b', bg: '#fffbeb' },
                    { scenario: 'Referral upgrades to DAG LIEUTENANT', tier: 'DAG LIEUTENANT', points: 3000, color: '#8b5cf6', bg: '#f5f3ff', highlight: isLieutenant },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 14px', alignItems: 'center', borderBottom: idx < 3 ? '1px solid #f1f5f9' : 'none', borderRadius: '6px', background: row.highlight ? row.bg : 'transparent' }}
                      onMouseEnter={e => { if (!row.highlight) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                      onMouseLeave={e => { if (!row.highlight) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: '13px', color: '#334155', fontWeight: '500' }}>{row.scenario}</span>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: row.highlight ? row.color : '#f1f5f9', color: row.highlight ? '#fff' : '#64748b', border: row.highlight ? 'none' : '1px solid #e2e8f0' }}>
                          {row.tier}
                        </span>
                        {row.highlight && <span style={{ fontSize: '10px', fontWeight: '700', color: row.color, marginLeft: '6px' }}>YOU</span>}
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: row.color, textAlign: 'right', letterSpacing: '-0.3px' }}>+{row.points.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                {!isLieutenant && (
                  <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', boxShadow: 'inset 3px 3px 7px rgba(99,102,241,0.12), inset -2px -2px 5px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Crown size={16} color="#6366f1" />
                    <p style={{ fontSize: '12px', color: '#4338ca', margin: 0, fontWeight: '600' }}>
                      Upgrade to <strong>DAG LIEUTENANT</strong> to earn a 20% bonus on all referral points - turning 500 into 600 and 2,500 into 3,000.
                    </p>
                  </div>
                )}
              </NmCard>

      </div>
    </div>
  );
}









