-- ============================================================
-- Migration 056: Fortune 500 Pool
-- ============================================================
-- Creates the Fortune 500 incentive pool infrastructure:
--   - fortune500_members: tracks enrolled users
--   - fortune500_distributions: monthly distribution records
--   - daggpt_revenue_reports: DAGGPT revenue pushes
-- Auto-enrolls all existing active users at migration time.
-- New users are auto-enrolled on signup via trigger (while
-- fortune500_enrollment_open = 1 in rewards_config).
-- Entry closes at MainNet launch (admin sets flag to 0).
-- ============================================================

-- ── Table: fortune500_members ─────────────────────────────────
CREATE TABLE IF NOT EXISTS fortune500_members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_fortune500_members_user_id
  ON fortune500_members(user_id);
CREATE INDEX IF NOT EXISTS idx_fortune500_members_is_active
  ON fortune500_members(is_active);

-- ── Table: fortune500_distributions ──────────────────────────
-- Stores the monthly pool payouts
CREATE TABLE IF NOT EXISTS fortune500_distributions (
  id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  period              TEXT         NOT NULL,          -- 'YYYY-MM'
  total_daggpt_revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
  pool_amount         DECIMAL(15,2) NOT NULL DEFAULT 0, -- 10% of revenue
  member_count        INTEGER      NOT NULL DEFAULT 0,
  per_member_amount   DECIMAL(15,4) NOT NULL DEFAULT 0,
  status              TEXT         NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'distributed', 'cancelled')),
  distributed_at      TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(period)
);

CREATE INDEX IF NOT EXISTS idx_fortune500_distributions_period
  ON fortune500_distributions(period);
CREATE INDEX IF NOT EXISTS idx_fortune500_distributions_status
  ON fortune500_distributions(status);

-- ── Table: daggpt_revenue_reports ────────────────────────────
-- Receives revenue pushes from DAGGPT backend
CREATE TABLE IF NOT EXISTS daggpt_revenue_reports (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  report_month      TEXT        NOT NULL UNIQUE, -- 'YYYY-MM'
  total_revenue     DECIMAL(15,2) NOT NULL,
  pool_contribution DECIMAL(15,2) NOT NULL,      -- 10% of total_revenue
  source            TEXT        NOT NULL DEFAULT 'daggpt_api',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS Policies ─────────────────────────────────────────────
ALTER TABLE fortune500_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune500_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daggpt_revenue_reports   ENABLE ROW LEVEL SECURITY;

-- Users can see their own membership
CREATE POLICY "Users see own fortune500 membership"
  ON fortune500_members FOR SELECT
  USING (user_id = auth.uid());

-- Admins can see all
CREATE POLICY "Admins see all fortune500 members"
  ON fortune500_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.is_master_admin = TRUE OR users.role = 'admin')
    )
  );

CREATE POLICY "Admins manage distributions"
  ON fortune500_distributions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.is_master_admin = TRUE OR users.role = 'admin')
    )
  );

CREATE POLICY "Anyone can view distributions"
  ON fortune500_distributions FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins manage revenue reports"
  ON daggpt_revenue_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.is_master_admin = TRUE OR users.role = 'admin')
    )
  );

-- ── Grant permissions ─────────────────────────────────────────
GRANT ALL ON fortune500_members       TO authenticated;
GRANT ALL ON fortune500_distributions TO authenticated;
GRANT ALL ON daggpt_revenue_reports   TO authenticated;

-- ── Config: enrollment is open until MainNet ─────────────────
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('fortune500_enrollment_open', 1, 'Fortune 500 pool enrollment open (1=open, 0=closed at MainNet launch)', NOW()),
  ('fortune500_pool_pct',       10, '% of DAGGPT monthly revenue allocated to Fortune 500 pool',            NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- ── Auto-enroll ALL existing active users ────────────────────
-- Every user active at migration time is automatically enrolled
INSERT INTO fortune500_members (user_id, enrolled_at, is_active)
SELECT
  id,
  NOW(),
  TRUE
FROM users
WHERE role IN ('student', 'trainer', 'user')          -- exclude pure admin accounts
  AND id NOT IN (SELECT user_id FROM fortune500_members) -- idempotent
ON CONFLICT (user_id) DO NOTHING;

-- ── Trigger: auto-enroll new signups while enrollment is open ─
CREATE OR REPLACE FUNCTION auto_enroll_fortune500()
RETURNS TRIGGER AS $$
DECLARE
  v_enrollment_open INTEGER;
BEGIN
  -- Check if enrollment is still open
  SELECT config_value INTO v_enrollment_open
  FROM rewards_config
  WHERE config_key = 'fortune500_enrollment_open';

  IF v_enrollment_open = 1 AND NEW.role IN ('student', 'trainer', 'user') THEN
    INSERT INTO fortune500_members (user_id, enrolled_at, is_active)
    VALUES (NEW.id, NOW(), TRUE)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_enroll_fortune500 ON users;
CREATE TRIGGER trigger_auto_enroll_fortune500
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION auto_enroll_fortune500();

-- ── Verification ──────────────────────────────────────────────
-- SELECT COUNT(*) FROM fortune500_members WHERE is_active = TRUE;
-- SELECT COUNT(*) FROM users WHERE role IN ('student','trainer','user');
-- (both counts should match)

