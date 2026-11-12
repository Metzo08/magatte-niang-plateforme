import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { getAuthenticatedSbsManager, getClientIp } from '@/lib/sbsAuth';
import { getSbsProducts, recordSbsAudit } from '@/lib/sbsDbBootstrap';

const productSchema = z.object({
  id: z.string().optional(),
  code: z.string().trim().min(2).max(24),
  family: z.enum(['agglos-creux', 'agglos-pleins', 'hourdis', 'paves', 'beton', 'location']),
  name: z.string().trim().min(2).max(160),
  dimensions: z.string().trim().min(1).max(120),
  lengthCm: z.number().nonnegative().nullable().optional(),
  widthCm: z.number().nonnegative().nullable().optional(),
  heightCm: z.number().nonnegative().nullable().optional(),
  unit: z.string().trim().min(1).max(30),
  sellingPriceFCFA: z.number().nonnegative(),
  priceMaxFCFA: z.number().nonnegative().nullable().optional(),
  isPriceVisible: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  availability: z.string().trim().min(1).max(50),
  isRental: z.boolean().optional(),
  imageUrl: z.string().max(400).nullable().optional(),
  description: z.string().max(1500).nullable().optional(),
  hasFormulation: z.boolean().optional(),
  isSolidBlock: z.boolean().optional(),
  gravier38Brouettes: z.number().nonnegative().optional(),
  gravier03Brouettes: z.number().nonnegative().optional(),
  sableBrouettes: z.number().nonnegative().optional(),
  eauLitres: z.number().nonnegative().optional(),
  rendementPerSac: z.number().positive().optional(),
  volumeExtLitres: z.number().positive().optional(),
  stockOpening: z.number().optional(),
  sortOrder: z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  const manager = await getAuthenticatedSbsManager();
  if (!manager) {
    return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Données produit invalides.' }, { status: 400 });
    }
    const d = parsed.data;
    const codeUpper = d.code.toUpperCase();
    const existing = await prisma.sbsProduct.findUnique({ where: { code: codeUpper } });
    if (existing) {
      return NextResponse.json({ error: `Le code produit ${codeUpper} existe déjà.` }, { status: 409 });
    }

    const totalCount = await prisma.sbsProduct.count();
    const created = await prisma.sbsProduct.create({
      data: {
        id: `sbs-prod-${codeUpper.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
        code: codeUpper,
        family: d.family,
        name: d.name,
        dimensions: d.dimensions,
        lengthCm: d.lengthCm ?? null,
        widthCm: d.widthCm ?? null,
        heightCm: d.heightCm ?? null,
        unit: d.unit,
        sellingPriceFCFA: d.sellingPriceFCFA,
        priceMaxFCFA: d.priceMaxFCFA ?? null,
        isPriceVisible: d.isPriceVisible ?? true,
        isPublished: d.isPublished ?? true,
        availability: d.availability,
        isRental: d.isRental ?? d.family === 'location',
        imageUrl: d.imageUrl ?? null,
        description: d.description ?? null,
        hasFormulation: d.hasFormulation ?? ['agglos-creux', 'agglos-pleins', 'hourdis'].includes(d.family),
        isSolidBlock: d.isSolidBlock ?? d.family === 'agglos-pleins',
        gravier38Brouettes: d.gravier38Brouettes ?? 1,
        gravier03Brouettes: d.gravier03Brouettes ?? 2.5,
        sableBrouettes: d.sableBrouettes ?? 0.5,
        eauLitres: d.eauLitres ?? 20,
        rendementPerSac: d.rendementPerSac ?? 24,
        volumeExtLitres: d.volumeExtLitres ?? 12,
        stockOpening: d.stockOpening ?? 0,
        sortOrder: d.sortOrder ?? totalCount + 1,
      },
    });

    await recordSbsAudit('PRODUCT_CREATED', manager.username, { code: created.code, name: created.name }, getClientIp(req));
    const products = await getSbsProducts();
    return NextResponse.json({ ok: true, product: created, products }, { status: 201 });
  } catch (err) {
    console.error('SBS Product POST error:', err);
    return NextResponse.json({ error: 'Erreur lors de la création du produit.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const manager = await getAuthenticatedSbsManager();
  if (!manager) {
    return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json({ error: parsed.error?.issues[0]?.message || 'ID produit manquant.' }, { status: 400 });
    }
    const d = parsed.data;
    const updated = await prisma.sbsProduct.update({
      where: { id: d.id },
      data: {
        code: d.code.toUpperCase(),
        family: d.family,
        name: d.name,
        dimensions: d.dimensions,
        lengthCm: d.lengthCm ?? null,
        widthCm: d.widthCm ?? null,
        heightCm: d.heightCm ?? null,
        unit: d.unit,
        sellingPriceFCFA: d.sellingPriceFCFA,
        priceMaxFCFA: d.priceMaxFCFA ?? null,
        isPriceVisible: d.isPriceVisible ?? true,
        isPublished: d.isPublished ?? true,
        availability: d.availability,
        isRental: d.isRental ?? d.family === 'location',
        imageUrl: d.imageUrl ?? null,
        description: d.description ?? null,
        hasFormulation: d.hasFormulation,
        isSolidBlock: d.isSolidBlock,
        gravier38Brouettes: d.gravier38Brouettes,
        gravier03Brouettes: d.gravier03Brouettes,
        sableBrouettes: d.sableBrouettes,
        eauLitres: d.eauLitres,
        rendementPerSac: d.rendementPerSac,
        volumeExtLitres: d.volumeExtLitres,
        stockOpening: d.stockOpening,
        sortOrder: d.sortOrder,
      },
    });

    await recordSbsAudit(
      'PRODUCT_UPDATED',
      manager.username,
      { code: updated.code, price: updated.sellingPriceFCFA, dimensions: updated.dimensions },
      getClientIp(req)
    );
    const products = await getSbsProducts();
    return NextResponse.json({ ok: true, product: updated, products });
  } catch (err) {
    console.error('SBS Product PUT error:', err);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du produit.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const manager = await getAuthenticatedSbsManager();
  if (!manager) {
    return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
  }

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID produit requis.' }, { status: 400 });
    }
    const deleted = await prisma.sbsProduct.delete({ where: { id } });
    await recordSbsAudit('PRODUCT_DELETED', manager.username, { code: deleted.code }, getClientIp(req));
    const products = await getSbsProducts();
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    console.error('SBS Product DELETE error:', err);
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}
