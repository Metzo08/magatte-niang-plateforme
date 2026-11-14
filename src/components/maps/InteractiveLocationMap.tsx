'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Phone,
  Clock,
  Compass,
  Layers,
  Building,
  ShieldCheck,
  Share2,
  Car
} from 'lucide-react';

export interface SiteLocation {
  id: string;
  name: string;
  badge: string;
  role: string;
  plusCode: string;
  coords: { lat: number; lng: number };
  address: string;
  city: string;
  phone: string;
  whatsapp?: string;
  leader?: string;
  hours: string;
  googleMapsUrl: string;
  directionsUrl: string;
  wazeUrl: string;
  description: string;
  highlights: string[];
}

export const OFFICIAL_SITES: SiteLocation[] = [
  {
    id: 'sbs-group',
    name: 'SB-S Group · Siège & Exécution des Travaux',
    badge: 'SB-S Group · Siège principal & usine',
    role: 'Exécution des travaux BTP, génie civil, ouvrages d’art et direction générale',
    plusCode: 'PMX9+CHV, Dakar',
    coords: { lat: 14.7486088, lng: -17.3310687 },
    address: 'Mbao Villeneuve, Villa S04, Route Nationale (à proximité immédiate de la Zone Franche Industrielle ZFI de Mbao)',
    city: 'Mbao, Dakar (Pikine)',
    phone: '+221 33 871 08 61',
    whatsapp: '+221 77 203 84 38',
    leader: 'Magatte NIANG (DG) · Oumou DIOP (Responsable SBS-GROUP)',
    hours: 'Lun–Sam : 08h00 – 18h00',
    googleMapsUrl: 'https://www.google.com/maps/place/SBS-GROUP/@14.7486088,-17.3310687,17z/data=!3m1!4b1!4m6!3m5!1s0xec10bbf4e072a31:0xfd8cb427cbcc2356!8m2!3d14.7486088!4d-17.3310687!16s%2Fg%2F11fqzg5jpj?hl=fr-SN',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=14.7486088,-17.3310687',
    wazeUrl: 'https://waze.com/ul?ll=14.7486088,-17.3310687&navigate=yes',
    description: 'Implantation stratégique sur la Route Nationale à Mbao : SB-S Group pilote l’exécution complète des travaux à partir des études de SERMA BTP, en synergie avec SBS Logistik, SBS Industrie et P2M.',
    highlights: [
      'Plus Code officiel : PMX9+CHV, Dakar',
      'Exécution des grands chantiers BTP & génie civil',
      'Coordination directe avec SERMA BTP (études) & filiales',
      'Responsable SBS-GROUP : Oumou DIOP (+221 77 203 84 38)',
    ],
  },
  {
    id: 'sbs-industries',
    name: 'SBS Industrie · Usine de Préfabrication Mbao',
    badge: 'SBS Industrie · Usine de préfabrication Mbao',
    role: 'Fourniture de briques (agglos), pavés autobloquants, hourdis et béton prêt à l’emploi (BPE)',
    plusCode: 'PMX9+CHV, Dakar',
    coords: { lat: 14.7486088, lng: -17.3310687 },
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    city: 'Mbao, Dakar (Pikine)',
    phone: '+221 33 871 08 61',
    whatsapp: '+221 77 566 48 06',
    leader: 'Salimata SOW (Responsable SBS Industrie)',
    hours: 'Lun–Sam : 07h30 – 18h00',
    googleMapsUrl: 'https://www.google.com/maps/place/SBS-GROUP/@14.7486088,-17.3310687,17z/data=!3m1!4b1!4m6!3m5!1s0xec10bbf4e072a31:0xfd8cb427cbcc2356!8m2!3d14.7486088!4d-17.3310687!16s%2Fg%2F11fqzg5jpj?hl=fr-SN',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=14.7486088,-17.3310687',
    wazeUrl: 'https://waze.com/ul?ll=14.7486088,-17.3310687&navigate=yes',
    description: 'Parc industriel de 20 000 m² fournissant les briques, pavés, hourdis et le béton prêt à l’emploi (BPE) pour la construction sur les chantiers du groupe et clients externes.',
    highlights: [
      'Capacité : 25 000 agglos / jour & centrale BPE 60 m³/h',
      'Responsable : Salimata SOW (+221 77 566 48 06)',
      'Laboratoire interne de contrôle de compression',
      'Chargement instantané sur palettes sécurisées',
    ],
  },
  {
    id: 'sbs-logistik',
    name: 'SBS Logistik · Base Logistique Mbao',
    badge: 'SBS Logistik · Base logistique Mbao',
    role: 'Fourniture du matériel, engins lourds, grues et transport pour le travail sur les différents chantiers',
    plusCode: 'PMX9+CHV, Dakar',
    coords: { lat: 14.7486088, lng: -17.3310687 },
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    city: 'Mbao, Dakar (Pikine)',
    phone: '+221 33 871 08 61',
    whatsapp: '+221 77 858 61 05',
    leader: 'Rokhaya KANE (Responsable SBS Logistik)',
    hours: '24h/24 & 7j/7 sur astreinte chantiers',
    googleMapsUrl: 'https://www.google.com/maps/place/SBS-GROUP/@14.7486088,-17.3310687,17z/data=!3m1!4b1!4m6!3m5!1s0xec10bbf4e072a31:0xfd8cb427cbcc2356!8m2!3d14.7486088!4d-17.3310687!16s%2Fg%2F11fqzg5jpj?hl=fr-SN',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=14.7486088,-17.3310687',
    wazeUrl: 'https://waze.com/ul?ll=14.7486088,-17.3310687&navigate=yes',
    description: 'Base opérationnelle fournissant les engins lourds, grues mobiles, pompes à béton et équipements nécessaires aux chantiers.',
    highlights: [
      'Disponibilité permanente grues 35T à 80T',
      'Responsable : Rokhaya KANE (+221 77 858 61 05)',
      'Porte-chars & transport convoi exceptionnel',
      'SAV et assistance mobile d’intervention rapide',
    ],
  },
  {
    id: 'serma-btp',
    name: 'SERMA BTP · Bureau d’Études, Modélisation & Charpente',
    badge: 'SERMA BTP · Études, modélisation & atelier',
    role: 'Études techniques, simulations logicielles 3D/BIM, maîtrise d’œuvre (AMO), IGH & charpente métallique',
    plusCode: 'PR59+7V, Dakar',
    coords: { lat: 14.7391, lng: -17.3822 },
    address: 'Zone Industrielle de Dakar, Km 14 Route de Rufisque',
    city: 'Dakar',
    phone: '+221 33 832 40 10',
    whatsapp: '+221 77 267 16 17',
    leader: 'Direction Technique SERMA BTP (serma@sermabtp.com / sermabtp@gmail.com)',
    hours: 'Lun–Sam : 07h30 – 18h00',
    googleMapsUrl: 'https://www.google.com/maps/search/SERMA+BTP+Dakar',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=14.7391,-17.3822',
    wazeUrl: 'https://waze.com/ul?ll=14.7391,-17.3822&navigate=yes',
    description: 'Bureau d’études et de modélisation logicielle (bâtiments IGH, charpente métallique, pylônes, stations-service, ouvrages hydrauliques, lots techniques, maîtrise d’œuvre AMO) qui conçoit les projets avant exécution par SB-S Group.',
    highlights: [
      'Modélisation 3D, simulations logicielles & calculs Eurocodes',
      'Maîtrise d’œuvre, AMO & supervision de chantiers',
      'Emails : serma@sermabtp.com / sermabtp@gmail.com',
    ],
  },
  {
    id: 'sbs-labo',
    name: 'SB-S Labo · Laboratoire Géotechnique Agréé',
    badge: 'SB-S Labo · Laboratoire géotechnique agréé',
    role: 'Essais de sols, carottage, formulation de béton et contrôle de conformité (agréments C2 & A2)',
    plusCode: 'MQ7G+8Q, Dakar',
    coords: { lat: 14.7125, lng: -17.4645 },
    address: 'Cité Keur Gorgui / Route de Rufisque Km 12, Dakar',
    city: 'Dakar',
    phone: '+221 33 834 18 90',
    whatsapp: '+221 77 267 16 17',
    leader: 'Ingénieurs Géotechniciens SB-S Labo',
    hours: 'Lun–Ven : 08h00 – 17h30',
    googleMapsUrl: 'https://www.google.com/maps/search/SBS+Labo+Keur+Gorgui+Dakar',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=14.7125,-17.4645',
    wazeUrl: 'https://waze.com/ul?ll=14.7125,-17.4645&navigate=yes',
    description: 'Laboratoire de pointe doté de presses de compression hydrauliques 3000 kN, pénétromètres dynamiques et matériel d’auscultation non destructif.',
    highlights: [
      'Essais de compression béton à 7, 14 et 28 jours',
      'Sondages pénétrométriques & études de fondations',
      'Certificats d’essais officiels pour bureaux de contrôle',
    ],
  },
];

