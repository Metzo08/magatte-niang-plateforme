const fs = require('fs');

async function main() {
  try {
    const mod = require('pdf-parse');
    // Support both v1 (function) and v2 (PDFParse class) APIs
    let text = '';
    let numpages = 0;

    if (typeof mod === 'function') {
      const data = await mod(fs.readFileSync('Doc plateforme Magatte Niang.pdf'));
      text = data.text;
      numpages = data.numpages;
    } else if (mod.PDFParse) {
      const parser = new mod.PDFParse({ data: new Uint8Array(fs.readFileSync('Doc plateforme Magatte Niang.pdf')) });
      const result = await parser.getText();
      text = result.text;
      numpages = result.pages?.length || result.total || 0;
    } else if (mod.default) {
      const data = await mod.default(fs.readFileSync('Doc plateforme Magatte Niang.pdf'));
      text = data.text;
      numpages = data.numpages;
    }

    console.log('PAGES:', numpages);
    console.log('CHARS:', text.length);
    fs.writeFileSync('pdf-extracted.txt', text, 'utf8');
    console.log('--- FIRST 3000 CHARS ---');
    console.log(text.slice(0, 3000));
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}

main();