-- Migration 059: Refund all DAG Points burned for rank upgrades
-- Since the 10-rank system is fully deprecated, all points_burned via
-- 'rank_burn' transactions must be credited back to each user.
-- This is idempotent: it checks for existing refund transactions before inserting.

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Credit back burned points into points_transactions
-- ─────────────────────────────────────────────────────────────────────────────
-- Insert one refund record per user who has rank_burn transactions,
-- unless a refund with this exact reason already exists (idempotency guard).
INSERT INTO points_transactions (transaction_id, user_id, points, transaction_type, description, created_at)
SELECT
  gen_random_uuid()         AS transaction_id,
  user_id,
  SUM(ABS(points))          AS points,          -- total burned (negative) → refund as positive
  'rank_burn_refund'        AS transaction_type,
  'Rank system deprecated - burned points fully refunded' AS description,
  NOW()                     AS created_at
FROM points_transactions
WHERE transaction_type = 'rank_burn'
  AND user_id NOT IN (
    -- Skip users who already received a refund (idempotency)
    SELECT DISTINCT user_id FROM points_transactions
    WHERE transaction_type = 'rank_burn_refund'
  )
GROUP BY user_id
HAVING SUM(ABS(points)) > 0;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2: Update dag_points balance on the users table to reflect the refund
-- We read directly from the just-inserted rank_burn_refund rows so the
-- idempotency is guaranteed: if Step 1 inserted nothing, this updates nothing.
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE users
SET
  dag_points = users.dag_points + refund.total_refunded,
  updated_at = NOW()
FROM (
  SELECT user_id, SUM(points) AS total_refunded
  FROM points_transactions
  WHERE transaction_type = 'rank_burn_refund'
    -- Only include the rows inserted by Step 1 (within the last 10 seconds)
    AND created_at >= NOW() - INTERVAL '10 seconds'
  GROUP BY user_id
) AS refund
WHERE users.id = refund.user_id;

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3: Clear current_rank field for all users (rank system deprecated)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE users
SET current_rank = NULL, updated_at = NOW()
WHERE current_rank IS NOT NULL
  AND current_rank != '';

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4: Verification query (run manually to check results)
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT u.email, u.dag_points,
--        refund.total_refunded,
--        burned.total_burned
-- FROM users u
-- LEFT JOIN (
--   SELECT user_id, SUM(points) AS total_refunded
--   FROM points_transactions WHERE transaction_type = 'rank_burn_refund'
--   GROUP BY user_id
-- ) refund ON refund.user_id = u.id
-- LEFT JOIN (
--   SELECT user_id, SUM(ABS(points)) AS total_burned
--   FROM points_transactions WHERE transaction_type = 'rank_burn'
--   GROUP BY user_id
-- ) burned ON burned.user_id = u.id
-- WHERE refund.user_id IS NOT NULL
-- ORDER BY refund.total_refunded DESC;
