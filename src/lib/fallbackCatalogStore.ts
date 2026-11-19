import fs from 'fs';
import path from 'path';
import { PRODUCTS_P2M } from '@/data/initialData';
import { SBS_LOGISTIK_ITEMS } from '@/data/sbsLogistikData';
import { inferBrandFromItem, inferDailyRateFromItem } from '@/lib/logistikBootstrap';
import { DEFAULT_SBS_PRODUCTS, SbsProductItem } from '@/lib/sbsErpDefaults';

interface FallbackCatalogState {
  p2mProducts: any[];
  logistikEquipment: any[];
  sbsProducts: SbsProductItem[];
}

const TMP_FILE = path.join(
  process.env.TMPDIR || process.env.TEMP || '/tmp',
  'magatte-niang-fallback-catalog-v1.json'
);

const g = globalThis as unknown as { __magatteFallbackCatalog?: FallbackCatalogState };

function buildInitialLogistik(): any[] {
  return SBS_LOGISTIK_ITEMS.map((item, i) => {
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
      updatedBy: 'Parc Certifié SB-S Logistik',
      updatedAt: new Date().toISOString(),
    };
  });
}

function loadState(): FallbackCatalogState {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.p2mProducts) &&
        Array.isArray(parsed.logistikEquipment) &&
        Array.isArray(parsed.sbsProducts)
      ) {
        g.__magatteFallbackCatalog = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore read errors
  }

  if (!g.__magatteFallbackCatalog) {
    g.__magatteFallbackCatalog = {
      p2mProducts: structuredClone(PRODUCTS_P2M),
      logistikEquipment: buildInitialLogistik(),
      sbsProducts: structuredClone(DEFAULT_SBS_PRODUCTS),
    };
  }
  return g.__magatteFallbackCatalog;
}

function saveState(state: FallbackCatalogState): void {
  g.__magatteFallbackCatalog = state;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(state), 'utf8');
  } catch {
    // ignore write errors
  }
}

// ==================== 1. P2M PRODUCTS ====================
export function getFallbackP2mProducts(): any[] {
  return loadState().p2mProducts;
}

export function createFallbackP2mProduct(d: any): any {
  const state = loadState();
  const product = {
    id: `p2m-prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ref: String(d.ref || 'P2M-NEW').toUpperCase(),
    name: d.name,
    category: d.category,
    subCategory: d.subCategory || 'Standard',
    brand: d.brand,
    dimensions: d.dimensions || 'Standard',
    material: d.material || 'Grès Cérame',
    finish: d.finish || 'Mat / Poli',
    color: d.color || 'Neutre',
    usage: d.usage || 'Intérieur / Extérieur',
    unit: d.unit || 'm²',
    packaging: d.packaging || 'Carton / Palette',
    origin: d.origin || 'Importation',
    indicativePriceFCFA: Number(d.indicativePriceFCFA) || 0,
    isPriceVisible: d.isPriceVisible ?? true,
    availability: d.availability || 'En stock',
    leadTime: d.leadTime || 'Sous 48h',
    images: d.imageUrl ? [d.imageUrl] : ['/images/products/default.jpg'],
    specs: { Marque: d.brand, Dimensions: d.dimensions || 'Standard' },
  };
  state.p2mProducts = [product, ...state.p2mProducts];
  saveState(state);
  return product;
}

export function updateFallbackP2mProduct(body: any): any {
  const state = loadState();
  const idx = state.p2mProducts.findIndex((p) => p.id === body.id);
  if (idx === -1) throw new Error('Produit P2M introuvable.');
  const cur = state.p2mProducts[idx];
  const updated = {
    ...cur,
    ...(body.ref !== undefined && String(body.ref).trim()
      ? { ref: String(body.ref).trim().toUpperCase() }
      : {}),
    ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
    ...(body.category !== undefined ? { category: String(body.category).trim() } : {}),
    ...(body.brand !== undefined ? { brand: String(body.brand).trim() } : {}),
    ...(body.dimensions !== undefined ? { dimensions: String(body.dimensions).trim() } : {}),
    ...(body.indicativePriceFCFA !== undefined
      ? { indicativePriceFCFA: Number(body.indicativePriceFCFA) }
      : {}),
    ...(body.isPriceVisible !== undefined ? { isPriceVisible: Boolean(body.isPriceVisible) } : {}),
    ...(body.availability !== undefined ? { availability: String(body.availability).trim() } : {}),
    ...(body.leadTime !== undefined ? { leadTime: String(body.leadTime).trim() } : {}),
    ...(body.unit !== undefined ? { unit: String(body.unit).trim() } : {}),
    ...(body.imageUrl !== undefined
      ? { images: body.imageUrl ? [String(body.imageUrl).trim()] : [] }
      : {}),
  };
  state.p2mProducts[idx] = updated;
  saveState(state);
  return updated;
}

export function deleteFallbackP2mProduct(id: string): void {
  const state = loadState();
  state.p2mProducts = state.p2mProducts.filter((p) => p.id !== id);
  saveState(state);
}

// ==================== 2. SB-S LOGISTIK EQUIPMENT ====================
export function getFallbackLogistikEquipment(): any[] {
  return loadState().logistikEquipment;
}

export function createFallbackLogistikEquipment(d: any, actor: string): any {
  const state = loadState();
  const item = {
    id: `log-eq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    code: String(d.code || 'MAT-NEW').toUpperCase(),
    title: d.title,
    category: d.category,
    brand: d.brand,
    description: d.description || '',
    specs: d.specs || '',
    usage: d.usage || '',
    imageUrl: d.imageUrl || '/images/logistik/engin-default.jpg',
    dailyRateFCFA: Number(d.dailyRateFCFA) || 0,
    isPriceVisible: d.isPriceVisible ?? true,
    availability: d.availability || 'Disponible',
    isPublished: d.isPublished ?? true,
    sortOrder: state.logistikEquipment.length + 1,
    updatedBy: actor,
    updatedAt: new Date().toISOString(),
  };
  state.logistikEquipment = [item, ...state.logistikEquipment];
  saveState(state);
  return item;
}

