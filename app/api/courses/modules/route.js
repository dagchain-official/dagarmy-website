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

    if (!courseId) {
      // Get all courses with their modules
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          category,
          level,
          status,
          modules(
            id,
            module_number,
            title,
            description,
            track,
            focus,
            order_index,
            is_published
          )
        `)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        return NextResponse.json(
          { success: false, error: coursesError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: courses });
    } else {
      // Get specific course with modules
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          description,
          category,
          level,
          modules(
            id,
            module_number,
            title,
            description,
            track,
            focus,
            duration,
            order_index,
            is_published
          )
        `)
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        return NextResponse.json(
          { success: false, error: courseError.message },
          { status: 500 }
        );
      }

      // Sort modules by order_index
      if (course.modules) {
        course.modules.sort((a, b) => a.order_index - b.order_index);
      }

      return NextResponse.json({ success: true, data: course });
    }
  } catch (error) {
    console.error('Error in courses/modules API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
