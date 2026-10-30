import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/appointments - Liste tous les rendez-vous
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    
    const where: any = {};
    
    if (entityId) {
      where.entityId = entityId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.date = {
        gte: startDate,
        lt: endDate
      };
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { date: 'asc' }
    });
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Erreur API appointments:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/appointments - Créer un rendez-vous
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const appointment = await prisma.appointment.create({
      data: {
        id: `apt-${Date.now()}`,
        type: body.type,
        entityId: body.entityId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        company: body.company,
        date: new Date(body.date),
        timeSlot: body.timeSlot,
        subject: body.subject,
        status: 'En attente'
      }
    });
    
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Erreur création rendez-vous:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}