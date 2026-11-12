import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apiHandler } from '@/lib/utils';
import { ensureP2mSeeded } from '@/lib/p2mBootstrap';
import { getAuthenticatedEntityManager } from '@/lib/entityAuth';

export async function GET() {
  return apiHandler(
    async () => {
      await ensureP2mSeeded();
      const dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' },
      });
      return dbProducts;
    },
    'Products GET',
    undefined,
    false
  );
}

export async function POST(request: NextRequest) {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (!manager) {
    return NextResponse.json({ error: 'Authentification P2M requise.' }, { status: 401 });
  }

  return apiHandler(async () => {
    await ensureP2mSeeded();
    const body = await request.json();
    const product = await prisma.product.create({
      data: body,
    });
    return product;
  }, 'Products POST');
}
