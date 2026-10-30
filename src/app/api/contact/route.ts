import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST /api/contact - Formulaire de contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Créer automatiquement un lead à partir du formulaire de contact
    const leadNumber = await generateLeadNumber();
    
    // Calcul du score
    const score = 10; // Score de base pour contact direct
    const breakdown = [{ signal: 'Contact direct via formulaire', points: 10 }];
    
    const lead = await prisma.lead.create({
      data: {
        id: `lead-${Date.now()}`,
        leadNumber,
        fullName: body.fullName,
        company: body.company,
        role: body.role,
        phone: body.phone,
        email: body.email,
        country: body.country || 'Sénégal',
        city: body.city || '',
        sector: body.sector || '',
        source: 'Contact direct',
        needCategory: body.subject,
        projectType: body.message?.substring(0, 100) || '',
        projectLocation: '',
        projectStage: 'Idée',
        budgetRange: 'Non spécifié',
        timeframe: '3–6 mois',
        assignedEntityId: body.entityId || 'direction',
        score,
        scoreBreakdown: JSON.stringify(breakdown),
        stage: 'Nouveau',
        notes: JSON.stringify([{
          id: `note-${Date.now()}`,
          author: 'Contact form',
          date: new Date().toISOString(),
          content: body.message
        }]),
        history: JSON.stringify([{
          date: new Date().toISOString(),
          user: 'System',
          action: 'Lead créé via formulaire de contact'
        }])
      }
    });
    
    return NextResponse.json({
      success: true,
      leadNumber: lead.leadNumber,
      message: 'Votre message a été envoyé avec succès. Nous vous recontacterons sous 24h.'
    });
  } catch (error) {
    console.error('Erreur formulaire contact:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du message' }, { status: 500 });
  }
}

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