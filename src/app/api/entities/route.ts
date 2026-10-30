import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ENTITIES } from '@/data/initialData';
import { apiHandler, handleApiError } from '@/lib/utils';

export async function GET() {
  return apiHandler(
    async () => {
      const entities = await prisma.entity.findMany({
        orderBy: { name: 'asc' },
      });

      if (entities && entities.length > 0) {
        return entities;
      }

      // Fallback to static ENTITIES
      return ENTITIES;
    },
    'Entities GET',
    ENTITIES,
    true // Use fallback on error
  );
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