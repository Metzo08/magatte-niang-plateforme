'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Sparkles,
  Film,
  Layers,
  ArrowRight,
  Phone,
  CheckCircle2,
  RotateCcw,
  Radio,
} from 'lucide-react';

export interface PromoScene {
  id: string;
  step: string;
  entityName: string;
  entitySlug: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  narration: string;
  colorHex: string;
  image: string;
  audioUrl: string;
  contactLabel: string;
  contactHref: string;
  ctaLabel: string;
  ctaHref: string;
  kpis: { value: string; label: string }[];
}

export const PROMO_SCENES: PromoScene[] = [
  {
    id: 'scene-01',
    step: '01 / VISION & LEADERSHIP',
    entityName: 'Écosystème Magatte Niang Expert',
    entitySlug: 'ecosysteme',
    badge: '24 ANS D’EXPÉRIENCE · 7 ENTITÉS · 250+ PROJETS LIVRÉS',
    title: 'Bâtir l’Afrique de l’Ouest',
    highlight: 'par la rigueur d’ingénierie.',
    subtitle: 'Ing. Magatte Niang · Ponts & Chaussées · Enseignant-Chercheur & Président Fondateur',
    narration:
      '« Bâtir l’Afrique de l’Ouest par la rigueur d’ingénierie. Bienvenue dans l’écosystème Magatte Niang Expert : vingt-quatre ans d’excellence, sept entités complémentaires, et plus de deux cent cinquante projets majeurs livrés. »',
    colorHex: '#F26A1B',
    image: '/images/magatte-portrait.webp',
    audioUrl: '/audio/promo/scene-01.mp3',
    contactLabel: '+221 77 575 21 36',
    contactHref: 'https://wa.me/221775752136',
    ctaLabel: 'Découvrir le profil du Fondateur',
    ctaHref: '/profil',
    kpis: [
      { value: '24 ans', label: 'Expertise terrain' },
      { value: '7 entités', label: 'Chaîne 100% intégrée' },
      { value: '250+', label: 'Projets réalisés' },
      { value: '620', label: 'Emplois directs' },
    ],
  },
  {
    id: 'scene-02',
    step: '02 / ÉTAPE 1 : GÉOTECHNIQUE & MATÉRIAUX',
    entityName: 'SB-S Labo',
    entitySlug: 'sbs-labo',
    badge: 'LABORATOIRE AGRÉÉ LNR-BTP · CATÉGORIES C2 & A3',
    title: 'SB-S Labo',
    highlight: 'La vérité scientifique du sol & du béton.',
    subtitle:
      'Directrice Technique : Aminata Dramé (+221 70 835 00 63) · Responsable Laboratoire (Essais) : Ablaye Niang (+221 77 321 78 60)',
    narration:
      '« Tout grand ouvrage commence par la vérité du sol. Agréé catégories C2 et A3, SB-S Labo, sous la direction technique d’Aminata Dramé et d’Ablaye Niang pour les essais, certifie vos sols et vos bétons sous vingt-quatre heures. »',
    colorHex: '#1F9D6B',
    image: '/images/reelles/sbs-labo-reel-005.jpg',
    audioUrl: '/audio/promo/scene-02.mp3',
    contactLabel: 'WhatsApp Aminata Dramé : +221 70 835 00 63',
    contactHref: 'https://wa.me/221708350063',
    ctaLabel: 'Commander un essai de sol / béton',
    ctaHref: '/entites/sbs-labo',
    kpis: [
      { value: 'C2 & A3', label: 'Agréments d’État' },
      { value: '3 000 kN', label: 'Presse hydraulique' },
      { value: '24 heures', label: 'Délai PV standard' },
      { value: '12 800/an', label: 'Essais géotechniques' },
    ],
  },
  {
    id: 'scene-03',
    step: '03 / ÉTAPE 2 : MODÉLISATION 3D/BIM & CHARPENTE',
    entityName: 'SERMA BTP',
    entitySlug: 'serma-btp',
    badge: 'BUREAU D’ÉTUDES · MODÉLISATION 3D/BIM · CHARPENTE > 42M',
    title: 'SERMA BTP',
    highlight: 'Concevoir, modéliser et dimensionner.',
    subtitle:
      'Charpentes métalliques, pylônes, stations-service, IGH, ouvrages hydrauliques & maîtrise d’œuvre (Eurocodes)',
    narration:
      '« À partir de ces données, SERMA BTP conçoit et modélise vos structures en trois dimensions aux normes Eurocodes : charpentes métalliques de plus de quarante-deux mètres de portée libre, tours de grande hauteur, stations-service et maîtrise d’œuvre. »',
    colorHex: '#2B6CB0',
    image: '/images/reelles/projet-ces-stockage-sendou-03.jpg',
    audioUrl: '/audio/promo/scene-03.mp3',
    contactLabel: '+221 78 832 12 79',
    contactHref: 'https://wa.me/221788321279',
    ctaLabel: 'Explorer SERMA BTP',
    ctaHref: '/entites/serma-btp',
    kpis: [
      { value: '120+', label: 'Études 3D / BIM' },
      { value: '4 500 T/an', label: 'Capacité acier' },
      { value: '> 42 m', label: 'Portée libre' },
      { value: 'Eurocode 3', label: 'Calculs certifiés' },
    ],
  },
  {
    id: 'scene-04',
    step: '04 / ÉTAPE 3 : GÉNIE CIVIL & GRANDS TRAVAUX',
    entityName: 'SB-S Group',
    entitySlug: 'sbs-group',
    badge: 'STEIN BAUER SÉNÉGAL GROUP · GÉNIE CIVIL & INDUSTRIE',
    title: 'SB-S Group',
    highlight: 'La puissance d’exécution sur chantier.',
    subtitle: 'Bureau des Méthodes intégré · Responsable : Oumou Diop (+221 77 203 84 38 / +221 33 871 08 61)',
    narration:
      '« Sur le terrain, SB-S Group transforme les plans en ouvrages durables : génie civil lourd, centrales électriques, usines industrielles, voiries et bâtiments clés en main. »',
    colorHex: '#2D6A8E',
    image: '/images/reelles/sbs-reel-001.jpg',
    audioUrl: '/audio/promo/scene-04.mp3',
    contactLabel: 'WhatsApp Oumou Diop : +221 77 203 84 38',
    contactHref: 'https://wa.me/221772038438',
    ctaLabel: 'Découvrir SB-S Group',
    ctaHref: '/entites/sbs-group',
    kpis: [
      { value: '142 km', label: 'Voiries & VRD' },
      { value: '0 LTI', label: 'Sécurité chantier' },
      { value: 'Clé en main', label: 'Usines & IGH' },
      { value: 'Sénégal & CI', label: 'Grands chantiers' },
    ],
  },
  {
    id: 'scene-05',
    step: '05 / ÉTAPE 4 : CENTRALE À BÉTON & PRÉFABRICATION',
    entityName: 'SB-S Industries',
    entitySlug: 'sbs-industries',
    badge: 'CENTRALE BPE 60 M³/H · AGGLOS · HOURDIS · PAVÉS',
    title: 'SB-S Industries',
    highlight: 'La souveraineté industrielle du béton.',
    subtitle:
      'Production en ZFI de Mbao : Bétons C15 à C30 & pondeuse automatique · Responsable : Salimata Sow (+221 77 566 48 06)',
    narration:
      '« En Zone Franche Industrielle de Mbao, SB-S Industries alimente vos chantiers sans interruption grâce à sa centrale à béton de soixante mètres cubes par heure, ses agglos vibrés, ses hourdis et ses pavés haute résistance. »',
    colorHex: '#577590',
    image: '/images/reelles/agglos-industrie-production-blocs.jpg',
    audioUrl: '/audio/promo/scene-05.mp3',
    contactLabel: 'WhatsApp Salimata Sow : +221 77 566 48 06',
    contactHref: 'https://wa.me/221775664806',
    ctaLabel: 'Voir les tarifs Béton & Agglos',
    ctaHref: '/entites/sbs-industries',
    kpis: [
      { value: '60 m³/h', label: 'Centrale à béton' },
      { value: '250 m³/j', label: 'Capacité BPE' },
      { value: '380 F+', label: 'Agglos certifiés' },
      { value: '6 750 F/m²', label: 'Pavés 6 à 10 cm' },
    ],
  },
  {
    id: 'scene-06',
    step: '06 / ÉTAPE 5 : PARC DE 82 ENGINS LOURDS & AGRÉGATS',
    entityName: 'SB-S Logistik',
    entitySlug: 'sbs-logistik',
    badge: 'GRUES 50T · POMPES À BÉTON · TRACTOPELLES · BENNES 40T',
    title: 'SB-S Logistik',
    highlight: '82 engins lourds prêts à intervenir 24/7.',
    subtitle:
      'Location avec opérateurs certifiés, échafaudages, coffrages & granulats · Responsable : Rokhaya Kane (+221 77 858 61 05)',
    narration:
      '« Pour le levage et le terrassement, SB-S Logistik déploie une flotte de quatre-vingt-deux engins : grues mobiles cinquante tonnes, pompes à béton, tractopelles, bennes quarante tonnes et granulats certifiés. »',
    colorHex: '#E07A5F',
    image: '/images/sbs-logistik/logistik-equip-001.jpg',
    audioUrl: '/audio/promo/scene-06.mp3',
    contactLabel: 'WhatsApp Rokhaya Kane : +221 77 858 61 05',
    contactHref: 'https://wa.me/221778586105',
    ctaLabel: 'Louer un engin ou commander des agrégats',
    ctaHref: '/entites/sbs-logistik',
    kpis: [
      { value: '82 engins', label: 'Flotte opérationnelle' },
      { value: '50 tonnes', label: 'Grues mobiles' },
      { value: '24 / 7', label: 'Assistance chantier' },
      { value: '100%', label: 'Maintenance intégrée' },
    ],
  },
  {
    id: 'scene-07',
    step: '07 / ÉTAPE 6 : SHOWROOM CARRELAGE & SANITAIRE',
    entityName: 'P2M Showroom',
    entitySlug: 'p2m',
    badge: '4 BLOCS : CARRELAGE · SANITAIRE · ROBINETTERIE · FAÏENCE',
    title: 'Showroom P2M Mbao',
    highlight: 'L’élégance architecturale des finitions.',
    subtitle:
      'Grès cérame 30×30 à 80×240, marbres Calacatta, sanitaires suspendus ESTA, baignoires & robinetterie HKI',
    narration:
      '« Pour sublimer vos espaces, le Showroom P2M à Mbao réunit nos quatre blocs d’excellence : carrelages grand format, sanitaires design, robinetterie de précision et mosaïques de prestige. »',
    colorHex: '#C0562F',
    image: '/images/realisations/p2m-salle-de-bain-prestige.jpg',
    audioUrl: '/audio/promo/scene-07.mp3',
    contactLabel: 'Showroom P2M : +221 78 832 12 79',
    contactHref: 'https://wa.me/221788321279',
    ctaLabel: 'Visiter les 4 blocs du Showroom P2M',
    ctaHref: '/entites/p2m',
    kpis: [
      { value: '4 blocs', label: 'Showroom organisé' },
      { value: '29 formats', label: 'Carrelage en stock' },
      { value: '3 000 F/m²', label: 'Tarifs direct import' },
      { value: 'Devis PDF', label: 'Calculateur 1-clic' },
    ],
  },
  {
    id: 'scene-08',
    step: '08 / ÉTAPE 7 : SOURCING INTERNATIONAL & FRET',
    entityName: 'PGT (Dubaï - Ajman & Inde)',
    entitySlug: 'pgt',
    badge: 'SOURCING USINE DIRECT · FRET FCL/LCL · TRANSIT PAD',
    title: 'PGT Dubaï - Ajman',
    highlight: 'Votre pont logistique international.',
    subtitle:
      'Négoce international d’acier, équipements et matériaux avec dédouanement complet au Port Autonome de Dakar',
    narration:
      '« Et à l’échelle internationale, Polytech Global Trading, basé à Dubaï-Ajman et en Inde, assure le sourcing direct usine, le fret conteneurisé et le dédouanement complet au Port Autonome de Dakar. »',
    colorHex: '#D4A017',
    image: '/images/pgt/pgt-terminal-port-dakar.jpg',
    audioUrl: '/audio/promo/scene-08.mp3',
    contactLabel: 'WhatsApp PGT Dubaï : +971 52 763 1629',
    contactHref: 'https://wa.me/971527631629',
    ctaLabel: 'Contacter PGT Dubaï - Ajman',
    ctaHref: '/entites/pgt',
    kpis: [
      { value: 'Dubaï · Inde', label: 'Bureaux sourcing' },
      { value: '220+ EVP', label: 'Conteneurs livrés' },
      { value: 'FCL / LCL', label: 'Groupage & complet' },
      { value: 'PAD Dakar', label: 'Transit certifié' },
    ],
  },
  {
    id: 'scene-09',
    step: '09 / PASSEZ À L’ACTION DÈS AUJOURD’HUI',
    entityName: 'Magatte Niang Expert',
    entitySlug: 'contact',
    badge: 'DEVIS INSTANTANÉ · ASSISTANT IA 24/7 · RENDEZ-VOUS INGÉNIEUR',
    title: 'Confiez votre projet',
    highlight: 'à un écosystème d’excellence.',
    subtitle: 'De l’étude géotechnique à la remise des clés : un interlocuteur unique pour bâtir durablement.',
    narration:
      '« Un projet de construction, d’industrie ou d’aménagement ? Rendez-vous dès maintenant sur magatteniang-expert.sn. De l’étude de sol à la remise des clés : un seul écosystème, une maîtrise absolue. »',
    colorHex: '#F26A1B',
    image: '/images/reelles/sbs-reel-002.jpg',
    audioUrl: '/audio/promo/scene-09.mp3',
    contactLabel: '+221 78 832 12 79 / +221 33 871 08 61',
    contactHref: 'https://wa.me/221788321279',
    ctaLabel: 'Lancer mon chiffrage ou prendre RDV',
    ctaHref: '/assistant',
    kpis: [
      { value: '24h - 48h', label: 'Délai de chiffrage' },
      { value: '7 filiales', label: 'Synergie totale' },
      { value: 'Assistant IA', label: 'Devis en direct' },
      { value: 'Dakar · Dubaï', label: 'Présence globale' },
    ],
  },
];

