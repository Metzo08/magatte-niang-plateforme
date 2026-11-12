'use client';

import React, { useState } from 'react';
import {
  FilePlus2,
  ArrowRightCircle,
  CheckCircle2,
  CreditCard,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Printer,
  ClipboardList,
} from 'lucide-react';
import type {
  LogistikClientRow,
  LogistikEquipmentRow,
  LogistikInvoiceRow,
  LogistikNeedRow,
  LogistikPaymentRow,
  LogistikQuoteRow,
} from './types';

interface Props {
  activeSubTab: 'needs' | 'quotes' | 'invoices' | 'payments';
  needs: LogistikNeedRow[];
  quotes: LogistikQuoteRow[];
  invoices: LogistikInvoiceRow[];
  payments: LogistikPaymentRow[];
  clients: LogistikClientRow[];
  equipment: LogistikEquipmentRow[];
  onRefresh: () => Promise<void>;
  notify: (msg: string, err?: boolean) => void;
}

export function LogistikOperationsTab({
  activeSubTab,
  needs,
  quotes,
  invoices,
  payments,
  clients,
  equipment,
  onRefresh,
  notify,
}: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);

  // Formulaire nouveau besoin manuel
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [needForm, setNeedForm] = useState({
    clientName: '',
    company: '',
    phone: '',
    siteLocation: 'Dakar',
    startDate: '',
    durationDays: 5,
    urgency: 'Normale',
    withOperator: true,
    selectedEquipId: '',
    qty: 1,
    notes: '',
  });

  // Formulaire nouveau devis manuel
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    clientId: '',
    clientName: '',
    clientCompany: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: 'Dakar',
    transportFee: 0,
    operatorFee: 0,
    cautionAmount: 0,
    discountFCFA: 0,
    notes: '',
    items: [{ equipmentId: '', code: 'LOC', title: '', brand: '', qty: 1, days: 5, unitRateFCFA: 100000 }],
  });

  // Formulaire paiement
  const [payForm, setPayForm] = useState({
    invoiceId: '',
    method: 'Wave',
    channel: 'Paiement en ligne',
    providerRef: '',
    amountFCFA: 0,
    notes: '',
  });

  const callOp = async (entity: string, action: string, payload: Record<string, unknown>) => {
    const res = await fetch('/api/sbs-logistik/admin/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity, action, payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Opération refusée');
    return data;
  };

  // --- NEEDS ---
  const handleCreateNeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyId('create-need');
    try {
      const eq = equipment.find((x) => x.id === needForm.selectedEquipId);
      await callOp('need', 'create', {
        clientName: needForm.clientName,
        company: needForm.company,
        phone: needForm.phone,
        siteLocation: needForm.siteLocation,
        startDate: needForm.startDate,
        durationDays: needForm.durationDays,
        urgency: needForm.urgency,
        withOperator: needForm.withOperator,
        notes: needForm.notes,
        items: [
          {
            equipmentId: eq?.id,
            code: eq?.code || 'ENG-LOG',
            title: eq?.title || 'Équipement chantier sur mesure',
            brand: eq?.brand || 'SBS Sélection Pro',
            category: eq?.category || 'Location matériel',
            qty: needForm.qty,
            days: needForm.durationDays,
            dailyRateFCFA: eq?.dailyRateFCFA || 0,
          },
        ],
      });
      setShowNeedForm(false);
      setNeedForm({
        clientName: '',
        company: '',
        phone: '',
        siteLocation: 'Dakar',
        startDate: '',
        durationDays: 5,
        urgency: 'Normale',
        withOperator: true,
        selectedEquipId: '',
        qty: 1,
        notes: '',
      });
      await onRefresh();
      notify('Expression de besoin enregistrée.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    } finally {
      setBusyId(null);
    }
  };

  const handleConvertNeedToQuote = async (needId: string) => {
    setBusyId(needId);
    try {
      const res = await callOp('need', 'convertNeedToQuote', { id: needId });
      await onRefresh();
      notify(`Devis ${res.quote?.quoteNumber} créé et fiche client associée !`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    } finally {
      setBusyId(null);
    }
  };

  // --- QUOTES ---
  const handleSelectClientForQuote = (clientId: string) => {
    const c = clients.find((x) => x.id === clientId);
    if (!c) return;
    setQuoteForm((prev) => ({
      ...prev,
      clientId: c.id,
      clientName: c.fullName,
      clientCompany: c.company,
      clientPhone: c.phone,
      clientEmail: c.email,
      clientAddress: c.address || c.city,
    }));
  };

  const handleSelectEquipInQuoteLine = (idx: number, eqId: string) => {
    const eq = equipment.find((x) => x.id === eqId);
    if (!eq) return;
    setQuoteForm((prev) => {
      const next = [...prev.items];
      next[idx] = {
        ...next[idx],
        equipmentId: eq.id,
        code: eq.code,
        title: eq.title,
        brand: eq.brand,
        unitRateFCFA: eq.dailyRateFCFA || 100000,
      };
      return { ...prev, items: next };
    });
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyId('create-quote');
    try {
      const selectedClient = clients.find((c) => c.id === quoteForm.clientId);
      const data = await callOp('quote', 'create', {
        ...quoteForm,
        clientCode: selectedClient?.code || '',
      });
      setShowQuoteForm(false);
      await onRefresh();
      notify(`Devis ${data.quote?.quoteNumber} généré.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    } finally {
      setBusyId(null);
    }
  };

  const handleConvertQuoteToInvoice = async (quoteId: string) => {
    setBusyId(quoteId);
    try {
      const data = await callOp('quote', 'convertQuoteToInvoice', { id: quoteId });
      await onRefresh();
      notify(`Facture ${data.invoice?.invoiceNumber} émise avec lien de paiement en ligne !`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    } finally {
      setBusyId(null);
    }
  };

  // --- PAYMENTS ---
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.invoiceId || payForm.amountFCFA <= 0) return;
    setBusyId('record-pay');
    try {
      const res = await callOp('payment', 'record', payForm);
      setPayForm({
        invoiceId: '',
        method: 'Wave',
        channel: 'Paiement en ligne',
        providerRef: '',
        amountFCFA: 0,
        notes: '',
      });
      await onRefresh();
      notify(`Paiement ${res.payment?.paymentRef} enregistré et facture mise à jour.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    } finally {
      setBusyId(null);
    }
  };

  // ==================== TAB 1 : EXPRESSIONS DE BESOINS LOGISTIK ====================
  if (activeSubTab === 'needs') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              Expressions de besoins LOGISTIK
            </h2>
            <p className="text-xs text-slate-400">
              Demandes issues du panier SB-S Logistik ou saisies par l&apos;exploitation. Convertissez
              en devis en 1 clic.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNeedForm((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle expression de besoin</span>
          </button>
        </div>

        {showNeedForm && (
          <form
            onSubmit={handleCreateNeed}
            className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
          >
            <input
              type="text"
              required
              placeholder="Nom client / Demandeur *"
              value={needForm.clientName}
              onChange={(e) => setNeedForm((p) => ({ ...p, clientName: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Entreprise / Société"
              value={needForm.company}
              onChange={(e) => setNeedForm((p) => ({ ...p, company: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <input
              type="tel"
              required
              placeholder="Téléphone *"
              value={needForm.phone}
              onChange={(e) => setNeedForm((p) => ({ ...p, phone: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            />
            <select
              value={needForm.selectedEquipId}
              onChange={(e) => setNeedForm((p) => ({ ...p, selectedEquipId: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            >
              <option value="">-- Sélectionner engin / matériel --</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  [{eq.code}] {eq.title} ({eq.brand})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Lieu du chantier"
              value={needForm.siteLocation}
              onChange={(e) => setNeedForm((p) => ({ ...p, siteLocation: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                placeholder="Qté"
                value={needForm.qty}
                onChange={(e) => setNeedForm((p) => ({ ...p, qty: Number(e.target.value) || 1 }))}
                className="w-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
              <input
                type="number"
                min={1}
                placeholder="Jours"
                value={needForm.durationDays}
                onChange={(e) =>
                  setNeedForm((p) => ({ ...p, durationDays: Number(e.target.value) || 1 }))
                }
                className="w-24 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
              <select
                value={needForm.urgency}
                onChange={(e) => setNeedForm((p) => ({ ...p, urgency: e.target.value }))}
                className="flex-1 px-2 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
              >
                <option value="Normale">Normale</option>
                <option value="Urgente">Urgente</option>
                <option value="Planifiée">Planifiée</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Observations chantier..."
              value={needForm.notes}
              onChange={(e) => setNeedForm((p) => ({ ...p, notes: e.target.value }))}
              className="md:col-span-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
            <button
              type="submit"
              disabled={busyId === 'create-need'}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Enregistrer le besoin
            </button>
          </form>
        )}

        {needs.length === 0 ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400">
            Aucune expression de besoin reçue pour le moment. Les demandes envoyées depuis le panier
            SB-S Logistik apparaîtront ici en direct.
          </div>
        ) : (
          <div className="space-y-3">
            {needs.map((n) => (
              <div
                key={n.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                      {n.needNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        n.urgency === 'Urgente'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {n.urgency}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 text-[11px] font-semibold">
                      {n.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(n.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    {n.clientName} {n.company ? `— ${n.company}` : ''}{' '}
                    <span className="text-xs font-mono text-slate-400">({n.phone})</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Chantier : <strong className="text-slate-200">{n.siteLocation}</strong> · Durée
                    base : {n.durationDays} j · Opérateur : {n.withOperator ? 'Oui' : 'Non'}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(n.items || []).map((it, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono"
                      >
                        {it.qty}× {it.title} ({it.days}j) {it.brand ? `· ${it.brand}` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {n.status !== 'Converti' && (
                    <button
                      type="button"
                      disabled={busyId === n.id}
                      onClick={() => handleConvertNeedToQuote(n.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      <ArrowRightCircle className="w-4 h-4" />
                      <span>Convertir en Devis</span>
                    </button>
                  )}
                  <select
                    value={n.status}
                    onChange={async (e) => {
                      await callOp('need', 'updateStatus', { id: n.id, status: e.target.value });
                      await onRefresh();
                      notify('Statut du besoin mis à jour.');
                    }}
                    className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
                  >
                    <option value="Nouveau">Nouveau</option>
                    <option value="Qualifié">Qualifié</option>
                    <option value="Devis envoyé">Devis envoyé</option>
                    <option value="Converti">Converti</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==================== TAB 2 : DEVIS LOGISTIK ====================
  if (activeSubTab === 'quotes') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FilePlus2 className="w-5 h-5 text-amber-400" />
              Devis Location & Prestations LOGISTIK
            </h2>
            <p className="text-xs text-slate-400">
              Chiffrage multi-engins (Qté × Jours × Tarif/j + Transport + Opérateur + Caution + TVA
              18%) et conversion en Facture en 1 clic.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowQuoteForm((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un devis</span>
          </button>
        </div>

        {showQuoteForm && (
          <form
            onSubmit={handleCreateQuote}
            className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={quoteForm.clientId}
                onChange={(e) => handleSelectClientForQuote(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
              >
                <option value="">-- Client existant (optionnel) --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} · {c.fullName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="Nom complet client *"
                value={quoteForm.clientName}
                onChange={(e) => setQuoteForm((p) => ({ ...p, clientName: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
              />
              <input
                type="tel"
                required
                placeholder="Téléphone *"
                value={quoteForm.clientPhone}
                onChange={(e) => setQuoteForm((p) => ({ ...p, clientPhone: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
              <input
                type="text"
                placeholder="Adresse chantier"
                value={quoteForm.clientAddress}
                onChange={(e) => setQuoteForm((p) => ({ ...p, clientAddress: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-slate-300">Lignes équipements</div>
              {quoteForm.items.map((line, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                  <select
                    value={line.equipmentId}
                    onChange={(e) => handleSelectEquipInQuoteLine(idx, e.target.value)}
                    className="md:col-span-2 px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="">-- Choisir matériel du parc --</option>
                    {equipment.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        [{eq.code}] {eq.title} ({eq.brand})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Désignation *"
                    value={line.title}
                    onChange={(e) => {
                      const v = e.target.value;
                      setQuoteForm((p) => {
                        const next = [...p.items];
                        next[idx].title = v;
                        return { ...p, items: next };
                      });
                    }}
                    className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Qté"
                    value={line.qty}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 1;
                      setQuoteForm((p) => {
                        const next = [...p.items];
                        next[idx].qty = v;
                        return { ...p, items: next };
                      });
                    }}
                    className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Jours"
                    value={line.days}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 1;
                      setQuoteForm((p) => {
                        const next = [...p.items];
                        next[idx].days = v;
                        return { ...p, items: next };
                      });
                    }}
                    className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Tarif/jour FCFA"
                    value={line.unitRateFCFA}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0;
                      setQuoteForm((p) => {
                        const next = [...p.items];
                        next[idx].unitRateFCFA = v;
                        return { ...p, items: next };
                      });
                    }}
                    className="px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setQuoteForm((p) => ({
                    ...p,
                    items: [
                      ...p.items,
                      { equipmentId: '', code: 'LOC', title: '', brand: '', qty: 1, days: 5, unitRateFCFA: 100000 },
                    ],
                  }))
                }
                className="text-amber-400 hover:underline font-semibold"
              >
                + Ajouter une ligne matériel
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Transport / Porte-char</label>
                <input
                  type="number"
                  min={0}
                  value={quoteForm.transportFee}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, transportFee: Number(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Frais opérateur</label>
                <input
                  type="number"
                  min={0}
                  value={quoteForm.operatorFee}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, operatorFee: Number(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Caution garantie</label>
                <input
                  type="number"
                  min={0}
                  value={quoteForm.cautionAmount}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, cautionAmount: Number(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Remise FCFA</label>
                <input
                  type="number"
                  min={0}
                  value={quoteForm.discountFCFA}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, discountFCFA: Number(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busyId === 'create-quote'}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Enregistrer et chiffrer le devis (TVA 18%)
            </button>
          </form>
        )}

        <div className="space-y-3">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
                    {q.quoteNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px] font-semibold">
                    {q.status}
                  </span>
                  {q.clientCode && (
                    <span className="text-[11px] font-mono text-slate-400">{q.clientCode}</span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">
                  {q.clientName} {q.clientCompany ? `— ${q.clientCompany}` : ''} ·{' '}
                  <span className="text-amber-400 font-mono">
                    {q.totalTTC.toLocaleString('fr-FR')} FCFA TTC
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {(q.items || []).length} lignes · Chantier : {q.clientAddress} · MAj par {q.updatedBy}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {q.status !== 'Facturé' && (
                  <button
                    type="button"
                    disabled={busyId === q.id}
                    onClick={() => handleConvertQuoteToInvoice(q.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Transformer en Facture</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title="Imprimer"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await callOp('quote', 'delete', { id: q.id });
                    await onRefresh();
                    notify('Devis supprimé.');
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-rose-400"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {quotes.length === 0 && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400">
              Aucun devis créé. Utilisez « Convertir en Devis » depuis une expression de besoin ou
              créez un devis directement.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== TAB 3 : FACTURES + LIEN PAIEMENT EN LIGNE ====================
  if (activeSubTab === 'invoices') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">
            Factures SB-S Logistik & Liens de Paiement en ligne
          </h2>
          <p className="text-xs text-slate-400">
            Chaque facture génère un portail sécurisé partageable par WhatsApp/email pour paiement
            Wave, Orange Money, Carte ou Virement.
          </p>
        </div>

        <div className="space-y-3">
          {invoices.map((inv) => {
            const payPath = `/paiement/sbs-logistik/${inv.paymentToken}`;
            return (
              <div
                key={inv.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        inv.status === 'Payée'
                          ? 'bg-emerald-600 text-white'
                          : inv.status === 'Partielle'
                            ? 'bg-amber-600 text-white'
                            : 'bg-sky-600/30 text-sky-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Échéance : {inv.dueDate || 'À réception'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {inv.clientName} {inv.clientCompany ? `— ${inv.clientCompany}` : ''}
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Total : <strong>{inv.totalTTC.toLocaleString('fr-FR')} F</strong> · Payé :{' '}
                    <span className="text-emerald-400">
                      {inv.amountPaidFCFA.toLocaleString('fr-FR')} F
                    </span>{' '}
                    · Solde dû :{' '}
                    <span className="text-amber-400 font-bold">
                      {inv.balanceDueFCFA.toLocaleString('fr-FR')} F
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`${window.location.origin}${payPath}`);
                      notify(`Lien de paiement en ligne copié (${payPath})`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier lien paiement</span>
                  </button>
                  <a
                    href={payPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ouvrir portail paiement</span>
                  </a>
                </div>
              </div>
            );
          })}
          {invoices.length === 0 && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400">
              Aucune facture émise. Convertissez un devis en facture dans l&apos;onglet Devis.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== TAB 4 : PAIEMENT EN LIGNE & ENCAISSEMENTS ====================
  const unpaidInvoices = invoices.filter((i) => i.balanceDueFCFA > 0 && i.status !== 'Annulée');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          Paiement en ligne & Encaissements (Wave, Orange Money, Carte, Virement)
        </h2>
        <p className="text-xs text-slate-400">
          Enregistrez un règlement reçu en ligne ou suivez les paiements effectués par vos clients
          via leurs liens de paiement dédiés.
        </p>
      </div>

      <form
        onSubmit={handleRecordPayment}
        className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-5 gap-3 text-xs items-end"
      >
        <div className="md:col-span-2">
          <label className="block text-[10px] text-slate-400 mb-1">Facture à solder *</label>
          <select
            required
            value={payForm.invoiceId}
            onChange={(e) => {
              const inv = unpaidInvoices.find((i) => i.id === e.target.value);
              setPayForm((p) => ({
                ...p,
                invoiceId: e.target.value,
                amountFCFA: inv?.balanceDueFCFA || 0,
              }));
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          >
            <option value="">-- Choisir facture impayée / partielle --</option>
            {unpaidInvoices.map((i) => (
              <option key={i.id} value={i.id}>
                {i.invoiceNumber} · {i.clientName} (Reste: {i.balanceDueFCFA.toLocaleString('fr-FR')} F)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 mb-1">Mode de paiement</label>
          <select
            value={payForm.method}
            onChange={(e) => setPayForm((p) => ({ ...p, method: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
          >
            <option value="Wave">Wave</option>
            <option value="Orange Money">Orange Money</option>
            <option value="Carte Bancaire">Carte Bancaire</option>
            <option value="Virement">Virement bancaire</option>
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 mb-1">Montant (FCFA) *</label>
          <input
            type="number"
            min={1}
            required
            value={payForm.amountFCFA}
            onChange={(e) => setPayForm((p) => ({ ...p, amountFCFA: Number(e.target.value) || 0 }))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={busyId === 'record-pay'}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
        >
          Valider règlement
        </button>

        <div className="md:col-span-5">
          <input
            type="text"
            placeholder="Référence transaction Wave / Orange Money / Bordereau virement..."
            value={payForm.providerRef}
            onChange={(e) => setPayForm((p) => ({ ...p, providerRef: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
          />
        </div>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3">Réf Paiement</th>
              <th className="p-3">Facture</th>
              <th className="p-3">Client</th>
              <th className="p-3">Canal / Méthode</th>
              <th className="p-3">Réf Opérateur</th>
              <th className="p-3 text-right">Montant</th>
              <th className="p-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-emerald-400">{p.paymentRef}</td>
                <td className="p-3 font-mono text-white">{p.invoiceNumber}</td>
                <td className="p-3 text-slate-200">{p.clientName}</td>
                <td className="p-3 text-amber-300 font-semibold">
                  {p.method} · <span className="text-slate-400 font-normal">{p.channel}</span>
                </td>
                <td className="p-3 font-mono text-slate-400">{p.providerRef || '—'}</td>
                <td className="p-3 text-right font-mono font-bold text-white">
                  {p.amountFCFA.toLocaleString('fr-FR')} F
                </td>
                <td className="p-3 text-right font-mono text-slate-400">
                  {new Date(p.paidAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Aucun paiement enregistré pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
