/**
 * Images officielles de la plateforme www.magatteniang-expert.sn
 * VRAIES PHOTOS issues des documents officiels (doc magatte niang) :
 * - Photos de chantiers clients (CES, DLM, Polytech, SECAA, OIM)
 * - Photos du parc matériel extraites de la présentation SBS-GROUP
 * - Photos du laboratoire extraites de la présentation SBS-LABO
 */

export const SITE_IMAGES = {
  // Portraits de Magatte Niang
  magatteNiang: '/images/magatte-niang.jpg',
  magatteNiangEquipe: '/images/magatte-equipe.png',
  magatteNiangProfesseur: '/images/magatte-professeur.png',
  magatteNiangChercheur: '/images/magatte-chercheur.png',
  magatteNiangPortraitCover: '/images/magatte-portrait.webp',

  // Entités (logos & visuels officiels)
  sermaBtp: '/images/serma-btp.jpg',
  sbsGroup: '/images/sbs-group.jpg',
  sbsLabo: '/images/sbs-labo.png',
  sbsIndustries: '/images/sbs-industries.png',
  sbsLogistik: '/images/sbs-logistik.png',
  p2m: '/images/p2m.jpg',
  pgt: '/images/pgt.jpg',

  // Illustrations techniques du site officiel
  camionSbs: '/images/engins/camion-benne-40t.jpg',
  enginsVehicule: '/images/engins/parc-terrassement.jpg',
  innovationEnergie: '/images/energie.jpg',

  // === VRAIES PHOTOS — Présentation SBS-GROUP (chantiers & parc matériel) ===
  heroChantier: '/images/reelles/sbs-reel-001.jpg',          // Chantier SBS — hero accueil
  gruesLevage: '/images/reelles/sbs-reel-002.jpg',           // Chantier / levage
  architectureModerne: '/images/reelles/sbs-reel-001.jpg',   // Chantier groupe
  laboAnalyses: '/images/reelles/sbs-labo-reel-001.jpg',     // Laboratoire (essais)
  carrelageInterieur: '/images/reelles/sbs-labo-reel-005.jpg', // Intérieur / chantier
  portConteneurs: '/images/reelles/projet-ces-stockage-sendou-03.jpg', // Chantier industriel
  entrepotLogistique: '/images/reelles/sbs-reel-007.jpg',    // Logistique chantier
  betonPrefabrique: '/images/reelles/agglos-industrie-production-blocs.jpg',      // Préfabrication / bétonnage
  foreuseGeotechnique: '/images/reelles/sbs-labo-reel-003.jpg', // Essais terrain / labo
  bureauEtudes: '/images/reelles/sbs-labo-reel-004.jpg',     // Bureau d'études

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
 * Chaque clé correspond à un titre / métier de la plateforme.
 */
export const PHOTOS_REELLES = {
  // Chantiers & matériels (source : Présentation SBS-GROUP.pdf)
  chantierCouverture: '/images/reelles/sbs-reel-001.jpg',
  chantierGenieCivil: '/images/reelles/sbs-reel-002.jpg',
  camionGrue5T: '/images/reelles/sbs-reel-003.jpg',
  tractoPelle: '/images/reelles/sbs-reel-004.jpg',
  enginChantier: '/images/reelles/sbs-reel-005.jpg',
  betonniere: '/images/engins/betonniere-1000l.jpg',
  camionBenne40T: '/images/reelles/sbs-reel-007.jpg',
  materielChantier: '/images/reelles/sbs-reel-008.jpg',
  coulageBeton: '/images/reelles/coulage-beton-pompe-chantier.jpg',
  parcComplet: '/images/reelles/sbs-reel-007.jpg',

  // Laboratoire (source : Présentation SBS-LABO.pdf)
  laboVue: '/images/reelles/sbs-labo-reel-001.jpg',
  laboEssais: '/images/reelles/sbs-labo-reel-002.jpg',
  laboMateriel1: '/images/reelles/sbs-labo-reel-003.jpg',
  laboMateriel2: '/images/reelles/sbs-labo-reel-004.jpg',
  laboChantier: '/images/reelles/sbs-labo-reel-005.jpg',
  laboEssaiBeton: '/images/reelles/sbs-labo-reel-006.jpg',
  laboTopographie: '/images/reelles/sbs-labo-reel-007.jpg',
  laboEquipe: '/images/reelles/sbs-labo-reel-008.jpg',

  // Projets clients documentés
  cesStockageSendou: '/images/reelles/projet-ces-stockage-sendou-01.jpg',
  dlmUsineOxygeneMako: '/images/reelles/projet-dlm-usine-oxygene-mako-01.jpg',
  polytechBureauxSococim: '/images/reelles/projet-polytech-bureaux-sococim-01.jpg',
  secaaAireLavage: '/images/reelles/projet-secaa-aire-lavage-01.jpg',
  oimSocieteGenerale: '/images/reelles/projet-oim-societe-generale-01.jpg',
} as const;

/**
 * Galerie thématique BTP — branchée sur les VRAIES photos
 * des chantiers et du parc matériel du groupe.
 */
export const EXPERTISE_IMAGES = {
  charpenteMetal: '/images/reelles/projet-ces-stockage-sendou-03.jpg', // Ossature & charpente métallique sur chantier
  chantierInfrastructure: '/images/reelles/projet-ces-stockage-sendou-03.jpg', // Génie civil & infrastructures
  chantierLevage: '/images/reelles/sbs-reel-001.jpg',             // Montage chantier / coordination
  foreuseGeotechnique: '/images/reelles/sbs-labo-reel-005.jpg',   // Foreuse géotechnique en action
  ouvrageArtPont: '/images/reelles/sbs-reel-007.jpg',             // Ouvrages d'art & infrastructures
  enginTerrassement: '/images/engins/parc-terrassement.jpg',      // Parc d'engins de terrassement
  camionBenne: '/images/engins/camion-benne-40t.jpg',             // Camion benne 40T réel
  carrelageInterieur: '/images/carrelage-interieur.jpg',          // Finitions / intérieurs carrelés
  carrelagePrestige: '/images/carrelage-interieur.jpg',           // Intérieur prestige P2M
  sanitairesModernes: '/images/reelles/sbs-labo-reel-002.jpg',    // Matériel labo / sanitaires
  controleQualite: '/images/reelles/sbs-labo-reel-001.jpg',       // Laboratoire / contrôle qualité
  betonPrefabrique: '/images/reelles/agglos-industrie-production-blocs.jpg',              // Préfabrication béton (planchers & prédalles)
  ingenieurBureau: '/images/reelles/sbs-labo-reel-004.jpg',       // Bureau d'études
  logistique: '/images/reelles/sbs-reel-007.jpg',                 // Logistique & engins
  sourcing: '/images/reelles/projet-ces-stockage-sendou-03.jpg',  // Chantier industriel CES
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGES;
/**
 * Galeries par entité — VRAIES photos issues des dossiers officiels
 * (dossier 'doc magatte niang', flyers P2M et SB-S Logistik).
 * Affichées sur chaque page /entites/[id].
 */
export const ENTITY_GALLERY: Record<string, { src: string; caption: string }[]> = {
  // Galerie complète P2M : 136 photos réelles du showroom Mbao et des flyers
  // officiels (carreaux + plomberie). Légendes = contenu réellement visible.
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
    { src: '/images/reelles/p2m-133.jpg', caption: 'WC suspendu « ESTA 2011 » — 525×360×370mm, P-Trap' },
    { src: '/images/reelles/p2m-134.jpg', caption: 'Receveur de douche « SFST-1 » — 900×900×110mm' },
    { src: '/images/reelles/p2m-135.jpg', caption: 'Robinetterie chromée — mitigeurs & colonnes de douche' },
    { src: '/images/reelles/p2m-136.jpg', caption: 'Vasques et lavabos céramique blanche — VENUS TILES' },
    { src: '/images/reelles/p2m-131.jpg', caption: 'Accessoires & outils plomberie (Pex, siphons, clapets)' },
    { src: '/images/reelles/p2m-132.jpg', caption: 'Accessoires salle de bain chromés — porte-serviettes' },
    { src: '/images/reelles/p2m-127.jpg', caption: 'Accessoires sanitaires chromés — showroom Mbao' },
    { src: '/images/reelles/p2m-053.jpg', caption: 'Vasque à poser céramique blanche rectangulaire — EXELON 7019' },
    { src: '/images/reelles/p2m-038.jpg', caption: 'Robinet de lavabo chromé — mitigeur' },
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
    { src: '/images/reelles/p2m-041.jpg', caption: 'Robinetterie murale douche & bain — mitigeur chromé' },
    { src: '/images/reelles/p2m-046.jpg', caption: 'Douchette hygiénique WC et flexible chromé' },
    { src: '/images/reelles/p2m-059.jpg', caption: 'Douchette sanitaire chromée VMAC' },
    { src: '/images/reelles/p2m-085.jpg', caption: 'Décor mural / parement pierre relief' },
    { src: '/images/reelles/p2m-092.jpg', caption: 'Carrelage décoratif grand format prestige' },
    { src: '/images/reelles/p2m-024.jpg', caption: 'Carreau prestige Luxury Gold — format 60×60' },
    { src: '/images/reelles/p2m-028.jpg', caption: 'Céramique Terrazzo Matt 60×60' },
    // Échantillons carrelage du showroom (photos brutes, non légendées par P2M)
    ...[1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23,
      25, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37].map(n => ({
      src: `/images/reelles/p2m-${String(n).padStart(3, '0')}.jpg`,
      caption: 'Carreaux — échantillon showroom P2M Mbao',
    })),
    ...[40, 41, 42, 43, 45, 47, 49, 51, 52, 53, 54, 56, 61, 64, 65, 66, 67, 69,
      71, 72, 73, 74, 75, 76, 77, 78, 79, 82, 83, 84, 86, 87, 88, 89, 91, 93,
      94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106].map(n => ({
      src: `/images/reelles/p2m-${String(n).padStart(3, '0')}.jpg`,
      caption: 'Carrelage & finitions — catalogue P2M',
    })),
    // Photos du showroom P2M (documents officiels)
    ...[107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
      122, 123, 124, 125, 126, 128].map(n => ({
      src: `/images/reelles/p2m-${String(n).padStart(3, '0')}.jpg`,
      caption: 'Showroom P2M — Mbao Ville Neuve Villa S04',
    })),
  ],
    'sbs-logistik': [
    { src: '/images/reelles/logistik-001.jpg', caption: 'Location nacelle élévatrice télescopique (120 000 F/j)' },
    { src: '/images/reelles/logistik-002.jpg', caption: 'Échafaudages & étais métalliques de chantier (800 F - 1 000 F)' },
    { src: '/images/reelles/logistik-003.jpg', caption: 'Panneaux de coffrage & matériel de compactage' },
    { src: '/images/reelles/logistik-004.jpg', caption: 'Flotte nacelles télescopiques & tractopelles SB-S Logistik' },
    { src: '/images/reelles/logistik-005.jpg', caption: 'Fourniture & livraison sable et gravier basalte 0/3 par camion benne 40T' },
    { src: '/images/reelles/logistik-006.jpg', caption: 'Matériel lourd de chantier & compresseurs' },
    { src: '/images/reelles/logistik-007.jpg', caption: 'Échafaudages de façade modulaires (2 000 F - 3 500 F/niveau/j)' },
    { src: '/images/reelles/logistik-008.jpg', caption: 'Équipements et outillage lourd de chantier SB-S Logistik' },
    { src: '/images/reelles/logistik-009.jpg', caption: 'Location dumper tout-terrain & camion de chantier (180 000 F/j)' },
    { src: '/images/reelles/logistik-010.jpg', caption: 'Location groupe électrogène insonorisé 150 kVA' },
    { src: '/images/reelles/logistik-011.jpg', caption: 'Vente & livraison ciment en gros par camion plateau' },
    { src: '/images/reelles/logistik-012.jpg', caption: 'Location bétonnière thermique 1 000L tractable' },
    { src: '/images/reelles/logistik-013.jpg', caption: 'Location pompe à béton industrielle (à partir de 400 000 F)' },
    { src: '/images/reelles/logistik-014.jpg', caption: 'Location camion benne 40T pour terrassement et déblais' },
    { src: '/images/reelles/logistik-015.jpg', caption: 'Location compacteur à rouleaux vibrant' },
    { src: '/images/reelles/logistik-016.jpg', caption: 'Approvisionnement matériaux de construction et agrégats' },
    { src: '/images/reelles/logistik-017.jpg', caption: 'Location camion-grue 6T avec chauffeur (100 000 F/j)' },
    { src: '/images/reelles/logistik-018.jpg', caption: 'Flotte de transport et transfert d\'engins lourds au Sénégal' },
    { src: '/images/reelles/logistik-019.jpg', caption: 'Pilonneuses et matériel de compactage dynamique (60 000 F/j)' },
    { src: '/images/reelles/logistik-020.jpg', caption: 'Camion toupie malaxeur — transport béton prêt à l\'emploi' },
    { src: '/images/reelles/logistik-021.jpg', caption: 'Location panneaux de coffrage métalliques' },
    { src: '/images/engins/grue-mobile-50t.jpg', caption: 'Grue mobile télescopique 50T — levage lourd de charpentes' },
    { src: '/images/engins/camion-grue-6t.jpg', caption: 'Camion-grue 6 tonnes — livraison et manutention sur site' },
    { src: '/images/engins/tractopelle.jpg', caption: 'Tractopelle de chantier — terrassement, tranchées et VRD' },
  ],
  'sbs-labo': [
    { src: '/images/reelles/sbs-labo-reel-001.jpg', caption: 'Laboratoire SB-S Labo — agréé C2 & A2 à Sangalkam' },
    { src: '/images/reelles/sbs-labo-reel-002.jpg', caption: 'Essai géotechnique in-situ au pénétromètre par les ingénieurs' },
    { src: '/images/reelles/sbs-labo-reel-003.jpg', caption: 'Ingénieur SB-S Labo en mission de maîtrise des risques de sol' },
    { src: '/images/reelles/sbs-labo-reel-004.jpg', caption: 'Forage carotté rotary et sondage géotechnique profond' },
    { src: '/images/reelles/sbs-labo-reel-005.jpg', caption: 'Machine de forage APAFOR 450RS sur chantier à Dakar' },
    { src: '/images/reelles/sbs-labo-reel-006.jpg', caption: 'Superstructure et fondations validées par le laboratoire' },
    { src: '/images/reelles/sbs-labo-reel-007.jpg', caption: 'Levés topographiques et géodésiques de haute précision' },
    { src: '/images/reelles/sbs-labo-reel-008.jpg', caption: 'Équipe technique et ingénieurs géotechniciens SB-S Labo' },
  ],
  'sbs-industries': [
    { src: '/images/reelles/coulage-beton-pompe-tuyere.jpg', caption: 'Coulage de béton prêt à l\'emploi à la pompe — SB-S Industries' },
    { src: '/images/realisations/sbs-industries-prefabrication-usine.jpg', caption: 'Parc industriel et unité de production BPE 250 m³/jour' },
    { src: '/images/realisations/sbs-voirie-beton-plateforme.jpg', caption: 'Bétonnage et dallage industriel continu à haute résistance' },
    { src: '/images/realisations/sbs-dallage-industriel-arme.jpg', caption: 'Dallage béton armé formulé et contrôlé par laboratoire' },
    { src: '/images/realisations/sbs-labo-presse-compression-eprouvettes.jpg', caption: 'Dallage béton armé formulé et contrôlé par laboratoire' },
    { src: '/images/realisations/sbs-centrale-beton-malaxeur.jpg', caption: 'Centrale automatisée — formulation et contrôle continu C25/30' },
    { src: '/images/realisations/sbs-beton-malaxeur-pompe-site.jpg', caption: 'Centrale automatisée — formulation et contrôle continu C25/30' },
    { src: '/images/reelles/agglos-blocs-beton-senegal.jpg', caption: 'Éléments préfabriqués en béton : agglos creux 10×20×40 (300 F), hourdis, bordures normalisées' },
    { src: '/images/reelles/logistik-020.jpg', caption: 'Camion toupie malaxeur — livraison de béton prêt à l\'emploi' },
    { src: '/images/reelles/logistik-013.jpg', caption: 'Pompe à béton pour coulage grande hauteur et grande portée' },
    { src: '/images/reelles/logistik-012.jpg', caption: 'Malaxeur thermique industriel et centrale de gâchage' },
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
    { src: '/images/reelles/coulage-beton-pompe-chantier.jpg', caption: 'Coulage de béton par pompage sur chantier industriel — SB-S Group' },
    { src: '/images/reelles/sbs-reel-001.jpg', caption: 'Levage et montage sur chantier — coordination des équipes' },
    { src: '/images/reelles/sbs-reel-002.jpg', caption: 'Chantier SB-S Group — travaux d\'exécution' },
    { src: '/images/reelles/sbs-reel-003.jpg', caption: 'Génie civil — ouvrage en cours de réalisation' },
    { src: '/images/reelles/sbs-reel-004.jpg', caption: 'Gros œuvre et structure — chantier du groupe' },
    { src: '/images/reelles/sbs-reel-005.jpg', caption: 'Infrastructure béton — mise en œuvre sur site' },
    { src: '/images/reelles/sbs-reel-007.jpg', caption: 'Ouvrages d\'art et infrastructures — vue de chantier' },
    { src: '/images/reelles/projet-polytech-bureaux-sococim-05.jpg', caption: 'Bâtiment de bureaux achevé — carrière SOCOCIM (vue complémentaire)' },
    { src: '/images/reelles/projet-secaa-aire-lavage-06.jpg', caption: 'Aire de lavage industrielle livrée — SECAA SA (vue complémentaire)' },
    { src: '/images/reelles/projet-ces-stockage-sendou-05.jpg', caption: 'Aménagements et voiries d\'accès — CES Sendou' },
    { src: '/images/reelles/projet-ces-stockage-sendou-06.jpg', caption: 'Sécurisation des installations industrielles — CES Sendou' },
    { src: '/images/reelles/projet-ces-stockage-sendou-07.jpg', caption: 'Ouvrage industriel achevé — CES Sendou' },
    { src: '/images/reelles/projet-dlm-usine-oxygene-mako-05.jpg', caption: 'Canalisations industrielles et réseaux fluides — Mako' },
    { src: '/images/reelles/projet-dlm-usine-oxygene-mako-06.jpg', caption: 'Mise en service de l\'unité de production d\'oxygène — Mako' },
    { src: '/images/reelles/projet-oim-societe-generale-05.jpg', caption: 'Chantier OIM — poursuite des travaux' },
    { src: '/images/reelles/projet-oim-societe-generale-06.jpg', caption: 'Ouvrages humanitaires — avancement des travaux' },
    { src: '/images/reelles/projet-oim-societe-generale-07.jpg', caption: 'Bâtiments OIM — fin de chantier' },
    { src: '/images/realisations/pont-fatick-mixte.jpg', caption: 'Ouvrage d\'art mixte acier-béton — vue complémentaire' },
    { src: '/images/realisations/pont-franchissement-eau.jpg', caption: 'Franchissement hydraulique — infrastructure livrée' },
  ],
  'pgt': [
    { src: '/images/port-conteneurs.jpg', caption: 'Port Autonome de Dakar — terminal conteneurs & transit PGT' },
    { src: '/images/pgt/pgt-terminal-port-dakar.jpg', caption: 'Déchargement de navire porte-conteneurs au Port de Dakar' },
    { src: '/images/pgt/pgt-parc-conteneurs-stockage.jpg', caption: 'Parc conteneurs & stockage sous douane au Port Autonome de Dakar' },
    { src: '/images/pgt/pgt-transit-douane-entrepot.jpg', caption: 'Entrepôt logistique de transit & stockage matières premières' },
    { src: '/images/pgt/pgt-navire-cargo-manutention.jpg', caption: 'Navire cargo en opérations de manutention conteneurs — PAD' },
    { src: '/images/port.jpg', caption: 'Vue panoramique du Port Autonome de Dakar — hub logistique PGT' },
    { src: '/images/entrepot-logistique.jpg', caption: 'Entrepôt de stockage et distribution matériaux — PGT Sénégal' },
    { src: '/images/engins/camion-plateau.jpg', caption: 'Approvisionnement et livraison de matériaux de construction' },
    { src: '/images/engins/camion-plateau-groupe.jpg', caption: 'Flotte de camions PGT — distribution chantiers & usines' },
    { src: '/images/pgt/pgt-fret-maritime-conteneurs.jpg', caption: 'Plateforme logistique d\'approvisionnement direct usines' },
  ]
};
