-- ============================================================
-- Migration 022: Social Media Task Reward Config Keys
-- ============================================================
-- Default DAG Point values for social media task categories.
-- DAG SOLDIER gets base points.
-- DAG LIEUTENANT gets base + 20% LT bonus.
-- Ranked LT members get additional rank % bonus on base.
-- These are editable from the admin Rewards Engine.
-- ============================================================

-- Social task base DAG Points per category
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('social_task_like_share', 10, 'DAG Points for Like & Share task', NOW()),
('social_task_comments_watch', 10, 'DAG Points for Comments & Watch Video task', NOW()),
('social_task_create_shorts', 50, 'DAG Points for Create Shorts task', NOW()),
('social_task_explainer_video', 100, 'DAG Points for Explainer Video (min 3min) task', NOW()),
('social_task_subscribe', 150, 'DAG Points for Subscribe to Channel task', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- LT bonus rate for social tasks (defaults to same as lieutenant_bonus_rate)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('social_task_lt_bonus_rate', 20, 'Extra % bonus for DAG LIEUTENANT on social task points', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();
