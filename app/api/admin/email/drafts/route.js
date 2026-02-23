import { NextResponse } from 'next/server';
import { getAdminSession, requirePermission } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /api/admin/email/drafts
 * List all drafts for the current admin.
 */
export async function GET(request) {
  const guard = await requirePermission(request, 'notifications.read');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const { data, error } = await supabase
    .from('email_drafts')
    .select('*')
    .eq('admin_id', session.user.id)
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drafts: data || [] });
}

/**
 * POST /api/admin/email/drafts
 * Save a new draft.
 * Body: { to_addresses, cc_addresses, bcc_addresses, subject, html_body }
 */
export async function POST(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const accountEmail = session?.departmentEmail;
  const body = await request.json();

  const { data, error } = await supabase
    .from('email_drafts')
    .insert({
      admin_id: session.user.id,
      account_email: accountEmail,
      to_addresses: body.to_addresses || [],
      cc_addresses: body.cc_addresses || [],
      bcc_addresses: body.bcc_addresses || [],
      subject: body.subject || '',
      html_body: body.html_body || '',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ draft: data });
}

/**
 * PUT /api/admin/email/drafts?id=<uuid>
 * Update an existing draft.
 */
export async function PUT(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('email_drafts')
    .update({
      to_addresses: body.to_addresses,
      cc_addresses: body.cc_addresses,
      bcc_addresses: body.bcc_addresses,
      subject: body.subject,
      html_body: body.html_body,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('admin_id', session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ draft: data });
}

/**
 * DELETE /api/admin/email/drafts?id=<uuid>
 * Delete a draft.
 */
export async function DELETE(request) {
  const guard = await requirePermission(request, 'notifications.write');
  if (guard) return guard;

  const session = await getAdminSession(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const { error } = await supabase
    .from('email_drafts')
    .delete()
    .eq('id', id)
    .eq('admin_id', session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
