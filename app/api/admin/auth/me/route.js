import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';

/**
 * GET /api/admin/auth/me
 * Returns the current admin's identity and permissions from the session cookie.
 * Used by SubAdminLayout to build dynamic menus.
 */
export async function GET(request) {
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    admin: {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.full_name,
      is_master_admin: session.isMasterAdmin,
      role_name: session.roleName,
      permissions: session.permissions,
      department_email: session.departmentEmail,
    },
  });
}
