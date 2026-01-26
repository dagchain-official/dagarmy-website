-- DAG Rewards System Migration
-- Implements DAG SOLDIER and DAG LIEUTENANT tiers with points system

-- Create enum for user tiers
CREATE TYPE user_tier AS ENUM ('DAG_SOLDIER', 'DAG_LIEUTENANT');

-- Add tier and points columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS tier user_tier DEFAULT 'DAG_SOLDIER',
ADD COLUMN IF NOT EXISTS dag_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_points_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS upgraded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS upgrade_payment_id TEXT;

-- Create rewards_config table for Master Admin to manage reward values
CREATE TABLE IF NOT EXISTS rewards_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key TEXT UNIQUE NOT NULL,
  config_value INTEGER NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Insert default reward values
INSERT INTO rewards_config (config_key, config_value, description) VALUES
  ('signup_bonus', 500, 'DAG Points awarded on user signup (DAG SOLDIER)'),
  ('lieutenant_upgrade_bonus', 3600, 'Additional DAG Points awarded on upgrade to DAG LIEUTENANT'),
  ('lieutenant_price_usd', 149, 'Price in USD for DAG LIEUTENANT upgrade')
ON CONFLICT (config_key) DO NOTHING;

-- Create points_transactions table to track all point movements
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'signup_bonus', 'upgrade_bonus', 'reward', 'deduction', etc.
  description TEXT,
  reference_id TEXT, -- Can store payment ID, course ID, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON points_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- Function to add points to user
CREATE OR REPLACE FUNCTION add_dag_points(
  p_user_id UUID,
  p_points INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update user points
  UPDATE users 
  SET 
    dag_points = dag_points + p_points,
    total_points_earned = total_points_earned + p_points
  WHERE id = p_user_id;
  
  -- Record transaction
  INSERT INTO points_transactions (user_id, points, transaction_type, description, reference_id)
  VALUES (p_user_id, p_points, p_transaction_type, p_description, p_reference_id);
END;
$$ LANGUAGE plpgsql;

-- Function to upgrade user to DAG LIEUTENANT
CREATE OR REPLACE FUNCTION upgrade_to_lieutenant(
  p_user_id UUID,
  p_payment_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_upgrade_bonus INTEGER;
BEGIN
  -- Get upgrade bonus from config
  SELECT config_value INTO v_upgrade_bonus 
  FROM rewards_config 
  WHERE config_key = 'lieutenant_upgrade_bonus';
  
  -- Update user tier
  UPDATE users 
  SET 
    tier = 'DAG_LIEUTENANT',
    upgraded_at = NOW(),
    upgrade_payment_id = p_payment_id
  WHERE id = p_user_id AND tier = 'DAG_SOLDIER';
  
  -- Award upgrade bonus points
  PERFORM add_dag_points(
    p_user_id, 
    v_upgrade_bonus, 
    'upgrade_bonus',
    'DAG LIEUTENANT upgrade bonus',
    p_payment_id
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to award signup bonus when new user is created
CREATE OR REPLACE FUNCTION award_signup_bonus()
RETURNS TRIGGER AS $$
DECLARE
  v_signup_bonus INTEGER;
BEGIN
  -- Get signup bonus from config
  SELECT config_value INTO v_signup_bonus 
  FROM rewards_config 
  WHERE config_key = 'signup_bonus';
  
  -- Award signup bonus points
  PERFORM add_dag_points(
    NEW.id, 
    v_signup_bonus, 
    'signup_bonus',
    'Welcome to DAGARMY! DAG SOLDIER signup bonus',
    NULL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for signup bonus (only for new users with student role)
DROP TRIGGER IF EXISTS trigger_award_signup_bonus ON users;
CREATE TRIGGER trigger_award_signup_bonus
  AFTER INSERT ON users
  FOR EACH ROW
  WHEN (NEW.role = 'student')
  EXECUTE FUNCTION award_signup_bonus();

-- RLS Policies for rewards_config (Master Admin only can edit)
ALTER TABLE rewards_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master Admin can manage rewards config"
  ON rewards_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_master_admin = true
    )
  );

CREATE POLICY "Everyone can view rewards config"
  ON rewards_config
  FOR SELECT
  USING (true);

-- RLS Policies for points_transactions
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON points_transactions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON points_transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (users.is_master_admin = true OR users.role = 'admin')
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON rewards_config TO authenticated;
GRANT ALL ON points_transactions TO authenticated;
GRANT EXECUTE ON FUNCTION add_dag_points TO authenticated;
GRANT EXECUTE ON FUNCTION upgrade_to_lieutenant TO authenticated;
