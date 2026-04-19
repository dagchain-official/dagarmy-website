/**
 * DAG Auth Shared Library - DAGARMY (Next.js / TypeScript)
 * ─────────────────────────────────────────────────────────
 * Provides JWT ops (platform session + SSO cross-platform),
 * bcrypt password utils, and fingerprint abuse detection.
 *
 * env vars required:
 *   DAG_JWT_SECRET        - platform JWT signing secret (DAGARMY-specific)
 *   SHARED_SSO_SECRET     - shared across all 3 platforms (MUST MATCH dagchain & daggpt)
 *   SUPABASE_SERVICE_ROLE_KEY  - for Supabase admin ops
 *   NEXT_PUBLIC_SUPABASE_URL   - Supabase project URL
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// ─── Constants ──────────────────────────────────────────────────────────────
const JWT_EXPIRY = '7d';
const SSO_EXPIRY = '5m';
const BCRYPT_ROUNDS = 12;

// ─── Secrets ─────────────────────────────────────────────────────────────────
function secret(value: string) {
  return new TextEncoder().encode(value);
}

function getJwtSecret() {
  const s = process.env.DAG_JWT_SECRET;
  if (!s) throw new Error('DAG_JWT_SECRET env var is not set');
  return secret(s);
}

function getSsoSecret() {
  const s = process.env.SHARED_SSO_SECRET;
  if (!s) throw new Error('SHARED_SSO_SECRET env var is not set');
  return secret(s);
}

// ─── Supabase admin client ────────────────────────────────────────────────────
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Platform JWT ─────────────────────────────────────────────────────────────
export interface DagUserPayload {
  sub: string;        // user UUID from Supabase users table
  email: string;
  role: string;
  isAdmin: boolean;
  isMasterAdmin?: boolean;
  platform: 'dagarmy' | 'daggpt' | 'dagchain';
}

export async function signPlatformJWT(payload: DagUserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(await getJwtSecret());
}

export async function verifyPlatformJWT(token: string): Promise<DagUserPayload & JWTPayload> {
  const { payload } = await jwtVerify(token, await getJwtSecret());
  return payload as DagUserPayload & JWTPayload;
}

// ─── SSO Cross-Platform JWT ───────────────────────────────────────────────────
export interface SSOPayload {
  email: string;
  sub: string;        // user UUID
  from: string;       // source platform
  target: string;     // destination platform
  jti: string;        // unique token ID (single-use enforcement)
}

export async function signSSOToken(payload: Omit<SSOPayload, 'jti'>): Promise<{ token: string; jti: string }> {
  const jti = crypto.randomUUID();
  const token = await new SignJWT({ ...payload, jti })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SSO_EXPIRY)
    .sign(await getSsoSecret());
  return { token, jti };
}

export async function verifySSOToken(token: string): Promise<SSOPayload & JWTPayload> {
  const { payload } = await jwtVerify(token, await getSsoSecret());
  return payload as SSOPayload & JWTPayload;
}

// ─── Password utilities ───────────────────────────────────────────────────────
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── Extract token from request headers ──────────────────────────────────────
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

// ─── Fingerprint abuse check (calls Supabase RPC) ────────────────────────────
export interface FingerprintResult {
  allowed: boolean;
  reason?: string;
  unique_emails?: number;
}

export async function checkFingerprint(
  fingerprintId: string,
  email: string,
  platform = 'dagarmy',
  threshold = 3
): Promise<FingerprintResult> {
  if (!fingerprintId) return { allowed: true }; // No fingerprint = skipped (client might be blocking it)

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('check_fingerprint_abuse', {
    p_fingerprint_id: fingerprintId,
    p_email: email.toLowerCase(),
    p_platform: platform,
    p_threshold: threshold,
  });

  if (error) {
    console.error('[checkFingerprint] Supabase RPC error:', error.message);
    return { allowed: true }; // Fail open - don't block on infrastructure errors
  }

  return data as FingerprintResult;
}

// ─── Mark SSO token as used ───────────────────────────────────────────────────
export async function markSSOTokenUsed(jti: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.rpc('mark_sso_token_used', { p_jti: jti });
}

// ─── Check if SSO token jti was already used ─────────────────────────────────
export async function isSSOTokenUsed(jti: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('sso_sessions')
    .select('is_used')
    .eq('jti', jti)
    .single();
  return data?.is_used === true;
}

// ─── Log SSO session ──────────────────────────────────────────────────────────
export async function logSSOSession(params: {
  jti: string;
  userId: string;
  email: string;
  fromPlatform: string;
  toPlatform: string;
  expiresAt: Date;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.from('sso_sessions').insert({
    jti: params.jti,
    user_id: params.userId,
    email: params.email,
    from_platform: params.fromPlatform,
    to_platform: params.toPlatform,
    expires_at: params.expiresAt.toISOString(),
  });
}

// ─── Generate redirect URL for SSO jump ──────────────────────────────────────
const PLATFORM_URLS: Record<string, string> = {
  dagarmy: process.env.NEXT_PUBLIC_DAGARMY_URL || 'https://dagarmy.network',
  daggpt: process.env.NEXT_PUBLIC_DAGGPT_URL || 'https://daggpt.network',
  dagchain: process.env.NEXT_PUBLIC_DAGCHAIN_URL || 'https://dagchain.network',
};

export function buildSSORedirectUrl(targetPlatform: string, ssoToken: string): string {
  const base = PLATFORM_URLS[targetPlatform] || '#';
  return `${base}?sso_token=${encodeURIComponent(ssoToken)}`;
}
