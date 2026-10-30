'use client';

import React, { useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxPhoto {
  url: string;
  caption?: string;
}

interface PhotoLightboxProps {
  images: LightboxPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  title?: string;
}

/**
 * Visionneuse photos plein écran (lightbox).
 * Affiche la photo en grand format avec sa description (légende),
 * et permet de naviguer entre toutes les photos d'une galerie.
 */
export default function PhotoLightbox({ images, index, onIndexChange, onClose, title }: PhotoLightboxProps) {
  const total = images.length;
  const current = images[index];

  const goPrev = useCallback(() => {
    onIndexChange(index === 0 ? total - 1 : index - 1);
  }, [index, total, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(index === total - 1 ? 0 : index + 1);
  }, [index, total, onIndexChange]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, goPrev, goNext]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-brand-950/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse photos"
      onClick={onClose}
    >
      {/* EN-TÊTE : titre du projet + description de la photo + compteur + fermeture */}
      <div
        className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          {title && <p className="text-[11px] font-mono text-accent-400 truncate mb-0.5">{title}</p>}
          <p className="text-xs sm:text-sm text-white font-medium leading-snug">
            {current.caption || 'Photo du chantier'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-400 tabular-nums">
            {index + 1} / {total}
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer la visionneuse"
            className="w-9 h-9 flex items-center justify-center rounded-m bg-white/10 hover:bg-accent-500 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PHOTO GRAND FORMAT */}
      <div
        className="relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-16 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            onClick={goPrev}
            aria-label="Photo précédente"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent-500 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.caption || 'Photo agrandie'}
          className="max-w-full max-h-full object-contain rounded-m shadow-2xl border border-white/10"
        />
        {total > 1 && (
          <button
            onClick={goNext}
            aria-label="Photo suivante"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent-500 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {total > 1 && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-mono text-neutral-300 bg-brand-950/80 px-2.5 py-1 rounded tabular-nums">
            {index + 1} / {total}
          </span>
        )}
      </div>

      {/* STRIP DE MINIATURES CLIQUABLES */}
      {total > 1 && (
        <div
          className="shrink-0 border-t border-white/10 px-4 py-3 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 justify-center min-w-min">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onIndexChange(i)}
                aria-label={`Voir la photo ${i + 1}`}
                className={`relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 overflow-hidden rounded border-2 transition-all ${
                  i === index
                    ? 'border-accent-500 opacity-100 scale-105'
                    : 'border-white/20 opacity-50 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
