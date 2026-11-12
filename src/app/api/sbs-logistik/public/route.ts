import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import {
  ensureLogistikSeeded,
  inferBrandFromItem,
  inferDailyRateFromItem,
} from '@/lib/logistikBootstrap';
import { SBS_LOGISTIK_ITEMS } from '@/data/sbsLogistikData';

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
  const fallbackItems = SBS_LOGISTIK_ITEMS.map((item, idx) => {
    const pricing = inferDailyRateFromItem(item);
    return {
      id: item.id,
      code: item.code,
      title: item.title,
      category: item.category,
      brand: inferBrandFromItem(item),
      description: item.description,
      specs: item.specs,
      usage: item.usage,
      imageUrl: item.imageUrl,
      pageNumber: item.pageNumber,
      dailyRateFCFA: pricing.dailyRateFCFA,
      isPriceVisible: pricing.isPriceVisible,
      availability: 'Disponible',
      isPublished: true,
      sortOrder: idx + 1,
      updatedBy: 'Parc Certifié SB-S Logistik',
    };
  });

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
