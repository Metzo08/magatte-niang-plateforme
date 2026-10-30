/**
 * Audit exhaustif de casse : pour chaque chaine litterale et texte JSX,
 * signale tout MOT de >=4 lettres entierement en majuscules qui n'est pas
 * un acronyme connu. Objectif : "Premiere lettre majuscule, reste minuscule".
 */
const fs = require('fs');
const path = require('path');

// Acronymes / noms propres qui restent legitimement en majuscules
const ALLOWED = new Set([
  'P2M', 'BTP', 'SBS', 'PGT', 'SERMA', 'CRM', 'PDF', 'IA', 'CDP', 'WGS84', 'CNSS',
  'IPI', 'PDL', 'CBR', 'ISO', 'EN', 'NF', 'ASTM', 'AASHTO', 'G2AVP', 'PEI',
  'HKI', 'WC', 'SFST', 'ESTA', 'DOVER', 'ROSEN', 'EXELON', 'CALACATTA', 'GLOSSY',
  'PVC', 'ABS', 'KVA', 'FCFA', 'SGS', 'SADE', 'TFG', 'EBTP', 'SARL', 'GIE',
  'SCC', 'SEN', 'SIA', 'SCI', 'HSE', 'VRD', 'API', 'JSON', 'RGPD', 'KPI', 'QR',
  'DIASS', 'CES', 'SECAA', 'OIM', 'DLM', 'MAKO', 'SOCOCIM', 'POLYTECH', 'AGEROUTE',
  'APIX', 'LCL', 'FCL', 'KANTE', 'KALIA', 'ELECNOR', 'OPAL', 'QBIX', 'DELUX',
  'SFS', 'SH', 'ROYAL', 'HS', 'AS', 'RO', 'CO', 'EV', 'BATINOV', 'SENEGEX',
  'BATICONCEPT', 'CONSTRUC', 'KEBIMO', 'BI', 'TECH', 'BATIMENT', 'GROUP', 'DELTA',
]);

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

function checkText(file, lineNo, txt) {
  const t = txt.trim();
  if (t.length < 4) return;
  if (/[a-zà-ü]/.test(t)) return; // contient des minuscules -> ok
  const words = t.split(/[\s'’&·\-/.,:()0-9"«»%+]+/).filter((w) => w.length >= 4);
  const bad = words.filter((w) => !ALLOWED.has(w.toUpperCase()));
  if (bad.length) hits.push({ file, line: lineNo, txt: t, bad });
}

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/'([^']{4,})'/g)) checkText(file, i + 1, m[1]);
    for (const m of line.matchAll(/"([^"]{4,})"/g)) checkText(file, i + 1, m[1]);
    for (const m of line.matchAll(/>([^<>{}]{4,})</g)) checkText(file, i + 1, m[1]);
  });
}

console.log(`Suspects restants : ${hits.length}\n`);
for (const h of hits) console.log(`${h.file}:${h.line}  [${h.bad.join(', ')}]\n   ${h.txt}\n`);
