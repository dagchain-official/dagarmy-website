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
    description: "Most ideas collapse because they were never tested against reality. Week 1 focuses on structured discovery.",
    deliverables: [
      "Defined problem statement",
      "Target user clarity",
      "AI Business Model Development structure",
      "1-page concept summary"
    ],
    route: "/udaan/week-1"
  },
  {
    week: "Week 2",
    title: "AI MVP Development",
    description: "Now the build begins. Using practical No Code AI Tools, workflow systems, and automation platforms.",
    deliverables: [
      "Working interface",
      "Defined automation logic",
      "Testable AI MVP Build Framework",
      "Demonstrable product"
    ],
    route: "/udaan/week-2"
  },
  {
    week: "Week 3",
    title: "Validation and Market Testing",
    description: "Now comes external reality. You test your MVP with 5 to 10 early users. You collect direct feedback.",
    deliverables: [
      "User testing report",
      "Iteration plan",
      "Traction metrics"
    ],
    route: "/udaan/week-3"
  },
  {
    week: "Week 4",
    title: "Pitch Preparation",
    description: "Execution must be communicated clearly. Week 4 prepares you for structured evaluation.",
    deliverables: [
      "5-minute pitch",
      "Measurable traction indicators",
      "Clearer path toward Founder Track"
    ],
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
        background: "#fafafa",
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <div className="wrap" style={{ maxWidth: 1200 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 64, textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(36px, 3.5vw, 48px)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#0c0c14",
              marginBottom: 16,
            }}
          >
            The Transformation Path
          </h2>
          <p
            style={{
              fontSize: "17px",
              fontWeight: 500,
              color: "#5a5a72",
              marginBottom: 0,
              maxWidth: 700,
              margin: "0 auto"
            }}
          >
            4 Weeks of Measured Execution
          </p>
        </motion.div>

        {/* Weekly Schedule Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 32,
            marginBottom: 0,
          }}
        >
          {weekData.map((week, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease }}
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
                    border: "2px solid #e0e0e8",
                    borderRadius: 16,
                    padding: "36px 28px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.15)";
                    e.currentTarget.style.borderColor = "#6366f1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e0e0e8";
                  }}
                >
                  {/* Logo and Brand */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                    paddingBottom: 20,
                    borderBottom: "1px solid #f0f0f4"
                  }}>
                    <Image
                      src="/images/logo/logo.png"
                      alt="DAGARMY Logo"
                      width={32}
                      height={32}
                      style={{ objectFit: "contain" }}
                    />
                    <span style={{
                      fontFamily: "'Nasalization', sans-serif",
                      fontSize: "18px",
                      fontWeight: 400,
                      color: "#0c0c14",
                      letterSpacing: "0.05em"
                    }}>
                      DAGARMY
                    </span>
                  </div>

                  {/* Week Badge */}
                  <div style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "6px 14px",
                    borderRadius: 6,
                    marginBottom: 16,
                    alignSelf: "flex-start"
                  }}>
                    {week.week}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#0c0c14",
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3
                  }}>
                    {week.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#5a5a72",
                    marginBottom: 20,
                    flexGrow: 1
                  }}>
                    {week.description}
                  </p>

                  {/* Deliverables */}
                  <div style={{
                    background: "#fafafa",
                    borderRadius: 10,
                    padding: "16px 18px",
                    marginTop: "auto"
                  }}>
                    <p style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#6366f1",
                      marginBottom: 12
                    }}>
                      You Leave With:
                    </p>
                    <ul style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8
                    }}>
                      {week.deliverables.map((item, i) => (
                        <li key={i} style={{
                          fontSize: "13px",
                          color: "#0c0c14",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8
                        }}>
                          <span style={{
                            color: "#6366f1",
                            fontSize: "16px",
                            lineHeight: 1,
                            marginTop: 2
                          }}>•</span>
                          <span style={{ lineHeight: 1.5 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* View Details Arrow */}
                  <div style={{
                    marginTop: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#6366f1",
                    fontSize: "13px",
                    fontWeight: 600
                  }}>
                    <span>View Details</span>
                    <span style={{ fontSize: "16px" }}>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          style={{
            marginTop: 64,
            textAlign: "center",
            padding: "32px 40px",
            background: "#ffffff",
            borderRadius: 12,
            border: "2px solid #e0e0e8",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: 1.6,
              color: "#0c0c14",
              letterSpacing: "-0.01em",
              marginBottom: 0,
            }}
          >
            After 4 weeks, you are not exploring tools.<br />
            You are operating as an <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700
            }}>Early Stage AI Founder</span> inside an execution-driven ecosystem.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
