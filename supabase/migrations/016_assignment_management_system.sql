-- Assignment Management System Migration
-- Creates tables for batches, assignments, and submissions
-- NOTE: This migration requires that migration 009_multi_course_platform.sql has been run first
-- to ensure the courses and modules tables exist.

-- Create batches table (groups of students assigned to trainers)
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  batch_name TEXT NOT NULL,
  batch_code TEXT UNIQUE NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  max_students INTEGER DEFAULT 30,
  current_students INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create batch_enrollments table (students enrolled in batches)
CREATE TABLE IF NOT EXISTS batch_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(batch_id, student_id)
);

-- Create assignments table (created by trainers)
-- First create without foreign key constraint for module_id
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID,
  trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Assignment details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Requirements
  requirements TEXT[], -- Array of requirement strings
  accepted_formats TEXT[], -- e.g., ['.pdf', '.zip', '.docx']
  max_file_size_mb INTEGER DEFAULT 50,
  
  -- Grading
  total_points INTEGER DEFAULT 100,
  passing_score INTEGER DEFAULT 60,
  
  -- Deadlines
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ NOT NULL,
  grace_period_hours INTEGER DEFAULT 0, -- Extra hours after due date
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assignment_submissions table (student submissions)
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  
  -- Submission details
  submission_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Files (stored in Supabase Storage)
  file_urls TEXT[], -- Array of file URLs from storage
  file_names TEXT[], -- Original file names
  file_sizes INTEGER[], -- File sizes in bytes
  
  -- Grading
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'graded', 'accepted', 'rejected', 'resubmit_required')),
  score INTEGER,
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES users(id),
  
  -- Certification
  certificate_granted BOOLEAN DEFAULT false,
  certificate_url TEXT,
  certificate_issued_at TIMESTAMPTZ,
  
  -- Resubmission tracking
  is_resubmission BOOLEAN DEFAULT false,
  original_submission_id UUID REFERENCES assignment_submissions(id),
  resubmission_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(assignment_id, student_id, is_resubmission)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_batches_course_id ON batches(course_id);
CREATE INDEX IF NOT EXISTS idx_batches_trainer_id ON batches(trainer_id);
CREATE INDEX IF NOT EXISTS idx_batch_enrollments_batch_id ON batch_enrollments(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_enrollments_student_id ON batch_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_batch_id ON assignments(batch_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_module_id ON assignments(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_trainer_id ON assignments(trainer_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status);

-- Add foreign key constraint for module_id if modules table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modules') THEN
    ALTER TABLE assignments 
    ADD CONSTRAINT fk_assignments_module_id 
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL;
  END IF;
END $$;

-- RLS Policies for batches
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage their own batches"
  ON batches
  FOR ALL
  USING (trainer_id = auth.uid());

CREATE POLICY "Students can view their enrolled batches"
  ON batches
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM batch_enrollments
      WHERE batch_enrollments.batch_id = batches.id
      AND batch_enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all batches"
  ON batches
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.is_master_admin = true OR users.role = 'admin')
    )
  );

-- RLS Policies for batch_enrollments
ALTER TABLE batch_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own enrollments"
  ON batch_enrollments
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Trainers can manage enrollments in their batches"
  ON batch_enrollments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM batches
      WHERE batches.id = batch_enrollments.batch_id
      AND batches.trainer_id = auth.uid()
    )
  );

-- RLS Policies for assignments
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage their own assignments"
  ON assignments
  FOR ALL
  USING (trainer_id = auth.uid());

CREATE POLICY "Students can view assignments for their batches"
  ON assignments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM batch_enrollments
      WHERE batch_enrollments.batch_id = assignments.batch_id
      AND batch_enrollments.student_id = auth.uid()
    )
  );

-- RLS Policies for assignment_submissions
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage their own submissions"
  ON assignment_submissions
  FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "Trainers can view and grade submissions in their batches"
  ON assignment_submissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM batches
      WHERE batches.id = assignment_submissions.batch_id
      AND batches.trainer_id = auth.uid()
    )
  );

-- Function to update batch student count
CREATE OR REPLACE FUNCTION update_batch_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE batches
    SET current_students = current_students + 1
    WHERE id = NEW.batch_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE batches
    SET current_students = current_students - 1
    WHERE id = OLD.batch_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_batch_student_count
  AFTER INSERT OR DELETE ON batch_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_batch_student_count();

-- Function to check assignment deadline with grace period
CREATE OR REPLACE FUNCTION is_assignment_open(assignment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  assignment_record RECORD;
  deadline TIMESTAMPTZ;
BEGIN
  SELECT due_date, grace_period_hours, status
  INTO assignment_record
  FROM assignments
  WHERE id = assignment_id;
  
  IF assignment_record.status != 'active' THEN
    RETURN false;
  END IF;
  
  deadline := assignment_record.due_date + (assignment_record.grace_period_hours || ' hours')::INTERVAL;
  
  RETURN NOW() <= deadline;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON batches TO authenticated;
GRANT ALL ON batch_enrollments TO authenticated;
GRANT ALL ON assignments TO authenticated;
GRANT ALL ON assignment_submissions TO authenticated;
