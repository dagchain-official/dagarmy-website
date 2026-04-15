"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Award, Save, Edit2, Check, X, Users, Trophy, DollarSign, Crown, Settings,
  Gift, Shield, Lock, Unlock, ArrowRight, Plus, Equal, Sparkles,
  Zap, TrendingUp, Target, Layers, Star, Info, ChevronRight, ArrowDown,
  FileText, Search, Copy, ShoppingCart
} from "lucide-react";

export default function RewardsManagementComprehensive() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('signup');
  const [mounted, setMounted] = useState(false);

  // Fortune 500 distribute state
  const [f500Data, setF500Data] = useState({ distributions: [], activeMemberCount: 0 });
  const [f500Loading, setF500Loading] = useState(false);
  const [distributing, setDistributing] = useState(false);

  // DAG LT Pool state
  const [ltPoolData, setLtPoolData] = useState({ distributions: [], activeMemberCount: 0 });
  const [ltPoolLoading, setLtPoolLoading] = useState(false);
  const [ltDistributing, setLtDistributing] = useState(false);

  // Manual member enrollment state
  const [f500AddEmail, setF500AddEmail] = useState('');
  const [f500AddNotes, setF500AddNotes] = useState('');
  const [f500Adding, setF500Adding] = useState(false);
  const [ltAddEmail, setLtAddEmail] = useState('');
  const [ltAddNotes, setLtAddNotes] = useState('');
  const [ltAdding, setLtAdding] = useState(false);

  // Points Ledger state
  const [ledger, setLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerPage, setLedgerPage] = useState(1);
  const LEDGER_PAGE_SIZE = 50;

  useEffect(() => { fetchConfig(); setTimeout(() => setMounted(true), 50); }, []);

  useEffect(() => {
    if (activeTab === 'ledger' && ledger.length === 0) fetchLedger();
    if (activeTab === 'incentive_pools') { fetchF500Data(); fetchLtPoolData(); }
  }, [activeTab]);

  const fetchF500Data = async () => {
    try {
      setF500Loading(true);
      const res = await fetch('/api/admin/fortune500');
      const data = await res.json();
      if (data.success) setF500Data({ distributions: data.distributions || [], activeMemberCount: data.activeMemberCount || 0 });
    } catch (e) { console.error(e); }
    finally { setF500Loading(false); }
  };

  const handleDistribute = async (distributionId) => {
    if (!confirm('Distribute Fortune 500 funds to all eligible members? This cannot be undone.')) return;
    try {
      setDistributing(true);
      const res = await fetch('/api/admin/fortune500', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distribution_id: distributionId, action: 'distribute' }),
      });
      const data = await res.json();
      if (data.success) { sm('success', data.message); fetchF500Data(); }
      else sm('error', data.error || 'Distribution failed');
    } catch (e) { sm('error', 'Network error'); }
    finally { setDistributing(false); }
  };

  const fetchLtPoolData = async () => {
    try {
      setLtPoolLoading(true);
      const res = await fetch('/api/admin/dag-lt-pool');
      const data = await res.json();
      if (data.success) setLtPoolData({ distributions: data.distributions || [], activeMemberCount: data.activeMemberCount || 0 });
    } catch (e) { console.error(e); }
    finally { setLtPoolLoading(false); }
  };

  const handleLtDistribute = async (distributionId) => {
    if (!confirm('Distribute DAG LT Pool funds to all eligible members? This cannot be undone.')) return;
    try {
      setLtDistributing(true);
      const res = await fetch('/api/admin/dag-lt-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distribution_id: distributionId, action: 'distribute' }),
      });
      const data = await res.json();
      if (data.success) { sm('success', data.message); fetchLtPoolData(); }
      else sm('error', data.error || 'Distribution failed');
    } catch (e) { sm('error', 'Network error'); }
    finally { setLtDistributing(false); }
  };

  const handleAddF500Member = async () => {
    if (!f500AddEmail.trim()) return;
    try {
      setF500Adding(true);
      const res = await fetch('/api/admin/fortune500', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_member', user_email: f500AddEmail.trim(), notes: f500AddNotes.trim() }),
      });
      const data = await res.json();
      if (data.success) { sm('success', data.message); setF500AddEmail(''); setF500AddNotes(''); fetchF500Data(); }
      else sm('error', data.error || 'Enrollment failed');
    } catch (e) { sm('error', 'Network error'); }
    finally { setF500Adding(false); }
  };

  const handleAddLtMember = async () => {
    if (!ltAddEmail.trim()) return;
    try {
      setLtAdding(true);
      const res = await fetch('/api/admin/dag-lt-pool', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_member', user_email: ltAddEmail.trim(), notes: ltAddNotes.trim() }),
      });
      const data = await res.json();
      if (data.success) { sm('success', data.message); setLtAddEmail(''); setLtAddNotes(''); fetchLtPoolData(); }
      else sm('error', data.error || 'Enrollment failed');
    } catch (e) { sm('error', 'Network error'); }
    finally { setLtAdding(false); }
  };

  const fetchLedger = async () => {
    try {
      setLedgerLoading(true);
      const res = await fetch('/api/admin/points-ledger');
      const data = await res.json();
      if (data.transactions) setLedger(data.transactions);
    } catch (e) { console.error(e); }
    finally { setLedgerLoading(false); }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rewards/config');
      const data = await res.json();
      if (data.config) {
        const obj = {};
        data.config.forEach(i => { obj[i.config_key] = i.config_value; });
        // Apply defaults for any keys not yet in DB
        const configDefaults = {
          soldier_signup_bonus: 500, lieutenant_upgrade_price_usd: 149,
          soldier_refers_soldier_join: 500, soldier_refers_soldier_upgrade: 500,
          lieutenant_refers_soldier_join: 1000, lieutenant_refers_soldier_upgrade: 1000,
          soldier_direct_sales_commission: 15, soldier_level2_sales_commission: 3, soldier_level3_sales_commission: 2,
          lieutenant_direct_sales_commission_default: 20, lieutenant_level2_sales_commission: 3, lieutenant_level3_sales_commission: 2,
          soldier_l1_commission_pct: 15, lieutenant_l1_commission_pct: 20, l2_commission_pct: 3, l3_commission_pct: 2,
          spend_pts_per_dollar_soldier: 25, spend_pts_per_dollar_lieutenant: 50,
          task_multiplier_lieutenant: 2,
          self_sale_dag_points_per_dollar: 25, referral_sale_dag_points_per_dollar: 25,
          social_task_lt_bonus_rate: 20, social_task_like_share: 10, social_task_comments_watch: 10,
          social_task_create_shorts: 50, social_task_explainer_video: 100, social_task_subscribe: 150,
          dgcc_points_ratio: 2500,
        };
        Object.keys(configDefaults).forEach(k => { if (obj[k] == null) obj[k] = configDefaults[k]; });
        setConfig(obj);
      }
    } catch (e) { console.error(e); sm('error', 'Failed to load'); }
    finally { setLoading(false); }
  };

  const handleEdit = (s) => {
    setEditingSection(s);
    const ev = {};
    Object.keys(config).forEach(k => { ev[k] = String(config[k] ?? ''); });
    // Ensure all keys have defaults even if missing from DB
    const defaults = {
      soldier_signup_bonus: '500', lieutenant_upgrade_base: '2500', lieutenant_bonus_rate: '20',
      lieutenant_upgrade_price_usd: '149', lieutenant_self_upgrade_bonus: '3000',
      soldier_refers_soldier_join: '500', soldier_refers_soldier_upgrade: '500',
      lieutenant_refers_soldier_join: '1000', lieutenant_refers_soldier_upgrade: '1000',
      max_commission_levels: '3',
      // Commission rates — new tier-based values
      soldier_direct_sales_commission: '15', soldier_level2_sales_commission: '3', soldier_level3_sales_commission: '2',
      lieutenant_direct_sales_commission_default: '20', lieutenant_level2_sales_commission: '3', lieutenant_level3_sales_commission: '2',
      // Social tasks
      social_task_like_share: '10', social_task_comments_watch: '10', social_task_create_shorts: '50',
      social_task_explainer_video: '100', social_task_subscribe: '150', social_task_lt_bonus_rate: '20',
      // Incentive pools
      fortune500_pool_pct: '10', fortune500_enrollment_open: '1',
      dag_lt_pool_pct: '10',
      elite_pool_blockchain_pct: '50', elite_pool_active: '0', elite_pool_activate_date: 'Sep–Oct 2026',
      // Sales DAG points
      self_sale_dag_points_per_dollar: '25', referral_sale_dag_points_per_dollar: '25', sale_dag_points_lieutenant_bonus: '100',
    };
    Object.keys(defaults).forEach(k => { if (!ev[k] && ev[k] !== '0') ev[k] = defaults[k]; });
    setEditValues(ev);
  };
  const handleCancel = () => { setEditingSection(null); setEditValues({}); };
  const sm = (t, x) => { setMessage({ type: t, text: x }); setTimeout(() => setMessage({ type: '', text: '' }), 5000); };
  const ov = (k, v) => { setEditValues(p => ({ ...p, [k]: v })); };
  const g = (k, fb) => editingSection ? (parseInt(editValues[k]) || fb) : (config[k] || fb);

  const handleSave = async (section) => {
    try {
      setSaving(true);
      const u = JSON.parse(localStorage.getItem('dagarmy_user') || '{}');
      if (!u.email) { sm('error', 'Not authenticated'); return; }
      let keys = [];
      if (section === 'signup') {
        // lieutenant_self_upgrade_bonus removed — new arch gives 0 pts on upgrade
        keys = ['soldier_signup_bonus','lieutenant_upgrade_price_usd'];
      } else if (section === 'referral') {
        keys = [
          'soldier_refers_soldier_join','soldier_refers_soldier_upgrade',
          'lieutenant_refers_soldier_join','lieutenant_refers_soldier_upgrade',
        ];
      } else if (section === 'sales') {
        keys = ['soldier_l1_commission_pct','lieutenant_l1_commission_pct','l2_commission_pct','l3_commission_pct'];
      } else if (section === 'social_tasks') {
        keys = ['social_task_like_share','social_task_comments_watch','social_task_create_shorts','social_task_explainer_video','social_task_subscribe','social_task_lt_bonus_rate'];
      } else if (section === 'fortune500') {
        keys = ['fortune500_pool_pct','fortune500_enrollment_open'];
      } else if (section === 'incentive_pools') {
        keys = ['fortune500_pool_pct','fortune500_enrollment_open','dag_lt_pool_pct','elite_pool_blockchain_pct','elite_pool_active','elite_pool_activate_date'];
      } else if (section === 'sales_dag_points') {
        keys = ['self_sale_dag_points_per_dollar','referral_sale_dag_points_per_dollar','sale_dag_points_lieutenant_bonus'];
      } else if (section === 'system') {
        keys = ['ranking_system_enabled_for_soldier','max_commission_levels','dgcc_points_ratio'];
      }
      const STRING_KEYS = ['elite_pool_activate_date'];
      const results = [];
      for (const k of keys) {
        let sendVal;
        if (STRING_KEYS.includes(k)) {
          sendVal = editValues[k] ?? '';
        } else {
          const val = parseInt(editValues[k]);
          sendVal = isNaN(val) ? 0 : val;
        }
        console.log('Saving:', k, '=', sendVal, '(raw:', editValues[k], ')');
        const res = await fetch('/api/rewards/config', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config_key: k, config_value: sendVal, user_email: u.email })
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error('Save failed for', k, ':', res.status, body);
        }
        results.push(res);
      }
      if (results.every(r => r.ok)) { sm('success', 'Saved'); setEditingSection(null); setEditValues({}); fetchConfig(); }
      else { const failed = results.filter(r => !r.ok); sm('error', `${failed.length} update(s) failed - check console`); }
    } catch (e) { console.error(e); sm('error', 'Save failed'); }
    finally { setSaving(false); }
  };

  /* ── BentoCard: exact same as AdminDashboard2 ── */
  const B = useCallback(({ children, style = {}, hover = true, ...props }) => (
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '28px',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative', overflow: 'hidden',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
      ...style
    }}
    onMouseEnter={hover ? e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(-3px)'; } : undefined}
    onMouseLeave={hover ? e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
    {...props}>{children}</div>
  ), [mounted]);

  /* ── Editable input with spinner arrows and current-value pre-fill ── */
  const ri = (configKey, w) => {
    const currentVal = config[configKey] ?? '';
    const displayVal = editValues[configKey] !== undefined ? editValues[configKey] : String(currentVal);
    return (
      <div key={configKey} style={{ display: 'flex', alignItems: 'center', gap: '0', border: '2px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#f8fafc', width: w || '120px', transition: 'border-color 0.2s, box-shadow 0.2s' }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; e.currentTarget.style.background = '#fff'; }}
        onBlurCapture={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#f8fafc'; }}
      >
        <input
          type="number"
          value={displayVal}
          min="0"
          step="1"
          onChange={e => ov(configKey, e.target.value)}
          style={{ flex: 1, padding: '8px 10px', border: 'none', fontSize: '15px', fontWeight: '800', textAlign: 'right', color: '#0f172a', outline: 'none', background: 'transparent', minWidth: 0 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0', flexShrink: 0 }}>
          <button type="button" onClick={() => ov(configKey, String((parseInt(displayVal) || 0) + 1))}
            style={{ padding: '3px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', fontSize: '10px', lineHeight: 1, borderBottom: '1px solid #e2e8f0' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >&#9650;</button>
          <button type="button" onClick={() => ov(configKey, String(Math.max(0, (parseInt(displayVal) || 0) - 1)))}
            style={{ padding: '3px 8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', fontSize: '10px', lineHeight: 1 }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >&#9660;</button>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f6f8fb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 24px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '3px solid #f1f5f9', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'rwSpin 0.8s linear infinite' }} />
        </div>
        <div style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '500' }}>Loading rewards...</div>
      </div>
      <style>{`@keyframes rwSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const br = config.lieutenant_bonus_rate || 20;
  const tabs = [
    { id: 'signup',           label: 'Signup Bonuses',     icon: Gift },
    { id: 'referral',         label: 'Referral Scenarios', icon: Users },
    { id: 'sales',            label: 'Sales Commissions',  icon: DollarSign },
    { id: 'sales_dag_points', label: 'Sales DAG Points',   icon: ShoppingCart },
    { id: 'social_tasks',     label: 'Social Tasks',       icon: Zap },
    { id: 'incentive_pools',  label: 'Incentive Pools',    icon: Layers },
    { id: 'system',           label: 'System',             icon: Settings },
    { id: 'ledger',           label: 'Points Ledger',      icon: FileText },
  ];

  /* ── Section header with edit/save ── */
  const SH = ({ title, desc, section }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0', fontWeight: '450' }}>{desc}</p>
      </div>
      {editingSection === section ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleSave(section)} disabled={saving}
            style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: saving ? 0.6 : 1, transition: 'all 0.2s' }}>
            <Save size={14} />{saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleCancel}
            style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => handleEdit(section)}
          style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', background: '#fff', color: '#0f172a', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', transition: 'all 0.2s' }}>
          <Edit2 size={14} />Edit Values
        </button>
      )}
    </div>
  );

  /* ── Inline value display ── */
  const Val = ({ v, suffix, size, color }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
      <span style={{ fontSize: size || '28px', fontWeight: '800', color: color || '#0f172a', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
      {suffix && <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>{suffix}</span>}
    </div>
  );

  return (
    <div style={{ padding: '32px 36px', width: '100%', background: '#f6f8fb', minHeight: '100vh' }}>
      <style>{`@keyframes rwSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} style={{ color: '#6366f1' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>Rewards Engine</h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0', fontWeight: '450' }}>Configure points, referral bonuses, rankings & commissions</p>
          </div>
        </div>
      </div>

      {/* ── Message ── */}
      {message.text && (
        <div style={{ padding: '12px 18px', marginBottom: '16px', borderRadius: '14px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {message.type === 'success' ? <Check size={16} style={{ color: '#16a34a' }} /> : <X size={16} style={{ color: '#dc2626' }} />}
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{message.text}</span>
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#fff', borderRadius: '14px', padding: '4px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '10px 18px', borderRadius: '10px', border: 'none',
            background: activeTab === t.id ? '#0f172a' : 'transparent',
            color: activeTab === t.id ? '#fff' : '#94a3b8',
            fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s', flex: 1, justifyContent: 'center',
          }}>
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SIGNUP TAB                                         */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'signup' && (<>
        <SH title="Self Signup & Upgrade Bonuses" desc="Points awarded automatically when users sign up or upgrade their tier" section="signup" />

        {/* Two side-by-side cards: Soldier & Lieutenant */}
        {(() => {
          const s = g('soldier_signup_bonus', 500);
          const price = editingSection === 'signup' ? (parseInt(editValues.lieutenant_upgrade_price_usd) || 149) : (config.lieutenant_upgrade_price_usd || 149);
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch', marginBottom: '16px' }}>

              {/* ── DAG SOLDIER Card ── */}
              <B style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={20} style={{ color: '#10b981' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG SOLDIER</h3>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Free tier — auto on registration</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', background: '#f0fdf4', color: '#10b981', textTransform: 'uppercase' }}>Auto-triggered</span>
                  </div>
                </div>

                {/* ROW 1 — Signup Bonus */}
                <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Signup Bonus</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: '#f0fdf4', color: '#10b981', textTransform: 'uppercase' }}>Instant</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Credited immediately on registration</span>
                  </div>
                  {editingSection === 'signup' ? ri('soldier_signup_bonus') : (
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>+{s} pts</span>
                  )}
                </div>

                {/* ROW 2 — Upgrade Cost (matching LT's "Tier Upgrade Payment" row) */}
                <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#f8fafc' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Upgrade Cost</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: '#f0fdf4', color: '#10b981', textTransform: 'uppercase' }}>Free</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>No payment required — free tier</span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>$0</span>
                </div>

                {/* ROW 3 — Tier Benefits */}
                <div style={{ padding: '14px 24px', flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Tier Benefits</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { icon: '📈', label: 'L1 Commission', value: '15%' },
                      { icon: '💎', label: 'Spend Pts Rate', value: '25 pts/$' },
                      { icon: '⚡', label: 'Task Multiplier', value: '1× points' },
                    ].map((ben, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '14px' }}>{ben.icon}</span>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{ben.label}</p>
                          <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>{ben.value}</p>
                        </div>
                      </div>
                    ))}
                    {/* Reward Pool — full width */}
                    <div style={{ gridColumn: 'span 2', padding: '10px 12px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.4px' }}>🏆 Reward Pool</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Fortune 500 Reward Pool</span>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>🟢 Live</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ padding: '0 24px 14px' }}>
                  <div style={{ height: '6px', borderRadius: '6px', background: '#10b981' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }} />
                    <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>Signup: {s} pts</span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.06)', borderRadius: '0 0 20px 20px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Soldier Points</span>
                  <Val v={s} suffix="pts" size="22px" />
                </div>
              </B>

              {/* ── DAG LIEUTENANT Card ── */}
              <B style={{ padding: '0', display: 'flex', flexDirection: 'column', border: '1.5px solid #e0e7ff' }}>

                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Crown size={20} color="#fff" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG LIEUTENANT</h3>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Paid upgrade — no DAG Points awarded</p>
                      </div>
                    </div>
                    {editingSection === 'signup' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>$</span>
                        <input type="number" min="1" value={editValues.lieutenant_upgrade_price_usd ?? '149'} onChange={e => ov('lieutenant_upgrade_price_usd', e.target.value)}
                          style={{ width: '70px', padding: '5px 10px', borderRadius: '8px', border: '1.5px solid #6366f1', fontSize: '14px', fontWeight: '800', color: '#0f172a', textAlign: 'center', outline: 'none' }} />
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>USD</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', background: '#0f172a', color: '#fff', letterSpacing: '0.3px' }}>${price} USD</span>
                    )}
                  </div>
                </div>

                {/* ROW 1 — Previous Signup Bonus (greyed, lines up with Soldier's "Signup Bonus") */}
                <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fafbfc' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textDecoration: 'line-through' }}>Soldier Signup Bonus</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: '#f1f5f9', color: '#94a3b8', textTransform: 'uppercase' }}>Previous</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Already credited at registration</span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#cbd5e1', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>{s} pts</span>
                </div>

                {/* ROW 2 — Tier Upgrade Payment (lines up with Soldier's "Upgrade Cost") */}
                <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Tier Upgrade Payment</span>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: '#eef2ff', color: '#6366f1', textTransform: 'uppercase' }}>Stripe</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Pays for the LT tier — no DAG Points issued</span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>0 pts</span>
                </div>

                {/* ROW 3 — Tier Benefits (lines up with Soldier's benefits grid) */}
                <div style={{ padding: '14px 24px', flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Tier Benefits Unlocked</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { icon: '📈', label: 'L1 Commission', value: '20% (vs 15%)' },
                      { icon: '💎', label: 'Spend Pts Rate', value: '50 pts/$ (vs 25)' },
                      { icon: '⚡', label: 'Task Multiplier', value: '2× points' },
                    ].map((ben, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '14px' }}>{ben.icon}</span>
                        <div>
                          <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{ben.label}</p>
                          <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>{ben.value}</p>
                        </div>
                      </div>
                    ))}
                    {/* Reward Pools — full width */}
                    <div style={{ gridColumn: 'span 2', padding: '10px 12px', borderRadius: '10px', background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                      <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>🏆 Reward Pools</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>1. Fortune 500 Reward Pool</span>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>🟢 Live</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>2. DAG Army Elite Pool</span>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }}>⏳ Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ padding: '0 24px 14px' }}>
                  <div style={{ height: '6px', borderRadius: '6px', background: '#e2e8f0' }} />
                  <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#e2e8f0' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>Prev signup: {s} pts</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#6366f1' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>On upgrade: +0 pts</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.06)', borderRadius: '0 0 20px 20px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pts Awarded on Upgrade</span>
                  <Val v={0} suffix="pts" size="22px" color="#94a3b8" />
                </div>
              </B>
            </div>
          );
        })()}

        {/* Info note */}
        <B style={{ padding: '18px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }} hover={false}>
          <Info size={16} style={{ color: '#94a3b8', marginTop: '1px', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', margin: 0 }}>
            Upgrading to DAG LIEUTENANT is a <strong style={{ color: '#0f172a' }}>paid tier change (${"$"}{config.lieutenant_upgrade_price_usd || 149})</strong> — it does <strong style={{ color: '#0f172a' }}>not</strong> award additional DAG Points. The benefit is an <strong style={{ color: '#6366f1' }}>improved commission rate (20%)</strong>, <strong style={{ color: '#6366f1' }}>2× task multiplier</strong>, and <strong style={{ color: '#6366f1' }}>Elite Pool eligibility</strong> at MainNet.
          </p>
        </B>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* REFERRAL TAB                                       */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'referral' && (<>
        <SH title="Referral Point Rewards" desc="Points earned by the referrer (upline) when their referrals join or upgrade" section="referral" />

        {/* Scenario cards - each one is different */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* Scenario 1: Simple - just one value */}
          <B style={{ padding: '0' }}>
            <div style={{ padding: '22px 24px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#10b981', border: '2px solid #dcfce7' }}>1</div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Soldier refers Soldier</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Points to upline when referral joins</p>
                </div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: '#f0fdf4', color: '#10b981', textTransform: 'uppercase' }}>On Join</span>
            </div>
            {/* Flow visualization */}
            <div style={{ padding: '0 24px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '5px 12px', borderRadius: '8px', background: '#f8fafc', fontSize: '11px', fontWeight: '600', color: '#64748b', border: '1px solid #f1f5f9' }}>New Soldier</div>
              <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
              <div style={{ padding: '5px 12px', borderRadius: '8px', background: '#0f172a', fontSize: '11px', fontWeight: '600', color: '#fff' }}>Upline</div>
              <ChevronRight size={14} style={{ color: '#10b981' }} />
              {editingSection === 'referral' ? ri('soldier_refers_soldier_join', '80px') : (
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>+{g('soldier_refers_soldier_join',500)} pts</span>
              )}
            </div>
            <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.04)', borderRadius: '0 0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total to Upline</span>
              <Val v={g('soldier_refers_soldier_join',500)} suffix="pts" size="20px" />
            </div>
          </B>

          {/* Scenario 2: Cumulative */}
          {(() => {
            const j = g('soldier_refers_soldier_join',500), u = g('soldier_refers_soldier_upgrade',2500), total = j+u;
            return (
              <B style={{ padding: '0' }}>
                <div style={{ padding: '22px 24px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#0284c7', border: '2px solid #bae6fd' }}>2</div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Referral upgrades to DAG LIEUTENANT</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Additional points when referral upgrades</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: '#e0f2fe', color: '#0284c7', textTransform: 'uppercase' }}>Upgrade</span>
                </div>
                <div style={{ padding: '0 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textDecoration: 'line-through' }}>Already credited (Scenario 1)</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1', textDecoration: 'line-through' }}>{j} pts</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Referral Upgrade Bonus</span>
                      <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '100px', background: '#e0f2fe', color: '#0284c7', textTransform: 'uppercase' }}>New</span>
                    </div>
                    {editingSection === 'referral' ? ri('soldier_refers_soldier_upgrade') : (
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>+{u} pts</span>
                    )}
                  </div>
                </div>
                <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.04)', borderRadius: '0 0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cumulative</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1' }}>{j}</span>
                      <Plus size={8} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#0284c7' }}>{u}</span>
                    </div>
                  </div>
                  <Val v={total} suffix="pts" size="20px" />
                </div>
              </B>
            );
          })()}

          {/* Scenario 3: LT bonus */}
          {(() => {
            const base = g('soldier_refers_soldier_join',500), bonus = Math.round((base*br)/100), total = base+bonus;
            return (
              <B style={{ padding: '0' }}>
                <div style={{ padding: '22px 24px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#6366f1', border: '2px solid #c7d2fe' }}>3</div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG LIEUTENANT refers Soldier</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Includes {br}% DAG LIEUTENANT bonus on join</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: '#eef2ff', color: '#6366f1', textTransform: 'uppercase' }}>DAG LIEUTENANT Join</span>
                </div>
                <div style={{ padding: '0 24px 12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Base Join Bonus</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>+{base} pts</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{br}% DAG LIEUTENANT Bonus</span>
                      <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '100px', background: '#f5f3ff', color: '#8b5cf6', textTransform: 'uppercase' }}>DAG LIEUTENANT Perk</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#8b5cf6' }}>+{bonus} pts</span>
                  </div>
                </div>
                <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.04)', borderRadius: '0 0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To Upline DAG LIEUTENANT</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#10b981' }}>{base}</span>
                      <Plus size={8} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#8b5cf6' }}>{bonus}</span>
                    </div>
                  </div>
                  <Val v={total} suffix="pts" size="20px" />
                </div>
              </B>
            );
          })()}

          {/* Scenario 4: Full breakdown */}
          {(() => {
            const jb=g('soldier_refers_soldier_join',500), jbn=Math.round((jb*br)/100);
            const ub=g('soldier_refers_soldier_upgrade',2500), ubn=Math.round((ub*br)/100);
            const total=jb+jbn+ub+ubn;
            return (
              <B style={{ padding: '0' }}>
                <div style={{ padding: '22px 24px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#9333ea', border: '2px solid #e9d5ff' }}>4</div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG LIEUTENANT ref upgrades to DAG LIEUTENANT</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Includes {br}% DAG LIEUTENANT bonus on upgrade</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: '#faf5ff', color: '#9333ea', textTransform: 'uppercase' }}>Full</span>
                </div>
                <div style={{ padding: '0 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textDecoration: 'line-through' }}>Already credited (Sc. 3): {jb}+{jbn}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1', textDecoration: 'line-through' }}>{jb+jbn} pts</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Base Upgrade Bonus</span>
                      <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '100px', background: '#e0f2fe', color: '#0284c7', textTransform: 'uppercase' }}>New</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>+{ub} pts</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{br}% DAG LIEUTENANT Bonus</span>
                      <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '100px', background: '#f5f3ff', color: '#8b5cf6', textTransform: 'uppercase' }}>DAG LIEUTENANT Perk</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#8b5cf6' }}>+{ubn} pts</span>
                  </div>
                </div>
                <div style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.04)', borderRadius: '0 0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cumulative to DAG LIEUTENANT</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1', textDecoration: 'line-through' }}>{jb+jbn}</span>
                      <Plus size={8} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#0284c7' }}>{ub}</span>
                      <Plus size={8} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#8b5cf6' }}>{ubn}</span>
                    </div>
                  </div>
                  <Val v={total} suffix="pts" size="20px" />
                </div>
              </B>
            );
          })()}
        </div>

        <B style={{ padding: '18px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }} hover={false}>
          <Info size={16} style={{ color: '#94a3b8', marginTop: '1px', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', margin: 0 }}>
            Every referral reward is recorded as separate transactions. DAG LIEUTENANT uplines receive the <strong style={{ color: '#0f172a' }}>base amount</strong> plus an additional <strong style={{ color: '#8b5cf6' }}>{br}% DAG LIEUTENANT Bonus</strong>. The bonus rate is configured in the Signup tab.
          </p>
        </B>
      </>)}


      {/* ═══════════════════════════════════════════════════ */}
      {/* SALES TAB                                          */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'sales' && (<>
        <SH title="Sales Commissions" desc="USD commission percentages for product sales — applicable to both DAG SOLDIER and DAG LIEUTENANT" section="sales" />

        {/* Soldier Commissions */}
        <B style={{ padding: '0', marginBottom: '16px' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>DAG SOLDIER Commissions</h4>
          </div>
          {[
            ['Soldier Direct Sales','Level 1 — flat 15% commission (Soldier tier)','soldier_l1_commission_pct',DollarSign,'#10b981','#f0fdf4'],
            ['Soldier Level 2 Commission','2nd level downline','l2_commission_pct',TrendingUp,'#059669','#ecfdf5'],
            ['Soldier Level 3 Commission','3rd level downline','l3_commission_pct',TrendingUp,'#047857','#d1fae5'],
          ].map(([t,d,k,Icon,color,bg], i) => {
            const val = editingSection === 'sales' ? editValues[k] : config[k];
            const soldierDefaults = { soldier_l1_commission_pct: 15, l2_commission_pct: 3, l3_commission_pct: 2 };
            const displayVal = val != null ? parseFloat(val) : (soldierDefaults[k] ?? 0);
            return (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr auto',
                gap: '14px', alignItems: 'center',
                padding: '16px 24px',
                borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{t}</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>{d}</p>
                </div>
                {editingSection === 'sales' ? ri(k, '80px') : <Val v={displayVal} suffix="%" size="20px" />}
              </div>
            );
          })}
        </B>

        {/* Lieutenant Commissions */}
        <B style={{ padding: '0' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#0ea5e9', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>DAG LIEUTENANT Commissions</h4>
          </div>
          {[
            ['Lieutenant Direct Sales','Level 1 — flat 20% commission (Lieutenant tier)','lieutenant_l1_commission_pct',DollarSign,'#0ea5e9','#e0f2fe'],
            ['DAG LIEUTENANT Level 2 Commission','2nd level downline (shared rate)','l2_commission_pct',TrendingUp,'#6366f1','#eef2ff'],
            ['DAG LIEUTENANT Level 3 Commission','3rd level downline (shared rate)','l3_commission_pct',TrendingUp,'#8b5cf6','#f5f3ff'],
          ].map(([t,d,k,Icon,color,bg], i) => {
            const ltDefaults = { lieutenant_l1_commission_pct: 20, l2_commission_pct: 3, l3_commission_pct: 2 };
            const val = editingSection === 'sales' ? editValues[k] : config[k];
            const displayVal = val != null ? parseFloat(val) : (ltDefaults[k] ?? 0);
            return (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr auto',
                gap: '14px', alignItems: 'center',
                padding: '16px 24px',
                borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{t}</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>{d}</p>
                </div>
                {editingSection === 'sales' ? ri(k, '80px') : <Val v={displayVal} suffix="%" size="20px" />}
              </div>
            );
          })}
        </B>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* SOCIAL TASKS TAB                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'social_tasks' && (<>
        <SH title="Social Media Task DAG Points" desc="Base DAG Points awarded per social media task category" section="social_tasks" />

        {/* Explanation card */}
        <B style={{ marginBottom: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }} hover={false}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={18} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
              <strong style={{ color: '#0f172a' }}>DAG Point Mechanism:</strong> All users (DAG SOLDIER) earn the base DAG Points per task.
              <br /><strong style={{ color: '#8b5cf6' }}>DAG LIEUTENANT</strong> members get an additional <strong style={{ color: '#0f172a' }}>{config.social_task_lt_bonus_rate ?? 20}% bonus</strong> on base points.
              <br /><strong style={{ color: '#6366f1' }}>Ranked LT members</strong> get an additional rank % bonus on base points (same as referral rank bonuses: INITIATOR 10% ... MYTHIC 100%).
              <br />Example: Subscribe task (150 pts) for a DAG LIEUTENANT with INITIATOR rank = 150 + 30 (20% LT) + 15 (10% rank) = <strong style={{ color: '#0f172a' }}>195 DAG Points</strong>.
            </div>
          </div>
        </B>

        {/* Task categories */}
        <B style={{ padding: '0' }}>
          {(() => {
            const socialDefaults = { social_task_like_share: 10, social_task_comments_watch: 10, social_task_create_shorts: 50, social_task_explainer_video: 100, social_task_subscribe: 150 };
            const ltRate = editingSection === 'social_tasks' ? (parseInt(editValues.social_task_lt_bonus_rate) || 20) : (config.social_task_lt_bonus_rate ?? 20);
            return [
              ['LIKE & SHARE', 'Share & Like Post', 'social_task_like_share', ArrowRight, '#10b981', '#f0fdf4'],
              ['COMMENTS & WATCH VIDEO', 'Meaningful comments on project content', 'social_task_comments_watch', ChevronRight, '#0ea5e9', '#e0f2fe'],
              ['CREATE SHORTS', 'Create Shorts', 'social_task_create_shorts', Sparkles, '#8b5cf6', '#f5f3ff'],
              ['EXPLAINER VIDEO', 'Make Explainer Video min (3min)', 'social_task_explainer_video', Star, '#ec4899', '#fdf2f8'],
              ['SUBSCRIBE', 'Subscribe Channels', 'social_task_subscribe', Plus, '#f97316', '#fff7ed'],
            ].map(([t, d, k, Icon, color, bg], i) => {
              const val = editingSection === 'social_tasks' ? (parseInt(editValues[k]) || 0) : (config[k] ?? socialDefaults[k] ?? 0);
              const ltBonus = Math.round((val * ltRate) / 100);
              return (
                <div key={k} style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr 120px auto',
                  gap: '14px', alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: i < 4 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{t}</h4>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>{d}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: '#8b5cf6' }}>LT: +{ltBonus} pts</span>
                  </div>
                  {editingSection === 'social_tasks' ? ri(k) : <Val v={val} suffix="pts" size="20px" />}
                </div>
              );
            });
          })()}
        </B>

        {/* LT Bonus Rate */}
        <B style={{ marginTop: '16px', padding: '0' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '40px 1fr auto',
            gap: '14px', alignItems: 'center', padding: '16px 24px',
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} style={{ color: '#6366f1' }} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG LIEUTENANT Bonus Rate</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>Extra % on base social task points for DAG LIEUTENANT members</p>
            </div>
            {editingSection === 'social_tasks' ? ri('social_task_lt_bonus_rate', '80px') : <Val v={config.social_task_lt_bonus_rate ?? 20} suffix="%" size="20px" />}
          </div>
        </B>

        {/* Example calculations */}
        <B style={{ marginTop: '16px', padding: '20px 24px' }} hover={false}>
          {(() => {
            const subPts = config.social_task_subscribe ?? 150;
            const ltRate = config.social_task_lt_bonus_rate ?? 20;
            const ltB = Math.round((subPts * ltRate) / 100);
            const rankB10 = Math.round((subPts * 10) / 100);
            const rankB100 = Math.round((subPts * 100) / 100);
            return (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px' }}>Example: Subscribe Task ({subPts} base pts)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>DAG Soldier</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{subPts} <span style={{ fontSize: '11px', color: '#94a3b8' }}>pts</span></div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Base only</div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '10px', background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', marginBottom: '4px' }}>DAG Lieutenant</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{subPts + ltB} <span style={{ fontSize: '11px', color: '#94a3b8' }}>pts</span></div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{subPts} + {ltB} ({ltRate}% LT)</div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '10px', background: '#fefce8', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', marginBottom: '4px' }}>LT + MYTHIC (100%)</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{subPts + ltB + rankB100} <span style={{ fontSize: '11px', color: '#94a3b8' }}>pts</span></div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{subPts} + {ltB} + {rankB100} (100% rank)</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </B>
      </>)}


      {/* ═══════════════════════════════════════════════════ */}
      {/* INCENTIVE POOLS TAB                                */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'incentive_pools' && (<>
        <SH title="Incentive Pools" desc="All reward pool programs — Fortune 500, DAG LT Pool, and DAG Army Elite Pool" section="incentive_pools" />

        {/* Overview banner */}
        <B style={{ marginBottom: '20px', background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', border: 'none' }} hover={false}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            {[
              { label: 'Fortune 500 Pool', sub: '10% DAGGPT revenue / month', color: '#a78bfa', eligible: 'Soldiers & LTs with $500+ spend' },
              { label: 'DAG LT Pool', sub: '10% DAGGPT revenue / month', color: '#34d399', eligible: 'LTs who recruited 3 LT directs in 30 days' },
              { label: 'DAG Army Elite Pool', sub: '50% DAGCHAIN tx fees', color: '#fbbf24', eligible: 'All DAG Lieutenants — MainNet launch' },
            ].map(p => (
              <div key={p.label}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: p.color, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{p.label}</p>
                <p style={{ fontSize: '13px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>{p.sub}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{p.eligible}</p>
              </div>
            ))}
          </div>
        </B>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>

          {/* ════════════════════════════════════════
              POOL 1 — FORTUNE 500
          ════════════════════════════════════════ */}
          {(() => {
            const poolPct = config.fortune500_pool_pct ?? 10;
            return (
              <B style={{ padding: '0', border: '1.5px solid #c4b5fd' }}>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#faf5ff,#ede9fe)', borderRadius: '18px 18px 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={22} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#4c1d95', margin: 0 }}>Fortune 500 Pool</h3>
                      <p style={{ fontSize: '11px', color: '#6d28d9', margin: '2px 0 0' }}>{poolPct}% of monthly DAGGPT revenue — split equally among eligible members</p>
                    </div>
                  </div>
                  <div style={{ padding: '5px 14px', borderRadius: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '11px', fontWeight: '700', color: '#059669' }}>ACTIVE</div>
                </div>

                {/* Eligibility condition */}
                <div style={{ padding: '16px 24px', background: '#fefce8', borderBottom: '1px solid #fde68a', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Info size={15} style={{ color: '#d97706', flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>
                    <strong>Eligibility condition (updated):</strong> DAG Soldiers and DAG Lieutenants are enrolled automatically — but only those who have spent <strong>at least $500</strong> in the ecosystem (Validator Nodes, Storage Nodes, DAG Lieutenant upgrade, or DAGGPT credit purchases).
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Pool %</p>
                    {editingSection === 'incentive_pools' ? ri('fortune500_pool_pct', '90px') : <p style={{ fontSize: '22px', fontWeight: '800', color: '#7c3aed', margin: 0 }}>{poolPct}<span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>%</span></p>}
                  </div>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Eligible Members</p>
                    {f500Loading ? <div style={{ fontSize: '13px', color: '#94a3b8' }}>Loading...</div> : <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{f500Data.activeMemberCount.toLocaleString()}</p>}
                  </div>
                  <div style={{ padding: '18px 24px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Enrollment Open</p>
                    {editingSection === 'incentive_pools' ? (
                      <select value={editValues.fortune500_enrollment_open ?? '1'} onChange={e => ov('fortune500_enrollment_open', e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: '#f8fafc', outline: 'none', color: '#334155' }}>
                        <option value="1">Open</option><option value="0">Closed</option>
                      </select>
                    ) : <p style={{ fontSize: '22px', fontWeight: '800', color: parseInt(config.fortune500_enrollment_open ?? 1) ? '#059669' : '#94a3b8', margin: 0 }}>{parseInt(config.fortune500_enrollment_open ?? 1) ? 'OPEN' : 'CLOSED'}</p>}
                  </div>
                </div>

                {/* Distribution table */}
                <div style={{ padding: '0' }}>
                  {f500Loading ? (
                    <div style={{ padding: '32px', textAlign: 'center' }}>
                      <div style={{ width: '28px', height: '28px', border: '3px solid #f1f5f9', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'rwSpin 0.8s linear infinite', margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Loading distributions...</p>
                    </div>
                  ) : f500Data.distributions.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      <Trophy size={28} style={{ marginBottom: '10px', opacity: 0.3, display: 'block', margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>No distributions yet — DAGGPT needs to report monthly revenue first.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr 140px 160px', padding: '8px 20px', background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        {['Period','DAGGPT Revenue','Pool Amount','Members','Per Member','Action'].map((h, i) => (
                          <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i >= 4 ? 'right' : 'left' }}>{h}</span>
                        ))}
                      </div>
                      {f500Data.distributions.map((dist, idx) => {
                        const isPending = dist.status === 'pending';
                        const isDone = dist.status === 'distributed';
                        const statusColor = isDone ? '#10b981' : isPending ? '#f59e0b' : '#94a3b8';
                        const statusBg = isDone ? '#f0fdf4' : isPending ? '#fffbeb' : '#f8fafc';
                        return (
                          <div key={dist.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr 140px 160px', padding: '14px 20px', alignItems: 'center', borderBottom: idx < f500Data.distributions.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{dist.period}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>${parseFloat(dist.total_daggpt_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#7c3aed' }}>${parseFloat(dist.pool_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{(dist.member_count || 0).toLocaleString()}</span>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textAlign: 'right' }}>${parseFloat(dist.per_member_amount || 0).toFixed(4)}</span>
                            <div style={{ textAlign: 'right' }}>
                              {isPending ? (
                                <button onClick={() => handleDistribute(dist.id)} disabled={distributing}
                                  style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: distributing ? '#e2e8f0' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: distributing ? '#94a3b8' : '#fff', fontSize: '12px', fontWeight: '700', cursor: distributing ? 'not-allowed' : 'pointer' }}>
                                  {distributing ? 'Distributing...' : 'Distribute'}
                                </button>
                              ) : (
                                <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', background: statusBg, color: statusColor, textTransform: 'uppercase' }}>{dist.status}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', background: '#f8fafc' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                    <strong style={{ color: '#0f172a' }}>Disbursement:</strong> When DAGGPT POSTs monthly revenue to <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>/api/pools/daggpt-revenue</code>, a pending distribution record is created automatically.
                    Admin clicks <strong>Distribute</strong> to release equal shares to all {f500Data.activeMemberCount} eligible members (those with $500+ ecosystem spend).
                  </p>
                </div>

                {/* Manual enrollment */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', background: '#fff', borderRadius: '0 0 18px 18px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Manually Enroll a Member</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 5px' }}>User Email</p>
                      <input type="email" value={f500AddEmail} onChange={e => setF500AddEmail(e.target.value)}
                        placeholder="member@email.com"
                        onKeyDown={e => e.key === 'Enter' && handleAddF500Member()}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '500', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                        onFocus={e => e.target.style.borderColor = '#7c3aed'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    <div style={{ flex: '1', minWidth: '160px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 5px' }}>Notes (optional)</p>
                      <input type="text" value={f500AddNotes} onChange={e => setF500AddNotes(e.target.value)}
                        placeholder="e.g. Override eligibility"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '500', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                        onFocus={e => e.target.style.borderColor = '#7c3aed'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    <button onClick={handleAddF500Member} disabled={f500Adding || !f500AddEmail.trim()}
                      style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: f500Adding || !f500AddEmail.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: f500Adding || !f500AddEmail.trim() ? '#94a3b8' : '#fff', fontSize: '13px', fontWeight: '700', cursor: f500Adding || !f500AddEmail.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} />{f500Adding ? 'Adding...' : 'Add Member'}
                    </button>
                  </div>
                </div>
              </B>
            );
          })()}

          {/* ════════════════════════════════════════
              POOL 2 — DAG LT POOL
          ════════════════════════════════════════ */}
          {(() => {
            const ltPoolPct = config.dag_lt_pool_pct ?? 10;
            return (
              <B style={{ padding: '0', border: '1.5px solid #6ee7b7' }}>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#f0fdf4,#d1fae5)', borderRadius: '18px 18px 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#059669,#047857)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={22} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#064e3b', margin: 0 }}>DAG LT Pool</h3>
                      <p style={{ fontSize: '11px', color: '#047857', margin: '2px 0 0' }}>{ltPoolPct}% of monthly DAGGPT revenue — for qualifying DAG Lieutenants</p>
                    </div>
                  </div>
                  <div style={{ padding: '5px 14px', borderRadius: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '11px', fontWeight: '700', color: '#059669' }}>ACTIVE</div>
                </div>

                {/* Eligibility condition */}
                <div style={{ padding: '16px 24px', background: '#ecfdf5', borderBottom: '1px solid #a7f3d0', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Info size={15} style={{ color: '#059669', flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ fontSize: '12px', color: '#064e3b', lineHeight: 1.6 }}>
                    <strong>Eligibility condition:</strong> The user must have <strong>upgraded to DAG Lieutenant</strong> themselves AND have <strong>3 direct referrals who also upgraded to DAG Lieutenant</strong> — all within a <strong>30-day window</strong> from the user's own upgrade date.
                    Only the qualifying LT earns from this pool (not the 3 referred LTs).
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Pool %</p>
                    {editingSection === 'incentive_pools' ? ri('dag_lt_pool_pct', '90px') : <p style={{ fontSize: '22px', fontWeight: '800', color: '#059669', margin: 0 }}>{ltPoolPct}<span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>%</span></p>}
                  </div>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Eligible Members</p>
                    {ltPoolLoading ? <div style={{ fontSize: '13px', color: '#94a3b8' }}>Loading...</div> : <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{ltPoolData.activeMemberCount.toLocaleString()}</p>}
                  </div>
                  <div style={{ padding: '18px 24px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Qualification Window</p>
                    <p style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>30 <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>days</span></p>
                  </div>
                </div>

                {/* Distribution table */}
                <div style={{ padding: '0' }}>
                  {ltPoolLoading ? (
                    <div style={{ padding: '32px', textAlign: 'center' }}>
                      <div style={{ width: '28px', height: '28px', border: '3px solid #f1f5f9', borderTop: '3px solid #059669', borderRadius: '50%', animation: 'rwSpin 0.8s linear infinite', margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Loading distributions...</p>
                    </div>
                  ) : ltPoolData.distributions.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      <Users size={28} style={{ marginBottom: '10px', opacity: 0.3, display: 'block', margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>No distributions yet — DAGGPT needs to report monthly revenue first.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr 140px 160px', padding: '8px 20px', background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        {['Period','DAGGPT Revenue','Pool Amount','Members','Per Member','Action'].map((h, i) => (
                          <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i >= 4 ? 'right' : 'left' }}>{h}</span>
                        ))}
                      </div>
                      {ltPoolData.distributions.map((dist, idx) => {
                        const isPending = dist.status === 'pending';
                        const isDone = dist.status === 'distributed';
                        const statusColor = isDone ? '#10b981' : isPending ? '#f59e0b' : '#94a3b8';
                        const statusBg = isDone ? '#f0fdf4' : isPending ? '#fffbeb' : '#f8fafc';
                        return (
                          <div key={dist.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr 140px 160px', padding: '14px 20px', alignItems: 'center', borderBottom: idx < ltPoolData.distributions.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{dist.period}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>${parseFloat(dist.total_daggpt_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#059669' }}>${parseFloat(dist.pool_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{(dist.member_count || 0).toLocaleString()}</span>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textAlign: 'right' }}>${parseFloat(dist.per_member_amount || 0).toFixed(4)}</span>
                            <div style={{ textAlign: 'right' }}>
                              {isPending ? (
                                <button onClick={() => handleLtDistribute(dist.id)} disabled={ltDistributing}
                                  style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: ltDistributing ? '#e2e8f0' : 'linear-gradient(135deg,#059669,#047857)', color: ltDistributing ? '#94a3b8' : '#fff', fontSize: '12px', fontWeight: '700', cursor: ltDistributing ? 'not-allowed' : 'pointer' }}>
                                  {ltDistributing ? 'Distributing...' : 'Distribute'}
                                </button>
                              ) : (
                                <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', background: statusBg, color: statusColor, textTransform: 'uppercase' }}>{dist.status}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', background: '#f0fdf4' }}>
                  <p style={{ fontSize: '12px', color: '#064e3b', margin: 0, lineHeight: 1.6 }}>
                    <strong style={{ color: '#0f172a' }}>Disbursement:</strong> When DAGGPT reports monthly revenue, 10% is automatically allocated to this pool.
                    Eligibility is re-evaluated monthly — any LT who qualified (self + 3 direct LT upgrades within 30 days of their own upgrade) appears as an eligible member.
                    Admin clicks <strong>Distribute</strong> to release equal shares to {ltPoolData.activeMemberCount} qualified members.
                  </p>
                </div>

                {/* Manual enrollment */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #a7f3d0', background: '#fff', borderRadius: '0 0 18px 18px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Manually Enroll a Member</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 5px' }}>User Email</p>
                      <input type="email" value={ltAddEmail} onChange={e => setLtAddEmail(e.target.value)}
                        placeholder="member@email.com"
                        onKeyDown={e => e.key === 'Enter' && handleAddLtMember()}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '500', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                        onFocus={e => e.target.style.borderColor = '#059669'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    <div style={{ flex: '1', minWidth: '160px' }}>
                      <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 5px' }}>Notes (optional)</p>
                      <input type="text" value={ltAddNotes} onChange={e => setLtAddNotes(e.target.value)}
                        placeholder="e.g. Override eligibility"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '500', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                        onFocus={e => e.target.style.borderColor = '#059669'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    <button onClick={handleAddLtMember} disabled={ltAdding || !ltAddEmail.trim()}
                      style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: ltAdding || !ltAddEmail.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#059669,#047857)', color: ltAdding || !ltAddEmail.trim() ? '#94a3b8' : '#fff', fontSize: '13px', fontWeight: '700', cursor: ltAdding || !ltAddEmail.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} />{ltAdding ? 'Adding...' : 'Add Member'}
                    </button>
                  </div>
                </div>
              </B>
            );
          })()}

          {/* ════════════════════════════════════════
              POOL 3 — DAG ARMY ELITE POOL
          ════════════════════════════════════════ */}
          <B style={{ padding: '0', border: '1.5px solid #c4b5fd', background: 'linear-gradient(135deg,#faf5ff 0%,#ede9fe 100%)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(196,181,253,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '18px 18px 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={22} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#4c1d95', margin: 0 }}>DAG Army Elite Pool</h3>
                  <p style={{ fontSize: '11px', color: '#6d28d9', margin: '2px 0 0' }}>50% of DAGCHAIN blockchain transaction fees — all DAG Lieutenants, forever</p>
                </div>
              </div>
              {editingSection === 'incentive_pools' ? (
                <select value={editValues.elite_pool_active ?? '0'} onChange={e => ov('elite_pool_active', e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '10px', border: '2px solid #c4b5fd', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: '#fff', outline: 'none', color: '#5b21b6' }}>
                  <option value="0">Coming Soon</option><option value="1">Active</option>
                </select>
              ) : (
                <div style={{ padding: '5px 14px', borderRadius: '20px', background: parseInt(config.elite_pool_active ?? 0) ? '#f0fdf4' : '#fef3c7', border: `1px solid ${parseInt(config.elite_pool_active ?? 0) ? '#bbf7d0' : '#fde68a'}`, fontSize: '11px', fontWeight: '700', color: parseInt(config.elite_pool_active ?? 0) ? '#059669' : '#d97706' }}>
                  {parseInt(config.elite_pool_active ?? 0) ? 'ACTIVE' : 'COMING SOON'}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', background: 'rgba(237,233,254,0.5)', borderBottom: '1px solid rgba(196,181,253,0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Info size={15} style={{ color: '#7c3aed', flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '12px', color: '#5b21b6', lineHeight: 1.6 }}>
                <strong>Eligibility:</strong> All DAG Lieutenants are permanently enrolled with no cutoff. Activates at DAGCHAIN MainNet launch (Sep–Oct 2026).
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', borderBottom: '1px solid rgba(196,181,253,0.3)' }}>
              <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(196,181,253,0.3)' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Pool % of Chain Fees</p>
                {editingSection === 'incentive_pools' ? ri('elite_pool_blockchain_pct', '90px') : <p style={{ fontSize: '22px', fontWeight: '800', color: '#7c3aed', margin: 0 }}>{config.elite_pool_blockchain_pct ?? 50}<span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>%</span></p>}
              </div>
              <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(196,181,253,0.3)' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Eligible Members</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#7c3aed', margin: 0 }}>All LTs</p>
              </div>
              <div style={{ padding: '18px 24px' }}>
                <p style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Activates At</p>
                {editingSection === 'incentive_pools' ? (
                  <input type="text" value={editValues.elite_pool_activate_date ?? 'Sep–Oct 2026'}
                    onChange={e => ov('elite_pool_activate_date', e.target.value)}
                    placeholder="e.g. Sep–Oct 2026"
                    style={{ padding: '8px 10px', borderRadius: '10px', border: '2px solid #c4b5fd', fontSize: '13px', fontWeight: '700', background: '#fff', outline: 'none', color: '#5b21b6', width: '100%', boxSizing: 'border-box' }}
                  />
                ) : (
                  <p style={{ fontSize: '16px', fontWeight: '800', color: '#6d28d9', margin: 0 }}>{config.elite_pool_activate_date || 'Sep–Oct 2026'}</p>
                )}
              </div>
            </div>
            <div style={{ padding: '14px 24px', background: 'rgba(237,233,254,0.4)', borderRadius: '0 0 18px 18px' }}>
              <p style={{ fontSize: '12px', color: '#5b21b6', margin: 0, lineHeight: 1.6 }}>
                <strong>Admin action required at MainNet:</strong> Click <strong>Edit</strong> above and toggle the pool status to <strong>Active</strong> to activate at launch.
                All current and future DAG Lieutenants are permanently enrolled — no enrollment cutoff.
              </p>
            </div>
          </B>
        </div>

        {/* 3-Pool Summary */}
        <B style={{ marginTop: '16px', padding: '20px 24px' }} hover={false}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', margin: '0 0 4px' }}>Fortune 500 Pool</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Monthly | {config.fortune500_pool_pct ?? 10}% DAGGPT revenue | $500 min ecosystem spend</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#059669', textTransform: 'uppercase', margin: '0 0 4px' }}>DAG LT Pool</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Monthly | {config.dag_lt_pool_pct ?? 10}% DAGGPT revenue | Self + 3 direct LT upgrades in 30 days</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', margin: '0 0 4px' }}>DAG Army Elite Pool</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Ongoing | {config.elite_pool_blockchain_pct ?? 50}% DAGCHAIN chain fees | All DAG Lieutenants</p>
            </div>
          </div>
        </B>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* SYSTEM TAB                                         */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'system' && (<>
        <SH title="System Settings" desc="Global reward system configuration" section="system" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          <B style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} style={{ color: '#6366f1' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Max Commission Levels</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Maximum downline levels that receive payouts (currently 3)</p>
              </div>
            </div>
            {editingSection === 'system' ? ri('max_commission_levels') : <Val v={config.max_commission_levels || 3} suffix="levels" />}
          </B>

          {/* DGCC Coin Ratio Card */}
          <B style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1.5px solid #fde68a', background: 'linear-gradient(135deg, #fffbeb, #fef9c3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#92400e', margin: 0 }}>DGCC Coin Exchange Rate</h4>
                <p style={{ fontSize: '11px', color: '#b45309', margin: '2px 0 0' }}>DAG Points required to redeem 1 DGCC Coin</p>
              </div>
            </div>
            {editingSection === 'system' ? ri('dgcc_points_ratio', '120px') : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <Val v={config.dgcc_points_ratio || 2500} suffix="pts = 1 DGCC" size="24px" color="#92400e" />
              </div>
            )}
            <p style={{ fontSize: '11px', color: '#b45309', margin: '12px 0 0', lineHeight: 1.5 }}>
              Currently: <strong>{config.dgcc_points_ratio || 2500} DAG Points</strong> → 1 DGCC Coin
            </p>
          </B>

          <B hover={false} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Info size={18} style={{ color: '#94a3b8', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.7 }}>
                <strong style={{ color: '#0f172a' }}>Tier Architecture:</strong> The system operates on a flat 2-tier model — <strong>DAG Soldier</strong> and <strong>DAG Lieutenant</strong>.
                <br />Commission rates are fixed per tier (15%/3%/2% for Soldiers, 20%/3%/2% for Lieutenants).
                <br />The DGCC exchange rate controls how many DAG Points users must spend to earn 1 DGCC Coin. Lower the number to make redemptions easier.
              </div>
            </div>
          </B>
        </div>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* SALES DAG POINTS TAB                               */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'sales_dag_points' && (<>
        <SH title="Sales DAG Points" desc="DAG Points awarded per $ of sale amount — auto-triggered when a sale is marked paid" section="sales_dag_points" />

        {/* How it works banner */}
        <B style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1.5px solid #a7f3d0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingCart size={18} color="#fff" />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#065f46', margin: '0 0 6px' }}>How Sales DAG Points Work</h4>
              <p style={{ fontSize: '12px', color: '#047857', margin: 0, lineHeight: 1.6 }}>
                When a sale is recorded and marked as <strong>paid</strong>, the seller automatically receives DAG Points based on the sale amount.
                DAG LIEUTENANT members receive a bonus on top of the base rate. Points are recorded in the transaction ledger with a unique Txn ID.
              </p>
            </div>
          </div>
        </B>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Self Sale */}
          <B>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={18} style={{ color: '#10b981' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Self Sale DAG Points</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Points per $ when user makes their own sale</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {editingSection === 'sales_dag_points' ? ri('self_sale_dag_points_per_dollar') : <Val v={config.self_sale_dag_points_per_dollar || 25} suffix="pts/$" />}
            </div>
          </B>

          {/* Direct Referral Sale */}
          <B>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Direct Referral Sale DAG Points</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Points per $ when a direct referral makes a sale</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {editingSection === 'sales_dag_points' ? ri('referral_sale_dag_points_per_dollar') : <Val v={config.referral_sale_dag_points_per_dollar || 25} suffix="pts/$" />}
            </div>
          </B>
        </div>

        {/* LT Bonus */}
        <B>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={18} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG LIEUTENANT Bonus Rate</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Extra % on top of base rate for LT members (same as other reward bonuses)</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {editingSection === 'sales_dag_points' ? ri('sale_dag_points_lieutenant_bonus') : <Val v={config.sale_dag_points_lieutenant_bonus || 20} suffix="%" />}
            <div style={{ flex: 1, padding: '12px 16px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <p style={{ fontSize: '12px', color: '#92400e', margin: 0, fontWeight: '500' }}>
                Example: $100 sale → <strong>{(100 * (config.self_sale_dag_points_per_dollar || 25)).toLocaleString()} pts</strong> (Soldier) &nbsp;|&nbsp;
                <strong>{Math.floor(100 * (config.self_sale_dag_points_per_dollar || 25) * (1 + (config.sale_dag_points_lieutenant_bonus || 20) / 100)).toLocaleString()} pts</strong> (Lieutenant)
              </p>
            </div>
          </div>
        </B>

        {/* Trigger info */}
        <div style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            Points are granted automatically via a database trigger when a sale's <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>payment_status</code> is set to <strong>paid</strong>.
            Each grant creates a transaction record with type <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>sale_points</code> visible in the Points Ledger.
          </p>
        </div>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* POINTS LEDGER TAB                                  */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'ledger' && (() => {
        const q = ledgerSearch.trim().toLowerCase();
        const filtered = ledger.filter(tx =>
          !q ||
          (tx.transaction_id || '').toLowerCase().includes(q) ||
          (tx.user_name || '').toLowerCase().includes(q) ||
          (tx.user_email || '').toLowerCase().includes(q) ||
          (tx.transaction_type || '').toLowerCase().includes(q) ||
          (tx.description || '').toLowerCase().includes(q)
        );
        const totalPages = Math.max(1, Math.ceil(filtered.length / LEDGER_PAGE_SIZE));
        const page = Math.min(ledgerPage, totalPages);
        const rows = filtered.slice((page - 1) * LEDGER_PAGE_SIZE, page * LEDGER_PAGE_SIZE);

        return (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Points Ledger</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>All DAG Points transactions across all users — searchable by Txn ID, user, or type</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={fetchLedger} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Refresh
                </button>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{filtered.length.toLocaleString()} transactions</span>
              </div>
            </div>

            {/* Search bar */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by Txn ID, user name, email, or type..."
                value={ledgerSearch}
                onChange={e => { setLedgerSearch(e.target.value); setLedgerPage(1); }}
                style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', color: '#0f172a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            {/* Table */}
            <B style={{ padding: '0', overflow: 'hidden' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '190px 160px 1fr 130px 100px 130px', padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['Txn ID', 'User', 'Description', 'Type', 'Points', 'Date'].map((h, i) => (
                  <span key={h} style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i >= 4 ? 'right' : 'left' }}>{h}</span>
                ))}
              </div>

              {ledgerLoading ? (
                <div style={{ padding: '48px', textAlign: 'center' }}>
                  <div style={{ width: '28px', height: '28px', border: '3px solid #f1f5f9', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Loading transactions...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              ) : rows.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                  <FileText size={32} style={{ margin: '0 auto 10px', opacity: 0.3, display: 'block' }} />
                  <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{q ? 'No matching transactions' : 'No transactions yet'}</p>
                </div>
              ) : (
                rows.map((tx, idx) => {
                  const isSale    = tx.transaction_type === 'sale_points';
                  const isBurned  = tx.points < 0 && tx.transaction_type === 'rank_burn';
                  const isRedeemed= tx.points < 0 && !isBurned;
                  const isEarned  = tx.points > 0 && !isSale;
                  const typeColor = isSale ? '#0d9488' : isEarned ? '#10b981' : isBurned ? '#ef4444' : '#6366f1';
                  const typeBg    = isSale ? '#f0fdfa' : isEarned ? '#ecfdf5' : isBurned ? '#fef2f2' : '#eef2ff';
                  const typeBorder= isSale ? '#99f6e4' : isEarned ? '#a7f3d0' : isBurned ? '#fecaca' : '#c7d2fe';
                  const typeLabel = isSale ? 'Sale' : isEarned ? 'Earned' : isBurned ? 'Burned' : 'Redeemed';
                  const dateStr   = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const txnId     = tx.transaction_id || '—';
                  return (
                    <div
                      key={tx.id || idx}
                      style={{ display: 'grid', gridTemplateColumns: '190px 160px 1fr 130px 100px 130px', padding: '11px 16px', alignItems: 'center', borderBottom: idx < rows.length - 1 ? '1px solid #f8fafc' : 'none', background: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      {/* Txn ID */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: '#475569', letterSpacing: '0.2px' }}>{txnId}</span>
                        {txnId !== '—' && (
                          <button
                            onClick={() => navigator.clipboard.writeText(txnId)}
                            title="Copy"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#cbd5e1', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                            onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                          >
                            <Copy size={10} />
                          </button>
                        )}
                      </div>
                      {/* User */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.user_name || 'Unknown'}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.user_email || ''}</div>
                      </div>
                      {/* Description */}
                      <span style={{ fontSize: '12px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>{tx.description || tx.transaction_type}</span>
                      {/* Type badge */}
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px', background: typeBg, color: typeColor, border: `1px solid ${typeBorder}`, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{typeLabel}</span>
                      </div>
                      {/* Points */}
                      <span style={{ fontSize: '13px', fontWeight: '800', color: typeColor, textAlign: 'right', letterSpacing: '-0.3px' }}>
                        {isEarned ? '+' : '−'}{Math.abs(tx.points).toLocaleString()}
                      </span>
                      {/* Date */}
                      <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right', fontWeight: '500' }}>{dateStr}</span>
                    </div>
                  );
                })
              )}
            </B>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Page {page} of {totalPages} ({filtered.length} results)</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setLedgerPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#cbd5e1' : '#64748b' }}>Prev</button>
                  <button onClick={() => setLedgerPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#cbd5e1' : '#64748b' }}>Next</button>
                </div>
              </div>
            )}
          </>
        );
      })()}

    </div>
  );
}
