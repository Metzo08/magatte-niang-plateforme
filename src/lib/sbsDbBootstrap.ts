import prisma from '@/lib/db';
import { hashSbsPassword, SBS_ENTITY_ID, SBS_MANAGER_ROLE } from '@/lib/sbsAuth';
import {
  createEmptyDailyEntries,
  createNov2026SeedLedger,
  DEFAULT_SBS_CONFIG,
  DEFAULT_SBS_PRODUCTS,
  SbsFactoryConfigData,
  SbsMonthlyLedgerData,
  SbsProductItem,
} from '@/lib/sbsErpDefaults';

let seedInFlight: Promise<void> | null = null;

/**
 * Initialise les données SBS Industrie en base PostgreSQL de manière idempotente
 * et protégée contre les exécutions concurrentes (premier démarrage / déploiement).
 */
export async function ensureSbsSeeded(): Promise<void> {
  if (!seedInFlight) {
    seedInFlight = runEnsureSbsSeeded().finally(() => {
      seedInFlight = null;
    });
  }
  return seedInFlight;
}

async function runEnsureSbsSeeded(): Promise<void> {
  // 1. Compte exclusif Gestionnaire SBS Industrie
  const managerCount = await prisma.sbsManagerAccount.count({
    where: { entityId: SBS_ENTITY_ID, role: SBS_MANAGER_ROLE },
  });

  if (managerCount === 0) {
    const username = (process.env.SBS_MANAGER_USERNAME || 'sbs-gestionnaire').trim();
    const initialPassword = process.env.SBS_MANAGER_PASSWORD;
    if (!initialPassword || initialPassword.length < 8) {
      throw new Error('SBS_MANAGER_PASSWORD non configuré dans les variables d’environnement.');
    }
    await prisma.sbsManagerAccount.create({
      data: {
        id: 'sbs-manager-primary',
        username,
        displayName: 'Salimata SOW — Responsable SBS Industrie',
        email: 'wsbsindustrie2021@gmail.com',
        passwordHash: hashSbsPassword(initialPassword),
        role: SBS_MANAGER_ROLE,
        entityId: SBS_ENTITY_ID,
        isActive: true,
      },
    });
  }

  // 2. Configuration usine (Paramètres)
  const existingConfig = await prisma.sbsFactoryConfig.findUnique({ where: { id: 'default' } });
  if (!existingConfig) {
    await prisma.sbsFactoryConfig.create({
      data: {
        id: DEFAULT_SBS_CONFIG.id,
        companyName: DEFAULT_SBS_CONFIG.companyName,
        phone: DEFAULT_SBS_CONFIG.phone,
        whatsapp: DEFAULT_SBS_CONFIG.whatsapp,
        address: DEFAULT_SBS_CONFIG.address,
        deliveryZone: DEFAULT_SBS_CONFIG.deliveryZone,
        rawMaterials: DEFAULT_SBS_CONFIG.rawMaterials as any,
        wheelbarrowVolumeL: DEFAULT_SBS_CONFIG.wheelbarrowVolumeL,
        freshConcreteDensityKgM3: DEFAULT_SBS_CONFIG.freshConcreteDensityKgM3,
        fixedCharges: DEFAULT_SBS_CONFIG.fixedCharges as any,
        depreciations: DEFAULT_SBS_CONFIG.depreciations as any,
        fixedPayroll: DEFAULT_SBS_CONFIG.fixedPayroll as any,
        modPerCementTonFCFA: DEFAULT_SBS_CONFIG.modPerCementTonFCFA,
        electricityRatePercent: DEFAULT_SBS_CONFIG.electricityRatePercent,
        tvaRatePercent: DEFAULT_SBS_CONFIG.tvaRatePercent,
        kpiTargets: DEFAULT_SBS_CONFIG.kpiTargets as any,
      },
    });
  }

  // 3. Catalogue Produits, Dimensions & Locations (incl. Plein 15x20x40 & 20x20x40, Creux, Hourdis, Pavés, Béton, Locations)
  const existingProducts = await prisma.sbsProduct.findMany({ select: { code: true } });
  const existingCodes = new Set(existingProducts.map((p) => p.code));
  const deleteCount = await prisma.sbsAuditLog.count({
    where: { action: 'PRODUCT_DELETE' },
  });

  if (existingCodes.size === 0 || deleteCount === 0) {
    for (const item of DEFAULT_SBS_PRODUCTS) {
      if (!existingCodes.has(item.code)) {
        await prisma.sbsProduct.upsert({
          where: { code: item.code },
          create: {
            ...item,
            family: item.family,
          },
          update: {},
        });
      }
    }
  } else {
    // S'assurer que AP15 et AP20 existent toujours sauf suppression volontaire explicite
    for (const requiredCode of ['AP15', 'AP20']) {
      if (!existingCodes.has(requiredCode)) {
        const def = DEFAULT_SBS_PRODUCTS.find((p) => p.code === requiredCode);
        if (def) {
          await prisma.sbsProduct.upsert({
            where: { code: def.code },
            create: { ...def },
            update: {},
          });
        }
      }
    }
  }

  // 4. Exercice Novembre 2026 (issue du classeur Excel v5)
  const nov = await prisma.sbsMonthlyLedger.findUnique({
    where: { year_month: { year: 2026, month: 11 } },
  });
  if (!nov) {
    const seed = createNov2026SeedLedger();
    await prisma.sbsMonthlyLedger.create({
      data: {
        id: 'ledger-2026-11',
        year: seed.year,
        month: seed.month,
        dailyEntries: seed.dailyEntries as any,
        salesByCode: seed.salesByCode as any,
        electricityOverrideFCFA: seed.electricityOverrideFCFA,
        rawMaterialStock: seed.rawMaterialStock as any,
        productStock: seed.productStock as any,
        rentalBookings: seed.rentalBookings as any,
        notes: seed.notes,
      },
    });
  }
}

