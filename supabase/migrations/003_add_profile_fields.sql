-- Migration: Add profile completion fields
-- Created: 2026-01-24
-- Description: Add fields for first name, last name, user-provided email, country code, and WhatsApp number

-- Add new columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS user_provided_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Update full_name to be computed from first_name and last_name (optional, for convenience)
-- You can keep the existing full_name column for the username from social login

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_user_provided_email ON users(user_provided_email);
CREATE INDEX IF NOT EXISTS idx_users_profile_completed ON users(profile_completed);

-- Add comment to clarify the difference between email fields
COMMENT ON COLUMN users.email IS 'Email from social login provider (Google, GitHub, etc.)';
COMMENT ON COLUMN users.user_provided_email IS 'Email address provided by user in profile completion form (may differ from social login email)';
