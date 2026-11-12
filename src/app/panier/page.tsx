'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  FileText,
  CheckCircle2,
  Truck,
  Factory,
  Layers,
  ShieldCheck,
  Calendar,
  MapPin,
  Lock,
} from 'lucide-react';
import { store, CartEntityId, CartItem } from '@/lib/store';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SITE_IMAGES } from '@/data/siteImages';

const ENTITY_META: Record<
  CartEntityId,
  {
    id: CartEntityId;
    label: string;
    shortLabel: string;
    subtitle: string;
    catalogHref: string;
    catalogLabel: string;
    adminHref: string;
    accentBadge: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  p2m: {
    id: 'p2m',
    label: 'P2M Showroom',
    shortLabel: 'P2M',
    subtitle: 'Carrelage porcelaine, marbre, robinetterie & sanitaires premium',
    catalogHref: '/catalogue',
    catalogLabel: 'Catalogue P2M',
    adminHref: '/entites/p2m/admin',
    accentBadge: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    icon: Layers,
  },
  'sbs-industries': {
    id: 'sbs-industries',
    label: 'SB-S Industrie',
    shortLabel: 'SBS Industrie',
    subtitle: 'Agglos creux, agglos pleins (15×20×40 / 20×20×40), hourdis & pavés',
    catalogHref: '/entites/sbs-industries',
    catalogLabel: 'Catalogue SB-S Industrie',
    adminHref: '/entites/sbs-industries/admin',
    accentBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    icon: Factory,
  },
  'sbs-logistik': {
    id: 'sbs-logistik',
    label: 'SB-S Logistik',
    shortLabel: 'SBS Logistik',
    subtitle: 'Location d’engins lourds, levage, terrassement & transport de chantier',
    catalogHref: '/entites/sbs-logistik',
    catalogLabel: 'Parc SB-S Logistik',
    adminHref: '/entites/sbs-logistik/admin',
    accentBadge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    icon: Truck,
  },
};

function normalizeEntityParam(raw: string | null): CartEntityId {
  if (raw === 'sbs-industries') return 'sbs-industries';
  if (raw === 'sbs-logistik') return 'sbs-logistik';
  return 'p2m';
}

function PanierIsolateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramEntity = searchParams?.get('entite') ?? null;

  const [activeEntity, setActiveEntity] = useState<CartEntityId>(() =>
    normalizeEntityParam(paramEntity)
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [counts, setCounts] = useState<Record<CartEntityId, number>>({
    p2m: 0,
    'sbs-industries': 0,
    'sbs-logistik': 0,
  });

  const [submittedResult, setSubmittedResult] = useState<{
    mode: 'quote' | 'need';
    refNumber: string;
    entityLabel: string;
    itemsCount: number;
    totalTTC: number;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [clientData, setClientData] = useState({
    name: '',
    company: '',
    phone: '',
    whatsapp: '',
    email: '',
    deliveryLocation: '',
    startDate: '',
    urgency: 'Normale',
    withOperator: true,
    notes: '',
  });

  useEffect(() => {
    const target = normalizeEntityParam(paramEntity);
    setActiveEntity(target);
    setSubmittedResult(null);
    setSubmitError('');
  }, [paramEntity]);

  const refreshAll = (entity: CartEntityId) => {
    setCart(store.getCart(entity));
    setCounts(store.getAllCartCounts());
  };

  useEffect(() => {
    refreshAll(activeEntity);
  }, [activeEntity]);

  const switchEntityTab = (entity: CartEntityId) => {
    setActiveEntity(entity);
    setSubmittedResult(null);
    setSubmitError('');
    router.replace(`/panier?entite=${entity}`, { scroll: false });
  };

  const handleUpdateQty = (productId: string, newQty: number, days?: number) => {
    store.updateCartQuantity(productId, newQty, activeEntity, days);
    refreshAll(activeEntity);
    window.dispatchEvent(new Event('storage'));
  };

  const handleClear = () => {
    store.clearCart(activeEntity);
    refreshAll(activeEntity);
    window.dispatchEvent(new Event('storage'));
  };

  const isLogistik = activeEntity === 'sbs-logistik';

  const subtotalHT = cart.reduce((sum, item) => {
    const unit = item.product.indicativePriceFCFA || 0;
    const days = isLogistik ? Math.max(1, item.days || 1) : 1;
    return sum + unit * item.quantity * days;
  }, 0);

  const taxAmount = Math.round(subtotalHT * 0.18);
  const totalTTC = subtotalHT + taxAmount;
  const meta = ENTITY_META[activeEntity];
  const EntityIcon = meta.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!clientData.name.trim() || !clientData.phone.trim() || cart.length === 0) {
      setSubmitError('Veuillez renseigner votre nom complet et votre numéro de téléphone.');
      return;
    }

    setSubmitting(true);
    try {
      if (activeEntity === 'sbs-logistik') {
        const maxDays = Math.max(1, ...cart.map((c) => c.days || 1));
        const res = await fetch('/api/sbs-logistik/public/need', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: clientData.name.trim(),
            company: clientData.company.trim(),
            phone: clientData.phone.trim(),
            whatsapp: clientData.whatsapp.trim() || clientData.phone.trim(),
            email: clientData.email.trim(),
            siteLocation: clientData.deliveryLocation.trim() || 'Dakar',
            startDate: clientData.startDate,
            durationDays: maxDays,
            withOperator: clientData.withOperator,
            urgency: clientData.urgency,
            notes: clientData.notes.trim(),
            source: 'Panier isolé SBS Logistik',
            items: cart.map((item) => ({
              equipmentId: item.product.id,
              code: item.product.ref,
              title: item.product.name,
              brand: item.product.brand || 'Standard Industriel',
              category: item.product.category,
              qty: item.quantity,
              days: Math.max(1, item.days || 1),
              dailyRateFCFA: item.product.indicativePriceFCFA || 0,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors de la transmission du besoin Logistik.');
        }

        const countSnapshot = cart.length;
        store.clearCart('sbs-logistik');
        refreshAll('sbs-logistik');
        window.dispatchEvent(new Event('storage'));

        setSubmittedResult({
          mode: 'need',
          refNumber: data.need?.needNumber || 'BES-LOG-TRANSMIS',
          entityLabel: 'SB-S Logistik',
          itemsCount: countSnapshot,
          totalTTC,
        });
        return;
      }

      if (activeEntity === 'p2m') {
        const res = await fetch('/api/p2m/public/need', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: clientData.name.trim(),
            company: clientData.company.trim(),
            phone: clientData.phone.trim(),
            email: clientData.email.trim(),
            city: clientData.deliveryLocation.trim() || 'Dakar',
            notes: clientData.notes.trim(),
            items: cart.map((item) => ({
              productId: item.product.id,
              sku: item.product.ref,
              name: item.product.name,
              category: item.product.category,
              qty: item.quantity,
              unit: item.product.unit,
              unitPrice: item.product.indicativePriceFCFA || 0,
            })),
          }),
        });
        const needData = await res.json();
        if (!res.ok) {
          throw new Error(needData.error || 'Erreur lors de la transmission au showroom P2M.');
        }

        const quoteItems = cart.map((item) => ({
          productId: item.product.id,
          description: `${item.product.name} (${item.product.ref})`,
          quantity: item.quantity,
          unit: item.product.unit,
          unitPriceFCFA: item.product.indicativePriceFCFA || 0,
          totalPriceFCFA: (item.product.indicativePriceFCFA || 0) * item.quantity,
        }));

        store.createQuote({
          entityId: 'p2m',
          clientName: clientData.name.trim(),
          clientEmail: clientData.email.trim() || 'client@p2m.sn',
          clientPhone: clientData.phone.trim(),
          clientCompany: clientData.company.trim(),
          validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
          items: quoteItems,
          totalHT: subtotalHT,
          taxRate: 18,
          totalTTC,
          notes: `Expression de besoin P2M (${needData.need?.needNumber || ''}) — Livraison : ${
            clientData.deliveryLocation || 'Dakar'
          }`,
        });

        const countSnapshot = cart.length;
        store.clearCart('p2m');
        refreshAll('p2m');
        window.dispatchEvent(new Event('storage'));

        setSubmittedResult({
          mode: 'need',
          refNumber: needData.need?.needNumber || 'BES-P2M-TRANSMIS',
          entityLabel: 'P2M Showroom',
          itemsCount: countSnapshot,
          totalTTC,
        });
        return;
      }

      // SB-S Industrie (panier strictement isolé pour sbs-industries)
      const quoteItems = cart.map((item) => ({
        productId: item.product.id,
        description: `${item.product.name} (${item.product.ref})`,
        quantity: item.quantity,
        unit: item.product.unit,
        unitPriceFCFA: item.product.indicativePriceFCFA || 0,
        totalPriceFCFA: (item.product.indicativePriceFCFA || 0) * item.quantity,
      }));

      const quote = store.createQuote({
        entityId: 'sbs-industries',
        clientName: clientData.name.trim(),
        clientEmail: clientData.email.trim() || 'chantier@sbs-industrie.sn',
        clientPhone: clientData.phone.trim(),
        clientCompany: clientData.company.trim(),
        validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
        items: quoteItems,
        totalHT: subtotalHT,
        taxRate: 18,
        totalTTC,
        notes: `Commande SB-S Industrie — Lieu : ${clientData.deliveryLocation || 'Dakar / Rufisque'}. ${
          clientData.notes || ''
        }`,
      });

      store.createLead({
        fullName: clientData.name.trim(),
        email: clientData.email.trim() || 'chantier@sbs-industrie.sn',
        phone: clientData.phone.trim(),
        company: clientData.company.trim(),
        country: 'Sénégal',
        city: clientData.deliveryLocation || 'Dakar',
        sector: 'Bâtiment & Travaux Publics',
        source: 'Devis catalogue',
        needCategory: 'Matériaux BTP — Agglos, Hourdis & Pavés',
        projectType: 'Matériaux BTP — Agglos, Hourdis & Pavés',
        projectLocation: clientData.deliveryLocation || 'Dakar',
        projectStage: 'Démarrage',
        budgetRange: `${totalTTC.toLocaleString('fr-FR')} FCFA`,
        timeframe: 'Immédiat',
        items: cart.map((item) => ({
          title: item.product.name,
          quantity: `${item.quantity} ${item.product.unit}`,
          entityId: 'sbs-industries',
          price: item.product.indicativePriceFCFA || 0,
        })),
      });

      const countSnapshot = cart.length;
      store.clearCart('sbs-industries');
      refreshAll('sbs-industries');
      window.dispatchEvent(new Event('storage'));

      setSubmittedResult({
        mode: 'quote',
        refNumber: quote.quoteNumber,
        entityLabel: 'SB-S Industrie',
        itemsCount: countSnapshot,
        totalTTC,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur inattendue');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-brand-950 border border-neutral-200 dark:border-brand-700 rounded-l p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-accent-500 tracking-wider">
              {submittedResult.mode === 'need'
                ? 'Expression de besoin transmise au gestionnaire dédié'
                : 'Devis constitué avec succès'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white">
              Demande enregistrée pour {submittedResult.entityLabel}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              Votre panier {submittedResult.entityLabel} reste strictement cloisonné de nos autres entités.
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m p-5 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-brand-800">
              <span className="text-neutral-500">Référence dossier :</span>
              <strong className="text-accent-500 text-sm">{submittedResult.refNumber}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Entité isolée :</span>
              <strong className="text-neutral-900 dark:text-white">{submittedResult.entityLabel}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Articles / Équipements :</span>
              <span>{submittedResult.itemsCount} lignes</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-brand-800 text-sm">
              <span className="font-bold">Estimation TTC :</span>
              <strong className="text-accent-500 font-bold tabular-nums">
                {submittedResult.totalTTC > 0
                  ? `${submittedResult.totalTTC.toLocaleString('fr-FR')} FCFA`
                  : 'Sur devis détaillé'}
              </strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={meta.catalogHref}
              className="w-full sm:w-auto px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-sm shadow-sm"
            >
              Retour à {meta.catalogLabel}
            </Link>
            <Link
              href="/espace-pro"
              className="w-full sm:w-auto px-4 py-3 border border-neutral-300 dark:border-brand-700 text-neutral-700 dark:text-neutral-300 rounded-m text-sm font-semibold hover:bg-neutral-100"
            >
              Ouvrir Espace Pro
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
          { label: meta.catalogLabel, href: meta.catalogHref },
          { label: `Panier isolé · ${meta.shortLabel}` },
        ]}
      />

      {/* Bandeau illustré + Sélecteur strict d'entité */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 text-white border-b border-brand-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_IMAGES.rubonChantier}
          alt="Panier dédié par entité — Groupe Magatte Niang"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/75 to-brand-900/40 pointer-events-none" />

        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent-400 tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Paniers strictement cloisonnés par entité
              </span>
              <h1 className="text-2xl sm:text-3xl font-title font-bold text-white mt-1.5 flex items-center gap-2.5">
                <EntityIcon className="w-7 h-7 text-accent-400 shrink-0" />
                <span>Panier {meta.label}</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1">{meta.subtitle}</p>
            </div>

            <Link
              href={meta.adminHref}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors self-start"
            >
              <Lock className="w-3.5 h-3.5 text-accent-400" />
              Espace Gestionnaire {meta.shortLabel}
            </Link>
          </div>

          {/* 3 onglets de paniers totalement indépendants */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(['p2m', 'sbs-industries', 'sbs-logistik'] as CartEntityId[]).map((eid) => {
              const info = ENTITY_META[eid];
              const IconComp = info.icon;
              const active = activeEntity === eid;
              const badgeCount = counts[eid] || 0;
              return (
                <button
                  key={eid}
                  type="button"
                  onClick={() => switchEntityTab(eid)}
                  className={`flex items-center justify-between px-4 py-3 rounded-m border text-left transition-all ${
                    active
                      ? 'bg-white text-neutral-900 border-white shadow-md'
                      : 'bg-brand-950/60 text-neutral-200 border-white/15 hover:bg-brand-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-accent-600' : 'text-accent-400'
                      }`}
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{info.label}</div>
                      <div
                        className={`text-[10px] truncate ${
                          active ? 'text-neutral-500' : 'text-neutral-400'
                        }`}
                      >
                        Panier indépendant
                      </div>
                    </div>
                  </div>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      badgeCount > 0
                        ? 'bg-accent-500 text-white'
                        : active
                          ? 'bg-neutral-200 text-neutral-600'
                          : 'bg-white/10 text-neutral-300'
                    }`}
                  >
                    {badgeCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-accent-500 tracking-wider">
              Sélection active · {meta.label} uniquement
            </span>
            <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
              {isLogistik
                ? 'Équipements & engins sélectionnés pour location'
                : 'Articles sélectionnés'}
            </h2>
          </div>

          {cart.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold self-start md:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vider le panier {meta.shortLabel}</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-brand-950 border border-neutral-200 dark:border-brand-700 rounded-l p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-brand-800 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
              Votre panier {meta.shortLabel} est vide
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Chaque entité dispose de son propre panier isolé. Parcourez {meta.catalogLabel} pour
              ajouter des références à cette entité sans interférer avec les autres.
            </p>
            <div className="pt-2">
              <Link
                href={meta.catalogHref}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-sm shadow-sm"
              >
                <span>Explorer {meta.catalogLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LISTE DES ARTICLES DE L'ENTITÉ ACTIVE */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => {
                const days = isLogistik ? Math.max(1, item.days || 1) : 1;
                const lineTotal = (item.product.indicativePriceFCFA || 0) * item.quantity * days;
                const thumbUrl = item.product.images?.[0];
                return (
                  <div
                    key={item.product.id}
                    className="bg-white dark:bg-brand-950 border border-neutral-200 dark:border-brand-700 rounded-m p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-xs"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-brand-800 rounded-m overflow-hidden shrink-0 border border-neutral-200 dark:border-brand-700">
                        {thumbUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-[10px]">
                            IMG
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-accent-500 font-bold uppercase tracking-wider">
                            {item.product.category}
                          </span>
                          {item.product.brand && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                              {item.product.brand}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-[11px] font-mono text-neutral-500">
                          Réf: {item.product.ref} ·{' '}
                          {(item.product.indicativePriceFCFA || 0) > 0
                            ? `${(item.product.indicativePriceFCFA || 0).toLocaleString('fr-FR')} FCFA / ${item.product.unit}`
                            : 'Tarification sur devis'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantité */}
                      <div className="flex items-center border border-neutral-200 dark:border-brand-700 rounded-m bg-neutral-50 dark:bg-brand-900">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product.id, item.quantity - 1, days)}
                          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-brand-800 transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.product.id, item.quantity + 1, days)}
                          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-brand-800 transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Durée en jours pour SB-S Logistik */}
                      {isLogistik && (
                        <div className="flex items-center gap-1 border border-amber-300 dark:border-amber-700/60 rounded-m bg-amber-50/70 dark:bg-amber-950/30 px-2 py-1">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          <input
                            type="number"
                            min={1}
                            max={365}
                            value={days}
                            onChange={(e) =>
                              handleUpdateQty(
                                item.product.id,
                                item.quantity,
                                Math.max(1, parseInt(e.target.value, 10) || 1)
                              )
                            }
                            aria-label="Durée en jours"
                            className="w-12 bg-transparent text-xs font-mono font-bold text-neutral-900 dark:text-white text-center focus:outline-none"
                          />
                          <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">
                            j
                          </span>
                        </div>
                      )}

                      <div className="text-right min-w-[100px]">
                        <span className="block text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
                          {lineTotal > 0 ? `${lineTotal.toLocaleString('fr-FR')} F` : 'Sur devis'}
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          {isLogistik ? `${item.quantity} × ${days} j` : item.product.unit}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.product.id, 0)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                        title="Retirer du panier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <Link
                  href={meta.catalogHref}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-500 hover:underline"
                >
                  <span>+ Ajouter d&apos;autres éléments depuis {meta.catalogLabel}</span>
                </Link>
              </div>
            </div>

            {/* RÉCAPITULATIF & FORMULAIRE DÉDIÉ */}
            <div className="lg:col-span-5 bg-white dark:bg-brand-950 border border-neutral-200 dark:border-brand-700 rounded-l p-6 space-y-6 sticky top-28 shadow-sm">
              <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-brand-800 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-500" />
                <span>
                  {isLogistik
                    ? 'Exprimer un besoin SB-S Logistik'
                    : `Demande de devis · ${meta.shortLabel}`}
                </span>
              </h2>

              <div className="space-y-2.5 text-xs font-mono border-b border-neutral-200 dark:border-brand-800 pb-4">
                <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300">
                  <span>Sous-total estimatif HT :</span>
                  <span className="tabular-nums">
                    {subtotalHT > 0 ? `${subtotalHT.toLocaleString('fr-FR')} FCFA` : 'Sur étude'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-300">
                  <span>TVA (18% Sénégal) :</span>
                  <span className="tabular-nums">
                    {taxAmount > 0 ? `${taxAmount.toLocaleString('fr-FR')} FCFA` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-brand-800">
                  <span>Total estimé TTC :</span>
                  <span className="text-accent-500 text-base tabular-nums">
                    {totalTTC > 0 ? `${totalTTC.toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-m bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Coordonnées du demandeur
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Nom complet / Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientData.name}
                    onChange={(e) => setClientData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: Babacar Seck"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Entreprise / Maître d&apos;ouvrage
                  </label>
                  <input
                    type="text"
                    value={clientData.company}
                    onChange={(e) => setClientData((p) => ({ ...p, company: e.target.value }))}
                    placeholder="Ex: Société BTP Dakar"
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
                      onChange={(e) => setClientData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+221 77 ..."
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={clientData.email}
                      onChange={(e) => setClientData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="contact@entreprise.sn"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {isLogistik ? 'Site de chantier / Déploiement *' : 'Lieu de livraison'}
                    </span>
                  </label>
                  <input
                    type="text"
                    required={isLogistik}
                    value={clientData.deliveryLocation}
                    onChange={(e) =>
                      setClientData((p) => ({ ...p, deliveryLocation: e.target.value }))
                    }
                    placeholder="Ex: Diamniadio, Dakar Plateau, Rufisque..."
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                  />
                </div>

                {isLogistik && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Date de début souhaitée
                      </label>
                      <input
                        type="date"
                        value={clientData.startDate}
                        onChange={(e) =>
                          setClientData((p) => ({ ...p, startDate: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Priorité / Urgence
                      </label>
                      <select
                        value={clientData.urgency}
                        onChange={(e) =>
                          setClientData((p) => ({ ...p, urgency: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                      >
                        <option value="Normale">Normale</option>
                        <option value="Urgente">Urgente (&lt; 24h)</option>
                        <option value="Planifiée">Planifiée</option>
                      </select>
                    </div>
                    <label className="col-span-2 flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clientData.withOperator}
                        onChange={(e) =>
                          setClientData((p) => ({ ...p, withOperator: e.target.checked }))
                        }
                        className="rounded border-neutral-300 text-accent-500"
                      />
                      <span>Inclure conducteur / opérateur certifié SB-S Logistik</span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Précisions techniques ou observations
                  </label>
                  <textarea
                    rows={2}
                    value={clientData.notes}
                    onChange={(e) => setClientData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Contraintes d'accès, horaires de livraison, détails techniques..."
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-bold rounded-m text-sm shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>
                    {submitting
                      ? 'Transmission en cours...'
                      : isLogistik
                        ? 'Transmettre le besoin à SB-S Logistik'
                        : `Envoyer la demande à ${meta.shortLabel}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PanierPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 flex items-center justify-center text-sm text-neutral-500">
          Chargement du panier isolé...
        </div>
      }
    >
      <PanierIsolateContent />
    </Suspense>
  );
}
