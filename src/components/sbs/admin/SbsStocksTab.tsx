'use client';

import React from 'react';
import { PackageCheck, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type { SbsMonthlyLedgerData } from '@/lib/sbsErpDefaults';
import { fmtNum, MONTHS_FR } from './sbsFormat';

export default function SbsStocksTab({
  ledger,
  computed,
  onChangeLedger,
  onRolloverToNextMonth,
}: {
  ledger: SbsMonthlyLedgerData;
  computed: SbsErpComputedReport;
  onChangeLedger: (next: SbsMonthlyLedgerData) => void;
  onRolloverToNextMonth: () => Promise<void>;
}) {
  const monthLabel = `${MONTHS_FR[(ledger.month - 1) % 12] || ledger.month} ${ledger.year}`;

  const rawRows = computed.stockRows.filter((s) => s.category === 'matiere');
  const prodRows = computed.stockRows.filter((s) => s.category === 'produit');

  const updateRawStock = (code: string, field: 'opening' | 'entries', val: number) => {
    const prev = ledger.rawMaterialStock[code] ?? { opening: 0, entries: 0 };
    onChangeLedger({
      ...ledger,
      rawMaterialStock: {
        ...ledger.rawMaterialStock,
        [code]: {
          ...prev,
          [field]: val,
        },
      },
    });
  };

  const updateProductOpening = (code: string, val: number) => {
    const prev = ledger.productStock[code] ?? { opening: 0, entries: 0 };
    onChangeLedger({
      ...ledger,
      productStock: {
        ...ledger.productStock,
        [code]: {
          ...prev,
          opening: val,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-title font-bold text-lg text-brand-900 dark:text-white flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-accent-500" />
            Suivi des Stocks (Matières Premières &amp; Produits Finis) — {monthLabel}
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
            Les sorties matières et productions/ventes produits sont calculées automatiquement depuis le Journalier et les Ventes.
          </p>
        </div>

        <button
          type="button"
          onClick={onRolloverToNextMonth}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-brand-900 hover:bg-brand-800 dark:bg-accent-500 dark:hover:bg-accent-600 text-white text-xs font-bold shrink-0"
        >
          <ArrowRightCircle className="w-4 h-4" />
          Reporter les stocks finaux au mois suivant
        </button>
      </div>

      {/* Matières premières */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1">
        <div className="p-4 border-b border-neutral-200 dark:border-brand-700 font-title font-bold text-sm text-brand-900 dark:text-white">
          1. Matières Premières (Sorties = consommations journalières)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-900 text-white text-left">
              <tr>
                <th className="py-2.5 px-3">Matière</th>
                <th className="py-2.5 px-3 text-right">Stock début</th>
                <th className="py-2.5 px-3 text-right">Entrées / Livraisons</th>
                <th className="py-2.5 px-3 text-right">Sorties (calculées)</th>
                <th className="py-2.5 px-3 text-right">Stock fin</th>
                <th className="py-2.5 px-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {rawRows.map((r) => (
                <tr key={r.code}>
                  <td className="py-2 px-3 font-semibold">{r.label}</td>
                  <td className="py-1.5 px-3 text-right">
                    <input
                      type="number"
                      step="0.5"
                      value={r.opening}
                      onChange={(e) => updateRawStock(r.code, 'opening', Number(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-right rounded border border-amber-300 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="py-1.5 px-3 text-right">
                    <input
                      type="number"
                      step="0.5"
                      value={r.entries}
                      onChange={(e) => updateRawStock(r.code, 'entries', Number(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-right rounded border border-amber-300 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                    {fmtNum(r.exits, 1)}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono font-bold tabular-nums ${
                      r.alertNegative ? 'text-red-600 bg-red-50 dark:bg-red-950/30' : 'text-emerald-600'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {r.alertNegative && <AlertTriangle className="w-3.5 h-3.5" />}
                      {fmtNum(r.closing, 1)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-neutral-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Produits finis */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1">
        <div className="p-4 border-b border-neutral-200 dark:border-brand-700 font-title font-bold text-sm text-brand-900 dark:text-white">
          2. Produits Finis (Entrées = Production · Sorties = Ventes)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-900 text-white text-left">
              <tr>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Produit</th>
                <th className="py-2.5 px-3 text-right">Stock début</th>
                <th className="py-2.5 px-3 text-right">Entrées (Prod.)</th>
                <th className="py-2.5 px-3 text-right">Sorties (Ventes)</th>
                <th className="py-2.5 px-3 text-right">Stock fin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {prodRows.map((p) => (
                <tr key={p.code}>
                  <td className="py-2 px-3 font-mono font-bold text-brand-900 dark:text-white">{p.code}</td>
                  <td className="py-2 px-3 font-medium">{p.label}</td>
                  <td className="py-1.5 px-3 text-right">
                    <input
                      type="number"
                      value={p.opening}
                      onChange={(e) => updateProductOpening(p.code, Number(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-right rounded border border-amber-300 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                    +{fmtNum(p.entries)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-amber-700 dark:text-amber-300">
                    -{fmtNum(p.exits)}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono font-bold tabular-nums ${
                      p.alertNegative ? 'text-red-600 bg-red-50 dark:bg-red-950/30' : 'text-emerald-600'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {p.alertNegative && <AlertTriangle className="w-3.5 h-3.5" />}
                      {fmtNum(p.closing)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
