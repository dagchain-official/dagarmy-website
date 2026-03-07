"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  const [isFrameworkExpanded, setIsFrameworkExpanded] = useState(false);
  const frameworkRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 40,
        paddingBottom: 40,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="wrap" style={{ maxWidth: 1200 }}>
        
        {/* Two Column Layout - Title + Content on Left, Statistics on Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 80,
            marginBottom: 48,
          }}
        >
          {/* Left Column - Title + Content */}
          <div>
            {/* Section Title - Editorial Style, Left Aligned */}
            <h2
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 600,
                fontSize: "clamp(36px, 4vw, 52px)",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                color: "#0c0c14",
                marginBottom: 20,
              }}
            >
              From Idea to Execution
            </h2>

            {/* Lead Line */}
            <p style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#000000",
              marginBottom: 20,
              lineHeight: 1.4,
            }}>
              What Udaan Truly Represents:
            </p>

            {/* Main Content */}
            <p style={{
              fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
              color: "#374151",
              marginBottom: 16,
            }}>
              Udaan is the launch layer of the DAG Army AI Startup Ecosystem. It is a structured AI Startup Program designed as a focused Founder Development Platform.
            </p>
            <p style={{
              fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
              color: "#374151",
              marginBottom: 16,
            }}>
              This is not passive learning.
            </p>
            <p style={{
              fontSize: "20px",
              lineHeight: 1.6,
              color: "#000000ff",
              fontWeight: 800,
              marginBottom: 16,
            }}>
              It is a <strong style={{ fontWeight: 800 }}>4-week Startup Runway built for execution.</strong>
            </p>
            <p style={{
              fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
              color: "#374151",
              marginBottom: 12,
            }}>
              Inside this execution-driven ecosystem, the outcome is clear:
            </p>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 18px 0",
            }}>
              <li style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#374151",
                paddingLeft: 24,
                position: "relative",
                marginBottom: 8,
              }}>
                <span style={{
                  position: "absolute",
                  left: 0,
                  color: "#6366f1",
                  fontWeight: 700,
                  fontSize: "18px",
                }}>•</span>
                A working MVP
              </li>
              <li style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#374151",
                paddingLeft: 24,
                position: "relative",
                marginBottom: 8,
              }}>
                <span style={{
                  position: "absolute",
                  left: 0,
                  color: "#6366f1",
                  fontWeight: 700,
                  fontSize: "18px",
                }}>•</span>
                Early market validation
              </li>
              <li style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#374151",
                paddingLeft: 24,
                position: "relative",
              }}>
                <span style={{
                  position: "absolute",
                  left: 0,
                  color: "#6366f1",
                  fontWeight: 700,
                  fontSize: "18px",
                }}>•</span>
                A defined monetization pathway
              </li>
            </ul>
            <p style={{
               fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
              color: "#374151",
              marginBottom: 0,
            }}>
              Not a certificate. Not theory. <strong style={{ fontWeight: 800, color: "#0c0c14" }}>Real startup movement.</strong>
            </p>
          </div>

          {/* Right Column - Why Structure Matters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            whileHover={{ y: -4 }}
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: "2px solid #e5e7eb",
              padding: "32px 28px",
              borderRadius: 12,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
              transition: "box-shadow 0.3s ease",
              alignSelf: "start",
            }}
            onMouseEnter={(e: any) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e: any) => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.06)";
            }}
          >
            <h3 style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "22px",
              fontWeight: 700,
              color: "#0c0c14",
              marginBottom: 24,
              lineHeight: 1.3,
            }}>
              Why Structure Matters
            </h3>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#000000",
                lineHeight: 1,
                marginBottom: 8,
                letterSpacing: "-0.02em",
              }}>90%</div>
              <p style={{
                 fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#4b5563",
                marginBottom: 0,
              }}>
                Globally, <strong style={{ color: "#0c0c14" }}>90% of startups fail</strong>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#000000",
                lineHeight: 1,
                marginBottom: 8,
                letterSpacing: "-0.02em",
              }}>42%</div>
              <p style={{
                fontSize: "14px",
                lineHeight: 1.5,
                color: "#4b5563",
                marginBottom: 0,
              }}>
                <strong style={{ color: "#0c0c14" }}>42% fail due to lack of market need</strong>
              </p>
            </motion.div>
            <div style={{
              paddingTop: 20,
              borderTop: "2px solid #e5e7eb",
            }}>
              <p style={{
                 fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 12,
              }}>
                Udaan addresses this through validation before expansion.
              </p>
              <p style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 0,
              }}>
                Build only what solves a real problem.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Framework Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
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
              marginBottom: 12,
            }}
          >
            The 4-Week Build Cycle
          </h2>
          
          <p
            style={{
               fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
              color: "#6b7280",
              marginBottom: 24,
              maxWidth: 700,
              margin: "0 auto 24px auto"
            }}
          >
            A disciplined AI startup build cycle designed to convert intent into execution.
          </p>

          {/* Expandable Trigger Button */}
          <motion.button
            onClick={() => {
              const newState = !isFrameworkExpanded;
              setIsFrameworkExpanded(newState);
              if (newState) {
                setTimeout(() => {
                  const frameworkElement = frameworkRef.current;
                  if (frameworkElement) {
                    const yOffset = -100;
                    const y = frameworkElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 500);
              }
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "14px 32px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              background: isFrameworkExpanded ? "#0c0c14" : "#ffffff",
              color: isFrameworkExpanded ? "#ffffff" : "#0c0c14",
              border: "2px solid #0c0c14",
              borderRadius: "8px",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: isFrameworkExpanded ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={(e) => {
              if (!isFrameworkExpanded) {
                e.currentTarget.style.background = "#0c0c14";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isFrameworkExpanded) {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#0c0c14";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
              }
            }}
          >
            {isFrameworkExpanded ? "Hide" : "View"} the 4-Week Execution Framework
            <motion.span
              animate={{ rotate: isFrameworkExpanded ? 180 : 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{
                fontSize: "18px",
                display: "inline-block",
              }}
            >↓</motion.span>
          </motion.button>
        </motion.div>

        {/* Expandable Framework Section */}
        <AnimatePresence mode="wait">
          {isFrameworkExpanded && (
            <motion.div
              ref={frameworkRef}
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.3 },
              }}
              style={{ overflow: "hidden", willChange: "height, opacity" }}
            >
              <div style={{ paddingTop: 32 }}>
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
                width: 230,
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
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
