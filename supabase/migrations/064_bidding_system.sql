-- ================================================================
-- Migration 064: DAGARMY Bidding / Auction System
-- ================================================================
-- Tables: bid_items, bids
-- Functions: place_or_increase_bid, close_auction, notify_auction_milestone
-- ================================================================

-- ── bid_items: Products posted for auction (admin-managed) ──────
CREATE TABLE IF NOT EXISTS bid_items (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                    TEXT NOT NULL,
  description              TEXT NOT NULL,
  features                 JSONB DEFAULT '[]',     -- ["Feature 1", "Feature 2", ...]
  images                   JSONB DEFAULT '[]',     -- [{ url, alt, is_primary }]
  status                   TEXT NOT NULL DEFAULT 'upcoming'
                             CHECK (status IN ('upcoming','active','closed','cancelled')),

  starts_at                TIMESTAMPTZ NOT NULL,
  ends_at                  TIMESTAMPTZ NOT NULL,

  starting_bid             INTEGER NOT NULL CHECK (starting_bid > 0),
  min_increment            INTEGER NOT NULL DEFAULT 10 CHECK (min_increment > 0),
  max_winners              INTEGER NOT NULL DEFAULT 1 CHECK (max_winners >= 1),

  current_highest_bid      INTEGER DEFAULT 0,
  current_highest_bidder_id UUID REFERENCES users(id) ON DELETE SET NULL,

  total_bids_count         INTEGER DEFAULT 0,
  total_dag_locked         INTEGER DEFAULT 0,

  -- Post-close fields
  closed_at                TIMESTAMPTZ,
  admin_note               TEXT,           -- internal: shipping info, KYC notes, etc.

  created_by               UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ── bids: One row per user per item (top-ups mutate this row) ───
CREATE TABLE IF NOT EXISTS bids (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id      UUID NOT NULL REFERENCES bid_items(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bid_amount   INTEGER NOT NULL CHECK (bid_amount > 0),  -- total locked stake
  status       TEXT NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active','won','lost','refunded')),
  rank         INTEGER,         -- 1 = highest (updated on each new bid)
  placed_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (item_id, user_id)     -- one bid per user per item (top-ups update this row)
);

-- ── bid_activity_log: Immutable append-only ticker feed ─────────
CREATE TABLE IF NOT EXISTS bid_activity_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id      UUID NOT NULL REFERENCES bid_items(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_added INTEGER NOT NULL,     -- how many points added in THIS action
  total_bid    INTEGER NOT NULL,     -- user's total stake after this action
  action       TEXT NOT NULL CHECK (action IN ('new_bid','top_up')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bid_items_status     ON bid_items(status);
CREATE INDEX IF NOT EXISTS idx_bid_items_ends_at    ON bid_items(ends_at);
CREATE INDEX IF NOT EXISTS idx_bids_item_id         ON bids(item_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id         ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_item_amount     ON bids(item_id, bid_amount DESC);
CREATE INDEX IF NOT EXISTS idx_bid_activity_item    ON bid_activity_log(item_id, created_at DESC);

-- ── Updated_at trigger ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bid_items_updated_at ON bid_items;
CREATE TRIGGER trg_bid_items_updated_at
  BEFORE UPDATE ON bid_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_bids_updated_at ON bids;
CREATE TRIGGER trg_bids_updated_at
  BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- CORE FUNCTION: place_or_increase_bid
-- ================================================================
-- Called by API route for both "new bid" and "top-up existing bid".
-- Atomically:
--   1. Validates auction is active and amount is valid
--   2. Deducts DAG Points from user
--   3. Inserts/updates bid row
--   4. Updates bid_items.current_highest_bid if needed
--   5. Re-ranks all bids for this item
--   6. Appends to bid_activity_log
-- Returns: JSONB { ok, error, new_total }
-- ================================================================
CREATE OR REPLACE FUNCTION place_or_increase_bid(
  p_user_id   UUID,
  p_item_id   UUID,
  p_amount    INTEGER    -- DAG Points to ADD (on top-up, this is the delta)
)
RETURNS JSONB AS $$
DECLARE
  v_item           bid_items%ROWTYPE;
  v_existing_bid   bids%ROWTYPE;
  v_user_points    INTEGER;
  v_new_total      INTEGER;
  v_min_required   INTEGER;
  v_action         TEXT;
BEGIN
  -- ── 1. Load and validate auction ──────────────────────────────
  SELECT * INTO v_item FROM bid_items WHERE id = p_item_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Auction not found');
  END IF;

  IF v_item.status <> 'active' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Auction is not active');
  END IF;

  IF NOW() > v_item.ends_at THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Auction has ended');
  END IF;

  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bid amount must be positive');
  END IF;

  -- ── 2. Check user DAG Points ───────────────────────────────────
  SELECT dag_points INTO v_user_points FROM users WHERE id = p_user_id FOR UPDATE;

  IF v_user_points < p_amount THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Insufficient DAG Points');
  END IF;

  -- ── 3. Load existing bid (if any) ─────────────────────────────
  SELECT * INTO v_existing_bid FROM bids
  WHERE item_id = p_item_id AND user_id = p_user_id;

  IF FOUND THEN
    v_new_total := v_existing_bid.bid_amount + p_amount;
    v_action    := 'top_up';
  ELSE
    v_new_total := p_amount;
    v_action    := 'new_bid';
  END IF;

  -- ── 4. Validate minimum bid / increment rules ──────────────────
  IF NOT FOUND THEN
    -- New bidder: must meet starting_bid AND be > current_highest + increment
    -- (unless no bids yet — first bid just needs starting_bid)
    IF v_item.current_highest_bid = 0 THEN
      v_min_required := v_item.starting_bid;
    ELSE
      v_min_required := v_item.current_highest_bid + v_item.min_increment;
    END IF;

    IF v_new_total < v_min_required THEN
      RETURN jsonb_build_object(
        'ok', false,
        'error', format('Minimum bid is %s DAG Points', v_min_required),
        'min_required', v_min_required
      );
    END IF;
  ELSE
    -- Existing bidder top-up: their NEW total must be > current_highest + increment
    -- (unless they ARE the current highest bidder — then just adding is fine)
    IF v_item.current_highest_bidder_id <> p_user_id THEN
      v_min_required := v_item.current_highest_bid + v_item.min_increment;
      IF v_new_total < v_min_required THEN
        RETURN jsonb_build_object(
          'ok', false,
          'error', format('Top-up must bring your total to at least %s DAG Points', v_min_required),
          'min_required', v_min_required
        );
      END IF;
    END IF;
  END IF;

  -- ── 5. Deduct DAG Points from user ────────────────────────────
  UPDATE users
  SET dag_points = dag_points - p_amount
  WHERE id = p_user_id;

  -- Record transaction
  INSERT INTO points_transactions (user_id, points, transaction_type, description, reference_id)
  VALUES (p_user_id, -p_amount, 'bid_lock',
    format('Bid locked for auction: %s (+%s DAG Points)', v_item.title, p_amount),
    p_item_id::TEXT);

  -- ── 6. Insert / update bids row ───────────────────────────────
  INSERT INTO bids (item_id, user_id, bid_amount)
  VALUES (p_item_id, p_user_id, v_new_total)
  ON CONFLICT (item_id, user_id)
  DO UPDATE SET bid_amount = v_new_total;

  -- ── 7. Update bid_items aggregate fields ──────────────────────
  UPDATE bid_items
  SET
    current_highest_bid       = GREATEST(current_highest_bid, v_new_total),
    current_highest_bidder_id = CASE
      WHEN v_new_total >= current_highest_bid THEN p_user_id
      ELSE current_highest_bidder_id
    END,
    total_bids_count = CASE
      WHEN v_action = 'new_bid' THEN total_bids_count + 1
      ELSE total_bids_count
    END,
    total_dag_locked = total_dag_locked + p_amount
  WHERE id = p_item_id;

  -- ── 8. Re-rank all bids for this item ─────────────────────────
  UPDATE bids b
  SET rank = ranked.r
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY bid_amount DESC, placed_at ASC) AS r
    FROM bids WHERE item_id = p_item_id
  ) AS ranked
  WHERE b.id = ranked.id AND b.item_id = p_item_id;

  -- ── 9. Log activity for ticker feed ───────────────────────────
  INSERT INTO bid_activity_log (item_id, user_id, amount_added, total_bid, action)
  VALUES (p_item_id, p_user_id, p_amount, v_new_total, v_action);

  RETURN jsonb_build_object('ok', true, 'new_total', v_new_total, 'action', v_action);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- CORE FUNCTION: close_auction
-- ================================================================
-- Called by admin API or cron job when auction ends_at is reached.
-- Atomically:
--   1. Marks top N bids as 'won' (N = max_winners)
--   2. Marks remaining bids as 'lost' and refunds DAG Points
--   3. Deducts winner's locked points permanently (already deducted at bid time)
--   4. Credits refunds to losers via points_transactions
--   5. Marks item as 'closed'
-- ================================================================
CREATE OR REPLACE FUNCTION close_auction(p_item_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_item       bid_items%ROWTYPE;
  v_winners    INTEGER;
  v_loser      RECORD;
BEGIN
  SELECT * INTO v_item FROM bid_items WHERE id = p_item_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Auction not found');
  END IF;

  IF v_item.status = 'closed' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Auction already closed');
  END IF;

  -- ── Mark top N bids as 'won' ──────────────────────────────────
  UPDATE bids
  SET status = 'won'
  WHERE item_id = p_item_id
    AND rank <= v_item.max_winners;

  GET DIAGNOSTICS v_winners = ROW_COUNT;

  -- ── Refund losers ─────────────────────────────────────────────
  FOR v_loser IN
    SELECT b.id, b.user_id, b.bid_amount
    FROM bids b
    WHERE b.item_id = p_item_id AND b.rank > v_item.max_winners
  LOOP
    -- Credit DAG Points back
    UPDATE users
    SET dag_points = dag_points + v_loser.bid_amount
    WHERE id = v_loser.user_id;

    -- Record refund transaction
    INSERT INTO points_transactions (user_id, points, transaction_type, description, reference_id)
    VALUES (v_loser.user_id, v_loser.bid_amount, 'bid_refund',
      format('Bid refunded — auction closed: %s', v_item.title),
      p_item_id::TEXT);

    -- Mark bid as refunded
    UPDATE bids SET status = 'refunded' WHERE id = v_loser.id;
  END LOOP;

  -- ── Handle items with NO bids (cancelled case) ────────────────
  IF v_winners = 0 THEN
    UPDATE bid_items SET status = 'cancelled', closed_at = NOW() WHERE id = p_item_id;
    RETURN jsonb_build_object('ok', true, 'winners', 0, 'note', 'No bids — marked cancelled');
  END IF;

  -- ── Mark item as closed ────────────────────────────────────────
  UPDATE bid_items SET status = 'closed', closed_at = NOW() WHERE id = p_item_id;

  -- ── Send in-platform notification to admins ────────────────────
  INSERT INTO notifications (title, message, type, priority, target_role, action_url, icon)
  VALUES (
    format('🏆 Auction Closed: %s', v_item.title),
    format('%s winner(s) selected. Review and initiate KYC + shipping.', v_winners),
    'success', 'high', 'admin',
    format('/admin/bidding/%s', p_item_id),
    '🏆'
  );

  RETURN jsonb_build_object('ok', true, 'winners', v_winners, 'item_id', p_item_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- Auto-activate auctions when starts_at is reached
-- (Called by cron job — just marks status='active')
-- ================================================================
CREATE OR REPLACE FUNCTION activate_pending_auctions()
RETURNS INTEGER AS $$
DECLARE v_count INTEGER;
BEGIN
  UPDATE bid_items
  SET status = 'active'
  WHERE status = 'upcoming'
    AND starts_at <= NOW();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- Auto-close auctions when ends_at is reached
-- (Called by cron job)
-- ================================================================
CREATE OR REPLACE FUNCTION close_expired_auctions()
RETURNS INTEGER AS $$
DECLARE
  v_item  RECORD;
  v_count INTEGER := 0;
BEGIN
  FOR v_item IN
    SELECT id FROM bid_items
    WHERE status = 'active' AND ends_at <= NOW()
  LOOP
    PERFORM close_auction(v_item.id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- RLS POLICIES
-- ================================================================

ALTER TABLE bid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_activity_log ENABLE ROW LEVEL SECURITY;

-- bid_items: everyone can read active/upcoming/closed; only admins write
CREATE POLICY "Anyone can view bid items"
  ON bid_items FOR SELECT USING (true);

CREATE POLICY "Master admin can manage bid items"
  ON bid_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.is_master_admin = true OR users.role = 'admin')
  ));

-- bids: users see all bids for leaderboard (amount visible, user names via join)
CREATE POLICY "Anyone can view bids"
  ON bids FOR SELECT USING (true);

CREATE POLICY "Users can only insert their own bids"
  ON bids FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all bids"
  ON bids FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.is_master_admin = true OR users.role = 'admin')
  ));

-- bid_activity_log: readable by all (for ticker feed)
CREATE POLICY "Anyone can view bid activity"
  ON bid_activity_log FOR SELECT USING (true);

-- ================================================================
-- GRANTS
-- ================================================================
GRANT ALL ON bid_items TO authenticated;
GRANT ALL ON bids TO authenticated;
GRANT ALL ON bid_activity_log TO authenticated;
GRANT EXECUTE ON FUNCTION place_or_increase_bid TO authenticated;
GRANT EXECUTE ON FUNCTION close_auction TO service_role;
GRANT EXECUTE ON FUNCTION activate_pending_auctions TO service_role;
GRANT EXECUTE ON FUNCTION close_expired_auctions TO service_role;
