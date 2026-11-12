import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { ensureLogistikSeeded } from '@/lib/logistikBootstrap';

export async function GET() {
  try {
    await ensureLogistikSeeded();

    const items = await prisma.logistikEquipment.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
    });

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
  } catch (err) {
    console.error('SBS Logistik public GET error:', err);
    return NextResponse.json({ error: 'Erreur de chargement du parc SB-S Logistik.' }, { status: 500 });
  }
}
