-- Migration: User-Generated Community Events
-- Users can create events, others can RSVP (join/unjoin)
-- Creator is always +1 host and does NOT consume a capacity seat

-- User-created events table
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  end_time TIME,
  event_type TEXT DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'quiz', 'project', 'meeting', 'deadline')),
  location TEXT,
  is_online BOOLEAN DEFAULT true,
  meeting_link TEXT,
  max_capacity INTEGER DEFAULT NULL, -- NULL = unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVP tracking table (excludes creator — creator is always host)
CREATE TABLE IF NOT EXISTS public.user_event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.user_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_events_created_by ON public.user_events(created_by);
CREATE INDEX IF NOT EXISTS idx_user_events_event_date ON public.user_events(event_date);
CREATE INDEX IF NOT EXISTS idx_user_events_is_active ON public.user_events(is_active);
CREATE INDEX IF NOT EXISTS idx_user_event_rsvps_event_id ON public.user_event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_user_event_rsvps_user_id ON public.user_event_rsvps(user_id);

-- Enable RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_event_rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policies: user_events
-- Anyone can read active events
CREATE POLICY "Anyone can view active user events"
  ON public.user_events FOR SELECT
  USING (is_active = true);

-- Authenticated users (via service role in API) can insert
CREATE POLICY "Users can create events"
  ON public.user_events FOR INSERT
  WITH CHECK (true);

-- Only creator can update/delete their own event
CREATE POLICY "Creator can update own event"
  ON public.user_events FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Creator can delete own event"
  ON public.user_events FOR DELETE
  USING (created_by = auth.uid());

-- RLS Policies: user_event_rsvps
CREATE POLICY "Anyone can view rsvps"
  ON public.user_event_rsvps FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own rsvps"
  ON public.user_event_rsvps FOR ALL
  USING (true);
