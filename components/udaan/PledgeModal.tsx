"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ARTICLES = [
  {
    title: "Builders First",
    body: `This is a builder community. Members are expected to take action, execute ideas, and share progress. Spectators are welcome - builders are respected.\n\nDAGARMY rewards execution, not observation. Anyone can watch, but recognition and opportunities go to those who build, test, and ship real work. Progress is valued more than perfection. If you are here, you are expected to move - not just consume.`,
    rules: ["Take action on your ideas", "Execute, don't just plan", "Share your progress publicly"],
  },
  {
    title: "Contribution Over Competition",
    body: `We compete with the world. We collaborate within the community. If someone asks a question - we respond. If someone shares a challenge - we guide. If someone shows progress - we support.\n\nInside DAGARMY, growth is collective. Members help each other move faster, avoid mistakes, and unlock opportunities. Strong internal collaboration makes us stronger externally. Your peer's win is the community's win.`,
    rules: ["Answer questions when you can", "Share challenges openly", "Celebrate others' progress"],
  },
  {
    title: "No Toxicity, No Ego",
    body: `Zero tolerance for mocking beginners, aggressive selling, fake success claims, misleading income promises, or political and religious debates. Respect is non-negotiable.\n\nA safe and professional environment is mandatory. Trust and credibility are built through respect, honesty, and discipline. Toxicity destroys culture - and culture is our foundation. Every member is responsible for maintaining this standard.`,
    rules: ["No mocking beginners", "No fake success claims", "No aggressive selling or spam", "No political or religious debates"],
  },
  {
    title: "Teach What You Know",
    body: `If you know something valuable - host a session, share a resource, guide a member. Knowledge hoarding is weakness. Knowledge sharing builds leaders.\n\nLeadership begins with contribution. Members who share insights, tools, and experience accelerate the entire ecosystem. Teaching is a pathway to authority and influence within DAGARMY. The more you give, the more you grow.`,
    rules: ["Share resources freely", "Host sessions when you can", "Guide newer members"],
  },
  {
    title: "No MLM, No Get-Rich Schemes",
    body: `This community is NOT a multi-level marketing network, a crypto pump group, or a shortcut-to-riches program. We build real skills. We build real startups. We build sustainable income.\n\nDAGARMY stands for credibility and long-term value. We reject hype-driven models and focus on real execution, ethical growth, and practical business outcomes. Anyone promoting schemes will be removed without warning.`,
    rules: ["No MLM or pyramid structures", "No crypto pump promotions", "No get-rich-quick promises"],
  },
  {
    title: "Rank Through Contribution",
    body: `Community ranks - Soldier, Lieutenant, and beyond - reflect contribution, execution, leadership, and support. Not just payment. Leadership is earned.\n\nStatus within the community is merit-based. Advancement comes from impact, consistency, and service - not financial transactions. Authority must be demonstrated through action. Titles mean nothing without the work behind them.`,
    rules: ["Ranks are earned through action", "Leadership requires demonstrated impact", "Consistency matters more than one-time effort"],
  },
  {
    title: "Action Over Theory",
    body: `Every member should aim to launch something, sell something, validate something, or improve something. Learning without action is incomplete.\n\nKnowledge becomes valuable only when applied. Members are encouraged to test ideas, generate revenue, refine products, and build practical experience. A shipped imperfect product beats a perfect idea that never launched.`,
    rules: ["Launch before you feel ready", "Validate ideas with real users", "Sell before you perfect"],
  },
  {
    title: "Integrity Above All",
    body: `We do not copy blindly, scam clients, fake case studies, or inflate results. Reputation is our biggest asset.\n\nTrust is the currency of this community. Ethical behavior, transparency, and honest reporting protect the long-term strength of DAGARMY and its members. One dishonest act can destroy years of credibility - for you and for the community.`,
    rules: ["No fake case studies or inflated results", "No client deception", "Transparency in all dealings"],
  },
  {
    title: "The 1 Lakh Founder Mission",
    body: `Every member joins with awareness: we are part of something bigger. By 2030 - 100,000+ AI founders. If one grows, we all grow.\n\nDAGARMY is a movement, not just a network. Each member contributes to a shared mission of building a large-scale AI founder ecosystem across regions and industries. Your individual growth is inseparable from the collective mission.`,
    rules: ["Contribute to the 100K mission", "Think beyond yourself", "Help at least one other founder grow"],
  },
  {
    title: "The Founder Pledge",
    body: `Every member affirms: "I will build. I will support. I will act with integrity. I will grow with the community. I will help create 1 lakh AI founders."\n\nThis pledge reflects personal responsibility. Every member commits to discipline, contribution, and ethical growth - strengthening both individual success and the collective mission. By accepting this constitution, you are not just joining a community - you are joining a movement.`,
    rules: [],
  },
];

