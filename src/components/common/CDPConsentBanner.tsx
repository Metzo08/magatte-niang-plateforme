'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Check, X } from 'lucide-react';
import { store } from '@/lib/store';

export const CDPConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = store.getCDPConsent();
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    store.setCDPConsent(true);
    setShowBanner(false);
  };

  const handleRefuse = () => {
    store.setCDPConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement protection des données personnelles CDP Sénégal"
      className="fixed bottom-16 lg:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-brand-900 border border-brand-700 text-white rounded-l p-4 shadow-elev-3 animate-in slide-in-from-bottom-5 duration-300 text-xs"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-800 border border-brand-600 flex items-center justify-center text-emerald-400 shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div className="space-y-2 flex-1">
          <h4 className="font-title font-bold text-sm text-white flex items-center gap-1.5">
            Protection des données (CDP Sénégal)
          </h4>
          <p className="text-neutral-300 leading-relaxed text-[11px]">
            Conformément à la <strong>Loi n° 2008-12</strong> du Sénégal, la plateforme <em>Magatte Niang Expert</em> utilise uniquement les cookies strictement indispensables au routage sécurisé de vos demandes techniques et à la mesure d'audience anonymisée.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Accepter
            </button>
            <button
              onClick={handleRefuse}
              className="px-3 py-1.5 bg-brand-800 hover:bg-brand-700 text-neutral-300 font-medium rounded text-xs border border-brand-700 transition-colors"
            >
              Refuser
            </button>
            <Link
              href="/legal/confidentialite"
              className="text-[11px] text-brand-400 hover:underline ml-auto"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
