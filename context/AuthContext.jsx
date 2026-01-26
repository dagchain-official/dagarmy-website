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

  const login = async () => {
    if (address) {
      // Clear the logged out flag on successful login
      sessionStorage.removeItem('dagarmy_logged_out');
      
      console.log('🔍 Login Debug - Connector:', connector?.name);
      console.log('🔍 Login Debug - CAIP Address:', caipAddress);
      console.log('🔍 Embedded Wallet Info:', embeddedWalletInfo);
      
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
        console.log('🔍 Checking for existing user with wallet:', address);
        const existingUserResponse = await fetch(`/api/auth/user?wallet=${address}`);
        if (existingUserResponse.ok) {
          const existingUserData = await existingUserResponse.json();
          if (existingUserData.user) {
            console.log('✅ Found existing user:', existingUserData.user);
            userEmail = existingUserData.user.email;
            userName = existingUserData.user.full_name;
            userAvatar = existingUserData.user.avatar_url;
            profile.isAdmin = existingUserData.user.is_admin || false;
            profile.isMasterAdmin = existingUserData.user.is_master_admin || false;
            console.log('✅ Existing user admin status:', { isAdmin: profile.isAdmin, isMasterAdmin: profile.isMasterAdmin });
          }
        }

        // If no existing user or no email, try to get from embeddedWalletInfo (social login)
        if (!userEmail && embeddedWalletInfo) {
          console.log('✅ Found embeddedWalletInfo:', embeddedWalletInfo);
          
          userEmail = embeddedWalletInfo.user?.email || null;
          userName = embeddedWalletInfo.user?.username || 
                    embeddedWalletInfo.user?.name ||
                    (userEmail ? userEmail.split('@')[0] : null);
          
          console.log('✅ Extracted email from social login:', userEmail);
          console.log('✅ Extracted name:', userName);
        } else if (!embeddedWalletInfo) {
          console.log('⚠️ No embeddedWalletInfo - wallet-only login');
        }

        // If we have an email, check admin access
        if (userEmail) {
          profile.email = userEmail;
          profile.name = userName;
          profile.avatar = userAvatar;
          profile.authProvider = embeddedWalletInfo?.authProvider || 'wallet';
          
          // Check admin access based on email (this will override any existing values)
          console.log('🔍 Checking admin access for:', userEmail);
          const roleResponse = await fetch('/api/auth/check-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
          });
          
          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            console.log('✅ Role check result:', roleData);
            
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

        console.log('📤 Sending to Supabase:', supabaseData);

        const result = await saveUserToSupabase(supabaseData);
        
        if (result.success) {
          console.log('✅ User saved to Supabase:', result.user);
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
