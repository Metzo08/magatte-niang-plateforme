'use client';

import React from 'react';
import { Users, Briefcase, Wrench, ShieldCheck, Calculator } from 'lucide-react';

interface TechnicalPole {
  pole: string;
  responsable: string | null;
  role: string;
  sub: { role: string; name: string } | null;
  accent: string;
}

const TECHNICAL_POLES: TechnicalPole[] = [
  {
    pole: 'Charpente Métallique',
    responsable: 'Ndeye Sokhna BAKHOUM',
    role: 'Responsable Charpente Métallique',
    sub: { role: 'Dessinateur', name: 'Mamadou Lamine DIALLO' },
    accent: 'border-amber-500/60 bg-amber-50/70 dark:bg-amber-950/30',
  },
  {
    pole: 'Béton Armé (BA)',
    responsable: 'Mouhamed DIALLO',
    role: 'Responsable Béton Armé',
    sub: { role: 'Dessinateur', name: 'Adjia MAREME' },
    accent: 'border-blue-500/60 bg-blue-50/70 dark:bg-blue-950/30',
  },
  {
    pole: 'Hydraulique & Élaboration',
    responsable: null,
    role: 'Études hydrauliques & élaboration',
    sub: null,
    accent: 'border-cyan-500/60 bg-cyan-50/70 dark:bg-cyan-950/30',
  },
  {
    pole: 'Supervision & Diagnostic',
    responsable: 'Ousseynou FALL',
    role: 'Responsable Supervision & Diagnostic',
    sub: { role: 'Dessinateur', name: 'Mouhamed DIOP' },
    accent: 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/30',
  },
  {
    pole: 'Lots Techniques',
    responsable: 'Cheikh BÈYE',
    role: 'Responsable Lots Techniques',
    sub: { role: 'Dessinateur', name: 'Dessinateur lots techniques' },
    accent: 'border-purple-500/60 bg-purple-50/70 dark:bg-purple-950/30',
  },
];

export default function SermaOrganigramme() {
  return (
    <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-neutral-200 dark:border-brand-700">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider">
          <Users className="w-4 h-4" /> Organisation interne · SERMA BTP
        </span>
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-1">
          Organigramme officiel SERMA BTP
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
          Structure hiérarchique et opérationnelle autour de la Direction Générale, de la Direction Technique (DT) et de la Direction Administrative.
        </p>
      </div>

      <div className="bg-white dark:bg-brand-900/70 border border-neutral-200 dark:border-brand-700 rounded-l p-5 sm:p-8 shadow-sm">
        {/* Niveau 1 : DG */}
        <div className="flex flex-col items-center">
          <div className="px-6 py-4 rounded-xl bg-brand-900 dark:bg-accent-600 text-white shadow-md text-center min-w-[240px] border-2 border-accent-400">
            <div className="text-[10px] font-mono uppercase tracking-widest text-accent-300 dark:text-white/80 font-bold">
              Directeur Général (DG)
            </div>
            <div className="text-lg font-title font-extrabold mt-0.5">Magatte NIANG</div>
          </div>

          {/* Connecteur vertical */}
          <div className="w-0.5 h-8 bg-neutral-300 dark:bg-brand-600" />
        </div>

        {/* Connecteur horizontal vers DT et Direction Administrative */}
        <div className="hidden md:block relative max-w-4xl mx-auto">
          <div className="h-0.5 bg-neutral-300 dark:bg-brand-600 mx-[22%]" />
        </div>

        {/* Niveau 2 : DT + Direction Administrative <-> Comptable */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-2 md:mt-0">
          {/* Branche Direction Technique */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="hidden md:block w-0.5 h-6 bg-neutral-300 dark:bg-brand-600" />
            <div className="w-full max-w-xs px-5 py-3.5 rounded-xl bg-indigo-600 text-white shadow-sm text-center border border-indigo-400">
              <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-100 font-bold flex items-center justify-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> Direction Technique (DT)
              </div>
              <div className="text-base font-title font-bold mt-0.5">Fatima BA</div>
            </div>
          </div>

          {/* Branche Direction Administrative <-> Comptable */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="hidden md:block w-0.5 h-6 bg-neutral-300 dark:bg-brand-600" />
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <div className="px-5 py-3.5 rounded-xl bg-slate-800 dark:bg-brand-800 text-white shadow-sm text-center border border-slate-600 min-w-[200px]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center justify-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> Direction Administrative
                </div>
                <div className="text-base font-title font-bold mt-0.5">Fatoumata BALDE</div>
              </div>
              <div className="hidden sm:block w-6 h-0.5 bg-neutral-400 dark:bg-brand-500 shrink-0" />
              <div className="sm:hidden w-0.5 h-4 bg-neutral-400 dark:bg-brand-500" />
              <div className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-brand-950 border border-neutral-300 dark:border-brand-600 text-center min-w-[140px]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold flex items-center justify-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-accent-500" /> Comptabilité
                </div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">Comptable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Connecteur DT -> 5 Pôles Techniques */}
        <div className="flex flex-col items-center my-4">
          <div className="w-0.5 h-6 bg-indigo-400 dark:bg-indigo-500" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5" /> 5 Pôles Techniques sous la Direction Technique (DT) de Fatima BA
          </div>
          <div className="w-0.5 h-5 bg-indigo-400 dark:bg-indigo-500" />
        </div>

        {/* Niveau 3 & 4 : Les 5 pôles + leurs dessinateurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TECHNICAL_POLES.map((p) => (
            <div key={p.pole} className="flex flex-col items-center">
              <div className={`w-full rounded-xl border-2 p-4 text-center shadow-xs ${p.accent}`}>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  {p.pole}
                </div>
                {p.responsable && (
                  <div className="text-sm font-title font-extrabold text-neutral-900 dark:text-white mt-1">
                    {p.responsable}
                  </div>
                )}
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {p.role}
                </div>
              </div>

              {p.sub && (
                <>
                  <div className="w-0.5 h-5 bg-neutral-300 dark:bg-brand-600" />
                  <div className="w-full rounded-lg bg-neutral-50 dark:bg-brand-950 border border-neutral-200 dark:border-brand-700 p-3 text-center">
                    <div className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 font-bold">
                      {p.sub.role}
                    </div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">
                      {p.sub.name}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
