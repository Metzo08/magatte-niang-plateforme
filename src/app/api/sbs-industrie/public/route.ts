import { NextResponse } from 'next/server';
import { getSbsConfig, getSbsProducts } from '@/lib/sbsDbBootstrap';
import { DEFAULT_SBS_CONFIG, DEFAULT_SBS_PRODUCTS } from '@/lib/sbsErpDefaults';

/**
 * Endpoint PUBLIC SBS Industrie — Expose uniquement le catalogue commercial,
 * les dimensions, prix publics et offres de location.
 * Aucune donnée interne (prix de revient, MCV, paie, charges fixes) n'est jamais exposée.
 */
export async function GET() {
  try {
    const [config, products] = await Promise.all([getSbsConfig(), getSbsProducts()]);
    const publicProducts = products
      .filter((p) => p.isPublished)
      .map((p) => ({
        id: p.id,
        code: p.code,
        family: p.family,
        name: p.name,
        dimensions: p.dimensions,
        lengthCm: p.lengthCm,
        widthCm: p.widthCm,
        heightCm: p.heightCm,
        unit: p.unit,
        sellingPriceFCFA: p.isPriceVisible ? p.sellingPriceFCFA : null,
        priceMaxFCFA: p.isPriceVisible ? p.priceMaxFCFA : null,
        isPriceVisible: p.isPriceVisible,
        availability: p.availability,
        isRental: p.isRental,
        imageUrl: p.imageUrl,
        description: p.description,
        sortOrder: p.sortOrder,
      }));

    return NextResponse.json({
      company: {
        name: config.companyName,
        phone: config.phone,
        whatsapp: config.whatsapp,
        address: config.address,
        deliveryZone: config.deliveryZone,
      },
      products: publicProducts,
    });
  } catch (err) {
    console.error('SBS Public GET error, using static fallback:', err);
    return NextResponse.json({
      company: {
        name: DEFAULT_SBS_CONFIG.companyName,
        phone: DEFAULT_SBS_CONFIG.phone,
        whatsapp: DEFAULT_SBS_CONFIG.whatsapp,
        address: DEFAULT_SBS_CONFIG.address,
        deliveryZone: DEFAULT_SBS_CONFIG.deliveryZone,
      },
      products: DEFAULT_SBS_PRODUCTS.filter((p) => p.isPublished).map((p) => ({
        id: p.id,
        code: p.code,
        family: p.family,
        name: p.name,
        dimensions: p.dimensions,
        lengthCm: p.lengthCm,
        widthCm: p.widthCm,
        heightCm: p.heightCm,
        unit: p.unit,
        sellingPriceFCFA: p.isPriceVisible ? p.sellingPriceFCFA : null,
        priceMaxFCFA: p.isPriceVisible ? p.priceMaxFCFA : null,
        isPriceVisible: p.isPriceVisible,
        availability: p.availability,
        isRental: p.isRental,
        imageUrl: p.imageUrl,
        description: p.description,
        sortOrder: p.sortOrder,
      })),
    });
  }
}
