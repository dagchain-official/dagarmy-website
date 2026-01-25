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
      setUserRole(null);
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsAdmin(false);
      setIsMasterAdmin(false);
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
        if (embeddedWalletInfo) {
          console.log('✅ Found embeddedWalletInfo:', embeddedWalletInfo);
          
          userEmail = embeddedWalletInfo.user?.email || null;
          userName = embeddedWalletInfo.user?.username || 
                    embeddedWalletInfo.user?.name ||
                    (userEmail ? userEmail.split('@')[0] : null);
          
          console.log('✅ Extracted email:', userEmail);
          console.log('✅ Extracted name:', userName);
        } else {
          console.log('⚠️ No embeddedWalletInfo - wallet-only login');
        }

        if (userEmail) {
          profile.email = userEmail;
          profile.name = userName;
          profile.avatar = userAvatar;
          profile.authProvider = embeddedWalletInfo?.authProvider;
          
          // Check admin access based on email
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
    
    // Set session flag to prevent auto-login
    sessionStorage.setItem('dagarmy_logged_out', 'true');
    
    setUserRole(null);
    setIsAuthenticated(false);
    setUserProfile(null);
    setHasLoggedOut(true);
    
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
