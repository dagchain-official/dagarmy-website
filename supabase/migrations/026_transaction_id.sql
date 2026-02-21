-- =====================================================
-- Add unique transaction_id to points_transactions
-- Format: TXN-YYYYMMDD-XXXXXXXX (e.g. TXN-20260221-A3F9C12B)
-- Purpose: support query reference, audit trail
-- =====================================================

-- 1. Add column (nullable first so existing rows don't fail)
ALTER TABLE points_transactions
  ADD COLUMN IF NOT EXISTS transaction_id TEXT UNIQUE;

-- 2. Backfill existing rows with generated IDs
UPDATE points_transactions
SET transaction_id = 'TXN-' ||
  TO_CHAR(created_at, 'YYYYMMDD') || '-' ||
  UPPER(SUBSTRING(MD5(id::TEXT) FROM 1 FOR 8))
WHERE transaction_id IS NULL;

-- 3. Now enforce NOT NULL + unique index
ALTER TABLE points_transactions
  ALTER COLUMN transaction_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_points_transactions_txn_id
  ON points_transactions(transaction_id);

-- 4. Update add_dag_points function to auto-generate transaction_id on insert
-- Must drop first because return type changes from VOID to TEXT
DROP FUNCTION IF EXISTS add_dag_points(UUID, INTEGER, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION add_dag_points(
  p_user_id         UUID,
  p_points          INTEGER,
  p_transaction_type TEXT,
  p_description     TEXT DEFAULT NULL,
  p_reference_id    TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_txn_id TEXT;
  v_new_id UUID;
BEGIN
  -- Update user points totals
  UPDATE users
  SET
    dag_points          = dag_points + p_points,
    total_points_earned = CASE WHEN p_points > 0 THEN total_points_earned + p_points ELSE total_points_earned END,
    total_points_burned = CASE WHEN p_points < 0 THEN total_points_burned + ABS(p_points) ELSE total_points_burned END
  WHERE id = p_user_id;

  -- Generate unique transaction_id: TXN-YYYYMMDD-XXXXXXXX
  v_txn_id := 'TXN-' ||
    TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    UPPER(SUBSTRING(MD5(gen_random_uuid()::TEXT) FROM 1 FOR 8));

  -- Insert transaction record
  INSERT INTO points_transactions (user_id, points, transaction_type, description, reference_id, transaction_id)
  VALUES (p_user_id, p_points, p_transaction_type, p_description, p_reference_id, v_txn_id)
  RETURNING id INTO v_new_id;

  -- Return the transaction_id for the caller
  RETURN v_txn_id;
END;
$$ LANGUAGE plpgsql;
