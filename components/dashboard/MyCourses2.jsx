"use client";
import { useState, useEffect } from "react";
import { nextGenProgram } from "@/data/next-gen-program";

const TRACK = {
  Yellow: { accent: '#D97706', soft: '#FEF3C7', text: '#92400E', border: '#FDE68A', grad: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  Green:  { accent: '#059669', soft: '#D1FAE5', text: '#065F46', border: '#A7F3D0', grad: 'linear-gradient(135deg, #10B981, #059669)' },
  Blue:   { accent: '#2563EB', soft: '#DBEAFE', text: '#1E40AF', border: '#93C5FD', grad: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
};

const TYPE_BADGE = {
  theory:     { label: 'THEORY', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  drill:      { label: 'DRILL', bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  strategy:   { label: 'STRATEGY', bg: '#EDE9FE', color: '#5B21B6', border: '#DDD6FE' },
  graduation: { label: 'GRADUATION', bg: '#FEF3C7', color: '#78350F', border: '#FCD34D' },
};

// Icons
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
  const [openModule, setOpenModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const totalLessons = nextGenProgram.modules.reduce((s, m) => s + m.lessons.length, 0);

  // Group modules by track
  const trackGroups = nextGenProgram.tracks.map(t => ({
    ...t,
    theme: TRACK[t.name.split(' ')[0]] || TRACK.Yellow,
    modules: nextGenProgram.modules.filter(m => t.modules.includes(m.id)).filter(m => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.lessons.some(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }),
  }));

  const d = (delay) => mounted ? `mc-up 0.5s ease-out ${delay}s both` : 'none';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes mc-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes mc-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .mc-mod:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.07) !important; transform: translateY(-3px) !important; }
        .mc-mod:hover .mc-mod-arrow { opacity: 1 !important; transform: translateX(0) !important; }
        .mc-les:hover { background: #F8FAFC !important; }
        .mc-les:hover .mc-les-num { background: #0F172A !important; color: #fff !important; }
      `}</style>

      <div style={{ width: '100%', fontFamily: "'Outfit', sans-serif", color: '#0F172A' }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '20px', padding: '32px 36px', marginBottom: '24px',
          position: 'relative', overflow: 'hidden',
          animation: d(0),
        }}>
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
                  borderRadius: '100px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)',
                  fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: '#FBBF24', marginBottom: '14px',
                }}>
                  <Ico.Target s={9} c="#FBBF24" /> ENROLLED PROGRAM
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.25 }}>
                  {nextGenProgram.title}
                </h1>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.6, maxWidth: '480px' }}>
                  {nextGenProgram.subtitle}
                </p>
              </div>

              {/* Quick stats - vertical strip on right */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', minWidth: '340px' }}>
                {[
                  { icon: <Ico.Clock s={15} c="#FBBF24" />, val: nextGenProgram.totalDuration, lbl: 'Duration', bg: 'rgba(245,158,11,0.1)' },
                  { icon: <Ico.Layers s={15} c="#34D399" />, val: `${nextGenProgram.totalModules} Modules`, lbl: `${totalLessons} Lessons`, bg: 'rgba(16,185,129,0.1)' },
                  { icon: <Ico.Award s={15} c="#60A5FA" />, val: 'NFT Cert', lbl: 'On-Chain', bg: 'rgba(59,130,246,0.1)' },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    animation: d(0.1 + i * 0.06),
                  }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      {s.icon}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#F1F5F9', marginBottom: '2px' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SEARCH BAR ═══ */}
        <div style={{ marginBottom: '32px', position: 'relative', animation: d(0.2) }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            <Ico.Search s={16} c="#94A3B8" />
          </div>
          <input type="text" placeholder="Search modules, lessons, or topics..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '13px 20px 13px 44px', borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.08)', background: '#fff', fontSize: '14px',
              fontWeight: '500', color: '#0F172A', outline: 'none', fontFamily: "'Outfit', sans-serif",
              boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#D97706'; e.target.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.08)'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
          />
        </div>

        {/* ═══ TRACK SECTIONS ═══ */}
        {trackGroups.map((tg, tIdx) => {
          if (tg.modules.length === 0) return null;
          const th = tg.theme;
          return (
            <div key={tg.name} style={{ marginBottom: '40px', animation: d(0.25 + tIdx * 0.1) }}>
              {/* Track header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', background: th.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 14px ${th.accent}33`,
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>{tg.modules.length}</span>
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                    {tg.name}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontWeight: '500' }}>{tg.duration}</p>
                </div>
                <div style={{ flex: 1, height: '2px', background: `linear-gradient(90deg, ${th.border}, transparent)`, marginLeft: '8px', borderRadius: '1px' }} />
              </div>

              {/* Module cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {tg.modules.map((mod, mIdx) => {
                  const isOpen = openModule === mod.id;
                  return (
                    <div key={mod.id} className="mc-mod" style={{
                      borderRadius: '18px', background: '#fff',
                      border: `1px solid ${isOpen ? th.border : 'rgba(0,0,0,0.06)'}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.3s ease', cursor: 'pointer',
                      gridColumn: isOpen ? '1 / -1' : 'auto',
                    }}
                    onClick={() => setOpenModule(isOpen ? null : mod.id)}
                    >
                      {/* Card top */}
                      <div style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Number */}
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                          background: th.soft, border: `1.5px solid ${th.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '20px', fontWeight: '800', color: th.text,
                        }}>
                          {String(mod.number).padStart(2, '0')}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', margin: '0 0 6px', lineHeight: 1.3 }}>
                            {mod.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500', color: '#94A3B8' }}>
                              <Ico.Book s={12} c="#94A3B8" /> {mod.lessons.length} lessons
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500', color: '#94A3B8' }}>
                              <Ico.Clock s={12} c="#94A3B8" /> {mod.duration}
                            </span>
                          </div>
                        </div>

                        <div className="mc-mod-arrow" style={{ opacity: 0.4, transition: 'all 0.2s', transform: 'translateX(-4px)' }}>
                          <Ico.Chev s={16} c="#94A3B8" r={isOpen} />
                        </div>
                      </div>

                      {/* Focus line */}
                      {mod.focus && !isOpen && (
                        <div style={{ padding: '0 24px 16px', marginTop: '-6px' }}>
                          <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                            {mod.focus}
                          </p>
                        </div>
                      )}

                      {/* Expanded lessons */}
                      {isOpen && (
                        <div onClick={e => e.stopPropagation()} style={{
                          borderTop: `1px solid ${th.border}40`, padding: '16px 24px 22px',
                          background: '#FAFBFC', cursor: 'default',
                        }}>
                          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>
                            <strong style={{ color: '#0F172A' }}>Focus:</strong> {mod.focus}
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                            {mod.lessons.map((les, lIdx) => {
                              const tb = TYPE_BADGE[les.type] || TYPE_BADGE.theory;
                              return (
                                <div key={les.id} className="mc-les" style={{
                                  padding: '14px 16px', borderRadius: '14px', background: '#fff',
                                  border: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '12px',
                                  alignItems: 'flex-start', transition: 'background 0.15s',
                                  animation: `mc-in 0.25s ease-out ${lIdx * 0.04}s both`,
                                }}>
                                  <div className="mc-les-num" style={{
                                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                                    background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: '700', color: '#64748B', transition: 'all 0.15s',
                                  }}>
                                    {lIdx + 1}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', marginBottom: '3px', lineHeight: 1.35 }}>
                                      {les.title}
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px', lineHeight: 1.5 }}>
                                      {les.description}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{
                                        padding: '2px 8px', borderRadius: '5px', background: tb.bg,
                                        border: `1px solid ${tb.border}`, fontSize: '9px', fontWeight: '700',
                                        color: tb.color, letterSpacing: '0.6px',
                                      }}>{tb.label}</span>
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', fontWeight: '500', color: '#94A3B8' }}>
                                        <Ico.Clock s={10} c="#94A3B8" /> {les.duration}
                                      </span>
                                    </div>
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
            </div>
          );
        })}

        {/* ═══ BOTTOM: 2-col — Outcomes + Prerequisites ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '12px', animation: d(0.6) }}>
          {/* Outcomes */}
          <div style={{
            padding: '28px 30px', borderRadius: '20px', background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico.Check s={14} c="#059669" />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', margin: 0 }}>What You Will Master</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {nextGenProgram.outcomes.map((o, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 12px',
                  borderRadius: '10px', background: '#FAFBFC', fontSize: '12.5px', fontWeight: '500',
                  color: '#475569', lineHeight: 1.45,
                }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '2px', background: '#059669', flexShrink: 0, marginTop: '6px', transform: 'rotate(45deg)' }} />
                  {o}
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites + Program Info */}
          <div style={{
            padding: '28px 30px', borderRadius: '20px', background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico.Signal s={14} c="#2563EB" />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Prerequisites</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
              {nextGenProgram.prerequisites.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 12px',
                  borderRadius: '10px', background: '#FAFBFC', fontSize: '12.5px', fontWeight: '500',
                  color: '#475569', lineHeight: 1.45,
                }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '2px', background: '#2563EB', flexShrink: 0, marginTop: '6px', transform: 'rotate(45deg)' }} />
                  {p}
                </div>
              ))}
            </div>

            {/* Program details */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '18px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', margin: '0 0 12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Program Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { l: 'Format', v: nextGenProgram.format },
                  { l: 'Language', v: nextGenProgram.language },
                  { l: 'Level', v: nextGenProgram.level },
                  { l: 'Certificate', v: nextGenProgram.certificateType },
                ].map((d, i) => (
                  <div key={i} style={{ padding: '8px 10px', borderRadius: '8px', background: '#FAFBFC' }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>{d.l}</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A' }}>{d.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
