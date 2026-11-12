'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
import { CDPConsentBanner } from '@/components/common/CDPConsentBanner';
import { GlobalSearchModal } from '@/components/common/GlobalSearchModal';
import { AIAssistantModal } from '@/components/common/AIAssistantModal';
import { SentenceCaseEnforcer } from '@/components/common/SentenceCaseEnforcer';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <>
      {/* SKIP LINK FOR KEYBOARD ACCESSIBILITY (WCAG 2.2 AA) */}
      <SentenceCaseEnforcer />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-500 focus:text-white focus:rounded focus:shadow-elev-3 focus:outline-none"
      >
        Aller au contenu principal
      </a>

      {/* HEADER */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* MAIN CONTENT WITH PADDING FOR MOBILE ACTION BAR */}
      <main id="main-content" className="flex-1 pb-16 lg:pb-0 focus:outline-none">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* PERSISTENT MOBILE ACTION BAR */}
      <MobileActionBar />

      {/* CDP SENEGAL COOKIE CONSENT */}
      <CDPConsentBanner />

      {/* GLOBAL SEARCH MODAL */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* AI ASSISTANT MODAL */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* BOUTON FLOTTANT ASSISTANT IA (EN BAS À DROITE) */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center group">
        {/* Tooltip interactif */}
        <div className="hidden sm:flex items-center gap-2 mr-3 px-3 py-1.5 bg-brand-900/95 dark:bg-brand-950/95 text-white text-xs font-semibold rounded-full shadow-elev-3 border border-brand-700/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Besoin d'un conseil ? Assistant IA BTP</span>
        </div>

        <button
          onClick={() => setIsAIOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-accent-600 via-accent-500 to-amber-500 hover:from-accent-500 hover:to-accent-600 text-white shadow-elev-3 hover:shadow-[0_0_25px_rgba(242,106,27,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40 focus:outline-none focus:ring-4 focus:ring-accent-500/40"
          aria-label="Ouvrir l'Assistant IA Technique BTP"
          title="Assistant IA Technique BTP — Conseils, tarifs & chiffrage"
        >
          {/* Halo pulsant */}
          <span className="absolute -inset-1 rounded-full bg-accent-500/40 animate-ping pointer-events-none" />

          {/* Pastille verte en ligne */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-brand-900 shadow-sm" />

          {/* Avatar maçon */}
          <img src="/chatbot-macon.svg" alt="Assistant IA BTP" className="relative w-9 h-9" />
        </button>
      </div>
    </>
  );
}
