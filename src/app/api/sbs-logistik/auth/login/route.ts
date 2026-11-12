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
  verifyEntityFallbackCredentials,
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

    const targetUsername =
      parsed.data.username || process.env[cfg.envUsernameKey] || cfg.defaultUsername;

    let sessionSub = 'fallback-sbs-logistik';
    let sessionUsername = targetUsername;
    let sessionDisplayName = cfg.displayName;
    let authenticatedOk = false;

    try {
      await ensureLogistikSeeded();
      const account = await prisma.entityManagerAccount.findUnique({
        where: { username: targetUsername },
      });

      if (
        account &&
        account.isActive &&
        account.entityId === cfg.entityId &&
        account.role === cfg.role &&
        verifyEntityPassword(parsed.data.password, account.passwordHash)
      ) {
        authenticatedOk = true;
        sessionSub = account.id;
        sessionUsername = account.username;
        sessionDisplayName = account.displayName;
        await prisma.entityManagerAccount.update({
          where: { id: account.id },
          data: { lastLoginAt: new Date() },
        });
        await recordLogistikAudit(
          'AUTH_LOGIN_SUCCESS',
          account.username,
          { entityId: 'sbs-logistik' },
          ip
        );
      } else {
        recordEntityFailedLogin('sbs-logistik', ip);
        await recordLogistikAudit(
          'AUTH_LOGIN_FAILED',
          targetUsername,
          { reason: 'bad_credentials' },
          ip
        );
      }
    } catch (dbErr) {
      console.error('Logistik Auth DB fallback:', dbErr);
      if (verifyEntityFallbackCredentials('sbs-logistik', targetUsername, parsed.data.password)) {
        authenticatedOk = true;
      } else {
        recordEntityFailedLogin('sbs-logistik', ip);
      }
    }

    if (!authenticatedOk) {
      return NextResponse.json(
        { error: 'Identifiant ou mot de passe incorrect pour le gestionnaire SB-S Logistik.' },
        { status: 401 }
      );
    }

    clearEntityFailedLogins('sbs-logistik', ip);
    const token = signEntitySession({
      sub: sessionSub,
      username: sessionUsername,
      displayName: sessionDisplayName,
      role: cfg.role,
      entityId: 'sbs-logistik',
    });

    const res = NextResponse.json({
      authenticated: true,
      manager: {
        username: sessionUsername,
        displayName: sessionDisplayName,
        role: cfg.role,
        entityId: 'sbs-logistik',
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
