/**
 * Audit Title Case cible sur un fichier : liste toute chaine de >=2 mots ou le
 * 2e mot (ou suivant) commence par une minuscule-apres-majuscule (Title Case),
 * en excluant les noms propres connus. Sert a reperer les textes a normaliser.
 *
 * Usage : node scripts/audit-file-titlecase.cjs <fichier>
 */
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/audit-file-titlecase.cjs <fichier>'); process.exit(1); }

// Noms propres / mots a majuscule interne legitimes.
const KEEP = new Set([
  'Sénégal', 'Dakar', 'Thiès', 'Thies', 'Fatick', 'Kaolack', 'Diourbel', 'Ziguinchor',
  'Louga', 'Tambacounda', 'Kédougou', 'Kolda', 'Matam', 'Sédhiou', 'Kaffrine',
  'Diamniadio', 'Mbao', 'Saloum', 'Plateau', 'Hann', 'Rufisque', 'Afrique', 'Europe',
  'Asie', 'Italie', 'Espagne', 'Inde', 'France', 'Diass', 'Mako', 'Keur', 'Gorgui',
  'Sindia', 'Bargny', 'Mékhé', 'Tivaouane', 'Pout', 'Saly', 'Sendou', 'Gorée',
  'Magatte', 'Niang', 'Maguette', 'WhatsApp', 'Google', 'Maps', 'Polytechnique',
  'Supérieure', 'École', 'Boulevard', 'Centenaire', 'Commune', 'Industrielle', 'Zone',
  'Gazelles', 'Cap', 'Vert', 'APROSI', 'AGEROUTE', 'APIX', 'SOCOCIM', 'OIM', 'CDP',
  'Loi', 'CDP', 'Eurocodes', 'Eurocode', 'Portland', 'Master', 'Congrès', 'Revue',
  'Article', 'Conférence', 'Manuel', 'Support', 'Guide', 'Langue', 'Cours',
  'P2M', 'SB-S', 'SERMA', 'BTP', 'SB', 'SBS', 'PGT', 'Group', 'Labo', 'Logistik',
  'Industries', 'Politech', 'General', 'Trading', 'Cosumat', 'Delux', 'Tata', 'SFS',
  'Société', 'Organisation', 'Internationale', 'Migrations', 'Offshore',
]);

const raw = fs.readFileSync(file, 'utf8');
const lines = raw.split(/\r?\n/);
let count = 0;

lines.forEach((line, i) => {
  // chaines entre guillemets simples ou doubles
  for (const m of line.matchAll(/'([^']{6,})'|"([^"]{6,})"/g)) {
    const s = (m[1] ?? m[2]).trim();
    if (!/\s/.test(s)) continue;                 // un seul mot
    if (/^[a-z]/.test(s)) continue;              // deja sentence case (1re lettre minuscule autorisee si champ code)
    if (/\b(https?:|www\.|@)\b/.test(s)) continue; // URL / email
    const words = s.split(/\s+/).filter(Boolean);
    const bad = words.slice(1).filter(
      (w) => /^[A-ZÀ-Þ][a-zà-ÿ]/.test(w) && w.length > 2 && !KEEP.has(w.replace(/[.,;:!?)»]+$/, ''))
    );
    if (bad.length) {
      count++;
      console.log(`${file}:${i + 1}  [${bad.join(', ')}]`);
      console.log(`   ${s}`);
    }
  }
});
console.log(`\nTotal : ${count}`);
