import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      assignment_id,
      student_email,
      submission_notes,
      file_urls,
      file_names,
      file_sizes
    } = body;

    // Validate required fields
    if (!assignment_id || !student_email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get student user
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id')
      .eq('email', student_email)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Get assignment details
    const { data: assignment, error: assignError } = await supabase
      .from('assignments')
      .select('batch_id, due_date, grace_period_hours, status')
      .eq('id', assignment_id)
      .single();

    if (assignError || !assignment) {
      return NextResponse.json(
        { success: false, error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Check if assignment is still open
    const deadline = new Date(assignment.due_date);
    deadline.setHours(deadline.getHours() + (assignment.grace_period_hours || 0));
    const now = new Date();

    if (now > deadline || assignment.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Assignment deadline has passed' },
        { status: 400 }
      );
    }

    // Check if student already submitted
    const { data: existingSubmission } = await supabase
      .from('assignment_submissions')
      .select('id')
      .eq('assignment_id', assignment_id)
      .eq('student_id', student.id)
      .eq('is_resubmission', false)
      .single();

    if (existingSubmission) {
      return NextResponse.json(
        { success: false, error: 'Assignment already submitted. Contact your trainer for resubmission.' },
        { status: 400 }
      );
    }

    // Create submission
    const { data: submission, error: submitError } = await supabase
      .from('assignment_submissions')
      .insert({
        assignment_id,
        student_id: student.id,
        batch_id: assignment.batch_id,
        submission_notes,
        file_urls: file_urls || [],
        file_names: file_names || [],
        file_sizes: file_sizes || [],
        status: 'submitted'
      })
      .select()
      .single();

    if (submitError) {
      console.error('Error creating submission:', submitError);
      return NextResponse.json(
        { success: false, error: submitError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error in submit assignment API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
