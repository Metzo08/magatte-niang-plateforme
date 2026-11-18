import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  clearEntityFailedLogins,
  ENTITY_AUTH_MAP,
  getAuthenticatedEntityManager,
  getRequestIp,
  isEntityLoginRateLimited,
  ManagedEntityId,
  recordEntityFailedLogin,
  signEntitySession,
  verifyEntityFallbackCredentials,
} from '@/lib/entityAuth';

const ALLOWED: ManagedEntityId[] = ['sbs-labo', 'serma-btp', 'sbs-group', 'pgt'];
const loginSchema = z.object({
  username: z.string().trim().min(1).max(80).optional(),
  password: z.string().min(1).max(200),
});

function resolveEntity(raw: string): ManagedEntityId | null {
  return ALLOWED.includes(raw as ManagedEntityId) ? (raw as ManagedEntityId) : null;
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ entityId: string }> }
) {
  const { entityId: raw } = await context.params;
  const entityId = resolveEntity(raw);
  if (!entityId) return NextResponse.json({ error: 'Entité invalide' }, { status: 404 });

  const manager = await getAuthenticatedEntityManager(entityId);
  if (!manager) return NextResponse.json({ authenticated: false });

  return NextResponse.json({ authenticated: true, manager });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ entityId: string }> }
) {
  const { entityId: raw } = await context.params;
  const entityId = resolveEntity(raw);
  if (!entityId) return NextResponse.json({ error: 'Entité invalide' }, { status: 404 });

  const ip = getRequestIp(req);
  if (isEntityLoginRateLimited(entityId, ip)) {
    return NextResponse.json(
      { error: 'Trop de tentatives échouées. Veuillez patienter 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Identifiant et mot de passe requis.' }, { status: 400 });
    }

    const cfg = ENTITY_AUTH_MAP[entityId];
    const username = parsed.data.username || cfg.defaultUsername;
    const valid = verifyEntityFallbackCredentials(entityId, username, parsed.data.password);

    if (!valid) {
      recordEntityFailedLogin(entityId, ip);
      return NextResponse.json({ error: 'Identifiant ou mot de passe incorrect.' }, { status: 401 });
    }

    clearEntityFailedLogins(entityId, ip);
    const token = signEntitySession({
      sub: `${entityId}-manager`,
      username,
      displayName: cfg.displayName,
      role: cfg.role,
      entityId,
    });

    const res = NextResponse.json({
      authenticated: true,
      manager: {
        username,
        displayName: cfg.displayName,
        role: cfg.role,
        entityId,
      },
    });
    res.cookies.set(cfg.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ entityId: string }> }
) {
  const { entityId: raw } = await context.params;
  const entityId = resolveEntity(raw);
  if (!entityId) return NextResponse.json({ error: 'Entité invalide' }, { status: 404 });

  const cfg = ENTITY_AUTH_MAP[entityId];
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(cfg.cookieName);
  return res;
}
