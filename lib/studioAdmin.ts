import { createHash } from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

/**
 * Shared helpers for the brandydemo Studio Admin.
 *
 * Access is gated by a single shared password (SUNDAY_ADMIN_PASSWORD). On a
 * successful login we set an httpOnly `studio_admin_auth` cookie whose value is
 * a hash of the password, so the write API routes can re-verify it statelessly.
 * Middleware only does a lightweight length check (same as the dashboard_auth
 * pattern); the API routes below do the real verification before any write.
 */

export const STUDIO_ADMIN_COOKIE = 'studio_admin_auth';

/** Stable token derived from the configured password, or null if unset. */
export function studioAdminToken(): string | null {
  const password = process.env.SUNDAY_ADMIN_PASSWORD;
  if (!password) return null;
  return createHash('sha256').update(password).digest('hex');
}

/** True when the request carries a valid studio_admin_auth cookie. */
export function isStudioAdminAuthed(req: NextRequest): boolean {
  const token = studioAdminToken();
  if (!token) return false;
  const cookie = req.cookies.get(STUDIO_ADMIN_COOKIE)?.value;
  return !!cookie && cookie === token;
}

/** Supabase client using the service role key, or null if misconfigured. */
export function serviceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}
