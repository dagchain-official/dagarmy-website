import React from "react";

const nm = {
  bg: '#ffffff',
  shadow: '6px 6px 16px rgba(0,0,0,0.09), -4px -4px 12px rgba(255,255,255,0.9)',
  shadowSm: '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)',
  shadowInset: 'inset 3px 3px 8px rgba(0,0,0,0.07), inset -2px -2px 6px rgba(255,255,255,0.9)',
  shadowHover: '10px 10px 24px rgba(0,0,0,0.12), -6px -6px 16px rgba(255,255,255,0.95)',
};

const stats = [
  { value: '50+', label: 'Articles' },
  { value: '50K+', label: 'Readers' },
  { value: 'Weekly', label: 'Updates' },
];

export default function PageTitle({ title = "DAGARMY Blog" }) {
  const renderTitle = () => {
    if (title === "DAGARMY Blog") {
      return (
        <>
          <span style={{ fontFamily: 'Nasalization, sans-serif' }}>DAGARMY</span>{' '}
          <span style={{ fontFamily: 'Nasalization, sans-serif' }}>Blog</span>
        </>
      );
    }
    return title;
  };

  return (
    <div style={{ background: nm.bg, padding: '56px 0 40px' }}>
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div style={{ textAlign: 'center' }}>

              {/* Label badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '6px 18px', borderRadius: '20px',
                background: nm.bg, boxShadow: nm.shadowSm,
                marginBottom: '18px',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Knowledge Hub
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', color: '#0f172a', marginBottom: '14px', lineHeight: '1.2' }}>
                {renderTitle()}
              </h1>

              {/* Subtitle */}
              <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.7' }}>
                Insights on AI, Blockchain, and Data Visualization from the Vibe Coder Army
              </p>

              {/* Stats row */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: nm.bg, borderRadius: '18px', boxShadow: nm.shadow, padding: '20px 40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {stats.map((s, i) => (
                  <React.Fragment key={s.label}>
                    <div style={{ textAlign: 'center', padding: '0 24px' }}>
                      <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{s.value}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{s.label}</div>
                    </div>
                    {i < stats.length - 1 && (
                      <div style={{ width: '1px', height: '36px', background: 'rgba(148,163,184,0.3)', flexShrink: 0 }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
