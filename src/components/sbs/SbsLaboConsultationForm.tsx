'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Layers,
  ShieldCheck,
  TestTube2,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { store } from '@/lib/store';
import { Lead } from '@/types';

const LABO_DOMAINS = [
  {
    id: 'Catégorie C2 · Étude géotechnique de sol & fondations (G1 / G2)',
    desc: 'Sondages carottés, pénétromètre dynamique, capacité portante et recommandations de fondations',
  },
  {
    id: 'Catégorie C2 · Identification & mécanique des sols en laboratoire',
    desc: 'Granulométrie, limites d’Atterberg, VBS, équivalent de sable, cisaillement Casagrande, œdomètre',
  },
  {
    id: 'Catégorie A3 · Essais sur bétons hydrauliques & éprouvettes',
    desc: 'Écrasement sous presse 3 000 kN (7j, 14j, 28j), cône d’Abrams, formulation de béton',
  },
  {
    id: 'Catégorie A3 · Contrôle qualité granulats, sables, graviers & roches',
    desc: 'Granularité, coefficient d’aplatissement, propreté, absorption d’eau, Los Angeles',
  },
  {
    id: 'Domaine B (B.1 à B.4) · Géotechnique routière & terrassement',
    desc: 'Proctor Normal/Modifié, indice CBR, compacité in-situ, essai à la plaque EV2',
  },
  {
    id: 'Domaine D · Auscultation & diagnostic d’ouvrages existants',
    desc: 'Scléromètre, carottage sur béton durci, contrôle non destructif et expertise',
  },
];

const LABO_TESTS = [
  'Sondages carottés / Pénétromètre dynamique',
  'Granulométrie & Limites d’Atterberg + VBS',
  'Cisaillement direct (Casagrande) & Œdomètre',
  'Écrasement d’éprouvettes béton (7j / 14j / 28j)',
  'Formulation de béton & Cône d’Abrams',
  'Essais Proctor Normal/Modifié & Indice CBR',
  'Contrôle de compactage in-situ / Essai à la plaque EV2',
  'Carottage béton durci & Scléromètre',
];

