import { NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/check-admin-access';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const accessInfo = await checkAdminAccess(email);

    return NextResponse.json({
      success: true,
      ...accessInfo
    });
  } catch (error) {
    console.error('Error checking role:', error);
    return NextResponse.json(
      { error: 'Failed to check role', details: error.message },
      { status: 500 }
    );
  }
}
