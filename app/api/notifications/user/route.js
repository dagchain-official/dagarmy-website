import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Fetch notifications for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email is required' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Build query for notification_recipients
    let query = supabase
      .from('notification_recipients')
      .select(`
        *,
        notification:notifications(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data: recipients, error: recipientsError } = await query;

    if (recipientsError) {
      console.error('Error fetching notifications:', recipientsError);
      return NextResponse.json(
        { success: false, error: recipientsError.message },
        { status: 500 }
      );
    }

    // Filter out inactive or expired notifications
    const now = new Date();
    const activeNotifications = recipients.filter(r => {
      const notif = r.notification;
      if (!notif || !notif.is_active) return false;
      if (notif.expires_at && new Date(notif.expires_at) < now) return false;
      return true;
    });

    // Get unread count
    const unreadCount = activeNotifications.filter(r => !r.is_read).length;

    return NextResponse.json({
      success: true,
      data: {
        notifications: activeNotifications,
        unreadCount,
        totalCount: activeNotifications.length
      }
    });
  } catch (error) {
    console.error('Error in user notifications API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Mark notification as read/dismissed
export async function POST(request) {
  try {
    const body = await request.json();
    const { recipient_id, action, user_email } = body;

    if (!recipient_id || !action || !user_email) {
      return NextResponse.json(
        { success: false, error: 'recipient_id, action, and user_email are required' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', user_email)
      .single();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    let updateData = {};

    if (action === 'read') {
      updateData = {
        is_read: true,
        read_at: new Date().toISOString()
      };
    } else if (action === 'dismiss') {
      updateData = {
        is_dismissed: true,
        dismissed_at: new Date().toISOString()
      };
    } else if (action === 'unread') {
      updateData = {
        is_read: false,
        read_at: null
      };
    }

    const { data, error } = await supabase
      .from('notification_recipients')
      .update(updateData)
      .eq('id', recipient_id)
      .eq('user_id', user.id)
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
