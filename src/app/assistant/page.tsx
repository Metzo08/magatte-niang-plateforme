'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Hammer,
  Building2,
  FlaskConical,
  Layers,
  Globe,
  Truck,
  Factory,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Upload,
  FileText,
  ShieldCheck,
  Zap,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ENTITIES } from '@/data/initialData';
import { store } from '@/lib/store';
import { EntityId, Lead } from '@/types';

export default function AssistantPage() {
  const [step, setStep] = useState(1);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    needCategory: '',
    projectType: '',
    region: 'Dakar',
    city: 'Dakar',
    projectStage: 'Étude' as 'Idée' | 'Étude' | 'Appel d\'offres' | 'Démarrage',
    budgetRange: '50 M - 150 M FCFA',
    timeframe: '1–3 mois' as 'Immédiat' | '1–3 mois' | '3–6 mois' | '> 6 mois',
    filesCount: 0,
    fileNames: [] as string[],
    fullName: '',
    company: '',
    role: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const draft = localStorage.getItem('mn_assistant_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save draft on changes
  useEffect(() => {
    try {
      localStorage.setItem('mn_assistant_draft', JSON.stringify(formData));
    } catch (e) {
      console.error(e);
    }
  }, [formData]);

  const needCategories = [
    { id: 'Charpente', title: 'Construction métallique / charpente', desc: 'Hangars, bâtiments industriels, structures acier', icon: Hammer, entity: 'SERMA BTP', color: '#1B4965' },
    { id: 'Infrastructures', title: 'Génie civil / ouvrages d\'art / VRD', desc: 'Ponts, voiries lourdes, plateformes multimodales', icon: Building2, entity: 'SB-S Group', color: '#2D6A8E' },
    { id: 'Geotechnique', title: 'Géotechnique / essais labo / bétons', desc: 'Sondages de sol, essais CBR, écrasement béton', icon: FlaskConical, entity: 'SB-S Labo', color: '#1F9D6B' },
    { id: 'Materiaux', title: 'Matériaux finition / carrelage / sanitaires', desc: 'Grès cérame, faïence, équipements de salle d\'eau', icon: Layers, entity: 'P2M', color: '#C0562F' },
    { id: 'Engins', title: 'Location d\'engins / transport lourd', desc: 'Pelles 36T, grues télescopiques 60T, bennes 8x4', icon: Truck, entity: 'SB-S Logistik', color: '#E0A800' },
    { id: 'Prefabrication', title: 'Préfabrication béton industrielle', desc: 'Prédalles, bordures normalisées, tuyaux assainissement', icon: Factory, entity: 'SB-S Industries', color: '#6B7A8F' },
    { id: 'Sourcing', title: 'Sourcing international / importation', desc: 'Matières premières, fret maritime, transit portuaire', icon: Globe, entity: 'PGT Transit', color: '#7A5AA8' },
    { id: 'Conseil', title: 'Expertise technique & conseil direction', desc: 'Audit de structure, arbitrage Eurocodes, diagnostic', icon: HelpCircle, entity: 'Magatte Niang', color: '#0B1B2B' }
  ];

  const projectTypesByNeed: Record<string, string[]> = {
    'Charpente': [
      'Hangar industriel grande portée (> 30m)',
      'Bâtiment logistique ou entrepôt de stockage',
      'Unité de transformation agro-industrielle',
      'Auvent commercial ou station-service',
      'Passerelle ou pont métallique'
    ],
    'Infrastructures': [
      'Voirie urbaine et Réseaux Divers (VRD)',
      'Pont routier ou ouvrage hydraulique',
      'Aménagement de plateforme logistique / portuaire',
      'Digue maritime ou protection côtière',
      'Travaux de terrassement de masse'
    ],
    'Geotechnique': [
      'Étude de sol pour fondation bâtiment (G2 AVP / PRO)',
      'Essais CBR & Proctor pour plateforme routière',
      'Contrôle qualité bétonnage in-situ (éprouvettes)',
      'Sondage carotté grande profondeur (> 20m)',
      'Auscultation d\'ouvrage existant'
    ],
    'Materiaux': [
      'Lot carrelage immeuble résidentiel (500 à 5000 m²)',
      'Revêtement sol showroom ou bureaux haut standing',
      'Carrelage extérieur 20mm antidérapant pour piscine/terrasse',
      'Équipement complet salles de bains / sanitaires',
      'Carrelage grand format poli 60x120 ou 120x240 cm'
    ],
    'Engins': [
      'Pelle chenille 36 Tonnes avec opérateur',
      'Grue mobile télescopique 60T ou 100T',
      'Flotte de camions bennes 8x4 pour transport remblais',
      'Compacteur vibrant monocylindre 14T',
      'Mission combinée levage et convoi exceptionnel'
    ],
    'Prefabrication': [
      'Prédalles industrielles béton armé',
      'Bordures de voirie T1 / T2 / A2 normalisées',
      'Pavés autobloquants 6cm ou 8cm haute résistance',
      'Caniveaux et dalots béton préfabriqués',
      'Poutres précontraintes de bâtiment'
    ],
    'Sourcing': [
      'Importation profilés acier marchands HEB / IPE',
      'Approvisionnement équipements techniques usine',
      'Fret conteneurisé FCL maritime depuis Europe/Asie',
      'Dédouanement et transit express port de Dakar'
    ],
    'Conseil': [
      'Expertise structurelle après sinistre ou fissuration',
      'Audit de conformité Eurocodes 3 / NF P',
      'Contre-expertise pour maître d\'ouvrage'
    ]
  };

  const senegalRegions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Fatick', 'Kaolack', 'Diourbel',
    'Ziguinchor', 'Louga', 'Tambacounda', 'Kédougou', 'Kolda', 'Matam', 'Sédhiou', 'Kaffrine', 'Autre Afrique de l\'Ouest'
  ];

  const budgetRanges = [
    'Moins de 10 Millions FCFA',
    '10 M - 50 M FCFA',
    '50 M - 150 M FCFA',
    '150 M - 500 M FCFA',
    'Plus de 500 Millions FCFA',
    'Budget non défini / À estimer'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map(f => f.name);
      setFormData(prev => ({
        ...prev,
        filesCount: prev.filesCount + names.length,
        fileNames: [...prev.fileNames, ...names]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      alert('Veuillez renseigner votre nom, téléphone et adresse email.');
      return;
    }

    const created = store.createLead({
      fullName: formData.fullName,
      company: formData.company,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      country: 'Sénégal',
      city: formData.city,
      sector: 'BTP & Construction',
      source: 'Assistant qualification',
      needCategory: formData.needCategory || 'Général',
      projectType: formData.projectType || 'Projet BTP',
      projectLocation: `${formData.city}, Région ${formData.region}`,
      projectStage: formData.projectStage,
      budgetRange: formData.budgetRange,
      timeframe: formData.timeframe,
      filesCount: formData.filesCount
    });

    setCreatedLead(created);
    localStorage.removeItem('mn_assistant_draft');
  };

  // SUCCESS SCREEN
  if (createdLead) {
    const assignedEntityInfo = ENTITIES.find(e => e.id === createdLead.assignedEntityId);
    return (
      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-l p-8 shadow-elev-3 text-center space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono  font-bold text-accent-500 tracking-wider">
              Demande enregistrée avec succès (§ 10.3 & § 20)
            </span>
            <h1 className="text-2xl sm:text-3xl font-title font-bold text-neutral-900 dark:text-white">
              Votre dossier technique a été qualifié
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Un accusé de réception a été envoyé à <strong>{createdLead.email}</strong>.
            </p>
          </div>

          {/* DOSSIER SUMMARY CARD */}
          <div className="bg-neutral-50 dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-m p-5 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-brand-800">
              <span className="text-neutral-500">Numéro de dossier :</span>
              <strong className="text-accent-500 text-sm">{createdLead.leadNumber}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Pôle d'affectation automatique :</span>
              <span className="font-bold text-neutral-900 dark:text-white px-2 py-0.5 rounded bg-neutral-200 dark:bg-brand-800">
                {assignedEntityInfo?.name || createdLead.assignedEntityId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Score de priorité commerciale :</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {createdLead.score} / 100 ({createdLead.score >= 70 ? 'Priorité Haute' : 'Priorité Normale'})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Délai d'engagement de réponse :</span>
              <strong className="text-neutral-900 dark:text-white">&lt; 4 heures ouvrées</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/espace-pro`}
              className="w-full sm:w-auto px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m shadow-sm text-sm"
            >
              Suivre mon dossier en ligne
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 border border-neutral-300 dark:border-brand-700 text-neutral-700 dark:text-neutral-200 font-semibold rounded-m text-sm hover:bg-neutral-100 dark:hover:bg-brand-700"
            >
              Retour à l'accueil
            </Link>
          </div>

        </div>
      </div>
    );
  }

  const currentAvailableTypes = formData.needCategory ? (projectTypesByNeed[formData.needCategory] || []) : [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 pb-16">
      <Breadcrumb items={[{ label: 'Assistant de qualification de projet' }]} />

      <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* TOP HEADER */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>Assistant intelligent multi-étapes (§ 10)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-title font-bold text-neutral-900 dark:text-white">
            Qualification & chiffrage de votre projet BTP
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            Renseignez votre besoin technique en quelques étapes pour un routage instantané vers la bonne entité de l'écosystème.
          </p>

          {/* QUICK MODE TOGGLE FOR SLOW CONNECTIONS (EF-14) */}
          <div className="pt-2">
            <button
              onClick={() => setIsQuickMode(!isQuickMode)}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 font-mono"
            >
              <Zap className="w-3.5 h-3.5 text-accent-500" />
              <span>{isQuickMode ? 'Passer en mode détaillé (8 étapes)' : 'Connexion lente ? Passer en mode express (3 étapes)'}</span>
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2">
            <span>Étape {step} sur {isQuickMode ? '3' : '8'}</span>
            <span className="text-accent-500 font-bold">
              {Math.round((step / (isQuickMode ? 3 : 8)) * 100)}% complété
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 dark:bg-brand-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-500 transition-all duration-300 ease-out"
              style={{ width: `${(step / (isQuickMode ? 3 : 8)) * 100}%` }}
            />
          </div>
        </div>

        {/* MAIN FORM CONTAINER */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded-l p-6 sm:p-10 shadow-elev-2">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* QUICK MODE FLOW (3 STEPS) */}
            {isQuickMode ? (
              <>
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white">
                      1. Quel est votre besoin technique principal ?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {needCategories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, needCategory: c.id }));
                            setStep(2);
                          }}
                          className={`p-3.5 text-left border rounded-m transition-all flex items-center gap-3 ${
                            formData.needCategory === c.id
                              ? 'border-accent-500 bg-accent-50 dark:bg-brand-900 ring-2 ring-accent-500/20'
                              : 'border-neutral-300 dark:border-brand-700 hover:border-brand-500'
                          }`}
                        >
                          <div className="w-8 h-8 rounded flex items-center justify-center text-white shrink-0" style={{ backgroundColor: c.color }}>
                            <c.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-title font-bold text-sm text-neutral-900 dark:text-white">{c.title}</div>
                            <div className="text-[11px] text-neutral-500">{c.entity}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white">
                      2. Décrivez brièvement votre projet et localisation
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Région d'intervention
                        </label>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm text-neutral-900 dark:text-white"
                        >
                          {senegalRegions.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Détails du besoin / spécifications
                        </label>
                        <textarea
                          rows={4}
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Ex : hangar 1200m² à Diamniadio, sol compressible, démarrage prévu sous 2 mois..."
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border rounded-m text-xs font-semibold">
                        Précédent
                      </button>
                      <button type="button" onClick={() => setStep(3)} className="px-5 py-2 bg-accent-500 text-white rounded-m text-xs font-bold">
                        Suivant : mes coordonnées
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white">
                      3. Vos coordonnées pour la transmission du devis
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Ex: Amadou Diallo"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Entreprise / organisme
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Ex: BTP Sénégal SARL"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Numéro de téléphone * (WhatsApp)
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+221 77 000 00 00"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Adresse email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="a.diallo@entreprise.sn"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => setStep(2)} className="px-4 py-2 border rounded-m text-xs font-semibold">
                        Précédent
                      </button>
                      <button type="submit" className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-m text-sm font-bold shadow-elev-2">
                        Valider et recevoir mon orientation
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* FULL 8 STEPS DETAILED FLOW (§ 10.1) */
              <>
                {/* STEP 1: BESOIN */}
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 1 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        Quel est votre besoin prioritaire ?
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Sélectionnez la catégorie majeure pour aiguiller votre demande.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {needCategories.map((cat) => {
                        const isSelected = formData.needCategory === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, needCategory: cat.id, projectType: '' }));
                              setStep(2);
                            }}
                            className={`p-4 border rounded-l cursor-pointer transition-all flex items-start gap-3.5 ${
                              isSelected
                                ? 'border-accent-500 bg-accent-50/50 dark:bg-brand-900 ring-2 ring-accent-500/20 shadow-elev-1'
                                : 'border-neutral-300 dark:border-brand-700 hover:border-brand-500 dark:hover:border-brand-500 bg-white dark:bg-brand-850'
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-m flex items-center justify-center text-white shrink-0 shadow-sm"
                              style={{ backgroundColor: cat.color }}
                            >
                              <cat.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-title font-bold text-sm text-neutral-900 dark:text-white">
                                  {cat.title}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                {cat.desc}
                              </p>
                              <span className="text-[10px] font-mono font-semibold text-accent-500 mt-1 block">
                                Pôle : {cat.entity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: TYPE DE PROJET CONDITIONNEL */}
                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 2 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        Précisez la nature de votre ouvrage ou prestation
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {currentAvailableTypes.map((type, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, projectType: type }));
                            setStep(3);
                          }}
                          className={`p-3.5 text-left border rounded-m transition-all flex items-center justify-between text-sm ${
                            formData.projectType === type
                              ? 'border-accent-500 bg-accent-50 dark:bg-brand-900 font-bold text-neutral-900 dark:text-white'
                              : 'border-neutral-300 dark:border-brand-700 hover:border-brand-500 text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          <span>{type}</span>
                          <ChevronRight className="w-4 h-4 text-neutral-400" />
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border border-neutral-300 dark:border-brand-700 rounded-m text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: LOCALISATION */}
                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 3 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        Où se situe le projet d'intervention ?
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Région administrative *
                        </label>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm text-neutral-900 dark:text-white"
                        >
                          {senegalRegions.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Ville / localité précise *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Ex: Diamniadio, Mbao, Saint-Louis..."
                          className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-2 border border-neutral-300 dark:border-brand-700 rounded-m text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-m text-xs font-bold flex items-center gap-1.5"
                      >
                        Suivant <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: STADE */}
                {step === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 4 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        À quel stade se trouve votre projet ?
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'Idée', title: 'Phase Idée / Avant-projet sommaire', desc: 'Besoin d\'une première estimation budgétaire' },
                        { id: 'Étude', title: 'Phase étude d\'exécution', desc: 'Plans en cours, recherche de validation technique' },
                        { id: 'Appel d\'offres', title: 'Dossier d\'appel d\'offres (DAO)', desc: 'Cahier des charges formalisé, consultation ouverte' },
                        { id: 'Démarrage', title: 'Démarrage immédiat chantier', desc: 'Ordre de service imminent, besoin opérationnel' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, projectStage: st.id as any }));
                            setStep(5);
                          }}
                          className={`p-4 text-left border rounded-m transition-all ${
                            formData.projectStage === st.id
                              ? 'border-accent-500 bg-accent-50 dark:bg-brand-900 ring-2 ring-accent-500/20'
                              : 'border-neutral-300 dark:border-brand-700 hover:border-brand-500'
                          }`}
                        >
                          <div className="font-title font-bold text-sm text-neutral-900 dark:text-white">{st.title}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{st.desc}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-4 py-2 border border-neutral-300 dark:border-brand-700 rounded-m text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: BUDGET */}
                {step === 5 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 5 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        Fourchette de budget estimée (Facultatif)
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {budgetRanges.map((b, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, budgetRange: b }));
                            setStep(6);
                          }}
                          className={`p-3.5 text-left border rounded-m transition-all font-mono text-xs ${
                            formData.budgetRange === b
                              ? 'border-accent-500 bg-accent-50 dark:bg-brand-900 font-bold text-accent-600 dark:text-accent-400'
                              : 'border-neutral-300 dark:border-brand-700 hover:border-brand-500 text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="px-4 py-2 border border-neutral-300 dark:border-brand-700 rounded-m text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: ÉCHÉANCE */}
                {step === 6 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 6 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        Sous quel délai prévoyez-vous la réalisation ?
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'Immédiat', label: 'Immédiat', sub: '< 1 mois' },
                        { id: '1–3 mois', label: '1 à 3 mois', sub: 'Court terme' },
                        { id: '3–6 mois', label: '3 à 6 mois', sub: 'Moyen terme' },
                        { id: '> 6 mois', label: '> 6 mois', sub: 'Long terme' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, timeframe: t.id as any }));
                            setStep(7);
                          }}
                          className={`p-4 text-center border rounded-m transition-all ${
                            formData.timeframe === t.id
                              ? 'border-accent-500 bg-accent-50 dark:bg-brand-900 font-bold ring-2 ring-accent-500/20'
                              : 'border-neutral-300 dark:border-brand-700 hover:border-brand-500'
                          }`}
                        >
                          <div className="font-title font-bold text-sm text-neutral-900 dark:text-white">{t.label}</div>
                          <div className="text-[11px] text-neutral-500 mt-1">{t.sub}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        className="px-4 py-2 border border-neutral-300 dark:border-brand-700 rounded-m text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: PIÈCES JOINTES */}
                {step === 7 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 7 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        Pièces jointes techniques disponibles (Facultatif)
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Formats acceptés : PDF, DWG/DXF, Images, DOCX, XLSX, ZIP. Servis par URL sécurisée (§ 10.2).
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-neutral-300 dark:border-brand-700 rounded-l p-6 text-center bg-neutral-50 dark:bg-brand-900/50">
                      <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Glissez vos fichiers ou cliquez pour téléverser vos plans / CCTP
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="mt-3 text-xs text-neutral-500 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand-700 file:text-white hover:file:bg-brand-600 cursor-pointer"
                      />
                    </div>

                    {formData.fileNames.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Fichiers sélectionnés :</span>
                        {formData.fileNames.map((name, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono text-brand-700 dark:text-brand-300 bg-neutral-100 dark:bg-brand-800 px-2 py-1 rounded">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <button
                        type="button"
                        onClick={() => setStep(6)}
                        className="px-4 py-2 border border-neutral-300 dark:border-brand-700 rounded-m text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(8)}
                        className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-m text-xs font-bold flex items-center gap-1.5"
                      >
                        Suivant : mes coordonnées <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 8: COORDONNÉES EN DERNIER (§ 10.1) */}
                {step === 8 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <span className="text-xs font-mono font-bold text-accent-500 ">Étape 8 sur 8</span>
                      <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">
                        Vos coordonnées pour la transmission du dossier
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Renseignées en dernier pour finaliser votre dossier technique.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Nom & prénom *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Ex: Ibrahima Ndiaye"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Entreprise / maître d'ouvrage
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Ex : consortium BTP Sahel"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Téléphone joignable * (WhatsApp)
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+221 77 638 12 00"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                          Adresse email professionnelle *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="i.ndiaye@entreprise.sn"
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="p-3 bg-brand-50 dark:bg-brand-900/60 rounded border border-brand-200 dark:border-brand-700 text-xs text-brand-800 dark:text-brand-300 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          Données strictement confidentielles régies par la CDP Sénégal. Aucune cession à des tiers.
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
                      <button
                        type="button"
                        onClick={() => setStep(7)}
                        className="px-4 py-2 border border-neutral-300 dark:border-brand-700 rounded-m text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-m text-sm font-bold shadow-elev-2 flex items-center gap-2"
                      >
                        <span>Transmettre mon dossier technique</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </form>

        </div>

      </div>
    </div>
  );
}
