import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Sending welcome email

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'DAGARMY <noreply@dagarmy.network>',
      to: [email],
      subject: 'Welcome to DAGARMY - Your Learning Journey Begins! 🚀',
      react: WelcomeEmail({ userName: name || 'there' }),
    });

    if (error) {
      console.error('❌ Error sending welcome email:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    // Welcome email sent successfully

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
      emailId: data.id
    });

  } catch (error) {
    console.error('❌ Error in welcome email API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
