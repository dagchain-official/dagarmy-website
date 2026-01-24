-- Add banner_url column to users table
-- This allows users to have custom banner images on their profile

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.users.banner_url IS 'URL or path to user profile banner image';
