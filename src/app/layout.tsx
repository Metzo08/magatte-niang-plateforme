import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.magatteniang-expert.sn'),
  title: {
    default: 'Magatte Niang Expert · Plateforme & Écosystème BTP Sénégal',
    template: '%s · Magatte Niang BTP Sénégal',
  },
  description:
    "Infrastructure technique, industrielle et logistique BTP au Sénégal : SBS Industrie (agglos, pavés, hourdis, BPE Mbao), SBS Logistik (engins, camions, grues), SERMA BTP, SBS Labo géotechnique, P2M & PGT.",
  keywords: [
    'Magatte Niang',
    'SBS Industrie',
    'SBS Logistik',
    'SBS Group',
    'Stein Bauer Sénégal',
    'BTP Sénégal',
    'Briques Dakar',
    'Agglos creux Dakar',
    'Agglos pleins Mbao',
    'Pavés autobloquants Dakar',
    'Béton prêt à l’emploi Dakar',
    'Location engins Dakar',
    'Camion malaxeur Sénégal',
    'Zone Franche Industrielle Mbao',
    'SERMA BTP',
    'Laboratoire géotechnique Sénégal',
  ],
  authors: [{ name: 'Magatte Niang' }],
  creator: 'Magatte Niang',
  publisher: 'Stein Bauer Sénégal Group',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: 'https://www.magatteniang-expert.sn',
    siteName: 'Magatte Niang Expert · BTP Sénégal',
    title: 'Magatte Niang Expert · Écosystème Industriel & Logistique BTP Sénégal',
    description:
      'SBS Industrie (agglos calibrés, pavés, BPE certifié à Mbao) & SBS Logistik (parc engins et transport lourd). Commandes et devis en ligne.',
    images: [
      {
        url: '/images/magatte-portrait.webp',
        width: 1200,
        height: 630,
        alt: 'Magatte Niang - Expert BTP et Écosystème Industriel Sénégal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magatte Niang Expert · Écosystème BTP Sénégal',
    description:
      'SBS Industrie & SBS Logistik - Zone Franche Industrielle de Mbao. Matériaux préfabriqués et logistique de chantier.',
    images: ['/images/magatte-portrait.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon-256.png',
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.magatteniang-expert.sn/#website',
      url: 'https://www.magatteniang-expert.sn',
      name: 'Magatte Niang Expert · Écosystème BTP Sénégal',
      description: 'Plateforme officielle du groupe BTP Magatte Niang : SBS Industrie, SBS Logistik, SERMA BTP, SBS Labo.',
      inLanguage: 'fr-SN',
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.magatteniang-expert.sn/#organization',
      name: 'Stein Bauer Sénégal Group (SBS-Group)',
      alternateName: ['SBS Group', 'SBS-Group Dakar'],
      url: 'https://www.magatteniang-expert.sn',
      logo: 'https://www.magatteniang-expert.sn/images/sbs-group.jpg',
      telephone: '+221 33 871 08 61',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mbao Villeneuve, Villa S04, Route Nationale (à proximité immédiate de la Zone Franche Industrielle ZFI de Mbao)',
        addressLocality: 'Mbao, Dakar',
        addressRegion: 'Pikine, Dakar',
        addressCountry: 'SN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 14.7486088,
        longitude: -17.3310687,
      },
      hasMap: 'https://www.google.com/maps/place/SBS-GROUP/@14.7486088,-17.3310687,17z/data=!3m1!4b1!4m6!3m5!1s0xec10bbf4e072a31:0xfd8cb427cbcc2356!8m2!3d14.7486088!4d-17.3310687!16s%2Fg%2F11fqzg5jpj?hl=fr-SN',
      sameAs: [
        'https://www.facebook.com/profile.php?id=100063789422000',
        'https://www.linkedin.com/company/stein-bauer-senegal-group',
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.magatteniang-expert.sn/entites/sbs-industries#business',
      name: 'SBS Industrie (Stein Bauer Sénégal Industrie)',
      image: 'https://www.magatteniang-expert.sn/images/sbs-industries/briques-alignement-moulage-mbao.jpg',
      telephone: '+221 33 871 08 61',
      priceRange: '380 FCFA - 77 000 FCFA',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
        addressLocality: 'Mbao, Dakar',
        addressRegion: 'Pikine, Dakar',
        addressCountry: 'SN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 14.7486088,
        longitude: -17.3310687,
      },
      hasMap: 'https://www.google.com/maps/place/SBS-GROUP/@14.7486088,-17.3310687,17z/data=!3m1!4b1!4m6!3m5!1s0xec10bbf4e072a31:0xfd8cb427cbcc2356!8m2!3d14.7486088!4d-17.3310687!16s%2Fg%2F11fqzg5jpj?hl=fr-SN',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '18:00',
        },
      ],
      url: 'https://www.magatteniang-expert.sn/entites/sbs-industries',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.magatteniang-expert.sn/entites/sbs-logistik#business',
      name: 'SBS Logistik (Stein Bauer Sénégal Logistik)',
      image: 'https://www.magatteniang-expert.sn/images/sbs-logistik.png',
      telephone: '+221 33 871 08 61',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
        addressLocality: 'Mbao, Dakar',
        addressRegion: 'Pikine, Dakar',
        addressCountry: 'SN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 14.7486088,
        longitude: -17.3310687,
      },
      hasMap: 'https://www.google.com/maps/place/SBS-GROUP/@14.7486088,-17.3310687,17z/data=!3m1!4b1!4m6!3m5!1s0xec10bbf4e072a31:0xfd8cb427cbcc2356!8m2!3d14.7486088!4d-17.3310687!16s%2Fg%2F11fqzg5jpj?hl=fr-SN',
      url: 'https://www.magatteniang-expert.sn/entites/sbs-logistik',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-white dark:bg-brand-900 text-neutral-900 dark:text-neutral-100 selection:bg-accent-500 selection:text-white"
        suppressHydrationWarning
      >
        <QueryProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </QueryProvider>
      </body>
    </html>
  );
}
