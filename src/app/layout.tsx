import type { Metadata } from 'next';

import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Magatte Niang expert · plateforme & écosystème BTP Sénégal',
  description:
    "Infrastructure technique et industrielle BTP au Sénégal : ingénierie, charpentes SERMA BTP, laboratoire SB-S Labo, matériaux P2M, préfabrication, logistique.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon-256.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
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
