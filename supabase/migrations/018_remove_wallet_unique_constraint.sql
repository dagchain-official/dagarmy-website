-- Migration: Remove wallet_address unique constraint and make email the primary identifier
-- This allows users to have multiple wallet addresses or change wallets
-- Email becomes the stable, unique identifier for users

-- Step 1: Drop the unique constraint on wallet_address
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_wallet_address_key;

-- Step 2: Make wallet_address nullable (if not already)
ALTER TABLE users ALTER COLUMN wallet_address DROP NOT NULL;

-- Step 3: Ensure email has unique constraint (should already exist)
-- This makes email the primary unique identifier
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_email_key'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;
END $$;

-- Step 4: Add index on wallet_address for faster lookups (non-unique)
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Step 5: Add comment explaining the change
COMMENT ON COLUMN users.wallet_address IS 'Wallet address from Reown/Web3 provider. Not unique as users may have multiple wallets or change wallets. Email is the primary unique identifier.';
COMMENT ON COLUMN users.email IS 'Primary unique identifier for users. Required for all users.';
