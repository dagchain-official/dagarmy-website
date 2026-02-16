-- ============================================================
-- Migration 024: Soldier Multi-Level Sales Commissions
-- ============================================================
-- Sales commissions now apply to BOTH DAG SOLDIER and DAG
-- LIEUTENANT tiers. Soldiers get Level 1 (direct), Level 2,
-- and Level 3 commissions just like Lieutenants.
-- ============================================================

-- Update Soldier direct sales to 7% (was 3% in migration 017) + add Level 2 & 3
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('soldier_direct_sales_commission', 7, 'DAG SOLDIER direct sales commission % (Level 1)', NOW()),
('soldier_level2_sales_commission', 3, 'DAG SOLDIER Level 2 sales commission % (2nd level downline)', NOW()),
('soldier_level3_sales_commission', 2, 'DAG SOLDIER Level 3 sales commission % (3rd level downline)', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();
