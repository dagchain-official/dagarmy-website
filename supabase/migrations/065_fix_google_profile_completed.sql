-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 065: Fix profile_completed for all Google-authenticated users
-- 
-- Root cause: Google OAuth callback never set profile_completed = true when
-- creating or updating users, causing Dashboard2.jsx to redirect them back
-- to the landing page after every login.
--
-- This migration patches ALL existing users who:
--   a) logged in via Google (auth_provider = 'google')
--   b) OR who have email_verified = true but profile_completed is still NULL/false
--      (covers edge-cases where other flows also missed this)
-- ─────────────────────────────────────────────────────────────────────────────

-- Fix all Google-authenticated users
UPDATE public.users
SET
    profile_completed = true,
    updated_at        = NOW()
WHERE
    auth_provider = 'google'
    AND (profile_completed IS NULL OR profile_completed = false);

-- Also fix email+password users whose profile IS actually complete
-- (has full_name filled in) but the flag was never set
UPDATE public.users
SET
    profile_completed = true,
    updated_at        = NOW()
WHERE
    (profile_completed IS NULL OR profile_completed = false)
    AND full_name IS NOT NULL
    AND full_name != ''
    AND email IS NOT NULL;

-- Verification query - should return 0 rows after migration
-- SELECT id, email, auth_provider, profile_completed
-- FROM public.users
-- WHERE auth_provider = 'google'
--   AND (profile_completed IS NULL OR profile_completed = false);
