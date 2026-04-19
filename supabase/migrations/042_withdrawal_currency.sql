-- =====================================================
-- Migration 042: Multi-currency withdrawal support
-- =====================================================

-- Add currency to withdrawal_requests
ALTER TABLE withdrawal_requests
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD'
    CHECK (currency IN ('USD', 'USDT'));

-- amount_usd was used for both - rename semantics via a new amount column
-- Keep amount_usd for backward compat, add amount_usdt for USDT requests
ALTER TABLE withdrawal_requests
  ADD COLUMN IF NOT EXISTS amount_usdt DECIMAL(10,2);

-- Drop the old unique constraint and replace with one that allows 1 USD + 1 USDT per month
ALTER TABLE withdrawal_requests DROP CONSTRAINT IF EXISTS withdrawal_requests_user_id_reward_month_key;
ALTER TABLE withdrawal_requests DROP CONSTRAINT IF EXISTS withdrawal_requests_user_month_currency_key;
ALTER TABLE withdrawal_requests
  ADD CONSTRAINT withdrawal_requests_user_month_currency_key
  UNIQUE (user_id, reward_month, currency);

-- Index on currency
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_currency ON withdrawal_requests(currency);

-- Backfill existing rows as USD
UPDATE withdrawal_requests SET currency = 'USD' WHERE currency IS NULL OR currency = '';
