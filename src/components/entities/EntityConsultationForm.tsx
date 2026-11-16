'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Factory,
  Truck,
  Layers,
  Globe,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { store } from '@/lib/store';
import { Lead } from '@/types';

export type SupportedEntityFormId =
  | 'sbs-group'
  | 'sbs-industries'
  | 'sbs-logistik'
  | 'p2m'
  | 'pgt';

interface DomainOption {
  id: string;
  desc: string;
}

interface EntityFormConfig {
  id: SupportedEntityFormId;
  name: string;
  badge: string;
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  needCategory: string;
  sector: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  accentCheckbox: string;
  domains: DomainOption[];
  checklistTitle: string;
  checklist: string[];
  param1Label: string;
  param1Options: string[];
  param2Label: string;
  param2Options: string[];
  param3Label: string;
  param3Placeholder: string;
  submitLabel: string;
}

const ENTITY_FORM_CONFIGS: Record<SupportedEntityFormId, EntityFormConfig> = {
  'sbs-group': {
    id: 'sbs-group',
    name: 'SB-S Group',
    badge: 'SB-S Group · Génie Civil, Ouvrages d’Art, VRD & Bâtiments',
    title: 'Consulter SB-S Group pour un marché TP, génie civil ou bâtiment',
    subtitle:
      'Exécution des travaux BTP & infrastructures lourdes : ponts mixtes acier-béton, voiries et réseaux divers (VRD), bâtiments industriels, plateformes multimodales et ouvrages hydrauliques.',
    address: 'Mbao Villeneuve, Villa S04, Route Nationale (ZFI Mbao)',
    phone: '+221 33 871 08 61',
    whatsapp: '221775004422',
    email: 'contact@sbsgroup.sn',
    needCategory: 'Infrastructures',
    sector: 'Génie civil, VRD & Infrastructures',
    accentText: 'text-sky-400',
    accentBorder: 'border-sky-500',
    accentBg: 'bg-sky-500/10 dark:bg-sky-500/15 ring-1 ring-sky-500',
    accentCheckbox: 'accent-sky-500',
    domains: [
      { id: 'Ouvrages d’art & Ponts mixtes acier-béton', desc: 'Ponts routiers, dalots, échangeurs et franchissements lourds' },
      { id: 'Voirie urbaine, VRD & Plateformes multimodales', desc: 'Terrassements généraux, assainissement, chaussées lourdes et pavage' },
      { id: 'Bâtiments industriels, Tertiaires & IGH', desc: 'Gros œuvre béton armé, fondations spéciales et bâtiments clés en main' },
      { id: 'Ouvrages hydrauliques & Protection côtière', desc: 'Digues maritimes, bassins de rétention, canaux et stations de pompage' },
    ],
    checklistTitle: '2. Prestations & Lots d’exécution souhaités',
    checklist: [
      'Travaux de terrassement de masse & VRD',
      'Gros œuvre béton armé & fondations',
      'Montage charpente & ouvrages mixtes acier-béton',
      'Assainissement pluvial, eaux usées & AEP',
      'Travaux clés en main (tous corps d’état)',
      'Réponse à appel d’offres / Dossier technique',
    ],
    param1Label: 'Stade d’avancement du projet',
    param1Options: ['Appel d’offres en cours', 'Études SERMA BTP / Plans disponibles', 'Démarrage immédiat', 'Avant-projet / Estimation'],
    param2Label: 'Envergure / Budget estimatif',
    param2Options: ['50 M – 150 M FCFA', '150 M – 500 M FCFA', '500 M – 2 Mds FCFA', '> 2 Mds FCFA'],
    param3Label: 'Surface, linéaire ou tonnage estimé (optionnel)',
    param3Placeholder: 'Ex. : Voirie 3 km + dalots / Immeuble R+8 / Plateforme 15 000 m²',
    submitLabel: 'Transmettre le marché à SB-S Group',
  },
  'sbs-industries': {
    id: 'sbs-industries',
    name: 'SB-S Industries',
    badge: 'SB-S Industries · Usine de Préfabrication Béton & BPE (Mbao)',
    title: 'Commander des éléments préfabriqués ou du béton prêt à l’emploi (BPE)',
    subtitle:
      'Production industrielle certifiée à la ZFI de Mbao : briques, agglos, pavés autobloquants, bordures T1/T2/A2, prédalles, hourdis, caniveaux et BPE contrôlés par SB-S Labo.',
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    phone: '+221 33 871 08 61 / +221 77 566 48 06',
    whatsapp: '221775664806',
    email: 'wsbsindustrie2021@gmail.com',
    needCategory: 'Prefabrication',
    sector: 'Préfabrication béton industrielle & BPE',
    accentText: 'text-slate-300',
    accentBorder: 'border-slate-500',
    accentBg: 'bg-slate-500/10 dark:bg-slate-500/20 ring-1 ring-slate-500',
    accentCheckbox: 'accent-slate-500',
    domains: [
      { id: 'Béton Prêt à l’Emploi (BPE)', desc: 'Bétons C20/25, C25/30, C30/37 livrés par toupie avec pompe à béton' },
      { id: 'Pavés autobloquants & Bordures de voirie', desc: 'Pavés 6cm / 8cm / 10cm haute résistance, bordures T1, T2, CS2, A2' },
      { id: 'Agglos, Briques & Hourdis béton', desc: 'Agglos creux/pleins (10, 15, 20), hourdis normalisés' },
      { id: 'Prédalles, Caniveaux, Dalots & Buses', desc: 'Éléments préfabriqués armés sur mesure pour VRD et bâtiments' },
    ],
    checklistTitle: '2. Produits à chiffrer / commander',
    checklist: [
      'Béton Prêt à l’Emploi (BPE) livré par toupie',
      'Pavés autobloquants (6 cm ou 8 cm trafic lourd)',
      'Bordures normalisées (T1 / T2 / A2 / CS2)',
      'Agglos & Hourdis de plancher',
      'Prédalles ou poutres préfabriquées',
      'Caniveaux, dalots & regards d’assainissement',
    ],
    param1Label: 'Classe de résistance / Norme souhaitée',
    param1Options: ['Standard certifié SB-S Labo (C25/30)', 'Haute résistance trafic lourd (C30/37+)', 'Béton maritime / Hydrofuge', 'À définir selon plan'],
    param2Label: 'Mode de livraison souhaité',
    param2Options: ['Livraison sur chantier avec déchargement / pompe', 'Enlèvement direct à l’usine ZFI Mbao', 'Livraisons cadencées selon planning chantier'],
    param3Label: 'Quantités estimées (m³, m² ou nombre d’unités)',
    param3Placeholder: 'Ex. : 120 m³ BPE C25/30 + 2 500 m² pavés 8cm + 400 ml bordures T2',
    submitLabel: 'Envoyer la commande à SB-S Industries',
  },
  'sbs-logistik': {
    id: 'sbs-logistik',
    name: 'SB-S Logistik',
    badge: 'SB-S Logistik · Parc Engins Lourds, Grues & Transport Exceptionnel',
    title: 'Réserver un engin de chantier, une grue ou un transport lourd',
    subtitle:
      'Location d’engins avec ou sans opérateur qualifié : grues mobiles télescopiques (35T à 100T), pelles 36T, compacteurs, bennes 8x4, porte-chars et pompes à béton.',
    address: 'Zone Franche Industrielle (ZFI) de Mbao, Route Nationale',
    phone: '+221 33 871 08 61 / +221 77 858 61 05',
    whatsapp: '221778586105',
    email: 'rokhayakane.sbs@gmail.com',
    needCategory: 'Engins',
    sector: 'Location d’engins & logistique chantier',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500',
    accentBg: 'bg-amber-500/10 dark:bg-amber-500/15 ring-1 ring-amber-500',
    accentCheckbox: 'accent-amber-500',
    domains: [
      { id: 'Grues mobiles & Levage lourd (35T à 100T)', desc: 'Levage de charpentes métalliques, préfabriqués et équipements industriels' },
      { id: 'Terrassement (Pelles 36T, Chargeuses, Niveleuses, Compacteurs)', desc: 'Excavation, déblais/remblais et compactage de plateformes' },
      { id: 'Transport vrac & Camions bennes 8x4', desc: 'Acheminement granulats, latérite, basalte et évacuation déblais' },
      { id: 'Porte-char & Convoi exceptionnel', desc: 'Transfert d’engins lourds et pièces hors gabarit sur tout le Sénégal' },
    ],
    checklistTitle: '2. Matériels & Services logistiques requis',
    checklist: [
      'Grue mobile télescopique (35T / 60T / 80T / 100T)',
      'Pelle hydraulique sur chenilles (36T) ou pneus',
      'Compacteur vibrant / Niveleuse / Bulldozer',
      'Flotte de camions bennes 8x4',
      'Porte-char / Convoi exceptionnel',
      'Pompe à béton ou toupie',
    ],
    param1Label: 'Formule de location',
    param1Options: ['Avec opérateur qualifié + carburant', 'Avec opérateur qualifié (hors carburant)', 'Location sèche longue durée (> 3 mois)'],
    param2Label: 'Durée estimée de mobilisation',
    param2Options: ['Ponctuel (1 à 7 jours)', 'Courte durée (1 à 4 semaines)', 'Moyenne durée (1 à 3 mois)', 'Longue durée (> 3 mois)'],
    param3Label: 'Charge max, hauteur de levage ou tonnage (optionnel)',
    param3Placeholder: 'Ex. : Levage charpente 18T à 24m / 5 camions bennes pendant 3 semaines',
    submitLabel: 'Demander un devis de location à SB-S Logistik',
  },
  p2m: {
    id: 'p2m',
    name: 'P2M · Polytech Matériaux Matériels',
    badge: 'P2M · Fourniture Globale d’Équipements, Matériels & Matériaux',
    title: 'Constituer un devis équipements, matériels & matériaux P2M',
    subtitle:
      'Approvisionnement complet du gros œuvre aux finitions : l’ensemble des fournitures d’équipements, de matériels et de matériaux (carrelage, sanitaire, robinetterie, quincaillerie technique, outillage et matériaux).',
    address: 'Mbao Ville Neuve, Villa S04, Dakar',
    phone: '+221 78 832 12 79',
    whatsapp: '221784246445',
    email: 'p2m.senegal@gmail.com',
    needCategory: 'Materiaux',
    sector: 'Fourniture équipements, matériels & matériaux BTP',
    accentText: 'text-orange-400',
    accentBorder: 'border-orange-500',
    accentBg: 'bg-orange-500/10 dark:bg-orange-500/15 ring-1 ring-orange-500',
    accentCheckbox: 'accent-orange-500',
    domains: [
      { id: 'Carrelage, Faïence & Revêtements grand format', desc: 'Céramique, grès cérame, porcelaine, effet marbre/bois (30×30 à 120×240)' },
      { id: 'Équipements sanitaires & Robinetterie', desc: 'WC complets/suspendus, lavabos, receveurs, mitigeurs et accessoires' },
      { id: 'Matériaux de gros œuvre & second œuvre', desc: 'Ciment, fer à béton, agglos, hourdis, étanchéité, peinture et colles' },
      { id: 'Équipements techniques, Outillage & Quincaillerie', desc: 'Matériels de chantier, équipements électriques/plomberie et EPI' },
    ],
    checklistTitle: '2. Familles de fournitures recherchées',
    checklist: [
      'Carrelage sol & mur (intérieur / extérieur 20mm)',
      'Sanitaires complets & Robinetterie',
      'Matériaux de gros œuvre (acier, ciment, granulats)',
      'Équipements techniques & Quincaillerie pro',
      'Matériels de chantier & Outillage',
      'Livraison directe sur chantier',
    ],
    param1Label: 'Type de commande',
    param1Options: ['Lot complet chantier / Promoteur (tarif gros)', 'Commande entreprise / Artisan', 'Particulier / Villa / Rénovation'],
    param2Label: 'Mode de retrait / livraison',
    param2Options: ['Livraison directe sur chantier (Dakar / Régions)', 'Retrait au Showroom P2M (Mbao Ville Neuve)', 'Livraisons échelonnées par lots'],
    param3Label: 'Surfaces (m²) ou quantités estimées',
    param3Placeholder: 'Ex. : 1 200 m² carrelage 60x120 + 25 ensembles sanitaires + lots quincaillerie',
    submitLabel: 'Demander un devis à P2M',
  },
  pgt: {
    id: 'pgt',
    name: 'PGT · Sourcing & Transit International',
    badge: 'PGT · Sourcing International, Fret Maritime & Transit Portuaire',
    title: 'Lancer une demande de sourcing international ou de transit',
    subtitle:
      'Import-export clé en main entre Dakar et Dubaï / Europe / Asie / Turquie : recherche fournisseurs usines, profilés acier, équipements industriels, fret maritime FCL/LCL et dédouanement Port de Dakar.',
    address: 'Dakar, Sénégal · Bureau Dubaï – Ajman (Émirats Arabes Unis)',
    phone: '+971 52 763 1629',
    whatsapp: '971527631629',
    email: 'pgt.senegal@gmail.com',
    needCategory: 'Sourcing',
    sector: 'Commerce international, sourcing & transit',
    accentText: 'text-purple-400',
    accentBorder: 'border-purple-500',
    accentBg: 'bg-purple-500/10 dark:bg-purple-500/15 ring-1 ring-purple-500',
    accentCheckbox: 'accent-purple-500',
    domains: [
      { id: 'Sourcing usines (Acier, Matériaux & Équipements)', desc: 'Profilés HEB/IPE, tôles, machines industrielles, matériaux finition' },
      { id: 'Fret maritime conteneurisé (FCL 20’/40’ & LCL)', desc: 'Transport international depuis Dubaï, Chine, Turquie, Espagne, Italie' },
      { id: 'Transit, Dédouanement & Livraison Port de Dakar', desc: 'Formalités douanières, enlèvement PAD et acheminement site' },
      { id: 'Inspection qualité & Consolidation fournisseurs', desc: 'Contrôle avant embarquement et regroupement multi-fournisseurs' },
    ],
    checklistTitle: '2. Maillons de la chaîne import-export souhaités',
    checklist: [
      'Recherche & négociation usine (Sourcing)',
      'Contrôle qualité avant expédition',
      'Fret maritime FCL (conteneur complet 20’ / 40’)',
      'Groupage LCL ou Fret aérien urgent',
      'Dédouanement & Transit Port Autonome de Dakar',
      'Livraison finale sur site / usine client',
    ],
    param1Label: 'Zone d’origine souhaitée',
    param1Options: ['Émirats (Dubaï / Ajman)', 'Europe (Espagne, Italie, France)', 'Turquie', 'Asie (Chine / Inde)', 'Meilleure origine recommandée par PGT'],
    param2Label: 'Incoterm / Prestation cible',
    param2Options: ['DDP (Livré dédouané sur site au Sénégal)', 'CIF Port de Dakar', 'FOB / EXW + Transit seul'],
    param3Label: 'Nature des marchandises, volume ou tonnage',
    param3Placeholder: 'Ex. : 2×40’ HC profilés acier IPE/HEB ou équipements laboratoire / ligne industrielle',
    submitLabel: 'Transmettre la demande à PGT',
  },
};

