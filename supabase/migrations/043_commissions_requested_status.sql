-- =====================================================
-- Migration 043: Add 'requested' status to sales_commissions
-- Tracks commissions that have a pending withdrawal request
-- =====================================================

ALTER TABLE sales_commissions
  DROP CONSTRAINT IF EXISTS sales_commissions_payment_status_check;

ALTER TABLE sales_commissions
  ADD CONSTRAINT sales_commissions_payment_status_check
  CHECK (payment_status IN ('pending', 'requested', 'paid', 'cancelled'));
