-- Migration 058: Update commission rates to new tier-based structure
-- DAG Soldier: 15% L1, DAG Lieutenant: 20% L1 (was 7% base)
-- L2: 3%, L3: 2% (unchanged)

-- Update core commission rates
UPDATE rewards_config SET config_value = '15'  WHERE config_key = 'soldier_direct_sales_commission';
UPDATE rewards_config SET config_value = '3'   WHERE config_key = 'soldier_level2_sales_commission';
UPDATE rewards_config SET config_value = '2'   WHERE config_key = 'soldier_level3_sales_commission';

-- Update referral bonuses to new tier-based values
UPDATE rewards_config SET config_value = '500'  WHERE config_key = 'soldier_refers_soldier_join';
UPDATE rewards_config SET config_value = '500'  WHERE config_key = 'soldier_refers_soldier_upgrade';
UPDATE rewards_config SET config_value = '1000' WHERE config_key = 'lieutenant_refers_soldier_join';
UPDATE rewards_config SET config_value = '1000' WHERE config_key = 'lieutenant_refers_soldier_upgrade';

-- Update spend-based point rates
UPDATE rewards_config SET config_value = '25'   WHERE config_key = 'self_sale_dag_points_per_dollar';
UPDATE rewards_config SET config_value = '25'   WHERE config_key = 'referral_sale_dag_points_per_dollar';

-- Social task multiplier: LT gets 100% bonus (2x), was 20%
UPDATE rewards_config SET config_value = '100'  WHERE config_key = 'social_task_lt_bonus_rate';

-- Insert any missing keys that may not exist yet
INSERT INTO rewards_config (config_key, config_value, description) VALUES
  ('soldier_direct_sales_commission',    '15',   'L1 commission % for DAG Soldier')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

INSERT INTO rewards_config (config_key, config_value, description) VALUES
  ('soldier_refers_soldier_join',        '500',  'Pts earned by Soldier referrer when direct joins')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

INSERT INTO rewards_config (config_key, config_value, description) VALUES
  ('soldier_refers_soldier_upgrade',     '500',  'Pts earned by Soldier referrer when direct upgrades to LT')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

INSERT INTO rewards_config (config_key, config_value, description) VALUES
  ('lieutenant_refers_soldier_join',     '1000', 'Pts earned by LT referrer when direct joins')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

INSERT INTO rewards_config (config_key, config_value, description) VALUES
  ('lieutenant_refers_soldier_upgrade',  '1000', 'Pts earned by LT referrer when direct upgrades to LT')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

INSERT INTO rewards_config (config_key, config_value, description) VALUES
  ('social_task_lt_bonus_rate',          '100',  'Bonus % for LT on social tasks (100 = 2x)')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;
