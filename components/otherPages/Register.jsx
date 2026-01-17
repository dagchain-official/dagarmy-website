"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { login, isAuthenticated, userRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    if (isConnected && address && !isAuthenticated) {
      setShowRoleSelection(true);
    }
  }, [isConnected, address, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'student') {
        router.push('/student-dashboard');
      } else if (userRole === 'trainer') {
        router.push('/instructor-dashboard');
      }
    }
  }, [isAuthenticated, userRole, router]);

  const handleRoleSelection = () => {
    if (selectedRole && address) {
      login(selectedRole);
    }
  };

  const handleConnectWallet = () => {
    // Clear logout flag to allow fresh registration
    sessionStorage.removeItem('dagarmy_logged_out');
    if (typeof window !== 'undefined' && window.modal) {
      window.modal.open();
    }
  };

  return (
    <div className="main-content page-register">
      <section className="section-page-register login-wrap tf-spacing-4">
        <div className="tf-container">
          <div className="row">
            <div className="col-lg-6">
              <div className="img-left wow fadeInLeft" data-wow-delay="0s">
                <Image
                  className="ls-is-cached lazyloaded"
                  alt="DAGARMY Register"
                  src="/images/page-title/page-title-home2-2.jpg"
                  width={592}
                  height={681}
                />
                <div
                  className="blockquite wow fadeInLeft"
                  data-wow-delay="0.1s"
                >
                  <p>
                    Join the Global Army of Vibe Coders. <br />
                    Master AI, Blockchain & Data Visualization
                  </p>
                  <p className="author">DAGARMY</p>
                  <p className="sub-author">Empowering Tech Leaders</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="content-right">
                <h2
                  className="login-title fw-7 wow fadeInUp"
                  data-wow-delay="0s"
                >
                  Create A New Account
                </h2>
                <div className="register">
                  <p className="fw-5 fs-15 wow fadeInUp" data-wow-delay="0s">
                    Already have an account?
                  </p>
                  <Link
                    href="/login"
                    className="fw-5 fs-15 wow fadeInUp"
                    data-wow-delay="0s"
                  >
                    Sign in
                  </Link>
                </div>

                {!isConnected ? (
                  <>
                    <div className="wow fadeInUp" data-wow-delay="0s">
                      <p className="fs-15 mb-3">
                        Connect your wallet or use social login to get started
                      </p>
                      <button
                        className="button-submit tf-btn w-100 mb-3"
                        type="button"
                        onClick={handleConnectWallet}
                      >
                        Connect Wallet
                        <i className="icon-arrow-top-right" />
                      </button>
                    </div>
                    <p className="fs-15 wow fadeInUp" data-wow-delay="0s">
                      OR
                    </p>
                    <ul className="login-social">
                      <li className="login-social-icon">
                        <button
                          onClick={handleConnectWallet}
                          className="tf-btn wow fadeInUp"
                          data-wow-delay="0s"
                        >
                          <i className="icon-google" />
                          Google
                        </button>
                      </li>
                      <li className="login-social-icon">
                        <button
                          onClick={handleConnectWallet}
                          className="tf-btn wow fadeInUp"
                          data-wow-delay="0.1s"
                        >
                          <i className="flaticon-facebook-1" />
                          Facebook
                        </button>
                      </li>
                      <li className="login-social-icon">
                        <button
                          onClick={handleConnectWallet}
                          className="tf-btn wow fadeInUp"
                          data-wow-delay="0.2s"
                        >
                          <i className="icon-apple" />
                          Apple
                        </button>
                      </li>
                    </ul>
                  </>
                ) : showRoleSelection && !isAuthenticated ? (
                  <div className="role-selection wow fadeInUp">
                    <p className="fs-18 fw-5 mb-3">Select Your Role</p>
                    <p className="fs-15 mb-4">
                      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                    <div className="role-options mb-4">
                      <div
                        className={`role-card ${selectedRole === 'student' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('student')}
                        style={{
                          border: '2px solid',
                          borderColor: selectedRole === 'student' ? '#7C3AED' : '#e5e7eb',
                          padding: '20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          marginBottom: '15px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <h5 className="fw-6">🎓 Student</h5>
                        <p className="fs-14">Access courses and track your learning progress</p>
                      </div>
                      <div
                        className={`role-card ${selectedRole === 'trainer' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('trainer')}
                        style={{
                          border: '2px solid',
                          borderColor: selectedRole === 'trainer' ? '#7C3AED' : '#e5e7eb',
                          padding: '20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <h5 className="fw-6">👨‍🏫 Trainer/Mentor</h5>
                        <p className="fs-14">Create courses and mentor students</p>
                      </div>
                    </div>
                    <button
                      className="button-submit tf-btn w-100"
                      type="button"
                      onClick={handleRoleSelection}
                      disabled={!selectedRole}
                      style={{
                        opacity: selectedRole ? 1 : 0.5,
                        cursor: selectedRole ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Sign Up as {selectedRole === 'student' ? 'Student' : selectedRole === 'trainer' ? 'Trainer' : '...'}
                      <i className="icon-arrow-top-right" />
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
