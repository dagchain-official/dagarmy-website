-- ════════════════════════════════════════════════════════════════════
-- Migration 066: Mission Page Rebuild
-- Adds proof_type, recurrence columns; extends mission_type to include
-- 'streak'; wipes old tasks; seeds all new Daily/Streak/Community tasks.
-- ════════════════════════════════════════════════════════════════════

-- ── 0. Extend platform CHECK to include DAG ecosystem platforms ────
ALTER TABLE public.social_tasks
  DROP CONSTRAINT IF EXISTS social_tasks_platform_check;

ALTER TABLE public.social_tasks
  ADD CONSTRAINT social_tasks_platform_check
  CHECK (platform IN (
    'youtube','twitter','facebook','instagram','telegram','discord',
    'medium','linkedin','pinterest','tiktok','coinmarketcap',
    'dagchain','dagarmy','daggpt'
  ));

-- ── 0b. Extend task_type CHECK to include our new types ────────────
ALTER TABLE public.social_tasks
  DROP CONSTRAINT IF EXISTS social_tasks_task_type_check;

-- (no re-add needed - task_type was TEXT NOT NULL with no CHECK in migration 020)

-- ── 1. Extend mission_type CHECK to allow 'streak' ─────────────────
ALTER TABLE public.social_tasks
  DROP CONSTRAINT IF EXISTS social_tasks_mission_type_check;

ALTER TABLE public.social_tasks
  ADD CONSTRAINT social_tasks_mission_type_check
  CHECK (mission_type IN ('daily', 'community', 'streak'));

-- ── 2. Add proof_type column ───────────────────────────────────────
ALTER TABLE public.social_tasks
  ADD COLUMN IF NOT EXISTS proof_type TEXT NOT NULL DEFAULT 'url_only'
  CHECK (proof_type IN ('url_only', 'screenshot_only', 'url_and_screenshot'));

-- ── 3. Add recurrence column ───────────────────────────────────────
ALTER TABLE public.social_tasks
  ADD COLUMN IF NOT EXISTS recurrence TEXT NOT NULL DEFAULT 'once'
  CHECK (recurrence IN ('daily', 'weekly', 'once'));

-- ── 4. Wipe ALL existing tasks and their submissions ───────────────
DELETE FROM public.social_task_submissions;
DELETE FROM public.social_tasks;

-- ── 5. Seed: DAILY MISSIONS ────────────────────────────────────────
INSERT INTO public.social_tasks
  (platform, task_type, title, description, points, target_url,
   mission_type, proof_type, recurrence, max_completions_per_user, is_active)
VALUES
  -- Sign-in dailies
  ('dagchain', 'sign_in',
   'Sign In to DAGCHAIN.NETWORK',
   'Log in to dagchain.network today and take a screenshot of your dashboard to confirm your daily sign-in.',
   200, 'https://dagchain.network',
   'daily', 'screenshot_only', 'daily', NULL, TRUE),

  ('dagarmy', 'sign_in',
   'Sign In to DAGARMY.NETWORK',
   'Log in to dagarmy.network today and take a screenshot of your dashboard to confirm your daily sign-in.',
   200, 'https://dagarmy.network',
   'daily', 'screenshot_only', 'daily', NULL, TRUE),

  ('daggpt', 'sign_in',
   'Sign In to DAGGPT.NETWORK',
   'Log in to daggpt.network today and take a screenshot of your dashboard to confirm your daily sign-in.',
   200, 'https://daggpt.network',
   'daily', 'screenshot_only', 'daily', NULL, TRUE),

  -- Video post dailies (per platform)
  ('facebook', 'create_video',
   'Post a Video About Our Platforms on Facebook',
   'Create and post a video about DAGCHAIN, DAGARMY, or DAGGPT on your personal Facebook account. Submit the post link and a screenshot.',
   250, 'https://www.facebook.com',
   'daily', 'url_and_screenshot', 'daily', NULL, TRUE),

  ('instagram', 'create_video',
   'Post a Video About Our Platforms on Instagram',
   'Create and post a Reel or video about DAGCHAIN, DAGARMY, or DAGGPT on your personal Instagram. Submit the post link and a screenshot.',
   250, 'https://www.instagram.com',
   'daily', 'url_and_screenshot', 'daily', NULL, TRUE),

  ('twitter', 'create_video',
   'Post a Video About Our Platforms on X (Twitter)',
   'Create and post a video tweet about DAGCHAIN, DAGARMY, or DAGGPT on your personal X/Twitter account. Submit the post link and a screenshot.',
   250, 'https://x.com',
   'daily', 'url_and_screenshot', 'daily', NULL, TRUE),

  ('tiktok', 'create_video',
   'Post a Video About Our Platforms on TikTok',
   'Create and post a TikTok video about DAGCHAIN, DAGARMY, or DAGGPT on your personal TikTok account. Submit the post link and a screenshot.',
   250, 'https://www.tiktok.com',
   'daily', 'url_and_screenshot', 'daily', NULL, TRUE);

