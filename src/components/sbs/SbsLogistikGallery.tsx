'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Camera,
  ChevronDown,
  Eye,
  Lock,
  ShoppingCart,
  Check,
  Clock,
  Tag,
  Plus,
  MessageCircle,
} from 'lucide-react';
import {
  SBS_LOGISTIK_ITEMS,
  SbsLogistikEquipmentItem,
} from '@/data/sbsLogistikData';
import { store } from '@/lib/store';

const SBS_LOGISTIK_SLIDES_COUNT = 37;

interface LiveLogistikEquipment {
  id: string;
  code: string;
  title: string;
  category: string;
  brand: string;
  description: string;
  specs: string;
  usage: string;
  imageUrl: string;
  pageNumber: number;
  dailyRateFCFA: number;
  isPriceVisible: boolean;
  availability: string;
  updatedBy?: string;
  updatedAt?: string;
  width?: number;
  height?: number;
  orientation?: string;
}

const SLIDE_TITLES: Record<number, string> = {
  1: 'Couverture officielle SB-S Logistik (Dakar)',
  2: 'Flotte de camions bennes Sinotruk HOWO',
  3: 'Camions gros porteurs sur base chantier',
  4: 'Élingage & levage de matériel industriel',
  5: 'Transport par semi-remorques plateau 40T',
  6: 'Système de chargement & transport d’engins',
  7: 'Levage par grue mobile haute capacité 50T',
  8: 'Logistique portuaire et transfert de conteneurs',
  9: 'Déchargement sur site industriel & port',
  10: 'Travaux souterrains et tunneliers',
  11: 'Soudure & manutention spécialisée',
  12: 'Tractopelles de terrassement tout-terrain',
  13: 'Excavation et préparation de fondations',
  14: 'Base vie et parc engins multi-fonctions',
  15: 'Système d’évacuation et pompage de fouilles',
  16: 'Chantiers lourds et infrastructures routières',
  17: 'Parc d’engins de compactage et nivellement',
  18: 'Réseaux hydrauliques et terrassement',
  19: 'Production de béton par camions toupies',
  20: 'Camions malaxeurs et approvisionnement',
  21: 'Centrales mobiles de production béton',
  22: 'Stockage de granulats et silo de ciment',
  23: 'Distribution de béton par pompes fixes',
  24: 'Pompes à béton Aquarius haute pression',
  25: 'Opérations de bétonnage intensif sur dalle',
  26: 'Lignes de préfabrication d’agglos et pavés',
  27: 'Chaîne de fabrication agglos et bordures',
  28: 'Presse de moulage de blocs TeknoMac / QT40',
  29: 'Séchage et stockage sur parc industriel',
  30: 'Fabrication de composants béton armé',
  31: 'Aires de production et de cure du béton',
  32: 'Engins de manutention et stockage',
  33: 'Flotte de véhicules d’intervention et liaison',
  34: 'Maintenance et dépannage mobile sur site',
  35: 'Systèmes d’alimentation et groupes électrogènes',
  36: 'Outillage de chantier et contrôle qualité',
  37: 'Engagement de performance et coordination',
};

function availabilityStyle(status: string): string {
  if (status === 'Disponible') {
    return 'bg-emerald-600 text-white';
  }
  if (status === 'En location' || status === 'Réservé') {
    return 'bg-amber-600 text-white';
  }
  return 'bg-rose-600 text-white';
}

function toInitialLiveItems(): LiveLogistikEquipment[] {
  return SBS_LOGISTIK_ITEMS.map((i) => ({
    id: i.id,
    code: i.code,
    title: i.title,
    category: i.category,
    brand: i.title.toLowerCase().includes('samsung')
      ? 'Samsung'
      : i.title.toLowerCase().includes('howo')
        ? 'Sinotruk HOWO'
        : i.title.toLowerCase().includes('aquarius')
          ? 'Aquarius'
          : i.title.toLowerCase().includes('tata')
            ? 'TATA'
            : i.title.toLowerCase().includes('renault')
              ? 'Renault'
              : 'SBS Sélection Pro',
    description: i.description,
    specs: i.specs,
    usage: i.usage,
    imageUrl: i.imageUrl,
    pageNumber: i.pageNumber,
    dailyRateFCFA: 0,
    isPriceVisible: false,
    availability: 'Disponible',
    width: i.width,
    height: i.height,
    orientation: i.orientation,
  }));
}

