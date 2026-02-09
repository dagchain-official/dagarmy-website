import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerEmail = searchParams.get('email');
    const assignmentId = searchParams.get('assignmentId');

    if (!trainerEmail) {
      return NextResponse.json(
        { success: false, error: 'Trainer email is required' },
        { status: 400 }
      );
    }

    // Get trainer user
    const { data: trainer, error: trainerError } = await supabase
      .from('users')
      .select('id')
      .eq('email', trainerEmail)
      .single();

    if (trainerError || !trainer) {
      return NextResponse.json(
        { success: false, error: 'Trainer not found' },
        { status: 404 }
      );
    }

    let query = supabase
      .from('assignment_submissions')
      .select(`
        *,
        assignments(title, total_points, batch_id, batches(batch_name)),
        users!assignment_submissions_student_id_fkey(id, full_name, email, avatar_url)
      `)
      .eq('assignments.trainer_id', trainer.id);

    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }

    const { data: submissions, error: subError } = await query
      .order('submitted_at', { ascending: false });

    if (subError) {
      console.error('Error fetching submissions:', subError);
      return NextResponse.json(
        { success: false, error: subError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error('Error in trainer submissions API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Grade submission
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      submission_id,
      trainer_email,
      score,
      feedback,
      status,
      certificate_granted
    } = body;

    if (!submission_id || !trainer_email || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get trainer user
    const { data: trainer, error: trainerError } = await supabase
      .from('users')
      .select('id')
      .eq('email', trainer_email)
      .single();

    if (trainerError || !trainer) {
      return NextResponse.json(
        { success: false, error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Update submission
    const updateData = {
      status,
      graded_by: trainer.id,
      graded_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (score !== undefined) updateData.score = score;
    if (feedback) updateData.feedback = feedback;
    if (certificate_granted !== undefined) {
      updateData.certificate_granted = certificate_granted;
      if (certificate_granted) {
        updateData.certificate_issued_at = new Date().toISOString();
      }
    }

    const { data: submission, error: updateError } = await supabase
      .from('assignment_submissions')
      .update(updateData)
      .eq('id', submission_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating submission:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error('Error in grade submission API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
