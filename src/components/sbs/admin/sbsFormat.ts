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
  { label: 'Flyer Agglos creux', url: '/images/sbs-industries/flyer-agglos-creux.jpg' },
  { label: 'Flyer Agglos pleins', url: '/images/sbs-industries/flyer-agglos-pleins.jpg' },
  { label: 'Flyer Hourdis', url: '/images/sbs-industries/flyer-hourdis.jpg' },
  { label: 'Flyer Pavés', url: '/images/sbs-industries/flyer-paves.jpg' },
  { label: 'Agglos creux usine', url: '/images/sbs-logistik/logistik-equip-065.jpg' },
  { label: 'Palettes agglos cure', url: '/images/sbs-logistik/logistik-equip-064.jpg' },
  { label: 'Centrale à béton 60 m³/h (TeknoMac)', url: '/images/sbs-logistik/logistik-equip-070.jpg' },
  { label: 'Trémie doseuse centrale à béton', url: '/images/sbs-logistik/logistik-equip-071.jpg' },
  { label: 'Camion toupie 10 m³', url: '/images/sbs-logistik/logistik-equip-010.jpg' },
  { label: 'Pompe stationnaire Aquarius', url: '/images/sbs-logistik/logistik-equip-011.jpg' },
  { label: 'Pondeuse QT40-3A', url: '/images/sbs-logistik/logistik-equip-068.jpg' },
  { label: 'Coffrages métalliques', url: '/images/sbs-presentation/sbs-page12-img04.jpeg' },
];
