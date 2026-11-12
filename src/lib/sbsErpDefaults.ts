/**
 * Données de référence officielles SBS INDUSTRIE
 * Sources :
 *  - Flyers officiels SBS Industrie (Agglos creux, Agglos pleins, Hourdis, Pavés)
 *  - Classeur d'exploitation GESTION_USINE_AGGLOS_v5_novembre_2026.xlsx
 *  - Grille Centrale à Béton 60 m³/h & Parc préfabrication/location SBS
 */

export interface SbsRawMaterial {
  id: string;
  code: 'ciment' | 'sable' | 'gravier_03' | 'gravier_38' | 'eau';
  name: string;
  priceFCFA: number;
  unit: string; // 'sac de 50 kg' | 'm³'
  densityKgM3: number; // 50 kg/sac pour ciment, sinon kg/m³
  qtyPerDelivery: number;
}

export interface SbsFixedCharges {
  loyer: number;
  assurances: number;
  impots: number;
  entretien: number;
  transport: number;
  fraisAdmin: number;
  gardiennage: number;
  autres: number;
}

export interface SbsDepreciationItem {
  id: string;
  equipment: string;
  valueFCFA: number;
  durationYears: number;
}

export interface SbsPayrollItem {
  id: string;
  role: string;
  headcount: number;
  monthlySalaryFCFA: number;
}

export interface SbsKpiTargets {
  minMcvRate: number;      // 0.40 (40%)
  minNetMarginRate: number; // 0.15 (15%)
  minCementYield: number;   // 30 u/sac
}

export interface SbsFactoryConfigData {
  id: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  address: string;
  deliveryZone: string;
  rawMaterials: SbsRawMaterial[];
  wheelbarrowVolumeL: number;
  freshConcreteDensityKgM3: number;
  fixedCharges: SbsFixedCharges;
  depreciations: SbsDepreciationItem[];
  fixedPayroll: SbsPayrollItem[];
  modPerCementTonFCFA: number;
  electricityRatePercent: number;
  tvaRatePercent: number;
  kpiTargets: SbsKpiTargets;
}

export type SbsProductFamily =
  | 'agglos-creux'
  | 'agglos-pleins'
  | 'hourdis'
  | 'paves'
  | 'beton'
  | 'location';

export interface SbsProductItem {
  id: string;
  code: string;
  family: SbsProductFamily;
  name: string;
  dimensions: string;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  unit: string;
  sellingPriceFCFA: number;
  priceMaxFCFA: number | null;
  isPriceVisible: boolean;
  isPublished: boolean;
  availability: string;
  isRental: boolean;
  imageUrl: string | null;
  description: string | null;
  hasFormulation: boolean;
  isSolidBlock: boolean;
  gravier38Brouettes: number;
  gravier03Brouettes: number;
  sableBrouettes: number;
  eauLitres: number;
  rendementPerSac: number;
  volumeExtLitres: number;
  stockOpening: number;
  sortOrder: number;
}

export interface SbsDailyEntry {
  day: number; // 1..31
  productionByCode: Record<string, number>;
  cementSacs: number;
  sandM3: number;
  gravier03M3: number;
  gravier38M3: number;
  waterL: number;
  dailyRevenueFCFA: number;
  unitsSold: number;
  note?: string;
}

export interface SbsMonthlySaleLine {
  qtySold: number;
  unitPriceFCFA: number | null;
  syncFromDaily?: boolean;
}

export interface SbsStockBalance {
  opening: number;
  entries: number;
}

export interface SbsRentalBooking {
  id: string;
  date: string;
  clientName: string;
  clientPhone: string;
  itemCode: string;
  itemName: string;
  qty: number;
  days: number;
  unitRateFCFA: number;
  totalFCFA: number;
  status: 'Devis' | 'En cours' | 'Terminé' | 'Annulé';
  notes?: string;
}

export interface SbsMonthlyLedgerData {
  id: string;
  year: number;
  month: number; // 1..12
  dailyEntries: SbsDailyEntry[];
  salesByCode: Record<string, SbsMonthlySaleLine>;
  electricityOverrideFCFA: number | null;
  rawMaterialStock: Record<string, SbsStockBalance>;
  productStock: Record<string, SbsStockBalance>;
  rentalBookings: SbsRentalBooking[];
  notes?: string | null;
}

