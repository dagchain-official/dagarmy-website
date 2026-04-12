import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyPlatformJWT, extractBearerToken } from '@/lib/dagauth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    // Try Authorization header first, then cookie
    const authHeader = req.headers.get('Authorization');
    const cookieStore = await cookies();
    const token = extractBearerToken(authHeader) || cookieStore.get('dagarmy_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyPlatformJWT(token);

    // Fetch fresh user from DB
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, avatar_url, is_admin, is_master_admin, wallet_address, profile_completed, dagchain_user_id, daggpt_role')
      .eq('id', payload.sub)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user, platform: 'dagarmy' });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
