const { PrismaClient } = require('./node_modules/@prisma/client');
const p = new PrismaClient();
p.$connect().then(async () => {
  const ps = await p.project.findMany({ where: { primaryEntityId: 'sbs-group' } });
  console.log('DB projects sbs-group:', ps.length);
  for (const x of ps) {
    const imgs = Array.isArray(x.images) ? x.images : [];
    console.log(x.slug, '->', imgs.map(i => (typeof i === 'string' ? i : (i && i.url)) || '').join(' | '));
  }
  const e = await p.entity.findUnique({ where: { id: 'sbs-group' } });
  console.log('Entity name:', e && e.name);
  process.exit(0);
}).catch(err => { console.error(err.message); process.exit(1); });