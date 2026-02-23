"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function SoldierSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(148,148,170,0.04) 0%, rgba(90,90,114,0.04) 100%)",
        paddingTop: 70,
        paddingBottom: 70,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Section Header Block with Badge */}
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
            className="soldier-badge-desktop"
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

          {/* Header Content - Perfectly Centered */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5a5a72",
                marginBottom: 16,
              }}
            >
              FOUNDATION RANK
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
              Soldier: The Learner in Formation
            </h2>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#5a5a72",
                marginBottom: 24,
              }}
            >
              The Entry Rank Inside DAG Army
            </p>
            {/* Gray gradient divider */}
            <div
              style={{
                width: 100,
                height: 3,
                background: "linear-gradient(135deg, #5a5a72 0%, #9494aa 100%)",
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
              A <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Soldier</strong> is the structured entry rank inside the <strong style={{ fontWeight: 700, color: "#0c0c14" }}>DAG Army AI Startup Ecosystem.</strong> It is a deliberate starting point within a disciplined <strong style={{ fontWeight: 700, color: "#0c0c14" }}>AI Learning Track.</strong>
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
              This phase builds <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
              }}>preparation.</span> It does not represent completion.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 24,
              }}
            >
              The Soldier stage exists to create the foundation required for long-term <strong style={{ fontWeight: 700, color: "#0c0c14" }}>AI Entrepreneurship.</strong> It transforms interest into capability and capability into direction.
            </p>

            {/* Mindset Shift Card - Moved to Left Column */}
            <div
              style={{
                padding: "24px 28px",
                background: "rgba(255,255,255,0.7)",
                borderTop: "3px solid transparent",
                borderImage: "linear-gradient(135deg, #5a5a72 0%, #9494aa 100%) 1",
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
                From Tool Usage to Real Value
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#5a5a72",
                  marginBottom: 16,
                }}
              >
                AI adoption is expanding rapidly. But adoption alone does not create distinction.
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
                <strong style={{ fontWeight: 700, color: "#0c0c14" }}>Using AI makes you current.</strong><br />
                <strong style={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Building with AI makes you relevant.</strong>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Skills Card */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(white, white), linear-gradient(135deg, #5a5a72 0%, #9494aa 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 4px 20px rgba(90,90,114,0.12)",
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
              What the Soldier Phase Builds
            </h3>

            {/* Skills as clean stacked blocks */}
            <div style={{ marginBottom: 24 }}>
              {[
                "Core AI Foundations",
                "Practical AI Skill Development",
                "AI Tool Ecosystem Mastery",
                "Automation & Opportunity Identification",
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
                background: "rgba(90,90,114,0.06)",
                border: "1px solid rgba(90,90,114,0.15)",
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
                Your foundation becomes your <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}>strength.</span><br />
                Your learning becomes your <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}>advantage.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skill-to-Startup Transition Block */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            marginBottom: 48,
            padding: "32px 40px",
            background: "#ffffff",
            border: "1px solid rgba(12,12,20,0.1)",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "24px",
              fontWeight: 700,
              color: "#0c0c14",
              marginBottom: 28,
              letterSpacing: "-0.01em",
            }}
          >
            The Skill-to-Startup Transition
          </h3>
          
          {/* Old Question */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#9494aa",
                marginBottom: 8,
              }}
            >
              Old Question
            </p>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.6,
                color: "#5a5a72",
                fontStyle: "italic",
                marginBottom: 0,
              }}
            >
              How do I apply AI inside a company?
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(12,12,20,0.1)",
              margin: "24px 0",
            }}
          />

          {/* New Question */}
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#5b4bec",
                marginBottom: 8,
              }}
            >
              New Question
            </p>
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.6,
                color: "#0c0c14",
                fontWeight: 700,
                marginBottom: 0,
              }}
            >
              <span style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>What real problem can I solve with AI?</span>
            </p>
          </div>
        </motion.div>

        {/* Closing Principle Block */}
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
            Progress Over Comfort
          </h3>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#5a5a72",
              marginBottom: 28,
            }}
          >
            Inside this ecosystem, comfort is not rewarded. <strong style={{ 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Progress is.</strong>
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
              "Learn the system",
              "Build foundations",
              "Prepare for execution",
              "Advance to Lieutenant",
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
            Being a Soldier is <strong style={{ fontWeight: 700, color: "#0c0c14" }}>preparation.</strong><br />
            Your direction is <strong style={{ 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>forward.</strong>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
