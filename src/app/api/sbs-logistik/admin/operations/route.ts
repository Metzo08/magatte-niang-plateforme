import crypto from 'crypto';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedEntityManager, getRequestIp } from '@/lib/entityAuth';
import {
  ensureLogistikSeeded,
  nextSequentialCode,
  recordLogistikAudit,
} from '@/lib/logistikBootstrap';

interface QuoteItemInput {
  equipmentId?: string;
  code?: string;
  title: string;
  brand?: string;
  category?: string;
  qty: number;
  days: number;
  unitRateFCFA: number;
  lineTotalFCFA?: number;
}

function computeFinancials(
  items: QuoteItemInput[],
  transportFee = 0,
  operatorFee = 0,
  discountFCFA = 0,
  taxRate = 18
) {
  const normalized = items.map((i) => {
    const qty = Math.max(1, Number(i.qty) || 1);
    const days = Math.max(1, Number(i.days) || 1);
    const rate = Math.max(0, Number(i.unitRateFCFA) || 0);
    const lineTotal = qty * days * rate;
    return {
      equipmentId: i.equipmentId || '',
      code: i.code || 'MAT',
      title: i.title || 'Équipement',
      brand: i.brand || '',
      category: i.category || '',
      qty,
      days,
      unitRateFCFA: rate,
      lineTotalFCFA: lineTotal,
    };
  });

  const linesTotal = normalized.reduce((s, i) => s + i.lineTotalFCFA, 0);
  const subtotalHT = Math.max(
    0,
    linesTotal + Number(transportFee || 0) + Number(operatorFee || 0) - Number(discountFCFA || 0)
  );
  const totalTTC = Math.round(subtotalHT * (1 + Number(taxRate || 0) / 100));

  return { normalized, subtotalHT, totalTTC };
}

