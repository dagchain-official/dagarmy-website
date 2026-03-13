-- =====================================================
-- FIX SIGNUP BONUS TRIGGER
-- =====================================================
-- Migration 033 (security_hardening) dropped the award_signup_bonus function
-- with CASCADE, which also dropped the trigger_award_signup_bonus trigger.
-- The function was recreated but the trigger was never restored.
-- This migration recreates the trigger so DAG points are awarded on signup.
--
-- Also ensures soldier_signup_bonus config key exists with correct value.
-- =====================================================

-- Ensure the config key exists (in case of fresh DB or missing row)
INSERT INTO rewards_config (config_key, config_value, description, updated_at)
VALUES ('soldier_signup_bonus', 500, 'DAG Points awarded to new user on signup as DAG SOLDIER', NOW())
ON CONFLICT (config_key) DO NOTHING;

-- =====================================================
-- BACKFILL: Award signup bonus to existing users who never received it
-- =====================================================
-- Targets all student-role users who have no 'signup_bonus' transaction yet
DO $$
DECLARE
  v_bonus INTEGER;
  v_user RECORD;
BEGIN
  SELECT COALESCE(config_value, 500) INTO v_bonus
  FROM rewards_config
  WHERE config_key = 'soldier_signup_bonus';

  FOR v_user IN
    SELECT id FROM users
    WHERE role = 'student'
      AND id NOT IN (
        SELECT DISTINCT user_id FROM points_transactions
        WHERE transaction_type = 'signup_bonus'
      )
  LOOP
    PERFORM add_dag_points(
      v_user.id,
      COALESCE(v_bonus, 500),
      'signup_bonus',
      'Welcome bonus for joining DAGARMY (backfilled)',
      NULL
    );
  END LOOP;
END $$;

-- =====================================================
-- Recreate the trigger (function already exists from migration 033)
-- =====================================================
DROP TRIGGER IF EXISTS trigger_award_signup_bonus ON users;
CREATE TRIGGER trigger_award_signup_bonus
  AFTER INSERT ON users
  FOR EACH ROW
  WHEN (NEW.role = 'student')
  EXECUTE FUNCTION award_signup_bonus();
