export default async function run(page, ui) {
  await page.waitForSelector('h1', { timeout: 15000 });
  await page.waitForTimeout(2000);

  const h2s = await page.$$eval('h2', els => els.map(e => e.innerText));
  const galleryCaptions = await page.$$eval('figcaption', els => els.map(e => e.innerText));
  const projectTitles = await page.$$eval('section h3', els => els.map(e => e.innerText));

  return {
    h2s,
    galleryCaptions,
    projectTitles
  };
}
