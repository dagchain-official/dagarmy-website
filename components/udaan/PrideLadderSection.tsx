"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function PrideLadderSection() {
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
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 56, textAlign: "center" }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9494aa",
              marginBottom: 20,
            }}
          >
            PRIDE LADDER
          </div>
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(40px, 5vw, 52px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              marginBottom: 16,
              color: "#0c0c14",
            }}
          >
            The <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Pride Ladder</span> – Rank Through Contribution
          </h2>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#5a5a72",
              marginBottom: 0,
            }}
          >
            A Meritocracy, Not a Marketplace
          </p>
        </motion.div>

        {/* Principle Block */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            maxWidth: 800,
            margin: "0 auto 64px auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#0c0c14",
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            The DAG Army does not run on titles. It runs on contribution.
          </p>
          
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#5a5a72",
              marginBottom: 28,
            }}
          >
            The Pride Ladder exists to make one principle clear: growth here is earned through visible execution across your AI Startup Journey, not through passive participation or purchased status.
          </p>
          
          <div
            style={{
              marginTop: 32,
              paddingTop: 28,
              borderTop: "1px solid #e5e5e5",
            }}
          >
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 700, marginBottom: 0 }}>
              Rank cannot be bought. Rank cannot be gifted. Rank cannot be self-declared.
            </p>
          </div>
        </motion.div>

        {/* Structured Rank Visual - 2 Column Grid */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 32,
            marginBottom: 64,
            maxWidth: 1000,
            margin: "0 auto 64px",
          }}
        >
          {/* Soldier Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              padding: "36px 32px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Header with Badge on Right */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#0c0c14",
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Soldier
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#9494aa",
                    marginBottom: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Foundation Rank
                </p>
              </div>
              <div
                style={{
                  width: 180,
                  height: 90,
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                <img
                  src="/BADGES  and  RANK png+svg/DAGARMY BADGES/DAG SOLDIER.svg"
                  alt="Soldier Badge"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 0,
              }}
            >
              The entry point. Soldiers are learners in formation—building foundational AI skills, testing tools, and developing clarity on real-world application. This is not passive consumption. It is structured preparation.
            </p>
          </div>

          {/* Lieutenant Card */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              borderRadius: 16,
              padding: "36px 32px",
              boxShadow: "0 4px 20px rgba(99,102,241,0.12)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Header with Badge on Right */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#0c0c14",
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Lieutenant
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#5b4bec",
                    marginBottom: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Execution Rank
                </p>
              </div>
              <div
                style={{
                  width: 180,
                  height: 90,
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                <img
                  src="/BADGES  and  RANK png+svg/DAGARMY BADGES/DAG LIEUTENANT.svg"
                  alt="Lieutenant Badge"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 0,
              }}
            >
              The builder rank. Lieutenants are no longer preparing—they are executing. They build prototypes, validate ideas with real users, and generate early market signals. This is where learning transitions into applied work.
            </p>
          </div>
        </motion.div>

        {/* Integrity Panel - Professional Card Layout */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            padding: "48px 56px",
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            marginBottom: 56,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "28px",
              fontWeight: 700,
              color: "#0c0c14",
              marginBottom: 40,
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Integrity as the Guardrail
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 32,
              marginBottom: 40,
            }}
          >
            {/* What We Reject */}
            <div
              style={{
                background: "#fafafa",
                borderRadius: 12,
                padding: "28px 24px",
                border: "1px solid #e5e5e5",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#9494aa",
                  marginBottom: 20,
                }}
              >
                What We Reject
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                  No MLM logic
                </p>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                  No get-rich shortcuts
                </p>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                  No artificial hierarchy for display
                </p>
              </div>
            </div>

            {/* What We Value */}
            <div
              style={{
                background: "#fafafa",
                borderRadius: 12,
                padding: "28px 24px",
                border: "1px solid #e5e5e5",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#9494aa",
                  marginBottom: 20,
                }}
              >
                What We Value
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                  <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Applied work</strong> over knowledge alone
                </p>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                  Reputation as earned trust
                </p>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                  Transparent reporting over claims
                </p>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#5a5a72", marginBottom: 0 }}>
                  <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Demonstrated</strong> impact over presentation
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: 32,
              borderTop: "1px solid #e5e5e5",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.6,
                color: "#0c0c14",
                fontWeight: 700,
                marginBottom: 0,
              }}
            >
              Inside this ecosystem, authority is not assigned—it is{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
                }}
              >
                demonstrated through action
              </span>
              .
            </p>
          </div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          {...fadeUp(0.5)}
          style={{
            textAlign: "center",
            maxWidth: 800,
            margin: "0 auto",
            paddingTop: 32,
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              fontSize: "19px",
              lineHeight: 1.6,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 0,
            }}
          >
            The Pride Ladder is not about status.<br />
            It is about <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}>responsibility</span> within a disciplined Builder-First Culture.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
