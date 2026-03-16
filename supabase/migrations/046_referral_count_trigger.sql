-- =====================================================
-- Auto-sync referral_count on users table whenever
-- a row is inserted/updated/deleted in referrals
-- =====================================================

CREATE OR REPLACE FUNCTION public.sync_referral_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  -- Determine which referrer_id to update
  IF TG_OP = 'DELETE' THEN
    v_referrer_id := OLD.referrer_id;
  ELSE
    v_referrer_id := NEW.referrer_id;
  END IF;

  UPDATE public.users
  SET referral_count = (
    SELECT COUNT(*) FROM public.referrals
    WHERE referrer_id = v_referrer_id
    AND status = 'completed'
  )
  WHERE id = v_referrer_id;

  RETURN COALESCE(NEW, OLD);
END; $$;

DROP TRIGGER IF EXISTS trg_sync_referral_count ON public.referrals;
CREATE TRIGGER trg_sync_referral_count
  AFTER INSERT OR UPDATE OR DELETE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.sync_referral_count();

-- Backfill referral_count for all existing users
UPDATE public.users
SET referral_count = (
  SELECT COUNT(*) FROM public.referrals
  WHERE referrer_id = users.id
  AND status = 'completed'
);
