import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  ensureLogistikSeeded,
  nextSequentialCode,
  recordLogistikAudit,
} from '@/lib/logistikBootstrap';
import { getRequestIp } from '@/lib/entityAuth';

const paySchema = z.object({
  token: z.string().trim().min(6),
  method: z.enum(['Wave', 'Orange Money', 'Carte Bancaire', 'Virement']),
  amountFCFA: z.number().positive(),
  payerPhoneOrRef: z.string().trim().min(3).max(120),
});

export async function GET(req: Request) {
  try {
    await ensureLogistikSeeded();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token')?.trim();
    if (!token) {
      return NextResponse.json({ error: 'Jeton de paiement manquant.' }, { status: 400 });
    }

    const invoice = await prisma.logistikInvoice.findUnique({
      where: { paymentToken: token },
    });
    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable pour ce lien.' }, { status: 404 });
    }

    const payments = await prisma.logistikPayment.findMany({
      where: { invoiceId: invoice.id },
      orderBy: { paidAt: 'desc' },
    });

    return NextResponse.json({ invoice, payments });
  } catch (err) {
    console.error('Logistik public pay GET error:', err);
    return NextResponse.json({ error: 'Erreur chargement facture.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureLogistikSeeded();
    const body = await req.json();
    const parsed = paySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Paramètres de paiement invalides.' }, { status: 400 });
    }

    const d = parsed.data;
    const invoice = await prisma.logistikInvoice.findUnique({
      where: { paymentToken: d.token },
    });
    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 });
    }
    if (invoice.status === 'Annulée') {
      return NextResponse.json({ error: 'Cette facture a été annulée.' }, { status: 400 });
    }
    if (invoice.balanceDueFCFA <= 0) {
      return NextResponse.json({ error: 'Cette facture est déjà intégralement soldée.' }, { status: 400 });
    }

    const appliedAmount = Math.min(d.amountFCFA, invoice.balanceDueFCFA);
    const paymentRef = await nextSequentialCode('PAY-LOG', 'payment');

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.logistikPayment.create({
        data: {
          id: `log-pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          paymentRef,
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.clientName,
          method: d.method,
          channel: 'Portail Paiement en ligne',
          providerRef: d.payerPhoneOrRef,
          amountFCFA: appliedAmount,
          status: 'Validé',
          recordedBy: `Client en ligne (${d.method})`,
          notes: `Paiement en ligne via lien sécurisé (${d.payerPhoneOrRef})`,
        },
      });

      const newPaid = invoice.amountPaidFCFA + appliedAmount;
      const newBalance = Math.max(0, invoice.totalTTC - newPaid);
      const newStatus = newBalance <= 0 ? 'Payée' : 'Partielle';

      const updatedInvoice = await tx.logistikInvoice.update({
        where: { id: invoice.id },
        data: {
          amountPaidFCFA: newPaid,
          balanceDueFCFA: newBalance,
          status: newStatus,
          updatedBy: 'Portail Paiement en ligne',
        },
      });

      return { payment, updatedInvoice };
    });

    await recordLogistikAudit(
      'ONLINE_PAYMENT_COMPLETED',
      invoice.clientName,
      {
        invoiceNumber: invoice.invoiceNumber,
        paymentRef,
        method: d.method,
        amountFCFA: appliedAmount,
      },
      getRequestIp(req)
    );

    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (err) {
    console.error('Logistik public pay POST error:', err);
    return NextResponse.json({ error: 'Erreur lors du traitement du paiement.' }, { status: 500 });
  }
}
