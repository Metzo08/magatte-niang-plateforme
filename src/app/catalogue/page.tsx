'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Filter,
  ShoppingCart,
  Plus,
  ArrowRight,
  CheckCircle2,
  Search,
  Lock,
  X
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { SITE_IMAGES } from '@/data/siteImages';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';

export default function CatalogueP2MPage() {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch = !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesAvailability = selectedAvailability === 'all' || product.availability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, searchQuery, selectedCategory, selectedAvailability]);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  const availabilityOptions = [
    { value: 'all', label: 'Toutes disponibilités' },
    { value: 'En stock', label: 'En stock' },
    { value: 'Sur commande', label: 'Sur commande' },
    { value: 'En arrivage', label: 'En arrivage' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Chargement du catalogue..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage
          message={`Erreur lors du chargement du catalogue: ${error}`}
          retry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      {/* Breadcrumb */}
      <div className="bg-neutral-100 dark:bg-brand-800/50 border-b border-neutral-200 dark:border-brand-700">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-accent-500">Accueil</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Catalogue P2M</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden bg-[#C0562F] text-white py-12 border-b border-[#A04525]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_IMAGES.rubonChantier}
          alt="Showroom P2M — carrelages, sanitaires et finitions"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-m flex items-center justify-center">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-title font-bold text-white tracking-tight">
                Catalogue P2M
              </h1>
              <p className="text-white/80 text-sm">
                Carrelages, sanitaires & finitions de prestige
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-white/90 text-base max-w-3xl">
              {products.length} références en stock à Dakar · livraison rapide ·
              devis personnalisé sous 24h
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/entites/p2m/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-amber-400 hover:bg-amber-300 text-brand-950 font-bold text-xs shadow-sm transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Espace Gestionnaire P2M</span>
              </Link>
              <Link
                href="/panier?entite=p2m"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Mon panier P2M</span>
              </Link>
            </div>
          </div>

          {/* Tarifs indicatifs officiels — source : plaquette P2M */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {[
              { label: 'Porcelaine 60×60', price: '5 500 – 6 000 F/m²' },
              { label: 'Porcelaine 40×40', price: '4 000 – 5 500 F/m²' },
              { label: 'Porcelaine 30×30', price: '3 000 – 3 500 F/m²' },
              { label: 'Céramique 60×120', price: '7 500 – 8 500 F/m²' },
              { label: 'Céramique 60×60', price: '6 500 – 7 000 F/m²' },
              { label: 'Agglos creux 10×20×40', price: '300 F' },
            ].map(t => (
              <div key={t.label} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-m px-3 py-2">
                <span className="block text-white/80 text-[10px]  tracking-wider font-mono">{t.label}</span>
                <strong className="text-white font-mono tabular-nums">{t.price}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de filtres et recherche */}
        <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, référence ou marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-neutral-300 dark:border-brand-600 rounded-m bg-white dark:bg-brand-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtre catégorie */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 text-sm border border-neutral-300 dark:border-brand-600 rounded-m bg-white dark:bg-brand-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filtre disponibilité */}
            <div>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full py-2 px-3 text-sm border border-neutral-300 dark:border-brand-600 rounded-m bg-white dark:bg-brand-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                {availabilityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compteur de résultats */}
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span>
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </span>
            {(searchQuery || selectedCategory !== 'all' || selectedAvailability !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedAvailability('all');
                }}
                className="text-accent-500 hover:underline font-semibold"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* Liste des produits */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="Aucun produit trouvé"
            description="Essayez de modifier vos critères de recherche ou de réinitialiser les filtres"
            icon={<Layers className="w-12 h-12 text-neutral-400" />}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-l overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image produit */}
                <div className="relative aspect-square bg-neutral-200 dark:bg-brand-900 overflow-hidden">
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Badge référence */}
                  <div className="absolute top-2 left-2 bg-brand-900/90 backdrop-blur-sm text-white font-mono text-[10px] px-2 py-1 rounded">
                    {product.ref}
                  </div>

                  {/* Badge disponibilité */}
                  <div className={`absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-1 rounded ${
                    product.availability === 'En stock' ? 'bg-emerald-600' :
                    product.availability === 'Sur commande' ? 'bg-amber-600' :
                    'bg-blue-600'
                  }`}>
                    {product.availability}
                  </div>
                </div>

                {/* Détails produit */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mb-1">
                      {product.category} · {product.finish}
                    </span>

                    <h3 className="font-title font-bold text-sm text-neutral-900 dark:text-white line-clamp-2 mb-1">
                      {product.name}
                    </h3>

                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mb-3">
                      {product.brand} · {product.origin}
                    </p>

                    {/* Prix */}
                    {product.isPriceVisible && (
                      <div>
                        <p className="text-lg font-mono font-bold text-accent-500">
                          {product.indicativePriceFCFA.toLocaleString('fr-FR')} <span className="text-xs">FCFA</span>
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          par {product.unit} · prix indicatif HT
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-brand-700">
                    <Link
                      href={`/catalogue/${product.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#C0562F] hover:bg-[#A04525] text-white text-xs font-semibold rounded-m transition-colors"
                    >
                      <span>Voir détails & ajouter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Bas de page */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#C0562F]/10 border border-[#C0562F]/30 rounded-l p-8 text-center">
          <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white mb-3">
            Besoin d'un devis personnalisé ?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm max-w-2xl mx-auto mb-6">
            Envoyez-nous votre liste et recevez une proposition chiffrée sous 24h avec conseil technique.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/panier?entite=p2m"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C0562F] hover:bg-[#A04525] text-white font-bold rounded-m shadow-elev-2 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Voir mon panier P2M</span>
            </Link>
            <Link
              href="/assistant?entite=p2m"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#C0562F] text-[#C0562F] font-bold rounded-m hover:bg-neutral-50 transition-all"
            >
              <span>Demander un devis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}