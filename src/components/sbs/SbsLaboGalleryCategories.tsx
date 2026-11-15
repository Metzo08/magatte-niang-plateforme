'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Layers,
  Compass,
  Blocks,
  Hammer,
  ShieldCheck,
  Route,
  Activity,
  X,
  Eye,
  CheckCircle2,
  Award,
} from 'lucide-react';

export interface LaboExampleSlide {
  title: string;
  normOrRef: string;
  src: string;
  description: string;
  parameterMeasured: string;
  deliverable: string;
}

export interface LaboCategoryCard {
  id: string;
  code: string;
  badge: string;
  title: string;
  shortDesc: string;
  coverImage: string;
  isAccreditedCore?: boolean;
  iconName: string;
  examples: LaboExampleSlide[];
}

export const SBS_LABO_CATEGORIES: LaboCategoryCard[] = [
  {
    id: 'cat-c2-sols-identification',
    code: 'C.2',
    badge: 'Agrément officiel SB-S Labo · Domaine C',
    title: 'Catégorie C.2 · Essais d’identification des Sols',
    shortDesc:
      'Teneur en eau, granulométrie par tamisage et densimétrie, limites d’Atterberg, valeur au bleu de méthylène, équivalent de sable et masse volumique.',
    coverImage: '/images/reelles/sbs-labo-reel-002.jpg',
    isAccreditedCore: true,
    iconName: 'FlaskConical',
    examples: [
      {
        title: 'Analyse granulométrique par tamisage & sédimentométrie (densimétrie)',
        normOrRef: 'Référentiel LNR-BTP · Domaine C (Catégorie C.2) · NF P 94-056 / NF P 94-057',
        src: '/images/reelles/sbs-labo-reel-002.jpg',
        description:
          'Détermination de la distribution dimensionnelle des grains d’un sol (graviers, sables, limons, argiles) afin d’établir sa classification géotechnique GTR et son aptitude au compactage.',
        parameterMeasured: 'Courbe granulométrique complète, passants à 80 µm et 2 mm, coefficients d’uniformité Cu et de courbure Cc',
        deliverable: 'PV d’analyse granulométrique certifié sous 24 heures pour dimensionnement par SERMA BTP',
      },
      {
        title: 'Limites de liquidité et de plasticité (Limites d’Atterberg) & Teneur en eau',
        normOrRef: 'Référentiel LNR-BTP · Domaine C (Catégorie C.2) · NF P 94-051 / NF P 94-050',
        src: '/images/reelles/sbs-labo-reel-003.jpg',
        description:
          'Mesure des teneurs en eau marquant la transition entre les états solide, plastique et liquide des sols fins argileux pour évaluer le risque de retrait-gonflement sous les fondations.',
        parameterMeasured: 'Limite de liquidité (WL), Limite de plasticité (WP), Indice de plasticité (IP) et Indice de consistance (IC)',
        deliverable: 'Classification d’argilosité et recommandations de fondations transmises au bureau d’études SERMA BTP',
      },
      {
        title: 'Valeur de bleu de méthylène (essai à la tache) & Équivalent de sable',
        normOrRef: 'Référentiel LNR-BTP · Domaine C (Catégorie C.2) · NF P 94-068 / NF EN 933-8',
        src: '/images/reelles/sbs-labo-reel-001.jpg',
        description:
          'Caractérisation de l’activité des fines argileuses par adsorption de bleu de méthylène (VBS) et évaluation de la propreté des sols sableux.',
        parameterMeasured: 'Valeur de Bleu du Sol (VBS en g/100g) et Équivalent de Sable (ES %)',
        deliverable: 'Fiche d’identification complète du sol support',
      },
    ],
  },
  {
    id: 'cat-c2-mecanique-sols',
    code: 'C.2',
    badge: 'Agrément officiel SB-S Labo · Domaine C',
    title: 'Catégorie C.2 · Essais mécaniques sur Sol & Fondations',
    shortDesc:
      'Essai de cisaillement direct à la boîte de Casagrande, essai de chargement par palier à l’œdomètre, sondage manuel et calcul de portance.',
    coverImage: '/images/reelles/sbs-labo-reel-004.jpg',
    isAccreditedCore: true,
    iconName: 'Layers',
    examples: [
      {
        title: 'Essai de cisaillement direct rectiligne à la boîte de Casagrande',
        normOrRef: 'Référentiel LNR-BTP · Domaine C (Catégorie C.2) · NF P 94-071-1',
        src: '/images/reelles/sbs-labo-reel-004.jpg',
        description:
          'Détermination des paramètres de résistance au cisaillement d’un sol soumis à différentes contraintes normales afin de calculer la capacité portante ultime des semelles et radiers.',
        parameterMeasured: 'Cohésion effective (c’ en kPa) et angle de frottement interne (φ’ en degrés)',
        deliverable: 'Droite intrinsèque de Coulomb et contraintes admissibles de sol pour la modélisation SERMA BTP',
      },
      {
        title: 'Essai de chargement par palier à l’œdomètre (Compressibilité & Gonflement)',
        normOrRef: 'Référentiel LNR-BTP · Domaine C (Catégorie C.2) · NF P 94-090-1',
        src: '/images/reelles/sbs-labo-reel-003.jpg',
        description:
          'Étude de la consolidation primaire et secondaire des sols compressibles sous charges croissantes pour prédire les tassements absolus et différentiels sous les immeubles R+ et hangars.',
        parameterMeasured: 'Pression de préconsolidation (σ’p), indice de compression (Cc), indice de gonflement (Cs)',
        deliverable: 'Note d’évaluation des tassements prévisionnels pour le dimensionnement structurel SERMA BTP',
      },
      {
        title: 'Reconnaissance et prélèvement des sols et roches : Sondage manuel & Puits',
        normOrRef: 'Référentiel LNR-BTP · Domaine C (Catégorie C.2) · Reconnaissance In-Situ',
        src: '/images/reelles/sbs-labo-reel-002.jpg',
        description:
          'Ouverture de puits de reconnaissance, coupe lithologique détaillée, prélèvement d’échantillons intacts et remaniés pour essais mécaniques au laboratoire.',
        parameterMeasured: 'Stratigraphie des couches, niveau d’arrivée d’eau et prélèvements scellés',
        deliverable: 'Coupes géologiques et rapport d’étude de sol G2AVP / G2PRO',
      },
    ],
  },
  {
    id: 'cat-a3-granulats',
    code: 'A.3',
    badge: 'Agrément officiel SB-S Labo · Domaine A',
    title: 'Catégorie A.3 · Essais sur Granulats (Sables, Gravillons, Basalte)',
    shortDesc:
      'Teneur en eau, granularité par tamisage, coefficient d’aplatissement, équivalent de sable, bleu de méthylène, masse volumique et absorption d’eau.',
    coverImage: '/images/sbs-industries/controle-calibrage-metre-50cm-mbao.jpg',
    isAccreditedCore: true,
    iconName: 'Blocks',
    examples: [
      {
        title: 'Granularité & Forme des granulats : Coefficient d’aplatissement',
        normOrRef: 'Référentiel LNR-BTP · Domaine A (Catégorie A.3) · NF EN 933-1 / NF EN 933-3',
        src: '/images/sbs-industries/controle-calibrage-metre-50cm-mbao.jpg',
        description:
          'Contrôle de la courbe granulométrique et de la forme géométrique des gravillons (basalte de Diack, calcaire de Bandia) utilisés dans la centrale à béton BPE et la préfabrication.',
        parameterMeasured: 'Fuseau granulométrique d/D et Coefficient d’aplatissement (A %)',
        deliverable: 'Certificat de conformité des granulats sous 24 heures',
      },
      {
        title: 'Évaluation des fines : Équivalent de sable & Essai au bleu sur granulats',
        normOrRef: 'Référentiel LNR-BTP · Domaine A (Catégorie A.3) · NF EN 933-8 / NF EN 933-9',
        src: '/images/reelles/sbs-labo-reel-002.jpg',
        description:
          'Vérification de la propreté des sables de dune et sables concassés avant formulation des bétons hydrauliques de structure (C25/30, C30/37, C35/45).',
        parameterMeasured: 'Propreté du sable (ES piston) et valeur de bleu MB sur fraction 0/2 mm',
        deliverable: 'Validation d’approvisionnement pour SBS Industrie et les chantiers SB-S Group',
      },
      {
        title: 'Masse volumique apparente, réelle des particules & Absorption d’eau',
        normOrRef: 'Référentiel LNR-BTP · Domaine A (Catégorie A.3) · NF EN 1097-3 / NF EN 1097-6',
        src: '/images/reelles/agglos-industrie-production-blocs.jpg',
        description:
          'Mesure de la densité réelle, de la masse volumique en vrac et du coefficient d’absorption d’eau des granulats pour le dosage pondéral exact des centrales à béton.',
        parameterMeasured: 'Masse volumique réelle (ρrd), masse volumique apparente et absorption WA24 (%)',
        deliverable: 'Paramètres d’entrée pour formulation béton Dreux-Gorisse',
      },
    ],
  },
  {
    id: 'cat-a3-betons-roches',
    code: 'A.3',
    badge: 'Agrément officiel SB-S Labo · Domaine A',
    title: 'Catégorie A.3 · Essais sur Bétons Hydrauliques & Roches',
    shortDesc:
      'Résistance à la compression simple des éprouvettes sous presse 3 000 kN, essai d’affaissement au cône d’Abrams sur béton frais, confection et cure.',
    coverImage: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg',
    isAccreditedCore: true,
    iconName: 'Hammer',
    examples: [
      {
        title: 'Résistance à la compression simple des éprouvettes béton (7j, 14j, 28j)',
        normOrRef: 'Référentiel LNR-BTP · Domaine A (Catégorie A.3) · NF EN 12390-3',
        src: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg',
        description:
          'Écrasement d’éprouvettes cylindriques 16x32 cm après surfaçage sous presse hydraulique asservie 3 000 kN étalonnée, pour certifier les classes de résistance C20/25 à C40/50.',
        parameterMeasured: 'Charge de rupture (kN) et contrainte de compression fc7, fc14, fc28 (MPa)',
        deliverable: 'Procès-verbal officiel d’écrasement émis en 24 heures',
      },
      {
        title: 'Essais pour béton frais : Essai d’affaissement au cône d’Abrams (Slump Test)',
        normOrRef: 'Référentiel LNR-BTP · Domaine A (Catégorie A.3) · NF EN 12350-2',
        src: '/images/reelles/coulage-beton-pompe-chantier.jpg',
        description:
          'Contrôle systématique de la consistance et de l’ouvrabilité (classes S1 à S4) à l’arrivée de chaque camion toupie sur les chantiers SB-S Group avant pompage.',
        parameterMeasured: 'Affaissement au cône en mm et température du béton frais',
        deliverable: 'Bon de réception béton frais sur chantier et prélèvement d’éprouvettes',
      },
      {
        title: 'Confection et conservation normalisée des éprouvettes en salle de cure',
        normOrRef: 'Référentiel LNR-BTP · Domaine A (Catégorie A.3) · NF EN 12390-2',
        src: '/images/sbs-industries/agglos-pleins-palette-stock-mbao.jpg',
        description:
          'Moulage normalisé sur site, transport sécurisé et immersion en bassins thermostatiques à 20°C ± 2°C jusqu’aux échéances d’essais (ainsi que contrôle des briques et pavés SBS Industrie).',
        parameterMeasured: 'Traçabilité par code-barres, cure humide > 95% HR et géométrie des éprouvettes',
        deliverable: 'Registre de traçabilité béton par élément d’ouvrage (radier, poteaux, dalles)',
      },
    ],
  },
  {
    id: 'cat-c1-sondages-profonds',
    code: 'C.1 / C.2',
    badge: 'Ingénierie des Sols & Sondages In-Situ · Domaine C',
    title: 'Catégories C.1 & C.2 · Sondages In-Situ (Tarière, Carotté, Pénétromètre, Pressiomètre)',
    shortDesc:
      'Sondage au pénétromètre dynamique, sondage carotté rotary profond (APAFOR 450RS), essai pressiométrique Ménard et suivi piézométrique.',
    coverImage: '/images/reelles/sbs-labo-reel-005.jpg',
    iconName: 'Compass',
    examples: [
      {
        title: 'Sondage carotté profond & forage géotechnique (Sondeuse APAFOR 450RS)',
        normOrRef: 'Référentiel LNR-BTP · Domaine C · NF EN ISO 22475-1',
        src: '/images/reelles/sbs-labo-reel-005.jpg',
        description:
          'Reconnaissance géotechnique profonde jusqu’à 45 m pour tours IGH (R+11 et plus) et ouvrages d’art : récupération de carottes continues en caisses et calcul du RQD rocheux.',
        parameterMeasured: 'Log de forage continu, RQD (%) et prélèvements intacts sous gaine',
        deliverable: 'Rapport géotechnique complet transmis à SERMA BTP pour modélisation des fondations profondes',
      },
      {
        title: 'Essai en place : Sondage au Pénétromètre Dynamique Lourd (PDL)',
        normOrRef: 'Référentiel LNR-BTP · Domaine C · NF EN ISO 22476-2',
        src: '/images/reelles/sbs-labo-reel-002.jpg',
        description:
          'Mesure continue de la résistance dynamique de pointe (qd) tous les 10 ou 20 cm d’enfoncement pour déterminer la cote d’ancrage des semelles et pieux.',
        parameterMeasured: 'Pénétrogramme de résistance dynamique de pointe qd (MPa) en fonction de la profondeur',
        deliverable: 'Courbes pénétrométriques et portance admissible sous 24 heures',
      },
      {
        title: 'Essai pressiométrique Ménard, Sondage à la tarière & Piézométrie',
        normOrRef: 'Référentiel LNR-BTP · Domaine C · NF EN ISO 22476-4',
        src: '/images/reelles/sbs-labo-reel-004.jpg',
        description:
          'Mesure in-situ de la relation contrainte-déformation du sol par expansion d’une sonde cylindrique et suivi du niveau statique de la nappe phréatique.',
        parameterMeasured: 'Module pressiométrique Ménard (EM), pression limite nette (pl*) et pression de fluage (pf)',
        deliverable: 'Paramètres pressiométriques pour le calcul des pieux et radiers par SERMA BTP',
      },
    ],
  },
  {
    id: 'cat-a1-a2-essais-avances',
    code: 'A.1 / A.2',
    badge: 'Matériaux & Bétons Spéciaux · Domaine A',
    title: 'Catégories A.1 & A.2 · Essais avancés Bétons, Pavés, Agglos, Ciments & Aciers',
    shortDesc:
      'Traction par fendage, scléromètre, carottage béton durci, essais Los Angeles & Micro-Deval, résistance des pavés/agglos et essais sur ciment et fer.',
    coverImage: '/images/sbs-industries/pave-double-t-10cm-contern.jpg',
    iconName: 'Blocks',
    examples: [
      {
        title: 'Essais sur Pavés en béton, Dalles, Bordures & Éléments de maçonnerie (Agglos)',
        normOrRef: 'Référentiel LNR-BTP · Domaine A · NF EN 1338 / NF EN 772-1',
        src: '/images/sbs-industries/pave-double-t-10cm-contern.jpg',
        description:
          'Mesure de la résistance à la rupture par fendage des pavés autobloquants (6, 8, 10 cm), absorption d’eau par capillarité et résistance en compression des agglos creux et pleins.',
        parameterMeasured: 'Résistance caractéristique en MPa, classe de résistance B40/B60/B80 et taux d’absorption',
        deliverable: 'Fiches d’homologation qualité des productions SBS Industrie',
      },
      {
        title: 'Résistance à la fragmentation (Los Angeles) & à l’usure (Micro-Deval)',
        normOrRef: 'Référentiel LNR-BTP · Domaine A · NF EN 1097-2 / NF EN 1097-1',
        src: '/images/sbs-industries/hourdis-20x20x50-reel.png',
        description:
          'Évaluation de la dureté mécanique aux chocs (coefficient Los Angeles LA) et de la résistance à l’attrition en présence d’eau (coefficient Micro-Deval MDE) des granulats.',
        parameterMeasured: 'Coefficients LA et MDE pour bétons haute performance et chaussées lourdes',
        deliverable: 'PV d’agrément de carrière et de conformité des graves et gravillons',
      },
      {
        title: 'Essais non destructifs au Scléromètre, Fendage & Carottage sur structure',
        normOrRef: 'Référentiel LNR-BTP · Domaine A · NF EN 12504-2 / NF EN 12504-1',
        src: '/images/reelles/sbs-labo-reel-006.jpg',
        description:
          'Mesure de l’indice de rebondissement au scléromètre de Schmidt et prélèvement de carottes sur ouvrages béton existants pour vérifier la résistance in-situ.',
        parameterMeasured: 'Indice sclérométrique médian et résistance en compression sur carotte rectifiée',
        deliverable: 'Diagnostic de résistance structurelle pour SERMA BTP et SB-S Group',
      },
    ],
  },
  {
    id: 'cat-b-geotechnique-routiere',
    code: 'B.1 à B.4',
    badge: 'Géotechnique Routière & Portance · Domaine B',
    title: 'Domaine B (B.1 à B.4) · Géotechnique Routière, Proctor, CBR & Compacité',
    shortDesc:
      'Essais Proctor Normal et Modifié, Indice CBR après immersion et immédiat, compacité in-situ, module EV2 à la plaque et matériaux bitumineux.',
    coverImage: '/images/realisations/sbs-voirie-beton-plateforme.jpg',
    iconName: 'Route',
    examples: [
      {
        title: 'Références de compactage : Essai Proctor Normal & Essai Proctor Modifié',
        normOrRef: 'Référentiel LNR-BTP · Domaine B (B.1 à B.4) · NF P 94-093',
        src: '/images/realisations/sbs-voirie-beton-plateforme.jpg',
        description:
          'Détermination de la teneur en eau optimale (Wopt) et de la masse volumique sèche maximale (γd OPN / OPM) des matériaux de remblai, couche de forme et couche de base (latérite, graveleux, GNT).',
        parameterMeasured: 'Courbe Proctor, Wopt (%) et densité sèche maximale γd max (t/m³)',
        deliverable: 'Fiche de référence de compactage pour les équipes terrassement SB-S Group',
      },
      {
        title: 'Indice Portant Californien : CBR après immersion (4 jours) & CBR immédiat',
        normOrRef: 'Référentiel LNR-BTP · Domaine B (B.1 à B.4) · NF P 94-078',
        src: '/images/reelles/sbs-labo-reel-002.jpg',
        description:
          'Mesure de la portance poinçonnement des sols compactés à 90%, 95% et 100% de l’OPM après 4 jours d’immersion, indispensable au dimensionnement des voiries lourdes et dallages.',
        parameterMeasured: 'Indice CBR à 95% OPM (%), gonflement linéaire G (%) et classe de plateforme (PF1 à PF4)',
        deliverable: 'PV CBR sous 24 heures après poinçonnement pour validation de couche routière',
      },
      {
        title: 'Essais In-Situ de compacité, Essai à la plaque (EV2) & Déflexion',
        normOrRef: 'Référentiel LNR-BTP · Domaine B · NF P 94-061 / NF P 94-117-1',
        src: '/images/sbs-presentation/sbs-page20-img01.jpeg',
        description:
          'Contrôle de la masse volumique en place (taux de compactage ≥ 95% ou 98% OPM) et mesure du module de déformation statique à la plaque EV2 sur plateformes industrielles.',
        parameterMeasured: 'Indice de compacité Ic (%), module EV2 (MPa) et rapport EV2/EV1',
        deliverable: 'PV de réception de plateforme avant coulage de dallage ou pose de pavés',
      },
    ],
  },
  {
    id: 'cat-d-auscultation-etalonnage',
    code: 'D.1 / D.2',
    badge: 'Diagnostic d’Ouvrages & Étalonnage · Domaine D',
    title: 'Domaine D (D.1 & D.2) · Auscultation d’Ouvrages, Certification & Étalonnage',
    shortDesc:
      'Diagnostic structurel, auscultation de pieux et bâtiments R+, contrôle de chaussées et parc matériel certifié et étalonné selon le référentiel LNR-BTP.',
    coverImage: '/images/reelles/sbs-labo-reel-007.jpg',
    isAccreditedCore: true,
    iconName: 'Activity',
    examples: [
      {
        title: 'Auscultation & réception structurelle d’immeubles R+ et ouvrages d’art',
        normOrRef: 'Référentiel LNR-BTP · Domaine D (D.1 & D.2) · Diagnostic d’ouvrages',
        src: '/images/reelles/sbs-labo-reel-007.jpg',
        description:
          'Campagnes d’essais non destructifs (scléromètre, auscultation sonique), carottages et relevés de dégradations pour certifier la capacité portante d’ouvrages existants ou en cours de réhausse.',
        parameterMeasured: 'Homogénéité du béton, résistance in-situ et intégrité des fondations',
        deliverable: 'Rapport d’expertise et de diagnostic structurel pour SERMA BTP',
      },
      {
        title: 'Certification, métrologie et étalonnage périodique du matériel de laboratoire',
        normOrRef: 'Loi n° 2023-12 du 21 juin 2023 & Décret n° 2023-1780 · PAQ SB-S Labo',
        src: '/images/reelles/sbs-labo-reel-008.jpg',
        description:
          'Conformément au Plan d’Assurance Qualité (PAQ) exigé par le LNR-BTP, l’ensemble des presses hydrauliques, anneaux dynamométriques, balances, étuves et tamis fait l’objet d’un étalonnage certifié.',
        parameterMeasured: 'Certificats d’étalonnage métrologique raccordés, fidélité et justesse des mesures',
        deliverable: 'Garantie de fiabilité à 100 % et émission des procès-verbaux en 24 heures',
      },
    ],
  },
];

