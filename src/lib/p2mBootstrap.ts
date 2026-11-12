import prisma from '@/lib/db';
import { ensureEntityManagerAccount } from '@/lib/entityAuth';
import { PRODUCTS_P2M } from '@/data/initialData';

let p2mSeedPromise: Promise<void> | null = null;

export async function ensureP2mSeeded(): Promise<void> {
  if (!p2mSeedPromise) {
    p2mSeedPromise = runP2mSeed().finally(() => {
      p2mSeedPromise = null;
    });
  }
  return p2mSeedPromise;
}

async function runP2mSeed(): Promise<void> {
  await ensureEntityManagerAccount('p2m');

  const existingRows = await prisma.product.findMany({ select: { id: true, ref: true } });
  const existingIds = new Set(existingRows.map((p) => p.id));
  const deleteCount = await prisma.p2mAuditLog.count({
    where: { action: 'PRODUCT_DELETE' },
  });

  if (existingIds.size === 0 || deleteCount === 0) {
    for (const prod of PRODUCTS_P2M) {
      if (existingIds.has(prod.id)) continue;
      await prisma.product.upsert({
        where: { ref: prod.ref },
        create: {
          id: prod.id,
          ref: prod.ref,
          name: prod.name,
          category: prod.category,
          subCategory: prod.subCategory,
          brand: prod.brand,
          dimensions: prod.dimensions,
          material: prod.material,
          finish: prod.finish,
          color: prod.color,
          usage: prod.usage,
          unit: prod.unit,
          packaging: prod.packaging,
          origin: prod.origin,
          indicativePriceFCFA: prod.indicativePriceFCFA,
          isPriceVisible: prod.isPriceVisible,
          availability: prod.availability,
          leadTime: prod.leadTime,
          images: prod.images as any,
          specs: prod.specs as any,
          documents: (prod.documents ?? null) as any,
        },
        update: {},
      });
    }
  }

  const clientCount = await prisma.p2mClient.count();
  if (clientCount === 0) {
    await prisma.p2mClient.create({
      data: {
        id: 'p2m-cli-0001',
        code: 'CLI-P2M-0001',
        identifier: 'NINEA-008341219-1B2',
        fullName: 'Architecte Conseil — Résidence Almadies',
        company: 'Cabinet Horizon Architecture',
        phone: '+221 77 620 45 10',
        email: 'achats@horizon-archi.sn',
        address: 'Route des Almadies, Dakar',
        city: 'Dakar',
        notes: 'Commandes régulières grès cérame 60×120 & sanitaires ESTA.',
      },
    });
  }
}

export async function recordP2mAudit(
  action: string,
  actor: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  try {
    await prisma.p2mAuditLog.create({
      data: {
        id: `p2m-audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action,
        actor,
        details: (details ?? {}) as any,
        ipAddress: ipAddress ?? null,
      },
    });
  } catch (err) {
    console.error('P2M audit error:', err);
  }
}
