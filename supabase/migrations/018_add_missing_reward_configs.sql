-- Add missing reward configuration entries
-- Run this in Supabase SQL Editor

-- Self signup bonuses
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('soldier_signup_bonus', 500, 'DAG Points awarded to new user on signup (DAG SOLDIER)', NOW()),
('lieutenant_self_upgrade_bonus', 3100, 'Additional DAG Points when user upgrades to DAG LIEUTENANT (total 3600 with signup)', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value, 
  description = EXCLUDED.description, 
  updated_at = NOW();

-- Referral bonuses - Detailed scenarios
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('soldier_refers_soldier_join', 500, 'DAG SOLDIER earns when referring a new DAG SOLDIER (on join)', NOW()),
('soldier_refers_soldier_upgrade', 2500, 'DAG SOLDIER earns extra when their referral upgrades to LIEUTENANT (total 3000)', NOW()),
('lieutenant_refers_soldier_join', 600, 'DAG LIEUTENANT earns when referring a new DAG SOLDIER (on join, 20% bonus)', NOW()),
('lieutenant_refers_soldier_upgrade', 3000, 'DAG LIEUTENANT earns extra when their referral upgrades to LIEUTENANT (total 3600)', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value, 
  description = EXCLUDED.description, 
  updated_at = NOW();
