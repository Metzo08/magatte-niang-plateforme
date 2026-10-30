/**
 * Audit final de casse : parcourt TOUT le texte visible (JSX entre > et <,
 * et props/champs texte connus) de src/ et signale les fragments en Title Case
 * (mot apres le 1er commencant par une majuscule) OU en TOUT MAJUSCULES, en
 * EXCLUANT les noms propres, lieux, marques et acronymes legitimes.
 *
 * Objectif : verifier la regle "Premiere lettre majuscule, reste en minuscule".
 * Usage : node scripts/audit-casse-final.cjs
 */
const fs = require('fs');
const path = require('path');

// Mots a majuscule interne legitimes (noms propres, lieux, marques, sigles, code).
const KEEP = new Set([
  // Sigles / acronymes
  'P2M', 'BTP', 'SB-S', 'SB', 'SBS', 'CRM', 'PDF', 'IA', 'CDP', 'WGS84', 'CNSS', 'IPI',
  'PDL', 'CBR', 'ISO', 'EN', 'NF', 'ASTM', 'AASHTO', 'G2AVP', 'PEI', 'HKI', 'WC', 'HSE',
  'SFST', 'ESTA', 'DOVER', 'PVC', 'ABS', 'KVA', 'FCFA', 'SGS', 'SADE', 'TFG', 'EBTP',
  'SARL', 'GIE', 'SCC', 'SEN', 'SIA', 'SCI', 'VRD', 'API', 'JSON', 'RGPD', 'KPI', 'QR',
  'FCL', 'LCL', 'DWG', 'DXF', 'DOCX', 'XLSX', 'ZIP', 'R10', 'R11', 'G2', 'AVP', 'HEB',
  'IPE', 'C2TE', 'MCTN', 'ONUDI', 'S355', 'PNG', 'JPG', 'HT', 'TTC', 'RGA', 'UEMOA',
  // Marques / societes / organismes
  'Magatte', 'Niang', 'WhatsApp', 'Google', 'Maps', 'SERMA', 'PGT', 'POLYTECH',
  'SOCOCIM', 'AGEROUTE', 'APIX', 'SECAA', 'OIM', 'DLM', 'MAKO', 'SENEGEX', 'BATICONCEPT',
  'BATINOV', 'KEBIMO', 'ELECNOR', 'OPAL', 'QBIX', 'DELUX', 'ROSEN', 'EXELON',
  'CALACATTA', 'GLOSSY', 'ROYAL', 'KANTE', 'KALIA', 'GROUP', 'DELTA', 'TATA',
  'Logistik', 'Industries', 'Labo', 'Group', 'Sourcing', 'Transit', 'Polytech',
  'General', 'Trading', 'Caterpillar', 'Liebherr', 'Grove', 'Iveco', 'Mercedes',
  'Venus', 'Tiles', 'Excelon', 'Dover', 'Sathvario', 'Goldy', 'Alaska', 'Grey',
  'Dyna', 'Blue', 'Eurocodes', 'Eurocode', 'Portland', 'Proctor', 'Perkins',
  // Lieux / geographie
  'Sénégal', 'Dakar', 'Thiès', 'Thies', 'Saint-Louis', 'Fatick', 'Kaolack', 'Diourbel',
  'Ziguinchor', 'Louga', 'Tambacounda', 'Kédougou', 'Kolda', 'Matam', 'Sédhiou',
  'Kaffrine', 'Diamniadio', 'Mbao', 'Saloum', 'Plateau', 'Hann', 'Rufisque', 'Afrique',
  'Europe', 'Asie', 'Italie', 'Espagne', 'Inde', 'France', 'Turquie', 'Chine', 'Diass',
  'Mako', 'Keur', 'Gorgui', 'Sindia', 'Bargny', 'Mékhé', 'Tivaouane', 'Pout', 'Saly',
  'Sendou', 'Gorée', 'Sine', 'Fann', 'Hann', 'Sahel', 'CISOA', 'Kirène',
  // Noms de personnes
  'Amadou', 'Babacar', 'Ibrahima', 'Aminata', 'Cheikh', 'Tidiane', 'Diop', 'Badara',
  'Diagne', 'Diallo', 'Ndiaye', 'Sow', 'Kane', 'Sarr', 'Fall', 'Ba', 'Ndoye', 'Gueye',
  'Sagna', 'Bineta', 'Bintou', 'Fatou', 'Awa', 'Moussa', 'Omar', 'Seydou',
  // Mots outils / titres
  'Boulevard', 'Centenaire', 'Commune', 'Industrielle', 'Zone', 'Supérieure', 'École',
  'Polytechnique', 'Master', 'Congrès', 'Revue', 'Article', 'Conférence', 'Manuel',
  'Support', 'Guide', 'Loi', 'Dr', 'M', 'Mme',
]);

