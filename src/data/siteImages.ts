/**
 * Images officielles de la plateforme www.magatteniang-expert.sn
 * Vraies photos issues des documents officiels (dossier 'doc magatte niang') :
 * - Photos de chantiers clients (CES, DLM, Polytech, SECAA, OIM)
 * - Photos du parc matériel extraites de PRESENTATION MATERIEL.pdf et SBS-GROUP.pdf
 * - Photos du laboratoire extraites de la présentation SBS-LABO
 */

import { SBS_LOGISTIK_ITEMS } from './sbsLogistikData';

export const SITE_IMAGES = {
  // Portraits de Magatte Niang
  magatteNiang: '/images/magatte-niang.jpg',
  magatteNiangEquipe: '/images/magatte-equipe.png',
  magatteNiangProfesseur: '/images/magatte-professeur.png',
  magatteNiangChercheur: '/images/magatte-chercheur.png',
  magatteNiangPortraitCover: '/images/magatte-portrait.webp',

  // Entités (logos & visuels officiels)
  sermaBtp: '/images/serma-btp.jpg',
  sbsGroup: '/images/sbs-slides/sbs-slide-01.jpg',
  sbsLabo: '/images/sbs-labo.png',
  sbsIndustries: '/images/sbs-industries.png',
  sbsLogistik: '/images/sbs-logistik.png',
  p2m: '/images/p2m.jpg',
  pgt: '/images/pgt.jpg',

  // Illustrations techniques du site officiel
  camionSbs: '/images/sbs-logistik/logistik-equip-003.jpg',
  enginsVehicule: '/images/sbs-logistik/logistik-equip-006.jpg',
  innovationEnergie: '/images/energie.jpg',

  // === Vraies photos — Présentation SBS-GROUP (chantiers & parc matériel) ===
  heroChantier: '/images/reelles/sbs-reel-001.jpg',
  gruesLevage: '/images/reelles/sbs-reel-002.jpg',
  architectureModerne: '/images/reelles/sbs-reel-001.jpg',
  laboAnalyses: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg',
  carrelageInterieur: '/images/realisations/p2m-salle-de-bain-prestige.jpg',
  portConteneurs: '/images/reelles/projet-ces-stockage-sendou-03.jpg',
  entrepotLogistique: '/images/reelles/sbs-reel-007.jpg',
  betonPrefabrique: '/images/reelles/agglos-industrie-production-blocs.jpg',
  foreuseGeotechnique: '/images/reelles/sbs-labo-reel-004.jpg',
  bureauEtudes: '/images/reelles/sbs-labo-reel-003.jpg',

  // === Vraies photos des projets clients (documents officiels) ===
  projetCesSendou: '/images/reelles/projet-ces-stockage-sendou-01.jpg',
  projetDlmMako: '/images/reelles/projet-dlm-usine-oxygene-mako-01.jpg',
  projetPolytechSococim: '/images/reelles/projet-polytech-bureaux-sococim-01.jpg',
  projetSecaaLavage: '/images/reelles/projet-secaa-aire-lavage-01.jpg',
  projetOim: '/images/reelles/projet-oim-societe-generale-01.jpg',

  // Alias de compatibilité (anciennes clés utilisées dans les pages)
  gruesRealisation: '/images/reelles/sbs-reel-001.jpg',
  portInternational: '/images/reelles/projet-dlm-usine-oxygene-mako-03.jpg',
  rubonChantier: '/images/reelles/sbs-reel-001.jpg',
  architectureHero: '/images/reelles/sbs-reel-002.jpg',
} as const;

/**
 * Vraies photos de référence extraites des documents officiels
 * (Présentation SBS-GROUP 2025, Présentation SBS-LABO C2, dossiers clients).
 */
