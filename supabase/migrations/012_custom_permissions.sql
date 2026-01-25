-- Custom Permissions Table
-- Allows master admin to create custom permission types

CREATE TABLE IF NOT EXISTS custom_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT UNIQUE NOT NULL, -- e.g., 'custom.special_access'
  permission_label TEXT NOT NULL, -- e.g., 'Special Access'
  permission_description TEXT NOT NULL, -- Description of what this permission does
  module_key TEXT NOT NULL, -- Which module it belongs to (dashboard, users, courses, etc.)
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create index
CREATE INDEX idx_custom_permissions_module ON custom_permissions(module_key);
CREATE INDEX idx_custom_permissions_active ON custom_permissions(is_active);

-- Add comment
COMMENT ON TABLE custom_permissions IS 'Custom permission types created by master admin';
