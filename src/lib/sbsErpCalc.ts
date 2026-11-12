/**
 * Moteur de calcul déterministe de l'ERP SBS INDUSTRIE.
 * Reproduit à l'identique (sans référence circulaire) toutes les formules du classeur
 * GESTION_USINE_AGGLOS_v5_novembre_2026.xlsx tout en ajoutant les locations & le BPE.
 */

import type {
  SbsDailyEntry,
  SbsFactoryConfigData,
  SbsMonthlyLedgerData,
  SbsProductItem,
} from './sbsErpDefaults';

export interface RawMaterialUnitRate {
  code: string;
  name: string;
  priceFCFA: number;
  unit: string;
  densityKgM3: number;
  qtyPerDelivery: number;
  pricePerKgOrL: number;
}

export interface DailyComputedRow extends SbsDailyEntry {
  totalUnitsProduced: number;
  materialCostFCFA: number;
}

export interface VarianceRow {
  code: string;
  label: string;
  actual: number;
  theoretical: number;
  diff: number;
  diffPct: number;
  status: 'ok' | 'warning' | 'alert';
}

export interface ProductCostRow {
  productId: string;
  code: string;
  name: string;
  dimensions: string;
  family: string;
  isSolidBlock: boolean;
  rendementPerSac: number;
  qtyProducedMonth: number;
  cementKgPerUnit: number;
  grav38KgPerUnit: number;
  grav03KgPerUnit: number;
  sableKgPerUnit: number;
  eauLPerUnit: number;
  materialCostPerUnit: number;
  modCostPerUnit: number;
  subtotalCostPerUnit: number;
  weightKgPerUnit: number;
  compactness: number;
  compactnessDiagnostic: string;
  compactnessLevel: 'ok' | 'warning' | 'danger';
  fixedCostPerUnit: number;
  totalCostPricePerUnit: number;
  suggestedPrice30: number;
  suggestedPrice35: number;
  suggestedPrice40: number;
  suggestedPriceTTC35: number;
  totalMaterialCostMonth: number;
  catalogSellingPrice: number;
  catalogMarginFCFA: number;
  catalogMarginPct: number;
}

export interface MonthlySaleRow {
  code: string;
  name: string;
  dimensions: string;
  unit: string;
  qtySold: number;
  unitPriceFCFA: number | null;
  revenueFCFA: number;
  costPricePerUnit: number;
  unitMarginFCFA: number | null;
  totalMarginFCFA: number | null;
}

export interface IncomeStatementResult {
  caVentesDetaillees: number;
  caJournalier: number;
  caProduitsRetenu: number;
  caLocations: number;
  caTotal: number;
  chargesMatieres: number;
  chargesMOD: number;
  chargesElectricite: number;
  electricityIsOverride: boolean;
  totalChargesVariables: number;
  mcv: number;
  tauxMcv: number;
  fixedChargesBreakdown: { label: string; amount: number; pctOfCa: number }[];
  amortissementsMensuels: number;
  mainOeuvreFixeMensuelle: number;
  totalChargesFixes: number;
  resultatNet: number;
  tauxResultatNet: number;
}

export interface KpiAndBreakEvenResult {
  productionTotale: number;
  rendementCiment: number;
  joursTravailles: number;
  productiviteJournaliere: number;
  chiffreAffaires: number;
  mcv: number;
  tauxMcv: number;
  resultatNet: number;
  tauxResultatNet: number;
  prixRevientMoyen: number;
  unitesVendues: number;
  prixVenteMoyen: number;
  sacsCimentConsommes: number;
  coutVariableUnitaire: number;
  mcvUnitaire: number;
  seuilRentabiliteUnites: number;
  seuilRentabiliteFCFA: number;
  ratioProductionSeuil: number;
  diagnosticSeuil: string;
  diagnosticLevel: 'ok' | 'warning' | 'danger';
}

