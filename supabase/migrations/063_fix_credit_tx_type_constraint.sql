-- Migration 063: Widen credit_transactions type CHECK constraint
-- The original constraint only allowed 'bonus', blocking all other transaction types.
-- This drops the restrictive constraint and replaces it with a complete set.

-- Drop old restrictive constraint
ALTER TABLE credit_transactions DROP CONSTRAINT IF EXISTS credit_transactions_type_check;

-- Add complete constraint covering all DAGGPT transaction types
ALTER TABLE credit_transactions ADD CONSTRAINT credit_transactions_type_check
  CHECK (type IN (
    'purchase',     -- Stripe / direct DGCC purchase
    'bonus',        -- Signup bonus, admin grants
    'deduction',    -- AI generation charge (image, video, music, chat)
    'refund',       -- Auto-refund on failed Kei.ai job
    'adjustment',   -- Admin manual adjustment
    'transfer',     -- DGCC transfer from DAGARMY or another platform
    'dgcc_transfer' -- Alias for transfer (DAGARMY sends this type)
  ));

-- Also fix the backfill migration column names while we're here
-- (aggregator_cost_usd doesn't exist; correct column is charged_credits)
-- Note: The backfill DO $$ block uses only: user_id, type, amount, balance_after, description
-- Those are all nullable/defaulted so no column name fix needed for the DO block itself.
