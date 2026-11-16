'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Hammer,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Building2,
  Ruler,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { store } from '@/lib/store';
import { Lead } from '@/types';

const SERMA_DOMAINS = [
  {
    id: 'Charpente métallique & Hangar industriel',
    desc: 'Hangars grande portée (ex. 1 650 m²), entrepôts, unités industrielles, fermes & portiques acier',
  },
  {
    id: 'Modélisation logicielle 3D / BIM & Calculs structurels',
    desc: 'Modèles Autodesk Robot (RSA), Tekla, Revit BIM, simulations vent/séisme & descentes de charges',
  },
  {
    id: 'Bâtiment & Immeuble IGH',
    desc: 'Ossatures béton armé ou mixtes acier/béton, notes de calcul et dimensionnement complet',
  },
  {
    id: 'Pylône télécom / énergie & Ouvrage spécial',
    desc: 'Pylônes treillis, mâts haubanés, fondations spéciales et tenue au vent',
  },
  {
    id: 'Station-service & Auvent métallique',
    desc: 'Auvents grande portée, structures de couverture, cuves & VRD techniques',
  },
  {
    id: 'Ouvrage hydraulique & Lots techniques',
    desc: 'Châteaux d’eau, bassins, dalots, réseaux CFO/CFA, CVC et plomberie',
  },
  {
    id: 'Maîtrise d’œuvre (AMO / Supervision) & Audit',
    desc: 'Supervision d’exécution, contrôle de conformité, expertise et diagnostic structurel',
  },
];

const SERMA_MISSIONS = [
  'Étude technique APS / APD',
  'Modélisation 3D / Maquette BIM (Revit / Tekla)',
  'Note de calcul & Dimensionnement (Robot RSA)',
  'Dossier d’exécution (plans de ferraillage / charpente)',
  'Maîtrise d’œuvre (AMO / Supervision de chantier)',
  'Audit / Expertise de structure existante',
];

const SERMA_NORMS = [
  'Eurocodes (EC2, EC3, EC7)',
  'Normes NF',
  'ACI (American Concrete Institute)',
  'ASTM',
  'Mixte / Normes internationales conventionnelles',
];

const SERMA_DOCS = [
  'Étude géotechnique de sol (SB-S Labo ou autre)',
  'Plans architecturaux (DWG / PDF / IFC)',
  'Cahier des charges / Termes de référence',
  'Aucune pièce pour le moment (étude complète à lancer)',
];