export interface StockRowResult {
  code: string;
  label: string;
  category: 'matiere' | 'produit';
  opening: number;
  entries: number;
  exits: number;
  closing: number;
  unit: string;
  note: string;
  alertNegative: boolean;
}

export interface SbsErpComputedReport {
  rawMaterialRates: RawMaterialUnitRate[];
  totalChargesFixesBase: number;
  totalAmortissementsMensuels: number;
  totalMainOeuvreFixe: number;
  totalFraisFixesMensuels: number;
  dailyRows: DailyComputedRow[];
  dailyTotals: {
    productionByCode: Record<string, number>;
    totalProducedUnits: number;
    cementSacs: number;
    sandM3: number;
    gravier03M3: number;
    gravier38M3: number;
    waterL: number;
    materialCostFCFA: number;
    dailyRevenueFCFA: number;
    unitsSold: number;
    workingDays: number;
  };
  varianceRows: VarianceRow[];
  costRows: ProductCostRow[];
  costTotals: {
    totalProducedUnits: number;
    weightedAvgCostPrice: number;
    totalMaterialCostMonth: number;
  };
  saleRows: MonthlySaleRow[];
  saleTotals: {
    qtySold: number;
    revenueFCFA: number;
    totalMarginFCFA: number;
  };
  incomeStatement: IncomeStatementResult;
  kpi: KpiAndBreakEvenResult;
  stockRows: StockRowResult[];
  dashboardAppreciations: {
    label: string;
    value: number;
    displayValue: string;
    thresholdDisplay: string;
    ok: boolean;
    verdict: 'BON' | 'À AMÉLIORER';
  }[];
  alerts: { id: string; severity: 'danger' | 'warning' | 'info'; message: string; module: string }[];
}

