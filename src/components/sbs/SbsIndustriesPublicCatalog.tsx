'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Phone,
  MapPin,
  Truck,
  ShoppingCart,
  CheckCircle2,
  Calculator,
  Search,
  Layers,
  Wrench,
  Blocks,
  MessageSquare,
  ZoomIn,
  ArrowRight,
} from 'lucide-react';
import {
  DEFAULT_SBS_CONFIG,
  DEFAULT_SBS_PRODUCTS,
  SbsProductFamily,
  SbsProductItem,
} from '@/lib/sbsErpDefaults';
import { store } from '@/lib/store';
import { FAMILY_LABELS, fmtFCFA } from './admin/sbsFormat';

interface PublicProduct {
  id: string;
  code: string;
  family: SbsProductFamily;
  name: string;
  dimensions: string;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  unit: string;
  sellingPriceFCFA: number | null;
  priceMaxFCFA: number | null;
  isPriceVisible: boolean;
  availability: string;
  isRental: boolean;
  imageUrl: string | null;
  description: string | null;
}

interface PublicCompanyInfo {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  deliveryZone: string;
}

export interface SbsDimensionCard {
  url: string;
  dim: string;
  title: string;
  price: string;
  family: string;
  caption: string;
  usage: string;
}

const DIMENSION_GRIDS: SbsDimensionCard[] = [
  {
    url: '/images/sbs-industries/brique-creuse-10x20x40-teralta.png',
    dim: '10×20×40 cm',
    title: 'Agglo creux 10×20×40',
    price: '380 F',
    family: 'Agglo creux',
    caption: 'Brique creuse 10×20×40 — Cloisons & murets légers',
    usage: 'Cloisons intérieures & murets de clôture non porteurs',
  },
  {
    url: '/images/sbs-industries/brique-creuse-12x20x40-teralta.png',
    dim: '12×20×40 cm',
    title: 'Agglo creux 12×20×40',
    price: '400 F',
    family: 'Agglo creux',
    caption: 'Brique creuse 12×20×40 — Murs de clôture calibrés',
    usage: 'Clôtures, doublages et séparations acoustiques',
  },
  {
    url: '/images/sbs-industries/brique-creuse-15x20x40-teralta.png',
    dim: '15×20×40 cm',
    title: 'Agglo creux 15×20×40',
    price: '475 F',
    family: 'Agglo creux',
    caption: 'Brique creuse 15×20×40 — Murs extérieurs R+',
    usage: 'Murs porteurs et façades de bâtiments R+1 / R+2',
  },
  {
    url: '/images/sbs-industries/brique-creuse-20x20x40-teralta.png',
    dim: '20×20×40 cm',
    title: 'Agglo creux 20×20×40',
    price: '590 F',
    family: 'Agglo creux',
    caption: 'Brique creuse 20×20×40 — Gros œuvre & soubassements',
    usage: 'Murs porteurs forte charge, sous-sols & refends',
  },
  {
    url: '/images/sbs-industries/brique-pleine-15x20x40-envain.png',
    dim: '15×20×40 cm',
    title: 'Agglo plein 15×20×40',
    price: '700 F',
    family: 'Agglo plein',
    caption: 'Brique pleine 15×20×40 — Fondations & zones humides',
    usage: 'Fondations, soubassements étanches & murs de clôture porteurs',
  },
  {
    url: '/images/sbs-industries/agglos-pleins-palette-stock-mbao.jpg',
    dim: '20×20×40 cm',
    title: 'Agglo plein 20×20×40',
    price: '850 F',
    family: 'Agglo plein',
    caption: 'Brique pleine 20×20×40 — Soutènements & génie civil',
    usage: 'Ouvrages d\'art, massifs lourds & murs coupe-feu',
  },
  {
    url: '/images/sbs-industries/hourdis-beton-50cm-alkern.jpg',
    dim: '12..25×20×50 cm',
    title: 'Hourdis plancher 12 à 25 cm',
    price: '450 – 750 F',
    family: 'Hourdis',
    caption: 'Hourdis béton haute résistance — Dalles de compression 50 cm',
    usage: 'Planchers nervurés hourdis 12, 16, 20 et 25×20×50 cm',
  },
  {
    url: '/images/sbs-industries/flyer-paves.jpg',
    dim: '6, 8, 10 cm',
    title: 'Pavés autobloquants',
    price: '6 750 – 9 000 F/m²',
    family: 'Pavés',
    caption: 'Pavés d\'aménagement & voirie lourde — 6, 8 et 10 cm',
    usage: 'Aménagements extérieurs, voiries urbaines & parkings poids lourds',
  },
];

