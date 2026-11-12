'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  Clock,
  Compass,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Building,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface CorridorHub {
  id: string;
  name: string;
  region: string;
  distanceKm: number;
  deploymentTime: string;
  coords: { lat: number; lng: number };
  mapPosition: { x: number; y: number }; // Percentage on SVG
  description: string;
  keyProjects: string[];
  equipmentFleet: string[];
  status: 'Actif' | 'Permanent' | 'Mobilisable';
}

const CORRIDORS: CorridorHub[] = [
  {
    id: 'base-dakar',
    name: 'Siège & Dépôt Central SB-S Group',
    region: 'Dakar / Diamniadio',
    distanceKm: 0,
    deploymentTime: 'Immédiat (< 30 min)',
    coords: { lat: 14.748471, lng: -17.436154 },
    mapPosition: { x: 12, y: 48 },
    description: 'Centre de commandement opérationnel, Bureau des Méthodes, ateliers de chaudronnerie lourde et base centrale de maintenance du parc matériel.',
    keyProjects: [
      'Bureau des Méthodes & Ingénierie Eurocodes',
      'Atelier Charpente & Chaudronnerie Diamniadio',
      'Port Autonome de Dakar (Coffrage silos & Centrale Bel Air)',
      'Immeuble R+7 Sandaga & Siège SUDES Parcelles Assainies'
    ],
    equipmentFleet: [
      'Grue mobile 50T',
      'Camions grues 6T',
      'Flotte de pompes à béton',
      'Camions bennes 40T',
      'Chargeurs & Dumpers FCY30R'
    ],
    status: 'Permanent'
  },
  {
    id: 'thies-carrieres',
    name: 'Pôle Thiès — Carrières & VRD Lourd',
    region: 'Région de Thiès',
    distanceKm: 70,
    deploymentTime: '< 1h30',
    coords: { lat: 14.791, lng: -16.925 },
    mapPosition: { x: 26, y: 46 },
    description: 'Corridor d\'approvisionnement massif en granulats et interventions sur sites miniers et carrières de concassage.',
    keyProjects: [
      'Mur de soutènement en béton armé carrière concassage (Earthwork/Polytech)',
      'Génie civil & massifs de fondation pour 2ème concasseur primaire',
      'Dallages industriels 12 000 m² & caniveaux VRD',
      'Hangar de stockage industriel de Thiès'
    ],
    equipmentFleet: [
      'Tractopelles & Chargeurs haute capacité',
      'Camions bennes 40T (rotation carrières)',
      'Bétonnières 1000L & Matériel de coffrage lourd'
    ],
    status: 'Actif'
  },
  {
    id: 'sendou-bargny',
    name: 'Pôle Côtier Sendou — Bargny — Énergie',
    region: 'Dakar Sud / Sendou',
    distanceKm: 35,
    deploymentTime: '< 45 min',
    coords: { lat: 14.695, lng: -17.29 },
    mapPosition: { x: 18, y: 56 },
    description: 'Pôle énergétique et industriel lourd côtoyeur du terminal minéralier et des centrales thermiques.',
    keyProjects: [
      'Centrale Électrique du Sénégal (CES Sendou) : Stockage produits chimiques',
      'Hangar industriel Sendou (Polytech Entreprise)',
      'Voiries béton et plateformes côtières'
    ],
    equipmentFleet: [
      'Camions malaxeurs & pompes à béton',
      'Grues mobiles télescopiques',
      'Matériel d\'étanchéité et bétonnage marin'
    ],
    status: 'Actif'
  },
  {
    id: 'petite-cote',
    name: 'Pôle Petite Côte — Mbour / Saly / Pointe Sarène',
    region: 'Thiès Sud',
    distanceKm: 85,
    deploymentTime: '< 2h00',
    coords: { lat: 14.42, lng: -16.96 },
    mapPosition: { x: 25, y: 65 },
    description: 'Aménagements autoroutiers, infrastructures pétrolières, résidences de standing et programmes hôteliers.',
    keyProjects: [
      'SECAA SA : Aire de lavage autoroute & Hangar de maintenance Sébikotane',
      'Station-service Titan Oil Mbacké / Mbour',
      'Rulmar : Complexe touristique Pointe Sarène & Résidence R+3 Nianing',
      'Villas d\'exception à Médinatoul Salam & Saly'
    ],
    equipmentFleet: [
      'Nacelles élévatrices',
      'Bennes & Toupies',
      'Équipements de finition & dallage quartz'
    ],
    status: 'Actif'
  },
  {
    id: 'nord-richard-toll',
    name: 'Corridor Fleuve Nord — Richard-Toll / Saint-Louis',
    region: 'Saint-Louis / Vallée du Fleuve',
    distanceKm: 375,
    deploymentTime: '< 5h00',
    coords: { lat: 16.46, lng: -15.7 },
    mapPosition: { x: 42, y: 15 },
    description: 'Génie civil agro-industriel de grande envergure pour l\'industrie sucrière et les périmètres hydro-agricoles.',
    keyProjects: [
      'Compagnie Sucrière Sénégalaise (CSS) : Chaudière industrielle grande hauteur',
      'Génie civil, massifs d\'ancrage & canaux de rejet d\'usine',
      'Ouvrages hydrauliques et réfection de silos'
    ],
    equipmentFleet: [
      'Grue mobile 50T mobilisée sur site',
      'Unité mobile de malaxage continu',
      'Coffrages verticaux haute sécurité'
    ],
    status: 'Actif'
  },
  {
    id: 'centre-kaffrine',
    name: 'Corridor Centre — Kaolack / Kaffrine',
    region: 'Bassin Arachidier / Centre',
    distanceKm: 255,
    deploymentTime: '< 3h30',
    coords: { lat: 14.11, lng: -15.55 },
    mapPosition: { x: 44, y: 68 },
    description: 'Infrastructures républicaines, équipements sportifs et bâtiments communautaires pour la jeunesse.',
    keyProjects: [
      'Maisons de la Jeunesse & de la Citoyenneté de Kaffrine',
      'Gradin omnisports 1 200 places en béton armé préfabriqué',
      'Restaurant municipal panoramique et espaces d\'accueil'
    ],
    equipmentFleet: [
      'Équipements de levage de préfabriqués',
      'Tractopelles & Compacteurs de sol',
      'Bétonnières mobiles & coffrages modulaires'
    ],
    status: 'Actif'
  },
  {
    id: 'sud-est-mako',
    name: 'Pôle Sud-Est Minier — Mako / Kédougou',
    region: 'Kédougou (Zone Minière de l\'Or)',
    distanceKm: 680,
    deploymentTime: 'Base Dépôt Déportée',
    coords: { lat: 12.87, lng: -12.35 },
    mapPosition: { x: 85, y: 82 },
    description: 'Travaux de haute technicité en milieu minier isolé : usine de gaz spéciaux, puisards étanches et rétention environnementale.',
    keyProjects: [
      'DLM Sénégal : Usine d\'oxygène PSA 6TPJ de Mako (civil, mécanique, électrique)',
      'Puisard industriel de collecte et traitement des eaux usées (9m profondeur)',
      'Réseaux fluides et massifs antivibratiles miniers'
    ],
    equipmentFleet: [
      'Bétonnières étanches & malaxeurs pour béton hydrofuge',
      'Pelles de terrassement rocheux',
      'Groupes électrogènes industriels autonomes'
    ],
    status: 'Actif'
  },
  {
    id: 'abidjan-pk24',
    name: 'Antenne Sous-Régionale — Abidjan PK 24 (Côte d\'Ivoire)',
    region: 'Côte d\'Ivoire (Corridor UEMOA)',
    distanceKm: 2100,
    deploymentTime: 'Équipe Résidente ETM-CI',
    coords: { lat: 5.36, lng: -4.01 },
    mapPosition: { x: 92, y: 35 },
    description: 'Rayonnement sous-régional SB-S Group pour les infrastructures cimentières et structures métalliques géantes.',
    keyProjects: [
      'LafargeHolcim CI : Hangar de stockage clinker de 7 890 m² au PK 24',
      'ETM - CI : Réfectoires 200 couverts, postes de garde et plateformes',
      'Structures acier grande portée (45m) et massifs de broyage'
    ],
    equipmentFleet: [
      'Grues de levage lourd spécialisées charpente',
      'Banches métalliques & outillage de chaudronnerie',
      'Bureau de supervision méthodes déporté'
    ],
    status: 'Actif'
  }
];

