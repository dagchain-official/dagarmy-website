"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Vision2030() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const ease = [0.22, 1, 0.36, 1] as any;

  // ========== CUSTOMIZATION OPTIONS ==========
  // Adjust these values to customize the section appearance
  
  // Hero Image Card Settings
  const HERO_IMAGE_HEIGHT = 250; // Height of the hero image card in pixels (default: 420)
  const HERO_BORDER_RADIUS = 10; // Border radius of the hero card (default: 20)
  const HERO_MARGIN_BOTTOM = 20; // Space below hero card (default: 64)
  
  // Section Heading Settings
  const HEADING_SIZE_MIN = 40; // Minimum heading size in pixels (default: 40)
  const HEADING_SIZE_MAX = 52; // Maximum heading size in pixels (default: 52)

  // Content Block Settings
  const CONTENT_MAX_WIDTH = 780; // Max width of content blocks (default: 780)
  const BLOCK_SPACING = 64; // Space between content blocks (default: 64)
  
  // ==========================================

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
      <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 1200, paddingLeft: 0, paddingRight: 0 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ marginBottom: 32, textAlign: "center" }}
        >
          

          {/* Main Heading */}
          <h2
            style={{
              fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
              fontWeight: 700,
              fontSize: `clamp(${HEADING_SIZE_MIN}px, 5vw, ${HEADING_SIZE_MAX}px)`,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#0c0c14",
              marginBottom: 0,
            }}
          >
            Why This Movement Matters – Vision 2030
          </h2>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          style={{
            width: "100%",
            marginBottom: HERO_MARGIN_BOTTOM,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/udaan/Vision 2030/Vision.png"
            alt="Vision 2030 - Enable 100,000 AI Startup Founders"
            style={{
              maxWidth: "700px",
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </motion.div>

        {/* Block 1 — The Transition Era */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          style={{
            maxWidth: 900,
            margin: `0 auto ${BLOCK_SPACING}px`,
          }}
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 16,
            }}
          >
            We are living through a transition that will define careers, industries, and ownership for the next decade. Artificial intelligence is not simply another skill to learn. It is a structural layer reshaping how products are built, how services are delivered, and how value is created.
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
            }}
          >
            The real difference is not between those who understand AI and those who do not. The difference is between those who{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            >
              choose to build with it
            </span>
            {" "}and those who remain observers.
          </p>
        </motion.div>

        {/* Block 2 — DAG-Lakh Founder Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          style={{
            maxWidth: 900,
            margin: `0 auto ${BLOCK_SPACING}px`,
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* Left - Heading */}
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              lineHeight: 1.4,
              color: "#0c0c14",
            }}
          >
            1 Lakh Founder Mission
          </div>

          {/* Right - Content */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
            }}
          >
            The{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            >
              1 Lakh Founder Mission
            </span>
            {" "}exists because talent is widely distributed, but structured opportunity is not. There are working professionals with ideas. Freelancers with strong execution ability. Early entrepreneurs with hunger. What most of them lack is: A disciplined runway, Peer accountability, A contribution-driven ecosystem, An ecosystem that turns potential into ownership.
          </p>
        </motion.div>

        {/* Block 3 — Collaborative AI Founder Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          style={{
            maxWidth: 900,
            margin: `0 auto ${BLOCK_SPACING}px`,
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* Left - Heading */}
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Collaborative AI Founder Community
            </span>
          </div>

          {/* Right - Content */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
            }}
          >
            This is not a solo journey. A Collaborative AI Founder Community is not a slogan. It is an operating principle. Ideas are refined through collective feedback. Traction is strengthened from the start. Challenges are addressed openly. No founder struggles in silence. The network becomes stronger with the progress of every single builder.
          </p>
        </motion.div>

        {/* Block 4 — Vision 2030 Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          style={{
            maxWidth: 900,
            margin: `0 auto ${BLOCK_SPACING}px`,
          }}
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
              fontWeight: 600,
            }}
          >
            By 2030, enabling{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              100,000 AI startup founders
            </span>{" "}
            is not about reaching a symbolic number. It is about creating compounding impact through structured builder cycles, shifting identity from consumption to creation, and building ownership-driven founders across South Asia.
          </p>
        </motion.div>

        {/* Closing Statement - The Movement Principle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          style={{
            textAlign: "center",
            maxWidth: 900,
            margin: "0 auto",
            paddingTop: 32,
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#0c0c14",
              marginBottom: 0,
              fontWeight: 700,
            }}
          >
            Learning tools will always be available. Structured builder ecosystems are rare. This movement matters because it replaces passive awareness with accountable action — and turns ambition into measurable execution.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
