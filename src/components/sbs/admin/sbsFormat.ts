export function fmtFCFA(n: number | null | undefined, decimals = 0): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return `${n.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} F`;
}

export function fmtNum(n: number | null | undefined, decimals = 0): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtPct(ratio: number | null | undefined, decimals = 1): string {
  if (ratio == null || !Number.isFinite(ratio)) return '—';
  return `${(ratio * 100).toFixed(decimals)} %`;
}

export const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const FAMILY_LABELS: Record<string, string> = {
  'agglos-creux': 'Agglos creux',
  'agglos-pleins': 'Agglos pleins',
  hourdis: 'Hourdis',
  paves: 'Pavés',
  beton: 'Béton Prêt à l’Emploi (BPE)',
  location: 'Locations & Équipements',
};

export const SBS_PRESET_IMAGES = [
  // --- PHOTOS AUTHENTIQUES USINE MBAO (ZONE FRANCHE) ---
  { label: '★ Mbao Usine — Texture agglos pleins (dense 31,7 kg)', url: '/images/sbs-industries/sbs-mbao-agglos-pleins-texture.jpg' },
  { label: '★ Mbao Usine — Contrôle mètre 50 cm sur hourdis', url: '/images/sbs-industries/sbs-mbao-hourdis-50cm-mesure.jpg' },
  { label: '★ Mbao Usine — Moulage continu pondeuse automatique', url: '/images/sbs-industries/sbs-mbao-agglos-creux-moulage.jpg' },
  { label: '★ Mbao Usine — Piste de séchage & cure plein air', url: '/images/sbs-industries/sbs-mbao-agglos-creux-parc.jpg' },
  { label: '★ Mbao Usine — Stock palettes expédition chantiers', url: '/images/sbs-industries/sbs-mbao-agglos-creux-stock-palettes.jpg' },

  // --- COTES RÉELLES BRIQUES & BLOCS ---
  { label: 'Agglo creux 10×20×40 (Cote réelle calibrée)', url: '/images/sbs-industries/brique-creuse-10x20x40-teralta.png' },
  { label: 'Agglo creux 12×20×40 (Cote réelle calibrée)', url: '/images/sbs-industries/brique-creuse-12x20x40-teralta.png' },
  { label: 'Agglo creux 15×20×40 (Cote réelle calibrée)', url: '/images/sbs-industries/brique-creuse-15x20x40-teralta.png' },
  { label: 'Agglo creux 20×20×40 (Cote réelle grande section)', url: '/images/sbs-industries/brique-creuse-20x20x40-teralta.png' },
  { label: 'Agglo plein 15×20×40 (Brique pleine étanche)', url: '/images/sbs-industries/brique-pleine-15x20x40-envain.png' },
  { label: 'Hourdis alvéolaire 20×20×50 (Cote réelle dalles)', url: '/images/sbs-industries/hourdis-20x20x50-reel.png' },
  { label: 'Hourdis béton 50 cm Alkern', url: '/images/sbs-industries/hourdis-beton-50cm-alkern.jpg' },
  { label: 'Pavés autobloquants profil H (Ép. 6 et 8 cm)', url: '/images/sbs-industries/pave-h-autobloquant-6cm-8cm.png' },
  { label: 'Pavés charges lourdes 10 cm (Double-T)', url: '/images/sbs-industries/pave-double-t-10cm-contern.jpg' },

  // --- BÉTON BPE & CENTRALES ---
  { label: 'Centrale à béton 60 m³/h (TeknoMac Mbao)', url: '/images/sbs-logistik/logistik-equip-070.jpg' },
  { label: 'Trémie doseuse centrale à béton', url: '/images/sbs-logistik/logistik-equip-071.jpg' },
  { label: 'Coulage structural béton à la pompe', url: '/images/reelles/coulage-beton-pompe-chantier.jpg' },
  { label: 'Camion toupie béton 10 m³ HOWO', url: '/images/sbs-logistik/logistik-equip-010.jpg' },
  { label: 'Pompe à béton stationnaire Aquarius', url: '/images/sbs-logistik/logistik-equip-011.jpg' },

  // --- MATÉRIEL & LOCATIONS SBS ---
  { label: 'Pondeuse automatique QT40-3A', url: '/images/sbs-logistik/logistik-equip-068.jpg' },
  { label: 'Chargeuse sur pneus CAT 950G', url: '/images/sbs-presentation/sbs-page06-img01.jpeg' },
  { label: 'Grue mobile télescopique 50T Samsung', url: '/images/sbs-presentation/sbs-page06-img02.jpeg' },
  { label: 'Nacelle télescopique 30m Aichi', url: '/images/sbs-presentation/sbs-page06-img04.jpeg' },
  { label: 'Bétonnière hydraulique 1 000 L', url: '/images/sbs-presentation/sbs-page07-img01.jpeg' },
  { label: 'Dumper articulé 3 tonnes', url: '/images/sbs-presentation/sbs-page07-img02.jpeg' },
  { label: 'Camion benne 40T HOWO', url: '/images/sbs-presentation/sbs-page08-img01.jpeg' },
  { label: 'Camion plateau porte-engins 50T', url: '/images/sbs-presentation/sbs-page08-img02.jpeg' },

  // --- FLYERS OFFICIELS ARCHIVE ---
  { label: 'Flyer officiel Agglos creux', url: '/images/sbs-industries/flyer-agglos-creux.jpg' },
  { label: 'Flyer officiel Agglos pleins', url: '/images/sbs-industries/flyer-agglos-pleins.jpg' },
  { label: 'Flyer officiel Hourdis', url: '/images/sbs-industries/flyer-hourdis.jpg' },
  { label: 'Flyer officiel Pavés', url: '/images/sbs-industries/flyer-paves.jpg' },
];