export function SbsLaboConsultationForm() {
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [domain, setDomain] = useState(LABO_DOMAINS[0].id);
  const [selectedTests, setSelectedTests] = useState<string[]>([
    'Sondages carottés / Pénétromètre dynamique',
  ]);
  const [structureType, setStructureType] = useState('Bâtiment / Immeuble / IGH');
  const [sampleVolume, setSampleVolume] = useState('');
  const [samplingMode, setSamplingMode] = useState('Prélèvement / intervention sur site par SB-S Labo');
  const [timeframe, setTimeframe] = useState<'Immédiat' | '1–3 mois' | '3–6 mois' | '> 6 mois'>('Immédiat');
  const [siteLocation, setSiteLocation] = useState('Dakar');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const toggleTest = (item: string) => {
    setSelectedTests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      alert('Veuillez renseigner votre nom complet, téléphone et adresse email.');
      return;
    }

    const created = store.createLead({
      fullName: fullName.trim(),
      company: company.trim() || 'Client SB-S Labo',
      role: 'Maître d’ouvrage / Entreprise BTP',
      phone: phone.trim(),
      email: email.trim(),
      country: 'Sénégal',
      city: siteLocation.trim() || 'Dakar',
      sector: 'Laboratoire géotechnique & essais matériaux',
      source: 'Assistant qualification',
      needCategory: 'Geotechnique',
      projectType: `${domain} — ${structureType}${selectedTests.length ? ` (${selectedTests.join(', ')})` : ''}`,
      projectLocation: siteLocation.trim() || 'Dakar',
      projectStage: 'Étude',
      budgetRange: sampleVolume.trim() || samplingMode,
      timeframe,
      filesCount: 0,
    });

    setCreatedLead(created);
  };

  const buildWhatsappUrl = () => {
    const text = [
      `Bonjour SB-S Labo, je souhaite demander un essai de sol / béton :`,
      `• Client : ${fullName}${company ? ` (${company})` : ''}`,
      `• Tél : ${phone} · Email : ${email}`,
      `• Domaine / Catégorie : ${domain}`,
      `• Essais demandés : ${selectedTests.join(', ') || 'À préciser'}`,
      `• Nature ouvrage : ${structureType}`,
      `• Volume / Sondages / Éprouvettes : ${sampleVolume || 'À estimer'}`,
      `• Mode : ${samplingMode}`,
      `• Site : ${siteLocation} · Délai : ${timeframe}`,
      notes ? `• Précisions : ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/221708350063?text=${encodeURIComponent(text)}`;
  };

  if (createdLead) {
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-2xl p-8 shadow-elev-3 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-wider">
              Demande enregistrée chez SB-S Labo · Réf. {createdLead.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-2">
              Votre demande d’essai est transmise
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
              La Direction Technique (<strong>Aminata Dramé</strong>) et le Responsable Laboratoire (<strong>Ablaye Niang</strong>) traitent votre demande et vous transmettent un devis / planning sous 24h.
            </p>
          </div>

          <div className="text-left bg-neutral-50 dark:bg-brand-900/70 border border-neutral-200 dark:border-brand-700 rounded-xl p-4 text-xs sm:text-sm space-y-1.5">
            <div><strong>Domaine :</strong> {domain}</div>
            <div><strong>Essais :</strong> {selectedTests.join(', ') || 'À préciser'}</div>
            <div><strong>Ouvrage :</strong> {structureType}</div>
            <div><strong>Prélèvement :</strong> {samplingMode}</div>
            <div><strong>Site :</strong> {siteLocation} · <strong>Délai :</strong> {timeframe}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm font-bold"
            >
              <span>Envoyer sur WhatsApp SB-S Labo (+221 70 835 00 63)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/entites/sbs-labo"
              className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-brand-600 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-brand-700 transition"
            >
              Retour à SB-S Labo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb
        items={[
          { label: 'Entités', href: '/entites' },
          { label: 'SB-S Labo', href: '/entites/sbs-labo' },
          { label: 'Demander un essai de sol / béton' },
        ]}
      />

      <div className="mt-4 mb-8 bg-brand-900 text-white rounded-2xl p-6 sm:p-8 border border-brand-700 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <FlaskConical className="w-4 h-4" />
          <span>SBSLABO · Laboratoire Géotechnique Agréé LNR-BTP (Catégories C2 &amp; A3)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-title font-bold">
          Demander un essai de sol, béton ou contrôle matériaux
        </h1>
        <p className="text-sm text-neutral-300 mt-2 max-w-3xl">
          Études géotechniques de sol (Catégories C1 &amp; C2), essais sur bétons hydrauliques et granulats (Catégorie A3), géotechnique routière (Domaine B · B.1 à B.4) et auscultation d’ouvrages (Domaine D). Parc matériel 100 % certifié et étalonné · Émission des PV sous 24 heures.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-neutral-200">
          <div className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ndiakhirate, Cité Assemblée, Villa N° 226</span>
          </div>
          <a href="tel:+221708350063" className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700 hover:border-emerald-400">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>+221 70 835 00 63 / 77 321 78 60</span>
          </a>
          <a href="tel:+221338720678" className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700 hover:border-emerald-400">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fixe : +221 33 872 06 78</span>
          </a>
          <div className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>NINEA : 008501141 2E2 · RC : SN DKR 2021 B 12675</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div>
          <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-emerald-500" />
            1. Catégorie d’agrément ou domaine d’essai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LABO_DOMAINS.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDomain(d.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  domain === d.id
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 ring-1 ring-emerald-500'
                    : 'border-neutral-200 dark:border-brand-700 hover:border-emerald-400'
                }`}
              >
                <div className="font-title font-bold text-sm text-neutral-900 dark:text-white">{d.id}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
              <TestTube2 className="w-4 h-4 text-emerald-500" />
              2. Essais spécifiques demandés
            </h2>
            <div className="space-y-2">
              {LABO_TESTS.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 dark:border-brand-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-brand-900/50 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(t)}
                    onChange={() => toggleTest(t)}
                    className="accent-emerald-500"
                  />
                  <span className="text-neutral-800 dark:text-neutral-200">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-3">
              3. Paramètres du chantier &amp; Échantillons
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Nature de l’ouvrage concerné
              </label>
              <select
                value={structureType}
                onChange={(e) => setStructureType(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              >
                <option>Bâtiment / Immeuble / IGH</option>
                <option>Hangar industriel / Charpente métallique</option>
                <option>Route / Voirie / Plateforme logistique (VRD)</option>
                <option>Ouvrage hydraulique / Pont / Génie civil</option>
                <option>Centrale à béton / Usine de préfabrication / Carrière</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Mode de prélèvement / dépôt des échantillons
              </label>
              <select
                value={samplingMode}
                onChange={(e) => setSamplingMode(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              >
                <option>Prélèvement / intervention sur site par SB-S Labo</option>
                <option>Échantillons / éprouvettes déposés au laboratoire (Ndiakhirate)</option>
                <option>Contrôle continu régulier sur chantier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Quantité estimée (nombre de sondages, éprouvettes ou points d’essai)
              </label>
              <input
                type="text"
                value={sampleVolume}
                onChange={(e) => setSampleVolume(e.target.value)}
                placeholder="Ex. : 3 sondages carottés à 15m / 12 éprouvettes béton 7j-28j"
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-brand-700 pt-6">
          <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-4">
            4. Localisation du chantier &amp; Vos coordonnées
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Site / Localisation du chantier *
              </label>
              <input
                type="text"
                required
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="Ex. Dakar, Diamniadio, Rufisque, Thiès..."
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Délai d’intervention souhaité
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              >
                <option value="Immédiat">Immédiat (intervention rapide / PV sous 24h)</option>
                <option value="1–3 mois">1–3 mois</option>
                <option value="3–6 mois">3–6 mois</option>
                <option value="> 6 mois">&gt; 6 mois</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Nom &amp; Prénom *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom complet"
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Entreprise / Maître d’ouvrage
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Entreprise BTP, bureau d’études ou particulier"
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Téléphone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 ..."
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.sn"
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
              Précisions techniques (classe de béton, profondeur, contraintes d’accès...)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex. : Béton C25/30, profondeur de reconnaissance 15m, accès poids lourd..."
              className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>sbslabo15@gmail.com · Direction Technique &amp; Laboratoire</span>
          </div>
          <button type="submit" className="btn-primary inline-flex items-center gap-2 font-bold">
            <span>Transmettre la demande d’essai à SB-S Labo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
