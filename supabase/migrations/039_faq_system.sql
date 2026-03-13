-- FAQ Sections table
CREATE TABLE IF NOT EXISTS faq_sections (
  id          BIGSERIAL PRIMARY KEY,
  label       TEXT NOT NULL,
  icon_key    TEXT NOT NULL DEFAULT 'default',
  color_accent TEXT NOT NULL DEFAULT '#6366f1',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQ Questions table
CREATE TABLE IF NOT EXISTS faq_questions (
  id          BIGSERIAL PRIMARY KEY,
  section_id  BIGINT NOT NULL REFERENCES faq_sections(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for sort performance
CREATE INDEX IF NOT EXISTS idx_faq_sections_sort ON faq_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_questions_section ON faq_questions(section_id);
CREATE INDEX IF NOT EXISTS idx_faq_questions_sort ON faq_questions(section_id, sort_order);

-- RLS: public read-only
ALTER TABLE faq_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_faq_sections" ON faq_sections
  FOR SELECT USING (true);

CREATE POLICY "public_read_faq_questions" ON faq_questions
  FOR SELECT USING (true);

-- Service role has full access (used by admin API routes via service role key)
CREATE POLICY "service_role_all_faq_sections" ON faq_sections
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_faq_questions" ON faq_questions
  FOR ALL USING (auth.role() = 'service_role');
