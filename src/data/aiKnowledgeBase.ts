/**
 * Base de connaissances approfondie de l'Assistant IA Technique BTP
 * Écosystème Magatte Niang Expert (SERMA BTP, SB-S Group, SB-S Labo,
 * SB-S Industries, SB-S Logistik, P2M, PGT).
 *
 * Sources documentaires internes validées :
 * - Plaquette institutionnelle écosystème 2026 (PLA-CORP-2026)
 * - Flyers officiels Showroom P2M (carreaux, sanitaires & plomberie)
 * - Fiches d'essais SB-S Labo (normes NF P 94-078, NF P 94-093, NF EN 12390-3)
 * - Grille tarifaire officielle SB-S Logistik & flotte engins
 * - Données industrielles vérifiées centrale à béton & usine SERMA BTP
 * - Répertoire des réalisations et références chantiers au Sénégal
 */

export interface KnowledgeTopic {
  id: string;
  keywords: string[];
  title: string;
  answer: string;
  sources: { title: string; ref: string; link?: string }[];
  suggestedAction?: { label: string; href: string };
}

export function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const AI_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // --- SALUTATIONS, ACCUEIL & PRÉSENTATION GÉNÉRALE ---
  {
    id: 'salutations-accueil',
    keywords: [
      'bonjour', 'salut', 'bonsoir', 'coucou', 'hello', 'hi',
      'aide', 'aidez', 'aider', 'qui etes vous', 'qui est tu',
      'comment ca marche', 'que faites vous', 'pouvez vous',
      'presentation', 'bienvenue', 'assistance'
    ],
    title: 'Accueil & Présentation de l\'écosystème Magatte Niang',
    answer: `Bonjour ! Je suis l'assistant technique de l'écosystème **Magatte Niang Expert** au Sénégal.

Je suis à votre entière disposition pour vous guider et chiffrer vos besoins sur l'ensemble de nos pôles d'expertise :

• **Carrelages & Sanitaires (P2M)** : Showroom Mbao Villa S04 — stock permanent de carreaux 60×60 (dès 5 500 F), 40×40 (dès 4 000 F), 30×30 (dès 3 000 F), 60×120 vitrifié (dès 7 500 F), dalles 80×240, sanitaires Partas/ESTA et robinetterie HKI.
• **Charpente Métallique (SERMA BTP)** : usinage de 4 500 T/an d'acier, découpe plasma 3D, hangars grande portée > 42m sans poteau intermédiaire.
• **Géotechnique & Essais Sols (SB-S Labo)** : plus de 12 800 essais certifiés/an (CBR 4j immersion, Proctor, écrasement béton 3 000 kN, pénétromètre dynamique).
• **Centrale à Béton & Agglos (SB-S Industries)** : BPE formulé (250 m³/j), agglos creux 10×20×40 à 300 FCFA HT / pièce, hourdis et bordures.
• **Flotte Lourde & Grues (SB-S Logistik)** : grues mobiles 50T (500 000 F/j), camions-grues 6T (100 000 F/j), tractopelles (120 000 F/j) — contact direct : 77 858 61 05.
• **Sourcing International & Fret (PGT)** : approvisionnement direct usine sans intermédiaire, fret maritime conteneurisé et transit au Port de Dakar.
• **Réalisations au Sénégal** : Sendou, usine DLM Mako, SOCOCIM, SECAA, résidences Almadies, villas Saly et Fann.

Sur quel sujet précis puis-je vous renseigner aujourd'hui ?`,
    sources: [
      { title: 'Plaquette institutionnelle Magatte Niang Expert 2026', ref: 'PLA-CORP-2026', link: '/docs/plaquette' },
      { title: 'Charte de gouvernance technique', ref: 'GOUV-2026-BTP', link: '/engagements' }
    ],
    suggestedAction: { label: 'Qualifier mon projet pas-à-pas', href: '/assistant' }
  },

  // --- PROJET DE CONSTRUCTION, MAISON, VILLA, TRAVAUX CLÉ EN MAIN ---
  {
    id: 'projet-construction-maison-villa',
    keywords: [
      'construire', 'construction', 'maison', 'villa', 'batiment', 'immeuble',
      'travaux', 'chantier', 'renovation', 'gros oeuvre', 'fondation', 'dallage',
      'cle en main', 'terrain', 'promoteur', 'projet', 'plan'
    ],
    title: 'Solutions complètes pour Construction & Rénovation au Sénégal',
    answer: `Pour tout projet de construction, villa ou rénovation au Sénégal, l'écosystème Magatte Niang apporte une solution technique complète et coordonnée :

1. **Étude de sol préalable (SB-S Labo)** : Essais CBR, Proctor et pénétromètre dynamique lourd pour garantir l'assise des fondations et prévenir les fissures.
2. **Béton prêt à l'emploi & Agglos (SB-S Industries)** : Béton dosé en centrale (250 m³/j) coulé à la pompe, agglos creux 10×20×40 à 300 FCFA HT / pièce, hourdis légers pour dalles et planchers.
3. **Structure métallique ou toiture (SERMA BTP)** : Charpente acier haute résistance avec protection anti-corrosion marine.
4. **Revêtements de sol & mur (P2M)** : Porcelaine pleine masse 60×60, 40×40, 30×30 et grand format 60×120 pour salons de prestige, terrasses antidérapantes et faïence murale.
5. **Sanitaires & robinetterie (P2M)** : WC suspendus ESTA, chaises anglaises monobloc, vasques à poser EXELON, baignoires SFS-4 DELUX et mitigeurs chromés HKI.
6. **Logistique de livraison (SB-S Logistik)** : Camions-grues et bennes pour acheminement direct sur votre chantier.

Vous pouvez démarrer un chiffrage personnalisé en 2 minutes ou échanger avec nos ingénieurs.`,
    sources: [
      { title: 'Catalogue d\'offres intégrées Écosystème', ref: 'OFF-BTP-2026', link: '/services' },
      { title: 'Étude de cas Résidentiel Les Almadies (80 logements)', ref: 'CAS-ALM-2024', link: '/projets' }
    ],
    suggestedAction: { label: 'Lancer l\'assistant de chiffrage', href: '/assistant' }
  },

  // --- CARRELAGES, FORMATS, PRIX & FINITIONS (P2M) ---
  {
    id: 'p2m-carrelage-tarifs',
    keywords: [
      'carrelage', 'carrelages', 'carreau', 'carreaux', 'porcelaine', 'ceramique',
      'faience', 'mosaique', 'gres', 'sol', 'mural', 'revetement', 'revetements',
      '60x60', '40x40', '30x30', '60x120', '80x240', 'calacatta', 'marbre',
      'bois', 'parquet', 'piscine', 'prix carrelage', 'tarif carrelage', 'p2m', 'mbao'
    ],
    title: 'P2M — Showroom Carrelages de Prestige & Tarifs Officiels',
    answer: `P2M (Polytech Matériaux & Matériels) dispose d'un stock de plus de 30 références disponibles immédiatement au showroom de Mbao Ville Neuve (Villa S04) à Dakar.

**Grille des tarifs officiels en stock (flyers P2M) :**
• **Porcelaine pleine masse 60×60 cm** (beige sable soft, Calacatta Glossy) : **5 500 à 6 000 FCFA/m² HT**
• **Porcelaine pleine masse 40×40 cm** (gris adouci, pierre naturelle) : **4 000 à 5 500 FCFA/m² HT**
• **Porcelaine pleine masse 30×30 cm** (blanc antidérapant R10, économique) : **3 000 à 3 500 FCFA/m² HT**
• **Céramique vitrifiée 60×120 cm** (Sathvario Goldy, Alaska Grey, Dyna Blue) : **7 500 à 8 500 FCFA/m² HT**
• **Dalles prestige 80×240 cm** (plaque marbre haute brillance) : **30 000 FCFA / plaque**
• **Carrelage imitation parquet bois 60×60 cm** (chêne naturel chaleureux) : **6 500 FCFA/m² HT**
• **Faïence murale 3D Wall Design 20×30 cm** (relief gouttes d'eau glossy) : **3 500 FCFA/m² HT**
• **Mosaïque pâte de verre pour piscine & crédence** (bleu azur / lagon) : **8 500 FCFA / plaque**

📍 Showroom : Mbao Ville Neuve, Villa S04, Dakar.
📞 Contacts : +221 78 832 12 79 / +221 78 424 64 45 / +221 77 827 08 18 — email : p2m.senegal@gmail.com.
Livraison rapide sur chantier à Dakar, Diamniadio, Thiès, Saly et partout au Sénégal.`,
    sources: [
      { title: 'Flyer officiel Vente de Carreaux P2M Mbao', ref: 'FLY-CAR-P2M' },
      { title: 'Catalogue Showroom Digital P2M', ref: 'CAT-P2M-2026', link: '/catalogue' }
    ],
    suggestedAction: { label: 'Accéder à tout le catalogue P2M', href: '/catalogue' }
  },

  // --- SANITAIRES, ROBINETTERIE & PLOMBERIE (P2M) ---
  {
    id: 'p2m-sanitaires-plomberie',
    keywords: [
      'sanitaire', 'sanitaires', 'wc', 'toilette', 'toilettes', 'lavabo', 'lavabos',
      'vasque', 'vasques', 'baignoire', 'baignoires', 'douche', 'douches', 'receveur',
      'robinet', 'robinets', 'robinetterie', 'mitigeur', 'mitigeurs', 'evier', 'eviers',
      'partas', 'esta', 'chaise anglaise', 'chaise turque', 'hki', 'plomberie', 'pex',
      'siphon', 'douchette', 'bain'
    ],
    title: 'P2M — Équipements Sanitaires, Robinetterie & Plomberie',
    answer: `P2M distribue une sélection complète d'appareils et accessoires sanitaires certifiés, disponibles au showroom de Mbao (contact : 78 832 12 79) :

• **WC & Toilettes :**
  - WC suspendu P-Trap « ESTA 2011 » (525×360×370mm) : **55 000 FCFA HT**
  - Pack WC complet au sol (cuvette + réservoir + abattant) : **35 000 FCFA HT**
  - Chaise anglaise monobloc one piece céramique blanche : **45 000 FCFA HT**
  - WC à la turque (chaise turque) céramique avec repose-pieds : **25 000 FCFA HT**

• **Vasques & Lavabos :**
  - Lavabo sur colonne céramique blanche « Partas » : **38 000 FCFA HT**
  - Lavabo totem sur pied cylindrique « ROSEN 3001 » (455×455×860mm) : **65 000 FCFA HT**
  - Vasque à poser rectangulaire « EXELON 7019 » (525×365×130mm) : **52 000 FCFA HT**

• **Bain & Douche :**
  - Baignoire acrylique « SFS-4 DELUX » avec embase étanche PVC : **195 000 FCFA HT**
  - Receveur de douche antidérapant « SFST-1 » (900×900×110mm) : **85 000 FCFA HT**
  - Colonne de douche avec mitigeur ou hydromassante : **45 000 FCFA HT**

• **Robinetterie & Cuisine :**
  - Robinet mural évier chromé HKI col de cygne : **12 000 FCFA HT**
  - Mitigeur mural encastré bain/douche chromé : **15 000 FCFA HT**
  - Robinet d'arrêt quart de tour « S-1003 Angle Cock » : **8 000 FCFA HT**
  - Évier inox simple bac avec égouttoir : **48 000 FCFA HT**
  - Set accessoires chromés (porte-serviettes, étagères verre, porte-savon) : **13 500 FCFA HT**
  - Outillage plomberie : tubes PEX, raccords, siphons, nourrices, clapets, téflon.`,
    sources: [
      { title: 'Flyer officiel Appareils & Équipements Sanitaires P2M', ref: 'FLY-SAN-P2M' },
      { title: 'Catalogue Sanitaires & Robinetterie P2M', ref: 'CAT-SAN-2026', link: '/catalogue' }
    ],
    suggestedAction: { label: 'Voir les sanitaires & robinetterie', href: '/catalogue' }
  },

  // --- SERMA BTP & CHARPENTE MÉTALLIQUE ---
  {
    id: 'serma-charpente-metal',
    keywords: [
      'serma', 'charpente', 'charpentes', 'metal', 'metallique', 'acier', 'hangar',
      'hangars', 'entrepot', 'toiture', 'portee', 'chaudronnerie', 'structure',
      'soudage', 'plasma', 'oxycoupage', 'galvanisation', 'diamniadio', 'usine acier'
    ],
    title: 'SERMA BTP — Construction & Charpente Métallique Industrielle',
    answer: `SERMA BTP est l'entité spécialisée en construction métallique et chaudronnerie lourde de l'écosystème Magatte Niang :

• **Capacité d'usinage :** Plus de 4 500 tonnes d'acier transformées par an sur le site industriel de Diamniadio / Dakar.
• **Parc technique de pointe :**
  - Bancs d'oxycoupage et découpe plasma 3D haute définition
  - Lignes de perçage et d'assemblage automatisées
  - Procédés de soudage certifiés ISO 3834 / EN 1090 selon les Eurocodes 3 et règles CM66
• **Grandes portées :** Maîtrise des charpentes à grande portée (> 42 mètres sans appui intermédiaire), idéales pour hangars logistiques et usines.
• **Protection anti-corrosion :** Traitements adaptés au climat maritime sénégalais (galvanisation à chaud au trempé, peintures polyuréthane haute durabilité).
• **Réalisations emblématiques :**
  - Hangar logistique de Diamniadio (38 tonnes)
  - Structure métallique de toiture de la centrale électrique de Sendou
  - Ingénierie de l'usine d'oxygène PSA 6T/j DLM Mako.`,
    sources: [
      { title: 'Spécifications techniques charpente SERMA BTP', ref: 'FT-SERMA-2026', link: '/entites/serma-btp' },
      { title: 'Étude de cas Hangar Diamniadio (38T)', ref: 'CAS-PROJ-01', link: '/projets/hangar-logistique-diamniadio-38t' }
    ],
    suggestedAction: { label: 'Qualifier un projet de charpente métallique', href: '/assistant' }
  },

  // --- SB-S LABO (GÉOTECHNIQUE & ESSAIS MATÉRIAUX) ---
  {
    id: 'sbs-labo-geotechnique',
    keywords: [
      'labo', 'laboratoire', 'cbr', 'sol', 'sols', 'geotechnique', 'sondage', 'sondages',
      'proctor', 'eprouvette', 'eprouvettes', 'compression', 'ecrasement', 'presse',
      'atterberg', 'pdl', 'penetrometre', 'densite', 'portance', 'laterite', 'argile',
      'nf p 94 078', 'nf en 12390'
    ],
    title: 'SB-S Labo — Laboratoire Géotechnique & Contrôle Matériaux',
    answer: `SB-S Labo réalise plus de 12 800 essais certifiés par an sur les sols, granulats, bétons et chaussées à travers tout le Sénégal :

• **Essais sur sols & couches de chaussée :**
  - **Essai CBR immersion 4 jours & IPI** (norme NF P 94-078 / AASHTO T193) : 50 kg de sol requis, procès-verbal sous 5 jours ouvrés
  - **Essai Proctor normal et modifié** (NF P 94-093) : 30 kg de sol, teneur en eau optimale et densité sèche max, délai 3 jours
  - **Limites d'Atterberg WL & WP** (NF P 94-051) : 5 kg de passant à 400 µm, plasticité et gonflement des argiles, délai 3 jours
  - **Analyse granulométrique & équivalent de sable** : caractérisation des remblais et agrégats

• **Contrôle béton & compression :**
  - **Résistance à la compression sur éprouvettes** 16×32 ou 15×15 à 7j, 14j et 28j sous presse asservie 3 000 kN (NF EN 12390-3, PV sous 2 jours ouvrés après écrasement)

• **Essais in-situ sur chantier :**
  - **Pénétromètre dynamique lourd (PDL)** (NF P 94-115) : mesure continue de la résistance dynamique de pointe jusqu'à 15m de profondeur avec machine autonome.`,
    sources: [
      { title: 'Catalogue officiel des essais SB-S Labo', ref: 'CAT-LABO-2026', link: '/services/laboratoire' },
      { title: 'Publications scientifiques sols latéritiques', ref: 'GEO-SN-2024', link: '/publications' }
    ],
    suggestedAction: { label: 'Consulter le catalogue d\'essais du laboratoire', href: '/services/laboratoire' }
  },

  // --- SB-S INDUSTRIES (BÉTON PRÊT À L'EMPLOI & AGGLOS) ---
  {
    id: 'sbs-industries-beton-agglos',
    keywords: [
      'beton', 'bpe', 'centrale a beton', 'agglo', 'agglos', 'parpaing', 'parpaings',
      'brique', 'briques', 'hourdis', 'bordure', 'bordures', 'pave', 'paves',
      'prefabrication', '300f', '300 fcfa', 'toupie', 'malaxeur', 'c25', 'c30'
    ],
    title: 'SB-S Industries — Centrale à Béton & Préfabrication',
    answer: `SB-S Industries assure la production industrielle de béton et d'éléments préfabriqués normalisés pour les chantiers de Dakar et régions :

• **Centrale à Béton Prêt à l'Emploi (BPE) :**
  - Capacité de production : **250 m³/jour**
  - Formules normalisées : B25 (C20/25), B30 (C25/30), C30/37 avec adjuvants certifiés
  - Livraison par camions malaxeurs (toupies) avec pompage direct sur site
  - Contrôle qualité continu des éprouvettes par SB-S Labo

• **Préfabrication d'Agglos & Éléments Béton :**
  - **Agglos creux 10×20×40 :** tarif officiel indicatif de **300 FCFA HT / pièce**
  - **Agglos creux et pleins 15×20×40 et 20×20×40 :** parpaings vibrés haute compacité pour murs porteurs et clôtures
  - **Hourdis béton allégés :** pour dalles de compression et planchers d'étage
  - **Bordures de trottoir normalisées :** profils T2, CS, bordures d'accotement
  - **Pavés autobloquants haute densité :** pour voiries urbaines, stations-service et parkings lourds.`,
    sources: [
      { title: 'Fiche technique béton prêt à l\'emploi SB-S Industries', ref: 'FT-IND-2026', link: '/entites/sbs-industries' },
      { title: 'Plaquette tarifaire préfabrication béton', ref: 'TAR-IND-2026' }
    ],
    suggestedAction: { label: 'Commander du béton ou des agglos', href: '/entites/sbs-industries' }
  },

  // --- SB-S LOGISTIK (ENGINS LOURDS, GRUES & TRANSPORT) ---
  {
    id: 'sbs-logistik-flotte-engins',
    keywords: [
      'engin', 'engins', 'grue', 'grues', 'camion', 'camions', 'benne', 'bennes',
      'tractopelle', 'tractopelles', 'dumper', 'dumpers', 'pelle', 'pelles',
      'logistik', 'location', 'levage', 'manutention', 'fret lourd', '77 858 61 05',
      'prix grue', 'tarif engin', 'tarif grue'
    ],
    title: 'SB-S Logistik — Location d\'Engins & Flotte Lourde',
    answer: `SB-S Logistik gère un parc de 82 engins lourds et camions récents disponibles à la location avec opérateurs qualifiés et maintenance 24/7 sur site.
📞 **Contact officiel direct : +221 77 858 61 05**

**Grille tarifaire officielle (flyer SB-S Logistik) :**
• **Camion-grue 6 tonnes : 100 000 FCFA / jour** (transport, livraison et pose de matériaux lourds)
• **Grue mobile télescopique 50 tonnes : 500 000 FCFA / jour** (levage lourd, charpentes, poutres, centrales et ouvrages d'art)
• **Tractopelle polyvalent : 120 000 FCFA / jour** (terrassement, fouilles, tranchées et chargement)
• **Dumper tout-terrain FCY30R :** transport interne sur chantiers difficiles
• **Camions bennes 8×4 de 20 m³ et 30 m³ :** approvisionnement en agrégats et évacuation de déblais
• **Semi-remorques plateaux et porte-engins :** transfert d'engins lourds et convois exceptionnels sur tout le Sénégal.`,
    sources: [
      { title: 'Grille tarifaire location engins SB-S Logistik', ref: 'TAR-ENG-2026', link: '/services/engins' },
      { title: 'Flyer officiel SB-S Logistik (contact 77 858 61 05)', ref: 'DOC-LOG-2026' }
    ],
    suggestedAction: { label: 'Réserver un engin en ligne', href: '/services/engins' }
  },

  // --- PGT (SOURCING INTERNATIONAL & TRANSIT) ---
  {
    id: 'pgt-sourcing-transit',
    keywords: [
      'pgt', 'sourcing', 'importation', 'import', 'transit', 'port', 'dakar',
      'fret', 'conteneur', 'conteneurs', 'dedouanement', 'centrale d achat', 'fournisseur'
    ],
    title: 'PGT — Polytech Global Trading & Transit Maritime',
    answer: `PGT (Polytech Global Trading) opère comme centrale d'achat internationale et opérateur de transit pour l'écosystème :

• **Sourcing direct usines :** Contrats de gros volumes auprès de fabricants certifiés en Europe, Turquie, Inde et Asie (fer à béton, profilés acier, carreaux céramiques, sanitaires).
• **Élimination des intermédiaires :** Garantit les prix les plus compétitifs du marché aux promoteurs et constructeurs au Sénégal.
• **Fret maritime & logistique portuaire :** Gestion complète du transport conteneurisé jusqu'au Port Autonome de Dakar (PAD).
• **Dédouanement express :** Prise en charge des formalités douanières et sécurisation du transit.
• **Livraison directe sur site :** Acheminement rapide jusqu'au chantier du client sans rupture de charge.`,
    sources: [
      { title: 'Fiche d\'activité Sourcing & Fret PGT', ref: 'PGT-TRAD-2026', link: '/entites/pgt' }
    ],
    suggestedAction: { label: 'Découvrir les services de sourcing PGT', href: '/entites/pgt' }
  },

  // --- RÉALISATIONS & CHANTIERS AU SÉNÉGAL ---
  {
    id: 'realisations-projets-senegal',
    keywords: [
      'realisation', 'realisations', 'projet', 'projets', 'chantier', 'chantiers',
      'reference', 'references', 'sendou', 'mako', 'sococim', 'secaa', 'oim',
      'goree', 'almadies', 'saly', 'somone', 'fann', 'senegal', 'dakar'
    ],
    title: 'Réalisations & Références Chantiers au Sénégal',
    answer: `L'écosystème Magatte Niang affiche un palmarès de réalisations majeures au Sénégal :

• **Pôle Industriel & Énergie :**
  - **Centrale électrique de Sendou (CES) :** Bâtiment de stockage de produits chimiques et toiture métallique (2025)
  - **DLM Sénégal (Mako, Kédougou) :** Ingénierie civile, électrique et mécanique complète pour usine d'oxygène PSA 6T/j (2023)
  - **Carrière SOCOCIM (Thiès) :** Bâtiments de bureaux d'exploitation pour le 2e concasseur (2025)
  - **SECAA SA (Dakar) :** Aire de lavage industrielle avec dallage béton armé renforcé (2025)
  - **Gorée Offshore (Dakar) :** Dallages industriels lourds, caniveaux et fosse septique (2025)
  - **OIM & Société Générale :** Bâtiments humanitaires et sanitaires d'accueil (2025)

• **Pôle Résidences & Villas de Standing (P2M) :**
  - **Résidences Les Almadies (Dakar) :** 14 000 m² de carrelage poli miroir 60×120 cm et sanitaires pour 80 logements de prestige
  - **Villa contemporaine Saly Portudal (Mbour) :** 850 m² de dalles grand format et terrasses extérieures antidérapantes R11
  - **Villa d'architecte Fann Résidence (Dakar) :** 1 200 m² de marbre Calacatta Gold et salles de bains complètes P2M
  - **Domaine résidentiel La Somone :** 3 200 m² de carrelage porcelaine pour 6 villas côtières.`,
    sources: [
      { title: 'Registre des projets & études de cas techniques', ref: 'REG-PROJ-2026', link: '/projets' }
    ],
    suggestedAction: { label: 'Explorer toutes nos réalisations', href: '/projets' }
  },

  // --- CONTACTS, DEVIS, PRIX, ADRESSES & HORAIRES ---
  {
    id: 'contact-devis-prix-coordonnees',
    keywords: [
      'contact', 'contacts', 'devis', 'prix', 'tarif', 'tarifs', 'cout', 'combien',
      'telephone', 'telephones', 'whatsapp', 'email', 'mail', 'adresse', 'localisation',
      'ou etes vous', 'mbao', 'horaire', 'horaires', 'chiffrage', 'deplacement', 'visite'
    ],
    title: 'Contacts, Devis & Coordonnées de l\'Écosystème',
    answer: `Pour toute demande de cotation, consultation technique ou visite de nos sites :

• **Standard central Dakar :** +221 33 832 40 10
• **Showroom P2M (Carrelages & Sanitaires) :**
  - 📞 Téléphones directs : **+221 78 832 12 79 / +221 78 424 64 45 / +221 77 827 08 18**
  - 📍 Adresse : Mbao Ville Neuve, Villa S04, Dakar (ouvert du lundi au samedi de 8h à 19h)
  - ✉️ Email : \`p2m.senegal@gmail.com\`
• **SB-S Logistik (Engins & Transport lourd) :**
  - 📞 Contact direct : **+221 77 858 61 05**
• **Direction générale & Siège :**
  - ✉️ Email : \`contact@magatteniang-expert.sn\`

⏱️ **Engagement de délai garanti :** Proposition chiffrée sous 24h à 48h ouvrées avec conseil technique d'un ingénieur référent.
Vous pouvez également utiliser notre **assistant de qualification en ligne** en 2 minutes pour recevoir une cotation directe.`,
    sources: [
      { title: 'Charte d\'engagement de service 24h-48h', ref: 'ENG-DELAI-2026', link: '/contact' }
    ],
    suggestedAction: { label: 'Démarrer le chiffrage en ligne', href: '/assistant' }
  },

  // --- MAGATTE NIANG (PERSONNALITÉ & FONDATION) ---
  {
    id: 'magatte-niang-expert',
    keywords: [
      'magatte', 'niang', 'qui est magatte', 'directeur', 'professeur', 'enseignant',
      'fondateur', 'expert btp', 'parcours magatte', 'biographie', 'ingenieur génie civil'
    ],
    title: 'L\'Ingénieur Magatte Niang — Fondateur & Dirigeant',
    answer: `Magatte Niang est Ingénieur en Génie Civil, Enseignant-Chercheur, Professeur d'ingénierie et Expert BTP assermenté.

Avec plus de 20 ans d'expérience dans les grands travaux d'infrastructures, d'ouvrages d'art et de métallurgie au Sénégal, il a structuré cet écosystème intégré pour réunir l'ingénierie de conception, la charpente métallique (SERMA BTP), le contrôle de laboratoire (SB-S Labo), la production de béton (SB-S Industries), la logistique lourde (SB-S Logistik) et les matériaux de finition (P2M).

Il conseille les maîtres d'ouvrage publics et privés sur les arbitrages techniques complexes, la conformité Eurocodes et l'optimisation des coûts de construction.`,
    sources: [
      { title: 'Notice biographique & titres d\'expertise', ref: 'EXP-MN-2026', link: '/profil' },
      { title: 'Plaquette institutionnelle Magatte Niang Expert', ref: 'PLA-CORP-2026', link: '/docs/plaquette' }
    ],
    suggestedAction: { label: 'Découvrir le profil de Magatte Niang', href: '/profil' }
  }
];

