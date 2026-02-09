-- Migration: Admin Credential-Based Authentication System
-- Separates admin authentication (email/password) from student authentication (Reown/OAuth)
-- This provides better security and control for internal team member access

-- Step 1: Add password and auth method columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'reown' CHECK (auth_method IN ('reown', 'credentials', 'both'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT false;

-- Step 2: Create admin login sessions table for tracking
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create admin login attempts log for security
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_auth_method ON users(auth_method);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_email ON admin_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_created_at ON admin_login_attempts(created_at);

-- Step 5: Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Step 6: Function to reset failed login attempts after successful login
CREATE OR REPLACE FUNCTION reset_failed_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.failed_login_attempts = 0 THEN
    NEW.account_locked_until = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for failed login reset
DROP TRIGGER IF EXISTS reset_failed_attempts ON users;
CREATE TRIGGER reset_failed_attempts
  BEFORE UPDATE ON users
  FOR EACH ROW
  WHEN (NEW.failed_login_attempts = 0 AND OLD.failed_login_attempts > 0)
  EXECUTE FUNCTION reset_failed_login_attempts();

-- Step 8: Add comments for documentation
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password for credential-based admin authentication. NULL for Reown/OAuth users.';
COMMENT ON COLUMN users.auth_method IS 'Authentication method: reown (students), credentials (admins), or both';
COMMENT ON COLUMN users.last_password_change IS 'Timestamp of last password change for security tracking';
COMMENT ON COLUMN users.force_password_change IS 'Force user to change password on next login (for temporary passwords)';
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for failed login attempts. Resets to 0 on successful login.';
COMMENT ON COLUMN users.account_locked_until IS 'Account locked until this timestamp after too many failed attempts';
COMMENT ON TABLE admin_sessions IS 'Active admin login sessions with expiration tracking';
COMMENT ON TABLE admin_login_attempts IS 'Audit log of all admin login attempts for security monitoring';

-- Step 9: Create a scheduled job to clean up expired sessions (optional - can be done via cron)
-- This is a placeholder - actual implementation depends on your Supabase plan
-- You can run this manually or set up a cron job
-- SELECT cleanup_expired_admin_sessions();