function getCatIcon(iconName: string) {
  switch (iconName) {
    case 'FlaskConical':
      return FlaskConical;
    case 'Layers':
      return Layers;
    case 'Compass':
      return Compass;
    case 'Blocks':
      return Blocks;
    case 'Hammer':
      return Hammer;
    case 'Route':
      return Route;
    case 'Activity':
      return Activity;
    default:
      return ShieldCheck;
  }
}

export default function SbsLaboGalleryCategories() {
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const activeCategory = SBS_LABO_CATEGORIES.find((c) => c.id === activeCatId) || null;
  const currentSlide = activeCategory
    ? activeCategory.examples[slideIndex] || activeCategory.examples[0]
    : null;

  const openCategory = (catId: string, initialSlide = 0) => {
    setActiveCatId(catId);
    setSlideIndex(initialSlide);
  };

  const closeCarousel = useCallback(() => {
    setActiveCatId(null);
    setSlideIndex(0);
  }, []);

  const prevSlide = useCallback(() => {
    if (!activeCategory) return;
    setSlideIndex(
      (prev) => (prev - 1 + activeCategory.examples.length) % activeCategory.examples.length
    );
  }, [activeCategory]);

  const nextSlide = useCallback(() => {
    if (!activeCategory) return;
    setSlideIndex((prev) => (prev + 1) % activeCategory.examples.length);
  }, [activeCategory]);

  useEffect(() => {
    if (!activeCategory) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') closeCarousel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategory, prevSlide, nextSlide, closeCarousel]);

  return (
    <div className="space-y-8">
      {/* Bandeau Référentiel LNR-BTP + Agréments C2 et A3 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/90 text-white border border-emerald-700/60 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5" />
                Agréments Officiels : Catégories C2 et A3
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-mono">
                Référentiel LNR-BTP · Loi n° 2023-12 &amp; Décret n° 2023-1780
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-mono font-bold">
                Délai d&apos;émission PV : 24 heures
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-title font-bold text-white">
              Classification officielle des essais normalisés par domaine et par catégorie
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Sous la Direction Technique d&apos;<strong>Aminata Dramé (+221 70 835 00 63)</strong> et avec <strong>Ablaye Niang (+221 77 321 78 60)</strong> comme Responsable Laboratoire pour les essais, SB-S Labo réalise les études géotechniques et essais normalisés avec un parc matériel 100 % certifié et étalonné. Ses études de sol alimentent directement la modélisation 3D/BIM de <strong>SERMA BTP</strong> avant exécution des travaux par <strong>SB-S Group</strong>.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-xs space-y-2.5">
            <div>
              <div className="font-mono font-bold text-emerald-300">Directrice Technique :</div>
              <div className="font-title font-bold text-base text-white">Aminata Dramé</div>
              <a
                href="https://wa.me/221708350063"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-300 hover:text-emerald-200 underline"
              >
                WhatsApp / Tél : +221 70 835 00 63
              </a>
            </div>
            <div className="pt-2 border-t border-white/15">
              <div className="font-mono font-bold text-emerald-300">Responsable Laboratoire (Essais) :</div>
              <div className="font-title font-bold text-base text-white">Ablaye Niang</div>
              <a
                href="https://wa.me/221773217860"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-300 hover:text-emerald-200 underline"
              >
                WhatsApp / Tél : +221 77 321 78 60
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Grille des 8 cases de catégories d'essais avec carrousel d'exemples */}
      <div>
        <h3 className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
          Toutes les catégories d&apos;essais de la Galerie SB-S Labo (cliquez sur une catégorie pour ouvrir son carrousel d&apos;exemples) :
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SBS_LABO_CATEGORIES.map((cat) => {
            const IconComp = getCatIcon(cat.iconName);
            const isSelected = activeCatId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => openCategory(cat.id, 0)}
                className={`group text-left rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-brand-900 text-white'
                    : 'border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-800/80 hover:border-emerald-500 dark:hover:border-emerald-400'
                }`}
              >
                {/* Image de couverture */}
                <div className="relative aspect-[16/10] w-full bg-brand-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.coverImage}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/35 to-transparent" />

                  {/* Badge code catégorie */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold shadow">
                      Cat. {cat.code}
                    </span>
                    {cat.isAccreditedCore && (
                      <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/40">
                        Agréé C2 / A3
                      </span>
                    )}
                  </div>

                  {/* Compteur d'exemples */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-900/85 backdrop-blur-sm border border-white/15 text-white text-[11px] font-mono font-semibold">
                    {cat.examples.length} exemples
                  </div>

                  {/* Titre sur image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0">
                      <IconComp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="font-title font-bold text-white text-sm sm:text-base leading-snug group-hover:text-emerald-300 transition-colors">
                      {cat.title}
                    </h4>
                  </div>
                </div>

                {/* Corps de la case */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-neutral-200' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {cat.shortDesc}
                  </p>

                  {/* Aperçu des exemples */}
                  <div className="space-y-1 pt-1 border-t border-neutral-100 dark:border-brand-700/60">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      Exemples d&apos;essais normalisés :
                    </span>
                    {cat.examples.slice(0, 2).map((ex, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 text-[11px] truncate ${
                          isSelected ? 'text-white/90' : 'text-neutral-700 dark:text-neutral-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{ex.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Voir les exemples ({cat.examples.length})
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODALE CARROUSEL D'EXEMPLES PAR CATÉGORIE LNR-BTP */}
      {activeCategory && currentSlide && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={closeCarousel}
        >
          <div
            className="relative w-full max-w-5xl bg-brand-900 border border-brand-700 rounded-2xl shadow-2xl overflow-hidden text-white my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête de la modale carrousel */}
            <div className="bg-brand-950/90 border-b border-brand-800 px-4 sm:px-6 py-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold">
                    Catégorie {activeCategory.code}
                  </span>
                  <h3 className="font-title font-bold text-lg sm:text-xl text-white">
                    {activeCategory.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeCarousel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                >
                  <span>Fermer</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Onglets rapides des catégories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {SBS_LABO_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openCategory(c.id, 0)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      c.id === activeCategory.id
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {c.code} · {c.title.replace(/^Catégorie [A-Z0-9./\s]+·\s*/, '').replace(/^Domaine [A-Z0-9.()\sà]+·\s*/, '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu du slide */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative bg-black flex items-center justify-center min-h-[280px] sm:min-h-[420px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={currentSlide.src + slideIndex}
                  src={currentSlide.src}
                  alt={currentSlide.title}
                  className="w-full max-h-[460px] object-contain"
                />

                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Exemple précédent"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-emerald-600 border border-white/25 flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Exemple suivant"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-emerald-600 border border-white/25 flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 border border-white/15 text-xs font-mono text-white">
                  Exemple {slideIndex + 1} / {activeCategory.examples.length}
                </div>
              </div>

              <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-5 bg-brand-900">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
                      {activeCategory.badge} · Exemple {slideIndex + 1}/{activeCategory.examples.length}
                    </span>
                    <h4 className="font-title font-bold text-xl text-white leading-snug">
                      {currentSlide.title}
                    </h4>
                    <span className="text-xs text-neutral-400 font-mono block mt-1">
                      {currentSlide.normOrRef}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {currentSlide.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-brand-700 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="font-mono font-bold text-emerald-400 block mb-0.5">
                        Paramètres mesurés &amp; équipement étalonné :
                      </span>
                      <span className="text-neutral-200">{currentSlide.parameterMeasured}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                      <span className="font-mono font-bold text-emerald-300 flex items-center gap-1.5 mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Livrable SB-S Labo (PV en 24h) :
                      </span>
                      <span className="text-neutral-200">{currentSlide.deliverable}</span>
                    </div>
                  </div>
                </div>

                {/* Miniatures du carrousel */}
                <div className="pt-3 border-t border-brand-800">
                  <span className="text-[11px] font-mono text-neutral-400 block mb-2">
                    Exemples de cette catégorie :
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeCategory.examples.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSlideIndex(idx)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                          idx === slideIndex
                            ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-[1.02]'
                            : 'border-white/15 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ex.src}
                          alt={ex.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
