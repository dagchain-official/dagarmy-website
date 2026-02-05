import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Fetch all notifications (admin only)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminEmail = searchParams.get('adminEmail');
    const status = searchParams.get('status'); // 'active', 'expired', 'all'

    if (!adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Admin email is required' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: admin } = await supabase
      .from('users')
      .select('is_master_admin, role')
      .eq('email', adminEmail)
      .single();

    if (!admin || (!admin.is_master_admin && admin.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'expired') {
      query = query.eq('is_active', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error in admin notifications API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const adminEmail = searchParams.get('adminEmail');

    if (!notificationId || !adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Notification ID and admin email are required' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: admin } = await supabase
      .from('users')
      .select('is_master_admin, role')
      .eq('email', adminEmail)
      .single();

    if (!admin || (!admin.is_master_admin && admin.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error in delete notification API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update notification status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { notification_id, is_active, admin_email } = body;

    if (!notification_id || !admin_email) {
      return NextResponse.json(
        { success: false, error: 'Notification ID and admin email are required' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: admin } = await supabase
      .from('users')
      .select('is_master_admin, role')
      .eq('email', admin_email)
      .single();

    if (!admin || (!admin.is_master_admin && admin.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_active })
      .eq('id', notification_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating notification:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in update notification API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
