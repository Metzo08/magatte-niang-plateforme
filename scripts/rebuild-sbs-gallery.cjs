/**
 * Reconstruit la galerie ENTITY_GALLERY['sbs-group'] avec UNIQUEMENT des images
 * absentes de la section Réalisations SB-S Group (proj-02, 05, 06, 07, 08, 09, 10).
 *
 * Exclues (doublons Réalisations) : CES 01-04, Mako 01-04 (+ Mako 07 == Mako 02 en MD5),
 * SECAA 01-04, SOCOCIM 01-04, OIM 01-04, pont-mixte-acier-beton-fatick,
 * sbs-dallage-industriel-arme, sbs-reel-006.
 * Exclues aussi : sbs-reel-008 (MD5 identique à sbs-reel-004).
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'data', 'siteImages.ts');
let src = fs.readFileSync(file, 'utf8');

// [fichier, légende] — images NON utilisées dans les Réalisations SB-S Group
const gallery = [
  ['coulage-beton-pompe-chantier.jpg', 'Coulage de béton par pompage sur chantier industriel — SB-S Group'],
  ['sbs-reel-001.jpg', 'Levage et montage sur chantier — coordination des équipes'],
  ['sbs-reel-002.jpg', "Chantier SB-S Group — travaux d'exécution"],
  ['sbs-reel-003.jpg', 'Génie civil — ouvrage en cours de réalisation'],
  ['sbs-reel-004.jpg', "Gros œuvre et structure — chantier du groupe"],
  ['sbs-reel-005.jpg', 'Infrastructure béton — mise en œuvre sur site'],
  ['sbs-reel-007.jpg', "Ouvrages d'art et infrastructures — vue de chantier"],
  ['projet-polytech-bureaux-sococim-05.jpg', 'Bâtiment de bureaux achevé — carrière SOCOCIM (vue complémentaire)'],
  ['projet-secaa-aire-lavage-06.jpg', 'Aire de lavage industrielle livrée — SECAA SA (vue complémentaire)'],
  ['projet-ces-stockage-sendou-05.jpg', "Aménagements et voiries d'accès — CES Sendou"],
  ['projet-ces-stockage-sendou-06.jpg', 'Sécurisation des installations industrielles — CES Sendou'],
  ['projet-ces-stockage-sendou-07.jpg', 'Ouvrage industriel achevé — CES Sendou'],
  ['projet-dlm-usine-oxygene-mako-05.jpg', "Canalisations industrielles et réseaux fluides — Mako"],
  ['projet-dlm-usine-oxygene-mako-06.jpg', "Mise en service de l'unité de production d'oxygène — Mako"],
  ['projet-oim-societe-generale-05.jpg', 'Chantier OIM — poursuite des travaux'],
  ['projet-oim-societe-generale-06.jpg', 'Ouvrages humanitaires — avancement des travaux'],
  ['projet-oim-societe-generale-07.jpg', 'Bâtiments OIM — fin de chantier'],
  ['pont-fatick-mixte.jpg', "Ouvrage d'art mixte acier-béton — vue complémentaire"],
  ['pont-franchissement-eau.jpg', 'Franchissement hydraulique — infrastructure livrée'],
];

// Vérifie que chaque fichier existe réellement dans public/
const missing = [];
for (const [f] of gallery) {
  for (const dir of ['reelles', 'realisations']) {
    if (fs.existsSync(path.join(__dirname, '..', 'public', 'images', dir, f))) break;
    if (dir === 'realisations') missing.push(f);
  }
}
if (missing.length) {
  console.error('FICHIERS INTROUVABLES :', missing);
  process.exit(1);
}

const lines = gallery
  .map(([f, cap]) => {
    const esc = cap.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const prefix = f.startsWith('pont-') ? '/images/realisations/' : '/images/reelles/';
    return `    { src: '${prefix}${f}', caption: '${esc}' },`;
  })
  .join('\n');
const block = `  'sbs-group': [\n${lines}\n  ],`;

// Remplace le bloc existant (du "'sbs-group': [" jusqu'au "  ]," fermant)
const re = /  'sbs-group': \[[\s\S]*?\n  \],/;
if (!re.test(src)) {
  console.error('Bloc sbs-group introuvable dans siteImages.ts');
  process.exit(1);
}
src = src.replace(re, block);
fs.writeFileSync(file, src, 'utf8');
console.log(`OK — galerie sbs-group reconstruite : ${gallery.length} images, aucune en commun avec les Réalisations.`);
