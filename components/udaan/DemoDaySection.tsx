"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function DemoDaySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 1200 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 48, textAlign: "center" }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#9494aa",
              marginBottom: 20,
            }}
          >
            SELECTION PIPELINE
          </div>
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(38px, 4vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#0c0c14",
              marginBottom: 16,
            }}
          >
            Road to <span style={{ color: "#6366f1" }}>Demo Day Finals</span>
          </h2>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#5a5a72",
              marginBottom: 32,
            }}
          >
            The Prestige Layer of the DAG Army Ecosystem
          </p>
          
          {/* Supporting Copy */}
          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
            }}
          >
            <p style={{ marginBottom: 8, fontWeight: 600 }}>This layer is filtered.</p>
            <p style={{ marginBottom: 8 }}>The AI Startup Selection Program separates interest from execution.</p>
            <p style={{ marginBottom: 8 }}>Only proven builders move forward.</p>
            <p style={{ marginBottom: 0 }}>Demo Day Finals are a stage for outcomes, not announcements.</p>
          </div>
        </motion.div>

        {/* Three-Stage Pipeline Layout */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 32,
            marginBottom: 56,
          }}
        >
          {/* CARD 1 — Stage 1: Screening */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              padding: "32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#9494aa",
                marginBottom: 12,
              }}
            >
              STAGE 1
            </div>
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "26px",
                lineHeight: 1.2,
                color: "#0c0c14",
                marginBottom: 10,
              }}
            >
              Screening
            </h3>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#5a5a72",
                marginBottom: 20,
                lineHeight: 1.5,
              }}
            >
              Testing thinking clarity and problem depth.
            </p>
            
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#e5e5e5",
                marginBottom: 20,
              }}
            />
            
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Evaluation Criteria
            </p>
            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              <div style={{ marginBottom: 10 }}>• AI Problem Solving clarity</div>
              <div style={{ marginBottom: 10 }}>• Use case relevance and differentiation</div>
              <div style={{ marginBottom: 10 }}>• Feasibility within a realistic build cycle</div>
              <div>• Early revenue logic or adoption logic</div>
            </div>
            
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#e5e5e5",
                marginBottom: 16,
              }}
            />
            
            <p
              style={{
                fontSize: "14px",
                color: "#5a5a72",
                lineHeight: 1.6,
                marginBottom: 0,
              }}
            >
              Filters 1,000+ applicants into a Curated Founder Cohort shortlist.
            </p>
          </div>

          {/* CARD 2 — Stage 2: Validation & Mentor Review */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #d0d0e0",
              borderRadius: 10,
              padding: "32px",
              boxShadow: "0 3px 12px rgba(99,102,241,0.08)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#9494aa",
                marginBottom: 12,
              }}
            >
              STAGE 2
            </div>
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "26px",
                lineHeight: 1.2,
                color: "#0c0c14",
                marginBottom: 10,
              }}
            >
              Validation & Mentor Review
            </h3>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#5a5a72",
                marginBottom: 20,
                lineHeight: 1.5,
              }}
            >
              Testing proof through real execution.
            </p>
            
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#e5e5e5",
                marginBottom: 20,
              }}
            />
            
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Evaluation Criteria
            </p>
            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              <div style={{ marginBottom: 10 }}>• Functional AI Startup Prototype</div>
              <div style={{ marginBottom: 10 }}>• Evidence of Market Testing</div>
              <div style={{ marginBottom: 10 }}>• AI Product Validation insights</div>
              <div style={{ marginBottom: 10 }}>• 5–10 structured validation conversations</div>
              <div>• Mentor feedback adoption and iteration discipline</div>
            </div>
            
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#e5e5e5",
                marginBottom: 16,
              }}
            />
            
            <p
              style={{
                fontSize: "14px",
                color: "#5a5a72",
                lineHeight: 1.6,
                marginBottom: 0,
              }}
            >
              Builds investor-grade clarity and startup funding readiness.
            </p>
          </div>

          {/* CARD 3 — Stage 3: Demo Day Finals */}
          <div
            style={{
              background: "#ffffff",
              border: "2px solid #6366f1",
              borderRadius: 10,
              padding: "32px",
              boxShadow: "0 4px 16px rgba(99,102,241,0.12)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6366f1",
                marginBottom: 12,
              }}
            >
              STAGE 3
            </div>
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "26px",
                lineHeight: 1.2,
                color: "#0c0c14",
                marginBottom: 10,
              }}
            >
              Demo Day Finals
            </h3>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#5a5a72",
                marginBottom: 20,
                lineHeight: 1.5,
              }}
            >
              Execution becomes reputation.
            </p>
            
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#e5e5e5",
                marginBottom: 20,
              }}
            />
            
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Evaluation Criteria
            </p>
            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              <div style={{ marginBottom: 10 }}>• AI Startup Pitch to independent AI Jury</div>
              <div style={{ marginBottom: 10 }}>• Problem strength and validation depth</div>
              <div style={{ marginBottom: 10 }}>• Product build quality</div>
              <div style={{ marginBottom: 10 }}>• Scalability logic</div>
              <div>• Founder maturity</div>
            </div>
            
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#e5e5e5",
                marginBottom: 20,
              }}
            />
            
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0c0c14",
                marginBottom: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Founder Benefits
            </p>
            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
              }}
            >
              <div style={{ marginBottom: 10 }}>• Pre-Seed Grant support</div>
              <div style={{ marginBottom: 10 }}>• Direct Investor Exposure</div>
              <div style={{ marginBottom: 10 }}>• Continued Mentor Access</div>
              <div>• AI Startup Accelerator pathway entry</div>
            </div>
          </div>
        </motion.div>

        {/* Closing Authority Statement */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            textAlign: "center",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.5,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            The point is not participation.
            <br />
            The point is <span style={{ color: "#6366f1" }}>shipped work</span>.
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#5a5a72",
              fontWeight: 500,
              marginBottom: 0,
            }}
          >
            Demo Day Finals are earned, not attended.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
