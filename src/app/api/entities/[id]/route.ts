import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ENTITIES } from '@/data/initialData';
import { apiHandler } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const fallbackEntity = ENTITIES.find((e) => e.id === id);

  try {
    const entity = await Promise.race([
      prisma.entity.findUnique({
        where: { id },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 400)),
    ]);

    if (entity) {
      return NextResponse.json(entity);
    }
  } catch {
    // Si la DB est lente ou indisponible, fallback direct sans latence
  }

  if (fallbackEntity) {
    return NextResponse.json(fallbackEntity);
  }

  return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return apiHandler(
    async () => {
      const body = await request.json();
      const entity = await prisma.entity.update({
        where: { id },
        data: body,
      });
      return entity;
    },
    'Entity PUT'
  );
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return apiHandler(
    async () => {
      await prisma.entity.delete({
        where: { id },
      });
      return { success: true };
    },
    'Entity DELETE'
  );
}
