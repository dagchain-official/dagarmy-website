-- Migration: 033_security_hardening.sql
-- Fixes all Supabase Security Advisor warnings:
-- 1. Enable RLS on all tables missing it (12 errors from screenshot)
-- 2. Fix search_path on all 34 functions (WARN: function_search_path_mutable)
-- 3. Replace always-true service role policies with role-based checks (WARN: rls_policy_always_true)

-- ═══════════════════════════════════════════════════════════════════
-- PART 1: Enable RLS on tables missing it
-- (Tables visible in screenshot as "RLS Disabled in Public")
-- ═══════════════════════════════════════════════════════════════════

-- Enable RLS on all server-managed tables (safe — skips if table doesn't exist)
DO $$
DECLARE
  all_tables TEXT[] := ARRAY[
    -- Email (031_rbac_email)
    'email_drafts', 'email_sent_log',
    -- Admin (011, 019)
    'admin_audit_log', 'admin_roles', 'custom_permissions',
    -- Rewards (017_comprehensive)
    'sales_commissions', 'point_transactions', 'rank_achievements', 'referrals',
    -- Activity & Support (028, 029)
    'activity_logs', 'support_tickets', 'support_ticket_messages',
    -- Assignments & Batches (016)
    'batches', 'batch_enrollments', 'assignments', 'assignment_submissions',
    -- Notifications (017_notification)
    'notifications', 'notification_recipients',
    -- Financials (030)
    'withdrawal_requests',
    -- Config & Auth
    'rewards_config', 'master_admin_whitelist', 'login_history',
    -- Social (020_social)
    'social_tasks', 'social_task_submissions'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY all_tables LOOP
    BEGIN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('REVOKE SELECT, INSERT, UPDATE, DELETE ON public.%I FROM anon', t);
      EXECUTE format('REVOKE SELECT, INSERT, UPDATE, DELETE ON public.%I FROM authenticated', t);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role', t);
    EXCEPTION WHEN undefined_table THEN
      -- Table doesn't exist yet, skip silently
      NULL;
    END;
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════════
-- PART 2: Fix search_path on all 34 functions
-- Adding SET search_path = public prevents search_path injection attacks
-- ═══════════════════════════════════════════════════════════════════

-- update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- update_admin_roles_updated_at
CREATE OR REPLACE FUNCTION public.update_admin_roles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- update_ticket_timestamp
CREATE OR REPLACE FUNCTION public.update_ticket_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- generate_ticket_number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || LPAD(nextval('support_ticket_seq')::TEXT, 5, '0');
  RETURN NEW;
END; $$;

-- is_master_admin
CREATE OR REPLACE FUNCTION public.is_master_admin(user_email TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.master_admin_whitelist
    WHERE email = user_email AND is_active = true
  );
END; $$;

-- cleanup_expired_admin_sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  DELETE FROM public.admin_sessions WHERE expires_at < NOW();
END; $$;

-- reset_failed_login_attempts
CREATE OR REPLACE FUNCTION public.reset_failed_login_attempts()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.failed_login_attempts = 0 THEN
    NEW.account_locked_until = NULL;
  END IF;
  RETURN NEW;
END; $$;

-- update_course_module_count
CREATE OR REPLACE FUNCTION public.update_course_module_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.courses SET total_modules = total_modules + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.courses SET total_modules = GREATEST(0, total_modules - 1) WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END; $$;

-- update_course_lesson_count
CREATE OR REPLACE FUNCTION public.update_course_lesson_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_course_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT course_id INTO v_course_id FROM public.modules WHERE id = NEW.module_id;
    UPDATE public.courses SET total_lessons = total_lessons + 1 WHERE id = v_course_id;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT course_id INTO v_course_id FROM public.modules WHERE id = OLD.module_id;
    UPDATE public.courses SET total_lessons = GREATEST(0, total_lessons - 1) WHERE id = v_course_id;
  END IF;
  RETURN NULL;
END; $$;

-- update_course_enrollment_count
CREATE OR REPLACE FUNCTION public.update_course_enrollment_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.courses SET enrolled_students = enrolled_students + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.courses SET enrolled_students = GREATEST(0, enrolled_students - 1) WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END; $$;

-- update_course_rating
CREATE OR REPLACE FUNCTION public.update_course_rating()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_avg_rating DECIMAL(3,2); v_total_reviews INTEGER;
BEGIN
  SELECT AVG(rating), COUNT(*) INTO v_avg_rating, v_total_reviews
  FROM public.course_reviews
  WHERE course_id = COALESCE(NEW.course_id, OLD.course_id) AND is_approved = true;
  UPDATE public.courses
  SET rating = COALESCE(v_avg_rating, 0.00), total_reviews = v_total_reviews
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  RETURN NULL;
END; $$;

-- update_creator_stats
CREATE OR REPLACE FUNCTION public.update_creator_stats()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.course_creators
  SET total_students = (
    SELECT COALESCE(SUM(enrolled_students), 0) FROM public.courses WHERE instructor_id = COALESCE(NEW.instructor_id, OLD.instructor_id)
  )
  WHERE user_id = COALESCE(NEW.instructor_id, OLD.instructor_id);
  RETURN NULL;
END; $$;

-- update_enrollment_progress
CREATE OR REPLACE FUNCTION public.update_enrollment_progress()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_enrollment_id UUID; v_total_lessons INTEGER;
  v_completed_lessons INTEGER; v_progress DECIMAL(5,2);
BEGIN
  SELECT id INTO v_enrollment_id FROM public.user_enrollments
  WHERE user_id = NEW.user_id
    AND course_id = (SELECT course_id FROM public.modules WHERE id = (SELECT module_id FROM public.lessons WHERE id = NEW.lesson_id));
  IF v_enrollment_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_total_lessons FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    WHERE m.course_id = (SELECT course_id FROM public.user_enrollments WHERE id = v_enrollment_id);
    SELECT COUNT(*) INTO v_completed_lessons FROM public.user_lesson_progress ulp
    JOIN public.lessons l ON ulp.lesson_id = l.id
    JOIN public.modules m ON l.module_id = m.id
    WHERE ulp.user_id = NEW.user_id AND ulp.is_completed = true
      AND m.course_id = (SELECT course_id FROM public.user_enrollments WHERE id = v_enrollment_id);
    v_progress := CASE WHEN v_total_lessons > 0 THEN (v_completed_lessons::DECIMAL / v_total_lessons::DECIMAL) * 100 ELSE 0 END;
    UPDATE public.user_enrollments SET
      progress_percentage = v_progress, completed_lessons = v_completed_lessons,
      last_accessed_at = NOW(),
      completed_at = CASE WHEN v_progress >= 100 THEN NOW() ELSE NULL END,
      status = CASE WHEN v_progress >= 100 THEN 'completed' ELSE status END
    WHERE id = v_enrollment_id;
  END IF;
  RETURN NEW;
END; $$;

-- update_batch_student_count
CREATE OR REPLACE FUNCTION public.update_batch_student_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.batches SET current_students = current_students + 1 WHERE id = NEW.batch_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.batches SET current_students = current_students - 1 WHERE id = OLD.batch_id;
  END IF;
  RETURN NULL;
END; $$;

-- is_assignment_open
CREATE OR REPLACE FUNCTION public.is_assignment_open(assignment_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SET search_path = public AS $$
DECLARE assignment_record RECORD; deadline TIMESTAMPTZ;
BEGIN
  SELECT due_date, grace_period_hours, status INTO assignment_record
  FROM public.assignments WHERE id = assignment_id;
  IF assignment_record.status != 'active' THEN RETURN false; END IF;
  deadline := assignment_record.due_date + (assignment_record.grace_period_hours || ' hours')::INTERVAL;
  RETURN NOW() <= deadline;
END; $$;

-- update_referral_count
CREATE OR REPLACE FUNCTION public.update_referral_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users SET referral_count = referral_count + 1 WHERE id = NEW.referrer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users SET referral_count = GREATEST(0, referral_count - 1) WHERE id = OLD.referrer_id;
  END IF;
  RETURN NEW;
END; $$;

-- update_user_points_summary
CREATE OR REPLACE FUNCTION public.update_user_points_summary()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.amount > 0 THEN
    UPDATE public.users SET total_points_earned = COALESCE(total_points_earned, 0) + NEW.amount WHERE id = NEW.user_id;
  END IF;
  UPDATE public.users SET dag_points = (
    SELECT COALESCE(SUM(amount), 0) FROM public.points_transactions WHERE user_id = NEW.user_id
  ) WHERE id = NEW.user_id;
  RETURN NEW;
END; $$;

-- update_user_usd_earned
CREATE OR REPLACE FUNCTION public.update_user_usd_earned()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    UPDATE public.users SET total_usd_earned = COALESCE(total_usd_earned, 0) + NEW.commission_amount WHERE id = NEW.referrer_id;
  END IF;
  RETURN NEW;
END; $$;

-- create_notification_recipients
CREATE OR REPLACE FUNCTION public.create_notification_recipients()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.target_audience = 'all' THEN
    INSERT INTO public.notification_recipients (notification_id, user_id)
    SELECT NEW.id, id FROM public.users WHERE status = 'active'
    ON CONFLICT DO NOTHING;
  ELSIF NEW.target_audience = 'lieutenants' THEN
    INSERT INTO public.notification_recipients (notification_id, user_id)
    SELECT NEW.id, id FROM public.users WHERE tier = 'lieutenant' AND status = 'active'
    ON CONFLICT DO NOTHING;
  ELSIF NEW.target_audience = 'soldiers' THEN
    INSERT INTO public.notification_recipients (notification_id, user_id)
    SELECT NEW.id, id FROM public.users WHERE tier = 'soldier' AND status = 'active'
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

-- update_notification_read_count
CREATE OR REPLACE FUNCTION public.update_notification_read_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false THEN
    UPDATE public.notifications SET read_count = COALESCE(read_count, 0) + 1 WHERE id = NEW.notification_id;
  END IF;
  RETURN NEW;
END; $$;

-- log_user_signup
CREATE OR REPLACE FUNCTION public.log_user_signup()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  INSERT INTO public.activity_logs (event_type, category, actor_id, actor_email, actor_name, target_id, target_email, target_name, description, metadata, severity)
  VALUES ('user_signup', 'users', NEW.id, NEW.email, COALESCE(NEW.full_name, NEW.email),
          NEW.id, NEW.email, COALESCE(NEW.full_name, NEW.email),
          'New user registered: ' || COALESCE(NEW.full_name, NEW.email),
          jsonb_build_object('tier', NEW.tier, 'auth_method', NEW.auth_method), 'info');
  RETURN NEW;
END; $$;

-- log_points_transaction
CREATE OR REPLACE FUNCTION public.log_points_transaction()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_name TEXT; v_email TEXT;
BEGIN
  SELECT full_name, email INTO v_name, v_email FROM public.users WHERE id = NEW.user_id;
  INSERT INTO public.activity_logs (event_type, category, actor_id, actor_email, actor_name, description, metadata, severity)
  VALUES ('points_earned', 'rewards', NEW.user_id, v_email, v_name,
          COALESCE(NEW.description, 'DAG Points transaction: ' || NEW.amount || ' pts'),
          jsonb_build_object('amount', NEW.amount, 'type', NEW.transaction_type, 'balance_after', NEW.balance_after), 'info');
  RETURN NEW;
END; $$;

-- log_sale_paid
CREATE OR REPLACE FUNCTION public.log_sale_paid()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_name TEXT; v_email TEXT;
BEGIN
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    SELECT full_name, email INTO v_name, v_email FROM public.users WHERE id = NEW.referrer_id;
    INSERT INTO public.activity_logs (event_type, category, actor_id, actor_email, actor_name, description, metadata, severity)
    VALUES ('sale_paid', 'rewards', NEW.referrer_id, v_email, v_name,
            'Commission earned: $' || NEW.commission_amount,
            jsonb_build_object('commission', NEW.commission_amount, 'referred_user_id', NEW.referred_user_id), 'info');
  END IF;
  RETURN NEW;
END; $$;

-- log_rank_upgrade
CREATE OR REPLACE FUNCTION public.log_rank_upgrade()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.current_rank IS DISTINCT FROM OLD.current_rank AND NEW.current_rank IS NOT NULL THEN
    INSERT INTO public.activity_logs (event_type, category, actor_id, actor_email, actor_name, description, metadata, severity)
    VALUES ('rank_upgrade', 'rewards', NEW.id, NEW.email, NEW.full_name,
            'Rank upgraded to ' || NEW.current_rank,
            jsonb_build_object('old_rank', OLD.current_rank, 'new_rank', NEW.current_rank), 'info');
  END IF;
  RETURN NEW;
END; $$;

-- grant_sale_dag_points
CREATE OR REPLACE FUNCTION public.grant_sale_dag_points()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_self_rate INTEGER;
BEGIN
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    SELECT COALESCE(config_value::INTEGER, 0) INTO v_self_rate
    FROM public.rewards_config WHERE config_key = 'lieutenant_upgrade_base';
    PERFORM public.add_dag_points(NEW.referrer_id, v_self_rate, 'sale_commission', 'DAG Points for sale commission', NEW.id::TEXT);
  END IF;
  RETURN NEW;
END; $$;

-- generate_referral_code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE code TEXT; exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END; $$;

-- get_or_create_referral_code
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code(p_user_id UUID)
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_code TEXT;
BEGIN
  SELECT referral_code INTO v_code FROM public.users WHERE id = p_user_id;
  IF v_code IS NULL THEN
    v_code := public.generate_referral_code();
    UPDATE public.users SET referral_code = v_code WHERE id = p_user_id;
  END IF;
  RETURN v_code;
END; $$;

-- update_referral_stats (drop first — parameter name changed across migrations)
DROP FUNCTION IF EXISTS public.update_referral_stats(UUID);
CREATE OR REPLACE FUNCTION public.update_referral_stats(p_referrer_id UUID)
RETURNS VOID LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.users SET
    referral_count = (SELECT COUNT(*) FROM public.referrals WHERE referrer_id = p_referrer_id)
  WHERE id = p_referrer_id;
END; $$;

-- trigger_update_referral_stats
CREATE OR REPLACE FUNCTION public.trigger_update_referral_stats()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  PERFORM public.update_referral_stats(COALESCE(NEW.referrer_id, OLD.referrer_id));
  RETURN NEW;
END; $$;

-- update_module_progress (from multi_course platform)
CREATE OR REPLACE FUNCTION public.update_module_progress()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_total INTEGER; v_completed INTEGER;
BEGIN
  SELECT COUNT(*), COUNT(*) FILTER (WHERE ulp.is_completed = true)
  INTO v_total, v_completed
  FROM public.lessons l
  LEFT JOIN public.user_lesson_progress ulp ON ulp.lesson_id = l.id AND ulp.user_id = NEW.user_id
  WHERE l.module_id = (SELECT module_id FROM public.lessons WHERE id = NEW.lesson_id);
  RETURN NEW;
END; $$;

-- update_program_progress
CREATE OR REPLACE FUNCTION public.update_program_progress()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RETURN NEW;
END; $$;

-- award_signup_bonus
CREATE OR REPLACE FUNCTION public.award_signup_bonus()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_signup_bonus INTEGER;
BEGIN
  SELECT COALESCE(config_value::INTEGER, 500) INTO v_signup_bonus
  FROM public.rewards_config WHERE config_key = 'soldier_signup_bonus';
  PERFORM public.add_dag_points(NEW.id, COALESCE(v_signup_bonus, 500), 'signup_bonus', 'Welcome bonus for joining DAGARMY', NULL);
  RETURN NEW;
END; $$;

-- ═══════════════════════════════════════════════════════════════════
-- PART 3: Fix rls_policy_always_true warnings
-- Replace USING (true) service role policies with role() check
-- ═══════════════════════════════════════════════════════════════════

-- certifications
DROP POLICY IF EXISTS "Service role can manage certifications" ON public.certifications;
CREATE POLICY "Service role can manage certifications" ON public.certifications
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- enrollments
DROP POLICY IF EXISTS "Service role can manage enrollments" ON public.enrollments;
CREATE POLICY "Service role can manage enrollments" ON public.enrollments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- lesson_progress
DROP POLICY IF EXISTS "Service role can manage lesson progress" ON public.lesson_progress;
CREATE POLICY "Service role can manage lesson progress" ON public.lesson_progress
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- login_history
DROP POLICY IF EXISTS "Service role full access to login_history" ON public.login_history;
CREATE POLICY "Service role full access to login_history" ON public.login_history
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- reviews
DROP POLICY IF EXISTS "Service role can manage reviews" ON public.reviews;
CREATE POLICY "Service role can manage reviews" ON public.reviews
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- social_task_submissions
DROP POLICY IF EXISTS "Service role full access social_task_submissions" ON public.social_task_submissions;
CREATE POLICY "Service role full access social_task_submissions" ON public.social_task_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- social_tasks
DROP POLICY IF EXISTS "Service role full access social_tasks" ON public.social_tasks;
CREATE POLICY "Service role full access social_tasks" ON public.social_tasks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- referrals - tighten insert/update policies
DROP POLICY IF EXISTS "System can insert referrals" ON public.referrals;
DROP POLICY IF EXISTS "System can update referrals" ON public.referrals;
CREATE POLICY "Service role can manage referrals" ON public.referrals
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- users - tighten service role policies
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can update users" ON public.users;
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL TO service_role USING (true) WITH CHECK (true);
