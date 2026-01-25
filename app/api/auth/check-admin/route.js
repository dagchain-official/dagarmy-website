import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { isMasterAdmin } from '@/lib/auth-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('email, is_admin, is_master_admin')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { isAdmin: false, isMasterAdmin: false },
        { status: 200 }
      );
    }

    // Check if email is in master admin whitelist
    const isMaster = isMasterAdmin(user.email);

    // Update master admin flag if needed
    if (isMaster && !user.is_master_admin) {
      await supabase
        .from('users')
        .update({ is_master_admin: true, is_admin: true })
        .eq('id', userId);
    }

    return NextResponse.json({
      isAdmin: user.is_admin || isMaster,
      isMasterAdmin: isMaster,
      email: user.email
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
