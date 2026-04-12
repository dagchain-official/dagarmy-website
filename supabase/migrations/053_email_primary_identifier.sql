-- ============================================================
-- Migration 053: Email as Primary Auth Identifier
-- Run AFTER 052. Run in: Supabase Dashboard → SQL Editor → Run  
-- ============================================================

-- 1. Ensure email is indexed for fast auth lookups
CREATE INDEX IF NOT EXISTS idx_users_email_auth ON public.users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_fingerprint ON public.users(fingerprint_id) WHERE fingerprint_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_dagchain ON public.users(dagchain_user_id) WHERE dagchain_user_id IS NOT NULL;

-- 2. Add 'user' to the allowed roles (DAGGPT uses 'user', DAGARMY uses 'student'/'trainer'/'admin')
-- This safely extends the existing check constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check
  CHECK (role IN ('student', 'trainer', 'admin', 'user', 'premium'));

-- 3. Create a view for quick cross-platform user lookup by email
CREATE OR REPLACE VIEW public.users_by_email AS
  SELECT
    id,
    email,
    full_name,
    role,
    is_admin,
    is_active,
    auth_provider,
    google_id,
    wallet_address,
    avatar_url,
    dagchain_user_id,
    daggpt_role,
    fingerprint_id,
    fingerprint_blocked,
    email_verified,
    platform_last_login,
    created_at,
    updated_at
  FROM public.users
  WHERE email IS NOT NULL;

-- 4. Helper function: upsert user by email (used by all platforms on SSO login)
CREATE OR REPLACE FUNCTION upsert_user_by_email(
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_auth_provider TEXT DEFAULT 'email',
  p_google_id TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'user',
  p_platform TEXT DEFAULT 'dagarmy',
  p_fingerprint_id TEXT DEFAULT NULL
)
RETURNS public.users AS $$
DECLARE
  v_user public.users;
BEGIN
  -- Try to find existing user
  SELECT * INTO v_user FROM public.users WHERE email = LOWER(TRIM(p_email));

  IF v_user.id IS NULL THEN
    -- Create new user
    INSERT INTO public.users (
      email, full_name, avatar_url, auth_provider, google_id,
      role, email_verified, fingerprint_id, is_active
    )
    VALUES (
      LOWER(TRIM(p_email)),
      p_full_name,
      p_avatar_url,
      p_auth_provider,
      p_google_id,
      p_role,
      CASE WHEN p_auth_provider IN ('google') THEN true ELSE false END,
      p_fingerprint_id,
      true
    )
    RETURNING * INTO v_user;
  ELSE
    -- Update existing user with any new info
    UPDATE public.users SET
      full_name = COALESCE(p_full_name, full_name),
      avatar_url = COALESCE(p_avatar_url, avatar_url),
      google_id = COALESCE(p_google_id, google_id),
      email_verified = CASE WHEN p_auth_provider = 'google' THEN true ELSE email_verified END,
      fingerprint_id = COALESCE(p_fingerprint_id, fingerprint_id),
      updated_at = NOW(),
      platform_last_login = platform_last_login || jsonb_build_object(p_platform, NOW()::TEXT)
    WHERE id = v_user.id
    RETURNING * INTO v_user;
  END IF;

  RETURN v_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Function: record platform login timestamp
CREATE OR REPLACE FUNCTION record_platform_login(p_user_id UUID, p_platform TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET platform_last_login = platform_last_login || jsonb_build_object(p_platform, NOW()::TEXT),
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Done! Summary of what this migration adds:
-- - email is now properly indexed as auth lookup key
-- - 'user' and 'premium' added to allowed roles (for DAGGPT users)
-- - users_by_email view for quick cross-platform lookups
-- - upsert_user_by_email() function (used by SSO validate routes)
-- - record_platform_login() function (audit trail)
