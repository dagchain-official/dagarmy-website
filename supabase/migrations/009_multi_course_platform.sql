-- Multi-Course Platform Migration
-- This migration creates a scalable system for multiple courses with different creators

-- Drop existing tables if they exist (clean slate)
-- Drop in reverse dependency order
DROP TABLE IF EXISTS course_reviews CASCADE;
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS course_creators CASCADE;

-- Create course_creators table (for trainers, mentors, organization)
CREATE TABLE IF NOT EXISTS course_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('organization', 'trainer', 'mentor', 'instructor')),
  expertise TEXT[], -- Array of expertise areas
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  total_courses INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table (replaces programs)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES course_creators(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  mission TEXT,
  category TEXT, -- e.g., 'Technology', 'Business', 'Design'
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  language TEXT DEFAULT 'English',
  
  -- Media
  thumbnail_url TEXT,
  banner_url TEXT,
  promo_video_url TEXT,
  
  -- Pricing
  price DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  is_free BOOLEAN DEFAULT false,
  
  -- Course details
  total_duration TEXT, -- e.g., "32 Hours"
  total_modules INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  
  -- Status and visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  
  -- Enrollment
  enrolled_students INTEGER DEFAULT 0,
  max_students INTEGER, -- NULL means unlimited
  
  -- Ratings and reviews
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  
  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create modules table (updated with course_id)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  
  -- Module categorization
  track TEXT, -- e.g., 'Yellow', 'Green', 'Blue' or custom tracks
  focus TEXT,
  
  -- Ordering
  order_index INTEGER NOT NULL,
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  is_preview BOOLEAN DEFAULT false, -- Can be previewed without enrollment
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(course_id, module_number)
);

-- Create lessons table (unchanged structure)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  lesson_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Lesson type
  type TEXT NOT NULL CHECK (type IN ('theory', 'drill', 'strategy', 'graduation', 'video', 'quiz', 'assignment', 'live')),
  
  -- Content
  content TEXT, -- Rich text content
  duration TEXT,
  
  -- Media
  video_url TEXT,
  video_duration INTEGER, -- in seconds
  
  -- Resources
  resources JSONB, -- Array of downloadable resources
  
  -- Ordering
  order_index INTEGER NOT NULL,
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  is_preview BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_enrollments table (updated with course_id)
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Enrollment details
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Progress tracking
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  completed_modules INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
  
  -- Certificate
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  
  -- Timestamps
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

-- Create user_lesson_progress table (unchanged)
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES user_enrollments(id) ON DELETE CASCADE,
  
  -- Progress
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent INTEGER DEFAULT 0, -- in seconds
  
  -- Video progress
  video_progress INTEGER DEFAULT 0, -- in seconds
  
  -- Quiz/Assignment scores
  score DECIMAL(5,2),
  attempts INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_id)
);

