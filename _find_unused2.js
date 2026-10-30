const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const md5 = s => crypto.createHash('md5').update(fs.readFileSync(s)).digest('md5 ? s : '');

// Build used set (web paths)
const siteSrc = fs.readFileSync('src/data/siteImages.ts', 'utf8');
const initSrc = fs.readFileSync('src/data/initialData.ts', 'utf8');
const used = new Set();
// siteImages src values
for (const m of siteSrc.match(/'\/images\/[^']+'/g) || []) {
  used.add(m.replace(/^'/, '').replace(/'$/, ''));
}
// initialData url: values
for (const m of initSrc.match(/url:\s*'\/images\/[^']+'/g) || []) {
  used.add(m.replace(/url:\s*'/, '').replace(/'$/, ''));
}
// initialData imageUrl values
for (const m of initSrc.match(/imageUrl:\s*'\/images\/[^']+'/g) || []) {
  used.add(m.replace(/imageUrl:\s*'/, '').replace(/'$/, ''));
}

console.log('Used refs:', used.size);

// Collect all real files
const allFiles = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.(jpe?g|png|webp|svg)$/i.test(e.name)) allFiles.push(f);
  }
}
walk('public');

let usedCount = 0;
let unused = [];
const usedByMd5 = new Map();
for (const f of allFiles) {
  const web = '/' + path.relative('public', f).replace(/\\/g, '/');
  try {
    const m = md5(f);
    const isUsed = used.has(web);
    if (isUsed) usedCount++;
    else unused.push({ rel: web, md5: m });
    if (!usedByMd5.has(m)) usedByMd5.set(m, { md5: m, used: false, usedPaths: [], unusedPaths: [] });
    const entry = usedByMd5.get(m);
    if (isUsed) { entry.used = true; entry.usedPaths.push(web); }
    else entry.unusedPaths.push(web);
  } catch (e) {}
}
console.log('Disk files scanned:', allFiles.length);
console.log('Matched used:', usedCount);
console.log('Unused files:', unused.length);

console.log('\n=== Unused images (with md5) ===');
unused.sort((a,b)=>a.rel.localeCompare(b.rel));
for (const u of unused.slice(0, 60)) {
  console.log(`  ${u.rel}  md5=${u.md5.slice(0,10)}`);
}
if (unused.length > 60) console.log('  ... and ' + (unused.length-60) + ' more');