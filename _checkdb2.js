const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();
p.$connect().then(async () => {
  const hits = await p.$queryRaw`SELECT id, slug, images FROM "Project" WHERE images::text LIKE '%goree-offshore%' OR images::text LIKE '%dallage-beton-arme%'`;
  console.log('DB projects referencing goree/dallage-beton-arme:');
  for (const h of hits) {
    const imgs = Array.isArray(h.images) ? h.images : [];
    console.log(' ', h.slug, imgs.map(i => typeof i === 'string' ? i : i.url).join(' | '));
  }
  const all = await p.project.findMany();
  const urls = new Set();
  for (const x of all) for (const i of (Array.isArray(x.images) ? x.images : [])) { const u = typeof i === 'string' ? i : i.url; if (u) urls.add(u); }
  console.log('\nAll DB project image URLs:');
  console.log([...urls].sort().join('\n'));
  await p.$disconnect();
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });