"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function ExecutionSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Section Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 56, textAlign: "center" }}
        >
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
            From Idea to Execution
          </h2>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "#5a5a72",
              marginBottom: 24,
            }}
          >
            What Udaan Truly Represents
          </p>
          {/* Purple gradient divider */}
          <div
            style={{
              width: 80,
              height: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              margin: "0 auto",
              borderRadius: 2,
            }}
          />
        </motion.div>

        {/* Core Philosophy Block - Two Cards in One Line */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "stretch",
            marginBottom: 64,
          }}
        >
          {/* Card 1 - Main Content */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(12,12,20,0.1)",
              borderRadius: 16,
              padding: 36,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              Udaan is the launch layer of the <strong style={{ fontWeight: 600, color: "#0c0c14" }}>DAG Army AI Startup Ecosystem.</strong> It is a focused, high-intensity <strong style={{ 
                fontWeight: 600, 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>AI Startup Program</strong> built as a structured <strong style={{ fontWeight: 600, color: "#0c0c14" }}>Founder Development Platform.</strong>
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              This is not passive learning. It is a disciplined <strong style={{ 
                fontWeight: 600, 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Startup Runway</strong> where ideas are converted into working models through <strong style={{ fontWeight: 600, color: "#0c0c14" }}>execution.</strong>
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 0,
              }}
            >
              The outcome is not a certificate. It is a <strong style={{ 
                fontWeight: 600, 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>functional prototype, early validation, and a monetization pathway</strong> inside real <strong style={{ fontWeight: 600, color: "#0c0c14" }}>AI entrepreneurship.</strong>
            </p>
          </div>

          {/* Card 2 - Execution Over Theory */}
          <div
            style={{
              background: "rgba(12,12,20,0.02)",
              border: "1px solid rgba(91,75,236,0.15)",
              borderRadius: 16,
              padding: 36,
              boxShadow: "0 2px 16px rgba(91,75,236,0.06)",
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
              Execution Over Theory
            </h3>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#0c0c14",
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              Udaan does not reward attendance.<br />
              It rewards <strong style={{ 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>shipped work.</strong>
            </p>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#5a5a72",
                marginBottom: 0,
              }}
            >
              This is the filtration layer of the ecosystem.<br />
              Execution earns progression.<br />
              Builders earn responsibility.
            </p>
          </div>
        </motion.div>

        {/* Market Reality & Validation Block */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            maxWidth: 800,
            margin: "0 auto 64px auto",
            textAlign: "center",
            padding: "32px 40px",
            background: "rgba(12,12,20,0.015)",
            borderRadius: 12,
            border: "1px solid rgba(12,12,20,0.06)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "22px",
              fontWeight: 700,
              color: "#0c0c14",
              marginBottom: 20,
              letterSpacing: "-0.01em",
            }}
          >
            Why This Model Matters
          </h3>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#5a5a72",
              marginBottom: 0,
            }}
          >
            Globally, nearly <strong style={{ 
              fontWeight: 600, 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>90% of startups fail.</strong><br />
            <strong style={{ fontWeight: 600, color: "#0c0c14" }}>42% fail due to lack of market need.</strong>
            <br /><br />
            Udaan directly addresses this through structured validation before expansion.
            <br /><br />
            Startups supported by collaborative ecosystems achieve faster early traction, reinforcing a builder-first culture grounded in accountability and execution.
          </p>
        </motion.div>

        {/* Final Ending Statement */}
        <motion.div
          {...fadeUp(0.6)}
          style={{
            textAlign: "center",
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: 1.5,
              color: "#0c0c14",
              letterSpacing: "-0.01em",
              marginBottom: 0,
            }}
          >
            Udaan is not a learning track.<br />
            It is an execution runway.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
