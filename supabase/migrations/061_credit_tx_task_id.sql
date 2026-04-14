-- Migration 061: Add task_id to credit_transactions for DGCC refund matching
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS task_id TEXT;

CREATE INDEX IF NOT EXISTS idx_credit_transactions_task_id
  ON credit_transactions(task_id)
  WHERE task_id IS NOT NULL;
