import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ENTITIES } from '@/data/initialData';
import { apiHandler } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return apiHandler(
    async () => {
      const entity = await prisma.entity.findUnique({
        where: { id },
      });

      if (entity) {
        return entity;
      }

      // Fallback to static ENTITIES
      const fallbackEntity = ENTITIES.find((e) => e.id === id);
      if (fallbackEntity) {
        return fallbackEntity;
      }

      throw new Error('Entity not found');
    },
    'Entity GET',
    undefined,
    false
  ).catch((error) => {
    if (error.message === 'Entity not found') {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  });
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