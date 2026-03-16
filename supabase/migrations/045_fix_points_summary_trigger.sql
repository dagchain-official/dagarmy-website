-- =====================================================
-- FIX: update_user_points_summary trigger uses wrong column name
-- Migration 033 references NEW.amount and SUM(amount) but the
-- points_transactions table column is named 'points', not 'amount'.
-- This causes dag_points to always be set to 0 after any transaction.
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_user_points_summary()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.points > 0 THEN
    UPDATE public.users
      SET total_points_earned = COALESCE(total_points_earned, 0) + NEW.points
      WHERE id = NEW.user_id;
  END IF;
  UPDATE public.users
    SET dag_points = (
      SELECT COALESCE(SUM(points), 0) FROM public.points_transactions WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
  RETURN NEW;
END; $$;

-- =====================================================
-- Resync dag_points for ALL users from actual transactions
-- =====================================================
UPDATE public.users
SET dag_points = (
  SELECT COALESCE(SUM(points), 0)
  FROM public.points_transactions
  WHERE user_id = users.id
);
