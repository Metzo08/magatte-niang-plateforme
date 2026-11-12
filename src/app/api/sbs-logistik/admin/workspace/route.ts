import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  getAuthenticatedEntityManager,
  getRequestIp,
  hashEntityPassword,
  verifyEntityPassword,
} from '@/lib/entityAuth';
import {
  ensureLogistikSeeded,
  inferBrandFromItem,
  inferDailyRateFromItem,
  recordLogistikAudit,
} from '@/lib/logistikBootstrap';
import { SBS_LOGISTIK_ITEMS } from '@/data/sbsLogistikData';

export async function GET() {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (!manager) {
    return NextResponse.json(
      { error: 'Authentification SB-S Logistik requise.' },
      { status: 401 }
    );
  }

  try {
    await ensureLogistikSeeded();

    const [
      equipment,
      clients,
      needs,
      quotes,
      invoices,
      payments,
      afterSalesLogs,
      auditLogs,
    ] = await Promise.all([
      prisma.logistikEquipment.findMany({
        orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
      }),
      prisma.logistikClient.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.logistikNeedExpression.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.logistikQuote.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.logistikInvoice.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.logistikPayment.findMany({ orderBy: { paidAt: 'desc' } }),
      prisma.logistikAfterSalesLog.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.logistikAuditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 80 }),
    ]);

    return NextResponse.json({
      manager,
      equipment,
      clients,
      needs,
      quotes,
      invoices,
      payments,
      afterSalesLogs,
      auditLogs,
    });
  } catch (err) {
    console.error('Logistik admin workspace GET error (fallback mode):', err);
    const fallbackEquipment = SBS_LOGISTIK_ITEMS.map((item, i) => {
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
        sortOrder: i + 1,
        updatedBy: 'Système (Mode hors-ligne)',
      };
    });
    return NextResponse.json({
      manager,
      equipment: fallbackEquipment,
      clients: [],
      needs: [],
      quotes: [],
      invoices: [],
      payments: [],
      afterSalesLogs: [],
      auditLogs: [],
      dbOfflineMode: true,
    });
  }
}

const pwdSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(120),
});

export async function PUT(req: Request) {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = pwdSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Mot de passe invalide (minimum 8 caractères).' },
        { status: 400 }
      );
    }

    const account = await prisma.entityManagerAccount.findUnique({
      where: { id: manager.sub },
    });
    if (!account || !verifyEntityPassword(parsed.data.currentPassword, account.passwordHash)) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect.' },
        { status: 400 }
      );
    }

    await prisma.entityManagerAccount.update({
      where: { id: account.id },
      data: { passwordHash: hashEntityPassword(parsed.data.newPassword) },
    });

    await recordLogistikAudit(
      'PASSWORD_CHANGED',
      manager.username,
      { entityId: 'sbs-logistik' },
      getRequestIp(req)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Logistik password PUT error:', err);
    return NextResponse.json({ error: 'Erreur mise à jour mot de passe.' }, { status: 500 });
  }
}
