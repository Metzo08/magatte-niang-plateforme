'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  Lock
} from 'lucide-react';
import { ENTITIES } from '@/data/initialData';
import { store } from '@/lib/store';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAI: () => void;
}

/** Menu desktop — entités (mega-menu) */
const ENTITY_LINKS = ENTITIES.map((ent) => ({
  href: `/entites/${ent.id}`,
  name: ent.name,
  colorHex: ent.colorHex
}));

/** Menu desktop — expertises (dropdown) */
const EXPERTISE_LINKS = [
  { href: '/expertises#genie-civil', label: 'Génie civil & BTP' },
  { href: '/expertises#construction-metallique', label: 'Construction métallique' },
  { href: '/expertises#prefabrication-beton', label: 'Béton & préfabrication' },
  { href: '/services/laboratoire', label: 'Laboratoire & essais' },
  { href: '/expertises#logistique', label: 'Logistique & transport' },
  { href: '/expertises#etudes-ingenierie', label: 'Études & ingénierie' }
];

/** Menu desktop — navigation principale horizontale */
const DESKTOP_NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/entites', label: 'Entités', dropdown: 'entities' as const },
  { href: '/expertises', label: 'Expertises', dropdown: 'expertises' as const },
  { href: '/projets', label: 'Projets' },
  { href: '/mediatheque', label: 'Médiathèque' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/contact', label: 'Contact' },
  { href: '/espace-pro', label: 'Espace pro' }
];

