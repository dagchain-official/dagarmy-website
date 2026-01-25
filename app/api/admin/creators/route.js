import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET - Fetch all course creators
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'organization', 'trainer', 'mentor', 'instructor'
    const isActive = searchParams.get('isActive');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from('course_creators')
      .select('*')
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: creators, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ creators });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new course creator
export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: creator, error } = await supabase
      .from('course_creators')
      .insert({
        user_id: body.user_id,
        name: body.name,
        email: body.email,
        bio: body.bio,
        avatar_url: body.avatar_url,
        role: body.role,
        expertise: body.expertise || [],
        is_verified: body.is_verified || false,
        is_active: body.is_active !== false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ creator, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a course creator
export async function PUT(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const updateData = {
      name: body.name,
      email: body.email,
      bio: body.bio,
      avatar_url: body.avatar_url,
      role: body.role,
      expertise: body.expertise,
      is_verified: body.is_verified,
      is_active: body.is_active
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const { data: creator, error } = await supabase
      .from('course_creators')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ creator, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a course creator
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('id');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('course_creators')
      .delete()
      .eq('id', creatorId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Creator deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
