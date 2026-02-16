"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Award, Save, Edit2, Check, X, Users, Trophy, DollarSign, Crown, Settings,
  Gift, Shield, Lock, Unlock, ArrowRight, Plus, Equal, Sparkles,
  Zap, TrendingUp, Target, Layers, Star, Info, ChevronRight, ArrowDown
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

  useEffect(() => { fetchConfig(); setTimeout(() => setMounted(true), 50); }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rewards/config');
      const data = await res.json();
      if (data.config) {
        const obj = {};
        data.config.forEach(i => { obj[i.config_key] = i.config_value; });
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
    const defaults = { soldier_signup_bonus: '500', lieutenant_upgrade_base: '2500', lieutenant_bonus_rate: '20', lieutenant_self_upgrade_bonus: '3000', soldier_refers_soldier_join: '500', soldier_refers_soldier_upgrade: '2500', lieutenant_refers_soldier_join: '600', lieutenant_refers_soldier_upgrade: '3000', ranking_system_enabled_for_soldier: '0', max_commission_levels: '3', rank_upgrade_bonus_initiator: '10', rank_upgrade_bonus_vanguard: '20', rank_upgrade_bonus_guardian: '30', rank_upgrade_bonus_striker: '40', rank_upgrade_bonus_invoker: '50', rank_upgrade_bonus_commander: '60', rank_upgrade_bonus_champion: '70', rank_upgrade_bonus_conqueror: '80', rank_upgrade_bonus_paragon: '90', rank_upgrade_bonus_mythic: '100', social_task_like_share: '10', social_task_comments_watch: '10', social_task_create_shorts: '50', social_task_explainer_video: '100', social_task_subscribe: '150', social_task_lt_bonus_rate: '20', incentive_discretionary_pool_pct: '3', incentive_discretionary_sales_threshold: '1000', incentive_discretionary_enabled: '1', incentive_lifestyle_pool_pct: '3', incentive_lifestyle_sales_threshold: '2000', incentive_lifestyle_enabled: '1', incentive_executive_pool_pct: '2', incentive_executive_sales_threshold: '10000', incentive_executive_enabled: '1', soldier_level2_sales_commission: '3', soldier_level3_sales_commission: '2', soldier_direct_sales_commission: '7' };
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
        keys = ['soldier_signup_bonus','lieutenant_upgrade_base','lieutenant_bonus_rate'];
        const base = parseInt(editValues.lieutenant_upgrade_base) || 2500;
        const rate = parseInt(editValues.lieutenant_bonus_rate) || 20;
        editValues.lieutenant_self_upgrade_bonus = base + Math.round((base * rate) / 100);
        keys.push('lieutenant_self_upgrade_bonus');
      } else if (section === 'referral') {
        keys = ['soldier_refers_soldier_join','soldier_refers_soldier_upgrade'];
        const bj = parseInt(editValues.soldier_refers_soldier_join) || 500;
        const bu = parseInt(editValues.soldier_refers_soldier_upgrade) || 2500;
        const r = config.lieutenant_bonus_rate || 20;
        editValues.lieutenant_refers_soldier_join = bj + Math.round((bj * r) / 100);
        editValues.lieutenant_refers_soldier_upgrade = bu + Math.round((bu * r) / 100);
        keys.push('lieutenant_refers_soldier_join','lieutenant_refers_soldier_upgrade');
      } else if (section === 'ranks') {
        keys = ['rank_burn_initiator','rank_burn_vanguard','rank_burn_guardian','rank_burn_striker','rank_burn_invoker','rank_burn_commander','rank_burn_champion','rank_burn_conqueror','rank_burn_paragon','rank_burn_mythic'];
      } else if (section === 'sales') {
        keys = ['soldier_direct_sales_commission','soldier_level2_sales_commission','soldier_level3_sales_commission','lieutenant_direct_sales_commission_default','lieutenant_level2_sales_commission','lieutenant_level3_sales_commission'];
      } else if (section === 'social_tasks') {
        keys = ['social_task_like_share','social_task_comments_watch','social_task_create_shorts','social_task_explainer_video','social_task_subscribe','social_task_lt_bonus_rate'];
      } else if (section === 'rank_bonuses') {
        keys = ['rank_upgrade_bonus_initiator','rank_upgrade_bonus_vanguard','rank_upgrade_bonus_guardian','rank_upgrade_bonus_striker','rank_upgrade_bonus_invoker','rank_upgrade_bonus_commander','rank_upgrade_bonus_champion','rank_upgrade_bonus_conqueror','rank_upgrade_bonus_paragon','rank_upgrade_bonus_mythic'];
      } else if (section === 'rank_commissions') {
        keys = ['rank_commission_initiator','rank_commission_vanguard','rank_commission_guardian','rank_commission_striker','rank_commission_invoker','rank_commission_commander','rank_commission_champion','rank_commission_conqueror','rank_commission_paragon','rank_commission_mythic'];
      } else if (section === 'incentive_pools') {
        keys = ['incentive_discretionary_pool_pct','incentive_discretionary_sales_threshold','incentive_discretionary_enabled','incentive_lifestyle_pool_pct','incentive_lifestyle_sales_threshold','incentive_lifestyle_enabled','incentive_executive_pool_pct','incentive_executive_sales_threshold','incentive_executive_enabled'];
      } else if (section === 'system') {
        keys = ['ranking_system_enabled_for_soldier','max_commission_levels'];
      }
      const results = [];
      for (const k of keys) {
        const val = parseInt(editValues[k]);
        const sendVal = isNaN(val) ? 0 : val;
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

  /* ── Editable input (plain function, NOT a component, to avoid focus loss) ── */
  const ri = (configKey, w) => (
    <input key={configKey} type="number" value={editValues[configKey] ?? ''} onChange={e => ov(configKey, e.target.value)}
      style={{ width: w || '90px', padding: '8px 12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', fontWeight: '800', textAlign: 'right', color: '#0f172a', outline: 'none', background: '#f8fafc', transition: 'border-color 0.2s, box-shadow 0.2s' }}
      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
    />
  );

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
    { id: 'signup', label: 'Signup Bonuses', icon: Gift },
    { id: 'referral', label: 'Referral Scenarios', icon: Users },
    { id: 'ranks', label: 'Rank Requirements', icon: Trophy },
    { id: 'sales', label: 'Sales Commissions', icon: DollarSign },
    { id: 'social_tasks', label: 'Social Tasks', icon: Zap },
    { id: 'rank_bonuses', label: 'Rank Point Bonuses', icon: TrendingUp },
    { id: 'rank_commissions', label: 'Rank Commissions', icon: Crown },
    { id: 'incentive_pools', label: 'Incentive Pools', icon: Layers },
    { id: 'system', label: 'System', icon: Settings },
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
          const s = g('soldier_signup_bonus',500), b = g('lieutenant_upgrade_base',2500), r = g('lieutenant_bonus_rate',20), bn = Math.round((b*r)/100), ltTotal = s+b+bn;
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px', alignItems: 'stretch', marginBottom: '16px' }}>

              {/* ── DAG SOLDIER Card ── */}
              <B style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={20} style={{ color: '#10b981' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG SOLDIER</h3>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Free tier - auto on registration</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', background: '#f0fdf4', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Auto-triggered</span>
                  </div>
                </div>

                {/* Single row */}
                <div style={{ padding: '16px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Signup Bonus</span>
                        <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: '#f0fdf4', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Instant</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '450' }}>Credited immediately on registration</span>
                    </div>
                    {editingSection === 'signup' ? ri('soldier_signup_bonus') : (
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>+{s} pts</span>
                    )}
                  </div>
                </div>

                {/* Progress bar - aligned with LT card */}
                <div style={{ padding: '0 24px 16px' }}>
                  <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '6px' }}>
                    <div style={{ width: '100%', background: '#10b981', transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }} />
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>Signup: {s}</span>
                    </div>
                  </div>
                </div>

                {/* Total footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.04)',
                  borderRadius: '0 0 20px 20px', marginTop: 'auto',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Soldier Points</span>
                  <Val v={s} suffix="pts" size="22px" />
                </div>
              </B>

              {/* ── DAG LIEUTENANT Card ── */}
              <B style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Crown size={20} style={{ color: '#6366f1' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>DAG LIEUTENANT</h3>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Paid upgrade ($149 USD) - SOLDIER to LIEUTENANT</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', background: '#0f172a', color: '#fff', letterSpacing: '0.3px' }}>$149 USD</span>
                  </div>
                </div>

                {/* Breakdown rows */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {[
                    { label: 'Soldier Signup Bonus', desc: 'Already credited at registration', value: s, tag: 'Previous', tagColor: '#94a3b8', tagBg: '#f1f5f9', ghost: true, dot: '#cbd5e1' },
                    { label: 'Base Upgrade Bonus', desc: 'Credited on upgrade payment', value: b, tag: 'New Credit', tagColor: '#6366f1', tagBg: '#eef2ff', dot: '#6366f1', editable: 'lieutenant_upgrade_base' },
                    { label: `${r}% DAG LIEUTENANT Bonus`, desc: `${r}% of ${b} base upgrade`, value: bn, tag: 'Bonus', tagColor: '#8b5cf6', tagBg: '#f5f3ff', dot: '#8b5cf6', editableRate: 'lieutenant_bonus_rate' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '8px 1fr auto',
                      gap: '14px', alignItems: 'center',
                      padding: '12px 24px',
                      borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                      background: row.ghost ? '#fafbfc' : '#fff',
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.dot }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: row.ghost ? '#94a3b8' : '#0f172a', textDecoration: row.ghost ? 'line-through' : 'none' }}>{row.label}</span>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px', background: row.tagBg, color: row.tagColor, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{row.tag}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '450' }}>{row.desc}</span>
                      </div>
                      {row.editable && editingSection === 'signup' ? ri(row.editable) :
                       row.editableRate && editingSection === 'signup' ? (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>{ri(row.editableRate, '70px')}<span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8' }}>%</span></div>
                       ) : (
                        <span style={{ fontSize: '16px', fontWeight: '800', color: row.ghost ? '#cbd5e1' : '#0f172a', textDecoration: row.ghost ? 'line-through' : 'none', fontVariantNumeric: 'tabular-nums' }}>
                          {row.ghost ? '' : '+'}{row.value} pts
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress bar - aligned with Soldier card */}
                <div style={{ padding: '0 24px 16px' }}>
                  <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '6px' }}>
                    <div style={{ width: `${(s/ltTotal)*100}%`, background: '#e2e8f0', transition: 'width 0.6s ease' }} />
                    <div style={{ width: `${(b/ltTotal)*100}%`, background: '#6366f1', transition: 'width 0.6s ease' }} />
                    <div style={{ width: `${(bn/ltTotal)*100}%`, background: '#a78bfa', transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                    {[
                      { c: '#e2e8f0', l: `Prev: ${s}` },
                      { c: '#6366f1', l: `Base: ${b}` },
                      { c: '#a78bfa', l: `Bonus: ${bn}` },
                    ].map((x,i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: x.c }} />
                        <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8' }}>{x.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.04)',
                  borderRadius: '0 0 20px 20px', marginTop: 'auto',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total DAG LIEUTENANT</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '6px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1' }}>{s}</span>
                      <Plus size={8} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#6366f1' }}>{b}</span>
                      <Plus size={8} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#8b5cf6' }}>{bn}</span>
                      <Equal size={8} style={{ color: '#94a3b8' }} />
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#0f172a' }}>{ltTotal}</span>
                    </div>
                  </div>
                  <Val v={ltTotal} suffix="pts" size="22px" />
                </div>
              </B>
            </div>
          );
        })()}

        {/* Info note */}
        <B style={{ padding: '18px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }} hover={false}>
          <Info size={16} style={{ color: '#94a3b8', marginTop: '1px', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.7', margin: 0 }}>
            When a Soldier upgrades, <strong style={{ color: '#0f172a' }}>two separate transactions</strong> are recorded: the <strong style={{ color: '#6366f1' }}>Base Upgrade Bonus</strong> and the <strong style={{ color: '#8b5cf6' }}>{br}% DAG LIEUTENANT Bonus</strong>. The original signup bonus was already credited at registration.
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
      {/* RANKS TAB                                          */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'ranks' && (<>
        <SH title="Rank Burn Requirements" desc="DAG Points burned to achieve each rank (sequential progression)" section="ranks" />
        <B style={{ padding: '0' }}>
          {[
            ['INITIATOR','Entry rank','rank_burn_initiator',Target,'#10b981','#f0fdf4'],
            ['VANGUARD','Requires INITIATOR','rank_burn_vanguard',Shield,'#0ea5e9','#e0f2fe'],
            ['GUARDIAN','Requires VANGUARD','rank_burn_guardian',Shield,'#6366f1','#eef2ff'],
            ['STRIKER','Requires GUARDIAN','rank_burn_striker',Zap,'#8b5cf6','#f5f3ff'],
            ['INVOKER','Requires STRIKER','rank_burn_invoker',Star,'#a855f7','#faf5ff'],
            ['COMMANDER','Requires INVOKER','rank_burn_commander',Crown,'#d946ef','#fdf4ff'],
            ['CHAMPION','Requires COMMANDER','rank_burn_champion',Trophy,'#ec4899','#fdf2f8'],
            ['CONQUEROR','Requires CHAMPION','rank_burn_conqueror',Award,'#f43f5e','#fff1f2'],
            ['PARAGON','Requires CONQUEROR','rank_burn_paragon',Sparkles,'#f97316','#fff7ed'],
            ['MYTHIC','Highest rank','rank_burn_mythic',Crown,'#eab308','#fefce8'],
          ].map(([t,d,k,Icon,color,bg], i) => {
            const val = editingSection === 'ranks' ? editValues[k] : config[k];
            return (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr auto',
                gap: '14px', alignItems: 'center',
                padding: '14px 24px',
                borderBottom: i < 9 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{i+1}. {t}</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>{d}</p>
                </div>
                {editingSection === 'ranks' ? ri(k) : <Val v={val || 0} suffix="pts" size="20px" />}
              </div>
            );
          })}
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
            ['Soldier Direct Sales','Level 1 - Direct commission','soldier_direct_sales_commission',DollarSign,'#10b981','#f0fdf4'],
            ['Soldier Level 2 Commission','2nd level downline','soldier_level2_sales_commission',TrendingUp,'#059669','#ecfdf5'],
            ['Soldier Level 3 Commission','3rd level downline','soldier_level3_sales_commission',TrendingUp,'#047857','#d1fae5'],
          ].map(([t,d,k,Icon,color,bg], i) => {
            const val = editingSection === 'sales' ? editValues[k] : config[k];
            const soldierDefaults = { soldier_direct_sales_commission: 7, soldier_level2_sales_commission: 3, soldier_level3_sales_commission: 2 };
            const displayVal = val ?? soldierDefaults[k] ?? 0;
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
            ['DAG LIEUTENANT Direct Sales (No Rank)','Level 1 without rank','lieutenant_direct_sales_commission_default',DollarSign,'#0ea5e9','#e0f2fe'],
            ['DAG LIEUTENANT Level 2 Commission','2nd level downline','lieutenant_level2_sales_commission',TrendingUp,'#6366f1','#eef2ff'],
            ['DAG LIEUTENANT Level 3 Commission','3rd level downline','lieutenant_level3_sales_commission',TrendingUp,'#8b5cf6','#f5f3ff'],
          ].map(([t,d,k,Icon,color,bg], i) => {
            const val = editingSection === 'sales' ? editValues[k] : config[k];
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
                {editingSection === 'sales' ? ri(k, '80px') : <Val v={val || 0} suffix="%" size="20px" />}
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
      {/* RANK POINT BONUSES TAB                             */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'rank_bonuses' && (<>
        <SH title="Rank-Based DAG Point Bonuses" desc="Extra % bonus on base referral DAG Points for ranked DAG LIEUTENANT members" section="rank_bonuses" />

        {/* Explanation card */}
        <B style={{ marginBottom: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }} hover={false}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={18} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
              <strong style={{ color: '#0f172a' }}>How it works:</strong> When a ranked DAG LIEUTENANT earns referral points, they receive an additional percentage bonus on the <strong style={{ color: '#0f172a' }}>base credit amount only</strong> (not on the existing 20% LT bonus).
              <br />Example: INITIATOR rank holder gets a referral join (base 500 pts) + LT 20% bonus (100 pts) + <strong style={{ color: '#6366f1' }}>Rank 10% bonus on base (50 pts)</strong> = 650 total.
              <br />Each rank requires a <strong style={{ color: '#0f172a' }}>fresh burn</strong> of DAG Points. Total cumulative burn to reach MYTHIC: 177,400 pts.
            </div>
          </div>
        </B>

        <B style={{ padding: '0' }}>
          {[  
            ['INITIATOR','10% bonus on base credits','rank_upgrade_bonus_initiator',Target,'#10b981','#f0fdf4'],
            ['VANGUARD','20% bonus on base credits','rank_upgrade_bonus_vanguard',Shield,'#0ea5e9','#e0f2fe'],
            ['GUARDIAN','30% bonus on base credits','rank_upgrade_bonus_guardian',Shield,'#6366f1','#eef2ff'],
            ['STRIKER','40% bonus on base credits','rank_upgrade_bonus_striker',Zap,'#8b5cf6','#f5f3ff'],
            ['INVOKER','50% bonus on base credits','rank_upgrade_bonus_invoker',Star,'#a855f7','#faf5ff'],
            ['COMMANDER','60% bonus on base credits','rank_upgrade_bonus_commander',Crown,'#d946ef','#fdf4ff'],
            ['CHAMPION','70% bonus on base credits','rank_upgrade_bonus_champion',Trophy,'#ec4899','#fdf2f8'],
            ['CONQUEROR','80% bonus on base credits','rank_upgrade_bonus_conqueror',Award,'#f43f5e','#fff1f2'],
            ['PARAGON','90% bonus on base credits','rank_upgrade_bonus_paragon',Sparkles,'#f97316','#fff7ed'],
            ['MYTHIC','100% bonus on base credits','rank_upgrade_bonus_mythic',Crown,'#eab308','#fefce8'],
          ].map(([t,d,k,Icon,color,bg], i) => {
            const rankDefaults = { rank_upgrade_bonus_initiator: 10, rank_upgrade_bonus_vanguard: 20, rank_upgrade_bonus_guardian: 30, rank_upgrade_bonus_striker: 40, rank_upgrade_bonus_invoker: 50, rank_upgrade_bonus_commander: 60, rank_upgrade_bonus_champion: 70, rank_upgrade_bonus_conqueror: 80, rank_upgrade_bonus_paragon: 90, rank_upgrade_bonus_mythic: 100 };
            const val = editingSection === 'rank_bonuses' ? editValues[k] : (config[k] ?? rankDefaults[k] ?? 0);
            const burnKey = 'rank_burn_' + t.toLowerCase();
            const burnVal = config[burnKey] || 0;
            return (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 100px auto',
                gap: '14px', alignItems: 'center',
                padding: '14px 24px',
                borderBottom: i < 9 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{i+1}. {t}</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>{d}</p>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textAlign: 'right' }}>Burn: {burnVal.toLocaleString()} pts</span>
                {editingSection === 'rank_bonuses' ? ri(k, '80px') : <Val v={val || 0} suffix="%" size="20px" />}
              </div>
            );
          })}
        </B>

        {/* Cumulative burn summary */}
        <B style={{ marginTop: '16px', padding: '20px 24px' }} hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Total Cumulative Burn to MYTHIC</h4>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Sum of all rank burn requirements</p>
            </div>
            <Val v={[
              config.rank_burn_initiator || 700, config.rank_burn_vanguard || 1500, config.rank_burn_guardian || 3200,
              config.rank_burn_striker || 7000, config.rank_burn_invoker || 10000, config.rank_burn_commander || 15000,
              config.rank_burn_champion || 20000, config.rank_burn_conqueror || 30000, config.rank_burn_paragon || 40000,
              config.rank_burn_mythic || 50000
            ].reduce((a,b) => a+b, 0).toLocaleString()} suffix="pts" size="22px" color="#6366f1" />
          </div>
        </B>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* RANK COMMISSIONS TAB                               */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'rank_commissions' && (<>
        <SH title="Rank-Based Sales Commissions" desc="Enhanced direct sales rates for ranked DAG LIEUTENANT members" section="rank_commissions" />
        <B style={{ padding: '0' }}>
          {[
            ['INITIATOR','rank_commission_initiator',Target,'#10b981','#f0fdf4'],
            ['VANGUARD','rank_commission_vanguard',Shield,'#0ea5e9','#e0f2fe'],
            ['GUARDIAN','rank_commission_guardian',Shield,'#6366f1','#eef2ff'],
            ['STRIKER','rank_commission_striker',Zap,'#8b5cf6','#f5f3ff'],
            ['INVOKER','rank_commission_invoker',Star,'#a855f7','#faf5ff'],
            ['COMMANDER','rank_commission_commander',Crown,'#d946ef','#fdf4ff'],
            ['CHAMPION','rank_commission_champion',Trophy,'#ec4899','#fdf2f8'],
            ['CONQUEROR','rank_commission_conqueror',Award,'#f43f5e','#fff1f2'],
            ['PARAGON','rank_commission_paragon',Sparkles,'#f97316','#fff7ed'],
            ['MYTHIC','rank_commission_mythic',Crown,'#eab308','#fefce8'],
          ].map(([t,k,Icon,color,bg], i) => {
            const val = editingSection === 'rank_commissions' ? editValues[k] : config[k];
            return (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr auto',
                gap: '14px', alignItems: 'center',
                padding: '14px 24px',
                borderBottom: i < 9 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{i+1}. {t} Commission</h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>Direct sales rate for {t}</p>
                </div>
                {editingSection === 'rank_commissions' ? ri(k, '80px') : <Val v={val || 0} suffix="%" size="20px" />}
              </div>
            );
          })}
        </B>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* INCENTIVE POOLS TAB                                */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'incentive_pools' && (<>
        <SH title="Incentive Pool Programs" desc="Monthly & quarterly reward pools based on direct sales targets" section="incentive_pools" />

        {/* Explanation card */}
        <B style={{ marginBottom: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }} hover={false}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={18} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
              <strong style={{ color: '#0f172a' }}>How pools work:</strong> A percentage of company revenue is set aside as a shared pool each period.
              Everyone who meets the direct sales threshold in that period qualifies to share the pool equally.
              <br /><strong style={{ color: '#0f172a' }}>Fresh count:</strong> Sales targets reset each month (or quarter for Executive). Only sales within the current period count.
            </div>
          </div>
        </B>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {/* ── Discretionary Incentive ── */}
          {(() => {
            const poolPct = editingSection === 'incentive_pools' ? editValues.incentive_discretionary_pool_pct : (config.incentive_discretionary_pool_pct ?? 3);
            const threshold = editingSection === 'incentive_pools' ? editValues.incentive_discretionary_sales_threshold : (config.incentive_discretionary_sales_threshold ?? 1000);
            const enabled = editingSection === 'incentive_pools' ? editValues.incentive_discretionary_enabled : (config.incentive_discretionary_enabled ?? 1);
            return (
              <B style={{ padding: '0', border: `1px solid ${parseInt(enabled) ? '#bbf7d0' : 'rgba(0,0,0,0.06)'}` }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DollarSign size={18} style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Discretionary Incentive</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Monthly pool - Fresh sale count every month</p>
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', background: parseInt(enabled) ? '#f0fdf4' : '#f8fafc', border: `1px solid ${parseInt(enabled) ? '#bbf7d0' : '#e2e8f0'}`, fontSize: '11px', fontWeight: '700', color: parseInt(enabled) ? '#059669' : '#94a3b8' }}>
                    {parseInt(enabled) ? 'ACTIVE' : 'DISABLED'}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Pool %</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>% of company net revenue</p>
                    {editingSection === 'incentive_pools' ? ri('incentive_discretionary_pool_pct', '80px') : <Val v={poolPct} suffix="%" size="22px" />}
                  </div>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Sales Threshold</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>Min direct sales per month</p>
                    {editingSection === 'incentive_pools' ? ri('incentive_discretionary_sales_threshold', '100px') : <Val v={`$${Number(threshold).toLocaleString()}`} size="22px" />}
                  </div>
                  <div style={{ padding: '18px 24px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Status</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>Enable or disable this pool</p>
                    {editingSection === 'incentive_pools' ? (
                      <select value={editValues.incentive_discretionary_enabled || '1'} onChange={e => ov('incentive_discretionary_enabled', e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: '#f8fafc', outline: 'none', color: '#334155' }}>
                        <option value="1">Enabled</option><option value="0">Disabled</option>
                      </select>
                    ) : <Val v={parseInt(enabled) ? 'ON' : 'OFF'} size="22px" color={parseInt(enabled) ? '#059669' : '#94a3b8'} />}
                  </div>
                </div>
              </B>
            );
          })()}

          {/* ── Lifestyle Bonus ── */}
          {(() => {
            const poolPct = editingSection === 'incentive_pools' ? editValues.incentive_lifestyle_pool_pct : (config.incentive_lifestyle_pool_pct ?? 3);
            const threshold = editingSection === 'incentive_pools' ? editValues.incentive_lifestyle_sales_threshold : (config.incentive_lifestyle_sales_threshold ?? 2000);
            const enabled = editingSection === 'incentive_pools' ? editValues.incentive_lifestyle_enabled : (config.incentive_lifestyle_enabled ?? 1);
            return (
              <B style={{ padding: '0', border: `1px solid ${parseInt(enabled) ? '#c7d2fe' : 'rgba(0,0,0,0.06)'}` }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star size={18} style={{ color: '#6366f1' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Lifestyle Bonus</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Monthly pool - Car / Travel / Home allowance</p>
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', background: parseInt(enabled) ? '#eef2ff' : '#f8fafc', border: `1px solid ${parseInt(enabled) ? '#c7d2fe' : '#e2e8f0'}`, fontSize: '11px', fontWeight: '700', color: parseInt(enabled) ? '#4f46e5' : '#94a3b8' }}>
                    {parseInt(enabled) ? 'ACTIVE' : 'DISABLED'}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Pool %</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>% of company net revenue</p>
                    {editingSection === 'incentive_pools' ? ri('incentive_lifestyle_pool_pct', '80px') : <Val v={poolPct} suffix="%" size="22px" />}
                  </div>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Sales Threshold</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>Min direct sales per month</p>
                    {editingSection === 'incentive_pools' ? ri('incentive_lifestyle_sales_threshold', '100px') : <Val v={`$${Number(threshold).toLocaleString()}`} size="22px" />}
                  </div>
                  <div style={{ padding: '18px 24px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Status</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>Enable or disable this pool</p>
                    {editingSection === 'incentive_pools' ? (
                      <select value={editValues.incentive_lifestyle_enabled || '1'} onChange={e => ov('incentive_lifestyle_enabled', e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: '#f8fafc', outline: 'none', color: '#334155' }}>
                        <option value="1">Enabled</option><option value="0">Disabled</option>
                      </select>
                    ) : <Val v={parseInt(enabled) ? 'ON' : 'OFF'} size="22px" color={parseInt(enabled) ? '#4f46e5' : '#94a3b8'} />}
                  </div>
                </div>
              </B>
            );
          })()}

          {/* ── Executive Performance Incentive ── */}
          {(() => {
            const poolPct = editingSection === 'incentive_pools' ? editValues.incentive_executive_pool_pct : (config.incentive_executive_pool_pct ?? 2);
            const threshold = editingSection === 'incentive_pools' ? editValues.incentive_executive_sales_threshold : (config.incentive_executive_sales_threshold ?? 10000);
            const enabled = editingSection === 'incentive_pools' ? editValues.incentive_executive_enabled : (config.incentive_executive_enabled ?? 1);
            return (
              <B style={{ padding: '0', border: `1px solid ${parseInt(enabled) ? '#fde68a' : 'rgba(0,0,0,0.06)'}` }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Crown size={18} style={{ color: '#eab308' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Executive Performance Incentive</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Quarterly pool - Paid every quarter</p>
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', background: parseInt(enabled) ? '#fefce8' : '#f8fafc', border: `1px solid ${parseInt(enabled) ? '#fde68a' : '#e2e8f0'}`, fontSize: '11px', fontWeight: '700', color: parseInt(enabled) ? '#ca8a04' : '#94a3b8' }}>
                    {parseInt(enabled) ? 'ACTIVE' : 'DISABLED'}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Pool %</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>% of company revenue</p>
                    {editingSection === 'incentive_pools' ? ri('incentive_executive_pool_pct', '80px') : <Val v={poolPct} suffix="%" size="22px" />}
                  </div>
                  <div style={{ padding: '18px 24px', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Sales Threshold</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>Min direct sales per quarter</p>
                    {editingSection === 'incentive_pools' ? ri('incentive_executive_sales_threshold', '100px') : <Val v={`$${Number(threshold).toLocaleString()}`} size="22px" />}
                  </div>
                  <div style={{ padding: '18px 24px' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Status</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>Enable or disable this pool</p>
                    {editingSection === 'incentive_pools' ? (
                      <select value={editValues.incentive_executive_enabled || '1'} onChange={e => ov('incentive_executive_enabled', e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '13px', fontWeight: '700', cursor: 'pointer', background: '#f8fafc', outline: 'none', color: '#334155' }}>
                        <option value="1">Enabled</option><option value="0">Disabled</option>
                      </select>
                    ) : <Val v={parseInt(enabled) ? 'ON' : 'OFF'} size="22px" color={parseInt(enabled) ? '#ca8a04' : '#94a3b8'} />}
                  </div>
                </div>
              </B>
            );
          })()}
        </div>

        {/* Summary */}
        <B style={{ marginTop: '16px', padding: '20px 24px' }} hover={false}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', margin: '0 0 4px' }}>Discretionary</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Monthly | {config.incentive_discretionary_pool_pct ?? 3}% pool | ${Number(config.incentive_discretionary_sales_threshold ?? 1000).toLocaleString()} threshold</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', margin: '0 0 4px' }}>Lifestyle</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Monthly | {config.incentive_lifestyle_pool_pct ?? 3}% pool | ${Number(config.incentive_lifestyle_sales_threshold ?? 2000).toLocaleString()} threshold</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', margin: '0 0 4px' }}>Executive</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Quarterly | {config.incentive_executive_pool_pct ?? 2}% pool | ${Number(config.incentive_executive_sales_threshold ?? 10000).toLocaleString()} threshold</p>
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
          <B>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: config.ranking_system_enabled_for_soldier === 1 ? '#f0fdf4' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {config.ranking_system_enabled_for_soldier === 1 ? <Unlock size={18} style={{ color: '#10b981' }} /> : <Lock size={18} style={{ color: '#94a3b8' }} />}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Ranking for SOLDIER</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Allow SOLDIER tier in ranking system</p>
              </div>
            </div>
            {editingSection === 'system' ? (
              <select value={editValues.ranking_system_enabled_for_soldier || 0} onChange={e => ov('ranking_system_enabled_for_soldier', e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '14px', fontWeight: '600', cursor: 'pointer', background: '#f8fafc', outline: 'none', color: '#334155' }}>
                <option value="0">Disabled</option><option value="1">Enabled</option>
              </select>
            ) : (
              <div style={{
                padding: '12px 18px', borderRadius: '12px', textAlign: 'center',
                background: config.ranking_system_enabled_for_soldier === 1 ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${config.ranking_system_enabled_for_soldier === 1 ? '#bbf7d0' : 'rgba(0,0,0,0.06)'}`,
                fontSize: '14px', fontWeight: '700',
                color: config.ranking_system_enabled_for_soldier === 1 ? '#059669' : '#94a3b8',
              }}>
                {config.ranking_system_enabled_for_soldier === 1 ? 'Enabled' : 'Disabled'}
              </div>
            )}
          </B>

          <B style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} style={{ color: '#6366f1' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Max Commission Levels</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Maximum downline levels for payouts</p>
              </div>
            </div>
            {editingSection === 'system' ? ri('max_commission_levels') : <Val v={config.max_commission_levels || 0} suffix="levels" />}
          </B>
        </div>
      </>)}
    </div>
  );
}
