-- Clear Test Data Script
-- WARNING: This will delete ALL user data and related records
-- Use this ONLY in development/testing environments
-- DO NOT run this in production!

-- Clear referral system tables (newest tables first)
DELETE FROM public.referral_stats;
DELETE FROM public.referral_rewards;
DELETE FROM public.referrals;
DELETE FROM public.referral_codes;

-- Clear users table
-- Note: This will NOT delete from auth.users automatically
-- You must manually delete users from Supabase Authentication dashboard
DELETE FROM public.users;

-- Verify cleanup
SELECT 'Users remaining:' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'Referral codes remaining:', COUNT(*) FROM public.referral_codes
UNION ALL
SELECT 'Referrals remaining:', COUNT(*) FROM public.referrals
UNION ALL
SELECT 'Referral rewards remaining:', COUNT(*) FROM public.referral_rewards
UNION ALL
SELECT 'Referral stats remaining:', COUNT(*) FROM public.referral_stats;
