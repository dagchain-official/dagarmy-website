-- Migration: Job Postings
-- Allows admins to create/manage job postings that appear on the public /careers page

CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT 'Remote',
  work_mode TEXT NOT NULL DEFAULT 'Remote' CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
  employment_type TEXT NOT NULL DEFAULT 'Full-time' CHECK (employment_type IN ('Full-time', 'Part-time', 'Freelance', 'Internship')),
  summary TEXT NOT NULL DEFAULT '',
  responsibilities TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '',
  nice_to_have TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON public.job_postings(slug);
CREATE INDEX IF NOT EXISTS idx_job_postings_is_active ON public.job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON public.job_postings(created_at DESC);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role can manage job postings"
  ON public.job_postings FOR ALL
  USING (true)
  WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_job_postings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_job_postings_updated_at ON public.job_postings;
CREATE TRIGGER trg_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION update_job_postings_updated_at();
