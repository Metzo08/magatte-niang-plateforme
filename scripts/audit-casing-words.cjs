/**
 * Audit cible : trouve les chaines litterales ou le texte JSX contenant des mots
 * francais COURANTS (>=4 lettres) entierement en MAJUSCULES.
 */
const fs = require('fs');
const path = require('path');

// Mots courants qui ne devraient jamais etre tout en majuscules
const COMMON = /\b(?:RESEAU|RÉSEAU|SÉNÉGAL|SENEGAL|EXPERT|DIRECTION|CONTACT|PRODUIT|PRIX|INDICATIF|LABORATOIRE|ETUDES|ÉTUDES|ESSAIS|BETON|BÉTON|TOPOGRAPHIE|CLIENT|PROJET|CONSTRUCTION|BATIMENT|BÂTIMENT|MANUFACTURES|INGENIERIE|INGÉNIERIE|GROUP|GROUPE|CENTRALE|CHATEAU|CHÂTEAU|STATION|IMMEUBLE|HANGAR|MUR|SOUTENEMENT|SOUTÈNEMENT|RESERVOIRS|RÉSERVOIRS|INDUSTRIELS|ECOLE|ÉCOLE|CENTRE|SOLAIRE|SERVICE|PORCELAINE|CERAMIQUE|CÉRAMIQUE|FAIENCE|FAÏENCE|AGGLOS|PAVES|PAVÉS|CIMENT|SABLE|GRAVIER|LOCATION|ENGINS|LOGISTIQUE|SOURCING|TRANSIT|GARANTIES|CONTRACTUELLES|AVANTAGES|REFERENCE|RÉFÉRENCE|ECRASEMENT|ÉCRASEMENT|CONSTRUCTION|STATION)\b/;

const ROOTS = ['src/app', 'src/components', 'src/data'];
const EXTS = ['.tsx', '.ts'];

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXTS.includes(path.extname(f))) out.push(p);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r));
const hits = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    // sectionne sur les chaines entre guillemets et le texte entre balises
    const chunks = [
      ...line.matchAll(/'([^']{4,})'/g),
      ...line.matchAll(/"([^"]{4,})"/g),
      ...line.matchAll(/>([^<>{}]{4,})</g),
    ];
    for (const m of chunks) {
      const txt = m[1];
      if (/[a-zà-ü]/.test(txt)) continue; // contient des minuscules -> ok
      if (!COMMON.test(txt)) continue;
      hits.push({ file, line: i + 1, txt: txt.trim() });
    }
  });
}

console.log(`Occurrences suspectes : ${hits.length}\n`);
for (const h of hits) console.log(`${h.file}:${h.line}\n   ${h.txt}\n`);
