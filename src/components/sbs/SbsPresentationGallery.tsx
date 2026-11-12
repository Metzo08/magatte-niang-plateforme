'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SBS_PHOTOS, SbsPhotoItem } from '@/data/sbsPhotosData';
import { SBS_SLIDES, SbsSlide } from '@/data/sbsSlidesData';
import SbsLogisticsMap from '@/components/sbs/SbsLogisticsMap';
import {
  Search,
  Eye,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Building,
  Truck,
  Wrench,
  Sparkles,
  MapPin,
  Map,
  Navigation,
  Calendar,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function SbsPresentationGallery() {
  const [viewMode, setViewMode] = useState<'photos' | 'slides' | 'map'>('photos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<SbsPhotoItem | null>(null);
  const [activeSlide, setActiveSlide] = useState<SbsSlide | null>(null);
  const [showOriginalSlideInModal, setShowOriginalSlideInModal] = useState<boolean>(false);
  const [displayCount, setDisplayCount] = useState<number>(24);

  const categories = [
    'Toutes',
    'Industries, mines & portuaire',
    'Bâtiments R+7 & résidentiel',
    'Équipements & matériel lourd',
    'Infrastructures & équipements publics',
    'Organisation & identité'
  ];

  // Reset display count when filter changes
  useEffect(() => {
    setDisplayCount(24);
  }, [selectedCategory, searchQuery, viewMode]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return SBS_PHOTOS.filter((item) => {
      const matchesCat = selectedCategory === 'Toutes' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.projectTitle.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        `planche ${item.pageNumber}`.includes(q) ||
        `p.${item.pageNumber}`.includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Filtered slides
  const filteredSlides = useMemo(() => {
    return SBS_SLIDES.filter((slide) => {
      const matchesCat = selectedCategory === 'Toutes' || slide.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch =
        slide.title.toLowerCase().includes(q) ||
        slide.client.toLowerCase().includes(q) ||
        slide.summary.toLowerCase().includes(q) ||
        `planche ${slide.slideNumber}`.includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Keyboard navigation for photo lightbox
  useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhoto(null);
      } else if (e.key === 'ArrowRight') {
        const curIdx = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
        if (curIdx !== -1) {
          const nextIdx = (curIdx + 1) % filteredPhotos.length;
          setActivePhoto(filteredPhotos[nextIdx]);
          setShowOriginalSlideInModal(false);
        }
      } else if (e.key === 'ArrowLeft') {
        const curIdx = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
        if (curIdx !== -1) {
          const prevIdx = (curIdx - 1 + filteredPhotos.length) % filteredPhotos.length;
          setActivePhoto(filteredPhotos[prevIdx]);
          setShowOriginalSlideInModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, filteredPhotos]);

  return (
    <div className="w-full">
      {/* BANNER STATS & VALUE PROP */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-850 to-brand-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl border border-brand-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/20 border border-accent-400/40 rounded-full text-xs font-mono font-bold text-accent-300">
              <Sparkles className="w-3.5 h-3.5" />
              Photothèque haute résolution • Extraction certifiée
            </div>
            <h3 className="text-2xl sm:text-3xl font-title font-bold text-white tracking-tight">
              Réalisations & flotte STEIN BAUER SÉNÉGAL GROUP
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Chaque photographie de chantier et d&apos;engin lourd a été <strong className="text-white">extraite individuellement en haute définition</strong> du document maître officiel, avec sa fiche technique complète, ses métriques et son contexte d&apos;intervention.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 text-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4">
              <span className="block text-2xl sm:text-3xl font-mono font-bold text-accent-400">{SBS_PHOTOS.length}</span>
              <span className="text-[11px] text-neutral-300 font-medium">Clichés HD réels</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4">
              <span className="block text-2xl sm:text-3xl font-mono font-bold text-accent-400">64</span>
              <span className="text-[11px] text-neutral-300 font-medium">Planches / lots</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4">
              <span className="block text-2xl sm:text-3xl font-mono font-bold text-emerald-400">100%</span>
              <span className="text-[11px] text-neutral-300 font-medium">Authentique (0 logo)</span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Inside Banner */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center bg-black/40 p-1 rounded-xl border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setViewMode('photos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'photos'
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Clichés HD individuels ({SBS_PHOTOS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Map className="w-4 h-4 text-accent-300" />
              <span>Carte interactive : base logistique & corridors (Diamniadio)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('slides')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'slides'
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Planches officielles ({SBS_SLIDES.length})</span>
            </button>
          </div>

          <div className="text-xs text-neutral-300 hidden xl:block">
            {viewMode === 'photos' && '📸 Chaque cliché est valorisé avec sa fiche technique et ses métriques.'}
            {viewMode === 'map' && '🗺️ Carte vectorielle interactive : Base centrale et 7 corridors d\'intervention rapide.'}
            {viewMode === 'slides' && '📑 Vue documentaire : Planches complètes au format original du PDF.'}
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH CONTROLS (Hidden in Map mode) */}
      {viewMode !== 'map' && (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                viewMode === 'photos'
                  ? cat === 'Toutes'
                    ? SBS_PHOTOS.length
                    : SBS_PHOTOS.filter((p) => p.category === cat).length
                  : cat === 'Toutes'
                  ? SBS_SLIDES.length
                  : SBS_SLIDES.filter((s) => s.category === cat).length;

              if (cat !== 'Toutes' && count === 0) return null;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-accent-500 text-white shadow-sm ring-2 ring-accent-400/50'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-brand-800 dark:hover:bg-brand-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-accent-700 text-white'
                        : 'bg-neutral-200 dark:bg-brand-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Search */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder={
                viewMode === 'photos'
                  ? 'Rechercher photo par client, mot-clé, ville...'
                  : 'Rechercher planche par client, mot-clé...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-neutral-900 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* RESULTS COUNT & HELPER (Hidden in Map mode) */}
      {viewMode !== 'map' && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Affichage de{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">
              {viewMode === 'photos'
                ? Math.min(displayCount, filteredPhotos.length)
                : Math.min(displayCount, filteredSlides.length)}
            </strong>{' '}
            sur {viewMode === 'photos' ? filteredPhotos.length : filteredSlides.length}{' '}
            {viewMode === 'photos' ? 'clichés' : 'planches'}
          </span>
          <span className="text-[11px] text-accent-500 font-medium flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Cliquez sur une photo pour l&apos;ouvrir en grand format HD avec sa description complète
          </span>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE 1: CLICHÉS INDIVIDUELS DE CHANTIER (VALORISÉS PHOTO PAR PHOTO) */}
      {/* ================================================================= */}
      {viewMode === 'photos' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredPhotos.slice(0, displayCount).map((photo) => {
              const [wStr, hStr] = (photo.dimensions || '1400x1000').split('x');
              const wNum = parseInt(wStr, 10) || 1400;
              const hNum = parseInt(hStr, 10) || 1000;
              const isPortrait = hNum > wNum * 1.05;

              return (
              <article
                key={photo.id}
                onClick={() => {
                  setActivePhoto(photo);
                  setShowOriginalSlideInModal(false);
                }}
                className="group cursor-pointer bg-white dark:bg-brand-850 rounded-xl border border-neutral-200 dark:border-brand-700 hover:border-accent-500 dark:hover:border-accent-400 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* PHOTO CONTAINER (CLEAN, BORDERLESS PHOTO) */}
                <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden flex items-center justify-center">
                  {isPortrait && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photo.imageUrl}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-35 pointer-events-none"
                    />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    loading="lazy"
                    className={`relative z-10 w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out ${
                      isPortrait ? 'object-contain p-1' : 'object-cover'
                    }`}
                  />

                  {/* Gradient Overlay & Hover Button */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <span className="px-3.5 py-2 bg-accent-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Agrandir le cliché HD
                    </span>
                  </div>

                  {/* Page / Source Badge */}
                  <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-brand-950/85 backdrop-blur-md text-white text-[10px] font-mono font-bold rounded-md border border-white/10 shadow">
                    Planche #{photo.pageNumber}
                  </span>

                  {/* Category Pill */}
                  <span className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 bg-accent-500/90 backdrop-blur-md text-white text-[9px] font-semibold uppercase tracking-wider rounded-md shadow">
                    {photo.category.split(' ')[0]}
                  </span>
                </div>

                {/* CONTENT & DESCRIPTIONS */}
                <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                  <div className="space-y-2">
                    {/* Specific Photo Title */}
                    <h4 className="text-sm font-title font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-accent-500 transition-colors line-clamp-2">
                      {photo.title}
                    </h4>

                    {/* Client & Location */}
                    <div className="space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building className="w-3.5 h-3.5 shrink-0 text-accent-500" />
                        <span className="truncate font-semibold text-neutral-700 dark:text-neutral-300">
                          {photo.client}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                    </div>

                    {/* Extracted Description */}
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2 pt-1 border-t border-neutral-100 dark:border-brand-800">
                      {photo.description}
                    </p>

                    {/* Logistics Map direct access button */}
                    {photo.isLogisticsMapTarget && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewMode('map');
                        }}
                        className="w-full mt-2 py-1.5 px-3 bg-accent-500/15 hover:bg-accent-500 text-accent-700 dark:text-accent-300 hover:text-white border border-accent-500/30 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Ouvrir la carte interactive du corridor</span>
                      </button>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-brand-800 text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between font-mono">
                    <span>{photo.dimensions}</span>
                    <span className="text-accent-600 dark:text-accent-400 font-semibold">{photo.year}</span>
                  </div>
                </div>
              </article>
              );
            })}
          </div>

          {/* LOAD MORE BUTTON */}
          {displayCount < filteredPhotos.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 24)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-800 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg border border-brand-700"
              >
                <span>Afficher 24 clichés supplémentaires ({filteredPhotos.length - displayCount} restants)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* ================================================================= */}
      {/* MODE 2: CARTE INTERACTIVE CORRIDOR & BASE LOGISTIQUE */}
      {/* ================================================================= */}
      {viewMode === 'map' && (
        <div className="space-y-6">
          <SbsLogisticsMap />
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE 3: PLANCHES OFFICIELLES GLOBALES (VUE DOCUMENTAIRE PDF) */}
      {/* ================================================================= */}
      {viewMode === 'slides' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredSlides.map((slide) => (
            <div
              key={slide.slideNumber}
              onClick={() => setActiveSlide(slide)}
              className="group cursor-pointer bg-white dark:bg-brand-850 rounded-xl border border-neutral-200 dark:border-brand-700 hover:border-accent-500 dark:hover:border-accent-400 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="relative aspect-[16/11] bg-neutral-100 dark:bg-brand-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-accent-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5" />
                    Consulter la planche
                  </span>
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-900/85 backdrop-blur-sm text-white text-[10px] font-mono font-bold rounded">
                  Planche #{slide.slideNumber}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent-500/90 text-white text-[9px] font-semibold uppercase tracking-wider rounded">
                  {slide.category.split(' ')[0]}
                </span>
              </div>

              <div className="p-3.5 flex flex-col flex-grow justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-title font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-accent-500 transition-colors">
                    {slide.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                    <Building className="w-3 h-3 shrink-0 text-accent-500" />
                    <span className="truncate">{slide.client}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-100 dark:border-brand-800 text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
                  <span>Document Maître</span>
                  <span className="font-mono text-accent-600 dark:text-accent-400">P.{slide.slideNumber}/64</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================================================================= */}
      {/* LIGHTBOX MODAL: PHOTO INDIVIDUELLE HD AVEC DESCRIPTIF COMPLET */}
      {/* ================================================================= */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-brand-900 rounded-2xl overflow-hidden shadow-2xl border border-brand-700 text-white flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-brand-950 border-b border-brand-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-accent-500 text-white text-xs font-mono font-bold rounded">
                  Planche #{activePhoto.pageNumber}
                </span>
                <div className="truncate">
                  <h3 className="text-sm sm:text-base font-title font-bold text-white truncate">
                    {activePhoto.projectTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 truncate">
                    <span className="text-neutral-200 font-semibold">{activePhoto.client}</span>
                    <span>•</span>
                    <span>{activePhoto.location}</span>
                    <span>•</span>
                    <span className="text-accent-400">{activePhoto.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Toggle to see original board */}
                <button
                  type="button"
                  onClick={() => setShowOriginalSlideInModal(!showOriginalSlideInModal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    showOriginalSlideInModal
                      ? 'bg-accent-500 text-white'
                      : 'bg-brand-800 hover:bg-brand-700 text-neutral-200'
                  }`}
                  title="Basculer entre la photo isolée et la planche globale"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {showOriginalSlideInModal ? 'Voir photo seule' : 'Voir planche originale'}
                  </span>
                </button>

                {activePhoto.isLogisticsMapTarget && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePhoto(null);
                      setViewMode('map');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white transition-colors shadow-sm"
                    title="Voir l'implantation sur la carte interactive"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Carte Interactive</span>
                  </button>
                )}

                <a
                  href={showOriginalSlideInModal ? activePhoto.slideUrl : activePhoto.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-2 hover:bg-brand-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
                  title="Télécharger l'image HD"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  className="p-2 hover:bg-brand-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
                  title="Fermer (Échap)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="relative flex-grow bg-black/50 flex items-center justify-center overflow-auto p-3 sm:p-5 min-h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={showOriginalSlideInModal ? activePhoto.slideUrl : activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-brand-800"
              />

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={() => {
                  const curIdx = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
                  if (curIdx !== -1) {
                    const prevIdx = (curIdx - 1 + filteredPhotos.length) % filteredPhotos.length;
                    setActivePhoto(filteredPhotos[prevIdx]);
                    setShowOriginalSlideInModal(false);
                  }
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-brand-950/85 hover:bg-accent-500 text-white rounded-full transition-all shadow-xl"
                title="Cliché précédent (Flèche gauche)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const curIdx = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
                  if (curIdx !== -1) {
                    const nextIdx = (curIdx + 1) % filteredPhotos.length;
                    setActivePhoto(filteredPhotos[nextIdx]);
                    setShowOriginalSlideInModal(false);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-brand-950/85 hover:bg-accent-500 text-white rounded-full transition-all shadow-xl"
                title="Cliché suivant (Flèche droite)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 bg-brand-950 border-t border-brand-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 max-w-3xl">
                <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed">
                  {activePhoto.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                  <span>Client : <strong className="text-white">{activePhoto.client}</strong></span>
                  <span>•</span>
                  <span>Lieu : <strong className="text-white">{activePhoto.location}</strong></span>
                  <span>•</span>
                  <span>Année : <strong className="text-white">{activePhoto.year}</strong></span>
                  <span>•</span>
                  <span>Résolution native : <strong className="font-mono text-accent-400">{activePhoto.dimensions}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-[11px] text-neutral-400 font-mono">
                <span>Flèches ← / → pour naviguer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR SLIDES VIEW */}
      {activeSlide && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setActiveSlide(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-brand-900 rounded-2xl overflow-hidden shadow-2xl border border-brand-700 text-white flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-brand-950 border-b border-brand-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-accent-500 text-white text-xs font-mono font-bold rounded">
                  Planche #{activeSlide.slideNumber} / 64
                </span>
                <div className="truncate">
                  <h3 className="text-sm sm:text-base font-title font-bold text-white truncate">
                    {activeSlide.title}
                  </h3>
                  <span className="text-xs text-neutral-400">
                    Client : <strong className="text-neutral-200">{activeSlide.client}</strong> • {activeSlide.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeSlide.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-2 hover:bg-brand-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveSlide(null)}
                  className="p-2 hover:bg-brand-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-grow bg-black/40 flex items-center justify-center overflow-auto p-2 sm:p-4 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeSlide.imageUrl}
                alt={activeSlide.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg border border-brand-800"
              />
            </div>

            <div className="p-4 bg-brand-950 border-t border-brand-800 text-xs text-neutral-300">
              {activeSlide.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
