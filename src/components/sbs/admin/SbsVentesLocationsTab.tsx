'use client';

import React, { useState } from 'react';
import { ShoppingBag, Wrench, Plus, Trash2, RefreshCw } from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type {
  SbsMonthlyLedgerData,
  SbsProductItem,
  SbsRentalBooking,
} from '@/lib/sbsErpDefaults';
import { fmtFCFA, fmtNum, MONTHS_FR } from './sbsFormat';

export default function SbsVentesLocationsTab({
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
  const monthLabel = `${MONTHS_FR[(ledger.month - 1) % 12] || ledger.month} ${ledger.year}`;

  const [rentalDraft, setRentalDraft] = useState({
    date: new Date().toISOString().slice(0, 10),
    clientName: '',
    clientPhone: '',
    itemCode: products.find((p) => p.isRental)?.code || products[0]?.code || 'LOC-TOUPIE',
    qty: '1',
    days: '1',
    unitRateFCFA: String(products.find((p) => p.isRental)?.sellingPriceFCFA || 150000),
    status: 'En cours' as SbsRentalBooking['status'],
    notes: '',
  });

  const updateSaleLine = (code: string, patch: { qtySold?: number; unitPriceFCFA?: number | null }) => {
    const prev = ledger.salesByCode[code] ?? { qtySold: 0, unitPriceFCFA: null };
    onChangeLedger({
      ...ledger,
      salesByCode: {
        ...ledger.salesByCode,
        [code]: {
          ...prev,
          ...patch,
        },
      },
    });
  };

  const applyCatalogPrices = () => {
    const nextSales = { ...ledger.salesByCode };
    for (const p of products) {
      if (p.hasFormulation || nextSales[p.code]) {
        nextSales[p.code] = {
          qtySold: nextSales[p.code]?.qtySold ?? 0,
          unitPriceFCFA: p.sellingPriceFCFA,
        };
      }
    }
    onChangeLedger({ ...ledger, salesByCode: nextSales });
  };

  const addRentalBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentalDraft.clientName.trim()) return;
    const item = products.find((p) => p.code === rentalDraft.itemCode);
    const qty = Math.max(1, Number(rentalDraft.qty) || 1);
    const days = Math.max(1, Number(rentalDraft.days) || 1);
    const rate = Math.max(0, Number(rentalDraft.unitRateFCFA) || 0);
    const booking: SbsRentalBooking = {
      id: `loc-${Date.now()}`,
      date: rentalDraft.date,
      clientName: rentalDraft.clientName.trim(),
      clientPhone: rentalDraft.clientPhone.trim(),
      itemCode: rentalDraft.itemCode,
      itemName: item?.name || rentalDraft.itemCode,
      qty,
      days,
      unitRateFCFA: rate,
      totalFCFA: qty * days * rate,
      status: rentalDraft.status,
      notes: rentalDraft.notes.trim(),
    };
    onChangeLedger({
      ...ledger,
      rentalBookings: [booking, ...(ledger.rentalBookings || [])],
    });
    setRentalDraft({ ...rentalDraft, clientName: '', clientPhone: '', notes: '' });
  };

  const updateRentalStatus = (id: string, status: SbsRentalBooking['status']) => {
    onChangeLedger({
      ...ledger,
      rentalBookings: (ledger.rentalBookings || []).map((r) => (r.id === id ? { ...r, status } : r)),
    });
  };

  const deleteRental = (id: string) => {
    onChangeLedger({
      ...ledger,
      rentalBookings: (ledger.rentalBookings || []).filter((r) => r.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Ventes du mois */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-title font-bold text-lg text-brand-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent-500" />
              Ventes du mois — {monthLabel}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Lié au module Prix de revient : calcule automatiquement le CA et la marge nette unitaire par produit.
            </p>
          </div>
          <button
            type="button"
            onClick={applyCatalogPrices}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-m border border-brand-300 dark:border-brand-600 text-xs font-bold text-brand-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-brand-900"
          >
            <RefreshCw className="w-3.5 h-3.5 text-accent-500" />
            Aligner sur tarifs catalogue publics
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-900 text-white text-left">
              <tr>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Désignation</th>
                <th className="py-2.5 px-3 text-right">Qté vendue</th>
                <th className="py-2.5 px-3 text-right">Prix de vente (F/u)</th>
                <th className="py-2.5 px-3 text-right">CA (F CFA)</th>
                <th className="py-2.5 px-3 text-right">Prix de revient</th>
                <th className="py-2.5 px-3 text-right">Marge unitaire</th>
                <th className="py-2.5 px-3 text-right">Marge totale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {computed.saleRows.map((s) => (
                <tr key={s.code} className="hover:bg-neutral-50 dark:hover:bg-brand-900/40">
                  <td className="py-2 px-3 font-mono font-bold text-brand-900 dark:text-white">{s.code}</td>
                  <td className="py-2 px-3 font-medium text-neutral-800 dark:text-neutral-200">{s.name}</td>
                  <td className="py-1.5 px-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={s.qtySold}
                      onChange={(e) =>
                        updateSaleLine(s.code, { qtySold: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="w-24 px-2 py-1 text-right rounded border border-amber-300 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums font-bold"
                    />
                  </td>
                  <td className="py-1.5 px-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={s.unitPriceFCFA ?? ''}
                      onChange={(e) =>
                        updateSaleLine(s.code, {
                          unitPriceFCFA: e.target.value === '' ? null : Number(e.target.value) || 0,
                        })
                      }
                      placeholder="—"
                      className="w-24 px-2 py-1 text-right rounded border border-amber-300 dark:border-brand-700 bg-amber-50/70 dark:bg-brand-950 font-mono tabular-nums"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-brand-900 dark:text-white bg-emerald-50/40 dark:bg-emerald-950/20">
                    {fmtFCFA(Math.round(s.revenueFCFA))}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums text-neutral-500">
                    {fmtFCFA(s.costPricePerUnit, 2)}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono font-semibold tabular-nums ${
                      (s.unitMarginFCFA ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {s.unitMarginFCFA != null ? fmtFCFA(s.unitMarginFCFA, 2) : '—'}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono font-bold tabular-nums ${
                      (s.totalMarginFCFA ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {s.totalMarginFCFA != null ? fmtFCFA(Math.round(s.totalMarginFCFA)) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-brand-50 dark:bg-brand-900 font-bold border-t-2 border-brand-900 dark:border-brand-600">
              <tr>
                <td colSpan={2} className="py-3 px-3">TOTAL VENTES PRODUITS</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums">
                  {fmtNum(computed.saleTotals.qtySold)}
                </td>
                <td />
                <td className="py-3 px-3 text-right font-mono tabular-nums text-brand-900 dark:text-white">
                  {fmtFCFA(Math.round(computed.saleTotals.revenueFCFA))}
                </td>
                <td colSpan={2} />
                <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-600">
                  {fmtFCFA(Math.round(computed.saleTotals.totalMarginFCFA))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Suivi des Locations SBS Industrie (Béton / Briques / Équipements) */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 shadow-elev-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title font-bold text-base text-brand-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-500" />
              Locations &amp; Prestations Chantiers ({monthLabel})
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Enregistrez les locations (Toupie 10 m³, Pompe à béton, Pondeuse, Coffrages, lots spéciaux). Le total actif s&apos;ajoute automatiquement au CA du Compte de Résultat.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-neutral-500 block">CA Locations retenu</span>
            <span className="text-lg font-mono font-bold text-amber-600 tabular-nums">
              {fmtFCFA(Math.round(computed.incomeStatement.caLocations))}
            </span>
          </div>
        </div>

        <form onSubmit={addRentalBooking} className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 p-3 rounded-m bg-neutral-50 dark:bg-brand-900/60 border border-neutral-200 dark:border-brand-700 text-xs">
          <div>
            <label className="block text-[10px] font-semibold mb-1">Date</label>
            <input
              type="date"
              value={rentalDraft.date}
              onChange={(e) => setRentalDraft({ ...rentalDraft, date: e.target.value })}
              className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1">Client / Chantier *</label>
            <input
              type="text"
              required
              placeholder="Nom client"
              value={rentalDraft.clientName}
              onChange={(e) => setRentalDraft({ ...rentalDraft, clientName: e.target.value })}
              className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1">Équipement / Offre</label>
            <select
              value={rentalDraft.itemCode}
              onChange={(e) => {
                const it = products.find((p) => p.code === e.target.value);
                setRentalDraft({
                  ...rentalDraft,
                  itemCode: e.target.value,
                  unitRateFCFA: String(it?.sellingPriceFCFA || rentalDraft.unitRateFCFA),
                });
              }}
              className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
            >
              {products.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1">Qté</label>
            <input
              type="number"
              min={1}
              value={rentalDraft.qty}
              onChange={(e) => setRentalDraft({ ...rentalDraft, qty: e.target.value })}
              className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950 tabular-nums"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1">Durée (j)</label>
            <input
              type="number"
              min={1}
              value={rentalDraft.days}
              onChange={(e) => setRentalDraft({ ...rentalDraft, days: e.target.value })}
              className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950 tabular-nums"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1">Tarif/u (F)</label>
            <input
              type="number"
              min={0}
              value={rentalDraft.unitRateFCFA}
              onChange={(e) => setRentalDraft({ ...rentalDraft, unitRateFCFA: e.target.value })}
              className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950 font-mono tabular-nums"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-1.5 px-3 rounded-m bg-accent-500 hover:bg-accent-600 text-white font-bold inline-flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
        </form>

        {(ledger.rentalBookings || []).length === 0 ? (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center py-6">
            Aucune location enregistrée pour ce mois. Utilisez le formulaire ci-dessus pour planifier ou facturer une location.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-brand-700 text-left text-neutral-500">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 px-3">Client</th>
                  <th className="py-2 px-3">Prestation / Offre</th>
                  <th className="py-2 px-3 text-right">Qté × Durée</th>
                  <th className="py-2 px-3 text-right">Total (F)</th>
                  <th className="py-2 px-3">Statut</th>
                  <th className="py-2 pl-3 text-right">Suppr.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
                {ledger.rentalBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2 pr-3 font-mono text-neutral-600">{b.date}</td>
                    <td className="py-2 px-3 font-semibold">{b.clientName}</td>
                    <td className="py-2 px-3">{b.itemName}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {b.qty} × {b.days} ({fmtFCFA(b.unitRateFCFA)})
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold tabular-nums">
                      {fmtFCFA(b.totalFCFA)}
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={b.status}
                        onChange={(e) => updateRentalStatus(b.id, e.target.value as any)}
                        className="px-2 py-1 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 text-[11px]"
                      >
                        <option value="Devis">Devis</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                    </td>
                    <td className="py-2 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteRental(b.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
