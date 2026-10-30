/**
 * Audit casse des donnees : titres, noms, badges, taglines, ctaText
 * dans src/data et prisma/seed, pour detecter les mots fautifs.
 */
const fs = require('fs');

const FILES = ['src/data/initialData.ts', 'src/data/siteImages.ts', 'prisma/seed.ts'];
const ALLOWED = new Set([
  'P2M', 'BTP', 'SB-S', 'SB', 'CRM', 'PDF', 'IA', 'SBS', 'PGT', 'SERMA', 'CDP',
  'WGS84', 'CNSS', 'IPI', 'PDL', 'CBR', 'ISO', 'EN', 'NF', 'AS', 'RO', 'CO', 'EV',
  'HKI', 'WC', 'SFST', 'ESTA', 'DOVER', 'ROSEN', 'EXELON', 'CALACATTA', 'GLOSSY',
  'PVC', 'ABS', 'KVA', 'G2AVP', 'PEI', 'R10', 'R11', 'FCFA', 'A', 'OPAL', 'ROYAL',
  'HS', 'SH', 'QBIX', 'SFS', 'DELUX', 'FINAL', 'APIX', 'AGEROUTE', 'SOCOCIM',
  'VPN', 'JSON', 'API', 'RGPD', 'KPI', 'QR', 'M', 'N', 'C2', 'A2', 'DIASS', 'CES',
  'SECAA', 'OIM', 'DLM', 'CO', 'MCTN', 'ONUDI', 'ISO', 'ASTM', 'NF', 'AASHTO',
]);

function looksSuspicious(value) {
  if (typeof value !== 'string') return false;
  const t = value.trim();
  if (t.length < 5) return false;
  if (!/[A-ZÀ-Ü]/.test(t)) return false;
  if (/[a-zà-ü]/.test(t)) return false; // a des minuscules -> ok
  const words = t.split(/[\s'’&·\-/.,:()0-9"]+/).filter(Boolean);
  const real = words.filter((w) => !ALLOWED.has(w));
  return real.length > 0;
}

let count = 0;
for (const file of FILES) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const re = /(?:name|title|badge|tagline|ctaText|label|subCategory|category|leader|leaderRole|summary|mission|description|role|benefit|client|location|region|sector|status|availability)\s*:\s*(['"])(.*?)\1/g;
    let m;
    while ((m = re.exec(line))) {
      if (looksSuspicious(m[2])) {
        count++;
        console.log(`${file}:${i + 1}  [${m[0].split(':')[0].trim()}]  ${m[2]}`);
      }
    }
  });
}
console.log(`\nTotal suspects: ${count}`);
