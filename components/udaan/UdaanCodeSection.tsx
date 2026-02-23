"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function UdaanCodeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 120,
        paddingBottom: 120,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 1200 }}>
        
        {/* Section Header - Hero Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 64, textAlign: "center" }}
        >
          {/* Governance Tag */}
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 20px",
              borderRadius: 20,
              marginBottom: 24,
            }}
          >
            Constitution Framework
          </div>
          
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: "clamp(42px, 4.5vw, 56px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#0c0c14",
              marginBottom: 24,
            }}
          >
            Udaan Code – Constitution in Action
          </h2>
          
          {/* Divider */}
          <div
            style={{
              width: 900,
              height: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              margin: "0 auto 32px",
              borderRadius: 2,
            }}
          />
        </motion.div>

        {/* Opening Framework Block */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            maxWidth: 900,
            margin: "0 auto 72px",
            background: "#fafafa",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "48px 56px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.8,
              color: "#0c0c14",
              marginBottom: 24,
            }}
          >
            Udaan operates within a defined framework of <strong>Community Governance</strong>. Growth here is not chaotic. It is guided by structure.
          </p>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#5a5a72",
              marginBottom: 24,
            }}
          >
            The Constitution protects the culture. It ensures that speed does not dilute standards. Every participant enters a system built on{" "}
            <span
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 6,
              }}
            >
              Builder Discipline
            </span>
            , where action carries weight and integrity carries consequence.
          </p>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#0c0c14",
              fontWeight: 600,
              marginBottom: 0,
            }}
          >
            This is an{" "}
            <span
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 6,
              }}
            >
              Ethical Startup Culture
            </span>
            . Not because it sounds good, but because long-term credibility depends on it.
          </p>
        </motion.div>

        {/* Three Core Principles - Principle Panels */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 36,
            marginBottom: 80,
          }}
        >
          {/* No Toxicity Policy */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #d0d0d0",
              borderRadius: 8,
              padding: "40px 36px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            className="principle-panel"
          >
            {/* Governance Badge */}
            <div
              style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9494aa",
                marginBottom: 16,
                padding: "4px 10px",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
              }}
            >
              Policy
            </div>
            
            {/* Title with Gradient Badge */}
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontWeight: 700,
                  fontSize: "22px",
                  padding: "8px 18px",
                  borderRadius: 6,
                }}
              >
                No Toxicity Policy
              </span>
            </div>
            
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              Mocking beginners, ego-driven behavior, aggressive selling, or misleading narratives are not tolerated.
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
              Respect is not optional.
            </p>
          </div>

          {/* Zero Politics */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #d0d0d0",
              borderRadius: 8,
              padding: "40px 36px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            className="principle-panel"
          >
            {/* Governance Badge */}
            <div
              style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9494aa",
                marginBottom: 16,
                padding: "4px 10px",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
              }}
            >
              Governance Rule
            </div>
            
            {/* Title with Gradient Badge */}
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontWeight: 700,
                  fontSize: "22px",
                  padding: "8px 18px",
                  borderRadius: 6,
                }}
              >
                Zero Politics
              </span>
            </div>
            
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              No religious debate. No ideological battles.
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
              The focus remains singular: build, validate, improve.
            </p>
          </div>

          {/* No Fake Claims */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #d0d0d0",
              borderRadius: 8,
              padding: "40px 36px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            className="principle-panel"
          >
            {/* Governance Badge */}
            <div
              style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9494aa",
                marginBottom: 16,
                padding: "4px 10px",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
              }}
            >
              Integrity Standard
            </div>
            
            {/* Title with Gradient Badge */}
            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontWeight: 700,
                  fontSize: "22px",
                  padding: "8px 18px",
                  borderRadius: 6,
                }}
              >
                No Fake Claims
              </span>
            </div>
            
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 20,
              }}
            >
              Inflated case studies, artificial traction, or misleading income statements damage trust.
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
              Trust is treated as an operational asset, not a marketing slogan.
            </p>
          </div>
        </motion.div>

        {/* Contribution First Block - Full-Width Emphasis */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            background: "#f8f8fa",
            borderTop: "2px solid #e0e0e0",
            borderBottom: "2px solid #e0e0e0",
            padding: "72px 48px",
            marginBottom: 80,
            marginLeft: "-48px",
            marginRight: "-48px",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "32px",
                lineHeight: 1.3,
                color: "#0c0c14",
                marginBottom: 32,
              }}
            >
              Advancement follows one rule:{" "}
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontSize: "34px",
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: 8,
                }}
              >
                Contribution First
              </span>
            </h3>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 24,
              }}
            >
              You earn recognition by launching, validating, mentoring, or supporting other builders.
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#0c0c14",
                fontWeight: 600,
                marginBottom: 0,
              }}
            >
              Status is never transactional. Rank reflects demonstrated execution and service.
            </p>
          </div>
        </motion.div>

        {/* Responsible Culture Block - Split Layout */}
        <motion.div
          {...fadeUp(0.4)}
          style={{
            maxWidth: 950,
            margin: "0 auto 80px",
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "48px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            display: "flex",
            gap: 40,
          }}
        >
          {/* Vertical Line Accent */}
          <div
            style={{
              width: 4,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          
          {/* Content Block */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.8,
                color: "#0c0c14",
                marginBottom: 24,
              }}
            >
              This alignment builds more than startups. It builds a{" "}
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 6,
                }}
              >
                Responsible Founder Culture
              </span>
              .
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#5a5a72",
                marginBottom: 24,
              }}
            >
              Udaan therefore strengthens its positioning as an{" "}
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 6,
                }}
              >
                Ethical AI Community
              </span>
              {" "}and a Responsible Startup Ecosystem.
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#0c0c14",
                fontWeight: 600,
                marginBottom: 0,
              }}
            >
              Fast execution is encouraged. Shortcut behavior is not.
            </p>
          </div>
        </motion.div>

        {/* Closing Statement - Constitutional Declaration */}
        <motion.div
          {...fadeUp(0.5)}
          style={{
            textAlign: "center",
            maxWidth: 800,
            margin: "0 auto",
            paddingTop: 64,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.5,
              color: "#0c0c14",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            When builders operate within discipline, the ecosystem{" "}
            <span
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              compounds in credibility
              <span
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: 2,
                }}
              />
            </span>
            .
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#9494aa",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 0,
            }}
          >
            That is the code.
          </p>
        </motion.div>
      </div>

      {/* Hover Effects */}
      <style jsx>{`
        .principle-panel:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
      `}</style>
    </section>
  );
}
