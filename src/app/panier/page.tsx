'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Calculator,
  ArrowLeft
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { store, CartItem } from '@/lib/store';
import { SITE_IMAGES } from '@/data/siteImages';
import { Quote } from '@/types';

export default function CartQuotePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [createdQuote, setCreatedQuote] = useState<Quote | null>(null);

  const [clientData, setClientData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    deliveryLocation: 'Dakar',
    notes: ''
  });

  const loadCart = () => {
    setCart(store.getCart());
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('storage-update', loadCart);
    return () => window.removeEventListener('storage-update', loadCart);
  }, []);

  const totalHT = cart.reduce((acc, item) => acc + (item.product.indicativePriceFCFA * item.quantity), 0);
  const taxTVA = totalHT * 0.18; // TVA 18% Sénégal
  const totalTTC = totalHT + taxTVA;

  const handleUpdateQty = (productId: string, qty: number) => {
    store.updateCartQuantity(productId, qty);
  };

  const handleClear = () => {
    store.clearCart();
  };

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientData.name || !clientData.phone || !clientData.email) {
      alert('Veuillez renseigner votre nom, téléphone et email.');
      return;
    }

    const items = cart.map(item => ({
      productId: item.product.id,
      description: `${item.product.name} (${item.product.ref}) - ${item.product.dimensions}`,
      quantity: item.quantity,
      unit: item.product.unit,
      unitPriceFCFA: item.product.indicativePriceFCFA,
      totalPriceFCFA: item.product.indicativePriceFCFA * item.quantity
    }));

    // Create quote
    const quote = store.createQuote({
      clientName: clientData.name,
      clientCompany: clientData.company,
      clientEmail: clientData.email,
      clientPhone: clientData.phone,
      entityId: 'p2m',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      items,
      totalHT,
      taxRate: 0.18,
      totalTTC,
      notes: `Livraison prévue : ${clientData.deliveryLocation}. Remarques : ${clientData.notes}`
    });

    // Also create matching Lead in CRM (§ 14)
    store.createLead({
      fullName: clientData.name,
      company: clientData.company,
      phone: clientData.phone,
      email: clientData.email,
      country: 'Sénégal',
      city: clientData.deliveryLocation,
      sector: 'Matériaux & Finitions',
      source: 'Devis catalogue',
      needCategory: 'Matériaux / Carrelage',
      projectType: `Commande multi-produits (${cart.length} références)`,
      projectLocation: clientData.deliveryLocation,
      projectStage: 'Étude',
      budgetRange: `${totalTTC.toLocaleString('fr-FR')} FCFA`,
      timeframe: '1–3 mois',
      items: items.map(i => ({ title: i.description, quantity: `${i.quantity} ${i.unit}`, entityId: 'p2m', price: i.totalPriceFCFA }))
    });

    store.clearCart();
    setCreatedQuote(quote);
  };

  if (createdQuote) {
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-l p-8 shadow-elev-3 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono  font-bold text-accent-500 tracking-wider">
              Devis constitué avec succès (§ 14)
            </span>
            <h1 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white">
              Votre devis officiel est prêt
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              Un dossier CRM a été généré et un récapitulatif chiffré vous a été transmis par email.
            </p>
          </div>

          {/* DEVIS PREVIEW BOX */}
          <div className="bg-neutral-50 dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m p-5 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-brand-800">
              <span className="text-neutral-500">Numéro de devis :</span>
              <strong className="text-accent-500 text-sm">{createdQuote.quoteNumber}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Entité émettrice :</span>
              <strong className="text-neutral-900 dark:text-white">P2M Sénégal</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Nombre d'articles :</span>
              <span>{createdQuote.items.length} références</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-brand-800 text-sm">
              <span className="font-bold">Total estimatif TTC :</span>
              <strong className="text-accent-500 font-bold tabular-nums">
                {createdQuote.totalTTC.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/espace-pro"
              className="w-full sm:w-auto px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-sm shadow-sm"
            >
              Consulter et signer dans mon espace client
            </Link>
            <Link
              href="/catalogue"
              className="w-full sm:w-auto px-4 py-3 border border-neutral-300 dark:border-brand-700 text-neutral-700 dark:text-neutral-300 rounded-m text-sm font-semibold hover:bg-neutral-100"
            >
              Continuer mes sélections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb
        items={[
          { label: 'Catalogue P2M', href: '/catalogue' },
          { label: 'Panier de demande de devis' }
        ]}
      />

      {/* Bandeau illustré */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 text-white border-b border-brand-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_IMAGES.rubonChantier}
          alt="Panier de devis P2M — carrelages et sanitaires"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/60 to-brand-900/30 pointer-events-none" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <span className="text-xs font-mono  font-bold text-accent-400 tracking-wider">
            Sélection multi-produits (§ 14 & EF-25)
          </span>
          <h1 className="text-3xl font-title font-bold text-white mt-2">
            Panier de demande de devis
          </h1>
        </div>
      </section>

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono  font-bold text-accent-500 tracking-wider">
              Récapitulatif de votre sélection
            </span>
            <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
              Articles sélectionnés
            </h2>
          </div>

          {cart.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vider le panier</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-12 text-center space-y-4">
            <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="font-title font-bold text-lg text-neutral-900 dark:text-white">
              Votre panier de devis est vide
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Parcourez le catalogue P2M pour ajouter des références de carrelages, sanitaires ou robinetteries à votre sélection.
            </p>
            <div className="pt-2">
              <Link
                href="/catalogue"
                className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-xs inline-flex items-center gap-1.5"
              >
                <span>Explorer le catalogue P2M</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ITEMS LIST */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l overflow-hidden divide-y divide-neutral-200 dark:divide-brand-800">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="w-16 h-16 rounded bg-neutral-100 overflow-hidden shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-accent-500 font-bold">{item.product.ref}</span>
                        <button
                          onClick={() => handleUpdateQty(item.product.id, 0)}
                          className="text-neutral-400 hover:text-red-600 p-1"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-title font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-neutral-500">{item.product.dimensions} · {item.product.finish}</p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                        {/* QTY CONTROLLER */}
                        <div className="flex items-center border border-neutral-300 dark:border-brand-700 rounded overflow-hidden">
                          <button
                            onClick={() => handleUpdateQty(item.product.id, Math.max(1, item.quantity - 10))}
                            className="p-1.5 bg-neutral-100 dark:bg-brand-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-neutral-900 dark:text-white">
                            {item.quantity} {item.product.unit}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.product.id, item.quantity + 10)}
                            className="p-1.5 bg-neutral-100 dark:bg-brand-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="font-mono text-xs text-right tabular-nums">
                          <span className="text-neutral-500 text-[10px] block">{item.product.indicativePriceFCFA.toLocaleString('fr-FR')} F/{item.product.unit}</span>
                          <strong className="text-neutral-900 dark:text-white text-sm">
                            {(item.product.indicativePriceFCFA * item.quantity).toLocaleString('fr-FR')} FCFA
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUOTE FORM & TOTAL */}
            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 space-y-4 shadow-sm">
                <h3 className="font-title font-bold text-base text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-brand-800 pb-3">
                  Récapitulatif financier indicatif
                </h3>

                <div className="space-y-2 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Total HT :</span>
                    <span>{totalHT.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>TVA (18% Sénégal) :</span>
                    <span>{taxTVA.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-accent-500 pt-2 border-t border-neutral-200 dark:border-brand-800">
                    <span>Total estimatif TTC :</span>
                    <span>{totalTTC.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                {/* CLIENT FORM */}
                <form onSubmit={handleGenerateQuote} className="space-y-3 pt-4 border-t border-neutral-200 dark:border-brand-800 text-xs">
                  <h4 className="font-title font-bold text-neutral-900 dark:text-white">
                    Coordonnées pour l'émission du devis
                  </h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientData.name}
                      onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Babacar Seck"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Entreprise / promoteur
                    </label>
                    <input
                      type="text"
                      value={clientData.company}
                      onChange={(e) => setClientData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Ex: Immobilière du Cap Vert"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientData.phone}
                        onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+221 77 ..."
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={clientData.email}
                        onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="b.seck@gmail.com"
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Lieu de livraison du chantier
                    </label>
                    <input
                      type="text"
                      value={clientData.deliveryLocation}
                      onChange={(e) => setClientData(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                      placeholder="Ex: Dakar Fann, Diamniadio..."
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-sm shadow-sm transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Générer ma proposition de devis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