/**
 * Moteur de recherche sémantique robuste, tolérant aux fautes, accents et requêtes conversationnelles
 */
export function queryKnowledgeBase(queryText: string): {
  text: string;
  sources: { title: string; ref: string; link?: string }[];
  suggestedAction?: { label: string; href: string };
} {
  const normQ = normalizeQuery(queryText);
  if (!normQ) {
    return {
      text: AI_KNOWLEDGE_BASE[0].answer,
      sources: AI_KNOWLEDGE_BASE[0].sources,
      suggestedAction: AI_KNOWLEDGE_BASE[0].suggestedAction
    };
  }

  const queryWords = normQ.split(' ').filter(w => w.length > 2);

  let bestTopic: KnowledgeTopic | null = null;
  let highestScore = 0;

  for (const topic of AI_KNOWLEDGE_BASE) {
    let score = 0;

    for (const rawKw of topic.keywords) {
      const normKw = normalizeQuery(rawKw);

      // Exact phrase match
      if (normQ.includes(normKw)) {
        score += normKw.length > 5 ? 5 : 3;
      } else {
        // Individual word match
        const kwWords = normKw.split(' ');
        for (const kwWord of kwWords) {
          if (kwWord.length > 3 && queryWords.includes(kwWord)) {
            score += 2;
          }
        }
      }
    }

    // Title match boost
    const normTitle = normalizeQuery(topic.title);
    for (const qw of queryWords) {
      if (normTitle.includes(qw) && qw.length > 3) {
        score += 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // Any match with positive score returns the curated expert topic
  if (bestTopic && highestScore >= 2) {
    return {
      text: bestTopic.answer,
      sources: bestTopic.sources,
      suggestedAction: bestTopic.suggestedAction
    };
  }

  // Fallback chaleureux, constructif et immédiatement exploitable
  return {
    text: `Je suis là pour vous apporter toutes les réponses techniques et commerciales sur l'écosystème Magatte Niang au Sénégal.

Voici nos principaux pôles d'activité :
1. **Carrelages & Sanitaires P2M (Mbao)** : Porcelaine 60×60 (5 500–6 000 F), 40×40 (4 000–5 500 F), 30×30 (3 000–3 500 F), 60×120 vitrifié (7 500–8 500 F), dalles 80×240, WC suspendus ESTA, lavabos Partas/Rosen, robinetterie HKI.
2. **Charpente Métallique SERMA BTP** : Usinage acier 4 500 T/an, hangars industriels, portées libres > 42m sans poteau intermédiaire.
3. **Laboratoire SB-S Labo** : Essais de sol CBR 4j immersion, Proctor, écrasement béton 3 000 kN, pénétromètre dynamique.
4. **Béton & Agglos SB-S Industries** : Centrale BPE 250 m³/j, agglos creux 10×20×40 à 300 FCFA HT / pièce, hourdis.
5. **Location d'Engins SB-S Logistik** : Grues 50T (500 000 F/j), camions-grues 6T (100 000 F/j), tractopelles (120 000 F/j) — contact direct : 77 858 61 05.
6. **Chiffrage & Devis** : Réponse sous 24h–48h ouvrées ou appel direct à nos ingénieurs au +221 33 832 40 10.

Sur quel sujet précis souhaitez-vous des précisions pour votre chantier ?`,
    sources: [
      { title: 'Plaquette institutionnelle écosystème Magatte Niang', ref: 'PLA-CORP-2026', link: '/docs/plaquette' },
      { title: 'Charte d\'engagement de service 24h-48h', ref: 'ENG-DELAI-2026', link: '/contact' }
    ],
    suggestedAction: { label: 'Démarrer le chiffrage de mon projet', href: '/assistant' }
  };
}
