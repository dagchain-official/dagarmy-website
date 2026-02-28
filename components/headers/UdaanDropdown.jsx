"use client";
import React from "react";
import Link from "next/link";

export default function UdaanDropdown({ isVisible }) {
  if (!isVisible) return null;

  const weekCards = [
    {
      week: "Week 1",
      title: "Problem Discovery",
      subtitle: "Structured Idea Validation",
      description: "Define the right problem before building anything.",
      route: "/udaan/week-1"
    },
    {
      week: "Week 2",
      title: "AI MVP Development",
      subtitle: "Functional Build",
      description: "Convert concept into working AI prototype.",
      route: "/udaan/week-2"
    },
    {
      week: "Week 3",
      title: "Validation & Testing",
      subtitle: "Evidence Before Scale",
      description: "Test with real users. Refine before expansion.",
      route: "/udaan/week-3"
    },
    {
      week: "Week 4",
      title: "Pitch & Positioning",
      subtitle: "Structured Evaluation",
      description: "Prepare narrative. Enter Founder Track.",
      route: "/udaan/week-4"
    }
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "750px",
        background: "#ffffff",
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        padding: "24px",
        marginTop: "4px",
        zIndex: 1000,
        border: "1px solid #e5e7eb"
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.75fr", gap: 20 }}>
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
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  padding: "14px 12px",
                  minHeight: "130px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#d1d5db";
                  const title = e.currentTarget.querySelector('h4');
                  if (title) {
                    title.style.textDecoration = "underline";
                    title.style.textDecorationColor = "#6366f1";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  const title = e.currentTarget.querySelector('h4');
                  if (title) {
                    title.style.textDecoration = "none";
                  }
                }}
              >
                {/* Week Label */}
                <p style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6366f1",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {card.week}
                </p>

                {/* Title */}
                <h4 style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 6,
                  lineHeight: 1.3,
                  transition: "text-decoration 0.2s ease"
                }}>
                  {card.title}
                </h4>

                {/* Subtitle */}
                <p style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#9ca3af",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {card.subtitle}
                </p>

                {/* Description */}
                <p style={{
                  fontSize: "12px",
                  lineHeight: 1.5,
                  color: "#6b7280",
                  marginBottom: 0,
                  marginTop: "auto",
                  flexGrow: 1
                }}>
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Program Architecture */}
        <div style={{
          background: "#0c0c14",
          borderRadius: 6,
          padding: "20px 18px",
          display: "flex",
          flexDirection: "column",
          color: "#ffffff"
        }}>
          {/* Title */}
          <h3 style={{
            fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
            fontSize: "15px",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 3,
            lineHeight: 1.3,
            position: "relative",
            paddingBottom: 10
          }}>
            Program Architecture
            <span style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 175,
              height: 2,
              background: "#6366f1"
            }} />
          </h3>

          {/* Supporting Line */}
          <p style={{
            fontSize: "11px",
            lineHeight: 1.4,
            color: "#d1d5db",
            marginBottom: 16
          }}>
            Structured 4-week execution cycle built for measurable output.
          </p>

          {/* 2x2 Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 14
          }}>
            {/* Block 1 */}
            <div>
              <div style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 2,
                lineHeight: 1
              }}>4</div>
              <div style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 3
              }}>Phases</div>
              <div style={{
                fontSize: "9px",
                color: "#9ca3af",
                lineHeight: 1.3
              }}>Weekly progression</div>
            </div>

            {/* Block 2 */}
            <div>
              <div style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 2,
                lineHeight: 1
              }}>4</div>
              <div style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 3
              }}>Deliverables</div>
              <div style={{
                fontSize: "9px",
                color: "#9ca3af",
                lineHeight: 1.3
              }}>Measurable output</div>
            </div>

            {/* Block 3 */}
            <div>
              <div style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 2,
                lineHeight: 1
              }}>Live</div>
              <div style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 3
              }}>Validation</div>
              <div style={{
                fontSize: "9px",
                color: "#9ca3af",
                lineHeight: 1.3
              }}>Real user feedback</div>
            </div>

            {/* Block 4 */}
            <div>
              <div style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 2,
                lineHeight: 1
              }}>Path</div>
              <div style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 3
              }}>Founder Track</div>
              <div style={{
                fontSize: "9px",
                color: "#9ca3af",
                lineHeight: 1.3
              }}>Pitch & evaluation</div>
            </div>
          </div>

          {/* Bottom Line */}
          <div style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px solid #374151"
          }}>
            <p style={{
              fontSize: "10px",
              color: "#d1d5db",
              lineHeight: 1.4,
              marginBottom: 0
            }}>
              Visible progress. No passive participation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
