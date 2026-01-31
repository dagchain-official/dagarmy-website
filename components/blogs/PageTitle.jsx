import React from "react";

export default function PageTitle({ title = "DAGARMY Blog" }) {
  // Split title to apply Nasalization only to DAGARMY
  const renderTitle = () => {
    if (title === "DAGARMY Blog") {
      return (
        <>
          <span style={{ fontFamily: 'Nasalization, sans-serif' }}>DAGARMY</span> Blog
        </>
      );
    }
    return title;
  };

  return (
    <div
      className="section-blog-hero"
      style={{
        padding: "60px 0 30px",
        background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Subtle Decorative Elements */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "10%",
          width: "250px",
          height: "250px",
          background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

      <div className="tf-container" style={{ position: "relative", zIndex: 2 }}>
        <div className="row">
          <div className="col-12">
            <div className="content text-center">
              {/* Tag Badge - Without Icon */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0s"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                  padding: "6px 18px",
                  borderRadius: "50px",
                  marginBottom: "16px",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                }}
              >
                <span style={{
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}>
                  Knowledge Hub
                </span>
              </div>

              {/* Main Title */}
              <h1
                className="font-cardo fw-7 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{
                  fontSize: "48px",
                  lineHeight: "1.2",
                  marginBottom: "12px",
                  color: "#111827",
                  fontWeight: "700",
                  letterSpacing: "-0.02em",
                }}
              >
                {renderTitle()}
              </h1>

              {/* Subtitle */}
              <p
                className="sub fs-18 wow fadeInUp"
                data-wow-delay="0.2s"
                style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  maxWidth: "700px",
                  margin: "0 auto 24px",
                  lineHeight: "1.6",
                  fontWeight: "400",
                }}
              >
                Insights on AI, Blockchain, and Data Visualization from the Vibe Coder Army
              </p>

              {/* Stats Bar */}
              <div
                className="wow fadeInUp"
                data-wow-delay="0.3s"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "32px",
                  background: "#ffffff",
                  padding: "20px 40px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "4px"
                  }}>
                    50+
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: "500"
                  }}>
                    Articles
                  </div>
                </div>

                <div style={{
                  width: "1px",
                  height: "40px",
                  background: "#e5e7eb"
                }} />

                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "4px"
                  }}>
                    50K+
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: "500"
                  }}>
                    Readers
                  </div>
                </div>

                <div style={{
                  width: "1px",
                  height: "40px",
                  background: "#e5e7eb"
                }} />

                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "4px"
                  }}>
                    Weekly
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: "500"
                  }}>
                    Updates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
