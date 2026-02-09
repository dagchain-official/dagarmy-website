"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppKitAccount, useAppKitState } from '@reown/appkit/react';

const AuthContext = createContext();

// Helper function to save user to Supabase
async function saveUserToSupabase(userData) {
  try {
    const response = await fetch('/api/auth/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.error || 'Failed to save user to Supabase');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving user to Supabase:', error);
    throw error;
  }
}

export function AuthProvider({ children }) {
  const { address, isConnected, connector } = useAccount();
  const { caipAddress, isConnected: isAppKitConnected, embeddedWalletInfo } = useAppKitAccount();
  const appKitState = useAppKitState();
  const { disconnect } = useDisconnect();
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);

  // Check authentication cookie on mount
  useEffect(() => {
    const checkAuthCookie = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('dagarmy_authenticated='));
      return authCookie ? authCookie.split('=')[1] === 'true' : false;
    };

    const isAuthenticatedFromCookie = checkAuthCookie();
    if (isAuthenticatedFromCookie && isConnected) {
      setIsAuthenticated(true);
    }
  }, [isConnected]);

  useEffect(() => {
    // Check if user explicitly logged out
    const loggedOut = sessionStorage.getItem('dagarmy_logged_out');
    if (loggedOut === 'true') {
      setHasLoggedOut(true);
      setUserRole(null);
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsAdmin(false);
      setIsMasterAdmin(false);
      return;
    }
    
    if (!isConnected) {
      // Only clear auth if no auth cookie exists
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(c => c.trim().startsWith('dagarmy_authenticated='));
      if (!authCookie) {
        setUserRole(null);
        setIsAuthenticated(false);
        setUserProfile(null);
        setIsAdmin(false);
        setIsMasterAdmin(false);
      }
    }
  }, [isConnected, address, hasLoggedOut]);

  // Watch for embeddedWalletInfo to become available and update user email
  useEffect(() => {
    const updateUserEmail = async () => {
      // Only proceed if we have wallet connected and embeddedWalletInfo
      if (!address || !embeddedWalletInfo || !isConnected) {
        return;
      }

      // embeddedWalletInfo became available

      // Try to extract email
      const email = embeddedWalletInfo.user?.email || 
                   embeddedWalletInfo.email ||
                   embeddedWalletInfo.user?.emailAddress ||
                   null;

      const name = embeddedWalletInfo.user?.username || 
                  embeddedWalletInfo.user?.name ||
                  embeddedWalletInfo.user?.displayName ||
                  embeddedWalletInfo.name ||
                  (email ? email.split('@')[0] : null);

      const avatar = embeddedWalletInfo.user?.avatar ||
                    embeddedWalletInfo.user?.picture ||
                    embeddedWalletInfo.user?.profileImage ||
                    null;

      // Email extracted from embeddedWalletInfo

      if (email) {
        // Update user in database with email
        try {
          // Updating user email in database
          const response = await fetch('/api/auth/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wallet_address: address,
              email: email,
              role: 'student', // Default role for new users
              full_name: name,
              avatar_url: avatar,
              auth_provider: embeddedWalletInfo.authProvider || 'social'
            })
          });

          if (response.ok) {
            const data = await response.json();
            // User email updated successfully

            // Update userProfile state
            setUserProfile(prev => ({
              ...prev,
              email: email,
              name: name,
              avatar: avatar,
              profile_completed: data.user?.profile_completed || false
            }));

            // Update localStorage
            const storedUser = localStorage.getItem('dagarmy_user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              userData.email = email;
              userData.full_name = name;
              userData.profile_completed = data.user?.profile_completed || false;
              localStorage.setItem('dagarmy_user', JSON.stringify(userData));
            }

            // DON'T redirect automatically - let LoginModal handle profile completion flow
            // Only redirect if profile is already completed
            if (data.user?.profile_completed && window.location.href.includes('reown') || window.location.href.includes('walletconnect')) {
              console.log('🔄 Profile completed, redirecting from OAuth page to dashboard...');
              window.location.href = '/dashboard';
            }
          }
        } catch (error) {
          console.error('❌ Failed to update user email:', error);
        }
      } else {
        // No email found in embeddedWalletInfo
      }
    };

    updateUserEmail();
  }, [embeddedWalletInfo, address, isConnected]);

  const login = async () => {
    if (address) {
      // Clear the logged out flag on successful login
      sessionStorage.removeItem('dagarmy_logged_out');
          // Login initiated
      
      // Try to get user profile info from connector
      const profile = {
        address: address,
        connectorType: connector?.name || 'Unknown',
        loginMethod: connector?.name || 'Wallet',
        timestamp: new Date().toISOString()
      };

      // Get email and name from embeddedWalletInfo (for social logins)
      let userEmail = null;
      let userName = null;
      let userAvatar = null;

      try {
        // First, check if user exists in database (for returning users)
        // Checking for existing user
        const existingUserResponse = await fetch(`/api/auth/user?wallet=${address}`);
        if (existingUserResponse.ok) {
          const existingUserData = await existingUserResponse.json();
          if (existingUserData.user) {
            // Found existing user
            userEmail = existingUserData.user.email;
            userName = existingUserData.user.full_name;
            userAvatar = existingUserData.user.avatar_url;
            profile.isAdmin = existingUserData.user.is_admin || false;
            profile.isMasterAdmin = existingUserData.user.is_master_admin || false;
            // Existing user admin status loaded
          }
        }

        // If no existing user or no email, try to get from embeddedWalletInfo (social login)
        if (!userEmail) {
          // Attempting to extract email from Reown/AppKit
          
          if (embeddedWalletInfo) {
            // Found embeddedWalletInfo
            
            // Try multiple paths to get email
            userEmail = embeddedWalletInfo.user?.email || 
                       embeddedWalletInfo.email ||
                       embeddedWalletInfo.user?.emailAddress ||
                       null;
            
            userName = embeddedWalletInfo.user?.username || 
                      embeddedWalletInfo.user?.name ||
                      embeddedWalletInfo.user?.displayName ||
                      embeddedWalletInfo.name ||
                      (userEmail ? userEmail.split('@')[0] : null);
            
            userAvatar = embeddedWalletInfo.user?.avatar ||
                        embeddedWalletInfo.user?.picture ||
                        embeddedWalletInfo.user?.profileImage ||
                        null;
            
            // Extracted email and name from embeddedWalletInfo
          } else {
            // No embeddedWalletInfo available - wallet-only login
          }
        }

        // If we have an email, check admin access
        if (userEmail) {
          profile.email = userEmail;
          profile.name = userName;
          profile.avatar = userAvatar;
          profile.authProvider = embeddedWalletInfo?.authProvider || 'wallet';
          
          // Check admin access based on email (this will override any existing values)
          // Checking admin access
          const roleResponse = await fetch('/api/auth/check-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
          });
          
          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            // Role check completed
            
            profile.isAdmin = roleData.isAdmin;
            profile.isMasterAdmin = roleData.isMasterAdmin;
            profile.adminRole = roleData.role;
            profile.permissions = roleData.permissions;
            
            setIsAdmin(roleData.isAdmin);
            setIsMasterAdmin(roleData.isMasterAdmin);
          }
        }
      } catch (error) {
        console.log('Could not fetch user profile:', error);
      }

      // Save user to Supabase
      try {
        const finalRole = profile.isAdmin ? 'admin' : 'student';
        const supabaseData = {
          wallet_address: address,
          email: profile.email || null,
          role: finalRole,
          full_name: profile.name || null,
          avatar_url: profile.avatar || null,
          auth_provider: profile.authProvider || 'wallet',
          is_admin: profile.isAdmin || false,
          is_master_admin: profile.isMasterAdmin || false
        };

        // Saving user to database

        const result = await saveUserToSupabase(supabaseData);
        
        if (result.success) {
          // User saved to database
          profile.supabaseId = result.user.id;
          profile.isNewUser = result.isNewUser;
        }
      } catch (error) {
        console.error('❌ Failed to save user to Supabase:', error);
      }

      const finalRole = profile.isAdmin ? 'admin' : 'student';
      
      localStorage.setItem(`dagarmy_profile_${address}`, JSON.stringify(profile));
      localStorage.setItem('dagarmy_role', finalRole);
      localStorage.setItem('dagarmy_authenticated', 'true');
      localStorage.setItem('dagarmy_user', JSON.stringify({
        id: profile.supabaseId,
        email: profile.email,
        full_name: profile.name,
        wallet_address: address,
        is_admin: profile.isAdmin,
        is_master_admin: profile.isMasterAdmin
      }));
      sessionStorage.removeItem('dagarmy_logged_out');
      
      // Set cookies
      document.cookie = `dagarmy_role=${finalRole}; path=/; max-age=2592000`;
      document.cookie = `dagarmy_authenticated=true; path=/; max-age=2592000`;
      
      setUserRole(finalRole);
      setIsAuthenticated(true);
      setUserProfile(profile);
      setHasLoggedOut(false);
      
      // Auto-redirect to appropriate dashboard
      console.log('🚀 Redirecting to', profile.isAdmin ? 'admin' : 'student', 'dashboard');
      if (typeof window !== 'undefined') {
        window.location.href = profile.isAdmin ? '/admin/dashboard' : '/student-dashboard';
      }
    }
  };

  const logout = async () => {
    if (address) {
      localStorage.removeItem(`dagarmy_role_${address}`);
      localStorage.removeItem(`dagarmy_profile_${address}`);
    }
    
    // Clear all authentication data
    localStorage.removeItem('dagarmy_role');
    localStorage.removeItem('dagarmy_authenticated');
    localStorage.removeItem('dagarmy_user');
    localStorage.removeItem('dagarmy_wallet');
    
    // Clear cookies
    document.cookie = 'dagarmy_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'dagarmy_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Set session flag to prevent auto-login
    sessionStorage.setItem('dagarmy_logged_out', 'true');
    
    setUserRole(null);
    setIsAuthenticated(false);
    setUserProfile(null);
    setHasLoggedOut(true);
    setIsAdmin(false);
    setIsMasterAdmin(false);
    
    // Disconnect wallet/social connection
    await disconnect();
  };

  const value = {
    address,
    isConnected,
    userRole,
    isAuthenticated,
    userProfile,
    isAdmin,
    isMasterAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
