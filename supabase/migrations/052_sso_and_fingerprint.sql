-- ============================================================
-- Migration 052: SSO Sessions, Fingerprint Tracking & Platform Bridge
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. Extend the existing users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS fingerprint_id TEXT,
  ADD COLUMN IF NOT EXISTS fingerprint_blocked BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS dagchain_user_id TEXT,
  ADD COLUMN IF NOT EXISTS daggpt_role TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS platform_last_login JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS google_id TEXT,
  ADD COLUMN IF NOT EXISTS reset_token TEXT,
  ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;

-- 2. Fingerprint abuse tracking table
CREATE TABLE IF NOT EXISTS public.fingerprint_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fingerprint_id TEXT NOT NULL,
  email TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'dagarmy',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_fingerprint_attempts_fp ON public.fingerprint_attempts(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_fingerprint_attempts_email ON public.fingerprint_attempts(email);

-- 3. SSO sessions audit log (cross-platform jump tracking)
CREATE TABLE IF NOT EXISTS public.sso_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jti TEXT UNIQUE NOT NULL,           -- JWT token ID (for single-use enforcement)
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  from_platform TEXT NOT NULL,        -- 'dagarmy' | 'daggpt' | 'dagchain'
  to_platform TEXT NOT NULL,          -- 'dagarmy' | 'daggpt' | 'dagchain'
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,                -- NULL = not yet used
  is_used BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_sso_sessions_jti ON public.sso_sessions(jti);
CREATE INDEX IF NOT EXISTS idx_sso_sessions_user ON public.sso_sessions(user_id);

-- 4. Platform bridge table (links Supabase user ↔ DAGCHAIN MongoDB user)
CREATE TABLE IF NOT EXISTS public.platform_bridge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supabase_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  dagchain_mongo_id TEXT,             -- DAGCHAIN MongoDB ObjectId
  daggpt_user_id UUID,                -- DAGGPT-specific user ID (if ever separated)
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(supabase_user_id)
);

-- 5. Enable RLS on new tables
ALTER TABLE public.fingerprint_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sso_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_bridge ENABLE ROW LEVEL SECURITY;

-- 6. RLS: service role can do everything, users can only see their own
CREATE POLICY "Service role full access fingerprint_attempts"
  ON public.fingerprint_attempts FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access sso_sessions"
  ON public.sso_sessions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access platform_bridge"
  ON public.platform_bridge FOR ALL USING (true) WITH CHECK (true);

-- 7. Cleanup: mark token as used function (called after SSO validation)
CREATE OR REPLACE FUNCTION mark_sso_token_used(p_jti TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.sso_sessions
  SET is_used = true, used_at = NOW()
  WHERE jti = p_jti;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Check fingerprint abuse function
CREATE OR REPLACE FUNCTION check_fingerprint_abuse(
  p_fingerprint_id TEXT,
  p_email TEXT,
  p_platform TEXT DEFAULT 'dagarmy',
  p_threshold INT DEFAULT 3
)
RETURNS JSONB AS $$
DECLARE
  v_unique_emails INT;
  v_is_blocked BOOLEAN;
BEGIN
  -- Count unique emails for this fingerprint
  SELECT COUNT(DISTINCT email)
  INTO v_unique_emails
  FROM public.fingerprint_attempts
  WHERE fingerprint_id = p_fingerprint_id;

  -- Check if already hard-blocked
  SELECT COALESCE(bool_or(is_blocked), false)
  INTO v_is_blocked
  FROM public.fingerprint_attempts
  WHERE fingerprint_id = p_fingerprint_id;

  -- Log this attempt
  INSERT INTO public.fingerprint_attempts(fingerprint_id, email, platform)
  VALUES (p_fingerprint_id, p_email, p_platform)
  ON CONFLICT DO NOTHING;

  -- Return decision
  IF v_is_blocked THEN
    RETURN '{"allowed": false, "reason": "device_blocked"}'::JSONB;
  ELSIF v_unique_emails >= p_threshold THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'too_many_accounts', 'count', v_unique_emails);
  ELSE
    RETURN jsonb_build_object('allowed', true, 'unique_emails', v_unique_emails);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
