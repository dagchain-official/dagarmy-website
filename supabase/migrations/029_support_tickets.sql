-- =====================================================
-- Migration 029: Support Ticketing System
-- Creates support_tickets and support_ticket_messages tables
-- =====================================================

-- ── Ticket number sequence ────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS support_ticket_seq START 1;

-- ── support_tickets ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number   TEXT UNIQUE NOT NULL,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email      TEXT NOT NULL,
  user_name       TEXT,
  subject         TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('technical','billing','course','rewards','account','other')),
  priority        TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting_on_user','resolved','closed')),
  assigned_to     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ
);

-- ── support_ticket_messages ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id    UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type  TEXT NOT NULL CHECK (sender_type IN ('user','admin')),
  sender_email TEXT NOT NULL,
  sender_name  TEXT,
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-generate ticket_number on INSERT ─────────────────────────────────
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || LPAD(nextval('support_ticket_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_ticket_number ON support_tickets;
CREATE TRIGGER trg_generate_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
  EXECUTE FUNCTION generate_ticket_number();

-- ── Auto-update updated_at on ticket update ───────────────────────────────
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_ticket_timestamp ON support_tickets;
CREATE TRIGGER trg_update_ticket_timestamp
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_timestamp();

-- ── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_email ON support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket_id ON support_ticket_messages(ticket_id);

-- ── RLS: disable (service role handles all access) ────────────────────────
ALTER TABLE support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages DISABLE ROW LEVEL SECURITY;