-- ── 6. Seed: STREAK MISSIONS ───────────────────────────────────────
INSERT INTO public.social_tasks
  (platform, task_type, title, description, points, target_url,
   mission_type, proof_type, recurrence, max_completions_per_user, is_active)
VALUES
  ('dagchain', 'login_streak',
   '7-Day Login Streak - DAGCHAIN.NETWORK',
   'Sign in to dagchain.network every day Monday through Sunday without any break. Submit screenshots showing your login for all 7 days. Earn 300 DAG Points per platform. Claimable once per week (up to 52 times per year).',
   300, 'https://dagchain.network',
   'streak', 'screenshot_only', 'weekly', 52, TRUE),

  ('dagarmy', 'login_streak',
   '7-Day Login Streak - DAGARMY.NETWORK',
   'Sign in to dagarmy.network every day Monday through Sunday without any break. Submit screenshots showing your login for all 7 days. Earn 300 DAG Points per platform.',
   300, 'https://dagarmy.network',
   'streak', 'screenshot_only', 'weekly', 52, TRUE),

  ('daggpt', 'login_streak',
   '7-Day Login Streak - DAGGPT.NETWORK',
   'Sign in to daggpt.network every day Monday through Sunday without any break. Submit screenshots showing your login for all 7 days. Earn 300 DAG Points per platform.',
   300, 'https://daggpt.network',
   'streak', 'screenshot_only', 'weekly', 52, TRUE);

-- ── 7. Seed: COMMUNITY MISSIONS (one-time follow/subscribe) ────────
INSERT INTO public.social_tasks
  (platform, task_type, title, description, points, target_url,
   mission_type, proof_type, recurrence, max_completions_per_user, is_active)
VALUES
  ('facebook', 'follow',
   'Follow DAGChain on Facebook',
   'Follow our official DAGChain Facebook page and submit a screenshot of the page showing you have liked/followed it.',
   200, 'https://www.facebook.com/people/DagChain/61584495032870/',
   'community', 'screenshot_only', 'once', 1, TRUE),

  ('instagram', 'follow',
   'Follow DAGChain on Instagram',
   'Follow @dagchain.network on Instagram and submit a screenshot of the profile showing you are following.',
   200, 'https://www.instagram.com/dagchain.network/',
   'community', 'screenshot_only', 'once', 1, TRUE),

  ('youtube', 'subscribe',
   'Subscribe to DAGChain on YouTube',
   'Subscribe to the DAGChain YouTube channel and submit a screenshot showing you are subscribed.',
   200, 'https://www.youtube.com/@dagchain.network',
   'community', 'screenshot_only', 'once', 1, TRUE),

  ('twitter', 'follow',
   'Follow DAGChain on X (Twitter)',
   'Follow @dagchain_ai on X/Twitter and submit a screenshot of the profile showing you are following.',
   200, 'https://x.com/dagchain_ai',
   'community', 'screenshot_only', 'once', 1, TRUE),

  ('linkedin', 'follow',
   'Follow DAGChain on LinkedIn',
   'Follow DAGChain on LinkedIn and submit a screenshot showing you follow the company page.',
   200, 'https://www.linkedin.com/company/dag-chain',
   'community', 'screenshot_only', 'once', 1, TRUE),

  ('tiktok', 'follow',
   'Follow DAGChain on TikTok',
   'Follow @dagchain on TikTok and submit a screenshot of the profile showing you are following.',
   200, 'https://www.tiktok.com/@dagchain',
   'community', 'screenshot_only', 'once', 1, TRUE),

  ('medium', 'follow',
   'Follow DAGChain on Medium',
   'Follow @dagchain on Medium and submit a screenshot of the profile showing you are following.',
   200, 'https://medium.com/@dagchain',
   'community', 'screenshot_only', 'once', 1, TRUE);

-- ── 8. Verify ──────────────────────────────────────────────────────
-- SELECT mission_type, COUNT(*) FROM public.social_tasks GROUP BY mission_type;
-- Expected: daily=7, streak=3, community=7
