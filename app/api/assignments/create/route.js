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
      batch_id,
      course_id,
      module_id,
      trainer_id,
      title,
      description,
      requirements,
      accepted_formats,
      max_file_size_mb,
      total_points,
      passing_score,
      due_date,
      grace_period_hours
    } = body;

    // Validate required fields
    if (!batch_id || !course_id || !trainer_id || !title || !description || !due_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create assignment
    const { data: assignment, error } = await supabase
      .from('assignments')
      .insert({
        batch_id,
        course_id,
        module_id,
        trainer_id,
        title,
        description,
        requirements: requirements || [],
        accepted_formats: accepted_formats || ['.pdf', '.zip', '.docx'],
        max_file_size_mb: max_file_size_mb || 50,
        total_points: total_points || 100,
        passing_score: passing_score || 60,
        due_date,
        grace_period_hours: grace_period_hours || 0,
        status: 'active'
      })
      .select(`
        *,
        modules(id, title, module_number, track),
        courses(id, title, slug),
        batches(id, batch_name)
      `)
      .single();

    if (error) {
      console.error('Error creating assignment:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error in create assignment API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
