-- Backfill points_transactions for existing users who have points but no transactions
-- This ensures the leaderboard time filters work correctly

INSERT INTO points_transactions (user_id, points, transaction_type, description, created_at)
SELECT 
  id as user_id,
  dag_points as points,
  'signup_bonus' as transaction_type,
  'Backfilled signup bonus' as description,
  created_at
FROM users
WHERE 
  role = 'student' 
  AND dag_points > 0
  AND NOT EXISTS (
    SELECT 1 FROM points_transactions 
    WHERE points_transactions.user_id = users.id
  );

-- Log the backfill
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM users
  WHERE role = 'student' AND dag_points > 0
  AND NOT EXISTS (
    SELECT 1 FROM points_transactions 
    WHERE points_transactions.user_id = users.id
  );
  
  RAISE NOTICE 'Backfilled % users with points transactions', v_count;
END $$;
