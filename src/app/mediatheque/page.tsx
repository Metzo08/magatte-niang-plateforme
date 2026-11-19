'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import PhotoLightbox from '@/components/common/PhotoLightbox';
import { PUBLICATIONS, ENTITIES } from '@/data/initialData';
import { SITE_IMAGES, MAGATTE_NIANG_GALLERY } from '@/data/siteImages';
import SbsPresentationGallery from '@/components/sbs/SbsPresentationGallery';
import {
  Newspaper,
  Image as ImageIcon,
  FileText,
  Download,
  Mail,
  Phone,
  Calendar,
  Camera,
  Megaphone,
  ArrowRight,
  Film,
  Layers,
  Building2,
} from 'lucide-react';

interface PressArticle {
  id: string;
  title: string;
  type?: string;
  date: string;
  abstract: string;
  journalOrEvent: string;
  authors: string[];
  entityId?: string;
  imageUrl?: string;
  downloadUrl?: string;
}

export default function MediathequePage() {
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'Portrait' | 'Entité'>('all');
  const [pressItems, setPressItems] = useState<PressArticle[]>(
    PUBLICATIONS.filter((p) => p.type === 'Presse')
  );

  useEffect(() => {
    fetch('/api/press-articles', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.articles)) {
          setPressItems(data.articles);
        }
      })
      .catch(() => {
        // fallback to static initialData
      });
  }, []);

  const medias = [
    ...MAGATTE_NIANG_GALLERY.slice(0, 4).map((p) => ({
      src: p.src,
      label: p.caption,
      tag: 'Portrait' as const,
    })),
    { src: SITE_IMAGES.sbsGroup, label: 'SB-S Group · Stein Bauer Sénégal Group (« Nous partageons vos projets »)', tag: 'Entité' as const },
    { src: SITE_IMAGES.sermaBtp, label: 'SERMA BTP · ingénierie & modélisation 3D/BIM', tag: 'Entité' as const },
    { src: SITE_IMAGES.sbsLabo, label: 'SB-S Labo · laboratoire géotechnique C2 & A3', tag: 'Entité' as const },
    { src: SITE_IMAGES.sbsIndustries, label: 'SB-S Industries · préfabrication béton & BPE', tag: 'Entité' as const },
    { src: SITE_IMAGES.sbsLogistik, label: 'SB-S Logistik · parc engins lourds & transport', tag: 'Entité' as const },
    { src: SITE_IMAGES.p2m, label: 'P2M · showroom carrelages & sanitaires', tag: 'Entité' as const },
    { src: SITE_IMAGES.pgt, label: 'PGT · sourcing international & transit maritime', tag: 'Entité' as const },
  ];

  const filteredMedias = mediaFilter === 'all' ? medias : medias.filter((m) => m.tag === mediaFilter);

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Médiathèque & presse', href: '/mediatheque' }]} />

      {/* HERO ÉDITORIAL & KIT PRESSE */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold tracking-wider text-accent-400">
                <Megaphone className="w-3.5 h-3.5" />
                Espace médias · Salle de presse officielle
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight">
                Médiathèque <span className="text-accent-400">&amp; presse</span>
              </h1>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                Communiqués officiels, dossiers de presse, kit média haute définition et photothèque
                des chantiers de l&apos;écosystème Magatte NIANG — à destination des journalistes,
                maîtres d&apos;ouvrage et partenaires institutionnels.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/film-institutionnel"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold rounded-m transition-colors"
                >
                  <Film className="w-4 h-4" /> Voir le film institutionnel 2026
                </Link>
                <a
                  href="https://pub-1a6892c245c94310aea44ae98f35c31b.r2.dev/videos/magatte-niang-promo-2026.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-bold rounded-m transition-colors"
                >
                  <Download className="w-4 h-4" /> Télécharger le film presse (MP4)
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 border border-white/15 rounded-l p-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-accent-400 font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Repères Presse · 2026
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-brand-950/60 border border-white/10 rounded-m p-3">
                  <div className="text-2xl font-title font-extrabold text-white">{ENTITIES.length}</div>
                  <div className="text-[11px] text-neutral-300">Entités intégrées</div>
                </div>
                <div className="bg-brand-950/60 border border-white/10 rounded-m p-3">
                  <div className="text-2xl font-title font-extrabold text-accent-400">{pressItems.length}</div>
                  <div className="text-[11px] text-neutral-300">Communiqués publiés</div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs text-neutral-300 space-y-1.5">
                <p className="font-semibold text-white">Contact Presse &amp; Communication</p>
                <a href="mailto:infos@sbsgroup.sn" className="flex items-center gap-1.5 hover:text-accent-300">
                  <Mail className="w-3.5 h-3.5 text-accent-400 shrink-0" /> infos@sbsgroup.sn
                </a>
                <a href="tel:+221338710861" className="flex items-start gap-1.5 hover:text-accent-300">
                  <Phone className="w-3.5 h-3.5 text-accent-400 shrink-0 mt-0.5" />
                  <span>+221 33 871 08 61 / +221 76 600 96 32 / +221 76 600 96 35</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNIQUÉS DE PRESSE (SYNCHRONISÉS EN DIRECT) */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-neutral-200 dark:border-brand-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-accent-500" />
            <div>
              <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
                Communiqués &amp; articles de presse
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Actualités officielles publiées par les directions des 7 entités de l&apos;écosystème.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 dark:text-accent-400 hover:underline"
          >
            Demande d&apos;interview ou dossier média <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* DOSSIER SPÉCIAL · PUBLICATION SCIENTIFIQUE DE MAGATTE NIANG (EPT THIÈS) */}
        <div className="mb-8 rounded-2xl border border-accent-500/35 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 text-white p-6 sm:p-8 shadow-elev-2">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
              <FileText className="w-3.5 h-3.5" />
              À la une · Publication Scientifique &amp; Dossier Presse
            </span>
            <span className="text-xs font-mono text-neutral-400">
              École Polytechnique de Thiès (EPT) · 142 pages
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-xl sm:text-2xl font-title font-bold leading-snug">
                Dimensionnement structural des constructions en terre dans l&apos;habitat (Blocs de Terre Comprimée · BTC)
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                Par <strong>Magatte NIANG</strong> &amp; Abdou Karim FALL · Dir. Pr. Ibrahima Khalil CISSÉ &amp; Dr. Galaye NIANG (EPT Thiès)
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Cette étude d&apos;ingénierie de 142 pages formalise le calcul structural des murs porteurs et poteaux en BTC (norme AFNOR XP 13-901, méthodes CRATerre &amp; charge critique d&apos;Euler) à partir des carrières latéritiques sénégalaises de <strong>Sindia</strong> et <strong>Ngalane</strong>. Testée sur le bâtiment témoin de l&apos;EPT, la solution BTC réduit les coûts de construction d&apos;environ <strong>32 %</strong> tout en offrant un confort thermique et acoustique supérieur au béton armé.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/docs/PFE-Magatte-Niang-Constructions-Terre-EPT.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Lire / Télécharger l&apos;étude complète (PDF · 142 p.)
                </a>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-m bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-colors"
                >
                  Profil &amp; Recherche Magatte NIANG <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xl font-title font-bold text-emerald-400">~32 %</div>
                <div className="text-[11px] text-neutral-200 font-semibold">Économie vs BA</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">784 415 F vs 1 292 655 F</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xl font-title font-bold text-accent-400">0,34</div>
                <div className="text-[11px] text-neutral-200 font-semibold">Rcd (m².K/W)</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">vs 0,25 en béton armé</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xl font-title font-bold text-amber-400">12 h</div>
                <div className="text-[11px] text-neutral-200 font-semibold">Déphasage</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Flux 1 511 W vs 2 050 W</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xl font-title font-bold text-sky-400">56 dB</div>
                <div className="text-[11px] text-neutral-200 font-semibold">Acoustique</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Norme AFNOR XP 13-901</div>
              </div>
            </div>
          </div>
        </div>

        {pressItems.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-10 text-center">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-title font-bold text-neutral-900 dark:text-white mb-2">
              Aucun communiqué publié pour le moment
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm max-w-xl mx-auto">
              Nos communiqués de presse et dossiers médias seront publiés ici prochainement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pressItems.map((p) => (
              <article
                key={p.id}
                className="bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-sm flex flex-col"
              >
                {p.imageUrl && (
                  <div className="aspect-[16/8] bg-neutral-100 dark:bg-brand-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                        <Newspaper className="w-3.5 h-3.5" />
                        Presse
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(p.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                      {p.abstract}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-100 dark:border-brand-800">
                    <span>{p.journalOrEvent} · {(p.authors || []).join(', ')}</span>
                    {p.downloadUrl && (
                      <a
                        href={p.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent-600 dark:text-accent-400 font-bold hover:underline shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF complet
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PHOTOTHÈQUE OFFICIELLE FILTRABLE */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-neutral-200 dark:border-brand-700">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-accent-500" />
            <div>
              <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
                Photothèque &amp; visuels officiels
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Cliquez sur une image pour l&apos;afficher en plein écran haute résolution.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(['all', 'Portrait', 'Entité'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setMediaFilter(f)}
                className={`px-3 py-1.5 rounded-m text-xs font-bold transition-colors ${
                  mediaFilter === f
                    ? 'bg-accent-500 text-white'
                    : 'bg-neutral-100 dark:bg-brand-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {f === 'all' ? 'Tous les visuels' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredMedias.map((m, i) => (
            <button
              key={m.src}
              type="button"
              onClick={() => setPhotoIdx(i)}
              className="group text-left bg-white dark:bg-brand-850 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden hover:border-accent-500 transition-all shadow-xs"
            >
              <div className="aspect-[4/3] bg-neutral-100 dark:bg-brand-950 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt={m.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-brand-950/80 text-white text-[10px] font-mono font-bold">
                  {m.tag}
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2">
                  {m.label}
                </span>
                <ImageIcon className="w-4 h-4 text-neutral-400 shrink-0 group-hover:text-accent-500" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* PHOTOTHÈQUE CHANTIERS SB-S GROUP */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-6 h-6 text-accent-500" />
          <div>
            <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
              Reportages chantiers &amp; réalisations terrain
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Clichés réels des ouvrages de génie civil, bâtiments, charpentes et travaux industriels.
            </p>
          </div>
        </div>
        <SbsPresentationGallery />
      </section>

      {photoIdx !== null && (
        <PhotoLightbox
          images={filteredMedias.map((m) => ({ url: m.src, caption: m.label }))}
          index={photoIdx}
          onIndexChange={setPhotoIdx}
          title="Médiathèque · Groupe Magatte NIANG"
          onClose={() => setPhotoIdx(null)}
        />
      )}
    </div>
  );
}
