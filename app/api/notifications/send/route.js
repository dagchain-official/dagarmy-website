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
      target_user_id: rawTargetUserId = null,
      target_user_email = null,
      target_role = null,
      sender_email,
      action_url = null,
      action_label = null,
      icon = null,
      expires_at = null
    } = body;

    // Resolve target_user_email to target_user_id if provided
    let target_user_id = rawTargetUserId;
    if (!target_user_id && target_user_email) {
      const { data: targetUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', target_user_email)
        .single();
      if (!targetUser) {
        return NextResponse.json(
          { success: false, error: `User not found: ${target_user_email}` },
          { status: 404 }
        );
      }
      target_user_id = targetUser.id;
    }

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

    // Get sender information (non-blocking - use fallback if not found)
    const { data: sender } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('email', sender_email)
      .single();

    const senderId = sender?.id || null;
    const senderName = sender?.full_name || sender_email || 'Admin';

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
        sender_id: senderId,
        sender_name: senderName,
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
