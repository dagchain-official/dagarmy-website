import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Session duration: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Max failed login attempts before account lock
const MAX_FAILED_ATTEMPTS = 5;

// Account lock duration: 30 minutes
const LOCK_DURATION = 30 * 60 * 1000;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Admin login attempt:', { email });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get client IP and user agent for logging
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Fetch user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('📊 User fetch result:', { found: !!user, error: userError?.message });

    // Check if user exists
    if (!user || userError) {
      console.log('❌ User not found or error:', userError?.message);
      // Log failed attempt
      await supabase.from('admin_login_attempts').insert({
        email,
        ip_address,
        user_agent,
        success: false,
        failure_reason: 'User not found'
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
      const lockTimeRemaining = Math.ceil((new Date(user.account_locked_until) - new Date()) / 60000);
      
      await supabase.from('admin_login_attempts').insert({
        email,
        ip_address,
        user_agent,
        success: false,
        failure_reason: 'Account locked'
      });

      return NextResponse.json(
        { error: `Account locked. Try again in ${lockTimeRemaining} minutes.` },
        { status: 403 }
      );
    }

    // Check if user has credential-based auth enabled
    if (user.auth_method !== 'credentials' && user.auth_method !== 'both') {
      await supabase.from('admin_login_attempts').insert({
        email,
        ip_address,
        user_agent,
        success: false,
        failure_reason: 'Credential auth not enabled'
      });

      return NextResponse.json(
        { error: 'This account does not support credential-based login' },
        { status: 403 }
      );
    }

    // Check if user has a password set
    if (!user.password_hash) {
      await supabase.from('admin_login_attempts').insert({
        email,
        ip_address,
        user_agent,
        success: false,
        failure_reason: 'No password set'
      });

      return NextResponse.json(
        { error: 'No password set for this account. Please contact administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      const updateData = {
        failed_login_attempts: newFailedAttempts
      };

      // Lock account if max attempts reached
      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        updateData.account_locked_until = new Date(Date.now() + LOCK_DURATION).toISOString();
      }

      await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      await supabase.from('admin_login_attempts').insert({
        email,
        ip_address,
        user_agent,
        success: false,
        failure_reason: 'Invalid password'
      });

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        return NextResponse.json(
          { error: 'Too many failed attempts. Account locked for 30 minutes.' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          attemptsRemaining: MAX_FAILED_ATTEMPTS - newFailedAttempts
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!user.is_admin && !user.is_master_admin) {
      await supabase.from('admin_login_attempts').insert({
        email,
        ip_address,
        user_agent,
        success: false,
        failure_reason: 'Not an admin'
      });

      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Successful login - reset failed attempts
    await supabase
      .from('users')
      .update({
        failed_login_attempts: 0,
        account_locked_until: null,
        last_login: new Date().toISOString()
      })
      .eq('id', user.id);

    // Generate session token
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        ip_address,
        user_agent,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Log successful login
    await supabase.from('admin_login_attempts').insert({
      email,
      ip_address,
      user_agent,
      success: true,
      failure_reason: null
    });

    // Return user data and session token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin,
        is_master_admin: user.is_master_admin,
        role: user.role,
        avatar_url: user.avatar_url
      },
      session: {
        token: sessionToken,
        expires_at: expiresAt.toISOString()
      },
      force_password_change: user.force_password_change || false
    });

    // Set session cookie
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('❌ Error in admin login:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