-- Create course_reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES user_enrollments(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  
  -- Moderation
  is_approved BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_courses_creator;
DROP INDEX IF EXISTS idx_courses_status;
DROP INDEX IF EXISTS idx_courses_category;
DROP INDEX IF EXISTS idx_courses_slug;
DROP INDEX IF EXISTS idx_modules_course;
DROP INDEX IF EXISTS idx_lessons_module;
DROP INDEX IF EXISTS idx_enrollments_user;
DROP INDEX IF EXISTS idx_enrollments_course;
DROP INDEX IF EXISTS idx_lesson_progress_user;
DROP INDEX IF EXISTS idx_lesson_progress_lesson;
DROP INDEX IF EXISTS idx_reviews_course;

-- Create indexes for better performance
CREATE INDEX idx_courses_creator ON courses(creator_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_enrollments_user ON user_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON user_enrollments(course_id);
CREATE INDEX idx_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_reviews_course ON course_reviews(course_id);

-- Create triggers to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_creators_updated_at BEFORE UPDATE ON course_creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON user_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON user_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update course stats when modules are added/removed
CREATE OR REPLACE FUNCTION update_course_module_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses 
    SET total_modules = total_modules + 1 
    WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses 
    SET total_modules = GREATEST(0, total_modules - 1)
    WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_module_count
AFTER INSERT OR DELETE ON modules
FOR EACH ROW EXECUTE FUNCTION update_course_module_count();

-- Create trigger to update course stats when lessons are added/removed
CREATE OR REPLACE FUNCTION update_course_lesson_count()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT course_id INTO v_course_id FROM modules WHERE id = NEW.module_id;
    UPDATE courses 
    SET total_lessons = total_lessons + 1 
    WHERE id = v_course_id;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT course_id INTO v_course_id FROM modules WHERE id = OLD.module_id;
    UPDATE courses 
    SET total_lessons = GREATEST(0, total_lessons - 1)
    WHERE id = v_course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_lesson_count
AFTER INSERT OR DELETE ON lessons
FOR EACH ROW EXECUTE FUNCTION update_course_lesson_count();

-- Create trigger to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_enrollment_id UUID;
  v_total_lessons INTEGER;
  v_completed_lessons INTEGER;
  v_progress DECIMAL(5,2);
BEGIN
  -- Get enrollment_id
  SELECT id INTO v_enrollment_id 
  FROM user_enrollments 
  WHERE user_id = NEW.user_id 
    AND course_id = (SELECT course_id FROM modules WHERE id = (SELECT module_id FROM lessons WHERE id = NEW.lesson_id));
  
  IF v_enrollment_id IS NOT NULL THEN
    -- Calculate total lessons in course
    SELECT COUNT(*) INTO v_total_lessons
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    WHERE m.course_id = (SELECT course_id FROM user_enrollments WHERE id = v_enrollment_id);
    
    -- Calculate completed lessons
    SELECT COUNT(*) INTO v_completed_lessons
    FROM user_lesson_progress ulp
    JOIN lessons l ON ulp.lesson_id = l.id
    JOIN modules m ON l.module_id = m.id
    WHERE ulp.user_id = NEW.user_id
      AND ulp.is_completed = true
      AND m.course_id = (SELECT course_id FROM user_enrollments WHERE id = v_enrollment_id);
    
    -- Calculate progress percentage
    IF v_total_lessons > 0 THEN
      v_progress := (v_completed_lessons::DECIMAL / v_total_lessons::DECIMAL) * 100;
    ELSE
      v_progress := 0;
    END IF;
    
    -- Update enrollment
    UPDATE user_enrollments
    SET 
      progress_percentage = v_progress,
      completed_lessons = v_completed_lessons,
      last_accessed_at = NOW(),
      completed_at = CASE WHEN v_progress >= 100 THEN NOW() ELSE NULL END,
      status = CASE WHEN v_progress >= 100 THEN 'completed' ELSE status END
    WHERE id = v_enrollment_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_enrollment_progress
AFTER INSERT OR UPDATE ON user_lesson_progress
FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();

-- Create trigger to update course enrollment count
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses 
    SET enrolled_students = enrolled_students + 1 
    WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses 
    SET enrolled_students = GREATEST(0, enrolled_students - 1)
    WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_enrollment_count
AFTER INSERT OR DELETE ON user_enrollments
FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- Create trigger to update course rating
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_rating DECIMAL(3,2);
  v_total_reviews INTEGER;
BEGIN
  SELECT AVG(rating), COUNT(*) 
  INTO v_avg_rating, v_total_reviews
  FROM course_reviews 
  WHERE course_id = COALESCE(NEW.course_id, OLD.course_id) 
    AND is_approved = true;
  
  UPDATE courses
  SET 
    rating = COALESCE(v_avg_rating, 0.00),
    total_reviews = v_total_reviews
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_rating
AFTER INSERT OR UPDATE OR DELETE ON course_reviews
FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- Create trigger to update creator stats
CREATE OR REPLACE FUNCTION update_creator_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE course_creators
    SET total_courses = total_courses + 1
    WHERE id = NEW.creator_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE course_creators
    SET total_courses = GREATEST(0, total_courses - 1)
    WHERE id = OLD.creator_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_creator_stats
AFTER INSERT OR DELETE ON courses
FOR EACH ROW EXECUTE FUNCTION update_creator_stats();

-- Enable Row Level Security
ALTER TABLE course_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_creators
CREATE POLICY "Anyone can view active creators" ON course_creators
  FOR SELECT USING (is_active = true);

CREATE POLICY "Creators can update their own profile" ON course_creators
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can view their own courses" ON courses
  FOR SELECT USING (creator_id IN (SELECT id FROM course_creators WHERE user_id = auth.uid()));

CREATE POLICY "Creators can insert courses" ON courses
  FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM course_creators WHERE user_id = auth.uid()));

CREATE POLICY "Creators can update their own courses" ON courses
  FOR UPDATE USING (creator_id IN (SELECT id FROM course_creators WHERE user_id = auth.uid()));

CREATE POLICY "Creators can delete their own courses" ON courses
  FOR DELETE USING (creator_id IN (SELECT id FROM course_creators WHERE user_id = auth.uid()));

-- RLS Policies for modules
CREATE POLICY "Anyone can view published modules" ON modules
  FOR SELECT USING (
    is_published = true AND 
    course_id IN (SELECT id FROM courses WHERE status = 'published')
  );

CREATE POLICY "Enrolled users can view modules" ON modules
  FOR SELECT USING (
    course_id IN (SELECT course_id FROM user_enrollments WHERE user_id = auth.uid())
  );

-- RLS Policies for lessons
CREATE POLICY "Anyone can view published lessons" ON lessons
  FOR SELECT USING (
    is_published = true AND 
    module_id IN (SELECT id FROM modules WHERE is_published = true)
  );

CREATE POLICY "Enrolled users can view lessons" ON lessons
  FOR SELECT USING (
    module_id IN (
      SELECT m.id FROM modules m
      JOIN user_enrollments e ON m.course_id = e.course_id
      WHERE e.user_id = auth.uid()
    )
  );

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON user_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments" ON user_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON user_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lesson progress
CREATE POLICY "Users can view their own progress" ON user_lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews" ON course_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert their own reviews" ON course_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON course_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON course_reviews
  FOR DELETE USING (auth.uid() = user_id);
