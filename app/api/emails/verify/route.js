import { NextResponse } from 'next/server';
import { verifyConnection } from '@/lib/email';

/**
 * GET /api/emails/verify
 * Verify SMTP connection is working
 */
export async function GET() {
  try {
    const result = await verifyConnection();

    if (!result.connected) {
      return NextResponse.json(
        { connected: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      connected: true,
      message: 'SMTP connection verified successfully'
    });

  } catch (error) {
    console.error('Error verifying SMTP connection:', error);
    return NextResponse.json(
      { connected: false, error: error.message },
      { status: 500 }
    );
  }
}
