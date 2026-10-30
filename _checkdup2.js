const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const md5 = s => crypto.createHash('md5').update(fs.readFileSync(s)).digest('hex');

const base = 'public/images';
const galDirs = ['reelles', 'realisations'];
const galFiles = [];
for (const d of galDirs) {
  const dir = path.join(base, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) galFiles.push(`${d}/${f}`);
}
const gm = {};
for (const f of galFiles) {
  const p = path.join(base, f);
  if (fs.existsSync(p)) gm[f] = md5(p);
}

// gallery entries from siteImages.ts
const siteSrc = fs.readFileSync('src/data/siteImages.ts', 'utf8');
const block = siteSrc.match(/  'sbs-group': \[[\s\S]*?\n  \],/)[0];
const galEntries = [...block.matchAll(/\{ src: '([^']+)', caption: '([^']*)' \}/g)].map(m => [m[1], m[2]]);

console.log('=== Gallery sbs-group entries:', galEntries.length, '===');
const seen = {};
for (const [src, cap] of galEntries) {
  const rel = src.replace(/^\/images\//, '');
  const m = gm[rel];
  if (!m) { console.log('  MISSING FILE:', rel); continue; }
  console.log(`  ${rel}  [${cap.slice(0,45)}]  md5=${m.slice(0,8)}`);
  if (seen[m]) console.log('    !!! DUPLICATE WITH', seen[m]);
  seen[m] = rel;
}

// Realisations: static project images for sbs-group projects
const initSrc = fs.readFileSync('src/data/initialData.ts', 'utf8');
const realFiles = new Set();
const re = /slug:\s*'([^']*)'[\s\S]*?primaryEntityId:\s*'sbs-group'[\s\S]*?images:\s*\[([\s\S]*?)\]/g;
let m;
while ((m = re.exec(initSrc)) !== null) {
  const slug = m[1];
  const imgs = m[2].match(/url:\s*'([^']+)'/g) || [];
  for (const u of imgs) realFiles.add(u.replace(/url:\s*'/, '').replace(/'$/, ''));
}
console.log('\n=== Realisations (static) sbs-group project images ===');
for (const u of [...realFiles].sort()) {
  const rel = u.replace(/^\/images\//, '');
  const mm = gm[rel] || (fs.existsSync(path.join('public', u)) ? md5(path.join('public', u)) : null);
  console.log(`  ${rel}  md5=${mm ? mm.slice(0,8) : 'N/A'}`);
}

// DB project images
const { PrismaClient } = require('./node_modules/@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    await p.$connect();
    const ps = await p.project.findMany({ where: { primaryEntityId: 'sbs-group' } });
    console.log('\n=== Realisations (DB) sbs-group project images ===');
    for (const x of ps) {
      const imgs = Array.isArray(x.images) ? x.images : [];
      for (const i of imgs) {
        const u = (typeof i === 'string' ? i : i.url);
        const rel = u.replace(/^\/images\//, '');
        const mm = gm[rel] || (fs.existsSync(path.join('public', u)) ? md5(path.join('public', u)) : null);
        console.log(`  ${x.slug} -> ${rel}  md5=${mm ? mm.slice(0,8) : 'N/A'}`);
      }
    }
  } catch (e) { console.log('DB err', e.message); }
  finally { await p.$disconnect(); }
})();