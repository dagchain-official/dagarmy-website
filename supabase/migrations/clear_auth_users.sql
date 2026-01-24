-- Clear ALL User Data (Complete Reset)
-- WARNING: This will delete ALL users and related data
-- Use ONLY in development/testing

-- Step 1: Clear all referral data
DELETE FROM public.referral_stats;
DELETE FROM public.referral_rewards;
DELETE FROM public.referrals;
DELETE FROM public.referral_codes;

-- Step 2: Clear public users
DELETE FROM public.users;

-- Step 3: Clear auth users (may require admin privileges)
-- If this fails, manually delete users from:
-- Supabase Dashboard → Authentication → Users → Select All → Delete
DELETE FROM auth.users;

-- Verify cleanup
SELECT 'Public users:' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'Auth users:', COUNT(*) FROM auth.users
UNION ALL
SELECT 'Referral codes:', COUNT(*) FROM public.referral_codes
UNION ALL
SELECT 'Referrals:', COUNT(*) FROM public.referrals;

-- IMPORTANT: After running this script, also:
-- 1. Clear your browser cookies/local storage
-- 2. Disconnect your wallet (if using wallet connect)
-- 3. Refresh the page
-- 4. Try signing up again
