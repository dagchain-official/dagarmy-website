-- Remove user_provided_email column from users table
-- Email is now captured from social login/wallet authentication only

ALTER TABLE users DROP COLUMN IF EXISTS user_provided_email;
