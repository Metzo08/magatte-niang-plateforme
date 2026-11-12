import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  getAuthenticatedEntityManager,
  getRequestIp,
  hashEntityPassword,
  verifyEntityPassword,
} from '@/lib/entityAuth';
import { ensureLogistikSeeded, recordLogistikAudit } from '@/lib/logistikBootstrap';

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
    console.error('Logistik admin workspace GET error:', err);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du workspace SB-S Logistik.' },
      { status: 500 }
    );
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
