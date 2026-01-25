import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { isMasterAdmin } from '@/lib/auth-utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { isMasterAdmin: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email is in master admin whitelist
    const isMaster = isMasterAdmin(email);

    // If user exists and is master admin, update their flag
    if (isMaster) {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (user) {
        await supabase
          .from('users')
          .update({ is_master_admin: true, is_admin: true })
          .eq('id', user.id);
      }
    }

    return NextResponse.json({
      isMasterAdmin: isMaster,
      email: email
    });
  } catch (error) {
    console.error('Error checking master admin:', error);
    return NextResponse.json(
      { isMasterAdmin: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