export const PHOTOS_REELLES = {
  // Chantiers & matériels (source : Présentation SBS-GROUP.pdf & PRESENTATION MATERIEL.pdf)
  chantierCouverture: '/images/reelles/sbs-reel-001.jpg',
  chantierGenieCivil: '/images/reelles/sbs-reel-002.jpg',
  camionGrue5T: '/images/sbs-logistik/logistik-equip-002.jpg',
  tractoPelle: '/images/sbs-logistik/logistik-equip-006.jpg',
  enginChantier: '/images/sbs-logistik/logistik-equip-001.jpg',
  betonniere: '/images/sbs-logistik/logistik-equip-018.jpg',
  camionBenne40T: '/images/sbs-logistik/logistik-equip-003.jpg',
  materielChantier: '/images/reelles/sbs-reel-008.jpg',
  coulageBeton: '/images/reelles/coulage-beton-pompe-chantier.jpg',
  parcComplet: '/images/reelles/sbs-reel-007.jpg',

  // Laboratoire (source : Présentation SBS-LABO.pdf)
  laboVue: '/images/reelles/sbs-labo-reel-001.jpg',
  laboEssais: '/images/reelles/sbs-labo-reel-002.jpg',
  laboMateriel1: '/images/reelles/sbs-labo-reel-003.jpg',
  laboMateriel2: '/images/reelles/sbs-labo-reel-004.jpg',
  laboChantier: '/images/reelles/sbs-labo-reel-005.jpg',
  laboEssaiBeton: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg',
  laboTopographie: '/images/reelles/sbs-labo-reel-006.jpg',
  laboEquipe: '/images/reelles/sbs-labo-reel-003.jpg',

  // Projets clients documentés
  cesStockageSendou: '/images/reelles/projet-ces-stockage-sendou-01.jpg',
  dlmUsineOxygeneMako: '/images/reelles/projet-dlm-usine-oxygene-mako-01.jpg',
  polytechBureauxSococim: '/images/reelles/projet-polytech-bureaux-sococim-01.jpg',
  secaaAireLavage: '/images/reelles/projet-secaa-aire-lavage-01.jpg',
  oimSocieteGenerale: '/images/reelles/projet-oim-societe-generale-01.jpg',
} as const;

/**
 * Galerie thématique BTP — branchée sur les vraies photos
 * des chantiers et du parc matériel du groupe.
 */
