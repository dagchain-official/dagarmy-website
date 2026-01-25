import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET - Fetch all lessons for a module
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new lesson
export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        module_id: body.module_id,
        lesson_number: body.lesson_number,
        title: body.title,
        type: body.type,
        description: body.description,
        duration: body.duration,
        content: body.content,
        video_url: body.video_url,
        resources: body.resources,
        order_index: body.order_index,
        is_published: body.is_published || false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lesson, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a lesson
export async function PUT(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: lesson, error } = await supabase
      .from('lessons')
      .update({
        lesson_number: body.lesson_number,
        title: body.title,
        type: body.type,
        description: body.description,
        duration: body.duration,
        content: body.content,
        video_url: body.video_url,
        resources: body.resources,
        order_index: body.order_index,
        is_published: body.is_published
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lesson, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a lesson
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('id');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
