'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';
import { useEntities } from '@/hooks/useEntities';
import { SITE_IMAGES, EXPERTISE_IMAGES } from '@/data/siteImages';

// Photos officielles des entités — magatteniang-expert.sn
const ENTITY_IMAGES: Record<string, string> = {
  'serma-btp': SITE_IMAGES.sermaBtp,
  'sbs-group': SITE_IMAGES.sbsGroup,
  'sbs-labo': SITE_IMAGES.sbsLabo,
  'sbs-industries': SITE_IMAGES.sbsIndustries,
  'sbs-logistik': SITE_IMAGES.sbsLogistik,
  'p2m': SITE_IMAGES.p2m,
  'pgt': SITE_IMAGES.pgt,
};
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';

export default function EntitiesPage() {
  const { entities, loading, error } = useEntities();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Chargement des entités..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage 
          message={`Erreur lors du chargement des entités: ${error}`}
          retry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Aucune entité trouvée"
          description="Les entités de l'écosystème seront bientôt disponibles"
          icon={<Building2 className="w-12 h-12 text-neutral-400" />}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      {/* Header */}
      <section className="bg-brand-900 text-white py-16 border-b border-brand-800 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EXPERTISE_IMAGES.charpenteMetal}
          alt="Charpente métallique de l'écosystème"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/90 to-brand-900/60" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="text-xs font-mono  font-bold text-accent-500 tracking-wider">
              Architecture industrielle intégrée
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-title font-bold text-white mt-2 tracking-tight">
              Les {entities.length} piliers de l'écosystème BTP
            </h1>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mt-4 max-w-2xl">
              Un dispositif industriel complet maîtrisant l'ensemble de la chaîne de valeur :
              études, essais, fabrication, logistique et fourniture de matériaux.
            </p>
          </div>
        </div>
      </section>

      {/* Matrice des synergies (visuel) */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 rounded-l p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent-500" />
            <div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm">
                Synergie inter-entités
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {entities.reduce((sum, e) => sum + (e.synergies?.length || 0), 0)} collaborations
                identifiées entre les entités
              </p>
            </div>
          </div>
          <Link
            href="#synergies"
            className="text-xs font-semibold text-accent-600 dark:text-accent-400 hover:underline"
          >
            Voir le graphe
          </Link>
        </div>
      </section>

      {/* Liste des entités */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <Link
              key={entity.id}
              href={`/entites/${entity.id}`}
              className="group bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 hover:border-brand-600 dark:hover:border-accent-500 rounded-l shadow-elev-1 hover:shadow-elev-3 transition-all flex flex-col overflow-hidden"
            >
              {/* Photo officielle de l'entité */}
              <div className="relative h-40 bg-neutral-200 dark:bg-brand-900 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ENTITY_IMAGES[entity.id] || SITE_IMAGES.architectureHero}
                  alt={entity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-2 left-3 text-[10px] font-mono font-bold  px-2 py-1 rounded bg-white/90 dark:bg-brand-950/90 text-neutral-800 dark:text-neutral-200 backdrop-blur-sm">
                  {entity.badge}
                </span>
              </div>
              <div className="p-6 flex-1">
                {/* Header avec couleur entité */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-m flex items-center justify-center text-white shadow-sm font-bold text-lg"
                    style={{ backgroundColor: entity.colorHex }}
                  >
                    {entity.name.slice(0, 2)}
                  </div>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entity.colorHex }}
                    title={`Code couleur ${entity.name}`}
                  />
                </div>

                {/* Nom et tagline */}
                <h2 className="font-title font-bold text-xl text-neutral-900 dark:text-white group-hover:text-accent-500 transition-colors">
                  {entity.name}
                </h2>
                <span className="text-xs font-mono font-semibold block text-neutral-500 dark:text-neutral-400 mt-1 mb-3">
                  {entity.tagline}
                </span>

                {/* Mission */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 line-clamp-3">
                  {entity.mission}
                </p>

                {/* Expertises (top 3) */}
                <div className="space-y-1.5 mb-4">
                  {entity.expertises?.slice(0, 3).map((exp: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                      <span className="truncate">{exp}</span>
                    </div>
                  ))}
                  {entity.expertises && entity.expertises.length > 3 && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-3.5">
                      + {entity.expertises.length - 3} autres expertises
                    </p>
                  )}
                </div>

                {/* Métriques vérifiées */}
                {entity.verifiedMetrics && entity.verifiedMetrics.length > 0 && (
                  <div className="pt-3 border-t border-neutral-200 dark:border-brand-700">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold">Indicateur clé</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-accent-500">
                      {entity.verifiedMetrics[0].value}
                      {entity.verifiedMetrics[0].unit && (
                        <span className="text-sm ml-1">{entity.verifiedMetrics[0].unit}</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {entity.verifiedMetrics[0].label}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer avec CTA */}
              <div className="p-4 bg-neutral-50 dark:bg-brand-900/50 border-t border-neutral-200 dark:border-brand-700 flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-400">
                  Fiche complète
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{
                      backgroundColor: `${entity.colorHex}15`,
                      color: entity.colorHex
                    }}
                  >
                    {entity.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-accent-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section synergies */}
      <section id="synergies" className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200 dark:border-brand-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white">
            Matrice des synergies inter-entités
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Flux de collaboration et d'optimisation entre les {entities.length} entités
          </p>
        </div>

        <div className="space-y-4">
          {entities
            .filter(e => e.synergies && e.synergies.length > 0)
            .map((entity) => (
              <div
                key={entity.id}
                className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: entity.colorHex }}
                  >
                    {entity.name.slice(0, 2)}
                  </div>
                  <h3 className="font-title font-bold text-neutral-900 dark:text-white">
                    {entity.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                  {entity.synergies.map((syn: any, idx: number) => {
                    const partnerEntity = entities.find(e => e.id === syn.entityId);
                    return (
                      <div
                        key={idx}
                        className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded p-3 text-xs"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <ArrowRight className="w-3 h-3 text-accent-500" />
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {partnerEntity?.name || syn.entityId}
                          </span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-1">
                          <strong>Rôle:</strong> {syn.role}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-400">
                          <strong>Bénéfice:</strong> {syn.benefit}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* CTA Assistant */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 rounded-l p-8 text-center border border-brand-700">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-white mb-3">
            Quelle entité correspond à votre projet ?
          </h2>
          <p className="text-neutral-300 text-sm max-w-2xl mx-auto mb-6">
            Notre assistant intelligent analyse votre besoin et vous oriente vers l'entité adaptée en 2 minutes.
          </p>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-elev-2 transition-all"
          >
            <span>Démarrer l'assistant de projet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}