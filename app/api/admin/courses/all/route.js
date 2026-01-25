import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET - Fetch all courses with their creators, modules, and lessons
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'draft', 'published', 'archived'
    const creatorId = searchParams.get('creatorId');
    const category = searchParams.get('category');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from('courses')
      .select(`
        *,
        creator:course_creators(*),
        modules:modules(
          *,
          lessons:lessons(*)
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (creatorId) {
      query = query.eq('creator_id', creatorId);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data: courses, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate stats for each course
    const coursesWithStats = courses.map(course => ({
      ...course,
      stats: {
        totalModules: course.modules?.length || 0,
        totalLessons: course.total_lessons || 0,
        enrolledStudents: course.enrolled_students || 0,
        rating: course.rating || 0,
        totalReviews: course.total_reviews || 0
      }
    }));

    return NextResponse.json({ 
      courses: coursesWithStats,
      total: courses.length
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new course
export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        creator_id: body.creator_id,
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        subtitle: body.subtitle,
        description: body.description,
        mission: body.mission,
        category: body.category,
        level: body.level || 'intermediate',
        language: body.language || 'English',
        thumbnail_url: body.thumbnail_url,
        banner_url: body.banner_url,
        price: body.price || 0,
        currency: body.currency || 'USD',
        is_free: body.is_free || false,
        total_duration: body.total_duration,
        status: body.status || 'draft',
        is_featured: body.is_featured || false,
        is_premium: body.is_premium || false,
        tags: body.tags || [],
        meta_title: body.meta_title,
        meta_description: body.meta_description
      })
      .select(`
        *,
        creator:course_creators(*)
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ course, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a course
export async function PUT(request) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const updateData = {
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle,
      description: body.description,
      mission: body.mission,
      category: body.category,
      level: body.level,
      language: body.language,
      thumbnail_url: body.thumbnail_url,
      banner_url: body.banner_url,
      price: body.price,
      currency: body.currency,
      is_free: body.is_free,
      total_duration: body.total_duration,
      status: body.status,
      is_featured: body.is_featured,
      is_premium: body.is_premium,
      tags: body.tags,
      meta_title: body.meta_title,
      meta_description: body.meta_description
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const { data: course, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', body.id)
      .select(`
        *,
        creator:course_creators(*)
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ course, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a course
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
