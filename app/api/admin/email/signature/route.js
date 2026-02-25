import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /api/admin/email/signature
 * Returns the current admin's HTML email signature.
 */
export async function GET(request) {
  const session = await getAdminSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('admin_roles')
    .select('email_signature')
    .eq('user_id', session.user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ signature: data?.email_signature || '' });
}

/**
 * PUT /api/admin/email/signature
 * Saves the current admin's HTML email signature.
 * Body: { signature: string }
 */
export async function PUT(request) {
  const session = await getAdminSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { signature } = await request.json();

  const { error } = await supabase
    .from('admin_roles')
    .update({ email_signature: signature ?? '' })
    .eq('user_id', session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
