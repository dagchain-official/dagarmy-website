import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nextGenProgram } from '@/data/next-gen-program';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if program already exists
    const { data: existingProgram } = await supabase
      .from('programs')
      .select('id')
      .eq('title', nextGenProgram.title)
      .single();

    if (existingProgram) {
      return NextResponse.json({
        message: 'Program already exists',
        programId: existingProgram.id
      });
    }

    // Insert the main program
    const { data: program, error: programError } = await supabase
      .from('programs')
      .insert({
        title: nextGenProgram.title,
        subtitle: nextGenProgram.subtitle,
        mission: nextGenProgram.mission,
        total_duration: nextGenProgram.totalDuration,
        format: nextGenProgram.format,
        total_modules: nextGenProgram.totalModules,
        enrolled_students: nextGenProgram.enrolledStudents,
        rating: nextGenProgram.rating,
        level: nextGenProgram.level,
        language: nextGenProgram.language,
        certificate: nextGenProgram.certificate,
        certificate_type: nextGenProgram.certificateType,
        is_active: true
      })
      .select()
      .single();

    if (programError) {
      console.error('Error creating program:', programError);
      return NextResponse.json(
        { error: 'Failed to create program', details: programError.message },
        { status: 500 }
      );
    }

    // Insert modules
    const moduleInserts = [];
    const lessonInserts = [];

    for (const module of nextGenProgram.modules) {
      const { data: insertedModule, error: moduleError } = await supabase
        .from('modules')
        .insert({
          program_id: program.id,
          module_number: module.number,
          title: module.title,
          duration: module.duration,
          track: module.track,
          focus: module.focus,
          order_index: module.id,
          is_published: true
        })
        .select()
        .single();

      if (moduleError) {
        console.error('Error creating module:', moduleError);
        continue;
      }

      moduleInserts.push(insertedModule);

      // Insert lessons for this module
      for (let i = 0; i < module.lessons.length; i++) {
        const lesson = module.lessons[i];
        const { data: insertedLesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            module_id: insertedModule.id,
            lesson_number: lesson.id,
            title: lesson.title,
            type: lesson.type,
            description: lesson.description,
            duration: lesson.duration,
            order_index: i + 1,
            is_published: true
          })
          .select()
          .single();

        if (lessonError) {
          console.error('Error creating lesson:', lessonError);
          continue;
        }

        lessonInserts.push(insertedLesson);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Program seeded successfully',
      data: {
        program,
        modulesCreated: moduleInserts.length,
        lessonsCreated: lessonInserts.length
      }
    });

  } catch (error) {
    console.error('Error in seed API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
