import { NextResponse } from 'next/server';

// Intermediate route that sets the token in a client-readable cookie
// then redirects to the final destination
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token') || '';
  const next  = searchParams.get('next') || '/student-dashboard';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Signing in...</title></head>
<body>
<script>
  try {
    const token = ${JSON.stringify(token)};
    if (token) {
      localStorage.setItem('dagarmy_token', token);
      // Decode and store user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('dagarmy_user', JSON.stringify({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        auth_provider: payload.provider,
      }));
    }
  } catch(e) { console.error('Session set error:', e); }
  window.location.href = ${JSON.stringify(next.startsWith('/') ? appUrl + next : next)};
</script>
<p>Signing you in, please wait...</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
