'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  Calendar,
  Layers,
  Filter,
  ArrowRight,
  ChevronRight,
  Map as MapIcon,
  List,
  CheckCircle2
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PROJECTS, ENTITIES } from '@/data/initialData';
import { SITE_IMAGES } from '@/data/siteImages';
import { EntityId } from '@/types';
import PhotoLightbox from '@/components/common/PhotoLightbox';

function ProjectsListContent() {
  const searchParams = useSearchParams();
  const initialEntity = searchParams?.get('entite') || 'all';

  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>(initialEntity);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Visionneuse photos plein écran (lightbox) depuis les cartes projets
  const [lightbox, setLightbox] = useState<{ project: (typeof PROJECTS)[number]; index: number } | null>(null);

  useEffect(() => {
    const ent = searchParams?.get('entite');
    if (ent) {
      setSelectedEntity(ent);
    }
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
      if (selectedEntity !== 'all' && p.primaryEntityId !== selectedEntity && !p.partnerEntityIds.includes(selectedEntity as EntityId)) return false;
      if (selectedSector !== 'all' && p.sector !== selectedSector) return false;
      return true;
    });
  }, [selectedRegion, selectedEntity, selectedSector]);

  const regions = ['all', 'Dakar', 'Thiès', 'Fatick', 'Saint-Louis', 'Kaolack'];
  const sectors = ['all', 'Bâtiment', 'Industrie', 'Infrastructures', 'Ouvrage d\'art', 'Géotechnique', 'Logistique'];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb items={[{ label: 'Projets & réalisations' }]} />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono  font-bold text-accent-500 tracking-wider">
              Études de cas & preuves de compétence (§ 12)
            </span>
            <h1 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-white">
              Réalisations majeures au Sénégal
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              Chaque projet documente nos contraintes réelles, solutions techniques et métriques de chantier vérifiées.
            </p>
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex items-center bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-m p-1 self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Grille</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                viewMode === 'map'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Carte interactive (EF-21)</span>
            </button>
          </div>
        </div>

        {/* FILTERS BAR (§ 12.2 & EF-19) */}
        <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-4 shadow-sm flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-neutral-500 font-bold  tracking-wider">
            <Filter className="w-4 h-4 text-accent-500" />
            <span>Filtres :</span>
          </div>

          {/* REGION FILTER */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs text-neutral-900 dark:text-white"
            >
              <option value="all">Toutes les régions</option>
              {regions.filter(r => r !== 'all').map(r => (
                <option key={r} value={r}>Région de {r}</option>
              ))}
            </select>
          </div>

          {/* ENTITY FILTER */}
          <div>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs text-neutral-900 dark:text-white"
            >
              <option value="all">Toutes les entités</option>
              {ENTITIES.map(ent => (
                <option key={ent.id} value={ent.id}>{ent.name}</option>
              ))}
            </select>
          </div>

          {/* SECTOR FILTER */}
          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs text-neutral-900 dark:text-white"
            >
              <option value="all">Tous les secteurs</option>
              {sectors.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {(selectedRegion !== 'all' || selectedEntity !== 'all' || selectedSector !== 'all') && (
            <button
              onClick={() => {
                setSelectedRegion('all');
                setSelectedEntity('all');
                setSelectedSector('all');
              }}
              className="text-accent-500 hover:underline font-semibold ml-auto"
            >
              Réinitialiser les filtres ({filteredProjects.length} résultats)
            </button>
          )}
        </div>

        {/* INTERACTIVE SENEGAL MAP VIEW (EF-21) */}
        {viewMode === 'map' && (
          <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-brand-800 text-xs">
              <span className="font-mono font-bold  text-neutral-500">
                Visualisation cartographique des réalisations (Sénégal & Afrique de l'Ouest)
              </span>
              <span className="text-neutral-500">{filteredProjects.length} points géolocalisés</span>
            </div>

            {/* MAP VISUALIZATION BOX */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-brand-900 rounded-m overflow-hidden p-6 flex flex-col justify-between text-white border border-brand-700">
              {/* Fond photographique officiel */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_IMAGES.gruesRealisation}
                alt="Grues de réalisation SB-S Group"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-transparent to-brand-900/80" />

              <div className="relative z-10 space-y-2">
                <span className="text-xs font-mono text-accent-400">Réseau Sénégal</span>
                <p className="text-sm font-semibold max-w-md">
                  Cliquez sur un pôle territorial pour afficher les projets et métriques techniques associés.
                </p>
              </div>

              {/* SENEGAL INTERACTIVE HOTSPOTS */}
              <div className="relative w-full h-48 sm:h-64 my-auto flex items-center justify-center">

                {/* DAKAR */}
                <div className="absolute left-[15%] top-[45%] text-center group cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-accent-500 animate-ping absolute -inset-0.5 opacity-75" />
                  <div className="w-5 h-5 rounded-full bg-accent-500 border-2 border-white shadow-md relative z-10 flex items-center justify-center text-[10px] font-bold">
                    2
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white block mt-1 bg-brand-900/80 px-1.5 rounded">
                    Dakar & Plateau
                  </span>
                </div>

                {/* THIES / DIAMNIADIO */}
                <div className="absolute left-[30%] top-[48%] text-center group cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-accent-500 border-2 border-white shadow-md relative z-10 flex items-center justify-center text-[10px] font-bold">
                    1
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white block mt-1 bg-brand-900/80 px-1.5 rounded">
                    Diamniadio / Thiès
                  </span>
                </div>

                {/* FATICK / SINE SALOUM */}
                <div className="absolute left-[38%] top-[65%] text-center group cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-accent-500 border-2 border-white shadow-md relative z-10 flex items-center justify-center text-[10px] font-bold">
                    1
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white block mt-1 bg-brand-900/80 px-1.5 rounded">
                    Fatick / Saloum
                  </span>
                </div>

                {/* SAINT-LOUIS */}
                <div className="absolute left-[32%] top-[15%] text-center opacity-60">
                  <div className="w-3 h-3 rounded-full bg-neutral-400 border border-white" />
                  <span className="text-[10px] font-mono text-neutral-400 block mt-1">Saint-Louis</span>
                </div>

              </div>

              <div className="relative z-10 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                <span>Système de projection géodésique WGS84 · précision chantier</span>
                <span>Repli accessible sous forme de liste ci-dessous</span>
              </div>

            </div>
          </div>
        )}

        {/* PROJECTS GRID (16:9 + METRICS MONO § 29.3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const primaryEntity = ENTITIES.find(e => e.id === proj.primaryEntityId);
            return (
              <div
                key={proj.id}
                className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-2 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* 16:9 RATIO PROJECT IMAGE */}
                  <div
                    className="relative aspect-[16/9] overflow-hidden bg-neutral-200 cursor-zoom-in"
                    onClick={() => setLightbox({ project: proj, index: 0 })}
                  >
                    <img
                      src={proj.images[0].url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-brand-900/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-white flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: primaryEntity?.colorHex || '#F26A1B' }}
                      />
                      <span>{primaryEntity?.name || proj.primaryEntityId}</span>
                      <span>· {proj.year}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                      {proj.status}
                    </div>
                    {proj.images.length > 1 && (
                      <div className="absolute top-9 right-2.5 bg-brand-900/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-accent-400">
                        {proj.images.length} photos
                      </div>
                    )}
                    <span className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform bg-brand-900/85 text-white text-[11px] font-mono py-1.5 text-center pointer-events-none">
                      Cliquer pour agrandir les photos
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                      {proj.location} ({proj.region}) · {proj.sector}
                    </span>
                    <h3 className="font-title font-bold text-base text-neutral-900 dark:text-white line-clamp-2 group-hover:text-accent-500 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 mt-2 leading-relaxed">
                      {proj.summary}
                    </p>

                    {/* METRICS IN JETBRAINS MONO TABULAR-NUMS (§ 27.3 & § 29.3) */}
                    <div className="mt-4 p-2.5 bg-neutral-100 dark:bg-brand-900/70 rounded border border-neutral-200 dark:border-brand-700 grid grid-cols-2 gap-2 text-xs font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
                      {proj.technicalData.steelTonnage && (
                        <div>Acier : <strong>{proj.technicalData.steelTonnage}</strong></div>
                      )}
                      {proj.technicalData.concreteVolume && (
                        <div>Béton : <strong>{proj.technicalData.concreteVolume}</strong></div>
                      )}
                      {proj.technicalData.span && (
                        <div>Portée : <strong>{proj.technicalData.span}</strong></div>
                      )}
                      {proj.technicalData.surface && (
                        <div>Surface : <strong>{proj.technicalData.surface}</strong></div>
                      )}
                      {proj.technicalData.soilTestsCount && (
                        <div>Essais : <strong>{proj.technicalData.soilTestsCount} pts</strong></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/projets/${proj.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-neutral-100 dark:bg-brand-800 hover:bg-brand-700 hover:text-white rounded-m text-xs font-bold transition-colors text-brand-700 dark:text-brand-300"
                  >
                    <span>Voir l'étude de cas technique</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {lightbox && (
          <PhotoLightbox
            images={lightbox.project.images}
            index={lightbox.index}
            onIndexChange={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
            onClose={() => setLightbox(null)}
            title={lightbox.project.title}
          />
        )}
      </div>
    </div>
  );
}

export default function ProjectsListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProjectsListContent />
    </Suspense>
  );
}
