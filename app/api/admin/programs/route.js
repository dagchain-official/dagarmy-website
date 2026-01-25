import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all programs
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (programsError) {
      console.error('Error fetching programs:', programsError);
      return NextResponse.json(
        { error: 'Failed to fetch programs', details: programsError.message },
        { status: 500 }
      );
    }

    // For each program, fetch modules and lessons
    const programsWithModules = await Promise.all(
      programs.map(async (program) => {
        // Fetch modules for this program
        const { data: modules, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('program_id', program.id)
          .order('order_index', { ascending: true });

        if (modulesError) {
          console.error('Error fetching modules:', modulesError);
          return { ...program, modules: [] };
        }

        // For each module, fetch lessons
        const modulesWithLessons = await Promise.all(
          modules.map(async (module) => {
            const { data: lessons, error: lessonsError } = await supabase
              .from('lessons')
              .select('*')
              .eq('module_id', module.id)
              .order('order_index', { ascending: true });

            if (lessonsError) {
              console.error('Error fetching lessons:', lessonsError);
              return { ...module, lessons: [] };
            }

            return { ...module, lessons };
          })
        );

        // Calculate statistics by track
        const trackStats = modulesWithLessons.reduce((acc, module) => {
          const track = module.track;
          if (!acc[track]) {
            acc[track] = { modules: 0, lessons: 0 };
          }
          acc[track].modules += 1;
          acc[track].lessons += module.lessons.length;
          return acc;
        }, {});

        return {
          ...program,
          modules: modulesWithLessons,
          stats: {
            totalModules: modulesWithLessons.length,
            totalLessons: modulesWithLessons.reduce((sum, m) => sum + m.lessons.length, 0),
            trackStats
          }
        };
      })
    );

    // Calculate overall statistics
    const overallStats = {
      totalPrograms: programs.length,
      totalEnrollments: programs.reduce((sum, p) => sum + (p.enrolled_students || 0), 0),
      totalModules: programsWithModules.reduce((sum, p) => sum + (p.stats?.totalModules || 0), 0),
      totalLessons: programsWithModules.reduce((sum, p) => sum + (p.stats?.totalLessons || 0), 0)
    };

    return NextResponse.json({
      programs: programsWithModules,
      stats: overallStats
    });

  } catch (error) {
    console.error('Error in programs API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
