import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getAuthenticatedEntityManager, getRequestIp } from '@/lib/entityAuth';
import { ensureLogistikSeeded, recordLogistikAudit } from '@/lib/logistikBootstrap';

const createEquipSchema = z.object({
  code: z.string().trim().min(2).max(40),
  title: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(100),
  brand: z.string().trim().min(1).max(100),
  description: z.string().trim().max(3000).default(''),
  specs: z.string().trim().max(2000).default(''),
  usage: z.string().trim().max(1000).default(''),
  imageUrl: z.string().trim().max(500).default('/images/logistik/engin-default.jpg'),
  dailyRateFCFA: z.number().min(0).default(0),
  isPriceVisible: z.boolean().default(true),
  availability: z
    .enum(['Disponible', 'En location', 'En maintenance', 'Réservé', 'Hors service'])
    .default('Disponible'),
  isPublished: z.boolean().default(true),
});

export async function POST(req: Request) {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    await ensureLogistikSeeded();
    const body = await req.json();
    const parsed = createEquipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données équipement invalides.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const maxSort = await prisma.logistikEquipment.aggregate({ _max: { sortOrder: true } });
    const item = await prisma.logistikEquipment.create({
      data: {
        id: `log-eq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        code: d.code.toUpperCase(),
        title: d.title,
        category: d.category,
        brand: d.brand,
        description: d.description,
        specs: d.specs,
        usage: d.usage,
        imageUrl: d.imageUrl,
        dailyRateFCFA: d.dailyRateFCFA,
        isPriceVisible: d.isPriceVisible,
        availability: d.availability,
        isPublished: d.isPublished,
        sortOrder: (maxSort._max.sortOrder || 0) + 1,
        updatedBy: manager.displayName || manager.username,
      },
    });

    await recordLogistikAudit(
      'EQUIPMENT_CREATED',
      manager.username,
      { code: item.code, title: item.title, brand: item.brand },
      getRequestIp(req)
    );

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error('Logistik equipment POST error:', err);
    return NextResponse.json(
      { error: 'Impossible de créer cet équipement (code déjà utilisé ?).' },
      { status: 400 }
    );
  }
}

const updateEquipSchema = z.object({
  id: z.string().min(1),
  code: z.string().trim().min(2).max(40).optional(),
  title: z.string().trim().min(2).max(180).optional(),
  category: z.string().trim().min(2).max(100).optional(),
  brand: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(3000).optional(),
  specs: z.string().trim().max(2000).optional(),
  usage: z.string().trim().max(1000).optional(),
  imageUrl: z.string().trim().max(500).optional(),
  dailyRateFCFA: z.number().min(0).optional(),
  isPriceVisible: z.boolean().optional(),
  availability: z
    .enum(['Disponible', 'En location', 'En maintenance', 'Réservé', 'Hors service'])
    .optional(),
  isPublished: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateEquipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de mise à jour invalides.' }, { status: 400 });
    }

    const { id, ...rest } = parsed.data;
    const item = await prisma.logistikEquipment.update({
      where: { id },
      data: {
        ...rest,
        updatedBy: manager.displayName || manager.username,
      },
    });

    await recordLogistikAudit(
      'EQUIPMENT_UPDATED',
      manager.username,
      { id: item.id, code: item.code, availability: item.availability, brand: item.brand },
      getRequestIp(req)
    );

    return NextResponse.json({ item });
  } catch (err) {
    console.error('Logistik equipment PUT error:', err);
    return NextResponse.json({ error: 'Erreur mise à jour équipement.' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
    }

    const existing = await prisma.logistikEquipment.delete({ where: { id } });
    await recordLogistikAudit(
      'EQUIPMENT_DELETE',
      manager.username,
      { id: existing.id, code: existing.code, title: existing.title },
      getRequestIp(req)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Logistik equipment DELETE error:', err);
    return NextResponse.json({ error: 'Impossible de supprimer cet équipement.' }, { status: 400 });
  }
}
