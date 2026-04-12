-- ============================================================
-- Migration 055: Update Reward Config — New Tier-Based System
-- ============================================================
-- Removes old referral/commission configs and inserts the new
-- simplified tier-only reward values.
-- ============================================================

-- ── Step 1: Remove old configs that no longer apply ──────────
DELETE FROM rewards_config
WHERE config_key IN (
  -- Old referral configs (being replaced with new values below)
  'soldier_refers_soldier_join',
  'soldier_refers_soldier_upgrade',
  'lieutenant_refers_soldier_join',
  'lieutenant_refers_soldier_upgrade',
  -- Old commission configs (being replaced)
  'soldier_direct_sales_commission',
  'lieutenant_direct_sales_commission_default',
  'lieutenant_level2_sales_commission',
  'lieutenant_level3_sales_commission',
  'soldier_level2_sales_commission',
  'soldier_level3_sales_commission',
  -- Old incentive pool configs (pools removed)
  'incentive_discretionary_pool_pct',
  'incentive_discretionary_sales_threshold',
  'incentive_discretionary_enabled',
  'incentive_lifestyle_pool_pct',
  'incentive_lifestyle_sales_threshold',
  'incentive_lifestyle_enabled',
  'incentive_executive_pool_pct',
  'incentive_executive_sales_threshold',
  'incentive_executive_enabled',
  'incentive_elite_pool_pct',
  'incentive_elite_min_referrals',
  'incentive_elite_enabled',
  'max_commission_levels'
);

-- ── Step 2: Upsert all new reward config values ───────────────

-- Self bonuses
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('soldier_signup_bonus',    500, 'DAG Points awarded to new DAG SOLDIER on signup',    NOW()),
  ('lieutenant_upgrade_bonus', 0,  'DAG Points awarded on LT upgrade — intentionally 0',  NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- Referral join bonuses (referrer earns when their referral signs up)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('soldier_refers_join',    500,  'DAG SOLDIER earns when their direct referral joins as DAG SOLDIER',    NOW()),
  ('lieutenant_refers_join', 1000, 'DAG LIEUTENANT earns when their direct referral joins as DAG SOLDIER', NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- Referral upgrade bonuses (referrer earns when their referral upgrades to LT)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('soldier_refers_upgrade',    500,  'DAG SOLDIER earns when their referral upgrades to DAG LIEUTENANT',    NOW()),
  ('lieutenant_refers_upgrade', 1000, 'DAG LIEUTENANT earns when their referral upgrades to DAG LIEUTENANT', NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- Spend-based DAG Points (referrer earns per $1 spent by their direct referral)
-- Applies to: Validator Nodes, Storage Nodes, LT upgrade ($149), DAGGPT credits
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('spend_pts_per_dollar_soldier',    25, 'DAG Points earned per $1 spent by direct referral (referrer = DAG SOLDIER)',    NOW()),
  ('spend_pts_per_dollar_lieutenant', 50, 'DAG Points earned per $1 spent by direct referral (referrer = DAG LIEUTENANT)', NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- USD sales commissions (flat tier-based, no rank adjustments)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('soldier_l1_commission_pct',    15, 'DAG SOLDIER direct (L1) USD sales commission %',                   NOW()),
  ('lieutenant_l1_commission_pct', 20, 'DAG LIEUTENANT direct (L1) USD sales commission %',                NOW()),
  ('l2_commission_pct',             3, 'Level 2 USD sales commission % (both tiers)',                      NOW()),
  ('l3_commission_pct',             2, 'Level 3 USD sales commission % (both tiers)',                      NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- Task multiplier for Lieutenants
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('task_multiplier_lieutenant', 2, 'Multiplier applied to base task points for DAG LIEUTENANT (vs 1x for DAG SOLDIER)', NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();

-- ── Verification query ────────────────────────────────────────
-- SELECT config_key, config_value, description FROM rewards_config ORDER BY config_key;
