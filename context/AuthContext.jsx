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
  const [userRole, setUserRole] = useState(null); // 'student' or 'trainer'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  useEffect(() => {
    // Check if user explicitly logged out
    const loggedOut = sessionStorage.getItem('dagarmy_logged_out');
    if (loggedOut === 'true') {
      setHasLoggedOut(true);
      setUserRole(null);
      setIsAuthenticated(false);
      setUserProfile(null);
      return;
    }

    // REMOVED: Auto-authentication logic
    // Users must now select their role every time they sign in
    // This allows multiple family members to use the same device with different accounts
    
    if (!isConnected) {
      setUserRole(null);
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  }, [isConnected, address, hasLoggedOut]);

  const login = async (role) => {
    if (address && (role === 'student' || role === 'trainer')) {
      // Clear the logged out flag on successful login
      sessionStorage.removeItem('dagarmy_logged_out');
      
      localStorage.setItem(`dagarmy_role_${address}`, role);
      
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
        // For social logins, embeddedWalletInfo contains user email and username
        if (embeddedWalletInfo) {
          console.log('✅ Found embeddedWalletInfo:', embeddedWalletInfo);
          
          userEmail = embeddedWalletInfo.user?.email || null;
          
          // Try to get a proper name - username might just be the email prefix
          // For now, we'll use username as that's what Reown provides
          // In the future, you could add a profile completion step to get the actual name
          userName = embeddedWalletInfo.user?.username || 
                    embeddedWalletInfo.user?.name ||
                    (userEmail ? userEmail.split('@')[0] : null);
          
          console.log('✅ Extracted from embeddedWalletInfo:');
          console.log('   Email:', userEmail);
          console.log('   Username:', userName);
          console.log('   Auth Provider:', embeddedWalletInfo.authProvider);
          console.log('   Note: Username is what Reown provides. For full name, consider adding a profile completion step.');
        } else {
          console.log('⚠️ No embeddedWalletInfo - this is expected for wallet-only logins');
        }

        if (userEmail) {
          profile.email = userEmail;
          profile.name = userName;
          profile.avatar = userAvatar;
          profile.authProvider = embeddedWalletInfo?.authProvider;
          console.log('✅ User profile complete with email:', userEmail);
        }
      } catch (error) {
        console.log('Could not fetch user profile:', error);
      }

      // Save user to Supabase
      try {
        const supabaseData = {
          wallet_address: address,
          email: profile.email || null,
          role: role,
          full_name: profile.name || null,
          avatar_url: profile.avatar || null,
          auth_provider: profile.authProvider || 'wallet',
        };

        console.log('📤 Sending to Supabase:', supabaseData);

        const result = await saveUserToSupabase(supabaseData);
        
        if (result.success) {
          console.log('✅ User saved to Supabase:', result.user);
          // Update profile with Supabase user ID
          profile.supabaseId = result.user.id;
          profile.isNewUser = result.isNewUser;
        }
      } catch (error) {
        console.error('❌ Failed to save user to Supabase:', error);
        // Continue with local auth even if Supabase fails
      }

      localStorage.setItem(`dagarmy_profile_${address}`, JSON.stringify(profile));
      localStorage.setItem('dagarmy_role', role);
      localStorage.setItem('dagarmy_authenticated', 'true');
      localStorage.setItem('dagarmy_user', JSON.stringify({
        email: profile.email,
        full_name: profile.name,
        wallet_address: address
      }));
      sessionStorage.removeItem('dagarmy_logged_out');
      
      // Set cookies for middleware authentication
      document.cookie = `dagarmy_role=${role}; path=/; max-age=2592000`; // 30 days
      document.cookie = `dagarmy_authenticated=true; path=/; max-age=2592000`; // 30 days
      
      setUserRole(role);
      setIsAuthenticated(true);
      setUserProfile(profile);
      setHasLoggedOut(false);
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
