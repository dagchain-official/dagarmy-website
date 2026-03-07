import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/smtp-client';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'multipart/form-data required' }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim() || null;
    const linkedin_url = formData.get('linkedin_url')?.trim() || null;
    const cover_letter = formData.get('cover_letter')?.trim() || null;
    const role_slug = formData.get('role_slug')?.trim();
    const role_title = formData.get('role_title')?.trim();
    const department = formData.get('department')?.trim() || null;
    const region = formData.get('region')?.trim() || null;
    const resumeFile = formData.get('resume');

    if (!name || !email || !role_slug || !role_title) {
      return NextResponse.json({ error: 'name, email, role_slug, and role_title are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    let resume_url = null;
    let resume_filename = null;

    if (resumeFile && resumeFile.size > 0) {
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Resume file must be under 5MB' }, { status: 400 });
      }
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json({ error: 'Resume must be PDF or DOCX' }, { status: 400 });
      }

      const ext = resumeFile.name.split('.').pop();
      const filename = `${Date.now()}-${name.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
      const buffer = Buffer.from(await resumeFile.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from('career-resumes')
        .upload(filename, buffer, { contentType: resumeFile.type, upsert: false });

      if (uploadError) {
        console.error('Resume upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
      }

      resume_url = filename;
      resume_filename = resumeFile.name;
    }

    const { data: application, error: insertError } = await supabaseAdmin
      .from('career_applications')
      .insert({
        name,
        email,
        phone,
        linkedin_url,
        resume_url,
        resume_filename,
        cover_letter,
        role_slug,
        role_title,
        department,
        region,
        status: 'new',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
    }

    // Send notification emails (fire-and-forget)
    const notificationHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0f172a; margin-bottom: 4px;">New Job Application</h2>
        <p style="color: #64748b; margin-top: 0;">Received via dagarmy.network/careers</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 140px; font-size: 14px;">Role</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a; font-size: 14px;">${role_title} — ${region || ''}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Name</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${phone}</td></tr>` : ''}
          ${linkedin_url ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">LinkedIn</td><td style="padding: 8px 0; font-size: 14px;"><a href="${linkedin_url}" style="color: #3b82f6;" target="_blank">${linkedin_url}</a></td></tr>` : ''}
          ${resume_url ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Resume</td><td style="padding: 8px 0; font-size: 14px;"><a href="${resume_url}" style="color: #3b82f6;" target="_blank">Download Resume</a></td></tr>` : ''}
        </table>
        ${cover_letter ? `<div style="margin-top: 16px;"><p style="color: #64748b; font-size: 13px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Cover Letter</p><p style="color: #1e293b; font-size: 14px; line-height: 1.6; background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 3px solid #3b82f6;">${cover_letter.replace(/\n/g, '<br/>')}</p></div>` : ''}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">View all applications at <a href="https://dagarmy.network/admin/careers" style="color: #3b82f6;">Admin Careers Panel</a></p>
      </div>
    `;

    Promise.all([
      sendEmail('hr@dagchain.network', {
        to: ['hr@dagchain.network'],
        subject: `New Application: ${role_title} — ${name}`,
        html: notificationHtml,
      }),
      sendEmail('admin@dagchain.network', {
        to: ['admin@dagchain.network'],
        subject: `New Application: ${role_title} — ${name}`,
        html: notificationHtml,
      }),
    ]).catch((err) => console.error('Notification email error:', err));

    return NextResponse.json({ success: true, id: application.id });
  } catch (err) {
    console.error('Career apply error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
