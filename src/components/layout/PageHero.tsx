'use client';

import React from 'react';

interface PageHeroProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  imageOpacity?: number;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  image,
  imageAlt = '',
  eyebrow,
  title,
  description,
  children,
  imageOpacity = 0.35,
  className = '',
}) => {
  return (
    <section
      className={`relative overflow-hidden bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: imageOpacity }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-brand-900/45 to-brand-900/20 pointer-events-none" />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-10">
        {eyebrow && (
          <span className="text-xs font-mono  font-bold text-accent-400 tracking-wider">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title font-bold tracking-tight mt-2">
          {title}
        </h1>
        {description && (
          <p className="text-neutral-200 text-base sm:text-lg leading-relaxed mt-4 max-w-3xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageHero;
