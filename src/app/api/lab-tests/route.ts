import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/lab-tests - Liste tous les essais labo
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    const labTests = await prisma.labTest.findMany({
      where,
      orderBy: { code: 'asc' }
    });
    
    return NextResponse.json(labTests);
  } catch (error) {
    console.error('Erreur API lab-tests:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/lab-tests - Créer un essai labo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const labTest = await prisma.labTest.create({
      data: {
        id: `test-${Date.now()}`,
        code: body.code,
        name: body.name,
        category: body.category,
        norm: body.norm,
        sampleRequired: body.sampleRequired,
        standardDelayDays: body.standardDelayDays,
        description: body.description,
        isAvailable: body.isAvailable ?? true
      }
    });
    
    return NextResponse.json(labTest, { status: 201 });
  } catch (error) {
    console.error('Erreur création essai labo:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}