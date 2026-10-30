/**
 * Audit TITLE CASE : détecte les chaînes texte JSX contenant des mots
 * (hors premier mot) commençant par une majuscule, ce qui viole la règle
 * "première lettre majuscule, reste en minuscule".
 * Ignore : acronymes, mots d'une lettre, chaînes techniques (refs, codes).
 */
const fs = require('fs');
const path = require('path');

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

// Détection multi-lignes : tout texte entre > et < sur plusieurs lignes.
for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  for (const m of raw.matchAll(/>[ \t]*\n([\s\S]{4,200}?)\n[ \t]*</g)) {
    const block = m[1].replace(/<[^>]*>/g, '').replace(/\{[^}]*\}/g, '').trim();
    if (!/[a-zA-ZÀ-ÿ]/.test(block)) continue;
    const lineNo = raw.slice(0, m.index).split(/\r?\n/).length;
    const words = block.split(/\s+/).filter(Boolean);
    if (words.length < 2) continue;
    const bad = words.slice(1).filter((w) => /^[A-ZÀ-Þ][a-zà-ÿ]/.test(w) && w.length > 2);
    if (bad.length) hits.push({ file, line: lineNo, txt: block, bad: bad.join(' ') });
  }
}

// Chaînes entre > et < (texte JSX direct) OU entre guillemets simples/doubles de props
// Ne garde que les fragments alphabétiques avec espaces.
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const stripped = line.replace(/\/\/.*$/, '').replace(/\{[^}]*\}/g, '');
    const candidates = [];
    for (const m of stripped.matchAll(/>([^<>{}]{4,})</g)) candidates.push(m[1].trim());
    // Chaînes de props/objets : title: '...', label: '...', heading: '...', desc: '...'
    for (const m of stripped.matchAll(/(?:title|label|heading|desc|description|tagline|badge|eyebrow|subtitle|caption|name|intro|role)\s*:\s*'([^']{6,})'/g)) candidates.push(m[1].trim());
    // Props JSX en guillemets doubles : title="...", eyebrow="...", label="..."
    for (const m of stripped.matchAll(/(?:title|label|heading|subtitle|eyebrow|placeholder|description)\s*=\s*"([^"]{6,})"/g)) candidates.push(m[1].trim());
    for (const c of candidates) {
      if (!/[A-Za-zÀ-ÿ]/.test(c)) continue;
      const words = c.split(/\s+/).filter(Boolean);
      if (words.length < 2) continue;
      // Mots avec majuscule initiale mais pas tout en majuscules (donc pas un acronyme)
      const bad = words.slice(1).filter(
        (w) => /^[A-ZÀ-Þ][a-zà-ÿ]/.test(w) && w.length > 2
      );
      if (bad.length) hits.push({ file, line: i + 1, txt: c, bad: bad.join(' ') });
    }
  });
}

console.log(`Title Case suspect : ${hits.length}\n`);
for (const h of hits) console.log(`${h.file}:${h.line}  [${h.bad}]\n   ${h.txt}\n`);
