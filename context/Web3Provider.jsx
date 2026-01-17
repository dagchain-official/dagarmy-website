"use client";
import React, { useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, modal } from '@/config/reown';
import { AuthProvider } from './AuthContext';

const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  useEffect(() => {
    // Ensure modal is available globally
    if (typeof window !== 'undefined') {
      window.modal = modal;
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
