"use client";
import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";

/* ── Neumorphic design tokens ── */
const BG      = '#eef0f5';
const S_UP    = '6px 6px 14px rgba(0,0,0,0.12), -5px -5px 12px rgba(255,255,255,0.95)';
const S_UP_LG = '10px 10px 24px rgba(0,0,0,0.13), -8px -8px 20px rgba(255,255,255,1)';
const S_IN    = 'inset 5px 5px 12px rgba(0,0,0,0.11), inset -4px -4px 10px rgba(255,255,255,0.9)';
const S_IN_SM = 'inset 3px 3px 7px rgba(0,0,0,0.10), inset -2px -2px 6px rgba(255,255,255,0.85)';
const PURPLE  = '#6366f1';
const S_PURPLE= '5px 5px 14px rgba(99,102,241,0.40), -3px -3px 8px rgba(255,255,255,0.6)';

/* ── Status badge - neumorphic inset chips, monochrome except status dot ── */
const STATUS_META = {
  open:            { label:'Open',           dot:'#6366f1' },
  in_progress:     { label:'In Progress',    dot:'#f59e0b' },
  waiting_on_user: { label:'Waiting on You', dot:'#a855f7' },
  resolved:        { label:'Resolved',       dot:'#10b981' },
  closed:          { label:'Closed',         dot:'#94a3b8' },
};
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.open;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'10px', fontWeight:'800',
      padding:'4px 12px', borderRadius:'100px', background:BG, boxShadow:S_IN_SM,
      color:'#475569', whiteSpace:'nowrap' }}>
      <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:m.dot, flexShrink:0 }} />
      {m.label}
    </span>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const CATS = [
  { value:'technical', label:'Technical', desc:'Bugs, errors, login'   },
  { value:'billing',   label:'Billing',   desc:'Payments, invoices'    },
  { value:'course',    label:'Course',    desc:'Access, materials'     },
  { value:'rewards',   label:'Rewards',   desc:'DAG points, referrals' },
  { value:'account',   label:'Account',   desc:'Profile, password'     },
  { value:'other',     label:'Other',     desc:'Anything else'         },
];

const FAQS = [
  { q:'How long does it take to get a response?',         a:'Our support team typically responds within 24 hours on business days. Urgent issues are usually addressed within a few hours.' },
  { q:'How do I access my course materials?',             a:'Navigate to "My Courses" in the sidebar. All enrolled course materials, videos, and downloads are available there. If you cannot see a course you enrolled in, please submit a ticket.' },
  { q:'My DAG Points are not showing correctly - what should I do?', a:'Points are updated in real-time. If there is a discrepancy, wait 5 minutes and refresh. If the issue persists, submit a ticket under the Rewards category with the transaction details.' },
  { q:'How do I get my referral commission?',             a:'Referral commissions are tracked automatically when someone signs up using your referral link. You can view your referral earnings on the Rewards page.' },
  { q:'I forgot my password - how do I reset it?',        a:'On the login page, click Forgot Password and enter your registered email. You will receive a reset link within a few minutes. Check your spam folder if you do not see it.' },
  { q:'Can I upgrade my membership tier?',                a:'Yes! Visit the Rewards page and click the Upgrade to DAG Lieutenant button. The upgrade requires a one-time fee and unlocks additional earning potential and bonuses.' },
  { q:'How do I download my certificate after completing a course?', a:'Go to the Certifications section in your dashboard. Completed course certificates are available to download as PDF once all modules and assessments are finished.' },
  { q:'What happens after I submit a support ticket?',    a:'You will see the ticket appear in "My Tickets" with status "Open". Our team will review it and reply directly in the ticket thread. You will also receive a bell notification when we respond.' },
];

/* ── Shared neumorphic input style ── */
const nmInput = {
  width:'100%', padding:'12px 16px', borderRadius:'14px', border:'none',
  fontSize:'13px', color:'#0f172a', outline:'none',
  background:BG, boxShadow:S_IN, boxSizing:'border-box', fontFamily:'inherit',
};
const lbl = {
  fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase',
  letterSpacing:'0.7px', marginBottom:'7px', display:'block',
};

