'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Bath,
  Droplets,
  Sparkles,
  ShoppingCart,
  Lock,
  Search,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  ZoomIn,
  Grid3X3,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Product } from '@/types';
import { PRODUCTS_P2M } from '@/data/initialData';
import { ENTITY_GALLERY } from '@/data/siteImages';
import { store } from '@/lib/store';

export type P2mBlockId = 'carrelage' | 'sanitaire' | 'robinetterie' | 'faience-mosaique';

export interface P2mBlockDefinition {
  id: P2mBlockId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  coverImage: string;
  accentColor: string;
  badge: string;
  highlights: string[];
  subFilters: { id: string; label: string }[];
}

export const P2M_BLOCKS: P2mBlockDefinition[] = [
  {
    id: 'carrelage',
    number: '01',
    title: 'Bloc Carrelage · Sols, Grands Formats, Marbre & Bois',
    shortTitle: 'Bloc Carrelage',
    subtitle: 'Porcelaine pleine masse, céramique vitrifiée, dalles prestige & imitation bois',
    description:
      'Tous nos revêtements de sol et murs de prestige : formats 30×30, 40×40, 60×60, grands formats 60×120 et dalles monumentales 80×240 cm. Finitions polies miroir (Glossy), mates adoucies, antidérapantes R10/R11, effet marbre Calacatta et imitation parquet chêne.',
    coverImage: '/images/reelles/p2m-005.jpg',
    accentColor: '#C0562F',
    badge: '3 000 à 8 500 F/m² · 80×240 sur mesure',
    highlights: [
      'Grands formats 60×120 & 80×240 cm',
      'Porcelaine & Céramique 60×60, 40×40, 30×30',
      'Effet marbre Calacatta & Imitation bois',
    ],
    subFilters: [
      { id: 'all', label: 'Tous les carrelages' },
      { id: 'grand-format', label: 'Grands formats (60×120 & 80×240)' },
      { id: '60x60', label: 'Format 60×60 cm' },
      { id: '30x30-40x40', label: 'Formats 30×30 & 40×40 cm' },
      { id: 'marbre-bois', label: 'Effet marbre & Imitation bois' },
    ],
  },
  {
    id: 'sanitaire',
    number: '02',
    title: 'Bloc Sanitaire · WC, Lavabos, Vasques, Baignoires, Douches & Éviers',
    shortTitle: 'Bloc Sanitaire',
    subtitle: 'Équipements sanitaires complets en céramique vitrifiée, acrylique & inox',
    description:
      'Équipez intégralement vos salles de bains, toilettes et cuisines : WC suspendus (ESTA 2011), chaises anglaises monoblocs, packs WC au sol, chaises turques, lavabos sur colonne (Partas) ou totem sur pied (ROSEN 3001), vasques à poser (EXELON 7019), baignoires acryliques (SFS-4 DELUX), receveurs de douche (SFST-1) et éviers inox.',
    coverImage: '/images/reelles/p2m-133.jpg',
    accentColor: '#1B4965',
    badge: 'Céramique émaillée & Acrylique renforcé',
    highlights: [
      'WC suspendus, monoblocs & chaises turques',
      'Vasques à poser & lavabos sur pied/colonne',
      'Baignoires, receveurs de douche & éviers inox',
    ],
    subFilters: [
      { id: 'all', label: 'Tout le sanitaire' },
      { id: 'wc', label: 'WC suspendus, au sol & turques' },
      { id: 'lavabos-vasques', label: 'Lavabos & Vasques' },
      { id: 'bain-douche', label: 'Baignoires & Receveurs de douche' },
      { id: 'cuisine', label: 'Éviers de cuisine inox' },
    ],
  },
  {
    id: 'robinetterie',
    number: '03',
    title: 'Bloc Robinetterie, Colonnes de Douche & Accessoires',
    shortTitle: 'Bloc Robinetterie & Accessoires',
    subtitle: 'Mitigeurs chromés, colonnes de douche hydromassantes, sets salle de bain & plomberie',
    description:
      'Robinetterie en laiton chromé haute durabilité et accessoires coordonnés : colonnes de douche avec mitigeur ou hydromassantes, mitigeurs muraux douche/bain (AS-105), mitigeurs d’évier (HKI), robinets d’arrêt équerre (S-1003), sets d’accessoires chromés (porte-serviettes, porte-savon, étagères) et raccords de plomberie Pex.',
    coverImage: '/images/reelles/p2m-135.jpg',
    accentColor: '#2D6A8E',
    badge: 'Laiton chromé · Cartouche céramique',
    highlights: [
      'Colonnes de douche & mitigeurs bain/douche',
      'Mitigeurs d’évier HKI & robinets d’arrêt',
      'Sets accessoires chromés & raccords Pex',
    ],
    subFilters: [
      { id: 'all', label: 'Toute la robinetterie & accessoires' },
      { id: 'mitigeurs', label: 'Mitigeurs & Robinets' },
      { id: 'colonnes', label: 'Colonnes de douche' },
      { id: 'accessoires', label: 'Accessoires SDB & Plomberie' },
    ],
  },
  {
    id: 'faience-mosaique',
    number: '04',
    title: 'Bloc Faïence Murale, Mosaïque & Décor Piscine',
    shortTitle: 'Bloc Faïence & Mosaïque',
    subtitle: 'Faïence murale 3D, mosaïque pâte de verre piscine & parement pierre naturelle',
    description:
      'Sublimez vos murs de salles de bains, crédences de cuisine, piscines et façades intérieures avec nos faïences murales 3D Wall Design Glossy (20×30 cm), nos mosaïques en pâte de verre pour piscines et nos parements décoratifs effet pierre naturelle.',
    coverImage: '/images/reelles/p2m-083.jpg',
    accentColor: '#1F9D6B',
    badge: 'Murs SDB, Crédences & Piscines',
    highlights: [
      'Faïence murale 3D Wall Design 20×30 cm',
      'Mosaïque pâte de verre spéciale piscine',
      'Parement & décor mural effet pierre naturelle',
    ],
    subFilters: [
      { id: 'all', label: 'Toute la faïence & mosaïque' },
      { id: 'faience', label: 'Faïence murale 3D' },
      { id: 'mosaique', label: 'Mosaïque piscine & Parement pierre' },
    ],
  },
];

