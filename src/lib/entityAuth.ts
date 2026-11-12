import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

export type ManagedEntityId = 'p2m' | 'sbs-logistik';

export interface EntityAuthConfig {
  entityId: ManagedEntityId;
  cookieName: string;
  role: 'P2M_MANAGER' | 'SBS_LOGISTIK_MANAGER';
  defaultUsername: string;
  envUsernameKey: string;
  envPasswordKey: string;
  displayName: string;
  email: string;
}

export const ENTITY_AUTH_MAP: Record<ManagedEntityId, EntityAuthConfig> = {
  p2m: {
    entityId: 'p2m',
    cookieName: 'p2m_manager_session',
    role: 'P2M_MANAGER',
    defaultUsername: 'p2m-gestionnaire',
    envUsernameKey: 'P2M_MANAGER_USERNAME',
    envPasswordKey: 'P2M_MANAGER_PASSWORD',
    displayName: 'Gestionnaire P2M Showroom',
    email: 'contact@p2m-senegal.com',
  },
  'sbs-logistik': {
    entityId: 'sbs-logistik',
    cookieName: 'logistik_manager_session',
    role: 'SBS_LOGISTIK_MANAGER',
    defaultUsername: 'logistik-gestionnaire',
    envUsernameKey: 'LOGISTIK_MANAGER_USERNAME',
    envPasswordKey: 'LOGISTIK_MANAGER_PASSWORD',
    displayName: 'Gestionnaire Parc SBS Logistik',
    email: 'rokhayakane.sbs@gmail.com',
  },
};

export interface EntitySessionPayload {
  sub: string;
  username: string;
  displayName: string;
  role: string;
  entityId: ManagedEntityId;
  iat: number;
  exp: number;
}

const SESSION_TTL_SECONDS = 12 * 60 * 60;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_FAILED_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export function getRequestIp(req?: Request): string {
  if (!req) return 'unknown';
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'local';
}

export function isEntityLoginRateLimited(entityId: ManagedEntityId, ip: string): boolean {
  const key = `${entityId}:${ip}`;
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (now > entry.resetAt) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

export function recordEntityFailedLogin(entityId: ManagedEntityId, ip: string): void {
  const key = `${entityId}:${ip}`;
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearEntityFailedLogins(entityId: ManagedEntityId, ip: string): void {
  loginAttempts.delete(`${entityId}:${ip}`);
}

function getAuthSecret(): string {
  const secret = process.env.SBS_AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  const seed =
    process.env.DATABASE_URL ||
    process.env.VERCEL_PROJECT_ID ||
    'magatte-niang-entity-auth-hmac-fallback-2026';
  return crypto.createHash('sha256').update(seed).digest('hex');
}

export function safeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyEntityFallbackCredentials(
  entityId: ManagedEntityId,
  username: string,
  password: string
): boolean {
  const cfg = ENTITY_AUTH_MAP[entityId];
  const expectedUser = (process.env[cfg.envUsernameKey] || cfg.defaultUsername).trim();
  const defaultPass = entityId === 'p2m' ? 'P2mShowroom#2026!' : 'LogistikParc#2026!';
  const expectedPass = (process.env[cfg.envPasswordKey] || defaultPass).trim();
  return safeEqualString(username.trim(), expectedUser) && safeEqualString(password, expectedPass);
}

export function hashEntityPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyEntityPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, hexHash] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hexHash, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export function signEntitySession(payload: Omit<EntitySessionPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000);
  const full: EntitySessionPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', getAuthSecret()).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyEntitySessionToken(
  token: string | undefined,
  expectedEntity: ManagedEntityId
): EntitySessionPayload | null {
  const cfg = ENTITY_AUTH_MAP[expectedEntity];
  if (!token || !token.includes('.')) return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;

  let expectedSig: string;
  try {
    expectedSig = crypto.createHmac('sha256', getAuthSecret()).update(encoded).digest('base64url');
  } catch {
    return null;
  }

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as EntitySessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (
      parsed.exp < now ||
      parsed.entityId !== cfg.entityId ||
      parsed.role !== cfg.role
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getAuthenticatedEntityManager(
  expectedEntity: ManagedEntityId
): Promise<EntitySessionPayload | null> {
  const cfg = ENTITY_AUTH_MAP[expectedEntity];
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(cfg.cookieName)?.value;
    const payload = verifyEntitySessionToken(token, expectedEntity);
    if (!payload) return null;

    if (payload.sub === `fallback-${expectedEntity}`) {
      return payload;
    }

    try {
      const account = await prisma.entityManagerAccount.findUnique({
        where: { id: payload.sub },
        select: { id: true, isActive: true, entityId: true, role: true },
      });

      if (
        !account ||
        !account.isActive ||
        account.entityId !== cfg.entityId ||
        account.role !== cfg.role
      ) {
        return null;
      }
      return payload;
    } catch {
      return payload;
    }
  } catch {
    return null;
  }
}

export async function ensureEntityManagerAccount(entityId: ManagedEntityId): Promise<void> {
  const cfg = ENTITY_AUTH_MAP[entityId];
  const count = await prisma.entityManagerAccount.count({
    where: { entityId: cfg.entityId, role: cfg.role },
  });
  if (count > 0) return;

  const username = (process.env[cfg.envUsernameKey] || cfg.defaultUsername).trim();
  const initialPassword = process.env[cfg.envPasswordKey];
  if (!initialPassword || initialPassword.length < 8) {
    throw new Error(`${cfg.envPasswordKey} non configuré dans les variables d’environnement.`);
  }

  await prisma.entityManagerAccount.upsert({
    where: { username },
    create: {
      id: `${entityId}-manager-primary`,
      entityId: cfg.entityId,
      username,
      displayName: cfg.displayName,
      email: cfg.email,
      passwordHash: hashEntityPassword(initialPassword),
      role: cfg.role,
      isActive: true,
    },
    update: {},
  });
}
