-- Migration: Ambassador Applications
-- Stores ambassador program applications submitted via /ambassador page

CREATE TABLE IF NOT EXISTS public.ambassador_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  telegram TEXT,
  social_links TEXT,
  follower_count TEXT,
  content_niche TEXT,
  statement TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'shortlisted', 'approved', 'rejected')),
  internal_notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for filtering
CREATE INDEX IF NOT EXISTS idx_ambassador_status ON public.ambassador_applications(status);
CREATE INDEX IF NOT EXISTS idx_ambassador_applied_at ON public.ambassador_applications(applied_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_ambassador_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ambassador_updated_at ON public.ambassador_applications;
CREATE TRIGGER trg_ambassador_updated_at
  BEFORE UPDATE ON public.ambassador_applications
  FOR EACH ROW EXECUTE FUNCTION update_ambassador_updated_at();

-- RLS
ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access ambassador"
  ON public.ambassador_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
