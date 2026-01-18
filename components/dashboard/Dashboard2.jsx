"use client";
import React from "react";

export default function Dashboard2() {
    const stats = [
        {
            icon: "icon-book",
            number: "12",
            label: "Enrolled Courses",
            color: "#8b5cf6",
        },
        {
            icon: "icon-clock",
            number: "48h",
            label: "Learning Hours",
            color: "#6d28d9",
        },
        {
            icon: "icon-award",
            number: "8",
            label: "Certificates",
            color: "#7c3aed",
        },
        {
            icon: "icon-users",
            number: "156",
            label: "Study Group",
            color: "#8b5cf6",
        },
    ];

    return (
        <div className="col-xl-9 col-lg-12">
            <div className="dashboard-content">
                {/* Welcome Section */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        padding: "32px",
                        marginBottom: "24px",
                        border: "1px solid rgba(139, 92, 246, 0.08)",
                        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.06)",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#1f2937",
                            marginBottom: "8px",
                        }}
                    >
                        Welcome Back! 👋
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "15px", margin: 0 }}>
                        Continue your learning journey with DAGARMY
                    </p>
                </div>

                {/* Stats Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        marginBottom: "24px",
                    }}
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            style={{
                                background: "#ffffff",
                                borderRadius: "12px",
                                padding: "24px",
                                border: "1px solid rgba(139, 92, 246, 0.08)",
                                boxShadow: "0 2px 20px rgba(0, 0, 0, 0.06)",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.boxShadow =
                                    "0 8px 30px rgba(139, 92, 246, 0.15)";
                                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 2px 20px rgba(0, 0, 0, 0.06)";
                                e.currentTarget.style.borderColor =
                                    "rgba(139, 92, 246, 0.08)";
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "12px",
                                        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <i
                                        className={stat.icon}
                                        style={{ fontSize: "28px", color: stat.color }}
                                    />
                                </div>
                                <div>
                                    <h4
                                        style={{
                                            fontSize: "32px",
                                            fontWeight: "700",
                                            color: "#1f2937",
                                            margin: 0,
                                            marginBottom: "4px",
                                        }}
                                    >
                                        {stat.number}
                                    </h4>
                                    <p
                                        style={{
                                            color: "#6b7280",
                                            fontSize: "14px",
                                            margin: 0,
                                        }}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        padding: "32px",
                        border: "1px solid rgba(139, 92, 246, 0.08)",
                        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.06)",
                    }}
                >
                    <h4
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#1f2937",
                            marginBottom: "20px",
                        }}
                    >
                        Recent Activity
                    </h4>
                    <div style={{ color: "#6b7280", fontSize: "15px" }}>
                        <p>Your recent learning activities will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
