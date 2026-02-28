"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

const weekData = [
  {
    week: "Week 1",
    title: "Problem Discovery",
    subtitle: "Structured Idea Validation",
    description: "Define the right problem before building anything. Clarify users. Validate direction.",
    route: "/udaan/week-1"
  },
  {
    week: "Week 2",
    title: "AI MVP Development",
    subtitle: "Functional Build",
    description: "Convert your concept into a working AI prototype using structured tools.",
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
    description: "Prepare your narrative. Define traction. Enter the Founder Track.",
    route: "/udaan/week-4"
  }
];

export default function WeeklyScheduleSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      <div className="wrap" style={{ maxWidth: 1200 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 32, textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(32px, 3.5vw, 42px)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#0c0c14",
              marginBottom: 4,
            }}
          >
            The Transformation Path
          </h2>
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 600,
              fontSize: "clamp(24px, 2.5vw, 32px)",
              lineHeight: 1.3,
              color: "#0c0c14",
              marginBottom: 12,
              position: "relative",
              display: "inline-block"
            }}
          >
            <span style={{ position: "relative" }}>
              4 Weeks
              <span style={{
                position: "absolute",
                bottom: -4,
                left: 0,
                right: 0,
                height: 3,
                background: "#6366f1"
              }} />
            </span>
            {" "}of Measured Execution
          </h3>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 400,
              color: "#6b7280",
              marginBottom: 0,
              maxWidth: 700,
              margin: "0 auto"
            }}
          >
            A disciplined AI Startup build cycle designed to convert intent into execution.
          </p>
        </motion.div>

        {/* Main Layout: 2 Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "70% 30%",
            gap: 24,
            marginBottom: 0,
          }}
        >
          {/* LEFT SIDE - Week Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 24,
            }}
          >
            {weekData.map((week, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease }}
              >
                <Link
                  href={week.route}
                  style={{
                    textDecoration: "none",
                    display: "block",
                    height: "100%"
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "24px 20px",
                      minHeight: 240,
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.25s ease",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderColor = "#d1d5db";
                      const title = e.currentTarget.querySelector('h3');
                      if (title) {
                        (title as HTMLElement).style.textDecoration = "underline";
                        (title as HTMLElement).style.textDecorationColor = "#6366f1";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      const title = e.currentTarget.querySelector('h3');
                      if (title) {
                        (title as HTMLElement).style.textDecoration = "none";
                      }
                    }}
                  >
                    {/* Week Label */}
                    <p style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#6366f1",
                      marginBottom: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      {week.week}
                    </p>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#0c0c14",
                      marginBottom: 8,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      transition: "text-decoration 0.25s ease"
                    }}>
                      {week.title}
                    </h3>

                    {/* Micro Label */}
                    <p style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      marginBottom: 12
                    }}>
                      {week.subtitle}
                    </p>

                    {/* Description */}
                    <p style={{
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "#6b7280",
                      marginBottom: "auto",
                      flexGrow: 1
                    }}>
                      {week.description}
                    </p>

                    {/* CTA Link */}
                    <div style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px solid #f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#6366f1",
                      fontSize: "13px",
                      fontWeight: 600
                    }}>
                      <span>View {week.week}</span>
                      <span style={{ fontSize: "14px" }}>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {/* RIGHT SIDE - Program Architecture Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            style={{
              background: "#0c0c14",
              borderRadius: 8,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              color: "#ffffff"
            }}
          >
            {/* Title */}
            <h3 style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 4,
              lineHeight: 1.3,
              position: "relative",
              paddingBottom: 12
            }}>
              Program Architecture
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 60,
                height: 2,
                background: "#6366f1"
              }} />
            </h3>

            {/* Supporting Line */}
            <p style={{
              fontSize: "13px",
              lineHeight: 1.5,
              color: "#d1d5db",
              marginBottom: 20
            }}>
              A structured 4-week execution cycle built for measurable output.
            </p>

            {/* 2x2 Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20
            }}>
              {/* Block 1 */}
              <div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 4,
                  lineHeight: 1
                }}>4</div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: 4
                }}>Defined Phases</div>
                <div style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  lineHeight: 1.4
                }}>Structured weekly progression</div>
              </div>

              {/* Block 2 */}
              <div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 4,
                  lineHeight: 1
                }}>4</div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: 4
                }}>Tangible Deliverables</div>
                <div style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  lineHeight: 1.4
                }}>One measurable output per week</div>
              </div>

              {/* Block 3 */}
              <div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 4,
                  lineHeight: 1
                }}>Live</div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: 4
                }}>Market Validation</div>
                <div style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  lineHeight: 1.4
                }}>Real user feedback before scale</div>
              </div>

              {/* Block 4 */}
              <div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 4,
                  lineHeight: 1
                }}>Founder</div>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: 4
                }}>Positioning Path</div>
                <div style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  lineHeight: 1.4
                }}>Pitch, traction, evaluation</div>
              </div>
            </div>

            {/* Bottom Closing Line */}
            <div style={{
              marginTop: "auto",
              paddingTop: 20,
              borderTop: "1px solid #374151"
            }}>
              <p style={{
                fontSize: "12px",
                color: "#d1d5db",
                lineHeight: 1.5,
                marginBottom: 0
              }}>
                Each week ends with visible progress. No passive participation.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
