-- Migration: 032_secure_admin_sessions.sql
-- Fix: Enable RLS and revoke public API access on all server-managed tables
-- containing sensitive data (session tokens, login attempts, DAGChain tokens, etc.)
-- All these tables are accessed only via service_role from the server — never by clients.

-- ── admin_sessions (contains session_token) ──────────────────────────────────
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.admin_sessions FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.admin_sessions FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_sessions TO service_role;

-- ── admin_login_attempts (security audit log — server-only) ──────────────────
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.admin_login_attempts FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.admin_login_attempts FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_login_attempts TO service_role;

-- ── dagchain_nodes (purchase data — server-only) ─────────────────────────────
ALTER TABLE public.dagchain_nodes ENABLE ROW LEVEL SECURITY;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.dagchain_nodes FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.dagchain_nodes FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dagchain_nodes TO service_role;

-- ── dagchain_referrals (server-only) ─────────────────────────────────────────
ALTER TABLE public.dagchain_referrals ENABLE ROW LEVEL SECURITY;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.dagchain_referrals FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.dagchain_referrals FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dagchain_referrals TO service_role;

-- ── dagchain_events (webhook audit log — server-only) ────────────────────────
ALTER TABLE public.dagchain_events ENABLE ROW LEVEL SECURITY;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.dagchain_events FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.dagchain_events FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dagchain_events TO service_role;
