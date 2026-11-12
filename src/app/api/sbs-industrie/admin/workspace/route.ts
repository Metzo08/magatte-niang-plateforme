import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  getAuthenticatedSbsManager,
  getClientIp,
  hashSbsPassword,
  verifySbsPassword,
} from '@/lib/sbsAuth';
import {
  getOrCreateSbsLedger,
  getSbsConfig,
  getSbsProducts,
  recordSbsAudit,
} from '@/lib/sbsDbBootstrap';
import { computeSbsErp } from '@/lib/sbsErpCalc';
import { SbsFactoryConfigData, SbsMonthlyLedgerData } from '@/lib/sbsErpDefaults';

const putWorkspaceSchema = z.object({
  year: z.number().int().min(2024).max(2040).optional(),
  month: z.number().int().min(1).max(12).optional(),
  config: z.any().optional(),
  ledger: z.any().optional(),
  passwordChange: z
    .object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(10, 'Le nouveau mot de passe doit contenir au moins 10 caractères.'),
    })
    .optional(),
});

export async function GET(req: NextRequest) {
  const manager = await getAuthenticatedSbsManager();
  if (!manager) {
    return NextResponse.json(
      { error: 'Accès non autorisé. Réservé exclusivement au gestionnaire SBS Industrie.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const year = Math.min(2040, Math.max(2024, Number(searchParams.get('year')) || 2026));
    const month = Math.min(12, Math.max(1, Number(searchParams.get('month')) || 11));

    const [config, products, ledger, periods, auditLogs] = await Promise.all([
      getSbsConfig(),
      getSbsProducts(),
      getOrCreateSbsLedger(year, month),
      prisma.sbsMonthlyLedger.findMany({
        select: { year: true, month: true },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      }),
      prisma.sbsAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 25,
      }),
    ]);

    const computed = computeSbsErp(config, products, ledger);

    return NextResponse.json({
      manager,
      config,
      products,
      ledger,
      computed,
      availablePeriods: periods,
      auditLogs,
    });
  } catch (err) {
    console.error('SBS Admin Workspace GET error:', err);
    return NextResponse.json({ error: 'Erreur lors du chargement de l’ERP SBS Industrie.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const manager = await getAuthenticatedSbsManager();
  if (!manager) {
    return NextResponse.json(
      { error: 'Accès non autorisé. Réservé exclusivement au gestionnaire SBS Industrie.' },
      { status: 401 }
    );
  }

  const ip = getClientIp(req);

  try {
    const body = await req.json();
    const parsed = putWorkspaceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Données invalides.' },
        { status: 400 }
      );
    }

    const { config: cfgPatch, ledger: ledgerPatch, passwordChange } = parsed.data;
    const year = parsed.data.year ?? 2026;
    const month = parsed.data.month ?? 11;

    if (passwordChange) {
      const account = await prisma.sbsManagerAccount.findUnique({ where: { id: manager.sub } });
      if (!account || !verifySbsPassword(passwordChange.currentPassword, account.passwordHash)) {
        await recordSbsAudit('PASSWORD_CHANGE_FAILED', manager.username, {}, ip);
        return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 });
      }
      await prisma.sbsManagerAccount.update({
        where: { id: account.id },
        data: { passwordHash: hashSbsPassword(passwordChange.newPassword) },
      });
      await recordSbsAudit('PASSWORD_CHANGED', manager.username, {}, ip);
      return NextResponse.json({ ok: true, message: 'Mot de passe gestionnaire mis à jour.' });
    }

    if (cfgPatch) {
      const c = cfgPatch as Partial<SbsFactoryConfigData>;
      await prisma.sbsFactoryConfig.update({
        where: { id: 'default' },
        data: {
          companyName: c.companyName,
          phone: c.phone,
          whatsapp: c.whatsapp,
          address: c.address,
          deliveryZone: c.deliveryZone,
          rawMaterials: c.rawMaterials as any,
          wheelbarrowVolumeL: c.wheelbarrowVolumeL != null ? Number(c.wheelbarrowVolumeL) : undefined,
          freshConcreteDensityKgM3:
            c.freshConcreteDensityKgM3 != null ? Number(c.freshConcreteDensityKgM3) : undefined,
          fixedCharges: c.fixedCharges as any,
          depreciations: c.depreciations as any,
          fixedPayroll: c.fixedPayroll as any,
          modPerCementTonFCFA: c.modPerCementTonFCFA != null ? Number(c.modPerCementTonFCFA) : undefined,
          electricityRatePercent:
            c.electricityRatePercent != null ? Number(c.electricityRatePercent) : undefined,
          tvaRatePercent: c.tvaRatePercent != null ? Number(c.tvaRatePercent) : undefined,
          kpiTargets: c.kpiTargets as any,
        },
      });
      await recordSbsAudit('CONFIG_UPDATED', manager.username, { fields: Object.keys(c) }, ip);
    }

    if (ledgerPatch) {
      const existing = await getOrCreateSbsLedger(year, month);
      const l = ledgerPatch as Partial<SbsMonthlyLedgerData>;
      await prisma.sbsMonthlyLedger.update({
        where: { id: existing.id },
        data: {
          dailyEntries: (l.dailyEntries ?? existing.dailyEntries) as any,
          salesByCode: (l.salesByCode ?? existing.salesByCode) as any,
          electricityOverrideFCFA:
            l.electricityOverrideFCFA !== undefined ? l.electricityOverrideFCFA : existing.electricityOverrideFCFA,
          rawMaterialStock: (l.rawMaterialStock ?? existing.rawMaterialStock) as any,
          productStock: (l.productStock ?? existing.productStock) as any,
          rentalBookings: (l.rentalBookings ?? existing.rentalBookings) as any,
          notes: l.notes !== undefined ? l.notes : existing.notes,
        },
      });
      await recordSbsAudit('LEDGER_UPDATED', manager.username, { year, month }, ip);
    }

    const [updatedConfig, updatedProducts, updatedLedger] = await Promise.all([
      getSbsConfig(),
      getSbsProducts(),
      getOrCreateSbsLedger(year, month),
    ]);
    const computed = computeSbsErp(updatedConfig, updatedProducts, updatedLedger);

    return NextResponse.json({
      ok: true,
      config: updatedConfig,
      products: updatedProducts,
      ledger: updatedLedger,
      computed,
    });
  } catch (err) {
    console.error('SBS Admin Workspace PUT error:', err);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde.' }, { status: 500 });
  }
}
