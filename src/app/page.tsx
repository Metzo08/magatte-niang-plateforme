'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Hammer,
  FlaskConical,
  Factory,
  Truck,
  Layers,
  Globe,
  CheckCircle2,
  FileCheck2,
  BookOpen,
  Calendar,
  MessageSquare,
  Phone,
  ChevronRight,
  ExternalLink,
  Award,
  Sparkles,
  Search,
  Zap,
} from 'lucide-react';
import { useEntities } from '@/hooks/useEntities';
import { useProducts } from '@/hooks/useProducts';
import { useProjects } from '@/hooks/useProjects';
import { ENTITIES } from '@/data/initialData';
import { SITE_IMAGES, EXPERTISE_IMAGES, PHOTOS_REELLES } from '@/data/siteImages';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function HomePage() {
  const { entities: apiEntities } = useEntities();
  const { products, loading: loadingProducts } = useProducts();
  const { projects } = useProjects();
  const [hoveredSynergy, setHoveredSynergy] = React.useState<string | null>(null);

  // Piliers affichés immédiatement (fallback statique) puis enrichis par l'API
  const entities = apiEntities.length > 0 ? apiEntities : ENTITIES;

  // Seul le catalogue produits justifie un écran de chargement
  const loading = loadingProducts && entities.length === 0;

  // Projets en vedette (featured)
  const featuredProjects = projects.filter((p: any) => p.isFeatured || p.featured).slice(0, 3);

  // Produits en vedette
  const featuredProducts = products.slice(0, 3);

  // KPI monumentaux certifiés (données industrielles vérifiées)
  const operationalKpis = [
    {
      value: '4 500',
      unit: 'T',
      label: "Tonnage d'acier usiné / an",
      entity: 'SERMA BTP',
      color: '#1B4965',
      icon: Hammer
    },
    {
      value: '250',
      unit: 'm³/j',
      label: 'Capacité de production béton',
      entity: 'SB-S Industries',
      color: '#6B7A8F',
      icon: Factory
    },
    {
      value: '142',
      unit: 'km',
      label: 'Linéaire de voiries livrées',
      entity: 'SB-S Group',
      color: '#2D6A8E',
      icon: Building2
    },
    {
      value: '12 800',
      unit: '/an',
      label: 'Essais géotechniques réalisés',
      entity: 'SB-S Labo',
      color: '#1F9D6B',
      icon: FlaskConical
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Chargement de l'écosystème..." />
      </div>
    );
  }

  const intentionPaths = [
    {
      title: 'Construire une structure',
      subtitle: 'Charpentes métalliques, hangars & bâtiments',
      entity: 'SERMA BTP',
      href: '/entites/serma-btp',
      icon: Hammer,
      color: '#1B4965'
    },
    {
      title: 'Analyser & tester un sol',
      subtitle: 'Essais CBR, sondages & contrôle béton',
      entity: 'SB-S Labo',
      href: '/entites/sbs-labo',
      icon: FlaskConical,
      color: '#40916C'
    },
    {
      title: 'Choisir des revêtements',
      subtitle: 'Carrelages grand format, faïence & sanitaires',
      entity: 'P2M',
      href: '/catalogue',
      icon: Layers,
      color: '#C0562F'
    },
    {
      title: 'Louer un engin de chantier',
      subtitle: 'Pelles 36T, grues 60T, camions bennes 8x4',
      entity: 'SB-S Logistik',
      href: '/entites/sbs-logistik',
      icon: Truck,
      color: '#E07A5F'
    },
    {
      title: 'Préfabriquer en béton',
      subtitle: 'Prédalles, bordures & éléments sur mesure',
      entity: 'SB-S Industries',
      href: '/entites/sbs-industries',
      icon: Factory,
      color: '#577590'
    },
    {
      title: 'Importer & sourcer',
      subtitle: 'Matières premières, fret & dédouanement',
      entity: 'PGT Transit',
      href: '/entites/pgt',
      icon: Globe,
      color: '#7A5AA8'
    }
  ];

  // Flux de synergies inter-entités (graphe technique)
  const synergyFlows = [
    {
      from: 'Bureau d\'Études SERMA',
      to: 'Contrôle Qualité SB-S Labo',
      label: 'Validation Eurocodes & PV de résistance',
      entities: ['serma-btp', 'sbs-labo']
    },
    {
      from: 'Usine SB-S Industries',
      to: 'Chantiers SB-S Group',
      label: 'Prédalles & bordures livrées en flux tendu',
      entities: ['sbs-industries', 'sbs-group']
    },
    {
      from: 'SERMA BTP',
      to: 'Flotte SB-S Logistik',
      label: 'Levage & convoi des tronçons d\'acier 60T',
      entities: ['serma-btp', 'sbs-logistik']
    },
    {
      from: 'Sourcing PGT International',
      to: 'Showroom P2M',
      label: 'Séries exclusives importées sans surstaries',
      entities: ['pgt', 'p2m']
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">

      {/* SECTION 1: HERO D'AUTORITÉ INDUSTRIELLE */}
      <section className="relative overflow-hidden blueprint-grid-dark text-white border-b border-brand-800">

        {/* Image de fond officielle (chantier / grues) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SITE_IMAGES.gruesRealisation}
          alt="Chantier de l'écosystème Magatte Niang Expert"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          suppressHydrationWarning
        />

        {/* Dégradés de profondeur */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/70 via-brand-900/40 to-brand-900/60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Colonne gauche : Message d'autorité */}
            <div className="lg:col-span-7">

              {/* Bandeau de statut live */}
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-neutral-200">
                  <span className="beacon-dot-green" />
                  <span>Écosystème opérationnel · {entities.length} entités actives</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full text-xs font-semibold text-gold-500">
                  <Award className="w-3.5 h-3.5" />
                  <span>Laboratoire agréé d'État</span>
                </span>
              </div>

              {/* Titre principal architectural */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-title font-bold tracking-tight leading-[1.05]">
                Bâtir l'Afrique de l'Ouest
                <span className="block mt-2 text-gradient-gold">
                  par la rigueur d'ingénierie.
                </span>
              </h1>

              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mt-7 max-w-2xl">
                Un dispositif industriel intégré réunissant <strong className="text-white font-semibold">7 pôles spécialisés</strong> — bureau d'études, géotechnique, charpente métallique, préfabrication béton, logistique lourde, sourcing international et finitions. De l'essai de sol à la réception d'ouvrage.
              </p>

              {/* Double CTA */}
              <div className="flex flex-col sm:flex-row gap-3.5 mt-9">
                <Link
                  href="/assistant"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-elev-3 hover:shadow-[0_0_35px_rgba(242,106,27,0.5)] transition-all text-sm sm:text-base"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Lancer l'assistant de qualification</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/entites"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-transparent border border-white/25 hover:border-accent-500 hover:bg-white/5 text-white font-semibold rounded-m transition-all text-sm sm:text-base"
                >
                  <span>Explorer nos expertises & réalisations</span>
                </Link>
              </div>

              {/* Garanties immédiates */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-9 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calculs conformes Eurocodes 3 & NF P</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Laboratoire agréé d'État</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24 ans d'expérience terrain</span>
                </div>
              </div>
            </div>

            {/* Colonne droite : Tableau de bord technique */}
            <div className="lg:col-span-5">
              <div className="relative industrial-card rounded-l p-6 sm:p-7 tech-bracket-tl">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="beacon-dot-orange" />
                    <span className="text-xs font-mono font-bold  tracking-wider text-accent-400">
                      Capacités vérifiées
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 ">
                    Q{new Date().getFullYear()}
                  </span>
                </div>

                <div className="space-y-1">
                  {operationalKpis.slice(0, 3).map((kpi, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 py-3.5 border-b border-white/5 last:border-0 group"
                    >
                      <div
                        className="w-10 h-10 rounded-m flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: `${kpi.color}40`, border: `1px solid ${kpi.color}80` }}
                      >
                        <kpi.icon className="w-5 h-5" style={{ color: kpi.color === '#6B7A8F' ? '#B8C4D0' : kpi.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-mono font-bold text-white tabular-nums">
                            {kpi.value}
                          </span>
                          <span className="text-xs font-mono text-accent-500">{kpi.unit}</span>
                        </div>
                        <span className="text-[11px] text-neutral-400 block mt-0.5">
                          {kpi.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact d'urgence technique */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <Phone className="w-3.5 h-3.5 text-accent-500" />
                    <span className="font-mono">Urgence chantier 24/7</span>
                  </div>
                  <a href="tel:+221772671617" className="text-xs font-bold font-mono text-white hover:text-accent-500 transition-colors">
                    +221 77 267 16 17
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bande de conformité */}
        <div className="relative z-10 border-t border-white/10 bg-brand-950/50 backdrop-blur-sm">
          <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] font-mono  tracking-wider text-neutral-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> ISO 9001 · management qualité</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> NF EN 1090 · structures acier</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> NF EN 206 · bétons</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Commissionnaire en douane agréé</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: RÉALISATION PHARE */}
      {featuredProjects.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-brand-900 dark:bg-brand-950 rounded-l overflow-hidden border border-brand-800 blueprint-grid-dense-dark">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-gold-500 to-accent-500" />
            <div className="relative z-10 p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-500/15 border border-accent-500/40 rounded-full text-[10px] font-mono font-bold  tracking-wider text-accent-400">
                      <Award className="w-3 h-3" />
                      Réalisation phare
                    </span>
                    <span className="text-xs font-mono text-neutral-500 ">
                      {featuredProjects[0].entity?.name || featuredProjects[0].entityId}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-white tracking-tight leading-tight">
                    {featuredProjects[0].title}
                  </h2>
                  <p className="text-neutral-300 text-sm mt-4 leading-relaxed max-w-2xl">
                    {featuredProjects[0].description}
                  </p>
                  <Link
                    href={`/projets/${featuredProjects[0].slug}`}
                    className="group inline-flex items-center gap-2 mt-7 px-5 py-3 bg-white/5 hover:bg-accent-500 border border-white/15 hover:border-accent-500 text-white font-semibold text-sm rounded-m transition-all"
                  >
                    <span>Voir l'étude de cas complète</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Métriques techniques du projet */}
                <div className="lg:w-72 shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-m p-4">
                    <span className="text-[10px] font-mono  tracking-wider text-neutral-500 block">
                      Acier usiné
                    </span>
                    <span className="text-xl font-mono font-bold text-white tabular-nums">
                      {featuredProjects[0].technicalData?.steelTonnage || (featuredProjects[0] as any).metrics?.steelTonnage || '38 T'}
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-m p-4">
                    <span className="text-[10px] font-mono  tracking-wider text-neutral-500 block">
                      Béton dallage
                    </span>
                    <span className="text-xl font-mono font-bold text-white tabular-nums">
                      {featuredProjects[0].technicalData?.concreteVolume || (featuredProjects[0] as any).metrics?.concreteVolume || '450 m³'}
                    </span>
                  </div>
                  {featuredProjects[0].year && (
                    <div className="bg-white/5 border border-white/10 rounded-m p-4 col-span-2 lg:col-span-1">
                      <span className="text-[10px] font-mono  tracking-wider text-neutral-500 block">
                        Année de livraison
                      </span>
                      <span className="text-xl font-mono font-bold text-white tabular-nums">
                        {featuredProjects[0].year}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: KPI OPÉRATIONNELS MONUMENTAUX */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-accent-500  tracking-wider">
              Indicateurs opérationnels certifiés
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-neutral-900 dark:text-white mt-2 tracking-tight">
              La puissance d'un appareil industriel intégré
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
            <span className="beacon-dot-green" />
            Données vérifiées {new Date().getFullYear()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {operationalKpis.map((kpi, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-brand-800/60 border border-neutral-200 dark:border-brand-700 rounded-l p-6 transition-all overflow-hidden hover:border-accent-500 dark:hover:border-accent-500 hover:shadow-elev-3"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: kpi.color }}
              />
              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-11 h-11 rounded-m flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${kpi.color}1A`, border: `1px solid ${kpi.color}40` }}
                >
                  <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <span className="text-[10px] font-mono font-bold  tracking-wider text-neutral-500 dark:text-neutral-400 px-2 py-1 bg-neutral-100 dark:bg-brand-900 rounded">
                  {kpi.entity}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl lg:text-[2.75rem] font-mono font-bold text-neutral-900 dark:text-white tabular-nums leading-none">
                  {kpi.value}
                </span>
                <span className="text-sm font-mono font-bold text-accent-500">{kpi.unit}</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-snug">
                {kpi.label}
              </p>

              <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-neutral-200 dark:border-brand-700/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-mono  tracking-wider text-neutral-500">
                  Contrôle qualité indépendant
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3B: GALERIE VISUELLE DES MÉTIERS */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-accent-500  tracking-wider">
              Nos métiers en images
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-neutral-900 dark:text-white mt-2 tracking-tight">
              Du chantier à l'atelier, une maîtrise intégrale
            </h2>
          </div>
          <Link
            href="/expertises"
            className="inline-flex items-center gap-2 text-xs font-bold text-accent-500 hover:text-accent-600 shrink-0"
          >
            Toutes nos expertises <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { img: PHOTOS_REELLES.cesStockageSendou, label: 'Stockage produits chimiques', tag: 'CES · SENDOU' },
            { img: PHOTOS_REELLES.dlmUsineOxygeneMako, label: 'Usine d\'oxygène PSA 6T/j', tag: 'DLM · MAKO' },
            { img: PHOTOS_REELLES.polytechBureauxSococim, label: 'Bureaux carrière SOCOCIM', tag: 'POLYTECH' },
            { img: PHOTOS_REELLES.secaaAireLavage, label: 'Aire de lavage industrielle', tag: 'SECAA SA' },
            { img: PHOTOS_REELLES.oimSocieteGenerale, label: 'Travaux humanitaires OIM', tag: 'SGT · OIM' },
            { img: PHOTOS_REELLES.chantierCouverture, label: 'Chantier génie civil', tag: 'SB-S Group' },
            { img: PHOTOS_REELLES.laboVue, label: 'Laboratoire géotechnique C2', tag: 'SB-S Labo' },
            { img: PHOTOS_REELLES.enginChantier, label: 'Parc matériel & engins', tag: 'SB-S Logistik' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-l overflow-hidden border border-neutral-200 dark:border-brand-700 shadow-elev-1 hover:shadow-elev-3 transition-all aspect-[4/3]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-[9px] font-mono font-bold  tracking-wider text-accent-400 block">
                  {item.tag}
                </span>
                <span className="text-xs font-semibold text-white block leading-tight">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: MATRICE INTERACTIVE DES ENTITÉS & SYNERGIES */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-accent-500  tracking-wider">
            Architecture industrielle & synergies
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-neutral-900 dark:text-white mt-2 tracking-tight">
            Les {entities.length} piliers de l'écosystème BTP
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl mx-auto">
            Chaque entité opère comme un maillon spécialisé — et chaque maillon alimente les autres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {entities.map((entity: any) => {
            const isHighlighted = hoveredSynergy
              ? synergyFlows.some(
                  f => f.entities.includes(entity.id) && hoveredSynergy === f.from + f.to
                )
              : false;
            const dimmed = hoveredSynergy && !isHighlighted;
            return (
              <Link
                key={entity.id}
                href={`/entites/${entity.id}`}
                className={`group relative bg-white dark:bg-brand-800/50 border rounded-l transition-all overflow-hidden flex-col ${
                  isHighlighted
                    ? 'border-accent-500 shadow-[0_0_25px_rgba(242,106,27,0.25)]'
                    : 'border-neutral-200 dark:border-brand-700 hover:border-accent-500 dark:hover:border-accent-500 hover:shadow-elev-3'
                } ${dimmed ? 'opacity-40' : ''}`}
              >
                <div className="h-1.5" style={{ backgroundColor: entity.colorHex }} />

                <div className="p-5 sm:p-6 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-m flex items-center justify-center text-white font-title font-bold text-sm shrink-0 shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: entity.colorHex }}
                      >
                        {entity.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-title font-bold text-neutral-900 dark:text-white group-hover:text-accent-500 transition-colors truncate">
                          {entity.name}
                        </h3>
                        <span className="text-[11px] font-mono  tracking-wide text-neutral-500 dark:text-neutral-400 block truncate">
                          {entity.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {entity.verifiedMetrics?.[0] && (
                    <div className="flex items-center gap-3 p-3 mb-4 rounded-m bg-neutral-50 dark:bg-brand-900/60 border border-neutral-200 dark:border-brand-700/60">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                            {entity.verifiedMetrics[0].value}
                          </span>
                          <span className="text-[11px] font-mono text-accent-500">
                            {entity.verifiedMetrics[0].unit}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {entity.verifiedMetrics[0].label}
                        </span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </div>
                  )}

                  <ul className="space-y-1.5">
                    {entity.expertises?.slice(0, 3).map((exp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="w-1 h-1 rounded-full bg-accent-500 shrink-0 mt-1.5" />
                        <span className="line-clamp-1">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-5 sm:px-6 py-3.5 bg-neutral-50 dark:bg-brand-900/60 border-t border-neutral-200 dark:border-brand-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-accent-500">{entity.ctaText || 'Fiche complète'}</span>
                  <ArrowRight className="w-4 h-4 text-accent-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Visualiseur de flux de synergies inter-entités */}
        <div className="mt-8 bg-brand-900 dark:bg-brand-950 border border-brand-800 rounded-l p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 blueprint-grid-dense-dark pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <div>
                  <h3 className="font-title font-bold text-white">
                    Flux de synergies inter-entités
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {entities.reduce((sum: number, e: any) => sum + (e.synergies?.length || 0), 0)} collaborations actives entre les filiales
                  </p>
                </div>
              </div>
              <Link
                href="/entites"
                className="text-xs font-bold text-accent-500 hover:text-accent-400 flex items-center gap-1.5 shrink-0"
              >
                Cartographie complète <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {synergyFlows.map((flow, idx) => {
                const key = flow.from + flow.to;
                const active = hoveredSynergy === key;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredSynergy(key)}
                    onMouseLeave={() => setHoveredSynergy(null)}
                    className={`group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3.5 rounded-m border transition-all cursor-default ${
                      active
                        ? 'bg-accent-500/10 border-accent-500/60'
                        : 'bg-white/5 border-white/10 hover:border-accent-500/40'
                    }`}
                  >
                    <span className="text-xs font-semibold text-white sm:whitespace-nowrap sm:shrink-0 truncate min-w-0">
                      {flow.from}
                    </span>
                    <div className="hidden sm:block flex-1 min-w-[30px] h-px bg-gradient-to-r from-accent-500/20 via-accent-500 to-accent-500/20 relative">
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-500" />
                    </div>
                    <span className="flex items-center gap-2 text-xs font-semibold text-white sm:whitespace-nowrap sm:shrink-0 truncate min-w-0">
                      <ChevronRight className="w-3.5 h-3.5 text-accent-500 sm:hidden shrink-0" />
                      {flow.to}
                    </span>
                    <span className="hidden 2xl:block text-[11px] text-neutral-400 flex-1 truncate">
                      {flow.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ENTONNOIR DE QUALIFICATION & CHIFFRAGE EXPRESS */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-accent-500  tracking-wider">
            Orientation immédiate · réponse garantie
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-neutral-900 dark:text-white mt-2 tracking-tight">
            Quel est votre besoin prioritaire ?
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl mx-auto">
            Sélectionnez votre intention technique : votre dossier est routé automatiquement vers l'ingénieur ou le commercial référent de la filiale compétente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intentionPaths.map((path, idx) => (
            <Link
              key={idx}
              href={path.href}
              className="group relative bg-white dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 hover:border-accent-500 dark:hover:border-accent-500 rounded-l p-5 sm:p-6 transition-all shadow-elev-1 hover:shadow-elev-3 overflow-hidden"
            >
              <span
                className="absolute top-0 left-0 w-1 h-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: path.color }}
              />
              <div className="flex items-start gap-4 pl-2">
                <div
                  className="w-12 h-12 rounded-m flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${path.color}1A`, border: `1px solid ${path.color}40` }}
                >
                  <path.icon className="w-6 h-6" style={{ color: path.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold  tracking-wider text-neutral-500">
                    {path.entity}
                  </span>
                  <h3 className="font-title font-bold text-neutral-900 dark:text-white group-hover:text-accent-500 transition-colors mt-1">
                    {path.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    {path.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-accent-500">
                    Qualifier ma demande
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Encadré d'engagement de délai */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-accent-500/10 via-accent-500/5 to-transparent dark:from-accent-500/15 border border-accent-500/30 rounded-l p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center shrink-0 shadow-elev-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white">
                Engagement de réponse : 24h – 48h ouvrées
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                Chiffrage cadré, hypothèses techniques documentées et interlocuteur unique dédié.
              </p>
            </div>
          </div>
          <Link
            href="/assistant"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-elev-2 transition-all text-sm whitespace-nowrap shrink-0"
          >
            <span>Démarrer le chiffrage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION 6: CATALOGUE P2M */}
      {featuredProducts.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold text-accent-500  tracking-wider">
                Showroom P2M · finitions & matériaux
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-neutral-900 dark:text-white mt-2 tracking-tight">
                Carrelages grand format & sanitaires de prestige
              </h2>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-m transition-all text-xs shrink-0 hover:bg-accent-500 dark:hover:bg-accent-500 dark:hover:text-white"
            >
              <span>Catalogue complet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product: any) => {
              const imageSrc = product.images && product.images[0]
                ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
                : null;
              return (
                <Link
                  key={product.id}
                  href={`/catalogue/${product.id}`}
                  className="group bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-3 transition-all flex flex-col"
                >
                  <div className="relative h-48 bg-neutral-100 dark:bg-brand-900 flex items-center justify-center overflow-hidden">
                    {imageSrc ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imageSrc}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-[0.07]" style={{
                          backgroundImage: 'linear-gradient(rgba(11,27,43,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(11,27,43,0.5) 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }} />
                        <Layers className="w-12 h-12 text-neutral-400 dark:text-brand-600 relative z-10 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                    <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2 py-1 rounded bg-white/90 dark:bg-brand-950/90 text-neutral-700 dark:text-neutral-300 backdrop-blur-sm z-10">
                      {product.category || 'P2M'}
                    </span>
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-1 rounded bg-brand-900/90 text-white backdrop-blur-sm z-10">
                      {product.ref}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-neutral-500">{product.ref}</span>
                      <h3 className="font-title font-bold text-neutral-900 dark:text-white mt-1 group-hover:text-accent-500 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                        {product.finish} · {product.material}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <div>
                        <span className="text-lg font-mono font-bold text-accent-500 tabular-nums">
                          {product.indicativePriceFCFA?.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-neutral-500 ml-1">FCFA/m² HT</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{product.availability || 'En stock'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-elev-2 transition-all text-sm"
            >
              <span>Accéder à tout le catalogue P2M</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* SECTION 7: ASSISTANT DE QUALIFICATION */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-brand-900 dark:bg-brand-950 rounded-l p-8 sm:p-14 text-center border border-brand-800 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid-dense-dark pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold text-accent-400  tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Assistant de qualification direct
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title font-bold text-white mb-4 tracking-tight max-w-3xl mx-auto">
              Votre projet qualifié et chiffré, sans formulaire générique
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              Décrivez votre besoin en 2 minutes. L'assistant analyse votre cahier des charges technique, applique les règles de routage de l'écosystème et transmet directement votre dossier à l'ingénieur référent — avec scoring immédiat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/assistant"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-elev-3 hover:shadow-[0_0_35px_rgba(242,106,27,0.5)] transition-all"
              >
                <span>Lancer l'assistant pas-à-pas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+221338324010"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-transparent border border-white/25 hover:border-accent-500 text-white font-semibold rounded-m transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>+221 33 832 40 10</span>
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 pt-6 border-t border-white/10 text-[11px] font-mono text-neutral-500">
              <span>Sauvegarde auto du brouillon</span>
              <span className="text-accent-500">·</span>
              <span>Réponse 24h–48h ouvrées</span>
              <span className="text-accent-500">·</span>
              <span>Confidentialité CDP garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CONTACT */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-neutral-50 dark:bg-brand-900/50 border-neutral-200 dark:border-brand-700 rounded-l p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold text-accent-500  tracking-wider">
              Direction technique & centrale d'urgence
            </span>
            <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-2 tracking-tight">
              Un interlocuteur unique, joignable immédiatement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <a
              href="tel:+221338324010"
              className="group bg-white dark:bg-brand-800/60 border-neutral-200 dark:border-brand-700 hover:border-accent-500 dark:hover:border-accent-500 rounded-l p-6 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-m bg-accent-500/10 border-accent-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-accent-500" />
              </div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white">Standard & urgence</h3>
              <p className="text-sm font-mono text-neutral-700 dark:text-neutral-300 mt-2">+221 33 832 40 10</p>
              <p className="text-xs font-mono text-accent-500 mt-1">Chantier 24/7 : +221 77 267 16 17</p>
            </a>
            <a
              href="mailto:contact@magatteniang-expert.sn"
              className="group bg-white dark:bg-brand-800/60 border-neutral-200 dark:border-brand-700 hover:border-accent-500 dark:hover:border-accent-500 rounded-l p-6 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-m bg-accent-500/10 border-accent-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6 text-accent-500" />
              </div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white">Direction technique</h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2 break-all">contact@magatteniang-expert.sn</p>
              <p className="text-xs text-neutral-500 mt-1">Bureau d'études & expertise</p>
            </a>
            <Link
              href="/assistant"
              className="group bg-white dark:bg-brand-800/60 border-neutral-200 dark:border-brand-700 hover:border-accent-500 dark:hover:border-accent-500 rounded-l p-6 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-m bg-accent-500/10 border-accent-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 text-accent-500" />
              </div>
              <h3 className="font-title font-bold text-neutral-900 dark:text-white">Rendez-vous / chantier</h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">Réserver un créneau</p>
              <p className="text-xs text-accent-500 mt-1 font-semibold">Disponibilités en temps réel →</p>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-brand-700">
            <h3 className="text-xs font-mono font-bold  tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              Répertoire des filiales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {entities.map((ent: any) => (
                <Link
                  key={ent.id}
                  href={`/entites/${ent.id}`}
                  className="group flex items-start gap-3 p-3 rounded-m hover:bg-white dark:hover:bg-brand-800/60 transition-colors border-transparent hover:border-neutral-200 dark:hover:border-brand-700"
                >
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ent.colorHex }} />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white block truncate group-hover:text-accent-500 transition-colors">
                      {ent.name}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 block truncate">{ent.phone}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
