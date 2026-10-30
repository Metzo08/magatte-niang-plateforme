export default async function run(page, ui) {
  const results = {};
  const pages = ['/projets', '/publications', '/services/laboratoire'];
  for (const p of pages) {
    await page.goto(page.url().split('//')[0] + '//' + page.url().split('//')[1].split('/')[0] + p, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const found = await page.evaluate(() => {
      const bad = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = (n.textContent || '').trim();
        if (t.length < 5) continue;
        if (!/[A-ZÀ-Ü]/.test(t)) continue;
        if (/[a-zà-ü]/.test(t)) continue;
        bad.push(t.slice(0, 60));
      }
      return [...new Set(bad)];
    });
    results[p] = found;
  }
  return results;
}