/** Menu mobile — navigation complète (sans emojis, différente du desktop) */
const MOBILE_NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/entites', label: 'Les 7 entités du groupe' },
  { href: '/expertises', label: 'Expertises métiers' },
  { href: '/projets', label: 'Projets & réalisations' },
  { href: '/catalogue', label: 'Catalogue P2M' },
  { href: '/services/laboratoire', label: 'Laboratoire SB-S Labo' },
  { href: '/mediatheque', label: 'Médiathèque & presse' },
  { href: '/contact', label: 'Contact & Devis direct' },
  { href: '/profil', label: 'Magatte Niang — profil & recherche' },
  { href: '/espace-pro', label: 'Espace professionnel (accès réservé)' }
];

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAI }) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const updateCart = () => {
      const cart = store.getCart();
      const total = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(total);
    };
    updateCart();
    window.addEventListener('storage-update', updateCart);

    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage-update', updateCart);
    };
  }, []);

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const navLinkClass = (isActive: boolean) =>
    `relative px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors rounded-m ${
      isActive
        ? 'text-accent-600 dark:text-accent-400'
        : 'text-neutral-700 dark:text-neutral-300 hover:text-accent-600 dark:hover:text-accent-400'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-brand-900/95 backdrop-blur-md shadow-elev-1 py-2'
          : 'bg-white dark:bg-brand-900 border-b border-neutral-300 dark:border-brand-800 py-3'
      }`}
    >
      {/* ===== BARRE SUPÉRIEURE (desktop uniquement) ===== */}
      <div className="hidden lg:block bg-brand-900 dark:bg-brand-950 text-neutral-300 text-xs border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-8 h-8 flex items-center justify-between">
          <span className="font-mono tracking-wider">
            GROUPE MAGATTE NIANG — BTP, INDUSTRIE &amp; INGÉNIERIE AU SÉNÉGAL
          </span>
          <div className="flex items-center gap-5">
            <Link href="/profil" className="hover:text-accent-400 transition-colors">
              Profil &amp; recherche
            </Link>
            <Link href="/espace-pro" className="hover:text-accent-400 transition-colors inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> Espace pro
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">

          {/* LOGO CORPORATE */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-brand-900 dark:bg-brand-950 border border-brand-700/80 rounded-m flex items-center justify-center text-white font-title font-bold text-lg sm:text-xl tracking-tighter shadow-md group-hover:border-accent-500 group-hover:shadow-[0_0_15px_rgba(242,106,27,0.3)] transition-all">
              <span className="text-white">M</span>
              <span className="text-accent-500">N</span>
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-brand-900" title="Écosystème certifié actif" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-title font-bold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white leading-none group-hover:text-accent-500 transition-colors whitespace-nowrap">
                  Magatte Niang
                </span>
                <span className="hidden 2xl:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 bg-gradient-to-r from-accent-500/10 to-gold-500/20 text-accent-600 dark:text-accent-400 border border-accent-500/30 rounded whitespace-nowrap">
                  Expert BTP
                </span>
              </div>
              <span className="hidden sm:flex text-[11px] font-sans font-medium text-neutral-500 dark:text-neutral-400 tracking-wider mt-1 items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                7 pôles industriels intégrés
              </span>
            </div>
          </Link>

          {/* ===== MENU DESKTOP — horizontal, distinct du mobile ===== */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navigation principale">
            {DESKTOP_NAV.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              if (item.dropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.dropdown!)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`${navLinkClass(isActive)} inline-flex items-center gap-1`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === item.dropdown ? 'rotate-180' : ''
                        }`}
                      />
                      {isActive && (
                        <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-accent-500 rounded-full" />
                      )}
                    </Link>
                    {/* Mega-menu Entités */}
                    {item.dropdown === 'entities' && activeDropdown === 'entities' && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                        <div className="w-[560px] bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m shadow-elev-2 p-4">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-brand-800">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500">
                              LES 7 ENTITÉS DU GROUPE
                            </span>
                            <Link href="/entites" className="text-xs font-semibold text-accent-600 hover:underline inline-flex items-center gap-1">
                              Tout voir <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {ENTITY_LINKS.map((ent) => (
                              <Link
                                key={ent.href}
                                href={ent.href}
                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-m hover:bg-neutral-50 dark:hover:bg-brand-800 transition-colors"
                              >
                                <span
                                  className="w-7 h-7 rounded-m flex items-center justify-center text-white text-[10px] font-title font-bold shrink-0"
                                  style={{ backgroundColor: ent.colorHex }}
                                >
                                  {ent.name.slice(0, 2)}
                                </span>
                                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                                  {ent.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dropdown Expertises */}
                    {item.dropdown === 'expertises' && activeDropdown === 'expertises' && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                        <div className="w-64 bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m shadow-elev-2 p-2">
                          {EXPERTISE_LINKS.map((exp) => (
                            <Link
                              key={exp.label}
                              href={exp.href}
                              className="flex items-center justify-between px-3 py-2 rounded-m text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-accent-50 dark:hover:bg-brand-800 hover:text-accent-600 transition-colors"
                            >
                              {exp.label}
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={navLinkClass(isActive)}>
                  {item.label}
                  {isActive && (
                    <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-accent-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ===== ACTIONS DESKTOP ===== */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenSearch}
              aria-label="Recherche"
              className="w-9 h-9 flex items-center justify-center rounded-m text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-brand-800 hover:text-accent-600 transition-colors"
            >
              <Search style={{ width: 18, height: 18 }} />
            </button>

            <button
              onClick={onOpenAI}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 h-9 rounded-m bg-accent-50 dark:bg-accent-600/20 text-accent-600 dark:text-accent-400 border border-accent-200 dark:border-accent-600/40 text-xs font-bold hover:bg-accent-100 dark:hover:bg-accent-600/30 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Assistant IA
            </button>

            <button
              onClick={toggleDarkMode}
              aria-label="Basculer le mode clair / sombre"
              className="w-9 h-9 flex items-center justify-center rounded-m text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-brand-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/catalogue"
              aria-label="Panier"
              className="relative w-9 h-9 flex items-center justify-center rounded-m text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-brand-800 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" style={{ width: 18, height: 18 }} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/assistant"
              className="hidden xl:inline-flex items-center gap-1.5 ml-1 px-4 h-9 bg-brand-900 dark:bg-accent-600 text-white text-xs font-bold rounded-m hover:bg-accent-600 dark:hover:bg-accent-500 transition-colors"
            >
              Devis express
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ===== ACTIONS MOBILE / TABLETTE ===== */}
          <div className="flex lg:hidden items-center gap-1 shrink-0">
            <button
              onClick={onOpenSearch}
              aria-label="Recherche"
              className="w-10 h-10 flex items-center justify-center rounded-m text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-brand-800 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenAI}
              aria-label="Assistant IA"
              className="w-10 h-10 flex items-center justify-center rounded-m text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-brand-800 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              className="w-10 h-10 flex items-center justify-center rounded-m bg-brand-900 dark:bg-brand-800 text-white hover:bg-accent-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== PANNEAU MOBILE (différent du menu desktop) ===== */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-brand-800 bg-white dark:bg-brand-900 max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Actions rapides */}
          <div className="flex gap-2 px-4 pt-4 pb-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="flex-1 flex items-center justify-center px-3 py-2.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-m text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:border-accent-500 transition-colors"
            >
              Recherche
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAI();
              }}
              className="flex-1 flex items-center justify-center px-3 py-2.5 bg-accent-50 dark:bg-brand-800 border border-accent-200 dark:border-accent-600/40 rounded-m text-sm font-bold text-accent-600 dark:text-accent-400 hover:border-accent-500 transition-colors"
            >
              Assistant IA
            </button>
            <button
              onClick={toggleDarkMode}
              aria-label="Mode clair / sombre"
              className="flex-1 flex items-center justify-center px-3 py-2.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-m text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:border-accent-500 transition-colors"
            >
              {isDarkMode ? 'Mode clair' : 'Mode sombre'}
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-4 pb-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 px-1">
              NAVIGATION
            </span>
            <div className="mt-2 space-y-0.5">
              {MOBILE_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-m text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-accent-50 dark:bg-brand-800 text-accent-600 dark:text-accent-400 font-semibold'
                      : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-brand-800'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Les 7 entités en pastilles colorées */}
          <div className="px-4 pb-4">
            <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 px-1">
              LES 7 PILIERS DE L'ÉCOSYSTÈME
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ENTITY_LINKS.map((ent) => (
                <Link
                  key={ent.href}
                  href={ent.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-neutral-50 dark:bg-brand-800/50 border border-neutral-200 dark:border-brand-700 rounded-m transition-colors hover:border-accent-500"
                >
                  <span
                    className="w-7 h-7 rounded-m flex items-center justify-center text-white text-[10px] font-title font-bold shrink-0"
                    style={{ backgroundColor: ent.colorHex }}
                  >
                    {ent.name.slice(0, 2)}
                  </span>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    {ent.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA principal */}
          <div className="px-4 pb-5 pt-1">
            <Link
              href="/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-elev-2 transition-all"
            >
              Démarrer un projet / chiffrage express
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};





