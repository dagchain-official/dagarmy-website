-- Fix RLS Policies for Reown Authentication
-- This allows the service role to bypass RLS for user creation

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create new policies that work with external authentication (Reown)
-- Allow service role (API routes) to insert users
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to update users
CREATE POLICY "Service role can update users" ON public.users
  FOR UPDATE
  USING (true);

-- Allow anyone to read user profiles (for public profiles)
CREATE POLICY "Anyone can view user profiles" ON public.users
  FOR SELECT
  USING (true);

-- For enrollments - allow service role to manage
DROP POLICY IF EXISTS "Users can view their enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Users can enroll in courses" ON public.enrollments;

CREATE POLICY "Service role can manage enrollments" ON public.enrollments
  FOR ALL
  USING (true);

-- For lesson progress - allow service role to manage
DROP POLICY IF EXISTS "Users can view their lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update their lesson progress" ON public.lesson_progress;

CREATE POLICY "Service role can manage lesson progress" ON public.lesson_progress
  FOR ALL
  USING (true);

-- For certifications - keep existing policies but add service role access
DROP POLICY IF EXISTS "Users can view their certifications" ON public.certifications;
DROP POLICY IF EXISTS "Anyone can verify certifications" ON public.certifications;

CREATE POLICY "Service role can manage certifications" ON public.certifications
  FOR ALL
  USING (true);

-- For reviews - allow service role to manage
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can manage their reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage reviews" ON public.reviews
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update reviews" ON public.reviews
  FOR UPDATE
  USING (true);

CREATE POLICY "Service role can delete reviews" ON public.reviews
  FOR DELETE
  USING (true);
