// auth.js — replaces config/reown.js
// Reown/Wagmi config removed. This file exports shared auth configuration.

export const AUTH_CONFIG = {
  // API endpoints (DAGARMY)
  endpoints: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    google: '/api/auth/google',
    forgotPassword: '/api/auth/forgot-password',
    ssoIssueToken: '/api/auth/sso/issue-token',
    ssoValidate: '/api/auth/sso/validate',
  },

  // Platform URLs for SSO jumps
  platforms: {
    daggpt: process.env.NEXT_PUBLIC_DAGGPT_URL || 'https://daggpt.network',
    dagchain: process.env.NEXT_PUBLIC_DAGCHAIN_URL || 'https://dagchain.network',
  },

  // Token storage keys
  keys: {
    token: 'dagarmy_token',
    user: 'dagarmy_user',
    role: 'dagarmy_role',
  },
};
