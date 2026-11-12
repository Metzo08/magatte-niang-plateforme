import { NextResponse } from 'next/server';
import { ENTITY_AUTH_MAP, getAuthenticatedEntityManager, getRequestIp } from '@/lib/entityAuth';
import { recordP2mAudit } from '@/lib/p2mBootstrap';

const cfg = ENTITY_AUTH_MAP.p2m;

export async function POST(req: Request) {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (manager) {
    await recordP2mAudit('AUTH_LOGOUT', manager.username, {}, getRequestIp(req));
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cfg.cookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
