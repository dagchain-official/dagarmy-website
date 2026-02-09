-- Run this in your Supabase SQL Editor to backfill points_transactions
-- This creates transaction data spread across the last 4 weeks and 3 months for testing

-- Get all students with points but no transactions
WITH students_to_backfill AS (
  SELECT 
    id,
    dag_points,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num,
    COUNT(*) OVER () as total_count
  FROM users
  WHERE 
    role = 'student' 
    AND dag_points > 0
    AND NOT EXISTS (
      SELECT 1 FROM points_transactions 
      WHERE points_transactions.user_id = users.id
    )
)
-- Insert transactions with dates spread across last 4 weeks and 3 months
INSERT INTO points_transactions (user_id, points, transaction_type, description, created_at)
SELECT 
  id as user_id,
  dag_points as points,
  'signup_bonus' as transaction_type,
  CASE 
    WHEN row_num % 12 = 0 THEN 'Week 1 - Backfilled signup bonus'
    WHEN row_num % 12 = 1 THEN 'Week 2 - Backfilled signup bonus'
    WHEN row_num % 12 = 2 THEN 'Week 3 - Backfilled signup bonus'
    WHEN row_num % 12 = 3 THEN 'Week 4 - Backfilled signup bonus'
    WHEN row_num % 12 = 4 THEN 'Month 1 - Backfilled signup bonus'
    WHEN row_num % 12 = 5 THEN 'Month 2 - Backfilled signup bonus'
    WHEN row_num % 12 = 6 THEN 'Month 3 - Backfilled signup bonus'
    ELSE 'This Week - Backfilled signup bonus'
  END as description,
  CASE 
    -- This Week (last 7 days)
    WHEN row_num % 12 IN (0, 7, 8) THEN NOW() - INTERVAL '3 days'
    -- Week 2 (8-14 days ago)
    WHEN row_num % 12 = 1 THEN NOW() - INTERVAL '10 days'
    -- Week 3 (15-21 days ago)
    WHEN row_num % 12 = 2 THEN NOW() - INTERVAL '17 days'
    -- Week 4 (22-28 days ago)
    WHEN row_num % 12 = 3 THEN NOW() - INTERVAL '24 days'
    -- Month 1 (within last 30 days)
    WHEN row_num % 12 = 4 THEN NOW() - INTERVAL '28 days'
    -- Month 2 (31-60 days ago)
    WHEN row_num % 12 = 5 THEN NOW() - INTERVAL '45 days'
    -- Month 3 (61-90 days ago)
    WHEN row_num % 12 = 6 THEN NOW() - INTERVAL '75 days'
    -- Default: This Week
    ELSE NOW() - INTERVAL '2 days'
  END as created_at
FROM students_to_backfill;

-- Show summary of backfilled data
WITH summary AS (
  SELECT 
    CASE 
      WHEN created_at >= NOW() - INTERVAL '7 days' THEN 'This Week'
      WHEN created_at >= NOW() - INTERVAL '14 days' THEN 'Week 2'
      WHEN created_at >= NOW() - INTERVAL '21 days' THEN 'Week 3'
      WHEN created_at >= NOW() - INTERVAL '28 days' THEN 'Week 4'
      WHEN created_at >= NOW() - INTERVAL '30 days' THEN 'This Month'
      WHEN created_at >= NOW() - INTERVAL '60 days' THEN 'Month 2'
      WHEN created_at >= NOW() - INTERVAL '90 days' THEN 'Month 3'
      ELSE 'Older'
    END as time_period,
    CASE 
      WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1
      WHEN created_at >= NOW() - INTERVAL '14 days' THEN 2
      WHEN created_at >= NOW() - INTERVAL '21 days' THEN 3
      WHEN created_at >= NOW() - INTERVAL '28 days' THEN 4
      WHEN created_at >= NOW() - INTERVAL '30 days' THEN 5
      WHEN created_at >= NOW() - INTERVAL '60 days' THEN 6
      WHEN created_at >= NOW() - INTERVAL '90 days' THEN 7
      ELSE 8
    END as sort_order,
    points
  FROM points_transactions
  WHERE description LIKE '%Backfilled%'
)
SELECT 
  time_period,
  COUNT(*) as user_count,
  SUM(points) as total_points
FROM summary
GROUP BY time_period, sort_order
ORDER BY sort_order;
