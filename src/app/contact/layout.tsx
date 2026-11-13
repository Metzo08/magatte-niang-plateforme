import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Géolocalisation · Siège & Usine Mbao Dakar',
  description:
    'Contactez Magatte Niang, SBS Industrie, SBS Logistik et SERMA BTP. Plan d’accès interactif, Plus Code PMX9+CHV, Zone Franche Industrielle de Mbao, Dakar, Sénégal.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Géolocalisation · SBS-Group Mbao Dakar',
    description:
      'Retrouvez les usines SBS Industrie et la base SBS Logistik à Mbao Villeneuve / ZFI. Coordonnées directes, WhatsApp et itinéraires GPS.',
    url: 'https://www.magatteniang-expert.sn/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
