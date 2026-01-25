import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function checkAdminAccess(email) {
  try {
    // Check if user is master admin
    const { data: masterAdmin, error: masterError } = await supabase
      .from('master_admin_whitelist')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (masterAdmin && !masterError) {
      return {
        isAdmin: true,
        isMasterAdmin: true,
        permissions: 'all',
        role: 'master_admin'
      };
    }

    // Check if user has assigned admin role
    const { data: adminRole, error: roleError } = await supabase
      .from('admin_roles')
      .select('role, permissions, is_active')
      .eq('user_email', email)
      .eq('is_active', true)
      .single();

    if (adminRole && !roleError) {
      return {
        isAdmin: true,
        isMasterAdmin: false,
        permissions: adminRole.permissions,
        role: adminRole.role
      };
    }

    // Default: regular student
    return {
      isAdmin: false,
      isMasterAdmin: false,
      permissions: null,
      role: 'student'
    };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return {
      isAdmin: false,
      isMasterAdmin: false,
      permissions: null,
      role: 'student'
    };
  }
}
