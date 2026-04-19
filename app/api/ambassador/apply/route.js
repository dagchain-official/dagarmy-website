import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/smtp-client';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, email, country, telegram, social_links, follower_count, content_niche, statement } = body;

    if (!full_name || !email || !country) {
      return NextResponse.json({ error: 'Full name, email and country are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('ambassador_applications')
      .insert({ full_name, email, country, telegram, social_links, follower_count, content_niche, statement })
      .select()
      .single();

    if (error) {
      console.error('Ambassador insert error:', error);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    // Notify HR/admin
    const notifyHtml = `
      <h2>New Ambassador Application</h2>
      <p><strong>Name:</strong> ${full_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Telegram:</strong> ${telegram || '-'}</p>
      <p><strong>Social Links:</strong> ${social_links || '-'}</p>
      <p><strong>Follower Count:</strong> ${follower_count || '-'}</p>
      <p><strong>Content Niche:</strong> ${content_niche || '-'}</p>
      <p><strong>Statement:</strong><br/>${statement || '-'}</p>
    `;

    try {
      await sendEmail('support@dagchain.network', {
        to: ['support@dagchain.network'],
        subject: `New Ambassador Application - ${full_name} (${country})`,
        html: notifyHtml,
      });
    } catch (emailErr) {
      console.error('Ambassador notification email error:', emailErr);
    }

    // Confirmation to applicant
    const confirmHtml = `
      <h2>Thank you for applying, ${full_name}!</h2>
      <p>We have received your DAG Army Ambassador application. Our team will review it and reach out to shortlisted candidates.</p>
      <p>If you have questions, contact us at <a href="mailto:support@dagarmy.network">support@dagarmy.network</a>.</p>
      <br/>
      <p>- The DAG Army Team</p>
    `;

    try {
      await sendEmail('support@dagchain.network', {
        to: email,
        subject: 'DAG Army Ambassador Application Received',
        html: confirmHtml,
      });
    } catch (emailErr) {
      console.error('Ambassador confirmation email error:', emailErr);
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Ambassador apply error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
