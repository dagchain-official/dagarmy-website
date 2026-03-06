import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const session = await getAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('file');

  if (!filename) return NextResponse.json({ error: 'file param required' }, { status: 400 });

  const { data, error } = await supabaseAdmin.storage
    .from('career-resumes')
    .createSignedUrl(filename, 60 * 10);

  if (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json({ error: 'Failed to generate download link', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
