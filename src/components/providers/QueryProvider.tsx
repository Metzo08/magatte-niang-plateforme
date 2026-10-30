'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ENTITIES, PROJECTS, PRODUCTS_P2M, LAB_TESTS } from '@/data/initialData';

/**
 * Provider TanStack Query — cache client ULTRA-RAPIDE sur toute la plateforme :
 * 1. Pré-seeding du cache avec les données statiques locales (ENTITIES, PROJECTS,
 *    PRODUCTS_P2M, LAB_TESTS) : chaque page se peint INSTANTANÉMENT, sans spinner
 *    et sans attendre l'API.
 * 2. Cache long (30 min) : une fois chargées, les données s'affichent instantanément
 *    lors des navigations (aucune requête réseau sur une page déjà visitée).
 * 3. Pas de refetch répétitif (window focus / reconnect désactivés, retry supprimé) :
 *    aucune page ne « gèle » sur un écran de chargement.
 */
function staticFallbackProjects() {
  return PROJECTS.filter((p) => p.isPublished !== false);
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => {
      const client = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 60 * 1000,       // données fraîches 30 min (navigation instantanée)
            gcTime: 60 * 60 * 1000,          // cache conservé 60 min
            refetchOnWindowFocus: false,     // pas de refetch à chaque focus
            refetchOnReconnect: false,       // pas de refetch au retour réseau
            retry: 0,                        // pas de retry bloquant (affichage immédiat sinon)
          },
        },
      });

      // === Pré-seeding : premier affichage INSTANTANÉ (zéro spinner, zéro attente API) ===
      // Les données statiques (identiques à celles servies par l'API) sont déjà en cache :
      // setQueryData horodate automatiquement l'entrée => TanStack la considère fraîche,
      // chaque page se peint immédiatement, sans requête réseau au montage.
      // Le cache se rafraîchit ensuite après staleTime (30 min) lors des navigations.
      client.setQueryData(['entities'], ENTITIES);
      client.setQueryData(['projects', null, null, null], staticFallbackProjects());
      client.setQueryData(['products', null, null], PRODUCTS_P2M);
      client.setQueryData(['lab-tests', null], LAB_TESTS);

      // Pré-seeding par entité : pages /entites/[id] instantanées
      // (détails entité + projets filtrés par entité)
      const publishedProjects = staticFallbackProjects();
      for (const entity of ENTITIES) {
        const id = entity.id;
        client.setQueryData(['entity', id], entity);
        client.setQueryData(
          ['projects', null, null, id],
          publishedProjects.filter((p) => p.primaryEntityId === id)
        );
      }

      // Pré-seeding détail projet / produit : pages /projets/[slug] et /catalogue/[id]
      for (const p of publishedProjects) {
        if (p.slug) client.setQueryData(['project', p.slug], p);
      }

      return client;
    }
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