const FALLBACK_PRODUCTS: PublicProduct[] = DEFAULT_SBS_PRODUCTS.map((p: SbsProductItem) => ({
  id: p.id,
  code: p.code,
  family: p.family,
  name: p.name,
  dimensions: p.dimensions,
  lengthCm: p.lengthCm,
  widthCm: p.widthCm,
  heightCm: p.heightCm,
  unit: p.unit,
  sellingPriceFCFA: p.sellingPriceFCFA,
  priceMaxFCFA: p.priceMaxFCFA,
  isPriceVisible: p.isPriceVisible,
  availability: p.availability,
  isRental: p.isRental,
  imageUrl: p.imageUrl,
  description: p.description,
}));

const AVAILABILITY_STYLES: Record<string, string> = {
  'En stock': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Disponible: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Sur commande': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'En rupture': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const FAMILY_TABS: { id: 'all' | SbsProductFamily; label: string }[] = [
  { id: 'all', label: 'Tout le catalogue' },
  { id: 'agglos-pleins', label: 'Agglos pleins' },
  { id: 'agglos-creux', label: 'Agglos creux' },
  { id: 'hourdis', label: 'Hourdis' },
  { id: 'paves', label: 'Pavés (/m²)' },
  { id: 'beton', label: 'Béton Prêt à l’Emploi' },
  { id: 'location', label: 'Locations matériel' },
];

