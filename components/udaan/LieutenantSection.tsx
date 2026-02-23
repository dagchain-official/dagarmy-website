"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function LieutenantSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)",
        paddingTop: 70,
        paddingBottom: 70,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Header Block with Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 48, position: "relative" }}
        >
          {/* Badge SVG - Positioned Independently */}
          <div
            style={{
              position: "absolute",
              left: "calc(22% - 280px)",
              top: 0,
              width: 200,
              height: 200,
            }}
            className="lieutenant-badge-desktop"
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

          {/* Header Content - Perfectly Centered */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5b4bec",
                marginBottom: 16,
              }}
            >
              EXECUTION RANK
            </div>
            <h2
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "clamp(36px, 3.5vw, 48px)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#0c0c14",
                marginBottom: 12,
              }}
            >
              Lieutenant: The Builder Who Executes
            </h2>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#5a5a72",
                marginBottom: 24,
              }}
            >
              The Rank That Is Earned
            </p>
            {/* Gradient divider */}
            <div
              style={{
                width: 100,
                height: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                margin: "0 auto",
                borderRadius: 2,
              }}
            />
          </div>
        </motion.div>

        {/* Identity Block - Two Column Layout */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
            alignItems: "start",
            marginBottom: 48,
          }}
        >
          {/* LEFT SIDE - Identity Text */}
          <div>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 28,
              }}
            >
              A <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Lieutenant</strong> inside the DAG Army AI Startup Ecosystem is no longer in preparation. This is the rank of the <strong style={{ fontWeight: 700, color: "#0c0c14" }}>AI Startup Builder.</strong>
            </p>
            
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.7,
                color: "#0c0c14",
                fontWeight: 600,
                marginBottom: 28,
              }}
            >
              Prestige does not come from talk. It <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
              }}>comes from output.</span>
            </p>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 600, marginBottom: 10 }}>
                From learning tools to building systems.
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 600, marginBottom: 10 }}>
                From prompts to products.
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#0c0c14", fontWeight: 600, marginBottom: 0 }}>
                From theory to traction.
              </p>
            </div>

            {/* Execution in the AI Economy Card - Moved to Left Column */}
            <div
              style={{
                padding: "24px 28px",
                background: "rgba(255,255,255,0.7)",
                borderTop: "3px solid transparent",
                borderImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) 1",
                borderRadius: 8,
                marginBottom: 0,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 16,
                  letterSpacing: "-0.01em",
                }}
              >
                Execution in the AI Economy
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#5a5a72",
                  marginBottom: 16,
                }}
              >
                AI literacy is expanding. But literacy alone does not create market position. <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}>Focused problem-solving does.</span>
              </p>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#0c0c14",
                  fontWeight: 600,
                  marginBottom: 0,
                }}
              >
                This is not experimentation for visibility.<br />
                This is <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}>structured product execution.</span>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Execution Authority Card */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 4px 20px rgba(91,75,236,0.12)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "22px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 24,
                letterSpacing: "-0.01em",
              }}
            >
              Execution Capability
            </h3>

            {/* Bullet items as clean stacked blocks */}
            <div style={{ marginBottom: 24 }}>
              {[
                "Build AI MVP",
                "Create functional prototype",
                "Validate with structured feedback",
                "Conduct real market testing",
                "Refine through iteration",
                "Progress toward Founder Track",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 16px",
                    marginBottom: 8,
                    background: "rgba(12,12,20,0.02)",
                    border: "1px solid rgba(12,12,20,0.08)",
                    borderRadius: 8,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0c0c14",
                  }}
                >
                  • {item}
                </div>
              ))}
            </div>

            {/* Highlighted mini panel */}
            <div
              style={{
                padding: "16px 20px",
                background: "rgba(91,75,236,0.06)",
                border: "1px solid rgba(91,75,236,0.15)",
                borderRadius: 10,
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#0c0c14",
                  fontWeight: 600,
                  marginBottom: 0,
                }}
              >
                Your MVP becomes your <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}>proof.</span><br />
                Your traction becomes your <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}>signal.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Builder to Leader Transition */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "26px",
              fontWeight: 700,
              color: "#0c0c14",
              marginBottom: 28,
              letterSpacing: "-0.01em",
            }}
          >
            From Builder to Leader
          </h3>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#0c0c14",
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            A Lieutenant does not wait for permission.<br />
            A Lieutenant advances the mission.
          </p>

          {/* Structured list */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginBottom: 28,
            }}
          >
            {[
              "Support Soldiers",
              "Refine prototypes",
              "Prepare for Demo Day",
              "Build toward scale",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 20px",
                  background: "#ffffff",
                  border: "1px solid rgba(12,12,20,0.1)",
                  borderRadius: 10,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0c0c14",
                  textAlign: "center",
                }}
              >
                • {item}
              </div>
            ))}
          </div>

          {/* Final closing lines */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#0c0c14",
              fontWeight: 600,
              marginBottom: 0,
            }}
          >
            Being a Soldier is preparation.<br />
            Becoming a Lieutenant is <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}>evolution.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
