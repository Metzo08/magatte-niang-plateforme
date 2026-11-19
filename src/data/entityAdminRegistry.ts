export interface EntityAdminConnection {
  targetId: string;
  targetName: string;
  type: 'directe' | 'indirecte';
  flowLabel: string;
}

export interface EntityAdminSpec {
  id: 'serma-btp' | 'sbs-group' | 'sbs-labo' | 'sbs-industries' | 'sbs-logistik' | 'p2m' | 'pgt';
  name: string;
  shortName: string;
  tagline: string;
  leader: string;
  adminHref: string;
  publicHref: string;
  badgeColor: string;
  modules: string[];
  connections: EntityAdminConnection[];
}

export const ENTITY_ADMIN_REGISTRY: EntityAdminSpec[] = [
  {
    id: 'sbs-labo',
    name: 'SB-S Labo',
    shortName: 'SB-S Labo',
    tagline: 'Géotechnique C2 & Essais Matériaux A3 · PV 24h',
    leader: 'Abdoulaye NIANG (Resp. Labo)',
    adminHref: '/entites/sbs-labo/admin',
    publicHref: '/entites/sbs-labo',
    badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    modules: [
      'Forage hydraulique & sondages (carottage, pressiomètre, piézométrique, pénétro)',
      'Essais labo (Casagrande/Atterberg, œdométrie, CBR, Proctor, cisaillement)',
      'Béton & granulats (Écrasement béton, Los Angeles, Micro Deval, formulation)',
      'Émission PV certifiés 24h & transmission directe SERMA BTP / SB-S Group',
    ],
    connections: [
      { targetId: 'serma-btp', targetName: 'SERMA BTP', type: 'directe', flowLabel: 'Transmettre PV géotechnique C2/A3 pour modélisation 3D/BIM' },
      { targetId: 'sbs-group', targetName: 'SB-S Group', type: 'directe', flowLabel: 'Transmettre PV de réception & contrôle béton chantier' },
    ],
  },
  {
    id: 'serma-btp',
    name: 'SERMA BTP',
    shortName: 'SERMA BTP',
    tagline: 'Études techniques, Modélisation 3D/BIM & Notes de calcul',
    leader: 'Direction Technique SERMA BTP',
    adminHref: '/entites/serma-btp/admin',
    publicHref: '/entites/serma-btp',
    badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    modules: [
      'Réception études géotechniques SB-S Labo (C2/A3)',
      'Modélisation structurelle 3D/BIM & plans d’exécution',
      'Notes de calcul Eurocodes / DTU & dimensionnement fondations',
      'Transmission dossiers validés à SB-S Group',
    ],
    connections: [
      { targetId: 'sbs-labo', targetName: 'SB-S Labo', type: 'directe', flowLabel: 'Demander campagne géotechnique / forage hydraulique' },
      { targetId: 'sbs-group', targetName: 'SB-S Group', type: 'directe', flowLabel: 'Transmettre plans d’exécution & maquette 3D/BIM' },
      { targetId: 'p2m', targetName: 'P2M Showroom', type: 'indirecte', flowLabel: 'Spécifier matériaux & finitions second œuvre' },
    ],
  },
  {
    id: 'sbs-group',
    name: 'SB-S Group',
    shortName: 'SB-S Group',
    tagline: 'Génie Civil, Bâtiment & Exécution des Chantiers',
    leader: 'Magatte NIANG (PDG)',
    adminHref: '/entites/sbs-group/admin',
    publicHref: '/entites/sbs-group',
    badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    modules: [
      'Pilotage chantiers & exécution génie civil / gros œuvre',
      'Réception études SERMA BTP & contrôles SB-S Labo',
      'Mobilisation flotte d’engins SB-S Logistik',
      'Approvisionnement BPE/Agglos SB-S Industries, P2M & PGT',
    ],
    connections: [
      { targetId: 'sbs-logistik', targetName: 'SB-S Logistik', type: 'directe', flowLabel: 'Mobiliser engins lourds, grues & camions bennes' },
      { targetId: 'sbs-industries', targetName: 'SB-S Industries', type: 'directe', flowLabel: 'Commander béton BPE, agglos & pavés' },
      { targetId: 'p2m', targetName: 'P2M Showroom', type: 'directe', flowLabel: 'Commander carrelage, sanitaire & second œuvre' },
      { targetId: 'sbs-labo', targetName: 'SB-S Labo', type: 'directe', flowLabel: 'Planifier prélèvement béton / contrôle chantier' },
    ],
  },
  {
    id: 'sbs-industries',
    name: 'SB-S Industries',
    shortName: 'SB-S Industries',
    tagline: 'Centrale Béton BPE, Agglos, Pavés & Préfabriqués',
    leader: 'Responsable SBS Industrie',
    adminHref: '/entites/sbs-industries/admin',
    publicHref: '/entites/sbs-industries',
    badgeColor: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    modules: [
      'Catalogue industriel BPE, agglos, hourdis, pavés & bordures',
      'Devis, facturation ERP & suivi production Mbao',
      'Livraisons vers chantiers SB-S Group & clients',
    ],
    connections: [
      { targetId: 'sbs-group', targetName: 'SB-S Group', type: 'directe', flowLabel: 'Confirmer livraison BPE / préfabriqués sur chantier' },
      { targetId: 'sbs-labo', targetName: 'SB-S Labo', type: 'directe', flowLabel: 'Demander écrasement éprouvettes béton & granulométrie' },
      { targetId: 'sbs-logistik', targetName: 'SB-S Logistik', type: 'indirecte', flowLabel: 'Réserver toupies & camions plateau' },
    ],
  },
  {
    id: 'sbs-logistik',
    name: 'SB-S Logistik',
    shortName: 'SB-S Logistik',
    tagline: 'Parc Engins Lourds, Grues, Toupies & Transport',
    leader: 'Responsable Parc SBS Logistik',
    adminHref: '/entites/sbs-logistik/admin',
    publicHref: '/entites/sbs-logistik',
    badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    modules: [
      'Exploitation parc (62 engins & matériels lourds)',
      'Expressions de besoins, devis, factures & paiement en ligne',
      'Affectation chantiers SB-S Group & maintenance SAV',
    ],
    connections: [
      { targetId: 'sbs-group', targetName: 'SB-S Group', type: 'directe', flowLabel: 'Affecter engin & chauffeur sur chantier' },
      { targetId: 'pgt', targetName: 'PGT', type: 'indirecte', flowLabel: 'Transport conteneurs port de Dakar → chantiers' },
    ],
  },
  {
    id: 'p2m',
    name: 'P2M Showroom',
    shortName: 'P2M',
    tagline: 'Carrelage, Sanitaire, Robinetterie & Équipements',
    leader: 'Gestionnaire P2M Showroom',
    adminHref: '/entites/p2m/admin',
    publicHref: '/entites/p2m',
    badgeColor: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    modules: [
      'Catalogue carrelages & sanitaires, calculateur m²/cartons',
      'Devis, factures, clients & expressions de besoins',
      'Approvisionnement second œuvre chantiers SB-S Group',
    ],
    connections: [
      { targetId: 'pgt', targetName: 'PGT', type: 'directe', flowLabel: 'Demander sourcing / réapprovisionnement import' },
      { targetId: 'sbs-group', targetName: 'SB-S Group', type: 'directe', flowLabel: 'Expédier lots carrelage & sanitaire sur chantier' },
    ],
  },
  {
    id: 'pgt',
    name: 'PGT (Dubaï · Dakar)',
    shortName: 'PGT',
    tagline: 'Sourcing International, Import-Export & Transit Douane',
    leader: 'Direction PGT Dubaï - Ajman',
    adminHref: '/entites/pgt/admin',
    publicHref: '/entites/pgt',
    badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    modules: [
      'Sourcing fournisseurs Dubaï-Ajman / Chine / Europe',
      'Suivi expéditions maritimes, conteneurs & dédouanement',
      'Livraison directe vers P2M Showroom, SB-S Industries & SB-S Group',
    ],
    connections: [
      { targetId: 'p2m', targetName: 'P2M Showroom', type: 'directe', flowLabel: 'Notifier arrivée conteneur matériaux / carrelage' },
      { targetId: 'sbs-logistik', targetName: 'SB-S Logistik', type: 'directe', flowLabel: 'Planifier enlèvement portuaire & transport' },
      { targetId: 'sbs-group', targetName: 'SB-S Group', type: 'indirecte', flowLabel: 'Livrer équipements importés sur chantier' },
    ],
  },
];

export function getEntityAdminSpec(id: string): EntityAdminSpec | undefined {
  return ENTITY_ADMIN_REGISTRY.find((e) => e.id === id);
}
