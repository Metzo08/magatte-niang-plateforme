'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Accueil',
        'item': 'https://magatteniang-expert.sn'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 2,
        'name': item.label,
        'item': item.href ? `https://magatteniang-expert.sn${item.href}` : undefined
      }))
    ]
  };

  return (
    <nav className="bg-neutral-100 dark:bg-brand-800/40 border-b border-neutral-200 dark:border-brand-700/60 py-2.5 px-4 sm:px-6 lg:px-8" aria-label="Fil d'Ariane">
      {/* Schema.org BreadcrumbList for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-editorial mx-auto flex items-center space-x-2 text-xs text-neutral-600 dark:text-neutral-400">
        <Link 
          href="/" 
          className="flex items-center hover:text-brand-700 dark:hover:text-white transition-colors"
          title="Retour à l'accueil"
        >
          <Home className="w-3.5 h-3.5 mr-1" />
          <span>Accueil</span>
        </Link>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-brand-700 dark:hover:text-white transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
