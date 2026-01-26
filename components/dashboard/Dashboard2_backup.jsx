"use client";
import React, { useState } from "react";

export default function Dashboard2() {
    const [activeTab, setActiveTab] = useState('Theory');

    return (
        <div className="col-xl-9 col-lg-12">
            <div className="dashboard-content" style={{ padding: "24px", background: "#fafbfc" }}>
                
                {/* Main Grid: 3 columns like Omoskillo */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.3fr", gap: "24px" }}>
                    
                    {/* LEFT COLUMN */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        
                        {/* Course Validation */}
                        <div>
                            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1f36", margin: 0 }}>Course Validation</h2>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer", padding: "4px" }}>🔗</button>
                                    <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer", padding: "4px" }}>⚙️</button>
                                </div>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                                {[
                                    { icon: "📊", label: "Presentation", value: "6", total: "20" },
                                    { icon: "📝", label: "Examination", value: "15", total: "20" },
                                    { icon: "📋", label: "Reports", value: "10", total: "15" }
                                ].map((item, idx) => (
                                    <div key={idx} style={{
                                        background: "#ffffff",
                                        borderRadius: "16px",
                                        padding: "24px 20px",
                                        textAlign: "center",
                                        border: "1px solid #e8eaed",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                    }}>
                                        <div style={{ fontSize: "36px", marginBottom: "12px" }}>{item.icon}</div>
                                        <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px", fontWeight: "500" }}>{item.label}</div>
                                        <div style={{ fontSize: "22px", fontWeight: "700", color: "#1a1f36" }}>
                                            {item.value}<span style={{ fontSize: "16px", color: "#9ca3af", fontWeight: "600" }}>/{item.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activities */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "24px",
                            border: "1px solid #e8eaed",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1f36", margin: 0 }}>Activities</h2>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "8px", padding: "4px" }}>
                                        <button
                                            onClick={() => setActiveTab('Theory')}
                                            style={{
                                                padding: "6px 14px",
                                                border: "none",
                                                borderRadius: "6px",
                                                background: activeTab === 'Theory' ? "#6366f1" : "transparent",
                                                color: activeTab === 'Theory' ? "#ffffff" : "#6b7280",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Theory
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('Practice')}
                                            style={{
                                                padding: "6px 14px",
                                                border: "none",
                                                borderRadius: "6px",
                                                background: activeTab === 'Practice' ? "#6366f1" : "transparent",
                                                color: activeTab === 'Practice' ? "#ffffff" : "#6b7280",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Practice
                                        </button>
                                    </div>
                                    <button style={{ background: "none", border: "none", color: "#6b7280", fontSize: "13px", cursor: "pointer", padding: "6px 12px" }}>📅 December</button>
                                </div>
                            </div>
                            
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "200px" }}>
                                {[
                                    { day: "10 Dec", value: 45 },
                                    { day: "13 Dec", value: 65 },
                                    { day: "15 Dec", value: 35 },
                                    { day: "18 Dec", value: 85 },
                                    { day: "21 Dec", value: 55 },
                                    { day: "23 Dec", value: 40 },
                                    { day: "27 Dec", value: 30 }
                                ].map((activity, index) => (
                                    <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                        <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                                            <div style={{
                                                width: "100%",
                                                height: `${activity.value}%`,
                                                background: index === 3 ? "#6366f1" : "#e5e7eb",
                                                borderRadius: "6px 6px 0 0",
                                                position: "relative",
                                            }}>
                                                {index === 3 && (
                                                    <div style={{
                                                        position: "absolute",
                                                        top: "-32px",
                                                        left: "50%",
                                                        transform: "translateX(-50%)",
                                                        background: "#1f2937",
                                                        color: "#fff",
                                                        padding: "6px 10px",
                                                        borderRadius: "6px",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        whiteSpace: "nowrap",
                                                    }}>
                                                        {activity.value}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500" }}>{activity.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weakest and Strongest Topics */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {/* Weakest */}
                            <div style={{
                                background: "#ffffff",
                                borderRadius: "16px",
                                padding: "20px",
                                border: "1px solid #e8eaed",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            }}>
                                <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1f36", margin: 0 }}>Weakest topics</h3>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer", padding: "2px", fontSize: "12px" }}>🔗</button>
                                        <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer", padding: "2px", fontSize: "12px" }}>⚙️</button>
                                    </div>
                                </div>
                                {[
                                    { rank: "01", topic: "Food safety", percentage: "75%" },
                                    { rank: "02", topic: "Compliance basics", percentage: "52%" },
                                    { rank: "03", topic: "Company networking", percentage: "38%" }
                                ].map((topic, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px 0",
                                        borderBottom: idx < 2 ? "1px solid #f3f4f6" : "none",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: "600" }}>{topic.rank}</span>
                                            <span style={{ fontSize: "14px", color: "#1a1f36", fontWeight: "500" }}>{topic.topic}</span>
                                        </div>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#6366f1" }}>{topic.percentage}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Strongest */}
                            <div style={{
                                background: "#ffffff",
                                borderRadius: "16px",
                                padding: "20px",
                                border: "1px solid #e8eaed",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            }}>
                                <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1f36", margin: 0 }}>Strongest topics</h3>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer", padding: "2px", fontSize: "12px" }}>🔗</button>
                                        <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer", padding: "2px", fontSize: "12px" }}>⚙️</button>
                                    </div>
                                </div>
                                {[
                                    { rank: "01", topic: "Cyber security basics", percentage: "92%" },
                                    { rank: "02", topic: "Covid protocols", percentage: "95%" },
                                    { rank: "03", topic: "Social media policies", percentage: "89%" }
                                ].map((topic, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px 0",
                                        borderBottom: idx < 2 ? "1px solid #f3f4f6" : "none",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: "600" }}>{topic.rank}</span>
                                            <span style={{ fontSize: "14px", color: "#1a1f36", fontWeight: "500" }}>{topic.topic}</span>
                                        </div>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#10b981" }}>{topic.percentage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE COLUMN */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {/* Course Statistics */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "24px",
                            border: "1px solid #e8eaed",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1f36", margin: 0 }}>Course Statistics</h2>
                                <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer" }}>⋯</button>
                            </div>
                            
                            {[
                                { label: "Done", value: 24, color: "#6366f1", width: "60%" },
                                { label: "On Progress", value: 12, color: "#6366f1", width: "30%" },
                                { label: "To Do", value: 8, color: "#6366f1", width: "20%" }
                            ].map((stat, idx) => (
                                <div key={idx} style={{ marginBottom: idx < 2 ? "20px" : "0" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>{stat.label}</span>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1f36" }}>{stat.value}</span>
                                    </div>
                                    <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "10px", overflow: "hidden" }}>
                                        <div style={{ width: stat.width, height: "100%", background: stat.color, borderRadius: "10px" }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "24px",
                            border: "1px solid #e8eaed",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1f36", margin: 0 }}>Summary</h2>
                                <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer" }}>⋯</button>
                            </div>
                            
                            {[
                                { icon: "📊", label: "Total time", value: "24" },
                                { icon: "⏱️", label: "Deadline", value: "180" },
                                { icon: "💎", label: "Total time", value: "180" }
                            ].map((item, idx) => (
                                <div key={idx} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "14px",
                                    background: "#f9fafb",
                                    borderRadius: "10px",
                                    marginBottom: idx < 2 ? "12px" : "0",
                                    cursor: "pointer",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <span style={{ fontSize: "20px" }}>{item.icon}</span>
                                        <span style={{ fontSize: "14px", color: "#1a1f36", fontWeight: "500" }}>{item.label}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1f36" }}>{item.value}</span>
                                        <span style={{ fontSize: "16px", color: "#9ca3af" }}>›</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {/* My Courses */}
                        <div style={{
                            background: "linear-gradient(135deg, #6366f1 0%, #1f2937 100%)",
                            borderRadius: "20px",
                            padding: "28px",
                            color: "#ffffff",
                            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
                        }}>
                            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>My courses</h2>
                                <button style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer" }}>⋯</button>
                            </div>
                            
                            <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "10px", lineHeight: "1.4" }}>Conduct UX Research and Test Early Concepts</h3>
                            <p style={{ fontSize: "13px", opacity: 0.9, marginBottom: "20px", lineHeight: "1.6" }}>Synthesis observations from usability studio and accompanies with insights.</p>
                            
                            <div style={{ display: "flex", gap: "10px" }}>
                                {[
                                    { value: "20%", label: "Done" },
                                    { value: "60%", label: "Progress" },
                                    { value: "75%", label: "Final" }
                                ].map((stat, idx) => (
                                    <div key={idx} style={{
                                        flex: 1,
                                        textAlign: "center",
                                        padding: "14px 10px",
                                        background: "rgba(255,255,255,0.2)",
                                        borderRadius: "12px",
                                    }}>
                                        <div style={{ fontSize: "20px", fontWeight: "800", marginBottom: "4px" }}>{stat.value}</div>
                                        <div style={{ fontSize: "11px", opacity: 0.9, fontWeight: "600" }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Schedule */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "24px",
                            border: "1px solid #e8eaed",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a1f36", margin: 0 }}>Course schedule</h2>
                                <button style={{ background: "none", border: "none", color: "#8b92a7", cursor: "pointer" }}>⚙️</button>
                            </div>
                            
                            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                                {[
                                    { day: "12", month: "Dec" },
                                    { day: "14", month: "Dec" },
                                    { day: "16", month: "Dec", active: true },
                                    { day: "18", month: "Dec" }
                                ].map((date, idx) => (
                                    <div key={idx} style={{
                                        flex: 1,
                                        textAlign: "center",
                                        padding: "12px 8px",
                                        background: date.active ? "#6366f1" : "#f9fafb",
                                        color: date.active ? "#ffffff" : "#6b7280",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                    }}>
                                        <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "2px" }}>{date.day}</div>
                                        <div style={{ fontSize: "11px", fontWeight: "600", opacity: date.active ? 0.9 : 0.7 }}>{date.month}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                    { icon: "▶️", title: "Introduction" },
                                    { icon: "▶️", title: "Starting Your Next Project" }
                                ].map((lesson, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "12px",
                                        background: "#f9fafb",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                    }}>
                                        <span style={{ fontSize: "14px" }}>{lesson.icon}</span>
                                        <span style={{ fontSize: "14px", color: "#1a1f36", fontWeight: "500" }}>{lesson.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
