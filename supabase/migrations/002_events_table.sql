-- Events table for admin-created events shown on student calendar
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    end_time TIME,
    event_type VARCHAR(50) NOT NULL DEFAULT 'workshop',
    color VARCHAR(20),
    location VARCHAR(255),
    is_online BOOLEAN DEFAULT true,
    meeting_link TEXT,
    created_by UUID REFERENCES public.users(id),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast calendar queries
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(is_published);

-- Updated at trigger
CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Everyone can read published events
CREATE POLICY "Anyone can view published events"
    ON public.events FOR SELECT
    USING (is_published = true);

-- Admins can do everything (via service role key, bypasses RLS)
