'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Layers,
  Radio,
  Fuel,
  Factory,
  Building2,
  ClipboardCheck,
  Droplets,
  Cpu,
  X,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export interface SermaExampleSlide {
  title: string;
  location: string;
  type: 'video' | 'image';
  src: string;
  description: string;
  softwareOrNorm: string;
  deliverable: string;
}

export interface SermaDomain {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  coverImage: string;
  hasVideo?: boolean;
  iconName: string;
  examples: SermaExampleSlide[];
}

export const SERMA_DOMAINS: SermaDomain[] = [
  {
    id: 'modelisation',
    number: '01',
    title: 'Modélisation',
    shortDesc: 'Études structurelles 3D, maquettes numériques BIM, simulations aux éléments finis et descentes de charges.',
    coverImage: '/images/realisations/serma-modelisation-structurelle-3d-eurocodes.jpg',
    hasVideo: true,
    iconName: 'Layers',
    examples: [
      {
        title: 'Immeuble R+11 Sadio Digue au Mali · ACI 2000 à Bamako',
        location: 'ACI 2000, Bamako (Mali)',
        type: 'video',
        src: '/videos/serma-modelisation-r11-sadio-digue-bamako.mp4',
        description:
          'Modélisation structurelle 3D intégrale et simulation numérique réalisées par le bureau d’études SERMA BTP pour un immeuble de grande hauteur R+11 : analyse modale, descentes de charges, noyaux de contreventement et vérification des déformations.',
        softwareOrNorm: 'Autodesk Robot Structural Analysis · Revit BIM · Eurocode 2 & 8',
        deliverable: 'Modèle 3D complet, notes de calcul certifiées et plans de coffrage/ferraillage pour exécution',
      },
      {
        title: 'Modélisation 3D & analyse aux éléments finis d’ossature métallique',
        location: 'Dakar, Sénégal',
        type: 'image',
        src: '/images/realisations/serma-modelisation-structurelle-3d-eurocodes.jpg',
        description:
          'Simulation numérique tridimensionnelle d’une structure métallique multi-niveaux sous sollicitations combinées (charges permanentes, exploitation et vent extrême côtier).',
        softwareOrNorm: 'Robot Structural Analysis · Tekla Structures · Eurocode 3',
        deliverable: 'Cartographie des contraintes, vérification des flèches et carnets d’assemblages',
      },
      {
        title: 'Maquette numérique 3D de charpente industrielle grande portée',
        location: 'Zone industrielle de Dakar',
        type: 'image',
        src: '/images/realisations/serma-charpente-modele-structure-3d.jpg',
        description:
          'Modélisation paramétrique 3D des portiques, fermes treillis, pannes et palées de stabilité avant lancement en fabrication.',
        softwareOrNorm: 'Tekla Structures · AutoCAD 3D · NF EN 1993',
        deliverable: 'Plans de repérage 3D, nomenclatures acier et fichiers CNC d’usinage',
      },
      {
        title: 'Jumeau numérique & étude d’exécution du Hangar logistique AGL',
        location: 'Rocade Bel Air, Dakar',
        type: 'image',
        src: '/images/serma/hangar-agl-bel-air-01.jpg',
        description:
          'Modélisation géométrique et calcul des travées métalliques à grande hauteur pour plateforme logistique portuaire.',
        softwareOrNorm: 'BIM Structure · Robot Structural Analysis · Eurocode 3',
        deliverable: 'Dossier d’exécution complet transmis aux équipes travaux',
      },
    ],
  },
  {
    id: 'pylone',
    number: '02',
    title: 'Pylône',
    shortDesc: 'Calcul au vent, modélisation et dimensionnement de pylônes télécoms, mâts d’éclairage et supports HT/MT.',
    coverImage: '/images/realisations/serma-structure-metallique-etages.jpg',
    iconName: 'Radio',
    examples: [
      {
        title: 'Pylône métallique autoportant en treillis grande hauteur',
        location: 'Sénégal & sous-région ouest-africaine',
        type: 'image',
        src: '/images/realisations/serma-structure-metallique-etages.jpg',
        description:
          'Étude de stabilité au vent extrême, calcul des membrures en cornières galvanisées, diagonales de contreventement et platines d’ancrage sur massif béton.',
        softwareOrNorm: 'Robot Structural Analysis · Eurocode 1 (Vent) & Eurocode 3 (Tours & Mâts)',
        deliverable: 'Note de calcul au vent, plans de tronçons et massif de fondation',
      },
      {
        title: 'Mâts d’éclairage grande hauteur & structures verticales industrielles',
        location: 'Plateformes portuaires & minières',
        type: 'image',
        src: '/images/sbs-presentation/sbs-page29-img25.jpeg',
        description:
          'Dimensionnement dynamique des mâts et pylônes supportant des projecteurs lourds ou équipements industriels en zone exposée.',
        softwareOrNorm: 'Calcul dynamique & fatigue · NF EN 1993-3-1',
        deliverable: 'Plans de fût, couronne de tête, tiges d’ancrage et massif béton armé',
      },
      {
        title: 'Pylônes supports d’énergie & infrastructures électriques',
        location: 'Corridors énergétiques nationaux',
        type: 'image',
        src: '/images/energie.jpg',
        description:
          'Études d’ingénierie pour supports de lignes, portiques de postes électriques et structures métalliques d’énergie.',
        softwareOrNorm: 'CAO/DAO Structure · Normes CENELEC & Eurocodes',
        deliverable: 'Plans d’exécution métalliques et carnets de boulonnerie haute résistance',
      },
    ],
  },
  {
    id: 'station-service',
    number: '03',
    title: 'Station service',
    shortDesc: 'Conception complète de stations-service : auvents métalliques, fosses hydrocarbures, cuves et pistes VRD.',
    coverImage: '/images/realisations/serma-auvent-station-service.jpg',
    iconName: 'Fuel',
    examples: [
      {
        title: 'Auvent métallique de station-service & structure en porte-à-faux',
        location: 'Axes routiers & urbains, Sénégal',
        type: 'image',
        src: '/images/realisations/serma-auvent-station-service.jpg',
        description:
          'Conception et modélisation 3D de l’ossature métallique d’auvent de distribution : poteaux encastrés en pied, poutres maîtresses, résistance au soulèvement au vent et évacuation pluviale intégrée.',
        softwareOrNorm: 'Robot Structural Analysis · AutoCAD · Eurocode 3',
        deliverable: 'Plans de charpente d’auvent, habillage bandeau et fondations',
      },
      {
        title: 'Aire de lavage industrielle, pistes bétonnées & séparateur d’hydrocarbures',
        location: 'Dakar, Sénégal',
        type: 'image',
        src: '/images/reelles/projet-secaa-aire-lavage-01.jpg',
        description:
          'Étude de génie civil pour pistes poids lourds, fosses de visite, caniveaux à grilles fonte et décanteurs-séparateurs d’hydrocarbures.',
        softwareOrNorm: 'Eurocode 2 · Normes environnementales ICPE',
        deliverable: 'Plans de coffrage/ferraillage des fosses, dallages et réseaux',
      },
      {
        title: 'Dallage industriel armé & voirie lourde pour flotte carburant',
        location: 'Zone industrielle & corridors logistiques',
        type: 'image',
        src: '/images/realisations/sbs-voirie-beton-plateforme.jpg',
        description:
          'Dimensionnement des dalles béton armé sous charges d’essieux 13 tonnes pour aires de dépotage et circulation de camions-citernes.',
        softwareOrNorm: 'DTU 13.3 · Calcul de dallage industriel sur sol élastique',
        deliverable: 'Coupe de structure de chaussée, plan de joints et ferraillage',
      },
    ],
  },
  {
    id: 'charpente-metallique',
    number: '04',
    title: 'Charpente métallique',
    shortDesc: 'Études et dimensionnement de hangars logistiques, entrepôts grande portée, fermes treillis et usines.',
    coverImage: '/images/serma/hangar-agl-bel-air-01.jpg',
    iconName: 'Factory',
    examples: [
      {
        title: 'Hangar logistique AGL · Rocade Bel Air (Ossature & travées métalliques)',
        location: 'Rocade Bel Air, Dakar',
        type: 'image',
        src: '/images/serma/hangar-agl-bel-air-01.jpg',
        description:
          'Étude d’ingénierie et structure métallique grande hauteur du Hangar logistique AGL sur la Rocade Bel Air : portiques treillis, lisses de bardage et travées de stockage intensif.',
        softwareOrNorm: 'Tekla Structures · Robot Structural Analysis · Eurocode 3',
        deliverable: 'Modèle 3D, notes de calcul et plans d’exécution des portiques',
      },
      {
        title: 'Hangar logistique AGL · Rocade Bel Air (Fermes treillis grande portée)',
        location: 'Rocade Bel Air, Dakar',
        type: 'image',
        src: '/images/serma/hangar-agl-bel-air-02.jpg',
        description:
          'Dimensionnement des fermes de toiture en treillis tubulaire/profilés, contreventements de versant et optimisation du poids d’acier au m².',
        softwareOrNorm: 'Calcul de stabilité élastique & flambement · NF EN 1993-1-1',
        deliverable: 'Plans de fabrication des fermes et détails d’assemblages boulonnés',
      },
      {
        title: 'Hangar logistique AGL · Rocade Bel Air (Vue d’ensemble & montage)',
        location: 'Rocade Bel Air, Dakar',
        type: 'image',
        src: '/images/serma/hangar-agl-bel-air-03.jpg',
        description:
          'Coordination études-chantier pour le levage des palées et la pose de la charpente métallique sur soubassement béton armé.',
        softwareOrNorm: 'Méthodologie de montage & phasage sécurité',
        deliverable: 'Carnet de phasage de levage et contrôle géométrique',
      },
      {
        title: 'Hangar logistique AGL · Rocade Bel Air (Interface acier-béton & massifs)',
        location: 'Rocade Bel Air, Dakar',
        type: 'image',
        src: '/images/serma/hangar-agl-bel-air-04.jpg',
        description:
          'Calcul des pieds de poteaux articulés/encastrés, crosses d’ancrage, voiles périphériques et longrines de redressement.',
        softwareOrNorm: 'Eurocode 2 & Eurocode 3 (Assemblages NF EN 1993-1-8)',
        deliverable: 'Plans de préscellement et ferraillage des massifs d’ancrage',
      },
      {
        title: 'Complexe industriel & bâtiment métallique grande portée',
        location: 'Sénégal',
        type: 'image',
        src: '/images/realisations/serma-hangar-industriel-structure.jpg',
        description:
          'Conception de bâtiments industriels avec poutres de roulement pour ponts roulants, mezzanines lourdes et couvertures sèches.',
        softwareOrNorm: 'Robot Structural Analysis · Tekla BIM',
        deliverable: 'Dossier complet de charpente et serrurerie industrielle',
      },
    ],
  },
  {
    id: 'batiment-igh',
    number: '05',
    title: 'Bâtiment et immeuble IGH',
    shortDesc: 'Études structurelles d’immeubles de grande hauteur (R+11 et plus), tours tertiaires et complexes résidentiels.',
    coverImage: '/images/reelles/projet-polytech-bureaux-sococim-01.jpg',
    hasVideo: true,
    iconName: 'Building2',
    examples: [
      {
        title: 'Étude & Modélisation IGH : Immeuble R+11 Sadio Digue · ACI 2000 Bamako',
        location: 'ACI 2000, Bamako (Mali)',
        type: 'video',
        src: '/videos/serma-modelisation-r11-sadio-digue-bamako.mp4',
        description:
          'Étude d’ingénierie complète pour cet immeuble R+11 : modélisation 3D des 12 niveaux, dimensionnement du radier général / pieux, voiles de contreventement, cages d’ascenseurs et planchers.',
        softwareOrNorm: 'Robot Structural Analysis · Revit Structure · Eurocode 2',
        deliverable: 'Modèle numérique 3D validé, notes de calcul IGH et plans d’exécution',
      },
      {
        title: 'Bâtiment tertiaire & bureaux industriels R+ (SOCOCIM / Polytech)',
        location: 'Rufisque, Dakar',
        type: 'image',
        src: '/images/reelles/projet-polytech-bureaux-sococim-01.jpg',
        description:
          'Conception structurelle béton armé et second-œuvre technique pour immeuble de bureaux en environnement industriel exigeant.',
        softwareOrNorm: 'AutoCAD · Robot Structural Analysis · BAEL / Eurocode 2',
        deliverable: 'Plans de fondations, poteaux-poutres, dalles et escaliers',
      },
      {
        title: 'Immeuble moderne multi-étages à plateaux libres',
        location: 'Dakar, Sénégal',
        type: 'image',
        src: '/images/architecture-moderne.jpg',
        description:
          'Optimisation des trames porteuses pour offrir de grands plateaux de bureaux sans poteaux intermédiaires et façades vitrées.',
        softwareOrNorm: 'BIM Architecture & Structure · Planchers dalles pleines / post-contraints',
        deliverable: 'Dossier d’exécution gros-œuvre transmis à SB-S Group',
      },
      {
        title: 'Bâtiment administratif et technique portuaire',
        location: 'Port Autonome de Dakar',
        type: 'image',
        src: '/images/sbs-presentation/sbs-page26-img01.jpeg',
        description:
          'Étude de structure en zone côtière (classe d’exposition marine XS/XC) avec exigences accrues de durabilité des bétons.',
        softwareOrNorm: 'NF EN 206 · Eurocode 2',
        deliverable: 'Spécifications béton, plans de ferraillage et carnet de détails',
      },
    ],
  },
  {
    id: 'maitrise-oeuvre-amo',
    number: '06',
    title: 'Maîtrise d\'œuvre - AMO - Supervision',
    shortDesc: 'Assistance à maîtrise d’ouvrage (AMO), direction de l’exécution des travaux (DET), OPC et contrôle qualité.',
    coverImage: '/images/reelles/sbs-labo-reel-003.jpg',
    iconName: 'ClipboardCheck',
    examples: [
      {
        title: 'Supervision technique & suivi du Hangar logistique AGL · Rocade Bel Air',
        location: 'Rocade Bel Air, Dakar',
        type: 'image',
        src: '/images/serma/hangar-agl-bel-air-03.jpg',
        description:
          'Supervision de l’érection métallique, contrôle du couple de serrage des boulons HR, verticalité au théodolite et conformité aux plans d’études SERMA BTP.',
        softwareOrNorm: 'Mission MOE / VISA / DET / AOR · Norme NF EN 1090',
        deliverable: 'Procès-verbaux de réception par phase et contrôle géométrique',
      },
      {
        title: 'Assistance à Maîtrise d’Ouvrage (AMO) & pilotage d’études sur site',
        location: 'Dakar & régions, Sénégal',
        type: 'image',
        src: '/images/reelles/sbs-labo-reel-003.jpg',
        description:
          'Accompagnement du maître d’ouvrage depuis la faisabilité jusqu’à la réception : rédaction des CCTP, analyse des offres, visa des plans d’exécution et tenue des délais.',
        softwareOrNorm: 'MS Project · Primavera · Procédures Assurance Qualité ISO 9001',
        deliverable: 'Rapports hebdomadaires d’avancement, tableaux de bord coûts/délais',
      },
      {
        title: 'Coordination de chantier lourd & supervision HSE / Levage',
        location: 'Grands chantiers industriels',
        type: 'image',
        src: '/images/reelles/sbs-reel-001.jpg',
        description:
          'Ordonnancement, Pilotage et Coordination (OPC) des interventions conjointes entre SB-S Group, SBS Logistik, SBS Industrie et P2M.',
        softwareOrNorm: 'Plan Général de Coordination (PGC) · Contrôle qualité intégré',
        deliverable: 'Plannings directeurs d’exécution et fiches de validation',
      },
      {
        title: 'Audit structurel & réception technique d’immeubles R+',
        location: 'Dakar, Sénégal',
        type: 'image',
        src: '/images/reelles/sbs-labo-reel-006.jpg',
        description:
          'Inspection contradictoire des ferraillages avant coulage, suivi des résistances béton à 7 et 28 jours et levée des réserves.',
        softwareOrNorm: 'Eurocode 2 · DTU 21 (Exécution des ouvrages en béton)',
        deliverable: 'Certificat de conformité technique et Dossier des Ouvrages Exécutés (DOE)',
      },
    ],
  },
  {
    id: 'ouvrages-hydrauliques',
    number: '07',
    title: 'Ouvrages hydrauliques',
    shortDesc: 'Dimensionnement de bassins de rétention, stations de pompage, cuvelages étanches, dalots et réseaux VRD.',
    coverImage: '/images/sbs-presentation/sbs-page23-img01.jpeg',
    iconName: 'Droplets',
    examples: [
      {
        title: 'Puisard industriel & bassin de rétention grande profondeur (9 m)',
        location: 'Zone minière de Kédougou',
        type: 'image',
        src: '/images/sbs-presentation/sbs-page23-img01.jpeg',
        description:
          'Étude géotechnique et structurelle d’un ouvrage hydraulique enterré à 9 m de profondeur : reprise des poussées hydrostatiques, maîtrise de la fissuration et étanchéité dans la masse.',
        softwareOrNorm: 'Eurocode 2 Partie 3 (Silos et réservoirs) · Fascicule 74',
        deliverable: 'Note de calcul d’étanchéité, plans de coffrage et ferraillage haute densité',
      },
      {
        title: 'Ouvrage de franchissement hydraulique, dalots & pont mixte',
        location: 'Fatick / Axes routiers nationaux',
        type: 'image',
        src: '/images/realisations/pont-franchissement-eau.jpg',
        description:
          'Étude hydrologique de bassin versant, calibrage hydraulique des ouvertures et dimensionnement structurel des culées, piles et tablier.',
        softwareOrNorm: 'HEC-RAS · Robot Structural Analysis · Eurocodes 2 & 4',
        deliverable: 'Dossier d’ouvrage d’art et plans d’exécution génie civil',
      },
      {
        title: 'Cuvelages étanches & rétention industrielle (Centrale de Sendou)',
        location: 'Bargny / Sendou, Dakar',
        type: 'image',
        src: '/images/reelles/projet-ces-stockage-sendou-01.jpg',
        description:
          'Conception de fosses et bassins de rétention étanches résistant aux agressions chimiques et aux sous-pressions de nappe.',
        softwareOrNorm: 'DTU 14.1 (Travaux de cuvelage) · Bétons haute performance',
        deliverable: 'Plans de joints waterstop, radier général et voiles banchés',
      },
      {
        title: 'Réseaux de drainage pluvial, caniveaux béton & assainissement VRD',
        location: 'Zones industrielles de Mbao & Diamniadio',
        type: 'image',
        src: '/images/sbs-presentation/sbs-page20-img01.jpeg',
        description:
          'Calcul des débits d’orage, profils en long hydrauliques et dimensionnement des caniveaux béton armé sous circulation lourde.',
        softwareOrNorm: 'Covadis / AutoCAD Civil 3D · Instruction technique 77-284',
        deliverable: 'Plans VRD d’assainissement, regards et bordures',
      },
    ],
  },
  {
    id: 'lots-techniques',
    number: '08',
    title: 'Lots techniques',
    shortDesc: 'Ingénierie des fluides (CVC, plomberie), électricité CFO/CFA, sécurité incendie (SSI) et synthèse BIM.',
    coverImage: '/images/reelles/projet-dlm-usine-oxygene-mako-01.jpg',
    iconName: 'Cpu',
    examples: [
      {
        title: 'Ingénierie des fluides & unité industrielle d’oxygène PSA (Mako)',
        location: 'Mako, Région de Kédougou',
        type: 'image',
        src: '/images/reelles/projet-dlm-usine-oxygene-mako-01.jpg',
        description:
          'Études et intégration des lots techniques industriels : réseaux de fluides sous pression, ventilation mécanique, massifs d’équipements vibrants et alimentation électrique.',
        softwareOrNorm: 'Revit MEP · AutoCAD MEP · Normes ISO & CODETI',
        deliverable: 'Plans de synthèse fluides, isométriques et massifs supports',
      },
      {
        title: 'Électricité CFO / CFA, postes HT/BT & centrales groupes électrogènes',
        location: 'Immeubles IGH & sites industriels',
        type: 'image',
        src: '/images/engins/groupe-electrogene.jpg',
        description:
          'Bilans de puissance, dimensionnement des transformateurs et groupes électrogènes de secours, schémas unifilaires TGBT, chemins de câbles et réseaux basse tension.',
        softwareOrNorm: 'Caneco BT · Dialux · Norme NF C 15-100',
        deliverable: 'Schémas électriques, plans d’implantation CFO/CFA et notes de calcul',
      },
      {
        title: 'Plomberie sanitaire, CVC & équipements techniques de bâtiment',
        location: 'Résidences R+, hôtels & tours de bureaux',
        type: 'image',
        src: '/images/realisations/p2m-salle-de-bain-prestige.jpg',
        description:
          'Dimensionnement des réseaux d’eau froide/chaude, surpresseurs, colonnes d’évacuation, climatisation centralisée VRF et renouvellement d’air hygiénique.',
        softwareOrNorm: 'DTU 60.11 (Plomberie) · Réglementation thermique & CVC',
        deliverable: 'Plans de réservation, synoptiques verticaux et bordereaux P2M',
      },
      {
        title: 'Synthèse technique 3D BIM & précision d’interfaces multi-lots',
        location: 'Bureau d’études SERMA BTP, Dakar',
        type: 'image',
        src: '/images/realisations/serma-decoupe-plasma-cnc.jpg',
        description:
          'Superposition des maquettes Structure, Charpente, CVC, Plomberie, Électricité et Sécurité Incendie (SSI) pour éliminer tout conflit (clash detection) avant le démarrage des travaux par SB-S Group.',
        softwareOrNorm: 'Navisworks · Revit BIM Collaboration',
        deliverable: 'Plans de synthèse validés et réservations intégrées au gros-œuvre',
      },
    ],
  },
];

