-- =====================================================
-- COMPREHENSIVE MLM REWARD SYSTEM
-- =====================================================
-- This migration creates the complete reward system infrastructure
-- including referrals, ranks, commissions, and point transactions

-- =====================================================
-- 1. UPDATE USERS TABLE
-- =====================================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS current_rank VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS total_points_earned DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_points_burned DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_usd_earned DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Generate unique referral codes for existing users
UPDATE users 
SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- =====================================================
-- 2. REFERRALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) NOT NULL,
  referral_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_tier VARCHAR(50) NOT NULL, -- DAG_SOLDIER, DAG_LIEUTENANT
  points_earned_on_join DECIMAL(15,2) DEFAULT 0,
  points_earned_on_upgrade DECIMAL(15,2) DEFAULT 0,
  total_points_earned DECIMAL(15,2) DEFAULT 0,
  referred_user_upgraded BOOLEAN DEFAULT FALSE,
  upgrade_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

DROP INDEX IF EXISTS idx_referrals_referrer;
DROP INDEX IF EXISTS idx_referrals_referred;
DROP INDEX IF EXISTS idx_referrals_code;

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);

-- =====================================================
-- 3. RANK ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS rank_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank_name VARCHAR(50) NOT NULL,
  rank_level INTEGER NOT NULL,
  points_burned DECIMAL(15,2) NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  previous_rank VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, rank_name)
);

DROP INDEX IF EXISTS idx_rank_achievements_user;
DROP INDEX IF EXISTS idx_rank_achievements_rank;

CREATE INDEX idx_rank_achievements_user ON rank_achievements(user_id);
CREATE INDEX idx_rank_achievements_rank ON rank_achievements(rank_name);

-- =====================================================
-- 4. SALES COMMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sale_id VARCHAR(100), -- External sale ID from product systems
  product_type VARCHAR(50) NOT NULL, -- VALIDATOR_NODE, STORAGE_NODE, DAGGPT_SUBSCRIPTION
  product_name VARCHAR(255),
  sale_amount DECIMAL(15,2) NOT NULL,
  commission_percentage DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  commission_level INTEGER NOT NULL, -- 1 (direct), 2 (2nd level), 3 (3rd level)
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_tier VARCHAR(50), -- Tier of the person earning commission
  seller_rank VARCHAR(50), -- Rank of the person earning commission
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP INDEX IF EXISTS idx_sales_commissions_user;
DROP INDEX IF EXISTS idx_sales_commissions_buyer;
DROP INDEX IF EXISTS idx_sales_commissions_sale;
DROP INDEX IF EXISTS idx_sales_commissions_status;

CREATE INDEX idx_sales_commissions_user ON sales_commissions(user_id);
CREATE INDEX idx_sales_commissions_buyer ON sales_commissions(buyer_id);
CREATE INDEX idx_sales_commissions_sale ON sales_commissions(sale_id);
CREATE INDEX idx_sales_commissions_status ON sales_commissions(payment_status);

-- =====================================================
-- 5. POINT TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- SIGNUP, UPGRADE, REFERRAL_JOIN, REFERRAL_UPGRADE, RANK_BURN, MANUAL_ADJUSTMENT
  amount DECIMAL(15,2) NOT NULL, -- Positive for earning, negative for burning
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  description TEXT,
  reference_id UUID, -- Reference to related record (referral_id, rank_achievement_id, etc.)
  reference_type VARCHAR(50), -- referral, rank_achievement, sale_commission
  created_by UUID REFERENCES users(id) ON DELETE SET NULL, -- For manual adjustments by admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP INDEX IF EXISTS idx_point_transactions_user;
DROP INDEX IF EXISTS idx_point_transactions_type;
DROP INDEX IF EXISTS idx_point_transactions_date;

CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_type ON point_transactions(transaction_type);
CREATE INDEX idx_point_transactions_date ON point_transactions(created_at);

-- =====================================================
-- 6. EXPAND REWARDS CONFIG TABLE
-- =====================================================
-- Add new configuration entries for the comprehensive reward system