export const EXPERTISE_IMAGES = {
  charpenteMetal: '/images/reelles/projet-ces-stockage-sendou-03.jpg',
  chantierInfrastructure: '/images/reelles/projet-ces-stockage-sendou-03.jpg',
  chantierLevage: '/images/sbs-logistik/logistik-equip-001.jpg',
  foreuseGeotechnique: '/images/reelles/sbs-labo-reel-005.jpg',
  ouvrageArtPont: '/images/reelles/sbs-reel-007.jpg',
  enginTerrassement: '/images/sbs-logistik/logistik-equip-006.jpg',
  camionBenne: '/images/sbs-logistik/logistik-equip-003.jpg',
  carrelageInterieur: '/images/carrelage-interieur.jpg',
  carrelagePrestige: '/images/carrelage-interieur.jpg',
  sanitairesModernes: '/images/realisations/p2m-salle-de-bain-prestige.jpg',
  controleQualite: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg',
  betonPrefabrique: '/images/reelles/agglos-industrie-production-blocs.jpg',
  ingenieurBureau: '/images/reelles/sbs-labo-reel-003.jpg',
  logistique: '/images/sbs-logistik/logistik-equip-002.jpg',
  sourcing: '/images/pgt/pgt-terminal-port-dakar.jpg',
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGES;

/**
 * Galeries par entité — vraies photos issues des dossiers officiels
 * vérifiées visuellement image par image.
 */
export const ENTITY_GALLERY: Record<string, { src: string; caption: string }[]> = {
  p2m: [
    { src: '/images/reelles/p2m-005.jpg', caption: 'Céramique vitrifiée 60×120 — Sathvario Goldy 8 500 F/m² · Alaska Grey · Dyna Blue' },
    { src: '/images/reelles/p2m-022.jpg', caption: 'Calacatta Glossy 60×60 — blanc marbre veiné, 6 000 F/m²' },
    { src: '/images/reelles/p2m-026.jpg', caption: '3D Wall Design Glossy 20×30 — faïence murale, 3 500 F/m²' },
    { src: '/images/reelles/p2m-002.jpg', caption: 'Carrelage imitation bois 60×120 — German Wood Brown Matt' },
    { src: '/images/reelles/p2m-068.jpg', caption: 'Carreau porcelaine 60×60 beige sable — showroom Mbao' },
    { src: '/images/reelles/p2m-069.jpg', caption: 'Carreau porcelaine 40×40 gris mat adouci — showroom Mbao' },
    { src: '/images/reelles/p2m-078.jpg', caption: 'Carreau porcelaine 30×30 blanc antidérapant — showroom Mbao' },
    { src: '/images/reelles/p2m-070.jpg', caption: 'Carrelage imitation bois chêne naturel — showroom Mbao' },
    { src: '/images/reelles/p2m-076.jpg', caption: 'Dalle effet marbre Calacatta Gold blanc veiné or' },
    { src: '/images/reelles/p2m-080.jpg', caption: 'Dalle effet marbre blanc veiné or — Calacatta Gold' },
    { src: '/images/reelles/p2m-090.jpg', caption: 'Dalle effet marbre blanc/or poli brillant 80×240' },
    { src: '/images/reelles/p2m-081.jpg', caption: 'Mosaïque décor mural effet pierre naturelle' },
    { src: '/images/reelles/p2m-083.jpg', caption: 'Mosaïque décor piscine — pâte de verre bleue' },
    { src: '/images/reelles/p2m-130.jpg', caption: 'Vasque « EXELON 7019 » / Dover 7029 — catalogue officiel' },
    { src: '/images/reelles/p2m-129.jpg', caption: 'Baignoire « SFS-4 DELUX » — acrylique, embase PVC' },
    { src: '/images/reelles/p2m-133.jpg', caption: 'WC suspendu « ESTA 2011 » — 525×360×370 mm, P-Trap' },
    { src: '/images/reelles/p2m-134.jpg', caption: 'Receveur de douche « SFST-1 » — 900×900×110 mm' },
    { src: '/images/reelles/p2m-135.jpg', caption: 'Robinetterie chromée — mitigeurs & colonnes de douche' },
    { src: '/images/reelles/p2m-136.jpg', caption: 'WC à la turque (chaise turque) céramique blanche — catalogue officiel' },
    { src: '/images/reelles/p2m-131.jpg', caption: 'Porte-savon et porte-gobelet mural chromé — accessoires salle de bain' },
    { src: '/images/reelles/p2m-132.jpg', caption: 'Accessoires salle de bain chromés — porte-serviettes mural' },
    { src: '/images/reelles/p2m-127.jpg', caption: 'Accessoires sanitaires chromés — showroom Mbao' },
    { src: '/images/reelles/p2m-053.jpg', caption: 'Vasque à poser céramique blanche rectangulaire — EXELON 7019' },
    { src: '/images/reelles/p2m-038.jpg', caption: 'Cuvette WC suspendue céramique blanche — showroom Mbao' },
    { src: '/images/reelles/p2m-049.jpg', caption: 'Lavabo totem sur pied design — céramique blanche & marbre' },
    { src: '/images/reelles/p2m-060.jpg', caption: 'Lavabo sur colonne céramique blanche — marque Partas' },
    { src: '/images/reelles/p2m-061.jpg', caption: 'Lavabo sur pied « ROSEN 3001 » cylindrique monobloc' },
    { src: '/images/reelles/p2m-062.jpg', caption: 'WC à la turque (chaise turque) — céramique blanche' },
    { src: '/images/reelles/p2m-063.jpg', caption: 'Lavabo céramique blanc sur colonne design — showroom Mbao' },
    { src: '/images/reelles/p2m-043.jpg', caption: 'Évier de cuisine inox simple bac avec égouttoir' },
    { src: '/images/reelles/p2m-054.jpg', caption: 'Pack WC au sol complet avec réservoir et abattant' },
    { src: '/images/reelles/p2m-047.jpg', caption: 'Chaise anglaise (WC) monobloc céramique blanche' },
    { src: '/images/reelles/p2m-050.jpg', caption: 'Accessoire salle de bain — étagère verre dépoli et garde-corps chromé' },
    { src: '/images/reelles/p2m-055.jpg', caption: 'Robinet d’arrêt équerre quart de tour chromé HKI' },
    { src: '/images/reelles/p2m-057.jpg', caption: 'Robinet mural évier chromé col de cygne HKI' },
    { src: '/images/reelles/p2m-052.jpg', caption: 'Robinet mural évier col de cygne chromé' },
    { src: '/images/reelles/p2m-041.jpg', caption: 'Vasque lavabo céramique blanche « Exclusive » — showroom Mbao' },
    { src: '/images/reelles/p2m-046.jpg', caption: 'Douchette hygiénique WC et flexible chromé' },
    { src: '/images/reelles/p2m-059.jpg', caption: 'Douchette sanitaire chromée VMAC' },
    { src: '/images/reelles/p2m-085.jpg', caption: 'Décor mural / parement pierre relief' },
    { src: '/images/reelles/p2m-092.jpg', caption: 'Carrelage décoratif grand format prestige' },
    { src: '/images/reelles/p2m-024.jpg', caption: 'Carreau prestige Luxury Gold — format 60×60' },
    { src: '/images/reelles/p2m-028.jpg', caption: 'Céramique Terrazzo Matt 60×60' },
    ...[1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23,
      25, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37].map(n => ({
      src: `/images/reelles/p2m-${String(n).padStart(3, '0')}.jpg`,
      caption: 'Carreaux — échantillon showroom P2M Mbao',
    })),
    ...[40, 42, 45, 51, 56, 64, 65, 66, 67,
      71, 72, 73, 74, 75, 77, 79, 82, 84, 86, 87, 88, 89, 91, 93,
      94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106].map(n => ({
      src: `/images/reelles/p2m-${String(n).padStart(3, '0')}.jpg`,
      caption: 'Carrelage & finitions — catalogue P2M',
    })),
    ...[107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
      122, 123, 124, 125, 126, 128].map(n => ({
      src: `/images/reelles/p2m-${String(n).padStart(3, '0')}.jpg`,
      caption: 'Showroom P2M — Mbao Ville Neuve Villa S04',
    })),
  ],
  'sbs-logistik': SBS_LOGISTIK_ITEMS.map((p) => ({
    src: p.imageUrl,
    caption: `${p.title} — ${p.code} : ${p.specs}`,
  })),
  'sbs-labo': [
    { src: '/images/reelles/sbs-labo-reel-002.jpg', caption: 'Essai géotechnique in-situ au pénétromètre par les ingénieurs SB-S Labo' },
    { src: '/images/reelles/sbs-labo-reel-003.jpg', caption: 'Ingénieur SB-S Labo en mission de maîtrise des risques géotechniques' },
    { src: '/images/reelles/sbs-labo-reel-004.jpg', caption: 'Forage carotté rotary et sondage géotechnique profond' },
    { src: '/images/reelles/sbs-labo-reel-005.jpg', caption: 'Sondeuse géotechnique APAFOR 450RS en opération sur chantier à Dakar' },
    { src: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg', caption: 'Essai d\'écrasement d\'éprouvettes béton sous presse hydraulique 3 000 kN' },
    { src: '/images/reelles/sbs-labo-reel-006.jpg', caption: 'Contrôle qualité béton et suivi géotechnique d\'immeuble R+4' },
    { src: '/images/reelles/sbs-labo-reel-007.jpg', caption: 'Réception structurelle et audit de fondations sur bâtiment R+4' },
    { src: '/images/reelles/sbs-labo-reel-008.jpg', caption: 'Ouvrage R+4 suivi et certifié par les ingénieurs SB-S Labo' },
    { src: '/images/reelles/sbs-labo-reel-001.jpg', caption: 'Localisation aérienne du complexe et laboratoire SB-S Labo à Sangalkam' },
  ],
  'sbs-industries': [
    { src: '/images/realisations/sbs-industries-prefabrication-usine.jpg', caption: 'Parc industriel et unité de production BPE 250 m³/jour' },
    { src: '/images/sbs-logistik/logistik-equip-063.jpg', caption: 'Pondeuse automatique à parpaings et blocs béton en usine SB-S Industries' },
    { src: '/images/sbs-logistik/logistik-equip-068.jpg', caption: 'Presse hydropneumatique industrielle QT40-3A avec pupitre de commande' },
    { src: '/images/sbs-logistik/logistik-equip-070.jpg', caption: 'Silos à ciment TeknoMac et vis convoyeuse de la centrale à béton 60 m³/h' },
    { src: '/images/sbs-logistik/logistik-equip-071.jpg', caption: 'Trémie doseuse d\'agrégats et tapis convoyeur de la centrale à béton' },
    { src: '/images/sbs-logistik/logistik-equip-064.jpg', caption: 'Stockage sur palettes d\'agglos creux et blocs béton calibrés' },
    { src: '/images/sbs-logistik/logistik-equip-065.jpg', caption: 'Blocs d\'agglos creux 15×20×40 haute résistance — détail des alvéoles' },
    { src: '/images/realisations/sbs-beton-malaxeur-pompe-site.jpg', caption: 'Coulage de radier industriel à la pompe à béton automotrice grand bras' },
    { src: '/images/sbs-logistik/logistik-equip-010.jpg', caption: 'Camion malaxeur toupie 10 m³ — livraison de béton prêt à l\'emploi' },
    { src: '/images/sbs-logistik/logistik-equip-011.jpg', caption: 'Pompe à béton stationnaire haute pression Aquarius 1407 D' },
    { src: '/images/reelles/surfacement-mecanique-dallage-talocheuse.jpg', caption: 'Surfaçage mécanique haute résistance du dallage industriel' },
  ],
  'serma-btp': [
    { src: '/images/realisations/serma-modelisation-structurelle-3d-eurocodes.jpg', caption: 'Modélisation structurelle 3D et calculs de résistance Eurocodes 3' },
    { src: '/images/realisations/serma-hangar-industriel-structure.jpg', caption: 'Charpente métallique industrielle grande portée — structure acier' },
    { src: '/images/entrepot-logistique.jpg', caption: 'Hangar logistique grande portée et structure métallique' },
    { src: '/images/realisations/serma-auvent-station-service.jpg', caption: 'Auvents métalliques et charpentes stations-service (VIVO Energy / Shell)' },
    { src: '/images/realisations/serma-atelier-usinage-poutrelles.jpg', caption: 'Profilés et poutrelles métalliques usinés en atelier — Diamniadio' },
    { src: '/images/realisations/serma-decoupe-plasma-cnc.jpg', caption: 'Découpe thermique plasma HD et oxycoupage numérique' },
    { src: '/images/realisations/serma-charpente-metallique-chantier.jpg', caption: 'Montage et assemblage de charpente métallique grande hauteur' },
    { src: '/images/realisations/serma-structure-metallique-etages.jpg', caption: 'Ossature métallique multi-niveaux et planchers collaborants' },
    { src: '/images/reelles/projet-ces-stockage-sendou-02.jpg', caption: 'Structure métallique de toiture et bardage acier Sendou' },
    { src: '/images/reelles/projet-ces-stockage-sendou-03.jpg', caption: 'Charpente métallique industrielle en cours de montage' },
    { src: '/images/reelles/projet-ces-stockage-sendou-04.jpg', caption: 'Fermettes et ossature métallique haute résistance' },
    { src: '/images/port-conteneurs.jpg', caption: 'Ouvrage d\'art métallique et plateforme industrielle' },
  ],
  'sbs-group': [
    { src: '/images/sbs-presentation/sbs-page06-img03.jpeg', caption: 'Grues mobiles télescopiques 50T & nacelles grande hauteur' },
    { src: '/images/sbs-presentation/sbs-page07-img03.jpeg', caption: 'Camion-grue 6 tonnes à bras hydraulique télescopique' },
    { src: '/images/sbs-presentation/sbs-page08-img01.jpeg', caption: 'Pompe à béton stationnaire tractable haute pression Aquarius' },
    { src: '/images/sbs-presentation/sbs-page09-img02.jpeg', caption: 'Benne à béton conique 1 000 L pour coulage à la grue' },
    { src: '/images/sbs-presentation/sbs-page10-img02.jpeg', caption: 'Camion semi-remorque benne 40 tonnes Renault' },
    { src: '/images/sbs-presentation/sbs-page11-img05.jpeg', caption: 'Flotte 4x4 et véhicules d\'encadrement technique de chantier' },
    { src: '/images/sbs-presentation/sbs-page12-img04.jpeg', caption: 'Parc de banches et panneaux de coffrage métalliques modulaires' },
    { src: '/images/sbs-presentation/sbs-page13-img01.jpeg', caption: 'Presse hydropneumatique industrielle de préfabrication de blocs béton' },
    { src: '/images/sbs-presentation/sbs-page17-img02.jpeg', caption: 'Bâtiment industriel & bureaux carrière SOCOCIM — Polytech' },
    { src: '/images/sbs-presentation/sbs-page18-img02.jpeg', caption: 'Mur de soutènement en béton armé — carrière concassage' },
    { src: '/images/sbs-presentation/sbs-page19-img04.jpeg', caption: 'Génie civil & massif lourd pour 2ème concasseur' },
    { src: '/images/sbs-presentation/sbs-page20-img01.jpeg', caption: 'Dallages béton armé 12 000 m² & caniveaux VRD' },
    { src: '/images/sbs-presentation/sbs-page21-img01.jpeg', caption: 'Centrale thermique CES Sendou : stockage produits chimiques' },
    { src: '/images/sbs-presentation/sbs-page22-img01.jpeg', caption: 'Compagnie Sucrière Sénégalaise (CSS) : travaux usine Richard-Toll' },
    { src: '/images/sbs-presentation/sbs-page23-img01.jpeg', caption: 'Puisard industriel de rétention (9 m) en zone minière Kédougou' },
    { src: '/images/sbs-presentation/sbs-page25-img01.jpeg', caption: 'Unité de production d\'oxygène PSA 6TPJ à Mako' },
    { src: '/images/sbs-presentation/sbs-page26-img01.jpeg', caption: 'Bâtiment administratif sous-traitants au Port de Dakar' },
    { src: '/images/sbs-presentation/sbs-page27-img01.jpeg', caption: 'Pont-bascule électronique et pesage de camions — ETM-CI Abidjan PK 24' },
    { src: '/images/sbs-presentation/sbs-page29-img25.jpeg', caption: 'Structures métalliques et installations industrielles — CSS Richard-Toll' },
    { src: '/images/sbs-presentation/sbs-page31-img01.jpeg', caption: 'Coffrage spécialisé silos au Port Autonome de Dakar' },
    { src: '/images/sbs-presentation/sbs-page36-img01.jpeg', caption: 'Hangar clinker 7 890 m² au PK 24 Abidjan' },
    { src: '/images/sbs-presentation/sbs-page57-img01.jpeg', caption: 'Immeuble commercial & résidentiel R+7 Sandaga' }
  ],
  'pgt': [
    { src: '/images/port-conteneurs.jpg', caption: 'Port Autonome de Dakar — terminal conteneurs & transit PGT' },
    { src: '/images/pgt/pgt-terminal-port-dakar.jpg', caption: 'Déchargement de navire porte-conteneurs au Port de Dakar' },
    { src: '/images/pgt/pgt-parc-conteneurs-stockage.jpg', caption: 'Parc conteneurs & stockage sous douane au Port Autonome de Dakar' },
    { src: '/images/pgt/pgt-transit-douane-entrepot.jpg', caption: 'Entrepôt logistique de transit & stockage matières premières' },
    { src: '/images/pgt/pgt-navire-cargo-manutention.jpg', caption: 'Navire cargo en opérations de manutention conteneurs — PAD' },
    { src: '/images/port.jpg', caption: 'Vue panoramique du Port Autonome de Dakar — hub logistique PGT' },
    { src: '/images/entrepot-logistique.jpg', caption: 'Entrepôt de stockage et distribution matériaux — PGT Sénégal' },
    { src: '/images/sbs-presentation/sbs-page12-img01.jpeg', caption: 'Approvisionnement par semi-remorque de matériaux de construction' },
    { src: '/images/sbs-presentation/sbs-page10-img02.jpeg', caption: 'Flotte de camions semi-remorques 40T — distribution chantiers & usines' },
    { src: '/images/pgt/pgt-fret-maritime-conteneurs.jpg', caption: 'Plateforme logistique d\'approvisionnement direct usines' },
  ]
};
