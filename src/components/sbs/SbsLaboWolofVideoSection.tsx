'use client';

import React from 'react';
import { Video, Download, ShieldCheck, Layers, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';

const VIDEO_URL = '/media/videos/etude-de-sol-sbs-labo-wolof.mp4';

export default function SbsLaboWolofVideoSection() {
  return (
    <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-950 text-white border border-emerald-500/30 shadow-xl p-6 sm:p-8 lg:p-10">
        {/* En-tête éditorial */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div className="max-w-3xl space-y-2.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide">
              <Video className="w-3.5 h-3.5" />
              Vidéo explicative en Wolof · Pédagogie chantier SB-S Labo
            </span>
            <h2 className="text-2xl sm:text-3xl font-title font-bold text-white tracking-tight">
              Comment se déroule une étude de sol par SB-S Labo ?
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Découvrez en images et en <strong>Wolof</strong> les étapes concrètes d&apos;une reconnaissance géotechnique sur terrain : pourquoi sonder le sol avant de construire, comment sont prélevés les échantillons et comment ces résultats sécurisent vos fondations.
            </p>
          </div>

          <a
            href={VIDEO_URL}
            download="Etude-de-sol-SB-S-Labo-Wolof.mp4"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-md shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger la vidéo (MP4)</span>
          </a>
        </div>

        {/* Lecteur vidéo + Points clés pédagogiques */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="relative rounded-xl overflow-hidden bg-black border-2 border-emerald-400/40 shadow-2xl">
              <video
                src={VIDEO_URL}
                poster="/images/reelles/sbs-labo-reel-005.jpg"
                controls
                playsInline
                preload="metadata"
                className="w-full max-h-[460px] object-contain bg-black"
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                01 · Sondages &amp; prélèvements sur site
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Forages géotechniques, essais au pénétromètre et identification des couches portantes avant le démarrage du chantier.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                02 · Analyses certifiées (LNR-BTP 24/S1/AG6)
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Essais en laboratoire à Ndiakhirate (Catégories C2 &amp; A3) sous la supervision d&apos;Aminata DRAMÉ et d&apos;Abdoulaye NIANG.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                03 · Sécurisation des fondations avec SERMA BTP
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Le rapport géotechnique permet à SERMA BTP de dimensionner les fondations au juste prix et d&apos;éviter fissures ou tassements.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://wa.me/221708350063?text=Bonjour%20Aminata%20DRAM%C3%89%2C%20je%20souhaite%20planifier%20une%20%C3%A9tude%20de%20sol%20avec%20SB-S%20Labo."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-brand-950 hover:bg-emerald-50 text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Commander une étude de sol (+221 70 835 00 63)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
