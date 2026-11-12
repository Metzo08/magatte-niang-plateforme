'use client';

import React from 'react';
import { Calculator, Sparkles, Info } from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type { SbsProductItem } from '@/lib/sbsErpDefaults';
import { fmtFCFA, fmtNum, fmtPct } from './sbsFormat';

export default function SbsPrixRevientTab({
  products,
  computed,
  onApplyPriceToCatalog,
}: {
  products: SbsProductItem[];
  computed: SbsErpComputedReport;
  onApplyPriceToCatalog: (product: SbsProductItem, newPrice: number) => Promise<void>;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-2">
        <h2 className="font-title font-bold text-lg text-brand-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent-500" />
          Prix de Revient Unitaire, Compacité &amp; Tarifs Conseillés
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-300">
          Calculé automatiquement à partir des formulations, rendements et du volume produit dans le mois. Les blocs{' '}
          <strong>pleins (15×20×40 &amp; 20×20×40)</strong> valident une compacité cible ≥ 85 %, les creux/hourdis entre 25 % et 78 %.
        </p>
      </div>

      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-brand-900 text-white text-left">
              <tr>
                <th className="py-2.5 px-2.5">Code</th>
                <th className="py-2.5 px-2.5">Désignation</th>
                <th className="py-2.5 px-2 text-right">Rend. (u/sac)</th>
                <th className="py-2.5 px-2 text-right">Qté mois</th>
                <th className="py-2.5 px-2 text-right">Coût mat.</th>
                <th className="py-2.5 px-2 text-right">MOD/u</th>
                <th className="py-2.5 px-2 text-right">Poids</th>
                <th className="py-2.5 px-2 text-right">Compacité</th>
                <th className="py-2.5 px-2">Diagnostic</th>
                <th className="py-2.5 px-2 text-right">F. fixes/u</th>
                <th className="py-2.5 px-2.5 text-right bg-emerald-900">PRIX REVIENT</th>
                <th className="py-2.5 px-2 text-right">PV +30%</th>
                <th className="py-2.5 px-2 text-right">PV +35%</th>
                <th className="py-2.5 px-2 text-right">PV +40%</th>
                <th className="py-2.5 px-2 text-right">TTC 35%</th>
                <th className="py-2.5 px-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {computed.costRows.map((c) => {
                const prod = products.find((p) => p.id === c.productId);
                return (
                  <tr key={c.code} className="hover:bg-neutral-50 dark:hover:bg-brand-900/40">
                    <td className="py-2.5 px-2.5 font-mono font-bold text-brand-900 dark:text-white">
                      {c.code}
                    </td>
                    <td className="py-2.5 px-2.5 font-medium whitespace-nowrap">{c.name}</td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">{c.rendementPerSac}</td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">{fmtNum(c.qtyProducedMonth)}</td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      {fmtFCFA(c.materialCostPerUnit, 1)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      {fmtFCFA(c.modCostPerUnit, 1)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      {fmtNum(c.weightKgPerUnit, 1)} kg
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold tabular-nums">
                      {fmtPct(c.compactness, 1)}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.compactnessLevel === 'ok'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : c.compactnessLevel === 'danger'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}
                      >
                        {c.compactnessDiagnostic}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      {fmtFCFA(c.fixedCostPerUnit, 1)}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-bold tabular-nums bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200">
                      {fmtFCFA(c.totalCostPricePerUnit, 2)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      {fmtNum(Math.round(c.suggestedPrice30))}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold tabular-nums text-brand-900 dark:text-white">
                      {fmtNum(Math.round(c.suggestedPrice35))}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      {fmtNum(Math.round(c.suggestedPrice40))}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-accent-600">
                      {fmtNum(Math.round(c.suggestedPriceTTC35))}
                    </td>
                    <td className="py-2.5 px-2.5 text-right">
                      {prod && (
                        <button
                          type="button"
                          onClick={() => onApplyPriceToCatalog(prod, Math.round(c.suggestedPrice35))}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand-900 hover:bg-brand-800 text-white text-[10px] font-bold whitespace-nowrap"
                          title={`Mettre à jour le tarif public à ${Math.round(c.suggestedPrice35)} F`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" /> +35%
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-brand-50 dark:bg-brand-900 font-bold border-t-2 border-brand-900 dark:border-brand-600">
              <tr>
                <td colSpan={3} className="py-3 px-2.5">TOTAL / MOYENNE PONDÉRÉE</td>
                <td className="py-3 px-2 text-right font-mono tabular-nums">
                  {fmtNum(computed.costTotals.totalProducedUnits)}
                </td>
                <td colSpan={6} />
                <td className="py-3 px-2.5 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                  {fmtFCFA(computed.costTotals.weightedAvgCostPrice, 2)}
                </td>
                <td colSpan={5} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes pédagogiques Excel préservées */}
      <div className="bg-brand-50 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-700 rounded-l p-4 text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
        <div className="font-bold text-brand-900 dark:text-white flex items-center gap-1.5">
          <Info className="w-4 h-4 text-brand-500" /> Notes techniques de calcul
        </div>
        <p>• Les frais fixes par unité dépendent du volume produit dans le mois (frais fixes ÷ production du mois) : plus vous produisez, plus ce poste baisse.</p>
        <p>• Contrôle de compacité : un bloc PLEIN doit approcher 85–100 % ; un bloc CREUX ou HOURDIS reste entre 25 % et 78 %.</p>
        <p>• Ce tableau calcule le prix de revient théorique d&apos;après la formulation ; le Compte de Résultat utilise les consommations réelles saisies dans le Journalier.</p>
      </div>
    </div>
  );
}
