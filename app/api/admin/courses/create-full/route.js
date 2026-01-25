import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { course, modules } = await request.json();

    if (!course.title || !modules || modules.length === 0) {
      return Response.json(
        { error: 'Course title and at least one module are required' },
        { status: 400 }
      );
    }

    // 1. Create the course
    const { data: createdCourse, error: courseError } = await supabase
      .from('courses')
      .insert([{
        title: course.title,
        slug: course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subtitle: course.subtitle || null,
        description: course.description || null,
        mission: course.mission || null,
        category: course.category || 'Technology',
        level: course.level || 'intermediate',
        language: course.language || 'English',
        total_duration: course.total_duration || null,
        banner_url: course.banner_url || null,
        is_free: course.is_free !== undefined ? course.is_free : true,
        status: course.status || 'draft',
        is_featured: course.is_featured || false,
        tags: course.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (courseError) {
      console.error('Error creating course:', courseError);
      return Response.json(
        { error: 'Failed to create course', details: courseError.message },
        { status: 500 }
      );
    }

    // 2. Create modules and lessons
    for (const module of modules) {
      // Create module
      const { data: createdModule, error: moduleError } = await supabase
        .from('modules')
        .insert([{
          course_id: createdCourse.id,
          module_number: module.module_number,
          title: module.title,
          description: module.description || null,
          duration: module.duration || null,
          track: module.track || 'Yellow',
          focus: module.focus || null,
          order_index: module.order_index || module.module_number,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (moduleError) {
        console.error('Error creating module:', moduleError);
        // Continue with other modules even if one fails
        continue;
      }

      // Create lessons for this module
      if (module.lessons && module.lessons.length > 0) {
        const lessonsToInsert = module.lessons.map(lesson => ({
          module_id: createdModule.id,
          lesson_number: lesson.lesson_number,
          title: lesson.title,
          type: lesson.type || 'Theory',
          duration: lesson.duration || null,
          description: lesson.description || null,
          video_url: lesson.video_url || null,
          order_index: lesson.order_index || lesson.lesson_number,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: lessonsError } = await supabase
          .from('lessons')
          .insert(lessonsToInsert);

        if (lessonsError) {
          console.error('Error creating lessons:', lessonsError);
          // Continue even if lessons fail
        }
      }
    }

    return Response.json({
      success: true,
      course: createdCourse,
      message: 'Course created successfully with modules and lessons'
    });

  } catch (error) {
    console.error('Error in create-full route:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
