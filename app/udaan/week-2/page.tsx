"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Image from "next/image";

export default function Week2Page() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const ease = [0.22, 1, 0.36, 1] as any;

  return (
    <>
      <Header2 />
      <main ref={ref} style={{ background: "#fafafa", minHeight: "100vh" }}>
        {/* Header Section */}
        <section style={{ background: "#ffffff", paddingTop: 32, paddingBottom: 24, borderBottom: "1px solid #e5e5e5" }}>
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
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "clamp(36px, 5vw, 48px)",
                  fontWeight: 700,
                  color: "#0c0c14",
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                  flex: 1
                }}>
                  AI MVP Development
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
                  Functional Build Sprint
                </p>

                {/* Description - Bold */}
                <p style={{
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: "#0c0c14",
                  fontWeight: 600,
                  marginBottom: 0
                }}>
                  Now the build begins. Using practical No Code AI Tools, workflow systems, and automation platforms, you convert your concept into a functional AI Startup Prototype. The focus is not perfection. The focus is functionality.
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
              style={{
                background: "#ffffff",
                border: "2px solid #e0e0e8",
                borderRadius: 16,
                padding: "32px 40px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
              }}
            >
              {/* DAGARMY Branding - Inside Card - Centered */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 28,
                paddingBottom: 24,
                borderBottom: "1px solid #f0f0f4"
              }}>
                <Image
                  src="/images/logo/logo.png"
                  alt="DAGARMY Logo"
                  width={28}
                  height={28}
                  style={{ objectFit: "contain" }}
                />
                <span style={{
                  fontFamily: "'Nasalization', sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#0c0c14",
                  letterSpacing: "0.05em"
                }}>
                  DAGARMY
                </span>
              </div>

              {/* Objective */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 16,
                  letterSpacing: "-0.01em"
                }}>
                  Objective
                </h2>
                <p style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#5a5a72",
                  marginBottom: 0
                }}>
                  No-code stacks today reduce development timelines from traditional multi-month cycles to structured sprint cycles. That speed matters in an AI-native market. The focus is not perfection. The focus is functionality.
                </p>
              </div>

              {/* Deliverables */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 20,
                  letterSpacing: "-0.01em"
                }}>
                  Deliverables
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px 24px" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "13px",
                      flexShrink: 0
                    }}>1</div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0c0c14", marginBottom: 6 }}>
                        Working Interface
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                        A functional interface built with no-code platforms.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "13px",
                      flexShrink: 0
                    }}>2</div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0c0c14", marginBottom: 6 }}>
                        Defined Automation Logic
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                        Clear automation workflows and system logic structure.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "13px",
                      flexShrink: 0
                    }}>3</div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0c0c14", marginBottom: 6 }}>
                        Testable AI MVP Build Framework
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                        A structured framework ready for user testing.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "13px",
                      flexShrink: 0
                    }}>4</div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0c0c14", marginBottom: 6 }}>
                        Demonstrable Product
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                        A product that can be demonstrated to real users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools Used */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 20,
                  letterSpacing: "-0.01em"
                }}>
                  Tools Used
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  <div style={{
                    background: "#fafafa",
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: "20px 18px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                  }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#0c0c14", marginBottom: 6 }}>
                      No-Code AI Platforms
                    </p>
                    <p style={{ fontSize: "13px", color: "#5a5a72", marginBottom: 0, lineHeight: 1.5 }}>
                      Build functional prototypes without coding
                    </p>
                  </div>
                  <div style={{
                    background: "#fafafa",
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: "20px 18px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                  }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#0c0c14", marginBottom: 6 }}>
                      API Integration Tools
                    </p>
                    <p style={{ fontSize: "13px", color: "#5a5a72", marginBottom: 0, lineHeight: 1.5 }}>
                      Connect AI models to your interface
                    </p>
                  </div>
                </div>
              </div>

              {/* Outcome */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 12,
                padding: "28px 24px",
                marginBottom: 0
              }}>
                <h2 style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 16,
                  letterSpacing: "-0.01em"
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
                  The shift is immediate. You are no longer discussing ideas. You are showing execution. A working prototype ready for real user testing—not theory, not slides.
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
                  Once you complete Week 2, you are ready to validate.
                </p>
                <Link href="/udaan/week-3" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "14px 32px",
                  borderRadius: 10,
                  textDecoration: "none",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                  Continue to Week 3 
                  <span style={{ fontSize: "16px" }}>→</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </section>
      </main>
      <Footer1 />
    </>
  );
}
