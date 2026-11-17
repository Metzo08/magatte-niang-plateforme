/**
 * Moteur de Connaissances Hybride de l'Assistant IA Technique BTP
 * Écosystème Magatte Niang Expert :
 *  1. SERMA BTP (Bureau d'études, modélisation 3D/BIM, charpente métallique, AMO)
 *  2. SB-S Group (Stein Bauer Sénégal Group · Génie civil, grands travaux, VRD, ouvrages d'art)
 *  3. SB-S Labo (Laboratoire géotechnique & matériaux agréé LNR-BTP Catégories C2 et A3)
 *  4. SB-S Industries (Centrale à béton 60 m³/h, agglos creux/pleins, hourdis, pavés, pondeuse QT40-3A)
 *  5. SB-S Logistik (Flotte de 82 engins lourds, grues 50T, camions-grues 6T, bennes 40T, agrégats)
 *  6. P2M (Polytech Matériaux & Matériels · Showroom carrelage, sanitaire, robinetterie, faïence & mosaïque)
 *  7. PGT (Polytech General Trading · Sourcing international Dubaï - Ajman & Inde, fret maritime & transit PAD)
 */

import {
  ENTITIES,
  FOUNDER_PROFILE,
  PROJECTS,
  PRODUCTS_P2M,
  LAB_TESTS,
  EQUIPMENTS,
  LOGISTIK_MATERIALS,
  CENTRALE_BETON_PRICES,
  PUBLICATIONS,
} from '@/data/initialData';
import { DEFAULT_SBS_PRODUCTS } from '@/lib/sbsErpDefaults';
import { INITIAL_TILE_CATALOG } from '@/data/tileCatalog';
import { SOCIAL_LINKS } from '@/data/socialLinks';

export interface KnowledgeTopic {
  id: string;
  entityId?: string;
  keywords: string[];
  title: string;
  answer: string;
  sources: { title: string; ref: string; link?: string }[];
  suggestedAction?: { label: string; href: string };
  followUpQuestions?: string[];
}

export interface KnowledgeQueryResult {
  text: string;
  sources: { title: string; ref: string; link?: string }[];
  suggestedAction?: { label: string; href: string };
  followUpQuestions?: string[];
  matchedEntityIds?: string[];
}

export function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[×x*]/g, 'x')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Dictionnaire d'expansion de synonymes, fautes courantes, abréviations et termes Wolof/Anglais
 */
const SYNONYM_MAP: Record<string, string[]> = {
  'carrelage': ['carreau', 'carreaux', 'carrelages', 'carlage', 'carelage', 'porcelaine', 'ceramique', 'gres', 'dalle', 'dalles', 'faience', 'mosaique', 'tile', 'tiles', 'calacatta', 'sathvario', 'alaska'],
  'sanitaire': ['sanitaires', 'wc', 'toilette', 'toilettes', 'lavabo', 'lavabos', 'vasque', 'vasques', 'baignoire', 'douche', 'receveur', 'chaise anglaise', 'chaise turque', 'esta', 'partas', 'rosen', 'exelon'],
  'robinetterie': ['robinet', 'robinets', 'mitigeur', 'mitigeurs', 'evier', 'hki', 'plomberie', 'siphon', 'pex', 'colonne de douche'],
  'serma': ['serma btp', 'sermabtp', 'charpente', 'charpentes', 'charpante', 'metallique', 'metal', 'acier', 'hangar', 'hangars', 'bim', 'modelisation', 'pylone', 'station service', 'igh', 'amo', 'maitrise d oeuvre', 'eurocode', 'eurocodes', 'tekla', 'robot'],
  'sbs group': ['sbsgroup', 'stein bauer', 'genie civil', 'ouvrage d art', 'ouvrages d art', 'travaux publics', 'vrd', 'dallage', 'soutenement', 'oumou diop', 'oumou', 'bureau des methodes'],
  'sbs labo': ['sbslabo', 'labo', 'laboratoire', 'geotechnique', 'geoteknik', 'etude de sol', 'sol', 'sols', 'cbr', 'proctor', 'atterberg', 'ecrasement', 'eprouvette', 'penetrometre', 'pdl', 'carottage', 'apafor', 'casagrande', 'oedometre', 'aminata drame', 'aminata', '70 835 00 63', '708350063', 'ablaye', 'ablaye niang', 'abdoulaye niang', 'abdoulaye', 'c2', 'a3', 'lnr btp'],
  'sbs industries': ['sbs industrie', 'sbsindustrie', 'sbsindustries', 'agglo', 'agglos', 'parpaing', 'parpaings', 'brique', 'briques', 'hourdis', 'pave', 'paves', 'bordure', 'bpe', 'centrale a beton', 'pondeuse', 'qt40', 'salimata sow', 'salimata'],
  'sbs logistik': ['sbslogistik', 'logistik', 'logistique', 'engin', 'engins', 'grue', 'grues', 'camion', 'camions', 'benne', 'bennes', 'tractopelle', 'dumper', 'nacelle', 'compacteur', 'plaque vibrante', 'toupie', 'betonniere', 'pompe a beton', 'groupe electrogene', 'echafaudage', 'etais', 'coffrage', 'rokhaya kane', 'rokhaya', 'sable', 'gravier', 'basalte', 'ciment', 'brouette'],
  'p2m': ['polytech materiaux', 'showroom', 'showroom mbao', 'finitions', 'finition'],
  'pgt': ['polytech general trading', 'polytech global trading', 'sourcing', 'import', 'importation', 'transit', 'fret', 'conteneur', 'conteneurs', 'dedouanement', 'dubai', 'ajman', 'inde', '971 52 763 1629', '971527631629'],
  'entites': ['entite', 'filiale', 'filiales', '7 entites', 'sept entites', 'groupe', 'ecosysteme', 'organigramme', 'toutes les entites', 'piliers', '7 piliers'],
  'prix': ['tarif', 'tarifs', 'cout', 'combien', 'devis', 'chiffrage', 'facture', 'budget', 'naata', 'nyaata', 'price', 'cost', 'quote'],
  'contact': ['telephone', 'numero', 'whatsapp', 'email', 'mail', 'adresse', 'localisation', 'gps', 'carte', 'ou trouver', 'horaire', 'horaires', 'rdv', 'rendez vous'],
  'bonjour': ['salut', 'bonsoir', 'salam', 'assalam', 'aleikoum', 'nanga def', 'hello', 'hi', 'hey', 'coucou'],
};

