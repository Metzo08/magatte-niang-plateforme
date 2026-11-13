import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  clearFailedLogins,
  getAuthenticatedSbsManager,
  getClientIp,
  isLoginRateLimited,
  recordFailedLogin,
  SBS_ENTITY_ID,
  SBS_MANAGER_ROLE,
  SBS_SESSION_COOKIE,
  signSbsSession,
  verifySbsFallbackCredentials,
  verifySbsPassword,
} from '@/lib/sbsAuth';
import { ensureSbsSeeded, recordSbsAudit } from '@/lib/sbsDbBootstrap';

const loginSchema = z.object({
  username: z.string().trim().min(1).max(80).optional(),
  password: z.string().min(1).max(200),
});

export async function GET() {
  const manager = await getAuthenticatedSbsManager();
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
  const ip = getClientIp(req);
  if (isLoginRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Trop de tentatives échouées. Veuillez patienter 15 minutes avant de réessayer.' },
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
      parsed.data.username || process.env.SBS_MANAGER_USERNAME || 'sbs-gestionnaire';

    let sessionSub = 'fallback-sbs-manager';
    let sessionUsername = targetUsername;
    let sessionDisplayName = 'Salimata SOW — Responsable SBS Industrie';
    let authenticatedOk = false;

    try {
      await ensureSbsSeeded();
      const account = await prisma.sbsManagerAccount.findUnique({
        where: { username: targetUsername },
      });

      if (
        account &&
        account.isActive &&
        account.entityId === SBS_ENTITY_ID &&
        account.role === SBS_MANAGER_ROLE &&
        verifySbsPassword(parsed.data.password, account.passwordHash)
      ) {
        authenticatedOk = true;
        sessionSub = account.id;
        sessionUsername = account.username;
        sessionDisplayName = account.displayName;
        await prisma.sbsManagerAccount.update({
          where: { id: account.id },
          data: { lastLoginAt: new Date() },
        });
        await recordSbsAudit('AUTH_LOGIN_SUCCESS', account.username, { entityId: SBS_ENTITY_ID }, ip);
      } else {
        recordFailedLogin(ip);
        await recordSbsAudit('AUTH_LOGIN_FAILED', targetUsername, { reason: 'bad_credentials' }, ip);
      }
    } catch (dbErr) {
      console.error('SBS Auth DB fallback:', dbErr);
      if (verifySbsFallbackCredentials(targetUsername, parsed.data.password)) {
        authenticatedOk = true;
      } else {
        recordFailedLogin(ip);
      }
    }

    if (!authenticatedOk) {
      return NextResponse.json(
        { error: 'Identifiant ou mot de passe incorrect pour le gestionnaire SBS Industrie.' },
        { status: 401 }
      );
    }

    clearFailedLogins(ip);
    const token = signSbsSession({
      sub: sessionSub,
      username: sessionUsername,
      displayName: sessionDisplayName,
      role: SBS_MANAGER_ROLE,
      entityId: SBS_ENTITY_ID,
    });

    const res = NextResponse.json({
      authenticated: true,
      manager: {
        username: sessionUsername,
        displayName: sessionDisplayName,
        role: SBS_MANAGER_ROLE,
        entityId: SBS_ENTITY_ID,
      },
    });

    const isHttps =
      req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https://');

    res.cookies.set(SBS_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      path: '/',
      maxAge: 12 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error('SBS Auth POST error:', err);
    return NextResponse.json({ error: 'Erreur interne d’authentification.' }, { status: 500 });
  }
}
