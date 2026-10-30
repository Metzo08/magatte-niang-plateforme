/**
 * Audit des images du catalogue P2M.
 * Vérifie que chaque produit de PRODUCTS_P2M (src/data/initialData.ts) et que
 * chaque entrée de ENTITY_GALLERY.p2m (src/data/siteImages.ts) pointent vers
 * des fichiers RÉELLEMENT présents dans public/.
 *
 * Usage : node scripts/audit-p2m-images.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');

// Récupère tous les chemins '/images/...' d'un fichier source
function extractImagePaths(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  // Chemin complet exige : dossier + nom de fichier avec extension
  const matches = src.match(/\/images\/[A-Za-z0-9._/-]+\.[A-Za-z]{3,4}/g) || [];
  return { src, paths: [...new Set(matches)] };
}

// Vérifie qu'une image référencée existe sur le disque
function exists(ref) {
  return fs.existsSync(path.join(PUBLIC_DIR, ref.replace(/^\//, '')));
}

// Extrait les blocs produits P2M (id + ref + images[])
function extractProducts(src) {
  const block = src.slice(src.indexOf('export const PRODUCTS_P2M'));
  const products = [];
  const re = /id:\s*'(prod-\d+)'[\s\S]*?ref:\s*'([^']+)'[\s\S]*?images:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const images = [...m[3].matchAll(/'([^']+)'/g)].map(x => x[1]);
    products.push({ id: m[1], ref: m[2], images });
  }
  return products;
}

const initial = extractImagePaths('src/data/initialData.ts');
const siteImages = extractImagePaths('src/data/siteImages.ts');

const products = extractProducts(initial.src);

let missingCount = 0;
let noImageCount = 0;

console.log(`\n=== AUDIT IMAGES CATALOGUE P2M ===`);
console.log(`Produits trouvés : ${products.length}\n`);

for (const p of products) {
  if (p.images.length === 0) {
    console.log(`❌ ${p.id} (${p.ref}) — AUCUNE IMAGE`);
    noImageCount++;
    continue;
  }
  const broken = p.images.filter(img => !exists(img));
  if (broken.length > 0) {
    console.log(`❌ ${p.id} (${p.ref}) — image(s) manquante(s) : ${broken.join(', ')}`);
    missingCount++;
  } else {
    console.log(`✅ ${p.id} (${p.ref}) — ${p.images.length} image(s) OK`);
  }
}

// Audit de la galerie d'entité P2M
console.log(`\n=== AUDIT GALERIE ENTITÉ P2M ===`);
const galleryStart = siteImages.src.indexOf('p2m: [');
const galleryEnd = siteImages.src.indexOf('],', galleryStart);
const p2mGalleryBlock = siteImages.src.slice(galleryStart, galleryEnd);
const galleryRefs = [...new Set([...p2mGalleryBlock.matchAll(/'(\/images\/[^']+)'/g)].map(x => x[1]))];
let galleryMissing = 0;
for (const ref of galleryRefs) {
  if (!exists(ref)) {
    console.log(`❌ ${ref} — FICHIER INTROUVABLE`);
    galleryMissing++;
  }
}
console.log(`Galerie P2 : ${galleryRefs.length} référence(s), ${galleryMissing} manquante(s)`);

// Audit global des deux fichiers
console.log(`\n=== AUDIT GLOBAL DES RÉFÉRENCES IMAGES ===`);
const allRefs = [...new Set([...initial.paths, ...siteImages.paths])];
const globalMissing = allRefs.filter(ref => !exists(ref));
if (globalMissing.length === 0) {
  console.log(`✅ Toutes les ${allRefs.length} références /images/... existent.`);
} else {
  console.log(`❌ ${globalMissing.length} référence(s) introuvable(s) sur ${allRefs.length} :`);
  globalMissing.forEach(ref => console.log(`   - ${ref}`));
}

// Détection des images partagées entre plusieurs produits (souvent une erreur de mapping)
console.log(`\n=== IMAGES PARTAGÉES ENTRE PRODUITS ===`);
const usage = new Map();
for (const p of products) {
  for (const img of p.images) {
    if (!usage.has(img)) usage.set(img, []);
    usage.get(img).push(p.ref);
  }
}
const shared = [...usage.entries()].filter(([, refs]) => refs.length > 1);
if (shared.length === 0) {
  console.log('✅ Aucune image partagée entre produits.');
} else {
  shared.forEach(([img, refs]) => console.log(`⚠️  ${img} → ${refs.join(', ')}`));
}

const totalIssues = missingCount + noImageCount + galleryMissing + globalMissing.length;
console.log(`\n=== RÉSULTAT : ${totalIssues === 0 ? 'AUCUN PROBLÈME ✅' : totalIssues + ' PROBLÈME(S) ❌'} ===\n`);

process.exit(totalIssues === 0 ? 0 : 1);
