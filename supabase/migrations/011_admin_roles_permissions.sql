-- Admin Roles and Permissions System
-- This migration creates a comprehensive RBAC system for admin panel access

-- Admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL, -- Display name like "Marketing Manager", "HR Admin"
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of permission strings
  is_active BOOLEAN DEFAULT true,
  assigned_by UUID REFERENCES users(id), -- Master admin who assigned this
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One role per user (but can have multiple permissions)
);

-- Admin activity audit log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- e.g., 'users.edit', 'courses.delete'
  resource_type TEXT, -- e.g., 'user', 'course', 'role'
  resource_id UUID, -- ID of the affected resource
  details JSONB, -- Additional context
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_is_active ON admin_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS admin_roles_updated_at ON admin_roles;
CREATE TRIGGER admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_roles_updated_at();

-- Add admin_role column to users table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='is_admin') THEN
    ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='is_master_admin') THEN
    ALTER TABLE users ADD COLUMN is_master_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create index on admin flags
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_master_admin ON users(is_master_admin);

-- Insert comment for documentation
COMMENT ON TABLE admin_roles IS 'Stores admin role assignments and their specific permissions';
COMMENT ON TABLE admin_audit_log IS 'Audit trail of all admin actions for security and compliance';
COMMENT ON COLUMN admin_roles.permissions IS 'JSONB array of permission strings like ["users.view", "courses.edit"]';
COMMENT ON COLUMN users.is_master_admin IS 'Master admin flag - has all permissions and cannot be modified by others';
