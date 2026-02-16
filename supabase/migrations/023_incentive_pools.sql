-- ============================================================
-- Migration 023: Incentive Pool Configuration
-- ============================================================
-- Three incentive pool programs:
-- 1. Discretionary Incentive (Monthly) - 3% of net revenue pool
--    Qualification: $1000 direct sales in a month (fresh count)
-- 2. Lifestyle Bonus (Monthly) - 3% of net revenue pool
--    Car/Travel/Home allowance
--    Qualification: $2000 direct sales in a month
-- 3. Executive Performance Incentive (Quarterly) - 2% of revenue
--    Qualification: $10000 direct sales in a quarter
-- All thresholds and pool percentages are editable from admin.
-- ============================================================

-- Discretionary Incentive (Monthly)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('incentive_discretionary_pool_pct', 3, 'Discretionary Incentive pool % of company net revenue (monthly)', NOW()),
('incentive_discretionary_sales_threshold', 1000, 'Min direct sales ($) in a month to qualify for Discretionary Incentive', NOW()),
('incentive_discretionary_enabled', 1, 'Enable/disable Discretionary Incentive pool (1=enabled, 0=disabled)', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Lifestyle Bonus (Monthly)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('incentive_lifestyle_pool_pct', 3, 'Lifestyle Bonus pool % of company net revenue (monthly)', NOW()),
('incentive_lifestyle_sales_threshold', 2000, 'Min direct sales ($) in a month to qualify for Lifestyle Bonus', NOW()),
('incentive_lifestyle_enabled', 1, 'Enable/disable Lifestyle Bonus pool (1=enabled, 0=disabled)', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Executive Performance Incentive (Quarterly)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('incentive_executive_pool_pct', 2, 'Executive Performance pool % of company revenue (quarterly)', NOW()),
('incentive_executive_sales_threshold', 10000, 'Min direct sales ($) in a quarter to qualify for Executive Performance Incentive', NOW()),
('incentive_executive_enabled', 1, 'Enable/disable Executive Performance Incentive pool (1=enabled, 0=disabled)', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();
