-- Grant 500 DAG Points to all existing users who don't have points yet
-- This is a one-time migration to reward existing users

DO $$
DECLARE
  v_signup_bonus INTEGER;
  v_user RECORD;
BEGIN
  -- Get the signup bonus value from config
  SELECT config_value INTO v_signup_bonus 
  FROM rewards_config 
  WHERE config_key = 'signup_bonus';

  -- If config doesn't exist yet, use default 500
  IF v_signup_bonus IS NULL THEN
    v_signup_bonus := 500;
  END IF;

  -- Loop through all existing users who are students and have 0 points
  FOR v_user IN 
    SELECT id 
    FROM users 
    WHERE role = 'student' 
    AND (dag_points = 0 OR dag_points IS NULL)
  LOOP
    -- Award signup bonus points
    PERFORM add_dag_points(
      v_user.id,
      v_signup_bonus,
      'signup_bonus',
      'Retroactive signup bonus for existing user',
      NULL
    );
    
    RAISE NOTICE 'Awarded % points to user %', v_signup_bonus, v_user.id;
  END LOOP;

  RAISE NOTICE 'Completed awarding signup bonuses to existing users';
END $$;