export function classifyP2mProduct(product: Product): P2mBlockId {
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subCategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  // Bloc 4 : Faïence & Mosaïque
  if (
    cat.includes('revêtement mural') ||
    cat.includes('revetement mural') ||
    sub.includes('faïence') ||
    sub.includes('faience') ||
    sub.includes('mosaïque') ||
    sub.includes('mosaique') ||
    sub.includes('parement') ||
    name.includes('faïence') ||
    name.includes('faience') ||
    name.includes('mosaïque') ||
    name.includes('mosaique')
  ) {
    return 'faience-mosaique';
  }

  // Bloc 3 : Robinetterie & Accessoires
  if (
    sub.includes('robinetterie') ||
    sub.includes('colonne') ||
    sub.includes('accessoire') ||
    sub.includes('outil') ||
    name.includes('robinet') ||
    name.includes('mitigeur') ||
    name.includes('colonne de douche') ||
    name.includes('accessoire') ||
    name.includes('plomberie')
  ) {
    return 'robinetterie';
  }

  // Bloc 2 : Sanitaire
  if (
    cat.includes('sanitaire') ||
    sub.includes('wc') ||
    sub.includes('vasque') ||
    sub.includes('lavabo') ||
    sub.includes('baignoire') ||
    sub.includes('receveur') ||
    sub.includes('évier') ||
    sub.includes('evier') ||
    name.includes('wc') ||
    name.includes('chaise anglaise') ||
    name.includes('chaise turque') ||
    name.includes('lavabo') ||
    name.includes('vasque') ||
    name.includes('baignoire') ||
    name.includes('receveur') ||
    name.includes('évier') ||
    name.includes('evier')
  ) {
    return 'sanitaire';
  }

  // Bloc 1 : Carrelage (par défaut pour les carreaux/dalles/porcelaines)
  return 'carrelage';
}