export default function StudentSupportPage() {
  const [user,         setUser]         = useState(null);
  const [tickets,      setTickets]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [msgLoading,   setMsgLoading]   = useState(false);
  const [showNewForm,  setShowNewForm]  = useState(false);
  const [replyText,    setReplyText]    = useState('');
  const [replying,     setReplying]     = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitMsg,    setSubmitMsg]    = useState(null);
  const [mounted,      setMounted]      = useState(false);
  const [form,         setForm]         = useState({ subject:'', category:'technical', message:'' });
  const [openFaq,      setOpenFaq]      = useState(null);
  const [mob,          setMob]          = useState(true);

  useLayoutEffect(() => {
    const check = () => setMob(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    try {
      const stored = localStorage.getItem('dagarmy_user');
      if (stored) { const u = JSON.parse(stored); setUser(u); fetchTickets(u.email); }
      else { setLoading(false); }
    } catch { setLoading(false); }
  }, []);

  const fetchTickets = useCallback(async (email) => {
    try {
      setLoading(true);
      const res  = await fetch(`/api/support/tickets?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) setTickets(data.tickets || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const openTicketThread = useCallback(async (ticket) => {
    setShowNewForm(false); setActiveTicket(ticket); setMsgLoading(true);
    try {
      const res  = await fetch(`/api/support/tickets/${ticket.id}`);
      const data = await res.json();
      if (data.success) { setActiveTicket(data.ticket); setMessages(data.messages || []); }
    } catch(e) { console.error(e); }
    finally { setMsgLoading(false); }
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !activeTicket || !user) return;
    setReplying(true);
    try {
      const res  = await fetch(`/api/support/tickets/${activeTicket.id}/reply`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ sender_type:'user', sender_email:user.email, sender_name:user.full_name||user.email, message:replyText.trim() }),
      });
      const data = await res.json();
      if (data.success) { setMessages(prev => [...prev, data.message]); setReplyText(''); fetchTickets(user.email); }
    } catch(e) { console.error(e); }
    finally { setReplying(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !form.subject || !form.message) return;
    setSubmitting(true); setSubmitMsg(null);
    try {
      const res  = await fetch('/api/support/tickets', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ user_email:user.email, user_name:user.full_name||user.email, user_id:user.id||null, priority:'normal', ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitMsg({ type:'success', text:`Ticket ${data.ticket.ticket_number} created! We will respond shortly.` });
        setForm({ subject:'', category:'technical', message:'' });
        fetchTickets(user.email);
        setTimeout(() => { setShowNewForm(false); setSubmitMsg(null); }, 3000);
      } else { setSubmitMsg({ type:'error', text:data.error||'Failed to create ticket' }); }
    } catch { setSubmitMsg({ type:'error', text:'Network error. Please try again.' }); }
    finally { setSubmitting(false); }
  };

  const stats = {
    open:       tickets.filter(t => t.status==='open').length,
    inProgress: tickets.filter(t => t.status==='in_progress').length,
    resolved:   tickets.filter(t => ['resolved','closed'].includes(t.status)).length,
  };

  return (
    <main style={{ width:'100%', padding: mob ? '20px 14px 80px' : '32px 36px', background:BG, minHeight:'100vh', boxSizing:'border-box' }}>
      <style>{`
        @keyframes nm-up  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .nm-ticket-row:hover { box-shadow: ${S_UP_LG} !important; }
        .nm-faq-row:hover { background: rgba(99,102,241,0.03); }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems: mob ? 'flex-start' : 'center', justifyContent:'space-between',
        flexDirection: mob ? 'column' : 'row', gap: mob ? '12px' : '0',
        marginBottom: mob ? '16px' : '32px',
        animation: mounted ? 'nm-up 0.4s ease-out both' : 'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap: mob ? '10px' : '16px' }}>
          <div style={{ width: mob ? '40px' : '52px', height: mob ? '40px' : '52px', borderRadius:'16px', background:BG, boxShadow:S_UP,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: mob ? '20px' : '26px', fontWeight:'800', color:'#0f172a', margin:'0 0 2px',
              letterSpacing:'-0.5px', fontFamily:'Nasalization, sans-serif' }}>Support</h1>
            {!mob && <p style={{ fontSize:'13px', color:'#94a3b8', margin:0, fontWeight:'500' }}>
              Submit a ticket and we will respond within 24 hours on business days
            </p>}
          </div>
        </div>
        <button onClick={() => { setShowNewForm(true); setActiveTicket(null); }}
          style={{ display:'flex', alignItems:'center', gap:'7px',
            padding: mob ? '9px 16px' : '11px 22px',
            borderRadius:'14px', border:'none', background:PURPLE, color:'#fff',
            fontSize:'13px', fontWeight:'700', cursor:'pointer', boxShadow:S_PURPLE,
            whiteSpace:'nowrap', flexShrink:0, transition:'background 0.15s',
            alignSelf: mob ? 'stretch' : 'auto', justifyContent: mob ? 'center' : 'flex-start' }}
          onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
          onMouseLeave={e => e.currentTarget.style.background = PURPLE}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Ticket
        </button>
      </div>

      {/* ── Stat tiles ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: mob ? '8px' : '16px', marginBottom: mob ? '16px' : '28px', maxWidth: mob ? '100%' : '440px',
        animation: mounted ? 'nm-up 0.38s ease-out 0.05s both' : 'none' }}>
        {[
          { label:'Open',        value:stats.open,       dot:'#6366f1' },
          { label:'In Progress', value:stats.inProgress, dot:'#f59e0b' },
          { label:'Resolved',    value:stats.resolved,   dot:'#10b981' },
        ].map((s,i) => (
          <div key={i} style={{ background:BG, borderRadius:'18px', padding:'18px 14px', boxShadow:S_UP,
            display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'13px', background:BG, boxShadow:S_IN,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ width:'12px', height:'12px', borderRadius:'50%', background:s.dot }} />
            </div>
            <div style={{ fontSize:'22px', fontWeight:'900', color:'#0f172a', letterSpacing:'-1px', lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.6px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          DEFAULT VIEW - ticket list + FAQ + contact
      ══════════════════════════════════════════════════ */}
      {!showNewForm && !activeTicket && (
        <div style={{ animation: mounted ? 'nm-up 0.4s ease-out 0.08s both' : 'none' }}>

          {/* My Tickets panel */}
          <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, overflow:'hidden', marginBottom:'24px' }}>
            {/* Panel header */}
            <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between',
              borderBottom:`1px solid rgba(0,0,0,0.05)` }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:BG, boxShadow:S_IN,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span style={{ fontWeight:'800', fontSize:'15px', color:'#0f172a' }}>My Tickets</span>
                <span style={{ padding:'2px 10px', borderRadius:'100px', fontSize:'11px', fontWeight:'800',
                  background:BG, boxShadow:S_IN_SM, color:'#64748b' }}>{tickets.length}</span>
              </div>
            </div>

            {loading ? (
              <div style={{ padding:'48px', textAlign:'center', color:'#94a3b8', fontSize:'13px' }}>Loading tickets…</div>
            ) : tickets.length === 0 ? (
              <div style={{ padding:'56px 24px', textAlign:'center' }}>
                <div style={{ width:'56px', height:'56px', background:BG, borderRadius:'16px', boxShadow:S_IN,
                  display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p style={{ color:'#475569', fontSize:'14px', fontWeight:'700', margin:'0 0 5px' }}>No tickets yet</p>
                <p style={{ color:'#94a3b8', fontSize:'12px', margin:0 }}>Submit your first ticket and we will get back to you soon.</p>
              </div>
            ) : (
              <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:'8px' }}>
                {tickets.map(t => {
                  const cat = CATS.find(c => c.value === t.category) || CATS[5];
                  return (
                    <div key={t.id} className="nm-ticket-row"
                      onClick={() => openTicketThread(t)}
                      style={{ background:BG, borderRadius:'16px', padding:'14px 16px', boxShadow:S_UP,
                        cursor:'pointer', display:'flex', alignItems:'center', gap:'14px', transition:'box-shadow 0.22s' }}>
                      <div style={{ width:'38px', height:'38px', borderRadius:'11px', background:BG, boxShadow:S_IN,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontSize:'10px', fontWeight:'900', color:PURPLE }}>{cat.label.slice(0,3).toUpperCase()}</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:'700', fontSize:'13px', color:'#0f172a', marginBottom:'2px',
                          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.subject}</div>
                        <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:'500' }}>
                          {t.ticket_number} · {timeAgo(t.created_at)}
                        </div>
                      </div>
                      <StatusBadge status={t.status} />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FAQ accordion */}
          <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, overflow:'hidden', marginBottom:'24px' }}>
            <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:'12px',
              borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'11px', background:BG, boxShadow:S_IN,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <span style={{ fontWeight:'800', fontSize:'15px', color:'#0f172a' }}>Frequently Asked Questions</span>
            </div>
            <div style={{ padding:'8px 0' }}>
              {FAQS.map((faq, i) => (
                <div key={i} className="nm-faq-row"
                  style={{ borderBottom: i < FAQS.length-1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                    transition:'background 0.15s' }}>
                  <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                    style={{ width:'100%', padding:'15px 22px', background:'none', border:'none', cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', textAlign:'left' }}>
                    <span style={{ fontWeight:'700', fontSize:'13px', color:'#0f172a', lineHeight:1.45 }}>{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0,
                        transform: openFaq===i ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.2s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openFaq===i && (
                    <div style={{ padding:'0 22px 16px', fontSize:'13px', color:'#64748b', lineHeight:1.7 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Telegram + Tips grid */}
          <div style={{ display:'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? '12px' : '20px' }}>

            {/* Email support card */}
            <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, padding:'24px',
              display:'flex', flexDirection:'column', justifyContent:'space-between', gap:'20px' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                  <div style={{ width:'42px', height:'42px', borderRadius:'13px', background:BG, boxShadow:S_IN,
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize:'10px', fontWeight:'800', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.7px' }}>Email Support</div>
                    <div style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a', marginTop:'1px' }}>Send us an Email</div>
                  </div>
                </div>
                <p style={{ fontSize:'12px', color:'#64748b', lineHeight:1.65, margin:'0 0 10px' }}>
                  Reach our support team directly via email. We aim to respond within 24 hours on business days.
                </p>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'8px', padding:'10px 12px',
                  borderRadius:'11px', background:BG, boxShadow:S_IN_SM }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:'1px' }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span style={{ fontSize:'11px', color:'#64748b', lineHeight:1.55 }}>
                    Support queries via email are <strong style={{ color:'#475569' }}>not tracked</strong> in your dashboard. Use the ticket system above for a full conversation history.
                  </span>
                </div>
              </div>
              <a href="mailto:Support@dagarmy.network"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                  borderRadius:'14px', padding:'12px 20px', color:'#fff',
                  fontWeight:'700', fontSize:'13px', textDecoration:'none',
                  background:PURPLE, boxShadow:S_PURPLE, transition:'background 0.15s',
                  alignSelf:'flex-start' }}
                onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                onMouseLeave={e => e.currentTarget.style.background = PURPLE}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Support@dagarmy.network
              </a>
            </div>

            {/* Tips card */}
            <div style={{ background:BG, borderRadius:'22px', boxShadow:S_UP, padding:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'18px' }}>
                <div style={{ width:'42px', height:'42px', borderRadius:'13px', background:BG, boxShadow:S_IN,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <span style={{ fontSize:'14px', fontWeight:'800', color:'#0f172a' }}>Tips for Faster Support</span>
              </div>
              {['Include your ticket number when following up','Attach screenshots for technical issues','Check FAQs above before submitting','Use the correct category for faster routing','Be specific about what you expected vs what happened'].map((tip,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'10px' }}>
                  <div style={{ width:'22px', height:'22px', borderRadius:'8px', background:BG, boxShadow:S_IN_SM,
                    fontSize:'10px', fontWeight:'900', color:PURPLE,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' }}>{i+1}</div>
                  <span style={{ fontSize:'12px', color:'#475569', lineHeight:1.55 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          NEW TICKET FORM
      ══════════════════════════════════════════════════ */}
      {showNewForm && !activeTicket && (
        <div style={{ background:BG, borderRadius:'26px', boxShadow:S_UP, overflow:'hidden',
          animation: mounted ? 'nm-up 0.35s ease-out both' : 'none' }}>

          {/* Form header */}
          <div style={{ padding:'24px 28px', display:'flex', alignItems:'flex-start', justifyContent:'space-between',
            borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
            <div>
              <h2 style={{ margin:'0 0 4px', fontSize:'18px', fontWeight:'800', color:'#0f172a',
                fontFamily:'Nasalization, sans-serif' }}>New Support Ticket</h2>
              <p style={{ margin:0, color:'#94a3b8', fontSize:'12px' }}>Fill in the details and our team will reply shortly.</p>
            </div>
            <button onClick={() => { setShowNewForm(false); setSubmitMsg(null); }}
              style={{ width:'36px', height:'36px', borderRadius:'12px', border:'none', background:BG,
                boxShadow:S_UP, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                color:'#64748b', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow=S_UP_LG; e.currentTarget.style.color=PURPLE; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow=S_UP;    e.currentTarget.style.color='#64748b'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:'22px' }}>

            {/* Step 1 - Category */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                <div style={{ width:'26px', height:'26px', borderRadius:'8px', background:BG, boxShadow:S_IN_SM,
                  fontSize:'12px', fontWeight:'900', color:PURPLE, display:'flex', alignItems:'center', justifyContent:'center' }}>1</div>
                <span style={{ fontWeight:'800', fontSize:'14px', color:'#0f172a' }}>Choose a Category</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns: mob ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap:'10px' }}>
                {CATS.map(cat => (
                  <button type="button" key={cat.value}
                    onClick={() => setForm(f => ({ ...f, category:cat.value }))}
                    style={{ padding:'14px 12px', borderRadius:'16px', border:'none', cursor:'pointer', textAlign:'left',
                      transition:'box-shadow 0.2s',
                      background: BG,
                      boxShadow: form.category===cat.value ? S_IN : S_UP }}>
                    <div style={{ fontWeight:'800', fontSize:'12px', marginBottom:'3px',
                      color: form.category===cat.value ? PURPLE : '#0f172a' }}>{cat.label}</div>
                    <div style={{ fontSize:'11px', color:'#94a3b8' }}>{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 - Subject */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <div style={{ width:'26px', height:'26px', borderRadius:'8px', background:BG, boxShadow:S_IN_SM,
                  fontSize:'12px', fontWeight:'900', color:PURPLE, display:'flex', alignItems:'center', justifyContent:'center' }}>2</div>
                <span style={{ fontWeight:'800', fontSize:'14px', color:'#0f172a' }}>Subject</span>
              </div>
              <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                placeholder="Brief description of your issue…" required style={nmInput} />
            </div>

            {/* Step 3 - Description */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <div style={{ width:'26px', height:'26px', borderRadius:'8px', background:BG, boxShadow:S_IN_SM,
                  fontSize:'12px', fontWeight:'900', color:PURPLE, display:'flex', alignItems:'center', justifyContent:'center' }}>3</div>
                <span style={{ fontWeight:'800', fontSize:'14px', color:'#0f172a' }}>Describe Your Issue</span>
              </div>
              <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                placeholder="Provide as much detail as possible - include error messages, steps tried, and what you expected to happen…"
                required rows={6} style={{...nmInput, resize:'vertical', lineHeight:1.65}} />
            </div>

            {/* Feedback msg */}
            {submitMsg && (
              <div style={{ padding:'13px 16px', borderRadius:'14px', background:BG,
                boxShadow: submitMsg.type==='success'
                  ? '4px 4px 10px rgba(16,185,129,0.18), -3px -3px 8px rgba(255,255,255,0.9)'
                  : '4px 4px 10px rgba(239,68,68,0.18), -3px -3px 8px rgba(255,255,255,0.9)',
                color: submitMsg.type==='success' ? '#059669' : '#dc2626',
                fontSize:'13px', fontWeight:'700' }}>
                {submitMsg.text}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display:'flex', gap:'12px' }}>
              <button type="submit" disabled={submitting}
                style={{ display:'flex', alignItems:'center', gap:'8px', padding:'13px 28px',
                  borderRadius:'14px', border:'none', background: submitting ? BG : PURPLE,
                  color: submitting ? '#94a3b8' : '#fff', fontSize:'14px', fontWeight:'700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: submitting ? S_IN : S_PURPLE, transition:'all 0.2s' }}>
                {submitting
                  ? <><div style={{ width:'15px', height:'15px', border:'2px solid rgba(100,116,139,0.3)',
                      borderTopColor:'#64748b', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Submitting…</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Submit Ticket</>
                }
              </button>
              <button type="button" onClick={() => { setShowNewForm(false); setSubmitMsg(null); }}
                style={{ padding:'13px 22px', borderRadius:'14px', border:'none', background:BG,
                  boxShadow:S_UP, color:'#64748b', fontSize:'14px', fontWeight:'700', cursor:'pointer',
                  transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow=S_UP_LG; e.currentTarget.style.color='#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow=S_UP;    e.currentTarget.style.color='#64748b'; }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TICKET THREAD
      ══════════════════════════════════════════════════ */}
      {activeTicket && (
        <div style={{ background:BG, borderRadius:'26px', boxShadow:S_UP, overflow:'hidden',
          animation: mounted ? 'nm-up 0.35s ease-out both' : 'none' }}>

          {/* Thread header */}
          <div style={{ padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between',
            borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <button onClick={() => { setActiveTicket(null); setMessages([]); }}
                style={{ width:'36px', height:'36px', borderRadius:'12px', border:'none', background:BG,
                  boxShadow:S_UP, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#64748b', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow=S_UP_LG; e.currentTarget.style.color=PURPLE; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow=S_UP;    e.currentTarget.style.color='#64748b'; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div>
                <div style={{ fontWeight:'800', fontSize:'15px', color:'#0f172a' }}>{activeTicket.subject}</div>
                <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px', fontWeight:'500' }}>
                  {activeTicket.ticket_number} · {timeAgo(activeTicket.created_at)}
                </div>
              </div>
            </div>
            <StatusBadge status={activeTicket.status} />
          </div>

          {/* Messages */}
          <div style={{ padding:'20px 24px', minHeight:'280px', maxHeight:'460px', overflowY:'auto',
            background:BG, boxShadow:S_IN, margin:'16px', borderRadius:'16px' }}>
            {msgLoading ? (
              <div style={{ textAlign:'center', padding:'40px', color:'#94a3b8', fontSize:'13px' }}>Loading messages…</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px', color:'#94a3b8', fontSize:'13px' }}>No messages yet.</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                {messages.map(msg => {
                  const isUser = msg.sender_type === 'user';
                  return (
                    <div key={msg.id} style={{ display:'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap:'10px', alignItems:'flex-start' }}>
                      {/* Avatar */}
                      <div style={{ width:'34px', height:'34px', borderRadius:'11px', background:BG,
                        boxShadow: isUser ? S_PURPLE : S_UP,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isUser ? '#fff' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div style={{ maxWidth:'70%' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'5px',
                          flexDirection: isUser ? 'row-reverse' : 'row' }}>
                          <span style={{ fontSize:'11px', fontWeight:'800', color: isUser ? PURPLE : '#0f172a' }}>
                            {isUser ? 'You' : (msg.sender_name || 'Support')}
                          </span>
                          <span style={{ fontSize:'10px', color:'#94a3b8' }}>{timeAgo(msg.created_at)}</span>
                        </div>
                        {/* Bubble */}
                        <div style={{
                          background:BG,
                          boxShadow: isUser ? S_PURPLE : S_UP,
                          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                          padding:'12px 16px', fontSize:'13px',
                          color: isUser ? '#fff' : '#0f172a',
                          lineHeight:1.6,
                          background: isUser ? PURPLE : BG,
                        }}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reply box */}
          {!['resolved','closed'].includes(activeTicket.status) && (
            <div style={{ padding:'16px 24px 24px', display:'flex', gap:'12px', alignItems:'flex-end' }}>
              <textarea value={replyText} onChange={e=>setReplyText(e.target.value)}
                placeholder="Type your reply… (Ctrl+Enter to send)" rows={3}
                style={{...nmInput, resize:'none', flex:1}}
                onKeyDown={e=>{ if(e.key==='Enter' && e.ctrlKey) handleReply(); }} />
              <button onClick={handleReply} disabled={replying || !replyText.trim()}
                style={{ display:'flex', alignItems:'center', gap:'7px', padding:'12px 20px',
                  borderRadius:'14px', border:'none',
                  background: replying || !replyText.trim() ? BG : PURPLE,
                  color:  replying || !replyText.trim() ? '#94a3b8' : '#fff',
                  fontSize:'13px', fontWeight:'700', whiteSpace:'nowrap',
                  cursor: replying || !replyText.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: replying || !replyText.trim() ? S_IN : S_PURPLE,
                  transition:'all 0.2s' }}>
                {replying
                  ? <><div style={{ width:'14px', height:'14px', border:'2px solid rgba(100,116,139,0.3)',
                      borderTopColor:'#64748b', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Sending…</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Reply</>
                }
              </button>
            </div>
          )}
          {['resolved','closed'].includes(activeTicket.status) && (
            <div style={{ padding:'16px 24px', margin:'0 16px 16px', borderRadius:'14px', background:BG,
              boxShadow:S_IN, textAlign:'center', color:'#94a3b8', fontSize:'12px' }}>
              This ticket is {activeTicket.status}. If you need further assistance, please open a new ticket.
            </div>
          )}
        </div>
      )}
    </main>
  );
}









