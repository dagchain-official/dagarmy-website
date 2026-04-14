"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const AuthContext = createContext(null);

// Token storage keys
const TOKEN_KEY = 'dagarmy_token';
const USER_KEY = 'dagarmy_user';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function decodeJWT(token) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

function isTokenExpired(token) {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
  return token;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ssoChecked = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // ── Initialize: restore session from localStorage or SSO token ────────────
  useEffect(() => {
    (async () => {
      // 1. Check for incoming SSO token in URL
      if (!ssoChecked.current && typeof window !== 'undefined') {
        ssoChecked.current = true;
        const params = new URLSearchParams(window.location.search);
        const ssoToken = params.get('sso_token');
        if (ssoToken) {
          try {
            const res = await fetch('/api/auth/sso/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: ssoToken }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.token && data.user) {
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                if (isMounted.current) setUser(data.user);
                const clean = new URL(window.location.href);
                clean.searchParams.delete('sso_token');
                window.history.replaceState({}, '', clean.toString());
                setIsLoading(false);
                return;
              }
            }
          } catch (e) {
            console.warn('[AuthContext] SSO validation failed:', e);
          }
        }
      }

      // 2. Handle Google OAuth callback
      if (typeof window !== 'undefined' && window.location.pathname === '/auth/callback-complete') {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const next = params.get('next') || '/';
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
          try {
            const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
              const { user: freshUser } = await res.json();
              localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
              if (isMounted.current) setUser(freshUser);
            }
          } catch {}
          window.location.href = next;
          return;
        }
      }

      // 3. Restore from localStorage
      const token = getStoredToken();
      if (token) {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (isMounted.current) setUser(parsed);
          } catch {}
        }
        // Validate with server in background — only clear session on explicit
        // 401/403 (truly invalid token). Network errors / 5xx must never log the user out,
        // as a cold-start or transient server hiccup was causing immediate post-login logouts.
        fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
          .then(async r => {
            if (r.ok) {
              const data = await r.json();
              if (!isMounted.current) return;
              if (data?.user) {
                setUser(data.user);
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
              }
            } else if (r.status === 401 || r.status === 403) {
              // Token is genuinely invalid/expired — clear session
              if (!isMounted.current) return;
              setUser(null);
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
            }
            // Any other status (5xx, network error) → keep existing session untouched
          })
          .catch(() => { /* network error — keep session, don't log out */ });
      }

      if (isMounted.current) setIsLoading(false);
    })();
  }, []);

  // ── Login with email + password ───────────────────────────────────────────
  const login = useCallback(async (email, password, fingerprintId) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fingerprint_id: fingerprintId }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message || 'Login failed' };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      // Preserve existing DAGARMY localStorage keys
      localStorage.setItem('dagarmy_authenticated', 'true');
      localStorage.setItem('dagarmy_role', data.user.role);
      document.cookie = `dagarmy_role=${data.user.role}; path=/; max-age=2592000`;
      document.cookie = `dagarmy_authenticated=true; path=/; max-age=2592000`;

      setUser(data.user);

      // Redirect based on role
      const redirectPath = data.user.is_admin ? '/admin/dashboard' : '/student-dashboard';
      window.location.href = redirectPath;

      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Login with Google ─────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}

    ['dagarmy_token', 'dagarmy_user', 'dagarmy_authenticated', 'dagarmy_role',
     'dagarmy_wallet', 'dagarmy_logged_out'].forEach(k => localStorage.removeItem(k));
    document.cookie = 'dagarmy_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'dagarmy_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'dagarmy_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    sessionStorage.setItem('dagarmy_logged_out', 'true');

    setUser(null);
    window.location.href = '/';
  }, []);

  // ── Issue SSO token (cross-platform jump) ─────────────────────────────────
  const issueSSOToken = useCallback(async (target) => {
    const token = getStoredToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/sso/issue-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ target }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  }, []);

  // ── Refresh user from server ──────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const { user: fresh } = await res.json();
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      }
    } catch {}
  }, []);

  const value = {

    user,
    isAuthenticated: !!user,
    isLoading,
    // Backward-compat (existing DAGARMY components use these field names)
    address: user?.wallet_address ?? null,
    isConnected: !!user,
    userRole: user?.role ?? null,
    userProfile: user,
    isAdmin: user?.is_admin ?? false,
    isMasterAdmin: user?.is_master_admin ?? false,
    // Actions
    login,
    loginWithGoogle,
    logout,
    issueSSOToken,
    refreshUser,
    getToken: getStoredToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