const ROOTS = ['src/app', 'src/components', 'src/data'];
const EXTS = ['.tsx', '.ts'];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXTS.includes(path.extname(f))) out.push(p);
  }
  return out;
}

const stop = new Set(['de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'et', 'en', 'au',
  'aux', 'à', 'a', 'pour', 'par', 'sur', 'sous', 'dans', 'avec', 'sans', 'ou', 'où', 'que',
  'qui', 'd', 'l', 'the', 'of', 'and', 'to', 'in', 'on', 'for', 'with']);

function clean(w) { return w.replace(/^[«"'([]*/, '').replace(/[»"'),.;:!?%]+$/, ''); }

function assess(text, file, lineNo, hits) {
  const t = text.trim();
  if (!/\s/.test(t)) return;
  if (/https?:|www\.|@|\.(png|jpg|jpeg|svg|webp|pdf|tsx?)\b/.test(t)) return;
  if (/[=;()\\/{}\[\]]/.test(t)) return; // code / JSX
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 2) return;

  // 1) Title Case : mot non-initial commencant par Maj-minuscule
  const titleBad = words.slice(1).filter((w) => {
    const c = clean(w);
    if (c.length <= 2) return false;
    if (!/^[A-ZÀ-Þ][a-zà-ÿ]/.test(c)) return false;
    if (KEEP.has(c)) return false;
    if (stop.has(c.toLowerCase())) return true; // ex. "Le", "De" en plein milieu
    return true;
  });

  // 2) Tout en majuscules (>=4 lettres), hors sigles
  const upperBad = words.filter((w) => {
    const c = clean(w);
    if (c.length < 4) return false;
    if (!/^[A-ZÀ-Þ]+$/.test(c)) return false;
    if (KEEP.has(c)) return false;
    if (/[0-9]/.test(c)) return false;
    return true;
  });

  if (titleBad.length || upperBad.length) {
    hits.push({ file, lineNo, txt: t, titleBad, upperBad });
  }
}

const files = ROOTS.flatMap((r) => walk(r));
const hits = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split(/\r?\n/);
  lines.forEach((line, i) => {
    // texte JSX
    for (const m of line.matchAll(/>([^<>{}]{4,})</g)) assess(m[1], file, i + 1, hits);
    // props/champs texte
    for (const m of line.matchAll(/(?:title|label|desc|description|heading|tagline|badge|eyebrow|subtitle|caption|name|intro|role|placeholder|text|message|summary|location|city|client|category|norm|material|brand|status|mission|quote|author|company)\s*:\s*'([^']{4,})'/g)) assess(m[1], file, i + 1, hits);
    for (const m of line.matchAll(/(?:title|label|heading|subtitle|eyebrow|placeholder|description|alt|message)\s*=\s*"([^"]{4,})"/g)) assess(m[1], file, i + 1, hits);
  });
}

console.log(`Suspects de casse : ${hits.length}\n`);
for (const h of hits) {
  const tags = [];
  if (h.titleBad.length) tags.push('Title:' + h.titleBad.join(' '));
  if (h.upperBad.length) tags.push('MAJ:' + h.upperBad.join(' '));
  console.log(`${h.file}:${h.lineNo}  [${tags.join(' | ')}]\n   ${h.txt}\n`);
}
