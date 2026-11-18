import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getAuthenticatedEntityManager, ManagedEntityId } from '@/lib/entityAuth';

const ALLOWED: ManagedEntityId[] = ['sbs-labo', 'serma-btp', 'sbs-group', 'pgt'];

function resolveEntity(raw: string): ManagedEntityId | null {
  return ALLOWED.includes(raw as ManagedEntityId) ? (raw as ManagedEntityId) : null;
}

const dispatchSchema = z.object({
  targetEntityId: z.string().min(2).max(40),
  clientName: z.string().trim().min(2).max(120),
  subject: z.string().trim().min(2).max(200),
  details: z.string().trim().max(2000).optional(),
  priority: z.enum(['Normale', 'Urgente']).optional(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ entityId: string }> }
) {
  const { entityId: raw } = await context.params;
  const entityId = resolveEntity(raw);
  if (!entityId) return NextResponse.json({ error: 'Entité invalide' }, { status: 404 });

  const manager = await getAuthenticatedEntityManager(entityId);
  if (!manager) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  try {
    const [leads, quotes, labTests] = await Promise.all([
      prisma.lead.findMany({
        where: { assignedEntityId: entityId },
        orderBy: { createdAt: 'desc' },
        take: 40,
      }),
      prisma.quote.findMany({
        where: { entityId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      entityId === 'sbs-labo' || entityId === 'serma-btp' || entityId === 'sbs-group'
        ? prisma.labTest.findMany({ orderBy: { code: 'asc' }, take: 30 })
        : Promise.resolve([]),
    ]);

    return NextResponse.json({
      manager,
      leads,
      quotes,
      labTests,
      dbOfflineMode: false,
    });
  } catch (err) {
    console.error(`Entity workspace GET error (${entityId}):`, err);
    return NextResponse.json({
      manager,
      leads: [],
      quotes: [],
      labTests: [],
      dbOfflineMode: true,
    });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ entityId: string }> }
) {
  const { entityId: raw } = await context.params;
  const entityId = resolveEntity(raw);
  if (!entityId) return NextResponse.json({ error: 'Entité invalide' }, { status: 404 });

  const manager = await getAuthenticatedEntityManager(entityId);
  if (!manager) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = dispatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de transmission invalides.' }, { status: 400 });
    }

    const { targetEntityId, clientName, subject, details, priority } = parsed.data;
    const message = `[TRANSFERT INTER-ENTITÉ : ${entityId.toUpperCase()} → ${targetEntityId.toUpperCase()}]${priority === 'Urgente' ? ' [URGENT]' : ''}\nObjet : ${subject}\n${details || ''}`;

    try {
      const id = crypto.randomUUID();
      const leadNumber = `INT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
      const lead = await prisma.lead.create({
        data: {
          id,
          leadNumber,
          fullName: clientName,
          email: 'coordination@groupe-magatteniang.sn',
          phone: '+221 77 000 00 00',
          country: 'Sénégal',
          city: 'Dakar',
          sector: 'BTP & Ingénierie',
          source: 'inter-entity-admin',
          needCategory: subject,
          projectType: `Interconnexion depuis ${entityId.toUpperCase()}`,
          projectLocation: 'Dakar / Sénégal',
          projectStage: 'En cours',
          budgetRange: 'À définir',
          timeframe: priority === 'Urgente' ? 'Urgent' : 'Normal',
          assignedEntityId: targetEntityId,
          score: 80,
          scoreBreakdown: { urgency: 20, clarity: 20, fit: 20, interEntity: 20 },
          stage: 'Nouveau',
          notes: [{ id: `n-${Date.now()}`, author: manager.displayName, content: message, date: new Date().toISOString() }],
          history: [{ id: `h-${Date.now()}`, action: `Transmis depuis ${entityId}`, date: new Date().toISOString() }],
        },
      });
      return NextResponse.json({ ok: true, lead, persisted: true });
    } catch {
      return NextResponse.json({
        ok: true,
        persisted: false,
        lead: {
          id: `local-${Date.now()}`,
          fullName: clientName,
          assignedEntityId: targetEntityId,
          needCategory: subject,
          stage: 'Transmis',
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
}
