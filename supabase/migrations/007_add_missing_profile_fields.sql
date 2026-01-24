-- Add all missing profile fields to users table
-- This migration adds columns that are needed for the complete profile functionality

-- Add missing columns if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS skill_occupation TEXT;

-- Make sure wallet_address has unique constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_wallet_address_key'
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT users_wallet_address_key UNIQUE (wallet_address);
    END IF;
END $$;

-- Make sure email has unique constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_email_key'
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN public.users.wallet_address IS 'User blockchain wallet address (primary identifier)';
COMMENT ON COLUMN public.users.email IS 'User email address';
COMMENT ON COLUMN public.users.full_name IS 'User full name (deprecated - use first_name and last_name)';
COMMENT ON COLUMN public.users.role IS 'User role: student, trainer, or admin';
COMMENT ON COLUMN public.users.avatar_url IS 'URL or path to user profile picture';
COMMENT ON COLUMN public.users.banner_url IS 'URL or path to user profile banner image';
COMMENT ON COLUMN public.users.bio IS 'User biography/about text';
COMMENT ON COLUMN public.users.social_links IS 'JSON object containing social media links (facebook, x, linkedin, instagram, github, website)';
COMMENT ON COLUMN public.users.skill_occupation IS 'User skill or occupation title';
COMMENT ON COLUMN public.users.first_name IS 'User first name';
COMMENT ON COLUMN public.users.last_name IS 'User last name';
COMMENT ON COLUMN public.users.user_provided_email IS 'Email provided by user (may differ from auth email)';
COMMENT ON COLUMN public.users.country_code IS 'WhatsApp country code (e.g., +91)';
COMMENT ON COLUMN public.users.whatsapp_number IS 'WhatsApp phone number';
COMMENT ON COLUMN public.users.profile_completed IS 'Whether user has completed their profile';
COMMENT ON COLUMN public.users.auth_provider IS 'Authentication provider: google, facebook, apple, email, wallet';
