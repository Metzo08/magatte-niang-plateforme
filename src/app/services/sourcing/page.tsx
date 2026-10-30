'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SITE_IMAGES } from '@/data/siteImages';
import { Globe, Ship, ShieldCheck, PackageCheck, Clock, ArrowRight, Mail, CheckCircle2, Timer, FileCheck } from 'lucide-react';

const TRANSPORT_MODES = [
  { mode: 'FCL (Full Container)', delay: '20–25 jours', detail: 'Volumes standards, conteneur dédié 20\' ou 40\'' },
  { mode: 'LCL (Less than Container)', delay: '25–30 jours', detail: 'Petites quantités groupées, facturation au volume' },
  { mode: 'Air Freight (Express)', delay: '5–7 jours', detail: 'Urgences absolues, pièces critiques' },
];

const GUARANTEES = [
  'Délai contractuel garanti ou compensation',
  '100 % de la marchandise assurée (full value)',
  'Traçabilité GPS en temps réel',
  'Zéro surprise budgétaire',
];

const SOURCING_ITEMS = [
  'Matériaux de construction (carreaux, agglos, pavés)',
  'Équipements sanitaires et robinetterie',
  'Pièces industrielles et composants spécialisés',
  'Engins de construction et équipements lourds',
  'Solutions personnalisées sur demande',
];

const ADVANTAGES = [
  { title: 'Expertise marché indien', desc: '9+ années de relations directes avec des fournisseurs certifiés ISO.' },
  { title: 'Tarifs optimisés', desc: 'Économies de 15 à 30 % grâce à la négociation groupe.' },
  { title: 'Délai sourcing', desc: 'Identification et validation fournisseurs en 5 à 7 jours.' },
  { title: 'Transparence radicale', desc: 'Aucune marge cachée, tous les coûts connus d\'avance.' },
  { title: 'Support local', desc: 'Équipe présente à Dakar, disponible 24/7.' },
  { title: 'Partenariat durable', desc: 'Conditions progressives avec le volume, consulting gratuit.' },
];

