import {
  EntityInfo,
  Project,
  Product,
  LabTest,
  Equipment,
  Lead,
  Quote,
  DocumentItem,
  PublicationItem,
  RoutingRule,
  ScoringRule,
  AuditLogEntry} from '../types';
export const ENTITIES: EntityInfo[] = [
  {
    id: 'serma-btp',
    name: 'Serma Btp',
    tagline: 'Génie civil, charpente métallique & entreprise générale',
    badge: 'Ingénierie & construction lourde',
    color: 'entity-serma',
    colorHex: '#1B4965',
    accentClass: 'bg-[#1B4965]',
    mission: 'Concevoir et réaliser des ouvrages structurés — bâtiment, travaux publics, constructions métalliques et hydraulique — de la conception à la supervision, avec rigueur et conformité.',
    description: 'Créée en 2012 (RC : SN DKR-2012-B-2619), SERMA BTP est un leader reconnu dans les études techniques et la réalisation d\'ouvrages structurés au Sénégal : bâtiment, travaux publics, constructions métalliques et hydraulique, de la conception à la supervision.',
    leader: 'Maguette Niang',
    leaderRole: 'Directeur général',
    address: 'Mbao Ville Neuve, Villa S04',
    city: 'Dakar',
    country: 'Sénégal',
    phone: '+221 78 832 12 79',
    email: 'contact@sermabtp.sn',
    whatsapp: '+221 78 832 12 79',
    ctaText: 'Consulter pour un projet structure',
    ctaAction: 'qualify-serma',
    expertises: [
      'Bâtiment et travaux publics',
      'Constructions métalliques & ouvrages d\'art',
      'Hydraulique, assainissement et énergie',
      'Études de structures métalliques (charpentes, chaudronnerie)',
      'Études de béton armé (bâtiments, ponts, dalots) et supervision de chantiers'
    ],
    equipmentList: [
      'Logiciels de modélisation et calcul structurel (RSA/Robot, AutoCAD)',
      'Solutions BIM et CAO avancées',
      'Station totale, niveaux optiques et instrumentation de suivi de chantier',
      'Équipements de mesure et de contrôle qualité'
    ],
    synergies: [
      { entityId: 'sbs-labo', role: 'Contrôle qualité des soudures et résistance acier', benefit: 'Garantie de conformité Eurocodes et NF' },
      { entityId: 'sbs-logistik', role: 'Levage et transport des tronçons de charpente', benefit: 'Disponibilité immédiate de grues 60T' },
      { entityId: 'sbs-industries', role: 'Fourniture d\'éléments préfabriqués en béton', benefit: 'Optimisation des interfaces acier-béton' }
    ],
    verifiedMetrics: [
      { label: 'Tonnage acier usiné / an', value: '4 500', unit: 'tonnes', status: 'confirmed' },
      { label: 'Surface industrielle couverte', value: '180 000', unit: 'm²', status: 'confirmed' },
      { label: 'Ouvrages majeurs livrés', value: '64', unit: 'projets', status: 'confirmed' },
      { label: 'Précision de montage', value: '± 1.5', unit: 'mm', status: 'confirmed' }
    ],
    icon: 'Hammer'
  },
  {
    id: 'sbs-group',
    name: 'Sbs Group',
    tagline: 'Génie civil, grands ouvrages d\'art & industrie',
    badge: 'Grands travaux, VRD & Industrie',
    color: 'entity-sbsGroup',
    colorHex: '#2D6A8E',
    accentClass: 'bg-[#2D6A8E]',
    mission: 'Concevoir et bâtir des infrastructures pérennes avec un Bureau des Méthodes de pointe, une rigueur absolue d\'exécution aux Eurocodes et le respect strict des délais contractuels.',
    description: 'Fondé en 2016, SB-S Group (Stein Bauer Sénégal Group) est un acteur majeur du génie civil, de l\'industrie et des ouvrages d\'art au Sénégal et en Afrique de l\'Ouest. Sa force repose sur un Bureau des Méthodes hautement qualifié (plans d\'exécution, phasage optimisé, métrés rigoureux), un parc matériel lourd autonome et des références industrielles de premier plan (Centrale Sendou, CSS Richard Toll, LafargeHolcim CI, Port Autonome de Dakar). Philosophie : « Réaliser des prestations de qualité dans une recherche constante de la satisfaction client ».',
    leader: 'Maguette Niang',
    leaderRole: 'Directeur général',
    address: 'Mbao Villeneuve, Villa S04, Route Nationale (à proximité immédiate de la Zone Franche Industrielle ZFI de Mbao)',
    city: 'Mbao, Dakar (Pikine)',
    country: 'Sénégal',
    phone: '+221 33 871 08 61',
    email: 'contact@sbsgroup.sn',
    whatsapp: '+221 77 500 44 22',
    ctaText: 'Consulter pour un marché TP & Industrie',
    ctaAction: 'qualify-sbsgroup',
    expertises: [
      'Génie civil industriel et fondations spéciales de concasseurs & usines',
      'Ouvrages d\'art et ponts mixtes acier-béton (Eurocodes 2, 3 et 4)',
      'Terrassement de masse, plateformes logistiques et voiries lourdes VRD',
      'Bâtiments industriels, hangars grande portée et réhausse de structures',
      'Bureau des Méthodes intégré : études préalables, calculs et métrés d\'exécution',
      'Dallages industriels haute résistance, caniveaux et fosses septiques grande capacité'
    ],
    equipmentList: [
      'Levage lourd : camion grue 5T, camion grue 6T, grue à tour et seaux de coulage',
      'Hauteur & Manutention : nacelles élévatrices télescopiques, chargeurs frontaux',
      'Terrassement lourd : tracto-pelles, dumpers de chantier, compacteurs vibrants',
      'Bétonnage : bétonnière professionnelle 1 000L, toupies 10 m³ et pompes à béton',
      'Transport industriel : camions bennes 40T et camions porteurs TATA 5T',
      'Énergie & Chantier : groupes électrogènes 150 kVA et 5 kVA, équipements de coffrage lourd'
    ],
    synergies: [
      { entityId: 'serma-btp', role: 'Conception et fabrication des charpentes métalliques et réhausses', benefit: 'Réduction des délais de montage industriel de 40%' },
      { entityId: 'sbs-labo', role: 'Essais géotechniques in-situ, contrôle continu béton et agréments ministériels', benefit: 'Garantie d\'assurance décennale et conformité NF' },
      { entityId: 'sbs-logistik', role: 'Flotte de rotation de 30 semi-remorques et grues de levage', benefit: 'Approvisionnement continu et sécurité HSE certifiée' },
      { entityId: 'sbs-industries', role: 'Fourniture de bordures T2/T3, dalots et béton prêt à l\'emploi', benefit: 'Tarifs industriels directs et cadences de coulage maîtrisées' }
    ],
    verifiedMetrics: [
      { label: 'Références industrielles majeures', value: '10+', unit: 'sites réels', status: 'confirmed' },
      { label: 'Disponibilité du parc matériel', value: '98', unit: '%', status: 'confirmed' },
      { label: 'Tonnage acier & coulage', value: '450+', unit: 'm³/projet', status: 'confirmed' },
      { label: 'Capacité centrale à béton', value: '60', unit: 'm³/heure', status: 'confirmed' }
    ],
    icon: 'Building2'
  },
  {
    id: 'sbs-labo',
    name: 'Sbs labo',
    tagline: 'Géotechnique, contrôle qualité & essais matériaux',
    badge: 'Laboratoire de contrôle agréé',
    color: 'entity-sbsLabo',
    colorHex: '#1F9D6B',
    accentClass: 'bg-[#1F9D6B]',
    mission: 'Sécuriser chaque ouvrage par des études de sol, essais sur roches et analyses béton réalisés avec un équipement de pointe et des agréments de catégories C2 et A2.',
    description: 'Filiale géotechnique créée en 2021 (RC : SN DKR 2021 B 12675), SB-S Labo est agréée catégories C2 et A2 et spécialisée en mécanique des sols : études de sol (G2AVP), topographie, essais sur sols et roches (Proctor, CBR, cisaillement) et analyses sur béton frais et durci. Agréments délivrés dans le cadre du référentiel LNR-BTP (loi n° 2023-12 et décret n° 2023-1780).',
    leader: 'Maguette Niang',
    leaderRole: 'Directeur général',
    address: 'Route de Rufisque, Km 12',
    city: 'Dakar',
    country: 'Sénégal',
    phone: '+221 33 834 18 90',
    email: 'labo@sbs-labo.sn',
    whatsapp: '+221 78 120 33 44',
    ctaText: 'Demander un essai de sol / béton',
    ctaAction: 'qualify-labo',
    expertises: [
      'Études de sol (G2AVP) et topographie',
      'Essais sur sols et roches (Proctor, CBR, cisaillement, limites d\'Atterberg)',
      'Analyses sur béton frais et durci (écrasement, compression)',
      'Auscultation et diagnostic d\'ouvrages existants',
      'Levés topographiques et implantations',
      'Agréments officiels C2 (contrôle qualité matériaux) et A2 (sondages & études de sols)'
    ],
    synergies: [
      { entityId: 'serma-btp', role: 'Dimensionnement des fondations sur la base des portances', benefit: 'Optimisation du poids et coût des massifs' },
      { entityId: 'sbs-industries', role: 'Certification continue des bétons préfabriqués', benefit: 'Délivrance de procès-verbaux de conformité' }
    ],
    verifiedMetrics: [
      { label: 'Agrément laboratoire', value: 'C2 + A2', unit: 'catégories', status: 'confirmed' },
      { label: 'Création de la filiale', value: '2021', unit: 'année', status: 'confirmed' },
      { label: 'Délai standard d\'émission PV', value: '48', unit: 'heures', status: 'confirmed' }
    ],
    icon: 'FlaskConical'
  },
  {
    id: 'sbs-industries',
    name: 'Sbs industries',
    tagline: 'Préfabrication béton, BPE & locations d’équipements BTP',
    badge: 'Unité industrielle de préfabrication',
    color: 'entity-sbsIndustries',
    colorHex: '#6B7A8F',
    accentClass: 'bg-[#6B7A8F]',
    mission: 'Assurer l\'autonomie du groupe par la production intégrée de matériaux de construction préfabriqués, garantissant qualité constante et maîtrise des coûts.',
    description: 'Unité industrielle située à la Zone franche industrielle de Mbao (Dakar, Sénégal) : centrale à béton 60 m³/h, pondeuse automatique QT40-3A, piste de préfabrication et parc de cure contrôlée. Gamme : agglos creux (10×20×40 à 20×20×40), agglos pleins haute résistance (15×20×40 & 20×20×40), hourdis (12, 16, 20, 25 cm), pavés (6, 8, 10 cm), béton prêt à l\'emploi (C15 à C30) et location de matériel béton.',
    leader: 'Salimata SOW',
    leaderRole: 'Responsable SBS Industrie',
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    city: 'Mbao, Dakar (Pikine)',
    country: 'Sénégal',
    phone: '+221 33 871 08 61 / +221 77 566 48 06',
    email: 'wsbsindustrie2021@gmail.com',
    whatsapp: '+221 77 566 48 06',
    ctaText: 'Commander des éléments préfabriqués',
    ctaAction: 'qualify-industries',
    expertises: [
      'Agglos creux (10×20×40 à 20×20×40) & Agglos pleins (15×20×40, 20×20×40)',
      'Hourdis pour dalles et planchers (12, 16, 20, 25 cm)',
      'Pavés d’aménagement (6, 8, 10 cm) & location matériel béton (toupie, pompe, QT40-3A)',
      'Béton prêt à l\'emploi (toutes formulations, centrale 60 m³/h)',
      'Pondeuse automatique QT40-3A pour préfabriqués'
    ],
    synergies: [
      { entityId: 'sbs-group', role: 'Fourniture directe sur les chantiers d\'infrastructures', benefit: 'Zéro rupture de stock sur les bordures et dalots' },
      { entityId: 'p2m', role: 'Distribution conjointe pour l\'aménagement paysager', benefit: 'Offre clé en main gros-œuvre et finitions' }
    ],
    verifiedMetrics: [
      { label: 'Capacité centrale à béton', value: '60', unit: 'm³/heure', status: 'confirmed' },
      { label: 'Hourdis produits', value: '12/16/20/25', unit: 'cm', status: 'confirmed' },
      { label: 'Approvisionnement prioritaire chantiers du groupe', value: '100', unit: '%', status: 'confirmed' }
    ],
    icon: 'Factory'
  },
  {
    id: 'sbs-logistik',
    name: 'Sbs logistik',
    tagline: 'Parc d\'engins lourds, levage & transport spécialisé',
    badge: 'Logistique opérationnelle & flotte BTP',
    color: 'entity-sbsLogistik',
    colorHex: '#E0A800',
    accentClass: 'bg-[#E0A800]',
    mission: 'Assurer la gestion, la maintenance et l\'optimisation du parc d\'engins et d\'équipements, garantissant disponibilité et efficacité sur tous les chantiers.',
    description: 'SB-S Logistik assure la gestion et la maintenance du parc matériel, la location d\'engins avec ou sans opérateur, le support logistique multi-sites ainsi que le transport et l\'approvisionnement des chantiers. Commandes et réservations directes auprès de Rokhaya KANE via WhatsApp au +221 77 858 61 05.',
    leader: 'Rokhaya KANE',
    leaderRole: 'Responsable SBS Logistik',
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    city: 'Mbao, Dakar (Pikine)',
    country: 'Sénégal',
    phone: '+221 33 871 08 61 / +221 77 858 61 05',
    email: 'rokhayakane.sbs@gmail.com',
    whatsapp: '+221 77 858 61 05',
    ctaText: 'Réserver un engin / transport',
    ctaAction: 'qualify-logistik',
    expertises: [
      'Gestion et maintenance du parc matériel',
      'Location d\'engins avec ou sans opérateur',
      'Support logistique multi-sites',
      'Transport et approvisionnement de chantiers',
      'Levage : grue mobile 50T, camion grue 6T · Terrassement : tractopelle, dumper, compacteur'
    ],
    synergies: [
      { entityId: 'serma-btp', role: 'Acheminement et levage des structures métalliques', benefit: 'Synchronisation parfaite du calendrier de pose' },
      { entityId: 'pgt', role: 'Prise en charge bord à quai des conteneurs importés', benefit: 'Transit portuaire sans frais de surestaries' }
    ],
    verifiedMetrics: [
      { label: 'Engins et camions en parc', value: '82', unit: 'unités', status: 'confirmed' },
      { label: 'Taux de disponibilité flotte', value: '94.2', unit: '%', status: 'confirmed' },
      { label: 'Heures de levage sécurisées', value: '45 000', unit: 'heures', status: 'confirmed' }
    ],
    icon: 'Truck'
  },
  {
    id: 'p2m',
    name: 'P2M',
    tagline: 'Carrelage de prestige, sanitaires, robinetterie & finitions BTP',
    badge: 'Showroom digital & matériaux de finition',
    color: 'entity-p2m',
    colorHex: '#C0562F',
    accentClass: 'bg-[#C0562F]',
    mission: 'Offrir des matériaux de qualité et des équipements sanitaires de première qualité pour toutes vos constructions, du gros œuvre à la finition.',
    description: 'P2M — Polytech Matériaux Matériels : "Du sol au mur, le carreau parfait". Distributeur de carreaux (céramique, porcelaine, effet marbre, imitation bois), d\'équipements sanitaires, de robinetterie et de matériaux de construction (agglos, hourdis, pavés, bordures, BPE), avec conseil technique et livraison sur chantier.',
    leader: 'Maguette Niang',
    leaderRole: 'Directeur général',
    address: 'Mbao Ville Neuve, Villa S04',
    city: 'Dakar',
    country: 'Sénégal',
    phone: '+221 78 832 12 79',
    email: 'p2m.senegal@gmail.com',
    whatsapp: '+221 78 424 64 45',
    ctaText: 'Constituer un devis carrelage',
    ctaAction: 'qualify-p2m',
    expertises: [
      'Carreaux & revêtements : céramique vitrifiée, porcelaine, effet marbre, imitation bois, full body/double charge',
      'Dimensions sol : 30×30, 40×40, 60×60, 60×120, 80×240 · Murs (faïence) : 20×30 à 80×240',
      'Équipements sanitaires : lavabo, baignoire, receveur, WC complet/suspendu, accessoires',
      'Robinetterie : mitigeurs (lavabo, douche, baignoire), robinets, chasse encastrée',
      'Matériaux de construction : agglos, hourdis, pavés, bordures, BPE'
    ],
    synergies: [
      { entityId: 'sbs-group', role: 'Approvisionnement des programmes résidentiels', benefit: 'Tarifs grossistes et livraison cadencée' },
      { entityId: 'pgt', role: 'Sourcing direct usines Italie, Espagne et Turquie', benefit: 'Disponibilité exclusive et maîtrise des coûts' }
    ],
    verifiedMetrics: [
      { label: 'Heures d\'ouverture lun-ven', value: '8h-18h', unit: '', status: 'confirmed' },
      { label: 'Samedi', value: '8h-13h', unit: '', status: 'confirmed' },
      { label: 'Livraison sur chantier', value: 'Oui', unit: '', status: 'confirmed' }
    ],
    icon: 'Layers'
  },
  {
    id: 'pgt',
    name: 'Pgt',
    tagline: 'Sourcing international, fret maritime, transit & approvisionnement',
    badge: 'Commerce international & import-export',
    color: 'entity-pgt',
    colorHex: '#7A5AA8',
    accentClass: 'bg-[#7A5AA8]',
    mission: 'Faciliter l\'accès aux ressources mondiales pour la croissance économique du Sénégal : de l\'Inde au Sénégal, vos ressources sans frontières.',
    description: 'PGT — Polytech General Trading : "Votre passerelle vers l\'excellence internationale". Sourcing stratégique en Inde (fournisseurs certifiés ISO, économies de 15-30%, délai 5-7 jours), import-export complet (documentation douanière, fret maritime LCL/FCL, assurance cargo 100%, dédouanement au Sénégal) et logistique & manutention (entreposage en zone franche à Dakar).',
    leader: 'Maguette Niang',
    leaderRole: 'Directeur général',
    address: 'Dakar, Sénégal',
    city: 'Dakar',
    country: 'Sénégal',
    phone: '+221 78 832 12 79',
    email: 'pgt.senegal@gmail.com',
    whatsapp: '+221 78 832 12 79',
    ctaText: 'Lancer un sourcing international',
    ctaAction: 'qualify-pgt',
    expertises: [
      'Sourcing international : matériaux de construction, sanitaires, pièces industrielles, engins lourds',
      'Fournisseurs certifiés en Inde · Normes ISO · Audit qualité systématique',
      'Import-export complet : documentation douanière, transport maritime (LCL & FCL)',
      'Assurance cargo full value (100%) et dédouanement au Sénégal',
      'Logistique : entreposage zone franche Dakar, consolidation, distribution'
    ],
    synergies: [
      { entityId: 'p2m', role: 'Importation des séries de carrelages exclusives', benefit: 'Optimisation fret conteneur maritime' },
      { entityId: 'serma-btp', role: 'Sourcing de profilés métalliques spéciaux HEB/IPE', benefit: 'Certificats matière usine traçables 3.1' }
    ],
    verifiedMetrics: [
      { label: 'Économies négociées', value: '15-30', unit: '%', status: 'confirmed' },
      { label: 'Délai sourcing', value: '5-7', unit: 'jours', status: 'confirmed' },
      { label: 'Expérience marché indien', value: '9+', unit: 'ans', status: 'confirmed' }
    ],
    icon: 'Globe'
  }];
