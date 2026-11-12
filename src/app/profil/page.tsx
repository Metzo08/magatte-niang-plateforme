'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FOUNDER_PROFILE, PUBLICATIONS } from '@/data/initialData';
import { SITE_IMAGES } from '@/data/siteImages';
import { GraduationCap, FlaskConical, Building2, Quote, ArrowRight, BookOpen, Award, Users, Microscope } from 'lucide-react';

const ROLES_ICONS = [
  { icon: <Building2 className="w-5 h-5 text-accent-500" /> },
  { icon: <GraduationCap className="w-5 h-5 text-accent-500" /> },
  { icon: <Award className="w-5 h-5 text-accent-500" /> },
];

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Profil & recherche', href: '/profil' }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        {/* Image d'arrière-plan ingénierie BTP & grands chantiers */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/reelles/sbs-reel-002.jpg"
          alt="Ingénierie BTP et direction de projets Magatte Niang"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-950/75 pointer-events-none" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Portrait officiel — magatteniang-expert.sn */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shrink-0 shadow-elev-3 ring-4 ring-accent-500/40 bg-brand-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_IMAGES.magatteNiangPortraitCover}
                alt="Magatte Niang — portrait officiel"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold  tracking-wider text-accent-400 mb-4">
                <Users className="w-3.5 h-3.5" />
                Fondateur & Directeur Général
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mb-3">
                {FOUNDER_PROFILE.name}
              </h1>
              <p className="text-gold-400 font-semibold text-sm sm:text-base mb-4">
                Bâtir l'avenir du Sénégal — {FOUNDER_PROFILE.title}
              </p>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                Un leader pluridisciplinaire alliant expertise BTP, innovation en recherche et vision
                entrepreneuriale pour des projets d'excellence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {FOUNDER_PROFILE.verifiedMetrics.map(m => (
              <div key={m.label} className="bg-brand-800/60 border border-brand-700 rounded-m p-4 text-center">
                <p className="text-2xl sm:text-3xl font-title font-bold text-accent-400 tabular-nums">{m.value}</p>
                <p className="text-[11px] font-mono  tracking-wider text-neutral-400 mt-1">{m.label}</p>
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
              Magatte Niang est un leader pluridisciplinaire qui incarne une nouvelle génération
              d'entrepreneurs africains alliant excellence académique, expertise opérationnelle et
              vision stratégique.
            </p>
            <p>
              Ingénieur diplômé de l'<strong>École Polytechnique de Thiès</strong> en Génie Civil, il a
              complété sa formation à l'étranger en se spécialisant en <strong>structures métalliques au
              Centre des Hautes Études en Construction (CHEM) en France</strong>. Cette double formation
              lui a permis de maîtriser tant les standards internationaux que les réalités du contexte africain.
            </p>
            <p>
              Entrepreneur aguerri, il a fondé et développé plusieurs entreprises du secteur de la
              construction et des travaux publics — <strong>SERMA BTP (2012)</strong>, <strong>SB-S Group (2016)</strong>,
              <strong> SB-S Labo (2021)</strong>, SB-S Industries, SB-S Logistik, P2M et PGT — transformant
              chacune en acteur de référence dans son domaine.
            </p>
            <p>
              En parallèle de ses activités entrepreneuriales, il poursuit un <strong>doctorat consacré à
              l'innovation dans les matériaux de construction</strong>. Cette démarche de recherche appliquée
              lui permet de développer des solutions adaptées aux défis spécifiques du contexte africain
              tout en contribuant à l'avancement scientifique du secteur.
            </p>
            <p>
              Au-delà de ses réalisations entrepreneuriales, Magatte Niang s'investit dans la transmission
              du savoir. Intervenant dans les plus grandes écoles d'ingénieurs du Sénégal
              (<strong>École Polytechnique de Thiès, École Supérieure Polytechnique, SUP TP</strong>), il forme
              la nouvelle génération de professionnels du BTP.
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

        {/* FORMATION */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-6">
            Formation & diplômes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <GraduationCap className="w-6 h-6 text-accent-500" />, title: 'École Polytechnique de Thiès', desc: 'Diplôme d\'Ingénieur en Génie Civil — structures et ouvrages d\'art.' },
              { icon: <Award className="w-6 h-6 text-accent-500" />, title: 'CHEM France', desc: 'Spécialisation en structures métalliques — Centre des Hautes Études en Construction.' },
              { icon: <Microscope className="w-6 h-6 text-accent-500" />, title: 'Doctorat en cours', desc: 'Recherche sur l\'innovation dans les matériaux de construction (bétons, aciers, composites).' },
            ].map(d => (
              <div key={d.title} className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-m flex items-center justify-center mb-4">
                  {d.icon}
                </div>
                <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm mb-1.5">{d.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{d.desc}</p>
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
              <div key={role.title} className="flex items-start gap-4 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-m flex items-center justify-center shrink-0">
                  {ROLES_ICONS[i % ROLES_ICONS.length].icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-title font-bold text-neutral-900 dark:text-white text-sm">{role.title}</h3>
                    <span className="text-[11px] font-mono text-neutral-500">{role.period}</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{role.org}</p>
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
              alt="Professeur Magatte Niang en enseignement"
              className="w-full h-44 object-cover"
              loading="lazy"
            />
            <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-accent-500" />
              <h3 className="font-title font-bold text-neutral-900 dark:text-white">Profil académique & enseignant</h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
              Acteur clé de la formation d'ingénieurs au Sénégal, intervenant dans les plus grandes écoles (EPT, ESP, SUP TP).
            </p>
            <ul className="space-y-2">
              {['Constructions métalliques', 'Études de prix', 'Technologie des constructions'].map(s => (
                <li key={s} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" /> {s}
                </li>
              ))}
            </ul>
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE_IMAGES.magatteNiangChercheur}
              alt="Magatte Niang, doctorant chercheur en matériaux de construction"
              className="w-full h-44 object-cover"
              loading="lazy"
            />
            <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-accent-500" />
              <h3 className="font-title font-bold text-neutral-900 dark:text-white">Profil doctorant & chercheur</h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
              Recherche approfondie sur les matériaux de construction pour développer des solutions
              innovantes et adaptées au contexte africain.
            </p>
            <ul className="space-y-2">
              {['Analyse des bétons, aciers et composites', 'Amélioration des techniques de construction', 'Collaborations académiques internationales'].map(s => (
                <li key={s} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" /> {s}
                </li>
              ))}
            </ul>
            </div>
          </div>
        </div>

        {/* Photo officielle avec l'équipe d'ingénieurs */}
        <div className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SITE_IMAGES.magatteNiangEquipe}
            alt="Magatte Niang et son équipe d'ingénieurs"
            className="w-full h-56 sm:h-80 object-cover rounded-l border border-neutral-200 dark:border-brand-700 shadow-elev-2"
            loading="lazy"
          />
          <p className="text-center text-[11px] font-mono text-neutral-500 mt-2">
            Magatte Niang et son équipe d'ingénieurs · Source : magatteniang-expert.sn
          </p>
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
              Publications & recherche
            </h2>
            <Link href="/publications" className="text-xs font-bold text-accent-500 hover:text-accent-600 inline-flex items-center gap-1">
              Tout voir <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {PUBLICATIONS.slice(0, 3).map(pub => (
              <Link
                key={pub.id}
                href="/publications"
                className="flex items-start gap-4 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4 hover:border-accent-500 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{pub.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {pub.journalOrEvent} · {pub.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}