/**
 * Distance de Levenshtein rapide pour tolérance aux fautes de frappe
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (Math.abs(a.length - b.length) > 2) return 3;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

function expandQueryWithSynonyms(normQ: string): string {
  let expanded = normQ;
  const words = normQ.split(' ');
  for (const [canonical, variants] of Object.entries(SYNONYM_MAP)) {
    for (const v of variants) {
      const normV = normalizeQuery(v);
      if (normQ.includes(normV)) {
        expanded += ` ${canonical}`;
        break;
      }
      // Fuzzy check on single words >= 5 chars
      if (!normV.includes(' ') && normV.length >= 5) {
        for (const w of words) {
          if (w.length >= 5 && levenshtein(w, normV) <= 1) {
            expanded += ` ${canonical} ${normV}`;
            break;
          }
        }
      }
    }
  }
  return expanded;
}

export const AI_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // ============================================================================
  // 0. VUE D'ENSEMBLE DES 7 ENTITÉS & SYNERGIE GLOBALE DE L'ÉCOSYSTÈME
  // ============================================================================
  {
    id: 'ecosysteme-7-entites-overview',
    keywords: [
      '7 entites', 'sept entites', 'toutes les entites', 'entites', 'filiales',
      'ecosysteme', 'groupe magatte niang', 'presentation generale', '7 piliers',
      'organigramme', 'qui fait quoi', 'difference entre', 'synergie', 'synergies'
    ],
    title: 'Les 7 Entités de l\'Écosystème Magatte Niang Expert & Leur Synergie',
    answer: `L'écosystème **Magatte Niang Expert** regroupe **7 entités complémentaires** qui maîtrisent 100 % de la chaîne de valeur BTP au Sénégal et à l'international :

1. **SERMA BTP (Études, Modélisation 3D/BIM & Charpente Métallique)** :
   - **Rôle :** Bureau d'études techniques (RC : SN DKR-2012-B-2619, créé en 2012), modélisation logicielle 3D/BIM (Robot, Tekla, Revit), pylônes, stations-service, charpentes métalliques (> 42 m de portée libre, 4 500 T/an), immeubles IGH, ouvrages hydrauliques, maîtrise d'œuvre (AMO / supervision).
   - **Contact :** **+221 78 832 12 79** · \`serma@sermabtp.com\` / \`sermabtp@gmail.com\` · Dirigé par **Magatte Niang**.

2. **SB-S Labo (Laboratoire Géotechnique & Contrôle Matériaux · Agréé C2 & A3)** :
   - **Rôle :** Études de sol en amont (Catégorie C2 : CBR, Proctor, Atterberg (appareil de Casagrande), cisaillement direct, œdomètre, pénétromètre dynamique PDL, carottage APAFOR 450RS) et essais sur bétons/granulats (Catégorie A3 : écrasement sous presse 3 000 kN, cône d'Abrams, scléromètre). Émission des PV en **24h**.
   - **Contact :** NINEA : 008501141 2E2 · RC : SN DKR 2021 B 12675 · Tél : **+221 33 872 06 78 / +221 77 321 78 60 / +221 70 835 00 63** · Directrice Technique **Aminata Dramé** · Responsable Laboratoire **Abdoulaye Niang** · \`sbslabo15@gmail.com\`.

3. **SB-S Group (Stein Bauer Sénégal Group · Génie Civil, Grands Travaux & Industrie)** :
   - **Rôle :** Exécution des travaux de génie civil lourd, ouvrages d'art, dallages industriels, murs de soutènement, VRD et bâtiments clés en main à partir des études de SB-S Labo et des modèles 3D de SERMA BTP. Doté d'un Bureau des Méthodes intégré.
   - **Contact :** DG **Magatte Niang** · Responsable **Oumou DIOP (+221 77 203 84 38)** · Standard : **+221 33 871 08 61** · \`contact@sbsgroup.sn\` · Mbao Villeneuve Villa S04.

4. **SB-S Industries (Centrale à Béton 60 m³/h & Préfabrication Béton)** :
   - **Rôle :** Production industrielle en ZFI de Mbao : Béton Prêt à l'Emploi (C15 à C30 : 62 000 à 77 000 F/m³), Agglos creux (10 à 20 cm : 380 à 590 F), Agglos pleins (15 et 20 cm : 700 et 850 F), Hourdis (12 à 25 cm : 450 à 750 F), Pavés (6, 8, 10 cm : 6 750 à 9 000 F/m²) sur pondeuse automatique QT40-3A.
   - **Contact :** Responsable **Salimata SOW** · **+221 77 566 48 06 / +221 33 871 08 61** · \`wsbsindustrie2021@gmail.com\`.

5. **SB-S Logistik (Parc de 82 Engins Lourds, Grues, Transport & Agrégats)** :
   - **Rôle :** Location d'engins avec opérateur et maintenance 24/7 (Grue mobile 50T à 500 000 F/j, Camion-grue 6T à 100 000 F/j, Tractopelle à 120 000 F/j, Pompe à béton à 400 000 F/j, Bennes 40T, Groupes électrogènes 150 KVA, Échafaudages, Étais, Coffrages) et vente de sable, gravier basalte et ciment.
   - **Contact :** Responsable **Rokhaya KANE** · WhatsApp **+221 77 858 61 05** · \`rokhayakane.sbs@gmail.com\`.

6. **P2M (Polytech Matériaux & Matériels · Showroom Carrelage, Sanitaire & Robinetterie)** :
   - **Rôle :** Showroom à Mbao Ville Neuve (Villa S04) structuré en 4 blocs : **Bloc Carrelage** (30×30 dès 3 000 F/m², 40×40 dès 4 500 F/m², 60×60 dès 6 000 F/m², 60×120 dès 8 000 F/m², dalles 80×240 à 30 000 F/plaque), **Bloc Sanitaire** (WC suspendu ESTA 2011, chaise anglaise, lavabos Partas/Rosen, baignoire SFS-4 Delux), **Bloc Robinetterie & Accessoires** (HKI, AS-105, PEX), **Bloc Faïence & Mosaïque**.
   - **Contact :** **+221 78 832 12 79 / +221 78 424 64 45 / +221 77 827 08 18** · \`p2m.senegal@gmail.com\`.

7. **PGT (Polytech General Trading · Sourcing International Dubaï - Ajman & Inde)** :
   - **Rôle :** Centrale d'achat internationale, sourcing direct usines certifiées ISO (Inde, Dubaï/Ajman, Turquie, Europe), fret maritime conteneurisé (FCL 20-25j, LCL 25-30j), assurance cargo 100 % et dédouanement express au Port Autonome de Dakar (PAD). Économies de 15 à 30 %.
   - **Contact :** WhatsApp Dubaï - Ajman : **+971 52 763 1629** (https://wa.me/971527631629) · \`pgt.senegal@gmail.com\`.

**Le flux de synergie intégré :**
**SB-S Labo** sonde et certifie le sol → **SERMA BTP** modélise l'ouvrage en 3D/BIM → **SB-S Group** exécute le génie civil → **SB-S Industries** fournit le béton BPE et les agglos → **SB-S Logistik** déploie les grues et engins → **PGT** importe les matériaux → **P2M** habille le bâtiment en carrelage et sanitaires.`,
    sources: [
      { title: 'Plaquette institutionnelle Écosystème 2026', ref: 'PLA-CORP-2026', link: '/entites' },
      { title: 'Matrice des synergies inter-entités', ref: 'SYN-GRP-2026', link: '/entites#synergies' }
    ],
    suggestedAction: { label: 'Explorer les 7 entités du groupe', href: '/entites' },
    followUpQuestions: [
      'Quels sont les tarifs des carreaux et sanitaires P2M ?',
      'Quels sont les prix du béton et des agglos chez SB-S Industries ?',
      'Comment contacter les responsables de chaque entité ?'
    ]
  },

  // ============================================================================
  // 1. SERMA BTP (BUREAU D'ÉTUDES, MODÉLISATION 3D/BIM, CHARPENTE & AMO)
  // ============================================================================
  {
    id: 'serma-btp-complet',
    entityId: 'serma-btp',
    keywords: [
      'serma', 'serma btp', 'charpente', 'charpentes', 'metal', 'metallique', 'acier',
      'hangar', 'hangars', 'entrepot', 'toiture', 'portee', 'chaudronnerie', 'structure',
      'soudage', 'plasma', 'oxycoupage', 'galvanisation', 'modelisation', 'bim', 'revit',
      'tekla', 'robot structural', 'autocad', 'pylone', 'pylones', 'station service',
      'vivo energy', 'shell', 'igh', 'amo', 'maitrise d oeuvre', 'supervision',
      'ouvrages hydrauliques', 'lots techniques', 'ubipharm', 'eurocode 3'
    ],
    title: 'SERMA BTP · Bureau d\'Études 3D/BIM, Charpente Métallique & Maîtrise d\'Œuvre',
    answer: `**SERMA BTP** (créée en 2012, RC : SN DKR-2012-B-2619, dirigée par **Magatte Niang**) est le pôle d'ingénierie, de modélisation logicielle 3D/BIM, de charpente métallique et de maîtrise d'œuvre de l'écosystème :

• **Les 8 pôles d'expertise de SERMA BTP :**
  1. **Modélisation 3D/BIM & Calcul structurel** (Autodesk Robot Structural Analysis, Tekla Structures, Revit BIM, AutoCAD) aux normes Eurocodes (1, 2, 3, 4, 7, 8) et règles CM66.
  2. **Charpente métallique industrielle** : capacité d'usinage de **4 500 tonnes d'acier/an**, découpe plasma 3D CNC, soudage certifié ISO 3834 / EN 1090, portées libres **> 42 mètres sans poteau intermédiaire**, galvanisation à chaud et peinture anticorrosion marine C4/C5.
  3. **Pylônes télécoms & électriques** : dimensionnement au vent sahélien, fabrication et montage en hauteur.
  4. **Stations-service & auvents pétroliers** : conception et préfabrication d'auvents métalliques conformes ATEX/HSE (références **VIVO Energy / Shell** à Fatick, Sandiara, Touba Toul, Dakar).
  5. **Bâtiments & Immeubles de Grande Hauteur (IGH)** : structures mixtes acier-béton, descentes de charges et contreventement sismique (ex. ossature métallique R+9 à Dakar).
  6. **Maîtrise d'œuvre (MOE), AMO & Supervision** : contrôle d'exécution, phasage, audit structurel et suivi de chantier.
  7. **Ouvrages hydrauliques** : châteaux d'eau, bassins de rétention, réseaux d'adduction et drainage.
  8. **Lots techniques** : CVC, sécurité incendie, réseaux fluides et électricité industrielle.

• **Synergie clé :** SERMA BTP s'appuie sur les études géotechniques de **SB-S Labo** pour caler ses modèles 3D avant de confier l'exécution des travaux à **SB-S Group**.
• **Références majeures :** Hangar pharmaceutique **UBIPHARM** Diamniadio (2 800 m², 62 T d'acier, portée libre 42 m), Hangar **PAD / APROSI** Diamniadio (38 T, portée 36 m), Réseau stations **VIVO Energy / Shell** (46 T), Immeuble **R+9 Dakar** (85 T).
• **Contact direct :** Tél / WhatsApp **+221 78 832 12 79** · Standard : **+221 33 832 40 10** · Emails : \`serma@sermabtp.com\` / \`sermabtp@gmail.com\`.`,
    sources: [
      { title: 'Fiche officielle de l\'entité SERMA BTP', ref: 'FT-SERMA-2026', link: '/entites/serma-btp' },
      { title: 'Étude de cas Hangar UBIPHARM 2 800 m² (42m libre)', ref: 'CAS-UBI-2023', link: '/projets/hangar-industriel-stockage-pharmaceutique-ubipharm-2800m2' }
    ],
    suggestedAction: { label: 'Découvrir la page SERMA BTP', href: '/entites/serma-btp' },
    followUpQuestions: [
      'Quelles sont les réalisations de SERMA BTP en charpente métallique ?',
      'Comment SERMA BTP travaille avec SB-S Labo et SB-S Group ?',
      'Je souhaite chiffrer un hangar métallique ou une étude BIM'
    ]
  },

  // ============================================================================
  // 2. SB-S GROUP (STEIN BAUER SÉNÉGAL GROUP · GÉNIE CIVIL & GRANDS TRAVAUX)
  // ============================================================================
  {
    id: 'sbs-group-genie-civil-travaux',
    entityId: 'sbs-group',
    keywords: [
      'sbs group', 'stein bauer', 'genie civil', 'ouvrages d art', 'travaux publics',
      'bureau des methodes', 'sendou', 'richard toll', 'css', 'lafarge', 'lafargeholcim',
      'port autonome', 'pad', 'concassage', 'mako', 'kaffrine', 'vrd', 'dallage',
      'soutenement', 'oumou diop', 'oumou', '33 871 08 61', '77 203 84 38', '77 500 44 22'
    ],
    title: 'SB-S Group (Stein Bauer Sénégal) · Génie Civil, Grands Travaux & Industrie',
    answer: `**SB-S Group (Stein Bauer Sénégal Group)**, fondé en 2016, est l'entité d'exécution des grands travaux de génie civil, d'ouvrages d'art, de VRD et d'infrastructures industrielles au Sénégal et en Afrique de l'Ouest.

• **Direction & Contacts :**
  - **Directeur Général :** Magatte NIANG
  - **Responsable SBS-GROUP :** **Oumou DIOP** (WhatsApp : **+221 77 203 84 38**)
  - **Standard Siège :** **+221 33 871 08 61** · WhatsApp commercial : **+221 77 500 44 22** · Email : \`contact@sbsgroup.sn\`
  - **Adresse :** Mbao Villeneuve, Villa S04, Route Nationale (proximité immédiate ZFI de Mbao, Plus Code : \`PMX9+CHV, Dakar\`).

• **Forces techniques & Bureau des Méthodes :**
  - **Bureau des Méthodes intégré** : plans d'exécution aux Eurocodes (2, 3, 4, 7), phasage optimisé, métrés rigoureux.
  - **Exécution coordonnée** : réalise les travaux à partir des études de sol de **SB-S Labo** et de la modélisation 3D/BIM de **SERMA BTP**, avec le béton/agglos de **SB-S Industries**, la flotte d'engins de **SB-S Logistik** et les finitions de **P2M**.

• **10+ Références industrielles majeures vérifiées :**
  1. **Centrale électrique de Sendou (CES)** : Bâtiment de stockage de produits chimiques, cuvelage étanche et charpente de toiture (2025).
  2. **Compagnie Sucrière Sénégalaise (CSS - Richard Toll)** : Réhausse métallique de hangar industriel (3 500 m², 42 T d'acier, +30 % de capacité).
  3. **LafargeHolcim Côte d'Ivoire (Abidjan)** : Extension de la ligne de production cimentière et hangar clinker (750 m³ béton, 110 T acier, 0 accident LTI).
  4. **Port Autonome de Dakar (PAD)** : Construction du bâtiment administratif des sous-traitants maritimes (1 450 m²).
  5. **DLM Sénégal (Mako, Kédougou)** : Ingénierie civile, électrique et mécanique de l'usine d'oxygène PSA 6 T/jour & puisard minier de 9 m de profondeur.
  6. **Carrière SOCOCIM (Thiès)** : Construction des bureaux d'exploitation et massifs du 2e concasseur industriel.
  7. **Mur de soutènement carrière de concassage (Thiès)** : 520 m³ de béton armé grande hauteur avec redans et barbacanes.
  8. **SECAA SA & Gorée Offshore (Dakar)** : Aire de lavage poids lourds, 12 000 m² de dallages industriels au quartz, caniveaux VRD et fosses septiques.
  9. **Complexe sportif de Kaffrine** : Gradins béton armé de 1 200 places et restaurant municipal panoramique.
  10. **OIM Sénégal (Société Générale des Travaux)** : Infrastructures et bâtiments d'accueil aux normes internationales.`,
    sources: [
      { title: 'Présentation Institutionnelle SB-S Group', ref: 'PRES-SBS-2026', link: '/entites/sbs-group' },
      { title: 'Répertoire des Réalisations & Grands Travaux', ref: 'CAT-PROJ-2026', link: '/projets' }
    ],
    suggestedAction: { label: 'Voir la fiche et les projets SB-S Group', href: '/entites/sbs-group' },
    followUpQuestions: [
      'Parlez-moi du projet de la Centrale de Sendou ou de LafargeHolcim',
      'Comment contacter Oumou Diop chez SB-S Group ?',
      'Quelles sont les capacités de SB-S Labo pour les études de sol ?'
    ]
  },

  // ============================================================================
  // 3. SB-S LABO (GÉOTECHNIQUE, ÉTUDES DE SOL & AGRÉMENTS C2 / A3)
  // ============================================================================
  {
    id: 'sbs-labo-geotechnique',
    entityId: 'sbs-labo',
    keywords: [
      'labo', 'sbs labo', 'laboratoire', 'cbr', 'sol', 'sols', 'geotechnique',
      'sondage', 'sondages', 'proctor', 'eprouvette', 'eprouvettes', 'compression',
      'ecrasement', 'presse', 'atterberg', 'pdl', 'penetrometre', 'densite',
      'portance', 'laterite', 'argile', 'nf p 94 078', 'nf en 12390', 'c2', 'a3',
      'agrement', 'lnr btp', 'aminata drame', 'aminata', '70 835 00 63', '708350063',
      'ablaye', 'ablaye niang', 'abdoulaye niang', 'abdoulaye', '77 321 78 60',
      'apafor', 'carottage', 'casagrande', 'oedometre', 'sclerometre', 'abrams',
      'equivalent de sable', 'bleu de methylene', 'granulometrie', 'foundiougne'
    ],
    title: 'SB-S Labo · Laboratoire Agréé LNR-BTP (Catégories C2 & A3) · Études de Sol & Bétons',
    answer: `**SB-S Labo** (créé en 2021, RC : SN DKR 2021 B 12675) est le laboratoire géotechnique et d'essais matériaux de l'écosystème, avec **Aminata Dramé** comme **Directrice Technique** (+221 70 835 00 63) et **Abdoulaye Niang** comme **Responsable Laboratoire pour les essais** (+221 77 321 78 60).

• **Agréments officiels & Conformité :**
  - Agréé **Catégorie C2** (Domaine C : Ingénierie des sols et fondations) et **Catégorie A3** (Domaine A : Matériaux de construction et bétons hydrauliques) selon le référentiel **LNR-BTP** (Loi n° 2023-12 du 21 juin 2023 et Décret n° 2023-1780 du 29 août 2023).
  - Parc matériel **100 % certifié et étalonné**, plus de **380+ projets** contrôlés et émission des procès-verbaux (PV) standards en **24 heures**.

• **Catalogue des essais normalisés :**
  1. **Domaine C (Catégorie C.2 · Sols & Fondations) :**
     - Identification : Teneur en eau, Granulométrie par tamisage et densimétrie, **Limites d'Atterberg (appareil de Casagrande) WL/WP** (NF P 94-051, 5 kg de sol, délai 3j), Valeur au bleu de méthylène, Équivalent de sable.
     - Mécanique des sols : Cisaillement direct rectiligne rectiligne, Essai **œdométrique** par paliers (tassement/gonflement).
     - Sondages in-situ : **Pénétromètre dynamique lourd (PDL)** jusqu'à 15 m (NF P 94-115, PV sous 2j), Sondage carotté à la foreuse **APAFOR 450RS** jusqu'à 45 m, essais pressiométriques Ménard.
  2. **Domaine B (Géotechnique routière) :**
     - **Essai CBR immersion 4 jours & IPI** (NF P 94-078 / AASHTO T193, 50 kg de sol, PV sous 5j).
     - **Essai Proctor Normal et Modifié** (NF P 94-093, 30 kg de sol, PV sous 3j), compacité in-situ au gammadensimètre et essai à la plaque (EV2).
  3. **Domaine A (Catégorie A.3 · Bétons hydrauliques & Granulats) :**
     - **Écrasement d'éprouvettes béton (16×32 ou 15×15) à 7j, 14j et 28j** sous **presse hydraulique asservie 3 000 kN** (NF EN 12390-3, PV sous 2j).
     - Affaissement au **cône d'Abrams**, formulation de bétons (C20/25 à C35/45), granularité et coefficient d'aplatissement des granulats.
  4. **Domaine D (Auscultation d'ouvrages) :** Scléromètre, carottage sur béton durci et diagnostic structurel.

• **Références majeures :** Pont de Foundiougne (1 200 éprouvettes béton contrôlées), Autoroute Mbour-Fatick-Kaolack (450 essais CBR/Proctor sur 65 km), Tour R+16 SICAP Plateau (8 forages carottés à 45 m), Plateforme Diamniadio (24 forages & PDL).
• **Contacts directs SB-S Labo :**
  - **Directrice Technique :** **Aminata Dramé** · Tél & WhatsApp : **+221 70 835 00 63**
  - **Responsable Laboratoire (pour les essais) :** **Abdoulaye Niang** · Tél & WhatsApp : **+221 77 321 78 60**
  - **Email :** \`sbslabo15@gmail.com\`.`,
    sources: [
      { title: 'Catalogue officiel des essais SB-S Labo (C2 & A3)', ref: 'CAT-LABO-2026', link: '/services/laboratoire' },
      { title: 'Fiche de l\'entité SB-S Labo', ref: 'ENT-LABO-2026', link: '/entites/sbs-labo' }
    ],
    suggestedAction: { label: 'Commander un essai ou une étude de sol', href: '/services/laboratoire' },
    followUpQuestions: [
      'Quel échantillon faut-il pour un essai CBR ou Proctor ?',
      'Comment contacter Aminata Dramé ou Abdoulaye Niang pour un essai au laboratoire ?',
      'Quelles sont les références de SB-S Labo sur le Pont de Foundiougne ?'
    ]
  },

  // ============================================================================
  // 4. SB-S INDUSTRIES (BÉTON PRÊT À L'EMPLOI, AGGLOS, HOURDIS & PAVÉS)
  // ============================================================================
  {
    id: 'sbs-industries-beton-agglos',
    entityId: 'sbs-industries',
    keywords: [
      'sbs industries', 'sbs industrie', 'beton', 'bpe', 'centrale a beton',
      'agglo', 'agglos', 'parpaing', 'parpaings', 'brique', 'briques', 'hourdis',
      'bordure', 'bordures', 'pave', 'paves', 'prefabrication', '380', '400',
      '475', '590', '700', '850', 'toupie', 'malaxeur', 'c15', 'c20', 'c25', 'c30',
      'qt40', 'pondeuse', 'salimata sow', 'salimata', '77 566 48 06', 'ac10',
      'ac12', 'ac15', 'ac20', 'ap15', 'ap20', 'hd12', 'hd16', 'hd20', 'hd25'
    ],
    title: 'SB-S Industries · Centrale à Béton 60 m³/h, Agglos, Hourdis & Pavés (Grille Officielle)',
    answer: `**SB-S Industries** est l'unité industrielle de préfabrication béton et de Béton Prêt à l'Emploi (BPE) située à la **Zone Franche Industrielle (ZFI) de Mbao, Dakar**, dirigée par **Salimata SOW**.

• **Contact direct & Commandes :**
  - **Responsable :** **Salimata SOW** · Tél & WhatsApp : **+221 77 566 48 06** / Standard : **+221 33 871 08 61**
  - **Email :** \`wsbsindustrie2021@gmail.com\` · Livraison par camions-grues et toupies partout à Dakar, Diamniadio, Thiès et Mbour.

• **1. Agglos Creux (calibrés sur pondeuse automatique QT40-3A) :**
  - **Agglo creux 10×20×40 cm (AC10) :** **380 FCFA / pièce** (cloisons, façades non porteuses)
  - **Agglo creux 12×20×40 cm (AC12) :** **400 FCFA / pièce** (clôtures, maçonneries courantes)
  - **Agglo creux 15×20×40 cm (AC15) :** **475 FCFA / pièce** (murs extérieurs, refends, bâtiments R+)
  - **Agglo creux 20×20×40 cm (AC20) :** **590 FCFA / pièce** (façades principales, soubassements)

• **2. Agglos Pleins Haute Résistance (fondations & murs porteurs) :**
  - **Agglo plein 15×20×40 cm (AP15) :** **700 FCFA / pièce** (fondations, soubassements, zones humides)
  - **Agglo plein 20×20×40 cm (AP20) :** **850 FCFA / pièce** (fondations fortes charges, soutènements, 31,7 kg/u)

• **3. Hourdis Béton pour Dalles & Planchers (longueur 50 cm) :**
  - **Hourdis 12 (12×20×50 cm · HD12) :** **450 FCFA / pièce**
  - **Hourdis 16 (16×20×50 cm · HD16) :** **580 FCFA / pièce**
  - **Hourdis 20 (20×20×50 cm · HD20) :** **650 FCFA / pièce**
  - **Hourdis 25 (25×20×50 cm · HD25) :** **750 FCFA / pièce**

• **4. Pavés Autobloquants Haute Densité (prix au m²) :**
  - **Pavés 6 cm (PAV6 · cours, allées piétonnes, voiries légères) :** **6 750 FCFA / m²**
  - **Pavés 8 cm (PAV8 · voies urbaines, parkings VL/PL) :** **7 750 FCFA / m²**
  - **Pavés 10 cm (PAV10 · charges lourdes, ports, stations-service) :** **9 000 FCFA / m²**

• **5. Béton Prêt à l'Emploi (BPE · Centrale automatisée 60 m³/h) :**
  - **Classe C15 (béton de propreté, massifs non armés) :** **62 000 – 65 000 FCFA / m³**
  - **Classe C20 (dallages, chaînages, planchers courants) :** **65 000 – 68 000 FCFA / m³**
  - **Classe C25 (fondations, poteaux, poutres, voiles) :** **71 000 – 73 000 FCFA / m³**
  - **Classe C30 (ouvrages d'art, dallages industriels lourds) :** **75 000 – 77 000 FCFA / m³**`,
    sources: [
      { title: 'Catalogue & Tarifs Officiels SB-S Industries Mbao', ref: 'TAR-IND-2026', link: '/entites/sbs-industries' },
      { title: 'Grille Centrale à Béton 60 m³/h', ref: 'BPE-SBS-2026', link: '/entites/sbs-industries' }
    ],
    suggestedAction: { label: 'Commander sur la page SB-S Industries', href: '/entites/sbs-industries' },
    followUpQuestions: [
      'Combien coûtent 1 000 agglos creux 15×20×40 ?',
      'Quel est le prix pour 30 m³ de béton C25 ?',
      'Comment contacter Salimata Sow chez SB-S Industries ?'
    ]
  },

  // ============================================================================
  // 5. SB-S LOGISTIK (82 ENGINS LOURDS, GRUES, TRANSPORT, COFFRAGES & AGRÉGATS)
  // ============================================================================
  {
    id: 'sbs-logistik-flotte-engins',
    entityId: 'sbs-logistik',
    keywords: [
      'engin', 'engins', 'grue', 'grues', 'camion', 'camions', 'benne', 'bennes',
      'tractopelle', 'tractopelles', 'dumper', 'dumpers', 'pelle', 'pelles',
      'logistik', 'sbs logistik', 'location', 'levage', 'manutention', 'fret lourd',
      '77 858 61 05', 'rokhaya', 'rokhaya kane', 'prix grue', 'tarif engin',
      'tarif grue', 'nacelle', 'compacteur', 'plaque vibrante', 'pompe a beton',
      'aquarius', 'venus', 'auto betonniere', 'betonniere', 'groupe electrogene',
      '150 kva', '5 kva', 'echafaudage', 'etais', 'coffrage', 'sable', 'gravier',
      'basalte', 'ciment', 'brouette', 'tata', 'plateau'
    ],
    title: 'SB-S Logistik · Location de 82 Engins Lourds, Coffrages & Vente d\'Agrégats',
    answer: `**SB-S Logistik** gère une flotte de **82 engins et équipements BTP** disponibles à la location (avec opérateurs certifiés et maintenance 24/7) ainsi que la fourniture d'agrégats à la **Zone Franche Industrielle (ZFI) de Mbao**.

• **Contact direct & Réservations :**
  - **Responsable :** **Rokhaya KANE** · WhatsApp direct : **+221 77 858 61 05** (https://wa.me/221778586105)
  - **Standard :** **+221 33 871 08 61** · Email : \`rokhayakane.sbs@gmail.com\`.

• **1. Levage & Travail en Hauteur (Tarifs HT / jour) :**
  - **Grue mobile télescopique 50 tonnes (Samsung) :** **500 000 FCFA / jour** (avec opérateur)
  - **Camion-grue 6 tonnes (flèche hydraulique) :** **100 000 FCFA / jour** (avec opérateur)
  - **Nacelle élévatrice télescopique (21m Isuzu ou 30m Aichi) :** **120 000 FCFA / jour**

• **2. Terrassement & Compactage :**
  - **Tractopelle polyvalent 4×4 :** **120 000 FCFA / jour** (fouilles, tranchées, chargement)
  - **Dumper tout-terrain articulé FCY30R (3 tonnes) :** **60 000 FCFA / jour**
  - **Compacteur à rouleaux Atlas Copco LP750 :** **70 000 FCFA / jour**
  - **Plaque vibrante thermique :** **35 000 FCFA / jour**

• **3. Transport & Camions :**
  - **Camion plateau (transfert matériel/engins) :** **100 000 FCFA / jour**
  - **Camion benne 40 tonnes (Sinotruk HOWO / Renault) :** **80 000 FCFA / jour**
  - **Camion porteur TATA 6 tonnes :** **60 000 FCFA / jour**

• **4. Bétonnage & Énergie de Chantier :**
  - **Pompe à béton fixe AQUARIUS 1407 D (51 m³/h, portée 600 m horiz. / 150 m vert.) :** **400 000 FCFA / jour**
  - **Auto-bétonnière mobile 4×4 VENUS (auto-chargeuse) :** **180 000 FCFA / jour**
  - **Toupie à béton (camion malaxeur 10 m³) :** **100 000 FCFA / jour**
  - **Bétonnière industrielle 1 000 litres :** **60 000 FCFA / jour**
  - **Groupe électrogène 150 KVA insonorisé :** **300 000 FCFA / jour**
  - **Groupe électrogène 5 KVA Kipor :** **5 000 FCFA / jour**

• **5. Échafaudages, Étais & Coffrages :**
  - **Échafaudages :** Standard à **2 000 F / niveau / jour** · Multidirectionnel à **3 500 F / niveau / jour**
  - **Étais en fer (4 m) / galva (3,5 m) :** Location (21j) **800 F à 1 000 F** · Vente **14 500 F à 16 500 F**
  - **Panneaux de coffrage (20×120 à 60×120) :** Location **500 F / 750 F / 1 000 F** par unité (cycle 21 jours)

• **6. Vente de Matériaux & Granulats (livrés sur chantier) :**
  - **Sable (camion 20 m³) :** **110 000 à 150 000 FCFA** selon destination
  - **Gravier basalte (40 T ou 27 m³) :** 0,85 à **396 500 F** · 0/3 à **423 500 F** · 3/8 à **572 000 F** · 8/16 à **680 000 F**
  - **Ciment 32,5 R :** **69 000 FCFA / tonne**
  - **Brouette de chantier :** **75 000 FCFA / pièce**`,
    sources: [
      { title: 'Grille Tarifaire Officielle SB-S Logistik (Engins & Agrégats)', ref: 'TAR-ENG-2026', link: '/services/engins' },
      { title: 'Fiche de l\'entité SB-S Logistik', ref: 'ENT-LOG-2026', link: '/entites/sbs-logistik' }
    ],
    suggestedAction: { label: 'Réserver un engin ou commander des agrégats', href: '/services/engins' },
    followUpQuestions: [
      'Combien coûte une grue 50T ou un camion-grue 6T pour 3 jours ?',
      'Quel est le prix d\'un camion de gravier basalte ou de sable ?',
      'Comment joindre Rokhaya Kane sur WhatsApp ?'
    ]
  },

  // ============================================================================
  // 6. P2M SHOWROOM (BLOC CARRELAGE, BLOC SANITAIRE, BLOC ROBINETTERIE, FAÏENCE)
  // ============================================================================
  {
    id: 'p2m-carrelage-tarifs',
    entityId: 'p2m',
    keywords: [
      'carrelage', 'carrelages', 'carreau', 'carreaux', 'porcelaine', 'ceramique',
      'faience', 'mosaique', 'gres', 'sol', 'mural', 'revetement', 'revetements',
      '60x60', '40x40', '30x30', '60x120', '80x240', '20x30', 'calacatta', 'marbre',
      'bois', 'parquet', 'piscine', 'prix carrelage', 'tarif carrelage', 'p2m',
      'showroom', 'sathvario', 'alaska grey', 'dyna blue', 'carton', 'cartons',
      'bloc carrelage', 'bloc faience'
    ],
    title: 'P2M · Showroom Mbao (Bloc Carrelage & Bloc Faïence/Mosaïque · Tarifs & Colisage)',
    answer: `**P2M (Polytech Matériaux & Matériels)** vous accueille dans son showroom à **Mbao Ville Neuve, Villa S04, Dakar** (et sur la page \`/entites/p2m\` organisée par blocs métiers) :

• **BLOC 1 · Carrelage Sol & Grand Format (Tarifs officiels HT) :**
  - **Carrelage 30×30 cm** (céramique vitrifiée ou porcelaine blanc antidérapant R10) : **3 000 à 3 500 FCFA / m²** *(11 pièces/carton = 0,99 m², 15 kg)*
  - **Porcelaine pleine masse 40×40 cm** (gris mat adouci, pierre naturelle) : **4 000 à 5 500 FCFA / m²** *(10 pièces/carton = 1,60 m², 21 kg)*
  - **Porcelaine pleine masse 60×60 cm** (beige sable soft) : **5 500 à 6 000 FCFA / m²** *(4 pièces/carton = 1,44 m², 26 kg)*
  - **Carrelage « CALACATTA GLOSSY » 60×60 cm** (marbre blanc veiné gris poli brillant) : **6 000 FCFA / m²** *(4 pièces/carton = 1,44 m², 26 kg)*
  - **Carrelage imitation bois 60×60 cm** (chêne naturel / noisette structuré mat) : **6 500 FCFA / m²**
  - **Grand format 60×120 cm poli miroir** :
    - *Alaska Grey Glossy* & *Dyna Blue Glossy* : **8 000 FCFA / m²** *(2 pièces/carton = 1,44 m², 29 kg)*
    - *Calacatta Gold* (blanc veiné or) : **8 000 FCFA / m²**
    - *Sathvario Goldy (Golden Series)* : **8 500 FCFA / m²**
  - **Dalles prestige très grand format 80×240 cm** (plaque marbre/pierre pleine masse) : **30 000 FCFA / plaque**

• **BLOC 4 · Faïence Murale & Mosaïque Décor :**
  - **Faïence murale 3D Wall Design Glossy 20×30 cm** (relief goutte d'eau blanc pur) : **3 500 FCFA / m²** *(16 pièces/carton = 0,96 m², 14 kg)*
  - **Mosaïque pâte de verre piscine & crédence (30×30 cm)** : **8 500 FCFA / plaque**
  - **Mosaïque & parement effet pierre naturelle** : **8 500 FCFA / m²**

📍 **Showroom P2M :** Mbao Ville Neuve, Villa S04, Dakar (Lun–Ven : 8h–18h, Sam : 8h–13h).
📞 **Contacts directs :** **+221 78 832 12 79** · WhatsApp : **+221 78 424 64 45** / **+221 77 827 08 18** · Email : \`p2m.senegal@gmail.com\`.`,
    sources: [
      { title: 'Showroom P2M par Blocs (Carrelage, Sanitaire, Robinetterie)', ref: 'P2M-SHOW-2026', link: '/entites/p2m' },
      { title: 'Catalogue Complet & Calculateur de Cartons P2M', ref: 'CAT-P2M-2026', link: '/catalogue' }
    ],
    suggestedAction: { label: 'Ouvrir le Showroom P2M par blocs', href: '/entites/p2m' },
    followUpQuestions: [
      'Combien de cartons et quel budget pour 100 m² de carrelage 60×60 ?',
      'Quels sont les prix des WC, lavabos et baignoires du Bloc Sanitaire P2M ?',
      'Quels sont les tarifs de la robinetterie HKI et des accessoires P2M ?'
    ]
  },

  {
    id: 'p2m-sanitaires-plomberie',
    entityId: 'p2m',
    keywords: [
      'sanitaire', 'sanitaires', 'wc', 'toilette', 'toilettes', 'lavabo', 'lavabos',
      'vasque', 'vasques', 'baignoire', 'baignoires', 'douche', 'douches', 'receveur',
      'robinet', 'robinets', 'robinetterie', 'mitigeur', 'mitigeurs', 'evier', 'eviers',
      'partas', 'esta', 'esta 2011', 'chaise anglaise', 'chaise turque', 'hki',
      'plomberie', 'pex', 'siphon', 'douchette', 'bain', 'rosen', 'rosen 3001',
      'exelon', 'exelon 7019', 'sfs 4', 'sfst 1', 'as 105', 's 1003',
      'bloc sanitaire', 'bloc robinetterie'
    ],
    title: 'P2M · Bloc Sanitaire & Bloc Robinetterie / Plomberie (Tarifs Officiels)',
    answer: `Le showroom **P2M** (Mbao Ville Neuve, Villa S04) propose en stock permanent ses gammes **Bloc Sanitaire** et **Bloc Robinetterie & Accessoires** :

• **BLOC 2 · Équipements Sanitaires (WC, Lavabos, Baignoires & Douches) :**
  - **WC suspendu P-Trap « ESTA 2011 »** (525×360×370 mm, céramique anti-calcaire) : **55 000 FCFA HT**
  - **Chaise anglaise monobloc (One Piece)** céramique blanche (gammes Aqua / Camon / Inaya) : **45 000 FCFA HT**
  - **Pack WC complet au sol** (cuvette + réservoir + abattant inclus) : **35 000 FCFA HT**
  - **WC à la turque (chaise turque)** céramique blanche haute résistance : **25 000 FCFA HT**
  - **Lavabo totem sur pied « ROSEN 3001 »** (marque HOLO, 455×455×860 mm) : **65 000 FCFA HT**
  - **Vasque à poser rectangulaire « EXELON 7019 »** (HOLO, 525×365×130 mm) : **52 000 FCFA HT**
  - **Lavabo sur colonne « Partas »** céramique blanche (cuve 55 cm + colonne) : **38 000 FCFA HT**
  - **Baignoire acrylique « SFS-4 DELUX » (1700 mm)** avec embase PVC étanche & bonde pop-up : **195 000 FCFA HT**
  - **Receveur de douche antidérapant « SFST-1 »** (900×900×110 mm, bonde Ø 90 mm incluse) : **85 000 FCFA HT**
  - **Colonne de douche murale** (hand shower / avec mitigeur / hydromassante) : **45 000 FCFA HT**

• **BLOC 3 · Robinetterie, Éviers, Accessoires & Plomberie :**
  - **Évier de cuisine inox alimentaire** (simple ou double bac avec siphon et vidage) : **48 000 FCFA HT**
  - **Mitigeur mural encastré douche & bain « AS-105(A) »** (laiton chromé, séries CO-105, RO-106, EV-107) : **15 000 FCFA HT**
  - **Set complet d'accessoires salle de bain chromés** (porte-serviette, porte-savon, porte-brosse, étagère, miroir) : **13 500 FCFA HT**
  - **Robinet évier mural chromé « HKI »** (col de cygne, raccord 1/2") : **12 000 FCFA HT**
  - **Robinet d'arrêt « S-1003 ANGLE COCK »** chromé quart de tour : **8 000 FCFA HT**
  - **Plomberie & Raccords** (tubes PEX, nourrices, coudes PEX, tés, manchons, siphons, clapets, téflon, visserie WC) : disponibles dès **1 500 FCFA**.

📞 **Commandes & Devis P2M :** **+221 78 832 12 79** · WhatsApp : **+221 78 424 64 45** · \`p2m.senegal@gmail.com\`.`,
    sources: [
      { title: 'Showroom P2M · Bloc Sanitaire & Bloc Robinetterie', ref: 'FLY-SAN-P2M', link: '/entites/p2m' },
      { title: 'Catalogue Sanitaires & Robinetterie P2M', ref: 'CAT-SAN-2026', link: '/catalogue' }
    ],
    suggestedAction: { label: 'Voir le Bloc Sanitaire & Robinetterie sur la page P2M', href: '/entites/p2m' },
    followUpQuestions: [
      'Quels sont les tarifs des carreaux 60×60 et 60×120 chez P2M ?',
      'Comment obtenir un devis complet salle de bain + carrelage ?',
      'Où se situe exactement le showroom P2M à Mbao ?'
    ]
  },

  // ============================================================================
  // 7. PGT (POLYTECH GENERAL TRADING · SOURCING DUBAÏ - AJMAN & INDE)
  // ============================================================================
  {
    id: 'pgt-sourcing-transit',
    entityId: 'pgt',
    keywords: [
      'pgt', 'polytech general trading', 'polytech global trading', 'sourcing',
      'importation', 'import', 'export', 'transit', 'port', 'pad', 'fret',
      'conteneur', 'conteneurs', 'fcl', 'lcl', 'dedouanement', 'centrale d achat',
      'fournisseur', 'dubai', 'ajman', 'inde', 'emirats', '971 52 763 1629',
      '971527631629', 'pgt senegal'
    ],
    title: 'PGT (Polytech General Trading) · Sourcing Dubaï - Ajman & Inde, Fret & Transit',
    answer: `**PGT (Polytech General Trading)** est la centrale d'achat internationale et le commissionnaire d'import-export de l'écosystème Magatte Niang Expert :

• **Coordonnées officielles PGT :**
  - **Téléphone & WhatsApp direct (PGT Dubaï - Ajman) :** **+971 52 763 1629** (https://wa.me/971527631629)
  - **Email officiel :** \`pgt.senegal@gmail.com\`
  - **Implantations :** Bureau international **Dubaï - Ajman (Émirats Arabes Unis)**, réseau certifié en **Inde** (9+ ans d'expérience) et plateforme logistique à **Dakar (Zone Franche / Port Autonome de Dakar)**.

• **Prestations & Avantages clés :**
  1. **Sourcing direct usines certifiées ISO :** Négociation sans intermédiaire pour les matériaux de construction (carreaux, acier, fer à béton), équipements sanitaires, pièces industrielles et engins lourds.
  2. **Économies garanties de 15 à 30 %** grâce aux volumes groupés de l'écosystème.
  3. **Délai d'identification & audit fournisseur :** **5 à 7 jours ouvrés**.
  4. **Modes de transport & délais :**
     - **FCL (Full Container 20' ou 40') :** **20 à 25 jours**
     - **LCL (Groupage maritime) :** **25 à 30 jours**
     - **Air Freight (Fret aérien express urgences) :** **5 à 7 jours**
  5. **Garanties contractuelles :** Marchandise **assurée à 100 % (full value)**, traçabilité GPS temps réel, dédouanement express au Port Autonome de Dakar (PAD) et livraison sur chantier avec **SB-S Logistik**.`,
    sources: [
      { title: 'Fiche officielle de l\'entité PGT', ref: 'PGT-TRAD-2026', link: '/entites/pgt' },
      { title: 'Portail Sourcing & Fret International PGT', ref: 'SRV-PGT-2026', link: '/services/sourcing' }
    ],
    suggestedAction: { label: 'Ouvrir la fiche PGT (+971 52 763 1629)', href: '/entites/pgt' },
    followUpQuestions: [
      'Quels sont les délais de transport conteneur FCL et LCL avec PGT ?',
      'Quels produits PGT importe-t-il pour P2M et SERMA BTP ?',
      'Comment contacter PGT à Dubaï - Ajman sur WhatsApp ?'
    ]
  },

  // ============================================================================
  // 8. DIRIGEANTS, RESPONSABLES & CONTACTS DIRECTS PAR ENTITÉ
  // ============================================================================
  {
    id: 'contact-devis-prix-coordonnees',
    keywords: [
      'contact', 'contacts', 'devis', 'telephone', 'telephones', 'whatsapp',
      'email', 'mail', 'adresse', 'localisation', 'ou etes vous', 'mbao',
      'horaire', 'horaires', 'chiffrage', 'responsable', 'responsables',
      'directeur', 'equipe', 'qui dirige', 'numero', 'numeros', 'joindre',
      'appeler', 'plus code', 'pmx9', 'carte', 'gps', 'keur gorgui', 'rufisque'
    ],
    title: 'Annuaire Complet des Contacts, Responsables & Adresses des 7 Entités',
    answer: `Voici l'annuaire officiel et vérifié de toutes les entités et de leurs responsables directs :

• **Direction Générale & Standard Central :**
  - **Président Fondateur :** Ing. **Magatte NIANG**
  - **Standard central Dakar :** **+221 33 832 40 10** / **+221 33 871 08 61**
  - **Urgence chantiers 24/7 :** **+221 77 267 16 17**
  - **Email Groupe :** \`contact@magatteniang-expert.sn\`

• **Contacts directs par entité :**
  1. **SERMA BTP (Études 3D/BIM, Charpente & AMO) :**
     - Direction : **Magatte NIANG** · Tél / WhatsApp : **+221 78 832 12 79**
     - Emails : \`serma@sermabtp.com\` / \`sermabtp@gmail.com\` · HLM Hann Mariste Lot Z/22, Dakar.
  2. **SB-S Group (Génie Civil & Grands Travaux) :**
     - Responsable : **Oumou DIOP** · WhatsApp : **+221 77 203 84 38**
     - Standard : **+221 33 871 08 61** · WhatsApp : **+221 77 500 44 22** · Email : \`contact@sbsgroup.sn\` · Mbao Villeneuve Villa S04 (Plus Code : \`PMX9+CHV, Dakar\`).
  3. **SB-S Labo (Géotechnique & Essais C2/A3) :**
     - Directrice Technique : **Aminata DRAMÉ** · Tél & WhatsApp : **+221 70 835 00 63**
     - Responsable Laboratoire (pour les essais) : **Abdoulaye NIANG** · Tél & WhatsApp : **+221 77 321 78 60**
     - Email : \`sbslabo15@gmail.com\` · Ndiakhirate, Cité Assemblée, Villa N° 226, Dakar, Sénégal.
  4. **SB-S Industries (Centrale à Béton & Agglos) :**
     - Responsable : **Salimata SOW** · Tél & WhatsApp : **+221 77 566 48 06** / **+221 33 871 08 61**
     - Email : \`wsbsindustrie2021@gmail.com\` · Zone Franche Industrielle (ZFI) de Mbao.
  5. **SB-S Logistik (Location Grues, Engins & Agrégats) :**
     - Responsable : **Rokhaya KANE** · WhatsApp : **+221 77 858 61 05** / **+221 33 871 08 61**
     - Email : \`rokhayakane.sbs@gmail.com\` · ZFI de Mbao (disponible 24/7 sur astreinte).
  6. **P2M Showroom (Carrelage, Sanitaire & Robinetterie) :**
     - Tél : **+221 78 832 12 79** · WhatsApp : **+221 78 424 64 45** / **+221 77 827 08 18**
     - Email : \`p2m.senegal@gmail.com\` · Mbao Ville Neuve, Villa S04, Dakar (Lun–Ven 8h–18h, Sam 8h–13h).
  7. **PGT (Sourcing International Dubaï - Ajman & Inde) :**
     - Tél & WhatsApp direct : **+971 52 763 1629** (https://wa.me/971527631629)
     - Email : \`pgt.senegal@gmail.com\` · Dubaï - Ajman (ÉAU) & Dakar.`,
    sources: [
      { title: 'Annuaire & Géolocalisation Officielle des Sites', ref: 'LOC-GRP-2026', link: '/contact' },
      { title: 'Charte d\'engagement de réponse 24h-48h', ref: 'ENG-DELAI-2026', link: '/engagements' }
    ],
    suggestedAction: { label: 'Prendre rendez-vous ou nous contacter', href: '/contact' },
    followUpQuestions: [
      'Comment réserver un rendez-vous technique avec un ingénieur ?',
      'Quels sont les réseaux sociaux officiels de Magatte Niang Expert ?',
      'Je veux lancer un chiffrage rapide pour mon projet'
    ]
  },

  // ============================================================================
  // 9. PROFIL MAGATTE NIANG, PUBLICATIONS SCIENTIFIQUES & RECHERCHE
  // ============================================================================
  {
    id: 'magatte-niang-expert',
    keywords: [
      'magatte', 'niang', 'maguette', 'qui est magatte', 'fondateur', 'pdg',
      'professeur', 'enseignant', 'chercheur', 'expert btp', 'parcours',
      'biographie', 'diplome', 'publication', 'publications', 'scientifique',
      'article', 'recherche', 'lateritique', 'corrosion marine', 'vision 2055'
    ],
    title: 'Ing. Magatte Niang · Fondateur, Enseignant-Chercheur & Publications Scientifiques',
    answer: `**Magatte Niang** est **Ingénieur en chef des Ponts & Chaussées**, **Enseignant-Chercheur** dans les écoles polytechniques et universités de la sous-région, et **Président Fondateur** de l'écosystème BTP regroupant les 7 entités (SERMA BTP, SB-S Group, SB-S Labo, SB-S Industries, SB-S Logistik, P2M, PGT).

• **Chiffres clés de son parcours :**
  - **24 années d'expérience** en génie civil, structures métalliques, géotechnique et ouvrages d'art.
  - **250+ projets structurants** supervisés au Sénégal et en Afrique de l'Ouest.
  - **18 publications scientifiques et techniques** de référence.
  - **620 emplois directs** créés au sein de l'écosystème industriel.

• **Formation & Titres :**
  - Diplôme d'ingénieur de génie civil (structures & ouvrages d'art).
  - Master de recherche en mécanique des matériaux et géotechnique.
  - Auditeur certifié **Eurocodes** et normes **NF P / ISO**.

• **Publications scientifiques & techniques majeures :**
  1. *Comportement mécanique des sols latéritiques sénégalais stabilisés aux liants hydrauliques locaux* (Revue Ouest-Africaine de Géotechnique, 2024, DOI: \`10.1016/j.wafrigeo.2024.03.012\`).
  2. *Optimisation des assemblages boulonnés sur charpentes métalliques sous sollicitations marines côtières à Dakar* (Congrès CISOA, 2023).
  3. *Manuel pratique de contrôle qualité sur chantier BTP en zone intertropicale* (Support de cours magistral Master Génie Civil, 2022).
  4. *SERMA BTP et le défi de la construction métallique au Sénégal : vers une souveraineté industrielle* (Revue BTP Afrique, 2024).
  5. *Innovation dans le BTP sénégalais : SB-S Labo, laboratoire pionnier dans les essais géotechniques* (Échos de l'Industrie, 2024).`,
    sources: [
      { title: 'Profil & Biographie de Magatte Niang', ref: 'EXP-MN-2026', link: '/profil' },
      { title: 'Corpus des Publications Scientifiques & Presse', ref: 'PUB-SCI-2026', link: '/publications' }
    ],
    suggestedAction: { label: 'Consulter le profil et les publications', href: '/profil' },
    followUpQuestions: [
      'Quelles sont les 7 entités créées par Magatte Niang ?',
      'Voir les publications scientifiques sur les sols latéritiques et l\'Eurocode 3',
      'Comment prendre rendez-vous avec la Direction Technique ?'
    ]
  },

  // ============================================================================
  // 10. RÉALISATIONS & ÉTUDES DE CAS CHANTIERS (LES 22 PROJETS VÉRIFIÉS)
  // ============================================================================
  {
    id: 'realisations-projets-senegal',
    keywords: [
      'realisation', 'realisations', 'projet', 'projets', 'chantier', 'chantiers',
      'reference', 'references', 'sendou', 'mako', 'sococim', 'secaa', 'oim',
      'goree', 'almadies', 'saly', 'somone', 'fann', 'foundiougne', 'mbour',
      'kaolack', 'ubipharm', 'vivo energy', 'shell', 'lafargeholcim', 'abidjan',
      'richard toll', 'css', 'kaffrine', 'sicap', 'aprosi', 'ageroute'
    ],
    title: 'Palmarès des 22+ Réalisations & Études de Cas au Sénégal et en Côte d\'Ivoire',
    answer: `L'écosystème Magatte Niang compte **plus de 250 projets réalisés**, dont voici les études de cas majeures documentées sur la plateforme :

• **Charpente Métallique & Ingénierie (SERMA BTP) :**
  - **UBIPHARM Sénégal (Diamniadio) :** Hangar pharmaceutique de **2 800 m²**, **62 T d'acier S355**, portée libre de **42 m** sans poteau intermédiaire.
  - **Port Autonome de Dakar & APROSI (Diamniadio) :** Hangar logistique **38 T d'acier**, portée libre **36 m**, surface **2 400 m²**.
  - **Réseau Stations-Service VIVO Energy / Shell (Fatick, Sandiara, Touba Toul, Dakar) :** **46 T d'auvents métalliques**, portée 28 m, montage en 72h/station.
  - **Immeuble R+9 (Dakar Fann / Point E) :** Ossature métallique grande hauteur de **85 T** sur **3 600 m²** (-35 % sur le délai gros œuvre).

• **Génie Civil, Industrie & Ouvrages (SB-S Group) :**
  - **Centrale Électrique de Sendou (CES) :** Bâtiment de stockage de produits chimiques, cuvelage étanche et toiture métallique.
  - **LafargeHolcim Côte d'Ivoire (Abidjan) :** Hangar clinker **7 890 m²**, **110 T d'acier**, **750 m³ de béton**, 0 accident LTI.
  - **CSS Richard Toll :** Réhausse de hangar industriel de **3 500 m²** (**42 T d'acier**, +30 % de capacité).
  - **DLM Sénégal (Mako, Kédougou) :** Usine d'oxygène PSA **6 T/jour** & puisard minier étanche de **9 m de profondeur** (290 m³ béton hydrofuge).
  - **Port Autonome de Dakar (PAD) :** Bâtiment des sous-traitants maritimes (**1 450 m²**).
  - **SOCOCIM (Thiès) & Carrières :** Bureaux d'exploitation, massifs anti-vibratiles du 2e concasseur (380 m³) et mur de soutènement lourd (520 m³).
  - **SECAA SA, Gorée Offshore & Zone Industrielle Diamniadio :** Aire de lavage poids lourds, **12 000 m² de dallages industriels** au quartz, caniveaux VRD et fosses septiques.
  - **Kaffrine & OIM Sénégal :** Gradins omnisports de **1 200 places**, restaurant municipal et bâtiments humanitaires OIM.

• **Géotechnique & Contrôle Qualité (SB-S Labo) :**
  - **Pont de Foundiougne :** Écrasement sous presse 3 000 kN de **1 200 éprouvettes béton** (14 500 m³ contrôlés, fck > 42 MPa).
  - **Autoroute Mbour–Fatick–Kaolack (Ageroute) :** **450 essais CBR et Proctor** sur 65 km linéaires.
  - **Tour R+16 SICAP (Plateau, Dakar) :** **8 forages carottés à 45 m**, pressiomètre Ménard et piézomètres.
  - **Plateforme Diamniadio :** **24 forages carottés** et pénétromètre dynamique PDL sur 45 000 m².

• **Résidentiel Prestige, Béton & Sourcing (P2M, SB-S Industries, SB-S Logistik, PGT) :**
  - **Résidences Les Almadies (80 logements) :** **14 000 m²** de grès cérame 60×120 et sanitaires suspendus P2M.
  - **Villa Fann Résidence (1 200 m²), Villa Saly Portudal (850 m²) & Domaine La Somone (3 200 m²)** par P2M.
  - **Voiries Diamniadio-Dakar :** **8 500 m³ de BPE C25/30** et **45 000 agglos/bordures** par SB-S Industries.
  - **Terminal PAD :** **220 conteneurs** importés et dédouanés par PGT.`,
    sources: [
      { title: 'Portail des Réalisations & Études de Cas', ref: 'REG-PROJ-2026', link: '/projets' }
    ],
    suggestedAction: { label: 'Explorer toutes les réalisations en photos', href: '/projets' },
    followUpQuestions: [
      'Détaillez-moi le projet du hangar pharmaceutique UBIPHARM',
      'Qu\'a fait SB-S Labo sur le Pont de Foundiougne et l\'autoroute Mbour-Kaolack ?',
      'Quelles sont les villas et résidences équipées par P2M ?'
    ]
  },

  // ============================================================================
  // 11. PROJET DE CONSTRUCTION CLÉ EN MAIN (MAISON, VILLA, IMMEUBLE, USINE)
  // ============================================================================
  {
    id: 'projet-construction-maison-villa',
    keywords: [
      'construire', 'construction', 'maison', 'villa', 'batiment', 'immeuble',
      'travaux', 'renovation', 'gros oeuvre', 'fondation', 'cle en main',
      'terrain', 'promoteur', 'etapes', 'comment construire'
    ],
    title: 'Construire une Villa, un Immeuble ou une Usine Clé en Main avec les 7 Entités',
    answer: `Pour tout projet de construction (villa, immeuble R+, hangar industriel) au Sénégal, notre écosystème vous accompagne **étape par étape avec un interlocuteur unique** :

1. **Étape 1 · Étude de sol géotechnique (SB-S Labo · Directrice Technique Aminata Dramé +221 70 835 00 63 / Resp. Essais Abdoulaye Niang +221 77 321 78 60) :**
   - Sondages au pénétromètre dynamique (PDL), carottage, essais CBR et limites d'Atterberg (appareil de Casagrande) pour déterminer la portance exacte du terrain et dimensionner les semelles, radier ou pieux.
2. **Étape 2 · Conception architecturale, Modélisation 3D/BIM & Calculs (SERMA BTP · +221 77 575 21 36) :**
   - Plans d'exécution béton armé et charpente métallique aux Eurocodes, modélisation 3D/BIM et maîtrise d'œuvre (AMO / supervision).
3. **Étape 3 · Terrassement & Levage (SB-S Logistik · +221 77 858 61 05) :**
   - Mobilisation des tractopelles (120 000 F/j), bennes 40T, grues mobiles (6T à 50T), échafaudages, étais et coffrages, ainsi que la livraison de sable, gravier basalte et ciment.
4. **Étape 4 · Gros Œuvre, Béton BPE & Maçonnerie (SB-S Group & SB-S Industries · +221 77 566 48 06) :**
   - Exécution du gros œuvre par **SB-S Group** avec le béton prêt à l'emploi (C20 à C30 : 65 000 à 77 000 F/m³), les agglos creux (380 à 590 F), agglos pleins (700 à 850 F) et hourdis (450 à 750 F) produits par **SB-S Industries**.
5. **Étape 5 · Revêtements Carrelage, Sanitaires & Robinetterie (P2M & PGT · +221 78 832 12 79 / +971 52 763 1629) :**
   - Finitions complètes au showroom P2M de Mbao (carreaux 60×60 dès 5 500 F/m², 60×120 dès 7 500 F/m², WC suspendus ESTA, lavabos, baignoires, robinetterie HKI) ou sourcing sur-mesure par conteneur via **PGT**.`,
    sources: [
      { title: 'Offre Clé en Main Écosystème Magatte Niang', ref: 'OFF-BTP-2026', link: '/assistant' },
      { title: 'Présentation des 7 Entités', ref: 'ENT-GRP-2026', link: '/entites' }
    ],
    suggestedAction: { label: 'Qualifier mon projet en 2 minutes', href: '/assistant' },
    followUpQuestions: [
      'Quel budget prévoir pour le béton et les agglos de mon chantier ?',
      'Je veux voir les tarifs du carrelage et des sanitaires P2M',
      'Combien coûte une étude de sol chez SB-S Labo ?'
    ]
  },

  // ============================================================================
  // 12. SALUTATIONS, ACCUEIL & AIDE GÉNÉRALE
  // ============================================================================
  {
    id: 'salutations-accueil',
    keywords: [
      'bonjour', 'salut', 'bonsoir', 'coucou', 'hello', 'hi', 'salam',
      'assalam', 'nanga def', 'aide', 'aidez', 'aider', 'qui etes vous',
      'qui es tu', 'comment ca marche', 'que faites vous', 'pouvez vous',
      'bienvenue', 'assistance'
    ],
    title: 'Accueil · Assistant IA de l\'Écosystème Magatte Niang Expert',
    answer: `Bonjour et bienvenue ! Je suis l'assistant technique et commercial de l'écosystème **Magatte Niang Expert**. Je connais **toutes les 7 entités**, **tous les produits et tarifs**, **tous les engins**, **tous les essais de laboratoire** et **toutes les réalisations** du groupe :

• **1. SERMA BTP** : Études techniques, modélisation 3D/BIM, charpente métallique (4 500 T/an, portée > 42m), pylônes, stations-service, IGH & maîtrise d'œuvre (+221 78 832 12 79).
• **2. SB-S Group** : Génie civil lourd, ouvrages d'art, dallages industriels & VRD · Responsable Oumou DIOP (+221 77 203 84 38 / +221 33 871 08 61).
• **3. SB-S Labo** : Laboratoire agréé LNR-BTP **Catégories C2 et A3** (études de sol CBR, Proctor, PDL, carottage, écrasement béton 3 000 kN, PV en 24h) · Directrice Technique Aminata DRAMÉ (+221 70 835 00 63) & Responsable Laboratoire (Essais) Abdoulaye NIANG (+221 77 321 78 60).
• **4. SB-S Industries** : Centrale à béton 60 m³/h (BPE C15–C30 : 62 000–77 000 F/m³), agglos creux (380–590 F), agglos pleins (700–850 F), hourdis (450–750 F), pavés (6 750–9 000 F/m²) · Responsable Salimata SOW (+221 77 566 48 06).
• **5. SB-S Logistik** : Location de 82 engins lourds (Grue 50T à 500 000 F/j, Camion-grue 6T à 100 000 F/j, Tractopelle à 120 000 F/j, Pompe à béton, Bennes 40T, Échafaudages, Coffrages) & vente de sable/gravier/ciment · Responsable Rokhaya KANE (+221 77 858 61 05).
• **6. P2M Showroom** : Carrelage 30×30 à 80×240 (dès 3 000 F/m²), sanitaires (WC ESTA, lavabos Partas/Rosen, baignoires), robinetterie HKI, faïence & mosaïque à Mbao (+221 78 832 12 79).
• **7. PGT (Dubaï - Ajman & Inde)** : Sourcing international direct usines, fret conteneurisé FCL/LCL et dédouanement au PAD · WhatsApp **+971 52 763 1629**.

💡 **Astuce :** Vous pouvez aussi me demander un **calcul direct** (ex: *"Combien pour 120 m² de carrelage 60×60 ?"*, *"Devis pour 1 500 agglos 15×20×40"*, *"Location grue 50T pour 4 jours"*). Que puis-je faire pour vous ?`,
    sources: [
      { title: 'Plaquette institutionnelle Magatte Niang Expert 2026', ref: 'PLA-CORP-2026', link: '/docs/plaquette' },
      { title: 'Portail des 7 Entités du Groupe', ref: 'ENT-GRP-2026', link: '/entites' }
    ],
    suggestedAction: { label: 'Explorer les 7 entités', href: '/entites' },
    followUpQuestions: [
      'Présente-moi les 7 entités et leur synergie',
      'Quels sont les prix des carreaux et sanitaires P2M ?',
      'Quels sont les tarifs des agglos, du béton et des engins ?'
    ]
  },

  // ============================================================================
  // 13. RÉSEAUX SOCIAUX, MÉDIATHÈQUE, PAIEMENTS & ESPACE PRO
  // ============================================================================
  {
    id: 'reseaux-sociaux-paiement-plateforme',
    keywords: [
      'reseaux sociaux', 'linkedin', 'facebook', 'instagram', 'tiktok', 'youtube',
      'mediatheque', 'video', 'videos', 'photo', 'photos', 'paiement', 'payer',
      'wave', 'orange money', 'virement', 'espace pro', 'facture', 'commande en ligne'
    ],
    title: 'Réseaux Sociaux Officiels, Médiathèque & Moyens de Paiement',
    answer: `Voici les informations pratiques sur nos canaux digitaux, notre médiathèque et nos modalités de règlement :

• **Réseaux sociaux officiels (${SOCIAL_LINKS.length} canaux actifs) :**
${SOCIAL_LINKS.map(s => `  - **${s.name}** (${s.handle}) : ${s.description} → ${s.url}`).join('\n')}

• **Commande & Paiement (Devis, Location d'engins & Matériaux) :**
  - **Devis PDF instantané** téléchargeable en ligne sur les catalogues **P2M**, **SB-S Industries** et **SB-S Logistik**.
  - **Moyens de paiement acceptés :** **Wave**, **Orange Money**, virement bancaire, chèque certifié ou espèces en agence/showroom.
  - **Portail de paiement dédié SB-S Logistik :** Après validation de votre demande d'engin par Rokhaya KANE (+221 77 858 61 05), vous recevez un lien de paiement sécurisé avec facture numérique instantanée.

• **Médiathèque & Documentation Technique :**
  - Accédez aux photos réelles de chantiers, vidéos d'usines, fiches techniques PDF et publications scientifiques sur \`/mediatheque\` et \`/publications\`.`,
    sources: [
      { title: 'Médiathèque & Galeries Chantiers', ref: 'MED-GRP-2026', link: '/mediatheque' },
      { title: 'Page Contact & Réseaux Officiels', ref: 'SOC-GRP-2026', link: '/contact' }
    ],
    suggestedAction: { label: 'Visiter la Médiathèque', href: '/mediatheque' },
    followUpQuestions: [
      'Comment obtenir un devis PDF pour du carrelage P2M ?',
      'Comment réserver et payer un engin chez SB-S Logistik ?',
      'Voir l\'annuaire téléphonique et WhatsApp des 7 entités'
    ]
  }
];

/**
 * Calculateur intelligent intégré : détecte si l'utilisateur demande un chiffrage chiffré
 * (ex: "100 m2 de carrelage 60x60", "500 agglos 15", "20 m3 de beton c25", "grue 50t pendant 3 jours")
 */
