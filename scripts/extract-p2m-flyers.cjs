/**
 * Extraction du texte des flyers P2M (carreaux + plomberie)
 * pour reconstituer le catalogue produits avec les vrais libellés.
 */
const fs = require('fs');
const path = require('path');

const DOC_DIR = path.join(__dirname, '..', 'doc magatte niang');
const PDFS = [
  { match: /^flyers carreaux/i, slug: 'flyers-carreaux' },
  { match: /^flyer plomberie/i, slug: 'flyer-plomberie' },
];

async function main() {
  const mod = require('pdf-parse');
  const { PDFParse } = mod;
  const allFiles = fs.readdirSync(DOC_DIR);
  for (const { match, slug } of PDFS) {
    const name = allFiles.find(f => match.test(f));
    if (!name) { console.log('ABSENT:', slug); continue; }
    const pdfFile = path.join(DOC_DIR, name);
    if (!fs.existsSync(pdfFile)) {
      console.log('ABSENT:', name);
      continue;
    }
    const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(pdfFile)) });
    const result = await parser.getText();
    const outTxt = path.join(__dirname, '..', `${slug}-texte.txt`);
    fs.writeFileSync(outTxt, result.text || '', 'utf8');
    console.log('OK:', name, '->', (result.text || '').length, 'chars');
    await parser.destroy();
  }
}

main().catch(e => { console.error('ERROR:', e); process.exit(1); });
