"use client";
import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';

const nm = {
  bg: '#f0f2f5',
  shadow: '6px 6px 14px rgba(0,0,0,0.13), -4px -4px 10px rgba(255,255,255,0.9)',
  shadowSm: '4px 4px 10px rgba(0,0,0,0.11), -3px -3px 8px rgba(255,255,255,0.88)',
  shadowXs: '3px 3px 7px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.85)',
  shadowInset: 'inset 4px 4px 9px rgba(0,0,0,0.12), inset -3px -3px 7px rgba(255,255,255,0.88)',
  shadowInsetSm: 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.85)',
  border: 'rgba(0,0,0,0.06)',
  accent: '#4f46e5',
  textPrimary: '#1e293b',
  textMuted: '#94a3b8',
};

const LEVEL_META = {
  1: { label: 'L1', color: '#4f46e5', rate: null, title: 'Level 1 - Direct' },
  2: { label: 'L2', color: '#4f46e5', rate: '3%', title: 'Level 2 - 2nd Downline' },
  3: { label: 'L3', color: '#4f46e5', rate: '2%', title: 'Level 3 - 3rd Downline' },
};

const STATUS_META = {
  pending: { label: 'Earned', color: '#4f46e5' },
  requested: { label: 'Requested', color: '#1e293b' },
  paid: { label: 'Paid', color: '#1e293b' },
  cancelled: { label: 'Cancelled', color: '#94a3b8' },
};

