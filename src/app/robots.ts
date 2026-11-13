import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.magatteniang-expert.sn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/entites/sbs-industries/admin',
          '/entites/sbs-logistik/admin',
          '/entites/p2m/admin',
          '/espace-pro/crm',
          '/paiement/',
          '/panier',
          '/profil',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '*/admin',
          '/paiement/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