function matchesSubFilter(product: Product, blockId: P2mBlockId, subFilterId: string): boolean {
  if (!subFilterId || subFilterId === 'all') return true;
  const dim = (product.dimensions || '').toLowerCase();
  const sub = (product.subCategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (blockId === 'carrelage') {
    if (subFilterId === 'grand-format') {
      return dim.includes('120') || dim.includes('240') || sub.includes('grand format') || name.includes('120') || name.includes('240');
    }
    if (subFilterId === '60x60') {
      return (dim.includes('60') && !dim.includes('120')) || name.includes('60×60') || name.includes('60x60');
    }
    if (subFilterId === '30x30-40x40') {
      return dim.includes('30') || dim.includes('40') || name.includes('30×30') || name.includes('40×40');
    }
    if (subFilterId === 'marbre-bois') {
      return (
        sub.includes('marbre') ||
        sub.includes('bois') ||
        name.includes('marbre') ||
        name.includes('calacatta') ||
        name.includes('bois') ||
        name.includes('sathvario')
      );
    }
  }

  if (blockId === 'sanitaire') {
    if (subFilterId === 'wc') {
      return sub.includes('wc') || name.includes('wc') || name.includes('chaise');
    }
    if (subFilterId === 'lavabos-vasques') {
      return sub.includes('vasque') || sub.includes('lavabo') || name.includes('lavabo') || name.includes('vasque');
    }
    if (subFilterId === 'bain-douche') {
      return sub.includes('baignoire') || sub.includes('receveur') || name.includes('baignoire') || name.includes('receveur');
    }
    if (subFilterId === 'cuisine') {
      return sub.includes('évier') || sub.includes('evier') || name.includes('évier') || name.includes('evier');
    }
  }

  if (blockId === 'robinetterie') {
    if (subFilterId === 'mitigeurs') {
      return sub.includes('robinetterie') || name.includes('mitigeur') || name.includes('robinet');
    }
    if (subFilterId === 'colonnes') {
      return sub.includes('colonne') || name.includes('colonne');
    }
    if (subFilterId === 'accessoires') {
      return sub.includes('accessoire') || sub.includes('outil') || name.includes('accessoire') || name.includes('plomberie');
    }
  }

  if (blockId === 'faience-mosaique') {
    if (subFilterId === 'faience') {
      return sub.includes('faïence') || sub.includes('faience') || name.includes('faïence') || name.includes('faience');
    }
    if (subFilterId === 'mosaique') {
      return sub.includes('mosaïque') || sub.includes('mosaique') || sub.includes('parement') || name.includes('mosaïque');
    }
  }

  return true;
}

function getBlockIcon(id: P2mBlockId) {
  switch (id) {
    case 'carrelage':
      return Layers;
    case 'sanitaire':
      return Bath;
    case 'robinetterie':
      return Droplets;
    case 'faience-mosaique':
      return Sparkles;
  }
}

export default function P2mShowroomBlocks({
  products: externalProducts,
  loading = false,
  onOpenLightbox,
}: {
  products?: Product[];
  loading?: boolean;
  onOpenLightbox?: (images: { url: string; caption?: string }[], index: number, title: string) => void;
}) {
  const catalogProducts = useMemo(() => {
    if (externalProducts && externalProducts.length > 0) return externalProducts;
    return PRODUCTS_P2M;
  }, [externalProducts]);

  const [selectedBlock, setSelectedBlock] = useState<'all' | P2mBlockId>('all');
  const [subFiltersByBlock, setSubFiltersByBlock] = useState<Record<P2mBlockId, string>>({
    carrelage: 'all',
    sanitaire: 'all',
    robinetterie: 'all',
    'faience-mosaique': 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [addedRef, setAddedRef] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [showExtraGallery, setShowExtraGallery] = useState<boolean>(false);

  const gallerySamples = ENTITY_GALLERY['p2m'] ?? [];

  useEffect(() => {
    const syncCart = () => setCartCount(store.getCartCount('p2m'));
    syncCart();
    window.addEventListener('storage-update', syncCart);
    return () => window.removeEventListener('storage-update', syncCart);
  }, []);

  // Groupement des produits par bloc
  const productsByBlock = useMemo(() => {
    const grouped: Record<P2mBlockId, Product[]> = {
      carrelage: [],
      sanitaire: [],
      robinetterie: [],
      'faience-mosaique': [],
    };
    const q = searchQuery.trim().toLowerCase();

    for (const prod of catalogProducts) {
      if (q) {
        const match =
          (prod.name || '').toLowerCase().includes(q) ||
          (prod.ref || '').toLowerCase().includes(q) ||
          (prod.category || '').toLowerCase().includes(q) ||
          (prod.subCategory || '').toLowerCase().includes(q) ||
          (prod.dimensions || '').toLowerCase().includes(q) ||
          (prod.material || '').toLowerCase().includes(q);
        if (!match) continue;
      }
      const blockId = classifyP2mProduct(prod);
      grouped[blockId].push(prod);
    }

    return grouped;
  }, [catalogProducts, searchQuery]);

  const handleSelectBlock = (blockId: 'all' | P2mBlockId) => {
    setSelectedBlock(blockId);
    if (blockId !== 'all') {
      window.setTimeout(() => {
        const el = document.getElementById(`p2m-bloc-${blockId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }
  };

  const handleAddToCart = (product: Product) => {
    store.addToCart(product, 1, 'p2m');
    setAddedRef(product.ref);
    window.setTimeout(() => setAddedRef(null), 2400);
  };

  const visibleBlocks = useMemo(() => {
    if (selectedBlock === 'all') return P2M_BLOCKS;
    return P2M_BLOCKS.filter((b) => b.id === selectedBlock);
  }, [selectedBlock]);

  return (
    <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700 space-y-10">
      {/* BANDEAU SHOWROOM P2M & ACCÈS RAPIDES */}
      <div className="rounded-2xl border border-[#C0562F]/40 bg-gradient-to-br from-brand-950 via-brand-900 to-[#5A2512] text-white p-6 sm:p-8 shadow-elev-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C0562F]/30 border border-[#C0562F]/60 text-amber-200 text-xs font-mono font-bold">
                <Grid3X3 className="w-3.5 h-3.5" /> SHOWROOM P2M · ORGANISÉ PAR BLOCS MÉTIERS
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                Stock permanent à Mbao · Livraison chantier Dakar &amp; régions
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-white tracking-tight">
              Accédez directement au bloc qui vous intéresse
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
              Le showroom P2M est structuré en <strong>4 blocs dédiés</strong> :{' '}
              <strong className="text-amber-300">Bloc Carrelage</strong>,{' '}
              <strong className="text-amber-300">Bloc Sanitaire</strong>,{' '}
              <strong className="text-amber-300">Bloc Robinetterie &amp; Accessoires</strong> et{' '}
              <strong className="text-amber-300">Bloc Faïence &amp; Mosaïque</strong>. Cliquez sur le bloc de votre choix pour consulter immédiatement ses références, tarifs et disponibilités.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/panier?entite=p2m"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-m bg-[#C0562F] hover:bg-[#A04525] text-white font-bold text-sm shadow-elev-2 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Mon panier P2M ({cartCount})</span>
            </Link>
            <Link
              href="/entites/p2m/admin"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-m bg-amber-400 hover:bg-amber-300 text-brand-950 font-bold text-sm shadow-sm transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Espace Gestionnaire P2M</span>
            </Link>
          </div>
        </div>

        {/* Repères tarifaires officiels P2M */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {[
            { label: 'Porcelaine 60×60', price: '5 500 – 6 000 F/m²' },
            { label: 'Porcelaine 40×40', price: '4 000 – 5 500 F/m²' },
            { label: 'Porcelaine 30×30', price: '3 000 – 3 500 F/m²' },
            { label: 'Céramique 60×120', price: '7 500 – 8 500 F/m²' },
            { label: 'Céramique 60×60', price: '6 000 – 7 000 F/m²' },
            { label: 'Dalle 80×240 prestige', price: '30 000 F / plaque' },
          ].map((t) => (
            <div
              key={t.label}
              className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-m px-3 py-2"
            >
              <span className="block text-white/75 text-[10px] font-mono">{t.label}</span>
              <strong className="text-amber-300 font-mono tabular-nums">{t.price}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* LES 4 CARTES D'ACCÈS DIRECT AUX BLOCS P2M */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-[#C0562F] dark:text-accent-400 tracking-wider">
              NAVIGATION RAPIDE PAR UNIVERS PRODUIT
            </span>
            <h3 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white mt-0.5">
              Choisissez votre bloc P2M :
            </h3>
          </div>

          {selectedBlock !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedBlock('all')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-m bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-accent-500 dark:hover:bg-accent-500 dark:hover:text-white transition-colors self-start sm:self-auto"
            >
              <span>Afficher tous les blocs ({catalogProducts.length} réf.)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {P2M_BLOCKS.map((block) => {
            const IconComp = getBlockIcon(block.id);
            const count = productsByBlock[block.id]?.length ?? 0;
            const isSelected = selectedBlock === block.id;

            return (
              <button
                key={block.id}
                type="button"
                onClick={() => handleSelectBlock(isSelected ? 'all' : block.id)}
                className={`group text-left rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isSelected
                    ? 'border-[#C0562F] ring-2 ring-[#C0562F]/50 bg-brand-900 text-white'
                    : 'border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-800/80 hover:border-[#C0562F]'
                }`}
              >
                {/* Image de couverture du bloc */}
                <div className="relative h-44 sm:h-48 w-full shrink-0 bg-brand-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.coverImage}
                    alt={block.shortTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full text-white text-xs font-mono font-bold flex items-center justify-center shadow"
                      style={{ backgroundColor: block.accentColor }}
                    >
                      {block.number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold border border-white/15">
                      {block.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#C0562F] text-white text-[11px] font-mono font-bold shadow">
                    {count} réf.
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0">
                      <IconComp className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-title font-bold text-white text-base leading-tight group-hover:text-amber-300 transition-colors">
                        {block.shortTitle}
                      </h4>
                      <span className="text-[11px] text-white/80 line-clamp-1">
                        {block.subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenu résumé du bloc */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <ul className="space-y-1.5">
                    {block.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 text-xs ${
                          isSelected ? 'text-neutral-200' : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                          style={{ backgroundColor: block.accentColor }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-neutral-100 dark:border-brand-700/60 flex items-center justify-between text-xs font-bold text-[#C0562F] dark:text-amber-400">
                    <span>
                      {isSelected ? 'Bloc affiché (cliquer pour tout voir)' : `Ouvrir le ${block.shortTitle}`}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* BARRE D'ONGLETS RAPIDES + RECHERCHE INSTANTANÉE */}
      <div className="bg-neutral-50 dark:bg-brand-800/60 border border-neutral-200 dark:border-brand-700 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedBlock('all')}
            className={`px-3.5 py-2 rounded-m text-xs font-bold transition-colors ${
              selectedBlock === 'all'
                ? 'bg-[#C0562F] text-white shadow-sm'
                : 'bg-white dark:bg-brand-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-brand-700 hover:border-[#C0562F]'
            }`}
          >
            Tous les blocs ({catalogProducts.length})
          </button>
          {P2M_BLOCKS.map((b) => {
            const active = selectedBlock === b.id;
            const count = productsByBlock[b.id]?.length ?? 0;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBlock(b.id)}
                className={`px-3.5 py-2 rounded-m text-xs font-bold transition-colors ${
                  active
                    ? 'bg-[#C0562F] text-white shadow-sm'
                    : 'bg-white dark:bg-brand-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-brand-700 hover:border-[#C0562F]'
                }`}
              >
                {b.shortTitle} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher 60×60, marbre, WC, lavabo, mitigeur..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-neutral-900 dark:text-white focus:outline-none focus:border-[#C0562F]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Effacer la recherche"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* AFFICHAGE DÉTAILLÉ BLOC PAR BLOC */}
      {loading && catalogProducts.length === 0 ? (
        <div className="py-12 text-center text-sm text-neutral-500">
          Chargement des blocs du showroom P2M...
        </div>
      ) : (
        <div className="space-y-12">
          {visibleBlocks.map((block) => {
            const IconComp = getBlockIcon(block.id);
            const rawBlockProducts = productsByBlock[block.id] ?? [];
            const activeSubFilter = subFiltersByBlock[block.id] || 'all';
            const filteredBlockProducts = rawBlockProducts.filter((p) =>
              matchesSubFilter(p, block.id, activeSubFilter)
            );

            return (
              <div
                key={block.id}
                id={`p2m-bloc-${block.id}`}
                className="scroll-mt-24 rounded-2xl border border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-850 overflow-hidden shadow-elev-1"
              >
                {/* En-tête du Bloc */}
                <div
                  className="p-6 sm:p-7 text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${block.accentColor} 0%, #0B1B2B 100%)`,
                  }}
                >
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
                          BLOC {block.number}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-amber-200 text-xs font-mono">
                          {rawBlockProducts.length} référence{rawBlockProducts.length > 1 ? 's' : ''} disponible{rawBlockProducts.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-title font-bold text-white flex items-center gap-2.5">
                        <IconComp className="w-6 h-6 text-amber-300 shrink-0" />
                        <span>{block.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                        {block.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Link
                        href={`/assistant?entite=p2m`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-m bg-white text-neutral-900 font-bold text-xs hover:bg-neutral-100 transition-colors shadow-sm"
                      >
                        <span>Devis sur mesure ({block.shortTitle})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Sous-filtres rapides internes au bloc */}
                  {block.subFilters.length > 1 && (
                    <div className="relative z-10 mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-white/75 mr-1">
                        Filtrer dans ce bloc :
                      </span>
                      {block.subFilters.map((sf) => {
                        const isSubActive = activeSubFilter === sf.id;
                        return (
                          <button
                            key={sf.id}
                            type="button"
                            onClick={() =>
                              setSubFiltersByBlock((prev) => ({
                                ...prev,
                                [block.id]: sf.id,
                              }))
                            }
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              isSubActive
                                ? 'bg-white text-neutral-900 font-bold shadow-sm'
                                : 'bg-white/10 text-white/90 hover:bg-white/20'
                            }`}
                          >
                            {sf.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Grille des produits du bloc */}
                <div className="p-5 sm:p-6">
                  {filteredBlockProducts.length === 0 ? (
                    <div className="py-10 text-center text-sm text-neutral-500">
                      Aucune référence ne correspond à ce filtre dans le {block.shortTitle}.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setSubFiltersByBlock((prev) => ({ ...prev, [block.id]: 'all' }));
                          setSearchQuery('');
                        }}
                        className="text-[#C0562F] font-bold hover:underline ml-1"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {filteredBlockProducts.map((product) => {
                        const images = (product.images || []).map((img: any) =>
                          typeof img === 'string' ? img : img.url
                        );
                        const primaryImage = images[0] || '/images/p2m.jpg';
                        const isAdded = addedRef === product.ref;
                        const waText = encodeURIComponent(
                          `Bonjour P2M, je suis intéressé par : ${product.name} (Réf: ${product.ref} · ${product.dimensions}).`
                        );

                        return (
                          <div
                            key={product.id}
                            className="group flex flex-col bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 hover:border-[#C0562F] rounded-xl overflow-hidden shadow-sm hover:shadow-elev-2 transition-all"
                          >
                            {/* Image produit avec zoom lightbox */}
                            <div
                              role="button"
                              tabIndex={0}
                              style={{ cursor: 'pointer' }}
                              className="relative h-52 sm:h-56 w-full shrink-0 bg-neutral-100 dark:bg-brand-900 overflow-hidden cursor-pointer"
                              onClick={() => {
                                if (onOpenLightbox && images.length > 0) {
                                  onOpenLightbox(
                                    images.map((url: string) => ({
                                      url,
                                      caption: `${product.name} (${product.ref}) · ${product.dimensions}`,
                                    })),
                                    0,
                                    product.name
                                  );
                                }
                              }}
                              title="Cliquer pour agrandir la photo"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={primaryImage}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-brand-950/90 text-white font-mono text-[10px] font-bold">
                                {product.ref}
                              </span>

                              <span
                                className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                                  product.availability === 'En stock'
                                    ? 'bg-emerald-600'
                                    : product.availability === 'Sur commande'
                                    ? 'bg-amber-600'
                                    : 'bg-blue-600'
                                }`}
                              >
                                {product.availability}
                              </span>

                              {images.length > 1 && (
                                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                                  {images.length} photos
                                </span>
                              )}

                              <span className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white opacity-80 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="w-3.5 h-3.5" />
                              </span>
                            </div>

                            {/* Détails du produit */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#C0562F] dark:text-amber-400 font-semibold">
                                  <span className="truncate">{product.subCategory || product.category}</span>
                                  <span className="shrink-0 text-neutral-500 dark:text-neutral-400">
                                    {product.dimensions}
                                  </span>
                                </div>

                                <Link
                                  href={`/catalogue/${product.id}`}
                                  className="block font-title font-bold text-sm text-neutral-900 dark:text-white group-hover:text-[#C0562F] transition-colors mt-1 line-clamp-2"
                                >
                                  {product.name}
                                </Link>

                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                                  {product.material} · {product.finish}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-neutral-100 dark:border-brand-700 space-y-2.5">
                                <div className="flex items-baseline justify-between">
                                  <span className="text-[11px] text-neutral-500">Prix indicatif</span>
                                  {product.isPriceVisible && product.indicativePriceFCFA ? (
                                    <div className="text-right">
                                      <span className="text-base font-mono font-bold text-[#C0562F] dark:text-amber-400 tabular-nums">
                                        {product.indicativePriceFCFA.toLocaleString('fr-FR')} F
                                      </span>
                                      <span className="text-[10px] text-neutral-500 ml-1">
                                        /{product.unit || 'u'} HT
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-semibold text-amber-600">
                                      Sur devis
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAddToCart(product)}
                                    className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-m text-xs font-bold transition-colors ${
                                      isAdded
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#C0562F] hover:bg-[#A04525] text-white'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Ajouté</span>
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>Devis / Panier</span>
                                      </>
                                    )}
                                  </button>

                                  <Link
                                    href={`/catalogue/${product.id}`}
                                    className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-m text-xs font-semibold bg-neutral-100 dark:bg-brand-900 hover:bg-neutral-200 dark:hover:bg-brand-700 text-neutral-800 dark:text-neutral-200 transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Fiche détail</span>
                                  </Link>
                                </div>

                                <a
                                  href={`https://wa.me/221784246445?text=${waText}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-m text-[11px] font-semibold border border-emerald-600/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Commander sur WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PHOTOTHÈQUE ADDITIONNELLE DES ÉCHANTILLONS DU SHOWROOM MBAO (DÉPLIABLE) */}
      {gallerySamples.length > 0 && (
        <div className="rounded-xl border border-neutral-200 dark:border-brand-700 bg-neutral-50 dark:bg-brand-800/40 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-title font-bold text-base text-neutral-900 dark:text-white">
                Photothèque complète des échantillons du Showroom P2M Mbao ({gallerySamples.length} clichés)
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Consultez l&apos;ensemble des planches d&apos;échantillons photographiées au showroom de Mbao Ville Neuve.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowExtraGallery((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-m bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 text-xs font-bold text-neutral-800 dark:text-white hover:border-[#C0562F] transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>{showExtraGallery ? 'Masquer la photothèque' : 'Voir les 110 photos d’échantillons'}</span>
              {showExtraGallery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showExtraGallery && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {gallerySamples.map((img, idx) => (
                <figure
                  key={idx}
                  onClick={() =>
                    onOpenLightbox?.(
                      gallerySamples.map((g) => ({ url: g.src, caption: g.caption })),
                      idx,
                      'Showroom P2M Mbao'
                    )
                  }
                  className="group relative h-40 sm:h-44 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-brand-700 bg-neutral-200 dark:bg-brand-900 cursor-zoom-in"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-1.5 text-[10px] leading-tight text-white line-clamp-2">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
