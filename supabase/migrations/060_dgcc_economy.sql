-- ═══════════════════════════════════════════════════════
-- Migration 060: DGCC Coin Economy
-- Run this in Supabase SQL Editor (dagarmy project)
-- ═══════════════════════════════════════════════════════

-- 1. Add dgcc_balance to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS dgcc_balance NUMERIC DEFAULT 0;

-- 2. Create point_redemptions table (if not already exists)
CREATE TABLE IF NOT EXISTS point_redemptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  redemption_type TEXT NOT NULL DEFAULT 'dgcc',
  points_spent    INTEGER NOT NULL,
  output_amount   NUMERIC NOT NULL,
  output_unit     TEXT NOT NULL DEFAULT 'coin',
  status          TEXT NOT NULL DEFAULT 'completed',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create dgcc_transfers table (tracks transfers to DAGGPT & DAGChain)
CREATE TABLE IF NOT EXISTS dgcc_transfers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination     TEXT NOT NULL CHECK (destination IN ('daggpt', 'dagchain')),
  amount          NUMERIC NOT NULL,
  status          TEXT NOT NULL DEFAULT 'completed',
  webhook_status  TEXT DEFAULT 'pending',  -- 'pending', 'delivered', 'failed'
  webhook_payload JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Seed dgcc_points_ratio in rewards_config (2500 pts = 1 DGCC)
INSERT INTO rewards_config (config_key, config_value, updated_at)
VALUES ('dgcc_points_ratio', '2500', NOW())
ON CONFLICT (config_key) DO UPDATE SET config_value = '2500', updated_at = NOW();

-- 5. Remove old daggpt redemption type if seeded
DELETE FROM rewards_config WHERE config_key = 'daggpt_credits_ratio';

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dgcc_transfers_user ON dgcc_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_point_redemptions_user ON point_redemptions(user_id);
