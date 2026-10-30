import { PrismaClient, Prisma } from '@prisma/client';
import { ENTITIES, PROJECTS, PUBLICATIONS, PRODUCTS_P2M } from '../src/data/initialData';

const prisma = new PrismaClient();

async function main() {
  console.log('Debut du seeding PostgreSQL...');

  // Nettoyer les tables existantes
  console.log('Nettoyage des tables...');
  await prisma.contact.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.labTest.deleteMany();
  await prisma.document.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.project.deleteMany();
  await prisma.entity.deleteMany();

  // === ENTITES (Les 7 piliers de l'écosystème) ===
  console.log('Creation des entites...');

  // Source unique de verite : ENTITIES (src/data/initialData.ts), deja redige
  // en "Premiere lettre majuscule, reste en minuscule". Evite toute
  // desynchronisation de casse entre la base et les donnees statiques.
  const entities = ENTITIES.map((e) => ({
    ...e,
    equipmentList: e.equipmentList ?? null
  }));
  
  for (const entity of entities) {
    await prisma.entity.create({
      data: {
        ...entity,
        expertises: entity.expertises as any,
        equipmentList: (entity.equipmentList ?? Prisma.JsonNull) as any,
        synergies: entity.synergies as any,
        verifiedMetrics: entity.verifiedMetrics as any
      }
    });
    console.log(`Entité créée: ${entity.name}`);
  }

  // === PRODUITS P2M ===
  // Source unique de verite : PRODUCTS_P2M (src/data/initialData.ts), dont les images
  // ont ete verifiees produit par produit sur les flyers officiels P2M.
  // Evite tout doublon / desynchronisation entre la base et les donnees statiques.
  console.log('Creation des produits P2M...');

  const products = PRODUCTS_P2M.map((p) => ({ ...p, documents: (p.documents ?? null) as any }));

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        images: product.images as any,
        specs: product.specs as any,
        documents: (product.documents ?? Prisma.JsonNull) as any
      }
    });
    console.log(`OK produit cree: ${product.ref}`);
  }

  // === PUBLICATIONS ===
  console.log('Creation des publications...');

  // Source unique de verite : PUBLICATIONS (src/data/initialData.ts).
  const publications = PUBLICATIONS;

  for (const pub of publications) {
    await prisma.publication.create({
      data: {
        ...pub,
        authors: pub.authors,
        keywords: pub.keywords
      }
    });
    console.log(`Publication créée: ${pub.title.substring(0, 50)}...`);
  }

  // === PROJETS / REALISATIONS ===
  console.log('Creation des projets...');

  // Source unique de verite : PROJECTS (src/data/initialData.ts).
  const projects = PROJECTS;

  for (const project of projects) {
    await prisma.project.create({
      data: {
        ...project,
        partnerEntityIds: project.partnerEntityIds as any,
        technicalData: project.technicalData as any,
        story: project.story as any,
        testimonial: (project.testimonial ?? Prisma.JsonNull) as any,
        images: project.images as any
      }
    });
    console.log(`OK projet cree: ${project.title.substring(0, 40)}...`);
  }

  // === PARTENAIRES ===
  console.log('Creation des partenaires...');

  const partners = [
    {
      id: 'partner-001',
      name: 'APIX – Agence de promotion des investissements',
      logo: '/logos/apix.png',
      website: 'https://www.apix.sn',
      category: 'Institutionnel',
      description: 'Partenaire institutionnel pour les projets d\'infrastructures structurantes',
      order: 1,
      isActive: true
    },
    {
      id: 'partner-002',
      name: 'AGEROUTE Sénégal',
      logo: '/logos/ageroute.png',
      website: 'https://www.ageroute.sn',
      category: 'Institutionnel',
      description: 'Agence de gestion des routes – projets d\'ouvrages d\'art',
      order: 2,
      isActive: true
    }
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
    console.log(`Partenaire créé: ${partner.name}`);
  }

  console.log('Seeding PostgreSQL termine avec succes!');
  console.log('Resume du seeding');
  console.log(`   - ${entities.length} entites`);
  console.log(`   - ${products.length} produits`);
  console.log(`   - ${publications.length} publications`);
  console.log(`   - ${partners.length} partenaires`);
}

main()
  .catch((e) => {
    console.error('Erreur seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