export default function SbsLogisticsMap() {
  const [selectedHub, setSelectedHub] = useState<CorridorHub>(CORRIDORS[0]);
  const [copiedGps, setCopiedGps] = useState<boolean>(false);

  const handleCopyGps = () => {
    navigator.clipboard.writeText('14.748471, -17.436154');
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 2500);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=14.748471,-17.436154`;

  return (
    <div className="w-full bg-white dark:bg-brand-850 rounded-2xl border border-neutral-200 dark:border-brand-700 shadow-lg overflow-hidden">
      {/* HEADER SECTION */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-900 via-brand-850 to-brand-950 text-white border-b border-brand-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/20 border border-accent-400/40 rounded-full text-xs font-mono font-bold text-accent-300">
              <Compass className="w-3.5 h-3.5" />
              Réseau logistique & disponibilité matérielle 98%
            </div>
            <h3 className="text-2xl sm:text-3xl font-title font-bold text-white tracking-tight">
              Base logistique centrale & corridors d&apos;intervention rapide
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Implantation stratégique à Dakar-Diamniadio assurant la mobilisation sous 3h de la flotte lourde (grues 50T, camions 40T, pompes et dumpers) sur l&apos;ensemble du territoire national et le corridor sous-régional.
            </p>
          </div>

          {/* GPS BADGE & GOOGLE MAPS LINK */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 shrink-0 space-y-3">
            <div className="text-[11px] font-mono text-accent-400 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-500" />
              <span>Coordonnées GPS officielles</span>
            </div>
            <div className="font-mono text-sm sm:text-base text-white font-bold tracking-wide">
              14.748471, -17.436154
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyGps}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/15"
              >
                {copiedGps ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGps ? 'Copié !' : 'Copier GPS'}</span>
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE MAP CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-neutral-200 dark:border-brand-700">
        {/* MAP VISUALIZATION CANVAS (8 COLS) */}
        <div className="lg:col-span-7 xl:col-span-8 p-4 sm:p-6 bg-brand-950 relative overflow-hidden flex flex-col justify-between min-h-[440px] select-none">
          {/* Subtle Grid Blueprint Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(249, 115, 22, 0.25) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Top Map Indicators */}
          <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
              <span>Maillage opérationnel temps réel (Sénégal & corridor ouest-africain)</span>
            </span>
            <span className="hidden sm:inline-block font-mono text-[11px] text-neutral-500">
              8 pôles stratégiques • 100% autonomie logistique
            </span>
          </div>

          {/* SENEGAL & CORRIDOR SVG MAP SCHEMATIC */}
          <div className="relative w-full h-[320px] sm:h-[380px] my-auto">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Radial Gradient for Base */}
                <radialGradient id="baseGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Corridor Lines from Central Base (12, 48) to all hubs */}
              {CORRIDORS.filter((h) => h.id !== 'base-dakar').map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <g key={`line-${hub.id}`}>
                    {/* Shadow / background line */}
                    <line
                      x1="12"
                      y1="48"
                      x2={hub.mapPosition.x}
                      y2={hub.mapPosition.y}
                      stroke={isSelected ? '#f97316' : '#334155'}
                      strokeWidth={isSelected ? '1.8' : '0.8'}
                      strokeDasharray={isSelected ? '2,2' : '1.5,1.5'}
                      className={isSelected ? 'animate-pulse' : ''}
                    />
                    {/* Pulsing Dot Moving Along Selected Corridor */}
                    {isSelected && (
                      <circle
                        cx={(12 + hub.mapPosition.x) / 2}
                        cy={(48 + hub.mapPosition.y) / 2}
                        r="1.2"
                        fill="#fb923c"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Central Base Radial Zone */}
              <circle cx="12" cy="48" r="8" fill="url(#baseGlow)" />
            </svg>

            {/* INTERACTIVE HOTSPOT PINS */}
            {CORRIDORS.map((hub) => {
              const isBase = hub.id === 'base-dakar';
              const isSelected = selectedHub.id === hub.id;

              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  style={{
                    left: `${hub.mapPosition.x}%`,
                    top: `${hub.mapPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute cursor-pointer group z-20"
                >
                  {/* Ping Animation for Base and Selected */}
                  {(isBase || isSelected) && (
                    <div
                      className={`w-7 h-7 rounded-full absolute -inset-1 opacity-75 animate-ping ${
                        isBase ? 'bg-accent-500' : 'bg-orange-400'
                      }`}
                    />
                  )}

                  {/* Hotspot Pin Icon */}
                  <div
                    className={`relative rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isBase
                        ? 'w-7 h-7 bg-accent-500 text-white border-2 border-white ring-4 ring-accent-500/40'
                        : isSelected
                        ? 'w-6 h-6 bg-accent-500 text-white border-2 border-white ring-2 ring-accent-400'
                        : 'w-4 h-4 bg-brand-800 text-neutral-300 border border-brand-600 hover:bg-accent-500 hover:scale-125'
                    }`}
                  >
                    {isBase ? (
                      <Building className="w-3.5 h-3.5" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Pin Label Tooltip */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all pointer-events-none shadow-md ${
                      isSelected || isBase
                        ? 'bg-brand-900 text-accent-300 border border-accent-500/50 opacity-100 z-30'
                        : 'bg-black/80 text-neutral-300 opacity-70 group-hover:opacity-100'
                    }`}
                  >
                    {isBase ? 'HQ SÉNÉGAL (Base Centrale)' : hub.name.split('—')[0].trim()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Helper */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-brand-800/80">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-500" />
              Base Centrale Diamniadio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              Pôles d&apos;intervention & corridors actifs
            </span>
            <span className="text-accent-400 font-mono">
              Cliquez sur un pôle pour afficher sa fiche
            </span>
          </div>
        </div>

        {/* DETAILS SIDEBAR PANEL (4 COLS) */}
        <div className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 bg-white dark:bg-brand-850 flex flex-col justify-between space-y-5">
          {/* Active Hub Title & Badges */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 rounded-full text-xs font-mono font-bold">
                {selectedHub.region}
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold font-mono">
                {selectedHub.status}
              </span>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-title font-bold text-neutral-900 dark:text-white leading-snug">
                {selectedHub.name}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-2">
                {selectedHub.description}
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-neutral-50 dark:bg-brand-900 rounded-lg border border-neutral-200 dark:border-brand-700">
                <span className="text-[10px] text-neutral-500 font-mono block">Distance siège</span>
                <span className="font-bold font-mono text-neutral-900 dark:text-white">
                  {selectedHub.distanceKm === 0 ? 'Site central' : `${selectedHub.distanceKm} km`}
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-brand-900 rounded-lg border border-neutral-200 dark:border-brand-700">
                <span className="text-[10px] text-neutral-500 font-mono block">Délai de mobilisation</span>
                <span className="font-bold text-accent-600 dark:text-accent-400">
                  {selectedHub.deploymentTime}
                </span>
              </div>
            </div>

            {/* Key Projects Done on this Hub */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-brand-800">
              <span className="text-[11px] font-mono font-bold text-neutral-500 block">
                Chantiers de référence livrés
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                {selectedHub.keyProjects.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-tight">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-500 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fleet pre-positioned / dispatched */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-brand-800">
              <span className="text-[11px] font-mono font-bold text-neutral-500 block">
                Matériel & engins déployés
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedHub.equipmentFleet.map((eq, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded text-[10px] text-neutral-700 dark:text-neutral-300 font-medium"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Hub Selector Buttons */}
          <div className="pt-3 border-t border-neutral-200 dark:border-brand-800">
            <span className="text-[10px] text-neutral-400 font-mono block mb-2">Changer de pôle territorial :</span>
            <div className="flex flex-wrap gap-1">
              {CORRIDORS.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setSelectedHub(hub)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                    selectedHub.id === hub.id
                      ? 'bg-accent-500 text-white'
                      : 'bg-neutral-100 dark:bg-brand-900 text-neutral-600 dark:text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {hub.id === 'base-dakar' ? 'Base Centrale' : hub.region.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
