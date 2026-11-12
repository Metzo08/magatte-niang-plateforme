import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { ensureP2mSeeded, recordP2mAudit } from '@/lib/p2mBootstrap';
import { getRequestIp } from '@/lib/entityAuth';

const p2mNeedSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  company: z.string().trim().max(150).optional().default(''),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().max(120).optional().default(''),
  city: z.string().trim().max(120).optional().default('Dakar'),
  notes: z.string().trim().max(2000).optional().default(''),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        sku: z.string().default('P2M'),
        name: z.string().min(1),
        category: z.string().optional().default('Matériau P2M'),
        qty: z.number().min(1).default(1),
        unit: z.string().optional().default('m²'),
        unitPrice: z.number().min(0).default(0),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    await ensureP2mSeeded();
    const body = await req.json();
    const parsed = p2mNeedSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Demande P2M invalide.' }, { status: 400 });
    }

    const d = parsed.data;
    const count = await prisma.p2mNeedExpression.count();
    const needNumber = `BES-P2M-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const need = await prisma.p2mNeedExpression.create({
      data: {
        id: `p2m-need-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        needNumber,
        clientName: d.clientName,
        company: d.company,
        phone: d.phone,
        email: d.email,
        city: d.city,
        items: d.items as any,
        notes: d.notes || null,
        status: 'Nouveau',
      },
    });

    await recordP2mAudit(
      'NEED_CREATED_PUBLIC',
      d.clientName,
      { needNumber, itemsCount: d.items.length },
      getRequestIp(req)
    );

    return NextResponse.json({ ok: true, need }, { status: 201 });
  } catch (err) {
    console.error('P2M public need POST error:', err);
    return NextResponse.json({ error: 'Erreur enregistrement besoin P2M.' }, { status: 500 });
  }
}
