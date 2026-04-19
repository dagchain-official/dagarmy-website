import { NextResponse } from 'next/server';

/**
 * POST /api/rewards/rank-upgrade
 * DEPRECATED - the rank system has been removed as of migration 054.
 * Returns 410 Gone.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'The rank system has been removed. This endpoint is no longer available.',
      deprecated: true,
    },
    { status: 410 }
  );
}
