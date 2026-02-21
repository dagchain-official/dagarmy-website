-- =====================================================
-- Migration 028b: Activity Logs Backfill
-- Populates activity_logs from existing historical data
-- Run AFTER 028_activity_logs.sql
-- =====================================================

-- ── 1. Backfill user signups ───────────────────────────────────────────────
INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, target_email, target_name, description, metadata, severity, created_at)
SELECT
  'user_signup', 'auth',
  u.id, u.email, u.full_name,
  u.id, u.email, u.full_name,
  'New user registered: ' || COALESCE(u.full_name, u.email, u.id::TEXT),
  jsonb_build_object('tier', COALESCE(u.tier::TEXT, 'unknown'), 'role', COALESCE(u.role::TEXT, 'unknown')),
  'info',
  u.created_at
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM activity_logs al
  WHERE al.event_type = 'user_signup' AND al.actor_id = u.id
);

-- ── 2. Backfill points transactions ───────────────────────────────────────
INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, target_email, target_name, description, metadata, severity, created_at)
SELECT
  CASE
    WHEN pt.transaction_type = 'rank_burn'   THEN 'points_burned'
    WHEN pt.transaction_type = 'admin_grant' THEN 'admin_points_grant'
    WHEN pt.transaction_type = 'sale_points' THEN 'sale_points_granted'
    WHEN pt.points < 0                       THEN 'points_redeemed'
    ELSE 'points_earned'
  END,
  'rewards',
  pt.user_id, u.email, u.full_name,
  pt.user_id, u.email, u.full_name,
  COALESCE(pt.description, pt.transaction_type, 'transaction') || ' — ' || pt.points::TEXT || ' pts',
  jsonb_build_object(
    'points',            pt.points,
    'transaction_type',  pt.transaction_type,
    'transaction_id',    pt.transaction_id
  ),
  'info',
  pt.created_at
FROM points_transactions pt
LEFT JOIN users u ON u.id = pt.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM activity_logs al
  WHERE al.metadata->>'transaction_id' = pt.transaction_id
    AND pt.transaction_id IS NOT NULL
);

-- ── 3. Backfill paid sales ─────────────────────────────────────────────────
INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, description, metadata, severity, created_at)
SELECT
  'sale_paid', 'sales',
  sc.user_id, u.email, u.full_name,
  sc.id,
  'Sale marked paid: ' || COALESCE(sc.product_name, sc.product_type) || ' — $' || sc.sale_amount::TEXT || ' (commission $' || sc.commission_amount::TEXT || ')',
  jsonb_build_object(
    'sale_amount',       sc.sale_amount,
    'commission_amount', sc.commission_amount,
    'product_type',      sc.product_type,
    'commission_level',  sc.commission_level,
    'sale_id',           sc.id
  ),
  'info',
  COALESCE(sc.paid_at, sc.updated_at, sc.created_at)
FROM sales_commissions sc
LEFT JOIN users u ON u.id = sc.user_id
WHERE sc.payment_status = 'paid'
  AND NOT EXISTS (
    SELECT 1 FROM activity_logs al
    WHERE al.event_type = 'sale_paid' AND al.target_id = sc.id
  );

-- ── 4. Backfill rank upgrades (users who have a current_rank set) ──────────
INSERT INTO activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, description, metadata, severity, created_at)
SELECT
  'rank_upgrade', 'rewards',
  u.id, u.email, u.full_name,
  u.id,
  COALESCE(u.full_name, u.email) || ' achieved rank: ' || u.current_rank,
  jsonb_build_object('new_rank', u.current_rank),
  'info',
  COALESCE(u.updated_at, u.created_at)
FROM users u
WHERE u.current_rank IS NOT NULL
  AND u.current_rank <> ''
  AND NOT EXISTS (
    SELECT 1 FROM activity_logs al
    WHERE al.event_type = 'rank_upgrade' AND al.actor_id = u.id
  );

-- Summary
SELECT
  event_type,
  COUNT(*) AS count
FROM activity_logs
GROUP BY event_type
ORDER BY count DESC;