export const DEFAULT_SBS_CONFIG: SbsFactoryConfigData = {
  id: 'default',
  companyName: 'SBS INDUSTRIE',
  phone: '77 566 48 06',
  whatsapp: '+221 77 566 48 06',
  address: 'Rufisque route national en face Avisen',
  deliveryZone: 'Livraison partout à Dakar',
  rawMaterials: [
    { id: 'mat-ciment', code: 'ciment', name: 'Ciment', priceFCFA: 3500, unit: 'sac de 50 kg', densityKgM3: 50, qtyPerDelivery: 20 },
    { id: 'mat-sable', code: 'sable', name: 'Sable', priceFCFA: 3947.37, unit: 'm³', densityKgM3: 1220, qtyPerDelivery: 19 },
    { id: 'mat-gravier-03', code: 'gravier_03', name: 'Gravier 0/3', priceFCFA: 18365.38, unit: 'm³', densityKgM3: 1630, qtyPerDelivery: 26 },
    { id: 'mat-gravier-38', code: 'gravier_38', name: 'Gravier 3/8', priceFCFA: 16807.69, unit: 'm³', densityKgM3: 1630, qtyPerDelivery: 26 },
    { id: 'mat-eau', code: 'eau', name: 'Eau', priceFCFA: 3750, unit: 'm³', densityKgM3: 1000, qtyPerDelivery: 0 },
  ],
  wheelbarrowVolumeL: 60,
  freshConcreteDensityKgM3: 2300,
  fixedCharges: {
    loyer: 200000,
    assurances: 0,
    impots: 0,
    entretien: 0,
    transport: 50000,
    fraisAdmin: 200000,
    gardiennage: 0,
    autres: 0,
  },
  depreciations: [
    { id: 'dep-pondeuse', equipment: 'Pondeuse', valueFCFA: 5000000, durationYears: 5 },
    { id: 'dep-table', equipment: 'Table vibrante', valueFCFA: 1000000, durationYears: 4 },
    { id: 'dep-moules', equipment: 'Moules', valueFCFA: 300000, durationYears: 4 },
    { id: 'dep-melangeur', equipment: 'Mélangeur', valueFCFA: 800000, durationYears: 4 },
  ],
  fixedPayroll: [
    { id: 'pay-gardien', role: 'Gardien', headcount: 1, monthlySalaryFCFA: 60000 },
    { id: 'pay-chef', role: "Chef d'équipe", headcount: 1, monthlySalaryFCFA: 100000 },
    { id: 'pay-chauffeur', role: 'Chauffeur', headcount: 2, monthlySalaryFCFA: 0 },
    { id: 'pay-ouvriers', role: 'Ouvriers (payés à la tonne)', headcount: 0, monthlySalaryFCFA: 0 },
  ],
  modPerCementTonFCFA: 30000,
  electricityRatePercent: 5,
  tvaRatePercent: 18,
  kpiTargets: {
    minMcvRate: 0.4,
    minNetMarginRate: 0.15,
    minCementYield: 30,
  },
};