function computeInstantEstimate(normQ: string): string | null {
  const estimates: string[] = [];

  // 1. Calculateur Carrelage P2M (surface en m²)
  const m2Match = normQ.match(/(\d+(?:[\.,]\d+)?)\s*(?:m2|m\s*2|metres?\s*carres?)/);
  if (m2Match) {
    const surface = parseFloat(m2Match[1].replace(',', '.'));
    if (surface > 0 && surface <= 100000) {
      const isPave = normQ.includes('pave');
      if (isPave) {
        const p6 = Math.round(surface * 6750).toLocaleString('fr-FR');
        const p8 = Math.round(surface * 7750).toLocaleString('fr-FR');
        const p10 = Math.round(surface * 9000).toLocaleString('fr-FR');
        estimates.push(
          `📐 **Estimation instantanée SB-S Industries pour ${surface} m² de pavés :**\n` +
          `• **Pavés 6 cm (6 750 F/m²) :** **${p6} FCFA HT**\n` +
          `• **Pavés 8 cm (7 750 F/m²) :** **${p8} FCFA HT**\n` +
          `• **Pavés 10 cm (9 000 F/m²) :** **${p10} FCFA HT**`
        );
      } else {
        const surfaceWithMargin = Math.ceil(surface * 1.10); // +10% marge de coupe recommandée
        // Check specific tile format or default to 60x60 & 60x120
        const cartons6060 = Math.ceil(surfaceWithMargin / 1.44);
        const weight6060 = cartons6060 * 26;
        const min6060 = Math.round(surfaceWithMargin * 5500).toLocaleString('fr-FR');
        const max6060 = Math.round(surfaceWithMargin * 6000).toLocaleString('fr-FR');
        const min60120 = Math.round(surfaceWithMargin * 7500).toLocaleString('fr-FR');
        const max60120 = Math.round(surfaceWithMargin * 8500).toLocaleString('fr-FR');
        estimates.push(
          `📐 **Calcul technique instantané P2M pour ${surface} m² (soit ${surfaceWithMargin} m² avec +10 % de marge de coupe) :**\n` +
          `• **En format 60×60 cm** (4 pcs/carton = 1,44 m², 26 kg/carton) : **${cartons6060} cartons** (~${weight6060.toLocaleString('fr-FR')} kg) → Budget : **${min6060} à ${max6060} FCFA HT** (5 500–6 000 F/m²).\n` +
          `• **En grand format 60×120 cm** (2 pcs/carton = 1,44 m², 29 kg/carton) : **${cartons6060} cartons** → Budget : **${min60120} à ${max60120} FCFA HT** (7 500–8 500 F/m²).\n` +
          `• **En format 40×40 cm** (10 pcs/carton = 1,60 m²) : **${Math.ceil(surfaceWithMargin / 1.6)} cartons** → Budget : **${Math.round(surfaceWithMargin * 4500).toLocaleString('fr-FR')} FCFA HT** (4 500 F/m²).`
        );
      }
    }
  }

  // 2. Calculateur Béton BPE (volume en m³)
  const m3Match = normQ.match(/(\d+(?:[\.,]\d+)?)\s*(?:m3|m\s*3|metres?\s*cubes?)/);
  if (m3Match && (normQ.includes('beton') || normQ.includes('bpe') || normQ.includes('c15') || normQ.includes('c20') || normQ.includes('c25') || normQ.includes('c30') || normQ.includes('toupie'))) {
    const vol = parseFloat(m3Match[1].replace(',', '.'));
    if (vol > 0 && vol <= 50000) {
      const toupies = Math.ceil(vol / 10);
      estimates.push(
        `📐 **Estimation BPE SB-S Industries pour ${vol} m³ (environ ${toupies} rotation${toupies > 1 ? 's' : ''} de camion toupie 10 m³) :**\n` +
        `• **Béton C15 (62 000 F/m³) :** **${Math.round(vol * 62000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Béton C20 (65 000 F/m³) :** **${Math.round(vol * 65000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Béton C25 (71 000 F/m³) :** **${Math.round(vol * 71000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Béton C30 (75 000 F/m³) :** **${Math.round(vol * 75000).toLocaleString('fr-FR')} FCFA HT**`
      );
    }
  }

  // 3. Calculateur Agglos / Briques / Hourdis (nombre d'unités)
  const unitsMatch = normQ.match(/(\d+)\s*(?:agglos?|briques?|parpaings?|hourdis)/);
  if (unitsMatch) {
    const qty = parseInt(unitsMatch[1], 10);
    if (qty > 0 && qty <= 1000000) {
      if (normQ.includes('hourdis')) {
        estimates.push(
          `📐 **Estimation SB-S Industries pour ${qty.toLocaleString('fr-FR')} hourdis :**\n` +
          `• **Hourdis 12 (450 F/u) :** **${(qty * 450).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Hourdis 16 (580 F/u) :** **${(qty * 580).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Hourdis 20 (650 F/u) :** **${(qty * 650).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Hourdis 25 (750 F/u) :** **${(qty * 750).toLocaleString('fr-FR')} FCFA HT**`
        );
      } else {
        estimates.push(
          `📐 **Estimation SB-S Industries pour ${qty.toLocaleString('fr-FR')} agglos :**\n` +
          `• **Agglo creux 10×20×40 (380 F/u) :** **${(qty * 380).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Agglo creux 12×20×40 (400 F/u) :** **${(qty * 400).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Agglo creux 15×20×40 (475 F/u) :** **${(qty * 475).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Agglo creux 20×20×40 (590 F/u) :** **${(qty * 590).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Agglo plein 15×20×40 (700 F/u) :** **${(qty * 700).toLocaleString('fr-FR')} FCFA HT**\n` +
          `• **Agglo plein 20×20×40 (850 F/u) :** **${(qty * 850).toLocaleString('fr-FR')} FCFA HT**`
        );
      }
    }
  }

  // 4. Calculateur Location Engins (nombre de jours)
  const daysMatch = normQ.match(/(\d+)\s*(?:jours?|j\b)/);
  if (daysMatch && (normQ.includes('grue') || normQ.includes('tractopelle') || normQ.includes('nacelle') || normQ.includes('pompe') || normQ.includes('benne') || normQ.includes('location') || normQ.includes('louer'))) {
    const days = parseInt(daysMatch[1], 10);
    if (days > 0 && days <= 365) {
      estimates.push(
        `📐 **Estimation Location SB-S Logistik pour ${days} jour${days > 1 ? 's' : ''} :**\n` +
        `• **Grue mobile 50T (500 000 F/j) :** **${(days * 500000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Pompe à béton Aquarius (400 000 F/j) :** **${(days * 400000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Groupe électrogène 150 KVA (300 000 F/j) :** **${(days * 300000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Auto-bétonnière Venus (180 000 F/j) :** **${(days * 180000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Tractopelle 4×4 ou Nacelle (120 000 F/j) :** **${(days * 120000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Camion-grue 6T, Toupie ou Plateau (100 000 F/j) :** **${(days * 100000).toLocaleString('fr-FR')} FCFA HT**\n` +
        `• **Camion benne 40T (80 000 F/j) :** **${(days * 80000).toLocaleString('fr-FR')} FCFA HT**`
      );
    }
  }

  return estimates.length > 0 ? estimates.join('\n\n') : null;
}

