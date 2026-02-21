-- =====================================================
-- Migration 028: Activity Logs Table
-- Captures every significant platform event
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type      VARCHAR(80)  NOT NULL,  -- e.g. user_signup, rank_upgrade, sale_paid, points_granted, login, etc.
  category        VARCHAR(40)  NOT NULL,  -- auth | rewards | sales | referral | admin | system
  actor_id        UUID REFERENCES users(id) ON DELETE SET NULL,  -- who triggered it (user or admin)
  actor_email     TEXT,                   -- denormalised for fast display even if user deleted
  actor_name      TEXT,
  target_id       UUID,                   -- affected entity id (user_id, sale_id, etc.)
  target_email    TEXT,
  target_name     TEXT,
  description     TEXT NOT NULL,          -- human-readable summary
  metadata        JSONB DEFAULT '{}',     -- arbitrary extra data (amounts, old/new values, etc.)
  ip_address      TEXT,
  severity        VARCHAR(20) DEFAULT 'info',  -- info | warning | error | critical
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type  ON activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category    ON activity_logs(category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id    ON activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_target_id   ON activity_logs(target_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at  ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_severity    ON activity_logs(severity);

-- ── Auto-log: new user signup ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, target_email, target_name, description, metadata, severity)
  VALUES (
    'user_signup', 'auth',
    NEW.id, NEW.email, NEW.full_name,
    NEW.id, NEW.email, NEW.full_name,
    'New user registered: ' || COALESCE(NEW.full_name, NEW.email, NEW.id::TEXT),
    jsonb_build_object('tier', COALESCE(NEW.tier::TEXT, 'unknown'), 'role', COALESCE(NEW.role::TEXT, 'unknown')),
    'info'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_user_signup ON users;
CREATE TRIGGER trigger_log_user_signup
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION log_user_signup();

-- ── Auto-log: DAG points transaction ──────────────────────────────────────
CREATE OR REPLACE FUNCTION log_points_transaction()
RETURNS TRIGGER AS $$
DECLARE v_name TEXT; v_email TEXT;
BEGIN
  SELECT full_name, email INTO v_name, v_email FROM users WHERE id = NEW.user_id;
  INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, target_email, target_name, description, metadata, severity)
  VALUES (
    CASE
      WHEN NEW.transaction_type = 'rank_burn'   THEN 'points_burned'
      WHEN NEW.transaction_type = 'admin_grant' THEN 'admin_points_grant'
      WHEN NEW.transaction_type = 'sale_points' THEN 'sale_points_granted'
      WHEN NEW.points < 0                       THEN 'points_redeemed'
      ELSE 'points_earned'
    END,
    'rewards',
    NEW.user_id, v_email, v_name,
    NEW.user_id, v_email, v_name,
    COALESCE(NEW.description, NEW.transaction_type) || ' — ' || NEW.points::TEXT || ' pts',
    jsonb_build_object('points', NEW.points, 'transaction_type', NEW.transaction_type, 'transaction_id', NEW.transaction_id),
    'info'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_points_transaction ON points_transactions;
CREATE TRIGGER trigger_log_points_transaction
AFTER INSERT ON points_transactions
FOR EACH ROW EXECUTE FUNCTION log_points_transaction();

-- ── Auto-log: sale paid ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_sale_paid()
RETURNS TRIGGER AS $$
DECLARE v_name TEXT; v_email TEXT;
BEGIN
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status <> 'paid') THEN
    SELECT full_name, email INTO v_name, v_email FROM users WHERE id = NEW.user_id;
    INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, description, metadata, severity)
    VALUES (
      'sale_paid', 'sales',
      NEW.user_id, v_email, v_name,
      NEW.id,
      'Sale marked paid: ' || COALESCE(NEW.product_name, NEW.product_type) || ' — $' || NEW.sale_amount::TEXT || ' (commission $' || NEW.commission_amount::TEXT || ')',
      jsonb_build_object('sale_amount', NEW.sale_amount, 'commission_amount', NEW.commission_amount, 'product_type', NEW.product_type, 'commission_level', NEW.commission_level),
      'info'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_sale_paid ON sales_commissions;
CREATE TRIGGER trigger_log_sale_paid
AFTER INSERT OR UPDATE OF payment_status ON sales_commissions
FOR EACH ROW EXECUTE FUNCTION log_sale_paid();

-- ── Auto-log: rank upgrade ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_rank_upgrade()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_rank IS DISTINCT FROM OLD.current_rank AND NEW.current_rank IS NOT NULL THEN
    INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, description, metadata, severity)
    VALUES (
      'rank_upgrade', 'rewards',
      NEW.id, NEW.email, NEW.full_name,
      NEW.id,
      COALESCE(NEW.full_name, NEW.email) || ' upgraded rank: ' || COALESCE(OLD.current_rank, 'Starter') || ' → ' || NEW.current_rank,
      jsonb_build_object('old_rank', OLD.current_rank, 'new_rank', NEW.current_rank),
      'info'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_rank_upgrade ON users;
CREATE TRIGGER trigger_log_rank_upgrade
AFTER UPDATE OF current_rank ON users
FOR EACH ROW EXECUTE FUNCTION log_rank_upgrade();

GRANT ALL ON activity_logs TO authenticated;
GRANT ALL ON activity_logs TO service_role;
