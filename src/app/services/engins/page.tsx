'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { EQUIPMENTS, LOGISTIK_MATERIALS, CENTRALE_BETON_PRICES } from '@/data/initialData';
import { SITE_IMAGES } from '@/data/siteImages';
import { Truck, Wrench, MapPin, Phone, ArrowRight, CheckCircle2, Clock, Package, Fuel, TruckIcon } from 'lucide-react';

const CATEGORIES = ['Tous', 'Terrassement', 'Levage', 'Transport & bennes', 'Bétonnage', 'Compactage', 'Accès & coffrage', 'Énergie', 'Préfabrication'] as const;

// Parc complémentaire issu du dossier officiel SB-S Logistik
const ADDITIONAL_FLEET: { name: string; detail: string; category: string }[] = [
  { name: 'Grue mobile 50T', detail: 'Levage des structures et charpentes', category: 'Levage' },
  { name: 'Camion grue 6T', detail: 'Manutention et chargement sur site', category: 'Levage' },
  { name: 'Tractopelle', detail: 'Terrassement et manutention polyvalente', category: 'Terrassement' },
  { name: 'Dumper', detail: 'Transport de matériaux sur chantier', category: 'Terrassement' },
  { name: 'Compacteur', detail: 'Compactage des couches de forme', category: 'Compactage' },
  { name: 'Chargeuse-pelleteuse', detail: 'Nivellement et excavation', category: 'Terrassement' },
  { name: 'Camion benne 40T', detail: 'Transport lourd d\'agrégats', category: 'Transport & bennes' },
  { name: 'Camion TATA 5T', detail: 'Livraisons et petits transports', category: 'Transport & bennes' },
  { name: 'Toupie à béton 10 m³', detail: 'Transport du béton frais', category: 'Bétonnage' },
  { name: 'Pompe à béton (électrique & diesel)', detail: 'Coulage haute pression et grande hauteur', category: 'Bétonnage' },
  { name: 'Bétonnière 1000 L', detail: 'Production béton sur chantier', category: 'Bétonnage' },
  { name: 'Groupes électrogènes 150 KVA / 5 KVA', detail: 'Alimentation énergétique de chantier', category: 'Bétonnage' },
];

