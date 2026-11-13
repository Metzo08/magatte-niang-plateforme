import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalogue Matériaux & Préfabriqués · Agglos, Pavés, Hourdis & BPE',
  description:
    'Tarifs officiels et fiches techniques des préfabriqués béton SBS Industrie : agglos creux et pleins 10/12/15/20 cm, hourdis 50 cm, pavés autobloquants, béton prêt à l’emploi certifié.',
  alternates: {
    canonical: '/catalogue',
  },
  openGraph: {
    title: 'Catalogue Matériaux & Préfabriqués Béton · SBS Industrie Mbao',
    description: 'Briques calibrées haute résistance, pavés charges lourdes et BPE centralisé à Dakar.',
    url: 'https://www.magatteniang-expert.sn/catalogue',
  },
};

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
