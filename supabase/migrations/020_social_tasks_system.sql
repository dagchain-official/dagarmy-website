-- ============================================================
-- Migration 020: Social Media Tasks / Quest System
-- ============================================================
-- Allows admin to create social media tasks (subscribe, follow,
-- like, comment, share, tag, create content) with DAG point
-- rewards. Users submit proof; admin approves/rejects.
-- ============================================================

-- 1. Social Tasks table (admin-created)
CREATE TABLE IF NOT EXISTS public.social_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  target_url TEXT,                          -- link to the post/channel/page
  is_active BOOLEAN DEFAULT TRUE,
  max_completions_per_user INTEGER DEFAULT 1, -- how many times a user can complete this
  expires_at TIMESTAMP WITH TIME ZONE,      -- NULL = never expires
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Social Task Submissions table (user proof submissions)
CREATE TABLE IF NOT EXISTS public.social_task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.social_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  proof_url TEXT,                            -- link proof (e.g. comment URL)
  proof_screenshot_url TEXT,                 -- uploaded screenshot URL
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_social_tasks_platform ON public.social_tasks(platform);
CREATE INDEX IF NOT EXISTS idx_social_tasks_active ON public.social_tasks(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_social_task_submissions_task ON public.social_task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_social_task_submissions_user ON public.social_task_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_social_task_submissions_status ON public.social_task_submissions(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_social_task_submissions_unique
  ON public.social_task_submissions(task_id, user_id)
  WHERE status IN ('pending', 'approved');

-- 4. Config key for LT bonus rate on social tasks
INSERT INTO public.rewards_config (config_key, config_value, description)
VALUES ('social_task_lt_bonus_rate', 20, 'Extra percentage DAG LIEUTENANT members earn on social tasks')
ON CONFLICT (config_key) DO NOTHING;

-- 5. RLS policies
ALTER TABLE public.social_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_task_submissions ENABLE ROW LEVEL SECURITY;

-- Everyone can read active tasks
DROP POLICY IF EXISTS "Anyone can view active social tasks" ON public.social_tasks;
CREATE POLICY "Anyone can view active social tasks"
  ON public.social_tasks FOR SELECT
  USING (is_active = TRUE);

-- Service role can do everything (API routes use supabaseAdmin)
DROP POLICY IF EXISTS "Service role full access social_tasks" ON public.social_tasks;
CREATE POLICY "Service role full access social_tasks"
  ON public.social_tasks FOR ALL
  USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access social_task_submissions" ON public.social_task_submissions;
CREATE POLICY "Service role full access social_task_submissions"
  ON public.social_task_submissions FOR ALL
  USING (TRUE) WITH CHECK (TRUE);

-- Users can view their own submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON public.social_task_submissions;
CREATE POLICY "Users can view own submissions"
  ON public.social_task_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
DROP POLICY IF EXISTS "Users can submit proof" ON public.social_task_submissions;
CREATE POLICY "Users can submit proof"
  ON public.social_task_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
