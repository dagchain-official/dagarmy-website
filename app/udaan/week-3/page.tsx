"use client";
import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Image from "next/image";

export default function Week3Page() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const ease = [0.22, 1, 0.36, 1] as any;

  // Scroll to top when page loads
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <>
      <Header2 />
      <main ref={ref} style={{ 
        background: "#f9f9fb",
        backgroundImage: "linear-gradient(rgba(12,12,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(12,12,20,0.04) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        minHeight: "100vh" 
      }}>
        {/* Header Section */}
        <section style={{ background: "#ffffff", paddingTop: 48, paddingBottom: 32, borderBottom: "1px solid rgba(12,12,20,0.08)" }}>
          <div className="wrap" style={{ maxWidth: 900, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              {/* Title with Back Link on Same Line */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <Link href="/udaan" style={{ fontSize: "14px", color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>
                  ← Back to Udaan
                </Link>
                <h1 style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "clamp(36px, 5vw, 52px)",
                  fontWeight: 700,
                  color: "#0c0c14",
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  flex: 1
                }}>
                  Validation & Market Testing
                </h1>
                <div style={{ width: "120px" }} />
              </div>

              {/* Centered Subtitle and Description */}
              <div style={{ textAlign: "center" }}>
                {/* Subtitle */}
                <p style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#6366f1",
                  marginBottom: 20
                }}>
                  Evidence Before Scale
                </p>

                {/* Description - Bold */}
                <p style={{
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: "#0c0c14",
                  fontWeight: 600,
                  marginBottom: 0
                }}>
                  Now comes external reality. You test your MVP with 5 to 10 early users. You collect direct feedback. You refine positioning. You adjust before scale. This is your active AI Startup Validation Model.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section style={{ paddingTop: 32, paddingBottom: 80 }}>
          <div className="wrap" style={{ maxWidth: 900, margin: "0 auto" }}>
            
            {/* Single Card Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
            >
              <div style={{
                background: "#ffffff",
                border: "1px solid rgba(12,12,20,0.08)",
                borderRadius: 20,
                padding: "40px 48px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
              }}>
                {/* DAGARMY Branding - Inside Card - Centered */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 10,
                  paddingBottom: 15,
                  borderBottom: "1px solid #f0f0f4"
                }}>
                 <Image
                    src="/images/logo/logo.png"
                    alt="DAGARMY Logo"
                    width={40}
                    height={30}
                    style={{ objectFit: "contain" }}
                  />
                  <span style={{
                    fontFamily: "'Nasalization', sans-serif",
                    fontSize: "22px",
                    fontWeight: 1000,
                    color: "#0c0c14",
                    letterSpacing: "0.05em"
                  }}>
                    DAGARMY
                  </span>
                </div>

              {/* Objective */}
              <div style={{ marginBottom: 40 }}>
                <h2 style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 16,
                  letterSpacing: "0.02em"
                }}>
                  Objective
                </h2>
                <p style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#5a5a72",
                  marginBottom: 0
                }}>
                  It moves you from assumption to evidence. You learn what resonates. You learn what needs revision. You improve before expanding. This is measurable validation from real users.
                </p>
              </div>

              {/* Deliverables */}
              <div style={{ marginBottom: 40 }}>
                <h2 style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 20,
                  letterSpacing: "0.02em"
                }}>
                  Deliverables
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px 24px" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: "rgba(99,102,241,0.06)",
                      border: "1.5px solid rgba(99,102,241,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6366f1",
                      fontFamily: "'Nasalization', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0
                    }}>1</div>
                    <div>
                      <h4 style={{ 
                        fontFamily: "'Nasalization', sans-serif",
                        fontSize: "14px", 
                        fontWeight: 700, 
                        color: "#0c0c14", 
                        marginBottom: 6,
                        letterSpacing: "0.02em"
                      }}>
                        User Testing Report
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                        Documented feedback from 10-15 early users.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: "rgba(99,102,241,0.06)",
                      border: "1.5px solid rgba(99,102,241,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6366f1",
                      fontFamily: "'Nasalization', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0
                    }}>2</div>
                    <div>
                      <h4 style={{ 
                        fontFamily: "'Nasalization', sans-serif",
                        fontSize: "14px", 
                        fontWeight: 700, 
                        color: "#0c0c14", 
                        marginBottom: 6,
                        letterSpacing: "0.02em"
                      }}>
                        Iteration Plan
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                        Clear list of changes based on user feedback.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: "rgba(99,102,241,0.06)",
                      border: "1.5px solid rgba(99,102,241,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6366f1",
                      fontFamily: "'Nasalization', sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0
                    }}>3</div>
                    <div>
                      <h4 style={{ 
                        fontFamily: "'Nasalization', sans-serif",
                        fontSize: "14px", 
                        fontWeight: 700, 
                        color: "#0c0c14", 
                        marginBottom: 6,
                        letterSpacing: "0.02em"
                      }}>
                        Traction Metrics
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                        Early signals: engagement, retention, willingness to pay.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools Used */}
              <div style={{ marginBottom: 40 }}>
                <h2 style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 20,
                  letterSpacing: "0.02em"
                }}>
                  Tools Used
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <div style={{
                    background: "#ffffff",
                    border: "1px solid rgba(12,12,20,0.08)",
                    borderRadius: 14,
                    padding: "20px 20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.08)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "rgba(12,12,20,0.08)";
                  }}>
                    <p style={{ 
                      fontFamily: "'Nasalization', sans-serif",
                      fontSize: "14px", 
                      fontWeight: 700, 
                      color: "#0c0c14", 
                      marginBottom: 6,
                      letterSpacing: "0.02em"
                    }}>
                      User Testing Framework
                    </p>
                    <p style={{ fontSize: "13px", color: "#5a5a72", marginBottom: 0, lineHeight: 1.5 }}>
                      Structured feedback collection methods
                    </p>
                  </div>
                  <div style={{
                    background: "#ffffff",
                    border: "1px solid rgba(12,12,20,0.08)",
                    borderRadius: 14,
                    padding: "20px 20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.08)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "rgba(12,12,20,0.08)";
                  }}>
                    <p style={{ 
                      fontFamily: "'Nasalization', sans-serif",
                      fontSize: "14px", 
                      fontWeight: 700, 
                      color: "#0c0c14", 
                      marginBottom: 6,
                      letterSpacing: "0.02em"
                    }}>
                      Analytics Setup
                    </p>
                    <p style={{ fontSize: "13px", color: "#5a5a72", marginBottom: 0, lineHeight: 1.5 }}>
                      Track user behavior and engagement
                    </p>
                  </div>
                </div>
              </div>

              {/* Outcome */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 100%)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 16,
                padding: "32px 28px",
                marginBottom: 0
              }}>
                <h2 style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 16,
                  letterSpacing: "0.02em"
                }}>
                  Outcome
                </h2>
                <p style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#0c0c14",
                  fontWeight: 500,
                  marginBottom: 0
                }}>
                  You move into Week 4 with validated insights, real user data, and a refined product ready for structured pitching. Evidence-backed positioning—not assumptions.
                </p>
              </div>

              {/* Transition Statement - Inside Card */}
              <div style={{
                textAlign: "center",
                paddingTop: 32,
                marginTop: 32,
                borderTop: "2px solid #f0f0f4"
              }}>
                <p style={{
                  fontSize: "17px",
                  lineHeight: 1.6,
                  color: "#0c0c14",
                  fontWeight: 600,
                  marginBottom: 24
                }}>
                  Once you complete Week 3, you are ready to pitch.
                </p>
                <Link href="/udaan/week-4" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "14px 32px",
                  borderRadius: 999,
                  textDecoration: "none",
                  transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.35)";
                }}>
                  Continue to Week 4 
                  <span style={{ fontSize: "16px" }}>→</span>
                </Link>
              </div>
              </div>
            </motion.div>

          </div>
        </section>
      </main>
      <Footer1 />
    </>
  );
}
