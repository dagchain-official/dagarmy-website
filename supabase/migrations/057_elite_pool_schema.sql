-- ============================================================
-- Migration 057: DAG Army Elite Pool Schema
-- ============================================================
-- Creates the Elite Pool infrastructure for DAG LIEUTENANTS.
-- Fund source: 50% of DAGCHAIN blockchain transaction fees.
-- Status: Coming Soon - activates at MainNet launch (Sep-Oct 2026).
-- Membership: All DAG LIEUTENANTs - current and future - forever.
-- No separate members table needed: membership = users.tier = 'DAG_LIEUTENANT'
-- ============================================================

-- ── Config: elite pool settings ──────────────────────────────
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('elite_pool_active',         0,  'Elite Pool active (0=coming soon, 1=active at MainNet)', NOW()),
  ('elite_pool_blockchain_pct', 50, '% of DAGCHAIN transaction fees allocated to Elite Pool', NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- ── Table: elite_pool_distributions ──────────────────────────
-- Stores periodic distribution records once MainNet is live
CREATE TABLE IF NOT EXISTS elite_pool_distributions (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  period            TEXT         NOT NULL,            -- 'YYYY-MM' or 'YYYY-QQ'
  total_chain_fees  DECIMAL(15,2) NOT NULL DEFAULT 0,
  pool_amount       DECIMAL(15,2) NOT NULL DEFAULT 0, -- 50% of chain fees
  member_count      INTEGER      NOT NULL DEFAULT 0,  -- LT count at distribution time
  per_member_amount DECIMAL(15,4) NOT NULL DEFAULT 0,
  status            TEXT         NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'distributed', 'cancelled')),
  distributed_at    TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(period)
);

CREATE INDEX IF NOT EXISTS idx_elite_pool_distributions_period
  ON elite_pool_distributions(period);
CREATE INDEX IF NOT EXISTS idx_elite_pool_distributions_status
  ON elite_pool_distributions(status);

-- ── RLS Policies ─────────────────────────────────────────────
ALTER TABLE elite_pool_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage elite distributions"
  ON elite_pool_distributions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.is_master_admin = TRUE OR users.role = 'admin')
    )
  );

CREATE POLICY "Anyone can view elite distributions"
  ON elite_pool_distributions FOR SELECT
  USING (TRUE);

GRANT ALL ON elite_pool_distributions TO authenticated;

-- ── Verification ──────────────────────────────────────────────
-- SELECT config_key, config_value FROM rewards_config
-- WHERE config_key IN ('elite_pool_active', 'elite_pool_blockchain_pct', 'fortune500_pool_pct', 'fortune500_enrollment_open');
-- SELECT COUNT(*) FROM users WHERE tier = 'DAG_LIEUTENANT'; -- all these are auto Elite members
