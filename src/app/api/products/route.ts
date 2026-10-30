import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { PRODUCTS_P2M } from '@/data/initialData';
import { apiHandler } from '@/lib/utils';

export async function GET(request: NextRequest) {
  return apiHandler(
    async () => {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const search = searchParams.get('search');

      // Données réelles du catalogue P2M (flyers officiels) — prioritaires sur la base
      let staticData = PRODUCTS_P2M;
      if (category && category !== 'all') {
        staticData = staticData.filter(p => p.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        staticData = staticData.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.ref.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
        );
      }

      // Complète avec les produits ajoutés via l'admin (base de données) sans doublon
      try {
        const dbProducts = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        });
        const staticIds = new Set(staticData.map(p => p.id));
        const extras = (dbProducts || []).filter((p: any) => !staticIds.has(p.id));
        return [...staticData, ...extras];
      } catch {
        return staticData;
      }
    },
    'Products GET',
    PRODUCTS_P2M,
    true // Use fallback on error
  );
}

export async function POST(request: NextRequest) {
  return apiHandler(
    async () => {
      const body = await request.json();
      const product = await prisma.product.create({
        data: body,
      });
      return product;
    },
    'Products POST'
  );
}