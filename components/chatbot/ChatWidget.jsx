"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const GREETING = "Hi! I'm the DAGARMY Assistant 👋\nHow can I help you today? Ask me anything about DAGARMY - membership, courses, rewards, or how to join!";

export default function ChatWidget() {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [greeted, setGreeted]   = useState(false);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      if (!greeted) {
        setMessages([{ role: "bot", text: GREETING, id: Date.now() }]);
        setGreeted(true);
      }
    }
  }, [isOpen]);

  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, "$1")   // **bold** → plain
      .replace(/\*(.+?)\*/g, "$1")        // *italic* → plain
      .replace(/^#{1,6}\s+/gm, "")        // # headings → plain
      .replace(/`(.+?)`/g, "$1")          // `code` → plain
      .trim();
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { role: "user", text, id: Date.now() };
    const history = messages
      .filter(m => m.role !== "error")
      .map(m => ({ role: m.role === "user" ? "user" : "bot", text: m.text }));

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessages(prev => [...prev, { role: "bot", text: cleanMarkdown(data.reply), id: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "error", text: "Sorry, I couldn't respond. Please try again.", id: Date.now() }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "90px", right: "24px", zIndex: 9999,
          width: "360px", maxWidth: "calc(100vw - 32px)",
          background: "#fff", borderRadius: "18px",
          boxShadow: "0 8px 40px rgba(99,102,241,0.18), 0 2px 12px rgba(0,0,0,0.10)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "chatSlideUp 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", overflow: "hidden",
              background: "rgba(255,255,255,0.15)", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Image src="/images/logo/logo.png" alt="DAGARMY" width={28} height={28} style={{ objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#fff", lineHeight: 1.2 }}>DAGARMY Assistant</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer",
                width: "30px", height: "30px", borderRadius: "8px", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 12px",
            display: "flex", flexDirection: "column", gap: "10px",
            minHeight: "300px", maxHeight: "380px",
            background: "#f8faff",
          }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end", gap: "7px",
              }}>
                {msg.role !== "user" && (
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Image src="/images/logo/logo.png" alt="" width={18} height={18} style={{ objectFit: "contain" }} />
                  </div>
                )}
                <div style={{
                  maxWidth: "80%",
                  background: msg.role === "user" ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                    : msg.role === "error" ? "#fff0f0"
                    : "#fff",
                  color: msg.role === "user" ? "#fff"
                    : msg.role === "error" ? "#ef4444"
                    : "#1e293b",
                  padding: "9px 12px",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  fontSize: "13px", lineHeight: "1.55",
                  boxShadow: msg.role !== "user" ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "7px" }}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Image src="/images/logo/logo.png" alt="" width={18} height={18} style={{ objectFit: "contain" }} />
                </div>
                <div style={{
                  background: "#fff", padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: "4px",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%", background: "#a5b4fc",
                      animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px", background: "#fff",
            borderTop: "1px solid #f1f5f9", display: "flex", gap: "8px", alignItems: "center",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
              disabled={loading}
              style={{
                flex: 1, border: "1.5px solid #e2e8f0", borderRadius: "10px",
                padding: "9px 12px", fontSize: "13px", color: "#0f172a",
                outline: "none", background: "#f8faff", transition: "border-color 0.15s",
                fontFamily: "inherit",
              }}
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: "38px", height: "38px", borderRadius: "10px", border: "none",
                background: !input.trim() || loading ? "#e2e8f0" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", cursor: !input.trim() || loading ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        title="Chat with DAGARMY Assistant"
        style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          width: "56px", height: "56px", borderRadius: "16px", border: "none",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          cursor: "pointer", padding: "6px",
          boxShadow: "0 4px 20px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.15s, box-shadow 0.15s",
          animation: isOpen ? "none" : "chatPulse 2.5s ease-in-out infinite",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(99,102,241,0.55)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.12)"; }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <Image src="/images/logo/logo.png" alt="DAGARMY Chat" width={38} height={38} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        )}
      </button>

      {/* Keyframe animations */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.12); }
          50%       { box-shadow: 0 4px 28px rgba(99,102,241,0.7), 0 2px 12px rgba(0,0,0,0.15); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
