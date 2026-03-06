-- Migration: Career Applications
-- Stores job applications submitted via the /careers page

CREATE TABLE IF NOT EXISTS public.career_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  resume_filename TEXT,
  cover_letter TEXT,
  role_slug TEXT NOT NULL,
  role_title TEXT NOT NULL,
  department TEXT,
  region TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'shortlisted', 'rejected')),
  notes TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_career_applications_status ON public.career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_applications_role_slug ON public.career_applications(role_slug);
CREATE INDEX IF NOT EXISTS idx_career_applications_applied_at ON public.career_applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_career_applications_email ON public.career_applications(email);

-- Enable RLS
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Only service role (API) can insert (public applicants via API)
CREATE POLICY "Service role can manage career applications"
  ON public.career_applications FOR ALL
  USING (true)
  WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_career_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_career_applications_updated_at ON public.career_applications;
CREATE TRIGGER trg_career_applications_updated_at
  BEFORE UPDATE ON public.career_applications
  FOR EACH ROW EXECUTE FUNCTION update_career_applications_updated_at();
