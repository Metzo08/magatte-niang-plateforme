'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Building2,
  Package,
  Layers,
  FlaskConical,
  BookOpen,
  FileText,
  ArrowRight
} from 'lucide-react';
import {
  ENTITIES,
  PROJECTS,
  PRODUCTS_P2M,
  LAB_TESTS,
  PUBLICATIONS,
  INITIAL_DOCUMENTS
} from '@/data/initialData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'entities' | 'projects' | 'products' | 'labo' | 'publications' | 'documents'>('all');

  // Handle ESC key and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Highlight matching string helper
  const highlightMatch = (text: string, q: string) => {
    if (!q || !text) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-amber-200 dark:bg-amber-900/60 text-neutral-900 dark:text-amber-100 px-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { entities: [], projects: [], products: [], labo: [], publications: [], documents: [] };

    const matchedEntities = ENTITIES.filter(
      e => e.name.toLowerCase().includes(q) || e.tagline.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.expertises.some(exp => exp.toLowerCase().includes(q))
    );

    const matchedProjects = PROJECTS.filter(
      p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)
    );

    const matchedProducts = PRODUCTS_P2M.filter(
      p => p.name.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.material.toLowerCase().includes(q)
    );

    const matchedLabo = LAB_TESTS.filter(
      l => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.norm.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
    );

    const matchedPublications = PUBLICATIONS.filter(
      pub => pub.title.toLowerCase().includes(q) || pub.abstract.toLowerCase().includes(q) || pub.keywords.some(k => k.toLowerCase().includes(q))
    );

    const matchedDocuments = INITIAL_DOCUMENTS.filter(
      d => d.title.toLowerCase().includes(q) || d.reference.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
    );

    return {
      entities: matchedEntities,
      projects: matchedProjects,
      products: matchedProducts,
      labo: matchedLabo,
      publications: matchedPublications,
      documents: matchedDocuments
    };
  }, [query]);

  const totalResultsCount =
    results.entities.length +
    results.projects.length +
    results.products.length +
    results.labo.length +
    results.publications.length +
    results.documents.length;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-brand-900/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 w-full max-w-3xl rounded-l shadow-elev-3 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* INPUT BAR */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-brand-800 bg-neutral-50 dark:bg-brand-800/50">
          <Search className="w-5 h-5 text-accent-500 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une expertise, un essai labo, un carrelage, un projet BTP..."
            className="w-full bg-transparent border-none text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 bg-neutral-200 dark:bg-brand-700 text-neutral-700 dark:text-neutral-300 rounded"
          >
            ESC
          </button>
        </div>

        {/* FILTERS */}
        {query && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-neutral-200 dark:border-brand-800 overflow-x-auto text-xs bg-white dark:bg-brand-900">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-brand-700 text-white'
                  : 'bg-neutral-100 dark:bg-brand-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Tout ({totalResultsCount})
            </button>
            <button
              onClick={() => setActiveFilter('entities')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === 'entities'
                  ? 'bg-brand-700 text-white'
                  : 'bg-neutral-100 dark:bg-brand-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Entités ({results.entities.length})
            </button>
            <button
              onClick={() => setActiveFilter('projects')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === 'projects'
                  ? 'bg-brand-700 text-white'
                  : 'bg-neutral-100 dark:bg-brand-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Projets ({results.projects.length})
            </button>
            <button
              onClick={() => setActiveFilter('products')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === 'products'
                  ? 'bg-brand-700 text-white'
                  : 'bg-neutral-100 dark:bg-brand-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Produits P2M ({results.products.length})
            </button>
            <button
              onClick={() => setActiveFilter('labo')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                activeFilter === 'labo'
                  ? 'bg-brand-700 text-white'
                  : 'bg-neutral-100 dark:bg-brand-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Essais labo ({results.labo.length})
            </button>
          </div>
        )}

        {/* RESULTS CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!query && (
            <div className="py-10 text-center text-neutral-500 dark:text-neutral-400">
              <Search className="w-10 h-10 mx-auto mb-3 text-neutral-300 dark:text-brand-700" />
              <p className="text-sm font-medium">Tapez votre recherche pour explorer la base de connaissances BTP</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
                <span className="text-neutral-400">Suggestions :</span>
                {['Charpente métallique', 'Essai CBR', 'Grès cérame 60x60', 'Grue 60T', 'Diamniadio', 'Magatte Niang'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-2 py-0.5 bg-neutral-100 dark:bg-brand-800 hover:bg-neutral-200 dark:hover:bg-brand-700 rounded text-neutral-700 dark:text-neutral-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResultsCount === 0 && (
            <div className="py-12 text-center text-neutral-500">
              <p className="text-base font-semibold text-neutral-800 dark:text-white">Aucun résultat trouvé pour « {query} »</p>
              <p className="text-xs text-neutral-400 mt-1">Vérifiez l'orthographe ou essayez un terme plus générique.</p>
            </div>
          )}

          {/* ENTITIES RESULTS */}
          {(activeFilter === 'all' || activeFilter === 'entities') && results.entities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold  tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Entités & pôles
              </h4>
              <div className="grid gap-2">
                {results.entities.map((e) => (
                  <Link
                    key={e.id}
                    href={`/entites/${e.id}`}
                    onClick={onClose}
                    className="p-3 bg-neutral-50 dark:bg-brand-800/60 hover:bg-neutral-100 dark:hover:bg-brand-800 rounded-m flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title font-bold text-sm text-neutral-900 dark:text-white">
                          {highlightMatch(e.name, query)}
                        </span>
                        <span className="text-xs text-neutral-500">· {highlightMatch(e.tagline, query)}</span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {highlightMatch(e.description, query)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS RESULTS */}
          {(activeFilter === 'all' || activeFilter === 'projects') && results.projects.length > 0 && (
            <div>
              <h4 className="text-xs font-bold  tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Projets & études de cas
              </h4>
              <div className="grid gap-2">
                {results.projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projets/${p.slug}`}
                    onClick={onClose}
                    className="p-3 bg-neutral-50 dark:bg-brand-800/60 hover:bg-neutral-100 dark:hover:bg-brand-800 rounded-m flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title font-bold text-sm text-neutral-900 dark:text-white">
                          {highlightMatch(p.title, query)}
                        </span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 bg-neutral-200 dark:bg-brand-700 text-neutral-700 dark:text-neutral-300 rounded">
                          {p.location} ({p.year})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {highlightMatch(p.summary, query)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS RESULTS */}
          {(activeFilter === 'all' || activeFilter === 'products') && results.products.length > 0 && (
            <div>
              <h4 className="text-xs font-bold  tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Catalogue produits P2M
              </h4>
              <div className="grid gap-2">
                {results.products.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/catalogue/${prod.id}`}
                    onClick={onClose}
                    className="p-3 bg-neutral-50 dark:bg-brand-800/60 hover:bg-neutral-100 dark:hover:bg-brand-800 rounded-m flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-neutral-200 dark:bg-brand-700 shrink-0 overflow-hidden">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-title font-bold text-sm text-neutral-900 dark:text-white">
                            {highlightMatch(prod.name, query)}
                          </span>
                          <span className="text-xs font-mono text-accent-500 font-semibold">{prod.ref}</span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {prod.dimensions} · {prod.finish} · <span className="font-mono font-medium">{prod.indicativePriceFCFA.toLocaleString('fr-FR')} FCFA / {prod.unit}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* LABO RESULTS */}
          {(activeFilter === 'all' || activeFilter === 'labo') && results.labo.length > 0 && (
            <div>
              <h4 className="text-xs font-bold  tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Essais SB-S labo
              </h4>
              <div className="grid gap-2">
                {results.labo.map((l) => (
                  <Link
                    key={l.id}
                    href="/services/laboratoire"
                    onClick={onClose}
                    className="p-3 bg-neutral-50 dark:bg-brand-800/60 hover:bg-neutral-100 dark:hover:bg-brand-800 rounded-m flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title font-bold text-sm text-neutral-900 dark:text-white">
                          {highlightMatch(l.name, query)}
                        </span>
                        <span className="text-xs font-mono text-emerald-600 font-semibold">{l.norm}</span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Délai standard : <span className="font-mono font-bold">{l.standardDelayDays} jours</span> · échantillon requis : {l.sampleRequired}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
