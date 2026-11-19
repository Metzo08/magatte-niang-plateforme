'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import PhotoLightbox from '@/components/common/PhotoLightbox';
import { FOUNDER_PROFILE, PUBLICATIONS } from '@/data/initialData';
import { SITE_IMAGES, MAGATTE_NIANG_GALLERY } from '@/data/siteImages';
import {
  GraduationCap,
  FlaskConical,
  Building2,
  Quote,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Microscope,
  PlayCircle,
  Camera,
  FileText,
  Download,
  Trophy,
} from 'lucide-react';

const ROLES_ICONS = [
  { icon: <Building2 className="w-5 h-5 text-accent-500" /> },
  { icon: <GraduationCap className="w-5 h-5 text-accent-500" /> },
  { icon: <Award className="w-5 h-5 text-accent-500" /> },
];

export default function ProfilPage() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const yearsOfExistence = Math.max(14, new Date().getFullYear() - 2012);
  const dynamicMetrics = [
    { label: "Années d'existence (depuis 2012)", value: `${yearsOfExistence} ans` },
    ...FOUNDER_PROFILE.verifiedMetrics,
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Profil & recherche', href: '/profil' }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/reelles/sbs-reel-002.jpg"
          alt="Ingénierie BTP et direction de projets Magatte NIANG"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-950/75 pointer-events-none" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shrink-0 shadow-elev-3 ring-4 ring-accent-500/40 bg-brand-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_IMAGES.magatteNiangPortraitCover}
                alt="Magatte NIANG · portrait officiel"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold tracking-wider text-accent-400">
                  <Users className="w-3.5 h-3.5" />
                  Fondateur &amp; Directeur Général
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-400/35 rounded-full text-xs font-mono font-bold text-amber-300">
                  <Trophy className="w-3.5 h-3.5" />
                  Lauréat Trophée LeadSen 2026 · Entrepreneuriat BTP
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mb-3">
                Magatte NIANG
              </h1>
              <p className="text-gold-400 font-semibold text-sm sm:text-base mb-4">
                Bâtir l&apos;avenir du Sénégal · {FOUNDER_PROFILE.title}
              </p>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                Un leader pluridisciplinaire alliant expertise BTP, innovation en recherche et vision
                entrepreneuriale pour des projets d&apos;excellence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {dynamicMetrics.map((m) => (
              <div
                key={m.label}
                className="bg-brand-800/60 border border-brand-700 rounded-m p-4 text-center"
              >
                <p className="text-2xl sm:text-3xl font-title font-bold text-accent-400 tabular-nums">
                  {m.value}
                </p>
                <p className="text-[11px] font-mono tracking-wider text-neutral-400 mt-1">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIOGRAPHIE */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-reading">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
            Biographie
          </h2>
          <div className="space-y-4 text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p>
              Magatte NIANG est un leader pluridisciplinaire qui incarne une nouvelle génération
              d&apos;entrepreneurs africains alliant excellence académique, expertise opérationnelle
              et vision stratégique.
            </p>
            <p>
              Ingénieur diplômé de l&apos;<strong>École Polytechnique de Thiès (EPT)</strong> en
              Génie Civil, il a complété sa formation à l&apos;étranger en se spécialisant en{' '}
              <strong>
                structures métalliques au Centre des Hautes Études en Construction (CHEM) en France
              </strong>
              . Cette double formation lui a permis de maîtriser tant les standards internationaux
              que les réalités du contexte africain.
            </p>
            <p>
              Entrepreneur aguerri, il a fondé et développé depuis 2012 ({yearsOfExistence} ans
              d&apos;existence) un écosystème intégré de 7 entités du secteur de la construction et
              des travaux publics : <strong>SERMA BTP (2012)</strong>,{' '}
              <strong>SB-S Group (2016)</strong>, <strong>SB-S Labo (2021)</strong>, SB-S
              Industries, SB-S Logistik, P2M et PGT — transformant chacune en acteur de référence
              dans son domaine. Son leadership a été couronné en 2026 par le{' '}
              <strong>Trophée LeadSen de l&apos;Entrepreneuriat BTP</strong>.
            </p>
            <p>
              En parallèle de ses activités entrepreneuriales, il poursuit un{' '}
              <strong>doctorat consacré à l&apos;innovation dans les matériaux de construction</strong>{' '}
              (notamment la valorisation des matériaux locaux et les Blocs de Terre Comprimée). Cette
              démarche de recherche appliquée lui permet de développer des solutions adaptées aux
              défis spécifiques du contexte africain tout en contribuant à l&apos;avancement
              scientifique du secteur.
            </p>
            <p>
              Au-delà de ses réalisations entrepreneuriales, Magatte NIANG s&apos;investit dans la
              transmission du savoir. Intervenant dans les plus grandes écoles d&apos;ingénieurs du
              Sénégal (
              <strong>École Polytechnique de Thiès, École Supérieure Polytechnique, SUP TP</strong>
              ), il forme la nouvelle génération de professionnels du BTP.
            </p>
          </div>

          <blockquote className="mt-8 border-l-4 border-accent-500 bg-neutral-50 dark:bg-brand-800/50 p-5 rounded-r">
            <Quote className="w-5 h-5 text-accent-500 mb-2" />
            <p className="text-sm sm:text-base italic text-neutral-800 dark:text-neutral-200">
              Allier rigueur scientifique, audace entrepreneuriale et exigence technique pour bâtir
              des infrastructures qui durent et transforment.
            </p>
          </blockquote>
        </div>

        {/* VIDÉO OFFICIELLE & DISTINCTION LEADSEN 2026 */}
        <div className="mt-14 bg-brand-950 text-white rounded-2xl border border-brand-800 overflow-hidden shadow-elev-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            <div className="lg:col-span-7 bg-black">
              <video
                src="/media/videos/magatte-niang-profil.mp4"
                poster="/media/magatte-niang/portrait-officiel.jpg"
                controls
                playsInline
                preload="metadata"
                className="w-full max-h-[460px] object-contain bg-black"
              >
                Votre navigateur ne supporte pas la lecture vidéo HTML5.
              </video>
            </div>
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/35 text-amber-300 text-[11px] font-mono font-bold">
                <PlayCircle className="w-3.5 h-3.5" />
                Vidéo officielle · Profil &amp; Distinction
              </span>
              <h2 className="text-xl sm:text-2xl font-title font-bold leading-snug">
                Intervention &amp; Trophée LeadSen 2026 — Entrepreneuriat BTP
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Découvrez la prise de parole de Magatte NIANG lors du Forum &amp; Nuit des LeadSen
                2026 (Leaders Sénégalais), où le groupe SB-S Group / SERMA BTP a été distingué pour
                son impact dans l&apos;ingénierie et la souveraineté industrielle au Sénégal.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-amber-300 uppercase">Distinction</div>
                  <div className="text-sm font-bold text-white mt-0.5">Trophée LeadSen</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-sky-300 uppercase">Catégorie</div>
                  <div className="text-sm font-bold text-white mt-0.5">Entrepreneuriat BTP</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORMATION */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
            Formation &amp; diplômes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <GraduationCap className="w-6 h-6 text-accent-500" />,
                title: 'École Polytechnique de Thiès (EPT)',
                desc: "Diplôme d'Ingénieur de Conception en Génie Civil · structures, ouvrages d'art et matériaux locaux (PFE BTC).",
              },
              {
                icon: <Award className="w-6 h-6 text-accent-500" />,
                title: 'CHEM France',
                desc: 'Spécialisation en structures métalliques · Centre des Hautes Études en Construction.',
              },
              {
                icon: <Microscope className="w-6 h-6 text-accent-500" />,
                title: 'Doctorat en cours',
                desc: "Recherche sur l'innovation dans les matériaux de construction (bétons, aciers, composites et constructions en terre).",
              },
            ].map((d) => (
              <div
                key={d.title}
                className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6"
              >
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-m flex items-center justify-center mb-4">
                  {d.icon}
                </div>
                <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm mb-1.5">
                  {d.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ROLES */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
            Fonctions actuelles
          </h2>
          <div className="space-y-4">
            {FOUNDER_PROFILE.roles.map((role, i) => (
              <div
                key={role.title}
                className="flex items-start gap-4 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5"
              >
                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-m flex items-center justify-center shrink-0">
                  {ROLES_ICONS[i % ROLES_ICONS.length].icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm">
                      {role.title}
                    </h3>
                    <span className="text-[11px] font-mono text-neutral-500">{role.period}</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    {role.org}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENSEIGNEMENT & RECHERCHE */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE_IMAGES.magatteNiangProfesseur}
              alt="Magatte NIANG en conférence et enseignement"
              className="w-full h-56 sm:h-64 object-cover object-top"
              loading="lazy"
            />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-accent-500" />
                <h3 className="font-title font-bold text-neutral-900 dark:text-white">
                  Profil académique &amp; enseignant
                </h3>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                Acteur clé de la formation d&apos;ingénieurs au Sénégal, intervenant dans les plus
                grandes écoles (EPT, ESP, SUP TP).
              </p>
              <ul className="space-y-2">
                {['Constructions métalliques', 'Études de prix', 'Technologie des constructions'].map(
                  (s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" /> {s}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE_IMAGES.magatteNiangChercheur}
              alt="Magatte NIANG, doctorant chercheur en matériaux de construction"
              className="w-full h-56 sm:h-64 object-cover object-top"
              loading="lazy"
            />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-accent-500" />
                <h3 className="font-title font-bold text-neutral-900 dark:text-white">
                  Profil doctorant &amp; chercheur
                </h3>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                Recherche approfondie sur les matériaux de construction et l&apos;habitat durable
                pour développer des solutions innovantes adaptées au contexte africain.
              </p>
              <ul className="space-y-2">
                {[
                  'Dimensionnement structural des Blocs de Terre Comprimée (BTC)',
                  'Analyse des bétons, aciers, latérites et composites',
                  'Collaborations académiques internationales',
                ].map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* DOSSIER DE RECHERCHE FONDATEUR · PFE EPT 142 PAGES */}
        <div className="mt-12 rounded-2xl border border-accent-500/30 bg-gradient-to-br from-neutral-50 via-white to-amber-50/40 dark:from-brand-950 dark:via-brand-900 dark:to-brand-950 p-6 sm:p-8 shadow-elev-1">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/15 text-accent-700 dark:text-accent-300 text-xs font-mono font-bold">
              <FileText className="w-3.5 h-3.5" />
              Monographie Scientifique · EPT Thiès (142 pages)
            </span>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              Année académique 2009–2010 · Département Génie Civil
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white mb-2">
            « Dimensionnement structural des constructions en terre dans l&apos;habitat »
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
            Auteurs : <strong>Magatte NIANG</strong> &amp; Abdou Karim FALL · Encadrement :{' '}
            <strong>Pr. Ibrahima Khalil CISSÉ</strong> (Directeur interne, EPT) &amp;{' '}
            <strong>Dr. Galaye NIANG</strong> (Directeur externe, EPT).
          </p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
            Travail fondateur établissant le cadre normatif et structural des{' '}
            <strong>Blocs de Terre Comprimée (BTC)</strong> au Sénégal (norme AFNOR XP 13-901,
            méthodes CRATerre des coefficients de réduction, du tiers central et de la charge
            critique d&apos;Euler). L&apos;étude caractérise les carrières latéritiques de{' '}
            <strong>Sindia</strong> et <strong>Ngalane</strong> et compare techniquement et
            économiquement la construction BTC au béton armé sur le bâtiment témoin de l&apos;EPT.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-white dark:bg-brand-800/80 border border-neutral-200 dark:border-brand-700">
              <div className="text-xl sm:text-2xl font-title font-bold text-emerald-600 dark:text-emerald-400">
                ~32 %
              </div>
              <div className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                Économie vs béton armé
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                784 415 F (BTC) vs 1 292 655 F (BA)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-brand-800/80 border border-neutral-200 dark:border-brand-700">
              <div className="text-xl sm:text-2xl font-title font-bold text-accent-600 dark:text-accent-400">
                0,34
              </div>
              <div className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                Résistance thermique (m².K/W)
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                BTC 14 cm vs 0,25 m².K/W en béton
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-brand-800/80 border border-neutral-200 dark:border-brand-700">
              <div className="text-xl sm:text-2xl font-title font-bold text-amber-600 dark:text-amber-400">
                12 h
              </div>
              <div className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                Déphasage thermique
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Flux 1 511 W (voûte BTC) vs 2 050 W (BA)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-brand-800/80 border border-neutral-200 dark:border-brand-700">
              <div className="text-xl sm:text-2xl font-title font-bold text-sky-600 dark:text-sky-400">
                56 dB
              </div>
              <div className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                Isolation acoustique (500 Hz)
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Carrières caractérisées : Sindia &amp; Ngalane
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/docs/PFE-Magatte-Niang-Constructions-Terre-EPT.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-m bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              Consulter / Télécharger le mémoire complet (PDF · 142 pages)
            </a>
            <Link
              href="/mediatheque"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-m border border-neutral-300 dark:border-brand-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:border-accent-500 transition-colors"
            >
              Voir dans l&apos;espace Presse <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* GALERIE OFFICIELLE MAGATTE NIANG (FORUM & NUIT DES LEADSEN 2026) */}
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-accent-500" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight">
                  Galerie officielle · Forum &amp; Nuit des LeadSen 2026
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Remise du Trophée LeadSen Entrepreneuriat BTP, interventions et équipe — cliquez
                  sur une photo pour l&apos;agrandir.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MAGATTE_NIANG_GALLERY.map((photo, idx) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setLightboxIdx(idx)}
                className="group text-left bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-xl overflow-hidden hover:border-accent-500 transition-all shadow-xs"
              >
                <div className="aspect-[4/3] bg-neutral-100 dark:bg-brand-950 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-brand-950/80 text-white text-[10px] font-mono font-bold">
                    {photo.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-200 line-clamp-2 leading-snug">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* VISION */}
        <div className="mt-12 bg-brand-900 dark:bg-brand-950 border border-brand-800 rounded-l p-8">
          <h3 className="text-lg font-title font-bold text-white mb-3">Vision</h3>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
            {FOUNDER_PROFILE.vision}
          </p>
        </div>

        {/* PUBLICATIONS PREVIEW */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight">
              Publications &amp; recherche
            </h2>
            <Link
              href="/publications"
              className="text-xs font-bold text-accent-500 hover:text-accent-600 inline-flex items-center gap-1"
            >
              Tout voir <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {PUBLICATIONS.slice(0, 4).map((pub) => (
              <Link
                key={pub.id}
                href="/publications"
                className="flex items-start gap-4 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 hover:border-accent-500 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {pub.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {pub.journalOrEvent} · {pub.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {lightboxIdx !== null && (
        <PhotoLightbox
          images={MAGATTE_NIANG_GALLERY.map((p) => ({ url: p.src, caption: p.caption }))}
          index={lightboxIdx}
          onIndexChange={setLightboxIdx}
          title="Magatte NIANG · Forum & Nuit des LeadSen 2026"
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}
