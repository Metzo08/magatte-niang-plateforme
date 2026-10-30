const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const md5 = s => crypto.createHash('md5').update(fs.readFileSync(s)).digest('hex');

const gal = [
  'reelles/coulage-beton-pompe-chantier.jpg',
  'reelles/sbs-reel-001.jpg', 'reelles/sbs-reel-002.jpg', 'reelles/sbs-reel-003.jpg',
  'reelles/sbs-reel-004.jpg', 'reelles/sbs-reel-005.jpg', 'reelles/sbs-reel-007.jpg',
  'reelles/projet-polytech-bureaux-sococim-05.jpg',
  'reelles/projet-secaa-aire-lavage-06.jpg',
  'reelles/projet-ces-stockage-sendou-05.jpg', 'reelles/projet-ces-stockage-sendou-06.jpg',
  'reelles/projet-ces-stockage-sendou-07.jpg',
  'reelles/projet-dlm-usine-oxygene-mako-05.jpg', 'reelles/projet-dlm-usine-oxygene-mako-06.jpg',
  'reelles/projet-oim-societe-generale-05.jpg', 'reelles/projet-oim-societe-generale-06.jpg',
  'reelles/projet-oim-societe-generale-07.jpg',
  'realisations/pont-fatick-mixte.jpg', 'realisations/pont-franchissement-eau.jpg',
];
const g = {};
for (const f of gal) {
  const p = path.join('public/images', f);
  if (fs.existsSync(p)) g[f] = md5(p);
  else console.log('MISSING', f);
}

const src = fs.readFileSync('src/data/initialData.ts', 'utf8');
const urls = [...new Set(src.match(/'\/images\/[^']+'|\/images\/[^\s,)\]]+/g).map(s => s.replace(/['\s,)]/g, '')))];
console.log('distinct urls in initialData:', urls.length);

let dups = 0;
for (const u of urls) {
  const p = path.join('public', u);
  if (!fs.existsSync(p)) { console.log('MISSING-IN-DATA', u); continue; }
  const m = md5(p);
  for (const gf in g) {
    if (g[gf] === m && gf !== u) { console.log('DUP:', gf, '<->', u); dups++; }
  }
}
console.log('total dup pairs:', dups);