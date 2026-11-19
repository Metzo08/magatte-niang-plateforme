'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Hammer,
  Wrench,
  Droplets,
  Zap,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Handshake,
  Factory,
  Truck,
} from 'lucide-react';

const OFFICIAL_DOMAINS = [
  {
    title: 'Bâtiment',
    desc: 'Immeubles R+N, bureaux, résidences, gros œuvre et bâtiments clé en main.',
    icon: Building2,
  },
  {
    title: 'Travaux Publics',
    desc: 'Terrassement de masse, voiries lourdes VRD, plateformes logistiques et génie civil.',
    icon: Hammer,
  },
  {
    title: 'Constructions Métalliques',
    desc: 'Chaudronnerie industrielle et charpente métallique grande portée.',
    icon: Wrench,
  },
  {
    title: "Ouvrages d'Art",
    desc: 'Ponts mixtes acier-béton, murs de soutènement, silos et fondations spéciales.',
    icon: ShieldCheck,
  },
  {
    title: 'Hydraulique',
    desc: 'Stations de pompage, réseaux hydrauliques industriels et ouvrages de rétention.',
    icon: Droplets,
  },
  {
    title: 'Assainissement',
    desc: 'Caniveaux béton armé, réseaux de drainage, décanteurs et fosses grande capacité.',
    icon: Droplets,
  },
  {
    title: 'Énergie',
    desc: 'Génie civil de centrales thermiques, postes techniques et installations énergétiques.',
    icon: Zap,
  },
  {
    title: 'Plomberie',
    desc: 'Réseaux fluides, plomberie industrielle, sanitaire tertiaire et équipements techniques.',
    icon: Wrench,
  },
];

const OFFICIAL_PARTNERS = [
  { name: 'Solene', sub: 'Équipements & Systèmes d’Énergie' },
  { name: 'Polytech Entreprise', sub: 'Supervision, Études & Réalisations Industrielles' },
  { name: 'LDC', sub: 'Louis Dreyfus Company' },
  { name: 'OIM', sub: 'ONU Migration' },
  { name: 'CES', sub: 'Compagnie d’Électricité du Sénégal' },
  { name: 'Eiffage', sub: 'Grands Travaux & Infrastructures' },
  { name: 'Autoroute de l’Avenir', sub: 'Dakar – AIBD' },
  { name: 'Grande Côte Operations SA', sub: 'Industrie Minière' },
  { name: 'Press High-Tech', sub: 'Prestations & Sous-Traitance' },
  { name: 'SERMA BTP', sub: 'Ingénierie & Modélisation 3D/BIM' },
];

