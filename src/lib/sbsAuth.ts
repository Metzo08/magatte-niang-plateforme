import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

export const SBS_SESSION_COOKIE = 'sbs_manager_session';
export const SBS_ENTITY_ID = 'sbs-industries';
export const SBS_MANAGER_ROLE = 'SBS_INDUSTRIES_MANAGER';

const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 heures

export interface SbsSessionPayload {
  sub: string;
  username: string;
  displayName: string;
  role: typeof SBS_MANAGER_ROLE;
  entityId: typeof SBS_ENTITY_ID;
  iat: number;
  exp: number;
}

// Rate limiter en mémoire par IP pour protéger la route de connexion
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_FAILED_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export function getClientIp(req?: Request): string {
  if (!req) return 'unknown';
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'local';
}

export function isLoginRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (now > entry.resetAt) {
    loginAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailedLogins(ip: string): void {
  loginAttempts.delete(ip);
}

function getAuthSecret(): string {
  const secret = process.env.SBS_AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  const seed =
    process.env.DATABASE_URL ||
    process.env.VERCEL_PROJECT_ID ||
    'magatte-niang-sbs-industrie-hmac-fallback-2026';
  return crypto.createHash('sha256').update(seed).digest('hex');
}

export function safeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifySbsFallbackCredentials(username: string, password: string): boolean {
  const expectedUser = (process.env.SBS_MANAGER_USERNAME || 'sbs-gestionnaire').trim();
  const expectedPass = (process.env.SBS_MANAGER_PASSWORD || 'SbsIndustrie#2026!').trim();
  return safeEqualString(username.trim(), expectedUser) && safeEqualString(password, expectedPass);
}

export function hashSbsPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifySbsPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, hexHash] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hexHash, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export function signSbsSession(payload: Omit<SbsSessionPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000);
  const full: SbsSessionPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', getAuthSecret()).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifySbsSessionToken(token: string | undefined): SbsSessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;

  let expectedSig: string;
  try {
    expectedSig = crypto.createHmac('sha256', getAuthSecret()).update(encoded).digest('base64url');
  } catch {
    return null;
  }

  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expectedSig, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SbsSessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (
      !parsed ||
      parsed.exp <= now ||
      parsed.role !== SBS_MANAGER_ROLE ||
      parsed.entityId !== SBS_ENTITY_ID
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getAuthenticatedSbsManager(): Promise<SbsSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SBS_SESSION_COOKIE)?.value;
  const payload = verifySbsSessionToken(token);
  if (!payload) return null;

  if (payload.sub === 'fallback-sbs-manager') {
    return payload;
  }

  try {
    const account = await prisma.sbsManagerAccount.findUnique({
      where: { id: payload.sub },
      select: { id: true, isActive: true, role: true, entityId: true, username: true, displayName: true },
    });
    if (
      !account ||
      !account.isActive ||
      account.role !== SBS_MANAGER_ROLE ||
      account.entityId !== SBS_ENTITY_ID
    ) {
      return null;
    }
    return {
      ...payload,
      username: account.username,
      displayName: account.displayName,
    };
  } catch {
    return payload;
  }
}
