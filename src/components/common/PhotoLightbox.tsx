'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

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
 * Visionneuse photos plein écran (lightbox) via Portal document.body,
 * compatible toutes versions Apple Safari (macOS / iOS), Chrome, Firefox et Android.
 */
export default function PhotoLightbox({ images, index, onIndexChange, onClose, title }: PhotoLightboxProps) {
  const total = images.length;
  const current = images[index];
  const [zoomed, setZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setZoomed(false);
  }, [index]);

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

  if (!mounted || !current) return null;

  return createPortal(
    <div
      className="fixed top-0 right-0 bottom-0 left-0 z-[9999] flex flex-col bg-black/95"
      style={{ width: '100vw', height: '100vh' }}
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse photos"
      onClick={onClose}
    >
      {/* EN-TÊTE */}
      <div
        className="flex items-start justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 shrink-0 bg-brand-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 flex-1">
          {title && <p className="text-[11px] font-mono text-accent-400 truncate mb-0.5">{title}</p>}
          <p className="text-xs sm:text-sm text-white font-medium leading-snug line-clamp-2">
            {current.caption || 'Photo du chantier'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-400 tabular-nums">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? 'Réduire le zoom' : 'Zoomer sur la photo'}
            title={zoomed ? 'Réduire (1x)' : 'Zoomer (1.6x)'}
            className="px-2.5 h-9 flex items-center justify-center gap-1.5 rounded-m bg-white/15 hover:bg-accent-500 text-white text-xs font-mono transition-colors cursor-pointer"
          >
            {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            <span>{zoomed ? '1x' : 'Zoom'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la visionneuse"
            className="w-9 h-9 flex items-center justify-center rounded-m bg-white/15 hover:bg-accent-500 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PHOTO GRAND FORMAT */}
      <div
        className={
          zoomed
            ? 'relative flex-1 min-h-0 overflow-auto p-4 sm:p-8 block'
            : 'relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-16 py-4 overflow-hidden'
        }
        style={{ WebkitOverflowScrolling: 'touch' }}
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && !zoomed && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Photo précédente"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/75 hover:bg-accent-500 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.caption || 'Photo agrandie'}
          onClick={() => setZoomed((z) => !z)}
          title={zoomed ? 'Cliquer pour dézoomer' : 'Cliquer pour zoomer'}
          className="block mx-auto rounded-m shadow-2xl border border-white/10 object-contain"
          style={
            zoomed
              ? {
                  width: '160%',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  height: 'auto',
                  cursor: 'zoom-out',
                }
              : {
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '92vw',
                  maxHeight: 'calc(100vh - 180px)',
                  cursor: 'zoom-in',
                }
          }
        />
        {total > 1 && !zoomed && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Photo suivante"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/75 hover:bg-accent-500 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {total > 1 && !zoomed && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-[11px] font-mono text-neutral-300 bg-brand-950/90 px-2.5 py-1 rounded tabular-nums">
            {index + 1} / {total}
          </span>
        )}
      </div>

      {/* STRIP DE MINIATURES CLIQUABLES */}
      {total > 1 && (
        <div
          className="shrink-0 border-t border-white/10 px-4 py-3 overflow-x-auto bg-brand-950"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 justify-center min-w-min">
            {images.map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => onIndexChange(i)}
                aria-label={`Voir la photo ${i + 1}`}
                className={`relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 overflow-hidden rounded border-2 transition-all cursor-pointer ${
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
    </div>,
    document.body
  );
}
