import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  clearEntityFailedLogins,
  ENTITY_AUTH_MAP,
  getAuthenticatedEntityManager,
  getRequestIp,
  isEntityLoginRateLimited,
  recordEntityFailedLogin,
  signEntitySession,
  verifyEntityPassword,
} from '@/lib/entityAuth';
import { ensureLogistikSeeded, recordLogistikAudit } from '@/lib/logistikBootstrap';

const cfg = ENTITY_AUTH_MAP['sbs-logistik'];

const loginSchema = z.object({
  username: z.string().trim().min(1).max(80).optional(),
  password: z.string().min(1).max(200),
});

export async function GET() {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (!manager) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    manager: {
      username: manager.username,
      displayName: manager.displayName,
      role: manager.role,
      entityId: manager.entityId,
    },
  });
}

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  if (isEntityLoginRateLimited('sbs-logistik', ip)) {
    return NextResponse.json(
      { error: 'Trop de tentatives échouées. Veuillez patienter 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 400 });
    }

    await ensureLogistikSeeded();

    const targetUsername =
      parsed.data.username || process.env[cfg.envUsernameKey] || cfg.defaultUsername;
    const account = await prisma.entityManagerAccount.findUnique({
      where: { username: targetUsername },
    });

    if (
      !account ||
      !account.isActive ||
      account.entityId !== cfg.entityId ||
      account.role !== cfg.role ||
      !verifyEntityPassword(parsed.data.password, account.passwordHash)
    ) {
      recordEntityFailedLogin('sbs-logistik', ip);
      await recordLogistikAudit(
        'AUTH_LOGIN_FAILED',
        targetUsername,
        { reason: 'bad_credentials' },
        ip
      );
      return NextResponse.json(
        { error: 'Identifiant ou mot de passe incorrect pour le gestionnaire SB-S Logistik.' },
        { status: 401 }
      );
    }

    clearEntityFailedLogins('sbs-logistik', ip);
    await prisma.entityManagerAccount.update({
      where: { id: account.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signEntitySession({
      sub: account.id,
      username: account.username,
      displayName: account.displayName,
      role: cfg.role,
      entityId: 'sbs-logistik',
    });

    await recordLogistikAudit('AUTH_LOGIN_SUCCESS', account.username, { entityId: 'sbs-logistik' }, ip);

    const res = NextResponse.json({
      authenticated: true,
      manager: {
        username: account.username,
        displayName: account.displayName,
        role: account.role,
        entityId: account.entityId,
      },
    });

    const isHttps =
      req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https://');

    res.cookies.set(cfg.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      path: '/',
      maxAge: 12 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error('Logistik Auth POST error:', err);
    return NextResponse.json({ error: 'Erreur interne d’authentification.' }, { status: 500 });
  }
}
