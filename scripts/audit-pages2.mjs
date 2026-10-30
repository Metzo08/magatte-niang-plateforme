export default async function run(page, ui) {
  const base = 'http://localhost:3200';
  const results = {};
  const pages = ['/', '/expertises', '/projets', '/publications', '/catalogue'];
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => { });
    await page.waitForTimeout(1500);
    results[p] = await page.evaluate(() => {
      const bad = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        const t = (n.textContent || '').trim();
        if (t.length < 5) continue;
        if (!/[A-ZÀ-Ü]/.test(t)) continue;
        if (/[a-zà-ü]/.test(t)) continue;
        bad.push(t.slice(0, 70));
      }
      return [...new Set(bad)];
    });
  }
  return results;
}
