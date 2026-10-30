import fs from 'fs';
import path from 'path';

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(f)) out.push(p);
  }
  return out;
}

const files = walk('src');
let changed = 0;
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  // Retire la classe Tailwind "uppercase" (qui force les majuscules) et les appels .toUpperCase()
  const n = c
    .replace(/\buppercase\b(?=[\s'",])/g, '')
    .replace(/\.toUpperCase\(\)/g, '');
  if (n !== c) {
    fs.writeFileSync(f, n);
    console.log(f);
    changed++;
  }
}
console.log(`${changed} fichiers modifiés`);