export async function POST(req: Request) {
  const manager = await getAuthenticatedEntityManager('sbs-logistik');
  if (!manager) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  try {
    await ensureLogistikSeeded();
    const body = await req.json();
    const { entity, action, payload } = body as {
      entity: string;
      action: string;
      payload: Record<string, any>;
    };
    const actor = manager.displayName || manager.username;
    const ip = getRequestIp(req);

    // 1. CLIENTS
    if (entity === 'client') {
      if (action === 'create') {
        const code = payload.code?.trim() || (await nextSequentialCode('CLI-LOG', 'client'));
        const client = await prisma.logistikClient.create({
          data: {
            id: `log-cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            code,
            identifier: payload.identifier || '',
            fullName: payload.fullName,
            company: payload.company || '',
            email: payload.email || '',
            phone: payload.phone,
            whatsapp: payload.whatsapp || payload.phone || '',
            address: payload.address || '',
            city: payload.city || 'Dakar',
            category: payload.category || 'Entreprise BTP',
            notes: payload.notes || null,
          },
        });
        await recordLogistikAudit('CLIENT_CREATED', manager.username, { code: client.code }, ip);
        return NextResponse.json({ client }, { status: 201 });
      }
      if (action === 'update') {
        const client = await prisma.logistikClient.update({
          where: { id: payload.id },
          data: {
            identifier: payload.identifier,
            fullName: payload.fullName,
            company: payload.company,
            email: payload.email,
            phone: payload.phone,
            whatsapp: payload.whatsapp,
            address: payload.address,
            city: payload.city,
            category: payload.category,
            notes: payload.notes,
          },
        });
        await recordLogistikAudit('CLIENT_UPDATED', manager.username, { code: client.code }, ip);
        return NextResponse.json({ client });
      }
      if (action === 'delete') {
        await prisma.logistikClient.delete({ where: { id: payload.id } });
        return NextResponse.json({ ok: true });
      }
    }

    // 2. EXPRESSIONS DE BESOINS LOGISTIK
    if (entity === 'need') {
      if (action === 'create') {
        const needNumber = await nextSequentialCode('BES-LOG', 'need');
        const need = await prisma.logistikNeedExpression.create({
          data: {
            id: `log-need-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            needNumber,
            clientCode: payload.clientCode || null,
            clientName: payload.clientName,
            company: payload.company || '',
            phone: payload.phone,
            whatsapp: payload.whatsapp || payload.phone || '',
            email: payload.email || '',
            siteLocation: payload.siteLocation || 'Dakar',
            startDate: payload.startDate || '',
            durationDays: Number(payload.durationDays) || 1,
            withOperator: Boolean(payload.withOperator ?? true),
            urgency: payload.urgency || 'Normale',
            items: (payload.items || []) as any,
            notes: payload.notes || null,
            status: payload.status || 'Nouveau',
            source: 'Saisie Gestionnaire',
            updatedBy: actor,
          },
        });
        await recordLogistikAudit('NEED_CREATED_ADMIN', manager.username, { needNumber }, ip);
        return NextResponse.json({ need }, { status: 201 });
      }
      if (action === 'updateStatus') {
        const need = await prisma.logistikNeedExpression.update({
          where: { id: payload.id },
          data: { status: payload.status, updatedBy: actor },
        });
        await recordLogistikAudit(
          'NEED_STATUS_UPDATED',
          manager.username,
          { needNumber: need.needNumber, status: need.status },
          ip
        );
        return NextResponse.json({ need });
      }
      if (action === 'convertNeedToQuote') {
        const need = await prisma.logistikNeedExpression.findUnique({ where: { id: payload.id } });
        if (!need) {
          return NextResponse.json({ error: 'Expression de besoin introuvable.' }, { status: 404 });
        }

        let client = need.clientCode
          ? await prisma.logistikClient.findUnique({ where: { code: need.clientCode } })
          : await prisma.logistikClient.findFirst({ where: { phone: need.phone } });

        if (!client) {
          const clientCode = await nextSequentialCode('CLI-LOG', 'client');
          client = await prisma.logistikClient.create({
            data: {
              id: `log-cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              code: clientCode,
              identifier: '',
              fullName: need.clientName,
              company: need.company,
              email: need.email,
              phone: need.phone,
              whatsapp: need.whatsapp || need.phone,
              address: need.siteLocation,
              city: need.siteLocation,
              category: need.company ? 'Entreprise BTP' : 'Particulier / Chantier',
              notes: `Créé automatiquement depuis ${need.needNumber}`,
            },
          });
        }

        const rawItems = Array.isArray(need.items) ? (need.items as any[]) : [];
        const { normalized, subtotalHT, totalTTC } = computeFinancials(
          rawItems.map((r) => ({
            equipmentId: r.equipmentId,
            code: r.code,
            title: r.title,
            brand: r.brand,
            category: r.category,
            qty: r.qty || 1,
            days: r.days || need.durationDays || 1,
            unitRateFCFA: r.dailyRateFCFA || r.unitRateFCFA || 0,
          })),
          0,
          0,
          0,
          18
        );

        const quoteNumber = await nextSequentialCode('DEV-LOG', 'quote');
        const quote = await prisma.logistikQuote.create({
          data: {
            id: `log-dev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            quoteNumber,
            needId: need.id,
            clientId: client.id,
            clientCode: client.code,
            clientName: client.fullName,
            clientCompany: client.company,
            clientPhone: client.phone,
            clientEmail: client.email,
            clientAddress: need.siteLocation || client.address,
            items: normalized as any,
            subtotalHT,
            taxRate: 18,
            totalTTC,
            status: 'Envoyé',
            validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
            notes: `Issu du besoin ${need.needNumber} · Chantier: ${need.siteLocation}`,
            createdBy: actor,
            updatedBy: actor,
          },
        });

        await prisma.logistikNeedExpression.update({
          where: { id: need.id },
          data: {
            status: 'Converti',
            clientCode: client.code,
            convertedQuoteId: quote.id,
            updatedBy: actor,
          },
        });

        await recordLogistikAudit(
          'NEED_CONVERTED_TO_QUOTE',
          manager.username,
          { needNumber: need.needNumber, quoteNumber },
          ip
        );
        return NextResponse.json({ quote, client }, { status: 201 });
      }
      if (action === 'delete') {
        await prisma.logistikNeedExpression.delete({ where: { id: payload.id } });
        return NextResponse.json({ ok: true });
      }
    }

    // 3. DEVIS LOGISTIK
    if (entity === 'quote') {
      if (action === 'create') {
        const quoteNumber = await nextSequentialCode('DEV-LOG', 'quote');
        const { normalized, subtotalHT, totalTTC } = computeFinancials(
          payload.items || [],
          payload.transportFee,
          payload.operatorFee,
          payload.discountFCFA,
          payload.taxRate ?? 18
        );
        const quote = await prisma.logistikQuote.create({
          data: {
            id: `log-dev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            quoteNumber,
            clientId: payload.clientId || null,
            clientCode: payload.clientCode || '',
            clientName: payload.clientName,
            clientCompany: payload.clientCompany || '',
            clientPhone: payload.clientPhone,
            clientEmail: payload.clientEmail || '',
            clientAddress: payload.clientAddress || 'Dakar',
            items: normalized as any,
            transportFee: Number(payload.transportFee) || 0,
            operatorFee: Number(payload.operatorFee) || 0,
            cautionAmount: Number(payload.cautionAmount) || 0,
            discountFCFA: Number(payload.discountFCFA) || 0,
            subtotalHT,
            taxRate: Number(payload.taxRate ?? 18),
            totalTTC,
            status: payload.status || 'Brouillon',
            validUntil: payload.validUntil || '',
            notes: payload.notes || null,
            createdBy: actor,
            updatedBy: actor,
          },
        });
        await recordLogistikAudit('QUOTE_CREATED', manager.username, { quoteNumber, totalTTC }, ip);
        return NextResponse.json({ quote }, { status: 201 });
      }
      if (action === 'updateStatus') {
        const quote = await prisma.logistikQuote.update({
          where: { id: payload.id },
          data: { status: payload.status, updatedBy: actor },
        });
        return NextResponse.json({ quote });
      }
      if (action === 'convertQuoteToInvoice') {
        const quote = await prisma.logistikQuote.findUnique({ where: { id: payload.id } });
        if (!quote) {
          return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 });
        }

        const invoiceNumber = await nextSequentialCode('FAC-LOG', 'invoice');
        const paymentToken = crypto.randomBytes(12).toString('hex');
        const invoice = await prisma.logistikInvoice.create({
          data: {
            id: `log-fac-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            invoiceNumber,
            quoteId: quote.id,
            clientId: quote.clientId,
            clientCode: quote.clientCode,
            clientName: quote.clientName,
            clientCompany: quote.clientCompany,
            clientPhone: quote.clientPhone,
            clientEmail: quote.clientEmail,
            clientAddress: quote.clientAddress,
            items: quote.items as any,
            subtotalHT: quote.subtotalHT,
            taxRate: quote.taxRate,
            totalTTC: quote.totalTTC,
            amountPaidFCFA: 0,
            balanceDueFCFA: quote.totalTTC,
            status: 'Émise',
            dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
            paymentToken,
            notes: quote.notes,
            updatedBy: actor,
          },
        });

        await prisma.logistikQuote.update({
          where: { id: quote.id },
          data: { status: 'Facturé', updatedBy: actor },
        });

        await recordLogistikAudit(
          'QUOTE_CONVERTED_TO_INVOICE',
          manager.username,
          { quoteNumber: quote.quoteNumber, invoiceNumber },
          ip
        );
        return NextResponse.json({ invoice }, { status: 201 });
      }
      if (action === 'delete') {
        await prisma.logistikQuote.delete({ where: { id: payload.id } });
        return NextResponse.json({ ok: true });
      }
    }

    // 4. FACTURES LOGISTIK
    if (entity === 'invoice') {
      if (action === 'create') {
        const invoiceNumber = await nextSequentialCode('FAC-LOG', 'invoice');
        const paymentToken = crypto.randomBytes(12).toString('hex');
        const { normalized, subtotalHT, totalTTC } = computeFinancials(
          payload.items || [],
          payload.transportFee || 0,
          payload.operatorFee || 0,
          payload.discountFCFA || 0,
          payload.taxRate ?? 18
        );
        const invoice = await prisma.logistikInvoice.create({
          data: {
            id: `log-fac-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            invoiceNumber,
            clientId: payload.clientId || null,
            clientCode: payload.clientCode || '',
            clientName: payload.clientName,
            clientCompany: payload.clientCompany || '',
            clientPhone: payload.clientPhone,
            clientEmail: payload.clientEmail || '',
            clientAddress: payload.clientAddress || 'Dakar',
            items: normalized as any,
            subtotalHT,
            taxRate: Number(payload.taxRate ?? 18),
            totalTTC,
            amountPaidFCFA: 0,
            balanceDueFCFA: totalTTC,
            status: 'Émise',
            dueDate: payload.dueDate || '',
            paymentToken,
            notes: payload.notes || null,
            updatedBy: actor,
          },
        });
        await recordLogistikAudit(
          'INVOICE_CREATED',
          manager.username,
          { invoiceNumber, totalTTC },
          ip
        );
        return NextResponse.json({ invoice }, { status: 201 });
      }
      if (action === 'updateStatus') {
        const invoice = await prisma.logistikInvoice.update({
          where: { id: payload.id },
          data: { status: payload.status, updatedBy: actor },
        });
        return NextResponse.json({ invoice });
      }
    }

    // 5. PAIEMENTS EN LIGNE / RÈGLEMENTS
    if (entity === 'payment' && action === 'record') {
      const invoice = await prisma.logistikInvoice.findUnique({
        where: { id: payload.invoiceId },
      });
      if (!invoice) {
        return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 });
      }
      const amount = Math.max(0, Number(payload.amountFCFA) || 0);
      if (amount <= 0) {
        return NextResponse.json({ error: 'Montant invalide.' }, { status: 400 });
      }

      const applied = Math.min(amount, invoice.balanceDueFCFA > 0 ? invoice.balanceDueFCFA : amount);
      const paymentRef = await nextSequentialCode('PAY-LOG', 'payment');

      const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.logistikPayment.create({
          data: {
            id: `log-pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            paymentRef,
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            method: payload.method || 'Wave',
            channel: payload.channel || 'Paiement en ligne',
            providerRef: payload.providerRef || '',
            amountFCFA: applied,
            status: 'Validé',
            recordedBy: actor,
            notes: payload.notes || null,
          },
        });

        const newPaid = invoice.amountPaidFCFA + applied;
        const newBalance = Math.max(0, invoice.totalTTC - newPaid);
        const newStatus = newBalance <= 0 ? 'Payée' : 'Partielle';

        const updatedInvoice = await tx.logistikInvoice.update({
          where: { id: invoice.id },
          data: {
            amountPaidFCFA: newPaid,
            balanceDueFCFA: newBalance,
            status: newStatus,
            updatedBy: actor,
          },
        });

        return { payment, updatedInvoice };
      });

      await recordLogistikAudit(
        'PAYMENT_RECORDED_ADMIN',
        manager.username,
        {
          paymentRef,
          invoiceNumber: invoice.invoiceNumber,
          method: payload.method,
          amountFCFA: applied,
        },
        ip
      );

      return NextResponse.json(result, { status: 201 });
    }

    // 6. SUIVI SAV & LOCATIONS
    if (entity === 'sav') {
      if (action === 'create') {
        const ticketNumber = await nextSequentialCode('SAV-LOG', 'sav');
        const log = await prisma.logistikAfterSalesLog.create({
          data: {
            id: `log-sav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            ticketNumber,
            equipmentId: payload.equipmentId || null,
            equipmentCode: payload.equipmentCode,
            equipmentTitle: payload.equipmentTitle,
            equipmentBrand: payload.equipmentBrand || '',
            clientId: payload.clientId || null,
            clientName: payload.clientName,
            clientPhone: payload.clientPhone || '',
            type: payload.type || 'Location active',
            priority: payload.priority || 'Normale',
            siteLocation: payload.siteLocation || 'Dakar',
            operatorName: payload.operatorName || '',
            startDate: payload.startDate || '',
            expectedReturnDate: payload.expectedReturnDate || '',
            actualReturnDate: payload.actualReturnDate || '',
            meterOut: payload.meterOut || '',
            meterIn: payload.meterIn || '',
            conditionNotes: payload.conditionNotes || '',
            actionTaken: payload.actionTaken || null,
            costFCFA: Number(payload.costFCFA) || 0,
            status: payload.status || 'En cours',
            updatedBy: actor,
          },
        });
        await recordLogistikAudit('SAV_CREATED', manager.username, { ticketNumber, type: log.type }, ip);
        return NextResponse.json({ sav: log }, { status: 201 });
      }
      if (action === 'update') {
        const log = await prisma.logistikAfterSalesLog.update({
          where: { id: payload.id },
          data: {
            type: payload.type,
            priority: payload.priority,
            status: payload.status,
            actualReturnDate: payload.actualReturnDate,
            meterIn: payload.meterIn,
            conditionNotes: payload.conditionNotes,
            actionTaken: payload.actionTaken,
            costFCFA: payload.costFCFA !== undefined ? Number(payload.costFCFA) : undefined,
            updatedBy: actor,
          },
        });
        await recordLogistikAudit('SAV_UPDATED', manager.username, { ticketNumber: log.ticketNumber }, ip);
        return NextResponse.json({ sav: log });
      }
      if (action === 'delete') {
        await prisma.logistikAfterSalesLog.delete({ where: { id: payload.id } });
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: 'Opération non reconnue.' }, { status: 400 });
  } catch (err) {
    console.error('Logistik operations POST error:', err);
    return NextResponse.json({ error: 'Erreur opérationnelle SB-S Logistik.' }, { status: 500 });
  }
}