export const FOUNDER_PROFILE = {
  name: 'Magatte Niang',
  title: 'Ingénieur en chef des ponts & chaussées · chercheur & entrepreneur BTP',
  summary: 'Fondateur de l\'écosystème BTP regroupant 7 entités complémentaires au Sénégal. Diplômé des grandes écoles d\'ingénieurs, chercheur associé et enseignant en génie civil et structures métalliques, Magatte Niang allie rigueur scientifique, innovation technologique et leadership industriel pour bâtir les infrastructures de demain.',
  experienceYears: 24,
  degrees: [
    'Diplôme d\'ingénieur de génie civil (structures & ouvrages d\'art)',
    'Master de recherche en mécanique des matériaux et géotechnique',
    'Auditeur certifié Eurocodes et normes NF P'
  ],
  roles: [
    { title: 'Président fondateur', org: 'Écosystème Magatte Niang Expert (SERMA BTP, SB-S Group, SB-S Labo, SB-S Industries, SB-S Logistik, P2M, PGT)', period: '2008 – Présent' },
    { title: 'Enseignant & chercheur invité', org: 'Écoles polytechniques & universités de la sous-région', period: '2014 – Présent' },
    { title: 'Expert judiciaire agréé', org: 'Cour d\'appel de Dakar (section bâtiment & travaux publics)', period: '2016 – Présent' }
  ],
  vision: 'Faire du Sénégal un hub technologique et industriel d\'excellence dans le BTP, capable de concevoir, tester, fabriquer et ériger ses propres ouvrages sans dépendance technologique externe.',
  verifiedMetrics: [
    { label: 'Projets structurants supervisés', value: '250+', status: 'confirmed' },
    { label: 'Publications scientifiques', value: '18', status: 'confirmed' },
    { label: 'Emplois directs créés', value: '620', status: 'confirmed' }
  ]};
