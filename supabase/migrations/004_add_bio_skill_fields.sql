-- Migration: Add bio and skill/occupation fields
-- Created: 2026-01-24
-- Description: Add bio and skill_occupation fields to users table

-- Add new columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skill_occupation VARCHAR(255);

-- Add comment
COMMENT ON COLUMN users.bio IS 'User biography or description';
COMMENT ON COLUMN users.skill_occupation IS 'User skill or occupation';
