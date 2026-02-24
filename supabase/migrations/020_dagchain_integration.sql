-- ============================================================
-- DAGChain Integration Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add DAGChain columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_user_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_wallet_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_auth_provider TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_referral_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_referred_by TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_synced_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_joined_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dagchain_data JSONB;

-- Index for fast lookup by dagchain_user_id
CREATE INDEX IF NOT EXISTS idx_users_dagchain_user_id ON users(dagchain_user_id);
CREATE INDEX IF NOT EXISTS idx_users_dagchain_referral_code ON users(dagchain_referral_code);

-- 2. DAGChain node purchases table
CREATE TABLE IF NOT EXISTS dagchain_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  dagchain_user_id TEXT NOT NULL,
  email TEXT,
  node_type TEXT NOT NULL CHECK (node_type IN ('validator', 'storage')),
  node_id TEXT,
  tier TEXT,
  amount_usd NUMERIC(12,2),
  currency TEXT,
  status TEXT DEFAULT 'active',
  purchased_at TIMESTAMPTZ,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dagchain_nodes_user_id ON dagchain_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_dagchain_nodes_dagchain_user_id ON dagchain_nodes(dagchain_user_id);
CREATE INDEX IF NOT EXISTS idx_dagchain_nodes_email ON dagchain_nodes(email);
CREATE INDEX IF NOT EXISTS idx_dagchain_nodes_node_type ON dagchain_nodes(node_type);

-- 3. DAGChain referrals table (full referral journey)
CREATE TABLE IF NOT EXISTS dagchain_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referrer_dagchain_id TEXT,
  referrer_email TEXT,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_dagchain_id TEXT,
  referred_email TEXT,
  referral_code TEXT,
  status TEXT DEFAULT 'active',
  joined_at TIMESTAMPTZ,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dagchain_referrals_referrer_user_id ON dagchain_referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_dagchain_referrals_referrer_dagchain_id ON dagchain_referrals(referrer_dagchain_id);
CREATE INDEX IF NOT EXISTS idx_dagchain_referrals_referred_dagchain_id ON dagchain_referrals(referred_dagchain_id);
CREATE INDEX IF NOT EXISTS idx_dagchain_referrals_referral_code ON dagchain_referrals(referral_code);

-- 4. DAGChain events audit log (every webhook received)
CREATE TABLE IF NOT EXISTS dagchain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  dagchain_user_id TEXT,
  email TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  received_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dagchain_events_event_type ON dagchain_events(event_type);
CREATE INDEX IF NOT EXISTS idx_dagchain_events_email ON dagchain_events(email);
CREATE INDEX IF NOT EXISTS idx_dagchain_events_dagchain_user_id ON dagchain_events(dagchain_user_id);
CREATE INDEX IF NOT EXISTS idx_dagchain_events_received_at ON dagchain_events(received_at DESC);
