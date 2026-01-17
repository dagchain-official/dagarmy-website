"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [userRole, setUserRole] = useState(null); // 'student' or 'trainer'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      // Check if user has a role stored in localStorage
      const storedRole = localStorage.getItem(`dagarmy_role_${address}`);
      if (storedRole) {
        setUserRole(storedRole);
        setIsAuthenticated(true);
      }
    } else {
      setUserRole(null);
      setIsAuthenticated(false);
    }
  }, [isConnected, address]);

  const login = (role) => {
    if (address && (role === 'student' || role === 'trainer')) {
      localStorage.setItem(`dagarmy_role_${address}`, role);
      setUserRole(role);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    if (address) {
      localStorage.removeItem(`dagarmy_role_${address}`);
    }
    setUserRole(null);
    setIsAuthenticated(false);
    disconnect();
  };

  const value = {
    address,
    isConnected,
    userRole,
    isAuthenticated,
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
