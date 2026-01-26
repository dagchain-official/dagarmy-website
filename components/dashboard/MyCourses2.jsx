"use client";
import { useState } from "react";
import { nextGenProgram } from "@/data/next-gen-program";

export default function MyCourses() {
  const [expandedModules, setExpandedModules] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getTrackColor = (track) => {
    switch(track) {
      case "Yellow": return "#fbbf24";
      case "Green": return "#10b981";
      case "Blue": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Program Header */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        marginBottom: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "12px"
        }}>
          {nextGenProgram.title}
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#64748b",
          marginBottom: "24px"
        }}>
          {nextGenProgram.subtitle}
        </p>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px"
        }}>
          <div style={{
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Total Duration</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{nextGenProgram.totalDuration}</div>
          </div>
          <div style={{
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Modules</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{nextGenProgram.totalModules}</div>
          </div>
          <div style={{
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Level</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>{nextGenProgram.level}</div>
          </div>
          <div style={{
            padding: "16px",
            background: "#f8fafc",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Certificate</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#10b981" }}>✓ NFT</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search modules or lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
      </div>

      {/* Modules List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {nextGenProgram.modules.map((module) => (
          <div
            key={module.id}
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb"
            }}
          >
            {/* Module Header */}
            <div
              onClick={() => toggleModule(module.id)}
              style={{
                padding: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: expandedModules[module.id] ? "#f8fafc" : "white",
                transition: "all 0.2s"
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                background: getTrackColor(module.track),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "700",
                color: "white",
                flexShrink: 0
              }}>
                {module.number}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "4px"
                }}>
                  {module.title}
                </div>
                <div style={{
                  fontSize: "14px",
                  color: "#64748b",
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap"
                }}>
                  <span>📚 {module.lessons.length} Lessons</span>
                  <span>⏱️ {module.duration}</span>
                  <span style={{
                    padding: "2px 8px",
                    background: getTrackColor(module.track) + "20",
                    color: getTrackColor(module.track),
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {module.track} Track
                  </span>
                </div>
              </div>
              
              <div style={{
                fontSize: "24px",
                color: "#64748b",
                transform: expandedModules[module.id] ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s"
              }}>
                ▼
              </div>
            </div>

            {/* Lessons List */}
            {expandedModules[module.id] && (
              <div style={{
                padding: "0 24px 24px 24px",
                background: "#f8fafc"
              }}>
                {module.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    style={{
                      padding: "16px",
                      background: "white",
                      borderRadius: "8px",
                      marginTop: idx === 0 ? "0" : "12px",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      gap: "16px",
                      alignItems: "start"
                    }}
                  >
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#64748b",
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#0f172a",
                        marginBottom: "4px"
                      }}>
                        {lesson.title}
                      </div>
                      <div style={{
                        fontSize: "14px",
                        color: "#64748b",
                        marginBottom: "8px"
                      }}>
                        {lesson.description}
                      </div>
                      <div style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "13px",
                        color: "#64748b"
                      }}>
                        <span style={{
                          padding: "4px 8px",
                          background: "#f1f5f9",
                          borderRadius: "4px",
                          textTransform: "capitalize"
                        }}>
                          {lesson.type}
                        </span>
                        <span>⏱️ {lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