/**
 * Recherche dynamique dans les 22+ Projets réels (PROJECTS) si l'utilisateur mentionne un client ou un chantier précis
 */
function findMatchingProjectDetail(normQ: string): KnowledgeTopic | null {
  let bestProj = null;
  let bestScore = 0;

  for (const proj of PROJECTS) {
    let score = 0;
    const normTitle = normalizeQuery(proj.title);
    const normClient = normalizeQuery(proj.client);
    const normLoc = normalizeQuery(proj.location);
    const normSlug = normalizeQuery(proj.slug);

    const specificTokens = [
      'ubipharm', 'vivo', 'shell', 'aprosi', 'sicap', 'r16', 'r 16', 'r9', 'r 9',
      'sendou', 'dlm', 'mako', 'sococim', 'secaa', 'oim', 'goree', 'saly', 'fann',
      'somone', 'foundiougne', 'kaolack', 'lafarge', 'lafargeholcim', 'abidjan',
      'richard toll', 'css', 'kaffrine', 'puisard'
    ];

    for (const tok of specificTokens) {
      if (normQ.includes(tok) && (normTitle.includes(tok) || normClient.includes(tok) || normLoc.includes(tok) || normSlug.includes(tok))) {
        score += 10;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestProj = proj;
    }
  }

  if (!bestProj || bestScore < 10) return null;

  const primaryEnt = ENTITIES.find(e => e.id === bestProj.primaryEntityId);
  const partners = bestProj.partnerEntityIds
    .map(pid => ENTITIES.find(e => e.id === pid)?.name || pid)
    .join(', ');

  const techLines = Object.entries(bestProj.technicalData || {})
    .filter(([, v]) => v !== undefined && v !== 'N/A')
    .map(([k, v]) => `**${k} :** ${v}`)
    .join(' · ');

  return {
    id: `dynamic-proj-${bestProj.id}`,
    entityId: bestProj.primaryEntityId,
    keywords: [],
    title: `Étude de Cas · ${bestProj.title}`,
    answer: `🏗️ **Référence Chantier : ${bestProj.title}**
• **Client :** ${bestProj.client}
• **Localisation :** ${bestProj.location} (${bestProj.year} · Statut : **${bestProj.status}**)
• **Entité pilote :** **${primaryEnt?.name || bestProj.primaryEntityId}**${partners ? ` (en synergie avec ${partners})` : ''}
${techLines ? `• **Données techniques :** ${techLines}\n` : ''}
• **Synthèse :** ${bestProj.summary}
• **Défi & Contraintes :** ${bestProj.story.constraints}
• **Solution technique déployée :** ${bestProj.story.solution}
• **Résultats obtenus :** ${bestProj.story.results}${bestProj.testimonial ? `\n• **Témoignage client (${bestProj.testimonial.author}, ${bestProj.testimonial.role} - ${bestProj.testimonial.company}) :** *"${bestProj.testimonial.quote}"*` : ''}`,
    sources: [
      { title: `Étude de cas : ${bestProj.title}`, ref: bestProj.id.toUpperCase(), link: `/projets/${bestProj.slug}` },
      { title: 'Registre complet des réalisations', ref: 'REG-PROJ-2026', link: '/projets' }
    ],
    suggestedAction: { label: 'Voir les photos et détails de cette réalisation', href: `/projets/${bestProj.slug}` },
    followUpQuestions: [
      'Voir toutes les réalisations du groupe au Sénégal',
      `En savoir plus sur l'entité ${primaryEnt?.name || bestProj.primaryEntityId}`,
      'Je souhaite chiffrer un projet similaire'
    ]
  };
}

/**
 * Recherche ultra-précise dans les catalogues temps réel (PRODUCTS_P2M, DEFAULT_SBS_PRODUCTS,
 * EQUIPMENTS, LOGISTIK_MATERIALS, CENTRALE_BETON_PRICES, LAB_TESTS, INITIAL_TILE_CATALOG, PUBLICATIONS, FOUNDER_PROFILE)
 */
function findExactCatalogItemMatch(normQ: string): string | null {
  const highlights: string[] = [];

  // 1. Check specific tile format in INITIAL_TILE_CATALOG (29 dimensions)
  for (const tile of INITIAL_TILE_CATALOG) {
    const normRef = normalizeQuery(tile.reference);
    if (normRef && normQ.includes(normRef)) {
      const m2PerCarton = ((tile.longueurCm * tile.largeurCm * tile.piecesParCarton) / 10000).toFixed(2);
      highlights.push(
        `📦 **Fiche Colisage Carreau ${tile.reference} cm (${tile.id}) :** ${tile.piecesParCarton} pièces/carton (${m2PerCarton} m²/carton)${tile.poidsCartonKg ? ` · Poids : ${tile.poidsCartonKg} kg/carton` : ''}.`
      );
      break;
    }
  }

  // 2. Check specific P2M product (by ref or distinct model name)
  for (const prod of PRODUCTS_P2M) {
    const normRef = normalizeQuery(prod.ref);
    const normName = normalizeQuery(prod.name);
    if (
      (normRef.length >= 5 && normQ.includes(normRef)) ||
      (normQ.includes('esta 2011') && normName.includes('esta 2011')) ||
      (normQ.includes('rosen') && normName.includes('rosen')) ||
      (normQ.includes('exelon') && normName.includes('exelon')) ||
      (normQ.includes('partas') && normName.includes('partas')) ||
      (normQ.includes('sfs 4') && normName.includes('sfs 4')) ||
      (normQ.includes('sfst 1') && normName.includes('sfst 1')) ||
      (normQ.includes('sathvario') && normName.includes('sathvario')) ||
      (normQ.includes('alaska') && normName.includes('alaska')) ||
      (normQ.includes('dyna blue') && normName.includes('dyna blue')) ||
      (normQ.includes('s 1003') && normName.includes('s 1003')) ||
      (normQ.includes('as 105') && normName.includes('as 105'))
    ) {
      highlights.push(
        `🏷️ **Produit P2M identifié · ${prod.name} (Réf. ${prod.ref}) :**\n` +
        `• **Prix officiel :** ${prod.isPriceVisible ? `**${prod.indicativePriceFCFA.toLocaleString('fr-FR')} FCFA HT / ${prod.unit}**` : 'Sur devis'}\n` +
        `• **Dimensions & Matériau :** ${prod.dimensions} · ${prod.material} (${prod.finish})\n` +
        `• **Disponibilité :** ${prod.availability} (${prod.leadTime})`
      );
      break;
    }
  }

  // 3. Check specific SBS Industries product by code
  for (const sbsProd of DEFAULT_SBS_PRODUCTS) {
    const normCode = normalizeQuery(sbsProd.code);
    if (normCode.length >= 3 && normQ.split(' ').includes(normCode)) {
      highlights.push(
        `🏭 **Produit SB-S Industries · ${sbsProd.name} (Code ${sbsProd.code}) :** **${sbsProd.sellingPriceFCFA.toLocaleString('fr-FR')} FCFA / ${sbsProd.unit}** (${sbsProd.availability}) · ${sbsProd.description || ''}`
      );
      break;
    }
  }

  // 4. Check specific Lab Test norm or code
  for (const test of LAB_TESTS) {
    const normCode = normalizeQuery(test.code);
    const normNorm = normalizeQuery(test.norm);
    if (normQ.includes(normCode) || (normNorm.length > 5 && normQ.includes(normNorm.slice(0, 9)))) {
      highlights.push(
        `🔬 **Essai Normalisé SB-S Labo · ${test.name} (${test.code}) :**\n` +
        `• **Norme :** ${test.norm} · **Échantillon requis :** ${test.sampleRequired} · **Délai PV :** ${test.standardDelayDays} jours ouvrés.`
      );
      break;
    }
  }

  // 5. Check specific Equipment code or Logistik Material
  for (const eq of EQUIPMENTS) {
    const normCode = normalizeQuery(eq.code);
    if (normQ.includes(normCode)) {
      highlights.push(
        `🚜 **Engin SB-S Logistik · ${eq.name} (${eq.code}) :** **${(eq.ratePerDayFCFA || 0).toLocaleString('fr-FR')} FCFA HT / jour** (${eq.availabilityStatus}) · ${eq.capacity}.`
      );
      break;
    }
  }

  if (normQ.includes('basalte') || normQ.includes('gravier') || normQ.includes('brouette')) {
    const matLines = LOGISTIK_MATERIALS.map(m => `• **${m.name} :** **${m.price}** (${m.detail})`).join('\n');
    const bpeLines = CENTRALE_BETON_PRICES.map(b => `${b.classe}: ${b.prix}/m³`).join(' · ');
    highlights.push(`🪨 **Grille Granulats & Matériaux SB-S Logistik :**\n${matLines}\n• **Rappel Centrale BPE :** ${bpeLines}`);
  }

  // 6. Check specific scientific publication keyword or founder vision
  if (normQ.includes('doi') || normQ.includes('cisoa') || normQ.includes('stabilises aux liants')) {
    const pub = PUBLICATIONS[0];
    highlights.push(`📚 **Publication Scientifique (${FOUNDER_PROFILE.name}) :** *${pub.title}* (${pub.journalOrEvent}, ${pub.date}${pub.doi ? `, DOI: ${pub.doi}` : ''}) — ${pub.abstract}`);
  }

  return highlights.length > 0 ? highlights.join('\n\n') : null;
}

/**
 * Moteur de recherche sémantique hybride, multi-entités, tolérant aux fautes et doté d'un calculateur instantané
 */
export function queryKnowledgeBase(queryText: string): KnowledgeQueryResult {
  const rawNorm = normalizeQuery(queryText);
  if (!rawNorm) {
    const welcome = AI_KNOWLEDGE_BASE.find(t => t.id === 'salutations-accueil') || AI_KNOWLEDGE_BASE[0];
    return {
      text: welcome.answer,
      sources: welcome.sources,
      suggestedAction: welcome.suggestedAction,
      followUpQuestions: welcome.followUpQuestions
    };
  }

  const expandedQ = expandQueryWithSynonyms(rawNorm);
  const queryWords = expandedQ.split(' ').filter(w => w.length > 1);

  // 1. Calculateur instantané (si l'utilisateur mentionne des surfaces m², volumes m³, quantités ou durées)
  const instantEstimate = computeInstantEstimate(expandedQ);

  // 1b. Fiche produit / équipement / essai / colisage ultra-spécifique
  const exactItemHighlight = findExactCatalogItemMatch(expandedQ);

  // 2. Détection d'un projet/chantier spécifique (ex: UBIPHARM, VIVO Energy, Foundiougne, LafargeHolcim, Sendou...)
  const specificProject = findMatchingProjectDetail(expandedQ);

  // 3. Scoring de tous les sujets de la base de connaissances
  const scoredTopics: { topic: KnowledgeTopic; score: number }[] = [];

  for (const topic of AI_KNOWLEDGE_BASE) {
    let score = 0;

    for (const rawKw of topic.keywords) {
      const normKw = normalizeQuery(rawKw);

      // Exact phrase match in raw or expanded query
      if (rawNorm.includes(normKw)) {
        score += normKw.length > 5 ? 8 : 5;
      } else if (expandedQ.includes(normKw)) {
        score += normKw.length > 5 ? 5 : 3;
      } else {
        // Word-level and fuzzy match
        const kwWords = normKw.split(' ');
        for (const kwWord of kwWords) {
          if (kwWord.length >= 3) {
            if (queryWords.includes(kwWord)) {
              score += 2.5;
            } else if (kwWord.length >= 5) {
              // Fuzzy Levenshtein <= 1
              for (const qw of queryWords) {
                if (qw.length >= 5 && levenshtein(qw, kwWord) <= 1) {
                  score += 2;
                  break;
                }
              }
            }
          }
        }
      }
    }

    // Title match boost
    const normTitle = normalizeQuery(topic.title);
    for (const qw of queryWords) {
      if (qw.length > 3 && normTitle.includes(qw)) {
        score += 2;
      }
    }

    if (score > 0) {
      scoredTopics.push({ topic, score });
    }
  }

  scoredTopics.sort((a, b) => b.score - a.score);

  // Si un projet spécifique est demandé (ex: "Parle-moi du projet UBIPHARM"), on le met en avant
  if (specificProject) {
    const topGeneral = scoredTopics[0];
    const combinedText = instantEstimate
      ? `${instantEstimate}\n\n${specificProject.answer}`
      : specificProject.answer;

    return {
      text: combinedText,
      sources: specificProject.sources,
      suggestedAction: specificProject.suggestedAction,
      followUpQuestions: specificProject.followUpQuestions,
      matchedEntityIds: specificProject.entityId ? [specificProject.entityId] : undefined
    };
  }

  // Si un ou plusieurs sujets matchent (y compris questions multi-entités !)
  if (scoredTopics.length > 0 && scoredTopics[0].score >= 2.5) {
    const primary = scoredTopics[0].topic;
    const secondary =
      scoredTopics.length > 1 &&
      scoredTopics[1].score >= 6 &&
      scoredTopics[1].score >= scoredTopics[0].score * 0.55 &&
      scoredTopics[1].topic.id !== primary.id &&
      primary.id !== 'ecosysteme-7-entites-overview'
        ? scoredTopics[1].topic
        : null;

    const parts: string[] = [];
    if (instantEstimate) {
      parts.push(instantEstimate);
    }
    if (exactItemHighlight) {
      parts.push(exactItemHighlight);
    }
    parts.push(primary.answer);
    if (secondary) {
      parts.push(`---\n**Complément · ${secondary.title} :**\n${secondary.answer}`);
    }

    const mergedSources = [...primary.sources];
    if (secondary) {
      for (const s of secondary.sources) {
        if (!mergedSources.some(ms => ms.ref === s.ref)) {
          mergedSources.push(s);
        }
      }
    }

    const matchedEntityIds = [primary.entityId, secondary?.entityId].filter(Boolean) as string[];

    return {
      text: parts.join('\n\n'),
      sources: mergedSources,
      suggestedAction: primary.suggestedAction,
      followUpQuestions: primary.followUpQuestions,
      matchedEntityIds
    };
  }

  // Si seul le calculateur ou une référence exacte a déclenché (ex: "150 m2", "AC15", "25x40")
  if (instantEstimate || exactItemHighlight) {
    const combined = [instantEstimate, exactItemHighlight].filter(Boolean).join('\n\n');
    return {
      text: `${combined}\n\nSouhaitez-vous établir un devis officiel PDF ou être rappelé par l'un de nos conseillers techniques ?`,
      sources: [
        { title: 'Showroom P2M & Catalogue Tarifs', ref: 'CAT-P2M-2026', link: '/entites/p2m' },
        { title: 'Grille Tarifaire SB-S Industries', ref: 'TAR-IND-2026', link: '/entites/sbs-industries' }
      ],
      suggestedAction: { label: 'Accéder au Showroom P2M', href: '/entites/p2m' },
      followUpQuestions: [
        'Voir tous les tarifs carrelage et sanitaire P2M',
        'Voir tous les tarifs béton et agglos SB-S Industries',
        'Contacter un conseiller sur WhatsApp'
      ]
    };
  }

  // Fallback intelligent qui synthétise les 7 entités avec leurs contacts directs
  const overview = AI_KNOWLEDGE_BASE[0];
  return {
    text: overview.answer,
    sources: overview.sources,
    suggestedAction: overview.suggestedAction,
    followUpQuestions: overview.followUpQuestions
  };
}
