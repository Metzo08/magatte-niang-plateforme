'use client';

import React from 'react';
import {
  TrendingUp,
  Factory,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Target,
  Coins,
  Layers,
  Wrench,
} from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type { SbsMonthlyLedgerData } from '@/lib/sbsErpDefaults';
import { fmtFCFA, fmtNum, fmtPct, MONTHS_FR } from './sbsFormat';

export type SbsAdminTabId =
  | 'dashboard'
  | 'catalog'
  | 'journalier'
  | 'ventes'
  | 'prix-revient'
  | 'resultat'
  | 'stocks'
  | 'parametres';

export default function SbsDashboardTab({
  computed,
  ledger,
  onNavigate,
}: {
  computed: SbsErpComputedReport;
  ledger: SbsMonthlyLedgerData;
  onNavigate: (tab: SbsAdminTabId) => void;
}) {
  const { incomeStatement: inc, kpi, dashboardAppreciations, alerts, dailyRows } = computed;
  const monthLabel = `${MONTHS_FR[(ledger.month - 1) % 12] || ledger.month} ${ledger.year}`;

  const activeDays = dailyRows.filter(
    (d) => d.totalUnitsProduced > 0 || d.dailyRevenueFCFA > 0 || d.materialCostFCFA > 0
  );
  const maxChartVal = Math.max(
    1,
    ...dailyRows.map((d) => Math.max(d.dailyRevenueFCFA || 0, d.materialCostFCFA || 0))
  );

  const seuilPct = Math.min(150, Math.round(kpi.ratioProductionSeuil * 100));

  return (
    <div className="space-y-6">
      {/* KPI Hero Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 shadow-elev-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Chiffre d&apos;affaires ({monthLabel})</span>
            <Coins className="w-4 h-4 text-accent-500" />
          </div>
          <p className="text-2xl font-mono font-bold text-brand-900 dark:text-white tabular-nums mt-2">
            {fmtFCFA(Math.round(inc.caTotal))}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 tabular-nums">
            Produits : {fmtFCFA(Math.round(inc.caProduitsRetenu))} · Loc. : {fmtFCFA(Math.round(inc.caLocations))}
          </p>
        </div>

        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 shadow-elev-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Production du mois</span>
            <Factory className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-mono font-bold text-brand-900 dark:text-white tabular-nums mt-2">
            {fmtNum(kpi.productionTotale)} <span className="text-sm font-normal">u</span>
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 tabular-nums">
            {kpi.joursTravailles} j travaillés · {fmtNum(kpi.rendementCiment, 1)} u/sac ciment
          </p>
        </div>

        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 shadow-elev-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Marge Coûts Variables (MCV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-mono font-bold text-brand-900 dark:text-white tabular-nums mt-2">
            {fmtFCFA(Math.round(inc.mcv))}
          </p>
          <p className="text-[11px] font-semibold mt-1 tabular-nums text-emerald-600 dark:text-emerald-400">
            Taux MCV : {fmtPct(inc.tauxMcv)} (cible ≥ 40 %)
          </p>
        </div>

        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 shadow-elev-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Résultat net mensuel</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <p
            className={`text-2xl font-mono font-bold tabular-nums mt-2 ${
              inc.resultatNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {fmtFCFA(Math.round(inc.resultatNet))}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 tabular-nums">
            Charges fixes : {fmtFCFA(Math.round(inc.totalChargesFixes))}
          </p>
        </div>

        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 shadow-elev-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Prix de revient moyen</span>
            <Target className="w-4 h-4 text-accent-500" />
          </div>
          <p className="text-2xl font-mono font-bold text-brand-900 dark:text-white tabular-nums mt-2">
            {kpi.prixRevientMoyen > 0 ? fmtFCFA(kpi.prixRevientMoyen, 1) : '—'}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 tabular-nums">
            PV moyen : {fmtFCFA(kpi.prixVenteMoyen, 0)} /u ({fmtNum(kpi.unitesVendues)} vendues)
          </p>
        </div>
      </div>

      {/* Alertes intelligentes inter-modules */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-l p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Points de vigilance usine ({alerts.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {alerts.map((al) => {
              const targetTab: SbsAdminTabId =
                al.module === 'Stocks'
                  ? 'stocks'
                  : al.module === 'Formulation'
                  ? 'prix-revient'
                  : 'journalier';
              return (
                <button
                  key={al.id}
                  type="button"
                  onClick={() => onNavigate(targetTab)}
                  className="text-left flex items-start justify-between gap-3 p-3 rounded-m bg-white dark:bg-brand-900 border border-amber-200 dark:border-amber-800/70 hover:border-accent-500 transition-colors"
                >
                  <div className="text-xs text-neutral-800 dark:text-neutral-200">
                    <span className="font-bold text-amber-700 dark:text-amber-400 mr-1.5">[{al.module}]</span>
                    {al.message}
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Appréciations automatiques + Seuil de rentabilité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tableau des Appréciations (réplique améliorée Dashboard Excel) */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-title font-bold text-base text-brand-900 dark:text-white">
              Appréciations de performance &amp; Seuil de rentabilité
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('resultat')}
              className="text-xs font-semibold text-accent-600 hover:underline inline-flex items-center gap-1"
            >
              Simulateur résultat <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-brand-700 text-left text-xs text-neutral-500">
                  <th className="py-2 pr-3">Indicateur</th>
                  <th className="py-2 px-3">Valeur actuelle</th>
                  <th className="py-2 px-3">Seuil cible</th>
                  <th className="py-2 pl-3 text-right">Appréciation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-brand-700/60">
                {dashboardAppreciations.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2.5 pr-3 font-medium text-neutral-800 dark:text-neutral-200">
                      {row.label}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold tabular-nums text-brand-900 dark:text-white">
                      {row.displayValue}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-neutral-500 tabular-nums">
                      {row.thresholdDisplay}
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          row.ok
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}
                      >
                        {row.ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {row.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Barre Seuil de rentabilité */}
          <div className="p-4 rounded-m bg-neutral-50 dark:bg-brand-900/70 border border-neutral-200 dark:border-brand-700 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Seuil de rentabilité : {fmtNum(Math.round(kpi.seuilRentabiliteUnites))} unités ({fmtFCFA(Math.round(kpi.seuilRentabiliteFCFA))})
              </span>
              <span className="font-mono font-bold text-accent-600 tabular-nums">
                {seuilPct} % atteint
              </span>
            </div>
            <div className="h-3 rounded-full bg-neutral-200 dark:bg-brand-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  kpi.diagnosticLevel === 'ok'
                    ? 'bg-emerald-500'
                    : kpi.diagnosticLevel === 'danger'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(2, seuilPct))}%` }}
              />
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300">{kpi.diagnosticSeuil}</p>
          </div>
        </div>

        {/* Raccourcis métier gestionnaire */}
        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-3">
          <h3 className="font-title font-bold text-base text-brand-900 dark:text-white">
            Accès rapide gestionnaire
          </h3>
          <div className="space-y-2">
            {[
              {
                tab: 'catalog' as SbsAdminTabId,
                title: 'Dimensions, Prix & Pleins',
                desc: 'Modifier 15×20×40, 20×20×40, Hourdis, Pavés, Béton & Locations',
                icon: <Layers className="w-4 h-4 text-accent-500" />,
              },
              {
                tab: 'journalier' as SbsAdminTabId,
                title: 'Saisir la production du jour',
                desc: 'Saisir agglos produits + ciment/sable/gravier consommés',
                icon: <Factory className="w-4 h-4 text-brand-500" />,
              },
              {
                tab: 'ventes' as SbsAdminTabId,
                title: 'Ventes & Locations chantiers',
                desc: 'Enregistrer ventes mensuelles et locations toupie/pompe/briques',
                icon: <Wrench className="w-4 h-4 text-amber-500" />,
              },
              {
                tab: 'prix-revient' as SbsAdminTabId,
                title: 'Vérifier Prix de revient & Compacité',
                desc: 'Ajuster rendements et appliquer les prix conseillés (+35 %)',
                icon: <Target className="w-4 h-4 text-emerald-500" />,
              },
            ].map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => onNavigate(item.tab)}
                className="w-full text-left flex items-start gap-3 p-3 rounded-m border border-neutral-200 dark:border-brand-700 hover:border-accent-500 hover:bg-neutral-50 dark:hover:bg-brand-900/50 transition-colors"
              >
                <div className="p-2 rounded-m bg-neutral-100 dark:bg-brand-900 shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-brand-900 dark:text-white">{item.title}</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Graphique Activité Journalière du Mois (31 jours) */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-title font-bold text-base text-brand-900 dark:text-white">
              Activité journalière — CA encaissé vs Coût matières (F CFA)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {activeDays.length} jour(s) avec mouvement enregistré sur {monthLabel}.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" /> CA du jour
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500" /> Coût matières
            </span>
          </div>
        </div>

        <div className="h-44 flex items-end gap-1 pt-4 border-b border-neutral-200 dark:border-brand-700 overflow-x-auto">
          {dailyRows.map((d) => {
            const caH = Math.round(((d.dailyRevenueFCFA || 0) / maxChartVal) * 100);
            const matH = Math.round(((d.materialCostFCFA || 0) / maxChartVal) * 100);
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => onNavigate('journalier')}
                title={`Jour ${d.day} — CA: ${fmtFCFA(Math.round(d.dailyRevenueFCFA || 0))} | Matières: ${fmtFCFA(
                  Math.round(d.materialCostFCFA || 0)
                )} | Prod: ${d.totalUnitsProduced} u`}
                className="flex-1 min-w-[18px] h-full flex flex-col justify-end items-center group"
              >
                <div className="w-full flex items-end justify-center gap-0.5 h-[88%]">
                  <div
                    className="w-2 rounded-t bg-emerald-500/85 group-hover:bg-emerald-400 transition-all"
                    style={{ height: `${caH > 0 ? Math.max(6, caH) : 0}%` }}
                  />
                  <div
                    className="w-2 rounded-t bg-amber-500/85 group-hover:bg-amber-400 transition-all"
                    style={{ height: `${matH > 0 ? Math.max(6, matH) : 0}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 group-hover:text-accent-500 py-1">
                  {d.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
