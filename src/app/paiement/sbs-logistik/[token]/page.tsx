'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building2,
  Printer,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientCode: string;
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  items: Array<{
    code?: string;
    title: string;
    qty: number;
    days: number;
    unitRateFCFA: number;
    lineTotalFCFA: number;
  }>;
  subtotalHT: number;
  taxRate: number;
  totalTTC: number;
  amountPaidFCFA: number;
  balanceDueFCFA: number;
  status: string;
  dueDate: string;
}

interface PaymentRecord {
  id: string;
  paymentRef: string;
  method: string;
  amountFCFA: number;
  paidAt: string;
  providerRef: string;
}

export default function LogistikOnlinePaymentPage() {
  const params = useParams();
  const token = String(params?.token || '');

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [method, setMethod] = useState<'Wave' | 'Orange Money' | 'Carte Bancaire' | 'Virement'>(
    'Wave'
  );
  const [amountFCFA, setAmountFCFA] = useState<number>(0);
  const [payerRef, setPayerRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<PaymentRecord | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sbs-logistik/public/pay?token=${encodeURIComponent(token)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lien introuvable.');
      setInvoice(data.invoice);
      setPayments(data.payments || []);
      setAmountFCFA(data.invoice?.balanceDueFCFA || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice || amountFCFA <= 0 || !payerRef.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/sbs-logistik/public/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          method,
          amountFCFA: Number(amountFCFA),
          payerPhoneOrRef: payerRef.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Paiement refusé.');
      setReceipt(data.payment);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur paiement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">
        Chargement du portail sécurisé SB-S Logistik...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4">
          <p className="text-rose-400 text-sm">{error || 'Facture introuvable.'}</p>
          <Link
            href="/entites/sbs-logistik"
            className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à SB-S Logistik
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/entites/sbs-logistik"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>SB-S Logistik</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            Portail Paiement en ligne Sécurisé
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold">
                SB-S LOGISTIK — GROUPE MAGATTE NIANG
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                Facture {invoice.invoiceNumber}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Client : {invoice.clientName}{' '}
                {invoice.clientCompany ? `(${invoice.clientCompany})` : ''} · {invoice.clientCode}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  invoice.balanceDueFCFA <= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {invoice.status}
              </span>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Échéance : {invoice.dueDate || 'À réception'}
              </div>
            </div>
          </div>

          {/* Détail lignes */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Équipement / Prestation</th>
                  <th className="p-3 text-center">Qté</th>
                  <th className="p-3 text-center">Jours</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(invoice.items || []).map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-white">{it.title}</td>
                    <td className="p-3 text-center font-mono">{it.qty}</td>
                    <td className="p-3 text-center font-mono">{it.days} j</td>
                    <td className="p-3 text-right font-mono">
                      {(it.lineTotalFCFA || 0).toLocaleString('fr-FR')} F
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400">Total TTC</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {invoice.totalTTC.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-slate-400">Déjà réglé</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                {invoice.amountPaidFCFA.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-amber-300">Reste à payer</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">
                {invoice.balanceDueFCFA.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>

          {receipt && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-300">
                    Paiement confirmé · Reçu {receipt.paymentRef}
                  </div>
                  <div className="text-slate-300 mt-0.5">
                    {receipt.amountFCFA.toLocaleString('fr-FR')} FCFA réglés via {receipt.method} (
                    {receipt.providerRef})
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-950 text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimer reçu
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          {invoice.balanceDueFCFA > 0 ? (
            <form onSubmit={handlePay} className="space-y-4 pt-2 border-t border-slate-800">
              <h2 className="text-sm font-bold text-white">Régler en ligne maintenant</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Wave', 'Orange Money', 'Carte Bancaire', 'Virement'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      method === m
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {m === 'Carte Bancaire' ? (
                      <CreditCard className="w-4 h-4" />
                    ) : m === 'Virement' ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4" />
                    )}
                    <span>{m}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Montant à payer (FCFA)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={invoice.balanceDueFCFA}
                    required
                    value={amountFCFA}
                    onChange={(e) => setAmountFCFA(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm font-mono font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    {method === 'Wave' || method === 'Orange Money'
                      ? 'Numéro Mobile Money / Réf transaction *'
                      : 'Référence carte / virement *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={payerRef}
                    onChange={(e) => setPayerRef(e.target.value)}
                    placeholder={method === 'Wave' ? 'Ex: +221 77 ... / TX-WAVE' : 'Réf paiement'}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm font-mono text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-sm transition-colors"
              >
                {submitting
                  ? 'Validation du règlement...'
                  : `Confirmer le paiement de ${Number(amountFCFA).toLocaleString('fr-FR')} FCFA via ${method}`}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-300 font-semibold">
              Cette facture est intégralement réglée. Merci pour votre confiance envers SB-S Logistik.
            </div>
          )}

          {payments.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-400">
                Historique des paiements enregistrés
              </h3>
              <div className="space-y-1.5">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800"
                  >
                    <span className="font-mono text-slate-300">
                      {p.paymentRef} · {p.method} ({p.providerRef})
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {p.amountFCFA.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