function NmCard({ children, style = {}, delay = 0, hover = true, inset = false }) {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: nm.bg, borderRadius: '18px',
      boxShadow: inset ? nm.shadowInset : nm.shadowSm,
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s ease',
      ...style,
    }}
      onMouseEnter={hover && !inset ? e => { e.currentTarget.style.boxShadow = nm.shadow; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
      onMouseLeave={hover && !inset ? e => { e.currentTarget.style.boxShadow = nm.shadowSm; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
    >{children}</div>
  );
}

function PillPopover({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const active = options.find(o => o.key === value);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: 0, border: 'none', background: 'transparent', fontSize: '10px', fontWeight: '700', color: value !== 'all' ? nm.accent : nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', cursor: 'pointer' }}>
        {active?.label || 'ALL'}
        <svg width="8" height="8" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke={value !== 'all' ? nm.accent : nm.textPrimary} strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 60, background: nm.bg, borderRadius: '14px', boxShadow: nm.shadow, padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '120px' }}
          onMouseLeave={() => setOpen(false)}>
          {options.map(({ key, label }) => (
            <button key={key} onClick={() => { onChange(key); setOpen(false); }}
              style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: value === key ? nm.shadowInset : nm.shadowXs, color: value === key ? nm.accent : nm.textPrimary, fontSize: '11px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { if (value !== key) e.currentTarget.style.boxShadow = nm.shadowSm; }}
              onMouseLeave={e => { if (value !== key) e.currentTarget.style.boxShadow = nm.shadowXs; }}
            >{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyBusinessContent({ mounted: parentMounted }) {
  const [mob, setMob] = useState(true);
  useLayoutEffect(() => {
    const check = () => setMob(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('dagarmy_user');
      if (!userStr) { setError('Not logged in'); return; }
      const { email } = JSON.parse(userStr);
      const res = await fetch(`/api/business/user?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load');
      setData(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    if (!data?.transactions) return [];
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTs = dateTo ? new Date(dateTo + 'T23:59:59').getTime() : null;
    return data.transactions.filter(t => {
      const ts = new Date(t.created_at).getTime();
      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
      if (levelFilter !== 'all' && String(t.commission_level) !== levelFilter) return false;
      if (statusFilter !== 'all' && t.payment_status !== statusFilter) return false;
      if (currencyFilter !== 'all' && (t.currency || 'USD').toUpperCase() !== currencyFilter) return false;
      return true;
    });
  }, [data, levelFilter, statusFilter, currencyFilter, dateFrom, dateTo]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: nm.bg, boxShadow: nm.shadowSm, border: '3px solid transparent', borderTopColor: nm.accent, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: '13px', color: nm.textPrimary, fontWeight: '500' }}>Loading business data...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <p style={{ fontSize: '14px', color: nm.textPrimary, fontWeight: '600' }}>{error}</p>
      <button onClick={fetchData} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '10px', border: 'none', background: nm.bg, boxShadow: nm.shadowSm, color: nm.accent, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Retry</button>
    </div>
  );

  const { summary, userTier } = data;
  const isLieutenant = userTier === 'DAG_LIEUTENANT' || userTier === 'DAG LIEUTENANT';
  const l1CommPct = isLieutenant ? 20 : 10;
  // 1 DGCC = $1 — combine legacy USD + USDT fields into a single DGCC value
  const dgccL1    = (summary?.byLevel[1]?.usd || 0) + (summary?.byLevel[1]?.usdt || 0);
  const dgccL2    = (summary?.byLevel[2]?.usd || 0) + (summary?.byLevel[2]?.usdt || 0);
  const dgccL3    = (summary?.byLevel[3]?.usd || 0) + (summary?.byLevel[3]?.usdt || 0);
  const totalDgcc = dgccL1 + dgccL2 + dgccL3;

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* ── Summary stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? 'repeat(3,1fr)' : 'repeat(3,1fr)', gap: mob ? '10px' : '12px', marginBottom: '20px' }}>
        {/* L1 */}
        <NmCard delay={0} style={{ padding: mob ? '14px 10px' : '20px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', fontWeight: '700', color: LEVEL_META[1].color, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 8px' }}>Level 1 · {l1CommPct}%</p>
          <p style={{ fontSize: mob ? '22px' : '28px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px', lineHeight: 1, margin: '0 0 4px' }}>{dgccL1.toFixed(1)}</p>
          <p style={{ fontSize: '9px', fontWeight: '700', color: nm.accent, letterSpacing: '0.08em', margin: '0 0 4px' }}>DGCC</p>
          <p style={{ fontSize: '9px', color: nm.textMuted, margin: 0, fontWeight: '500' }}>{summary?.byLevel[1]?.count || 0} txns</p>
        </NmCard>
        {/* L2 */}
        <NmCard delay={60} style={{ padding: mob ? '14px 10px' : '20px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', fontWeight: '700', color: LEVEL_META[2].color, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 8px' }}>Level 2 · 3%</p>
          <p style={{ fontSize: mob ? '22px' : '28px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px', lineHeight: 1, margin: '0 0 4px' }}>{dgccL2.toFixed(1)}</p>
          <p style={{ fontSize: '9px', fontWeight: '700', color: nm.accent, letterSpacing: '0.08em', margin: '0 0 4px' }}>DGCC</p>
          <p style={{ fontSize: '9px', color: nm.textMuted, margin: 0, fontWeight: '500' }}>{summary?.byLevel[2]?.count || 0} txns</p>
        </NmCard>
        {/* L3 */}
        <NmCard delay={120} style={{ padding: mob ? '14px 10px' : '20px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: '9px', fontWeight: '700', color: LEVEL_META[3].color, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 8px' }}>Level 3 · 2%</p>
          <p style={{ fontSize: mob ? '22px' : '28px', fontWeight: '900', color: nm.accent, letterSpacing: '-1px', lineHeight: 1, margin: '0 0 4px' }}>{dgccL3.toFixed(1)}</p>
          <p style={{ fontSize: '9px', fontWeight: '700', color: nm.accent, letterSpacing: '0.08em', margin: '0 0 4px' }}>DGCC</p>
          <p style={{ fontSize: '9px', color: nm.textMuted, margin: 0, fontWeight: '500' }}>{summary?.byLevel[3]?.count || 0} txns</p>
        </NmCard>
      </div>


      {/* ── Tier rewards banner ── */}
      <NmCard delay={200} hover={false} style={{ padding: mob ? '16px' : '20px 24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: mob ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '16px', flexDirection: mob ? 'column' : 'row' }}>
          {/* Left: Tier identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '13px', flexShrink: 0,
              background: nm.bg, boxShadow: nm.shadowSm,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={nm.accent} strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: nm.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '3px' }}>
                {isLieutenant ? 'DAG LIEUTENANT' : 'DAG SOLDIER'}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: nm.textPrimary }}>Your Commission Rates</div>
            </div>
          </div>

          {/* Right: Rate chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'L1', rate: `${l1CommPct}%`, sub: 'Direct' },
              { label: 'L2', rate: '3%',           sub: '2nd Line' },
              { label: 'L3', rate: '2%',           sub: '3rd Line' },
            ].map(({ label, rate, sub }) => (
              <div key={label} style={{
                background: nm.bg, boxShadow: nm.shadowSm,
                borderRadius: '12px', padding: '10px 14px',
                textAlign: 'center', minWidth: '60px',
              }}>
                <div style={{ fontSize: '9px', fontWeight: '700', color: nm.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{label} · {sub}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: nm.accent, letterSpacing: '-0.5px', lineHeight: 1 }}>{rate}</div>
              </div>
            ))}
          </div>
        </div>
      </NmCard>


      {/* ── Level breakdown cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
        {[1, 2, 3].map((lvl, i) => {
          const meta = LEVEL_META[lvl];
          const cnt = summary?.byLevel[lvl]?.count || 0;
          const totalAll = (summary?.byLevel[1]?.count || 0) + (summary?.byLevel[2]?.count || 0) + (summary?.byLevel[3]?.count || 0);
          const share = totalAll > 0 ? Math.min(100, (cnt / totalAll) * 100) : 0;
          return (
            <NmCard key={lvl} delay={200 + i * 60} style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: nm.bg, boxShadow: nm.shadowXs, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: meta.color }}>{meta.label}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: nm.textPrimary }}>{meta.title}</div>
                    <div style={{ fontSize: '11px', color: nm.textPrimary, marginTop: '1px' }}>{cnt} transaction{cnt !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 9px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: meta.color }}>{lvl === 1 ? `${l1CommPct}%` : meta.rate}</span>
              </div>
              {/* Transaction share bar */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share</span>
                <span style={{ fontSize: '22px', fontWeight: '900', color: meta.color, letterSpacing: '-1px', lineHeight: 1 }}>{share.toFixed(0)}%</span>
              </div>
              <div style={{ height: '4px', background: nm.bg, borderRadius: '3px', boxShadow: nm.shadowInsetSm, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '3px', background: meta.color, width: `${share}%`, transition: 'width 1s ease' }} />
              </div>
            </NmCard>
          );
        })}
      </div>

      {/* ── Transaction table ── */}
      <NmCard delay={400} hover={false} inset style={{ padding: mob ? '18px 14px' : '28px 32px', overflow: 'visible' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: nm.textPrimary, margin: 0 }}>Rewards Detail</h3>
          {!mob && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textPrimary }}>From</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowInsetSm, fontSize: '12px', color: nm.textPrimary, outline: 'none', cursor: 'pointer' }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: nm.textPrimary }}>To</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowInsetSm, fontSize: '12px', color: nm.textPrimary, outline: 'none', cursor: 'pointer' }} />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); }}
                  style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', background: nm.bg, boxShadow: nm.shadowXs, fontSize: '11px', fontWeight: '700', color: nm.textPrimary, cursor: 'pointer' }}>Clear</button>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Column headers — desktop only */}
          {!mob && (
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 120px 90px 70px 80px 95px', padding: '8px 14px', background: nm.bg, boxShadow: nm.shadowInsetSm, borderRadius: '8px', marginBottom: '4px', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Date &amp; Time</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Buyer</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Product</span>
              <PillPopover value={levelFilter} onChange={setLevelFilter} options={[
                { key: 'all', label: 'Level' },
                { key: '1', label: 'L1 - Direct' },
                { key: '2', label: 'L2 - 2nd' },
                { key: '3', label: 'L3 - 3rd' },
              ]} />
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'right' }}>Sale</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'right' }}>Rate</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: nm.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'right' }}>Rewards</span>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <PillPopover value={statusFilter} onChange={setStatusFilter} options={[
                  { key: 'all', label: 'Status' },
                  { key: 'pending', label: 'Earned' },
                  { key: 'requested', label: 'Requested' },
                  { key: 'paid', label: 'Paid' },
                  { key: 'cancelled', label: 'Cancelled' },
                ]} />
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: nm.textPrimary, margin: 0 }}>No rewards records found</p>
            </div>
          ) : mob ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map((tx, idx) => {
                const lvlMeta = LEVEL_META[tx.commission_level] || LEVEL_META[1];
                const stsMeta = STATUS_META[tx.payment_status] || { label: tx.payment_status, color: nm.textPrimary };
                const commAmt = parseFloat(tx.commission_amount || 0);
                const dateStr = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const buyerLabel = tx.is_self_sale ? 'Self Sale' : tx.buyer_name || tx.buyer_email || '-';
                return (
                  <div key={tx.id || idx} style={{ background: nm.bg, borderRadius: '12px', padding: '12px 14px', boxShadow: nm.shadowXs }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: nm.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{buyerLabel}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '10px', color: nm.textMuted }}>{dateStr} · {tx.product_name || '-'}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: tx.payment_status === 'paid' ? nm.accent : nm.textPrimary }}>
                          {commAmt.toFixed(2)} DGCC
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: lvlMeta.color }}>{lvlMeta.label}</span>
                      <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowXs, color: stsMeta.color }}>{stsMeta.label}</span>
                      <span style={{ fontSize: '9px', fontWeight: '700', color: nm.textMuted, marginLeft: 'auto' }}>{parseFloat(tx.commission_percentage || 0).toFixed(0)}% of {parseFloat(tx.sale_amount || 0).toFixed(2)} DGCC</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (<>{filtered.map((tx, idx) => {
            const lvlMeta = LEVEL_META[tx.commission_level] || LEVEL_META[1];
            const stsMeta = STATUS_META[tx.payment_status] || { label: tx.payment_status, color: nm.textPrimary };
            const dt = new Date(tx.created_at);
            const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const buyerLabel = tx.is_self_sale ? 'Self Sale' : tx.buyer_name || tx.buyer_email || tx.buyer_id?.slice(0, 8) || '-';
            const buyerSub = !tx.is_self_sale && tx.buyer_email ? tx.buyer_email : null;
            const isAdminGrant = tx.product_type === 'ADMIN_GRANT';
            const isDagchainReward = tx.product_type === 'DAGCHAIN_REWARD';
            const saleAmt = parseFloat(tx.sale_amount || 0);
            const commAmt = parseFloat(tx.commission_amount || 0);
            const commColor = tx.payment_status === 'paid' ? nm.accent : nm.textPrimary;

            return (
              <div key={tx.id || idx}
                style={{ display: 'grid', gridTemplateColumns: '150px 1fr 120px 90px 70px 80px 95px', padding: '11px 14px', alignItems: 'center', borderBottom: idx < filtered.length - 1 ? `1px solid ${nm.border}` : 'none', borderRadius: '6px', gap: '4px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Date & Time */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary }}>{dateStr}</div>
                  <div style={{ fontSize: '10px', color: nm.textPrimary, marginTop: '1px', fontWeight: '500' }}>{timeStr}</div>
                </div>

                {/* Buyer */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: nm.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {isAdminGrant ? 'Admin Grant' : isDagchainReward ? 'DAGChain' : buyerLabel}
                  </div>
                  {!isAdminGrant && !isDagchainReward && buyerSub && (
                    <div style={{ fontSize: '10px', color: nm.textPrimary, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{buyerSub}</div>
                  )}
                </div>

                {/* Product */}
                <div style={{ fontSize: '12px', color: nm.textPrimary, fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.product_name || '-'}
                </div>

                {/* Level pill */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {isAdminGrant ? (
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowInsetSm, color: nm.textPrimary, whiteSpace: 'nowrap' }}>Grant</span>
                  ) : (
                    <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 9px', borderRadius: '20px', background: nm.bg, boxShadow: nm.shadowXs, color: lvlMeta.color, whiteSpace: 'nowrap' }}>{lvlMeta.label}</span>
                  )}
                </div>

                {/* Sale Amount */}
                <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: '700', color: nm.textPrimary }}>
                  {saleAmt.toFixed(2)} DGCC
                </div>

                {/* Rate */}
                <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: '700', color: nm.accent }}>
                  {parseFloat(tx.commission_percentage || 0).toFixed(0)}%
                </div>

                {/* Rewards earned */}
                <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: '900', color: commColor, letterSpacing: '-0.3px' }}>
                  {commAmt.toFixed(2)} DGCC
                </div>

                {/* Status pill */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: nm.bg, boxShadow: tx.payment_status === 'paid' ? nm.shadowInsetSm : nm.shadowXs, color: stsMeta.color, whiteSpace: 'nowrap' }}>
                    {stsMeta.label}
                  </span>
                </div>
              </div>
            );
          })}</>)}
        </div>
      </NmCard>
    </div>
  );
}
