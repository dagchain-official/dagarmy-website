"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export default function LieutenantSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const capabilitySlides = [
    [
      "Build AI MVP using no-code stacks or agentic workflows",
      "Launch a functional AI Startup Prototype",
      "Validate AI Idea through structured user feedback",
    ],
    [
      "Conduct real Market Testing",
      "Refine through disciplined AI Product Validation",
      "Progress toward the Founder Track",
    ],
  ];

  const responsibilityFrames = [
    { left: "Support Soldiers", right: "Refine prototypes" },
    { left: "Prepare for Demo Day", right: "Build toward scale" },
  ];

  // Auto-rotate carousel every 4 seconds (pause on hover)
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % capabilitySlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering, capabilitySlides.length]);

  // Auto-rotate responsibility frames every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % responsibilityFrames.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [responsibilityFrames.length]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#ffffff",
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Header Block with Badge - Matching Soldier Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ 
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Badge on Left */}
          <div
            style={{
              width: 120,
              height: 120,
              flexShrink: 0,
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

          {/* Header Content on Right */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5a5a72",
                marginBottom: 8,
              }}
            >
              EXECUTION RANK
            </div>
            <h2
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontWeight: 700,
                fontSize: "clamp(36px, 3vw, 46px)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#0c0c14",
                marginBottom: 0,
              }}
            >
              Lieutenant: The Builder Who Executes
            </h2>
          </div>
        </motion.div>

        {/* Two-Column Layout with Vertical Divider */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            gap: 32,
            marginBottom: 5,
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN */}
          <div>
            {/* Semi-headline as intro to explanation */}
            <p
              style={{
                fontSize: "29px",
                fontWeight: 900,
                color: "#000000",
                marginBottom: 16,
              }}
            >
              The Rank That Is Earned
            </p>

            {/* Rank Explanation */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 0,
              }}
            >
              A Lieutenant is no longer in preparation. This is the rank of the AI Startup Builder.
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              It is earned only after shipping a working solution through structured Startup Execution inside the Udaan runway.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 0,
              }}
            >
              Prestige here is simple.
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              Output over opinion.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              A Lieutenant moves from tools to systems, from prompts to products, from ideas to traction.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 24,
              }}
            >
              This is where Builder Leadership begins.
            </p>

            {/* Market Context Section - MOVED FROM RIGHT COLUMN */}
            <h3
              style={{
                fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                fontSize: "29px",
                fontWeight: 900,
                color: "#000000",
                marginBottom: 16,
              }}
            >
              Execution in Today's AI Economy
            </h3>
            
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              More than 74% of new tech startups are AI-native, which means speed and niche clarity matter. The advantage lies in focused AI Problem Solving, not broad experimentation.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 12,
              }}
            >
              Many AI initiatives fail due to weak integration and unclear workflows. Lieutenants are trained to build industry-specific systems with defined use cases and validation checkpoints.
            </p>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                fontWeight: 650,
                color: "#374151",
                marginBottom: 0,
              }}
            >
              This is not experimentation for visibility.<br />
              It is structured product execution.
            </p>
          </div>

          {/* VERTICAL DIVIDER */}
          <div
            style={{
              width: "1px",
              background: "rgba(12,12,20,0.1)",
              height: "100%",
              alignSelf: "stretch",
            }}
          />

          {/* RIGHT COLUMN */}
          <div>
            {/* Execution Capability Card with Auto-Slider - MOVED FROM LEFT COLUMN */}
            <div
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "28px 30px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                position: "relative",
                width: "100%",
                marginBottom: 32,
              }}
            >
              {/* Card Label */}
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: 4,
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#6b7280",
                    marginBottom: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  What Defines a Lieutenant
                </p>
              </div>
              {/* Card Heading */}
              <h4
                style={{
                  fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0c0c14",
                  marginBottom: 20,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                Execution determines this rank:
              </h4>

              {/* Auto-Rotating Slide Container */}
              <div style={{ position: "relative", minHeight: "150px", overflow: "hidden" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 10,
                    }}
                  >
                    {capabilitySlides[currentSlide].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: i * 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          padding: "10px 18px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: 6,
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#374151",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#6b7280",
                          flexShrink: 0,
                        }} />
                        {item}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Static Card Footer */}
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  padding: "16px 18px",
                  borderRadius: 6,
                  marginLeft: "-30px",
                  marginRight: "-30px",
                  marginBottom: "-28px",
                  paddingLeft: "30px",
                  paddingRight: "30px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "#4b5563",
                    marginBottom: 0,
                  }}
                >
                  Your MVP is <strong style={{ 
                    fontWeight: 700, 
                    color: "#0c0c14",
                  }}>proof</strong>.<br />
                  Your traction is the <strong style={{ 
                    fontWeight: 700, 
                    color: "#0c0c14",
                  }}>signal</strong>.
                </p>
              </div>
            </div>

            {/* Leadership Progression Section - Redesigned Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #fafbfc 0%, #f3f4f6 100%)",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "28px 30px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {/* Card Header */}
              <div style={{ marginBottom: 20 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#0c0c14",
                    marginBottom: 12,
                    letterSpacing: "-0.02em",
                  }}
                >
                  From Builder to Leader
                </h3>

                {/* Static Leadership Message */}
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: 0,
                  }}
                >
                  A Lieutenant does not wait for permission.<br />
                  A Lieutenant advances the mission.
                </p>
              </div>

              {/* Animated Responsibility Sequence - Two Columns */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 0,
                }}
              >
              {/* LEFT BLOCK */}
              <div style={{ position: "relative", minHeight: "50px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`left-${currentFrame}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      width: "100%",
                      padding: "12px 18px",
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4b5563",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1f2937",
                      }}
                    >
                      {responsibilityFrames[currentFrame].left}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT BLOCK */}
              <div style={{ position: "relative", minHeight: "50px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`right-${currentFrame}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      width: "100%",
                      padding: "14px 18px",
                      background: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4b5563",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1f2937",
                      }}
                    >
                      {responsibilityFrames[currentFrame].right}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            </div>

            {/* Progression Statement */}
            <div
              style={{
                textAlign: "center",
                padding: "20px 24px",
                background: "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 12,
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#0c0c14",
                  fontWeight: 700,
                  marginBottom: 0,
                }}
              >
                Soldier is preparation.<br />
                Lieutenant is <span style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 900,
                }}>execution</span>.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
