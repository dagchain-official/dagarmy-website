"use client";
import React, { useState, useEffect } from 'react';

export default function BlogStatsCycle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const stats = [
    {
      value: "50+",
      label: "Articles"
    },
    {
      value: "50K+",
      label: "Readers"
    },
    {
      value: "Weekly",
      label: "Updates"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stats.length);
        setIsAnimating(false);
      }, 300); // Animation duration
    }, 2500); // 2.5 seconds delay

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes slideUpFadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUpFadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }

        .stat-item-enter {
          animation: slideUpFadeIn 0.4s ease-out forwards;
        }

        .stat-item-exit {
          animation: slideUpFadeOut 0.3s ease-in forwards;
        }
      `}</style>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: "32px 52px",
          borderRadius: "20px",
          border: "1px solid rgba(0, 0, 0, 0.04)",
          boxShadow: "6px 6px 16px rgba(0, 0, 0, 0.09), -4px -4px 12px rgba(255, 255, 255, 0.9)",
          minWidth: "300px",
          minHeight: "150px",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
      >
        <div
          key={currentIndex}
          className={isAnimating ? "stat-item-exit" : "stat-item-enter"}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              fontSize: "42px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "8px",
              lineHeight: "1.2"
            }}
          >
            {stats[currentIndex].value}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: "600"
            }}
          >
            {stats[currentIndex].label}
          </div>
        </div>
      </div>
    </>
  );
}
