-- Add mission_type to social_tasks
-- Values: 'daily' | 'community'
-- Default to 'community' for all existing tasks (they were social/community tasks)

ALTER TABLE social_tasks
  ADD COLUMN IF NOT EXISTS mission_type TEXT NOT NULL DEFAULT 'community'
  CHECK (mission_type IN ('daily', 'community'));

-- Index for fast filtering
CREATE INDEX IF NOT EXISTS idx_social_tasks_mission_type ON social_tasks(mission_type);

COMMENT ON COLUMN social_tasks.mission_type IS 'Type of mission: daily (resets/repeatable) or community (social/one-time)';
