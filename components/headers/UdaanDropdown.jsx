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
      description: "Explore real problems. Define target users.",
      route: "/udaan/week-1"
    },
    {
      week: "Week 2",
      title: "AI MVP Development",
      subtitle: "Functional Build Sprint",
      description: "Build working AI prototype with no-code tools.",
      route: "/udaan/week-2"
    },
    {
      week: "Week 3",
      title: "Validation & Testing",
      subtitle: "Evidence Before Scale",
      description: "Test with users. Collect real feedback.",
      route: "/udaan/week-3"
    },
    {
      week: "Week 4",
      title: "Pitch & Positioning",
      subtitle: "Structured Evaluation",
      description: "Prepare pitch. Define traction signals.",
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
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        padding: "28px",
        marginTop: "4px",
        zIndex: 1000,
        border: "1px solid #e5e5e5"
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr", gap: 24 }}>
        {/* LEFT SIDE - Week Cards */}
        <div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14
          }}>
            {weekCards.map((card, index) => (
              <Link
                key={index}
                href={card.route}
                style={{
                  textDecoration: "none",
                  background: "#fafafa",
                  border: "1px solid #e5e5e5",
                  borderRadius: 10,
                  padding: "16px 14px",
                  transition: "all 0.25s ease",
                  display: "block",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.12)";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#6366f1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.background = "#fafafa";
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
              >
                {/* Week Number Badge */}
                <div style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 5,
                  marginBottom: 10,
                  letterSpacing: "0.05em"
                }}>
                  {card.week}
                </div>

                {/* Title */}
                <h4 style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 5,
                  lineHeight: 1.3
                }}>
                  {card.title}
                </h4>

                {/* Subtitle */}
                <p style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6366f1",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em"
                }}>
                  {card.subtitle}
                </p>

                {/* Description */}
                <p style={{
                  fontSize: "12px",
                  lineHeight: 1.5,
                  color: "#5a5a72",
                  marginBottom: 0
                }}>
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Program Summary */}
        <div style={{
          background: "#fafafa",
          borderRadius: 10,
          padding: "20px 18px",
          border: "1px solid #e5e5e5"
        }}>
          <h3 style={{
            fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
            fontSize: "16px",
            fontWeight: 700,
            color: "#0c0c14",
            marginBottom: 12,
            lineHeight: 1.3
          }}>
            4 Weeks of Measured Execution
          </h3>

          <p style={{
            fontSize: "12px",
            lineHeight: 1.6,
            color: "#5a5a72",
            marginBottom: 18
          }}>
            A structured AI Startup Program to convert intent into execution.
          </p>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <div style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              }} />
              <span style={{
                fontSize: "12px",
                color: "#0c0c14",
                fontWeight: 600
              }}>
                4 Defined Phases
              </span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <div style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              }} />
              <span style={{
                fontSize: "12px",
                color: "#0c0c14",
                fontWeight: 600
              }}>
                Weekly Outcomes
              </span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <div style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              }} />
              <span style={{
                fontSize: "12px",
                color: "#0c0c14",
                fontWeight: 600
              }}>
                Measured Execution
              </span>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <div style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              }} />
              <span style={{
                fontSize: "12px",
                color: "#0c0c14",
                fontWeight: 600
              }}>
                Founder Positioning
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
