'use client';

import React from 'react';
import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Package,
  Network,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useEntity } from '@/hooks/useEntities';
import { useProjects } from '@/hooks/useProjects';
import { useProducts } from '@/hooks/useProducts';
import { ENTITIES } from '@/data/initialData';
import { SITE_IMAGES, ENTITY_GALLERY } from '@/data/siteImages';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import PhotoLightbox from '@/components/common/PhotoLightbox';
import SbsPresentationGallery from '@/components/sbs/SbsPresentationGallery';
import SbsLogistikGallery from '@/components/sbs/SbsLogistikGallery';
import SbsIndustriesPublicCatalog from '@/components/sbs/SbsIndustriesPublicCatalog';
import InteractiveLocationMap from '@/components/maps/InteractiveLocationMap';
import { Layers, Truck } from 'lucide-react';

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

export default function EntityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const staticEntity = ENTITIES.find((e) => e.id === id);
  const { entity: fetchedEntity, loading, error } = useEntity(id);
  const entity = fetchedEntity || staticEntity;
  const { projects, loading: projectsLoading } = useProjects({ entityId: id });
  const { products, loading: productsLoading } = useProducts();

  // Visionneuse photos plein écran (lightbox) des réalisations
  const [lightbox, setLightbox] = useState<{
    images: { url: string; caption?: string }[];
    index: number;
    title: string;
  } | null>(null);
  const gallery = ENTITY_GALLERY[id] ?? [];

  // Produits liés à cette entité : brand P2M, ref préfixée P2M, sinon entité p2m => tout le catalogue
  const entityProducts =
    id === 'p2m'
      ? products
      : products.filter(
          (p: any) => (p.brand || '').toLowerCase().includes(id) || (p.ref || '').toUpperCase().startsWith(id.toUpperCase())
        );

  if (loading && !entity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Chargement de l'entité..." />
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage
          message={error || "Entité non trouvée"}
          retry={() => window.location.reload()}
        />
      </div>
    );
  }

  const entitySchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: entity.name,
    description: entity.description,
    image: `https://www.magatteniang-expert.sn${ENTITY_IMAGES[entity.id] || '/images/magatte-portrait.webp'}`,
    telephone: entity.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: entity.address,
      addressLocality: entity.city,
      addressCountry: 'SN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 14.7335,
      longitude: -17.3325,
    },
    url: `https://www.magatteniang-expert.sn/entites/${entity.id}`,
    founder: {
      '@type': 'Person',
      name: 'Magatte Niang',
    },
    employee: entity.leader
      ? {
          '@type': 'Person',
          name: entity.leader,
          jobTitle:
            entity.id === 'sbs-industries'
              ? 'Responsable SBS Industrie'
              : entity.id === 'sbs-logistik'
              ? 'Responsable SBS Logistik'
              : 'Responsable d’entité',
        }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entitySchema) }}
      />
      {/* Breadcrumb */}
      <div className="bg-neutral-100 dark:bg-brand-800/50 border-b border-neutral-200 dark:border-brand-700">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-accent-500">Accueil</Link>
            <span>/</span>
            <Link href="/entites" className="hover:text-accent-500">Entités</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">{entity.name}</span>
          </div>
        </div>
      </div>

      {/* Hero avec couleur de l'entité + illustration de fond */}
      <section
        className="relative overflow-hidden text-white py-16 border-b"
        style={{ backgroundColor: entity.colorHex }}
      >
        {/* Illustration officielle de l'entité (fond léger) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ENTITY_IMAGES[entity.id] || SITE_IMAGES.gruesRealisation}
          alt={entity.name}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none" />
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/entites"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux entités</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Colonne gauche: Infos principales */}
            <div className="lg:col-span-2">
              <div
                className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-mono font-bold  tracking-wider mb-4"
              >
                {entity.badge}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-title font-bold text-white tracking-tight mb-3">
                {entity.name}
              </h1>

              <p className="text-xl text-white/90 font-semibold mb-4">
                {entity.tagline}
              </p>

              <p className="text-base text-white/80 leading-relaxed max-w-2xl">
                {entity.description}
              </p>
            </div>

            {/* Colonne droite: Contact rapide */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-l p-6">
              <h3 className="font-title font-bold text-white text-lg mb-4">Contact direct</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-white/80" />
                  <a href={`tel:${entity.phone}`} className="hover:underline text-white">
                    {entity.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 shrink-0 text-white/80" />
                  <a
                    href={`https://wa.me/${(entity.whatsapp || entity.phone || '').replace(/[\s\+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-white font-semibold"
                  >
                    WhatsApp direct
                  </a>
                </div>

                {id === 'sbs-logistik' && (
                  <div className="pt-2 border-t border-white/10 text-xs text-amber-200">
                    <p className="font-semibold text-white">Rokhaya KANE</p>
                    <p className="text-[11px] text-white/80">Responsable commandes &amp; matériels</p>
                    <a
                      href="https://wa.me/221778586105?text=Bonjour%20Rokhaya%20KANE%2C%20je%20souhaite%20commander%20%2F%20louer%20un%20mat%C3%A9riel%20chez%20SBS%20Logistik."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1 font-bold text-emerald-300 hover:text-emerald-200 underline"
                    >
                      WhatsApp : +221 77 858 61 05
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-white/80" />
                  <a href={`mailto:${entity.email}`} className="hover:underline text-white break-all">
                    {entity.email}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 shrink-0 text-white/80 mt-0.5" />
                  <div className="text-white/90">
                    <div>{entity.address}</div>
                    <div>{entity.city}, {entity.country}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <Link
                  href={`/assistant?entite=${entity.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-neutral-900 font-bold rounded-m hover:bg-neutral-100 transition-colors"
                >
                  <span>{entity.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie photo standard pour les autres entités */}
      {id !== 'sbs-group' && id !== 'sbs-logistik' && gallery.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
          <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white mb-6">
            Galerie {entity.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((img, idx: number) => (
              <figure
                key={idx}
                className="group relative overflow-hidden rounded-l border border-neutral-200 dark:border-brand-700 bg-neutral-100 dark:bg-brand-800"
              >
                <div className="aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] leading-tight text-white">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* CATALOGUE MATÉRIEL & ENGINS LOURDS VALORISÉ PHOTO PAR PHOTO POUR SB-S LOGISTIK */}
      {id === 'sbs-logistik' && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
                Parc matériel, engins lourds & équipements SB-S Logistik
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                62 photographies réelles d&apos;engins et matériels vérifiées une par une depuis le document officiel &apos;PRESENTATION MATERIEL.pdf&apos;, avec caractéristiques d&apos;exploitation, matricules de parc et planches techniques 4K.
              </p>
            </div>
          </div>
          <SbsLogistikGallery />
        </section>
      )}

      {/* PHOTOTHEQUE COMPLETE VALORISEE PHOTO PAR PHOTO POUR SBS GROUP */}
      {id === 'sbs-group' && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-accent-500" />
            <div>
              <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
                Photothèque des réalisations, flotte & carte interactive SB-S Group
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                Chaque intervention de génie civil, ouvrage d&apos;art, équipement et bâtiment est documentée photo par photo (100% clichés réels authentiques), avec la carte interactive vectorielle de la base logistique centrale et des 7 corridors nationaux.
              </p>
            </div>
          </div>
          <SbsPresentationGallery />
        </section>
      )}

      {/* CATALOGUE OFFICIEL, FLYERS, BETON BPE, LOCATIONS & ACCES GESTIONNAIRE POUR SBS INDUSTRIES */}
      {id === 'sbs-industries' && (
        <SbsIndustriesPublicCatalog
          onOpenLightbox={(images, index, title) => setLightbox({ images, index, title })}
        />
      )}

      {/* Mission & Leadership */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white mb-3">
              Mission
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {entity.mission}
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-6">
            <h3 className="font-title font-bold text-neutral-900 dark:text-white text-lg mb-3">
              Direction
            </h3>
            <div className="text-sm">
              <p className="font-semibold text-neutral-900 dark:text-white">{entity.leader}</p>
              <p className="text-neutral-600 dark:text-neutral-400">{entity.leaderRole}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertises */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
        <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white mb-6">
          Domaines d'expertise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entity.expertises?.map((exp: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-l"
            >
              <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-800 dark:text-neutral-200">{exp}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Équipements (si disponibles) */}
      {entity.equipmentList && entity.equipmentList.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-accent-500" />
            <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
              Équipements & moyens techniques
            </h2>
          </div>
          <ul className="space-y-2">
            {entity.equipmentList.map((equip: string, idx: number) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                <span>{equip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Métriques vérifiées */}
      {entity.verifiedMetrics && entity.verifiedMetrics.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
          <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white mb-6">
            Indicateurs opérationnels vérifiés
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {entity.verifiedMetrics.map((metric: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-mono font-bold text-accent-500 mb-1">
                  {metric.value}
                  {metric.unit && <span className="text-base ml-1">{metric.unit}</span>}
                </div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {metric.label}
                </p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-400">Vérifié</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Synergies */}
      {entity.synergies && entity.synergies.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
          <div className="flex items-center gap-3 mb-6">
            <Network className="w-6 h-6 text-accent-500" />
            <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
              Synergies avec les autres entités
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entity.synergies.map((syn: any, idx: number) => (
              <div
                key={idx}
                className="bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-l p-4"
              >
                <Link
                  href={`/entites/${syn.entityId}`}
                  className="font-semibold text-accent-600 dark:text-accent-400 hover:underline block mb-2"
                >
                  → {syn.entityId}
                </Link>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  <strong>Rôle:</strong> {syn.role}
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  <strong>Bénéfice:</strong> {syn.benefit}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projets de l'entité */}
      {!projectsLoading && projects && projects.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
              Réalisations {entity.name}
            </h2>
            <Link
              href={`/projets?entite=${entity.id}`}
              className="text-xs font-semibold text-accent-500 hover:underline flex items-center gap-1"
            >
              <span>Voir tous les projets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter(
                (project: any, index: number, arr: any[]) =>
                  arr.findIndex((p: any) => (p.id ?? p.slug) === (project.id ?? project.slug)) === index,
              )
              .slice(0, 6)
              .map((project: any) => (
                <Link
                  key={`${project.id ?? project.slug}`}
                  href={`/projets/${project.slug}`}
                  className="group bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 hover:border-brand-600 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-2 transition-all"
                >
                  <div
                    className="relative aspect-[16/9] bg-neutral-200 dark:bg-brand-900 cursor-zoom-in"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (project.images && project.images.length > 0) {
                        setLightbox({ images: project.images, index: 0, title: project.title });
                      }
                    }}
                  >
                    {project.images && project.images[0] && (
                      <img
                        src={project.images[0].url}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2 left-2 bg-brand-900/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-white">
                      {project.status}
                    </div>
                    {project.images && project.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-brand-900/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-accent-400">
                        {project.images.length} photos
                      </div>
                    )}
                    <span className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform bg-brand-900/85 text-white text-[11px] font-mono py-1.5 text-center pointer-events-none">
                      Cliquer pour agrandir
                    </span>
                  </div>

                  {/* STRIP DE MINIATURES — jusqu'à 8 photos du projet visibles d'un coup d'oeil */}
                  {project.images && project.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-1.5 px-3 pt-1.5">
                      {project.images.slice(0, 8).map((img: any, i: number) => (
                        <div
                          key={i}
                          title="Cliquer pour agrandir"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLightbox({ images: project.images, index: i, title: project.title });
                          }}
                          className="relative aspect-square overflow-hidden rounded-l border border-neutral-200 dark:border-brand-700 bg-neutral-100 dark:bg-brand-800 cursor-zoom-in hover:ring-2 hover:ring-accent-500 transition-shadow"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.caption || project.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          {i === 7 && project.images.length > 8 && (
                            <div className="absolute inset-0 bg-brand-900/70 flex items-center justify-center text-[10px] font-mono font-bold text-white">
                              +{project.images.length - 8}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3">
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mb-1">
                      {project.location} · {project.year}
                    </span>
                    <h3 className="font-title font-bold text-sm text-neutral-900 dark:text-white line-clamp-2 group-hover:text-accent-500 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Catalogue produits de l'entité (ex: showroom P2M) */}
      {!productsLoading && entityProducts.length > 0 && (
        <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">
              {id === 'p2m' ? 'Catalogue Complet P2M' : 'Produits & Catalogue'}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {id === 'p2m' && (
                <>
                  <Link
                    href="/panier?entite=p2m"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-m bg-accent-500 text-white text-xs font-bold hover:bg-accent-600 transition-colors"
                  >
                    <span>Mon panier P2M</span>
                  </Link>
                  <Link
                    href="/entites/p2m/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-m bg-brand-900 dark:bg-brand-800 border border-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition-colors"
                  >
                    <span>Espace Gestionnaire P2M</span>
                  </Link>
                </>
              )}
              <Link
                href="/catalogue"
                className="text-xs font-semibold text-accent-500 hover:underline flex items-center gap-1"
              >
                <span>Voir tout le catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {entityProducts.map((product: any) => (
              <Link
                key={product.id}
                href={`/catalogue/${product.id}`}
                className="group bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 hover:border-brand-600 rounded-l overflow-hidden shadow-elev-1 hover:shadow-elev-2 transition-all"
              >
                <div className="relative aspect-square bg-neutral-200 dark:bg-brand-900">
                  {product.images && product.images[0] && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {product.isPriceVisible && product.indicativePriceFCFA && (
                    <div className="absolute bottom-2 right-2 bg-brand-900/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-mono text-white">
                      {product.indicativePriceFCFA.toLocaleString('fr-FR')} F/{product.unit || 'u'}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className="text-[10px] font-mono text-accent-600 dark:text-accent-400 block mb-1">
                    {product.ref}
                  </span>
                  <h3 className="font-title font-bold text-sm text-neutral-900 dark:text-white line-clamp-2 group-hover:text-accent-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 dark:text-neutral-400">{product.category}</span>
                    <span
                      className={`font-semibold ${
                        product.availability === 'En stock'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {product.availability}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Géolocalisation & Carte Interactive du Site */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InteractiveLocationMap initialSiteId={entity.id} />
      </section>

      {/* CTA Prise de contact */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="rounded-l p-8 text-center border"
          style={{
            backgroundColor: `${entity.colorHex}10`,
            borderColor: `${entity.colorHex}30`
          }}
        >
          <h2 className="text-2xl font-title font-bold text-neutral-900 dark:text-white mb-3">
            Prêt à démarrer avec {entity.name} ?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm max-w-2xl mx-auto mb-6">
            Contactez notre équipe pour un devis personnalisé ou une consultation technique.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/assistant?entite=${entity.id}`}
              className="px-6 py-3 text-white font-bold rounded-m shadow-elev-2 transition-all"
              style={{ backgroundColor: entity.colorHex }}
            >
              {entity.ctaText}
            </Link>
            <a
              href={`https://wa.me/${entity.whatsapp.replace(/[\s\+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border-2 text-neutral-900 font-bold rounded-m hover:bg-neutral-50 transition-all"
              style={{ borderColor: entity.colorHex }}
            >
              Contact WhatsApp
            </a>
          </div>
        </div>
      </section>

      {lightbox && (
        <PhotoLightbox
          images={lightbox.images}
          index={lightbox.index}
          onIndexChange={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : prev))}
          onClose={() => setLightbox(null)}
          title={lightbox.title}
        />
      )}
    </div>
  );
}