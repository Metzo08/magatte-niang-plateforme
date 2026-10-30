/**
 * Extraction du texte et des images JPEG embarquées
 * depuis les PDF de présentation SBS et SBS-LABO.
 */
const fs = require('fs');
const path = require('path');

const DOC_DIR = path.join(__dirname, 'doc magatte niang');
const OUT_IMAGES = path.join(__dirname, 'pdf-images');
const PDFS = [
  'Présentation de SBS.pdf',
  'Présentation SBS-LABO - FINAL.pdf',
];

async function extractText(pdfFile) {
  const mod = require('pdf-parse');
  const data = await mod(fs.readFileSync(pdfFile));
  const outTxt = pdfFile.replace(/\.pdf$/i, '') + '-texte.txt';
  fs.writeFileSync(outTxt, data.text, 'utf8');
  console.log('TEXTE OK:', path.basename(pdfFile), '->', data.text.length, 'chars,', data.numpages, 'pages');
}

function extractJpegs(pdfFile, outDir) {
  const buf = fs.readFileSync(pdfFile);
  fs.mkdirSync(outDir, { recursive: true });
  const base = path.basename(pdfFile, '.pdf').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  let count = 0;
  let i = 0;
  while (i < buf.length - 3) {
    if (buf[i] === 0xFF && buf[i + 1] === 0xD8 && buf[i + 2] === 0xFF) {
      const end = buf.indexOf(Buffer.from([0xFF, 0xD9]), i + 2);
      if (end !== -1) {
        const size = end + 2 - i;
        if (size > 30000) { // filtrer vignettes et éléments graphiques
          const name = `${base}-img-${String(++count).padStart(3, '0')}.jpg`;
          fs.writeFileSync(path.join(outDir, name), buf.slice(i, end + 2));
        }
        i = end + 2;
        continue;
      }
    }
    i++;
  }
  console.log('IMAGES OK:', path.basename(pdfFile), '->', count, 'JPEG extraits');
}

async function main() {
  fs.mkdirSync(OUT_IMAGES, { recursive: true });
  for (const name of PDFS) {
    const pdfFile = path.join(DOC_DIR, name);
    try { await extractText(pdfFile); } catch (e) { console.error('TEXTE ERR:', name, e.message); }
    try { extractJpegs(pdfFile, OUT_IMAGES); } catch (e) { console.error('IMAGES ERR:', name, e.message); }
  }
}

main();