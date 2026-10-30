'use client';

import React from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PUBLICATIONS } from '@/data/initialData';
import { SITE_IMAGES, PHOTOS_REELLES } from '@/data/siteImages';
import { BookOpen, Presentation, Lightbulb, GraduationCap, Newspaper, FileText, Tag } from 'lucide-react';

const TYPE_STYLES: Record<string, { icon: React.ReactNode; badge: string }> = {
  'Article scientifique': { icon: <FileText className="w-5 h-5 text-accent-500" />, badge: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-400' },
  'Conférence': { icon: <Presentation className="w-5 h-5 text-blue-500" />, badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  'Brevet / Innovation': { icon: <Lightbulb className="w-5 h-5 text-gold-500" />, badge: 'bg-gold-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' },
  'Cours / Enseignement': { icon: <GraduationCap className="w-5 h-5 text-emerald-500" />, badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  'Presse': { icon: <Newspaper className="w-5 h-5 text-purple-500" />, badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
};

export default function PublicationsPage() {
  const [filter, setFilter] = React.useState<string>('Tous');

  const types = ['Tous', ...Array.from(new Set(PUBLICATIONS.map(p => p.type)))];
  const filtered = filter === 'Tous' ? PUBLICATIONS : PUBLICATIONS.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Publications & recherche', href: '/publications' }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold  tracking-wider text-accent-400 mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Recherche & transmission
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mb-4">
            Publications <span className="text-accent-400">& travaux scientifiques</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            Articles scientifiques, conférences et supports pédagogiques de Magatte Niang —
            recherche appliquée sur les matériaux de construction, les sols latéritiques et
            les structures métalliques en contexte ouest-africain.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTOS_REELLES.laboEssais}
          alt="Magatte Niang — doctorant chercheur en matériaux de construction"
          className="hidden lg:block absolute right-8 top-8 w-64 h-40 object-cover rounded-l border border-brand-700 shadow-elev-3 opacity-90"
          loading="lazy"
        />
      </section>

      {/* LISTE */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-m text-xs font-semibold border transition-colors ${
                filter === t
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'bg-white dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-brand-700 hover:border-accent-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-5 max-w-4xl">
          {filtered.map(pub => {
            const style = TYPE_STYLES[pub.type] ?? TYPE_STYLES['Article scientifique'];
            return (
              <article
                key={pub.id}
                className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-6 hover:shadow-elev-2 transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-neutral-100 dark:bg-brand-900 rounded-m flex items-center justify-center shrink-0">
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${style.badge}`}>
                        {pub.type}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">{pub.date}</span>
                      {pub.validatedForAI && (
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">✓ validé IA</span>
                      )}
                    </div>
                    <h2 className="font-title font-bold text-neutral-900 dark:text-white text-base sm:text-lg mb-1.5 leading-snug">
                      {pub.title}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      {pub.authors.join(', ')} — <em>{pub.journalOrEvent}</em>
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                      {pub.abstract}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-3.5 h-3.5 text-neutral-400" />
                      {pub.keywords.map(k => (
                        <span key={k} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-brand-900 text-neutral-600 dark:text-neutral-400">
                          {k}
                        </span>
                      ))}
                    </div>
                    {pub.doi && (
                      <p className="mt-3 text-xs font-mono text-accent-600 dark:text-accent-400">
                        DOI : {pub.doi}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}