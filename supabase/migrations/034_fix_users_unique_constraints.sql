-- Migration: Fix users table unique constraints for profile completion upsert
-- The complete-profile API uses ON CONFLICT which requires a unique constraint to exist.
-- email is the primary unique identifier; wallet_address is intentionally non-unique.

-- Ensure email unique constraint exists (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.users'::regclass
      AND conname = 'users_email_key'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;
