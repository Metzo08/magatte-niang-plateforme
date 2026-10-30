    /**
 * Normalise les noms de produits et sous-catégories dans initialData.ts :
 * applique "première lettre majuscule, reste en minuscule" en préservant les
 * segments protégés (noms de marques, modèles, sigles).
 *
 * Ne touche QUE les lignes :  name: '...'  et  subCategory: '...'  situées
 * dans le tableau PRODUCTS_P2M.
 */
const fs = require('fs');

const FILE = 'src/data/initialData.ts';

// Tokens (mots) qui doivent conserver leur casse d'origine, où qu'ils soient.
const PROTECT = new Set([
  'P2M', 'SBS', 'SB-S', 'PGT', 'SERMA', 'BTP', 'ESTA', 'HKI', 'ROSEN',
  'SFST-1', 'TATA', 'VENUS', 'AQUARIUS', 'CALACATTA', 'GLOSSY', 'SATHVARIO',
  'GOLDY', 'ALASKA', 'GREY', 'DYNA', 'BLUE', 'SFS-4', 'DELUX', 'AS-105(A)',
  'Mbao', 'Dakar', 'Sénégal', 'Partas', 'Polytech', 'Rimless', 'One', 'Piece',
  'PVC', 'PEX', 'IPI', 'PDL', 'CBR', 'WC', 'Inox', 'Chromé', 'Chrome',
]);

// Mots-outils qui restent en minuscule même en début de segment après un tiret.
const LOWER_REST = (w) => {
  if (PROTECT.has(w)) return w;
  if (/^[IVX]+$/.test(w)) return w;         // chiffres romains
  if (/\d/.test(w) && /[A-Z]/.test(w)) return w; // codes alphanum (R10, 3D, 60x60)
  if (w.length <= 2) return w.toLowerCase(); // "à", "de", "&"...
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
};

function normalize(str) {
  // Segmente par espaces pour préserver la ponctuation.
  const words = str.split(/(\s+)/); // garde les espaces
  let firstWordSeen = false;
  let prevEndsSegment = true; // début de chaîne = début de segment
  return words
    .map((tok) => {
      if (/^\s+$/.test(tok) || tok === '') return tok;
      // Séparateurs de segment : —, /, (, etc. -> le mot suivant redémarre une majuscule
      const leading = tok.match(/^[«("']*/)?.[0] ?? '';
      const trailing = tok.match(/[»)";:,.]*$/)?.[0] ?? '';
      const core = tok.slice(leading.length, tok.length - trailing.length);
      if (!core) return tok;

      let out;
      if (!firstWordSeen) {
        out = LOWER_REST(core); // premier mot : majuscule initiale
        firstWordSeen = true;
      } else if (prevEndsSegment) {
        out = LOWER_REST(core);
      } else {
        out = PROTECT.has(core) ? core : core.toLowerCase();
      }
      prevEndsSegment = /[—/·:]$/.test(core);
      return leading + out + trailing;
    })
    .join('');
}

const src = fs.readFileSync(FILE, 'utf8');
const lines = src.split(/\r?\n/);

let inProducts = false;
let changed = 0;

const out = lines.map((line) => {
  if (/export const PRODUCTS_P2M/.test(line)) inProducts = true;
  if (inProducts && /^export const [A-Z_]+:/.test(line) && !/PRODUCTS_P2M/.test(line)) inProducts = false;
  if (!inProducts) return line;

  const m = line.match(/^(\s*(?:name|subCategory):\s*')(.*)('\s*,?\s*)$/);
  if (!m) return line;
  const [, pre, val, post] = m;
  const nv = normalize(val);
  if (nv !== val) {
    changed++;
    console.log(`${val}\n  -> ${nv}`);
  }
  return pre + nv + post;
});

fs.writeFileSync(FILE, out.join('\n'));
console.log(`\n${changed} lignes normalisées`);
