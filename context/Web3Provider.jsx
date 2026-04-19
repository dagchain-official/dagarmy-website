"use client";
// Web3Provider.jsx - Reown/Wagmi removed.
// Pass-through wrapper kept for backward compatibility with existing layout imports.
import { AuthProvider } from "@/context/AuthContext";

export default function Web3Provider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
