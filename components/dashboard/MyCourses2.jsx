"use client";
import { useState, useEffect } from "react";
import { nextGenProgram } from "@/data/next-gen-program";

// ─── Neumorphic card ─────────────────────────────────────────────────────────
const NmCard = ({ children, style = {}, hover = true, inset = false, onClick }) => {
    const shadow = inset
        ? 'inset 6px 6px 14px rgba(0,0,0,0.12), inset -4px -4px 12px rgba(255,255,255,0.9)'
        : '8px 8px 20px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.95)';
    const hoverShadow = '10px 10px 24px rgba(0,0,0,0.15), -7px -7px 18px rgba(255,255,255,1)';
    return (
        <div
            style={{ background: '#f0f2f5', borderRadius: '20px', boxShadow: shadow, transition: 'box-shadow 0.2s ease, transform 0.2s ease', ...style }}
            onClick={onClick}
            onMouseEnter={hover ? e => { e.currentTarget.style.boxShadow = hoverShadow; if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
            onMouseLeave={hover ? e => { e.currentTarget.style.boxShadow = shadow; e.currentTarget.style.transform = 'translateY(0)'; } : undefined}
        >{children}</div>
    );
};

const TRACK = {
  Yellow: { accent: '#D97706', color: '#6366f1', border: '#6366f1', nmAccent: 'rgba(99,102,241,0.15)' },
  Green:  { accent: '#059669', color: '#6366f1', border: '#6366f1', nmAccent: 'rgba(99,102,241,0.15)' },
  Blue:   { accent: '#2563EB', color: '#6366f1', border: '#6366f1', nmAccent: 'rgba(99,102,241,0.15)' },
};

const TRACK_ICON = {
  Yellow: { bg: 'rgba(245,158,11,0.15)', stroke: '#D97706' },
  Green:  { bg: 'rgba(5,150,105,0.15)',  stroke: '#059669' },
  Blue:   { bg: 'rgba(37,99,235,0.15)',  stroke: '#2563EB' },
};

const TYPE_BADGE = {
  theory:     { label: 'THEORY',     color: '#6366f1' },
  drill:      { label: 'DRILL',      color: '#059669' },
  strategy:   { label: 'STRATEGY',   color: '#D97706' },
  graduation: { label: 'GRADUATION', color: '#0f172a' },
};

const ASSIGNMENTS = [
  { id: 1, title: 'Build a Neural Network from Scratch', course: 'AI & Machine Learning', module: 'Module 1', dueDate: '2026-04-10', status: 'pending',     priority: 'high',   points: 100, description: 'Create a basic neural network using Python and NumPy.' },
  { id: 2, title: 'Smart Contract Development',          course: 'Blockchain Basics',     module: 'Module 5', dueDate: '2026-04-08', status: 'in-progress', priority: 'medium', points: 80,  description: 'Develop and deploy a simple smart contract on Ethereum testnet.' },
  { id: 3, title: 'Data Visualization Dashboard',        course: 'Data Visualization',    module: 'Module 7', dueDate: '2026-04-15', status: 'pending',     priority: 'low',    points: 60,  description: 'Create an interactive dashboard using D3.js or Chart.js.' },
  { id: 4, title: 'Machine Learning Model Evaluation',   course: 'AI & Machine Learning', module: 'Module 2', dueDate: '2026-03-28', status: 'completed',   priority: 'high',   points: 100, description: 'Evaluate different ML models and compare their performance.', grade: 95 },
];

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const Ico = {
  Clock: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Book: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Layers: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Award: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  Signal: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Search: ({ s = 16, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Chev: ({ s = 16, c = 'currentColor', r = false }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: r ? 'rotate(180deg)' : 'rotate(0deg)' }}><polyline points="6 9 12 15 18 9"/></svg>,
  Check: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Target: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Arrow: ({ s = 14, c = 'currentColor' }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState('courses');
  const [openModule, setOpenModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignFilter, setAssignFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const totalLessons = nextGenProgram.modules.reduce((s, m) => s + m.lessons.length, 0);

  const trackGroups = nextGenProgram.tracks.map(t => ({
    ...t,
    trackKey: t.name.split(' ')[0],
    modules: nextGenProgram.modules.filter(m => t.modules.includes(m.id)).filter(m => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.lessons.some(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }),
  }));

  const filteredAssignments = assignFilter === 'all' ? ASSIGNMENTS : ASSIGNMENTS.filter(a => a.status === assignFilter);

  const getDaysRemaining = (dueDate) => {
    const diff = new Date(dueDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nmShadow = '8px 8px 20px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.95)';
  const nmInset  = 'inset 6px 6px 14px rgba(0,0,0,0.12), inset -4px -4px 12px rgba(255,255,255,0.9)';

  // ── Stat tiles
  const statTiles = [
    { label: 'Duration',  value: nextGenProgram.totalDuration, icon: <Ico.Clock s={18} c="#6366f1" /> },
    { label: 'Modules',   value: `${nextGenProgram.totalModules}`, icon: <Ico.Layers s={18} c="#6366f1" /> },
    { label: 'Lessons',   value: `${totalLessons}`, icon: <Ico.Book s={18} c="#6366f1" /> },
    { label: 'Certificate', value: 'NFT', icon: <Ico.Award s={18} c="#6366f1" /> },
    { label: 'Assignments', value: `${ASSIGNMENTS.length}`, icon: <Ico.Target s={18} c="#6366f1" /> },
    { label: 'Level',     value: nextGenProgram.level.split(' ')[0], icon: <Ico.Signal s={18} c="#6366f1" /> },
  ];

  const assignStats = [
    { label: 'Total',       value: ASSIGNMENTS.length,                                       icon: <Ico.Book s={16} c="#6366f1" /> },
    { label: 'In Progress', value: ASSIGNMENTS.filter(a => a.status === 'in-progress').length, icon: <Ico.Clock s={16} c="#6366f1" /> },
    { label: 'Completed',   value: ASSIGNMENTS.filter(a => a.status === 'completed').length,   icon: <Ico.Check s={16} c="#6366f1" /> },
    { label: 'Pending',     value: ASSIGNMENTS.filter(a => a.status === 'pending').length,     icon: <Ico.Target s={16} c="#6366f1" /> },
  ];

  return (
    <div style={{ width: '100%', color: '#0f172a' }}>
      <style>{`
        @keyframes nm-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes nm-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ═══ PAGE HEADER ═══ */}
      <div style={{ marginBottom: '28px', animation: mounted ? 'nm-up 0.5s ease-out both' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '6px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#f0f2f5', boxShadow: nmShadow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico.Book s={20} c="#6366f1" />
          </div>
          <div>
            <h1 style={{ fontSize: '31px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px', fontFamily: 'Nasalization, sans-serif' }}>My Courses</h1>
            <p style={{ fontSize: '20px', color: '#0f172a', margin: 0, fontWeight: '500' }}>{nextGenProgram.subtitle}</p>
          </div>
        </div>
      </div>

      {/* ═══ STAT TILES ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '28px', animation: mounted ? 'nm-up 0.5s ease-out 0.05s both' : 'none' }}>
        {statTiles.map((st, i) => (
          <div key={i} style={{ background: '#f0f2f5', borderRadius: '16px', padding: '16px 14px', boxShadow: nmShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {st.icon}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>{st.value}</div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ═══ TAB BAR ═══ */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', animation: mounted ? 'nm-up 0.5s ease-out 0.1s both' : 'none' }}>
        {[
          { key: 'courses',     label: 'Course Content', icon: <Ico.Layers s={14} c="currentColor" /> },
          { key: 'bootcamp',   label: 'Bootcamp',       icon: <Ico.Award  s={14} c="currentColor" /> },
          { key: 'assignments', label: 'Assignments',    icon: <Ico.Target s={14} c="currentColor" /> },
          { key: 'overview',   label: 'Program Info',   icon: <Ico.Signal s={14} c="currentColor" /> },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            fontSize: '19px', fontWeight: '700',
            background: activeTab === tab.key ? '#6366f1' : '#f0f2f5',
            color: activeTab === tab.key ? '#fff' : '#0f172a',
            boxShadow: activeTab === tab.key
              ? '5px 5px 12px rgba(99,102,241,0.35), -3px -3px 8px rgba(255,255,255,0.8)'
              : nmShadow,
            transition: 'all 0.2s',
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: COURSE CONTENT ═══ */}
      {activeTab === 'courses' && (
        <div style={{ animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
              <Ico.Search s={16} c="#6366f1" />
            </div>
            <input
              type="text" placeholder="Search modules or lessons..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '14px', border: 'none', outline: 'none', fontSize: '19px', fontWeight: '500', color: '#0f172a', background: '#f0f2f5', boxShadow: nmInset, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.boxShadow = 'inset 4px 4px 10px rgba(99,102,241,0.2), inset -3px -3px 8px rgba(255,255,255,0.9)'}
              onBlur={e => e.target.style.boxShadow = nmInset}
            />
          </div>

          {/* All modules — flat 2-column grid */}
          {(() => {
            const allModules = nextGenProgram.modules.filter(mod => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return mod.title.toLowerCase().includes(q) || mod.lessons.some(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
            });
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {allModules.map(mod => {
                  const isOpen = openModule === mod.id;
                  return (
                    <div key={mod.id} style={{
                      background: '#f0f2f5', borderRadius: '18px', cursor: 'pointer',
                      boxShadow: isOpen ? nmInset : nmShadow,
                      transition: 'all 0.25s ease',
                      gridColumn: isOpen ? '1 / -1' : 'auto',
                    }}
                    onClick={() => setOpenModule(isOpen ? null : mod.id)}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.boxShadow = '10px 10px 24px rgba(0,0,0,0.15), -7px -7px 18px rgba(255,255,255,1)'; }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.boxShadow = nmShadow; }}
                    >
                      {/* Module header row */}
                      <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0, background: '#f0f2f5', boxShadow: isOpen ? nmInset : nmShadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: '#6366f1' }}>
                          {String(mod.number).padStart(2, '0')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3, fontFamily: 'Nasalization, sans-serif' }}>{mod.title}</h3>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '3px' }}><Ico.Book s={14} c="#6366f1" /> {mod.lessons.length} lessons</span>
                            <span style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '3px' }}><Ico.Clock s={14} c="#6366f1" /> {mod.duration}</span>
                          </div>
                        </div>
                        <div style={{ color: '#6366f1', transition: 'transform 0.25s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <Ico.Chev s={16} c="#6366f1" />
                        </div>
                      </div>

                      {/* Focus blurb when closed */}
                      {mod.focus && !isOpen && (
                        <div style={{ padding: '0 22px 16px', marginTop: '-4px' }}>
                          <p style={{ fontSize: '18px', color: '#0f172a', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>{mod.focus}</p>
                        </div>
                      )}

                      {/* Expanded lessons */}
                      {isOpen && (
                        <div onClick={e => e.stopPropagation()} style={{ padding: '0 22px 22px' }}>
                          <p style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 14px', lineHeight: 1.5 }}>
                            <strong>Focus:</strong> {mod.focus}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', alignItems: 'stretch' }}>
                            {mod.lessons.map((les, lIdx) => {
                              const tb = TYPE_BADGE[les.type] || TYPE_BADGE.theory;
                              return (
                                <div key={les.id} style={{
                                  padding: '14px 16px', borderRadius: '14px', background: '#f0f2f5',
                                  boxShadow: nmShadow, display: 'flex', flexDirection: 'column',
                                  animation: `nm-in 0.2s ease-out ${lIdx * 0.04}s both`,
                                  position: 'relative',
                                }}>
                                  {/* Coming Soon badge */}
                                  <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', fontWeight: '800', color: '#6366f1', letterSpacing: '0.4px' }}>Coming Soon</span>
                                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '6px', paddingRight: '90px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0, background: '#f0f2f5', boxShadow: 'inset 3px 3px 6px rgba(99,102,241,0.2), inset -2px -2px 5px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#6366f1' }}>
                                      {lIdx + 1}
                                    </div>
                                    <div style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', lineHeight: 1.4 }}>{les.title}</div>
                                  </div>
                                  <div style={{ fontSize: '18px', color: '#0f172a', lineHeight: 1.55, flexGrow: 1, paddingLeft: '34px' }}>{les.description}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', paddingLeft: '34px' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#f0f2f5', boxShadow: '3px 3px 6px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '800', color: tb.color, letterSpacing: '0.5px' }}>{tb.label}</span>
                                    <span style={{ fontSize: '17px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '3px' }}><Ico.Clock s={13} c="#6366f1" /> {les.duration}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ═══ TAB: BOOTCAMP ═══ */}
      {activeTab === 'bootcamp' && (
        <div style={{ animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>

          {/* Hero banner */}
          <NmCard hover={false} style={{ padding: '28px 32px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>The Transformation Path</div>
                <h2 style={{ fontSize: '31px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px', fontFamily: 'Nasalization, sans-serif' }}>4 Weeks of <span style={{ color: '#6366f1' }}>Measured Execution</span></h2>
                <p style={{ fontSize: '19px', color: '#0f172a', margin: 0, maxWidth: '480px', lineHeight: 1.6 }}>A disciplined AI Startup build cycle designed to convert intent into execution.</p>
              </div>
              <div style={{ display: 'flex', gap: '28px' }}>
                {[{ v: '4', l: 'Defined Phases' }, { v: '4', l: 'Deliverables' }, { v: 'Live', l: 'Market Validation' }].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '12px 18px', borderRadius: '14px', background: '#f0f2f5', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.07), inset -3px -3px 6px rgba(255,255,255,0.9)' }}>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#6366f1' }}>{s.v}</div>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </NmCard>

          {/* 4 week cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
            {[
              {
                week: 1,
                title: 'Problem Discovery',
                subtitle: 'Structured Idea Validation',
                accent: '#6366f1',
                description: 'Most ideas collapse because they were never tested against reality. Week 1 focuses on structured discovery. You explore multiple use cases, narrow them to high-frequency problems, and outline a workable solution structure before writing a single automation workflow.',
                objective: 'Explore multiple use cases, narrow them to high-frequency problems, and outline a workable solution structure before writing a single automation workflow.',
                deliverables: [
                  { title: 'Defined Problem Statement', desc: 'A clear, tested problem statement validated against reality.' },
                  { title: 'Target User Clarity', desc: 'Defined target user profile with clear pain points.' },
                  { title: 'AI Business Model Structure', desc: 'Draft AI business model structure ready for execution.' },
                  { title: '1-Page Concept Summary', desc: 'Concise summary document outlining your concept direction.' },
                ],
                tools: [
                  { name: 'User Interview Framework', desc: 'Structured questions to validate problem existence' },
                  { name: 'Problem Canvas Template', desc: 'Document your findings systematically' },
                ],
                outcome: 'You leave Week 1 with clarity before execution—no assumptions, no guesswork. Just structured discovery ready for build.',
              },
              {
                week: 2,
                title: 'AI MVP Development',
                subtitle: 'Functional Build Sprint',
                accent: '#6366f1',
                description: 'Now the build begins. Using practical No Code AI Tools, workflow systems, and automation platforms, you convert your concept into a functional AI Startup Prototype. The focus is not perfection. The focus is functionality.',
                objective: 'No-code stacks today reduce development timelines from traditional multi-month cycles to structured sprint cycles. That speed matters in an AI-native market.',
                deliverables: [
                  { title: 'Working Interface', desc: 'A functional interface built with no-code platforms.' },
                  { title: 'Defined Automation Logic', desc: 'Clear automation workflows and system logic structure.' },
                  { title: 'Testable AI MVP Build Framework', desc: 'A structured framework ready for user testing.' },
                  { title: 'Demonstrable Product', desc: 'A product that can be demonstrated to real users.' },
                ],
                tools: [
                  { name: 'No-Code AI Platforms', desc: 'Build functional prototypes without coding' },
                  { name: 'API Integration Tools', desc: 'Connect AI models to your interface' },
                ],
                outcome: 'You are no longer discussing ideas. You are showing execution. A working prototype ready for real user testing—not theory, not slides.',
              },
              {
                week: 3,
                title: 'Validation & Market Testing',
                subtitle: 'Evidence Before Scale',
                accent: '#6366f1',
                description: 'Now comes external reality. You test your MVP with 5 to 10 early users. You collect direct feedback. You refine positioning. You adjust before scale. This is your active AI Startup Validation Model.',
                objective: 'It moves you from assumption to evidence. You learn what resonates. You learn what needs revision. You improve before expanding.',
                deliverables: [
                  { title: 'User Testing Report', desc: 'Documented feedback from 10–15 early users.' },
                  { title: 'Iteration Plan', desc: 'Clear list of changes based on user feedback.' },
                  { title: 'Traction Metrics', desc: 'Early signals: engagement, retention, willingness to pay.' },
                ],
                tools: [
                  { name: 'User Testing Framework', desc: 'Structured feedback collection methods' },
                  { name: 'Analytics Setup', desc: 'Track user behavior and engagement' },
                ],
                outcome: 'You move into Week 4 with validated insights, real user data, and a refined product ready for structured pitching. Evidence-backed positioning—not assumptions.',
              },
              {
                week: 4,
                title: 'Pitch & Founder Positioning',
                subtitle: 'Structured Evaluation Readiness',
                accent: '#6366f1',
                description: 'Execution must be communicated clearly. Week 4 prepares you for structured evaluation inside the 3 Stage Selection Model. Your narrative is refined with defined traction signals. This is not about selling—this is about demonstrating execution.',
                objective: 'Prepare for structured evaluation inside the 3 Stage Selection Model. Your narrative is refined with defined traction signals.',
                deliverables: [
                  { title: '5-Minute Pitch', desc: 'A structured pitch presentation ready for evaluation.' },
                  { title: 'Measurable Traction Indicators', desc: 'Defined traction signals showing early execution results.' },
                  { title: 'Clearer Path Toward Founder Track', desc: 'Defined next steps for progression in the ecosystem.' },
                ],
                tools: [
                  { name: 'Pitch Deck Template', desc: 'Structured format for founder presentations' },
                  { name: 'Metrics Dashboard', desc: 'Track and present your traction data' },
                ],
                outcome: 'After 4 weeks, you are not exploring tools. You are operating as an Early Stage AI Founder inside an execution-driven ecosystem.',
              },
            ].map((w, wi) => {
              const isOpenW = openModule === `week-${w.week}`;
              return (
                <div key={w.week} style={{ borderRadius: '20px', background: '#f0f2f5', boxShadow: isOpenW ? nmInset : nmShadow, transition: 'all 0.25s' }}>
                  {/* Week header */}
                  <div
                    onClick={() => setOpenModule(isOpenW ? null : `week-${w.week}`)}
                    style={{ padding: '22px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0, background: '#f0f2f5', boxShadow: `inset 3px 3px 7px rgba(0,0,0,0.1), inset -3px -3px 7px rgba(255,255,255,0.9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', color: w.accent }}>
                      {String(w.week).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: w.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Week {w.week}</div>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', fontFamily: 'Nasalization, sans-serif' }}>{w.title}</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>{w.subtitle}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{w.deliverables.length} Deliverables</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpenW ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  {/* Collapsed preview */}
                  {!isOpenW && (
                    <div style={{ padding: '0 24px 18px' }}>
                      <p style={{ fontSize: '19px', color: '#0f172a', margin: 0, lineHeight: 1.6 }}>{w.description.slice(0, 120)}…</p>
                    </div>
                  )}

                  {/* Expanded content */}
                  {isOpenW && (
                    <div onClick={e => e.stopPropagation()} style={{ padding: '0 24px 24px' }}>
                      <p style={{ fontSize: '19px', color: '#0f172a', margin: '0 0 20px', lineHeight: 1.65 }}>{w.description}</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {/* Objective */}
                        <div style={{ padding: '18px', borderRadius: '14px', background: '#f0f2f5', boxShadow: nmShadow }}>
                          <div style={{ fontSize: '17px', fontWeight: '800', color: w.accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>Objective</div>
                          <p style={{ fontSize: '19px', color: '#0f172a', margin: 0, lineHeight: 1.6 }}>{w.objective}</p>
                        </div>

                        {/* Tools */}
                        <div style={{ padding: '18px', borderRadius: '14px', background: '#f0f2f5', boxShadow: nmShadow }}>
                          <div style={{ fontSize: '17px', fontWeight: '800', color: w.accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>Tools Used</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {w.tools.map((t, ti) => (
                              <div key={ti} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a' }}>{t.name}</span>
                                <span style={{ fontSize: '18px', color: '#0f172a' }}>{t.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ fontSize: '17px', fontWeight: '800', color: w.accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Deliverables</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                          {w.deliverables.map((d, di) => (
                            <div key={di} style={{ padding: '14px 16px', borderRadius: '12px', background: '#f0f2f5', boxShadow: nmShadow, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: w.accent, flexShrink: 0 }} />
                                <span style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a' }}>{d.title}</span>
                              </div>
                              <span style={{ fontSize: '18px', color: '#0f172a', lineHeight: 1.5, paddingLeft: '14px' }}>{d.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outcome */}
                      <div style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '14px', background: '#f0f2f5', boxShadow: `inset 3px 3px 7px rgba(0,0,0,0.07), inset -3px -3px 7px rgba(255,255,255,0.85)`, borderLeft: `3px solid ${w.accent}` }}>
                        <div style={{ fontSize: '17px', fontWeight: '800', color: w.accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Outcome</div>
                        <p style={{ fontSize: '19px', color: '#0f172a', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>{w.outcome}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom stats bar */}
          <NmCard hover={false} style={{ padding: '20px 28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { v: '4', l: 'Defined Phases', d: 'Structured weekly progression' },
                { v: '4', l: 'Tangible Deliverables', d: 'One measurable output per week' },
                { v: 'Live', l: 'Market Validation', d: 'Real user feedback before scale' },
                { v: 'Founder', l: 'Positioning Path', d: 'Pitch, traction, evaluation' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '14px', borderRadius: '14px', background: '#f0f2f5', boxShadow: nmInset }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#6366f1', marginBottom: '4px' }}>{s.v}</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '3px' }}>{s.l}</div>
                  <div style={{ fontSize: '17px', color: '#0f172a' }}>{s.d}</div>
                </div>
              ))}
            </div>
          </NmCard>
        </div>
      )}

      {/* ═══ TAB: ASSIGNMENTS ═══ */}
      {activeTab === 'assignments' && (
        <div style={{ animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
          {/* Assignment stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {assignStats.map((st, i) => (
              <div key={i} style={{ background: '#f0f2f5', borderRadius: '16px', padding: '18px 16px', boxShadow: nmShadow, display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {st.icon}
                </div>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>{st.value}</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{st.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['all', 'pending', 'in-progress', 'completed'].map(f => (
              <button key={f} onClick={() => setAssignFilter(f)} style={{
                padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontSize: '18px', fontWeight: '700', textTransform: 'capitalize',
                background: assignFilter === f ? '#6366f1' : '#f0f2f5',
                color: assignFilter === f ? '#fff' : '#0f172a',
                boxShadow: assignFilter === f
                  ? '5px 5px 12px rgba(99,102,241,0.35), -3px -3px 8px rgba(255,255,255,0.8)'
                  : nmShadow,
                transition: 'all 0.2s',
              }}>{f.replace('-', ' ')}</button>
            ))}
          </div>

          {/* Assignment cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredAssignments.map((a, i) => {
              const days = getDaysRemaining(a.dueDate);
              const isOverdue = days < 0 && a.status !== 'completed';
              const statusColor = a.status === 'completed' ? '#6366f1' : a.status === 'in-progress' ? '#D97706' : '#0f172a';
              const priorityColor = a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#D97706' : '#059669';
              return (
                <div key={a.id} style={{
                  background: '#f0f2f5', borderRadius: '18px', padding: '22px 24px',
                  boxShadow: nmShadow, transition: 'all 0.2s',
                  animation: `nm-in 0.25s ease-out ${i * 0.06}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '10px 10px 24px rgba(0,0,0,0.15), -7px -7px 18px rgba(255,255,255,1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = nmShadow; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      {/* Title + priority */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '23px', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Nasalization, sans-serif' }}>{a.title}</h3>
                        <span style={{ padding: '2px 10px', borderRadius: '8px', background: '#f0f2f5', boxShadow: '3px 3px 6px rgba(0,0,0,0.09), -2px -2px 5px rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '800', color: priorityColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{a.priority}</span>
                      </div>
                      <p style={{ fontSize: '19px', color: '#0f172a', margin: '0 0 10px', lineHeight: 1.5 }}>{a.description}</p>
                      {/* Meta row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Ico.Book s={15} c="#6366f1" /> {a.course}
                        </span>
                        <span style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Ico.Layers s={15} c="#6366f1" /> {a.module}
                        </span>
                        <span style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Ico.Clock s={15} c="#6366f1" /> Due: {new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {a.status !== 'completed' && (
                          <span style={{ fontSize: '18px', fontWeight: '700', color: isOverdue ? '#ef4444' : days <= 3 ? '#D97706' : '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Ico.Arrow s={12} c={isOverdue ? '#ef4444' : days <= 3 ? '#D97706' : '#059669'} />
                            {isOverdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side: status + points + grade */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                      <div style={{ padding: '6px 14px', borderRadius: '10px', background: '#f0f2f5', boxShadow: nmInset, fontSize: '19px', fontWeight: '700', color: statusColor, textTransform: 'capitalize' }}>
                        {a.status.replace('-', ' ')}
                      </div>
                      <div style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a' }}>{a.points} pts</div>
                      {a.grade && (
                        <div style={{ padding: '6px 14px', borderRadius: '10px', background: '#6366f1', color: '#fff', fontSize: '19px', fontWeight: '800', boxShadow: '4px 4px 10px rgba(99,102,241,0.3)' }}>Grade: {a.grade}%</div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    {a.status !== 'completed' ? (
                      <>
                        <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#f0f2f5', boxShadow: nmShadow, fontSize: '18px', fontWeight: '700', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Download Materials
                        </button>
                        <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '5px 5px 12px rgba(99,102,241,0.35), -3px -3px 8px rgba(255,255,255,0.8)' }}>
                          {a.status === 'in-progress' ? 'Continue Working' : 'Start Assignment'}
                        </button>
                      </>
                    ) : (
                      <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#f0f2f5', boxShadow: nmInset, fontSize: '18px', fontWeight: '700', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Ico.Check s={14} c="#6366f1" /> View Submission
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB: PROGRAM OVERVIEW ═══ */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>

          {/* What You Will Master */}
          <NmCard hover={false} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico.Check s={16} c="#6366f1" />
              </div>
              <h3 style={{ fontSize: '23px', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Nasalization, sans-serif' }}>What You Will Master</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {nextGenProgram.outcomes.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', borderRadius: '12px', background: '#f0f2f5', boxShadow: nmShadow }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '5px' }} />
                  <span style={{ fontSize: '19px', fontWeight: '600', color: '#0f172a', lineHeight: 1.5 }}>{o}</span>
                </div>
              ))}
            </div>
          </NmCard>

          {/* Prerequisites + Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <NmCard hover={false} style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: '#f0f2f5', boxShadow: 'inset 4px 4px 8px rgba(99,102,241,0.18), inset -3px -3px 7px rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico.Signal s={16} c="#6366f1" />
                </div>
                <h3 style={{ fontSize: '23px', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Nasalization, sans-serif' }}>Prerequisites</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nextGenProgram.prerequisites.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', borderRadius: '12px', background: '#f0f2f5', boxShadow: nmShadow }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '5px' }} />
                    <span style={{ fontSize: '19px', fontWeight: '600', color: '#0f172a', lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </NmCard>

            <NmCard hover={false} style={{ padding: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>Program Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { l: 'Format',      v: nextGenProgram.format },
                  { l: 'Language',    v: nextGenProgram.language },
                  { l: 'Level',       v: nextGenProgram.level },
                  { l: 'Certificate', v: nextGenProgram.certificateType },
                ].map((d, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: '12px', background: '#f0f2f5', boxShadow: nmInset }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '3px' }}>{d.l}</div>
                    <div style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a' }}>{d.v}</div>
                  </div>
                ))}
              </div>
            </NmCard>
          </div>
        </div>
      )}
    </div>
  );
}
