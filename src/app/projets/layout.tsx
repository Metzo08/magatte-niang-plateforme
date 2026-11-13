import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réalisations & Chantiers BTP au Sénégal · Génie Civil & Métal',
  description:
    'Grandes infrastructures et projets de construction au Sénégal : silos portuaires, hangars industriels, ouvrages d’art et réhabilitations par SERMA BTP et SB-S Group.',
  alternates: {
    canonical: '/projets',
  },
  openGraph: {
    title: 'Réalisations Majeures BTP au Sénégal · Portefeuille Chantiers',
    url: 'https://www.magatteniang-expert.sn/projets',
  },
};

export default function ProjetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