interface InteractiveLocationMapProps {
  initialSiteId?: string;
  showSelector?: boolean;
  className?: string;
}

export default function InteractiveLocationMap({
  initialSiteId = 'sbs-group',
  showSelector = true,
  className = '',
}: InteractiveLocationMapProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(initialSiteId);
  const [copied, setCopied] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [zoomLevel, setZoomLevel] = useState<number>(16);

  const currentSite =
    OFFICIAL_SITES.find((s) => s.id === selectedSiteId) || OFFICIAL_SITES[0];

  const handleCopyPlusCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentSite.plusCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Google Maps embed URL with live satellite/hybrid or standard map view
  const mapEmbedUrl =
    mapMode === 'satellite'
      ? `https://maps.google.com/maps?q=${currentSite.coords.lat},${currentSite.coords.lng}+(${encodeURIComponent(
          currentSite.name
        )})&t=k&z=${zoomLevel}&output=embed`
      : `https://maps.google.com/maps?q=${currentSite.coords.lat},${currentSite.coords.lng}+(${encodeURIComponent(
          currentSite.name
        )})&t=m&z=${zoomLevel}&output=embed`;

  return (
    <div
      id="geolocalisation-carte"
      className={`bg-white dark:bg-brand-900 rounded-2xl border border-neutral-200 dark:border-brand-700 shadow-xl overflow-hidden ${className}`}
    >
      {/* Header bar */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-accent-600 text-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-accent-400 shrink-0">
              <MapPin className="w-6 h-6 text-accent-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-accent-500/20 text-accent-300 border border-accent-400/30 font-semibold">
                  Géolocalisation Officielle
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-200">
                  Zone Franche Mbao · Dakar
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                Carte Interactive des Sites & Usines BTP
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-0.5">
                Plus Code certifié Google Maps :{' '}
                <strong className="text-accent-300 font-mono">PMX9+CHV, Dakar</strong> · Mbao Villeneuve / ZFI
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={currentSite.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent-500 hover:bg-accent-400 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Ouvrir Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
            <a
              href={currentSite.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors border border-white/20"
            >
              <Car className="w-4 h-4 text-accent-300" />
              <span>Itinéraire GPS</span>
            </a>
          </div>
        </div>

        {/* Site Selector Tabs */}
        {showSelector && (
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {OFFICIAL_SITES.map((site) => {
              const isActive = site.id === selectedSiteId;
              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-brand-900 shadow-md font-bold'
                      : 'bg-white/10 text-neutral-200 hover:bg-white/20'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      site.id.startsWith('sbs') ? 'bg-accent-500' : 'bg-emerald-400'
                    }`}
                  />
                  <span>{site.badge}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Map & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive Google Maps Iframe (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] bg-neutral-100 dark:bg-brand-950">
          <iframe
            title={`Carte interactive ${currentSite.name}`}
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '440px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full min-h-[400px] lg:min-h-[500px]"
          />

          {/* Map Controls Floating Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-900/90 backdrop-blur-md text-white p-1 rounded-xl shadow-lg border border-white/10 text-xs">
            <button
              onClick={() => setMapMode('standard')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                mapMode === 'standard' ? 'bg-accent-500 text-white font-bold' : 'hover:bg-white/10'
              }`}
            >
              Plan
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                mapMode === 'satellite' ? 'bg-accent-500 text-white font-bold' : 'hover:bg-white/10'
              }`}
            >
              Satellite
            </button>
            <span className="h-4 w-px bg-white/20 mx-1" />
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
              className="px-2 py-1 hover:bg-white/10 rounded-lg text-white font-bold"
              title="Zoom +"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 12))}
              className="px-2 py-1 hover:bg-white/10 rounded-lg text-white font-bold"
              title="Zoom -"
            >
              −
            </button>
          </div>

          {/* Plus Code Overlay on Map */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex items-center justify-between gap-2 bg-white/95 dark:bg-brand-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-neutral-200 dark:border-brand-700 text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent-500 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block font-semibold">
                  Code Plus Google Maps
                </span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  {currentSite.plusCode}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyPlusCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-brand-800 hover:bg-accent-50 text-neutral-700 dark:text-neutral-200 hover:text-accent-600 transition-colors text-[11px] font-semibold"
              title="Copier le code plus pour GPS"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Detailed Site Information Panel (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between bg-neutral-50/50 dark:bg-brand-850">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
                {currentSite.badge}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Site ouvert
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white leading-tight">
              {currentSite.name}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {currentSite.role}
            </p>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-neutral-900 dark:text-white">Adresse exacte :</strong>
                  <span>{currentSite.address}</span>
                  <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                    {currentSite.city} · Coordonnées : {currentSite.coords.lat.toFixed(5)}, {currentSite.coords.lng.toFixed(5)}
                  </span>
                </div>
              </div>

              {currentSite.leader && (
                <div className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                  <Building className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 dark:text-white">Responsable du site :</strong>
                    <span>{currentSite.leader}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                <Clock className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-neutral-900 dark:text-white">Horaires de réception :</strong>
                  <span>{currentSite.hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                <Phone className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-neutral-900 dark:text-white">Téléphone & commandes :</strong>
                  <a
                    href={`tel:${currentSite.phone.split('/')[0].trim().replace(/\s/g, '')}`}
                    className="text-accent-600 dark:text-accent-400 font-semibold hover:underline block"
                  >
                    {currentSite.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Highlights bullet points */}
            <div className="mt-5 p-3.5 bg-white dark:bg-brand-900 rounded-xl border border-neutral-200 dark:border-brand-700">
              <span className="text-xs font-bold text-neutral-900 dark:text-white block mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-500" />
                Points clés du site
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                {currentSite.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-brand-700 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {currentSite.whatsapp && (
              <a
                href={`https://wa.me/${currentSite.whatsapp.replace(/[\s\+]/g, '')}?text=${encodeURIComponent(
                  `Bonjour ${currentSite.name}, je souhaite me rendre sur votre site à Mbao / obtenir un devis.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all text-center"
              >
                <span>WhatsApp Direct</span>
              </a>
            )}
            <a
              href={currentSite.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-brand-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all text-center"
            >
              <Navigation className="w-4 h-4" />
              <span>Itinéraire GPS</span>
            </a>
            <a
              href={currentSite.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-colors"
              title="Ouvrir dans Waze"
            >
              <span>Waze</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
