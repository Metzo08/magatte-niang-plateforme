import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getAuthenticatedEntityManager, getRequestIp } from '@/lib/entityAuth';
import { ensureP2mSeeded, recordP2mAudit } from '@/lib/p2mBootstrap';

const createProductSchema = z.object({
  ref: z.string().trim().min(2).max(50),
  name: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(100),
  subCategory: z.string().trim().max(100).default('Standard'),
  brand: z.string().trim().min(1).max(100),
  dimensions: z.string().trim().max(100).default('Standard'),
  material: z.string().trim().max(100).default('Grès Cérame'),
  finish: z.string().trim().max(100).default('Mat / Poli'),
  color: z.string().trim().max(100).default('Neutre'),
  usage: z.string().trim().max(150).default('Intérieur / Extérieur'),
  unit: z.string().trim().max(40).default('m²'),
  packaging: z.string().trim().max(80).default('Carton / Palette'),
  origin: z.string().trim().max(80).default('Importation'),
  indicativePriceFCFA: z.number().min(0).default(0),
  isPriceVisible: z.boolean().default(true),
  availability: z.string().trim().default('En stock'),
  leadTime: z.string().trim().default('Sous 48h'),
  imageUrl: z.string().trim().max(500).optional(),
});

export async function POST(req: Request) {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    await ensureP2mSeeded();
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données produit P2M invalides.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const product = await prisma.product.create({
      data: {
        id: `p2m-prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ref: d.ref.toUpperCase(),
        name: d.name,
        category: d.category,
        subCategory: d.subCategory,
        brand: d.brand,
        dimensions: d.dimensions,
        material: d.material,
        finish: d.finish,
        color: d.color,
        usage: d.usage,
        unit: d.unit,
        packaging: d.packaging,
        origin: d.origin,
        indicativePriceFCFA: d.indicativePriceFCFA,
        isPriceVisible: d.isPriceVisible,
        availability: d.availability,
        leadTime: d.leadTime,
        images: d.imageUrl ? ([d.imageUrl] as any) : (['/images/products/default.jpg'] as any),
        specs: { Marque: d.brand, Dimensions: d.dimensions, Finition: d.finish } as any,
      },
    });

    await recordP2mAudit('PRODUCT_CREATED', manager.username, { ref: product.ref, name: product.name }, getRequestIp(req));
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('P2M product POST error:', err);
    return NextResponse.json({ error: 'Impossible de créer ce produit (référence déjà prise ?).' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, category, brand, dimensions, indicativePriceFCFA, isPriceVisible, availability, leadTime, unit } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID produit requis.' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(brand !== undefined ? { brand } : {}),
        ...(dimensions !== undefined ? { dimensions } : {}),
        ...(indicativePriceFCFA !== undefined ? { indicativePriceFCFA: Number(indicativePriceFCFA) } : {}),
        ...(isPriceVisible !== undefined ? { isPriceVisible: Boolean(isPriceVisible) } : {}),
        ...(availability !== undefined ? { availability } : {}),
        ...(leadTime !== undefined ? { leadTime } : {}),
        ...(unit !== undefined ? { unit } : {}),
      },
    });

    await recordP2mAudit(
      'PRODUCT_UPDATED',
      manager.username,
      { id: product.id, ref: product.ref, price: product.indicativePriceFCFA, availability: product.availability },
      getRequestIp(req)
    );
    return NextResponse.json({ product });
  } catch (err) {
    console.error('P2M product PUT error:', err);
    return NextResponse.json({ error: 'Erreur mise à jour produit P2M.' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
    }

    const existing = await prisma.product.delete({ where: { id } });
    await recordP2mAudit('PRODUCT_DELETE', manager.username, { id: existing.id, ref: existing.ref }, getRequestIp(req));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('P2M product DELETE error:', err);
    return NextResponse.json({ error: 'Erreur suppression produit P2M.' }, { status: 400 });
  }
}
