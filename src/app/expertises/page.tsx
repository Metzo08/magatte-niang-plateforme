'use client';

import React from 'react';
import Link from 'next/link';
import {
  Hammer,
  Building2,
  FlaskConical,
  Factory,
  Truck,
  Layers,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { EXPERTISE_IMAGES, SITE_IMAGES } from '@/data/siteImages';

export default function ExpertisesPage() {
  const domains = [
    {
      id: 'construction-metallique',
      title: 'Charpentes métalliques & ouvrages industriels',
      entity: 'SERMA BTP',
      entityId: 'serma-btp',
      color: '#1B4965',
      image: EXPERTISE_IMAGES.charpenteMetal,
      icon: Hammer,
      desc: 'Étude aux éléments finis, modélisation 3D, usinage haute précision, grenaillage et montage sur site de charpentes à grande portée (jusqu\'à 45m sans poteau).',
      points: [
        'Calculs conformes aux Eurocodes 3 et normes NF',
        'Ligne de découpe plasma 3D haute définition',
        'Capacité d\'usinage de plus de 4 500 tonnes / an',
        'Protections anticorrosion adaptées au climat marin de Dakar'
      ]
    },
    {
      id: 'geotechnique-essais',
      title: 'Géotechnique, sols & essais matériaux',
      entity: 'SB-S Labo',
      entityId: 'sbs-labo',
      color: '#1F9D6B',
      image: EXPERTISE_IMAGES.foreuseGeotechnique,
      icon: FlaskConical,
      desc: 'Reconnaissance des sols de fondation, essais in-situ au pénétromètre et laboratoire d\'écrasement béton avec émission de procès-verbaux certifiés sous 48h.',
      points: [
        'Essais CBR et Proctor selon NF P 94-078',
        'Écrasement d\'éprouvettes béton sur presses asservies 3000 kN',
        'Sondages carottés et analyses de stabilité de talus',
        'Contrôle qualité indépendant pour maîtres d\'ouvrage'
      ]
    },
    {
      id: 'revetements',
      title: 'Revêtements & carrelages grand format',
      entity: 'P2M',
      entityId: 'p2m',
      color: '#C0562F',
      image: EXPERTISE_IMAGES.carrelagePrestige,
      icon: Layers,
      desc: 'Distribution et fourniture de grès cérame de premier choix, faïence, dalles 20mm antidérapantes, sanitaires rimless et robinetterie inox pour projets tertiaires et résidentiels.',
      points: [
        'Stock centralisé de 45 000 m² à Dakar',
        'Import direct d\'usines certifiées en Espagne et Italie',
        'Formats 60x60, 60x120, 120x240 cm et épaisseurs 20mm',
        'Accompagnement calepinage et devis grossiste sous 24h'
      ]
    },
    {
      id: 'genie-civil',
      title: 'Génie civil, ouvrages d\'art & VRD',
      entity: 'SB-S Group',
      entityId: 'sbs-group',
      color: '#2D6A8E',
      image: EXPERTISE_IMAGES.chantierInfrastructure,
      icon: Building2,
      desc: 'Construction d\'infrastructures routières, ponts mixtes acier-béton, plateformes multimodales et assainissement lourd en groupement d\'entreprises.',
      points: [
        'Direction de projets d\'infrastructures publiques et privées',
        'Bétons techniques haute durabilité en milieu salin',
        'Voiries et réseaux divers (VRD) grande envergure',
        'Respect rigoureux des plannings d\'exécution'
      ]
    },
    {
      id: 'logistique',
      title: 'Logistique lourde & levage BTP',
      entity: 'SB-S Logistik',
      entityId: 'sbs-logistik',
      color: '#E0A800',
      image: '/images/engins/sbs-grue-mobile-chantier.jpg',
      icon: Truck,
      desc: 'Mise à disposition d\'une flotte de 82 engins lourds (pelles 36T, grues télescopiques 60T/100T, camions bennes 8x4) avec opérateurs qualifiés et maintenance 24/7.',
      points: [
        'Taux de disponibilité de la flotte supérieur à 94%',
        'Transport de matériaux et agrégats sur tout le Sénégal',
        'Opérations de levage complexe sous encadrement HSE',
        'Réservation en ligne avec calendrier de disponibilité'
      ]
    },
    {
      id: 'prefabrication-beton',
      title: 'Préfabrication béton industrielle',
      entity: 'SB-S Industries',
      entityId: 'sbs-industries',
      color: '#6B7A8F',
      image: '/images/realisations/sbs-industries-prefabrication-usine.jpg',
      icon: Factory,
      desc: 'Usine de fabrication d\'éléments modulaires en béton précontraint et armé pour accélérer les chantiers et fiabiliser la qualité structurelle.',
      points: [
        'Prédalles industrielles pour planchers grande portée',
        'Bordures de trottoirs T1, T2, A2 et caniveaux normalisés',
        'Pavés autobloquants 6cm et 8cm pour voiries lourdes',
        'Production automatisée sous contrôle continu SB-S Labo'
      ]
    },
    {
      id: 'etudes-ingenierie',
      title: 'Études & ingénierie',
      entity: 'SERMA BTP',
      entityId: 'serma-btp',
      color: '#060E18',
      image: EXPERTISE_IMAGES.chantierLevage,
      icon: Globe,
      desc: 'Maîtrise d\'œuvre et ingénierie de projet : études de structures, plans d\'exécution, métrés et assistance technique de la conception jusqu\'à la réception de l\'ouvrage.',
      points: [
        'Études de structures béton armé et métallique (Eurocodes)',
        'Plans d\'exécution et notes de calcul structurales',
        'Modélisation 3D / BIM et dossiers de conception',
        'Assistance à la maîtrise d\'ouvrage jusqu\'à la réception'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb items={[{ label: 'Expertises BTP' }]} />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        
        {/* HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono  font-bold text-accent-500 tracking-wider">
              Savoir-faire & maîtrise technique
            </span>
            <h1 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-white">
              Une ingénierie complète pour vos projets d'envergure
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Notre écosystème intègre l'ensemble des expertises nécessaires pour sécuriser vos ouvrages de la phase conception jusqu'à la livraison finale.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE_IMAGES.rubonChantier}
            alt="Chantier d'ingénierie Magatte Niang Expert"
            className="w-full h-56 sm:h-72 object-cover rounded-l border border-neutral-200 dark:border-brand-700 shadow-elev-2"
          />
        </div>

        {/* DOMAINS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {domains.map((dom, idx) => (
            <div
              key={idx}
              id={dom.id}
              className="scroll-mt-28 bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l shadow-sm flex flex-col justify-between overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dom.image}
                alt={dom.title}
                className="w-full h-44 object-cover"
                loading="lazy"
              />
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-m flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: dom.color }}
                  >
                    <dom.icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${dom.color}20`, color: dom.color }}
                  >
                    {dom.entity}
                  </span>
                </div>

                <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                  {dom.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {dom.desc}
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-brand-750">
                  {dom.points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-brand-700 flex items-center justify-between">
                <Link
                  href={`/entites/${dom.entityId}`}
                  className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-accent-500"
                >
                  Découvrir {dom.entity}
                </Link>
                <Link
                  href={`/assistant?besoin=${dom.entityId}`}
                  className="px-3.5 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded text-xs font-semibold"
                >
                  Qualifier ce besoin
                </Link>
              </div>
              </div>
          ))}
        </div>

      </div>
    </div>
  );
}