export function EcosystemPromoVideoPlayer() {
  const [mode, setMode] = useState<'keynote' | 'mp4'>('mp4');
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlayingKeynote, setIsPlayingKeynote] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeScene = PROMO_SCENES[activeSceneIdx];

  // Keynote synchronized audio playback
  useEffect(() => {
    if (mode !== 'keynote') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingKeynote(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = activeScene.audioUrl;
    audio.muted = isMuted;

    if (isPlayingKeynote) {
      audio.play().catch(() => {
        setIsPlayingKeynote(false);
      });
    }
  }, [activeSceneIdx, mode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setSceneProgress(Math.min(100, (audio.currentTime / audio.duration) * 100));
  };

  const handleSceneEnded = () => {
    setSceneProgress(100);
    if (activeSceneIdx < PROMO_SCENES.length - 1) {
      setActiveSceneIdx((prev) => prev + 1);
      setSceneProgress(0);
    } else {
      setIsPlayingKeynote(false);
    }
  };

  const toggleKeynotePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlayingKeynote) {
      audio.pause();
      setIsPlayingKeynote(false);
    } else {
      audio.src = activeScene.audioUrl;
      audio.muted = isMuted;
      audio.play().catch(() => {});
      setIsPlayingKeynote(true);
    }
  };

  const selectScene = (idx: number) => {
    setActiveSceneIdx(idx);
    setSceneProgress(0);
    if (mode === 'mp4') {
      setMode('keynote');
      setIsPlayingKeynote(true);
    }
  };

  const handleFullscreen = () => {
    if (mode === 'mp4' && videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden bg-brand-950 border border-brand-800 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.75)] text-white"
    >
      {/* Hidden audio element for Keynote mode */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSceneEnded}
        preload="auto"
      />

      {/* Top Studio Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-brand-950/95 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/40 text-accent-400 text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            FILM OFFICIEL 2026 · VOIX OFF FR
          </span>
          <span className="hidden md:inline-block text-xs font-mono text-neutral-400">
            Présentation intégrale des 7 entités de l’écosystème Magatte Niang Expert
          </span>
        </div>

        {/* Mode Switcher + Download MP4 */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-brand-900 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setMode('mp4')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                mode === 'mp4'
                  ? 'bg-accent-500 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Film MP4 (Voix Off)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('keynote');
                setIsPlayingKeynote(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                mode === 'keynote'
                  ? 'bg-accent-500 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Keynote Interactive (9 chapitres)
            </button>
          </div>

          <a
            href="/videos/magatte-niang-promo-2026.mp4"
            download="Magatte-Niang-Expert-Film-Promotionnel-2026.mp4"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono font-bold text-white transition-colors"
            title="Télécharger la vidéo MP4 HD avec voix off"
          >
            <Download className="w-3.5 h-3.5 text-accent-400" />
            <span className="hidden sm:inline">Télécharger MP4</span>
          </a>
        </div>
      </div>

      {/* MAIN VIEWPORT : MP4 VIDEO OR INTERACTIVE KEYNOTE */}
      {mode === 'mp4' ? (
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            src="/videos/magatte-niang-promo-2026.mp4"
            poster="/images/reelles/sbs-reel-001.jpg"
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-brand-950"
          >
            Votre navigateur ne supporte pas la lecture vidéo HTML5.
          </video>
        </div>
      ) : (
        <div className="relative min-h-[520px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden">
          {/* Animated Ken Burns Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeScene.image}
            src={activeScene.image}
            alt={activeScene.entityName}
            className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 transition-transform duration-1000 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-900/70 pointer-events-none" />
          <div className="absolute inset-0 blueprint-grid-dense-dark opacity-30 pointer-events-none" />

          {/* Top Scene Status */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white shadow"
                style={{ backgroundColor: activeScene.colorHex }}
              >
                {activeScene.step}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-neutral-200">
                {activeScene.badge}
              </span>
            </div>

            {/* Keynote Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleKeynotePlay}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs font-mono font-bold transition-all shadow"
              >
                {isPlayingKeynote ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause Voix Off
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Écouter ce chapitre
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors"
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSceneIdx(0);
                  setSceneProgress(0);
                  setIsPlayingKeynote(true);
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors"
                title="Recommencer depuis le début"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleFullscreen}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors"
                title="Plein écran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Content Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight leading-tight">
                {activeScene.title}
                <span
                  className="block mt-1"
                  style={{ color: activeScene.colorHex === '#1B4965' ? '#63B3ED' : '#F6AD55' }}
                >
                  {activeScene.highlight}
                </span>
              </h3>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                {activeScene.subtitle}
              </p>

              {/* Live Subtitles / Voiceover Script Box */}
              <div className="p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 max-w-2xl">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-accent-400 mb-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  Transcription Voix Off Studio
                </div>
                <p className="text-xs sm:text-sm font-medium text-white/95 italic leading-relaxed">
                  {activeScene.narration}
                </p>
              </div>

              {/* Action Buttons for current Entity */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={activeScene.ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold transition-all shadow-lg"
                >
                  <span>{activeScene.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={activeScene.contactHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-mono font-bold transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{activeScene.contactLabel}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Card + 4 KPIs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-white/20 aspect-[16/10] shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeScene.image}
                  alt={activeScene.entityName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/15">
                    {activeScene.entityName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-black/60 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> Vérifié
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {activeScene.kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="p-3.5 rounded-xl bg-brand-900/90 border border-white/10"
                  >
                    <div className="text-lg sm:text-xl font-mono font-bold text-white tabular-nums">
                      {kpi.value}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">
                      {kpi.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Progress Bar */}
          <div className="relative z-10 space-y-2">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 transition-all duration-200"
                style={{ width: `${sceneProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive 9-Chapter Timeline Bar (Clickable in both modes) */}
      <div className="px-4 sm:px-6 py-4 bg-brand-900/95 border-t border-white/10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-500" />
            Chapitres du Film Institutionnel (cliquez sur une entité pour écouter sa présentation dédiée) :
          </span>
          <span className="text-[11px] font-mono text-accent-400">
            Chapitre {activeSceneIdx + 1} / {PROMO_SCENES.length}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {PROMO_SCENES.map((sc, idx) => {
            const isSelected = idx === activeSceneIdx && mode === 'keynote';
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => selectScene(idx)}
                className={`text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-accent-500/20 border-accent-500 text-white shadow'
                    : 'bg-brand-950/60 border-white/10 text-neutral-400 hover:text-white hover:border-white/25'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-accent-400">
                  0{idx + 1}
                </div>
                <div className="text-xs font-title font-bold truncate mt-0.5">
                  {sc.entityName.replace('Écosystème ', '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
