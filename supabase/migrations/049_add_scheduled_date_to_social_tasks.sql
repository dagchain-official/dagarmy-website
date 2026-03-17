-- Add scheduled_date to social_tasks for Daily Mission calendar scheduling
-- NULL = not scheduled (published immediately / manually activated)
-- DATE value = mission goes live on that calendar date (activated by cron or API check)

ALTER TABLE social_tasks
  ADD COLUMN IF NOT EXISTS scheduled_date DATE DEFAULT NULL;

-- When scheduled_date is set, is_active should start as false until that date arrives
-- Index for cron/scheduler queries
CREATE INDEX IF NOT EXISTS idx_social_tasks_scheduled_date ON social_tasks(scheduled_date)
  WHERE scheduled_date IS NOT NULL;

COMMENT ON COLUMN social_tasks.scheduled_date IS 'Date this daily mission goes live. NULL = manual activation. Used for bulk scheduling.';
