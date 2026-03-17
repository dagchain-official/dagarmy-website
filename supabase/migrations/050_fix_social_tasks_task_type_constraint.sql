-- Migration 050: Fix social_tasks task_type CHECK constraint
-- Drops the old restrictive constraint and replaces it with one that
-- includes all daily mission content-creation task types.

ALTER TABLE public.social_tasks
  DROP CONSTRAINT IF EXISTS social_tasks_task_type_check;

ALTER TABLE public.social_tasks
  ADD CONSTRAINT social_tasks_task_type_check CHECK (task_type IN (
    -- Community mission engagement actions
    'subscribe',
    'follow',
    'join',
    'like',
    'comment',
    'share',
    'retweet',
    'watch',
    'tag',
    -- Daily mission content-creation actions
    'create_short',
    'create_reel',
    'create_post',
    'create_video',
    'create_thread',
    'story_mention',
    'review'
  ));
