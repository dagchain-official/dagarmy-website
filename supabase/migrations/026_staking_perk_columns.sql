-- Migration 026: Add staking perk columns for DAGChain integration
-- Run in Supabase SQL Editor

-- 1. users table: track when LT upgrade staking perk was claimed (null = unclaimed)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS staking_perk_claimed_at TIMESTAMPTZ DEFAULT NULL;

-- 2. dgcc_transfers table: store staking selection for daggpt-bound transfers
ALTER TABLE dgcc_transfers
  ADD COLUMN IF NOT EXISTS staking_duration   INT DEFAULT NULL,  -- years: 1 | 2 | 3
  ADD COLUMN IF NOT EXISTS staking_apy        INT DEFAULT NULL,  -- %: 12 | 18 | 24
  ADD COLUMN IF NOT EXISTS staking_claimed_at TIMESTAMPTZ DEFAULT NULL;

-- Indexes for quick lookup
CREATE INDEX IF NOT EXISTS idx_users_staking_perk ON users (staking_perk_claimed_at)
  WHERE staking_perk_claimed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_dgcc_transfers_staking ON dgcc_transfers (staking_claimed_at)
  WHERE staking_claimed_at IS NULL;
