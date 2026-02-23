-- =====================================================
-- Migration 030: Withdrawal System
-- Adds payment info to users + withdrawal_requests table
-- =====================================================

-- ── Payment info columns on users ────────────────────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS bep20_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_account_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_account_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_branch TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_swift_iban TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_payout TEXT DEFAULT 'bank'
  CHECK (preferred_payout IN ('bank', 'crypto'));

-- ── withdrawal_requests ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_month    TEXT NOT NULL,
  amount_usd      DECIMAL(10,2) NOT NULL CHECK (amount_usd >= 10),
  payout_method   TEXT NOT NULL CHECK (payout_method IN ('bank', 'crypto')),
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','processing','paid','rejected')),
  bep20_address   TEXT,
  bank_snapshot   JSONB,
  admin_note      TEXT,
  requested_at    TIMESTAMPTZ DEFAULT NOW(),
  processed_at    TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  UNIQUE (user_id, reward_month)
);

-- ── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id
  ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status
  ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_reward_month
  ON withdrawal_requests(reward_month);

-- ── RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own requests
CREATE POLICY "Users can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  USING (user_id = auth.uid());

-- Service role bypasses RLS (used by API routes via supabaseAdmin)