export function SermaConsultationForm() {
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [domain, setDomain] = useState(SERMA_DOMAINS[0].id);
  const [missions, setMissions] = useState<string[]>([
    'Modélisation 3D / Maquette BIM (Revit / Tekla)',
    'Note de calcul & Dimensionnement (Robot RSA)',
  ]);
  const [normStandard, setNormStandard] = useState(SERMA_NORMS[0]);
  const [surfaceRange, setSurfaceRange] = useState('1 500 – 5 000 m² (ex. hangar industriel 1 650 m²)');
  const [spanOrHeight, setSpanOrHeight] = useState('');
  const [availableDocs, setAvailableDocs] = useState<string[]>([]);
  const [siteLocation, setSiteLocation] = useState('Dakar / Diamniadio');
  const [timeframe, setTimeframe] = useState<'Immédiat' | '1–3 mois' | '3–6 mois' | '> 6 mois'>('1–3 mois');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      alert('Veuillez renseigner votre nom complet, téléphone et adresse email.');
      return;
    }

    const summaryNotes = [
      `Domaine SERMA BTP : ${domain}`,
      `Missions : ${missions.join(', ') || 'Étude complète'}`,
      `Normes : ${normStandard}`,
      `Envergure / Surface : ${surfaceRange}${spanOrHeight ? ` · Portée/Hauteur : ${spanOrHeight}` : ''}`,
      `Pièces disponibles : ${availableDocs.join(', ') || 'À préciser'}`,
      notes ? `Précisions client : ${notes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const created = store.createLead({
      fullName: fullName.trim(),
      company: company.trim() || 'Client SERMA BTP',
      role: 'Maître d’ouvrage / Décideur',
      phone: phone.trim(),
      email: email.trim(),
      country: 'Sénégal',
      city: siteLocation.trim() || 'Dakar',
      sector: 'Études techniques, Modélisation 3D/BIM & Charpente',
      source: 'Assistant qualification',
      needCategory: 'Charpente',
      projectType: `${domain} — ${normStandard}${missions.length ? ` (${missions.join(', ')})` : ''}`,
      projectLocation: siteLocation.trim() || 'Dakar',
      projectStage: 'Étude',
      budgetRange: surfaceRange,
      timeframe,
      filesCount: availableDocs.length,
    });

    setCreatedLead(created);
  };

  const buildWhatsappUrl = () => {
    const text = [
      `Bonjour SERMA BTP, je souhaite consulter votre bureau d'études :`,
      `• Client : ${fullName}${company ? ` (${company})` : ''}`,
      `• Tél : ${phone} · Email : ${email}`,
      `• Ouvrage / Domaine : ${domain}`,
      `• Prestations : ${missions.join(', ') || 'Étude technique'}`,
      `• Normes : ${normStandard}`,
      `• Surface / Envergure : ${surfaceRange}${spanOrHeight ? ` (${spanOrHeight})` : ''}`,
      `• Site : ${siteLocation} · Délai : ${timeframe}`,
      notes ? `• Détails : ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/221775752136?text=${encodeURIComponent(text)}`;
  };

  if (createdLead) {
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-2xl p-8 shadow-elev-3 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-accent-500 uppercase tracking-wider">
              Dossier transmis à SERMA BTP · Réf. {createdLead.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-2">
              Votre demande d’étude est enregistrée
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
              La Direction Technique de <strong>SERMA BTP</strong> (HLM Hann Mariste Lot Z/22) analyse votre cahier des charges sous 24h ouvrées (Lun–Ven, 08h30–17h30).
            </p>
          </div>

          <div className="text-left bg-neutral-50 dark:bg-brand-900/70 border border-neutral-200 dark:border-brand-700 rounded-xl p-4 text-xs sm:text-sm space-y-1.5">
            <div><strong>Ouvrage :</strong> {domain}</div>
            <div><strong>Missions :</strong> {missions.join(', ') || 'Étude technique'}</div>
            <div><strong>Référentiel :</strong> {normStandard}</div>
            <div><strong>Envergure :</strong> {surfaceRange}{spanOrHeight ? ` · ${spanOrHeight}` : ''}</div>
            <div><strong>Site :</strong> {siteLocation} · <strong>Délai :</strong> {timeframe}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm font-bold"
            >
              <span>Envoyer le brief sur WhatsApp (+221 77 575 21 36)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/entites/serma-btp"
              className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-brand-600 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-brand-700 transition"
            >
              Retour à SERMA BTP
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
          { label: 'SERMA BTP', href: '/entites/serma-btp' },
          { label: 'Consulter pour une étude ou modélisation' },
        ]}
      />

      {/* En-tête dédié SERMA BTP */}
      <div className="mt-4 mb-8 bg-brand-900 text-white rounded-2xl p-6 sm:p-8 border border-brand-700 shadow-lg">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-accent-400 uppercase tracking-wider mb-2">
          <Hammer className="w-4 h-4" />
          <span>SERMA BTP · Bureau d’Études, Modélisation 3D/BIM &amp; Maîtrise d’Œuvre</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-title font-bold">
          Consulter SERMA BTP pour une étude technique ou modélisation
        </h1>
        <p className="text-sm text-neutral-300 mt-2 max-w-3xl">
          Dimensionnement structurel, modélisation logicielle 3D/BIM (Robot RSA, Tekla, Revit), charpentes métalliques et hangars industriels, pylônes, stations-service, IGH, ouvrages hydrauliques, lots techniques et AMO / supervision — selon les normes Eurocodes, NF, ACI, ASTM et internationales conventionnelles.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-neutral-200">
          <div className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700">
            <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
            <span>HLM Hann Mariste Lot Z/22</span>
          </div>
          <a href="tel:+221775752136" className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700 hover:border-accent-400">
            <Phone className="w-4 h-4 text-accent-400 shrink-0" />
            <span>Mobile / WhatsApp : +221 77 575 21 36</span>
          </a>
          <a href="tel:+221338321333" className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700 hover:border-accent-400">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fixe : +221 33 832 13 33</span>
          </a>
          <div className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700">
            <Clock className="w-4 h-4 text-accent-400 shrink-0" />
            <span>Lun–Ven : 08h30 – 17h30</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* 1. Domaine SERMA BTP */}
        <div>
          <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-accent-500" />
            1. Type d’ouvrage ou d’étude SERMA BTP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SERMA_DOMAINS.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDomain(d.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  domain === d.id
                    ? 'border-accent-500 bg-accent-500/10 dark:bg-accent-500/15 ring-1 ring-accent-500'
                    : 'border-neutral-200 dark:border-brand-700 hover:border-accent-400'
                }`}
              >
                <div className="font-title font-bold text-sm text-neutral-900 dark:text-white">{d.id}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Prestations & Normes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-accent-500" />
              2. Livrables / Prestations souhaités
            </h2>
            <div className="space-y-2">
              {SERMA_MISSIONS.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 dark:border-brand-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-brand-900/50 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={missions.includes(m)}
                    onChange={() => toggleItem(missions, setMissions, m)}
                    className="accent-accent-500"
                  />
                  <span className="text-neutral-800 dark:text-neutral-200">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-accent-500" />
                3. Référentiel normatif &amp; Envergure
              </h2>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Normes de calcul souhaitées
              </label>
              <select
                value={normStandard}
                onChange={(e) => setNormStandard(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              >
                {SERMA_NORMS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Surface ou envergure du projet
              </label>
              <select
                value={surfaceRange}
                onChange={(e) => setSurfaceRange(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              >
                <option>Moins de 500 m²</option>
                <option>500 – 1 500 m²</option>
                <option>1 500 – 5 000 m² (ex. hangar industriel 1 650 m²)</option>
                <option>Plus de 5 000 m² / IGH / Ouvrage majeur</option>
                <option>Ouvrage linéaire / Pylône / Station-service</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-accent-500" />
                Portée libre, hauteur ou nombre de niveaux (optionnel)
              </label>
              <input
                type="text"
                value={spanOrHeight}
                onChange={(e) => setSpanOrHeight(e.target.value)}
                placeholder="Ex. : Hangar 1 650 m², portée 30 m, hauteur 9 m / R+12 IGH"
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* 4. Documents déjà disponibles */}
        <div>
          <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-2">
            4. Éléments déjà en votre possession
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SERMA_DOCS.map((doc) => (
              <label
                key={doc}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 dark:border-brand-700 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={availableDocs.includes(doc)}
                  onChange={() => toggleItem(availableDocs, setAvailableDocs, doc)}
                  className="accent-accent-500"
                />
                <span className="text-neutral-800 dark:text-neutral-200">{doc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 5. Localisation, Délai & Coordonnées */}
        <div className="border-t border-neutral-200 dark:border-brand-700 pt-6">
          <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-4">
            5. Site du projet &amp; Vos coordonnées
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Localisation / Site du projet *
              </label>
              <input
                type="text"
                required
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="Ex. Dakar, Diamniadio, Dangote / Pout, Thiès..."
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Délai souhaité pour l’étude
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              >
                <option value="Immédiat">Immédiat (&lt; 2 semaines)</option>
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
                Entreprise / Organisme
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Société, promoteur ou institution"
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
              Précisions techniques complémentaires
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Charges d'exploitation, pont roulant, contraintes de vent/site, attentes spécifiques..."
              className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>serma@sermabtp.com · sermabtp@gmail.com</span>
          </div>
          <button type="submit" className="btn-primary inline-flex items-center gap-2 font-bold">
            <span>Transmettre la demande d’étude à SERMA BTP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
