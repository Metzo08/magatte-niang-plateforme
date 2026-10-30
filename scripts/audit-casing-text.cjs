/**
 * Audit final : parcourt TOUT le contenu texte rendu (hors <script>/<style>)
 * de chaque page et signale les fragments de >=2 mots francais tout en majuscules,
 * en ignorant les acronymes et les chaines "SB-S ...".
 */
const fs = require('fs');
const path = require('path');

const ROOTS = ['src/app', 'src/components'];
const EXTS = ['.tsx'];
const ACRONYMS = new Set(['P2M', 'BTP', 'SB-S', 'SB', 'CRM', 'PDF', 'IA', 'SBS', 'PGT', 'SERMA', 'CDP', 'WGS84', 'CNSS', 'IPI', 'PDL', 'CBR', 'ISO', 'EN', 'NF', 'ASTM', 'AASHTO', 'G2AVP', 'PEI', 'HKI', 'WC', 'ESTA', 'DOVER', 'FCFA', 'SGS', 'SADE', 'TFG', 'EBTP', 'SARL', 'GIE', 'SCC', 'SEN', 'SIA', 'SCI', 'VRD', 'API', 'JSON', 'DIASS', 'CES', 'SECAA', 'OIM', 'DLM', 'MAKO', 'SOCOCIM', 'POLYTECH', 'AGEROUTE', 'APIX', 'RGPD', 'KPI', 'QR', 'R10', 'R11', 'G2', 'AVP', 'M', 'N', 'A', 'C2', 'A2', 'T', 'SH', 'HS', 'AS', 'RO', 'CO', 'EV']);

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
    for (const m of line.matchAll(/>([^<>{}]{6,})</g)) {
      const t = m[1].trim();
      if (!/[A-ZÀ-Ü]/.test(t)) continue;
      if (/[a-zà-ü]/.test(t)) continue;
      const words = t.split(/[\s'’&·/.,:()0-9"«»%+-]+/).filter((w) => w.length >= 2);
      const bad = words.filter((w) => !ACRONYMS.has(w.toUpperCase()));
      if (bad.length) hits.push({ file, line: i + 1, txt: t, bad });
    }
  });
}

console.log(`Texte JSX en majuscules suspect : ${hits.length}\n`);
for (const h of hits) console.log(`${h.file}:${h.line}  [${h.bad.join(', ')}]\n   ${h.txt}\n`);
