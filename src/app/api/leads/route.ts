import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';

// Fonction pour calculer le score d'un lead
function calculateLeadScore(lead: any): { score: number; breakdown: { signal: string; points: number }[] } {
  const breakdown: { signal: string; points: number }[] = [];
  let score = 0;

  // Score par stade de projet
  if (lead.projectStage === 'Appel d\'offres') { score += 30; breakdown.push({ signal: 'Appel d\'offres en cours', points: 30 }); }
  else if (lead.projectStage === 'Démarrage') { score += 25; breakdown.push({ signal: 'Démarrage imminent', points: 25 }); }
  else if (lead.projectStage === 'Étude') { score += 15; breakdown.push({ signal: 'Phase d\'étude', points: 15 }); }
  else if (lead.projectStage === 'Idée') { score += 5; breakdown.push({ signal: 'Phase idéation', points: 5 }); }

  // Score par budget
  if (lead.budgetRange.includes('> 100 M')) { score += 25; breakdown.push({ signal: 'Budget > 100M FCFA', points: 25 }); }
  else if (lead.budgetRange.includes('50-100')) { score += 20; breakdown.push({ signal: 'Budget 50-100M FCFA', points: 20 }); }
  else if (lead.budgetRange.includes('10-50')) { score += 15; breakdown.push({ signal: 'Budget 10-50M FCFA', points: 15 }); }
  else { score += 5; breakdown.push({ signal: 'Budget < 10M FCFA', points: 5 }); }

  // Score par urgence
  if (lead.timeframe === 'Immédiat') { score += 20; breakdown.push({ signal: 'Besoin immédiat', points: 20 }); }
  else if (lead.timeframe === '1–3 mois') { score += 15; breakdown.push({ signal: 'Besoin court terme', points: 15 }); }
  else if (lead.timeframe === '3–6 mois') { score += 10; breakdown.push({ signal: 'Besoin moyen terme', points: 10 }); }
  else { score += 5; breakdown.push({ signal: 'Besoin long terme', points: 5 }); }

  // Score par entreprise
  if (lead.company && lead.company.length > 2) { score += 10; breakdown.push({ signal: 'Entreprise identifiée', points: 10 }); }

  return { score, breakdown };
}

// Fonction pour générer un numéro de lead
async function generateLeadNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.lead.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`)
      }
    }
  });
  return `LEAD-${year}-${String(count + 1).padStart(4, '0')}`;
}

const safeParse = (val: any) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val ?? null;
};

// GET /api/leads - Liste tous les leads
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const entityId = searchParams.get('entityId');

    const where: any = {};

    if (stage) {
      where.stage = stage;
    }

    if (entityId) {
      where.assignedEntityId = entityId;
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const parsed = leads.map(l => ({
      ...l,
      scoreBreakdown: safeParse(l.scoreBreakdown),
      items: l.items ? safeParse(l.items) : null,
      notes: safeParse(l.notes),
      history: safeParse(l.history)
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Erreur API leads:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/leads - Créer un lead
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const leadNumber = await generateLeadNumber();
    const scoring = calculateLeadScore(body);

    const lead = await prisma.lead.create({
      data: {
        id: `lead-${Date.now()}`,
        leadNumber,
        fullName: body.fullName,
        company: body.company,
        role: body.role,
        phone: body.phone,
        email: body.email,
        country: body.country,
        city: body.city,
        sector: body.sector,
        source: body.source,
        needCategory: body.needCategory,
        projectType: body.projectType,
        projectLocation: body.projectLocation,
        projectStage: body.projectStage,
        budgetRange: body.budgetRange,
        timeframe: body.timeframe,
        assignedEntityId: body.assignedEntityId,
        assignedToUser: body.assignedToUser,
        score: scoring.score,
        scoreBreakdown: JSON.stringify(scoring.breakdown),
        stage: 'Nouveau',
        items: body.items ? JSON.stringify(body.items) : Prisma.JsonNull,
        notes: JSON.stringify([]),
        history: JSON.stringify([{
          date: new Date().toISOString(),
          user: 'System',
          action: 'Lead créé',
          comment: `Lead créé via ${body.source}`
        }])
      }
    });

    return NextResponse.json({
      ...lead,
      scoreBreakdown: scoring.breakdown,
      items: body.items || null,
      notes: [],
      history: safeParse(lead.history)
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur création lead:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}