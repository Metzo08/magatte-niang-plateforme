'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  eyebrow,
  title,
  intro,
  updatedAt,
  sections,
}) => {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-900">
      {/* En-tête institutionnel */}
      <section className="bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-accent-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500/10 border-gold-500/30 rounded-full text-xs font-mono font-bold  tracking-wider text-gold-500 mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {eyebrow}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold text-white tracking-tight">
            {title}
          </h1>

          <p className="text-neutral-300 text-base leading-relaxed mt-5 max-w-3xl">
            {intro}
          </p>

          <p className="text-xs font-mono  tracking-wider text-neutral-500 mt-6">
            Dernière mise à jour : {updatedAt}
          </p>
        </div>
      </section>

      {/* Corps éditorial */}
      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-reading">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="mb-10 pb-10 border-b border-neutral-200 dark:border-brand-700 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-accent-500 shrink-0 mt-1.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white tracking-tight">
                  {section.heading}
                </h2>
              </div>

              {section.paragraphs?.map((p, i) => (
                <p
                  key={i}
                  className="text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3 pl-8"
                >
                  {p}
                </p>
              ))}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 pl-8 mt-2">
                  {section.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0 mt-2" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Encadré de contact conformité */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-xl p-5 sm:p-6">
          <div>
            <h3 className="font-title font-bold text-neutral-900 dark:text-white">
              Question sur vos données ?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Le délégué à la protection des données répond sous 72h ouvrées.
            </p>
          </div>
          <a
            href="mailto:contact@magatteniang-expert.sn"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-sm transition-all whitespace-nowrap shrink-0"
          >
            Contacter le DPO
          </a>
        </div>
      </section>
    </div>
  );
};