export default function SbsIndustriesPublicCatalog({
  onOpenLightbox,
}: {
  onOpenLightbox?: (images: { url: string; caption?: string }[], index: number, title: string) => void;
}) {
  const [company, setCompany] = useState<PublicCompanyInfo>({
    name: DEFAULT_SBS_CONFIG.companyName,
    phone: DEFAULT_SBS_CONFIG.phone,
    whatsapp: DEFAULT_SBS_CONFIG.whatsapp,
    address: DEFAULT_SBS_CONFIG.address,
    deliveryZone: DEFAULT_SBS_CONFIG.deliveryZone,
  });
  const [products, setProducts] = useState<PublicProduct[]>(FALLBACK_PRODUCTS);
  const [activeFamily, setActiveFamily] = useState<'all' | SbsProductFamily>('all');
  const [search, setSearch] = useState('');
  const [addedCode, setAddedCode] = useState<string | null>(null);
  const [sbsCartCount, setSbsCartCount] = useState<number>(0);

  useEffect(() => {
    const syncCount = () => setSbsCartCount(store.getCartCount('sbs-industries'));
    syncCount();
    window.addEventListener('storage-update', syncCount);
    return () => window.removeEventListener('storage-update', syncCount);
  }, []);

  // Calculateur rapide chantier
  const [calcCode, setCalcCode] = useState<string>('AP15');
  const [calcQty, setCalcQty] = useState<number>(500);
  const [includeTva, setIncludeTva] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    fetch('/api/sbs-industrie/public', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (data.company) setCompany(data.company);
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Fallback statique déjà chargé
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchFam = activeFamily === 'all' || p.family === activeFamily;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.dimensions.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);
      return matchFam && matchQ;
    });
  }, [products, activeFamily, search]);

  const calcProduct = useMemo(
    () => products.find((p) => p.code === calcCode) ?? products[0],
    [products, calcCode]
  );

  const calcEstimate = useMemo(() => {
    if (!calcProduct || !calcProduct.sellingPriceFCFA || calcQty <= 0) {
      return { ht: 0, tva: 0, ttc: 0 };
    }
    const ht = calcProduct.sellingPriceFCFA * calcQty;
    const tva = includeTva ? ht * 0.18 : 0;
    return { ht, tva, ttc: ht + tva };
  }, [calcProduct, calcQty, includeTva]);

  const cleanWa = (company.whatsapp || company.phone || '221775664806').replace(/[\s\+]/g, '');
  const waNumber = cleanWa.startsWith('221') ? cleanWa : `221${cleanWa}`;

  const handleAddToQuoteCart = (p: PublicProduct) => {
    store.addToCart(
      {
        id: p.id,
        ref: p.code,
        name: `${p.name} (${p.dimensions})`,
        category: FAMILY_LABELS[p.family] || p.family,
        subCategory: p.isRental ? 'Location' : 'Préfabrication béton',
        brand: 'SBS Industrie',
        dimensions: p.dimensions,
        material: p.family === 'location' ? 'Équipement industriel' : 'Béton vibré haute résistance',
        finish: 'Industriel normalisé',
        color: 'Gris ciment',
        usage: p.description || p.name,
        unit: p.unit,
        packaging: p.unit === 'm²' ? 'Au m²' : p.unit === 'm³' ? 'Toupie / m³' : 'Palette / Unité',
        origin: 'Sénégal — Usine SBS Industrie',
        indicativePriceFCFA: p.sellingPriceFCFA ?? 0,
        isPriceVisible: p.isPriceVisible,
        availability: (p.availability as any) || 'En stock',
        leadTime: '24h–48h Dakar & régions',
        images: p.imageUrl ? [p.imageUrl] : ['/images/sbs-industries/flyer-agglos-pleins.jpg'],
        specs: { Dimensions: p.dimensions, Code: p.code },
      },
      1,
      'sbs-industries'
    );
    setAddedCode(p.code);
    window.setTimeout(() => setAddedCode(null), 2600);
  };

  return (
    <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700 space-y-10">
      {/* Bandeau d'identité commerciale & Accès exclusif Gestionnaire SBS */}
      <div className="rounded-l border border-brand-200 dark:border-brand-700 bg-gradient-to-br from-brand-900 via-brand-800 to-[#394A59] text-white p-6 sm:p-8 shadow-elev-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 border border-accent-400/40 text-accent-300 text-xs font-mono font-bold">
                <Blocks className="w-3.5 h-3.5" /> CATALOGUE OFFICIEL &amp; LOCATIONS SBS INDUSTRIE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Truck className="w-3.5 h-3.5" /> {company.deliveryZone}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-title font-bold text-white">
              Agglos Creux &amp; Pleins (15×20×40 · 20×20×40), Hourdis, Pavés, Béton &amp; Locations
            </h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-100">
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
                {company.address}
              </span>
              <a
                href={`tel:${company.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 font-mono font-bold text-white hover:text-accent-300"
              >
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                {company.phone}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/entites/sbs-industries/admin"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-m bg-amber-500 hover:bg-amber-600 text-brand-950 font-bold text-sm shadow-elev-2 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Espace Gestionnaire SBS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/panier?entite=sbs-industries"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-m bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Mon panier SBS ({sbsCartCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grilles tarifaires officielles en images & Vraies photos de briques par dimension */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent-500" />
              Grilles tarifaires officielles en images &amp; vraies briques par dimension
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Photographies réelles des briques avec cotes précises (longueur × largeur × hauteur), alvéoles calibrées, tarifs officiels et applications chantier.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
            Dimensions certifiées usine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIMENSION_GRIDS.map((card, idx) => (
            <div
              key={card.url + card.dim}
              className="group relative flex flex-col rounded-l border border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-800 shadow-elev-1 hover:shadow-elev-3 hover:border-accent-500 transition-all overflow-hidden"
            >
              {/* Image réelle de la brique */}
              <button
                type="button"
                onClick={() =>
                  onOpenLightbox?.(
                    DIMENSION_GRIDS.map((c) => ({ url: c.url, caption: `${c.title} (${c.dim}) — ${c.price} : ${c.usage}` })),
                    idx,
                    `Brique réelle SBS Industrie ${card.dim}`
                  )
                }
                className="relative aspect-[16/11] w-full bg-neutral-900 overflow-hidden text-left cursor-zoom-in"
                title="Cliquer pour afficher la photo haute résolution"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.url}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badge Dimension en incrustation */}
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-brand-900/90 text-white font-mono font-bold text-xs shadow-sm border border-white/20">
                  {card.dim}
                </div>
                {/* Badge Zoom */}
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-80 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Détails techniques & tarifaires */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent-600 dark:text-accent-400 font-bold">
                      {card.family}
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {card.price}
                    </span>
                  </div>
                  <h4 className="font-title font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                    {card.usage}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-brand-700/80 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10px]">
                    Cote : {card.dim}
                  </span>
                  <span className="text-accent-600 dark:text-accent-400 font-semibold group-hover:underline inline-flex items-center gap-1">
                    Voir détails
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Filtres & Recherche Catalogue Interactif */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FAMILY_TABS.map((tab) => {
              const active = activeFamily === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFamily(tab.id)}
                  className={`px-3.5 py-2 rounded-m text-xs font-bold transition-colors ${
                    active
                      ? 'bg-brand-900 text-white dark:bg-accent-500'
                      : 'bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-brand-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dimension, 15×20×40, béton..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-neutral-900 dark:text-white focus:outline-none focus:border-accent-500"
            />
          </div>
        </div>

        {/* Grille Produits & Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const isAdded = addedCode === p.code;
            const waText = encodeURIComponent(
              `Bonjour SBS Industrie, je souhaite commander / louer : ${p.name} (${p.dimensions}) — Réf ${p.code}.`
            );
            return (
              <div
                key={p.id}
                className="flex flex-col bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-2 transition-shadow"
              >
                <div className="relative aspect-[16/10] bg-neutral-100 dark:bg-brand-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl || '/images/sbs-industries/flyer-agglos-pleins.jpg'}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-brand-900/90 text-white text-[10px] font-mono font-bold">
                      {p.code}
                    </span>
                    {p.isRental && (
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-brand-950 text-[10px] font-bold inline-flex items-center gap-1">
                        <Wrench className="w-3 h-3" /> Location
                      </span>
                    )}
                  </div>
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      AVAILABILITY_STYLES[p.availability] || 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {p.availability}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-mono text-accent-600 dark:text-accent-400 font-semibold">
                      {FAMILY_LABELS[p.family] || p.family} · {p.dimensions}
                    </div>
                    <h4 className="font-title font-bold text-neutral-900 dark:text-white text-base mt-0.5">
                      {p.name}
                    </h4>
                    {p.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 line-clamp-2">
                        {p.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-brand-700 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Tarif public</span>
                      {p.isPriceVisible && p.sellingPriceFCFA != null ? (
                        <span className="text-lg font-mono font-bold text-brand-900 dark:text-white tabular-nums">
                          {p.priceMaxFCFA
                            ? `${p.sellingPriceFCFA.toLocaleString('fr-FR')} – ${p.priceMaxFCFA.toLocaleString('fr-FR')} F`
                            : fmtFCFA(p.sellingPriceFCFA)}
                          <span className="text-xs font-normal text-neutral-500 ml-1">/{p.unit}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-600">Sur devis</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToQuoteCart(p)}
                        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-m text-xs font-bold transition-colors ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-brand-900 hover:bg-brand-800 dark:bg-accent-500 dark:hover:bg-accent-600 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ajouté
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" /> Devis
                          </>
                        )}
                      </button>
                      <a
                        href={`https://wa.me/${waNumber}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-m text-xs font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calculateur Express Chantier Client */}
      <div className="rounded-l border border-neutral-200 dark:border-brand-700 bg-neutral-50 dark:bg-brand-800/60 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-accent-500" />
              Simulateur Rapide Chantier — Briques, Pavés, Béton &amp; Locations
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Estimez instantanément le budget de votre commande ou location selon les tarifs actualisés par la direction SBS Industrie.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                  Produit / Location
                </label>
                <select
                  value={calcProduct?.code || ''}
                  onChange={(e) => setCalcCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-neutral-900 dark:text-white"
                >
                  {products.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.name} ({p.sellingPriceFCFA ? `${p.sellingPriceFCFA.toLocaleString('fr-FR')} F/${p.unit}` : 'Sur devis'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                  Quantité ({calcProduct?.unit || 'unité'})
                </label>
                <input
                  type="number"
                  min={1}
                  value={calcQty}
                  onChange={(e) => setCalcQty(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-neutral-900 dark:text-white tabular-nums"
                />
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTva}
                onChange={(e) => setIncludeTva(e.target.checked)}
                className="rounded border-neutral-400"
              />
              Inclure TVA Sénégal (18 %)
            </label>
          </div>

          <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m p-5 min-w-[270px] space-y-2 shadow-elev-1">
            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Montant HT</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white tabular-nums">
                {fmtFCFA(Math.round(calcEstimate.ht))}
              </span>
            </div>
            {includeTva && (
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>TVA (18 %)</span>
                <span className="font-mono font-semibold tabular-nums">
                  {fmtFCFA(Math.round(calcEstimate.tva))}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-200 dark:border-brand-700 flex justify-between items-baseline">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                Total estimé {includeTva ? 'TTC' : 'HT'}
              </span>
              <span className="text-xl font-mono font-bold text-accent-600 dark:text-accent-400 tabular-nums">
                {fmtFCFA(Math.round(calcEstimate.ttc))}
              </span>
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Bonjour SBS Industrie, demande de devis pour ${calcQty} ${calcProduct?.unit || 'u'} de ${
                  calcProduct?.name || ''
                } (${calcProduct?.dimensions || ''}) — Estimation ${Math.round(calcEstimate.ttc).toLocaleString(
                  'fr-FR'
                )} F CFA.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-m bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Commander via WhatsApp ({company.phone})
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
