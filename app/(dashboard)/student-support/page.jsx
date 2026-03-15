"use client";
import React, { useState, useEffect, useCallback } from "react";
import DashboardNav2 from "@/components/dashboard/DashboardNav2";

const STATUS_META = {
  open:            { label: "Open",           color: "#2563eb", bg: "#dbeafe", border: "#bfdbfe" },
  in_progress:     { label: "In Progress",    color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
  waiting_on_user: { label: "Waiting on You", color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" },
  resolved:        { label: "Resolved",       color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" },
  closed:          { label: "Closed",         color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" },
};
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.open;
  return <span style={{ fontSize:"11px",fontWeight:"700",padding:"3px 10px",borderRadius:"100px",background:m.bg,color:m.color,border:`1px solid ${m.border}`,whiteSpace:"nowrap" }}>{m.label}</span>;
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
const CATS = [
  { value:"technical", label:"Technical", desc:"Bugs, errors, login",   color:"#6366f1", bg:"#eef2ff" },
  { value:"billing",   label:"Billing",   desc:"Payments, invoices",    color:"#16a34a", bg:"#dcfce7" },
  { value:"course",    label:"Course",    desc:"Access, materials",     color:"#d97706", bg:"#fef3c7" },
  { value:"rewards",   label:"Rewards",   desc:"DAG points, referrals", color:"#7c3aed", bg:"#ede9fe" },
  { value:"account",   label:"Account",   desc:"Profile, password",     color:"#0891b2", bg:"#e0f2fe" },
  { value:"other",     label:"Other",     desc:"Anything else",         color:"#64748b", bg:"#f1f5f9" },
];
const FAQS = [
  { q:"How long does it take to get a response?", a:"Our support team typically responds within 24 hours on business days. Urgent issues are usually addressed within a few hours." },
  { q:"How do I access my course materials?", a:'Navigate to "My Courses" in the sidebar. All enrolled course materials, videos, and downloads are available there. If you cannot see a course you enrolled in, please submit a ticket.' },
  { q:"My DAG Points are not showing correctly � what should I do?", a:"Points are updated in real-time. If there is a discrepancy, wait 5 minutes and refresh. If the issue persists, submit a ticket under the Rewards category with the transaction details." },
  { q:"How do I get my referral commission?", a:"Referral commissions are tracked automatically when someone signs up using your referral link. You can view your referral earnings on the Rewards page." },
  { q:"I forgot my password � how do I reset it?", a:"On the login page, click Forgot Password and enter your registered email. You will receive a reset link within a few minutes. Check your spam folder if you do not see it." },
  { q:"Can I upgrade my membership tier?", a:"Yes! Visit the Rewards page and click the Upgrade to DAG Lieutenant button. The upgrade requires a one-time fee and unlocks additional earning potential and bonuses." },
  { q:"How do I download my certificate after completing a course?", a:"Go to the Certifications section in your dashboard. Completed course certificates are available to download as PDF once all modules and assessments are finished." },
  { q:"What happens after I submit a support ticket?", a:'You will see the ticket appear in "My Tickets" with status "Open". Our team will review it and reply directly in the ticket thread. You will also receive a bell notification when we respond.' },
];

export default function StudentSupportPage() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ subject:"", category:"technical", message:"" });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    try {
      const stored = localStorage.getItem("dagarmy_user");
      if (stored) { const u = JSON.parse(stored); setUser(u); fetchTickets(u.email); }
      else { setLoading(false); }
    } catch { setLoading(false); }
  }, []);

  const fetchTickets = useCallback(async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/support/tickets?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) setTickets(data.tickets || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const openTicket = useCallback(async (ticket) => {
    setShowNewForm(false); setActiveTicket(ticket); setMsgLoading(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`);
      const data = await res.json();
      if (data.success) { setActiveTicket(data.ticket); setMessages(data.messages || []); }
    } catch(e) { console.error(e); }
    finally { setMsgLoading(false); }
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !activeTicket || !user) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/support/tickets/${activeTicket.id}/reply`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ sender_type:"user", sender_email:user.email, sender_name:user.full_name||user.email, message:replyText.trim() }),
      });
      const data = await res.json();
      if (data.success) { setMessages(prev => [...prev, data.message]); setReplyText(""); fetchTickets(user.email); }
    } catch(e) { console.error(e); }
    finally { setReplying(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !form.subject || !form.message) return;
    setSubmitting(true); setSubmitMsg(null);
    try {
      const res = await fetch("/api/support/tickets", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ user_email:user.email, user_name:user.full_name||user.email, user_id:user.id||null, priority:"normal", ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitMsg({ type:"success", text:`Ticket ${data.ticket.ticket_number} created! We will respond shortly.` });
        setForm({ subject:"", category:"technical", message:"" });
        fetchTickets(user.email);
        setTimeout(() => { setShowNewForm(false); setSubmitMsg(null); }, 3000);
      } else { setSubmitMsg({ type:"error", text:data.error||"Failed to create ticket" }); }
    } catch { setSubmitMsg({ type:"error", text:"Network error. Please try again." }); }
    finally { setSubmitting(false); }
  };

  const stats = {
    open: tickets.filter(t => t.status==="open").length,
    inProgress: tickets.filter(t => t.status==="in_progress").length,
    resolved: tickets.filter(t => ["resolved","closed"].includes(t.status)).length,
  };
  const inp = { width:"100%", padding:"12px 16px", borderRadius:"12px", border:"1.5px solid #e2e8f0", fontSize:"14px", outline:"none", background:"#fff", color:"#0f172a", boxSizing:"border-box", fontFamily:"inherit" };
  const lbl = { fontSize:"11px", fontWeight:"700", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"8px", display:"block" };

  return (
    <div style={{ minHeight:"100vh", background:"#f0f2f5", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", flex:1 }}>
          <div style={{ width:'248px', flexShrink:0, padding:'20px 12px', position:'sticky', top:'0', height:'100vh', overflowY:'auto', background:'#f0f2f5' }}>
            <DashboardNav2 />
          </div>
        <main style={{ flex:1, padding:"32px 28px", minWidth:0 }}>

          {/* HERO BANNER */}
          <div style={{ background:"linear-gradient(135deg,#1e3a5f 0%,#2563eb 60%,#7c3aed 100%)", borderRadius:"20px", padding:"40px 48px", marginBottom:"32px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
            <div style={{ position:"absolute", bottom:"-60px", right:"120px", width:"160px", height:"160px", borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase" }}>DAG Army Support</span>
              </div>
              <h1 style={{ color:"#fff", fontSize:"32px", fontWeight:"800", margin:"0 0 10px", lineHeight:1.2 }}>How can we help you?</h1>
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"15px", margin:"0 0 28px", maxWidth:"520px" }}>Our support team is here to assist you. Submit a ticket and we will respond within 24 hours on business days.</p>
              <div style={{ display:"flex", gap:"24px", flexWrap:"wrap", alignItems:"center" }}>
                <button onClick={() => { setShowNewForm(true); setActiveTicket(null); }} style={{ background:"#fff", color:"#2563eb", border:"none", borderRadius:"12px", padding:"12px 24px", fontWeight:"700", fontSize:"14px", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Support Ticket
                </button>
                <div style={{ display:"flex", gap:"24px" }}>
                  {[{label:"Open",val:stats.open,c:"#93c5fd"},{label:"In Progress",val:stats.inProgress,c:"#fde68a"},{label:"Resolved",val:stats.resolved,c:"#86efac"}].map(s=>(
                    <div key={s.label} style={{ textAlign:"center" }}>
                      <div style={{ color:"#fff", fontSize:"24px", fontWeight:"800" }}>{s.val}</div>
                      <div style={{ color:s.c, fontSize:"11px", fontWeight:"600" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TICKET LIST + FAQ + CONTACT (default view) */}
          {!showNewForm && !activeTicket && (
            <div>
              <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:"28px" }}>
                <div style={{ padding:"20px 24px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span style={{ fontWeight:"700", fontSize:"16px", color:"#0f172a" }}>My Tickets</span>
                    <span style={{ background:"#f1f5f9", color:"#64748b", fontSize:"12px", fontWeight:"600", padding:"2px 10px", borderRadius:"100px" }}>{tickets.length}</span>
                  </div>
                </div>
                {loading ? (
                  <div style={{ padding:"48px", textAlign:"center", color:"#94a3b8" }}>Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div style={{ padding:"56px 24px", textAlign:"center" }}>
                    <div style={{ width:"64px", height:"64px", background:"#f1f5f9", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <p style={{ color:"#64748b", fontSize:"15px", fontWeight:"600", margin:"0 0 6px" }}>No tickets yet</p>
                    <p style={{ color:"#94a3b8", fontSize:"13px", margin:0 }}>Submit your first support ticket and we will get back to you soon.</p>
                  </div>
                ) : (
                  <div>
                    {tickets.map((t, i) => {
                      const cat = CATS.find(c => c.value === t.category) || CATS[5];
                      return (
                        <div key={t.id} onClick={() => openTicket(t)} style={{ padding:"16px 24px", borderBottom: i < tickets.length-1 ? "1px solid #f8fafc" : "none", cursor:"pointer", display:"flex", alignItems:"center", gap:"16px" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <span style={{ fontSize:"11px", fontWeight:"800", color:cat.color }}>{cat.label.slice(0,3).toUpperCase()}</span>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:"600", fontSize:"14px", color:"#0f172a", marginBottom:"3px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.subject}</div>
                            <div style={{ fontSize:"12px", color:"#94a3b8" }}>{t.ticket_number} &middot; {timeAgo(t.created_at)}</div>
                          </div>
                          <StatusBadge status={t.status} />
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* FAQ */}
              <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:"28px" }}>
                <div style={{ padding:"20px 24px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:"10px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span style={{ fontWeight:"700", fontSize:"16px", color:"#0f172a" }}>Frequently Asked Questions</span>
                </div>
                <div style={{ padding:"8px 0" }}>
                  {FAQS.map((faq, i) => (
                    <div key={i} style={{ borderBottom: i < FAQS.length-1 ? "1px solid #f8fafc" : "none" }}>
                      <button onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ width:"100%", padding:"16px 24px", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px", textAlign:"left" }}>
                        <span style={{ fontWeight:"600", fontSize:"14px", color:"#0f172a" }}>{faq.q}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, transform: openFaq===i ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      {openFaq===i && <div style={{ padding:"0 24px 16px", fontSize:"14px", color:"#64748b", lineHeight:1.7 }}>{faq.a}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTACT + TIPS */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
                <div style={{ background:"linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius:"16px", padding:"24px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"11px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"8px" }}>Telegram Support</div>
                    <div style={{ color:"#fff", fontSize:"22px", fontWeight:"800", marginBottom:"8px" }}>Direct Support</div>
                    <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px", lineHeight:1.6, margin:"0 0 20px" }}>Get fast, direct help from our support team on Telegram. Click the button below to open a chat.</p>
                  </div>
                  <a href="https://t.me/dagchain_network" target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:"10px", background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:"12px", padding:"12px 20px", color:"#fff", fontWeight:"700", fontSize:"14px", textDecoration:"none", backdropFilter:"blur(4px)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/></svg>
                    Join @dagchain_network
                  </a>
                </div>
                <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #e2e8f0", padding:"24px" }}>
                  <div style={{ color:"#64748b", fontSize:"11px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"16px" }}>Tips for Faster Support</div>
                  {["Include your ticket number when following up","Attach screenshots for technical issues","Check FAQs above before submitting","Use the correct category for faster routing","Be specific about what you expected vs what happened"].map((tip,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", marginBottom:"10px" }}>
                      <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#dbeafe", color:"#2563eb", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"1px" }}>{i+1}</div>
                      <span style={{ fontSize:"13px", color:"#475569", lineHeight:1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* NEW TICKET FORM */}
          {showNewForm && !activeTicket && (
            <div style={{ background:"#fff", borderRadius:"20px", border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <div style={{ background:"linear-gradient(135deg,#f8fafc,#eff6ff)", padding:"28px 32px", borderBottom:"1px solid #e2e8f0" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <h2 style={{ margin:"0 0 6px", fontSize:"22px", fontWeight:"800", color:"#0f172a" }}>New Support Ticket</h2>
                    <p style={{ margin:0, color:"#64748b", fontSize:"14px" }}>Fill in the details below and our team will get back to you shortly.</p>
                  </div>
                  <button onClick={() => { setShowNewForm(false); setSubmitMsg(null); }} style={{ background:"#f1f5f9", border:"none", borderRadius:"10px", width:"36px", height:"36px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} style={{ padding:"32px" }}>
                <div style={{ marginBottom:"28px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
                    <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"#2563eb", color:"#fff", fontSize:"13px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>1</div>
                    <span style={{ fontWeight:"700", fontSize:"15px", color:"#0f172a" }}>Choose a Category</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
                    {CATS.map(cat => (
                      <button type="button" key={cat.value} onClick={() => setForm(f=>({...f, category:cat.value}))}
                        style={{ padding:"16px 12px", borderRadius:"14px", border:`2px solid ${form.category===cat.value ? cat.color : "#e2e8f0"}`, background: form.category===cat.value ? cat.bg : "#fff", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
                        <div style={{ fontWeight:"700", fontSize:"13px", color: form.category===cat.value ? cat.color : "#0f172a", marginBottom:"4px" }}>{cat.label}</div>
                        <div style={{ fontSize:"11px", color:"#94a3b8" }}>{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:"24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                    <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"#2563eb", color:"#fff", fontSize:"13px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>2</div>
                    <span style={{ fontWeight:"700", fontSize:"15px", color:"#0f172a" }}>Subject</span>
                  </div>
                  <input value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Brief description of your issue..." required style={inp} />
                </div>
                <div style={{ marginBottom:"28px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                    <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"#2563eb", color:"#fff", fontSize:"13px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>3</div>
                    <span style={{ fontWeight:"700", fontSize:"15px", color:"#0f172a" }}>Describe Your Issue</span>
                  </div>
                  <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Please provide as much detail as possible. Include any error messages, steps you have already tried, and what you expected to happen..." required rows={6} style={{...inp, resize:"vertical", lineHeight:1.6}} />
                </div>
                {submitMsg && (
                  <div style={{ padding:"14px 18px", borderRadius:"12px", marginBottom:"20px", background: submitMsg.type==="success" ? "#dcfce7" : "#fee2e2", color: submitMsg.type==="success" ? "#16a34a" : "#dc2626", fontSize:"14px", fontWeight:"600", border:`1px solid ${submitMsg.type==="success" ? "#bbf7d0" : "#fecaca"}` }}>
                    {submitMsg.text}
                  </div>
                )}
                <div style={{ display:"flex", gap:"12px" }}>
                  <button type="submit" disabled={submitting} style={{ background:"linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", border:"none", borderRadius:"12px", padding:"14px 32px", fontWeight:"700", fontSize:"15px", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, display:"flex", alignItems:"center", gap:"8px" }}>
                    {submitting ? "Submitting..." : "Submit Ticket"}
                    {!submitting && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
                  </button>
                  <button type="button" onClick={() => { setShowNewForm(false); setSubmitMsg(null); }} style={{ background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:"12px", padding:"14px 24px", fontWeight:"600", fontSize:"15px", cursor:"pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* TICKET THREAD */}
          {activeTicket && (
            <div style={{ background:"#fff", borderRadius:"20px", border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <div style={{ background:"linear-gradient(135deg,#f8fafc,#eff6ff)", padding:"20px 28px", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                  <button onClick={() => { setActiveTicket(null); setMessages([]); }} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:"10px", width:"36px", height:"36px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <div>
                    <div style={{ fontWeight:"700", fontSize:"16px", color:"#0f172a" }}>{activeTicket.subject}</div>
                    <div style={{ fontSize:"12px", color:"#94a3b8", marginTop:"2px" }}>{activeTicket.ticket_number} &middot; {timeAgo(activeTicket.created_at)}</div>
                  </div>
                </div>
                <StatusBadge status={activeTicket.status} />
              </div>
              <div style={{ padding:"24px 28px", minHeight:"300px", maxHeight:"480px", overflowY:"auto" }}>
                {msgLoading ? (
                  <div style={{ textAlign:"center", padding:"40px", color:"#94a3b8" }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"40px", color:"#94a3b8" }}>No messages yet.</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                    {messages.map(msg => {
                      const isUser = msg.sender_type === "user";
                      return (
                        <div key={msg.id} style={{ display:"flex", flexDirection: isUser ? "row-reverse" : "row", gap:"12px", alignItems:"flex-start" }}>
                          <div style={{ width:"36px", height:"36px", borderRadius:"10px", background: isUser ? "#dbeafe" : "#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUser ? "#2563eb" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>
                          <div style={{ maxWidth:"70%" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px", flexDirection: isUser ? "row-reverse" : "row" }}>
                              <span style={{ fontSize:"12px", fontWeight:"700", color: isUser ? "#2563eb" : "#0f172a" }}>{isUser ? "You" : (msg.sender_name || "Support")}</span>
                              <span style={{ fontSize:"11px", color:"#94a3b8" }}>{timeAgo(msg.created_at)}</span>
                            </div>
                            <div style={{ background: isUser ? "#eff6ff" : "#f8fafc", border:`1px solid ${isUser ? "#bfdbfe" : "#e2e8f0"}`, borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding:"12px 16px", fontSize:"14px", color:"#0f172a", lineHeight:1.6 }}>
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {!["resolved","closed"].includes(activeTicket.status) && (
                <div style={{ padding:"20px 28px", borderTop:"1px solid #f1f5f9", background:"#fafafa", display:"flex", gap:"12px", alignItems:"flex-end" }}>
                  <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Type your reply... (Ctrl+Enter to send)" rows={3} style={{...inp, resize:"none", flex:1}} onKeyDown={e=>{ if(e.key==="Enter" && e.ctrlKey) handleReply(); }} />
                  <button onClick={handleReply} disabled={replying || !replyText.trim()} style={{ background:"linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", border:"none", borderRadius:"12px", padding:"12px 22px", fontWeight:"700", fontSize:"14px", cursor: replying || !replyText.trim() ? "not-allowed" : "pointer", opacity: replying || !replyText.trim() ? 0.6 : 1, whiteSpace:"nowrap" }}>
                    {replying ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              )}
              {["resolved","closed"].includes(activeTicket.status) && (
                <div style={{ padding:"16px 28px", borderTop:"1px solid #f1f5f9", background:"#f8fafc", textAlign:"center", color:"#64748b", fontSize:"13px" }}>
                  This ticket is {activeTicket.status}. If you need further assistance, please open a new ticket.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}