export function SbsLogistikGallery() {
  const [liveItems, setLiveItems] = useState<LiveLogistikEquipment[]>(toInitialLiveItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedBrand, setSelectedBrand] = useState<string>('Toutes');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'photos' | 'slides'>('photos');
  const [displayCount, setDisplayCount] = useState<number>(24);
  const [activePhoto, setActivePhoto] = useState<LiveLogistikEquipment | null>(null);
  const [showOriginalSlideInModal, setShowOriginalSlideInModal] = useState<boolean>(false);
  const [logistikCartCount, setLogistikCartCount] = useState<number>(0);
  const [daysByItem, setDaysByItem] = useState<Record<string, number>>({});
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  useEffect(() => {
    const syncCart = () => setLogistikCartCount(store.getCartCount('sbs-logistik'));
    syncCart();
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/sbs-logistik/public', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.items?.length) return;
        const sizeMap = new Map<string, SbsLogistikEquipmentItem>(
          SBS_LOGISTIK_ITEMS.map((s) => [s.code, s])
        );
        const merged: LiveLogistikEquipment[] = data.items.map((row: LiveLogistikEquipment) => {
          const orig = sizeMap.get(row.code);
          return {
            ...row,
            width: orig?.width || 1200,
            height: orig?.height || 900,
            orientation: orig?.orientation || 'landscape',
          };
        });
        setLiveItems(merged);
      })
      .catch(() => {
        // Fallback statique déjà chargé
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(liveItems.map((i) => i.category))),
    [liveItems]
  );

  const brands = useMemo(
    () => Array.from(new Set(liveItems.map((i) => i.brand))).sort(),
    [liveItems]
  );

  const stats = useMemo(
    () => ({
      total: liveItems.length,
      disponible: liveItems.filter((i) => i.availability === 'Disponible').length,
      enLocation: liveItems.filter((i) => i.availability === 'En location').length,
    }),
    [liveItems]
  );

  const getSlideSrc = (pageNumber: number) =>
    `/images/sbs-logistik/slides/page-${String(pageNumber).padStart(2, '0')}.jpg`;

  const allSlides = useMemo(
    () =>
      Array.from({ length: SBS_LOGISTIK_SLIDES_COUNT }, (_, idx) => {
        const pageNum = idx + 1;
        return {
          pageNum,
          title: SLIDE_TITLES[pageNum] || `Planche Technique N°${pageNum}`,
          slideSrc: getSlideSrc(pageNum),
        };
      }),
    []
  );

  const filteredPhotos = useMemo(() => {
    return liveItems.filter((item) => {
      const matchCat = selectedCategory === 'Toutes' || item.category === selectedCategory;
      const matchBrand = selectedBrand === 'Toutes' || item.brand === selectedBrand;
      const matchAvail =
        selectedAvailability === 'Toutes' || item.availability === selectedAvailability;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.specs.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchBrand && matchAvail && matchSearch;
    });
  }, [liveItems, selectedCategory, selectedBrand, selectedAvailability, searchQuery]);

  const filteredSlides = useMemo(() => {
    if (!searchQuery.trim()) return allSlides;
    const q = searchQuery.toLowerCase().trim();
    return allSlides.filter(
      (s) => s.title.toLowerCase().includes(q) || `page ${s.pageNum}`.includes(q)
    );
  }, [allSlides, searchQuery]);

  const visiblePhotos = useMemo(
    () => filteredPhotos.slice(0, displayCount),
    [filteredPhotos, displayCount]
  );

  const getDays = (id: string) => Math.max(1, daysByItem[id] || 1);

  const handleAddToLogistikCart = (item: LiveLogistikEquipment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const days = getDays(item.id);
    store.addToCart(
      {
        id: item.id,
        ref: item.code,
        name: item.title,
        category: item.category,
        subCategory: 'Location Engins & Matériels',
        brand: item.brand,
        dimensions: item.specs.slice(0, 60) || 'Standard',
        material: 'Parc SB-S Logistik',
        finish: item.availability,
        color: 'Jaune / Industriel',
        usage: item.usage,
        unit: 'jour',
        packaging: 'Location par jour',
        origin: 'Sénégal / Parc Dakar',
        indicativePriceFCFA: item.dailyRateFCFA || 0,
        isPriceVisible: item.isPriceVisible,
        availability:
          item.availability === 'Disponible'
            ? 'En stock'
            : item.availability === 'Hors service'
              ? 'Rupture'
              : 'Sur commande',
        leadTime: item.availability === 'Disponible' ? 'Mobilisation < 24h' : 'Sur planification',
        images: [item.imageUrl],
        specs: { Marque: item.brand, Code: item.code, Disponibilité: item.availability },
      },
      1,
      'sbs-logistik',
      days
    );
    setLogistikCartCount(store.getCartCount('sbs-logistik'));
    window.dispatchEvent(new Event('storage'));
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1600);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!activePhoto) return;
    const idx = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    if (idx === -1) return;
    const nextIdx =
      direction === 'next'
        ? (idx + 1) % filteredPhotos.length
        : (idx - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIdx]);
    setShowOriginalSlideInModal(false);
  };

  return (
    <div className="space-y-6">
      {/* BANDEAU GESTIONNAIRE & PANIER LOGISTIK STRICTEMENT ISOLÉ */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-900 to-amber-950 text-white rounded-l p-4 sm:p-5 border border-amber-500/30 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-amber-300">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 font-bold">
              PARC EN DIRECT · {stats.total} ÉQUIPEMENTS
            </span>
            <span className="text-emerald-300">{stats.disponible} Disponibles</span>
            <span>·</span>
            <span className="text-amber-200">{stats.enLocation} En location</span>
          </div>
          <p className="text-xs text-neutral-300">
            Disponibilités, marques et tarifs synchronisés depuis l&apos;espace d&apos;exploitation
            SB-S Logistik. Votre panier Logistik est totalement indépendant de P2M et SB-S Industrie.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-amber-200 pt-1 font-medium">
            <span>Commandes &amp; réservations matériels : <strong>Rokhaya KANE</strong></span>
            <span>·</span>
            <a
              href="https://wa.me/221778586105?text=Bonjour%20Rokhaya%20KANE%2C%20je%20souhaite%20commander%20%2F%20r%C3%A9server%20du%20mat%C3%A9riel%20chez%20SBS%20Logistik."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-bold underline"
              title="Discuter directement sur WhatsApp avec Rokhaya KANE"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp : +221 77 858 61 05
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="https://wa.me/221778586105?text=Bonjour%20Rokhaya%20KANE%2C%20je%20souhaite%20commander%20%2F%20r%C3%A9server%20du%20mat%C3%A9riel%20chez%20SBS%20Logistik."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-m bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
            title="Commander directement via WhatsApp avec Rokhaya KANE"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Rokhaya KANE</span>
          </a>

          <Link
            href="/panier?entite=sbs-logistik"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Panier SB-S Logistik</span>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-mono">
              {logistikCartCount}
            </span>
          </Link>

          <Link
            href="/entites/sbs-logistik/admin"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Espace Gestionnaire Logistik</span>
          </Link>
        </div>
      </div>

      {/* BARRE DE CONTRÔLE : RECHERCHE, MARQUE, DISPONIBILITÉ & VUE */}
      <div className="bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l p-4 sm:p-5 shadow-elev-1 space-y-4">
        <div className="flex flex-col xl:flex-row gap-3 justify-between items-stretch xl:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher engin, marque (HOWO, Samsung, Aquarius...), code ou specs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(24);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setDisplayCount(24);
              }}
              aria-label="Filtrer par marque"
              className="px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <option value="Toutes">Toutes marques ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => {
                setSelectedAvailability(e.target.value);
                setDisplayCount(24);
              }}
              aria-label="Filtrer par disponibilité"
              className="px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <option value="Toutes">Toutes disponibilités</option>
              <option value="Disponible">Disponible</option>
              <option value="En location">En location</option>
              <option value="Réservé">Réservé</option>
              <option value="En maintenance">En maintenance</option>
            </select>

            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-brand-900 p-1 rounded-m border border-neutral-200 dark:border-brand-700">
              <button
                type="button"
                onClick={() => setViewMode('photos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  viewMode === 'photos'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-brand-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Engins ({liveItems.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('slides')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  viewMode === 'slides'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-brand-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Planches PDF ({SBS_LOGISTIK_SLIDES_COUNT})</span>
              </button>
            </div>
          </div>
        </div>

        {/* FILTRES PAR CATÉGORIE */}
        {viewMode === 'photos' && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-brand-700/60">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Toutes');
                setDisplayCount(24);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === 'Toutes'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                  : 'bg-neutral-50 dark:bg-brand-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-brand-700 hover:border-amber-500'
              }`}
            >
              Tout voir ({liveItems.length})
            </button>
            {categories.map((cat) => {
              const count = liveItems.filter((p) => p.category === cat).length;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDisplayCount(24);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm font-semibold'
                      : 'bg-neutral-50 dark:bg-brand-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-brand-700 hover:border-amber-500'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VUE 1 : ENGINS ET ÉQUIPEMENTS CONNECTÉS + PANIER LOGISTIK */}
      {viewMode === 'photos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <span>
              Affichage de {visiblePhotos.length} sur {filteredPhotos.length} équipements
            </span>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l p-12 text-center">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Aucun équipement ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visiblePhotos.map((item) => {
                const isPortraitOrSquare =
                  item.orientation === 'portrait' ||
                  item.orientation === 'square' ||
                  (item.height || 900) > (item.width || 1200) * 0.85;
                const days = getDays(item.id);
                const isAdded = addedItemId === item.id;
                const updatedLabel = item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString('fr-FR')
                  : 'Parc certifié';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActivePhoto(item);
                      setShowOriginalSlideInModal(false);
                    }}
                    className="group bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-3 hover:border-amber-500 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-brand-900 overflow-hidden flex items-center justify-center">
                      {isPortraitOrSquare && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-30 dark:opacity-25 pointer-events-none"
                        />
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className={`relative z-10 w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                          isPortraitOrSquare ? 'object-contain p-1.5 drop-shadow-sm' : 'object-cover'
                        }`}
                      />
                      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-600 text-white shadow">
                          {item.code}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 z-20">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shadow ${availabilityStyle(
                            item.availability
                          )}`}
                        >
                          {item.availability}
                        </span>
                      </div>
                      <div className="absolute inset-0 z-20 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1.5 rounded-m bg-white text-neutral-900 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                          Fiche technique
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-1">
                          <span className="text-amber-700 dark:text-amber-400 font-semibold truncate">
                            {item.category}
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-200 font-semibold shrink-0">
                            <Tag className="w-2.5 h-2.5 text-amber-600" />
                            {item.brand}
                          </span>
                        </div>

                        <h4 className="font-title font-bold text-sm text-neutral-900 dark:text-white line-clamp-2 group-hover:text-amber-600 transition-colors">
                          {item.title}
                        </h4>

                        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-2.5 pt-2.5 border-t border-neutral-100 dark:border-brand-700/60">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-neutral-900 dark:text-white">
                            {item.isPriceVisible && item.dailyRateFCFA > 0
                              ? `${item.dailyRateFCFA.toLocaleString('fr-FR')} F / jour`
                              : 'Tarif sur devis'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            MAJ {updatedLabel}
                          </span>
                        </div>

                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center border border-neutral-200 dark:border-brand-700 rounded bg-neutral-50 dark:bg-brand-900 px-1 py-1">
                            <input
                              type="number"
                              min={1}
                              max={365}
                              value={days}
                              onChange={(e) =>
                                setDaysByItem((prev) => ({
                                  ...prev,
                                  [item.id]: Math.max(1, parseInt(e.target.value, 10) || 1),
                                }))
                              }
                              aria-label="Durée en jours"
                              className="w-8 text-center bg-transparent text-[11px] font-mono font-bold text-neutral-900 dark:text-white focus:outline-none"
                            />
                            <span className="text-[10px] text-neutral-500 pr-1">j</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleAddToLogistikCart(item, e)}
                            className={`flex-1 py-1.5 px-2 rounded text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-brand-900 hover:bg-amber-600 dark:bg-brand-700 dark:hover:bg-amber-600 text-white'
                            }`}
                            title="Ajouter au panier de devis Logistik"
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Ajouté</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Panier</span>
                              </>
                            )}
                          </button>

                          <a
                            href={`https://wa.me/221778586105?text=${encodeURIComponent(
                              `Bonjour Rokhaya KANE, je souhaite commander / louer chez SBS Logistik :\n- Matériel : ${item.title}\n- Marque/Réf : ${item.brand} (${item.code || item.id})\n- Catégorie : ${item.category}\n- Durée : ${days} jour(s)\n- Tarif indicatif : ${item.isPriceVisible && item.dailyRateFCFA > 0 ? (item.dailyRateFCFA * days).toLocaleString('fr-FR') + ' F CFA' : 'Sur devis'}\n\nPouvez-vous me confirmer la disponibilité sur chantier ?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2.5 rounded text-xs font-bold flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
                            title="Commander directement via WhatsApp avec Rokhaya KANE (+221 77 858 61 05)"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {displayCount < filteredPhotos.length && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 24)}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-brand-700 dark:hover:bg-brand-600 text-white rounded-m text-xs font-semibold transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>Afficher plus d&apos;équipements</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* VUE 2 : PLANCHES TECHNIQUES OFFICIELLES */}
      {viewMode === 'slides' && (
        <div className="space-y-6">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            37 planches techniques officielles du document maître &apos;PRESENTATION MATERIEL.pdf&apos;
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSlides.map((slide) => (
              <div
                key={slide.pageNum}
                onClick={() => {
                  const found = liveItems.find((p) => p.pageNumber === slide.pageNum);
                  setActivePhoto(
                    found || {
                      id: `slide-${slide.pageNum}`,
                      pageNumber: slide.pageNum,
                      title: slide.title,
                      category: 'Transport & bennes',
                      brand: 'SBS Sélection Pro',
                      code: `P.${slide.pageNum}`,
                      specs: 'Document officiel SB-S Logistik',
                      usage: 'Exploitation et logistique chantier',
                      description: 'Planche technique complète certifiée.',
                      imageUrl: slide.slideSrc,
                      dailyRateFCFA: 0,
                      isPriceVisible: false,
                      availability: 'Disponible',
                      width: 2526,
                      height: 1786,
                    }
                  );
                  setShowOriginalSlideInModal(true);
                }}
                className="group bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-3 hover:border-amber-500 transition-all cursor-pointer"
              >
                <div className="relative aspect-[16/10] bg-neutral-100 dark:bg-brand-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.slideSrc}
                    alt={slide.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-900/90 text-white">
                    Planche {String(slide.pageNum).padStart(2, '0')} / 37
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-m bg-white text-neutral-900 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      Agrandir en 4K
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-title font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                    {slide.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL LIGHTBOX */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative bg-white dark:bg-brand-900 rounded-l max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-brand-700 flex items-center justify-between shrink-0 bg-neutral-50 dark:bg-brand-800 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-600 text-white shrink-0">
                  {activePhoto.code}
                </span>
                <div className="min-w-0">
                  <h3 className="font-title font-bold text-base sm:text-lg text-neutral-900 dark:text-white truncate">
                    {activePhoto.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    <span>{activePhoto.category}</span>
                    <span>·</span>
                    <span className="font-bold text-amber-600">{activePhoto.brand}</span>
                    <span>·</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${availabilityStyle(
                        activePhoto.availability
                      )}`}
                    >
                      {activePhoto.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/221778586105?text=${encodeURIComponent(
                    `Bonjour Rokhaya KANE, je souhaite commander / louer ce matériel chez SBS Logistik :\n- Matériel : ${activePhoto.title}\n- Code/Réf : ${activePhoto.code}\n- Marque : ${activePhoto.brand}\n- Catégorie : ${activePhoto.category}\n- Planche : ${activePhoto.pageNumber}\n- Spécifications : ${activePhoto.specs}\n\nPouvez-vous me confirmer les disponibilités et modalités de commande ?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  title="Commander directement via WhatsApp avec Rokhaya KANE"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Commander via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleAddToLogistikCart(activePhoto)}
                  className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter au panier Logistik</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOriginalSlideInModal((p) => !p)}
                  className="px-3 py-1.5 rounded text-xs font-semibold border bg-white dark:bg-brand-700 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-brand-600"
                >
                  {showOriginalSlideInModal ? 'Photo engin' : 'Planche PDF'}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-brand-700 text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-neutral-950 flex items-center justify-center overflow-hidden min-h-[340px] sm:min-h-[440px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  showOriginalSlideInModal
                    ? getSlideSrc(activePhoto.pageNumber)
                    : activePhoto.imageUrl
                }
                alt={activePhoto.title}
                className="max-h-[62vh] w-auto max-w-full object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('prev');
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('next');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 border-t border-neutral-200 dark:border-brand-700 bg-white dark:bg-brand-850 shrink-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="text-neutral-600 dark:text-neutral-300">
                  <strong>Spécifications :</strong> {activePhoto.specs}
                </div>
                <div className="text-amber-600 font-bold">
                  {activePhoto.isPriceVisible && activePhoto.dailyRateFCFA > 0
                    ? `${activePhoto.dailyRateFCFA.toLocaleString('fr-FR')} FCFA / jour`
                    : 'Tarif sur demande'}
                </div>
              </div>
              <div className="text-xs font-mono text-amber-700 dark:text-amber-400">
                <strong>Application chantier :</strong> {activePhoto.usage}
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {activePhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SbsLogistikGallery;
