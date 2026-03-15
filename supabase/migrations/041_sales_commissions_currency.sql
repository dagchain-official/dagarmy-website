-- ============================================================
-- Migration 041: Add currency support to sales_commissions
-- Allows USD and USDT commissions to coexist in the same table
-- ============================================================

ALTER TABLE sales_commissions
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD';

-- Backfill existing rows as USD
UPDATE sales_commissions SET currency = 'USD' WHERE currency IS NULL OR currency = '';

CREATE INDEX IF NOT EXISTS idx_sales_commissions_currency ON sales_commissions(currency);
