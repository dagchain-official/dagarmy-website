import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      message,
      type = 'info',
      priority = 'normal',
      is_global = false,
      target_user_id = null,
      target_role = null,
      sender_email,
      action_url = null,
      action_label = null,
      icon = null,
      expires_at = null
    } = body;

    // Validation
    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }

    if (!sender_email) {
      return NextResponse.json(
        { success: false, error: 'Sender email is required' },
        { status: 400 }
      );
    }

    // Get sender information
    const { data: sender, error: senderError } = await supabase
      .from('users')
      .select('id, full_name, is_master_admin, role')
      .eq('email', sender_email)
      .single();

    if (senderError || !sender) {
      return NextResponse.json(
        { success: false, error: 'Sender not found' },
        { status: 404 }
      );
    }

    // Check if sender has permission (must be admin or master admin)
    if (!sender.is_master_admin && sender.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only admins can send notifications' },
        { status: 403 }
      );
    }

    // Validate targeting - must have at least one target
    if (!is_global && !target_user_id && !target_role) {
      return NextResponse.json(
        { success: false, error: 'Must specify either global, target_user_id, or target_role' },
        { status: 400 }
      );
    }

    // Create notification
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        type,
        priority,
        is_global,
        target_user_id,
        target_role,
        sender_id: sender.id,
        sender_name: sender.full_name || 'Admin',
        action_url,
        action_label,
        icon,
        expires_at,
        is_active: true
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      return NextResponse.json(
        { success: false, error: notificationError.message },
        { status: 500 }
      );
    }

    // The trigger will automatically create notification_recipients
    // Wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get updated notification with recipient count
    const { data: updatedNotification } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notification.id)
      .single();

    return NextResponse.json({
      success: true,
      data: updatedNotification || notification,
      message: `Notification sent to ${updatedNotification?.total_recipients || 0} recipient(s)`
    });
  } catch (error) {
    console.error('Error in send notification API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