export const PROJECTS: Project[] = [
  {
    id: 'proj-01',
    slug: 'hangar-logistique-diamniadio-38t',
    title: 'Hangar logistique grande portée & plateforme multimodale',
    client: 'Port Autonome de Dakar & APROSI',
    location: 'Diamniadio, Dakar',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'serma-btp',
    partnerEntityIds: ['sbs-group', 'sbs-logistik'],
    summary: 'Conception, usinage et montage d\'une structure métallique industrielle de 38 tonnes d\'acier à haute limite élastique avec portée libre de 36 mètres sans appui intermédiaire.',
    technicalData: {
      steelTonnage: '38 T',
      concreteVolume: '450 m³',
      span: '36 m',
      surface: '2 400 m²',
      durationMonths: 4
    },
    story: {
      constraints: 'Exigence d\'une surface de manœuvre logistique totalement dégagée sans aucun poteau intermédiaire, couplée à une exposition saline côtière accélérée.',
      solution: 'Modélisation 3D aux Eurocodes 3 avec ferme treillis tubulaire allégée et galvanisation à chaud par trempage intégral complétée d\'une peinture polyuréthane C4.',
      results: 'Gain de poids structurel de 14% par rapport à un profilé laminé classique, montage achevé avec 10 jours d\'avance sans aucun incident HSE.'
    },
    testimonial: {
      author: 'M. Badara Diagne',
      role: 'Directeur des infrastructures',
      company: 'APROSI',
      quote: 'La précision des pièces métalliques usinées et la coordination exemplaire entre le bureau d\'études, le laboratoire et les équipes de levage ont permis un montage sans le moindre accroc.'
    },
    images: [
      { url: '/images/realisations/serma-structure-metallique-etages.jpg', caption: 'Structure métallique industrielle d étages — SERMA BTP', isHero: true },
      { url: '/images/entrepot-logistique.jpg', caption: 'Hangar logistique grande portée et plateforme multimodale achevée' },
      { url: '/images/realisations/serma-modelisation-structurelle-3d-eurocodes.jpg', caption: 'Modélisation structurelle 3D et calculs de résistance Eurocodes 3' },
      { url: '/images/realisations/serma-atelier-usinage-poutrelles.jpg', caption: 'Profilés et poutrelles métalliques usinés dans les ateliers SERMA BTP' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-03',
    slug: 'reconnaissance-geotechnique-tour-r16-dakar',
    title: 'Reconnaissance géotechnique approfondie & essais in-situ tour R+16',
    client: 'Société Immobilière du Cap-Vert (SICAP SA)',
    location: 'Plateau, Dakar',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Géotechnique',
    primaryEntityId: 'sbs-labo',
    partnerEntityIds: ['sbs-group'],
    summary: 'Campagne de 8 forages carottés à 45m de profondeur avec essais pressiométriques Ménard et modélisation de tassement pour fondations sur pieux d\'une tour de grande hauteur.',
    technicalData: {
      soilTestsCount: 142,
      depthMax: '45 m',
      piezometerMonitoringMonths: 6,
      durationMonths: 2
    },
    story: {
      constraints: 'Contexte urbain dense au Plateau : mitoyenneté immédiate d\'immeubles classés et nappe phréatique battante sous remblais hétérogènes.',
      solution: 'Combinaison de carottages rotary tubés, essais de pénétration dynamique lourd et pose de piézomètres à corde vibrante télémesurés.',
      results: 'Émission du rapport de synthèse sous 15 jours avec recommandations de pieux forés de 800mm retenus par le bureau de contrôle.'
    },
    images: [
      { url: '/images/reelles/sbs-labo-reel-005.jpg', caption: 'Sondages géotechniques et forages in-situ par les équipes SB-S Labo', isHero: true },
      { url: '/images/reelles/sbs-labo-reel-003.jpg', caption: 'Essais pressiométriques et ingénierie de sol SB-S Labo' },
      { url: '/images/grue-portique.jpg', caption: 'Chantier de superstructure et fondations profondes tour R+16' },
      { url: '/images/reelles/sbs-labo-reel-006.jpg', caption: 'Immeuble de grande hauteur achevé après validation des sols' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-04',
    slug: 'amenagement-showroom-residences-almadies',
    title: 'Lot finitions & revêtements carrelage grand format 80 appartements',
    client: 'Consortium Résidentiel Les Almadies',
    location: 'Les Almadies, Dakar',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'p2m',
    partnerEntityIds: ['pgt'],
    summary: 'Fourniture exclusive de 14 000 m² de grès cérame poli 60x120cm, sanitaires suspendus et robinetterie encastrée avec coordination logistique.',
    technicalData: {
      surface: '14 000 m²',
      concreteVolume: 'N/A',
      durationMonths: 5
    },
    story: {
      constraints: 'Livraisons cadencées étage par étage pour éviter la congestion de la voirie d\'accès des Almadies.',
      solution: 'Sourcing direct usine par PGT avec stockage tampon au magasin central P2M et livraison quotidienne par camionnette équipée de hayon.',
      results: 'Taux de casse inférieur à 0.4%, satisfaction totale du promoteur et attribution du lot de la tranche 2.'
    },
    images: [
      { url: '/images/realisations/p2m-realisation-villa-almadies-salon.jpg', caption: 'Grand salon de réception avec carrelage grand format 60×120 cm poli miroir — Les Almadies', isHero: true },
      { url: '/images/realisations/p2m-realisation-villa-almadies-sol.jpg', caption: 'Séjour et salle à manger en grès cérame pleine masse — Dakar' },
      { url: '/images/realisations/p2m-villa-almadies-carrelage-salon.jpg', caption: 'Sol de séjour en dalles céramiques polies grand format' },
      { url: '/images/carrelage-interieur.jpg', caption: 'Finitions intérieures carrelées et plinthes assorties P2M' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-05',
    slug: 'stockage-produits-chimiques-centrale-sendou',
    title: 'Construction du bâtiment de stockage de produits chimiques & structure de toiture',
    client: 'Compagnie d\'électricité du Sénégal (CES) — centrale électrique de Sendou',
    location: 'Centrale électrique de Sendou, Dakar',
    region: 'Dakar',
    year: 2025,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-labo', 'sbs-logistik'],
    summary: 'Construction d\'un bâtiment de stockage de produits chimiques avec structure de couverture métallique pour la centrale électrique de Sendou, en coordination avec l\'exploitant.',
    technicalData: {
      surface: 'Stockage industriel',
      steelTonnage: 'Structure de toiture complète',
      concreteVolume: 'Fondations & dallage béton armé',
      durationMonths: 8
    },
    story: {
      constraints: 'Zone d\'exploitation d\'une centrale électrique en service : contraintes de coactivité strictes, normes HSE renforcées pour le stockage de produits chimiques.',
      solution: 'Étude et exécution par SB-S Group avec contrôle qualité SB-S Labo et levage assuré par la flotte SB-S Logistik.',
      results: 'Bâtiment livré et réceptionné par la CES — référence industrielle majeure du groupe (2024-2025).'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page21-img01.jpeg', caption: 'Centrale thermique CES Sendou — Cuvelage étanche et rétention (Extrait officiel PDF P.21)' },
      { url: '/images/sbs-presentation/sbs-page21-img02.jpeg', caption: 'Structure de stockage et génie civil produits chimiques (Extrait officiel PDF P.21)' },
      { url: '/images/sbs-slides/sbs-slide-21.jpg', caption: 'Planche officielle CES Sendou Stockage (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-06',
    slug: 'usine-oxygene-psa-mako-dlm',
    title: 'Ingénierie & conception (civile, électrique, mécanique) — usine d\'oxygène PSA 6 T/j',
    client: 'DLM Sénégal',
    location: 'Mako, Kédougou',
    region: 'Autre',
    year: 2023,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-labo', 'serma-btp'],
    summary: 'Ingénierie et conception complète (génie civil, électrique et mécanique) pour l\'installation d\'une usine de production d\'oxygène PSA de 6 tonnes par jour à Mako, région de Kédougou.',
    technicalData: {
      surface: 'Usine industrielle PSA',
      concreteVolume: 'Génie civil complet',
      durationMonths: 10
    },
    story: {
      constraints: 'Site isolé en région de Kédougou : logistique d\'approvisionnement complexe et exigences techniques d\'une unité de production médicale/industrielle d\'oxygène.',
      solution: 'Conception multi-disciplinaire intégrée (bâtiments, fondations spéciales, réseaux électriques et mécaniques) avec études de sol préalables par SB-S Labo.',
      results: 'Usine d\'oxygène PSA 6TPJ installée et mise en service — référence d\'ingénierie industrielle en région (2023).'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page25-img01.jpeg', caption: 'Usine d\'oxygène PSA 6TPJ à Mako — Génie civil & massifs compresseurs (Extrait officiel PDF P.25)' },
      { url: '/images/sbs-presentation/sbs-page25-img02.jpeg', caption: 'Réseaux fluides industriels et plateforme technique Mako (Extrait officiel PDF P.25)' },
      { url: '/images/sbs-slides/sbs-slide-25.jpg', caption: 'Planche officielle DLM Sénégal Mako (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-07',
    slug: 'bureaux-carriere-sococim-polytech',
    title: 'Travaux de construction des bureaux — carrière SOCOCIM',
    client: 'Polytech Entreprise',
    location: 'Carrière SOCOCIM',
    region: 'Thiès',
    year: 2025,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-industries'],
    summary: 'Construction de bâtiments de bureaux pour l\'exploitation de la carrière SOCOCIM, dans le cadre de l\'optimisation du circuit de broyage (deuxième concasseur, Plan Wol).',
    technicalData: {
      surface: 'Bâtiments de bureaux',
      concreteVolume: 'Gros œuvre complet',
      durationMonths: 6
    },
    story: {
      constraints: 'Site d\'exploitation de carrière en activité : phasage des travaux sans interruption de la production.',
      solution: 'Construction modulaire en gros œuvre béton avec fourniture d\'agglos et hourdis par SB-S Industries.',
      results: 'Bureaux livrés à Polytech Entreprise (référence 2025) — dans la continuité des travaux de génie civil du deuxième concasseur.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page17-img02.jpeg', caption: 'Bâtiment administratif & bureaux d\'exploitation carrière SOCOCIM (Extrait officiel PDF P.17)', isHero: true },
      { url: '/images/sbs-presentation/sbs-page17-img03.jpeg', caption: 'Gros œuvre et maçonnerie renforcée SOCOCIM (Extrait officiel PDF P.17)' },
      { url: '/images/sbs-slides/sbs-slide-17.jpg', caption: 'Planche officielle Carrière SOCOCIM (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-08',
    slug: 'aire-lavage-secaa',
    title: 'Construction d\'une Aire de Lavage Industrielle',
    client: 'SECAA SA',
    location: 'Dakar',
    region: 'Dakar',
    year: 2025,
    status: 'Achevé',
    sector: 'Infrastructures',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-labo'],
    summary: 'Réalisation complète d\'une aire de lavage industrielle : terrassements, dallage béton armé renforcé, drainage et traitement de surface antidérapant.',
    technicalData: {
      surface: 'Aire de lavage industrielle',
      concreteVolume: 'Dallage béton armé + drainage',
      durationMonths: 3
    },
    story: {
      constraints: 'Aire soumise à des charges lourdes et à une exposition permanente à l\'eau : exigence de durabilité et d\'évacuation efficace des effluents.',
      solution: 'Dallage béton armé à haute résistance avec pentes calées, caniveaux de collecte et décanteur, contrôlés par SB-S Labo.',
      results: 'Aire de lavage opérationnelle, livrée dans les délais pour SECAA SA.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page46-img01.jpeg', caption: 'Aire de lavage poids lourds autoroute SECAA — Dalle béton armé (Extrait officiel PDF P.46)' },
      { url: '/images/sbs-presentation/sbs-page46-img02.jpeg', caption: 'Caniveaux déshuileurs et fosses de décantation SECAA (Extrait officiel PDF P.46)' },
      { url: '/images/sbs-slides/sbs-slide-46.jpg', caption: 'Planche officielle Aire de lavage SECAA (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-09',
    slug: 'travaux-oim-societe-generale',
    title: 'Travaux pour le compte de l\'Organisation Internationale pour les Migrations (OIM)',
    client: 'Société Générale des Travaux — pour l\'OIM',
    location: 'Sénégal',
    region: 'Dakar',
    year: 2025,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: [],
    summary: 'Exécution de travaux de construction pour le compte de l\'Organisation Internationale pour les Migrations (OIM), dans le cadre de projets humanitaires et d\'infrastructures.',
    technicalData: {
      surface: 'Infrastructures humanitaires',
      durationMonths: 4
    },
    story: {
      constraints: 'Cahier des charges international OIM : exigences de qualité, de traçabilité et de reporting strictes.',
      solution: 'Exécution conforme aux standards internationaux avec reporting régulier au maître d\'ouvrage.',
      results: 'Travaux réceptionnés conformément aux standards de l\'OIM.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page43-img01.jpeg', caption: 'Infrastructures et bâtiments sécurisés OIM Sénégal (Extrait officiel PDF P.43)' },
      { url: '/images/sbs-presentation/sbs-page43-img02.jpeg', caption: 'Aménagements intérieurs et blocs sanitaires OIM (Extrait officiel PDF P.43)' },
      { url: '/images/sbs-slides/sbs-slide-43.jpg', caption: 'Planche officielle OIM Sénégal (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-10',
    slug: 'dallage-caniveau-fosse-septique-goree-offshore',
    title: 'Dallage béton armé, caniveau & fosse septique — base industrielle',
    client: 'Gorée Offshore',
    location: 'Dakar',
    region: 'Dakar',
    year: 2025,
    status: 'Achevé',
    sector: 'Infrastructures',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-labo'],
    summary: 'Réalisation de dallages en béton armé et non armé, d\'un caniveau de drainage et d\'une fosse septique pour la base industrielle de Gorée Offshore.',
    technicalData: {
      surface: 'Dallages industriels',
      concreteVolume: 'Béton armé & non armé',
      durationMonths: 3
    },
    story: {
      constraints: 'Sols industriels sollicités par des charges roulantes lourdes et exposition aux hydrocarbures.',
      solution: 'Formulation béton adaptée validée par SB-S Labo, joints de dilatation calibrés et drainage canalisé.',
      results: 'Ouvrages livrés et validés par le client Gorée Offshore (contact : Gaspard Mendy).'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page20-img01.jpeg', caption: 'Dallage béton armé 12 000 m² anti-usure quartz (Extrait officiel PDF P.20)' },
      { url: '/images/sbs-presentation/sbs-page20-img02.jpeg', caption: 'Caniveaux VRD préfabriqués et fosses techniques (Extrait officiel PDF P.20)' },
      { url: '/images/sbs-slides/sbs-slide-20.jpg', caption: 'Planche officielle Dallage & Caniveaux VRD (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-11',
    slug: 'revetements-carrelage-villa-contemporaine-saly',
    title: 'Revêtements carrelage céramique & terrasses extérieures — Villa contemporaine Saly',
    client: 'Investissement Privé Résidentiel',
    location: 'Saly Portudal, Mbour',
    region: 'Thiès',
    year: 2024,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'p2m',
    partnerEntityIds: ['pgt', 'sbs-logistik'],
    summary: 'Fourniture et pose de 850 m² de revêtements intérieurs en céramique grand format et terrasses extérieures antidérapantes pour une villa contemporaine de standing à Saly.',
    technicalData: {
      surface: '850 m²',
      durationMonths: 3
    },
    story: {
      constraints: 'Exigences élevées de résistance au sable marin et au soleil direct pour les terrasses et abords de piscine.',
      solution: 'Sélection de dalles porcelaine pleine masse antidérapante R11 pour l\'extérieur et carrelage poli haute brillance pour le grand séjour.',
      results: 'Ouvrage livré avec des finitions remarquables, pérennité éprouvée en milieu côtier et entière satisfaction du maître d\'ouvrage.'
    },
    images: [
      { url: '/images/realisations/p2m-realisation-villa-saly-sejour.jpg', caption: 'Séjour traversant carrelé ouvert sur l\'extérieur — Villa Saly', isHero: true },
      { url: '/images/realisations/p2m-realisation-terrasse-piscine.jpg', caption: 'Plage de piscine & terrasse carrelée en porcelaine antidérapante R11 — Saly' },
      { url: '/images/realisations/p2m-villa-saly-carrelage-sejour.jpg', caption: 'Salon contemporain avec carrelage haute brillance naturelle — Saly Portudal' },
      { url: '/images/realisations/p2m-realisation-chambre-carrelage-bois.jpg', caption: 'Chambre parentale avec carrelage imitation parquet chêne — Villa Saly' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-12',
    slug: 'carrelage-marbre-sanitaires-villa-fann-residence',
    title: 'Aménagement carrelage marbre & équipements sanitaires — Villa d\'architecte Fann Résidence',
    client: 'SCI Fann Corniche',
    location: 'Fann Résidence, Dakar',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'p2m',
    partnerEntityIds: ['pgt'],
    summary: 'Lot carrelage d\'exception et sanitaires de prestige : dalles grand format effet marbre Calacatta Gold, mosaïque artisanale et équipements sanitaires haut de gamme.',
    technicalData: {
      surface: '1 200 m²',
      durationMonths: 4
    },
    story: {
      constraints: 'Pose de dalles de très grandes dimensions sans défaut d\'alignement et intégration de sanitaires encastrés de haute précision.',
      solution: 'Fourniture de carreaux premium importés par P2M et mise à disposition d\'outillage professionnel de calepinage et ventouses grand format.',
      results: 'Rendu architectural luxueux salué par l\'architecte en chef et publication dans la revue d\'architecture ouest-africaine.'
    },
    images: [
      { url: '/images/realisations/p2m-realisation-salon-marbre-luxe.jpg', caption: 'Grand salon de réception avec carrelage marbré haute brillance — Fann Résidence', isHero: true },
      { url: '/images/realisations/p2m-realisation-fann-hall-marbre.jpg', caption: 'Hall d\'entrée majestueux en dalles grand format effet marbre — Dakar' },
      { url: '/images/realisations/p2m-realisation-fann-salle-de-bain.jpg', caption: 'Salle de bain parentale : marbre mural, double vasque et baignoire îlot P2M' },
      { url: '/images/realisations/p2m-salle-de-bain-prestige.jpg', caption: 'Salle d\'eau moderne carrelée avec douche à l\'italienne & robinetterie encastrée' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-13',
    slug: 'sols-interieurs-terrasses-domaine-la-somone',
    title: 'Sols intérieurs & terrasses de standing — Domaine résidentiel La Somone',
    client: 'Promoteur Teranga Habitat',
    location: 'La Somone, Petite Côte',
    region: 'Thiès',
    year: 2023,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'p2m',
    partnerEntityIds: ['pgt', 'sbs-group'],
    summary: 'Fourniture de 3 200 m² de carreaux porcelaine 60x60 et 60x120 pour un ensemble de 6 villas de villégiature à La Somone.',
    technicalData: {
      surface: '3 200 m²',
      durationMonths: 6
    },
    story: {
      constraints: 'Harmonisation esthétique entre les espaces intérieurs frais et les varangues et terrasses ventilées.',
      solution: 'Combinaison de teintes sable naturel et blanc cristal avec joints hydrofuges ultra-fins.',
      results: 'Six villas entièrement équipées et livrées aux acquéreurs dans le respect du calendrier convenu.'
    },
    images: [
      { url: '/images/realisations/p2m-villa-somone-carrelage-terrasse.jpg', caption: 'Salon traversant ouvert sur terrasse carrelée — Domaine La Somone', isHero: true },
      { url: '/images/realisations/p2m-villa-dakar-marbre-blanc.jpg', caption: 'Séjour lumineux carrelé en dalles porcelaine blanc cristal — La Somone' },
      { url: '/images/realisations/p2m-realisation-salon-blanc-marbre.jpg', caption: 'Espace de vie contemporain avec carrelage grand format beige clair' },
      { url: '/images/realisations/p2m-villa-sol-marbre-salon.jpg', caption: 'Finitions intérieures soignées et plinthes assorties P2M' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  }
,
  {
    id: 'proj-14',
    slug: 'fourniture-beton-prefabrication-voiries-dakar',
    title: 'Fourniture de béton prêt à l\'emploi & préfabrication — Voiries & plateformes',
    client: 'Consortium BTP & Ageroute',
    location: 'Diamniadio - Dakar',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Infrastructures',
    primaryEntityId: 'sbs-industries',
    partnerEntityIds: ['sbs-labo', 'sbs-logistik'],
    summary: 'Fourniture continue de 8 500 m³ de béton prêt à l\'emploi formulé C25/30 et livraison de 45 000 agglos et bordures normalisées pour l\'aménagement de plateformes et voiries urbaines.',
    technicalData: {
      concreteVolume: '8 500 m³',
      surface: '18 000 m²',
      durationMonths: 6
    },
    story: {
      constraints: 'Cadence de coulage continue sans rupture d\'approvisionnement et maintien d\'une ouvrabilité constante sous température élevée.',
      solution: 'Centrale automatisée 250 m³/jour avec adjuvants retardateurs de prise certifiés et suivi continu des éprouvettes par SB-S Labo.',
      results: 'Résistances mécaniques à 28 jours supérieures de 12% aux spécifications contractuelles et respect rigoureux du planning de coulage.'
    },
    images: [
      { url: '/images/realisations/sbs-beton-malaxeur-pompe-site.jpg', caption: 'Coulage à la pompe et fourniture de béton prêt à l\'emploi pour voiries & plateformes — SB-S Industries', isHero: true },
      { url: '/images/sbs-logistik/logistik-equip-010.jpg', caption: 'Livraison de béton frais par camion malaxeur toupie 10 m³ — SB-S Industries' },
      { url: '/images/reelles/agglos-industrie-production-blocs.jpg', caption: 'Production d\'agglos creux 10×20×40 (380 F), pleins 15×20×40 (700 F), hourdis et pavés' },
      { url: '/images/reelles/surfacement-mecanique-dallage-talocheuse.jpg', caption: 'Dallage et surfaçage mécanique haute résistance' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-15',
    slug: 'levage-lourd-manutention-convois-chantiers',
    title: 'Opérations de levage lourd, manutention & convois exceptionnels de chantier',
    client: 'Partenaires industriels & énergétiques du Sénégal',
    location: 'Dakar, Thiès & corridors miniers',
    region: 'Thiès',
    year: 2024,
    status: 'Achevé',
    sector: 'Logistique',
    primaryEntityId: 'sbs-logistik',
    partnerEntityIds: ['serma-btp', 'sbs-group'],
    summary: 'Mobilisation d\'une flotte de grues mobiles télescopiques 50T, camions-grues 6T et semi-remorques plateaux pour le levage et le transfert d\'équipements industriels lourds.',
    technicalData: {
      capacity: 'Levage 50T & flotte 82 engins',
      durationMonths: 12
    },
    story: {
      constraints: 'Manutention de charges volumineuses et fragiles en environnement industriel contraint, exigences HSE strictes.',
      solution: 'Plans de calage et de levage certifiés avec opérateurs agréés et assistance mécanique permanente 24/7 sur site.',
      results: 'Zéro accident de levage, respect des délais d\'acheminement et satisfaction totale des maîtres d\'ouvrage partenaires.'
    },
    images: [
      { url: '/images/sbs-logistik/logistik-equip-001.jpg', caption: 'Opérations de levage lourd par grue mobile télescopique 50 tonnes Samsung — SB-S Logistik', isHero: true },
      { url: '/images/sbs-logistik/logistik-equip-002.jpg', caption: 'Camion-grue 6 tonnes à flèche hydraulique télescopique en déploiement' },
      { url: '/images/sbs-logistik/logistik-equip-008.jpg', caption: 'Nacelle automotrice télescopique grande hauteur 30 mètres Aichi' },
      { url: '/images/sbs-logistik/logistik-equip-007.jpg', caption: 'Nacelle élévatrice télescopique sur porteur 21 mètres Isuzu' },
      { url: '/images/sbs-logistik/logistik-equip-003.jpg', caption: 'Camion benne 40 tonnes Sinotruk HOWO pour transport massif d\'agrégats' },
      { url: '/images/sbs-logistik/logistik-equip-004.jpg', caption: 'Ensemble routier semi-remorque benne 40 tonnes Renault' },
      { url: '/images/sbs-logistik/logistik-equip-005.jpg', caption: 'Camion porteur plateau à ridelles TATA 6 tonnes' },
      { url: '/images/sbs-logistik/logistik-equip-009.jpg', caption: 'Dumper articulé tout-terrain FCY30R — capacité 3 tonnes' },
      { url: '/images/sbs-logistik/logistik-equip-006.jpg', caption: 'Tractopelle polyvalent 4x4 en travaux de terrassement et fouilles' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-16',
    slug: 'approvisionnement-sourcing-direct-pad',
    title: 'Approvisionnement direct usines & logistique maritime conteneurisée',
    client: 'Grands Comptes BTP & Promoteurs Immobiliers',
    location: 'Port Autonome de Dakar (PAD)',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'pgt',
    partnerEntityIds: ['p2m', 'serma-btp'],
    summary: 'Sourcing direct usine de 220 conteneurs de profilés acier, fer à béton, carrelages grand format et sanitaires avec dédouanement express et livraison sur sites.',
    technicalData: {
      capacity: '220 conteneurs maritimes',
      durationMonths: 10
    },
    story: {
      constraints: 'Tension sur les approvisionnements mondiaux de matières premières et délais de transit portuaire.',
      solution: 'Négociation en amont direct usines en Europe et Asie, sécurisation des lignes de fret maritime et dédouanement accéléré au PAD.',
      results: 'Économie de coût de 18% par rapport au marché local de détail et disponibilité continue des stocks sans rupture de chantier.'
    },
    images: [
      { url: '/images/pgt/pgt-terminal-port-dakar.jpg', caption: 'Déchargement de navire porte-conteneurs au Port Autonome de Dakar (PAD)', isHero: true },
      { url: '/images/port-conteneurs.jpg', caption: 'Terminal conteneurs et transit international PGT' },
      { url: '/images/pgt/pgt-parc-conteneurs-stockage.jpg', caption: 'Parc conteneurs et stockage sous douane au Port de Dakar' },
      { url: '/images/pgt/pgt-navire-cargo-manutention.jpg', caption: 'Navire cargo porte-conteneurs en opération de déchargement au PAD' },
      { url: '/images/pgt/pgt-fret-maritime-conteneurs.jpg', caption: 'Fret maritime conteneurisé — approvisionnement direct usines' },
      { url: '/images/pgt/pgt-transit-douane-entrepot.jpg', caption: 'Entrepôt logistique et dédouanement express de matériaux' },
      { url: '/images/port.jpg', caption: 'Vue du Port Autonome de Dakar — plateforme d\'échanges internationaux' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  }
  ,
  {
    id: 'proj-17',
    slug: 'controle-compactage-cbr-autoroute-mbour-kaolack',
    title: 'Contrôle géotechnique, essais CBR & formulation de chaussée — Autoroute Mbour-Fatick-Kaolack',
    client: 'Ageroute Sénégal',
    location: 'Mbour - Kaolack',
    region: 'Thiès',
    year: 2024,
    status: 'Achevé',
    sector: 'Géotechnique',
    primaryEntityId: 'sbs-labo',
    partnerEntityIds: ['sbs-group'],
    summary: 'Mission de contrôle externe de compactage et portance de sol : réalisation de 450 essais CBR, essais Proctor modifiés et mesures de densité in-situ au gammadensimètre pour garantir la stabilité de la plateforme autoroutière.',
    technicalData: {
      soilTestsCount: 450,
      surface: '65 km de linéaire',
      durationMonths: 10
    },
    story: {
      constraints: 'Exigence de compacité minimale de 95% de l\'OPM sur les couches de forme et de base en milieu latéritique aride.',
      solution: 'Mise en place d\'un laboratoire de chantier mobile SB-S Labo avec restitution quotidienne des densités en temps réel aux équipes de terrassement.',
      results: 'Conformité géotechnique à 100% validée par la mission de contrôle CEREEQ, zéro reprise de couche et mise en service anticipée.'
    },
    images: [
      { url: '/images/reelles/sbs-labo-reel-002.jpg', caption: 'Essais de portance in-situ et contrôle géotechnique de plateforme — SB-S Labo', isHero: true },
      { url: '/images/reelles/sbs-labo-reel-003.jpg', caption: 'Ingénieur géotechnicien SB-S Labo réalisant les mesures de compacité' },
      { url: '/images/reelles/sbs-labo-reel-005.jpg', caption: 'Sondeuse géotechnique APAFOR 450RS mobilisée pour reconnaissance des sols' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-18',
    slug: 'controle-qualite-beton-ecrasement-pont-foundiougne',
    title: 'Contrôle qualité béton & écrasement d\'éprouvettes sous presse 3 000 kN — Pont de Foundiougne',
    client: 'Direction des Travaux Publics & Groupement Ouvrages d\'Art',
    location: 'Foundiougne, Fatick',
    region: 'Fatick',
    year: 2023,
    status: 'Achevé',
    sector: 'Géotechnique',
    primaryEntityId: 'sbs-labo',
    partnerEntityIds: ['sbs-group', 'sbs-industries'],
    summary: 'Prélèvement et écrasement normalisé de 1 200 éprouvettes béton 16×32 sous presse asservie 3 000 kN (NF EN 12390-3) pour validation des résistances B35/C30-37 en environnement salin marin.',
    technicalData: {
      soilTestsCount: 1200,
      concreteVolume: '14 500 m³ contrôlés',
      durationMonths: 14
    },
    story: {
      constraints: 'Ouvrage d\'art en milieu marin fortement agressif (teneur en chlorures élevée) imposant un contrôle drastique de la compacité et de la porosité du béton.',
      solution: 'Protocole de suivi continu à la centrale et au coulage, cure thermorégulée des éprouvettes et essais d\'écrasement rigoureux à 7, 14 et 28 jours.',
      results: 'Résistances caractéristiques fck atteintes à plus de 42 MPa à 28 jours, validation sans réserve des pieux, piles et voussoirs du pont.'
    },
    images: [
      { url: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg', caption: 'Essai d\'écrasement d\'éprouvette béton 16×32 sous presse asservie 3 000 kN — SB-S Labo', isHero: true },
      { url: '/images/reelles/sbs-labo-reel-003.jpg', caption: 'Ingénieurs géotechniciens et qualiticiens SB-S Labo en mission de contrôle' },
      { url: '/images/reelles/sbs-labo-reel-006.jpg', caption: 'Ouvrage en béton armé contrôlé et certifié par le laboratoire SB-S Labo' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-19',
    slug: 'sondages-penetrometre-pdl-plateforme-diamniadio',
    title: 'Étude de sol, forages carottés & pénétromètre dynamique lourd (PDL) — Diamniadio',
    client: 'Société de Gestion du Pôle Urbain de Diamniadio',
    location: 'Diamniadio, Dakar',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Géotechnique',
    primaryEntityId: 'sbs-labo',
    partnerEntityIds: ['sbs-group'],
    summary: 'Campagne géotechnique de 24 forages carottés avec essais au pénétromètre dynamique lourd PDL (NF P 94-115) jusqu\'à 15m de profondeur pour dimensionnement des radiers et dallages industriels.',
    technicalData: {
      soilTestsCount: 280,
      surface: '45 000 m²',
      depthMax: '15 m',
      durationMonths: 3
    },
    story: {
      constraints: 'Sols marneux gonflants caractéristiques du bassin de Diamniadio nécessitant la définition précise des profondeurs d\'ancrage hors zone d\'aléa hydrique.',
      solution: 'Couplage d\'essais œdométriques en laboratoire SB-S Labo et de profils de résistance dynamique de pointe in-situ avec la foreuse APAFOR 450RS.',
      results: 'Fourniture du modèle de portance admissible sous 10 jours et optimisation du coût des fondations avec une économie de 22% sur les terrassements.'
    },
    images: [
      { url: '/images/reelles/sbs-labo-reel-005.jpg', caption: 'Foreuse géotechnique autonome APAFOR 450RS sur plateforme industrielle — SB-S Labo', isHero: true },
      { url: '/images/reelles/sbs-labo-reel-004.jpg', caption: 'Forage carotté rotary et analyse stratigraphique des sols' },
      { url: '/images/reelles/sbs-labo-reel-003.jpg', caption: 'Contrôle des carottes et mesures de plasticité en laboratoire' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-20',
    slug: 'auvent-metallique-charpente-stations-service-vivo-energy',
    title: 'Auvents métalliques grande portée & structures d\'auvent — Réseau stations-service VIVO Energy / Shell',
    client: 'VIVO Energy Sénégal & Shell',
    location: 'Fatick, Sandiara, Touba Toul, Dakar',
    region: 'Fatick',
    year: 2024,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'serma-btp',
    partnerEntityIds: ['sbs-labo', 'sbs-group'],
    summary: 'Conception, calculs Eurocodes 3 et fabrication en atelier des auvents métalliques grande portée, caissons de toiture et poteaux tubulaires pour les stations-service du réseau VIVO Energy.',
    technicalData: {
      steelTonnage: '46 T',
      span: '28 m',
      surface: '1 850 m²',
      durationMonths: 5
    },
    story: {
      constraints: 'Respect des normes de sécurité pétrolière très strictes (ATEX / HSE), charges au vent élevées en zone sahélienne et délais d\'exécution serrés pour limiter l\'interruption d\'activité.',
      solution: 'Modélisation 3D aux Eurocodes 3 sous Robot/RSA, préfabrication complète des fermes et pannes métalliques dans l\'atelier SERMA BTP et assemblage boulonné in-situ.',
      results: 'Pose de chaque auvent réalisée en moins de 72 heures par station, conformité HSE sans aucune réserve et durabilité garantie sous traitement anticorrosion C4.'
    },
    testimonial: {
      author: 'M. Ousmane Diop',
      role: 'Responsable Projets & Ingénierie Réseau',
      company: 'VIVO Energy Sénégal',
      quote: 'SERMA BTP a démontré une maîtrise exceptionnelle de la construction métallique : précision d\'usinage, respect scrupuleux des normes de sécurité et respect total des délais de livraison.'
    },
    images: [
      { url: '/images/realisations/serma-auvent-station-service.jpg', caption: 'Auvent métallique et structure acier de couverture station-service — SERMA BTP', isHero: true },
      { url: '/images/realisations/serma-modelisation-structurelle-3d-eurocodes.jpg', caption: 'Calculs de résistance 3D aux Eurocodes 3 pour charges au vent et descente de charge' },
      { url: '/images/realisations/serma-atelier-usinage-poutrelles.jpg', caption: 'Profilés tubulaires et poutrelles métalliques usinés à Diamniadio' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-21',
    slug: 'hangar-industriel-stockage-pharmaceutique-ubipharm-2800m2',
    title: 'Hangar industriel grande portée (2 800 m²) pour stockage pharmaceutique — UBIPHARM Sénégal',
    client: 'UBIPHARM Sénégal',
    location: 'Diamniadio, Dakar',
    region: 'Dakar',
    year: 2023,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'serma-btp',
    partnerEntityIds: ['sbs-group', 'sbs-industries', 'sbs-logistik'],
    summary: 'Réalisation complète d\'un hangar industriel de 2 800 m² à charpente métallique haute performance destiné au hub logistique pharmaceutique UBIPHARM.',
    technicalData: {
      steelTonnage: '62 T',
      span: '42 m libre',
      surface: '2 800 m²',
      durationMonths: 6
    },
    story: {
      constraints: 'Exigences rigoureuses de l\'industrie pharmaceutique : isolation thermo-acoustique parfaite, étanchéité à l\'air et planchers sans vibration sous forte charge logistique.',
      solution: 'Calculs tridimensionnels aux Eurocodes 3, portiques métalliques à inertie variable en acier S355, bardage double peau isolé et dallage continu renforcé.',
      results: 'Ouvrage livré avec PV d\'étanchéité et certification de conformité industrielle sans réserve, opérationnel pour la logistique pharmaceutique régionale.'
    },
    testimonial: {
      author: 'Dr. Cheikh Tidiane Sy',
      role: 'Directeur des Opérations Logistiques',
      company: 'UBIPHARM Sénégal',
      quote: 'La rigueur technique de SERMA BTP et la qualité de leur charpente métallique ont permis de créer un hub moderne conforme aux exigences internationales de stockage pharmaceutique.'
    },
    images: [
      { url: '/images/realisations/serma-hangar-industriel-structure.jpg', caption: 'Charpente métallique et portiques industriels grande portée 42 m — SERMA BTP', isHero: true },
      { url: '/images/entrepot-logistique.jpg', caption: 'Hangar logistique achevé et aire de stockage haute capacité UBIPHARM' },
      { url: '/images/realisations/serma-charpente-metallique-chantier.jpg', caption: 'Assemblage de la charpente métallique et montage des pannes de toiture' },
      { url: '/images/realisations/serma-modelisation-structurelle-3d-eurocodes.jpg', caption: 'Modélisation structurelle 3D et notes de calcul Eurocodes 3' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-22',
    slug: 'etude-conception-structure-charpente-metallique-r9-dakar',
    title: 'Étude d\'ingénierie & ossature métallique grande hauteur R+9 — Dakar',
    client: 'Promoteur Immobilier Privé & SCI Dakar Résidences',
    location: 'Dakar Fann / Point E',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'serma-btp',
    partnerEntityIds: ['sbs-labo', 'sbs-industries'],
    summary: 'Conception structurelle complète, modélisation par éléments finis (RSA) et supervision de montage pour une structure mixte acier-béton sur un immeuble de 9 niveaux.',
    technicalData: {
      steelTonnage: '85 T',
      span: '32 m',
      surface: '3 600 m²',
      durationMonths: 7
    },
    story: {
      constraints: 'Emprise foncière très réduite en tissu urbain dense nécessitant des éléments manuportables et une vitesse de montage élevée pour réduire la gêne riveraine.',
      solution: 'Choix d\'une ossature poteaux-poutres métalliques avec planchers collaborants bac acier/béton et modélisation dynamique aux séismes et vents Eurocodes 1, 3 et 8.',
      results: 'Gain de 35% sur le temps d\'érection du gros œuvre par rapport à une structure classique 100% béton coulé en place.'
    },
    testimonial: {
      author: 'M. Amadou Sall',
      role: 'Maître d\'Ouvrage Délégué',
      company: 'SCI Dakar Résidences',
      quote: 'L\'ingénierie fine déployée par SERMA BTP a rendu possible ce projet urbain complexe. Les calculs et les plans d\'exécution étaient irréprochables.'
    },
    images: [
      { url: '/images/realisations/serma-structure-metallique-etages.jpg', caption: 'Ossature métallique multi-niveaux et structure porteuse acier grande hauteur — SERMA BTP', isHero: true },
      { url: '/images/realisations/serma-charpente-metallique-chantier.jpg', caption: 'Levage et montage de la charpente métallique en hauteur' },
      { url: '/images/realisations/serma-modelisation-structurelle-3d-eurocodes.jpg', caption: 'Analyse par éléments finis des déformations et contraintes structurales' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'  },

  {
    id: 'proj-23',
    slug: 'mur-soutenement-carriere-concassage',
    title: 'Mur de soutènement lourd en béton armé - Carrière de concassage',
    client: 'Exploitant Minier & Granulats Sénégal',
    location: 'Région de Thiès',
    region: 'Thiès',
    year: 2023,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-labo', 'sbs-industries', 'sbs-logistik'],
    summary: 'Construction d\'un mur de soutènement en béton armé grande hauteur pour stabiliser le front de taille et sécuriser l\'installation de la nouvelle carrière de concassage.',
    technicalData: {
      concreteVolume: '520 m³',
      surface: '850 m²',
      durationMonths: 4
    },
    story: {
      constraints: 'Poussée des terres très importante et vibrations continues générées par le concasseur primaire.',
      solution: 'Dimensionnement aux Eurocodes 2 et 7 avec redans et barbacanes d\'évacuation des eaux par le Bureau des Méthodes SBS Group.',
      results: 'Ouvrage livré sans réserve, stabilité parfaite vérifiée par les capteurs d\'auscultation de SB-S Labo.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page18-img01.jpeg', caption: 'Mur de soutènement en béton armé carrière de concassage (Extrait officiel PDF P.18)' },
      { url: '/images/sbs-presentation/sbs-page18-img02.jpeg', caption: 'Redans et barbacanes de stabilisation front de taille (Extrait officiel PDF P.18)' },
      { url: '/images/sbs-slides/sbs-slide-18.jpg', caption: 'Planche officielle Mur de soutènement concassage (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-24',
    slug: 'genie-civil-deuxieme-concasseur-circuit-broyage',
    title: 'Génie civil & massif de fondation pour deuxième concasseur industriel',
    client: 'Société Industrielle des Mines et Carrières',
    location: 'Sénégal',
    region: 'Thiès',
    year: 2023,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['serma-btp', 'sbs-labo'],
    summary: 'Réalisation d\'un deuxième concasseur pour l\'optimisation du circuit de broyage : massifs de fondation spéciaux anti-vibratiles et génie civil lourd.',
    technicalData: {
      concreteVolume: '380 m³',
      durationMonths: 3
    },
    story: {
      constraints: 'Exigences extrêmes d\'ancrage dynamique pour résister aux fréquences de résonance du broyeur.',
      solution: 'Massif en béton haute performance armé de cages d\'acier renforcées et réservations de précision au millimètre.',
      results: 'Gain de productivité de 45% sur le débit de concassage de granulats dès la mise en service.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page19-img01.jpeg', caption: 'Massif de fondation lourd pour concasseur industriel primaire (Extrait officiel PDF P.19)' },
      { url: '/images/sbs-presentation/sbs-page19-img04.jpeg', caption: 'Massif béton armé et voiles de génie civil du 2ème concasseur (Extrait officiel PDF P.19)' },
      { url: '/images/sbs-slides/sbs-slide-19.jpg', caption: 'Planche officielle Massif concasseur (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-25',
    slug: 'dallage-caniveau-fosse-septique-industrielle',
    title: 'Dallages béton armé/non armé, caniveaux d\'évacuation & fosse septique industrielle',
    client: 'Parc Industriel Agroalimentaire & Logistique',
    location: 'Zone Industrielle Diamniadio',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Infrastructures',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-industries', 'sbs-labo'],
    summary: 'Réalisation de 12 000 m² de dallages industriels, réseau de caniveaux béton haute capacité pour eaux pluviales et fosse septique industrielle.',
    technicalData: {
      surface: '12 000 m²',
      concreteVolume: '1 800 m³',
      durationMonths: 5
    },
    story: {
      constraints: 'Trafic intense d\'essieux lourds de 13 tonnes et évacuation rapide des fortes précipitations d\'hivernage.',
      solution: 'Dallage scié avec traitement de surface anti-usure au quartz et caniveaux préfabriqués par SB-S Industries.',
      results: 'Zéro fissuration après 12 mois d\'exploitation logistique cadencée.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page20-img01.jpeg', caption: 'Dallages industriels pour trafic d\'essieux 13T (Extrait officiel PDF P.20)' },
      { url: '/images/sbs-presentation/sbs-page20-img03.jpeg', caption: 'Caniveaux d\'assainissement lourds coulés en place (Extrait officiel PDF P.20)' },
      { url: '/images/sbs-slides/sbs-slide-20.jpg', caption: 'Planche officielle Dallage & Caniveaux VRD (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-26',
    slug: 'rehausse-hauteur-hangar-industriel-css-richard-toll',
    title: 'Réhausse de la hauteur du hangar industriel CSS - Richard Toll',
    client: 'Compagnie Sucrière Sénégalaise (CSS)',
    location: 'Richard Toll',
    region: 'Saint-Louis',
    year: 2023,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['serma-btp', 'sbs-logistik'],
    summary: 'Travaux supplémentaires de réhausse de la hauteur sous plafond du hangar de stockage industriel de la Compagnie Sucrière Sénégalaise pour accroître la capacité de stockage de sucre conditionné.',
    technicalData: {
      steelTonnage: '42 T',
      surface: '3 500 m²',
      durationMonths: 3
    },
    story: {
      constraints: 'Intervention en site agro-industriel en activité nécessitant un phasage strict sans interruption d\'exploitation.',
      solution: 'Réhausse métallique conçue par SERMA BTP et levage synchronisé par camions-grues SB-S Logistik.',
      results: 'Capacité de stockage augmentée de 30% livrée avant le démarrage de la campagne sucrière.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page29-img25.jpeg', caption: 'Structures métalliques et génie civil usine CSS Richard-Toll (Extrait officiel PDF P.29)', isHero: true },
      { url: '/images/sbs-presentation/sbs-page29-img26.jpeg', caption: 'Charpente et élévation industrielle CSS Richard-Toll (Extrait officiel PDF P.29)' },
      { url: '/images/sbs-slides/sbs-slide-29.jpg', caption: 'Planche officielle Chaudière CSS Richard-Toll (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-27',
    slug: 'batiment-sous-traitants-port-autonome-dakar',
    title: 'Bâtiment d\'accueil des sous-traitants au Port Autonome de Dakar (PAD)',
    client: 'Port Autonome de Dakar (PAD)',
    location: 'Zone Portuaire Nord, Dakar',
    region: 'Dakar',
    year: 2024,
    status: 'Achevé',
    sector: 'Bâtiment',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['serma-btp', 'sbs-labo', 'p2m'],
    summary: 'Construction d\'un bâtiment technique et administratif dédié aux entreprises sous-traitantes maritimes et logistiques au cœur du Port Autonome de Dakar.',
    technicalData: {
      surface: '1 450 m²',
      durationMonths: 6
    },
    story: {
      constraints: 'Environnement salin très agressif et accès réglementés 24/7 au domaine portuaire.',
      solution: 'Structure mixte béton armé hydrofuge et finitions carrelage grand format P2M classe R10.',
      results: 'Bâtiment certifié conforme et remis aux autorités portuaires dans les délais convenus.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page26-img01.jpeg', caption: 'Bâtiment administratif sous-traitants au Port de Dakar (Extrait officiel PDF P.26)' },
      { url: '/images/sbs-presentation/sbs-page26-img02.jpeg', caption: 'Bureaux d\'exploitation et locaux modulaires portuaires (Extrait officiel PDF P.26)' },
      { url: '/images/sbs-slides/sbs-slide-26.jpg', caption: 'Planche officielle Bâtiment PAD (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-28',
    slug: 'extension-ligne-production-lafargeholcim-ci',
    title: 'Extension de la ligne de production cimentière - LafargeHolcim CI',
    client: 'LafargeHolcim Côte d\'Ivoire',
    location: 'Zone Industrielle, Abidjan',
    region: 'Autre',
    year: 2023,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['serma-btp', 'sbs-labo'],
    summary: 'Travaux de génie civil spécialisé et structures métalliques pour l\'extension de la ligne de broyage et conditionnement de l\'usine cimentière LafargeHolcim Côte d\'Ivoire.',
    technicalData: {
      concreteVolume: '750 m³',
      steelTonnage: '110 T',
      durationMonths: 6
    },
    story: {
      constraints: 'Respect des standards internationaux de sécurité HSE LafargeHolcim et coordination multinationale.',
      solution: 'Déploiement d\'équipes hautement qualifiées du Bureau des Méthodes SBS Group et suivi qualité régulier.',
      results: 'Extension réceptionnée avec zéro accident avec arrêt (0 LTI) et satisfaction totale du client.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page36-img01.jpeg', caption: 'Hangar de stockage clinker 7 890 m² LafargeHolcim CI Abidjan (Extrait officiel PDF P.36)' },
      { url: '/images/sbs-presentation/sbs-page36-img02.jpeg', caption: 'Murs de soutènement clinker et charpente acier portée 45m (Extrait officiel PDF P.36)' },
      { url: '/images/sbs-slides/sbs-slide-36.jpg', caption: 'Planche officielle Hangar LafargeHolcim CI (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: true,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-29',
    slug: 'gradin-restaurant-infrastructure-kaffrine',
    title: 'Gradin omnisport & restaurant municipal d\'infrastructure - Kaffrine',
    client: 'Collectivité Territoriale & Ministère des Sports',
    location: 'Kaffrine',
    region: 'Kaolack',
    year: 2023,
    status: 'Achevé',
    sector: 'Infrastructures',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-industries', 'p2m'],
    summary: 'Construction d\'un gradin pour complexe sportif de 1 200 places et d\'un bâtiment restaurant d\'accueil panoramique pour la jeunesse et les compétitions régionales à Kaffrine.',
    technicalData: {
      concreteVolume: '420 m³',
      surface: '950 m²',
      durationMonths: 5
    },
    story: {
      constraints: 'Zone climatique chaude à fortes amplitudes thermiques et sols latéritiques compressibles.',
      solution: 'Gradins en éléments béton armé préfabriqués et toiture métallique ventilée avec pare-soleil intégrés.',
      results: 'Inauguration festive réussie et pôle d\'attraction durable pour toute la région de Kaffrine.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page24-img01.jpeg', caption: 'Gradin omnisports et restaurant municipal à Kaffrine (Extrait officiel PDF P.24)', isHero: true },
      { url: '/images/sbs-presentation/sbs-page24-img02.jpeg', caption: 'Structure béton armé des gradins et locaux sous tribune à Kaffrine (Extrait officiel PDF P.24)' },
      { url: '/images/sbs-presentation/sbs-page40-img02.jpeg', caption: 'Bâtiment d\'accueil et complexe de la jeunesse à Kaffrine (Extrait officiel PDF P.40)' },
      { url: '/images/sbs-slides/sbs-slide-24.jpg', caption: 'Planche officielle Gradin & Restaurant Kaffrine (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  },
  {
    id: 'proj-30',
    slug: 'puisard-collecte-eaux-usees-minier-mako',
    title: 'Puisard de collecte, décantation & traitement des eaux usées - Mako / Kédougou',
    client: 'Société d\'Exploitation Minière de Mako',
    location: 'Mako, Région de Kédougou',
    region: 'Autre',
    year: 2024,
    status: 'Achevé',
    sector: 'Industrie',
    primaryEntityId: 'sbs-group',
    partnerEntityIds: ['sbs-labo', 'sbs-industries'],
    summary: 'Réalisation d\'un puisard industriel profond de rétention et décantation des eaux usées pour la préservation environnementale en zone minière à Mako.',
    technicalData: {
      concreteVolume: '290 m³',
      depthMax: '9 m',
      durationMonths: 3
    },
    story: {
      constraints: 'Normes environnementales très sévères et nappe phréatique affleurante nécessitant un bétonnage sous étanchéité absolue.',
      solution: 'Béton hydrofuge enrichi en silice avec adjuvants de cristallisation validés en laboratoire par SB-S Labo.',
      results: 'Zéro fuite détectée lors des tests hydrauliques en charge, conformité environnementale certifiée.'
    },
    images: [
      { url: '/images/sbs-presentation/sbs-page23-img01.jpeg', caption: 'Puisard de rétention minière 9m de profondeur à Mako Kédougou (Extrait officiel PDF P.23)' },
      { url: '/images/sbs-presentation/sbs-page23-img02.jpeg', caption: 'Radier lourd béton hydrofuge étanche en zone minière (Extrait officiel PDF P.23)' },
      { url: '/images/sbs-slides/sbs-slide-23.jpg', caption: 'Planche officielle Puisard Industriel Mako (Document Maître)' }
    ],
    isPublished: true,
    isFeatured: false,
    publicationApproval: 'confirmed'
  }

];

export const PRODUCTS_P2M: Product[] = [
  {
    id: 'prod-01',
    ref: 'P2M-POR-6060',
    name: 'Carrelage porcelaine 60×60 cm — beige sable',
    category: 'Carrelage sol intérieur',
    subCategory: 'Porcelaine pleine masse',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '60 × 60 cm',
    material: 'Porcelaine pleine masse',
    finish: 'Mat soft',
    color: 'Beige sable',
    usage: 'Salons, séjours, halls, bureaux, commerces',
    unit: 'm²',
    packaging: 'Carton standard · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 6000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-068.jpg',
      '/images/reelles/p2m-066.jpg',
      '/images/reelles/p2m-011.jpg'
    ],
    specs: {
      'Prix': '6 000 F/m²',
      'Format': '60 × 60 cm',
      'Trafic': 'Tous usages résidentiels et commerciaux'
    }
  },
  {
    id: 'prod-02',
    ref: 'P2M-POR-4040',
    name: 'Carrelage porcelaine 40×40 cm — gris',
    category: 'Carrelage sol intérieur',
    subCategory: 'Porcelaine pleine masse',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '40 × 40 cm',
    material: 'Porcelaine pleine masse',
    finish: 'Mat adouci',
    color: 'Gris',
    usage: 'Sols intérieurs, terrasses couvertes, patios, circulations',
    unit: 'm²',
    packaging: 'Carton standard · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 4500,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-069.jpg',
      '/images/reelles/p2m-071.jpg',
      '/images/reelles/p2m-014.jpg'
    ],
    specs: {
      'Prix': '4 500 – 5 500 F/m²',
      'Format': '40 × 40 cm'
    }
  },
  {
    id: 'prod-03',
    ref: 'P2M-POR-3030',
    name: 'Carrelage porcelaine 30×30 cm — blanc antidérapant',
    category: 'Carrelage sol intérieur',
    subCategory: 'Porcelaine pleine masse',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '30 × 30 cm',
    material: 'Porcelaine pleine masse',
    finish: 'Mat antidérapant R10',
    color: 'Blanc / gris clair',
    usage: 'Salles d\'eau, cuisines, buanderies, terrasses',
    unit: 'm²',
    packaging: 'Carton standard · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 3000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-078.jpg',
      '/images/reelles/p2m-073.jpg',
      '/images/reelles/p2m-010.jpg'
    ],
    specs: {
      'Prix': '3 000 – 3 500 F/m²',
      'Antidérapant': 'R10'
    }
  },
  {
    id: 'prod-04',
    ref: 'P2M-CALACATTA-6060',
    name: 'Carrelage « CALACATTA GLOSSY » 60×60 cm',
    category: 'Carrelage sol & mur prestige',
    subCategory: 'Céramique vitrifiée polie',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '60 × 60 cm',
    material: 'Céramique vitrifiée glossy',
    finish: 'Glossy (poli brillant)',
    color: 'Blanc marbre veiné gris',
    usage: 'Sols de prestige, salons, hôtellerie, boutiques',
    unit: 'm²',
    packaging: 'Carton standard · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 6000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-022.jpg',
      '/images/reelles/p2m-075.jpg',
      '/images/reelles/p2m-021.jpg'
    ],
    specs: {
      'Modèle': 'CALACATTA GLOSSY 60×60',
      'Prix': '6 000 F/m²',
      'Finition': 'Glossy'
    }
  },
  {
    id: 'prod-05',
    ref: 'P2M-CER-6012',
    name: 'Céramique vitrifiée grand format 60×120 cm — Sathvario Goldy / Alaska Grey / Dyna Blue',
    category: 'Carrelage sol & mur prestige',
    subCategory: 'Céramique vitrifiée polie',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '60 × 120 cm',
    material: 'Céramique vitrifiée glossy',
    finish: 'Glossy (poli brillant miroir)',
    color: 'Blanc/or (Sathvario), gris (Alaska), bleu (Dyna)',
    usage: 'Sols et murs de prestige, salons, halls, réceptions',
    unit: 'm²',
    packaging: 'Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 8000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-005.jpg',
      '/images/reelles/p2m-008.jpg',
      '/images/reelles/p2m-003.jpg',
      '/images/reelles/p2m-086.jpg'
    ],
    specs: {
      'SATHVARIO GOLDY Golden Series': '8 500 F/m²',
      'ALASKA GREY GLOSSY': '8 000 F/m²',
      'DYNA BLUE GLOSSY': '8 000 F/m²'
    }
  },
  {
    id: 'prod-06',
    ref: 'P2M-LAV-PAR',
    name: 'Lavabo sur colonne céramique Partas — blanc',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Vasques & lavabos',
    brand: 'Partas — distribué par P2M',
    dimensions: 'Cuve 55 cm · Colonne intégrée',
    material: 'Céramique vitrifiée blanche',
    finish: 'Émail brillant',
    color: 'Blanc',
    usage: 'Salles de bains résidentielles, sanitaires d\'accueil',
    unit: 'ensemble',
    packaging: 'Cuve + colonne en carton renforcé',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 38000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-060.jpg',
      '/images/reelles/p2m-063.jpg'
    ],
    specs: {
      'Type': 'Lavabo sur colonne (pile)',
      'Réservation': 'Trous mitigeur + trou bonde'
    }
  },
  {
    id: 'prod-07',
    ref: 'P2M-ESTA-2011',
    name: 'WC suspendu p-trap « ESTA 2011 » — 525×360×370mm',
    category: 'Sanitaires & robinetterie',
    subCategory: 'WC suspendus',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '525 × 360 × 370 mm',
    material: 'Céramique vitrifiée émaillée',
    finish: 'Blanc brillant anti-calcaire',
    color: 'Blanc pur',
    usage: 'Résidentiel, bureaux, hôtellerie',
    unit: 'pièce',
    packaging: 'Carton avec protections',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 55000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-133.jpg',
      '/images/reelles/p2m-128.jpg',
      '/images/reelles/p2m-047.jpg'
    ],
    specs: {
      'Modèle': 'ESTA 2011 (P-Trap Wall Hung)',
      'Dimensions': '525 × 360 × 370 mm',
      'Fixation': 'Bâti-support compatible'
    }
  },
  {
    id: 'prod-08',
    ref: 'P2M-ROB-EVI',
    name: 'Robinet évier chromé — mitigeur mural',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Robinetterie',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Mural, saillie standard',
    material: 'Laiton chromé',
    finish: 'Chrome poli miroir',
    color: 'Chrome',
    usage: 'Éviers de cuisine, lavabos, buanderies',
    unit: 'pièce',
    packaging: 'Boîte individuelle',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 12000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-052.jpg',
      '/images/reelles/p2m-057.jpg',
      '/images/reelles/p2m-039.jpg'
    ],
    specs: {
      'Type': 'Mitigeur mural évier',
      'Raccord': 'Mâle 1/2"'
    }
  },
  {
    id: 'prod-09',
    ref: 'P2M-ROB-DOU',
    name: 'Robinetterie murale douche & bain — mitigeur encastré chromé',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Robinetterie',
    brand: 'Bathroom Accessories — distribué par P2M',
    dimensions: 'Encastré mural, entraxe standard 15 cm',
    material: 'Laiton chromé',
    finish: 'Chrome poli',
    color: 'Chrome',
    usage: 'Douches et baignoires résidentielles, hôtellerie',
    unit: 'pièce',
    packaging: 'Boîte individuelle',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 15000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-135.jpg',
      '/images/reelles/p2m-057.jpg'
    ],
    specs: {
      'Type': 'Mitigeur mural encastré',
      'Cartouche': 'Céramique longue durée',
      'Pression': '1 à 5 bars'
    }
  },
  {
    id: 'prod-10',
    ref: 'P2M-WC-TURQ',
    name: 'WC à la turque (chaise turque) — céramique blanc',
    category: 'Sanitaires & robinetterie',
    subCategory: 'WC au sol',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Standard au sol, cuvette turque',
    material: 'Céramique vitrifiée blanche',
    finish: 'Émail blanc lisse',
    color: 'Blanc',
    usage: 'Sanitaires publics, mosquées, écoles, salles d\'eau — usage intensif',
    unit: 'pièce',
    packaging: 'Carton avec protections',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 25000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-062.jpg'
    ],
    specs: {
      'Type': 'WC à la turque (cuvette au sol sans siège)',
      'Évacuation': 'Buse arrière',
      'Entretien': 'Surface sans rebords, facile à nettoyer'
    }
  },
  {
    id: 'prod-11',
    ref: 'P2M-MOS-PIE',
    name: 'Mosaïque & décor mural effet pierre naturelle',
    category: 'Revêtement mural & décor',
    subCategory: 'Mosaïque / parement',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Format mosaïque (10 × 10 cm par élément)',
    material: 'Pierre naturelle & grès cérame',
    finish: 'Structuré naturel',
    color: 'Gris pierre, ardoise, beige',
    usage: 'Crédences, murs d\'accent, façades intérieures, douches',
    unit: 'm²',
    packaging: 'Plaque de mosaïque · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 8500,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-081.jpg',
      '/images/reelles/p2m-085.jpg'
    ],
    specs: {
      'Type': 'Mosaïque / parement décoratif',
      'Pose': 'Colle souple recommandée'
    }
  },
  {
    id: 'prod-13',
    ref: 'P2M-WC-SOL',
    name: 'Pack WC au sol céramique blanc complet',
    category: 'Sanitaires & robinetterie',
    subCategory: 'WC au sol',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Standard au sol',
    material: 'Céramique vitrifiée',
    finish: 'Blanc brillant',
    color: 'Blanc',
    usage: 'Résidentiel, bureaux, écoles, sanitaires publics',
    unit: 'ensemble',
    packaging: 'Carton avec protections · Réservoir + abattant inclus',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 35000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-054.jpg',
      '/images/reelles/p2m-047.jpg',
      '/images/reelles/p2m-048.jpg'
    ],
    specs: {
      'Type': 'WC complet au sol',
      'Évacuation': 'Horizontale ou verticale'
    }
  },
  {
    id: 'prod-14',
    ref: 'P2M-CAL-GOLD',
    name: 'Dalle effet marbre blanc veiné or — Calacatta Gold',
    category: 'Carrelage sol & mur prestige',
    subCategory: 'Effet marbre',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '60 × 120 cm / 60 × 60 cm selon pose',
    material: 'Grès cérame effet marbre',
    finish: 'Poli brillant, veinage doré',
    color: 'Blanc marbre & veinures or',
    usage: 'Salons de prestige, hôtellerie, boutiques, halls d\'entrée, salles de réception',
    unit: 'm²',
    packaging: 'Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 8000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-076.jpg',
      '/images/reelles/p2m-080.jpg',
      '/images/reelles/p2m-024.jpg'
    ],
    specs: {
      'Effet': 'Marbre Calacatta Gold — veinures or',
      'Prix': '8 000 F/m²',
      'Finition': 'Poli brillant'
    }
  },
  {
    id: 'prod-15',
    ref: 'P2M-SFST-1',
    name: 'Receveur de douche « SFST-1 » — 900×900×110mm',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Receveurs de douche',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '900 × 900 × 110 mm',
    material: 'Acrylique renforcé / ABS',
    finish: 'Blanc satiné antidérapant',
    color: 'Blanc',
    usage: 'Salles de bains, douches à l\'italienne, hôtellerie',
    unit: 'pièce',
    packaging: 'Carton renforcé protégé',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 85000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-134.jpg'
    ],
    specs: {
      'Modèle': 'SFST-1 Shower Tray',
      'Dimensions': '900 × 900 × 110 mm',
      'Bonde': 'Ø 90 mm incluse'
    }
  },
  {
    id: 'prod-17',
    ref: 'P2M-CHA-ANG',
    name: 'Chaise anglaise (WC) one piece — céramique blanc',
    category: 'Sanitaires & robinetterie',
    subCategory: 'WC au sol',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Standard au sol, monobloc',
    material: 'Céramique vitrifiée blanche',
    finish: 'Émail blanc brillant',
    color: 'Blanc',
    usage: 'Résidentiel et tertiaire — WC complet monobloc',
    unit: 'pièce',
    packaging: 'Carton avec protections',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 45000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-054.jpg',
      '/images/reelles/p2m-047.jpg'
    ],
    specs: {
      'Gamme': 'One Piece / Aqua / Camon / Inaya',
      'Variantes': 'Au sol ou suspendue (chaise anglaise suspendue)',
      'Évacuation': 'Horizontale'
    }
  },
  {
    id: 'prod-18',
    ref: 'P2M-LAV-ROSEN',
    name: 'Lavabo sur pied « ROSEN 3001 » — 455×455×860mm',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Vasques & lavabos',
    brand: 'HOLO — distribué par P2M',
    dimensions: '455 × 455 × 860 mm',
    material: 'Céramique sanitaire émaillée',
    finish: 'Blanc brillant',
    color: 'Blanc',
    usage: 'Salles de bains, WC invités, sanitaires collectifs',
    unit: 'ensemble',
    packaging: 'Cuve + pied en carton renforcé',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 65000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-061.jpg',
      '/images/reelles/p2m-049.jpg'
    ],
    specs: {
      'Modèle': 'ROSEN 3001 (Wash Basin sur pied)',
      'Dimensions': '455 × 455 × 860 mm',
      'Marque': 'HOLO'
    }
  },
  {
    id: 'prod-19',
    ref: 'P2M-LAV-EXELON',
    name: 'Vasque « EXELON 7019 » — 525×365×130mm',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Vasques & lavabos',
    brand: 'HOLO — distribué par P2M',
    dimensions: '525 × 365 × 130 mm (21 × 14 inch)',
    material: 'Céramique sanitaire émaillée',
    finish: 'Blanc brillant',
    color: 'Blanc pur',
    usage: 'Meubles vasques, salles de bains modernes',
    unit: 'pièce',
    packaging: 'Carton individuel protection mousse',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 52000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-053.jpg',
      '/images/reelles/p2m-130.jpg',
      '/images/reelles/p2m-041.jpg'
    ],
    specs: {
      'Modèle': 'EXELON 7019 (Wash Basin) / Dover 7029',
      'Dimensions': '525 × 365 × 130 mm',
      'Marque': 'HOLO'
    }
  },
  {
    id: 'prod-20',
    ref: 'P2M-BAI-SFS4',
    name: 'Baignoire acrylique « SFS-4 DELUX » avec embase PVC',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Baignoires',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Baignoire standard 1700 mm',
    material: 'Acrylique renforcé + embase PVC',
    finish: 'Acrylique blanc brillant',
    color: 'Blanc',
    usage: 'Salles de bains résidentielles et hôtelières',
    unit: 'ensemble',
    packaging: 'Embase PVC étanche + bonde pop-up avec siphon',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 195000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-129.jpg'
    ],
    specs: {
      'Modèle': 'SFS-4 DELUX (Acrylic Bathtub)',
      'Embase': 'Water Proof PVC Ply Box',
      'Équipement': 'Pop Up Valve With Pipe'
    }
  },
  {
    id: 'prod-21',
    ref: 'P2M-COL-DOU',
    name: 'Colonne de douche avec mitigeur / hydromassante — hand shower',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Colonnes de douche',
    brand: 'Bathroom Accessories — distribué par P2M',
    dimensions: 'Colonne murale standard',
    material: 'Laiton chromé + ABS',
    finish: 'Chrome poli',
    color: 'Chrome',
    usage: 'Douches résidentielles et hôtelières — 3 variantes',
    unit: 'pièce',
    packaging: 'Boîte individuelle',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 45000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-135.jpg',
      '/images/reelles/p2m-046.jpg',
      '/images/reelles/p2m-059.jpg'
    ],
    specs: {
      'Variantes': 'Hand shower / avec mitigeur / hydromassante',
      'Type': 'Colonne de douche murale'
    }
  },
  {
    id: 'prod-22',
    ref: 'P2M-EVIER',
    name: 'Évier de cuisine inox — simple / double bac',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Éviers de cuisine',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Simple bac / double bac',
    material: 'Inox alimentaire',
    finish: 'Satiné brossé',
    color: 'Inox',
    usage: 'Cuisines résidentielles et professionnelles',
    unit: 'pièce',
    packaging: 'Carton renforcé',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 48000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-043.jpg',
      '/images/reelles/p2m-045.jpg',
      '/images/reelles/p2m-051.jpg'
    ],
    specs: {
      'Types': 'Simple bac (réf. p2m-062) / double bac sur commande',
      'Robinetterie': 'Mitigeur ou mélangeur assorti',
      'Accessoires': 'Siphon, vidage inclus'
    }
  },
  {
    id: 'prod-23',
    ref: 'P2M-ROB-AS105',
    name: 'Mitigeur mural « AS-105(A) » — douche & bain chromé',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Robinetterie',
    brand: 'Bathroom Accessories — distribué par P2M',
    dimensions: 'Encastré mural',
    material: 'Laiton chromé',
    finish: 'Chrome poli',
    color: 'Chrome',
    usage: 'Douches et baignoires résidentielles, hôtellerie',
    unit: 'pièce',
    packaging: 'Boîte individuelle',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 15000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-135.jpg',
      '/images/reelles/p2m-057.jpg'
    ],
    specs: {
      'Gamme': 'CO-105(A), RO-106, AS-107, AS-106, EV-107, EV-106, RO-107',
      'Type': 'Mitigeur mural encastré'
    }
  },
  {
    id: 'prod-24',
    ref: 'P2M-ROB-S1003',
    name: 'Robinet d\'arrêt « S-1003 ANGLE COCK » — chromé',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Robinetterie',
    brand: 'Bathroom Accessories — distribué par P2M',
    dimensions: 'Angle cock mural',
    material: 'Laiton chromé',
    finish: 'Chrome poli',
    color: 'Chrome',
    usage: 'Alimentation eau WC, lavabos, éviers',
    unit: 'pièce',
    packaging: 'Boîte individuelle',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 8000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-055.jpg',
      '/images/reelles/p2m-135.jpg'
    ],
    specs: {
      'Modèle': 'S-1003 Angle Cock / ROYAL HS-1002',
      'Type': 'Robinet d\'arrêt / Flexible',
      'Raccord': 'Mâle 1/2"'
    }
  },
  {
    id: 'prod-25',
    ref: 'P2M-ROB-HKI',
    name: 'Robinet évier « HKI » — mitigeur mural chromé',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Robinetterie',
    brand: 'HKI — distribué par P2M',
    dimensions: 'Mural, saillie standard',
    material: 'Laiton chromé',
    finish: 'Chrome poli miroir',
    color: 'Chrome',
    usage: 'Éviers de cuisine, lavabos, buanderies',
    unit: 'pièce',
    packaging: 'Boîte individuelle',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 12000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-057.jpg',
      '/images/reelles/p2m-052.jpg'
    ],
    specs: {
      'Marque': 'HKI (PILLAR COCK / BIB COCK / WALL MIXURE)',
      'Raccord': 'Mâle 1/2"'
    }
  },
  {
    id: 'prod-26',
    ref: 'P2M-ACC-SET',
    name: 'Set accessoires salle de bain chromés — porte-serviettes, porte-savon, miroir',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Accessoires sanitaires',
    brand: 'Bathroom Accessories — distribué par P2M',
    dimensions: 'Standard mural',
    material: 'Laiton chromé / inox',
    finish: 'Chrome poli',
    color: 'Chrome',
    usage: 'Salles de bains, WC, cuisines — gamme complète assortie',
    unit: 'set',
    packaging: 'Boîte individuelle par élément',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 13500,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-132.jpg',
      '/images/reelles/p2m-127.jpg',
      '/images/reelles/p2m-050.jpg',
      '/images/reelles/p2m-056.jpg'
    ],
    specs: {
      'Gamme': 'Porte-serviette, porte-savon, porte-brosse, porte-mouchoir, accroche-robe, mini-étagère (réf. p2m-132)',
      'Finition': 'Chrome poli assorti robinetterie'
    }
  },
  {
    id: 'prod-27',
    ref: 'P2M-FAI-3D',
    name: 'Faïence murale 3D Wall Design Glossy 20×30 — 3 500 F/m²',
    category: 'Revêtement mural & décor',
    subCategory: 'Faïence murale',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '20 × 30 cm',
    material: 'Faïence émaillée 3D',
    finish: 'Glossy — relief goutte d\'eau',
    color: 'Blanc pur',
    usage: 'Murs de salles de bains, crédences, murs d\'accent',
    unit: 'm²',
    packaging: 'Carton standard · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 3500,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-026.jpg',
      '/images/reelles/p2m-036.jpg'
    ],
    specs: {
      'Modèle': '3D WALL DESIGN GLOSSY 20×30',
      'Prix': '3 500 F/m²',
      'Effet': 'Relief 3D motif gouttes'
    }
  },
  {
    id: 'prod-28',
    ref: 'P2M-MOS-PISC',
    name: 'Mosaïque pâte de verre — décor piscine & crédence',
    category: 'Revêtement mural & décor',
    subCategory: 'Mosaïque / parement',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Mosaïque 30 × 30 cm (éléments 1×1 à 5×5 cm)',
    material: 'Pâte de verre',
    finish: 'Brillant, bordure décor assortie',
    color: 'Bleu / gris / noir & blanc',
    usage: 'Piscines, douches, crédences, décors muraux',
    unit: 'plaque',
    packaging: 'Plaque de mosaïque sur filet',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 8500,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-083.jpg',
      '/images/reelles/p2m-084.jpg'
    ],
    specs: {
      'Type': 'Mosaïque pâte de verre',
      'Bordure': 'Listel noir & blanc assorti',
      'Pose': 'Colle souple + joint hydrofuge'
    }
  },
  {
    id: 'prod-29',
    ref: 'P2M-BOIS-6060',
    name: 'Carrelage imitation bois 60×60 — chaleur & nature',
    category: 'Carrelage sol intérieur',
    subCategory: 'Imitation bois',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '60 × 60 cm',
    material: 'Grès cérame effet bois',
    finish: 'Structuré mat',
    color: 'Noisette / chêne naturel',
    usage: 'Salons, chambres, terrasses couvertes',
    unit: 'm²',
    packaging: 'Carton standard · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 6500,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-070.jpg',
      '/images/reelles/p2m-002.jpg'
    ],
    specs: {
      'Type': 'Imitation bois — chaleur et nature',
      'Format': '60 × 60 cm',
      'Prix': '6 500 F/m²'
    }
  },
  {
    id: 'prod-30',
    ref: 'P2M-8024',
    name: 'Dalle grand format 80×240 cm — plaque prestige',
    category: 'Carrelage sol & mur prestige',
    subCategory: 'Grand format',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '80 × 240 cm',
    material: 'Grès cérame pleine masse',
    finish: 'Poli brillant / mat selon série',
    color: 'Blanc, marbre, pierre',
    usage: 'Halls, réceptions, plans de travail, îlots de cuisine',
    unit: 'plaque',
    packaging: 'Plaque sur palette renforcée',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 30000,
    isPriceVisible: true,
    availability: 'Sur commande',
    leadTime: 'Disponible sur commande au showroom Mbao',
    images: [
      '/images/reelles/p2m-090.jpg',
      '/images/reelles/p2m-092.jpg',
      '/images/reelles/p2m-088.jpg'
    ],
    specs: {
      'Format': '80 × 240 cm',
      'Prix': '30 000 F / plaque',
      'Pose': 'Grand format — colles et ventouses professionnelles'
    }
  },
  {
    id: 'prod-31',
    ref: 'P2M-3030',
    name: 'Carrelage 30×30 cm — sol & mur économique',
    category: 'Carrelage sol intérieur',
    subCategory: 'Céramique vitrifiée',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: '30 × 30 cm',
    material: 'Céramique vitrifiée',
    finish: 'Matt et poli',
    color: 'Beige, gris, marron, blanc',
    usage: 'Cuisines, salles de bain, salons, extérieurs — tous usages',
    unit: 'm²',
    packaging: 'Carton standard · Prix au m²',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 3000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-077.jpg',
      '/images/reelles/p2m-067.jpg',
      '/images/reelles/p2m-010.jpg'
    ],
    specs: {
      'Prix': '3 000 – 3 500 F/m²',
      'Finitions': 'Matt, poli et texturée',
      'Adapté': 'Cuisine, salle de bain, salon et extérieur'
    }
  },
  {
    id: 'prod-32',
    ref: 'P2M-BAIN-ACC',
    name: 'Outils & accessoires plomberie — Pex, siphons, clapets, visserie WC',
    category: 'Sanitaires & robinetterie',
    subCategory: 'Outils & accessoires',
    brand: 'P2M — Polytech Matériaux Matériels',
    dimensions: 'Divers (Pex, raccords, visserie)',
    material: 'Laiton / Pex / PVC',
    finish: 'Brut / chromé selon pièce',
    color: 'Assortis',
    usage: 'Installation et maintenance plomberie sanitaire',
    unit: 'pièce',
    packaging: 'Vrac ou boîte selon référence',
    origin: 'Import direct P2M',
    indicativePriceFCFA: 1500,
    isPriceVisible: false,
    availability: 'En stock',
    leadTime: 'Disponible au showroom Mbao',
    images: [
      '/images/reelles/p2m-055.jpg',
      '/images/reelles/p2m-135.jpg'
    ],
    specs: {
      'Références': 'Siphon, Métre Pex, Nourrice, Coude Pex, Robinet d\'arrêt, Manchon, TE Pex, Clapet, Bouchon, Téflon, Vice WC, Jeu de boulon lavabo, Regard visite (réf. p2m-131)',
      'Usage': 'Plomberie & sanitaire'
    }
  }];
export const LAB_TESTS: LabTest[] = [
  {
    id: 'test-01',
    code: 'LAB-GEO-01',
    name: 'Essai CBR immersion 4 jours & indice portant immédiat (IPI)',
    category: 'Sols & géotechnique',
    norm: 'NF P 94-078 / AASHTO T193',
    sampleRequired: '50 kg de sol remanié',
    standardDelayDays: 5,
    description: 'Détermination de la portance du sol compacté à l\'optimum Proctor pour dimensionnement des couches de chaussée.',
    isAvailable: true
  },
  {
    id: 'test-02',
    code: 'LAB-GEO-02',
    name: 'Essai Proctor modifié & Proctor normal',
    category: 'Sols & géotechnique',
    norm: 'NF P 94-093',
    sampleRequired: '30 kg de sol',
    standardDelayDays: 3,
    description: 'Mesure de la teneur en eau optimale et de la densité sèche maximale du matériau de remblai ou sous-couche.',
    isAvailable: true
  },
  {
    id: 'test-03',
    code: 'LAB-BET-01',
    name: 'Résistance à la compression sur éprouvettes béton (7j, 14j, 28j)',
    category: 'Bétons & granulats',
    norm: 'NF EN 12390-3',
    sampleRequired: 'Série de 3 ou 6 éprouvettes cylindriques 16×32 ou cubiques 15×15',
    standardDelayDays: 2,
    description: 'Écrasement sous presse hydraulique asservie 3000 kN pour validation de la classe de résistance (C25/30, C30/37, etc.).',
    isAvailable: true
  },
  {
    id: 'test-04',
    code: 'LAB-GEO-03',
    name: 'Limites d\'Atterberg (limite de liquidité WL & plasticité WP)',
    category: 'Sols & géotechnique',
    norm: 'NF P 94-051',
    sampleRequired: '5 kg de sol passant au tamis de 400 µm',
    standardDelayDays: 3,
    description: 'Évaluation de l\'argilosité et du potentiel de gonflement / retrait des sols fins pour fondations superficielles.',
    isAvailable: true
  },
  {
    id: 'test-05',
    code: 'LAB-SITU-01',
    name: 'Essai au pénétromètre dynamique lourd (PDL) in-situ',
    category: 'Contrôle in-situ',
    norm: 'NF P 94-115',
    sampleRequired: 'Accès chantier pour machine autonome',
    standardDelayDays: 2,
    description: 'Mesure continue de la résistance dynamique de pointe des terrains de fondation jusqu\'à 15m de profondeur.',
    isAvailable: true
  }];
export const EQUIPMENTS: Equipment[] = [
  
// Tarifs officiels issus des flyers SBS Logistik (contact : 77 858 61 05)
  {
    id: 'eq-02',
    code: 'ENG-CG-6T',
    name: 'Camion grue 6 tonnes',
    category: 'Levage',
    capacity: 'Levage 6T · livraison et pose de matériaux lourds',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-002.jpg',
    ratePerDayFCFA: 100000
  },
  {
    id: 'eq-09',
    code: 'ENG-GRUE-50T',
    name: 'Grue mobile 50 tonnes',
    category: 'Levage',
    capacity: 'Levage lourd 50T · Structures, charpentes et ouvrages d\'art',
    power: 'Diesel',
    availabilityStatus: 'Sur réservation',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-001.jpg',
    ratePerDayFCFA: 500000
  },
  {
    id: 'eq-03',
    code: 'ENG-TP-01',
    name: 'Tractopelle',
    category: 'Terrassement',
    capacity: 'Fouille & chargement · travaux de terrassement et VRD',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-006.jpg',
    ratePerDayFCFA: 120000
  },
  {
    id: 'eq-04',
    code: 'ENG-DMP-01',
    name: 'Dumper FCY30R',
    category: 'Terrassement',
    capacity: 'Transport de matériaux sur chantier · tout-terrain',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-009.jpg',
    ratePerDayFCFA: 60000
  },
  {
    id: 'eq-10',
    code: 'ENG-COMP-ROU',
    name: 'Compacteur à rouleaux Atlas Copco LP750',
    category: 'Compactage',
    capacity: 'Compactage des couches de forme et chaussées',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-021.jpg',
    ratePerDayFCFA: 70000
  },
  {
    id: 'eq-11',
    code: 'ENG-COMP-PLQ',
    name: 'Plaque vibrante thermique de compactage',
    category: 'Compactage',
    capacity: 'Compactage de surface · fosses, dallages, tranchées',
    power: 'Essence / Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-024.jpg',
    ratePerDayFCFA: 35000
  },
  {
    id: 'eq-12',
    code: 'ENG-NAC-01',
    name: 'Nacelle élévatrice (bleue ou jaune)',
    category: 'Levage',
    capacity: 'Travail en hauteur · flèche télescopique, personnel + outillage',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-008.jpg',
    ratePerDayFCFA: 120000
  },
  {
    id: 'eq-05',
    code: 'ENG-BEN-40T',
    name: 'Camion benne 40 tonnes',
    category: 'Transport & bennes',
    capacity: 'Charge utile 40T · transport de granulats et matériaux',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-003.jpg',
    ratePerDayFCFA: 80000
  },
  {
    id: 'eq-13',
    code: 'ENG-PLT-01',
    name: 'Camion plateau',
    category: 'Transport & bennes',
    capacity: 'Transport d\'engins, de matériaux et de matériel divers',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-presentation/sbs-page12-img01.jpeg',
    ratePerDayFCFA: 100000
  },
  {
    id: 'eq-14',
    code: 'ENG-TATA-6T',
    name: 'Camion TATA 6 tonnes',
    category: 'Transport & bennes',
    capacity: 'Livraisons et transports de chantier · charge 6T',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-005.jpg',
    ratePerDayFCFA: 60000
  },
  {
    id: 'eq-15',
    code: 'ENG-TOUPIE',
    name: 'Toupie à béton (camion malaxeur)',
    category: 'Bétonnage',
    capacity: 'Transport de béton frais sur chantier',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-010.jpg',
    ratePerDayFCFA: 100000
  },
  {
    id: 'eq-06',
    code: 'ENG-BET-1000',
    name: 'Bétonnière 1000 litres',
    category: 'Bétonnage',
    capacity: 'Cuve 1000 L · bétonnage sur chantier',
    power: 'Diesel / Électrique',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-018.jpg',
    ratePerDayFCFA: 60000
  },
  {
    id: 'eq-16',
    code: 'ENG-AUTO-BET',
    name: 'Auto bétonnière VENUS (mobile)',
    category: 'Bétonnage',
    capacity: 'Chargement, malaxage et versement autonomes · auto-chargeuse',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-015.jpg',
    ratePerDayFCFA: 180000
  },
  {
    id: 'eq-17',
    code: 'ENG-POMPE-BET',
    name: 'Pompe à béton fixe AQUARIUS 1407 D',
    category: 'Bétonnage',
    capacity: 'Débit 51 m³/h · livraison du béton jusqu\'à 600 m (horizontal) et 150 m (vertical)',
    power: 'Diesel',
    availabilityStatus: 'Sur réservation',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: true,
    imageUrl: '/images/sbs-logistik/logistik-equip-011.jpg',
    ratePerDayFCFA: 400000
  },
  {
    id: 'eq-07',
    code: 'ENG-GE-150KVA',
    name: 'Groupe électrogène 150 KVA',
    category: 'Énergie',
    capacity: 'Alimentation chantier 150 KVA insonorisé',
    power: 'Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-019.jpg',
    ratePerDayFCFA: 300000
  },
  {
    id: 'eq-18',
    code: 'ENG-GE-5KVA',
    name: 'Groupe électrogène 5 KVA Kipor KDE6700T',
    category: 'Énergie',
    capacity: 'Alimentation base-vie et petit chantier 5 KVA',
    power: 'Essence / Diesel',
    availabilityStatus: 'Disponible',
    location: 'Parc matériel SB-S Logistik',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-020.jpg',
    ratePerDayFCFA: 5000
  },
  {
    id: 'eq-19',
    code: 'ACC-ECHAF',
    name: 'Échafaudages (standard & multidirectionnel)',
    category: 'Accès & coffrage',
    capacity: 'Location par niveau/jour · Standards 2 000 F ou multidirectionnels 3 500 F',
    power: '—',
    availabilityStatus: 'Disponible',
    location: 'Magasin SB-S Logistik',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-041.jpg',
    ratePerDayFCFA: 2000
  },
  {
    id: 'eq-20',
    code: 'ACC-ETAIS',
    name: 'Étais en fer 4 m / étais galva 3,5 m',
    category: 'Accès & coffrage',
    capacity: 'Location (délai 21 jours) : 800 F | 1 000 F · Vente : 16 500 F | 14 500 F',
    power: '—',
    availabilityStatus: 'Disponible',
    location: 'Magasin SB-S Logistik',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-052.jpg',
    ratePerDayFCFA: 800
  },
  {
    id: 'eq-21',
    code: 'ACC-COFF-01',
    name: 'Panneaux de coffrage',
    category: 'Accès & coffrage',
    capacity: 'Dimensions : 20×120 | 30×120 | 40×120 | 50×120 | 60×120 · Location/unité : 500 F | 750 F | 1 000 F (délai 21 jours, marge 9 jours)',
    power: '—',
    availabilityStatus: 'Sur réservation',
    location: 'Magasin SB-S Logistik',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-044.jpg',
    ratePerDayFCFA: 500
  },
  {
    id: 'eq-08',
    code: 'IND-QT40-3A',
    name: 'Pondeuse automatique QT40-3A',
    category: 'Préfabrication',
    capacity: 'Production agglos, parpaings & pavés autobloquants',
    power: 'Électrique / Diesel',
    availabilityStatus: 'Disponible',
    location: 'Usine SB-S Industries (DIASS)',
    driverIncluded: false,
    imageUrl: '/images/sbs-logistik/logistik-equip-063.jpg',
    ratePerDayFCFA: 0
  }];
// Matériaux de vente et granulats — tarifs officiels SB-S Logistik (flyers)
export const LOGISTIK_MATERIALS: {
  id: string;
  name: string;
  detail: string;
  price: string;
  imageUrl: string;}[] = [
  {
    id: 'mat-sable',
    name: 'Sable',
    detail: 'Livraison 20 m³ · Prix variable selon la destination',
    price: '110 000 – 150 000 F / 20 m³',
    imageUrl: '/images/engins/sable.jpg'
  },
  {
    id: 'mat-gravier',
    name: 'Gravier basalte (40 T ou 27 m³)',
    detail: 'Diamètre 0,85 : 396 500 F · 0/3 : 423 500 F · 3/8 : 572 000 F · 8/16 : 680 000 F',
    price: 'À partir de 396 500 F',
    imageUrl: '/images/engins/graviers.jpg'
  },
  {
    id: 'mat-ciment',
    name: 'Ciment 32,5 R',
    detail: 'Vente au tonnage · Disponible en stock',
    price: '69 000 F / tonne',
    imageUrl: '/images/engins/ciment.jpg'
  },
  {
    id: 'mat-brouette',
    name: 'Brouette de chantier',
    detail: 'Vente au magasin SB-S Logistik',
    price: '75 000 F / pièce',
    imageUrl: '/images/engins/brouette.jpg'
  }];
// Gamme de béton prêt à l'emploi — Centrale à béton 60 m³/h SB-S Industries
export const CENTRALE_BETON_PRICES: { classe: string; prix: string }[] = [
  { classe: 'C15', prix: '62 000 – 65 000 F' },
  { classe: 'C20', prix: '65 000 – 68 000 F' },
  { classe: 'C25', prix: '71 000 – 73 000 F' },
  { classe: 'C30', prix: '75 000 – 77 000 F' }];
export const PUBLICATIONS: PublicationItem[] = [
  {
    id: 'pub-01',
    title: 'Comportement mécanique des sols latéritiques sénégalais stabilisés aux liants hydrauliques locaux',
    type: 'Article scientifique',
    authors: ['Magatte Niang', 'Dr. Cheikh Tidiane Diop'],
    date: '2024-03-12',
    journalOrEvent: 'Revue Ouest-Africaine de Géotechnique & Génie Civil',
    abstract: 'Étude expérimentale de la portance et de la durabilité à l\'immersion des graves latéritiques du plateau de Thiès après traitement au ciment Portland composé et à la chaux locale. Établissement d\'un abaque de dimensionnement économique pour chaussées lourdes en climat tropical.',
    keywords: ['Sols latéritiques', 'Stabilisation au ciment', 'Indice CBR', 'Infrastructures sahéliennes'],
    doi: '10.1016/j.wafrigeo.2024.03.012',
    validatedForAI: true
  },
  {
    id: 'pub-02',
    title: 'Optimisation des assemblages boulonnés sur charpentes métalliques sous sollicitations marines côtières à Dakar',
    type: 'Conférence',
    authors: ['Magatte Niang'],
    date: '2023-11-20',
    journalOrEvent: 'Congrès International des Structures et Ouvrages d\'Art d\'Afrique de l\'Ouest (CISOA)',
    abstract: 'Analyse du retour d\'expérience sur 15 ans d\'ouvrages métalliques implantés sur le littoral dakarois. Recommandations sur les revêtements duplex métallisation zinc-aluminium et l\'utilisation des nuances d\'aciers S355 et inox marin.',
    keywords: ['Charpente métallique', 'Corrosion marine', 'Eurocode 3', 'Dakar littoral'],
    validatedForAI: true
  },
  {
    id: 'pub-03',
    title: 'Manuel pratique de contrôle qualité sur chantier BTP en zone intertropicale',
    type: 'Cours / Enseignement',
    authors: ['Magatte Niang'],
    date: '2022-09-15',
    journalOrEvent: 'Support de cours magistral · Master Génie Civil',
    abstract: 'Guide méthodologique de réception des fonds de fouille, formulation et cure des bétons par forte chaleur, et traçabilité des éprouvettes en laboratoire agréé.',
    keywords: ['Contrôle qualité', 'Bétonnage par temps chaud', 'Plan d\'Assurance Qualité'],
    validatedForAI: true
  },

  // === NOUVEAUX COMMUNIQUÉS BTP SÉNÉGAL (ajoutés le 2026-09-22) ===
  {
    id: 'pub-04',
    title: 'SERMA BTP et le défi de la construction métallique au Sénégal : vers une souveraineté industrielle',
    type: 'Presse',
    authors: ['Magatte Niang', 'DL Economie & Technique'],
    date: '2024-08-15',
    journalOrEvent: 'Revue BTP Afrique — Édition Spéciale Sénégal',
    abstract: 'Interview exclusive sur la stratégie industrielle de SERMA BTP, leader dans la conception et fabrication de structures métalliques au Sénégal. Protection des ouvrages côtiers face à la corrosion saline, autonomie dans l\'usinage des charpentes et formation des jeunes ingénieurs aux Eurocodes.',
    keywords: ['SERMA BTP', 'Construction métallique', 'Sénégal', 'Eurocodes', 'Industrialisation'],
    validatedForAI: true
  },
  {
    id: 'pub-05',
    title: 'Agence Sénégal Emergente : les priorités BTP pour l\'infrastructure 2025-2030',
    type: 'Presse',
    authors: ['Magatte Niang'],
    date: '2025-01-10',
    journalOrEvent: 'Journal du Génie Civil AU / Dakar (édition spéciale investissements)',
    abstract: 'Contribution d\'expert sur les leviers structurels du Sénégal pour l\'atteinte de l\'objectif AGE "vision 2055" : consolidation des plateformes multimodales, digitalisation du maillage routier secondaire, développement des petits aménagements agricoles et modernisation de la formation technique professionnelle (FTP) en génie civil.',
    keywords: ['AGE', 'Vision 2055', 'Infrastructures', 'Planification BTP', 'Développement régional'],
    validatedForAI: true
  },
  {
    id: 'pub-06',
    title: 'Innovation dans le BTP sénégalais : SB-S Labo, laboratoire pionnier dans les essais géotechniques',
    type: 'Presse',
    authors: ['Magatte Niang', 'BW Presse Industrielle'],
    date: '2024-12-20',
    journalOrEvent: 'Echos de l\'Industrie — Hors-série Laboratoires agréés Sénégal',
    abstract: 'Présentation des capacités du laboratoire SB-S Labo (agrément C2 & A2) : contrôle qualité béton en temps réel, essais CBR, Proctor et cisaillement, et supervision géotechnique sur les grands projets autoroutiers et ferroviaires de la sous-région. Pôle d\'expertise au service de la qualité des infrastructures au Sénégal.',
    keywords: ['SB-S Labo', 'Géotechnique', 'Essais matériaux', 'Contrôle qualité', 'BTP'],
    validatedForAI: true
  },
  {
    id: 'pub-07',
    title: 'Décentralisation des chantiers : SB-S Industries et la révolution des matériaux préfabricés',
    type: 'Presse',
    authors: ['Magatte Niang', 'AI(ographie) Construction Pro'],
    date: '2025-02-05',
    journalOrEvent: 'Construction & Bâtiment au Sénégal — Édition tertiaire & industrie',
    abstract: 'Reportage sur l\'unité SB-S Industries de Diass : centrale à béton 60 m³/h, pondeuse QT40-3A, agglos et hourdis standardisés. Comment la préfabrication abaisse les coûts, réduit les délais de chantier et améliore la qualité du gros œuvre dans les projets résidentiels et publics du Sénégal.',
    keywords: ['SB-S Industries', 'Préfabrication', 'Béton', 'Industrie de la construction', 'Efficience chantier'],
    validatedForAI: true
  },
  {
    id: 'pub-08',
    title: 'Logistique BTP : SB-S Logistik, pilier de la chaîne d\'approvisionnement chantiers au Sénégal',
    type: 'Presse',
    authors: ['Magatte Niang', 'FG(édition) Transport & Logistique Afrique'],
    date: '2024-10-22',
    journalOrEvent: 'Magazine Logistique & Fret — Spécial Routes et Ports Sénégal',
    abstract: 'Focus sur SB-S Logistik, filiale dédiée à la gestion et maintenance du parc machines (82 engins), location d\'engins avec ou sans opérateur, le transport et l\'approvisionnement des chantiers. Rôle stratégique dans les opérations lourdes du Port Autonome de Dakar, des chantiers autoroutiers et des projets miniers.',
    keywords: ['SB-S Logistik', 'Logistique BTP', 'Parc machines', 'Transport chantiers', 'Port de Dakar'],
    validatedForAI: true
  }];
export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-01',
    leadNumber: 'LEAD-2026-0042',
    createdAt: '2026-09-14T10:30:00Z',
    fullName: 'Moustapha Diallo',
    company: 'Consortium Bâtir Sénégal SA',
    role: 'Directeur technique',
    phone: '+221 77 550 88 12',
    email: 'm.diallo@batirsenegal.sn',
    country: 'Sénégal',
    city: 'Dakar',
    sector: 'Immobilier Tertiaire & BTP',
    source: 'Assistant qualification',
    needCategory: 'Construction Métallique / Charpente',
    projectType: 'Bâtiment industriel grande portée',
    projectLocation: 'Zone Industrielle de Diamniadio',
    projectStage: 'Appel d\'offres',
    budgetRange: '100 M - 250 M FCFA',
    timeframe: '1–3 mois',
    assignedEntityId: 'serma-btp',
    assignedToUser: 'Ing. Magatte Niang',
    score: 85,
    scoreBreakdown: [
      { signal: 'Téléphone renseigné', points: 10 },
      { signal: 'Budget cadré renseigné', points: 10 },
      { signal: 'Échéance urgente (< 3 mois)', points: 20 },
      { signal: 'Demande de devis structurée', points: 20 },
      { signal: 'Projet à fort potentiel', points: 25 }
    ],
    stage: 'Étude du besoin',
    notes: [
      { id: 'n1', author: 'Magatte Niang', date: '2026-09-14T14:10:00Z', content: 'Dossier d\'appel d\'offres reçu. Le plan de masse indique une portée libre de 36m. Prévoir variantes avec toiture bac acier isolé.' }
    ],
    history: [
      { date: '2026-09-14T10:30:00Z', user: 'Système', action: 'Création du lead via Assistant de qualification', comment: 'Routage automatique vers SERMA BTP (Score: 85)' },
      { date: '2026-09-14T11:00:00Z', user: 'Magatte Niang', action: 'Prise en charge du dossier', comment: 'Passage au stade Étude du besoin' }
    ],
    filesCount: 3
  },
  {
    id: 'lead-02',
    leadNumber: 'LEAD-2026-0043',
    createdAt: '2026-09-15T08:15:00Z',
    fullName: 'Aïssatou Sow',
    company: 'Cabinet d\'Architecture Urbanis',
    role: 'Architecte associée',
    phone: '+221 78 412 00 99',
    email: 'a.sow@urbanis-dakar.com',
    country: 'Sénégal',
    city: 'Dakar',
    sector: 'Architecture & Maîtrise d\'œuvre',
    source: 'Devis catalogue',
    needCategory: 'Matériaux / Carrelage / Sanitaires',
    projectType: 'Immeuble Résidentiel R+7',
    projectLocation: 'Mermoz, Dakar',
    projectStage: 'Étude',
    budgetRange: '25 M - 50 M FCFA',
    timeframe: '3–6 mois',
    assignedEntityId: 'p2m',
    assignedToUser: 'Fatou Bintou Ndiaye',
    score: 65,
    scoreBreakdown: [
      { signal: 'Téléphone renseigné', points: 10 },
      { signal: 'Budget cadré renseigné', points: 10 },
      { signal: 'Demande de devis catalogue', points: 20 },
      { signal: 'Email professionnel validé', points: 25 }
    ],
    stage: 'Premier contact',
    items: [
      { title: 'Carrelage grès cérame 60x60 P2M-0412', quantity: '1 200 m²', entityId: 'p2m', price: 15000000 },
      { title: 'Cuvettes suspendues rimless P2M-SAN-301', quantity: '28 unités', entityId: 'p2m', price: 4060000 }
    ],
    notes: [],
    history: [
      { date: '2026-09-15T08:15:00Z', user: 'Système', action: 'Création du lead depuis le panier catalogue P2M', comment: 'Affecté à P2M Showroom' }
    ],
    filesCount: 1
  }];
export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quote-01',
    quoteNumber: 'DEV-2026-0184',
    leadId: 'lead-02',
    clientName: 'Aïssatou Sow',
    clientCompany: 'Cabinet d\'Architecture Urbanis',
    clientEmail: 'a.sow@urbanis-dakar.com',
    clientPhone: '+221 78 412 00 99',
    entityId: 'p2m',
    createdAt: '2026-09-15T09:00:00Z',
    validUntil: '2026-10-15T23:59:59Z',
    status: 'Envoyé',
    items: [
      {
        productId: 'prod-01',
        description: 'Carrelage grès cérame rectifié gris béton 60×60 cm (P2M-0412)',
        quantity: 1200,
        unit: 'm²',
        unitPriceFCFA: 12500,
        totalPriceFCFA: 15000000
      },
      {
        productId: 'prod-04',
        description: 'Pack cuvette suspendue rimless céramique avec bâti-support inox (P2M-SAN-301)',
        quantity: 28,
        unit: 'ensemble',
        unitPriceFCFA: 145000,
        totalPriceFCFA: 4060000
      }
    ],
    totalHT: 19060000,
    taxRate: 0.18,
    totalTTC: 22490800,
    notes: 'Tarif indicatif grossiste accordé pour volume supérieur à 1000m². Livraison sur palette cerclée au pied du chantier à Mermoz incluse.',
    auditTrail: [
      { date: '2026-09-15T09:00:00Z', action: 'Création et émission du devis', actor: 'Fatou Bintou Ndiaye' }
    ]
  }];
export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Plaquette institutionnelle écosystème Magatte Niang Expert',
    reference: 'PLA-CORP-2026',
    category: 'Plaquette',
    entityId: 'serma-btp',
    version: 'v2.1',
    isLatest: true,
    visibility: 'Public',
    requiresForm: false,
    isValidatedForAI: true,
    downloadCount: 412,
    fileSize: '4.8 Mo',
    fileType: 'PDF',
    url: '/docs/plaquette-groupe-magatte-niang-2026.pdf',
    publishedAt: '2026-01-10'
  },
  {
    id: 'doc-02',
    title: 'Catalogue général des essais géotechniques & bétons normés NF/ISO',
    reference: 'CAT-LABO-2026',
    category: 'Fiche technique',
    entityId: 'sbs-labo',
    version: 'v1.4',
    isLatest: true,
    visibility: 'Public',
    requiresForm: true,
    isValidatedForAI: true,
    downloadCount: 285,
    fileSize: '2.3 Mo',
    fileType: 'PDF',
    url: '/docs/catalogue-essais-sbs-labo.pdf',
    publishedAt: '2026-02-15'
  },
  {
    id: 'doc-03',
    title: 'Fiche technique prédalles et éléments préfabriqués industriels',
    reference: 'FT-IND-PREDALLE-2026',
    category: 'Fiche technique',
    entityId: 'sbs-industries',
    version: 'v1.2',
    isLatest: true,
    visibility: 'Public',
    requiresForm: true,
    isValidatedForAI: true,
    downloadCount: 154,
    fileSize: '1.9 Mo',
    fileType: 'PDF',
    url: '/docs/ft-predalles-sbs-industries.pdf',
    publishedAt: '2026-03-01'
  }];
export const INITIAL_ROUTING_RULES: RoutingRule[] = [
  { id: 'rule-1', priority: 1, conditionDescription: 'Si besoin = Géotechnique, Essais de sols ou Contrôle Béton', categoryMatch: 'Geotechnique', targetEntityId: 'sbs-labo', isActive: true },
  { id: 'rule-2', priority: 2, conditionDescription: 'Si besoin = Matériaux de finition, Carrelage, Sanitaires ou Robinetterie', categoryMatch: 'Materiaux', targetEntityId: 'p2m', isActive: true },
  { id: 'rule-3', priority: 3, conditionDescription: 'Si besoin = Sourcing international, Importation de containers ou Fret', categoryMatch: 'Sourcing', targetEntityId: 'pgt', isActive: true },
  { id: 'rule-4', priority: 4, conditionDescription: 'Si besoin = Charpente métallique ou Hangar industriel', categoryMatch: 'Charpente', targetEntityId: 'serma-btp', isActive: true },
  { id: 'rule-5', priority: 5, conditionDescription: 'Si besoin = Travaux publics, Routes, Ponts ou VRD lourds', categoryMatch: 'Infrastructures', targetEntityId: 'sbs-group', isActive: true },
  { id: 'rule-6', priority: 6, conditionDescription: 'Si besoin = Location d\'engins lourds, Grues ou Transport BTP', categoryMatch: 'Engins', targetEntityId: 'sbs-logistik', isActive: true },
  { id: 'rule-7', priority: 7, conditionDescription: 'Si besoin = Préfabrication béton, Bordures ou Pavés', categoryMatch: 'Prefabrication', targetEntityId: 'sbs-industries', isActive: true },
  { id: 'rule-8', priority: 8, conditionDescription: 'Sinon règle de repli par défaut vers la Direction Générale', targetEntityId: 'direction', isActive: true }];
export const INITIAL_SCORING_RULES: ScoringRule[] = [
  { id: 'score-1', signalName: 'Téléchargement de brochure technique', points: 5, criteria: 'Intérêt manifesté sans intention immédiate', isActive: true },
  { id: 'score-2', signalName: 'Numéro de téléphone valide renseigné', points: 10, criteria: 'Contact joignable directement', isActive: true },
  { id: 'score-3', signalName: 'Budget prévisionnel renseigné', points: 10, criteria: 'Projet cadré financièrement', isActive: true },
  { id: 'score-4', signalName: 'Échéance urgente (< 3 mois)', points: 20, criteria: 'Priorité commerciale élevée', isActive: true },
  { id: 'score-5', signalName: 'Demande de devis ou sélection panier', points: 20, criteria: 'Intention d\'achat explicite', isActive: true },
  { id: 'score-6', signalName: 'Projet majeur / Appel d\'offres structuré', points: 30, criteria: 'Valeur contractuelle élevée', isActive: true },
  { id: 'score-7', signalName: 'Adresse email jetable / anonyme', points: -15, criteria: 'Signal de faible qualification', isActive: true }];
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-01',
    timestamp: '2026-09-15T09:00:00Z',
    user: 'Fatou Bintou Ndiaye',
    role: 'Commercial P2M',
    action: 'CREATE_QUOTE',
    resourceType: 'Quote',
    resourceId: 'DEV-2026-0184',
    newValue: 'Total TTC: 22 490 800 FCFA',
    ipAddress: '196.1.180.24',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: 'log-02',
    timestamp: '2026-09-14T10:30:00Z',
    user: 'Système Routage Automatique',
    role: 'System',
    action: 'LEAD_ROUTING',
    resourceType: 'Lead',
    resourceId: 'LEAD-2026-0042',
    oldValue: 'Non affecté',
    newValue: 'SERMA BTP (Score: 85)',
    ipAddress: '127.0.0.1',
    userAgent: 'Internal Engine'
  }];