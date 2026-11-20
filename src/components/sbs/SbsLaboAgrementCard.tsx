'use client';

import React, { useState } from 'react';
import { Award, FileCheck2, Download, Eye, EyeOff, ShieldCheck, Calendar, Building2, MapPin, Scale } from 'lucide-react';

const PDF_URL = '/media/documents/agrement-lnr-btp-sbs-labo-24-S1-AG6.pdf';
const IMG_URL = '/media/documents/agrement-lnr-btp-sbs-labo-24-S1-AG6.jpg';

export default function SbsLaboAgrementCard() {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Award className="w-4 h-4" /> Certification officielle d&apos;État · MITTA / LNR-BTP
          </span>
          <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-1">
            Certificat d&apos;Agrément LNR-BTP · Réf. N° 24/S1/AG6
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
            Agrément officiel délivré par le Laboratoire National de Référence des Bâtiments et Travaux Publics (LNR-BTP) sous l&apos;égide du Ministère des Infrastructures et des Transports Terrestres et Aériens (MITTA).
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowPdf((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
          >
            {showPdf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPdf ? 'Masquer le certificat' : 'Visualiser le document officiel'}</span>
          </button>
          <a
            href={PDF_URL}
            download="Certificat-Agrement-LNR-BTP-SBS-LABO-24-S1-AG6.pdf"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-900 dark:bg-brand-800 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold border border-brand-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Télécharger le PDF</span>
          </a>
        </div>
      </div>

      {/* Grille structurée des données officielles extraites du certificat */}
      <div className="bg-gradient-to-br from-emerald-50/70 via-white to-neutral-50 dark:from-brand-900 dark:via-brand-900/90 dark:to-brand-950 border-2 border-emerald-500/35 rounded-xl p-5 sm:p-7 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white dark:bg-brand-950/80 border border-neutral-200 dark:border-brand-700">
            <div className="text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Référence officielle
            </div>
            <div className="text-lg font-mono font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
              24/S1/AG6
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-brand-950/80 border border-neutral-200 dark:border-brand-700">
            <div className="text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Classification agréée
            </div>
            <div className="text-lg font-title font-extrabold text-neutral-900 dark:text-white mt-1">
              Catégorie C2
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Essais &amp; études géotechniques
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-brand-950/80 border border-neutral-200 dark:border-brand-700">
            <div className="text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Période de validité
            </div>
            <div className="text-base font-mono font-bold text-neutral-900 dark:text-white mt-1">
              01/08/2024 → 31/07/2027
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Durée de validité : 3 ans
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-brand-950/80 border border-neutral-200 dark:border-brand-700">
            <div className="text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" /> Autorité signataire
            </div>
            <div className="text-sm font-title font-bold text-neutral-900 dark:text-white mt-1">
              Pr. Chérif BALDE
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Directeur général du LNR-BTP
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
          <div className="p-4 rounded-lg bg-white/80 dark:bg-brand-950/60 border border-neutral-200 dark:border-brand-700 space-y-2">
            <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Entité agréée &amp; implantation
            </div>
            <p>
              <strong>Raison sociale :</strong> STEIN BAUER SENEGAL LABORATOIRE SARL (SBS LABO SARL)
            </p>
            <p className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Adresse inscrite :</strong> Ndiakhirate, Cité Assemblée, Villa N° 226</span>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/80 dark:bg-brand-950/60 border border-neutral-200 dark:border-brand-700 space-y-2">
            <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Base légale &amp; référentiel réglementaire
            </div>
            <ul className="space-y-1 text-xs leading-relaxed">
              <li>• <strong>Loi n°2023-12</strong> du 21 juin 2023 (contrôle des laboratoires d&apos;essais et d&apos;études BTP)</li>
              <li>• <strong>Décret n°2023-1780</strong> du 29 août 2023 (organisation et fonctionnement du LNR-BTP)</li>
              <li>• <strong>Arrêté n°002464</strong> du 07 février 2024 (système d&apos;agrément et de classification des laboratoires)</li>
            </ul>
          </div>
        </div>

        {showPdf && (
          <div className="mt-6 rounded-xl overflow-hidden border-2 border-emerald-500/30 bg-white shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG_URL}
              alt="Certificat d'Agrément LNR-BTP SB-S Labo (24/S1/AG6)"
              className="w-full h-auto block"
            />
          </div>
        )}
      </div>
    </section>
  );
}
