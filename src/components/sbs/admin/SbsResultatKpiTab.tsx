'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Target, Sliders } from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type { SbsMonthlyLedgerData } from '@/lib/sbsErpDefaults';
import { fmtFCFA, fmtNum, fmtPct, MONTHS_FR } from './sbsFormat';

export default function SbsResultatKpiTab({
  ledger,
  computed,
  onChangeLedger,
}: {
  ledger: SbsMonthlyLedgerData;
  computed: SbsErpComputedReport;
  onChangeLedger: (next: SbsMonthlyLedgerData) => void;
}) {
  const { incomeStatement: inc, kpi } = computed;
  const monthLabel = `${MONTHS_FR[(ledger.month - 1) % 12] || ledger.month} ${ledger.year}`;

  // Simulateur interactif de rentabilité ("What-if")
  const [simUnits, setSimUnits] = useState<number>(Math.max(1500, kpi.productionTotale || 2500));
  const simPv = kpi.prixVenteMoyen > 0 ? kpi.prixVenteMoyen : 600;
  const simCvUnit = kpi.coutVariableUnitaire > 0 ? kpi.coutVariableUnitaire : 350;
  const simCa = simUnits * simPv + inc.caLocations;
  const simMcv = simCa - simUnits * simCvUnit;
  const simNet = simMcv - inc.totalChargesFixes;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Compte de Résultat Mensuel (7 colonnes) */}
      <div className="lg:col-span-7 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-title font-bold text-lg text-brand-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-accent-500" />
              Compte de Résultat Mensuel — {monthLabel}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Alimenté en temps réel par les Ventes, Locations, Journalier (consommations réelles) et Paramètres.
            </p>
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="bg-brand-900 text-white text-left">
              <th className="py-2.5 px-3">Rubrique</th>
              <th className="py-2.5 px-3 text-right">Montant (F CFA)</th>
              <th className="py-2.5 px-3 text-right">% du CA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
            <tr className="bg-emerald-50/70 dark:bg-emerald-950/30 font-bold">
              <td className="py-2.5 px-3 text-emerald-900 dark:text-emerald-200">
                CA Ventes Produits (ventes détaillées sinon CA du jour)
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(Math.round(inc.caProduitsRetenu))}
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                {fmtPct(inc.caTotal > 0 ? inc.caProduitsRetenu / inc.caTotal : 0)}
              </td>
            </tr>
            <tr className="bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold">
              <td className="py-2 px-3">CA Locations (équipements, toupies, briques)</td>
              <td className="py-2 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(Math.round(inc.caLocations))}
              </td>
              <td className="py-2 px-3 text-right font-mono tabular-nums">
                {fmtPct(inc.caTotal > 0 ? inc.caLocations / inc.caTotal : 0)}
              </td>
            </tr>
            <tr className="bg-brand-50 dark:bg-brand-900 font-bold text-sm">
              <td className="py-2.5 px-3 text-brand-900 dark:text-white">CHIFFRE D&apos;AFFAIRES TOTAL</td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(Math.round(inc.caTotal))}
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">100,0 %</td>
            </tr>

            <tr>
              <td colSpan={3} className="pt-4 pb-1 px-3 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                Charges Variables
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 pl-5">Matières premières (Journalier)</td>
              <td className="py-2 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(Math.round(inc.chargesMatieres))}
              </td>
              <td className="py-2 px-3 text-right font-mono tabular-nums text-neutral-500">
                {fmtPct(inc.caTotal > 0 ? inc.chargesMatieres / inc.caTotal : 0)}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 pl-5">Main d&apos;œuvre au tonnage ciment</td>
              <td className="py-2 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(Math.round(inc.chargesMOD))}
              </td>
              <td className="py-2 px-3 text-right font-mono tabular-nums text-neutral-500">
                {fmtPct(inc.caTotal > 0 ? inc.chargesMOD / inc.caTotal : 0)}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 pl-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Électricité</span>
                  <span className="text-[10px] text-neutral-500">
                    ({inc.electricityIsOverride ? 'Relevé réel saisi' : 'Forfait 5 % matières'})
                  </span>
                </div>
              </td>
              <td className="py-1.5 px-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder={String(Math.round(inc.chargesElectricite))}
                    value={ledger.electricityOverrideFCFA ?? ''}
                    onChange={(e) =>
                      onChangeLedger({
                        ...ledger,
                        electricityOverrideFCFA: e.target.value === '' ? null : Number(e.target.value) || 0,
                      })
                    }
                    title="Laisser vide pour le forfait 5 % ou saisir la facture Senelec réelle"
                    className="w-28 px-2 py-1 text-right rounded border border-amber-300 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                  />
                </div>
              </td>
              <td className="py-2 px-3 text-right font-mono tabular-nums text-neutral-500">
                {fmtPct(inc.caTotal > 0 ? inc.chargesElectricite / inc.caTotal : 0)}
              </td>
            </tr>
            <tr className="bg-neutral-50 dark:bg-brand-900/60 font-bold">
              <td className="py-2.5 px-3">TOTAL CHARGES VARIABLES</td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(Math.round(inc.totalChargesVariables))}
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                {fmtPct(inc.caTotal > 0 ? inc.totalChargesVariables / inc.caTotal : 0)}
              </td>
            </tr>

            <tr className="bg-emerald-50 dark:bg-emerald-950/30 font-bold text-sm">
              <td className="py-2.5 px-3 text-emerald-900 dark:text-emerald-200">
                MARGE SUR COÛTS VARIABLES (MCV)
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                {fmtFCFA(Math.round(inc.mcv))}
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                {fmtPct(inc.tauxMcv)}
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="pt-4 pb-1 px-3 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                Charges Fixes Mensuelles
              </td>
            </tr>
            {inc.fixedChargesBreakdown.map((f) => (
              <tr key={f.label}>
                <td className="py-1.5 px-3 pl-5 text-neutral-600 dark:text-neutral-300">{f.label}</td>
                <td className="py-1.5 px-3 text-right font-mono tabular-nums">{fmtFCFA(Math.round(f.amount))}</td>
                <td className="py-1.5 px-3 text-right font-mono tabular-nums text-neutral-500">
                  {fmtPct(f.pctOfCa)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-1.5 px-3 pl-5 text-neutral-600 dark:text-neutral-300">Amortissements équipements</td>
              <td className="py-1.5 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(inc.amortissementsMensuels, 2)}
              </td>
              <td className="py-1.5 px-3 text-right font-mono tabular-nums text-neutral-500">
                {fmtPct(inc.caTotal > 0 ? inc.amortissementsMensuels / inc.caTotal : 0)}
              </td>
            </tr>
            <tr>
              <td className="py-1.5 px-3 pl-5 text-neutral-600 dark:text-neutral-300">Main d&apos;œuvre fixe</td>
              <td className="py-1.5 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(inc.mainOeuvreFixeMensuelle)}
              </td>
              <td className="py-1.5 px-3 text-right font-mono tabular-nums text-neutral-500">
                {fmtPct(inc.caTotal > 0 ? inc.mainOeuvreFixeMensuelle / inc.caTotal : 0)}
              </td>
            </tr>
            <tr className="bg-neutral-50 dark:bg-brand-900/60 font-bold">
              <td className="py-2.5 px-3">TOTAL CHARGES FIXES</td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(inc.totalChargesFixes, 2)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                {fmtPct(inc.caTotal > 0 ? inc.totalChargesFixes / inc.caTotal : 0)}
              </td>
            </tr>

            <tr
              className={`font-bold text-base ${
                inc.resultatNet >= 0
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200'
              }`}
            >
              <td className="py-3 px-3">RÉSULTAT NET</td>
              <td className="py-3 px-3 text-right font-mono tabular-nums">
                {fmtFCFA(Math.round(inc.resultatNet))}
              </td>
              <td className="py-3 px-3 text-right font-mono tabular-nums">{fmtPct(inc.tauxResultatNet)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* KPIs + Seuil de Rentabilité + Simulateur (5 colonnes) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-4">
          <h3 className="font-title font-bold text-base text-brand-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-500" />
            KPI &amp; Seuil de Rentabilité
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-m bg-neutral-50 dark:bg-brand-900">
              <span className="text-neutral-500 block">Seuil (unités)</span>
              <span className="text-lg font-mono font-bold tabular-nums text-brand-900 dark:text-white">
                {fmtNum(Math.round(kpi.seuilRentabiliteUnites))} u
              </span>
            </div>
            <div className="p-3 rounded-m bg-neutral-50 dark:bg-brand-900">
              <span className="text-neutral-500 block">Seuil (F CFA)</span>
              <span className="text-lg font-mono font-bold tabular-nums text-brand-900 dark:text-white">
                {fmtFCFA(Math.round(kpi.seuilRentabiliteFCFA))}
              </span>
            </div>
            <div className="p-3 rounded-m bg-neutral-50 dark:bg-brand-900">
              <span className="text-neutral-500 block">Prix de vente moyen</span>
              <span className="text-base font-mono font-bold tabular-nums">
                {fmtFCFA(kpi.prixVenteMoyen, 0)} /u
              </span>
            </div>
            <div className="p-3 rounded-m bg-neutral-50 dark:bg-brand-900">
              <span className="text-neutral-500 block">MCV unitaire</span>
              <span className="text-base font-mono font-bold tabular-nums text-emerald-600">
                {fmtFCFA(kpi.mcvUnitaire, 0)} /u
              </span>
            </div>
            <div className="p-3 rounded-m bg-neutral-50 dark:bg-brand-900">
              <span className="text-neutral-500 block">Rendement ciment</span>
              <span className="text-base font-mono font-bold tabular-nums">
                {fmtNum(kpi.rendementCiment, 1)} u/sac
              </span>
            </div>
            <div className="p-3 rounded-m bg-neutral-50 dark:bg-brand-900">
              <span className="text-neutral-500 block">Productivité / jour</span>
              <span className="text-base font-mono font-bold tabular-nums">
                {fmtNum(kpi.productiviteJournaliere, 0)} u/j
              </span>
            </div>
          </div>

          <div
            className={`p-3 rounded-m text-xs font-semibold ${
              kpi.diagnosticLevel === 'ok'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200'
                : kpi.diagnosticLevel === 'danger'
                ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-200'
            }`}
          >
            {kpi.diagnosticSeuil}
          </div>
        </div>

        {/* Simulateur What-If */}
        <div className="bg-brand-900 text-white rounded-l p-5 shadow-elev-2 space-y-4">
          <div className="flex items-center gap-2 text-sm font-title font-bold">
            <Sliders className="w-4 h-4 text-amber-400" />
            Simulateur d&apos;Objectif Mensuel
          </div>
          <p className="text-[11px] text-brand-200">
            Testez votre volume de production mensuel pour anticiper l&apos;absorption des charges fixes ({fmtFCFA(Math.round(inc.totalChargesFixes))}).
          </p>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Volume simulé</span>
              <span className="font-mono font-bold text-amber-400 tabular-nums">
                {fmtNum(simUnits)} unités / mois
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={15000}
              step={100}
              value={simUnits}
              onChange={(e) => setSimUnits(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-brand-700">
            <div>
              <span className="text-brand-300 block">CA projeté</span>
              <span className="font-mono font-bold text-base tabular-nums">{fmtFCFA(Math.round(simCa))}</span>
            </div>
            <div>
              <span className="text-brand-300 block">Résultat net simulé</span>
              <span
                className={`font-mono font-bold text-base tabular-nums ${
                  simNet >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {fmtFCFA(Math.round(simNet))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
