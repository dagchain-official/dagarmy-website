-- Migration 041: DAG LT Pool tables
-- Creates dag_lt_pool_members and dag_lt_pool_distributions tables.
-- Eligibility: LT who self-upgraded + 3 direct referrals upgraded to LT within 30 days.
-- Pool source: 10% of monthly DAGGPT revenue (split alongside Fortune 500 10%).

-- ── dag_lt_pool_members ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dag_lt_pool_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active       boolean NOT NULL DEFAULT true,
  qualified_at    timestamptz,
  enrolled_at     timestamptz NOT NULL DEFAULT now(),
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE dag_lt_pool_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on dag_lt_pool_members"
  ON dag_lt_pool_members FOR ALL
  USING (auth.role() = 'service_role');

-- ── dag_lt_pool_distributions ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dag_lt_pool_distributions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period                text NOT NULL,                -- e.g. '2025-06'
  total_daggpt_revenue  numeric(14,2) NOT NULL DEFAULT 0,
  pool_amount           numeric(14,2) NOT NULL DEFAULT 0,
  member_count          integer NOT NULL DEFAULT 0,
  per_member_amount     numeric(14,6) NOT NULL DEFAULT 0,
  status                text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','distributed','cancelled')),
  distributed_at        timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE(period)
);

ALTER TABLE dag_lt_pool_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on dag_lt_pool_distributions"
  ON dag_lt_pool_distributions FOR ALL
  USING (auth.role() = 'service_role');

-- ── rewards_config: add dag_lt_pool_pct if missing ──────────────────────────
INSERT INTO rewards_config (config_key, config_value, description, updated_at)
VALUES ('dag_lt_pool_pct', '10', '% of monthly DAGGPT revenue allocated to the DAG LT Pool', now())
ON CONFLICT (config_key) DO NOTHING;

-- ── updated_at triggers ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS dag_lt_pool_members_updated_at ON dag_lt_pool_members;
CREATE TRIGGER dag_lt_pool_members_updated_at
  BEFORE UPDATE ON dag_lt_pool_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS dag_lt_pool_distributions_updated_at ON dag_lt_pool_distributions;
CREATE TRIGGER dag_lt_pool_distributions_updated_at
  BEFORE UPDATE ON dag_lt_pool_distributions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_dag_lt_pool_members_user_id ON dag_lt_pool_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dag_lt_pool_members_is_active ON dag_lt_pool_members(is_active);
CREATE INDEX IF NOT EXISTS idx_dag_lt_pool_distributions_period ON dag_lt_pool_distributions(period);
CREATE INDEX IF NOT EXISTS idx_dag_lt_pool_distributions_status ON dag_lt_pool_distributions(status);
