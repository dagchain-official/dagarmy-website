-- =====================================================
-- FIX: Migration 033 redefined trigger_update_referral_stats
-- to only update users table, skipping referral_stats table.
-- Restore correct behavior.
-- =====================================================

CREATE OR REPLACE FUNCTION public.trigger_update_referral_stats()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  v_referrer_id := COALESCE(NEW.referrer_id, OLD.referrer_id);

  INSERT INTO public.referral_stats (
    user_id,
    total_referrals,
    successful_referrals,
    pending_referrals,
    total_points_earned
  )
  SELECT
    v_referrer_id,
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'pending'),
    COALESCE((
      SELECT SUM(points) FROM public.points_transactions
      WHERE user_id = v_referrer_id AND transaction_type = 'referral_join'
    ), 0)
  FROM public.referrals
  WHERE referrer_id = v_referrer_id
  ON CONFLICT (user_id) DO UPDATE SET
    total_referrals = EXCLUDED.total_referrals,
    successful_referrals = EXCLUDED.successful_referrals,
    pending_referrals = EXCLUDED.pending_referrals,
    total_points_earned = EXCLUDED.total_points_earned;

  RETURN COALESCE(NEW, OLD);
END; $$;

-- Backfill referral_stats for all users who have referrals
INSERT INTO public.referral_stats (user_id, total_referrals, successful_referrals, pending_referrals, total_points_earned)
SELECT
  r.referrer_id,
  COUNT(*),
  COUNT(*) FILTER (WHERE r.status = 'completed'),
  COUNT(*) FILTER (WHERE r.status = 'pending'),
  COALESCE((
    SELECT SUM(pt.points) FROM public.points_transactions pt
    WHERE pt.user_id = r.referrer_id AND pt.transaction_type = 'referral_join'
  ), 0)
FROM public.referrals r
GROUP BY r.referrer_id
ON CONFLICT (user_id) DO UPDATE SET
  total_referrals = EXCLUDED.total_referrals,
  successful_referrals = EXCLUDED.successful_referrals,
  pending_referrals = EXCLUDED.pending_referrals,
  total_points_earned = EXCLUDED.total_points_earned;