const STATUS_STYLES: Record<string, string> = {
  'Disponible': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'Réservé': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  'En mission': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'Maintenance': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export default function EnginsPage() {
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>('Tous');

  const filtered = category === 'Tous'
    ? EQUIPMENTS
    : EQUIPMENTS.filter(e => e.category === category);

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Services' }, { label: 'Location d\'engins SB-S Logistik', href: '/services/engins' }]} />

      {/* HERO */}
      <section className="bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-mono font-bold  tracking-wider text-amber-400 mb-5">
            <Truck className="w-3.5 h-3.5" />
            Parc d'engins & location BTP
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mb-4">
            SB-S Logistik — <span className="text-amber-400">Location d'engins & logistique</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            Gestion, maintenance et location d'un parc d'engins complet : levage, terrassement,
            transport, bétonnage et énergie. Location avec ou sans opérateur, support logistique
            multi-sites et transport d'approvisionnement de chantiers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Engins & camions en parc', value: '82' },
              { label: 'Taux de disponibilité', value: '94,2 %' },
              { label: 'Heures de levage', value: '45 000+' },
              { label: 'Dépannage sur site', value: '24/7' },
            ].map(m => (
              <div key={m.label} className="bg-brand-800/60 border border-brand-700 rounded-m p-4">
                <p className="text-2xl font-title font-bold text-amber-400 tabular-nums">{m.value}</p>
                <p className="text-[11px] font-mono  tracking-wider text-neutral-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Illustrations officielles SB-S Logistik */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE_IMAGES.camionSbs}
              alt="Camion de SB-S Group en mission transport"
              className="w-full h-52 sm:h-64 object-cover rounded-l border border-brand-700 shadow-elev-3"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE_IMAGES.sbsLogistik}
              alt="SB-S Logistik — parc d'engins et logistique"
              className="w-full h-24 sm:h-[7.5rem] object-cover rounded-l border border-brand-700"
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE_IMAGES.enginsVehicule}
              alt="Engin de chantier SB-S Logistik"
              className="w-full h-24 sm:h-[7.5rem] object-cover rounded-l border border-brand-700"
              loading="lazy"
            />
          </div>
        </div>
        <p className="text-center text-[11px] font-mono text-neutral-500 mt-2">
          Flotte SB-S Logistik · Source : magatteniang-expert.sn
        </p>
      </section>

      {/* SERVICES */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
          Nos services de location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: <Truck className="w-6 h-6 text-amber-600" />, title: 'Location avec opérateur', desc: 'Chaque engin est conduit par un opérateur chevronné, formé aux normes de sécurité et titulaire des habilitations requises.' },
            { icon: <Wrench className="w-6 h-6 text-amber-600" />, title: 'Maintenance intégrée', desc: 'Entretien préventif et dépannage sur site 24/7 : la disponibilité de la flotte est contractuellement garantie.' },
            { icon: <Package className="w-6 h-6 text-amber-600" />, title: 'Support multi-sites', desc: 'Transport et approvisionnement des chantiers partout au Sénégal, rotation et convois exceptionnels organisés.' },
          ].map(s => (
            <div key={s.title} className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-m flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* ENGINS PHARES (fiche détaillée) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight">
            Engins phares disponibles à la location
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-m text-xs font-semibold border transition-colors ${
                  category === c
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-brand-700 hover:border-amber-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {filtered.map(eq => (
            <div key={eq.id} className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-44 h-40 sm:h-auto shrink-0 bg-neutral-200 dark:bg-brand-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={eq.imageUrl} alt={eq.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                    {eq.code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${STATUS_STYLES[eq.availabilityStatus]}`}>
                    {eq.availabilityStatus}
                  </span>
                </div>
                <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm mb-1.5">{eq.name}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 space-y-0.5">
                  <span className="block"><strong>Capacité :</strong> {eq.capacity}</span>
                  <span className="block"><strong>Puissance :</strong> {eq.power}</span>
                  <span className="block inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {eq.location}</span>
                </p>
                {eq.ratePerDayFCFA && (
                  <p className="mt-3 text-sm font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {eq.ratePerDayFCFA.toLocaleString('fr-FR')} FCFA / jour
                    <span className="text-[10px] font-normal text-neutral-500 ml-1.5">(opérateur inclus)</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PARC COMPLÉMENTAIRE */}
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
          Parc complémentaire
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          L'ensemble du parc d'engins documenté dans le dossier technique SB-S Logistik.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
          {ADDITIONAL_FLEET.map(eq => (
            <div key={eq.name} className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{eq.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{eq.detail}</p>
                <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-brand-900 text-neutral-500 dark:text-neutral-400">
                  {eq.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CONDITIONS & MATÉRIAUX — issus des flyers officiels SB-S Logistik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40 rounded-l p-6">
            <h3 className="font-title font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-amber-600" /> Conditions de location
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Carburant : 60 litres par jour à la charge du client</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Transport (aller-retour) de l'engin à la charge du client</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Coffrages : délai de location de 21 jours, marge de 9 jours</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Opérateur inclus sur les engins de levage, terrassement et bétonnage</li>
            </ul>
            <p className="mt-4 text-xs font-mono text-amber-700 dark:text-amber-400">Contact direct location : 77 858 61 05</p>
          </div>
          <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
            <h3 className="font-title font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-amber-600" /> Béton prêt à l'emploi — Centrale 60 m³/h
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CENTRALE_BETON_PRICES.map(b => (
                <div key={b.classe} className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m p-3">
                  <p className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">{b.classe}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 tabular-nums">{b.prix}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">SB-S Industries · 76 480 15 05</p>
          </div>
        </div>

        {/* VENTE DE MATÉRIAUX */}
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
          Vente de matériaux & granulats
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Livraison directe sur chantier depuis nos stocks — tarifs selon destination.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {LOGISTIK_MATERIALS.map(m => (
            <div key={m.id} className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.imageUrl} alt={m.name} className="w-full h-32 object-cover" loading="lazy" />
              <div className="p-4">
                <p className="font-title font-bold text-neutral-900 dark:text-white text-sm">{m.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{m.detail}</p>
                <p className="mt-2 text-sm font-mono font-bold text-amber-600 dark:text-amber-400">{m.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-brand-900 dark:bg-brand-950 border border-brand-800 rounded-l p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-title font-bold text-white mb-2">
            Réserver un engin ou un transport
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto mb-6">
            Devis de location sous 24h. Engagement de disponibilité contractuel, opérateur certifié inclus.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-m text-sm transition-colors"
            >
              Demander une location <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+221338324010"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-800 hover:bg-brand-700 text-white font-bold rounded-m text-sm transition-colors"
            >
              <Phone className="w-4 h-4" /> Appeler le dispatching
            </a>
          </div>
          <p className="mt-6 text-xs text-neutral-500 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Dispatching joignable 7j/7 — Dakar & régions
          </p>
        </div>
      </section>
    </div>
  );
}