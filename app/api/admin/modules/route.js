import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET - Fetch all modules for a program
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: modules, error } = await supabase
      .from('modules')
      .select('*')
      .eq('program_id', programId)
      .order('order_index', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ modules });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new module
export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: module, error } = await supabase
      .from('modules')
      .insert({
        program_id: body.program_id,
        module_number: body.module_number,
        title: body.title,
        duration: body.duration,
        track: body.track,
        focus: body.focus,
        description: body.description,
        order_index: body.order_index,
        is_published: body.is_published || false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ module, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a module
export async function PUT(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: module, error } = await supabase
      .from('modules')
      .update({
        module_number: body.module_number,
        title: body.title,
        duration: body.duration,
        track: body.track,
        focus: body.focus,
        description: body.description,
        order_index: body.order_index,
        is_published: body.is_published
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ module, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a module
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('id');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Module deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
