import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Fonction pour générer un numéro de devis
async function generateQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.quote.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`)
      }
    }
  });
  return `DEV-${year}-${String(count + 1).padStart(4, '0')}`;
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

// GET /api/quotes - Liste tous les devis
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const entityId = searchParams.get('entityId');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    const quotes = await prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const parsed = quotes.map(q => ({
      ...q,
      items: safeParse(q.items),
      auditTrail: safeParse(q.auditTrail)
    }));
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Erreur API quotes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/quotes - Créer un devis
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const quoteNumber = await generateQuoteNumber();
    const totalHT = body.items.reduce((sum: number, item: any) => sum + item.totalPriceFCFA, 0);
    const taxRate = body.taxRate ?? 18; // TVA Sénégal 18%
    const totalTTC = totalHT * (1 + taxRate / 100);
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Validité 30 jours
    
    const quote = await prisma.quote.create({
      data: {
        id: `quote-${Date.now()}`,
        quoteNumber,
        leadId: body.leadId,
        clientName: body.clientName,
        clientCompany: body.clientCompany,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone,
        entityId: body.entityId,
        validUntil,
        items: JSON.stringify(body.items),
        totalHT,
        taxRate,
        totalTTC,
        notes: body.notes,
        auditTrail: JSON.stringify([{
          date: new Date().toISOString(),
          action: 'Devis créé',
          actor: 'System'
        }])
      }
    });
    
    return NextResponse.json({
      ...quote,
      items: body.items,
      auditTrail: safeParse(quote.auditTrail)
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur création devis:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}