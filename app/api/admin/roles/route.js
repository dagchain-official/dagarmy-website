import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Fetch all admin roles
export async function GET(request) {
  try {
    const { data: roles, error } = await supabase
      .from('admin_roles')
      .select(`
        *,
        user:users(id, full_name, email, avatar_url),
        assigned_by_user:users!admin_roles_assigned_by_fkey(id, full_name, email)
      `)
      .order('assigned_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ roles: roles || [] });
  } catch (error) {
    console.error('Error fetching admin roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin roles', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Assign admin role to user
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, role_name, permissions, assigned_by } = body;

    if (!user_id || !permissions) {
      return NextResponse.json(
        { error: 'user_id and permissions are required' },
        { status: 400 }
      );
    }

    // Check if user already has a role
    const { data: existingRole } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('user_id', user_id)
      .single();

    let result;
    if (existingRole) {
      // Update existing role
      const { data, error } = await supabase
        .from('admin_roles')
        .update({
          role_name: role_name || 'Custom Admin',
          permissions: permissions,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .select()
        .single();

      if (error) throw error;
      result = data;

      // Update user's role in users table
      await supabase
        .from('users')
        .update({ 
          is_admin: true,
          role: 'admin'
        })
        .eq('id', user_id);
    } else {
      // Create new role
      const { data, error } = await supabase
        .from('admin_roles')
        .insert([{
          user_id,
          role_name: role_name || 'Custom Admin',
          permissions: permissions,
          assigned_by: assigned_by || null,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      result = data;

      // Update user's is_admin flag and role
      await supabase
        .from('users')
        .update({ 
          is_admin: true,
          role: 'admin'
        })
        .eq('id', user_id);
    }

    // Log the action
    await supabase
      .from('admin_audit_log')
      .insert([{
        admin_id: assigned_by || user_id,
        action: existingRole ? 'roles.update' : 'roles.create',
        resource_type: 'admin_role',
        resource_id: result.id,
        details: { user_id, role_name, permissions_count: permissions.length }
      }]);

    return NextResponse.json({ 
      success: true, 
      role: result,
      message: existingRole ? 'Admin role updated successfully' : 'Admin role assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning admin role:', error);
    return NextResponse.json(
      { error: 'Failed to assign admin role', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update admin role permissions
export async function PUT(request) {
  try {
    const body = await request.json();
    const { user_id, role_name, permissions, is_active } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (role_name !== undefined) updateData.role_name = role_name;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (is_active !== undefined) updateData.is_active = is_active;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('admin_roles')
      .update(updateData)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase
      .from('admin_audit_log')
      .insert([{
        admin_id: user_id,
        action: 'roles.update',
        resource_type: 'admin_role',
        resource_id: data.id,
        details: updateData
      }]);

    return NextResponse.json({ success: true, role: data });
  } catch (error) {
    console.error('Error updating admin role:', error);
    return NextResponse.json(
      { error: 'Failed to update admin role', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Revoke admin access
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Delete the role
    const { error: deleteError } = await supabase
      .from('admin_roles')
      .delete()
      .eq('user_id', user_id);

    if (deleteError) throw deleteError;

    // Update user's is_admin flag and role
    await supabase
      .from('users')
      .update({ 
        is_admin: false,
        role: 'student'
      })
      .eq('id', user_id);

    // Log the action
    await supabase
      .from('admin_audit_log')
      .insert([{
        admin_id: user_id,
        action: 'roles.delete',
        resource_type: 'admin_role',
        resource_id: user_id,
        details: { revoked: true }
      }]);

    return NextResponse.json({ 
      success: true, 
      message: 'Admin access revoked successfully' 
    });
  } catch (error) {
    console.error('Error revoking admin access:', error);
    return NextResponse.json(
      { error: 'Failed to revoke admin access', details: error.message },
      { status: 500 }
    );
  }
}