function ModalContent({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canAccept, setCanAccept] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) setCanAccept(true);
  }, []);

  const handleAccept = () => {
    onClose();
    sessionStorage.removeItem("dagarmy_logged_out");
    window.dispatchEvent(new CustomEvent("dagarmy:open-signin"));
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).modal) {
        (window as any).modal.open();
      }
    }, 100);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "rgba(0,0,0,0.88)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          width: "100%",
          maxWidth: 680,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(12,12,20,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid rgba(12,12,20,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5b4bec", marginBottom: 6 }}>DAGARMY Community Constitution</div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0c0c14", letterSpacing: "-0.03em", margin: 0 }}>The Rules &amp; Culture of the AI Founder Movement</h2>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(12,12,20,0.08)", background: "#f7f7f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 16 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#0c0c14" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </div>
          <p style={{ fontSize: "13px", color: "#5a5a72", marginTop: 10, lineHeight: 1.6, marginBottom: 0 }}>
            This constitution protects the integrity, culture, and long-term credibility of the community. Read it fully before accepting.
          </p>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} onScroll={handleScroll} style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {ARTICLES.map((a) => (
            <div key={a.title} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#0c0c14", letterSpacing: "-0.02em", marginBottom: 8 }}>{a.title}</div>
              {a.body.split("\n\n").map((para, pi) => (
                <p key={pi} style={{ fontSize: "13px", color: "#5a5a72", lineHeight: 1.75, marginBottom: 8, marginTop: 0 }}>{para}</p>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10 }}>
                {a.rules.map(r => (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke="#5b4bec" strokeOpacity="0.4"/><path d="M4 7l2 2 4-4" stroke="#5b4bec" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: "12px", color: "#0c0c14", fontWeight: 600 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 36, padding: 28, background: "rgba(91,75,236,0.06)", borderRadius: 16, border: "1px solid rgba(91,75,236,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#5b4bec", marginBottom: 16, letterSpacing: "0.1em", textTransform: "uppercase" }}>By accepting, you affirm</div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#0c0c14", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
              &ldquo;I will build. I will support. I will act with integrity.<br />
              I will grow with the community.<br />
              I will help create 1 lakh AI founders.&rdquo;
            </p>
            <div style={{ marginTop: 16, fontSize: "12px", color: "#9494aa" }}>
              Scroll to the bottom and click Accept to join the movement.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 32px", borderTop: "1px solid rgba(12,12,20,0.08)", flexShrink: 0, background: "#f7f7f9" }}>
          {!canAccept && (
            <p style={{ fontSize: "12px", color: "#5a5a72", textAlign: "center", margin: "0 0 12px", fontStyle: "italic" }}>
              Scroll to the bottom to accept the pledge
            </p>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: "12px 20px", borderRadius: 12, border: "1px solid rgba(12,12,20,0.12)",
                background: "transparent", color: "#5a5a72", fontSize: "14px", fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!canAccept}
              style={{
                flex: 2, padding: "12px 20px", borderRadius: 12, border: "none",
                background: canAccept ? "#5b4bec" : "#d0cdf8",
                color: "#ffffff", fontSize: "14px", fontWeight: 700,
                cursor: canAccept ? "pointer" : "not-allowed",
                transition: "background 0.3s",
              }}
            >
              {canAccept ? "I Accept - Join the Movement →" : "Read the full pledge to continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PledgeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && <ModalContent onClose={onClose} />}
    </AnimatePresence>
  );
}
