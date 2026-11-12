import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  getAuthenticatedEntityManager,
  getRequestIp,
  hashEntityPassword,
  verifyEntityPassword,
} from '@/lib/entityAuth';
import { ensureP2mSeeded, recordP2mAudit } from '@/lib/p2mBootstrap';
import { PRODUCTS_P2M } from '@/data/initialData';

export async function GET() {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (!manager) {
    return NextResponse.json({ error: 'Authentification P2M requise.' }, { status: 401 });
  }

  try {
    await ensureP2mSeeded();
    const [products, clients, needs, ordersInvoices, auditLogs] = await Promise.all([
      prisma.product.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.p2mClient.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.p2mNeedExpression.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.p2mOrderInvoice.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.p2mAuditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 80 }),
    ]);

    return NextResponse.json({
      manager,
      products,
      clients,
      needs,
      ordersInvoices,
      auditLogs,
    });
  } catch (err) {
    console.error('P2M workspace GET error (fallback mode):', err);
    return NextResponse.json({
      manager,
      products: PRODUCTS_P2M,
      clients: [],
      needs: [],
      ordersInvoices: [],
      auditLogs: [],
      dbOfflineMode: true,
    });
  }
}

export async function POST(req: Request) {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    await ensureP2mSeeded();
    const body = await req.json();
    const { entity, action, payload } = body as {
      entity: string;
      action: string;
      payload: Record<string, any>;
    };
    const actor = manager.displayName || manager.username;
    const ip = getRequestIp(req);

    if (entity === 'client') {
      if (action === 'create') {
        const count = await prisma.p2mClient.count();
        const code = payload.code?.trim() || `CLI-P2M-${String(count + 1).padStart(4, '0')}`;
        const client = await prisma.p2mClient.create({
          data: {
            id: `p2m-cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            code,
            identifier: payload.identifier || '',
            fullName: payload.fullName,
            company: payload.company || '',
            phone: payload.phone,
            email: payload.email || '',
            address: payload.address || '',
            city: payload.city || 'Dakar',
            notes: payload.notes || null,
          },
        });
        await recordP2mAudit('CLIENT_CREATED', manager.username, { code }, ip);
        return NextResponse.json({ client }, { status: 201 });
      }
      if (action === 'delete') {
        await prisma.p2mClient.delete({ where: { id: payload.id } });
        return NextResponse.json({ ok: true });
      }
    }

    if (entity === 'need') {
      if (action === 'updateStatus') {
        const need = await prisma.p2mNeedExpression.update({
          where: { id: payload.id },
          data: { status: payload.status },
        });
        await recordP2mAudit('NEED_STATUS_UPDATED', manager.username, { needNumber: need.needNumber, status: need.status }, ip);
        return NextResponse.json({ need });
      }
      if (action === 'convertToDoc') {
        const need = await prisma.p2mNeedExpression.findUnique({ where: { id: payload.id } });
        if (!need) {
          return NextResponse.json({ error: 'Besoin introuvable.' }, { status: 404 });
        }

        const rawItems = Array.isArray(need.items) ? (need.items as any[]) : [];
        const subtotalHT = rawItems.reduce(
          (sum, it) => sum + (Number(it.qty) || 1) * (Number(it.unitPrice) || 0),
          0
        );
        const totalTTC = Math.round(subtotalHT * 1.18);
        const count = await prisma.p2mOrderInvoice.count();
        const docType = payload.docType === 'Facture' ? 'Facture' : 'Devis';
        const prefix = docType === 'Facture' ? 'FAC-P2M' : 'DEV-P2M';
        const docNumber = `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        const doc = await prisma.p2mOrderInvoice.create({
          data: {
            id: `p2m-doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            docNumber,
            docType,
            clientName: need.clientName,
            clientCompany: need.company,
            clientPhone: need.phone,
            clientEmail: need.email,
            items: rawItems as any,
            subtotalHT,
            taxRate: 18,
            totalTTC,
            amountPaidFCFA: 0,
            status: 'Émise',
            notes: `Issu du besoin ${need.needNumber}`,
            updatedBy: actor,
          },
        });

        await prisma.p2mNeedExpression.update({
          where: { id: need.id },
          data: { status: 'Converti' },
        });

        await recordP2mAudit('NEED_CONVERTED', manager.username, { needNumber: need.needNumber, docNumber }, ip);
        return NextResponse.json({ doc }, { status: 201 });
      }
    }

    if (entity === 'doc') {
      if (action === 'create') {
        const count = await prisma.p2mOrderInvoice.count();
        const docType = payload.docType === 'Facture' ? 'Facture' : 'Devis';
        const prefix = docType === 'Facture' ? 'FAC-P2M' : 'DEV-P2M';
        const docNumber = `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        const items = Array.isArray(payload.items) ? payload.items : [];
        const subtotalHT = Math.max(
          0,
          items.reduce((s: number, i: any) => s + (Number(i.qty) || 1) * (Number(i.unitPrice) || 0), 0) -
            (Number(payload.discountFCFA) || 0)
        );
        const taxRate = Number(payload.taxRate ?? 18);
        const totalTTC = Math.round(subtotalHT * (1 + taxRate / 100));

        const doc = await prisma.p2mOrderInvoice.create({
          data: {
            id: `p2m-doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            docNumber,
            docType,
            clientCode: payload.clientCode || '',
            clientName: payload.clientName,
            clientCompany: payload.clientCompany || '',
            clientPhone: payload.clientPhone,
            clientEmail: payload.clientEmail || '',
            items: items as any,
            subtotalHT,
            discountFCFA: Number(payload.discountFCFA) || 0,
            taxRate,
            totalTTC,
            amountPaidFCFA: 0,
            status: 'Émise',
            notes: payload.notes || null,
            updatedBy: actor,
          },
        });
        await recordP2mAudit('DOC_CREATED', manager.username, { docNumber, totalTTC }, ip);
        return NextResponse.json({ doc }, { status: 201 });
      }
      if (action === 'recordPayment') {
        const existing = await prisma.p2mOrderInvoice.findUnique({ where: { id: payload.id } });
        if (!existing) {
          return NextResponse.json({ error: 'Document introuvable.' }, { status: 404 });
        }
        const newPaid = existing.amountPaidFCFA + Math.max(0, Number(payload.amountFCFA) || 0);
        const status = newPaid >= existing.totalTTC ? 'Payée' : 'Partielle';
        const doc = await prisma.p2mOrderInvoice.update({
          where: { id: existing.id },
          data: {
            docType: 'Facture',
            amountPaidFCFA: newPaid,
            paymentMethod: payload.paymentMethod || 'Wave',
            paymentRef: payload.paymentRef || '',
            status,
            updatedBy: actor,
          },
        });
        await recordP2mAudit(
          'PAYMENT_RECORDED',
          manager.username,
          { docNumber: doc.docNumber, amountFCFA: payload.amountFCFA, method: payload.paymentMethod },
          ip
        );
        return NextResponse.json({ doc });
      }
      if (action === 'delete') {
        await prisma.p2mOrderInvoice.delete({ where: { id: payload.id } });
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: 'Opération P2M invalide.' }, { status: 400 });
  } catch (err) {
    console.error('P2M operations POST error:', err);
    return NextResponse.json({ error: 'Erreur opérationnelle P2M.' }, { status: 500 });
  }
}

const pwdSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(120),
});

export async function PUT(req: Request) {
  const manager = await getAuthenticatedEntityManager('p2m');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = pwdSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Mot de passe invalide (min 8 caractères).' }, { status: 400 });
    }

    const account = await prisma.entityManagerAccount.findUnique({ where: { id: manager.sub } });
    if (!account || !verifyEntityPassword(parsed.data.currentPassword, account.passwordHash)) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 });
    }

    await prisma.entityManagerAccount.update({
      where: { id: account.id },
      data: { passwordHash: hashEntityPassword(parsed.data.newPassword) },
    });

    await recordP2mAudit('PASSWORD_CHANGED', manager.username, {}, getRequestIp(req));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('P2M password PUT error:', err);
    return NextResponse.json({ error: 'Erreur mise à jour mot de passe.' }, { status: 500 });
  }
}
