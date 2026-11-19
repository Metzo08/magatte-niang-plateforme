'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur applicative interceptée:', error);
    try {
      const msg = (error?.message || '').toLowerCase();
      const isDeploymentOrChunkError =
        msg.includes('chunk') ||
        msg.includes('loading') ||
        msg.includes('dynamically imported') ||
        msg.includes('failed to fetch') ||
        msg.includes('minified react error') ||
        msg.includes('server action');
      const key = '__magatte_err_auto_reload';
      const last = Number(sessionStorage.getItem(key) || '0');
      if (isDeploymentOrChunkError && Date.now() - last > 15000) {
        sessionStorage.setItem(key, String(Date.now()));
        window.location.reload();
      }
    } catch {
      // ignore storage errors
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 font-bold text-2xl mb-4 border border-red-200">
        !
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
        Une erreur est survenue
      </h1>
      <p className="text-slate-600 dark:text-slate-300 max-w-md mb-6">
        Une interruption inattendue s&apos;est produite lors du traitement de votre demande. Cliquez
        sur Réessayer pour rafraîchir la session.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={() => {
            try {
              reset();
              window.location.reload();
            } catch {
              window.location.href = window.location.pathname;
            }
          }}
          className="px-6 py-3 rounded-lg bg-[#2D6A8E] text-white font-medium hover:bg-[#235370] transition-colors shadow-sm"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
