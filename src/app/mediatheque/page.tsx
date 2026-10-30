'use client';

import React from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PUBLICATIONS } from '@/data/initialData';
import { SITE_IMAGES } from '@/data/siteImages';
import {
  Newspaper, Image, FileText, Download, Mail, Phone, Calendar,
  Building2, Camera, Megaphone, ArrowRight, BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function MediathequePage() {
  const pressItems = PUBLICATIONS.filter(p => p.type === 'Presse');

  const medias = [
    { src: SITE_IMAGES.magatteNiang, label: 'Portrait officiel de Magatte Niang', tag: 'Portrait' },
    { src: SITE_IMAGES.sbsGroup, label: 'SB-S Group — logo & chantiers', tag: 'Entité' },
    { src: SITE_IMAGES.sermaBtp, label: 'SERMA BTP — ingénierie & construction', tag: 'Entité' },
    { src: SITE_IMAGES.sbsLabo, label: 'SB-S Labo — laboratoire géotechnique', tag: 'Entité' },
    { src: SITE_IMAGES.sbsIndustries, label: 'SB-S Industries — préfabrication béton', tag: 'Entité' },
    { src: SITE_IMAGES.sbsLogistik, label: 'SB-S Logistik — location & matériaux', tag: 'Entité' },
    { src: SITE_IMAGES.p2m, label: 'P2M — showroom carrelages & sanitaires', tag: 'Entité' },
    { src: SITE_IMAGES.pgt, label: 'PGT — transit & logistique maritime', tag: 'Entité' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Médiathèque & presse', href: '/mediatheque' }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold tracking-wider text-accent-400 mb-5">
            <Megaphone className="w-3.5 h-3.5" />
            Espace médias
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mb-4">
            Médiathèque <span className="text-accent-400">& presse</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            Communiqués de presse, dossiers officiels, photothèque et éléments de marque de
            l'écosystème Magatte Niang — mis à disposition des journalistes, partenaires et clients.
          </p>
        </div>
      </section>

      {/* COMMUNIQUÉS DE PRESSE */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-neutral-200 dark:border-brand-700">
        <div className="flex items-center gap-3 mb-8">
          <Newspaper className="w-6 h-6 text-accent-500" />
          <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
            Communiqués & articles de presse
          </h2>
        </div>

        {pressItems.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-10 text-center">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-title font-bold text-neutral-900 dark:text-white mb-2">
              Aucun communiqué publié pour le moment
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm max-w-xl mx-auto mb-6">
              Nos communiqués de presse et dossiers médias seront publiés ici prochainement.
              Pour toute demande média, contactez notre service communication.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-m transition-colors"
            >
              <span>Contacter le service presse</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pressItems.map(p => (
              <article key={p.id} className="bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                    <Newspaper className="w-3.5 h-3.5" />
                    {p.type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(p.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                  {p.abstract}
                </p>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {p.journalOrEvent} · {p.authors.join(', ')}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>


      {/* PHOTOTHÈQUE OFFICIELLE */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-neutral-200 dark:border-brand-700">
        <div className="flex items-center gap-3 mb-8">
          <Image className="w-6 h-6 text-accent-500" />
          <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
            Photothèque & identités visuelles
          </h2>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 max-w-2xl">
          Visuels officiels des entités du groupe, à réutiliser librement pour toute couverture
          presse, présentation partenaire ou dossier institutionnel (crédit photo apprécié).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {medias.map((m, idx) => (
            <figure key={idx} className="group relative overflow-hidden rounded-l border border-neutral-200 dark:border-brand-700 bg-neutral-100 dark:bg-brand-800">
              <div className="aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt={m.label}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] leading-tight text-white">
                <span className="font-semibold block">{m.tag}</span>
                {m.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

