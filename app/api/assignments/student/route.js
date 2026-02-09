import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentEmail = searchParams.get('email');

    if (!studentEmail) {
      return NextResponse.json(
        { success: false, error: 'Student email is required' },
        { status: 400 }
      );
    }

    // Get student user
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id')
      .eq('email', studentEmail)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Get student's batch enrollments
    const { data: enrollments, error: enrollError } = await supabase
      .from('batch_enrollments')
      .select('batch_id, batches(id, batch_name, course_id, courses(title, slug))')
      .eq('student_id', student.id)
      .eq('status', 'active');

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
      return NextResponse.json(
        { success: false, error: enrollError.message },
        { status: 500 }
      );
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: { assignments: [], batches: [] } 
      });
    }

    const batchIds = enrollments.map(e => e.batch_id);

    // Get assignments for student's batches
    const { data: assignments, error: assignError } = await supabase
      .from('assignments')
      .select(`
        *,
        batches(batch_name, course_id),
        courses(title, slug),
        modules(id, title, module_number, track, description)
      `)
      .in('batch_id', batchIds)
      .eq('status', 'active')
      .order('due_date', { ascending: true });

    if (assignError) {
      console.error('Error fetching assignments:', assignError);
      return NextResponse.json(
        { success: false, error: assignError.message },
        { status: 500 }
      );
    }

    // Get student's submissions
    const { data: submissions, error: subError } = await supabase
      .from('assignment_submissions')
      .select('assignment_id, status, score, submitted_at, feedback')
      .eq('student_id', student.id);

    if (subError) {
      console.error('Error fetching submissions:', subError);
    }

    // Merge submission status with assignments
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = submissions?.find(s => s.assignment_id === assignment.id);
      return {
        ...assignment,
        submission: submission || null,
        has_submitted: !!submission
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        assignments: assignmentsWithStatus,
        batches: enrollments.map(e => e.batches)
      }
    });
  } catch (error) {
    console.error('Error in student assignments API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