function getEntityIcon(id: SupportedEntityFormId) {
  switch (id) {
    case 'sbs-group':
      return Building2;
    case 'sbs-industries':
      return Factory;
    case 'sbs-logistik':
      return Truck;
    case 'p2m':
      return Layers;
    case 'pgt':
      return Globe;
  }
}

export function EntityConsultationForm({ entityId }: { entityId: SupportedEntityFormId }) {
  const cfg = ENTITY_FORM_CONFIGS[entityId];
  const Icon = getEntityIcon(entityId);

  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [domain, setDomain] = useState(cfg.domains[0].id);
  const [selectedChecks, setSelectedChecks] = useState<string[]>([cfg.checklist[0]]);
  const [param1, setParam1] = useState(cfg.param1Options[0]);
  const [param2, setParam2] = useState(cfg.param2Options[0]);
  const [param3, setParam3] = useState('');
  const [siteLocation, setSiteLocation] = useState('Dakar');
  const [timeframe, setTimeframe] = useState<'Immédiat' | '1–3 mois' | '3–6 mois' | '> 6 mois'>('1–3 mois');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const toggleCheck = (item: string) => {
    setSelectedChecks((prev) =>
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
      company: company.trim() || `Client ${cfg.name}`,
      role: 'Décideur / Maître d’ouvrage',
      phone: phone.trim(),
      email: email.trim(),
      country: 'Sénégal',
      city: siteLocation.trim() || 'Dakar',
      sector: cfg.sector,
      source: 'Assistant qualification',
      needCategory: cfg.needCategory,
      projectType: `${domain} (${param1} · ${param2})${selectedChecks.length ? ` — ${selectedChecks.join(', ')}` : ''}`,
      projectLocation: siteLocation.trim() || 'Dakar',
      projectStage: 'Étude',
      budgetRange: param3.trim() || param2,
      timeframe,
      filesCount: 0,
    });

    setCreatedLead(created);
  };

  const buildWhatsappUrl = () => {
    const text = [
      `Bonjour ${cfg.name}, je souhaite faire une demande :`,
      `• Client : ${fullName}${company ? ` (${company})` : ''}`,
      `• Tél : ${phone} · Email : ${email}`,
      `• Besoin principal : ${domain}`,
      `• Détails sélectionnés : ${selectedChecks.join(', ') || 'À préciser'}`,
      `• ${cfg.param1Label} : ${param1}`,
      `• ${cfg.param2Label} : ${param2}`,
      param3 ? `• ${cfg.param3Label} : ${param3}` : '',
      `• Site : ${siteLocation} · Délai : ${timeframe}`,
      notes ? `• Précisions : ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
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
              Dossier transmis à {cfg.name} · Réf. {createdLead.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white mt-2">
              Votre demande est enregistrée
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
              L’équipe dédiée de <strong>{cfg.name}</strong> prend en charge votre dossier et vous répond sous 24h ouvrées.
            </p>
          </div>

          <div className="text-left bg-neutral-50 dark:bg-brand-900/70 border border-neutral-200 dark:border-brand-700 rounded-xl p-4 text-xs sm:text-sm space-y-1.5">
            <div><strong>Domaine :</strong> {domain}</div>
            <div><strong>Éléments :</strong> {selectedChecks.join(', ') || 'À préciser'}</div>
            <div><strong>{cfg.param1Label} :</strong> {param1}</div>
            <div><strong>{cfg.param2Label} :</strong> {param2}</div>
            {param3 && <div><strong>Volume / Spécifications :</strong> {param3}</div>}
            <div><strong>Site :</strong> {siteLocation} · <strong>Délai :</strong> {timeframe}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm font-bold"
            >
              <span>Envoyer sur WhatsApp {cfg.name}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href={`/entites/${cfg.id}`}
              className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-brand-600 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-brand-700 transition"
            >
              Retour à {cfg.name}
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
          { label: cfg.name, href: `/entites/${cfg.id}` },
          { label: 'Consultation dédiée' },
        ]}
      />

      <div className="mt-4 mb-8 bg-brand-900 text-white rounded-2xl p-6 sm:p-8 border border-brand-700 shadow-lg">
        <div className={`flex flex-wrap items-center gap-2 text-xs font-mono ${cfg.accentText} uppercase tracking-wider mb-2`}>
          <Icon className="w-4 h-4" />
          <span>{cfg.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-title font-bold">{cfg.title}</h1>
        <p className="text-sm text-neutral-300 mt-2 max-w-3xl">{cfg.subtitle}</p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-200">
          <div className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700">
            <MapPin className={`w-4 h-4 ${cfg.accentText} shrink-0`} />
            <span>{cfg.address}</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700">
            <Phone className={`w-4 h-4 ${cfg.accentText} shrink-0`} />
            <span>{cfg.phone}</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-950/60 px-3 py-2 rounded-lg border border-brand-700">
            <Mail className={`w-4 h-4 ${cfg.accentText} shrink-0`} />
            <span>{cfg.email}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div>
          <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
            <Icon className="w-5 h-5 text-accent-500" />
            1. Sélectionnez votre besoin principal {cfg.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cfg.domains.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDomain(d.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  domain === d.id
                    ? `${cfg.accentBorder} ${cfg.accentBg}`
                    : 'border-neutral-200 dark:border-brand-700 hover:border-accent-400'
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
              <ClipboardList className="w-4 h-4 text-accent-500" />
              {cfg.checklistTitle}
            </h2>
            <div className="space-y-2">
              {cfg.checklist.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-neutral-200 dark:border-brand-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-brand-900/50 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedChecks.includes(item)}
                    onChange={() => toggleCheck(item)}
                    className={cfg.accentCheckbox}
                  />
                  <span className="text-neutral-800 dark:text-neutral-200">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-3">
              3. Paramètres spécifiques {cfg.name}
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                {cfg.param1Label}
              </label>
              <select
                value={param1}
                onChange={(e) => setParam1(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              >
                {cfg.param1Options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                {cfg.param2Label}
              </label>
              <select
                value={param2}
                onChange={(e) => setParam2(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              >
                {cfg.param2Options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                {cfg.param3Label}
              </label>
              <input
                type="text"
                value={param3}
                onChange={(e) => setParam3(e.target.value)}
                placeholder={cfg.param3Placeholder}
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-brand-700 pt-6">
          <h2 className="text-base font-title font-bold text-neutral-900 dark:text-white mb-4">
            4. Localisation, Délai &amp; Vos coordonnées
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Site / Localisation *
              </label>
              <input
                type="text"
                required
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="Ex. Dakar, Diamniadio, Thiès, Régions..."
                className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                Délai souhaité
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
                placeholder="Société, maître d’ouvrage ou particulier"
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
              Précisions complémentaires (optionnel)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez toute précision utile pour le traitement rapide de votre demande..."
              className="w-full rounded-lg border border-neutral-300 dark:border-brand-600 bg-white dark:bg-brand-900 px-3 py-2 text-sm text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{cfg.email} · Traitement direct {cfg.name}</span>
          </div>
          <button type="submit" className="btn-primary inline-flex items-center gap-2 font-bold">
            <span>{cfg.submitLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
