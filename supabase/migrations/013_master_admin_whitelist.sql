-- Master Admin Whitelist
-- Only these email addresses can access master admin panel

CREATE TABLE IF NOT EXISTS master_admin_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Insert the 3 master admin emails
INSERT INTO master_admin_whitelist (email, is_active) VALUES
  ('admin@dagchain.network', true),
  ('answervinod@gmail.com', true),
  ('answervinod07@outlook.com', true)
ON CONFLICT (email) DO NOTHING;

-- Create index
CREATE INDEX IF NOT EXISTS idx_master_admin_whitelist_email ON master_admin_whitelist(email);
CREATE INDEX IF NOT EXISTS idx_master_admin_whitelist_active ON master_admin_whitelist(is_active);

-- Function to check if email is master admin
CREATE OR REPLACE FUNCTION is_master_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM master_admin_whitelist 
    WHERE email = user_email AND is_active = true
  );
END;
$$ LANGUAGE plpgsql;

-- Update users table to set is_master_admin flag for whitelisted emails
UPDATE users 
SET is_master_admin = true 
WHERE email IN (
  SELECT email FROM master_admin_whitelist WHERE is_active = true
);

-- Add comment
COMMENT ON TABLE master_admin_whitelist IS 'Whitelist of email addresses allowed to access master admin panel';