-- Referral bonuses
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('soldier_referral_join_bonus', 500, 'DAG Points earned by DAG SOLDIER when referral joins', NOW()),
('lieutenant_referral_join_bonus', 600, 'DAG Points earned by DAG LIEUTENANT when referral joins (20% bonus)', NOW()),
('referral_upgrade_total_bonus', 3000, 'Total DAG Points earned when referral upgrades to LIEUTENANT', NOW()),
('lieutenant_bonus_percentage', 20, 'Extra percentage bonus for DAG LIEUTENANT on all earnings', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Rank burn requirements
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('rank_burn_initiator', 700, 'DAG Points to burn for INITIATOR rank', NOW()),
('rank_burn_vanguard', 1500, 'DAG Points to burn for VANGUARD rank', NOW()),
('rank_burn_guardian', 3200, 'DAG Points to burn for GUARDIAN rank', NOW()),
('rank_burn_striker', 7000, 'DAG Points to burn for STRIKER rank', NOW()),
('rank_burn_invoker', 10000, 'DAG Points to burn for INVOKER rank', NOW()),
('rank_burn_commander', 15000, 'DAG Points to burn for COMMANDER rank', NOW()),
('rank_burn_champion', 20000, 'DAG Points to burn for CHAMPION rank', NOW()),
('rank_burn_conqueror', 30000, 'DAG Points to burn for CONQUEROR rank', NOW()),
('rank_burn_paragon', 40000, 'DAG Points to burn for PARAGON rank', NOW()),
('rank_burn_mythic', 50000, 'DAG Points to burn for MYTHIC rank', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Sales commission rates (default - no rank)
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('soldier_direct_sales_commission', 3, 'DAG SOLDIER direct sales commission percentage', NOW()),
('lieutenant_direct_sales_commission_default', 7, 'DAG LIEUTENANT direct sales commission (no rank)', NOW()),
('lieutenant_level2_sales_commission', 3, '2nd level sales commission for DAG LIEUTENANT', NOW()),
('lieutenant_level3_sales_commission', 2, '3rd level sales commission for DAG LIEUTENANT', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Rank-based sales commission rates
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('rank_commission_initiator', 10, 'Direct sales commission for INITIATOR rank', NOW()),
('rank_commission_vanguard', 12, 'Direct sales commission for VANGUARD rank', NOW()),
('rank_commission_guardian', 13, 'Direct sales commission for GUARDIAN rank', NOW()),
('rank_commission_striker', 14, 'Direct sales commission for STRIKER rank', NOW()),
('rank_commission_invoker', 15, 'Direct sales commission for INVOKER rank', NOW()),
('rank_commission_commander', 16, 'Direct sales commission for COMMANDER rank', NOW()),
('rank_commission_champion', 17, 'Direct sales commission for CHAMPION rank', NOW()),
('rank_commission_conqueror', 18, 'Direct sales commission for CONQUEROR rank', NOW()),
('rank_commission_paragon', 19, 'Direct sales commission for PARAGON rank', NOW()),
('rank_commission_mythic', 20, 'Direct sales commission for MYTHIC rank', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- System settings
INSERT INTO rewards_config (config_key, config_value, description, updated_at) VALUES
('ranking_system_enabled_for_soldier', 0, 'Enable ranking system for DAG SOLDIER (0=disabled, 1=enabled)', NOW()),
('max_commission_levels', 3, 'Maximum number of downline levels for commission', NOW())
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- =====================================================
-- 7. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS trigger_update_referral_count ON referrals;
DROP TRIGGER IF EXISTS trigger_update_user_points_summary ON point_transactions;
DROP TRIGGER IF EXISTS trigger_update_user_usd_earned ON sales_commissions;
DROP FUNCTION IF EXISTS update_referral_count();
DROP FUNCTION IF EXISTS update_user_points_summary();
DROP FUNCTION IF EXISTS update_user_usd_earned();

-- Function to update user's referral count
CREATE OR REPLACE FUNCTION update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users 
    SET referral_count = referral_count + 1
    WHERE id = NEW.referrer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users 
    SET referral_count = GREATEST(referral_count - 1, 0)
    WHERE id = OLD.referrer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_referral_count
AFTER INSERT OR DELETE ON referrals
FOR EACH ROW
EXECUTE FUNCTION update_referral_count();

-- Function to update user's total points earned
CREATE OR REPLACE FUNCTION update_user_points_summary()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount > 0 THEN
    -- Points earned
    UPDATE users 
    SET total_points_earned = total_points_earned + NEW.amount
    WHERE id = NEW.user_id;
  ELSE
    -- Points burned
    UPDATE users 
    SET total_points_burned = total_points_burned + ABS(NEW.amount)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_points_summary
AFTER INSERT ON point_transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_points_summary();

-- Function to update user's total USD earned
CREATE OR REPLACE FUNCTION update_user_usd_earned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    UPDATE users 
    SET total_usd_earned = total_usd_earned + NEW.commission_amount
    WHERE id = NEW.user_id;
  ELSIF OLD.payment_status = 'paid' AND NEW.payment_status != 'paid' THEN
    UPDATE users 
    SET total_usd_earned = GREATEST(total_usd_earned - NEW.commission_amount, 0)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_usd_earned
AFTER INSERT OR UPDATE ON sales_commissions
FOR EACH ROW
EXECUTE FUNCTION update_user_usd_earned();

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON referrals TO authenticated;
GRANT ALL ON rank_achievements TO authenticated;
GRANT ALL ON sales_commissions TO authenticated;
GRANT ALL ON point_transactions TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
