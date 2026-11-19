import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ensureLogistikSeeded } from '@/lib/logistikBootstrap';
import { getFallbackLogistikEquipment } from '@/lib/fallbackCatalogStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await ensureLogistikSeeded();

    const items = await prisma.logistikEquipment.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
    });

    if (items.length > 0) {
      const categories = Array.from(new Set(items.map((i) => i.category)));
      const brands = Array.from(new Set(items.map((i) => i.brand))).sort();

      return NextResponse.json({
        items,
        categories,
        brands,
        stats: {
          total: items.length,
          disponible: items.filter((i) => i.availability === 'Disponible').length,
          enLocation: items.filter((i) => i.availability === 'En location').length,
          enMaintenance: items.filter((i) => i.availability === 'En maintenance').length,
        },
      });
    }
  } catch (err) {
    console.error('SBS Logistik public GET fallback (DB unavailable):', err);
  }

  // Fallback résilient si la base de production n'est pas encore migrée/joignable
  const fallbackItems = getFallbackLogistikEquipment().filter((i) => i.isPublished !== false);

  const categories = Array.from(new Set(fallbackItems.map((i) => i.category)));
  const brands = Array.from(new Set(fallbackItems.map((i) => i.brand))).sort();

  return NextResponse.json({
    items: fallbackItems,
    categories,
    brands,
    stats: {
      total: fallbackItems.length,
      disponible: fallbackItems.length,
      enLocation: 0,
      enMaintenance: 0,
    },
  });
}
