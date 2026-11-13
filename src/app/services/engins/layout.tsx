import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Location d’Engins & Flotte Logistique BTP · SBS Logistik Dakar',
  description:
    'Location de grues mobiles 50T, camions malaxeurs toupie 10m³, pompes à béton automotrices 36m, porte-chars et dumpers à Dakar et dans tout le Sénégal.',
  alternates: {
    canonical: '/services/engins',
  },
};

export default function EnginsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
