'use client';

import React, { useMemo, useState } from 'react';
import { Calendar, Edit3, CheckCircle2, AlertTriangle, X, Save } from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type { SbsDailyEntry, SbsMonthlyLedgerData, SbsProductItem } from '@/lib/sbsErpDefaults';
import { fmtFCFA, fmtNum, fmtPct, MONTHS_FR } from './sbsFormat';

export default function SbsJournalierTab({
  products,
  ledger,
  computed,
  onChangeLedger,
}: {
  products: SbsProductItem[];
  ledger: SbsMonthlyLedgerData;
  computed: SbsErpComputedReport;
  onChangeLedger: (next: SbsMonthlyLedgerData) => void;
}) {
  const formProducts = useMemo(
    () => products.filter((p) => p.hasFormulation).sort((a, b) => a.sortOrder - b.sortOrder),
    [products]
  );

  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const monthLabel = `${MONTHS_FR[(ledger.month - 1) % 12] || ledger.month} ${ledger.year}`;

  const updateDayField = (
    dayNum: number,
    patch: Partial<SbsDailyEntry>,
    prodPatch?: Record<string, number>
  ) => {
    const nextEntries = Array.from({ length: 31 }, (_, i) => {
      const d = i + 1;
      const existing = ledger.dailyEntries.find((x) => x.day === d) ?? {
        day: d,
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
      if (d !== dayNum) return existing;
      return {
        ...existing,
        ...patch,
        productionByCode: prodPatch
          ? { ...(existing.productionByCode || {}), ...prodPatch }
          : existing.productionByCode || {},
      };
    });
    onChangeLedger({ ...ledger, dailyEntries: nextEntries });
  };

  const rowsToDisplay = showOnlyActive
    ? computed.dailyRows.filter(
        (d) =>
          d.totalUnitsProduced > 0 ||
          d.cementSacs > 0 ||
          d.sandM3 > 0 ||
          d.gravier03M3 > 0 ||
          d.gravier38M3 > 0 ||
          d.waterL > 0 ||
          d.dailyRevenueFCFA > 0 ||
          d.unitsSold > 0
      )
    : computed.dailyRows;

  const activeDayRow =
    editingDay != null ? computed.dailyRows.find((r) => r.day === editingDay) ?? null : null;

  return (
    <div className="space-y-6">
      {/* Header & Légende Jaune/Vert */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-title font-bold text-lg text-brand-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-500" />
            Suivi Journalier de Production &amp; Consommations — {monthLabel}
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
            Saisissez les quantités produites par type d&apos;agglo/hourdis + votre relevé réel de matières (ciment, sable, graviers, eau) et le CA du jour. Cliquez sur un jour pour la fiche rapide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 font-semibold">
            Jaune = Saisie manuelle
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-semibold">
            Vert = Calculé auto
          </span>
          <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-neutral-700 dark:text-neutral-200">
            <input
              type="checkbox"
              checked={showOnlyActive}
              onChange={(e) => setShowOnlyActive(e.target.checked)}
            />
            Masquer jours vides
          </label>
        </div>
      </div>

      {/* Table 31 Jours */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead className="bg-brand-900 text-white">
              <tr>
                <th className="py-2.5 px-2 text-left sticky left-0 bg-brand-900 z-10">Jour</th>
                {formProducts.map((p) => (
                  <th key={p.code} className="py-2.5 px-1.5 text-right whitespace-nowrap" title={p.name}>
                    {p.code}
                  </th>
                ))}
                <th className="py-2.5 px-2 text-right whitespace-nowrap bg-brand-800">Cim. (sacs)</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap bg-brand-800">Sable (m³)</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap bg-brand-800">0/3 (m³)</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap bg-brand-800">3/8 (m³)</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap bg-brand-800">Eau (L)</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap bg-emerald-900">Coût mat.</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap">CA jour (F)</th>
                <th className="py-2.5 px-2 text-right whitespace-nowrap">U. vendues</th>
                <th className="py-2.5 px-2 text-center">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {rowsToDisplay.map((d) => (
                <tr key={d.day} className="hover:bg-neutral-50 dark:hover:bg-brand-900/40">
                  <td className="py-1.5 px-2 font-mono font-bold text-brand-900 dark:text-white sticky left-0 bg-white dark:bg-brand-800 border-r border-neutral-100 dark:border-brand-700">
                    J{String(d.day).padStart(2, '0')}
                  </td>
                  {formProducts.map((p) => (
                    <td key={p.code} className="p-1">
                      <input
                        type="number"
                        min={0}
                        value={d.productionByCode?.[p.code] || ''}
                        onChange={(e) =>
                          updateDayField(d.day, {}, { [p.code]: Math.max(0, Number(e.target.value) || 0) })
                        }
                        placeholder="0"
                        className="w-14 px-1.5 py-1 text-right rounded border border-amber-200 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                      />
                    </td>
                  ))}
                  <td className="p-1">
                    <input
                      type="number"
                      min={0}
                      step="0.5"
                      value={d.cementSacs || ''}
                      onChange={(e) => updateDayField(d.day, { cementSacs: Number(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-14 px-1.5 py-1 text-right rounded border border-amber-300 dark:border-brand-700 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums font-bold"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={d.sandM3 || ''}
                      onChange={(e) => updateDayField(d.day, { sandM3: Number(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-14 px-1.5 py-1 text-right rounded border border-amber-200 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={d.gravier03M3 || ''}
                      onChange={(e) => updateDayField(d.day, { gravier03M3: Number(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-14 px-1.5 py-1 text-right rounded border border-amber-200 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={d.gravier38M3 || ''}
                      onChange={(e) => updateDayField(d.day, { gravier38M3: Number(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-14 px-1.5 py-1 text-right rounded border border-amber-200 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min={0}
                      step="10"
                      value={d.waterL || ''}
                      onChange={(e) => updateDayField(d.day, { waterL: Number(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-14 px-1.5 py-1 text-right rounded border border-amber-200 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right font-mono font-bold tabular-nums bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
                    {fmtFCFA(Math.round(d.materialCostFCFA))}
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min={0}
                      step="100"
                      value={d.dailyRevenueFCFA || ''}
                      onChange={(e) =>
                        updateDayField(d.day, { dailyRevenueFCFA: Number(e.target.value) || 0 })
                      }
                      placeholder="0"
                      className="w-24 px-1.5 py-1 text-right rounded border border-amber-200 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      min={0}
                      value={d.unitsSold || ''}
                      onChange={(e) => updateDayField(d.day, { unitsSold: Number(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-16 px-1.5 py-1 text-right rounded border border-amber-200 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => setEditingDay(d.day)}
                      className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-brand-700 text-brand-700 dark:text-brand-200"
                      title={`Éditer la fiche complète du jour ${d.day}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-brand-50 dark:bg-brand-900 font-bold border-t-2 border-brand-900 dark:border-brand-600">
              <tr>
                <td className="py-2.5 px-2 sticky left-0 bg-brand-50 dark:bg-brand-900">
                  TOTAL ({computed.dailyTotals.workingDays}j)
                </td>
                {formProducts.map((p) => (
                  <td key={p.code} className="py-2.5 px-2 text-right font-mono tabular-nums">
                    {fmtNum(computed.dailyTotals.productionByCode[p.code] || 0)}
                  </td>
                ))}
                <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                  {fmtNum(computed.dailyTotals.cementSacs, 1)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                  {fmtNum(computed.dailyTotals.sandM3, 1)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                  {fmtNum(computed.dailyTotals.gravier03M3, 1)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                  {fmtNum(computed.dailyTotals.gravier38M3, 1)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                  {fmtNum(computed.dailyTotals.waterL)}
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                  {fmtFCFA(Math.round(computed.dailyTotals.materialCostFCFA))}
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                  {fmtFCFA(Math.round(computed.dailyTotals.dailyRevenueFCFA))}
                </td>
                <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                  {fmtNum(computed.dailyTotals.unitsSold)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bloc CONTRÔLE Réel vs Théorique de la formulation */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-3">
        <div>
          <h3 className="font-title font-bold text-base text-brand-900 dark:text-white">
            CONTRÔLE — Consommation RÉELLE saisie vs THÉORIQUE de la formulation
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Détecte automatiquement les surconsommations de ciment ou granulats, ou les oublis de saisie de production.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-brand-700 text-left text-neutral-500">
                <th className="py-2 pr-3">Matière</th>
                <th className="py-2 px-3 text-right">Réel saisi (mois)</th>
                <th className="py-2 px-3 text-right">Théorique (mois)</th>
                <th className="py-2 px-3 text-right">Écart</th>
                <th className="py-2 px-3 text-right">Écart %</th>
                <th className="py-2 pl-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {computed.varianceRows.map((v) => (
                <tr key={v.code}>
                  <td className="py-2.5 pr-3 font-semibold text-neutral-800 dark:text-neutral-100">{v.label}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{fmtNum(v.actual, 2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{fmtNum(v.theoretical, 2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                    {v.diff >= 0 ? '+' : ''}
                    {fmtNum(v.diff, 2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{fmtPct(v.diffPct)}</td>
                  <td className="py-2.5 pl-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        v.status === 'ok'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : v.status === 'alert'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}
                    >
                      {v.status === 'ok' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Conforme
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" /> Écart à vérifier
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Fiche Journalière Rapide */}
      {activeDayRow && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-elev-3 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-brand-700 pb-3">
              <h3 className="font-title font-bold text-lg text-brand-900 dark:text-white">
                Fiche Journée — Jour {activeDayRow.day} ({monthLabel})
              </h3>
              <button
                type="button"
                onClick={() => setEditingDay(null)}
                className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-brand-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-bold text-brand-900 dark:text-white mb-2">Production par produit (unités)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {formProducts.map((p) => (
                  <div key={p.code}>
                    <label className="block text-[11px] font-semibold mb-1">{p.code}</label>
                    <input
                      type="number"
                      min={0}
                      value={activeDayRow.productionByCode?.[p.code] || 0}
                      onChange={(e) =>
                        updateDayField(activeDayRow.day, {}, { [p.code]: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-amber-300 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-brand-900 dark:text-white mb-2">Consommation réelle relevée</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Ciment (sacs)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.5"
                    value={activeDayRow.cementSacs}
                    onChange={(e) => updateDayField(activeDayRow.day, { cementSacs: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Sable (m³)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={activeDayRow.sandM3}
                    onChange={(e) => updateDayField(activeDayRow.day, { sandM3: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Grav. 0/3 (m³)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={activeDayRow.gravier03M3}
                    onChange={(e) => updateDayField(activeDayRow.day, { gravier03M3: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Grav. 3/8 (m³)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={activeDayRow.gravier38M3}
                    onChange={(e) => updateDayField(activeDayRow.day, { gravier38M3: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Eau (L)</label>
                  <input
                    type="number"
                    min={0}
                    step="10"
                    value={activeDayRow.waterL}
                    onChange={(e) => updateDayField(activeDayRow.day, { waterL: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">CA du jour (F CFA)</label>
                <input
                  type="number"
                  min={0}
                  value={activeDayRow.dailyRevenueFCFA}
                  onChange={(e) =>
                    updateDayField(activeDayRow.day, { dailyRevenueFCFA: Number(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1">Unités vendues</label>
                <input
                  type="number"
                  min={0}
                  value={activeDayRow.unitsSold}
                  onChange={(e) => updateDayField(activeDayRow.day, { unitsSold: Number(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-amber-50 dark:bg-brand-950 font-mono tabular-nums"
                />
              </div>
              <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="block text-[10px] text-emerald-700 dark:text-emerald-300">Coût matières calculé</span>
                <span className="text-base font-mono font-bold text-emerald-800 dark:text-emerald-200 tabular-nums">
                  {fmtFCFA(Math.round(activeDayRow.materialCostFCFA))}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Note chantier / Observation</label>
              <input
                type="text"
                value={activeDayRow.note || ''}
                onChange={(e) => updateDayField(activeDayRow.day, { note: e.target.value })}
                className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditingDay(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-m bg-brand-900 text-white font-bold"
              >
                <Save className="w-4 h-4" /> Valider la fiche (pensez à Sauvegarder en haut)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
