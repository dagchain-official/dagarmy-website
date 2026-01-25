import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Fetch all custom permissions
export async function GET(request) {
  try {
    const { data: permissions, error } = await supabase
      .from('custom_permissions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ permissions: permissions || [] });
  } catch (error) {
    console.error('Error fetching custom permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom permissions', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create custom permission
export async function POST(request) {
  try {
    const body = await request.json();
    const { permission_key, permission_label, permission_description, module_key, created_by } = body;

    if (!permission_key || !permission_label || !permission_description || !module_key) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if permission key already exists
    const { data: existing } = await supabase
      .from('custom_permissions')
      .select('id')
      .eq('permission_key', permission_key)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Permission key already exists' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('custom_permissions')
      .insert([{
        permission_key,
        permission_label,
        permission_description,
        module_key,
        created_by: created_by || null,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      permission: data,
      message: 'Custom permission created successfully'
    });
  } catch (error) {
    console.error('Error creating custom permission:', error);
    return NextResponse.json(
      { error: 'Failed to create custom permission', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove custom permission
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Permission ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('custom_permissions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Custom permission deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting custom permission:', error);
    return NextResponse.json(
      { error: 'Failed to delete custom permission', details: error.message },
      { status: 500 }
    );
  }
}
