import { NextResponse } from 'next/server';
import { getAuthenticatedSbsManager, getClientIp, SBS_SESSION_COOKIE } from '@/lib/sbsAuth';
import { recordSbsAudit } from '@/lib/sbsDbBootstrap';

export async function POST(req: Request) {
  const manager = await getAuthenticatedSbsManager();
  if (manager) {
    await recordSbsAudit('AUTH_LOGOUT', manager.username, {}, getClientIp(req));
  }
  const res = NextResponse.json({ ok: true });
  const isHttps =
    req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https://');
  res.cookies.set(SBS_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps,
    path: '/',
    maxAge: 0,
  });
  return res;
}
