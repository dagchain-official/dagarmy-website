"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { login, isAuthenticated, userRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    const hasLoggedOut = sessionStorage.getItem('dagarmy_logged_out') === 'true';
    if (isConnected && address && !isAuthenticated && !hasLoggedOut) {
      setShowRoleSelection(true);
    } else if (hasLoggedOut) {
      setShowRoleSelection(false);
    }
  }, [isConnected, address, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'student') {
        router.push('/student-dashboard');
      } else if (userRole === 'trainer') {
        // TODO: Create instructor-dashboard route
        router.push('/student-dashboard'); // Temporary redirect
      }
    }
  }, [isAuthenticated, userRole, router]);

  const handleRoleSelection = () => {
    if (selectedRole && address) {
      login(selectedRole);
    }
  };

  const handleConnectWallet = () => {
    sessionStorage.removeItem('dagarmy_logged_out');
    if (typeof window !== 'undefined' && window.modal) {
      window.modal.open();
    }
  };

  return (
    <div className="main-content page-login" style={{ background: "#F4F2FB !important" }}>
      <section className="section-page-login login-wrap" style={{ padding: "80px 0" }}>
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
                  style={{ marginBottom: "10px", fontSize: "32px", color: "#1f2937" }}
                >
                  Sign In To Your Account
                </h2>

                <div className="register" style={{ marginBottom: "32px" }}>
                  <p className="fw-5 fs-15 wow fadeInUp" data-wow-delay="0s" style={{ display: "inline", marginRight: "6px", color: "#6b7280" }}>
                    Don't have an account?
                  </p>
                  <Link
                    href="/register"
                    className="fw-5 fs-15 wow fadeInUp"
                    data-wow-delay="0s"
                    style={{
                      color: "#8b5cf6",
                      fontWeight: "600",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#7c3aed"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#8b5cf6"}
                  >
                    Join here
                  </Link>
                </div>

                {!isConnected ? (
                  <>
                    <div className="wow fadeInUp" data-wow-delay="0s">
                      <p className="fs-15 mb-3" style={{ color: "#6b7280", textAlign: "center", fontSize: "14px" }}>
                        Connect your wallet or use social login to continue
                      </p>

                      {/* Connect Wallet Button */}
                      <button
                        className="relative flex items-center justify-center gap-1 bg-[#8b5cf6] border-2 border-[#8b5cf6] text-sm font-semibold text-white cursor-pointer overflow-hidden transition-all duration-600 ease-in-out hover:text-white group hover:transition-all hover:duration-700 px-10 mb-3 mx-auto w-full"
                        type="button"
                        onClick={handleConnectWallet}
                        style={{
                          height: "52px",
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          fontSize: "15px",
                          fontWeight: "600",
                          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="absolute w-5 fill-white z-[20] transition-all duration-700 ease-in-out -left-1/4 group-hover:left-3 group-hover:fill-white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                        </svg>
                        <span className="relative z-[10] transition-all duration-700 ease-in-out -translate-x-2 group-hover:translate-x-2">
                          Connect Wallet
                        </span>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#131836] rounded-full opacity-0 transition-all duration-700 ease-in-out group-hover:w-[400px] group-hover:h-[400px] group-hover:opacity-100 z-[0]"></span>
                        <svg
                          viewBox="0 0 24 24"
                          className="absolute w-5 fill-white z-[20] transition-all duration-700 ease-in-out right-3 group-hover:-right-1/4 group-hover:fill-white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                        </svg>
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
                      <p className="fs-15" style={{ color: "#9ca3af", margin: 0, fontWeight: "500", fontSize: "13px" }}>
                        OR
                      </p>
                      <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
                    </div>

                    {/* Social Login Buttons */}
                    <ul className="login-social" style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}>
                      <li className="login-social-icon">
                        <button
                          onClick={handleConnectWallet}
                          className="tf-btn wow fadeInUp"
                          data-wow-delay="0s"
                          style={{
                            width: "100%",
                            height: "52px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            color: "#374151",
                            fontWeight: "500",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#8b5cf6";
                            e.currentTarget.style.background = "#f9fafb";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <i className="icon-google" style={{ fontSize: "16px" }} />
                          <span>Google</span>
                        </button>
                      </li>
                      <li className="login-social-icon">
                        <button
                          onClick={handleConnectWallet}
                          className="tf-btn wow fadeInUp"
                          data-wow-delay="0.1s"
                          style={{
                            width: "100%",
                            height: "52px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            color: "#374151",
                            fontWeight: "500",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#8b5cf6";
                            e.currentTarget.style.background = "#f9fafb";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <i className="flaticon-facebook-1" style={{ fontSize: "16px" }} />
                          <span>Facebook</span>
                        </button>
                      </li>
                      <li className="login-social-icon">
                        <button
                          onClick={handleConnectWallet}
                          className="tf-btn wow fadeInUp"
                          data-wow-delay="0.2s"
                          style={{
                            width: "100%",
                            height: "52px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            color: "#374151",
                            fontWeight: "500",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#8b5cf6";
                            e.currentTarget.style.background = "#f9fafb";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <i className="icon-apple" style={{ fontSize: "16px" }} />
                          <span>Apple</span>
                        </button>
                      </li>
                    </ul>

                    {/* Trust Indicators */}
                    <div style={{
                      marginTop: "32px",
                      padding: "16px",
                      background: "#f9fafb",
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <i className="icon-shield" style={{ fontSize: "20px", color: "#8b5cf6" }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#111827" }}>
                            Secure & Encrypted
                          </p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                            Your data is protected with industry-standard encryption
                          </p>
                        </div>
                      </div>
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
                          borderColor: selectedRole === "student" ? "#8b5cf6" : "#e5e7eb",
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
                          borderColor: selectedRole === "trainer" ? "#8b5cf6" : "#e5e7eb",
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
                        background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
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
    </div>
  );
}
