-- Migration: Add auth_provider field
-- Created: 2026-01-24
-- Description: Add auth_provider field to track how users authenticated (google, github, email, wallet, etc.)

-- Add auth_provider column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50);

-- Add comment
COMMENT ON COLUMN users.auth_provider IS 'Authentication provider used (google, github, facebook, x, discord, email, wallet, etc.)';
