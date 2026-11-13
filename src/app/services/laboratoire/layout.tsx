import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laboratoire d’Essais Géotechniques & Béton · SB-S Labo Dakar',
  description:
    'Analyses de sol, contrôle de portance, essais de compression béton 28 jours, carottage et expertises structurelles agréées au Sénégal.',
  alternates: {
    canonical: '/services/laboratoire',
  },
};

export default function LaboLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
