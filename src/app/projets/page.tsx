'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  Filter,
  ChevronRight,
  Map as MapIcon,
  List,
  Search,
  CheckCircle2,
  Award,
  Layers,
  Clock,
  Briefcase,
  Camera,
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [lightbox, setLightbox] = useState<{
    project: (typeof PROJECTS)[number];
    index: number;
  } | null>(null);

  useEffect(() => {
    const ent = searchParams?.get('entite');
    if (ent) {
      setSelectedEntity(ent);
    }
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PROJECTS.filter((p) => {
      if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
      if (
        selectedEntity !== 'all' &&
        p.primaryEntityId !== selectedEntity &&
        !p.partnerEntityIds.includes(selectedEntity as EntityId)
      ) {
        return false;
      }
      if (selectedSector !== 'all' && p.sector !== selectedSector) return false;
      if (q) {
        const hay = `${p.title} ${p.client} ${p.location} ${p.summary} ${p.sector}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedRegion, selectedEntity, selectedSector, searchQuery]);

  const regions = useMemo(
    () => ['all', ...Array.from(new Set(PROJECTS.map((p) => p.region)))],
    []
  );
  const sectors = useMemo(
    () => ['all', ...Array.from(new Set(PROJECTS.map((p) => p.sector)))],
    []
  );

  const regionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of PROJECTS) {
      map[p.region] = (map[p.region] || 0) + 1;
    }
    return map;
  }, []);

  const uniqueClientsCount = useMemo(
    () => new Set(PROJECTS.map((p) => p.client)).size,
    []
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb items={[{ label: 'Projets & réalisations' }]} />

      {/* HERO ÉDITORIAL PROJETS */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_IMAGES.gruesRealisation}
          alt="Réalisations majeures Magatte NIANG Expert"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-950/75 pointer-events-none" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-500/35 text-xs font-mono font-bold tracking-wider text-accent-400">
                <Award className="w-3.5 h-3.5" />
                Études de cas &amp; preuves de compétence
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight">
                Réalisations majeures au <span className="text-accent-400">Sénégal</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                Ouvrages industriels, charpentes métalliques, génie civil, campagnes géotechniques
                et finitions haut de gamme : chaque étude de cas documente nos contraintes terrain,
                solutions techniques et résultats vérifiés.
              </p>
            </div>

            {/* VIEW SWITCHER */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-m p-1 self-start lg:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-accent-500 text-white shadow-sm'
                    : 'text-neutral-200 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Grille ({filteredProjects.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition-colors ${
                  viewMode === 'map'
                    ? 'bg-accent-500 text-white shadow-sm'
                    : 'text-neutral-200 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Carte territoriale</span>
              </button>
            </div>
          </div>

          {/* 4 KPIs RÉALISATIONS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-title font-bold text-accent-400 tabular-nums">
                {PROJECTS.length}
              </div>
              <div className="text-[11px] font-mono text-neutral-300 mt-1">
                Études de cas documentées
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-title font-bold text-white tabular-nums">
                {uniqueClientsCount}
              </div>
              <div className="text-[11px] font-mono text-neutral-300 mt-1">
                Maîtres d&apos;ouvrage &amp; partenaires
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-title font-bold text-sky-400 tabular-nums">
                {ENTITIES.length}
              </div>
              <div className="text-[11px] font-mono text-neutral-300 mt-1">
                Entités opérationnelles
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-title font-bold text-emerald-400 tabular-nums">
                100 %
              </div>
              <div className="text-[11px] font-mono text-neutral-300 mt-1">
                Ouvrages réceptionnés &amp; conformes
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* FILTERS & SEARCH BAR */}
        <div className="bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l p-4 shadow-sm space-y-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 font-bold tracking-wider">
              <Filter className="w-4 h-4 text-accent-500" />
              <span>Filtres :</span>
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un ouvrage, un client (CES, OIM, SICAP, Ageroute…) ou une ville…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs text-neutral-900 dark:text-white"
            >
              <option value="all">Toutes les régions ({PROJECTS.length})</option>
              {regions
                .filter((r) => r !== 'all')
                .map((r) => (
                  <option key={r} value={r}>
                    {r === 'Autre' ? 'Kédougou & Régions' : `Région de ${r}`} ({regionCounts[r] || 0})
                  </option>
                ))}
            </select>

            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs text-neutral-900 dark:text-white"
            >
              <option value="all">Toutes les entités</option>
              {ENTITIES.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs text-neutral-900 dark:text-white"
            >
              <option value="all">Tous les secteurs</option>
              {sectors
                .filter((s) => s !== 'all')
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>

            {(selectedRegion !== 'all' ||
              selectedEntity !== 'all' ||
              selectedSector !== 'all' ||
              searchQuery.trim() !== '') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRegion('all');
                  setSelectedEntity('all');
                  setSelectedSector('all');
                  setSearchQuery('');
                }}
                className="text-accent-600 dark:text-accent-400 hover:underline font-bold ml-auto"
              >
                Réinitialiser ({filteredProjects.length} résultat{filteredProjects.length > 1 ? 's' : ''})
              </button>
            )}
          </div>
        </div>

        {/* INTERACTIVE SENEGAL MAP VIEW */}
        {viewMode === 'map' && (
          <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-brand-800 text-xs">
              <span className="font-mono font-bold text-neutral-600 dark:text-neutral-300">
                Carte territoriale des réalisations (Sénégal &amp; Afrique de l&apos;Ouest)
              </span>
              <span className="text-neutral-500">
                {filteredProjects.length} étude(s) affichée(s) · Cliquez sur un pôle pour filtrer
              </span>
            </div>

            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-brand-900 rounded-m overflow-hidden p-6 flex flex-col justify-between text-white border border-brand-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_IMAGES.gruesRealisation}
                alt="Grues de réalisation SB-S Group"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-900/75 via-transparent to-brand-900/85" />

              <div className="relative z-10 space-y-1.5">
                <span className="text-xs font-mono text-accent-400 font-bold">
                  Déploiement national &amp; sous-régional
                </span>
                <p className="text-sm font-semibold max-w-md">
                  Sélectionnez un pôle territorial pour filtrer instantanément les études de cas.
                </p>
              </div>

              <div className="relative w-full h-48 sm:h-60 my-auto flex items-center justify-center">
                {[
                  {
                    regionKey: 'Dakar',
                    label: 'Dakar & Diamniadio',
                    left: '14%',
                    top: '44%',
                  },
                  {
                    regionKey: 'Thiès',
                    label: 'Thiès · Saly · Somone',
                    left: '30%',
                    top: '46%',
                  },
                  {
                    regionKey: 'Fatick',
                    label: 'Fatick · Foundiougne',
                    left: '40%',
                    top: '64%',
                  },
                  {
                    regionKey: 'Autre',
                    label: 'Kédougou (Mako) & Régions',
                    left: '68%',
                    top: '58%',
                  },
                ].map((spot) => {
                  const count = regionCounts[spot.regionKey] || 0;
                  const active = selectedRegion === spot.regionKey;
                  return (
                    <button
                      key={spot.regionKey}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(active ? 'all' : spot.regionKey);
                        setViewMode('grid');
                      }}
                      style={{ left: spot.left, top: spot.top }}
                      className="absolute text-center group cursor-pointer focus:outline-none"
                    >
                      <div
                        className={`w-7 h-7 rounded-full border-2 border-white shadow-lg relative z-10 flex items-center justify-center text-xs font-bold mx-auto transition-transform group-hover:scale-110 ${
                          active ? 'bg-emerald-500' : 'bg-accent-500'
                        }`}
                      >
                        {count}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-white block mt-1.5 bg-brand-950/90 px-2 py-0.5 rounded border border-white/15 whitespace-nowrap">
                        {spot.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 text-[11px] font-mono text-neutral-300 flex flex-wrap items-center justify-between gap-2">
                <span>Projection géodésique WGS84 · chantiers certifiés</span>
                <span>Cliquez sur un pôle pour ouvrir la liste correspondante</span>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS GRID */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-title font-bold text-neutral-900 dark:text-white">
              Aucune réalisation ne correspond à ces critères
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Modifiez ou réinitialisez les filtres pour afficher l&apos;ensemble des projets.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedRegion('all');
                setSelectedEntity('all');
                setSelectedSector('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-m bg-accent-500 text-white text-xs font-bold"
            >
              Afficher tous les projets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const primaryEntity = ENTITIES.find((e) => e.id === proj.primaryEntityId);
              const td = proj.technicalData;
              const metricsList: { label: string; value: string }[] = [];
              if (td.steelTonnage && td.steelTonnage !== 'N/A') {
                metricsList.push({ label: 'Acier', value: td.steelTonnage });
              }
              if (td.concreteVolume && td.concreteVolume !== 'N/A') {
                metricsList.push({ label: 'Béton', value: td.concreteVolume });
              }
              if (td.span && td.span !== 'N/A') {
                metricsList.push({ label: 'Portée', value: td.span });
              }
              if (td.surface && td.surface !== 'N/A') {
                metricsList.push({ label: 'Volume / Surf.', value: td.surface });
              }
              if (td.soilTestsCount) {
                metricsList.push({ label: 'Essais', value: `${td.soilTestsCount} pts` });
              }
              if (td.depthMax) {
                metricsList.push({ label: 'Profondeur', value: td.depthMax });
              }
              if (td.capacity) {
                metricsList.push({ label: 'Capacité', value: td.capacity });
              }
              if (td.durationMonths) {
                metricsList.push({ label: 'Durée', value: `${td.durationMonths} mois` });
              }

              return (
                <article
                  key={proj.id}
                  className="bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-2 hover:border-accent-500/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* 16:10 PROJECT IMAGE */}
                    <div
                      className="relative h-52 sm:h-56 w-full shrink-0 overflow-hidden bg-neutral-200 dark:bg-brand-950 cursor-zoom-in"
                      onClick={() => setLightbox({ project: proj, index: 0 })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proj.images[0]?.url || SITE_IMAGES.heroChantier}
                        alt={proj.images[0]?.caption || proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5 bg-brand-950/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-white flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: primaryEntity?.colorHex || '#F26A1B' }}
                        />
                        <span className="font-bold">{primaryEntity?.name || proj.primaryEntityId}</span>
                        <span className="text-neutral-300">· {proj.year}</span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {proj.status}
                      </div>
                      {proj.images.length > 1 && (
                        <div className="absolute bottom-2.5 right-2.5 bg-brand-950/85 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-accent-300 flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          {proj.images.length} photos
                        </div>
                      )}
                      <span className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform bg-brand-950/85 text-white text-[11px] font-mono py-1.5 text-center pointer-events-none">
                        Cliquer pour ouvrir la galerie HD
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-accent-500 shrink-0" />
                          {proj.location}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                          {proj.sector}
                        </span>
                      </div>

                      <h3 className="font-title font-bold text-base text-neutral-900 dark:text-white line-clamp-2 group-hover:text-accent-500 transition-colors leading-snug">
                        {proj.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                        <span className="truncate">
                          Client : <strong className="text-neutral-900 dark:text-white">{proj.client}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                        {proj.summary}
                      </p>

                      {metricsList.length > 0 && (
                        <div className="p-2.5 bg-neutral-100 dark:bg-brand-900/70 rounded border border-neutral-200 dark:border-brand-700 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
                          {metricsList.slice(0, 4).map((m) => (
                            <div key={m.label} className="truncate">
                              <span className="text-neutral-500 dark:text-neutral-400">{m.label} :</span>{' '}
                              <strong>{m.value}</strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-1 flex items-center justify-between gap-2">
                    <Link
                      href={`/projets/${proj.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-neutral-100 dark:bg-brand-800 hover:bg-accent-500 hover:text-white rounded-m text-xs font-bold transition-colors text-brand-700 dark:text-brand-200"
                    >
                      <span>Voir l&apos;étude de cas complète</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

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
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProjectsListContent />
    </Suspense>
  );
}