export async function getSbsConfig(): Promise<SbsFactoryConfigData> {
  await ensureSbsSeeded();
  const row = await prisma.sbsFactoryConfig.findUnique({ where: { id: 'default' } });
  if (!row) return DEFAULT_SBS_CONFIG;
  return {
    id: row.id,
    companyName: row.companyName,
    phone: row.phone,
    whatsapp: row.whatsapp,
    address: row.address,
    deliveryZone: row.deliveryZone,
    rawMaterials: row.rawMaterials as any,
    wheelbarrowVolumeL: row.wheelbarrowVolumeL,
    freshConcreteDensityKgM3: row.freshConcreteDensityKgM3,
    fixedCharges: row.fixedCharges as any,
    depreciations: row.depreciations as any,
    fixedPayroll: row.fixedPayroll as any,
    modPerCementTonFCFA: row.modPerCementTonFCFA,
    electricityRatePercent: row.electricityRatePercent,
    tvaRatePercent: row.tvaRatePercent,
    kpiTargets: row.kpiTargets as any,
  };
}

export async function getSbsProducts(): Promise<SbsProductItem[]> {
  await ensureSbsSeeded();
  const rows = await prisma.sbsProduct.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map((r) => ({
    ...r,
    family: r.family as SbsProductItem['family'],
  }));
}

export async function getOrCreateSbsLedger(year: number, month: number): Promise<SbsMonthlyLedgerData> {
  await ensureSbsSeeded();
  let row = await prisma.sbsMonthlyLedger.findUnique({
    where: { year_month: { year, month } },
  });

  if (!row) {
    if (year === 2026 && month === 11) {
      const seed = createNov2026SeedLedger();
      row = await prisma.sbsMonthlyLedger.create({
        data: {
          id: `ledger-${year}-${String(month).padStart(2, '0')}`,
          year,
          month,
          dailyEntries: seed.dailyEntries as any,
          salesByCode: seed.salesByCode as any,
          electricityOverrideFCFA: seed.electricityOverrideFCFA,
          rawMaterialStock: seed.rawMaterialStock as any,
          productStock: seed.productStock as any,
          rentalBookings: seed.rentalBookings as any,
          notes: seed.notes,
        },
      });
    } else {
      const products = await getSbsProducts();
      const salesByCode: Record<string, { qtySold: number; unitPriceFCFA: number | null }> = {};
      const productStock: Record<string, { opening: number; entries: number }> = {};
      for (const p of products) {
        if (p.hasFormulation) {
          salesByCode[p.code] = { qtySold: 0, unitPriceFCFA: p.sellingPriceFCFA };
          productStock[p.code] = { opening: 0, entries: 0 };
        }
      }
      row = await prisma.sbsMonthlyLedger.create({
        data: {
          id: `ledger-${year}-${String(month).padStart(2, '0')}`,
          year,
          month,
          dailyEntries: createEmptyDailyEntries() as any,
          salesByCode: salesByCode as any,
          electricityOverrideFCFA: null,
          rawMaterialStock: {
            ciment: { opening: 0, entries: 0 },
            sable: { opening: 0, entries: 0 },
            gravier_03: { opening: 0, entries: 0 },
            gravier_38: { opening: 0, entries: 0 },
          } as any,
          productStock: productStock as any,
          rentalBookings: [] as any,
          notes: '',
        },
      });
    }
  }

  return {
    id: row.id,
    year: row.year,
    month: row.month,
    dailyEntries: (row.dailyEntries as any) || createEmptyDailyEntries(),
    salesByCode: (row.salesByCode as any) || {},
    electricityOverrideFCFA: row.electricityOverrideFCFA,
    rawMaterialStock: (row.rawMaterialStock as any) || {},
    productStock: (row.productStock as any) || {},
    rentalBookings: (row.rentalBookings as any) || [],
    notes: row.notes,
  };
}

export async function recordSbsAudit(action: string, actor: string, details?: unknown, ipAddress?: string) {
  try {
    await prisma.sbsAuditLog.create({
      data: {
        id: `sbs-audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action,
        actor,
        details: (details ?? null) as any,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error('SbsAuditLog insert error:', err);
  }
}
