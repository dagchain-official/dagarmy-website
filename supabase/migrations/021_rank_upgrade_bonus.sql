-- ============================================================
-- Migration 021: Rank-Based DAG Point Upgrade Bonuses
-- ============================================================
-- Adds "% upgrades Achieved on DAG Points" config keys.
-- When a ranked DAG LIEUTENANT earns referral points, they get
-- an additional percentage bonus on the BASE credit amount.
-- E.g. INITIATOR (10%) on 500 base = +50 extra DAG Points.
-- The bonus applies to base referral credits only, NOT to the
-- existing 20% LT bonus.
-- ============================================================

-- Rank upgrade bonus percentages (applied to base referral credits)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('rank_upgrade_bonus_initiator', 10, 'Rank bonus % on base DAG Points for INITIATOR', NOW()),
('rank_upgrade_bonus_vanguard', 20, 'Rank bonus % on base DAG Points for VANGUARD', NOW()),
('rank_upgrade_bonus_guardian', 30, 'Rank bonus % on base DAG Points for GUARDIAN', NOW()),
('rank_upgrade_bonus_striker', 40, 'Rank bonus % on base DAG Points for STRIKER', NOW()),
('rank_upgrade_bonus_invoker', 50, 'Rank bonus % on base DAG Points for INVOKER', NOW()),
('rank_upgrade_bonus_commander', 60, 'Rank bonus % on base DAG Points for COMMANDER', NOW()),
('rank_upgrade_bonus_champion', 70, 'Rank bonus % on base DAG Points for CHAMPION', NOW()),
('rank_upgrade_bonus_conqueror', 80, 'Rank bonus % on base DAG Points for CONQUEROR', NOW()),
('rank_upgrade_bonus_paragon', 90, 'Rank bonus % on base DAG Points for PARAGON', NOW()),
('rank_upgrade_bonus_mythic', 100, 'Rank bonus % on base DAG Points for MYTHIC', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();
