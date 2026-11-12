import type { Metadata } from 'next';

import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Magatte niang expert · plateforme & écosystème btp sénégal',
  description:
    "Infrastructure technique et industrielle btp au sénégal : ingénierie, charpentes serma btp, laboratoire sb-s labo, matériaux p2m, préfabrication, logistique.",
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
