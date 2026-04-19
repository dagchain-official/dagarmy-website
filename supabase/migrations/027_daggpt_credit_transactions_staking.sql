-- Migration 027: Add staking perk columns to DAGGPT's credit_transactions table
-- (DAGGPT uses the same Supabase DB as DAGARMY - billing data lives here)
-- Run in Supabase SQL Editor

ALTER TABLE credit_transactions
  ADD COLUMN IF NOT EXISTS staking_duration   INT         DEFAULT NULL,  -- years: 1 | 2 | 3
  ADD COLUMN IF NOT EXISTS staking_apy        INT         DEFAULT NULL,  -- %: 12 | 18 | 24
  ADD COLUMN IF NOT EXISTS staking_claimed_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_credit_transactions_staking ON credit_transactions (staking_claimed_at)
  WHERE staking_claimed_at IS NULL;