export default function SourcingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Services' }, { label: 'Sourcing & fret international PGT', href: '/services/sourcing' }]} />

      {/* HERO */}
      <section className="bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-full text-xs font-mono font-bold  tracking-wider text-purple-300 mb-5">
            <Globe className="w-3.5 h-3.5" />
            Sourcing international & import-export
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mb-4">
            PGT — <span className="text-purple-300">Polytech General Trading</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            De l'Inde au Sénégal, vos ressources sans frontières. PGT est le partenaire stratégique
            d'importation internationale de l'écosystème : sourcing fiable auprès de fabricants
            certifiés, logistique maîtrisée et qualité garantie, avec une transparence totale sur les coûts.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Économies négociées', value: '15–30 %' },
              { label: 'Délai de sourcing', value: '5–7 j' },
              { label: 'Expérience Inde', value: '9+ ans' },
              { label: 'Assurance cargo', value: '100 %' },
            ].map(m => (
              <div key={m.label} className="bg-brand-800/60 border border-brand-700 rounded-m p-4">
                <p className="text-2xl font-title font-bold text-purple-300 tabular-nums">{m.value}</p>
                <p className="text-[11px] font-mono  tracking-wider text-neutral-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Illustrations officielles PGT */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE_IMAGES.portInternational}
            alt="Port international — fret maritime PGT"
            className="w-full h-48 sm:h-60 object-cover rounded-l border border-brand-700 shadow-elev-3"
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE_IMAGES.pgt}
            alt="PGT — Polytech General Trading, sourcing international"
            className="w-full h-48 sm:h-60 object-cover rounded-l border border-brand-700 shadow-elev-3"
            loading="lazy"
          />
        </div>
        <p className="text-center text-[11px] font-mono text-neutral-500 mt-2">
          Fret international & PGT · Source : magatteniang-expert.sn
        </p>
      </section>

      {/* SERVICES */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: <Globe className="w-6 h-6 text-purple-600" />, title: 'Sourcing international', desc: 'Fournisseurs certifiés en Inde, normes ISO, audit qualité systématique et négociation tarifaire optimisée.' },
            { icon: <Ship className="w-6 h-6 text-purple-600" />, title: 'Import-export complet', desc: 'Documentation douanière, fret maritime LCL/FCL, dédouanement au Sénégal et gestion des sinistres.' },
            { icon: <PackageCheck className="w-6 h-6 text-purple-600" />, title: 'Logistique & manutention', desc: 'Entreposage sécurisé à Dakar (zone franche), consolidation de cargaisons et distribution vers les provinces.' },
          ].map(s => (
            <div key={s.title} className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-m flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* WHAT WE SOURCE */}
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
          Ce que nous sourçons
        </h2>
        <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l divide-y divide-neutral-200 dark:divide-brand-700 mb-12">
          {SOURCING_ITEMS.map(item => (
            <div key={item} className="flex items-center gap-3 p-4">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-sm text-neutral-800 dark:text-neutral-200">{item}</span>
            </div>
          ))}
        </div>

        {/* TRANSPORT MODES */}
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
          Modes de transport & délais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {TRANSPORT_MODES.map(t => (
            <div key={t.mode} className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 mb-2">
                <Timer className="w-3.5 h-3.5" /> {t.delay}
              </div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm mb-1">{t.mode}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">{t.detail}</p>
            </div>
          ))}
        </div>

        {/* GUARANTEES */}
        <div className="bg-brand-900 dark:bg-brand-950 border border-brand-800 rounded-l p-8 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-purple-300" />
            <h2 className="text-xl font-title font-bold text-white">Nos garanties contractuelles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GUARANTEES.map(g => (
              <div key={g} className="flex items-center gap-2.5 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {g}
              </div>
            ))}
          </div>
        </div>

        {/* ADVANTAGES */}
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
          Nos avantages clés
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {ADVANTAGES.map((a, i) => (
            <div key={a.title} className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm mt-1 mb-1.5">{a.title}</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* PRICE INDICATORS */}
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
          Prix indicatifs (sourcing Inde)
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Tarifs départ usine + fret, hors taxes locales. Devis ferme après validation des spécifications.
        </p>
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-sm border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden">
            <thead>
              <tr className="bg-neutral-100 dark:bg-brand-800 text-left">
                <th className="px-4 py-3 font-title font-bold text-neutral-900 dark:text-white">Produit</th>
                <th className="px-4 py-3 font-title font-bold text-neutral-900 dark:text-white">Prix indicatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-brand-700 font-mono tabular-nums">
              {[
                ['Porcelaine 60×60', '5 500 – 6 000 F/m²'],
                ['Céramique 60×60', '6 500 – 7 000 F/m²'],
                ['Faïence 20×30', '2 500 – 3 000 F/m²'],
                ['Agglos creux', '300 – 475 F/unité'],
              ].map(([p, price]) => (
                <tr key={p} className="bg-white dark:bg-brand-900">
                  <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">{p}</td>
                  <td className="px-4 py-3 font-bold text-purple-600 dark:text-purple-400">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="bg-brand-900 dark:bg-brand-950 border border-brand-800 rounded-l p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-title font-bold text-white mb-2">
            Demandez un devis sourcing gratuit
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto mb-6">
            Import-export clé en main sécurisé : documentation complète, assurance 100 %,
            traçabilité GPS et dédouanement inclus. Consultation gratuite pour optimiser votre supply chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-m text-sm transition-colors"
            >
              Lancer un sourcing <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:pgt.senegal@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-800 hover:bg-brand-700 text-white font-bold rounded-m text-sm transition-colors"
            >
              <Mail className="w-4 h-4" /> pgt.senegal@gmail.com
            </a>
          </div>
          <p className="mt-6 text-xs text-neutral-500 inline-flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" /> Dakar, Sénégal — Lun–Ven : 8h00–18h00 · Sam : 8h00–13h00
          </p>
        </div>
      </section>
    </div>
  );
}