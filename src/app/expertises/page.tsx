'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Hammer,
  Building2,
  FlaskConical,
  Factory,
  Truck,
  Layers,
  Globe,
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { EXPERTISE_IMAGES, SITE_IMAGES } from '@/data/siteImages';

interface DomainItem {
  id: string;
  shortLabel: string;
  title: string;
  entity: string;
  entityId: string;
  serviceHref?: string;
  serviceLabel?: string;
  color: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  points: string[];
}

const DOMAINS: DomainItem[] = [
  {
    id: 'genie-civil',
    shortLabel: 'Génie civil & BTP',
    title: "Génie civil, ouvrages d'art & VRD",
    entity: 'SB-S Group',
    entityId: 'sbs-group',
    color: '#2D6A8E',
    image: EXPERTISE_IMAGES.chantierInfrastructure,
    icon: Building2,
    desc: "Construction d'infrastructures routières, ponts mixtes acier-béton, bâtiments, travaux industriels, hydraulique, assainissement et VRD en groupement d'entreprises.",
    points: [
      "Direction de projets d'infrastructures publiques et privées",
      'Bétons techniques haute durabilité en milieu salin',
      'Voiries et réseaux divers (VRD) grande envergure',
      "Respect rigoureux des plannings d'exécution",
    ],
  },
  {
    id: 'construction-metallique',
    shortLabel: 'Construction métallique',
    title: 'Charpentes métalliques & ouvrages industriels',
    entity: 'SERMA BTP',
    entityId: 'serma-btp',
    color: '#1B4965',
    image: EXPERTISE_IMAGES.charpenteMetal,
    icon: Hammer,
    desc: "Étude aux éléments finis, modélisation 3D/BIM, usinage haute précision, grenaillage et montage sur site de charpentes à grande portée (jusqu'à 45 m sans poteau).",
    points: [
      'Calculs conformes aux Eurocodes 3 et normes NF',
      'Ligne de découpe plasma 3D haute définition',
      "Capacité d'usinage de plus de 4 500 tonnes / an",
      'Protections anticorrosion adaptées au climat marin de Dakar',
    ],
  },
  {
    id: 'prefabrication-beton',
    shortLabel: 'Béton & préfabrication',
    title: 'Béton prêt à l’emploi & préfabrication industrielle',
    entity: 'SB-S Industries',
    entityId: 'sbs-industries',
    color: '#6B7A8F',
    image: '/images/realisations/sbs-industries-prefabrication-usine.jpg',
    icon: Factory,
    desc: "Usine de fabrication à Mbao Ville Neuve (Villa S/04) d'éléments modulaires en béton (agglos pleins/creux, hourdis, bordures, pavés) et centrale à béton prêt à l'emploi 60 m³/h.",
    points: [
      'Agglos creux (10×20×40 à 20×20×40) & agglos pleins (15×20×40, 20×20×40)',
      'Centrale à béton BPE C15 à C30 (60 m³/h)',
      'Pavés autobloquants 6 cm, 8 cm et 10 cm pour voiries lourdes',
      'Production automatisée sous contrôle continu SB-S Labo',
    ],
  },
  {
    id: 'geotechnique-essais',
    shortLabel: 'Laboratoire & essais',
    title: 'Géotechnique, sols & essais matériaux',
    entity: 'SB-S Labo',
    entityId: 'sbs-labo',
    serviceHref: '/services/laboratoire',
    serviceLabel: 'Ouvrir le portail SB-S Labo',
    color: '#1F9D6B',
    image: EXPERTISE_IMAGES.foreuseGeotechnique,
    icon: FlaskConical,
    desc: "Reconnaissance des sols de fondation, essais in-situ au pénétromètre et laboratoire d'écrasement béton agréé LNR-BTP (Catégories C2 & A3) avec émission de PV certifiés sous 24h.",
    points: [
      'Essais CBR et Proctor selon NF P 94-078',
      "Écrasement d'éprouvettes béton sur presses asservies 3 000 kN",
      'Sondages carottés et analyses de stabilité de talus',
      "Contrôle qualité indépendant pour maîtres d'ouvrage",
    ],
  },
  {
    id: 'logistique',
    shortLabel: 'Logistique & transport',
    title: 'Logistique lourde, levage & transport BTP',
    entity: 'SB-S Logistik',
    entityId: 'sbs-logistik',
    serviceHref: '/services/engins',
    serviceLabel: 'Voir le parc matériel & tarifs',
    color: '#E0A800',
    image: '/images/engins/sbs-grue-mobile-chantier.jpg',
    icon: Truck,
    desc: "Mise à disposition d'une flotte de 82 engins lourds (grues mobiles 50T, camions-grues 6T, tractopelles, camions bennes 40T, pompes à béton) avec opérateurs qualifiés et maintenance 24/7.",
    points: [
      'Taux de disponibilité de la flotte supérieur à 94 %',
      'Transport de matériaux et agrégats sur tout le Sénégal',
      'Opérations de levage complexe sous encadrement HSE',
      'Réservation directe avec Rokhaya KANE (+221 77 858 61 05)',
    ],
  },
  {
    id: 'etudes-ingenierie',
    shortLabel: 'Études & ingénierie',
    title: 'Études techniques, modélisation 3D/BIM & maîtrise d’œuvre',
    entity: 'SERMA BTP',
    entityId: 'serma-btp',
    color: '#060E18',
    image: EXPERTISE_IMAGES.chantierLevage,
    icon: Globe,
    desc: "Maîtrise d'œuvre et ingénierie de projet : études de structures béton armé et métallique, modélisation 3D/BIM (Robot, Tekla, Revit), plans d'exécution, métrés et assistance technique jusqu'à la réception.",
    points: [
      'Études de structures béton armé et métallique (Eurocodes, NF, ACI, ASTM)',
      "Plans d'exécution et notes de calcul structurales",
      'Modélisation 3D / BIM et dossiers de conception',
      "Assistance à la maîtrise d'ouvrage (AMO / MOE) jusqu'à la réception",
    ],
  },
  {
    id: 'revetements',
    shortLabel: 'Revêtements & finitions',
    title: 'Revêtements, carrelages grand format & sanitaires',
    entity: 'P2M',
    entityId: 'p2m',
    color: '#C0562F',
    image: EXPERTISE_IMAGES.carrelagePrestige,
    icon: Layers,
    desc: 'Distribution et fourniture de grès cérame de premier choix, faïence, dalles 20 mm antidérapantes, sanitaires et robinetterie inox depuis notre showroom de Keur Massar.',
    points: [
      'Showroom P2M implanté à Keur Massar, Sénégal',
      'Formats 30×30, 40×40, 60×60, 60×120 et 80×240 cm',
      'Équipements sanitaires complets & robinetterie chromée',
      'Accompagnement calepinage et devis grossiste sous 24h',
    ],
  },
];

function ExpertisesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domaineParam = searchParams?.get('domaine') ?? null;
  const [selectedId, setSelectedId] = useState<string>(domaineParam || 'all');

  useEffect(() => {
    if (domaineParam && DOMAINS.some((d) => d.id === domaineParam)) {
      setSelectedId(domaineParam);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      if (DOMAINS.some((d) => d.id === hashId)) {
        setSelectedId(hashId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    if (!domaineParam) {
      setSelectedId('all');
    }
  }, [domaineParam]);

  const selectDomain = (id: string) => {
    setSelectedId(id);
    if (id === 'all') {
      router.push('/expertises', { scroll: false });
    } else {
      router.push(`/expertises?domaine=${id}`, { scroll: false });
    }
  };

  const activeDomain = DOMAINS.find((d) => d.id === selectedId) || null;
  const visibleDomains = activeDomain ? [activeDomain] : DOMAINS;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb
        items={
          activeDomain
            ? [
                { label: 'Expertises BTP', href: '/expertises' },
                { label: activeDomain.shortLabel },
              ]
            : [{ label: 'Expertises BTP' }]
        }
      />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-bold text-accent-500 tracking-wider">
              Savoir-faire &amp; maîtrise technique
            </span>
            <h1 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-white">
              {activeDomain ? activeDomain.title : "Une ingénierie complète pour vos projets d'envergure"}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {activeDomain
                ? activeDomain.desc
                : "Notre écosystème intègre l'ensemble des expertises nécessaires pour sécuriser vos ouvrages de la phase conception jusqu'à la livraison finale."}
            </p>
          </div>
          <div className="relative h-56 sm:h-72 w-full overflow-hidden rounded-l border border-neutral-200 dark:border-brand-700 shadow-elev-2 bg-neutral-100 dark:bg-brand-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeDomain ? activeDomain.image : SITE_IMAGES.rubonChantier}
              alt={activeDomain ? activeDomain.title : "Chantier d'ingénierie Magatte NIANG Expert"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* BARRE DE FILTRE INTERACTIVE DES EXPERTISES */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 shadow-xs">
          <button
            type="button"
            onClick={() => selectDomain('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              selectedId === 'all'
                ? 'bg-brand-900 text-white dark:bg-accent-500'
                : 'bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Toutes les expertises ({DOMAINS.length})
          </button>
          {DOMAINS.map((d) => {
            const active = selectedId === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => selectDomain(d.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                  active
                    ? 'bg-accent-500 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-200 hover:border-accent-500 hover:text-accent-600'
                }`}
              >
                {d.shortLabel}
              </button>
            );
          })}
        </div>

        {/* DOMAINS GRID (ou Fiche Détaillée si un domaine précis est sélectionné) */}
        <div className={activeDomain ? 'max-w-4xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-8'}>
          {visibleDomains.map((dom) => (
            <div
              key={dom.id}
              id={dom.id}
              className={`scroll-mt-28 bg-white dark:bg-brand-850 rounded-l shadow-sm flex flex-col justify-between overflow-hidden border ${
                activeDomain
                  ? 'border-accent-500 ring-2 ring-accent-500/20 shadow-elev-2'
                  : 'border-neutral-300 dark:border-brand-700'
              }`}
            >
              <div className={`relative ${activeDomain ? 'h-64 sm:h-80' : 'h-48 sm:h-52'} w-full overflow-hidden bg-neutral-100 dark:bg-brand-900 shrink-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dom.image}
                  alt={dom.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-m flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: dom.color }}
                  >
                    <dom.icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded"
                    style={{ backgroundColor: `${dom.color}20`, color: dom.color }}
                  >
                    {dom.entity}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">
                  {dom.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {dom.desc}
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-brand-750">
                  {dom.points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-5 mt-4 border-t border-neutral-200 dark:border-brand-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/entites/${dom.entityId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-accent-400 hover:text-accent-500"
                    >
                      Découvrir {dom.entity} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {dom.serviceHref && (
                      <Link
                        href={dom.serviceHref}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-900/10 dark:bg-white/10 text-xs font-bold text-brand-900 dark:text-white hover:bg-brand-900/20"
                      >
                        {dom.serviceLabel}
                      </Link>
                    )}
                  </div>
                  <Link
                    href={`/assistant?besoin=${dom.entityId}`}
                    className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded text-xs font-bold"
                  >
                    Qualifier ce besoin
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeDomain && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => selectDomain('all')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-m border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-850 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:border-accent-500 transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              Voir toutes les expertises du groupe ({DOMAINS.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExpertisesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 flex items-center justify-center text-sm text-neutral-500">
          Chargement des expertises…
        </div>
      }
    >
      <ExpertisesContent />
    </Suspense>
  );
}
