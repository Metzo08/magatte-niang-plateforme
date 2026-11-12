import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ENTITIES } from '@/data/initialData';
import { apiHandler } from '@/lib/utils';

export async function GET() {
  try {
    const entities = await Promise.race([
      prisma.entity.findMany({
        orderBy: { name: 'asc' },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 400)),
    ]);

    if (entities && (entities as any[]).length > 0) {
      return NextResponse.json(entities);
    }
  } catch {
    // Si la DB est lente ou indisponible, fallback direct sans latence
  }

  return NextResponse.json(ENTITIES);
}

export async function POST(request: NextRequest) {
  return apiHandler(
    async () => {
      const body = await request.json();
      const entity = await prisma.entity.create({
        data: body,
      });
      return entity;
    },
    'Entities POST'
  );
}
