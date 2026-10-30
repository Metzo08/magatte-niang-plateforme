/**
 * Recadre les flyers SB-S Logistik pour extraire la PHOTO de l'engin (sans le
 * logo, le titre ni le prix en surimpression) et produit des visuels propres
 * dans public/images/engins/.
 *
 * Les coordonnees sont exprimees en FRACTION de la largeur/hauteur du flyer
 * (0 = gauche/haut, 1 = droite/bas) pour etre independantes de la resolution.
 *
 * Usage : node scripts/crop-engins.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = 'public/images/reelles';
const OUT = 'public/images/engins';

// flyer -> { crop: [left, top, width, height] en fraction, out: nom de sortie }
const JOBS = [
  // --- Flyers individuels (photo principale nette) ---
  { src: 'logistik-017.jpg', crop: [0.045, 0.235, 0.55, 0.41], out: 'camion-grue-6t.jpg' },
  { src: 'logistik-014.jpg', crop: [0.058, 0.330, 0.855, 0.300], out: 'camion-benne-40t.jpg' },
  { src: 'logistik-017.jpg', crop: [0.20, 0.600, 0.765, 0.37], out: 'camion-plateau-groupe.jpg' },

  // --- Planche equipements (logistik-004, 905x1280) : 2 colonnes x 3 rangees ---
  { src: 'logistik-004.jpg', crop: [0.008, 0.100, 0.220, 0.175], out: 'tractopelle.jpg' },
  { src: 'logistik-004.jpg', crop: [0.490, 0.100, 0.240, 0.185], out: 'nacelle.jpg' },
  { src: 'logistik-004.jpg', crop: [0.008, 0.335, 0.220, 0.175], out: 'dumper.jpg' },
  { src: 'logistik-004.jpg', crop: [0.490, 0.335, 0.240, 0.175], out: 'toupie-beton.jpg' },
  { src: 'logistik-004.jpg', crop: [0.008, 0.580, 0.220, 0.150], out: 'pompe-beton.jpg' },
  { src: 'logistik-004.jpg', crop: [0.490, 0.580, 0.240, 0.160], out: 'camion-plateau.jpg' },

  // --- Planche engins & materiaux (logistik-005, 905x1280) : 2 colonnes x 4 rangees ---
  { src: 'logistik-005.jpg', crop: [0.005, 0.105, 0.235, 0.175], out: 'graviers.jpg' },
  { src: 'logistik-005.jpg', crop: [0.497, 0.105, 0.233, 0.175], out: 'sable.jpg' },
  { src: 'logistik-005.jpg', crop: [0.005, 0.335, 0.195, 0.165], out: 'ciment.jpg' },
  { src: 'logistik-005.jpg', crop: [0.497, 0.335, 0.233, 0.175], out: 'brouette.jpg' },
  { src: 'logistik-005.jpg', crop: [0.005, 0.590, 0.230, 0.200], out: 'grue-mobile-50t.jpg' },
  { src: 'logistik-005.jpg', crop: [0.497, 0.600, 0.233, 0.175], out: 'camion-grue-6t-planche.jpg' },
  { src: 'logistik-005.jpg', crop: [0.005, 0.815, 0.230, 0.155], out: 'camion-benne-40t-planche.jpg' },
  { src: 'logistik-005.jpg', crop: [0.497, 0.815, 0.233, 0.155], out: 'camion-tata-6t.jpg' },

  // --- Flyers individuels d'engins (structure : logo haut, PHOTO centrale, prix bas) ---
  // La photo occupe generalement x 0.13-0.88 et y 0.34-0.87 du flyer.
  { src: 'logistik-015.jpg', crop: [0.06, 0.355, 0.80, 0.50], out: 'compacteur-rouleaux.jpg' },
  { src: 'logistik-019.jpg', crop: [0.13, 0.36, 0.74, 0.50], out: 'dumper.jpg' },
  { src: 'logistik-012.jpg', crop: [0.13, 0.34, 0.74, 0.52], out: 'betonniere-1000l.jpg' },
  { src: 'logistik-009.jpg', crop: [0.13, 0.34, 0.74, 0.52], out: 'auto-betonniere-venus.jpg' },
  // Pompe a beton : la photo (AQUARIUS 1407D) est en HAUT du flyer
  { src: 'logistik-013.jpg', crop: [0.0, 0.02, 0.82, 0.28], out: 'pompe-beton.jpg' },
  { src: 'logistik-010.jpg', crop: [0.14, 0.35, 0.73, 0.52], out: 'groupe-electrogene.jpg' },
  { src: 'logistik-001.jpg', crop: [0.13, 0.34, 0.74, 0.52], out: 'nacelle.jpg' },
  { src: 'logistik-003.jpg', crop: [0.13, 0.34, 0.74, 0.52], out: 'camion-plateau.jpg' },
  { src: 'logistik-020.jpg', crop: [0.13, 0.34, 0.74, 0.52], out: 'toupie-beton.jpg' },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const job of JOBS) {
    const from = path.join(SRC, job.src);
    const meta = await sharp(from).metadata();
    const [lf, tf, wf, hf] = job.crop;
    const left = Math.max(0, Math.min(meta.width - 1, Math.floor(lf * meta.width)));
    const top = Math.max(0, Math.min(meta.height - 1, Math.floor(tf * meta.height)));
    const width = Math.max(1, Math.min(meta.width - left, Math.round(wf * meta.width)));
    const height = Math.max(1, Math.min(meta.height - top, Math.round(hf * meta.height)));
    const to = path.join(OUT, job.out);
    await sharp(from)
      .extract({ left, top, width, height })
      .resize({ width: 1200, withoutEnlargement: false })
      .jpeg({ quality: 82 })
      .toFile(to);
    console.log(`${job.src} -> ${job.out} (${width}x${height} extrait de ${meta.width}x${meta.height})`);
  }
  console.log('Termine.');
})().catch((e) => {
  console.error('Erreur:', e.message);
  process.exit(1);
});
