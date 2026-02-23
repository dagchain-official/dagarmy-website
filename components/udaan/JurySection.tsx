"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function JurySection() {
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
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 1200 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 48, textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(38px, 4vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#0c0c14",
              marginBottom: 20,
            }}
          >
            Jury & Selection Ethos
          </h2>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#5a5a72",
              maxWidth: 700,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A serious selection process depends on who evaluates it and how.
          </p>
        </motion.div>

        {/* Institutional Review Block */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            maxWidth: 800,
            margin: "0 auto 56px",
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: 10,
            padding: "40px 48px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 20,
            }}
          >
            The <strong>AI Expert Jury</strong> within this ecosystem is intentionally structured to bring independent scrutiny into every stage of evaluation.
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#5a5a72",
              marginBottom: 16,
            }}
          >
            This is not a symbolic board assembled for branding.
            <br />
            It is a working <strong>Investor Panel</strong> and founder-led review body designed to test substance.
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
            The selection is curated.
            <br />
            It is not a participation event.
          </p>
        </motion.div>

        {/* Layered Founder Evaluation Framework */}
        <motion.div
          {...fadeUp(0.2)}
          style={{ marginBottom: 56 }}
        >
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "28px",
              lineHeight: 1.3,
              color: "#0c0c14",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Layered Founder Evaluation Framework
          </h3>
          <p
            style={{
              fontSize: "15px",
              color: "#5a5a72",
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Each startup undergoes layered Founder Evaluation, where different perspectives examine different aspects of the build.
          </p>

          {/* Three Review Columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
            }}
          >
            {/* Technical Review */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "32px 28px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            >
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 12,
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                }}
              >
                Technical Review
              </h4>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#5a5a72",
                  marginBottom: 0,
                }}
              >
                Technical members assess architecture and feasibility.
              </p>
            </div>

            {/* Product Review */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "32px 28px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            >
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 12,
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                }}
              >
                Product Review
              </h4>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#5a5a72",
                  marginBottom: 0,
                }}
              >
                Product operators review clarity of workflow and execution discipline.
              </p>
            </div>

            {/* Investment Review */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "32px 28px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            >
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 12,
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                }}
              >
                Investment Review
              </h4>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#5a5a72",
                  marginBottom: 0,
                }}
              >
                Investors examine scalability, defensibility, and market logic.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Two-Column Layout: Due Diligence & Merit Selection */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
            marginBottom: 56,
          }}
        >
          {/* Structured Startup Due Diligence */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: "36px 32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: 1.3,
                color: "#0c0c14",
                marginBottom: 20,
              }}
            >
              Structured Startup Due Diligence
            </h3>
            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 24,
              }}
            >
              <p style={{ marginBottom: 12 }}>Assumptions are questioned.</p>
              <p style={{ marginBottom: 12 }}>Validation signals are verified.</p>
              <p style={{ marginBottom: 0 }}>Claims are cross-checked against demonstrable work.</p>
            </div>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#0c0c14",
                fontWeight: 600,
                marginBottom: 0,
              }}
            >
              The intent is not to intimidate founders.
              <br />
              It is to strengthen them.
            </p>
          </div>

          {/* Merit Driven Selection */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: "36px 32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: 1.3,
                color: "#0c0c14",
                marginBottom: 20,
              }}
            >
              Merit Driven Selection
            </h3>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              This approach reinforces <strong>Merit Driven Selection</strong>.
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#0c0c14",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Progression is determined by evidence, not presentation.
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#5a5a72",
                marginBottom: 0,
              }}
            >
              Clear reasoning, validation depth, and execution maturity weigh more than visual polish.
            </p>
          </div>
        </motion.div>

        {/* Outcome Block */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            maxWidth: 800,
            margin: "0 auto 56px",
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: 10,
            padding: "40px 48px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: 1.3,
              color: "#0c0c14",
              marginBottom: 20,
            }}
          >
            Outcome of Independent Scrutiny
          </h3>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#5a5a72",
              marginBottom: 16,
            }}
          >
            For those who advance, the outcome is strengthened <strong>AI Startup Credibility</strong>.
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#5a5a72",
              marginBottom: 16,
            }}
          >
            Every step passes through independent scrutiny.
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#5a5a72",
              marginBottom: 16,
            }}
          >
            This signals seriousness to mentors, partners, and capital networks.
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
            It also builds internal confidence, because the founder knows their build has been examined from multiple angles.
          </p>
        </motion.div>

        {/* Closing Principle */}
        <motion.div
          {...fadeUp(0.5)}
          style={{
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            By the time a startup reaches Demo Day, it has already faced structured review.
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#5a5a72",
              fontWeight: 600,
              marginBottom: 0,
            }}
          >
            That is what gives the stage weight and meaning.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
