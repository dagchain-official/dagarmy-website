-- =====================================================
-- FIX REWARD POINT BIFURCATIONS
-- =====================================================
-- Corrects the reward config values to match the proper bifurcation logic:
--
-- SIGNUP BONUSES:
--   DAG SOLDIER: 500 DAG Points (on signup)
--   DAG LIEUTENANT upgrade: 500 (already received) + 2500 (base upgrade) + 500 (20% bonus on 2500) = 3500 total
--     So lieutenant_self_upgrade_bonus = 3000 (2500 + 500 bonus, since 500 signup already credited)
--
-- REFERRAL REWARDS (to the REFERRER / upline):
--   Scenario 1: SOLDIER refers SOLDIER (on join) = 500 pts
--   Scenario 2: SOLDIER refers SOLDIER (referral upgrades to LT) = +2500 pts (total 3000 from this referral)
--   Scenario 3: LIEUTENANT refers SOLDIER (on join) = 500 + 100 (20% bonus) = 600 pts
--   Scenario 4: LIEUTENANT refers SOLDIER (referral upgrades to LT) = +2500 + 500 (20% bonus) = +3000 pts (total 3600 from this referral)

-- Fix Self Signup / Upgrade bonuses
UPDATE rewards_config 
SET config_value = 500, 
    description = 'DAG Points awarded to new user on signup as DAG SOLDIER',
    updated_at = NOW()
WHERE config_key = 'soldier_signup_bonus';

UPDATE rewards_config 
SET config_value = 3000, 
    description = 'Additional DAG Points on upgrade to DAG LIEUTENANT (2500 base + 500 as 20% bonus). Total with signup: 500 + 3000 = 3500',
    updated_at = NOW()
WHERE config_key = 'lieutenant_self_upgrade_bonus';

-- Fix Referral scenario values
UPDATE rewards_config 
SET config_value = 500, 
    description = 'Scenario 1: DAG SOLDIER earns 500 pts when their referral joins as DAG SOLDIER',
    updated_at = NOW()
WHERE config_key = 'soldier_refers_soldier_join';

UPDATE rewards_config 
SET config_value = 2500, 
    description = 'Scenario 2: DAG SOLDIER earns additional 2500 pts when their referred SOLDIER upgrades to LIEUTENANT. Total from this referral: 500 (join) + 2500 (upgrade) = 3000',
    updated_at = NOW()
WHERE config_key = 'soldier_refers_soldier_upgrade';

UPDATE rewards_config 
SET config_value = 600, 
    description = 'Scenario 3: DAG LIEUTENANT earns 600 pts (500 + 100 as 20% bonus) when their referral joins as DAG SOLDIER',
    updated_at = NOW()
WHERE config_key = 'lieutenant_refers_soldier_join';

UPDATE rewards_config 
SET config_value = 3000, 
    description = 'Scenario 4: DAG LIEUTENANT earns additional 3000 pts (2500 + 500 as 20% bonus) when their referred SOLDIER upgrades to LIEUTENANT. Total from this referral: 600 (join) + 3000 (upgrade) = 3600',
    updated_at = NOW()
WHERE config_key = 'lieutenant_refers_soldier_upgrade';

-- Add new config keys for bifurcation base values (used for display breakdowns)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('lieutenant_upgrade_base', 2500, 'Base DAG Points for upgrading to DAG LIEUTENANT (before 20% bonus)', NOW()),
('lieutenant_bonus_rate', 20, 'Percentage bonus rate for DAG LIEUTENANT tier on all point earnings', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- =====================================================
-- UPDATE upgrade_to_lieutenant FUNCTION
-- Now records bifurcated transactions (base + bonus separately)
-- =====================================================
CREATE OR REPLACE FUNCTION upgrade_to_lieutenant(
  p_user_id UUID,
  p_payment_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_upgrade_base INTEGER;
  v_bonus_rate INTEGER;
  v_bonus_amount INTEGER;
BEGIN
  -- Get upgrade base and bonus rate from config
  SELECT config_value INTO v_upgrade_base 
  FROM rewards_config 
  WHERE config_key = 'lieutenant_upgrade_base';

  SELECT config_value INTO v_bonus_rate 
  FROM rewards_config 
  WHERE config_key = 'lieutenant_bonus_rate';

  v_bonus_amount := (v_upgrade_base * v_bonus_rate) / 100;

  -- Update user tier
  UPDATE users 
  SET 
    tier = 'DAG_LIEUTENANT',
    upgraded_at = NOW(),
    upgrade_payment_id = p_payment_id
  WHERE id = p_user_id AND tier = 'DAG_SOLDIER';
  
  -- Record base upgrade points as separate transaction
  PERFORM add_dag_points(
    p_user_id, 
    v_upgrade_base, 
    'upgrade_bonus_base',
    'DAG LIEUTENANT upgrade - Base bonus (2500 DAG Points)',
    p_payment_id
  );

  -- Record 20% bonus as separate transaction
  PERFORM add_dag_points(
    p_user_id, 
    v_bonus_amount, 
    'upgrade_bonus_lieutenant_bonus',
    'DAG LIEUTENANT upgrade - 20% Bonus on 2500 (500 DAG Points)',
    p_payment_id
  );
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION upgrade_to_lieutenant TO authenticated;
