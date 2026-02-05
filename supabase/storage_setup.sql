-- Supabase Storage Setup for Assignment Management System
-- Run this in Supabase SQL Editor to create the storage bucket

-- Create storage bucket for assignment submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-submissions', 'assignment-submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
CREATE POLICY "Students can upload their own submissions"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assignment-submissions' AND
  (storage.foldername(name))[1] = 'assignments'
);

CREATE POLICY "Students can view their own submissions"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignment-submissions' AND
  (storage.foldername(name))[1] = 'assignments'
);

CREATE POLICY "Trainers can view all submissions in their batches"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignment-submissions' AND
  (storage.foldername(name))[1] = 'assignments'
);

CREATE POLICY "Admins can manage all submissions"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'assignment-submissions' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND (users.is_master_admin = true OR users.role = 'admin')
  )
);
