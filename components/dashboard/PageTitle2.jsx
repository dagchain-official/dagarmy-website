"use client";
import React from "react";

export default function PageTitle2() {
  return (
    <div
      className="page-title"
      style={{
        background: "linear-gradient(135deg, #1f2937 0%, #1f2937 100%)",
        padding: "60px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <div className="tf-container" style={{ position: "relative", zIndex: 2 }}>
        <div className="row">
          <div className="col-12">
            <div className="content text-center">
              <h2
                className="fw-7 font-cardo"
                style={{
                  color: "#fff",
                  fontSize: "42px",
                  marginBottom: "12px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Student Dashboard
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "16px",
                  margin: 0,
                  maxWidth: "600px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Track your progress and continue your learning journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
