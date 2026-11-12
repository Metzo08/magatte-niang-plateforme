import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import {
  ensureLogistikSeeded,
  nextSequentialCode,
  recordLogistikAudit,
} from '@/lib/logistikBootstrap';
import { getRequestIp } from '@/lib/entityAuth';

const needItemSchema = z.object({
  equipmentId: z.string().optional(),
  code: z.string().default('MAT-CUSTOM'),
  title: z.string().min(1),
  brand: z.string().optional().default('Standard Industriel'),
  category: z.string().optional().default('Location matériel'),
  qty: z.number().int().min(1).max(500).default(1),
  days: z.number().int().min(1).max(365).default(1),
  dailyRateFCFA: z.number().min(0).default(0),
});

const publicNeedSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  company: z.string().trim().max(150).optional().default(''),
  phone: z.string().trim().min(6).max(40),
  whatsapp: z.string().trim().max(40).optional().default(''),
  email: z.string().trim().max(120).optional().default(''),
  siteLocation: z.string().trim().max(200).optional().default('Dakar'),
  startDate: z.string().trim().max(40).optional().default(''),
  durationDays: z.number().int().min(1).max(365).optional().default(1),
  withOperator: z.boolean().optional().default(true),
  urgency: z.enum(['Normale', 'Urgente', 'Planifiée']).optional().default('Normale'),
  items: z.array(needItemSchema).min(1),
  notes: z.string().trim().max(2000).optional().default(''),
  source: z.string().trim().max(80).optional().default('Panier SBS Logistik'),
});

export async function POST(req: Request) {
  try {
    await ensureLogistikSeeded();

    const body = await req.json();
    const parsed = publicNeedSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données d’expression de besoin invalides.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const existingClient = await prisma.logistikClient.findFirst({
      where: { phone: d.phone },
    });

    const needNumber = await nextSequentialCode('BES-LOG', 'need');
    const need = await prisma.logistikNeedExpression.create({
      data: {
        id: `log-need-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        needNumber,
        clientCode: existingClient?.code ?? null,
        clientName: d.clientName,
        company: d.company,
        phone: d.phone,
        whatsapp: d.whatsapp || d.phone,
        email: d.email,
        siteLocation: d.siteLocation,
        startDate: d.startDate,
        durationDays: d.durationDays,
        withOperator: d.withOperator,
        urgency: d.urgency,
        items: d.items as any,
        notes: d.notes || null,
        status: 'Nouveau',
        source: d.source,
        updatedBy: 'Client Public',
      },
    });

    await recordLogistikAudit(
      'NEED_CREATED_PUBLIC',
      d.clientName,
      { needNumber, itemsCount: d.items.length, siteLocation: d.siteLocation },
      getRequestIp(req)
    );

    return NextResponse.json({ ok: true, need }, { status: 201 });
  } catch (err) {
    console.error('SBS Logistik public need POST error:', err);
    return NextResponse.json(
      { error: 'Impossible d’enregistrer votre expression de besoin.' },
      { status: 500 }
    );
  }
}
