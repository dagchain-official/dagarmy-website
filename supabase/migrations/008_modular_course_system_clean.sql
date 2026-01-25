-- Migration: Modular Course System for Next-Gen Tech Architect Program
-- Description: Creates tables for unified program with modules and lessons

-- Drop existing tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS public.user_lesson_progress CASCADE;
DROP TABLE IF EXISTS public.user_module_progress CASCADE;
DROP TABLE IF EXISTS public.user_program_enrollments CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;

-- Table 1: programs
-- Stores the main program information
CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    mission TEXT,
    total_duration TEXT,
    format TEXT,
    total_modules INTEGER DEFAULT 0,
    enrolled_students INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    level TEXT,
    language TEXT DEFAULT 'English',
    certificate BOOLEAN DEFAULT TRUE,
    certificate_type TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: modules
-- Stores individual modules within the program
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    duration TEXT,
    track TEXT,
    focus TEXT,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_module_number_per_program UNIQUE(program_id, module_number)
);

-- Table 3: lessons
-- Stores individual lessons within modules
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_number TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    content TEXT,
    video_url TEXT,
    resources JSONB,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_lesson_number_per_module UNIQUE(module_id, lesson_number)
);

-- Table 4: user_program_enrollments
-- Tracks user enrollments in programs
CREATE TABLE public.user_program_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'dropped')),
    progress_percentage INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_nft_url TEXT,
    
    CONSTRAINT unique_user_program_enrollment UNIQUE(user_id, program_id)
);

-- Table 5: user_module_progress
-- Tracks user progress through modules
CREATE TABLE public.user_module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.user_program_enrollments(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    
    CONSTRAINT unique_user_module_progress UNIQUE(user_id, module_id)
);

-- Table 6: user_lesson_progress
-- Tracks user progress through individual lessons
CREATE TABLE public.user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    module_progress_id UUID NOT NULL REFERENCES public.user_module_progress(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER DEFAULT 0,
    notes TEXT,
    
    CONSTRAINT unique_user_lesson_progress UNIQUE(user_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX idx_modules_program_id ON public.modules(program_id);
CREATE INDEX idx_modules_track ON public.modules(track);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_type ON public.lessons(type);
CREATE INDEX idx_user_enrollments_user_id ON public.user_program_enrollments(user_id);
CREATE INDEX idx_user_enrollments_program_id ON public.user_program_enrollments(program_id);
CREATE INDEX idx_user_module_progress_user_id ON public.user_module_progress(user_id);
CREATE INDEX idx_user_module_progress_module_id ON public.user_module_progress(module_id);
CREATE INDEX idx_user_lesson_progress_user_id ON public.user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON public.user_lesson_progress(lesson_id);

-- Function to update module progress percentage
CREATE OR REPLACE FUNCTION update_module_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_module_progress
    SET progress_percentage = (
        SELECT COALESCE(ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0)) * 100
        ), 0)
        FROM public.user_lesson_progress
        WHERE module_progress_id = NEW.module_progress_id
    ),
    status = CASE
        WHEN (SELECT COUNT(*) FILTER (WHERE status = 'completed')
              FROM public.user_lesson_progress
              WHERE module_progress_id = NEW.module_progress_id) = 
             (SELECT COUNT(*)
              FROM public.user_lesson_progress
              WHERE module_progress_id = NEW.module_progress_id)
             AND (SELECT COUNT(*) FROM public.user_lesson_progress WHERE module_progress_id = NEW.module_progress_id) > 0
        THEN 'completed'
        WHEN (SELECT COUNT(*) FILTER (WHERE status IN ('in_progress', 'completed'))
              FROM public.user_lesson_progress
              WHERE module_progress_id = NEW.module_progress_id) > 0
        THEN 'in_progress'
        ELSE 'not_started'
    END,
    completed_at = CASE
        WHEN (SELECT COUNT(*) FILTER (WHERE status = 'completed')
              FROM public.user_lesson_progress
              WHERE module_progress_id = NEW.module_progress_id) = 
             (SELECT COUNT(*)
              FROM public.user_lesson_progress
              WHERE module_progress_id = NEW.module_progress_id)
             AND (SELECT COUNT(*) FROM public.user_lesson_progress WHERE module_progress_id = NEW.module_progress_id) > 0
        THEN NOW()
        ELSE NULL
    END
    WHERE id = NEW.module_progress_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update module progress when lesson progress changes
CREATE TRIGGER trigger_update_module_progress
    AFTER INSERT OR UPDATE ON public.user_lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_module_progress();

-- Function to update program enrollment progress
CREATE OR REPLACE FUNCTION update_program_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_program_enrollments
    SET progress_percentage = (
        SELECT COALESCE(ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*)::DECIMAL, 0)) * 100
        ), 0)
        FROM public.user_module_progress
        WHERE enrollment_id = NEW.enrollment_id
    ),
    status = CASE
        WHEN (SELECT COUNT(*) FILTER (WHERE status = 'completed')
              FROM public.user_module_progress
              WHERE enrollment_id = NEW.enrollment_id) = 
             (SELECT COUNT(*)
              FROM public.user_module_progress
              WHERE enrollment_id = NEW.enrollment_id)
             AND (SELECT COUNT(*) FROM public.user_module_progress WHERE enrollment_id = NEW.enrollment_id) > 0
        THEN 'completed'
        ELSE 'active'
    END,
    completed_at = CASE
        WHEN (SELECT COUNT(*) FILTER (WHERE status = 'completed')
              FROM public.user_module_progress
              WHERE enrollment_id = NEW.enrollment_id) = 
             (SELECT COUNT(*)
              FROM public.user_module_progress
              WHERE enrollment_id = NEW.enrollment_id)
             AND (SELECT COUNT(*) FROM public.user_module_progress WHERE enrollment_id = NEW.enrollment_id) > 0
        THEN NOW()
        ELSE NULL
    END
    WHERE id = NEW.enrollment_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update program progress when module progress changes
CREATE TRIGGER trigger_update_program_progress
    AFTER INSERT OR UPDATE ON public.user_module_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_program_progress();

-- Row Level Security (RLS) Policies

-- Programs: Public read access
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Programs are viewable by everyone" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Only admins can modify programs" ON public.programs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Modules: Public read access for published modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published modules are viewable by everyone" ON public.modules FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can modify modules" ON public.modules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Lessons: Public read access for published lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published lessons are viewable by everyone" ON public.lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can modify lessons" ON public.lessons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- User enrollments: Users can view their own enrollments
ALTER TABLE public.user_program_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own enrollments" ON public.user_program_enrollments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own enrollments" ON public.user_program_enrollments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all enrollments" ON public.user_program_enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- User module progress: Users can view and update their own progress
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own module progress" ON public.user_module_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own module progress" ON public.user_module_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all module progress" ON public.user_module_progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- User lesson progress: Users can view and update their own progress
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own lesson progress" ON public.user_lesson_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own lesson progress" ON public.user_lesson_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all lesson progress" ON public.user_lesson_progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