export function updateFallbackLogistikEquipment(id: string, patch: any, actor: string): any {
  const state = loadState();
  const idx = state.logistikEquipment.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('Équipement Logistik introuvable.');
  const updated = {
    ...state.logistikEquipment[idx],
    ...patch,
    updatedBy: actor,
    updatedAt: new Date().toISOString(),
  };
  state.logistikEquipment[idx] = updated;
  saveState(state);
  return updated;
}

export function deleteFallbackLogistikEquipment(id: string): void {
  const state = loadState();
  state.logistikEquipment = state.logistikEquipment.filter((e) => e.id !== id);
  saveState(state);
}

// ==================== 3. SB-S INDUSTRIE PRODUCTS ====================
export function getFallbackSbsProducts(): SbsProductItem[] {
  return loadState().sbsProducts;
}

export function createFallbackSbsProduct(d: any): SbsProductItem {
  const state = loadState();
  const codeUpper = String(d.code || 'SBS-NEW').toUpperCase();
  const created: SbsProductItem = {
    id: `sbs-prod-${codeUpper.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
    code: codeUpper,
    family: d.family,
    name: d.name,
    dimensions: d.dimensions,
    lengthCm: d.lengthCm ?? null,
    widthCm: d.widthCm ?? null,
    heightCm: d.heightCm ?? null,
    unit: d.unit,
    sellingPriceFCFA: Number(d.sellingPriceFCFA) || 0,
    priceMaxFCFA: d.priceMaxFCFA ?? null,
    isPriceVisible: d.isPriceVisible ?? true,
    isPublished: d.isPublished ?? true,
    availability: d.availability || 'En stock',
    isRental: d.isRental ?? d.family === 'location',
    imageUrl: d.imageUrl ?? null,
    description: d.description ?? null,
    hasFormulation: d.hasFormulation ?? ['agglos-creux', 'agglos-pleins', 'hourdis'].includes(d.family),
    isSolidBlock: d.isSolidBlock ?? d.family === 'agglos-pleins',
    gravier38Brouettes: d.gravier38Brouettes ?? 1,
    gravier03Brouettes: d.gravier03Brouettes ?? 2.5,
    sableBrouettes: d.sableBrouettes ?? 0.5,
    eauLitres: d.eauLitres ?? 20,
    rendementPerSac: d.rendementPerSac ?? 24,
    volumeExtLitres: d.volumeExtLitres ?? 12,
    stockOpening: d.stockOpening ?? 0,
    sortOrder: d.sortOrder ?? state.sbsProducts.length + 1,
  };
  state.sbsProducts = [...state.sbsProducts, created];
  saveState(state);
  return created;
}

export function updateFallbackSbsProduct(d: any): SbsProductItem {
  const state = loadState();
  const idx = state.sbsProducts.findIndex((p) => p.id === d.id || p.code === d.code);
  if (idx === -1) throw new Error('Produit SBS Industrie introuvable.');
  const cur = state.sbsProducts[idx];
  const updated: SbsProductItem = {
    ...cur,
    code: String(d.code ?? cur.code).toUpperCase(),
    family: d.family ?? cur.family,
    name: d.name ?? cur.name,
    dimensions: d.dimensions ?? cur.dimensions,
    lengthCm: d.lengthCm !== undefined ? d.lengthCm : cur.lengthCm,
    widthCm: d.widthCm !== undefined ? d.widthCm : cur.widthCm,
    heightCm: d.heightCm !== undefined ? d.heightCm : cur.heightCm,
    unit: d.unit ?? cur.unit,
    sellingPriceFCFA: d.sellingPriceFCFA !== undefined ? Number(d.sellingPriceFCFA) : cur.sellingPriceFCFA,
    priceMaxFCFA: d.priceMaxFCFA !== undefined ? d.priceMaxFCFA : cur.priceMaxFCFA,
    isPriceVisible: d.isPriceVisible ?? cur.isPriceVisible,
    isPublished: d.isPublished ?? cur.isPublished,
    availability: d.availability ?? cur.availability,
    isRental: d.isRental ?? cur.isRental,
    imageUrl: d.imageUrl !== undefined ? d.imageUrl : cur.imageUrl,
    description: d.description !== undefined ? d.description : cur.description,
    hasFormulation: d.hasFormulation ?? cur.hasFormulation,
    isSolidBlock: d.isSolidBlock ?? cur.isSolidBlock,
    gravier38Brouettes: d.gravier38Brouettes ?? cur.gravier38Brouettes,
    gravier03Brouettes: d.gravier03Brouettes ?? cur.gravier03Brouettes,
    sableBrouettes: d.sableBrouettes ?? cur.sableBrouettes,
    eauLitres: d.eauLitres ?? cur.eauLitres,
    rendementPerSac: d.rendementPerSac ?? cur.rendementPerSac,
    volumeExtLitres: d.volumeExtLitres ?? cur.volumeExtLitres,
    stockOpening: d.stockOpening ?? cur.stockOpening,
    sortOrder: d.sortOrder ?? cur.sortOrder,
  };
  state.sbsProducts[idx] = updated;
  saveState(state);
  return updated;
}

export function deleteFallbackSbsProduct(id: string): SbsProductItem[] {
  const state = loadState();
  state.sbsProducts = state.sbsProducts.filter((p) => p.id !== id);
  saveState(state);
  return state.sbsProducts;
}
