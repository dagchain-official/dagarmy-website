import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const trainerEmail = searchParams.get('trainerEmail');

    let query = supabase
      .from('batches')
      .select(`
        *,
        courses(id, title, slug),
        users!batches_trainer_id_fkey(id, full_name, email)
      `)
      .eq('status', 'active');

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    if (trainerEmail) {
      // Get trainer user first
      const { data: trainer } = await supabase
        .from('users')
        .select('id')
        .eq('email', trainerEmail)
        .single();
      
      if (trainer) {
        query = query.eq('trainer_id', trainer.id);
      }
    }

    const { data: batches, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching batches:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: batches });
  } catch (error) {
    console.error('Error in batches API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Create a new batch
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      course_id,
      trainer_email,
      batch_name,
      batch_code,
      description,
      start_date,
      end_date,
      max_students
    } = body;

    if (!course_id || !trainer_email || !batch_name || !batch_code) {
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

    // Create batch
    const { data: batch, error } = await supabase
      .from('batches')
      .insert({
        course_id,
        trainer_id: trainer.id,
        batch_name,
        batch_code,
        description,
        start_date,
        end_date,
        max_students: max_students || 30,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating batch:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    console.error('Error in create batch API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
