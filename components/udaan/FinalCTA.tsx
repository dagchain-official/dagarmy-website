'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

const TICKER = [
  'Build with AI', 'Own your future', 'South Asia rising',
  'Delhi to Dhaka', 'Lahore to Lucknow', 'Founders not followers',
  'Execution over noise', '100K strong', 'Not waiting',
  'Build with AI', 'Own your future', 'South Asia rising',
  'Delhi to Dhaka', 'Lahore to Lucknow', 'Founders not followers',
  'Execution over noise', '100K strong', 'Not waiting',
];

const STATS = [
  { value: '100,000', label: 'Founders goal' },
  { value: '2030',    label: 'Target year' },
  { value: '3',       label: 'Nations united' },
  { value: '∞',       label: 'Economic impact' },
];

const HEADLINES: { text: string; accent: boolean; orangeWord?: string }[] = [
  { text: 'We are not building',  accent: false },
  { text: 'a course.',            accent: false, orangeWord: 'course' },
  { text: 'We are building a',    accent: false },
  { text: 'generation.',          accent: true  },
];

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: 28, textAlign: 'center' }}
    >
      <div style={{ fontSize: '29px', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 6, color: '#111' }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999' }}>{label}</div>
    </motion.div>
  );
}

function HeadlineLine({ text, accent, orangeWord, index }: { text: string; accent: boolean; orangeWord?: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const content = orangeWord
    ? text.split(orangeWord).map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && (
            <span style={{ color: '#f59e0b' }}>{orangeWord}</span>
          )}
        </span>
      ))
    : text;

  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'block' }}>
      <motion.div
        initial={{ y: '110%', skewY: 2 }}
        animate={inView ? { y: '0%', skewY: 0 } : {}}
        transition={{ duration: 0.85, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'inline-block', lineHeight: 0.92, color: accent ? '#888' : 'inherit' }}
      >
        {content}
      </motion.div>
    </div>
  );
}

export default function FinalCTA() {
  const sRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <section ref={sRef} style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>

      {/* ── Marquee ticker ── */}
      <div style={{
        borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0',
        background: '#fafafa', padding: '14px 0', overflow: 'hidden',
      }}>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {TICKER.map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                margin: '0 20px', fontSize: '13px', fontWeight: 600, color: '#888',
              }}>
                {item}
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#111', display: 'inline-block' }} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ position: 'relative', padding: '140px 0 120px', overflow: 'hidden' }}>
        {/* Dot bg */}
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />

        {/* Soft violet glow */}
        <div style={{
          position: 'absolute', width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(91,75,236,0.08) 0%, transparent 65%)',
          borderRadius: '50%',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }} />

        <motion.div style={{ y: parallaxY, position: 'relative', zIndex: 10 }} className="wrap">

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}
            >
            </motion.div>

            {/* Big headline */}
            <div style={{
              fontSize: 'clamp(48px, 7vw, 112px)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 0.92,
              color: '#111',
            }}>
              {HEADLINES.map(({ text, accent, orangeWord }, i) => (
                <HeadlineLine key={text} text={text} accent={accent} orangeWord={orangeWord} index={i} />
              ))}
            </div>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
              style={{
                color: '#666', fontSize: '18px',
                marginTop: 40, maxWidth: 560,
                marginLeft: 'auto', marginRight: 'auto',
                lineHeight: 1.65,
              }}
            >
              If you believe AI should create ownership — not just employment —
              this is where you start.
            </motion.p>
          </div>

          {/* ── Stats grid ── */}
          <div className="udaan-finalcta-stats" style={{
            margin: '0 auto 56px',
          }}>
            {STATS.map(({ value, label }, i) => (
              <StatCard key={label} value={value} label={label} index={i} />
            ))}
          </div>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}
          >
            <motion.button
              onClick={() => window.dispatchEvent(new CustomEvent("dagarmy:open-signin"))}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn btn-v"
              style={{ padding: '16px 52px', fontSize: '16px', cursor: 'pointer' }}
            >
              Join the Founder Network
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 7.5h13M8 2l6 5.5-6 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
            <motion.a
              href="/bootcamp"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-ghost"
              style={{ padding: '16px 40px', fontSize: '16px' }}
            >
              Explore Bootcamp
            </motion.a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            style={{ textAlign: 'center', color: '#aaa', fontSize: '14px', marginTop: 32 }}
          >
            100,000 strong. By 2030.
          </motion.p>
        </motion.div>
      </div>

    </section>
  );
}
