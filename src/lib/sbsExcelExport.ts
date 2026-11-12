import type { SbsErpComputedReport } from './sbsErpCalc';
import type { SbsFactoryConfigData, SbsMonthlyLedgerData, SbsProductItem } from './sbsErpDefaults';

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function escXml(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cell(val: string | number | null | undefined, style?: string): string {
  const s = style ? ` ss:StyleID="${style}"` : '';
  if (typeof val === 'number' && Number.isFinite(val)) {
    return `<Cell${s}><Data ss:Type="Number">${val}</Data></Cell>`;
  }
  return `<Cell${s}><Data ss:Type="String">${escXml(val ?? '')}</Data></Cell>`;
}

function row(cells: string[]): string {
  return `<Row>${cells.join('')}</Row>`;
}

function worksheet(name: string, rows: string[]): string {
  return `<Worksheet ss:Name="${escXml(name.slice(0, 31))}"><Table>${rows.join('')}</Table></Worksheet>`;
}

/**
 * Génère et télécharge un classeur multi-feuilles compatible Microsoft Excel / LibreOffice
 * reprenant les 8 onglets SBS Industrie + Catalogue & Locations.
 */
export function downloadSbsExcelWorkbook(
  config: SbsFactoryConfigData,
  products: SbsProductItem[],
  ledger: SbsMonthlyLedgerData,
  computed: SbsErpComputedReport
): void {
  const monthLabel = `${MONTHS_FR[(ledger.month - 1) % 12] || ledger.month} ${ledger.year}`;

  const wsDashboard = worksheet('Dashboard', [
    row([cell(`SBS INDUSTRIE — TABLEAU DE BORD (${monthLabel})`, 'Title')]),
    row([cell('CA Total (F)', 'Header'), cell('Production (u)', 'Header'), cell('MCV (F)', 'Header'), cell('Résultat net (F)', 'Header'), cell('Taux MCV', 'Header'), cell('Prix revient moyen (F/u)', 'Header')]),
    row([
      cell(Math.round(computed.incomeStatement.caTotal)),
      cell(computed.kpi.productionTotale),
      cell(Math.round(computed.incomeStatement.mcv)),
      cell(Math.round(computed.incomeStatement.resultatNet)),
      cell(`${(computed.incomeStatement.tauxMcv * 100).toFixed(1)} %`),
      cell(Math.round(computed.kpi.prixRevientMoyen)),
    ]),
    row([]),
    row([cell('Indicateur', 'Header'), cell('Valeur', 'Header'), cell('Seuil', 'Header'), cell('Appréciation', 'Header')]),
    ...computed.dashboardAppreciations.map((a) =>
      row([cell(a.label), cell(a.displayValue), cell(a.thresholdDisplay), cell(a.verdict)])
    ),
  ]);

  const formCodes = products.filter((p) => p.hasFormulation).map((p) => p.code);
  const wsJournalier = worksheet('Journalier', [
    row([cell(`SUIVI JOURNALIER DE PRODUCTION — ${monthLabel}`, 'Title')]),
    row([
      cell('Jour', 'Header'),
      ...formCodes.map((c) => cell(c, 'Header')),
      cell('Ciment (sacs)', 'Header'),
      cell('Sable (m³)', 'Header'),
      cell('Grav. 0/3 (m³)', 'Header'),
      cell('Grav. 3/8 (m³)', 'Header'),
      cell('Eau (L)', 'Header'),
      cell('Coût matières (F)', 'Header'),
      cell('CA du jour (F)', 'Header'),
      cell('Unités vendues', 'Header'),
      cell('Note', 'Header'),
    ]),
    ...computed.dailyRows.map((d) =>
      row([
        cell(d.day),
        ...formCodes.map((c) => cell(d.productionByCode?.[c] || 0)),
        cell(d.cementSacs || 0),
        cell(d.sandM3 || 0),
        cell(d.gravier03M3 || 0),
        cell(d.gravier38M3 || 0),
        cell(d.waterL || 0),
        cell(Math.round(d.materialCostFCFA)),
        cell(Math.round(d.dailyRevenueFCFA || 0)),
        cell(d.unitsSold || 0),
        cell(d.note || ''),
      ])
    ),
    row([
      cell('TOTAL MOIS', 'Header'),
      ...formCodes.map((c) => cell(computed.dailyTotals.productionByCode[c] || 0, 'Header')),
      cell(computed.dailyTotals.cementSacs, 'Header'),
      cell(computed.dailyTotals.sandM3, 'Header'),
      cell(computed.dailyTotals.gravier03M3, 'Header'),
      cell(computed.dailyTotals.gravier38M3, 'Header'),
      cell(computed.dailyTotals.waterL, 'Header'),
      cell(Math.round(computed.dailyTotals.materialCostFCFA), 'Header'),
      cell(Math.round(computed.dailyTotals.dailyRevenueFCFA), 'Header'),
      cell(computed.dailyTotals.unitsSold, 'Header'),
      cell(`${computed.dailyTotals.workingDays} j travaillés`, 'Header'),
    ]),
  ]);

  const wsVentes = worksheet('Ventes & Locations', [
    row([cell(`VENTES DU MOIS — ${monthLabel}`, 'Title')]),
    row([
      cell('Code', 'Header'),
      cell('Désignation', 'Header'),
      cell('Qté vendue', 'Header'),
      cell('Prix de vente (F/u)', 'Header'),
      cell('CA (F)', 'Header'),
      cell('Prix de revient (F/u)', 'Header'),
      cell('Marge unitaire (F)', 'Header'),
      cell('Marge totale (F)', 'Header'),
    ]),
    ...computed.saleRows.map((s) =>
      row([
        cell(s.code),
        cell(s.name),
        cell(s.qtySold),
        cell(s.unitPriceFCFA ?? ''),
        cell(Math.round(s.revenueFCFA)),
        cell(Number(s.costPricePerUnit.toFixed(2))),
        cell(s.unitMarginFCFA != null ? Number(s.unitMarginFCFA.toFixed(2)) : ''),
        cell(s.totalMarginFCFA != null ? Math.round(s.totalMarginFCFA) : ''),
      ])
    ),
  ]);

  const wsPrixRevient = worksheet('Prix Revient', [
    row([cell(`PRIX DE REVIENT & COMPACITÉ — ${monthLabel}`, 'Title')]),
    row([
      cell('Code', 'Header'),
      cell('Désignation', 'Header'),
      cell('Rendement (u/sac)', 'Header'),
      cell('Qté mois', 'Header'),
      cell('Coût mat. (F/u)', 'Header'),
      cell('MOD (F/u)', 'Header'),
      cell('Poids (kg/u)', 'Header'),
      cell('Compacité (%)', 'Header'),
      cell('Diagnostic', 'Header'),
      cell('Frais fixes (F/u)', 'Header'),
      cell('Prix revient (F/u)', 'Header'),
      cell('PV +35 %', 'Header'),
      cell('PV TTC 35 %', 'Header'),
    ]),
    ...computed.costRows.map((c) =>
      row([
        cell(c.code),
        cell(c.name),
        cell(c.rendementPerSac),
        cell(c.qtyProducedMonth),
        cell(Number(c.materialCostPerUnit.toFixed(2))),
        cell(Number(c.modCostPerUnit.toFixed(2))),
        cell(Number(c.weightKgPerUnit.toFixed(2))),
        cell(Number((c.compactness * 100).toFixed(1))),
        cell(c.compactnessDiagnostic),
        cell(Number(c.fixedCostPerUnit.toFixed(2))),
        cell(Number(c.totalCostPricePerUnit.toFixed(2))),
        cell(Math.round(c.suggestedPrice35)),
        cell(Math.round(c.suggestedPriceTTC35)),
      ])
    ),
  ]);

  const wsCompteResultat = worksheet('Compte Resultat', [
    row([cell(`COMPTE DE RÉSULTAT — ${monthLabel}`, 'Title')]),
    row([cell('Rubrique', 'Header'), cell('Montant (F CFA)', 'Header'), cell('% du CA', 'Header')]),
    row([cell('CA Ventes Produits'), cell(Math.round(computed.incomeStatement.caProduitsRetenu)), cell('100 %')]),
    row([cell('CA Locations'), cell(Math.round(computed.incomeStatement.caLocations)), cell('')]),
    row([cell('CA TOTAL', 'Header'), cell(Math.round(computed.incomeStatement.caTotal), 'Header'), cell('100 %', 'Header')]),
    row([cell('Matières premières'), cell(Math.round(computed.incomeStatement.chargesMatieres)), cell('')]),
    row([cell("Main d'œuvre tonnage"), cell(Math.round(computed.incomeStatement.chargesMOD)), cell('')]),
    row([cell('Électricité'), cell(Math.round(computed.incomeStatement.chargesElectricite)), cell('')]),
    row([cell('MARGE SUR COÛTS VARIABLES (MCV)', 'Header'), cell(Math.round(computed.incomeStatement.mcv), 'Header'), cell(`${(computed.incomeStatement.tauxMcv * 100).toFixed(1)} %`, 'Header')]),
    row([cell('TOTAL CHARGES FIXES'), cell(Math.round(computed.incomeStatement.totalChargesFixes)), cell('')]),
    row([cell('RÉSULTAT NET', 'Header'), cell(Math.round(computed.incomeStatement.resultatNet), 'Header'), cell(`${(computed.incomeStatement.tauxResultatNet * 100).toFixed(1)} %`, 'Header')]),
  ]);

  const wsStocks = worksheet('Stocks', [
    row([cell(`SUIVI DES STOCKS — ${monthLabel}`, 'Title')]),
    row([cell('Article', 'Header'), cell('Stock début', 'Header'), cell('Entrées', 'Header'), cell('Sorties', 'Header'), cell('Stock fin', 'Header'), cell('Note', 'Header')]),
    ...computed.stockRows.map((s) =>
      row([cell(s.label), cell(s.opening), cell(s.entries), cell(s.exits), cell(s.closing), cell(s.note)])
    ),
  ]);

  const wsCatalogue = worksheet('Catalogue & Parametres', [
    row([cell(`${config.companyName} — CATALOGUE OFFICIEL (${config.phone})`, 'Title')]),
    row([cell('Code', 'Header'), cell('Famille', 'Header'), cell('Désignation', 'Header'), cell('Dimensions', 'Header'), cell('Prix public (F CFA)', 'Header'), cell('Unité', 'Header'), cell('Disponibilité', 'Header')]),
    ...products.map((p) =>
      row([cell(p.code), cell(p.family), cell(p.name), cell(p.dimensions), cell(p.sellingPriceFCFA), cell(p.unit), cell(p.availability)])
    ),
  ]);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Title"><Font ss:Bold="1" ss:Size="13" ss:Color="#0B1B2B"/></Style>
  <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#1B4965" ss:Pattern="Solid"/></Style>
 </Styles>
 ${wsDashboard}
 ${wsJournalier}
 ${wsVentes}
 ${wsPrixRevient}
 ${wsCompteResultat}
 ${wsStocks}
 ${wsCatalogue}
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SBS_INDUSTRIE_ERP_${ledger.year}_${String(ledger.month).padStart(2, '0')}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
