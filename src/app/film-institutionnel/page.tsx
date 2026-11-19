'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { EcosystemPromoVideoPlayer, PROMO_SCENES } from '@/components/video/EcosystemPromoVideoPlayer';
import { getMediaUrl } from '@/lib/mediaUrl';
import { Film, Download, ArrowRight, Phone, CheckCircle2, Sparkles } from 'lucide-react';

export default function FilmInstitutionnelPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb
        items={[
          { label: 'Médiathèque', href: '/mediatheque' },
          { label: 'Film Institutionnel & Promotionnel 2026', href: '/film-institutionnel' },
        ]}
      />

      {/* HERO + VIDEO SHOWCASE */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800 py-12 sm:py-16">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-accent-400 mb-4">
                <Film className="w-3.5 h-3.5" />
                Film Promotionnel Officiel 2026 · Voix Off Studio Française
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight">
                L&apos;Écosystème <span className="text-gradient-gold">Magatte NIANG Expert</span> en Vidéo
              </h1>
              <p className="text-neutral-300 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
                Découvrez en moins de 2 minutes comment nos <strong>7 entités complémentaires</strong> (SB-S Labo, SERMA BTP, SB-S Group, SB-S Industries, SB-S Logistik, P2M et PGT) maîtrisent l&apos;intégralité de la chaîne de valeur BTP au Sénégal et à l&apos;international.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={'/media/videos/magatte-niang-ecosysteme-2026.mp4'}
                download="Magatte-Niang-Expert-Ecosysteme-2026.mp4"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold transition-all shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger la vidéo MP4 (Full HD)</span>
              </a>
              <a
                href={'/media/audio/promo-2026/magatte-niang-promo-voix-off.mp3'}
                download="Magatte-Niang-Expert-Voix-Off-2026.mp3"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-mono font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span>Audio Voix Off (MP3)</span>
              </a>
            </div>
          </div>

          <EcosystemPromoVideoPlayer />
        </div>
      </section>

      {/* TRANSCRIPTION COMPLÈTE & ACCÈS DIRECT AUX 7 ENTITÉS */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-8">
          <span className="text-xs font-mono font-bold text-accent-500 uppercase tracking-wider">
            Découpage par séquence & contacts directs
          </span>
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-1">
            Les 8 séquences du film et leurs référents techniques
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROMO_SCENES.map((sc) => (
            <div
              key={sc.id}
              className="flex flex-col justify-between bg-white dark:bg-brand-800/60 border border-neutral-200 dark:border-brand-700 rounded-xl p-6 shadow-sm hover:border-accent-500 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="px-2.5 py-1 rounded text-[11px] font-mono font-bold text-white"
                    style={{ backgroundColor: sc.colorHex }}
                  >
                    {sc.step}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Voix Off
                  </span>
                </div>

                <h3 className="text-lg font-title font-bold text-neutral-900 dark:text-white mb-1">
                  {sc.entityName}
                </h3>
                <p className="text-xs font-semibold text-accent-600 dark:text-accent-400 mb-3">
                  {sc.highlight}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed bg-neutral-50 dark:bg-brand-900/70 p-3 rounded-lg border border-neutral-200/70 dark:border-brand-700 mb-4">
                  {sc.narration}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-brand-700 flex items-center justify-between gap-2">
                <Link
                  href={sc.ctaHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 dark:text-accent-400 hover:underline"
                >
                  <span>{sc.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={sc.contactHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Phone className="w-3 h-3" /> Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
