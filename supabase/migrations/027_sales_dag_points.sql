-- =====================================================
-- Migration 027: Sales DAG Points
-- DAG Points awarded per $ of sale amount
-- Self sale: 25 pts/$  |  Direct referral sale: 25 pts/$
-- DAG LIEUTENANT gets +20% bonus (same as other rewards)
-- =====================================================

-- 1. Insert config keys
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
  ('self_sale_dag_points_per_dollar',     25, 'DAG Points awarded per $ of own sale amount (level 1 / self)', NOW()),
  ('referral_sale_dag_points_per_dollar', 25, 'DAG Points awarded per $ when a direct referral makes a sale (level 1 upline)', NOW()),
  ('sale_dag_points_lieutenant_bonus',    20, 'Extra % bonus on sale DAG Points for DAG LIEUTENANT tier', NOW())
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  description  = EXCLUDED.description,
  updated_at   = NOW();


-- 2. Function: grant DAG points for a sale
--    Called by trigger on sales_commissions when payment_status becomes 'paid'
CREATE OR REPLACE FUNCTION grant_sale_dag_points()
RETURNS TRIGGER AS $$
DECLARE
  v_self_rate        INTEGER;
  v_referral_rate    INTEGER;
  v_lt_bonus_rate    INTEGER;
  v_seller_tier      TEXT;
  v_multiplier       NUMERIC;
  v_pts              INTEGER;
  v_description      TEXT;
  v_commission_level INTEGER;
  v_sale_amount      NUMERIC;
BEGIN
  -- Only fire when payment_status transitions TO 'paid'
  IF NEW.payment_status <> 'paid' THEN
    RETURN NEW;
  END IF;
  IF OLD.payment_status = 'paid' THEN
    RETURN NEW; -- already processed
  END IF;

  -- Load config
  SELECT COALESCE(config_value, 25) INTO v_self_rate
    FROM rewards_config WHERE config_key = 'self_sale_dag_points_per_dollar';
  SELECT COALESCE(config_value, 25) INTO v_referral_rate
    FROM rewards_config WHERE config_key = 'referral_sale_dag_points_per_dollar';
  SELECT COALESCE(config_value, 20) INTO v_lt_bonus_rate
    FROM rewards_config WHERE config_key = 'sale_dag_points_lieutenant_bonus';

  -- Get seller tier
  SELECT COALESCE(tier, 'DAG_SOLDIER') INTO v_seller_tier
    FROM users WHERE id = NEW.user_id;

  -- LT bonus multiplier
  v_multiplier := 1.0;
  IF v_seller_tier IN ('DAG_LIEUTENANT', 'DAG LIEUTENANT') THEN
    v_multiplier := 1.0 + (v_lt_bonus_rate::NUMERIC / 100.0);
  END IF;

  v_commission_level := COALESCE(NEW.commission_level, 1);
  v_sale_amount      := COALESCE(NEW.sale_amount, 0);

  -- Level 1 = self sale or direct referral sale (both get points)
  IF v_commission_level = 1 THEN
    -- Determine if this is a self-sale (buyer_id = user_id or buyer_id is null)
    -- or a referral sale (buyer is someone else)
    IF NEW.buyer_id IS NULL OR NEW.buyer_id = NEW.user_id THEN
      -- Self sale
      v_pts := FLOOR(v_sale_amount * v_self_rate * v_multiplier)::INTEGER;
      v_description := 'Self sale DAG Points: $' || v_sale_amount::TEXT ||
                       ' × ' || v_self_rate::TEXT || ' pts/$' ||
                       CASE WHEN v_multiplier > 1 THEN ' (+' || v_lt_bonus_rate::TEXT || '% LT bonus)' ELSE '' END;
    ELSE
      -- Direct referral sale (upline earning commission on a referral's purchase)
      v_pts := FLOOR(v_sale_amount * v_referral_rate * v_multiplier)::INTEGER;
      v_description := 'Direct referral sale DAG Points: $' || v_sale_amount::TEXT ||
                       ' × ' || v_referral_rate::TEXT || ' pts/$' ||
                       CASE WHEN v_multiplier > 1 THEN ' (+' || v_lt_bonus_rate::TEXT || '% LT bonus)' ELSE '' END;
    END IF;

    IF v_pts > 0 THEN
      PERFORM add_dag_points(
        NEW.user_id,
        v_pts,
        'sale_points',
        v_description,
        NEW.id::TEXT
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 3. Attach trigger to sales_commissions
DROP TRIGGER IF EXISTS trigger_grant_sale_dag_points ON sales_commissions;

CREATE TRIGGER trigger_grant_sale_dag_points
AFTER INSERT OR UPDATE OF payment_status ON sales_commissions
FOR EACH ROW
EXECUTE FUNCTION grant_sale_dag_points();
