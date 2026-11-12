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
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 font-bold text-2xl mb-4 border border-red-200">
        !
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Une erreur est survenue</h1>
      <p className="text-slate-600 max-w-md mb-8">
        Une interruption inattendue s'est produite lors du traitement de votre demande. Nos équipes techniques ont été notifiées.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-lg bg-[#2D6A8E] text-white font-medium hover:bg-[#235370] transition-colors shadow-sm"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
