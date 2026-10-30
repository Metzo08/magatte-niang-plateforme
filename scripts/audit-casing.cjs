/**
 * Audit de casse : liste les textes JSX litteraux ecrits en MAJUSCULES
 * (hors acronymes legitimes) sur toutes les pages et composants.
 */
const fs = require('fs');
const path = require('path');

const ROOTS = ['src/app', 'src/components'];
const EXTS = ['.tsx', '.ts'];
const ALLOWED = new Set(['P2M', 'BTP', 'SB-S', 'SB', 'CRM', 'PDF', 'IA', 'SBS', 'PGT', 'SERMA', 'CDP', 'WGS84', 'CNSS', 'IPI', 'PDL', 'CBR', 'ISO', 'EN', 'NF', 'AS', 'RO', 'CO', 'EV', 'HKI', 'WC', 'SFST', 'ESTA', 'DOVER', 'ROSEN', 'EXELON', 'CALACATTA', 'GLOSSY', 'PVC', 'ABS', 'KVA', 'T', 'G2AVP', 'PEI', 'R10', 'R11']);

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
    // texte entre > et < contenant au moins 4 majuscules et aucune minuscule
    const re = />([^<>{}]{4,})</g;
    let m;
    while ((m = re.exec(line))) {
      const txt = m[1].trim();
      if (!/[A-ZÀ-Ü]/.test(txt)) continue;
      if (/[a-zà-ü]/.test(txt)) continue;          // contient des minuscules -> OK
      const words = txt.split(/[\s'’&·\-/.,:()0-9]+/).filter(Boolean);
      const realWords = words.filter((w) => !ALLOWED.has(w));
      if (realWords.length === 0) continue;        // que des acronymes autorises
      hits.push({ file, line: i + 1, txt });
    }
  });
}

console.log(`Textes en MAJUSCULES (hors acronymes) : ${hits.length}`);
for (const h of hits) {
  console.log(`${h.file}:${h.line}  ->  ${h.txt}`);
}
