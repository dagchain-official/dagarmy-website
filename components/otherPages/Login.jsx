"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/AuthContext";
import ProfileCompletion from "./ProfileCompletion";
import "./SocialLogin.css";
import "./LoginOverride.css";

export default function Login() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { login, isAuthenticated, userRole, userProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [socialEmail, setSocialEmail] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [storedWalletAddress, setStoredWalletAddress] = useState(null);

  useEffect(() => {
    const hasLoggedOut = sessionStorage.getItem('dagarmy_logged_out') === 'true';
    if (isConnected && address && !isAuthenticated && !hasLoggedOut) {
      setShowRoleSelection(true);
    } else if (hasLoggedOut) {
      setShowRoleSelection(false);
    }
  }, [isConnected, address, isAuthenticated]);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    // BUT NOT if profile completion form is showing
    if (isAuthenticated && userRole && !showProfileCompletion) {
      if (userRole === 'student') {
        router.push('/student-dashboard');
      } else if (userRole === 'trainer') {
        // TODO: Create instructor-dashboard route
        router.push('/student-dashboard'); // Temporary redirect
      }
    }
  }, [isAuthenticated, userRole, showProfileCompletion, router]);

  const handleRoleSelection = async () => {
    if (selectedRole && address) {
      // Store wallet address before it potentially becomes undefined
      console.log('💾 Storing wallet address:', address);
      setStoredWalletAddress(address);
      
      // First, save user to Supabase WITHOUT authenticating yet
      try {
        const response = await fetch('/api/auth/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: address,
            role: selectedRole,
          }),
        });
        
        const data = await response.json();
        console.log('📋 User data from API:', data);
        
        if (data.user) {
          setSocialEmail(data.user.email);
          setCurrentUserId(data.user.id);
          
          // Check if profile is already completed
          if (!data.user.profile_completed) {
            console.log('📝 Profile not completed, showing profile completion form');
            setShowProfileCompletion(true);
            setShowRoleSelection(false);
            // DON'T call login() yet - wait for profile completion
            return;
          } else {
            console.log('✅ Profile already completed, proceeding with login');
          }
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
      }
      
      // Profile is completed (or check failed), proceed with normal login
      await login(selectedRole);
    }
  };

  const handleProfileComplete = async (userData) => {
    console.log('✅ Profile completed, now authenticating user');
    setShowProfileCompletion(false);
    
    // Now authenticate the user
    await login(selectedRole);
    
    // The useEffect will handle redirect to dashboard after authentication
  };

  const handleConnectWallet = () => {
    sessionStorage.removeItem('dagarmy_logged_out');
    if (typeof window !== 'undefined' && window.modal) {
      window.modal.open();
    }
  };

  return (
    <div className="main-content page-login" style={{ background: "#F4F2FB !important" }}>
      <section className="section-page-login login-wrap" style={{ padding: "80px 0", backgroundColor: "#f5eeffff", overflow: "hidden", position: "relative" }}>
        <div className="tf-container">
          <div className="row" style={{ gap: "40px 0" }}>
            {/* Left Side - Hero Section */}
            <div className="col-lg-6">
              <div
                className="img-left wow fadeInLeft"
                data-wow-delay="0s"
                style={{
                  backgroundImage: "url('/images/loginpage/login.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  borderRadius: "16px",
                  height: "100%",
                  minHeight: "600px",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "40px 32px",
                  boxShadow: "0 8px 30px rgba(139, 92, 246, 0.15)",
                }}
              >
                {/* Controlled contrast overlay for text readability */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(45, 20, 80, 0.22)",
                    borderRadius: "16px",
                    zIndex: 1,
                  }}
                />

                {/* Top Content */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    className="box-sub-tag"
                    style={{
                      background: "rgba(255,255,255,0.25)",
                      padding: "10px 20px",
                      borderRadius: "50px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "24px",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    <p style={{
                      color: "#FFFFFF",
                      margin: 0,
                      fontWeight: "600",
                      fontSize: "14px",
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}>
                      Welcome Back
                    </p>
                  </div>

                  <h1
                    className="fw-7 font-cardo"
                    style={{
                      color: "#FFFFFF",
                      fontSize: "42px",
                      lineHeight: "1.2",
                      marginBottom: "16px",
                      fontWeight: "700",
                      textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                    }}
                  >
                    Join the Global Army of{" "}
                    <span style={{
                      color: "#d4a574",
                      fontWeight: "700",
                    }}>
                      Vibe Coders
                    </span>
                  </h1>

                  <p
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "16px",
                      lineHeight: "1.6",
                      marginBottom: "0",
                      fontWeight: "500",
                    }}
                  >
                    Master AI, Blockchain & Data Visualization with expert-led courses
                    and hands-on projects.
                  </p>
                </div>

                {/* Bottom Stats */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      padding: "24px",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                      <div>
                        <h3 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>
                          35K+
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: "13px" }}>
                          Active Students
                        </p>
                      </div>
                      <div>
                        <h3 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>
                          500+
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "13px" }}>
                          Expert Mentors
                        </p>
                      </div>
                      <div>
                        <h3 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>
                          2500+
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "13px" }}>
                          Courses
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <p
                      className="author"
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        marginBottom: "4px",
                        fontSize: "15px",
                      }}
                    >
                      DAGARMY
                    </p>
                    <p
                      className="sub-author"
                      style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: 0 }}
                    >
                      Empowering Tech Leaders Worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="col-lg-6">
              <div
                className="content-right"
                style={{
                  padding: "50px 40px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(139, 92, 246, 0.08)",
                }}
              >
                <h2
                  className="login-title fw-7 wow fadeInUp"
                  data-wow-delay="0s"
                  style={{ marginBottom: "40px", fontSize: "32px", color: "#1f2937" }}
                >
                  Sign In
                </h2>

                {/* Removed "Don't have an account?" link - Sign In handles both new and returning users */}

                {!isConnected ? (
                  <>
                    <div className="wow fadeInUp" data-wow-delay="0s" style={{
                      maxWidth: "520px",
                      margin: "0 auto",
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "40px",
                      boxShadow: "0 4px 20px rgba(139, 92, 246, 0.1)",
                      border: "1px solid #e5e7eb"
                    }}>
                      {/* Email Input */}
                      <div style={{ marginBottom: "24px" }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "14px 18px",
                          background: "#f9fafb",
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb"
                        }}>
                          <i className="icon-mail" style={{ color: "#6b7280", fontSize: "18px" }} />
                          <input
                            type="email"
                            placeholder="Email"
                            style={{
                              flex: 1,
                              background: "transparent",
                              border: "none",
                              outline: "none",
                              color: "#1f2937",
                              fontSize: "14px"
                            }}
                          />
                        </div>
                      </div>

                      {/* Continue with Google */}
                      <button
                        onClick={handleConnectWallet}
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                          color: "#1f2937",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                          marginBottom: "18px",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb";
                          e.currentTarget.style.borderColor = "#1f2937";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                      >
                        <img src="/images/loginpage/google-g-2015.svg" alt="Google" style={{ width: "18px", height: "18px" }} />
                        Continue with google
                      </button>

                      {/* Social Icons Row */}
                      <div style={{
                        display: "flex",
                        gap: "14px",
                        marginBottom: "24px"
                      }}>
                        <button
                          onClick={handleConnectWallet}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10px",
                            color: "#1f2937",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f9fafb";
                            e.currentTarget.style.borderColor = "#1f2937";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </button>
                        <button
                          onClick={handleConnectWallet}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10px",
                            color: "#1f2937",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f9fafb";
                            e.currentTarget.style.borderColor = "#1f2937";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                          }}
                        >
                          <i className="icon-apple" style={{ fontSize: "20px" }} />
                        </button>
                        <button
                          onClick={handleConnectWallet}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10px",
                            color: "#1f2937",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f9fafb";
                            e.currentTarget.style.borderColor = "#1f2937";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ffffff";
                            e.currentTarget.style.borderColor = "#e5e7eb";
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                        </button>
                        <button
                          onClick={handleConnectWallet}
                          style={{
                            flex: 1,
                            padding: "14px",
                            background: "#1877f2",
                            border: "1px solid #1877f2",
                            borderRadius: "10px",
                            color: "#ffffff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1565d8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#1877f2";
                          }}
                        >
                          <i className="flaticon-facebook-1" style={{ fontSize: "20px" }} />
                        </button>
                      </div>

                      {/* Divider */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "24px 0",
                        gap: "16px"
                      }}>
                        <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
                        <p style={{ color: "#9ca3af", margin: 0, fontSize: "13px" }}>or</p>
                        <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
                      </div>

                      {/* Continue with Wallet */}
                      <button
                        onClick={handleConnectWallet}
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "10px",
                          color: "#1f2937",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "12px",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb";
                          e.currentTarget.style.borderColor = "#1f2937";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="5" width="20" height="14" rx="2"/>
                          <line x1="2" y1="10" x2="22" y2="10"/>
                        </svg>
                        Continue with a wallet
                      </button>
                    </div>
                  </>
                ) : showRoleSelection && !isAuthenticated ? (
                  <div className="role-selection wow fadeInUp">
                    <p className="fs-18 fw-5 mb-3" style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937" }}>
                      Select Your Role
                    </p>
                    <p className="fs-15 mb-4" style={{
                      color: "#6b7280",
                      background: "#f3f4f6",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontFamily: "monospace"
                    }}>
                      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>

                    <div className="role-options mb-4" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div
                        className={`role-card ${selectedRole === "student" ? "active" : ""}`}
                        onClick={() => setSelectedRole("student")}
                        style={{
                          border: "2px solid",
                          borderColor: selectedRole === "student" ? "#1f2937" : "#e5e7eb",
                          padding: "20px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          background: selectedRole === "student" ? "#f3e8ff" : "#fff",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRole !== "student") {
                            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRole !== "student") {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "28px" }}>🎓</span>
                          <h5 className="fw-6" style={{ margin: 0, fontSize: "17px", color: "#1f2937" }}>Student</h5>
                        </div>
                        <p className="fs-14" style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>
                          Access courses and track your learning progress
                        </p>
                      </div>

                      <div
                        className={`role-card ${selectedRole === "trainer" ? "active" : ""}`}
                        onClick={() => setSelectedRole("trainer")}
                        style={{
                          border: "2px solid",
                          borderColor: selectedRole === "trainer" ? "#1f2937" : "#e5e7eb",
                          padding: "20px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          background: selectedRole === "trainer" ? "#f3e8ff" : "#fff",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRole !== "trainer") {
                            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRole !== "trainer") {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "28px" }}>👨‍🏫</span>
                          <h5 className="fw-6" style={{ margin: 0, fontSize: "17px", color: "#1f2937" }}>Trainer/Mentor</h5>
                        </div>
                        <p className="fs-14" style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>
                          Create courses and mentor students
                        </p>
                      </div>
                    </div>

                    <button
                      className="button-submit tf-btn w-100"
                      type="button"
                      onClick={handleRoleSelection}
                      disabled={!selectedRole}
                      style={{
                        opacity: selectedRole ? 1 : 0.5,
                        cursor: selectedRole ? "pointer" : "not-allowed",
                        background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                        border: "none",
                        color: "#fff",
                        height: "52px",
                        borderRadius: "8px",
                        fontSize: "15px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRole) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Continue as{" "}
                      {selectedRole === "student"
                        ? "Student"
                        : selectedRole === "trainer"
                          ? "Trainer"
                          : "..."}
                      <i className="icon-arrow-top-right" style={{ marginLeft: "6px" }} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Completion Modal */}
      {showProfileCompletion && (
        <ProfileCompletion
          userAddress={storedWalletAddress || address}
          socialEmail={socialEmail}
          onComplete={handleProfileComplete}
        />
      )}
    </div>
  );
}
