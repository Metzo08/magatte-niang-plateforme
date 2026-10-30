'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Layers,
  ShoppingCart,
  Check,
  Plus,
  ArrowLeft,
  Share2,
  FileText,
  ShieldCheck,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PRODUCTS_P2M } from '@/data/initialData';
import { store } from '@/lib/store';

export default function ProductDetailPage() {
  const params = useParams();
  const prodId = params?.id as string;

  const product = PRODUCTS_P2M.find(p => p.id === prodId);
  if (!product) {
    notFound();
  }

  const [quantity, setQuantity] = useState(100);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    store.addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb
        items={[
          { label: 'Catalogue P2M', href: '/catalogue' },
          { label: product.name }
        ]}
      />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        <Link
          href="/catalogue"
          className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-brand-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au catalogue</span>
        </Link>

        {/* MAIN PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 sm:p-10 shadow-sm">
          
          {/* PRODUCT VISUAL (1:1 ZOOM § 30.2) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-[1/1] rounded-m overflow-hidden bg-neutral-100 border border-neutral-200 dark:border-brand-700">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-brand-900/90 text-white font-mono text-xs px-2.5 py-1 rounded font-bold">
                Réf : {product.ref}
              </div>
              <div className="absolute bottom-3 left-3 bg-emerald-600 text-white font-mono text-xs font-bold px-2.5 py-1 rounded">
                {product.availability}
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                <span>{product.category}</span>
                <span>·</span>
                <span>Marque : <strong>{product.brand}</strong></span>
                <span>·</span>
                <span>Origine : {product.origin}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white">
                {product.name}
              </h1>

              {/* INDICATIVE PRICE BOX */}
              <div className="p-4 bg-neutral-50 dark:bg-brand-900 rounded-m border border-neutral-200 dark:border-brand-700 space-y-1">
                <div className="flex items-baseline gap-2 font-mono text-2xl font-bold text-accent-500 tabular-nums">
                  <span>{product.indicativePriceFCFA.toLocaleString('fr-FR')} FCFA</span>
                  <span className="text-sm font-normal text-neutral-500">HT / {product.unit}</span>
                </div>
                <p className="text-xs text-neutral-500">
                  {product.leadTime} · tarifs négociés pour commandes de volumes BTP.
                </p>
              </div>

              {/* SPECS TABLE */}
              <div className="space-y-2 text-xs">
                <h4 className="font-title font-bold  tracking-wider text-neutral-500">
                  Caractéristiques & spécifications
                </h4>
                <div className="border border-neutral-200 dark:border-brand-700 rounded-m overflow-hidden divide-y divide-neutral-200 dark:divide-brand-800">
                  <div className="flex justify-between p-2.5 bg-neutral-50 dark:bg-brand-900">
                    <span className="text-neutral-500">Dimensions :</span>
                    <strong className="font-mono text-neutral-900 dark:text-white">{product.dimensions}</strong>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-neutral-500">Matériau :</span>
                    <span className="text-neutral-900 dark:text-white">{product.material}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-neutral-50 dark:bg-brand-900">
                    <span className="text-neutral-500">Finition :</span>
                    <span className="text-neutral-900 dark:text-white">{product.finish}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-neutral-500">Usage recommandé :</span>
                    <span className="text-neutral-900 dark:text-white">{product.usage}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-neutral-50 dark:bg-brand-900">
                    <span className="text-neutral-500">Conditionnement :</span>
                    <span className="text-neutral-900 dark:text-white">{product.packaging}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ADD TO QUOTE CART */}
            <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-brand-700">
              <div className="flex items-center gap-3">
                <div className="w-32">
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                    Quantité ({product.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded font-mono text-sm text-neutral-900 dark:text-white font-bold"
                  />
                </div>

                <div className="flex-1 self-end">
                  <button
                    onClick={handleAdd}
                    className={`w-full py-2.5 px-4 rounded-m text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-accent-500 hover:bg-accent-600 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Quantité ajoutée au devis !</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Ajouter {quantity} {product.unit} au devis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <Link href="/panier" className="font-bold text-brand-700 dark:text-brand-400 hover:underline">
                  Finaliser ma demande de devis →
                </Link>
                <a
                  href={`https://wa.me/221783009090?text=Bonjour%20P2M,%20je%20souhaite%20des%20informations%20sur%20la%20reference%20${product.ref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Question WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
