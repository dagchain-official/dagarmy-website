import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Verify session in database
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('*, users(*)')
      .eq('session_token', sessionToken)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('session_token', sessionToken);

      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Update last activity
    await supabase
      .from('admin_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('session_token', sessionToken);

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: session.users.id,
        email: session.users.email,
        full_name: session.users.full_name,
        is_admin: session.users.is_admin,
        is_master_admin: session.users.is_master_admin,
        role: session.users.role,
        avatar_url: session.users.avatar_url
      },
      session: {
        expires_at: session.expires_at
      }
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