export const DEFAULT_SBS_PRODUCTS: SbsProductItem[] = [
  // === AGGLOS CREUX (Flyer 1 + Excel Parametres) ===
  {
    id: 'sbs-prod-ac10',
    code: 'AC10',
    family: 'agglos-creux',
    name: 'Agglo creux 10×20×40',
    dimensions: '10×20×40 cm',
    lengthCm: 40,
    widthCm: 10,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 380,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-agglos-creux.jpg',
    description: 'Agglo creux industriel haute résistance 10×20×40 pour cloisons, façades non porteuses et murets. Livraison partout à Dakar.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 36,
    volumeExtLitres: 8,
    stockOpening: 0,
    sortOrder: 1,
  },
  {
    id: 'sbs-prod-ac12',
    code: 'AC12',
    family: 'agglos-creux',
    name: 'Agglo creux 12×20×40',
    dimensions: '12×20×40 cm',
    lengthCm: 40,
    widthCm: 12,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 400,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-agglos-creux.jpg',
    description: 'Agglo creux industriel haute résistance 12×20×40 calibré sur pondeuse automatique pour clôtures et maçonneries.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 36,
    volumeExtLitres: 9.6,
    stockOpening: 0,
    sortOrder: 2,
  },
  {
    id: 'sbs-prod-ac15',
    code: 'AC15',
    family: 'agglos-creux',
    name: 'Agglo creux 15×20×40',
    dimensions: '15×20×40 cm',
    lengthCm: 40,
    widthCm: 15,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 475,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-065.jpg',
    description: 'Agglo creux industriel 15×20×40 haute densité pour murs extérieurs, refends et bâtiments R+.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 30,
    volumeExtLitres: 12,
    stockOpening: 0,
    sortOrder: 3,
  },
  {
    id: 'sbs-prod-ac20',
    code: 'AC20',
    family: 'agglos-creux',
    name: 'Agglo creux 20×20×40',
    dimensions: '20×20×40 cm',
    lengthCm: 40,
    widthCm: 20,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 590,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-agglos-creux.jpg',
    description: 'Agglo creux porteur grande section 20×20×40 pour façades principales, soubassements et murs techniques.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 24,
    volumeExtLitres: 16,
    stockOpening: 0,
    sortOrder: 4,
  },

  // === AGGLOS PLEINS (Flyer 3 + Exigence Plein 15x20x40 & Plein 20x20x40) ===
  {
    id: 'sbs-prod-ap15',
    code: 'AP15',
    family: 'agglos-pleins',
    name: 'Agglo plein 15×20×40',
    dimensions: '15×20×40 cm',
    lengthCm: 40,
    widthCm: 15,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 700,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-agglos-pleins.jpg',
    description: 'Brique agglo pleine industrielle haute résistance 15×20×40 pour fondations, soubassements, murs porteurs et zones humides.',
    hasFormulation: true,
    isSolidBlock: true,
    gravier38Brouettes: 1.5,
    gravier03Brouettes: 2.5,
    sableBrouettes: 1.5,
    eauLitres: 20,
    rendementPerSac: 21,
    volumeExtLitres: 12,
    stockOpening: 0,
    sortOrder: 5,
  },
  {
    id: 'sbs-prod-ap20',
    code: 'AP20',
    family: 'agglos-pleins',
    name: 'Agglo plein 20×20×40',
    dimensions: '20×20×40 cm',
    lengthCm: 40,
    widthCm: 20,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 850,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-agglos-pleins.jpg',
    description: 'Brique agglo pleine lourde 20×20×40 haute compacité (31,7 kg/u) pour fondations fortes charges, soutènements et génie civil.',
    hasFormulation: true,
    isSolidBlock: true,
    gravier38Brouettes: 2.5,
    gravier03Brouettes: 1.5,
    sableBrouettes: 1.5,
    eauLitres: 20,
    rendementPerSac: 18,
    volumeExtLitres: 16,
    stockOpening: 0,
    sortOrder: 6,
  },

  // === HOURDIS (Flyer 2 + Excel Parametres) ===
  {
    id: 'sbs-prod-hd12',
    code: 'HD12',
    family: 'hourdis',
    name: 'Hourdis 12 (12×20×50)',
    dimensions: '12×20×50 cm',
    lengthCm: 50,
    widthCm: 12,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 450,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-hourdis.jpg',
    description: 'Hourdis béton haute résistance 12×20×50 pour planchers et dalles de compression légères.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 36,
    volumeExtLitres: 14.4,
    stockOpening: 0,
    sortOrder: 7,
  },
  {
    id: 'sbs-prod-hd16',
    code: 'HD16',
    family: 'hourdis',
    name: 'Hourdis 16 (16×20×50)',
    dimensions: '16×20×50 cm',
    lengthCm: 50,
    widthCm: 16,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 580,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-hourdis.jpg',
    description: 'Hourdis béton haute résistance 16×20×50 pour planchers d’habitation et dalles intermédiaires.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 24,
    volumeExtLitres: 19.2,
    stockOpening: 0,
    sortOrder: 8,
  },
  {
    id: 'sbs-prod-hd20',
    code: 'HD20',
    family: 'hourdis',
    name: 'Hourdis 20 (20×20×50)',
    dimensions: '20×20×50 cm',
    lengthCm: 50,
    widthCm: 20,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 650,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-hourdis.jpg',
    description: 'Hourdis béton 20×20×50 grande portée pour dalles et planchers à forte charge d’exploitation.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 24,
    volumeExtLitres: 24,
    stockOpening: 0,
    sortOrder: 9,
  },
  {
    id: 'sbs-prod-hd25',
    code: 'HD25',
    family: 'hourdis',
    name: 'Hourdis 25 (25×20×50)',
    dimensions: '25×20×50 cm',
    lengthCm: 50,
    widthCm: 25,
    heightCm: 20,
    unit: 'pièce',
    sellingPriceFCFA: 750,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-hourdis.jpg',
    description: 'Hourdis béton haute performance 25×20×50 pour planchers grande portée et immeubles tertiaires.',
    hasFormulation: true,
    isSolidBlock: false,
    gravier38Brouettes: 1,
    gravier03Brouettes: 2.5,
    sableBrouettes: 0.5,
    eauLitres: 20,
    rendementPerSac: 24,
    volumeExtLitres: 30,
    stockOpening: 0,
    sortOrder: 10,
  },

  // === PAVÉS (Flyer 4) ===
  {
    id: 'sbs-prod-pav6',
    code: 'PAV6',
    family: 'paves',
    name: 'Pavés aménagement 6 cm',
    dimensions: 'Épaisseur 6 cm',
    lengthCm: null,
    widthCm: null,
    heightCm: 6,
    unit: 'm²',
    sellingPriceFCFA: 6750,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-paves.jpg',
    description: 'Pavés autobloquants épaisseur 6 cm pour cours, allées piétonnes, esplanades et voiries légères.',
    hasFormulation: false,
    isSolidBlock: true,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 20,
    rendementPerSac: 1,
    volumeExtLitres: 10,
    stockOpening: 0,
    sortOrder: 11,
  },
  {
    id: 'sbs-prod-pav8',
    code: 'PAV8',
    family: 'paves',
    name: 'Pavés voirie 8 cm',
    dimensions: 'Épaisseur 8 cm',
    lengthCm: null,
    widthCm: null,
    heightCm: 8,
    unit: 'm²',
    sellingPriceFCFA: 7750,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-paves.jpg',
    description: 'Pavés haute densité épaisseur 8 cm pour voies urbaines, parkings VL/PL et plateformes logistiques.',
    hasFormulation: false,
    isSolidBlock: true,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 20,
    rendementPerSac: 1,
    volumeExtLitres: 12,
    stockOpening: 0,
    sortOrder: 12,
  },
  {
    id: 'sbs-prod-pav10',
    code: 'PAV10',
    family: 'paves',
    name: 'Pavés charges lourdes 10 cm',
    dimensions: 'Épaisseur 10 cm',
    lengthCm: null,
    widthCm: null,
    heightCm: 10,
    unit: 'm²',
    sellingPriceFCFA: 9000,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'Sur commande',
    isRental: false,
    imageUrl: '/images/sbs-industries/flyer-paves.jpg',
    description: 'Pavés industriels renforcés épaisseur 10 cm pour zones portuaires, stations-service et aires poids lourds.',
    hasFormulation: false,
    isSolidBlock: true,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 20,
    rendementPerSac: 1,
    volumeExtLitres: 15,
    stockOpening: 0,
    sortOrder: 13,
  },

  // === BÉTON PRÊT À L'EMPLOI — CENTRALE 60 m³/h ===
  {
    id: 'sbs-prod-bpe-c15',
    code: 'BPE-C15',
    family: 'beton',
    name: "Béton Prêt à l'Emploi Classe C15",
    dimensions: 'Dosage C12/15 · Centrale 60 m³/h',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'm³',
    sellingPriceFCFA: 62000,
    priceMaxFCFA: 65000,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-070.jpg',
    description: 'Béton de propreté, massifs non armés, semelles légères et formes de pente. Livraison par toupie.',
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 20,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 14,
  },
  {
    id: 'sbs-prod-bpe-c20',
    code: 'BPE-C20',
    family: 'beton',
    name: "Béton Prêt à l'Emploi Classe C20",
    dimensions: 'Dosage C16/20 · Centrale 60 m³/h',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'm³',
    sellingPriceFCFA: 65000,
    priceMaxFCFA: 68000,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-070.jpg',
    description: 'Béton de structure courant pour dallages, chaînages, planchers et fondations bâtiment.',
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 20,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 15,
  },
  {
    id: 'sbs-prod-bpe-c25',
    code: 'BPE-C25',
    family: 'beton',
    name: "Béton Prêt à l'Emploi Classe C25",
    dimensions: 'Dosage C20/25 · Centrale 60 m³/h',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'm³',
    sellingPriceFCFA: 71000,
    priceMaxFCFA: 73000,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/realisations/sbs-beton-malaxeur-pompe-site.jpg',
    description: 'Béton structural haute résistance certifié laboratoire pour poteaux, poutres, radiers et dalles.',
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 20,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 16,
  },
  {
    id: 'sbs-prod-bpe-c30',
    code: 'BPE-C30',
    family: 'beton',
    name: "Béton Prêt à l'Emploi Classe C30",
    dimensions: 'Dosage C25/30 · Centrale 60 m³/h',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'm³',
    sellingPriceFCFA: 75000,
    priceMaxFCFA: 77000,
    isPriceVisible: true,
    isPublished: true,
    availability: 'En stock',
    isRental: false,
    imageUrl: '/images/realisations/sbs-beton-malaxeur-pompe-site.jpg',
    description: "Béton haute performance pour ouvrages d'art, dallages industriels lourds et infrastructures maritimes.",
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 20,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 17,
  },

  // === LOCATIONS MATÉRIEL BÉTON & LOGISTIQUE CHANTIER SBS INDUSTRIE ===
  {
    id: 'sbs-loc-toupie',
    code: 'LOC-TOUPIE',
    family: 'location',
    name: 'Location Camion Toupie à Béton 10 m³',
    dimensions: 'Capacité 10 m³ · Avec chauffeur',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'jour',
    sellingPriceFCFA: 150000,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'Disponible',
    isRental: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-010.jpg',
    description: 'Transport et malaxage continu de béton prêt à l’emploi de la centrale SBS Industrie vers votre chantier (Dakar & régions).',
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 0,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 18,
  },
  {
    id: 'sbs-loc-pompe',
    code: 'LOC-POMPE',
    family: 'location',
    name: 'Location Pompe à Béton Stationnaire / Automotrice',
    dimensions: 'Haute pression · Jusqu’à 60 m³/h',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'jour',
    sellingPriceFCFA: 250000,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'Disponible',
    isRental: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-011.jpg',
    description: 'Pompage haute pression pour coulage de dalles en hauteur, radiers industriels et voiles difficiles d’accès, opérateur inclus.',
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 0,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 19,
  },
  {
    id: 'sbs-loc-pondeuse',
    code: 'LOC-QT40',
    family: 'location',
    name: 'Location Pondeuse Industrielle QT40-3A & Moules Briques',
    dimensions: 'Moules Creux / Pleins 15×20×40 & 20×20×40 / Hourdis',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'jour',
    sellingPriceFCFA: 180000,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'Sur commande',
    isRental: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-068.jpg',
    description: 'Mise à disposition sur chantier ou campagne dédiée en usine pour fabrication en série de vos briques agglos, hourdis ou pavés.',
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 0,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 20,
  },
  {
    id: 'sbs-loc-coffrage',
    code: 'LOC-COFFRAGE',
    family: 'location',
    name: 'Location Parc de Banches & Coffrages Métalliques',
    dimensions: 'Cycle 21 jours (marge 9 jours)',
    lengthCm: null,
    widthCm: null,
    heightCm: null,
    unit: 'forfait',
    sellingPriceFCFA: 125000,
    priceMaxFCFA: null,
    isPriceVisible: true,
    isPublished: true,
    availability: 'Disponible',
    isRental: true,
    imageUrl: '/images/sbs-presentation/sbs-page12-img04.jpeg',
    description: 'Location de panneaux de coffrage modulaires et étaiement lourd pour poteaux, voiles et planchers béton.',
    hasFormulation: false,
    isSolidBlock: false,
    gravier38Brouettes: 0,
    gravier03Brouettes: 0,
    sableBrouettes: 0,
    eauLitres: 0,
    rendementPerSac: 1,
    volumeExtLitres: 1000,
    stockOpening: 0,
    sortOrder: 21,
  },
];

