"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { address, isConnected, connector } = useAccount();
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

    if (isConnected && address && !hasLoggedOut) {
      // Check if user has a role stored in localStorage
      const storedRole = localStorage.getItem(`dagarmy_role_${address}`);
      const storedProfile = localStorage.getItem(`dagarmy_profile_${address}`);
      
      if (storedRole) {
        setUserRole(storedRole);
        setIsAuthenticated(true);
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      }
    } else if (!isConnected) {
      setUserRole(null);
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  }, [isConnected, address, hasLoggedOut]);

  const login = async (role) => {
    if (address && (role === 'student' || role === 'trainer')) {
      localStorage.setItem(`dagarmy_role_${address}`, role);
      
      // Try to get user profile info from connector
      const profile = {
        address: address,
        connectorType: connector?.name || 'Unknown',
        loginMethod: connector?.name || 'Wallet',
        timestamp: new Date().toISOString()
      };

      // Try to get email if available (for social logins)
      try {
        if (connector?.name?.toLowerCase().includes('auth')) {
          const user = await connector?.getUser?.();
          if (user?.email) {
            profile.email = user.email;
            profile.name = user.name || user.email.split('@')[0];
          }
        }
      } catch (error) {
        console.log('Could not fetch user profile:', error);
      }

      localStorage.setItem(`dagarmy_profile_${address}`, JSON.stringify(profile));
      sessionStorage.removeItem('dagarmy_logged_out');
      
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
