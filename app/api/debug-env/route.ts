import { NextResponse } from 'next/server';

/**
 * GET /api/debug-env
 * Shows which critical env vars are SET vs MISSING (never shows values).
 * ⚠️  Remove this route after debugging is complete.
 */
export async function GET() {
  const check = (key: string) => ({
    set: !!process.env[key],
    length: process.env[key]?.length ?? 0,
  });

  const report = {
    // Core auth
    GOOGLE_CLIENT_ID:          check('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET:      check('GOOGLE_CLIENT_SECRET'),
    DAG_JWT_SECRET:            check('DAG_JWT_SECRET'),
    SHARED_SSO_SECRET:         check('SHARED_SSO_SECRET'),
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL:  check('NEXT_PUBLIC_SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: check('SUPABASE_SERVICE_ROLE_KEY'),
    SUPABASE_ANON_KEY:         check('SUPABASE_ANON_KEY'),
    // App URL
    NEXT_PUBLIC_APP_URL:       check('NEXT_PUBLIC_APP_URL'),
    NODE_ENV:                  process.env.NODE_ENV,
  };

  const missing = Object.entries(report)
    .filter(([k, v]) => typeof v === 'object' && !v.set)
    .map(([k]) => k);

  return NextResponse.json({
    status: missing.length === 0 ? 'all_ok' : 'missing_vars',
    missing,
    details: report,
  });
}