export function createEmptyDailyEntries(): SbsDailyEntry[] {
  return Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    productionByCode: {},
    cementSacs: 0,
    sandM3: 0,
    gravier03M3: 0,
    gravier38M3: 0,
    waterL: 0,
    dailyRevenueFCFA: 0,
    unitsSold: 0,
    note: '',
  }));
}

export function createNov2026SeedLedger(): Omit<SbsMonthlyLedgerData, 'id'> {
  const dailyEntries = createEmptyDailyEntries();
  // Données réelles exactes extraites de GESTION_USINE_AGGLOS_v5_novembre_2026.xlsx
  dailyEntries[0] = { ...dailyEntries[0], sandM3: 12, note: 'Réception sable / démarrage' };
  dailyEntries[9] = { ...dailyEntries[9], dailyRevenueFCFA: 185900, unitsSold: 286, note: 'Vente AP15 (lot 1)' };
  dailyEntries[20] = { ...dailyEntries[20], dailyRevenueFCFA: 185900, unitsSold: 286, note: 'Vente AP15 (lot 2)' };
  dailyEntries[21] = { ...dailyEntries[21], dailyRevenueFCFA: 185900, unitsSold: 286, note: 'Vente AP15 (lot 3)' };
  dailyEntries[22] = { ...dailyEntries[22], dailyRevenueFCFA: 146850, unitsSold: 267, note: 'Vente HD16 (267 × 550 F)' };
  dailyEntries[23] = { ...dailyEntries[23], dailyRevenueFCFA: 185900, unitsSold: 286, note: 'Vente AP15 (lot 4)' };
  dailyEntries[30] = {
    ...dailyEntries[30],
    cementSacs: 13,
    sandM3: 6,
    gravier03M3: 12,
    gravier38M3: 14,
    note: 'Relevé consommations fin de mois',
  };

  return {
    year: 2026,
    month: 11,
    dailyEntries,
    salesByCode: {
      AC10: { qtySold: 0, unitPriceFCFA: 380 },
      AC12: { qtySold: 0, unitPriceFCFA: 400 },
      AC15: { qtySold: 0, unitPriceFCFA: 475 },
      AC20: { qtySold: 0, unitPriceFCFA: 590 },
      AP15: { qtySold: 1144, unitPriceFCFA: 650 },
      AP20: { qtySold: 0, unitPriceFCFA: 850 },
      HD12: { qtySold: 207, unitPriceFCFA: 450 },
      HD16: { qtySold: 267, unitPriceFCFA: 550 },
      HD20: { qtySold: 0, unitPriceFCFA: 650 },
      HD25: { qtySold: 0, unitPriceFCFA: 750 },
    },
    electricityOverrideFCFA: null,
    rawMaterialStock: {
      ciment: { opening: 0, entries: 10 },
      sable: { opening: 0, entries: 0 },
      gravier_03: { opening: 0, entries: 0 },
      gravier_38: { opening: 0, entries: 0 },
    },
    productStock: {
      AC10: { opening: 0, entries: 0 },
      AC12: { opening: 0, entries: 0 },
      AC15: { opening: 0, entries: 0 },
      AC20: { opening: 0, entries: 0 },
      AP15: { opening: 0, entries: 0 },
      AP20: { opening: 0, entries: 0 },
      HD12: { opening: 0, entries: 0 },
      HD16: { opening: 0, entries: 0 },
      HD20: { opening: 0, entries: 0 },
      HD25: { opening: 0, entries: 0 },
    },
    rentalBookings: [],
    notes: 'Import initial du classeur Excel v5 Novembre 2026 — Prêt pour saisie production & ventes.',
  };
}
