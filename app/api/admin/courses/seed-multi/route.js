import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nextGenProgram } from '@/data/next-gen-program';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Create organization as course creator
    const { data: creator, error: creatorError } = await supabase
      .from('course_creators')
      .insert({
        name: 'DAGARMY',
        email: 'courses@dagarmy.com',
        bio: 'Official DAGARMY course platform - Transforming The 3rd Talent Into Market-Ready Tech Leaders through Community Service Resources (CSR)',
        role: 'organization',
        expertise: ['AI Engineering', 'Blockchain', 'Web3', 'Full-Stack Development', 'System Architecture'],
        is_verified: true,
        is_active: true
      })
      .select()
      .single();

    if (creatorError) {
      console.error('Creator error:', creatorError);
      return NextResponse.json({ error: creatorError.message }, { status: 500 });
    }

    console.log('Created course creator:', creator.id);

    // Step 2: Create the Next-Gen Tech Architect course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        creator_id: creator.id,
        title: nextGenProgram.title,
        slug: 'next-gen-tech-architect-program',
        subtitle: nextGenProgram.subtitle,
        description: nextGenProgram.mission,
        mission: nextGenProgram.mission,
        category: 'Technology',
        level: 'intermediate',
        language: 'English',
        total_duration: nextGenProgram.totalDuration,
        is_free: true,
        status: 'published',
        is_featured: true,
        tags: ['AI', 'Blockchain', 'Web3', 'Full-Stack', 'Architecture', 'CSR'],
        meta_title: 'The Next-Gen Tech Architect Program | DAGARMY',
        meta_description: nextGenProgram.subtitle
      })
      .select()
      .single();

    if (courseError) {
      console.error('Course error:', courseError);
      return NextResponse.json({ error: courseError.message }, { status: 500 });
    }

    console.log('Created course:', course.id);

    // Step 3: Create modules
    const modulePromises = nextGenProgram.modules.map(async (module, index) => {
      const { data: createdModule, error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: course.id,
          module_number: module.number,
          title: module.title,
          description: module.focus,
          duration: module.duration,
          track: module.track,
          focus: module.focus,
          order_index: index + 1,
          is_published: true
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Module error:', moduleError);
        throw moduleError;
      }

      console.log(`Created module ${module.number}:`, createdModule.id);

      // Step 4: Create lessons for this module
      const lessonPromises = module.lessons.map(async (lesson, lessonIndex) => {
        const { data: createdLesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            module_id: createdModule.id,
            lesson_number: lesson.id,
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            duration: lesson.duration,
            content: lesson.description || '',
            order_index: lessonIndex + 1,
            is_published: true
          })
          .select()
          .single();

        if (lessonError) {
          console.error('Lesson error:', lessonError);
          throw lessonError;
        }

        return createdLesson;
      });

      const lessons = await Promise.all(lessonPromises);
      console.log(`Created ${lessons.length} lessons for module ${module.number}`);

      return { module: createdModule, lessons };
    });

    const modulesWithLessons = await Promise.all(modulePromises);

    // Step 5: Fetch the complete course with stats
    const { data: finalCourse, error: fetchError } = await supabase
      .from('courses')
      .select(`
        *,
        creator:course_creators(*),
        modules:modules(
          *,
          lessons:lessons(*)
        )
      `)
      .eq('id', course.id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Multi-course platform seeded successfully',
      data: {
        creator,
        course: finalCourse,
        stats: {
          totalModules: modulesWithLessons.length,
          totalLessons: modulesWithLessons.reduce((sum, m) => sum + m.lessons.length, 0)
        }
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error 
    }, { status: 500 });
  }
}
