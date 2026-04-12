-- ============================================================
-- Migration 054: Remove Rank System + Refund Burned Points
-- ============================================================
-- 1. Refunds any DAG Points burned for rank achievements
-- 2. Wipes current_rank on all users
-- 3. Removes all rank-related rewards_config entries
-- ============================================================

-- ── Step 1: Refund burned points to all users who had ranks ─
DO $$
DECLARE
  r              RECORD;
  v_total_burned DECIMAL(15,2);
  v_current_pts  DECIMAL(15,2);
BEGIN
  FOR r IN
    SELECT user_id, SUM(points_burned) AS total_burned
    FROM   rank_achievements
    GROUP  BY user_id
    HAVING SUM(points_burned) > 0
  LOOP
    v_total_burned := r.total_burned;

    -- Read live balance
    SELECT COALESCE(dag_points, 0)
    INTO   v_current_pts
    FROM   users
    WHERE  id = r.user_id;

    -- Insert refund record in the comprehensive ledger
    INSERT INTO point_transactions (
      user_id,
      transaction_type,
      amount,
      balance_before,
      balance_after,
      description,
      reference_type,
      created_at
    ) VALUES (
      r.user_id,
      'rank_refund',
      v_total_burned,
      v_current_pts,
      v_current_pts + v_total_burned,
      'DAG Points refund — rank system has been removed. All burned points restored.',
      'rank_refund',
      NOW()
    );

    -- Restore dag_points on users table
    UPDATE users
    SET
      dag_points         = dag_points + v_total_burned,
      -- Reverse the burn accounting so total_points_burned is accurate
      total_points_burned = GREATEST(total_points_burned - v_total_burned, 0)
    WHERE id = r.user_id;

  END LOOP;
END $$;

-- ── Step 2: Wipe current_rank from all users ─────────────────
UPDATE users
SET current_rank = NULL
WHERE current_rank IS NOT NULL;

-- ── Step 3: Remove rank-related rewards_config entries ───────
DELETE FROM rewards_config
WHERE config_key IN (
  'rank_burn_initiator',
  'rank_burn_vanguard',
  'rank_burn_guardian',
  'rank_burn_striker',
  'rank_burn_invoker',
  'rank_burn_commander',
  'rank_burn_champion',
  'rank_burn_conqueror',
  'rank_burn_paragon',
  'rank_burn_mythic',
  'rank_commission_initiator',
  'rank_commission_vanguard',
  'rank_commission_guardian',
  'rank_commission_striker',
  'rank_commission_invoker',
  'rank_commission_commander',
  'rank_commission_champion',
  'rank_commission_conqueror',
  'rank_commission_paragon',
  'rank_commission_mythic',
  'rank_upgrade_bonus_initiator',
  'rank_upgrade_bonus_vanguard',
  'rank_upgrade_bonus_guardian',
  'rank_upgrade_bonus_striker',
  'rank_upgrade_bonus_invoker',
  'rank_upgrade_bonus_commander',
  'rank_upgrade_bonus_champion',
  'rank_upgrade_bonus_conqueror',
  'rank_upgrade_bonus_paragon',
  'rank_upgrade_bonus_mythic',
  'ranking_system_enabled_for_soldier',
  'lieutenant_self_upgrade_bonus',
  'lieutenant_upgrade_bonus',
  'lieutenant_bonus_percentage'
);

-- ── Verification queries (run manually to confirm) ───────────
-- SELECT COUNT(*) FROM users WHERE current_rank IS NOT NULL;       -- expect 0
-- SELECT COUNT(*) FROM rank_achievements;                          -- rows still exist for audit
-- SELECT config_key FROM rewards_config WHERE config_key LIKE 'rank%'; -- expect 0 rows
-- SELECT user_id, amount, description FROM point_transactions WHERE transaction_type = 'rank_refund';
