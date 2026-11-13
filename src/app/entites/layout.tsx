import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entités du Groupe BTP · SBS-Group, SBS Industrie, SBS Logistik, SERMA',
  description:
    'Découvrez les 7 entités industrielles et techniques fondées et dirigées par Magatte Niang : préfabrication béton, logistique lourde, charpente métallique et géotechnique.',
  alternates: {
    canonical: '/entites',
  },
  openGraph: {
    title: 'Écosystème Industriel & BTP au Sénégal · Entités Magatte Niang',
    description:
      'SBS Industrie, SBS Logistik, SERMA BTP, SB-S Labo, P2M, PGT : la chaîne intégrée du BTP au Sénégal.',
    url: 'https://www.magatteniang-expert.sn/entites',
  },
};

export default function EntitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
