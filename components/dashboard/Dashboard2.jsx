"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard2() {
    const { userProfile, address } = useAuth();
    const [userName, setUserName] = useState('Student');
    const [userAvatar, setUserAvatar] = useState(null);
    const [userData, setUserData] = useState(null);
    const [referralCode, setReferralCode] = useState('LOADING...');
    const [referralStats, setReferralStats] = useState({
        total_referrals: 0,
        total_points_earned: 0
    });
    const [copySuccess, setCopySuccess] = useState(false);
    const [dagPoints, setDagPoints] = useState(0);
    const [userTier, setUserTier] = useState('DAG_SOLDIER');
    
    useEffect(() => {
        async function fetchUserData() {
            if (!address) return;
            
            try {
                // Normalize wallet address to lowercase for consistent lookup
                const normalizedAddress = address.toLowerCase();
                const response = await fetch(`/api/auth/user?wallet=${normalizedAddress}`);
                const data = await response.json();
                
                if (data.user) {
                    setUserData(data.user);
                    const firstName = data.user.first_name || '';
                    const lastName = data.user.last_name || '';
                    const fullName = `${firstName} ${lastName}`.trim() || 'Student';
                    setUserName(fullName);
                    
                    if (data.user.avatar_url) {
                        setUserAvatar(data.user.avatar_url);
                    }
                    
                    // Set DAG Points and tier from user data
                    if (data.user.dag_points !== undefined) {
                        setDagPoints(data.user.dag_points);
                    }
                    if (data.user.tier) {
                        setUserTier(data.user.tier);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        
        fetchUserData();
    }, [address]);

    // Fetch referral code and stats
    useEffect(() => {
        async function fetchReferralData() {
            try {
                // Get user ID from userData
                if (!userData?.id) {
                    console.log('No user data yet, skipping referral fetch');
                    return;
                }

                console.log('Fetching referral data for user:', userData.id);

                // Fetch referral code
                const codeResponse = await fetch(`/api/referral/get-code?userId=${userData.id}`);
                const codeData = await codeResponse.json();
                if (codeData.success && codeData.code) {
                    setReferralCode(codeData.code);
                    console.log('✅ Referral code fetched:', codeData.code);
                } else {
                    console.error('Failed to fetch referral code:', codeData);
                    setReferralCode('ERROR');
                }

                // Fetch referral stats
                const statsResponse = await fetch(`/api/referral/stats?userId=${userData.id}`);
                const statsData = await statsResponse.json();
                if (statsData.success && statsData.stats) {
                    setReferralStats(statsData.stats);
                }
            } catch (error) {
                console.error('Error fetching referral data:', error);
                setReferralCode('ERROR');
            }
        }

        fetchReferralData();
    }, [userData]);

    // Handle copy referral code
    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(referralCode);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Error copying code:', error);
        }
    };
    
    return (
        <>
                
                {/* Greeting Section */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1a1f36", marginBottom: "8px" }}>
                        Hello, <span style={{ color: "#6366f1" }}>{userName}</span>
                        <span style={{ marginLeft: "8px" }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
                                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="#fbbf24"/>
                            </svg>
                        </span>
                    </h1>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>
                        Nice to have you back, what an exciting day! Get ready and continue your lesson today.
                    </p>
                </div>

                {/* Main Grid Layout - 3 Columns */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "start" }}>
                    
                    {/* COLUMN 1 - Profile & DAG Points */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        
                        {/* Profile Card - Compact */}
                        <div style={{
                            background: "#e8eaf0",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "8px 8px 16px #c5c7d0, -8px -8px 16px #ffffff",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ 
                                    width: "48px", 
                                    height: "48px", 
                                    borderRadius: "50%", 
                                    background: "#e8eaf0",
                                    boxShadow: "inset 4px 4px 8px #c5c7d0, inset -4px -4px 8px #ffffff",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                }}>
                                    {userAvatar ? (
                                        <img 
                                            src={userAvatar} 
                                            alt="Profile" 
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                        />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1a1f36", margin: 0 }}>Your Profile</h3>
                                    <p style={{ fontSize: "13px", color: userTier === 'DAG_LIEUTENANT' ? "#1f2937" : "#1f2937", margin: 0, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        {userTier === 'DAG_LIEUTENANT' ? 'DAG LIEUTENANT' : 'DAG SOLDIER'}
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                                <div style={{ background: "#e8eaf0", boxShadow: "inset 3px 3px 6px #c5c7d0, inset -3px -3px 6px #ffffff", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#6366f1" }}>AI & ML</div>
                                    <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: "600" }}>Active Course</div>
                                </div>
                                <div style={{ background: "#e8eaf0", boxShadow: "inset 3px 3px 6px #c5c7d0, inset -3px -3px 6px #ffffff", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#10b981" }}>12</div>
                                    <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: "600" }}>Modules</div>
                                </div>
                            </div>
                            
                            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>Study Hours</span>
                                    <span style={{ fontSize: "14px", fontWeight: "800", color: "#6366f1" }}>142h</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>Assignments</span>
                                    <span style={{ fontSize: "14px", fontWeight: "800", color: "#10b981" }}>12</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>Avg Progress</span>
                                    <span style={{ fontSize: "14px", fontWeight: "800", color: "#f59e0b" }}>68%</span>
                                </div>
                            </div>
                        </div>


                        {/* Learning Activity - Below DAG Points */}
                        <div>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1f36", marginBottom: "16px" }}>Learning Activity</h3>
                            
                            {/* Learning Progress Path */}
                            <div style={{
                                background: "#ffffff",
                                borderRadius: "12px",
                                padding: "20px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                marginBottom: "16px",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1f36" }}>Learning Progress Path</div>
                                    <select style={{ padding: "4px 8px", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "12px", background: "#ffffff", fontWeight: "600", color: "#6b7280" }}>
                                        <option>Absolute</option>
                                        <option>Relative</option>
                                    </select>
                                </div>
                                <div style={{ display: "flex", gap: "16px", marginBottom: "12px", fontSize: "12px", fontWeight: "600" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ width: "12px", height: "3px", background: "#6366f1" }}></span>
                                        AI Course
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ width: "12px", height: "3px", background: "#f59e0b" }}></span>
                                        Blockchain
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <span style={{ width: "12px", height: "3px", background: "#ef4444" }}></span>
                                        Data Viz
                                    </span>
                                </div>
                                <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ overflow: "hidden" }}>
                                    <defs>
                                        <linearGradient id="areaGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: "#6366f1", stopOpacity: 0.3 }} />
                                            <stop offset="100%" style={{ stopColor: "#6366f1", stopOpacity: 0 }} />
                                        </linearGradient>
                                        <linearGradient id="areaGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: "#f59e0b", stopOpacity: 0.3 }} />
                                            <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 0 }} />
                                        </linearGradient>
                                        <linearGradient id="areaGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 0.3 }} />
                                            <stop offset="100%" style={{ stopColor: "#ef4444", stopOpacity: 0 }} />
                                        </linearGradient>
                                    </defs>
                                    {[0, 50, 100, 150, 200].map((y, i) => (
                                        <line key={i} x1="0" y1={y} x2="500" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                                    ))}
                                    <path d="M 0,180 Q 62.5,160 125,140 T 250,100 T 375,80 L 500,60 L 500,200 L 0,200 Z" fill="url(#areaGradient1)" />
                                    <path d="M 0,180 Q 62.5,160 125,140 T 250,100 T 375,80 L 500,60" fill="none" stroke="#6366f1" strokeWidth="2" />
                                    <path d="M 0,190 Q 62.5,180 125,170 T 250,150 T 375,130 L 500,110 L 500,200 L 0,200 Z" fill="url(#areaGradient2)" />
                                    <path d="M 0,190 Q 62.5,180 125,170 T 250,150 T 375,130 L 500,110" fill="none" stroke="#f59e0b" strokeWidth="2" />
                                    <path d="M 0,195 Q 62.5,190 125,185 T 250,175 T 375,165 L 500,155 L 500,200 L 0,200 Z" fill="url(#areaGradient3)" />
                                    <path d="M 0,195 Q 62.5,190 125,185 T 250,175 T 375,165 L 500,155" fill="none" stroke="#ef4444" strokeWidth="2" />
                                </svg>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af", marginTop: "8px" }}>
                                    {["Jul", "Oct", "2024", "Apr", "Jul", "Oct", "2025", "Apr"].map((label, i) => (
                                        <span key={i}>{label}</span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Daily Study Sessions & Course Distribution */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <div style={{
                                    background: "#ffffff",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                }}>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1f36", marginBottom: "16px" }}>Daily Study Sessions</div>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px" }}>
                                        {[65, 45, 55, 75, 60, 40, 30].map((height, i) => (
                                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end" }}>
                                                    <div style={{
                                                        width: "100%",
                                                        height: `${height}%`,
                                                        background: "#6366f1",
                                                        borderRadius: "4px 4px 0 0",
                                                    }}></div>
                                                </div>
                                                <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>
                                                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div style={{
                                    background: "#ffffff",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                }}>
                                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1f36", marginBottom: "16px" }}>Course Distribution</div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "120px" }}>
                                        <svg width="120" height="120" viewBox="0 0 200 200">
                                            <circle cx="100" cy="100" r="70" fill="none" stroke="#6366f1" strokeWidth="40" strokeDasharray="308 440" transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" strokeWidth="40" strokeDasharray="88 440" strokeDashoffset="-308" transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="70" fill="none" stroke="#ef4444" strokeWidth="40" strokeDasharray="44 440" strokeDashoffset="-396" transform="rotate(-90 100 100)" />
                                        </svg>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "12px", fontSize: "11px" }}>
                                        {[
                                            { label: "AI", color: "#6366f1", value: "70%" },
                                            { label: "Blockchain", color: "#f59e0b", value: "20%" },
                                            { label: "Data Viz", color: "#ef4444", value: "10%" }
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }}></span>
                                                <span style={{ color: "#6b7280", fontWeight: "600" }}>{item.label}</span>
                                                <span style={{ fontWeight: "700", color: "#1a1f36" }}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2 - Courses & Your Class */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        
                        {/* Referral System Card */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "24px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "#1a1f36" }}>Referral Program</h3>
                            </div>
                            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px", lineHeight: "1.6" }}>
                                Invite friends and earn rewards! Share your unique referral code.
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px", marginBottom: "16px" }}>
                                <div style={{ background: "#f3f4f6", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px", color: "#6366f1" }}>{referralStats.total_referrals || 0}</div>
                                    <div style={{ color: "#6b7280" }}>Referrals</div>
                                </div>
                                <div style={{ background: "#f3f4f6", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px", color: "#1f2937" }}>{dagPoints.toLocaleString()}</div>
                                    <div style={{ color: "#6b7280" }}>DAG Points</div>
                                </div>
                            </div>
                            <div style={{
                                background: "linear-gradient(135deg, #6366f1 0%, #1f2937 100%)",
                                borderRadius: "12px",
                                padding: "16px",
                            }}>
                                <div style={{ fontSize: "11px", color: "#ffffff", opacity: 0.9, marginBottom: "8px", fontWeight: "600" }}>YOUR REFERRAL CODE</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "2px", fontFamily: "monospace", color: "#ffffff" }}>
                                        {referralCode}
                                    </span>
                                    <button 
                                        onClick={handleCopyCode}
                                        style={{
                                            background: copySuccess ? "rgba(34, 197, 94, 0.9)" : "rgba(255, 255, 255, 0.2)",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "8px 16px",
                                            color: "#ffffff",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!copySuccess) e.target.style.background = "rgba(255, 255, 255, 0.3)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!copySuccess) e.target.style.background = "rgba(255, 255, 255, 0.2)";
                                        }}
                                    >
                                        {copySuccess ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Today's Course */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {[
                                    { 
                                        iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                                        title: "AI & Machine Learning Fundamentals", 
                                        lessons: "24 lessons", 
                                        duration: "60 min", 
                                        assignments: "6 assignments", 
                                        students: "1,247 students", 
                                        progress: 68, 
                                        color: "#6366f1" 
                                    },
                                    { 
                                        iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                                        title: "Blockchain Development Basics", 
                                        lessons: "18 lessons", 
                                        duration: "55 min", 
                                        assignments: "4 assignments", 
                                        students: "892 students", 
                                        progress: 45, 
                                        color: "#1f2937" 
                                    }
                                ].map((course, idx) => (
                                    <div key={idx} style={{
                                        background: "#ffffff",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        border: "1px solid #e5e7eb",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ position: "relative", width: "48px", height: "48px", flexShrink: 0 }}>
                                                <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
                                                    <circle cx="24" cy="24" r="20" fill="none" stroke="#f3f4f6" strokeWidth="4"/>
                                                    <circle 
                                                        cx="24" 
                                                        cy="24" 
                                                        r="20" 
                                                        fill="none" 
                                                        stroke={course.color} 
                                                        strokeWidth="4"
                                                        strokeDasharray={`${2 * Math.PI * 20}`}
                                                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - course.progress / 100)}`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div style={{ 
                                                    position: "absolute", 
                                                    top: "50%", 
                                                    left: "50%", 
                                                    transform: "translate(-50%, -50%)",
                                                    fontSize: "14px",
                                                    fontWeight: "700",
                                                    color: course.color
                                                }}>
                                                    {course.progress}%
                                                </div>
                                            </div>
                                            
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1a1f36", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</h3>
                                                <div style={{ fontSize: "11px", color: "#6b7280" }}>{course.lessons} • {course.duration}</div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                            <button style={{ padding: "6px 12px", background: "#f3f4f6", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#6b7280", cursor: "pointer" }}>Skip</button>
                                            <button style={{ padding: "6px 12px", background: "#10b981", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#ffffff", cursor: "pointer" }}>Continue</button>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Your Class */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1f36", margin: 0 }}>Your class</h2>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    {["All", "Design", "Science", "Coding"].map((tab, idx) => (
                                        <button key={idx} style={{
                                            padding: "6px 16px",
                                            background: idx === 0 ? "#1a1f36" : "transparent",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            color: idx === 0 ? "#ffffff" : "#6b7280",
                                            cursor: "pointer",
                                        }}>{tab}</button>
                                    ))}
                                    <button style={{ padding: "6px 12px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer" }}>🔄</button>
                                    <button style={{ padding: "6px 12px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer" }}>⚙️</button>
                                </div>
                            </div>
                            
                            <div style={{
                                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                borderRadius: "16px",
                                padding: "20px",
                                border: "1px solid #bae6fd",
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                            }}>
                                <div style={{ fontSize: "48px" }}>📊</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1f36", marginBottom: "8px" }}>Data Visualization Mastery</h3>
                                    <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#6b7280" }}>
                                        <span>📚 16 lessons</span>
                                        <span>⏱️ 50 min</span>
                                        <span>📝 5 assignments</span>
                                        <span>👥 1,089 students</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Study Time Heatmap - Below Your class */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "12px",
                            padding: "20px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1f36", marginBottom: "16px" }}>Study Time Heatmap</div>
                            <div style={{ display: "grid", gridTemplateColumns: "auto repeat(7, 1fr)", gap: "6px", fontSize: "11px" }}>
                                <div></div>
                                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                                    <div key={i} style={{ textAlign: "center", color: "#6b7280", fontWeight: "600" }}>{day}</div>
                                ))}
                                {["6am", "10am", "2pm", "6pm"].map((time, rowIdx) => (
                                    <React.Fragment key={rowIdx}>
                                        <div style={{ color: "#6b7280", fontWeight: "600", paddingRight: "8px" }}>{time}</div>
                                        {[0.2, 0.3, 0.5, 0.4, 0.6, 0.3, 0.2, 0.4, 0.6, 0.7, 0.5, 0.8, 0.4, 0.3, 0.3, 0.5, 0.6, 0.8, 0.7, 0.5, 0.4, 0.5, 0.7, 0.9, 0.8, 0.6, 0.4, 0.3].slice(rowIdx * 7, (rowIdx + 1) * 7).map((intensity, colIdx) => (
                                            <div key={colIdx} style={{
                                                aspectRatio: "1",
                                                borderRadius: "4px",
                                                background: `rgba(99, 102, 241, ${intensity})`,
                                            }}></div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 3 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        
                        {/* Schedule Calendar with Events */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "20px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1f36", margin: 0 }}>Schedule Calendar</h3>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>January 2025</span>
                                    <button style={{ padding: "4px 8px", background: "#6366f1", border: "none", borderRadius: "6px", color: "#ffffff", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>+ New Event</button>
                                </div>
                            </div>
                            
                            {/* Calendar Header */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "8px", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                                    <div key={idx} style={{ 
                                        textAlign: "center", 
                                        fontSize: "11px", 
                                        fontWeight: "700", 
                                        color: "#6b7280",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px"
                                    }}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Calendar Grid with Events */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                                {[
                                    { day: 29, inactive: true }, { day: 30, inactive: true }, { day: 31, inactive: true },
                                    { day: 1, events: [] }, { day: 2, events: [] }, { day: 3, events: [] }, { day: 4, events: [] },
                                    { day: 5, events: [] }, { day: 6, events: [] }, { day: 7, events: [] }, 
                                    { day: 8, events: [] }, { day: 9, events: [] }, { day: 10, events: [] }, { day: 11, events: [] },
                                    { day: 12, events: [] }, { day: 13, events: [] }, { day: 14, events: [] }, 
                                    { day: 15, events: [{ title: "AI Workshop", color: "#6366f1", type: "admin" }] }, 
                                    { day: 16, today: true, events: [{ title: "Study Session", color: "#1f2937", type: "user" }] }, 
                                    { day: 17, events: [] }, { day: 18, events: [{ title: "Blockchain Quiz", color: "#10b981", type: "admin" }] },
                                    { day: 19, events: [] }, { day: 20, events: [] }, 
                                    { day: 21, events: [{ title: "Data Viz Project", color: "#f59e0b", type: "admin" }] }, 
                                    { day: 22, events: [] }, { day: 23, events: [] }, { day: 24, events: [] },
                                    { day: 25, events: [{ title: "Team Meeting", color: "#ec4899", type: "user" }] }, 
                                    { day: 26, events: [] }, { day: 27, events: [] }, 
                                    { day: 28, events: [] }, { day: 29, events: [] }, { day: 30, events: [] }, { day: 31, events: [] }
                                ].map((date, idx) => (
                                    <div key={idx} style={{
                                        minHeight: "70px",
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: "4px",
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        background: date.today ? "#ede9fe" : date.inactive ? "#fafafa" : "#ffffff",
                                        border: date.today ? "2px solid #6366f1" : "1px solid #f3f4f6",
                                        color: date.inactive ? "#d1d5db" : "#1a1f36",
                                        transition: "all 0.2s ease",
                                    }}>
                                        <div style={{ marginBottom: "4px", fontSize: "12px", fontWeight: date.today ? "700" : "600" }}>
                                            {date.day}
                                        </div>
                                        {date.events && date.events.map((event, eventIdx) => (
                                            <div key={eventIdx} style={{
                                                background: event.color,
                                                color: "#ffffff",
                                                padding: "3px 4px",
                                                borderRadius: "3px",
                                                fontSize: "9px",
                                                fontWeight: "600",
                                                marginBottom: "2px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                            }}>
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Legend */}
                            <div style={{ display: "flex", gap: "16px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb", fontSize: "11px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#6366f1" }}></div>
                                    <span style={{ color: "#6b7280", fontWeight: "600" }}>Admin Events</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#1f2937" }}></div>
                                    <span style={{ color: "#6b7280", fontWeight: "600" }}>User Events</span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Events - Separate Card */}
                        <div style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "20px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1f36", marginBottom: "16px" }}>Upcoming</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                    { title: "AI Workshop", date: "Jan 15", color: "#6366f1" },
                                    { title: "Blockchain Quiz", date: "Jan 18", color: "#10b981" },
                                    { title: "Data Viz Project", date: "Jan 21", color: "#f59e0b" }
                                ].map((event, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "10px",
                                        background: "#f9fafb",
                                        borderRadius: "8px",
                                        borderLeft: `3px solid ${event.color}`,
                                    }}>
                                        <div style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            background: event.color,
                                            flexShrink: 0,
                                        }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a1f36" }}>{event.title}</div>
                                            <div style={{ fontSize: "11px", color: "#6b7280" }}>{event.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Cards - Get Help & Set Goals */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div style={{
                                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                borderRadius: "16px",
                                padding: "24px",
                                color: "#ffffff",
                                cursor: "pointer",
                                boxShadow: "0 4px 16px rgba(245, 158, 11, 0.2)",
                                transition: "transform 0.2s ease",
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ marginBottom: "12px" }}>
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>Get Help</h3>
                                <p style={{ fontSize: "12px", opacity: 0.95, lineHeight: "1.5" }}>Connect with mentors and community</p>
                            </div>
                            
                            <div style={{
                                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                                borderRadius: "16px",
                                padding: "24px",
                                color: "#ffffff",
                                cursor: "pointer",
                                boxShadow: "0 4px 16px rgba(236, 72, 153, 0.2)",
                                transition: "transform 0.2s ease",
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ marginBottom: "12px" }}>
                                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>Set Goals</h3>
                                <p style={{ fontSize: "12px", opacity: 0.95, lineHeight: "1.5" }}>Track progress and achieve milestones</p>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
