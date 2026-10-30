'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LAB_TESTS } from '@/data/initialData';
import { PHOTOS_REELLES } from '@/data/siteImages';
import { FlaskConical, ShieldCheck, FileCheck, Clock, CheckCircle2, ArrowRight, MapPin, Phone, Mail, Award } from 'lucide-react';

const CATEGORIES = ['Tous', 'Sols & géotechnique', 'Bétons & granulats', 'Contrôle in-situ'] as const;

export default function LaboratoirePage() {
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>('Tous');

  const filteredTests = category === 'Tous'
    ? LAB_TESTS
    : LAB_TESTS.filter(t => t.category === category);

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Services' }, { label: 'Laboratoire SB-S Labo', href: '/services/laboratoire' }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        {/* Image d'arrière-plan géotechnique officielle */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/reelles/sbs-labo-reel-005.jpg"
          alt="Foreuse géotechnique APAFOR 450RS SB-S Labo en action sur chantier"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-950/75 pointer-events-none" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs font-mono font-bold  tracking-wider text-emerald-400 mb-5">
            <FlaskConical className="w-3.5 h-3.5" />
            Laboratoire agréé catégories C2 & A2
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mb-4">
            SB-S Labo — <span className="text-emerald-400">Géotechnique & contrôle qualité</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            Filiale géotechnique créée en 2021 et agréée catégories C2 et A2, SB-S Labo est spécialisée en
            mécanique des sols. Nous réalisons des études de sol, des essais sur roches et des analyses
            sur béton avec un équipement de pointe pour garantir la sécurité et la pérennité de vos ouvrages.
          </p>
          <p className="text-xs font-mono text-neutral-500 mt-4">RC : SN DKR 2021 B 12675 · Agréments ministériels C2 & A2 — cadre LNR-BTP (loi n° 2023-12, décret n° 2023-1780)</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Essais / an', value: '12 800+' },
              { label: 'Études de sol', value: '380+' },
              { label: 'Délai PV standard', value: '48h' },
              { label: 'Création', value: '2021' },
            ].map(m => (
              <div key={m.label} className="bg-brand-800/60 border border-brand-700 rounded-m p-4">
                <p className="text-2xl font-title font-bold text-emerald-400 tabular-nums">{m.value}</p>
                <p className="text-[11px] font-mono  tracking-wider text-neutral-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vraies photos du laboratoire (documents officiels) */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { img: PHOTOS_REELLES.laboVue, label: 'Laboratoire SB-S Labo' },
              { img: PHOTOS_REELLES.laboEssais, label: 'Essais en cours' },
              { img: PHOTOS_REELLES.laboMateriel1, label: 'Équipements d\'essai' },
              { img: PHOTOS_REELLES.laboMateriel2, label: 'Contrôle qualité béton' },
            ].map(p => (
              <div key={p.label} className="relative rounded-l overflow-hidden border border-brand-700 shadow-elev-2 aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={`SB-S Labo — ${p.label}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-[10px] font-mono font-bold  tracking-wider text-white">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] font-mono text-neutral-500 mt-3">
            Laboratoire géotechnique agréé catégories C2 et A2 · Photos officielles SB-S Labo
          </p>
        </div>
      </section>

      {/* PRESTATIONS */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
          Prestations techniques
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          Chaque essai est réalisé selon les normes NF / ISO en vigueur, avec procès-verbal traçable sous 48h.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            {
              icon: <MapPin className="w-6 h-6 text-emerald-600" />,
              title: 'Études de sol (G2AVP)',
              desc: 'Études géotechniques réglementaires G2AVP pour permis de construire, sondages carottés, pénétrométrie et topographie.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
              title: 'Essais sur sols & roches',
              desc: 'Proctor, CBR, cisaillement, limites d\'Atterberg, granulométrie : caractérisation complète de la portance et du compactage.',
            },
            {
              icon: <FileCheck className="w-6 h-6 text-emerald-600" />,
              title: 'Analyses béton frais & durci',
              desc: 'Résistance à la compression (7j/14j/28j), slump, air entraîné, carbonatation : contrôle complet de la chaîne béton.',
            },
          ].map(p => (
            <div key={p.title} className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-m flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white mb-2">{p.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* CATALOGUE D'ESSAIS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight">
            Catalogue des essais
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-m text-xs font-semibold border transition-colors ${
                  category === c
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-brand-700 hover:border-emerald-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden divide-y divide-neutral-200 dark:divide-brand-700">
          {filteredTests.map(test => (
            <div key={test.id} className="p-5 sm:p-6 hover:bg-neutral-50 dark:hover:bg-brand-800/80 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                      {test.code}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-brand-900 text-neutral-600 dark:text-neutral-400">
                      {test.category}
                    </span>
                    {test.isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Disponible
                      </span>
                    )}
                  </div>
                  <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm sm:text-base mb-1">
                    {test.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{test.description}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span><strong className="font-semibold">Norme :</strong> {test.norm}</span>
                    <span><strong className="font-semibold">Échantillon :</strong> {test.sampleRequired}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-brand-900 px-2.5 py-1.5 rounded-m">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {test.standardDelayDays} j ouvrés
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RÉALISATIONS & ÉTUDES GÉOTECHNIQUES DE RÉFÉRENCE */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                Chantiers & preuves de compétence in-situ
              </span>
              <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-1 tracking-tight">
                Réalisations géotechniques & études de sol SB-S Labo
              </h2>
            </div>
            <Link
              href="/projets?entite=sbs-labo"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Voir toutes les études de cas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Reconnaissance géotechnique approfondie tour R+16 — Dakar',
                location: 'Plateau, Dakar (SICAP SA)',
                metric: '142 essais · 45 m de profondeur',
                desc: 'Campagne de forages carottés profonds avec la foreuse APAFOR 450RS, essais pressiométriques Ménard et modélisation de tassement pour fondations sur pieux de 800 mm en milieu urbain dense.',
                image: '/images/reelles/sbs-labo-reel-005.jpg',
                caption: 'Foreuse APAFOR 450RS SB-S Labo en action sur site'
              },
              {
                title: 'Contrôle de compactage & essais CBR — Autoroute Mbour-Fatick-Kaolack',
                location: 'Axe autoroutier (Ageroute)',
                metric: '450+ essais CBR 4j · G2 / G3',
                desc: 'Campagne continue de contrôle de portance CBR immersion 4 jours (NF P 94-078), essais Proctor modifiés et mesures de compacité in-situ au gammadensimètre pour la réception des couches de chaussée.',
                image: '/images/reelles/sbs-labo-reel-002.jpg',
                caption: 'Essais de portance in-situ et contrôle géotechnique de plateforme'
              },
              {
                title: 'Contrôle qualité béton sous presse 3 000 kN — Pont de Foundiougne',
                location: 'Foundiougne, Sine Saloum',
                metric: '1 200 éprouvettes · Presse 3 000 kN',
                desc: 'Suivi d\'échantillonnage continu d\'éprouvettes béton 16×32, essais d\'affaissement au cône d\'Abrams et validation des résistances à la compression C35/45 sous presse asservie hydraulique (NF EN 12390-3).',
                image: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg',
                caption: 'Écrasement d\'éprouvettes béton 16×32 sous presse asservie 3 000 kN'
              }
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-2 transition-all flex flex-col group"
              >
                <div className="relative aspect-[16/9] bg-neutral-200 dark:bg-brand-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-brand-900/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-400">
                    {p.metric}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white/90 font-mono bg-black/60 backdrop-blur-sm px-2 py-1 rounded truncate">
                    {p.caption}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                      {p.location}
                    </span>
                    <h3 className="font-title font-bold text-sm text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RÉFÉRENCES */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
            Références géotechniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
              <h3 className="font-mono text-xs font-bold  tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">Études de sol (G2AVP)</h3>
              <ul className="space-y-2.5">
                {[
                  { c: 'Batinov', p: 'École à Diamniadio — sondage carotté + pressiométrique' },
                  { c: 'Manufactures d\'Afrique', p: 'Réservoirs industriels à Petit Mbao — G2AVP' },
                  { c: 'EBTP Papa Lo', p: 'Centre solaire du DAC de Dodji — puits manuel + PDL' },
                  { c: 'Beco Ingénierie', p: 'Mur de soutènement 20 ml à Bandia — G2AVP' },
                  { c: 'SGS', p: 'Hangar du Môle 5 TVS au Port de Dakar — 4 sondages carottés' },
                  { c: 'SGS', p: 'Station service à Grand Yoff — G2AVP' },
                  { c: 'African Builders', p: 'Référence sondage — reconnaissance de sol' },
                  { c: 'SADE', p: 'Référence sondage — infrastructures' },
                  { c: 'TFG', p: 'Référence sondage — études géotechniques' },
                  { c: 'Dakar Dur', p: 'Référence sondage — contrôle de portance' },
                  { c: 'Presse I-Tech', p: 'Référence sondage — reconnaissance géotechnique' },
                  { c: 'Sénégal Fleur', p: 'Référence sondage — essais in-situ' },
                ].map(r => (
                  <li key={r.c + r.p} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold">{r.c}</strong> — {r.p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
              <h3 className="font-mono text-xs font-bold  tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">Essais béton & topographie</h3>
              <ul className="space-y-2.5">
                {[
                  { c: 'Béton Concept', p: 'Centrale à béton — SCI Xewell, Émissaire Camberène, La Marina, Port de Bargny, château d\'eau…' },
                  { c: 'La Marina', p: 'Hôtel La Marina & Marina Bay — essais béton' },
                  { c: 'Kalia', p: 'Palm Resort & SIA — contrôle qualité' },
                  { c: 'SERMA BTP', p: 'Topographie — stations Shell Fatick, Sandiara, Touba Toul, Thiaroye, Koussanar' },
                  { c: 'Kanté Group Delta', p: 'Immeuble R+4 à Saly Carrefour — implantation' },
                  { c: 'African Builders', p: 'Référence écrasement béton — contrôle qualité' },
                  { c: 'Marina SCC', p: 'Référence écrasement béton' },
                  { c: 'Senegex', p: 'Référence écrasement béton' },
                  { c: 'Construc Sen', p: 'Référence écrasement béton' },
                  { c: 'Baticoncept', p: 'Référence écrasement béton' },
                  { c: 'Kebimo SARL', p: 'Référence écrasement béton' },
                  { c: 'Lamp Fall Bâtiment', p: 'Référence écrasement béton' },
                  { c: 'GIE Reform', p: 'Référence écrasement béton' },
                  { c: 'Elecnor', p: 'Référence écrasement béton' },
                  { c: 'Bi-Tech', p: 'Référence écrasement béton' },
                  { c: 'BET 2SI Engineering', p: 'Référence écrasement béton' },
                ].map(r => (
                  <li key={r.c + r.p.slice(0, 20)} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold">{r.c}</strong> — {r.p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CONTACT CTA */}
        <div className="mt-12 bg-brand-900 dark:bg-brand-950 border border-brand-800 rounded-l p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-title font-bold text-white mb-2">
            Demander un essai ou une étude de sol
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto mb-6">
            Transmission des prélèvements au laboratoire, exécution normée et PV signé par l'ingénieur responsable.
            Réponse sous 24h ouvrées.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-m text-sm transition-colors"
            >
              Demander un essai <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+221338324010"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-800 hover:bg-brand-700 text-white font-bold rounded-m text-sm transition-colors"
            >
              <Phone className="w-4 h-4" /> +221 33 832 40 10
            </a>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> labo@sbsgroup.sn</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Cité Keur Gorgui, Dakar</span>
          </div>
        </div>
      </section>
    </div>
  );
}