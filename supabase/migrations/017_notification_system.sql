-- Notification System Migration
-- Supports global and individual user notifications

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'announcement')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Notification targeting
  is_global BOOLEAN DEFAULT false,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_role TEXT, -- 'student', 'trainer', 'admin', etc.
  
  -- Sender information
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_name TEXT,
  
  -- Additional data
  action_url TEXT,
  action_label TEXT,
  icon TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Analytics
  total_recipients INTEGER DEFAULT 0,
  total_read INTEGER DEFAULT 0
);

-- Create notification_recipients table (tracks who received and read notifications)
CREATE TABLE IF NOT EXISTS notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique notification per user
  UNIQUE(notification_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_global ON notifications(is_global) WHERE is_global = true;
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user_id) WHERE target_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_target_role ON notifications(target_role) WHERE target_role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_active ON notifications(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notification_recipients_user ON notification_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_notification ON notification_recipients(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_unread ON notification_recipients(user_id, is_read) WHERE is_read = false;

-- Function to create notification recipients when a notification is created
CREATE OR REPLACE FUNCTION create_notification_recipients()
RETURNS TRIGGER AS $$
BEGIN
  -- If it's a global notification, create recipients for all users
  IF NEW.is_global = true THEN
    INSERT INTO notification_recipients (notification_id, user_id)
    SELECT NEW.id, id FROM users
    WHERE is_active = true
    ON CONFLICT (notification_id, user_id) DO NOTHING;
    
    -- Update total recipients count
    UPDATE notifications 
    SET total_recipients = (SELECT COUNT(*) FROM users WHERE is_active = true)
    WHERE id = NEW.id;
    
  -- If it's targeted to a specific role
  ELSIF NEW.target_role IS NOT NULL THEN
    INSERT INTO notification_recipients (notification_id, user_id)
    SELECT NEW.id, id FROM users
    WHERE role = NEW.target_role AND is_active = true
    ON CONFLICT (notification_id, user_id) DO NOTHING;
    
    -- Update total recipients count
    UPDATE notifications 
    SET total_recipients = (SELECT COUNT(*) FROM users WHERE role = NEW.target_role AND is_active = true)
    WHERE id = NEW.id;
    
  -- If it's targeted to a specific user
  ELSIF NEW.target_user_id IS NOT NULL THEN
    INSERT INTO notification_recipients (notification_id, user_id)
    VALUES (NEW.id, NEW.target_user_id)
    ON CONFLICT (notification_id, user_id) DO NOTHING;
    
    -- Update total recipients count
    UPDATE notifications 
    SET total_recipients = 1
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create recipients when notification is created
DROP TRIGGER IF EXISTS trigger_create_notification_recipients ON notifications;
CREATE TRIGGER trigger_create_notification_recipients
AFTER INSERT ON notifications
FOR EACH ROW
EXECUTE FUNCTION create_notification_recipients();

-- Function to update read count when notification is marked as read
CREATE OR REPLACE FUNCTION update_notification_read_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false THEN
    UPDATE notifications 
    SET total_read = total_read + 1
    WHERE id = NEW.notification_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update read count
DROP TRIGGER IF EXISTS trigger_update_notification_read_count ON notification_recipients;
CREATE TRIGGER trigger_update_notification_read_count
AFTER UPDATE ON notification_recipients
FOR EACH ROW
EXECUTE FUNCTION update_notification_read_count();

-- RLS Policies for notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all notifications"
ON notifications FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.is_master_admin = true OR users.role = 'admin')
  )
);

-- Users can view active notifications targeted to them
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
TO authenticated
USING (
  is_active = true AND
  (
    is_global = true OR
    target_user_id = auth.uid() OR
    target_role = (SELECT role FROM users WHERE id = auth.uid())
  )
);

-- RLS Policies for notification_recipients table
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own notification recipients
CREATE POLICY "Users can view their notification recipients"
ON notification_recipients FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their notification recipients"
ON notification_recipients FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all notification recipients
CREATE POLICY "Admins can view all notification recipients"
ON notification_recipients FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.is_master_admin = true OR users.role = 'admin')
  )
);

-- Grant permissions
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON notification_recipients TO authenticated;