function getDomainIcon(iconName: string) {
  switch (iconName) {
    case 'Layers':
      return Layers;
    case 'Radio':
      return Radio;
    case 'Fuel':
      return Fuel;
    case 'Factory':
      return Factory;
    case 'Building2':
      return Building2;
    case 'ClipboardCheck':
      return ClipboardCheck;
    case 'Droplets':
      return Droplets;
    case 'Cpu':
      return Cpu;
    default:
      return Layers;
  }
}

export default function SermaGalleryDomains() {
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const activeDomain = SERMA_DOMAINS.find((d) => d.id === activeDomainId) || null;
  const currentSlide = activeDomain ? activeDomain.examples[slideIndex] || activeDomain.examples[0] : null;

  const openDomain = (domainId: string, initialSlide = 0) => {
    setActiveDomainId(domainId);
    setSlideIndex(initialSlide);
  };

  const closeCarousel = useCallback(() => {
    setActiveDomainId(null);
    setSlideIndex(0);
  }, []);

  const prevSlide = useCallback(() => {
    if (!activeDomain) return;
    setSlideIndex((prev) => (prev - 1 + activeDomain.examples.length) % activeDomain.examples.length);
  }, [activeDomain]);

  const nextSlide = useCallback(() => {
    if (!activeDomain) return;
    setSlideIndex((prev) => (prev + 1) % activeDomain.examples.length);
  }, [activeDomain]);

  useEffect(() => {
    if (!activeDomain) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') closeCarousel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDomain, prevSlide, nextSlide, closeCarousel]);

  return (
    <div className="space-y-8">
      {/* En-tête explicatif */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/15 text-accent-600 dark:text-accent-400 text-xs font-mono font-bold mb-2">
            8 pôles d&apos;ingénierie &amp; modélisation logicielle
          </span>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
            Cliquez sur l&apos;une des <strong>8 cases des domaines de la Galerie SERMA</strong> ci-dessous pour entrer dans le domaine et parcourir son <strong>carrousel interactif d&apos;exemples d&apos;études, de modélisations 3D/BIM et de réalisations supervisées</strong>.
          </p>
        </div>
      </div>

      {/* Grille des 8 cases (Les 8 domaines de la Galerie SERMA) */}
      <div>
        <h3 className="text-xs font-mono font-bold tracking-wider text-accent-500 mb-4">
          Les 8 domaines de la Galerie SERMA (cliquez sur une case pour ouvrir son carrousel d&apos;exemples) :
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERMA_DOMAINS.map((domain) => {
            const IconComp = getDomainIcon(domain.iconName);
            const isSelected = activeDomainId === domain.id;

            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => openDomain(domain.id, 0)}
                className={`group text-left rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isSelected
                    ? 'border-accent-500 ring-2 ring-accent-500/40 bg-brand-900 text-white'
                    : 'border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-800/80 hover:border-accent-500 dark:hover:border-accent-400'
                }`}
              >
                {/* Visuel de couverture de la case */}
                <div className="relative aspect-[16/10] w-full bg-brand-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={domain.coverImage}
                    alt={domain.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />

                  {/* Numéro et badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-accent-500 text-white text-xs font-mono font-bold flex items-center justify-center shadow">
                      {domain.number}
                    </span>
                    {domain.hasVideo && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-mono font-bold border border-amber-400/40">
                        <Play className="w-3 h-3 fill-amber-300" />
                        Vidéo 3D + Photos
                      </span>
                    )}
                  </div>

                  {/* Compteur d'exemples */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-900/85 backdrop-blur-sm border border-white/15 text-white text-[11px] font-mono font-semibold">
                    {domain.examples.length} exemples
                  </div>

                  {/* Titre sur l'image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0">
                      <IconComp className="w-4 h-4 text-accent-400" />
                    </div>
                    <h4 className="font-title font-bold text-white text-base leading-snug group-hover:text-accent-300 transition-colors">
                      {domain.title}
                    </h4>
                  </div>
                </div>

                {/* Corps de la case avec aperçu des exemples */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-neutral-200' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {domain.shortDesc}
                  </p>

                  {/* Aperçu rapide des exemples dans la case */}
                  <div className="space-y-1 pt-1 border-t border-neutral-100 dark:border-brand-700/60">
                    <span className="text-[10px] font-mono font-bold text-accent-500 block">
                      Exemples inclus dans ce domaine :
                    </span>
                    {domain.examples.slice(0, 2).map((ex, i) => (
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

                  {/* Bouton d'entrée dans le carrousel */}
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-accent-500 group-hover:text-accent-600 dark:group-hover:text-accent-300">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Ouvrir le carrousel ({domain.examples.length})
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mise en avant permanente des 2 études phares (Vidéo R+11 Sadio Digue Bamako + 4 Photos Hangar AGL Rocade Bel Air) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-2xl p-5 sm:p-6">
        <div className="lg:col-span-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-block px-3 py-1 rounded-full bg-accent-500/15 text-accent-600 dark:text-accent-400 text-xs font-mono font-bold">
              Modélisation 3D &amp; Bâtiment IGH (Vidéo)
            </span>
            <button
              type="button"
              onClick={() => openDomain('modelisation', 0)}
              className="text-xs font-bold text-accent-500 hover:underline inline-flex items-center gap-1"
            >
              <span>Voir dans le carrousel Modélisation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-lg sm:text-xl font-title font-bold text-neutral-900 dark:text-white">
            Immeuble R+11 Sadio Digue au Mali · ACI 2000 à Bamako
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Modélisation structurelle 3D et simulation numérique réalisées par le bureau d&apos;études SERMA BTP avec ses logiciels de calcul pour un immeuble de grande hauteur (R+11) situé à l&apos;ACI 2000 à Bamako (Mali).
          </p>
          <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-brand-700 bg-black shadow-lg">
            <video
              src="/videos/serma-modelisation-r11-sadio-digue-bamako.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[420px] object-contain bg-black"
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
              Charpente métallique &amp; Supervision (4 photos)
            </span>
            <button
              type="button"
              onClick={() => openDomain('charpente-metallique', 0)}
              className="text-xs font-bold text-accent-500 hover:underline inline-flex items-center gap-1"
            >
              <span>Ouvrir en carrousel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-lg sm:text-xl font-title font-bold text-neutral-900 dark:text-white">
            Hangar logistique AGL · Rocade Bel Air (Dakar)
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Étude, dimensionnement Eurocode 3 et structure métallique grande portée du Hangar logistique AGL sur la Rocade Bel Air (cliquez sur une photo pour ouvrir le carrousel).
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { url: '/images/serma/hangar-agl-bel-air-01.jpg', label: 'Hangar AGL Bel Air #1 · Travées' },
              { url: '/images/serma/hangar-agl-bel-air-02.jpg', label: 'Hangar AGL Bel Air #2 · Fermes treillis' },
              { url: '/images/serma/hangar-agl-bel-air-03.jpg', label: 'Hangar AGL Bel Air #3 · Vue chantier' },
              { url: '/images/serma/hangar-agl-bel-air-04.jpg', label: 'Hangar AGL Bel Air #4 · Massifs & structure' },
            ].map((photo, pIdx) => (
              <button
                key={photo.url}
                type="button"
                onClick={() => openDomain('charpente-metallique', pIdx)}
                className="block w-full group relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 dark:border-brand-700 bg-neutral-200 dark:bg-brand-900 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 text-[11px] text-white font-medium">
                  {photo.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODALE / VUE CARROUSEL INTERACTIF QUAND ON ENTRE DANS UN DOMAINE */}
      {activeDomain && currentSlide && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={closeCarousel}
        >
          <div
            className="relative w-full max-w-5xl bg-brand-900 border border-brand-700 rounded-2xl shadow-2xl overflow-hidden text-white my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barre supérieure : sélecteur rapide des 8 domaines + bouton fermer */}
            <div className="bg-brand-950/90 border-b border-brand-800 px-4 sm:px-6 py-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-accent-500 text-white text-xs font-mono font-bold">
                    Domaine {activeDomain.number} / 08
                  </span>
                  <h3 className="font-title font-bold text-lg sm:text-xl text-white">
                    {activeDomain.title}
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

              {/* Onglets rapides pour basculer entre les 8 domaines sans quitter le carrousel */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {SERMA_DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => openDomain(d.id, 0)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      d.id === activeDomain.id
                        ? 'bg-accent-500 text-white shadow'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {d.number}. {d.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Corps du Carrousel : Média à gauche + Fiche d'étude à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Zone Média avec flèches Précédent / Suivant */}
              <div className="lg:col-span-7 relative bg-black flex items-center justify-center min-h-[280px] sm:min-h-[420px]">
                {currentSlide.type === 'video' ? (
                  <video
                    key={currentSlide.src}
                    src={currentSlide.src}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[460px] object-contain bg-black"
                  >
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={currentSlide.src}
                    src={currentSlide.src}
                    alt={currentSlide.title}
                    className="w-full max-h-[460px] object-contain"
                  />
                )}

                {/* Bouton Précédent */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Exemple précédent"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-accent-500 border border-white/25 flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Bouton Suivant */}
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Exemple suivant"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-accent-500 border border-white/25 flex items-center justify-center text-white shadow-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicateur de slide */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 border border-white/15 text-xs font-mono text-white">
                  Exemple {slideIndex + 1} / {activeDomain.examples.length}
                </div>
              </div>

              {/* Détails de l'exemple courant */}
              <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-5 bg-brand-900">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-accent-400 block mb-1">
                      {activeDomain.title} · Exemple {slideIndex + 1}/{activeDomain.examples.length}
                    </span>
                    <h4 className="font-title font-bold text-xl text-white leading-snug">
                      {currentSlide.title}
                    </h4>
                    <span className="text-xs text-neutral-400 font-mono block mt-1">
                      Localisation : {currentSlide.location}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {currentSlide.description}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-brand-700 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="font-mono font-bold text-accent-400 block mb-0.5">
                        Logiciels &amp; normes d&apos;étude :
                      </span>
                      <span className="text-neutral-200">{currentSlide.softwareOrNorm}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                      <span className="font-mono font-bold text-emerald-300 flex items-center gap-1.5 mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Livrable SERMA BTP :
                      </span>
                      <span className="text-neutral-200">{currentSlide.deliverable}</span>
                    </div>
                  </div>
                </div>

                {/* Miniatures du carrousel du domaine */}
                <div className="pt-3 border-t border-brand-800">
                  <span className="text-[11px] font-mono text-neutral-400 block mb-2">
                    Tous les exemples du domaine « {activeDomain.title} » :
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {activeDomain.examples.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSlideIndex(idx)}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                          idx === slideIndex
                            ? 'border-accent-500 ring-2 ring-accent-500/40 scale-[1.02]'
                            : 'border-white/15 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {ex.type === 'video' ? (
                          <div className="w-full h-full bg-brand-950 flex flex-col items-center justify-center text-amber-300 p-1">
                            <Play className="w-5 h-5 fill-amber-300" />
                            <span className="text-[9px] font-mono mt-0.5">Vidéo R+11</span>
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={ex.src}
                            alt={ex.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
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
