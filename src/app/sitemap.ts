import { MetadataRoute } from 'next';
import { ENTITIES, PROJECTS } from '@/data/initialData';

const BASE_URL = 'https://www.magatteniang-expert.sn';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages principales & vitrines stratégiques
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/entites`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/catalogue`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/projets`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/engins`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/services/laboratoire`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/services/sourcing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/expertises`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mediatheque`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/publications`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/assistant`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/espace-pro`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/legal/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/legal/confidentialite`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/legal/gouvernance`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Pages individuelles de chaque entité du groupe
  const entityRoutes: MetadataRoute.Sitemap = ENTITIES.map((entity) => ({
    url: `${BASE_URL}/entites/${entity.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Pages des grands chantiers et réalisations BTP
  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${BASE_URL}/projets/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...entityRoutes, ...projectRoutes];
}
