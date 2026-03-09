"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function UdaanDropdown({ isVisible }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Trigger animation after render
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for exit animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const weekCards = [
    {
      num: "01",
      week: "Week 1",
      title: "Problem Discovery",
      subtitle: "Structured Idea Validation",
      description: "Define the right problem before building. Understand users. Validate direction.",
      route: "/udaan/week-1"
    },
    {
      num: "02",
      week: "Week 2",
      title: "AI MVP Development",
      subtitle: "Functional Build",
      description: "Convert your concept into a working AI prototype using structured development tools.",
      route: "/udaan/week-2"
    },
    {
      num: "03",
      week: "Week 3",
      title: "Validation & Testing",
      subtitle: "Evidence Before Scale",
      description: "Test with real users. Refine before expansion.",
      route: "/udaan/week-3"
    },
    {
      num: "04",
      week: "Week 4",
      title: "Pitch & Positioning",
      subtitle: "Structured Evaluation",
      description: "Prepare your narrative. Define traction. Enter the Founder Track.",
      route: "/udaan/week-4"
    }
  ];

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: `translateX(-50%) translateY(${
          isAnimating ? "0" : "8px"
        })`,
        width: "750px",
        background: "#ffffff",
        borderRadius: 8,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        padding: "24px",
        marginTop: "4px",
        zIndex: 1000,
        border: "1px solid rgba(0,0,0,0.06)",
        opacity: isAnimating ? 1 : 0,
        transition: "opacity 0.25s cubic-bezier(0.16,1,0.3,1), transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: isAnimating ? "auto" : "none",
      }}
      onMouseEnter={(e) => {
        // Notify parent to clear close timeout
        if (e.currentTarget.parentElement && e.currentTarget.parentElement.onMouseEnter) {
          e.currentTarget.parentElement.onMouseEnter();
        }
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.65fr", gap: 20 }}>
        {/* LEFT SIDE - Week Cards */}
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12
          }}>
            {weekCards.map((card, index) => (
              <Link
                key={index}
                href={card.route}
                style={{
                  textDecoration: "none",
                  display: "block"
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #ebebf0",
                    borderRadius: 10,
                    padding: "12px 12px",
                    minHeight: "115px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(99,102,241,0.1)";
                    e.currentTarget.style.borderColor = "#c7c7f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#ebebf0";
                  }}
                >
                  {/* Ghost number */}
                  <div style={{
                    position: "absolute",
                    top: -2,
                    right: 8,
                    fontFamily: "'Nasalization', sans-serif",
                    fontSize: 42,
                    fontWeight: 700,
                    color: "rgba(99,102,241,0.05)",
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}>
                    {card.num}
                  </div>

                  {/* Week chip */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 8,
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366f1" }} />
                    <span style={{
                      fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#6366f1",
                    }}>
                      {card.week}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#0c0c14",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                    marginBottom: 3,
                  }}>
                    {card.title}
                  </h4>

                  {/* Subtitle */}
                  <div style={{
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#b0b0c3",
                    marginBottom: 7,
                  }}>
                    {card.subtitle}
                  </div>

                  <div style={{ width: 110, height: 1, background: "#e5e5f0", marginBottom: 7 }} />

                  {/* Description */}
                  <p style={{
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 10,
                    lineHeight: 1.5,
                    color: "#6b7280",
                    flexGrow: 1,
                    marginBottom: 8,
                  }}>
                    {card.description}
                  </p>

                  {/* Arrow link */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6366f1",
                    letterSpacing: "0.02em",
                  }}>
                    View {card.week}
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Program Architecture */}
        <div style={{
          background: "#0c0c14",
          borderRadius: 12,
          padding: "22px 20px",
          display: "flex",
          flexDirection: "column",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Background glow effect */}
          <div style={{
            position: "absolute",
            top: -40,
            left: "30%",
            width: 200,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Title */}
            <h3 style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontSize: "21px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 10,
              lineHeight: 1.3,
              letterSpacing: "-0.01em"
            }}>
              Program Architecture
            </h3>

            {/* Supporting Line */}
            <p style={{
              fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
              fontSize: "10px",
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 18
            }}>
              Structured 4-week execution cycle built for measurable output.
            </p>

            {/* 2x2 Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16
            }}>
              {/* Block 1 */}
              <div>
                <div style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: 4,
                }}>4</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 2,
                }}>Defined Phases</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.3
                }}>Weekly progression</div>
              </div>

              {/* Block 2 */}
              <div>
                <div style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: 4,
                }}>4</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 2,
                }}>Deliverables</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.3
                }}>Measurable output</div>
              </div>

              {/* Block 3 */}
              <div>
                <div style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: 4,
                }}>Live</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 2,
                }}>Validation</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.3
                }}>Real user feedback</div>
              </div>

              {/* Block 4 */}
              <div>
                <div style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: 4,
                }}>Path</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 2,
                }}>Founder Track</div>
                <div style={{
                  fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.3
                }}>Pitch & evaluation</div>
              </div>
            </div>

            {/* Bottom Line */}
            <div style={{
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.08)"
            }}>
              <p style={{
                fontFamily: "var(--font-dm, 'DM Sans', sans-serif)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.4,
                marginBottom: 0
              }}>
                Each week ends with visible progress.<br />
                <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>No passive participation.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
