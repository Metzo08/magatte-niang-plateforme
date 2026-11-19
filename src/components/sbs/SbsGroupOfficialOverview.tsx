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
  Facebook,
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
  {
    name: 'Solene',
    sub: 'Équipements & Systèmes d’Énergie',
    logo: '/media/sbs-group/partners/solene.webp',
  },
  {
    name: 'Polytech Entreprise',
    sub: 'Supervision, Études & Réalisations Industrielles',
    logo: '/media/sbs-group/partners/polytech.svg',
  },
  {
    name: 'LDC',
    sub: 'Louis Dreyfus Company',
    logo: '/media/sbs-group/partners/ldc.svg',
  },
  {
    name: 'OIM',
    sub: 'ONU Migration',
    logo: '/media/sbs-group/partners/oim.png',
  },
  {
    name: 'CES',
    sub: 'Compagnie d’Électricité du Sénégal',
    logo: '/media/sbs-group/partners/ces.svg',
  },
  {
    name: 'Eiffage',
    sub: 'Grands Travaux & Infrastructures',
    logo: '/media/sbs-group/partners/eiffage.svg',
  },
  {
    name: 'Autoroute de l’Avenir',
    sub: 'Dakar – AIBD',
    logo: '/media/sbs-group/partners/autoroute-avenir.png',
  },
  {
    name: 'Grande Côte Operations SA',
    sub: 'Eramet Grande Côte · Industrie Minière',
    logo: '/media/sbs-group/partners/eramet.png',
  },
  {
    name: 'Press High-Tech',
    sub: 'Prestations & Sous-Traitance',
    logo: '/media/sbs-group/partners/press-hightech.svg',
  },
  {
    name: 'SERMA BTP',
    sub: 'Ingénierie & Modélisation 3D/BIM',
    logo: '/media/sbs-group/partners/serma-btp.jpg',
  },
];

export default function SbsGroupOfficialOverview() {
  return (
    <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700 space-y-10">
      {/* En-tête Identité Officielle + Logo SB-S Group */}
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
            en bâtiment, charpente métallique, génie civil et travaux industriels au Sénégal et en
            Afrique de l&apos;Ouest, appuyée par ses pôles intégrés <strong>SB-S Industrie</strong>{' '}
            et <strong>SB-S Logistik</strong>.
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
                <div className="font-bold text-white">Contact &amp; Réseaux</div>
                <a
                  href="mailto:infos@sbsgroup.sn"
                  className="text-amber-300 hover:underline font-mono break-all block"
                >
                  infos@sbsgroup.sn
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100065007634538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-sky-200 hover:text-white font-semibold hover:underline"
                >
                  <Facebook className="w-3.5 h-3.5 text-sky-400" />
                  Page Facebook officielle
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-white/40 flex flex-col items-center justify-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/sbs-group/logo-sbs-group.png"
              alt="Logo officiel SB-S Group · Stein Bauer Sénégal Group"
              className="w-full max-w-[260px] h-auto object-contain"
            />
            <div className="mt-4 pt-3 border-t border-neutral-200 w-full">
              <div className="text-[11px] font-semibold text-neutral-600">
                Bâtiment · Charpente · Travaux Industriels
              </div>
            </div>
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

      {/* Nos Partenaires Officiels · Carrousel défilant continu */}
      <div className="rounded-2xl bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 p-6 sm:p-8 space-y-6 overflow-hidden">
        <style>{`
          @keyframes sbsPartnersMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .sbs-partners-marquee-track {
            display: flex;
            width: max-content;
            animation: sbsPartnersMarquee 28s linear infinite;
          }
          .sbs-partners-marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex items-center gap-2.5">
          <Handshake className="w-5 h-5 text-[#2D6A8E] dark:text-sky-400" />
          <div>
            <h3 className="text-lg sm:text-xl font-title font-bold text-neutral-900 dark:text-white">
              Nos partenaires &amp; références institutionnelles
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Ils font confiance à Stein Bauer Sénégal Group pour leurs ouvrages et infrastructures
              critiques.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden py-2">
          <div className="sbs-partners-marquee-track gap-4">
            {[...OFFICIAL_PARTNERS, ...OFFICIAL_PARTNERS].map((p, idx) => (
              <div
                key={`${p.name}-${idx}`}
                className="w-52 sm:w-56 shrink-0 group rounded-xl bg-white border border-neutral-200 dark:border-brand-700 p-4 flex flex-col items-center justify-between text-center shadow-xs hover:border-[#2D6A8E] hover:shadow-md transition-all"
              >
                <div className="h-16 w-full flex items-center justify-center mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.logo}
                    alt={`Logo partenaire ${p.name}`}
                    className="max-h-14 max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
                <div className="pt-2 border-t border-neutral-100 w-full">
                  <div className="text-xs font-bold text-neutral-900">{p.name}</div>
                  <div className="text-[10px] text-neutral-500 leading-tight mt-0.5">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
