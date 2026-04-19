import { NextResponse } from 'next/server';

/**
 * GET /api/auth/google/set-session
 * Intermediate page that:
 * 1. Writes JWT + user to localStorage (needs to run in browser)
 * 2. Sets auth cookies for middleware
 * 3. Redirects to the final destination (dashboard)
 *
 * Query params:
 *   token - JWT token
 *   user  - JSON-encoded safe user object
 *   next  - destination path after login
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token') || '';
  const userJson = searchParams.get('user') || '{}';
  const next  = searchParams.get('next') || '/student-dashboard';

  // Derive the app URL from the request itself (avoids env var mismatch)
  const reqUrl = new URL(req.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    || `${reqUrl.protocol}//${reqUrl.host}`;

  // Final destination - must be a same-origin path
  const destination = next.startsWith('/') ? `${appUrl}${next}` : next;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Signing in...</title></head>
<body>
<script>
  (function() {
    try {
      var token = ${JSON.stringify(token)};
      var userJson = ${JSON.stringify(userJson)};
      var dest = ${JSON.stringify(destination)};

      if (token) {
        // Store token
        localStorage.setItem('dagarmy_token', token);

        // Parse + store full user object (passed from callback)
        try {
          var user = JSON.parse(userJson);
          if (user && user.id) {
            localStorage.setItem('dagarmy_user', JSON.stringify(user));
            // Backward-compat keys
            localStorage.setItem('dagarmy_authenticated', 'true');
            localStorage.setItem('dagarmy_role', user.role || 'student');
            document.cookie = 'dagarmy_role=' + (user.role || 'student') + '; path=/; max-age=2592000';
            document.cookie = 'dagarmy_authenticated=true; path=/; max-age=2592000';
          }
        } catch(e) {
          // Fallback: decode from JWT payload
          try {
            var payload = JSON.parse(atob(token.split('.')[1]));
            var u = { id: payload.sub, email: payload.email, role: payload.role || 'student', is_admin: payload.isAdmin || false };
            localStorage.setItem('dagarmy_user', JSON.stringify(u));
            localStorage.setItem('dagarmy_authenticated', 'true');
            localStorage.setItem('dagarmy_role', u.role);
            document.cookie = 'dagarmy_role=' + u.role + '; path=/; max-age=2592000';
            document.cookie = 'dagarmy_authenticated=true; path=/; max-age=2592000';
          } catch(e2) {}
        }
      }
    } catch(e) {
      console.error('Session set error:', e);
    }
    // Always redirect - even on error
    window.location.replace(dest);
  })();
</script>
<p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#64748b">
  Signing you in, please wait&hellip;
</p>
</body>
</html>`;

  const response = new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

  // Also set the token as an httpOnly cookie for middleware
  if (token) {
    const cookieMaxAge = 60 * 60 * 24 * 7;
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    response.headers.append(
      'Set-Cookie',
      `dagarmy_token=${token}; HttpOnly; SameSite=Lax; Max-Age=${cookieMaxAge}; Path=/${secure}`
    );
  }

  return response;
}
