import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-700 font-bold text-2xl mb-4 border border-amber-200">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page introuvable</h1>
      <p className="text-slate-600 max-w-md mb-8">
        La page ou la ressource que vous recherchez n'existe pas ou a été déplacée au sein de l'écosystème Magatte Niang.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-[#2D6A8E] text-white font-medium hover:bg-[#235370] transition-colors shadow-sm"
        >
          Retour à l'accueil
        </Link>
        <Link
          href="/entites"
          className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          Découvrir nos entités
        </Link>
      </div>
    </div>
  );
}
