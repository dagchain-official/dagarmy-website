import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { getAdminSession, requireMasterAdmin } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email/smtp-client';
import { adminInviteEmailTemplate } from '@/lib/email-templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate a random temporary password
function generateTemporaryPassword() {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomValues = randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  
  return password;
}

export async function POST(request) {
  // Always enforce master admin via session cookie - no bypass
  const guard = await requireMasterAdmin(request);
  if (guard) return guard;

  const session = await getAdminSession(request);

  try {
    const body = await request.json();
    const { email, full_name, role_name, permissions, department_email } = body;
    const created_by_id = session?.user?.id || null;

    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    // Create admin user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        full_name,
        password_hash: passwordHash,
        auth_method: 'credentials',
        is_admin: true,
        is_master_admin: false,
        role: 'admin',
        force_password_change: true,
        profile_completed: true,
        tier: 'DAG_SOLDIER',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating admin user:', userError);
      return NextResponse.json(
        { error: 'Failed to create admin user', details: userError.message },
        { status: 500 }
      );
    }

    // Create admin role entry if permissions provided
    if (permissions && permissions.length > 0) {
      const { error: roleError } = await supabase
        .from('admin_roles')
        .insert({
          user_id: newUser.id,
          role_name: role_name || 'Admin',
          permissions: permissions,
          assigned_by: created_by_id,
          department_email: department_email || null,
          is_active: true
        });

      if (roleError) {
        console.error('Error creating admin role:', roleError);
        // Don't fail the whole operation, just log the error
      }
    }

    // Log the action
    if (created_by_id) {
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_id: created_by_id,
          action: 'admin.create',
          resource_type: 'user',
          resource_id: newUser.id,
          details: { email, full_name, role_name }
        });
    }

    // Send admin invite email with credentials (fire-and-forget)
    const inviterName = session?.user?.full_name || session?.user?.email || 'DAGARMY Master Admin';
    sendEmail('admin@dagchain.network', {
      to: email,
      subject: `You've been invited to DAGARMY as ${role_name || 'Admin'}`,
      html: adminInviteEmailTemplate({
        fullName: full_name,
        email,
        temporaryPassword,
        roleName: role_name || 'Admin',
        invitedByName: inviterName,
      }),
    }).catch(err => console.error('Admin invite email failed (non-blocking):', err));

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name
      },
      temporary_password: temporaryPassword,
      message: 'Admin account created successfully. User must change password on first login.'
    });
  } catch (error) {
    console.error('Error in create admin:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
