import { NextResponse } from 'next/server';
import { ENTITY_AUTH_MAP, getAuthenticatedEntityManager, getRequestIp } from '@/lib/entityAuth';
import { recordLogistikAudit } from '@/lib/logistikBootstrap';

const cfg = ENTITY_AUTH_MAP['sbs-logistik'];

export async function POST(req: Request) {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (manager) {
    await recordLogistikAudit('AUTH_LOGOUT', manager.username, {}, getRequestIp(req));
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
