'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  Sparkles,
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { ENTITIES } from '@/data/initialData';
import { SOCIAL_LINKS } from '@/data/socialLinks';

const getSocialIcon = (iconName: string) => {
  switch (iconName) {
    case 'Linkedin': return <Linkedin className="w-4 h-4" />;
    case 'Facebook': return <Facebook className="w-4 h-4" />;
    case 'Youtube': return <Youtube className="w-4 h-4" />;
    case 'Instagram': return <Instagram className="w-4 h-4" />;
    case 'MessageCircle': return <MessageCircle className="w-4 h-4" />;
    case 'Tiktok': return (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );
    default: return <Globe className="w-4 h-4" />;
  }
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-900 dark:bg-brand-950 text-neutral-300 border-t border-brand-800 pt-16 pb-24 lg:pb-16 text-sm relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-gold-500 to-accent-500 opacity-80" />

      {/* BANDEAU INSTITUTIONNEL : DIRECTION TECHNIQUE & URGENCE CHANTIERS */}
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-800 rounded-l overflow-hidden border-brand-800">
          <div className="bg-brand-900 dark:bg-brand-950 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-m bg-accent-500/10 border-accent-500/30 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <span className="text-[10px] font-mono  tracking-wider text-neutral-500 block">
                Standard & direction technique
              </span>
              <a href="tel:+221338324010" className="font-mono font-bold text-white hover:text-accent-500 transition-colors">
                +221 33 832 40 10
              </a>
            </div>
          </div>
          <div className="bg-brand-900 dark:bg-brand-950 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-m bg-red-500/10 border-red-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono  tracking-wider text-neutral-500 block">
                Centrale d'urgence chantiers 24/7
              </span>
              <a href="tel:+221776381200" className="font-mono font-bold text-white hover:text-accent-500 transition-colors">
                +221 77 638 12 00
              </a>
            </div>
          </div>
          <div className="bg-brand-900 dark:bg-brand-950 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-m bg-emerald-500/10 border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono  tracking-wider text-neutral-500 block">
                Sourcing international & transit
              </span>
              <a href="mailto:sourcing@pgt-transit.sn" className="font-mono font-bold text-white hover:text-accent-500 transition-colors break-all">
                sourcing@pgt-transit.sn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP SECTION: BRAND & HIGH LEVEL VALUE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-800">

          {/* COLUMN 1: ECOSYSTEM OVERVIEW */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-800 border border-brand-700 rounded-m flex items-center justify-center text-white font-title font-bold text-xl">
                <span className="text-white">M</span>
                <span className="text-accent-500">N</span>
              </div>
              <div>
                <h3 className="font-title font-bold text-lg text-white leading-tight">
                  Magatte Niang Expert
                </h3>
                <p className="text-xs text-brand-400 font-mono  tracking-wider">
                  Écosystème BTP & ingénierie intégrée
                </p>
              </div>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Conception, essais géotechniques, charpentes métalliques, préfabrication béton, logistique lourde et matériaux de finition au Sénégal et en Afrique de l'Ouest.
            </p>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                <span>Siège : Km 14, Bd du Centenaire de la Commune de Dakar, Sénégal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-500 shrink-0" />
                <span>Standard : +221 33 832 40 10 / Urgence BTP : +221 77 638 12 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-500 shrink-0" />
                <span>Email : contact@magatteniang-expert.sn</span>
              </div>
            </div>

            {/* RÉSEAUX SOCIAUX & CANAUX OFFICIELS */}
            <div className="pt-2">
              <span className="text-[11px] font-mono font-bold text-neutral-400 block mb-2.5">
                Réseaux sociaux & canaux officiels :
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-m bg-brand-800/80 hover:bg-brand-700 border border-brand-700 text-xs text-neutral-300 hover:text-white transition-all transform hover:scale-105 shadow-sm group"
                    title={`${s.name} (${s.handle}) — ${s.description}`}
                  >
                    <span className="text-accent-500 group-hover:text-accent-400">
                      {getSocialIcon(s.icon)}
                    </span>
                    <span className="text-[11px] font-medium">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: LES 7 ENTITÉS */}
          <div>
            <h4 className="text-xs font-bold  tracking-wider text-white mb-4 border-l-2 border-accent-500 pl-2">
              Les 7 entités
            </h4>
            <ul className="space-y-2 text-xs">
              {ENTITIES.map((ent) => (
                <li key={ent.id}>
                  <Link
                    href={`/entites/${ent.id}`}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{ent.name}</span>
                    <span
                      className="w-1.5 h-1.5 rounded-full group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: ent.colorHex }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: EXPERTISES & SERVICES */}
          <div>
            <h4 className="text-xs font-bold  tracking-wider text-white mb-4 border-l-2 border-brand-400 pl-2">
              Pôles & solutions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/expertises" className="hover:text-white transition-colors">
                  Charpentes & hangars métalliques
                </Link>
              </li>
              <li>
                <Link href="/services/laboratoire" className="hover:text-white transition-colors">
                  Laboratoire & essais de sols (SB-S)
                </Link>
              </li>
              <li>
                <Link href="/services/engins" className="hover:text-white transition-colors">
                  Location d'engins de terrassement
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-white transition-colors">
                  Showroom carrelage & sanitaires (P2M)
                </Link>
              </li>
              <li>
                <Link href="/services/sourcing" className="hover:text-white transition-colors">
                  Sourcing & fret international (PGT)
                </Link>
              </li>
              <li>
                <Link href="/projets" className="hover:text-white transition-colors">
                  Carte interactive des réalisations
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: INSTITUTIONNEL & OUTILS */}
          <div>
            <h4 className="text-xs font-bold  tracking-wider text-white mb-4 border-l-2 border-gold-500 pl-2">
              Accès professionnels
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="text-accent-500 font-semibold hover:underline flex items-center gap-1">
                  <span>Contact direct & devis</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Profil Magatte Niang</span>
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-white transition-colors">
                  Publications scientifiques
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="text-accent-500 font-semibold hover:underline flex items-center gap-1">
                  <span>Assistant de projet BTP</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/espace-pro" className="hover:text-white transition-colors">
                  Espace client & devis
                </Link>
              </li>
              <li>
                <Link href="/espace-pro/crm" className="hover:text-white transition-colors">
                  Back-office & CRM direction
                </Link>
              </li>
              <li>
                <Link href="/mediatheque" className="hover:text-white transition-colors">
                  Médiathèque & presse
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION: CONFORMITÉ CDP & LEGAL */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Conformité stricte <strong>CDP Sénégal</strong> (Loi n° 2008-12 relative à la protection des données à caractère personnel).
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/legal/confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <span>•</span>
            <Link href="/legal/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales & registre CDP
            </Link>
            <span>•</span>
            <Link href="/legal/gouvernance" className="hover:text-white transition-colors">
              Gouvernance des chiffres
            </Link>
          </div>
        </div>

        {/* DEVELOPER CREDIT & COPYRIGHT */}
        <div className="mt-6 pt-4 border-t border-brand-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} Magatte Niang Expert · Tous droits réservés.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 text-neutral-400">
            <span>Plateforme développée par <strong className="text-white font-medium">Sen-E-Carte</strong></span>
            <span>·</span>
            <span>Contact développeur :</span>
            <a href="tel:+221776026783" className="text-accent-500 hover:text-accent-400 font-mono font-semibold transition-colors">
              77 602 67 83
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