export function computeSbsErp(
  config: SbsFactoryConfigData,
  products: SbsProductItem[],
  ledger: SbsMonthlyLedgerData
): SbsErpComputedReport {
  // 1. Paramètres Matières Premières
  const rawMaterialRates: RawMaterialUnitRate[] = config.rawMaterials.map((m) => ({
    ...m,
    pricePerKgOrL: m.densityKgM3 > 0 ? m.priceFCFA / m.densityKgM3 : 0,
  }));
  const matByCode = Object.fromEntries(rawMaterialRates.map((m) => [m.code, m]));

  const pCiment = matByCode.ciment?.priceFCFA ?? 0;
  const pSable = matByCode.sable?.priceFCFA ?? 0;
  const pGrav03 = matByCode.gravier_03?.priceFCFA ?? 0;
  const pGrav38 = matByCode.gravier_38?.priceFCFA ?? 0;
  const pEau = matByCode.eau?.priceFCFA ?? 0;

  const pKgCiment = matByCode.ciment?.pricePerKgOrL ?? 0;
  const pKgSable = matByCode.sable?.pricePerKgOrL ?? 0;
  const pKgGrav03 = matByCode.gravier_03?.pricePerKgOrL ?? 0;
  const pKgGrav38 = matByCode.gravier_38?.pricePerKgOrL ?? 0;
  const pLEau = matByCode.eau?.pricePerKgOrL ?? 0;

  const dCimentSacKg = matByCode.ciment?.densityKgM3 ?? 50;
  const dSableKgM3 = matByCode.sable?.densityKgM3 ?? 1220;
  const dGrav03KgM3 = matByCode.gravier_03?.densityKgM3 ?? 1630;
  const dGrav38KgM3 = matByCode.gravier_38?.densityKgM3 ?? 1630;

  // 2. Charges Fixes, Amortissements & Main d'oeuvre fixe
  const fc = config.fixedCharges;
  const totalChargesFixesBase =
    (fc.loyer || 0) +
    (fc.assurances || 0) +
    (fc.impots || 0) +
    (fc.entretien || 0) +
    (fc.transport || 0) +
    (fc.fraisAdmin || 0) +
    (fc.gardiennage || 0) +
    (fc.autres || 0);

  const totalAmortissementsMensuels = config.depreciations.reduce(
    (sum, d) => sum + (d.durationYears > 0 ? d.valueFCFA / d.durationYears / 12 : 0),
    0
  );
  const totalMainOeuvreFixe = config.fixedPayroll.reduce(
    (sum, p) => sum + (p.headcount || 0) * (p.monthlySalaryFCFA || 0),
    0
  );
  const totalFraisFixesMensuels =
    totalChargesFixesBase + totalAmortissementsMensuels + totalMainOeuvreFixe;

  // 3. Journalier (31 jours)
  const formProducts = products
    .filter((p) => p.hasFormulation)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const prodSumByCode: Record<string, number> = {};
  for (const p of formProducts) prodSumByCode[p.code] = 0;

  let sumCementSacs = 0;
  let sumSandM3 = 0;
  let sumGrav03M3 = 0;
  let sumGrav38M3 = 0;
  let sumWaterL = 0;
  let sumDailyMatCost = 0;
  let sumDailyCA = 0;
  let sumDailyUnitsSold = 0;
  let workingDays = 0;

  const dailyRows: DailyComputedRow[] = Array.from({ length: 31 }, (_, idx) => {
    const dayNum = idx + 1;
    const raw = ledger.dailyEntries.find((d) => d.day === dayNum) ?? {
      day: dayNum,
      productionByCode: {},
      cementSacs: 0,
      sandM3: 0,
      gravier03M3: 0,
      gravier38M3: 0,
      waterL: 0,
      dailyRevenueFCFA: 0,
      unitsSold: 0,
      note: '',
    };

    let dayProduced = 0;
    for (const [code, q] of Object.entries(raw.productionByCode || {})) {
      const val = Number(q) || 0;
      dayProduced += val;
      prodSumByCode[code] = (prodSumByCode[code] || 0) + val;
    }

    const materialCostFCFA =
      (raw.cementSacs || 0) * pCiment +
      (raw.sandM3 || 0) * pSable +
      (raw.gravier03M3 || 0) * pGrav03 +
      (raw.gravier38M3 || 0) * pGrav38 +
      ((raw.waterL || 0) / 1000) * pEau;

    if ((raw.cementSacs || 0) > 0 || dayProduced > 0) {
      workingDays += 1;
    }

    sumCementSacs += raw.cementSacs || 0;
    sumSandM3 += raw.sandM3 || 0;
    sumGrav03M3 += raw.gravier03M3 || 0;
    sumGrav38M3 += raw.gravier38M3 || 0;
    sumWaterL += raw.waterL || 0;
    sumDailyMatCost += materialCostFCFA;
    sumDailyCA += raw.dailyRevenueFCFA || 0;
    sumDailyUnitsSold += raw.unitsSold || 0;

    return {
      ...raw,
      totalUnitsProduced: dayProduced,
      materialCostFCFA,
    };
  });

  const totalProducedUnits = Object.values(prodSumByCode).reduce((a, b) => a + b, 0);

  // 4. Contrôle consommation Réelle vs Théorique de la formulation
  let theoCement = 0;
  let theoSand = 0;
  let theoGrav03 = 0;
  let theoGrav38 = 0;
  let theoWater = 0;

  for (const p of formProducts) {
    const q = prodSumByCode[p.code] || 0;
    if (q > 0 && p.rendementPerSac > 0) {
      theoCement += q / p.rendementPerSac;
      theoSand += ((q * p.sableBrouettes) / p.rendementPerSac) * (config.wheelbarrowVolumeL / 1000);
      theoGrav03 += ((q * p.gravier03Brouettes) / p.rendementPerSac) * (config.wheelbarrowVolumeL / 1000);
      theoGrav38 += ((q * p.gravier38Brouettes) / p.rendementPerSac) * (config.wheelbarrowVolumeL / 1000);
      theoWater += (q * p.eauLitres) / p.rendementPerSac;
    }
  }

  const mkVar = (code: string, label: string, actual: number, theoretical: number): VarianceRow => {
    const diff = actual - theoretical;
    const diffPct = theoretical > 0 ? diff / theoretical : 0;
    const absPct = Math.abs(diffPct);
    const status: 'ok' | 'warning' | 'alert' =
      theoretical === 0 && actual > 0 ? 'warning' : absPct > 0.15 ? 'alert' : absPct > 0.05 ? 'warning' : 'ok';
    return { code, label, actual, theoretical, diff, diffPct, status };
  };

  const varianceRows: VarianceRow[] = [
    mkVar('ciment', 'Ciment (sacs)', sumCementSacs, theoCement),
    mkVar('sable', 'Sable (m³)', sumSandM3, theoSand),
    mkVar('gravier_03', 'Grav. 0/3 (m³)', sumGrav03M3, theoGrav03),
    mkVar('gravier_38', 'Grav. 3/8 (m³)', sumGrav38M3, theoGrav38),
    mkVar('eau', 'Eau (L)', sumWaterL, theoWater),
  ];

  // 5. Prix de Revient par Produit & Compacité
  const fixedCostPerUnit = totalProducedUnits > 0 ? totalFraisFixesMensuels / totalProducedUnits : 0;

  const costRows: ProductCostRow[] = formProducts.map((p) => {
    const R = p.rendementPerSac > 0 ? p.rendementPerSac : 1;
    const qtyProducedMonth = prodSumByCode[p.code] || 0;
    const cementKgPerUnit = dCimentSacKg / R;
    const grav38KgPerUnit = (p.gravier38Brouettes * config.wheelbarrowVolumeL * dGrav38KgM3) / 1000 / R;
    const grav03KgPerUnit = (p.gravier03Brouettes * config.wheelbarrowVolumeL * dGrav03KgM3) / 1000 / R;
    const sableKgPerUnit = (p.sableBrouettes * config.wheelbarrowVolumeL * dSableKgM3) / 1000 / R;
    const eauLPerUnit = p.eauLitres / R;

    const materialCostPerUnit =
      cementKgPerUnit * pKgCiment +
      grav38KgPerUnit * pKgGrav38 +
      grav03KgPerUnit * pKgGrav03 +
      sableKgPerUnit * pKgSable +
      eauLPerUnit * pLEau;

    const modCostPerUnit = (cementKgPerUnit / 1000) * config.modPerCementTonFCFA;
    const subtotalCostPerUnit = materialCostPerUnit + modCostPerUnit;
    const weightKgPerUnit =
      cementKgPerUnit + grav38KgPerUnit + grav03KgPerUnit + sableKgPerUnit + eauLPerUnit;

    const volM3 = p.volumeExtLitres > 0 ? p.volumeExtLitres / 1000 : 0;
    const compactness =
      volM3 > 0 && config.freshConcreteDensityKgM3 > 0
        ? weightKgPerUnit / config.freshConcreteDensityKgM3 / volM3
        : 0;

    let compactnessDiagnostic = '✓ cohérent';
    let compactnessLevel: 'ok' | 'warning' | 'danger' = 'ok';
    if (compactness > 1) {
      compactnessDiagnostic = '⛔ IMPOSSIBLE';
      compactnessLevel = 'danger';
    } else if (p.isSolidBlock) {
      if (compactness >= 0.85) {
        compactnessDiagnostic = '✓ cohérent (plein)';
        compactnessLevel = 'ok';
      } else if (compactness >= 0.7) {
        compactnessDiagnostic = '⚠ un peu léger';
        compactnessLevel = 'warning';
      } else {
        compactnessDiagnostic = '⚠ trop léger — rendement surestimé';
        compactnessLevel = 'danger';
      }
    } else {
      if (compactness > 0.78) {
        compactnessDiagnostic = '⚠ trop dense — rendement sous-estimé';
        compactnessLevel = 'warning';
      } else if (compactness < 0.25) {
        compactnessDiagnostic = '⚠ trop creux';
        compactnessLevel = 'warning';
      } else {
        compactnessDiagnostic = '✓ cohérent';
        compactnessLevel = 'ok';
      }
    }

    const totalCostPricePerUnit = subtotalCostPerUnit + fixedCostPerUnit;
    const suggestedPrice30 = totalCostPricePerUnit * 1.3;
    const suggestedPrice35 = totalCostPricePerUnit * 1.35;
    const suggestedPrice40 = totalCostPricePerUnit * 1.4;
    const suggestedPriceTTC35 = suggestedPrice35 * (1 + config.tvaRatePercent / 100);
    const totalMaterialCostMonth = materialCostPerUnit * qtyProducedMonth;

    const catalogMarginFCFA = p.sellingPriceFCFA - totalCostPricePerUnit;
    const catalogMarginPct = p.sellingPriceFCFA > 0 ? catalogMarginFCFA / p.sellingPriceFCFA : 0;

    return {
      productId: p.id,
      code: p.code,
      name: p.name,
      dimensions: p.dimensions,
      family: p.family,
      isSolidBlock: p.isSolidBlock,
      rendementPerSac: R,
      qtyProducedMonth,
      cementKgPerUnit,
      grav38KgPerUnit,
      grav03KgPerUnit,
      sableKgPerUnit,
      eauLPerUnit,
      materialCostPerUnit,
      modCostPerUnit,
      subtotalCostPerUnit,
      weightKgPerUnit,
      compactness,
      compactnessDiagnostic,
      compactnessLevel,
      fixedCostPerUnit,
      totalCostPricePerUnit,
      suggestedPrice30,
      suggestedPrice35,
      suggestedPrice40,
      suggestedPriceTTC35,
      totalMaterialCostMonth,
      catalogSellingPrice: p.sellingPriceFCFA,
      catalogMarginFCFA,
      catalogMarginPct,
    };
  });

  const costByCode = Object.fromEntries(costRows.map((c) => [c.code, c]));
  const weightedAvgCostPrice =
    totalProducedUnits > 0
      ? costRows.reduce((s, c) => s + c.totalCostPricePerUnit * c.qtyProducedMonth, 0) / totalProducedUnits
      : 0;
  const totalMaterialCostTheoreticalMonth = costRows.reduce((s, c) => s + c.totalMaterialCostMonth, 0);

  // 6. Ventes du mois (liées au Prix de revient) + Locations actives/terminées
  const saleProducts = products
    .filter((p) => p.hasFormulation || (ledger.salesByCode[p.code]?.qtySold ?? 0) > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  let totalQtySold = 0;
  let totalRevenueDetailed = 0;
  let totalMarginDetailed = 0;

  const saleRows: MonthlySaleRow[] = saleProducts.map((p) => {
    const entry = ledger.salesByCode[p.code];
    const qtySold = entry?.qtySold ?? 0;
    const unitPriceFCFA =
      entry && entry.unitPriceFCFA !== undefined ? entry.unitPriceFCFA : p.sellingPriceFCFA;
    const revenueFCFA = unitPriceFCFA != null ? qtySold * unitPriceFCFA : 0;
    const costPricePerUnit = costByCode[p.code]?.totalCostPricePerUnit ?? 0;
    const unitMarginFCFA = unitPriceFCFA != null ? unitPriceFCFA - costPricePerUnit : null;
    const totalMarginFCFA = unitMarginFCFA != null ? qtySold * unitMarginFCFA : null;

    totalQtySold += qtySold;
    totalRevenueDetailed += revenueFCFA;
    if (totalMarginFCFA != null) totalMarginDetailed += totalMarginFCFA;

    return {
      code: p.code,
      name: p.name,
      dimensions: p.dimensions,
      unit: p.unit,
      qtySold,
      unitPriceFCFA,
      revenueFCFA,
      costPricePerUnit,
      unitMarginFCFA,
      totalMarginFCFA,
    };
  });

  const caLocations = (ledger.rentalBookings || [])
    .filter((r) => r.status !== 'Annulé')
    .reduce((s, r) => s + (Number(r.totalFCFA) || 0), 0);

  // 7. Compte de Résultat Mensuel (exact selon Excel: CA détaillé si >0 sinon CA journalier, + locations)
  const caProduitsRetenu = totalRevenueDetailed > 0 ? totalRevenueDetailed : sumDailyCA;
  const caTotal = caProduitsRetenu + caLocations;

  const chargesMatieres = sumDailyMatCost;
  const chargesMOD = sumCementSacs * (dCimentSacKg / 1000) * config.modPerCementTonFCFA;
  const electricityIsOverride = ledger.electricityOverrideFCFA != null;
  const chargesElectricite =
    ledger.electricityOverrideFCFA != null
      ? ledger.electricityOverrideFCFA
      : chargesMatieres * (config.electricityRatePercent / 100);
  const totalChargesVariables = chargesMatieres + chargesMOD + chargesElectricite;
  const mcv = caTotal - totalChargesVariables;
  const tauxMcv = caTotal > 0 ? mcv / caTotal : 0;

  const fixedLines: { label: string; amount: number }[] = [
    { label: 'Loyer / terrain', amount: fc.loyer || 0 },
    { label: 'Assurances', amount: fc.assurances || 0 },
    { label: 'Impôts et taxes', amount: fc.impots || 0 },
    { label: 'Entretien', amount: fc.entretien || 0 },
    { label: 'Transport / carburant', amount: fc.transport || 0 },
    { label: 'Frais administratifs', amount: fc.fraisAdmin || 0 },
    { label: 'Gardiennage', amount: fc.gardiennage || 0 },
    { label: 'Autres', amount: fc.autres || 0 },
  ];

  const fixedChargesBreakdown = fixedLines.map((l) => ({
    ...l,
    pctOfCa: caTotal > 0 ? l.amount / caTotal : 0,
  }));

  const resultatNet = mcv - totalFraisFixesMensuels;
  const tauxResultatNet = caTotal > 0 ? resultatNet / caTotal : 0;

  const incomeStatement: IncomeStatementResult = {
    caVentesDetaillees: totalRevenueDetailed,
    caJournalier: sumDailyCA,
    caProduitsRetenu,
    caLocations,
    caTotal,
    chargesMatieres,
    chargesMOD,
    chargesElectricite,
    electricityIsOverride,
    totalChargesVariables,
    mcv,
    tauxMcv,
    fixedChargesBreakdown,
    amortissementsMensuels: totalAmortissementsMensuels,
    mainOeuvreFixeMensuelle: totalMainOeuvreFixe,
    totalChargesFixes: totalFraisFixesMensuels,
    resultatNet,
    tauxResultatNet,
  };

  // 8. KPI et Seuil de Rentabilité
  const unitesVendues = totalQtySold > 0 ? totalQtySold : sumDailyUnitsSold;
  const prixVenteMoyen = unitesVendues > 0 ? caProduitsRetenu / unitesVendues : 0;
  const coutVariableUnitaire = totalProducedUnits > 0 ? totalChargesVariables / totalProducedUnits : 0;
  const mcvUnitaire = prixVenteMoyen - coutVariableUnitaire;
  const seuilRentabiliteUnites =
    mcvUnitaire <= 0 ? 0 : totalFraisFixesMensuels / mcvUnitaire;
  const seuilRentabiliteFCFA = seuilRentabiliteUnites * prixVenteMoyen;
  const ratioProductionSeuil =
    seuilRentabiliteUnites > 0 ? totalProducedUnits / seuilRentabiliteUnites : 0;

  let diagnosticSeuil = '';
  let diagnosticLevel: 'ok' | 'warning' | 'danger' = 'warning';
  if (mcvUnitaire <= 0) {
    diagnosticSeuil =
      '⛔ Marge sur coût variable négative : chaque unité vendue aggrave la perte. Vérifier les consommations et tarifs.';
    diagnosticLevel = 'danger';
  } else if (totalProducedUnits >= seuilRentabiliteUnites) {
    diagnosticSeuil = `✓ Production au-dessus du seuil de rentabilité (+${Math.round(
      totalProducedUnits - seuilRentabiliteUnites
    ).toLocaleString('fr-FR')} unités)`;
    diagnosticLevel = 'ok';
  } else {
    diagnosticSeuil = `⚠ Il manque ${Math.round(
      seuilRentabiliteUnites - totalProducedUnits
    ).toLocaleString('fr-FR')} unités pour atteindre le seuil`;
    diagnosticLevel = 'warning';
  }

  const rendementCiment = sumCementSacs > 0 ? totalProducedUnits / sumCementSacs : 0;
  const productiviteJournaliere = totalProducedUnits / Math.max(1, workingDays);

  const kpi: KpiAndBreakEvenResult = {
    productionTotale: totalProducedUnits,
    rendementCiment,
    joursTravailles: workingDays,
    productiviteJournaliere,
    chiffreAffaires: caTotal,
    mcv,
    tauxMcv,
    resultatNet,
    tauxResultatNet,
    prixRevientMoyen: weightedAvgCostPrice,
    unitesVendues,
    prixVenteMoyen,
    sacsCimentConsommes: sumCementSacs,
    coutVariableUnitaire,
    mcvUnitaire,
    seuilRentabiliteUnites,
    seuilRentabiliteFCFA,
    ratioProductionSeuil,
    diagnosticSeuil,
    diagnosticLevel,
  };

  // 9. Suivi des Stocks (Matières premières + Produits finis)
  const rawExits: Record<string, number> = {
    ciment: sumCementSacs,
    sable: sumSandM3,
    gravier_03: sumGrav03M3,
    gravier_38: sumGrav38M3,
  };

  const rawStockDefs = [
    { code: 'ciment', label: 'Ciment', unit: 'sacs' },
    { code: 'sable', label: 'Sable', unit: 'm³' },
    { code: 'gravier_03', label: 'Gravier 0/3', unit: 'm³' },
    { code: 'gravier_38', label: 'Gravier 3/8', unit: 'm³' },
  ];

  const stockRows: StockRowResult[] = [
    ...rawStockDefs.map((r) => {
      const bal = ledger.rawMaterialStock[r.code] ?? { opening: 0, entries: 0 };
      const exits = rawExits[r.code] || 0;
      const closing = (bal.opening || 0) + (bal.entries || 0) - exits;
      return {
        code: r.code,
        label: `${r.label} (${r.unit})`,
        category: 'matiere' as const,
        opening: bal.opening || 0,
        entries: bal.entries || 0,
        exits,
        closing,
        unit: r.unit,
        note: 'Sorties = consommation journalière calculée',
        alertNegative: closing < 0,
      };
    }),
    ...formProducts.map((p) => {
      const bal = ledger.productStock[p.code] ?? { opening: p.stockOpening || 0, entries: 0 };
      const entries = prodSumByCode[p.code] || 0;
      const exits = ledger.salesByCode[p.code]?.qtySold ?? 0;
      const closing = (bal.opening || 0) + entries - exits;
      return {
        code: p.code,
        label: p.name,
        category: 'produit' as const,
        opening: bal.opening || 0,
        entries,
        exits,
        closing,
        unit: p.unit,
        note: 'Entrées = production ; Sorties = ventes',
        alertNegative: closing < 0,
      };
    }),
  ];

  // 10. Appréciations Dashboard
  const dashboardAppreciations = [
    {
      label: 'Taux de marge sur coûts variables',
      value: tauxMcv,
      displayValue: `${(tauxMcv * 100).toFixed(1)} %`,
      thresholdDisplay: `≥ ${(config.kpiTargets.minMcvRate * 100).toFixed(0)} %`,
      ok: tauxMcv >= config.kpiTargets.minMcvRate,
      verdict: (tauxMcv >= config.kpiTargets.minMcvRate ? 'BON' : 'À AMÉLIORER') as 'BON' | 'À AMÉLIORER',
    },
    {
      label: 'Taux de résultat net',
      value: tauxResultatNet,
      displayValue: `${(tauxResultatNet * 100).toFixed(1)} %`,
      thresholdDisplay: `≥ ${(config.kpiTargets.minNetMarginRate * 100).toFixed(0)} %`,
      ok: tauxResultatNet >= config.kpiTargets.minNetMarginRate,
      verdict: (tauxResultatNet >= config.kpiTargets.minNetMarginRate ? 'BON' : 'À AMÉLIORER') as 'BON' | 'À AMÉLIORER',
    },
    {
      label: 'Rendement ciment (u/sac)',
      value: rendementCiment,
      displayValue: `${rendementCiment.toFixed(1)} u/sac`,
      thresholdDisplay: `≥ ${config.kpiTargets.minCementYield} u/sac`,
      ok: rendementCiment >= config.kpiTargets.minCementYield,
      verdict: (rendementCiment >= config.kpiTargets.minCementYield ? 'BON' : 'À AMÉLIORER') as 'BON' | 'À AMÉLIORER',
    },
  ];

  // 11. Alertes intelligentes inter-modules
  const alerts: SbsErpComputedReport['alerts'] = [];
  const negStocks = stockRows.filter((s) => s.alertNegative);
  if (negStocks.length > 0) {
    alerts.push({
      id: 'alert-neg-stocks',
      severity: 'warning',
      module: 'Stocks',
      message: `${negStocks.length} article(s) affichent un stock final négatif (${negStocks
        .slice(0, 3)
        .map((s) => `${s.label}: ${s.closing}`)
        .join(', ')}) — vérifiez le stock début ou la production journalière.`,
    });
  }
  if (totalProducedUnits === 0 && sumDailyMatCost > 0) {
    alerts.push({
      id: 'alert-no-prod',
      severity: 'warning',
      module: 'Journalier',
      message: `${Math.round(sumDailyMatCost).toLocaleString(
        'fr-FR'
      )} F de matières consommées mais aucune unité produite enregistrée : les frais fixes ne peuvent pas être amortis sur les produits.`,
    });
  }
  const anomVars = varianceRows.filter((v) => v.status === 'alert');
  if (anomVars.length > 0) {
    alerts.push({
      id: 'alert-variance',
      severity: 'danger',
      module: 'Contrôle Matières',
      message: `Écart important Réel vs Théorique sur : ${anomVars.map((v) => v.label).join(', ')}.`,
    });
  }
  const badComp = costRows.filter((c) => c.compactnessLevel === 'danger');
  if (badComp.length > 0) {
    alerts.push({
      id: 'alert-compactness',
      severity: 'danger',
      module: 'Formulation',
      message: `Compacité anormale détectée sur : ${badComp.map((c) => c.code).join(', ')}.`,
    });
  }

  return {
    rawMaterialRates,
    totalChargesFixesBase,
    totalAmortissementsMensuels,
    totalMainOeuvreFixe,
    totalFraisFixesMensuels,
    dailyRows,
    dailyTotals: {
      productionByCode: prodSumByCode,
      totalProducedUnits,
      cementSacs: sumCementSacs,
      sandM3: sumSandM3,
      gravier03M3: sumGrav03M3,
      gravier38M3: sumGrav38M3,
      waterL: sumWaterL,
      materialCostFCFA: sumDailyMatCost,
      dailyRevenueFCFA: sumDailyCA,
      unitsSold: sumDailyUnitsSold,
      workingDays,
    },
    varianceRows,
    costRows,
    costTotals: {
      totalProducedUnits,
      weightedAvgCostPrice,
      totalMaterialCostMonth: totalMaterialCostTheoreticalMonth,
    },
    saleRows,
    saleTotals: {
      qtySold: totalQtySold,
      revenueFCFA: totalRevenueDetailed,
      totalMarginFCFA: totalMarginDetailed,
    },
    incomeStatement,
    kpi,
    stockRows,
    dashboardAppreciations,
    alerts,
  };
}
