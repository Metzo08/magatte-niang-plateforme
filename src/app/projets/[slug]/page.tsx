'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Calendar,
  Layers,
  ArrowLeft,
  FileText,
  Printer,
  Share2,
  CheckCircle2,
  Quote as QuoteIcon,
  ShieldCheck,
  ChevronRight,
  Images,
  Camera,
  Maximize2
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import PhotoLightbox from '@/components/common/PhotoLightbox';
import { PROJECTS, ENTITIES } from '@/data/initialData';

export default function ProjectCaseStudyPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project = PROJECTS.find(p => p.slug === slug);
  if (!project) {
    notFound();
  }

  const primaryEntity = ENTITIES.find(e => e.id === project.primaryEntityId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb
        items={[
          { label: 'Projets & réalisations', href: '/projets' },
          { label: project.title }
        ]}
      />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* TOP BAR ACTIONS */}
        <div className="flex items-center justify-between">
          <Link
            href="/projets"
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-brand-700 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux réalisations</span>
          </Link>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-brand-700 shadow-sm print:hidden"
            title="Exporter ou imprimer la fiche projet pour dossier d'appel d'offres"
          >
            <Printer className="w-3.5 h-3.5 text-accent-500" />
            <span>Imprimer / export PDF (EF-22)</span>
          </button>
        </div>

        {/* HERO TITLE BLOCK */}
        <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 sm:p-10 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span
              className="px-2.5 py-1 rounded text-white font-bold"
              style={{ backgroundColor: primaryEntity?.colorHex || '#1B4965' }}
            >
              {primaryEntity?.name}
            </span>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 rounded">
              {project.location} ({project.region})
            </span>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 rounded">
              Année : {project.year}
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold rounded">
              Statut : {project.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-title font-bold text-neutral-900 dark:text-white">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-4xl">
            {project.summary}
          </p>

          <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            Maître d'ouvrage / client : <strong>{project.client}</strong>
          </div>
        </div>

        {/* 16:9 HERO IMAGE */}
        <div
          className="group relative aspect-[16/9] rounded-l overflow-hidden border border-neutral-300 dark:border-brand-700 shadow-elev-2 bg-neutral-200 cursor-zoom-in"
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={project.images[0].url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-brand-900/90 backdrop-blur-md px-3 py-1.5 rounded text-xs text-white">
            {project.images[0].caption}
          </div>
          <span className="absolute top-3 right-3 bg-brand-900/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Cliquer pour agrandir
          </span>
        </div>

        {/* TECHNICAL DATA PANEL (JETBRAINS MONO TABULAR NUMS § 27.3 & § 12.1) */}
        <div className="bg-neutral-100 dark:bg-brand-800/80 border border-neutral-300 dark:border-brand-700 rounded-l p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-brand-700">
            <h3 className="text-sm font-mono font-bold  text-accent-500 tracking-wider">
              Données techniques vérifiées de chantier (§ 12.1)
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Conforme aux as-built
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-mono tabular-nums">
            {project.technicalData.steelTonnage && (
              <div className="p-3 bg-white dark:bg-brand-900 rounded border border-neutral-200 dark:border-brand-700">
                <span className="text-neutral-500 block">Tonnage acier :</span>
                <strong className="text-base text-neutral-900 dark:text-white font-bold">{project.technicalData.steelTonnage}</strong>
              </div>
            )}
            {project.technicalData.concreteVolume && (
              <div className="p-3 bg-white dark:bg-brand-900 rounded border border-neutral-200 dark:border-brand-700">
                <span className="text-neutral-500 block">Volume béton :</span>
                <strong className="text-base text-neutral-900 dark:text-white font-bold">{project.technicalData.concreteVolume}</strong>
              </div>
            )}
            {project.technicalData.surface && (
              <div className="p-3 bg-white dark:bg-brand-900 rounded border border-neutral-200 dark:border-brand-700">
                <span className="text-neutral-500 block">Surface développée :</span>
                <strong className="text-base text-neutral-900 dark:text-white font-bold">{project.technicalData.surface}</strong>
              </div>
            )}
            {project.technicalData.span && (
              <div className="p-3 bg-white dark:bg-brand-900 rounded border border-neutral-200 dark:border-brand-700">
                <span className="text-neutral-500 block">Portée libre :</span>
                <strong className="text-base text-neutral-900 dark:text-white font-bold">{project.technicalData.span}</strong>
              </div>
            )}
            {project.technicalData.durationMonths && (
              <div className="p-3 bg-white dark:bg-brand-900 rounded border border-neutral-200 dark:border-brand-700">
                <span className="text-neutral-500 block">Durée d'Exécution :</span>
                <strong className="text-base text-neutral-900 dark:text-white font-bold">{project.technicalData.durationMonths} mois</strong>
              </div>
            )}
          </div>
        </div>

        {/* CASE STUDY STORY (CONTRAINTES / SOLUTION / RÉSULTATS § 12.1) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 space-y-2">
            <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/80 text-red-600 font-bold text-xs flex items-center justify-center font-mono">
              01
            </div>
            <h4 className="font-title font-bold text-base text-neutral-900 dark:text-white">
              Contraintes du projet
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {project.story.constraints}
            </p>
          </div>

          <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 space-y-2">
            <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-600 font-bold text-xs flex items-center justify-center font-mono">
              02
            </div>
            <h4 className="font-title font-bold text-base text-neutral-900 dark:text-white">
              Solution technique déployée
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {project.story.solution}
            </p>
          </div>

          <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-6 space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 font-bold text-xs flex items-center justify-center font-mono">
              03
            </div>
            <h4 className="font-title font-bold text-base text-neutral-900 dark:text-white">
              Résultats obtenus
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {project.story.results}
            </p>
          </div>
        </div>

        {/* GALERIE PHOTOS DU PROJET — toutes les images du dossier officiel */}
        {project.images && project.images.length > 1 && (
          <section className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 dark:border-brand-700">
              <Images className="w-5 h-5 text-accent-500" />
              <h3 className="text-base font-title font-bold text-neutral-900 dark:text-white">
                Galerie photos du chantier ({project.images.length} photos)
              </h3>
              <Camera className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
              {project.images.map((img, idx) => (
                <figure
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative overflow-hidden rounded-l border border-neutral-200 dark:border-brand-700 bg-neutral-100 dark:bg-brand-800 cursor-zoom-in hover:border-accent-500 transition-colors"
                >
                  <div className="aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.caption}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-accent-500/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                      Visuel principal
                    </span>
                  )}
                  <span className="absolute top-2 right-2 w-6 h-6 bg-brand-900/75 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-brand-900/85 backdrop-blur-md px-2 py-1.5 text-[10px] leading-tight text-white line-clamp-2">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIAL IF AVAILABLE */}
        {project.testimonial && (
          <div className="bg-brand-900 text-white rounded-l p-8 border border-brand-800 space-y-3">
            <QuoteIcon className="w-8 h-8 text-accent-500 opacity-80" />
            <p className="text-sm sm:text-base italic leading-relaxed text-neutral-200">
              « {project.testimonial.quote} »
            </p>
            <div className="pt-2 text-xs font-mono">
              <strong className="text-white block">{project.testimonial.author}</strong>
              <span className="text-neutral-400">{project.testimonial.role} · {project.testimonial.company}</span>
            </div>
          </div>
        )}

        {/* CALL TO ACTION */}
        <div className="bg-white dark:bg-brand-850 border border-neutral-300 dark:border-brand-700 rounded-l p-8 text-center space-y-4">
          <h3 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
            Vous avez un projet similaire à réaliser ?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
            Mobilisez directement nos ingénieurs et nos unités industrielles pour une étude préliminaire et un chiffrage rapide.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href={`/assistant?besoin=${project.primaryEntityId}`}
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-sm text-sm"
            >
              Consulter nos équipes pour ce type d'ouvrage
            </Link>
          </div>
        </div>

      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          images={project.images}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          title={project.title}
        />
      )}
    </div>
  );
}
