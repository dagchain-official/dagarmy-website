import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;

    // Calculate date range for the month (include padding days for calendar view)
    const startDate = new Date(year, month - 1, 1);
    startDate.setDate(startDate.getDate() - 7); // 1 week before
    const endDate = new Date(year, month, 0);
    endDate.setDate(endDate.getDate() + 7); // 1 week after

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, description, event_date, event_time, end_time, event_type, color, location, is_online, meeting_link')
      .eq('is_published', true)
      .gte('event_date', startStr)
      .lte('event_date', endStr)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ events: [] });
    }

    return NextResponse.json({ events: events || [] });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json({ events: [] });
  }
}
