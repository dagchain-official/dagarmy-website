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
        background: "#ffffff",
        paddingTop: 70,
        paddingBottom: 70,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 40, textAlign: "center" }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9494aa",
              marginBottom: 16,
            }}
          >
            PRIDE LADDER
          </div>
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(36px, 3.5vw, 48px)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: 12,
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
              fontSize: "15px",
              fontWeight: 500,
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
            maxWidth: 700,
            margin: "0 auto 48px auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#5a5a72",
              marginBottom: 24,
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
          
          <div style={{ marginBottom: 0 }}>
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 600, marginBottom: 8 }}>
              Rank cannot be bought.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 600, marginBottom: 8 }}>
              Rank cannot be gifted.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 600, marginBottom: 0 }}>
              Rank cannot be self-declared.
            </p>
          </div>
        </motion.div>

        {/* Structured Rank Visual - 3 Column Grid */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            marginBottom: 56,
          }}
        >
          {/* Soldier Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(12,12,20,0.12)",
              borderRadius: 12,
              padding: "28px 24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header with Badge on Right */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontSize: "22px",
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
              borderRadius: 12,
              padding: "28px 24px",
              boxShadow: "0 2px 12px rgba(91,75,236,0.08)",
            }}
          >
            {/* Header with Badge on Right */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontSize: "22px",
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

          {/* Commander Card */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid rgba(12,12,20,0.15)",
              borderRadius: 12,
              padding: "32px 24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
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
              Commander
            </h3>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0c0c14",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Leadership Rank
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 0,
              }}
            >
              The leadership rank. Commanders demonstrate sustained output, contribute meaningfully to the ecosystem, and advance responsibly. They mentor, guide, and maintain the integrity of the system through demonstrated capability—not self-promotion.
            </p>
          </div>
        </motion.div>

        {/* Integrity Panel - Two Column Layout */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            padding: "40px 48px",
            background: "rgba(12,12,20,0.02)",
            border: "1px solid rgba(12,12,20,0.08)",
            borderRadius: 12,
            marginBottom: 48,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "26px",
              fontWeight: 700,
              color: "#0c0c14",
              marginBottom: 32,
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Integrity as the Guardrail
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              marginBottom: 28,
            }}
          >
            {/* Left Column */}
            <div>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5a5a72", marginBottom: 12 }}>
                • No MLM logic
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5a5a72", marginBottom: 12 }}>
                • No get-rich shortcuts
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5a5a72", marginBottom: 0 }}>
                • No artificial hierarchy created for display
              </p>
            </div>

            {/* Right Column */}
            <div>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5a5a72", marginBottom: 12 }}>
                • Knowledge alone does not move anyone upward. <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Applied work</strong> does.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5a5a72", marginBottom: 12 }}>
                • Reputation is treated as earned trust.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5a5a72", marginBottom: 12 }}>
                • Transparent reporting outweighs inflated claims.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5a5a72", marginBottom: 0 }}>
                • <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Demonstrated</strong> impact outweighs presentation.
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#0c0c14",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: 0,
            }}
          >
            Inside this ecosystem, authority is not assigned.<br />
            It is demonstrated through action.
          </p>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          {...fadeUp(0.5)}
          style={{
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.7,
              color: "#0c0c14",
              fontWeight: 600,
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
