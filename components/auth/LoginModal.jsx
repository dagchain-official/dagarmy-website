"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/AuthContext";
import ProfileCompletion from "../otherPages/ProfileCompletion";
import "../otherPages/SocialLogin.css";
import "../otherPages/LoginOverride.css";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { login, isAuthenticated, userRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [socialEmail, setSocialEmail] = useState(null);
  const [storedWalletAddress, setStoredWalletAddress] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // When wallet connects, check if user needs profile completion
  useEffect(() => {
    const checkUserProfile = async () => {
      if (isConnected && address && !isAuthenticated && isOpen && !isCheckingProfile) {
        console.log('🔍 Checking user profile for:', address);
        setIsCheckingProfile(true);
        
        try {
          // Check if user exists and if profile is completed
          const response = await fetch(`/api/auth/user?wallet=${address}`);
          const data = await response.json();
          
          console.log('📋 User data from API:', data);
          
          if (data.user) {
            // User exists
            setSocialEmail(data.user.email);
            setStoredWalletAddress(address);
            
            if (!data.user.profile_completed) {
              // Show profile completion form for existing users without completed profile
              console.log('📝 Profile not completed, showing profile completion form');
              setShowProfileCompletion(true);
              setIsCheckingProfile(false);
              return;
            } else {
              // Profile completed, proceed with login
              console.log('✅ Profile already completed, proceeding with login');
              setIsCheckingProfile(false);
              await login();
            }
          } else {
            // New user - show profile completion form
            console.log('🆕 New user detected, showing profile completion form');
            setStoredWalletAddress(address);
            setShowProfileCompletion(true);
            setIsCheckingProfile(false);
            return;
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
          setIsCheckingProfile(false);
          // On error, try to login anyway
          await login();
        }
        
        // Close any Reown popup windows that might be stuck open
        if (typeof window !== 'undefined' && window.modal) {
          try {
            window.modal.close();
          } catch (e) {
            console.log('Could not close modal:', e);
          }
        }
      }
    };
    
    checkUserProfile();
  }, [isConnected, address, isAuthenticated, isOpen, login, isCheckingProfile]);

  // When authenticated, close modal (AuthContext handles redirect)
  useEffect(() => {
    if (isAuthenticated && userRole && !showProfileCompletion) {
      setShowRoleSelection(false);
      onClose();
    }
  }, [isAuthenticated, userRole, showProfileCompletion, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowProfileCompletion(false);
      setIsCheckingProfile(false);
      setShowRoleSelection(false);
    }
  }, [isOpen]);

  const handleRoleSelection = async () => {
    if (selectedRole && address) {
      // Store wallet address before it becomes undefined
      console.log('💾 Storing wallet address:', address);
      setStoredWalletAddress(address);
      
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
          
          if (!data.user.profile_completed) {
            console.log('📝 Profile not completed, showing profile completion form');
            setShowProfileCompletion(true);
            setShowRoleSelection(false);
            return;
          } else {
            console.log('✅ Profile already completed, proceeding with login');
          }
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
      }
      
      await login(selectedRole);
    }
  };

  const handleProfileComplete = async (userData) => {
    console.log('✅ Profile completed, now authenticating user');
    setShowProfileCompletion(false);
    // Login without role parameter - role will be determined automatically
    await login();
  };

  const handleClose = () => {
    setShowRoleSelection(false);
    setShowProfileCompletion(false);
    setSelectedRole("");
    onClose();
  };

  // Debug logging
  useEffect(() => {
    console.log('🔍 LoginModal State:', {
      isOpen,
      showRoleSelection,
      showProfileCompletion,
      isAuthenticated,
      userRole
    });
  }, [isOpen, showRoleSelection, showProfileCompletion, isAuthenticated, userRole]);

  if (!isOpen) return null;

  // Only show modal if there's actual content to display
  const shouldShowModal = showRoleSelection || showProfileCompletion;
  
  if (!shouldShowModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleClose}
      />

      {/* Loading Modal - Only show if explicitly checking profile */}
      {isCheckingProfile && !showProfileCompletion && !showRoleSelection && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 20px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #1f2937',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
            Checking Profile...
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Please wait while we verify your account
          </p>
        </div>
      )}

      {/* Role Selection Modal */}
      {showRoleSelection && !showProfileCompletion && !isCheckingProfile && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ×
          </button>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              Select Your Role
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              margin: 0
            }}>
              Choose a role and start your learning journey
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div
              onClick={() => setSelectedRole("student")}
              style={{
                padding: '20px',
                border: selectedRole === "student" ? '2px solid #1f2937' : '2px solid #e5e7eb',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedRole === "student" ? '#f5f3ff' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== "student") {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== "student") {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: selectedRole === "student" ? '#1f2937' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s'
              }}>
                🎓
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  margin: '0 0 4px 0'
                }}>
                  Student
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#6b7280',
                  margin: 0
                }}>
                  Access courses and track your learning progress
                </p>
              </div>
              {selectedRole === "student" && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  ✓
                </div>
              )}
            </div>

            <div
              onClick={() => setSelectedRole("trainer")}
              style={{
                padding: '20px',
                border: selectedRole === "trainer" ? '2px solid #1f2937' : '2px solid #e5e7eb',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedRole === "trainer" ? '#f5f3ff' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseEnter={(e) => {
                if (selectedRole !== "trainer") {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRole !== "trainer") {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: selectedRole === "trainer" ? '#1f2937' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.2s'
              }}>
                👨‍🏫
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  margin: '0 0 4px 0'
                }}>
                  Trainer/Mentor
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#6b7280',
                  margin: 0
                }}>
                  Create courses and mentor students
                </p>
              </div>
              {selectedRole === "trainer" && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  ✓
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: selectedRole ? '#1f2937' : '#e5e7eb',
              color: selectedRole ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: selectedRole ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (selectedRole) {
                e.currentTarget.style.backgroundColor = '#111827';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedRole) {
                e.currentTarget.style.backgroundColor = '#1f2937';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            Continue
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      )}

      {/* Profile Completion Modal */}
      {showProfileCompletion && (
        <ProfileCompletion
          onComplete={handleProfileComplete}
          onClose={handleClose}
          userAddress={storedWalletAddress || address}
          socialEmail={socialEmail}
        />
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
