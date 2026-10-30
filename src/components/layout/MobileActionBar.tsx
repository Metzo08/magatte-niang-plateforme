'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Calculator } from 'lucide-react';

export const MobileActionBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Retract when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-brand-900/95 backdrop-blur-md border-t border-neutral-300 dark:border-brand-700 shadow-elev-3 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="region"
      aria-label="Actions rapides mobiles"
    >
      <div className="grid grid-cols-3 divide-x divide-neutral-200 dark:divide-brand-800 py-2 px-2 max-w-lg mx-auto">
        {/* ACTION: APPELER */}
        <a
          href="tel:+221338324010"
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-800 dark:text-neutral-200 hover:text-brand-700 active:scale-95 transition-transform touch-target"
          aria-label="Appeler la direction technique BTP"
        >
          <Phone className="w-5 h-5 text-brand-700 dark:text-brand-400 mb-1" />
          <span className="text-[11px] font-medium tracking-tight">Appeler</span>
        </a>

        {/* ACTION: WHATSAPP */}
        <a
          href="https://wa.me/221776381200?text=Bonjour%20Magatte%20Niang%20Expert,%20je%20souhaite%20un%20renseignement%20sur%20un%20projet%20BTP"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2 text-emerald-700 dark:text-emerald-400 active:scale-95 transition-transform touch-target"
          aria-label="Échanger sur WhatsApp"
        >
          <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1" />
          <span className="text-[11px] font-medium tracking-tight">WhatsApp</span>
        </a>

        {/* ACTION: DEVIS / ASSISTANT */}
        <Link
          href="/assistant"
          className="flex flex-col items-center justify-center py-1 px-2 bg-accent-500 text-white rounded-m shadow-sm active:scale-95 transition-transform touch-target"
          aria-label="Demander un devis ou qualifier un projet"
        >
          <Calculator className="w-5 h-5 text-white mb-1" />
          <span className="text-[11px] font-bold tracking-tight">Demander devis</span>
        </Link>
      </div>
    </div>
  );
};
