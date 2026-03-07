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
  const file = searchParams.get('file');

  if (!file) return NextResponse.json({ error: 'file param required' }, { status: 400 });

  // If it's a full URL (old records), extract just the filename after the bucket name
  let filename = file;
  if (file.startsWith('http://') || file.startsWith('https://')) {
    const match = file.match(/career-resumes\/(.+)$/);
    if (!match) return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
    filename = match[1];
  }

  // Generate a signed URL (works for private buckets)
  const { data, error } = await supabaseAdmin.storage
    .from('career-resumes')
    .createSignedUrl(filename, 60 * 10);

  if (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json({ error: 'Failed to generate download link', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
