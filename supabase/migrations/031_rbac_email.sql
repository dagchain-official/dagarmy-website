-- Migration 031: RBAC Email System
-- Adds department_email to admin_roles, email drafts and sent log tables

-- 1. Add department_email column to admin_roles
ALTER TABLE admin_roles ADD COLUMN IF NOT EXISTS department_email TEXT;

-- 2. Email drafts table (saved before sending)
CREATE TABLE IF NOT EXISTS email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_email TEXT NOT NULL,
  to_addresses TEXT[] DEFAULT '{}',
  cc_addresses TEXT[] DEFAULT '{}',
  bcc_addresses TEXT[] DEFAULT '{}',
  subject TEXT DEFAULT '',
  html_body TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sent email log
CREATE TABLE IF NOT EXISTS email_sent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
  from_email TEXT NOT NULL,
  to_addresses TEXT[] NOT NULL,
  cc_addresses TEXT[] DEFAULT '{}',
  subject TEXT NOT NULL,
  message_id TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_email_drafts_admin_id ON email_drafts(admin_id);
CREATE INDEX IF NOT EXISTS idx_email_sent_log_sent_by ON email_sent_log(sent_by);
CREATE INDEX IF NOT EXISTS idx_email_sent_log_from_email ON email_sent_log(from_email);
CREATE INDEX IF NOT EXISTS idx_admin_roles_department_email ON admin_roles(department_email);
