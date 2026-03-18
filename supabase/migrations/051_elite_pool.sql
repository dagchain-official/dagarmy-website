-- ============================================================
-- Migration 051: DAG Army Elite Pool Configuration
-- ============================================================
-- Elite Pool: 2% of total global revenue distributed equally
-- among all members who have directly introduced at least 25
-- active users (users who joined AND purchased/subscribed to
-- any DAG Army product).
-- ============================================================

INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('incentive_elite_pool_pct',        2,  '2% of total global revenue allocated to DAG Army Elite Pool', NOW()),
('incentive_elite_min_referrals',   25, 'Minimum active referrals (paid/subscribed) required to qualify for Elite Pool', NOW()),
('incentive_elite_enabled',         1,  'Enable/disable DAG Army Elite Pool (1=enabled, 0=disabled)', NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();
