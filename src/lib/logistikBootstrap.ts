import prisma from '@/lib/db';
import { ensureEntityManagerAccount } from '@/lib/entityAuth';
import { SBS_LOGISTIK_ITEMS, SbsLogistikEquipmentItem } from '@/data/sbsLogistikData';

let seedPromise: Promise<void> | null = null;

const KNOWN_BRANDS = [
  'Samsung',
  'Sinotruk HOWO',
  'HOWO',
  'Renault',
  'TATA',
  'Aquarius',
  'TeknoMac',
  'Caterpillar',
  'CAT',
  'Komatsu',
  'JCB',
  'Potain',
  'Liebherr',
  'Bomag',
  'Dynapac',
  'Atlas Copco',
  'Perkins',
  'SDMO',
  'Putzmeister',
  'Schwing',
  'Wacker Neuson',
  'Honda',
  'Hilti',
  'Makita',
  'Bosch',
  'Stihl',
  'Mercedes-Benz',
  'Volvo',
  'Manitou',
  'Toyota',
  'Isuzu',
  'Mitsubishi',
  'Hyundai',
  'Doosan',
  'Case',
];

export function inferBrandFromItem(item: SbsLogistikEquipmentItem): string {
  const hay = `${item.title} ${item.description} ${item.specs}`;
  for (const b of KNOWN_BRANDS) {
    if (hay.toLowerCase().includes(b.toLowerCase())) {
      if (b === 'HOWO') return 'Sinotruk HOWO';
      if (b === 'CAT') return 'Caterpillar (CAT)';
      return b;
    }
  }
  const catLower = item.category.toLowerCase();
  if (catLower.includes('levage')) return 'Potain / Samsung';
  if (catLower.includes('transport')) return 'Sinotruk / Renault';
  if (catLower.includes('terrassement')) return 'Caterpillar / JCB';
  if (catLower.includes('béton')) return 'Aquarius / TeknoMac';
  if (catLower.includes('énergie')) return 'Atlas Copco / Perkins';
  if (catLower.includes('préfabrication')) return 'TeknoMac / QT40';
  return 'SBS Sélection Pro';
}

export function inferDailyRateFromItem(item: SbsLogistikEquipmentItem): {
  dailyRateFCFA: number;
  isPriceVisible: boolean;
} {
  const t = item.title.toLowerCase();
  if (t.includes('50 tonnes') || t.includes('grue mobile')) {
    return { dailyRateFCFA: 500000, isPriceVisible: true };
  }
  if (t.includes('camion-grue') || t.includes('6 tonnes')) {
    return { dailyRateFCFA: 100000, isPriceVisible: true };
  }
  if (t.includes('tractopelle')) {
    return { dailyRateFCFA: 120000, isPriceVisible: true };
  }
  if (t.includes('40 tonnes') || t.includes('semi-remorque') || t.includes('benne')) {
    return { dailyRateFCFA: 180000, isPriceVisible: true };
  }
  if (t.includes('toupie') || t.includes('malaxeur')) {
    return { dailyRateFCFA: 150000, isPriceVisible: true };
  }
  if (t.includes('pompe à béton') || t.includes('aquarius')) {
    return { dailyRateFCFA: 220000, isPriceVisible: true };
  }
  if (t.includes('compacteur') || t.includes('rouleau')) {
    return { dailyRateFCFA: 110000, isPriceVisible: true };
  }
  if (t.includes('groupe électrogène')) {
    return { dailyRateFCFA: 75000, isPriceVisible: true };
  }
  if (t.includes('nacelle') || t.includes('chariot')) {
    return { dailyRateFCFA: 130000, isPriceVisible: true };
  }
  if (t.includes('plateau') || t.includes('4x4') || t.includes('pick-up')) {
    return { dailyRateFCFA: 65000, isPriceVisible: true };
  }
  return { dailyRateFCFA: 0, isPriceVisible: false };
}

export async function ensureLogistikSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runLogistikSeed().finally(() => {
      seedPromise = null;
    });
  }
  return seedPromise;
}

async function runLogistikSeed(): Promise<void> {
  await ensureEntityManagerAccount('sbs-logistik');

  // Les équipements SBS-IND-* appartiennent à SBS Industrie et non à SBS Logistik
  await prisma.logistikEquipment.deleteMany({
    where: {
      OR: [
        { code: { startsWith: 'SBS-IND-' } },
        { category: 'Préfabrication & centrale à béton' },
      ],
    },
  });

  const existingRows = await prisma.logistikEquipment.findMany({ select: { code: true } });
  const existingCodes = new Set(existingRows.map((r) => r.code));
  const deleteCount = await prisma.logistikAuditLog.count({
    where: { action: 'EQUIPMENT_DELETE' },
  });

  if (existingCodes.size === 0 || deleteCount === 0) {
    for (let i = 0; i < SBS_LOGISTIK_ITEMS.length; i++) {
      const item = SBS_LOGISTIK_ITEMS[i];
      if (existingCodes.has(item.code)) continue;
      const pricing = inferDailyRateFromItem(item);
      await prisma.logistikEquipment.upsert({
        where: { code: item.code },
        create: {
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
          updatedBy: 'Système (Initialisation)',
        },
        update: {},
      });
    }
  }

  // Client de référence initial pour démontrer le format CLI-LOG-0001
  const clientCount = await prisma.logistikClient.count();
  if (clientCount === 0) {
    await prisma.logistikClient.create({
      data: {
        id: 'log-cli-0001',
        code: 'CLI-LOG-0001',
        identifier: 'NINEA-004819204-2G3',
        fullName: 'Direction Technique Chantiers Groupe',
        company: 'Consortium Infrastructures Dakar',
        email: 'logistique@cid-senegal.sn',
        phone: '+221 77 550 88 12',
        whatsapp: '+221 77 550 88 12',
        address: 'Zone Industrielle Diamniadio, Lot 14',
        city: 'Diamniadio',
        category: 'Entreprise BTP',
        notes: 'Client compte clé — locations grues mobiles & camions bennes 40T.',
      },
    });
  }
}

export async function recordLogistikAudit(
  action: string,
  actor: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  try {
    await prisma.logistikAuditLog.create({
      data: {
        id: `log-audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action,
        actor,
        details: (details ?? {}) as any,
        ipAddress: ipAddress ?? null,
      },
    });
  } catch (err) {
    console.error('Logistik audit error:', err);
  }
}

export async function nextSequentialCode(
  prefix: string,
  model: 'client' | 'need' | 'quote' | 'invoice' | 'payment' | 'sav'
): Promise<string> {
  const year = new Date().getFullYear();
  let count = 0;
  if (model === 'client') count = await prisma.logistikClient.count();
  if (model === 'need') count = await prisma.logistikNeedExpression.count();
  if (model === 'quote') count = await prisma.logistikQuote.count();
  if (model === 'invoice') count = await prisma.logistikInvoice.count();
  if (model === 'payment') count = await prisma.logistikPayment.count();
  if (model === 'sav') count = await prisma.logistikAfterSalesLog.count();

  const seq = String(count + 1).padStart(4, '0');
  if (model === 'client') return `${prefix}-${seq}`;
  return `${prefix}-${year}-${seq}`;
}
