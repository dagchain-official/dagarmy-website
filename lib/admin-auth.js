import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MASTER_ADMIN_EMAIL = 'admin@dagchain.network';

/**
 * Resolves the admin session from the admin_session cookie.
 * Returns { user, permissions, isMasterAdmin, roleName, departmentEmail } or null.
 */
export async function getAdminSession(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (!sessionToken) return null;

    // Verify session in DB
    const { data: session, error: sessionErr } = await supabase
      .from('admin_sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (sessionErr || !session) return null;
    if (new Date(session.expires_at) < new Date()) return null;

    // Fetch user + role
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, email, full_name, is_admin, is_master_admin, role')
      .eq('id', session.user_id)
      .single();

    if (userErr || !user) return null;
    if (!user.is_admin && !user.is_master_admin) return null;

    const isMasterAdmin = user.is_master_admin || user.email === MASTER_ADMIN_EMAIL;

    // Fetch admin role + permissions
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('role_name, permissions, department_email')
      .eq('user_id', user.id)
      .single();

    const permissions = isMasterAdmin ? ['*'] : (adminRole?.permissions || []);
    const roleName = isMasterAdmin ? 'Master Admin' : (adminRole?.role_name || 'Admin');
    const departmentEmail = isMasterAdmin
      ? MASTER_ADMIN_EMAIL
      : (adminRole?.department_email || user.email);

    return {
      user,
      permissions,
      isMasterAdmin,
      roleName,
      departmentEmail,
    };
  } catch (err) {
    console.error('getAdminSession error:', err);
    return null;
  }
}

/**
 * Checks if the session has a specific permission.
 * Master admins (permissions = ['*']) pass all checks.
 */
export function sessionHasPermission(session, permission) {
  if (!session) return false;
  if (session.isMasterAdmin) return true;
  if (session.permissions.includes('*')) return true;
  return session.permissions.includes(permission);
}

/**
 * Middleware-style guard. Call at the top of any API route handler.
 * Returns a 401/403 NextResponse if unauthorized, or null if allowed.
 *
 * Usage:
 *   const guard = await requirePermission(request, 'users.read');
 *   if (guard) return guard;
 */
export async function requirePermission(request, permission) {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized — no valid admin session' },
      { status: 401 }
    );
  }

  if (!sessionHasPermission(session, permission)) {
    return NextResponse.json(
      { error: `Forbidden — requires permission: ${permission}` },
      { status: 403 }
    );
  }

  return null; // allowed
}

/**
 * Master-admin-only guard. Returns 403 for sub-admins.
 */
export async function requireMasterAdmin(request) {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized — no valid admin session' },
      { status: 401 }
    );
  }

  if (!session.isMasterAdmin) {
    return NextResponse.json(
      { error: 'Forbidden — Master Admin access required' },
      { status: 403 }
    );
  }

  return null;
}
