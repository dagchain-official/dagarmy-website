-- Migration 021: Add email_signature to admin_users
ALTER TABLE admin_roles
  ADD COLUMN IF NOT EXISTS email_signature TEXT DEFAULT NULL;

COMMENT ON COLUMN admin_roles.email_signature IS 'HTML email signature for the admin, auto-appended to composed emails';