export default function SbsGroupOfficialOverview() {
  return (
    <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700 space-y-10">
      {/* En-tête Identité Officielle + Plaque Siège */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-gradient-to-br from-[#0f2744] via-[#133256] to-[#0a1b30] text-white rounded-2xl p-6 sm:p-8 border border-sky-400/20 shadow-elev-2">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/35 text-sky-200 text-xs font-mono font-bold">
            Stein Bauer Sénégal Group · SB-S Group
          </div>
          <h2 className="text-2xl sm:text-3xl font-title font-bold tracking-tight">
            « Nous partageons vos projets »
          </h2>
          <p className="text-sm text-sky-100/90 leading-relaxed max-w-2xl">
            <strong>Stein Bauer Sénégal Group (SB-S Group)</strong> déploie une expertise complète
            en génie civil, construction métallique et travaux industriels au Sénégal et en Afrique
            de l&apos;Ouest, appuyée par ses pôles intégrés <strong>SB-S Industrie</strong> et{' '}
            <strong>SB-S Logistik</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Siège social Mbao</div>
                <div className="text-sky-100/80">
                  Mbao Ville Neuve, Villa S/04, Rte Nationale (à côté Station MKA EXCELLENCE)
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Standard &amp; Direction</div>
                <div className="text-sky-100/80 font-mono">
                  (+221) 33 871 08 61
                  <br />
                  76 600 96 32 / 76 600 96 35
                </div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Contact officiel</div>
                <a
                  href="mailto:infos@sbsgroup.sn"
                  className="text-amber-300 hover:underline font-mono break-all"
                >
                  infos@sbsgroup.sn
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/sbs-group/sbs-plaque-siege-mbao.jpg"
              alt="Plaque officielle SB-S Group · Stein Bauer Senegal Group, Mbao Ville Neuve Villa S/04"
              className="w-full h-56 object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Les 8 Domaines d'intervention officiels */}
      <div>
        <div className="mb-5">
          <h3 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">
            Les 8 domaines d&apos;intervention officiels de SB-S Group
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Couverture intégrale des métiers du bâtiment, des travaux publics, de la construction
            métallique et des fluides industriels.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICIAL_DOMAINS.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="p-4 rounded-xl bg-neutral-50 dark:bg-brand-800/60 border border-neutral-200 dark:border-brand-700 hover:border-[#2D6A8E] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#2D6A8E]/15 text-[#2D6A8E] dark:text-sky-300 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-title font-bold text-sm text-neutral-900 dark:text-white mb-1">
                  {d.title}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {d.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Les 3 Pôles intégrés avec photos extraites */}
      <div>
        <h3 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white mb-5">
          Synergie opérationnelle · SB-S Group, SB-S Industrie &amp; SB-S Logistik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl overflow-hidden bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 shadow-xs flex flex-col">
            <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/sbs-group/sbs-installation-industrielle.jpg"
                alt="Installation industrielle et génie civil SB-S Group"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#2D6A8E] dark:text-sky-300 mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  SB-S GROUP · NOUS PARTAGEONS VOS PROJETS
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Bâtiment, travaux publics, chaudronnerie &amp; charpente métallique, ouvrages
                  d&apos;art, hydraulique, assainissement, énergie et plomberie.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-brand-700">
                +221 33 871 08 61 · 76 600 96 32 / 76 600 96 35
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 shadow-xs flex flex-col">
            <div className="aspect-[16/10] bg-neutral-100 overflow-hidden grid grid-cols-3 gap-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/sbs-group/sbs-centrale-silos-beton.jpg"
                alt="Silos et centrale à béton SB-S Industrie"
                className="w-full h-full object-cover col-span-1"
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/sbs-group/sbs-presse-blocs-paves.jpg"
                alt="Presse industrielle de préfabrication de blocs et pavés SB-S Industrie"
                className="w-full h-full object-cover col-span-2"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 mb-1">
                  <Factory className="w-3.5 h-3.5" />
                  SB-S INDUSTRIE · CONSTRUISEZ L&apos;AVENIR
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Vente de béton prêt à l&apos;emploi (BPE), agglos creux, agglos pleins, hourdis,
                  bordures et pavés autobloquants haute résistance.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-brand-700">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  +221 77 566 48 06 / 77 676 06 85
                </span>
                <Link
                  href="/entites/sbs-industries"
                  className="text-xs font-bold text-accent-600 hover:underline inline-flex items-center gap-1"
                >
                  Catalogue <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 shadow-xs flex flex-col">
            <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/sbs-group/sbs-nacelle-charpente-hangar.jpg"
                alt="Nacelle télescopique et charpente métallique SB-S Logistik"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  SB-S LOGISTIK · ENSEMBLE POUR MIEUX CONSTRUIRE
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Vente d&apos;équipements de protection individuelle (EPI), matériaux de
                  construction, matériels de chantier et location d&apos;engins lourds.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-brand-700">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  +221 77 678 45 84 / 77 858 61 05
                </span>
                <Link
                  href="/entites/sbs-logistik"
                  className="text-xs font-bold text-accent-600 hover:underline inline-flex items-center gap-1"
                >
                  Parc engins <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nos Partenaires Officiels */}
      <div className="rounded-2xl bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Handshake className="w-5 h-5 text-[#2D6A8E] dark:text-sky-400" />
            <div>
              <h3 className="text-lg sm:text-xl font-title font-bold text-neutral-900 dark:text-white">
                Nos partenaires &amp; références institutionnelles
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Ils font confiance à Stein Bauer Sénégal Group pour leurs infrastructures critiques.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-brand-700 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/sbs-group/sbs-partenaires-officiels.jpg"
            alt="Partenaires officiels SB-S Group : Solene, Polytech Entreprise, LDC, OIM, CES, Eiffage, Autoroute de l'Avenir, Grande Côte Operations SA, Press High-Tech, SERMA BTP"
            className="w-full max-h-64 object-contain bg-white"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {OFFICIAL_PARTNERS.map((p) => (
            <div
              key={p.name}
              className="px-3 py-2.5 rounded-lg bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700"
            >
              <div className="text-xs font-bold text-neutral-900 dark:text-white">{p.name}</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                {p.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
