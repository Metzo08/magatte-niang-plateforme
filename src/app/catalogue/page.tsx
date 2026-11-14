'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import PhotoLightbox from '@/components/common/PhotoLightbox';
import P2mShowroomBlocks from '@/components/p2m/P2mShowroomBlocks';

export default function CatalogueP2MPage() {
  const { products, loading, error } = useProducts();
  const [lightbox, setLightbox] = useState<{
    images: { url: string; caption?: string }[];
    index: number;
    title: string;
  } | null>(null);

  if (loading && (!products || products.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Chargement du showroom P2M..." />
      </div>
    );
  }

  if (error && (!products || products.length === 0)) {
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
            <Link href="/entites/p2m" className="hover:text-accent-500">P2M</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Showroom &amp; Catalogue P2M</span>
          </div>
        </div>
      </div>

      {/* Showroom P2M organisé par blocs (Carrelage, Sanitaire, Robinetterie & Accessoires, Faïence & Mosaïque) */}
      <P2mShowroomBlocks
        products={products}
        loading={loading}
        onOpenLightbox={(images, index, title) => setLightbox({ images, index, title })}
      />

      {/* CTA Bas de page */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#C0562F]/10 border border-[#C0562F]/30 rounded-l p-8 text-center">
          <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white mb-3">
            Besoin d&apos;un devis personnalisé P2M ?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm max-w-2xl mx-auto mb-6">
            Envoyez-nous votre sélection (carrelages, sanitaires, robinetterie ou faïence) et recevez une proposition chiffrée sous 24h avec conseil technique.
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

      {lightbox && (
        <PhotoLightbox
          images={lightbox.images}
          index={lightbox.index}
          onIndexChange={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
          onClose={() => setLightbox(null)}
          title={lightbox.title}
        />
      )}
    </div>
  );
}
