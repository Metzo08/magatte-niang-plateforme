'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { store, CartItem, ProProfile } from '@/lib/store';
import { ENTITIES } from '@/data/initialData';
import { Quote, Appointment, DocumentItem, EntityId, AuditLogEntry } from '@/types';
import {
  LayoutDashboard, FileText, Calendar, ShoppingCart, FolderOpen, UserRound, History,
  Plus, Pencil, Trash2, CheckCircle2, X, Lock, LogOut, ShieldCheck, Phone,
  Download, Save, ArrowRight, Sparkles, RotateCcw, Minus, Grid3X3
} from 'lucide-react';
import TilesModule from '@/components/p2m/TilesModule';

/** Onglets de l'espace professionnel */
type Tab = 'dashboard' | 'quotes' | 'tiles' | 'appointments' | 'cart' | 'documents' | 'profile' | 'audit';

interface QuoteItemDraft {
  description: string;
  quantity: number;
  unit: string;
  unitPriceFCFA: number;
}

interface QuoteForm {
  mode: 'create' | 'edit';
  id?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  entityId: EntityId;
  validUntil: string;
  notes: string;
  items: QuoteItemDraft[];
}

interface AptForm {
  mode: 'create' | 'edit';
  id?: string;
  type: Appointment['type'];
  entityId: EntityId;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  date: string;
  timeSlot: string;
  subject: string;
}

interface DocForm {
  mode: 'create' | 'edit';
  id?: string;
  title: string;
  reference: string;
  category: DocumentItem['category'];
  entityId: EntityId;
  version: string;
  visibility: DocumentItem['visibility'];
  fileSize: string;
  fileType: string;
  url: string;
  publishedAt: string;
  abstract: string;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'quotes', label: 'Mes devis', icon: <FileText className="w-4 h-4" /> },
  { id: 'tiles', label: 'Carreaux P2M', icon: <Grid3X3 className="w-4 h-4" /> },
  { id: 'appointments', label: 'Mes rendez-vous', icon: <Calendar className="w-4 h-4" /> },
  { id: 'cart', label: 'Mon panier', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'documents', label: 'Mes documents', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'profile', label: 'Mon profil', icon: <UserRound className="w-4 h-4" /> },
  { id: 'audit', label: "Journal d'audit", icon: <History className="w-4 h-4" /> },
];

const TIME_SLOTS = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'];
const APT_TYPES: Appointment['type'][] = ['Consultation technique', 'Réunion de projet', 'Visite de chantier', 'Laboratoire', 'Commercial', 'Direction'];
const DOC_CATEGORIES: DocumentItem['category'][] = ['Plaquette', 'Fiche technique', "Rapport d'essai", 'Contrat', 'Certificat', 'Publication'];
const QUOTE_STATUSES: Quote['status'][] = ['Brouillon', 'Envoyé', 'En négociation', 'Accepté', 'Refusé', 'Expiré'];
const APT_STATUSES: Appointment['status'][] = ['Confirmé', 'En attente', 'Annulé', 'Terminé'];
const VISIBILITIES: DocumentItem['visibility'][] = ['Public', 'Client', 'Interne', 'Partenaire'];

const inputCls = 'w-full px-3 py-2 bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-accent-500 transition-colors';
const labelCls = 'block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1';
const btnPrimary = 'inline-flex items-center gap-1.5 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-xs transition-colors';
const btnGhost = 'inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-brand-800 hover:bg-neutral-200 dark:hover:bg-brand-700 text-neutral-700 dark:text-neutral-200 font-semibold rounded-m text-xs transition-colors';

const statusStyles: Record<string, string> = {
  'Envoyé': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'Accepté': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'Brouillon': 'bg-neutral-100 text-neutral-600 dark:bg-brand-900 dark:text-neutral-400',
  'Refusé': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  'Expiré': 'bg-neutral-100 text-neutral-500 dark:bg-brand-900 dark:text-neutral-500',
  'En négociation': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  'Confirmé': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'En attente': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  'Annulé': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  'Terminé': 'bg-neutral-100 text-neutral-600 dark:bg-brand-900 dark:text-neutral-400',
};

const todayPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export default function EspaceProPage() {
  const [authed, setAuthed] = React.useState(false);
  const [passcode, setPasscode] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<Tab>('dashboard');

  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [documents, setDocuments] = React.useState<DocumentItem[]>([]);
  const [profile, setProfile] = React.useState<ProProfile | null>(null);
  const [logs, setLogs] = React.useState<AuditLogEntry[]>([]);

  const [quoteForm, setQuoteForm] = React.useState<QuoteForm | null>(null);
  const [aptForm, setAptForm] = React.useState<AptForm | null>(null);
  const [docForm, setDocForm] = React.useState<DocForm | null>(null);

  const refresh = React.useCallback(() => {
    setQuotes(store.getQuotes());
    setAppointments(store.getAppointments());
    setCart(store.getCart());
    setDocuments(store.getDocuments());
    setProfile(store.getProfile());
    setLogs(store.getAuditLogs());
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('mn_admin_authenticated') === 'true') {
      setAuthed(true);
    }
    refresh();
  }, [refresh]);

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    window.setTimeout(() => setSuccessMsg(''), 4000);
  };

  const fail = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg('');
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const fmt = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`;

  const entityName = (id: string) => ENTITIES.find(e => e.id === id)?.name || id;

  const cartTotal = cart.reduce((sum, item) => sum + item.product.indicativePriceFCFA * item.quantity, 0);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (clean === '2026' || clean === 'admin' || clean === 'admin2026') {
      setAuthed(true);
      sessionStorage.setItem('mn_admin_authenticated', 'true');
      setErrorMsg('');
      refresh();
    } else {
      setErrorMsg("Code d'accès incorrect. Veuillez saisir le code d'administration autorisé.");
    }
  };

  const handleAdminLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem('mn_admin_authenticated');
    setPasscode('');
  };

  // Rôle démonstration : gérant (prix achat/marge visibles dans le module Carreaux).
  const isGerantDemo = true;

  // Écran de verrouillage / accès réservé
  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-brand-950 flex flex-col justify-between">
        <Breadcrumb items={[{ label: 'Espace professionnel (Administration)', href: '/espace-pro' }]} />

        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-xl p-6 sm:p-8 shadow-elev-3 text-center space-y-6">
            <div className="w-16 h-16 bg-brand-800 text-accent-500 border border-brand-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-title font-bold text-neutral-900 dark:text-white">Espace professionnel</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Suivi client & devis : accès réservé aux clients et à l'administration du groupe.
              </p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className={labelCls} htmlFor="passcode">Code d'accès</label>
                <input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className={inputCls}
                  placeholder="••••"
                  autoFocus
                />
              </div>
              {errorMsg && <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>}
              <button type="submit" className={`${btnPrimary} w-full justify-center !py-3`}>
                Déverrouiller l'espace <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                Démonstration : 2026 · admin · admin2026
              </p>
            </form>
          </div>
        </div>

        <div className="text-center py-4 text-xs text-neutral-500">
          Besoin d'aide ? <a href="mailto:contact@magatteniang-expert.sn" className="text-accent-500 underline">contact@magatteniang-expert.sn</a> · +221 33 832 40 10
        </div>
      </div>
    );
  }

  // ========== DEVIS : CRÉATION / MODIFICATION / SUPPRESSION ==========

  const emptyQuoteForm = (): QuoteForm => ({
    mode: 'create',
    clientName: profile?.fullName || '',
    clientCompany: profile?.company || '',
    clientEmail: profile?.email || '',
    clientPhone: profile?.phone || '',
    entityId: (profile?.entityId as EntityId) || 'direction',
    validUntil: todayPlus(30),
    notes: '',
    items: [{ description: '', quantity: 1, unit: 'u', unitPriceFCFA: 0 }],
  });

  const startEditQuote = (q: Quote) => {
    setQuoteForm({
      mode: 'edit',
      id: q.id,
      clientName: q.clientName,
      clientCompany: q.clientCompany,
      clientEmail: q.clientEmail,
      clientPhone: q.clientPhone,
      entityId: q.entityId,
      validUntil: q.validUntil,
      notes: q.notes,
      items: q.items.map(i => ({ description: i.description, quantity: i.quantity, unit: i.unit, unitPriceFCFA: i.unitPriceFCFA })),
    });
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const draftTotals = (f: QuoteForm) => {
    const ht = f.items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPriceFCFA) || 0), 0);
    return { ht, ttc: Math.round(ht * 1.18) };
  };

  const saveQuote = () => {
    if (!quoteForm) return;
    if (!quoteForm.clientName.trim()) return fail("Le nom du client est obligatoire.");
    const items = quoteForm.items.filter(i => i.description.trim());
    if (items.length === 0) return fail("Ajoutez au moins une ligne avec une description.");
    const totalHT = items.reduce((s, i) => s + (Number(i.quantity) || 1) * (Number(i.unitPriceFCFA) || 0), 0);
    const totalTTC = Math.round(totalHT * 1.18);
    const payload = {
      clientName: quoteForm.clientName.trim(),
      clientCompany: quoteForm.clientCompany.trim(),
      clientEmail: quoteForm.clientEmail.trim(),
      clientPhone: quoteForm.clientPhone.trim(),
      entityId: quoteForm.entityId,
      validUntil: quoteForm.validUntil,
      notes: quoteForm.notes,
      items: items.map(i => {
        const qty = Number(i.quantity) || 1;
        const price = Number(i.unitPriceFCFA) || 0;
        return { description: i.description.trim(), quantity: qty, unit: i.unit, unitPriceFCFA: price, totalPriceFCFA: qty * price };
      }),
      totalHT,
      taxRate: 18,
      totalTTC,
    };
    if (quoteForm.mode === 'create') {
      store.createQuote(payload);
      flash("Devis créé et envoyé.");
    } else if (quoteForm.id) {
      store.updateQuote(quoteForm.id, payload);
      flash("Devis mis à jour.");
    }
    setQuoteForm(null);
    refresh();
  };

  const removeQuote = (q: Quote) => {
    if (window.confirm(`Supprimer définitivement le devis ${q.quoteNumber} ?`)) {
      store.deleteQuote(q.id);
      refresh();
      flash("Devis supprimé.");
    }
  };

  const setQuoteStatus = (q: Quote, status: Quote['status']) => {
    store.updateQuote(q.id, { status });
    refresh();
    flash(`Statut du devis ${q.quoteNumber} : ${status}.`);
  };

  const acceptQuote = (q: Quote) => {
    store.acceptQuote(q.id, profile?.fullName || q.clientName);
    refresh();
    flash(`Devis ${q.quoteNumber} accepté et signé.`);
  };

  // ========== RENDEZ-VOUS : CRÉATION / MODIFICATION / SUPPRESSION ==========

  const emptyAptForm = (): AptForm => ({
    mode: 'create',
    type: 'Consultation technique',
    entityId: 'serma-btp',
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    company: profile?.company || '',
    date: todayPlus(3),
    timeSlot: TIME_SLOTS[0],
    subject: '',
  });

  const startEditApt = (a: Appointment) => {
    setAptForm({
      mode: 'edit',
      id: a.id,
      type: a.type,
      entityId: a.entityId,
      fullName: a.fullName,
      email: a.email,
      phone: a.phone,
      company: a.company || '',
      date: a.date,
      timeSlot: a.timeSlot,
      subject: a.subject,
    });
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const saveApt = () => {
    if (!aptForm) return;
    if (!aptForm.fullName.trim()) return fail("Le nom complet est obligatoire.");
    if (!aptForm.date) return fail("La date du rendez-vous est obligatoire.");
    if (!aptForm.subject.trim()) return fail("L'objet du rendez-vous est obligatoire.");
    const payload = {
      type: aptForm.type,
      entityId: aptForm.entityId,
      fullName: aptForm.fullName.trim(),
      email: aptForm.email.trim(),
      phone: aptForm.phone.trim(),
      company: aptForm.company.trim(),
      date: aptForm.date,
      timeSlot: aptForm.timeSlot,
      subject: aptForm.subject.trim(),
    };
    try {
      if (aptForm.mode === 'create') {
        store.bookAppointment(payload);
        flash("Rendez-vous réservé.");
      } else if (aptForm.id) {
        store.updateAppointment(aptForm.id, payload);
        flash("Rendez-vous mis à jour.");
      }
      setAptForm(null);
      refresh();
    } catch (err) {
      fail(err instanceof Error ? err.message : "Impossible d'enregistrer le rendez-vous.");
    }
  };

  const removeApt = (a: Appointment) => {
    if (window.confirm(`Supprimer le rendez-vous du ${a.date} (${a.timeSlot}) ?`)) {
      store.deleteAppointment(a.id);
      refresh();
      flash("Rendez-vous supprimé.");
    }
  };

  const setAptStatus = (a: Appointment, status: Appointment['status']) => {
    store.updateAppointment(a.id, { status });
    refresh();
    flash(`Rendez-vous : ${status}.`);
  };

  // ========== PANIER : MODIFICATION / SUPPRESSION / DEVIS ==========

  const changeQty = (productId: string, qty: number) => {
    store.updateCartQuantity(productId, qty);
    refresh();
  };

  const removeCartItem = (item: CartItem) => {
    if (window.confirm(`Retirer « ${item.product.name} » du panier ?`)) {
      store.updateCartQuantity(item.product.id, 0);
      refresh();
      flash("Produit retiré du panier.");
    }
  };

  const clearCart = () => {
    if (window.confirm("Vider entièrement le panier ?")) {
      store.clearCart();
      refresh();
      flash("Panier vidé.");
    }
  };

  const quoteFromCart = () => {
    if (cart.length === 0) return fail("Le panier est vide.");
    const items = cart.map(item => ({
      description: `${item.product.name} (${item.product.ref})`,
      quantity: item.quantity,
      unit: item.product.unit,
      unitPriceFCFA: item.product.indicativePriceFCFA,
      totalPriceFCFA: item.product.indicativePriceFCFA * item.quantity,
    }));
    const totalHT = items.reduce((s, i) => s + i.totalPriceFCFA, 0);
    const totalTTC = Math.round(totalHT * 1.18);
    store.createQuote({
      clientName: profile?.fullName || "Client",
      clientCompany: profile?.company || '',
      clientEmail: profile?.email || '',
      clientPhone: profile?.phone || '',
      entityId: 'p2m',
      validUntil: todayPlus(30),
      notes: "Demande issue du panier de matériaux (P2M).",
      items,
      totalHT,
      taxRate: 18,
      totalTTC,
    });
    refresh();
    setActiveTab('quotes');
    flash("Devis généré depuis le panier.");
  };

  // ========== DOCUMENTS : CRÉATION / MODIFICATION / SUPPRESSION ==========

  const emptyDocForm = (): DocForm => ({
    mode: 'create',
    title: '',
    reference: '',
    category: 'Fiche technique',
    entityId: 'direction',
    version: 'v1.0',
    visibility: 'Client',
    fileSize: '1 Mo',
    fileType: 'PDF',
    url: '#',
    publishedAt: new Date().toISOString().slice(0, 10),
    abstract: '',
  });

  const startEditDoc = (d: DocumentItem) => {
    setDocForm({
      mode: 'edit',
      id: d.id,
      title: d.title,
      reference: d.reference,
      category: d.category,
      entityId: d.entityId,
      version: d.version,
      visibility: d.visibility,
      fileSize: d.fileSize,
      fileType: d.fileType,
      url: d.url,
      publishedAt: d.publishedAt.slice(0, 10),
      abstract: d.abstract || '',
    });
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const saveDoc = () => {
    if (!docForm) return;
    if (!docForm.title.trim()) return fail("Le titre du document est obligatoire.");
    if (!docForm.reference.trim()) return fail("La référence du document est obligatoire.");
    const payload = {
      title: docForm.title.trim(),
      reference: docForm.reference.trim(),
      category: docForm.category,
      entityId: docForm.entityId,
      version: docForm.version.trim() || 'v1.0',
      isLatest: true,
      visibility: docForm.visibility,
      requiresForm: false,
      isValidatedForAI: false,
      fileSize: docForm.fileSize.trim() || '—',
      fileType: docForm.fileType.trim() || 'PDF',
      url: docForm.url.trim() || '#',
      publishedAt: docForm.publishedAt,
      abstract: docForm.abstract.trim(),
    };
    if (docForm.mode === 'create') {
      store.addDocument(payload);
      flash("Document ajouté.");
    } else if (docForm.id) {
      store.updateDocument(docForm.id, payload);
      flash("Document mis à jour.");
    }
    setDocForm(null);
    refresh();
  };

  const removeDoc = (d: DocumentItem) => {
    if (window.confirm(`Supprimer définitivement le document « ${d.title} » ?`)) {
      store.deleteDocument(d.id);
      refresh();
      flash("Document supprimé.");
    }
  };

  const downloadDoc = (d: DocumentItem) => {
    store.incrementDocDownload(d.id);
    refresh();
    if (d.url && d.url !== '#') window.open(d.url, '_blank');
    flash(`Téléchargement de « ${d.title} » démarré.`);
  };

  // ========== PROFIL ==========

  const saveProfile = () => {
    if (!profile) return;
    store.saveProfile(profile);
    refresh();
    flash("Profil enregistré.");
  };

  // ========== STATISTIQUES DU TABLEAU DE BORD ==========

  const stats: { label: string; value: string; href: Tab; icon: React.ReactNode }[] = [
    { label: 'Devis', value: String(quotes.length), href: 'quotes', icon: <FileText className="w-5 h-5 text-accent-500" /> },
    { label: 'Rendez-vous', value: String(appointments.length), href: 'appointments', icon: <Calendar className="w-5 h-5 text-accent-500" /> },
    { label: 'Panier', value: `${cart.length} produit(s)`, href: 'cart', icon: <ShoppingCart className="w-5 h-5 text-accent-500" /> },
    { label: 'Documents', value: String(documents.length), href: 'documents', icon: <FolderOpen className="w-5 h-5 text-accent-500" /> },
  ];
  // Options d'entités pour les formulaires (7 entités + direction)
  const entityOptions: { id: EntityId; name: string }[] = [
    ...ENTITIES.map(e => ({ id: e.id, name: e.name })),
    { id: 'direction' as EntityId, name: 'Direction générale' },
  ].filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i);

  // Complétude du profil (0-100 %)
  const profileCompleteness = profile
    ? Math.round(
        ((['fullName', 'company', 'email', 'phone', 'city', 'sector'] as const)
          .filter(k => (profile[k] || '').trim().length > 0).length / 6) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-950">
      <Breadcrumb items={[{ label: 'Suivi client & devis', href: '/espace-pro' }, { label: 'Espace professionnel' }]} />

      {/* ===== HERO ===== */}
      <section className="bg-brand-900 dark:bg-brand-950 text-white border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono font-bold text-accent-500 tracking-wider">
                Suivi client & devis
              </span>
              <h1 className="text-3xl sm:text-4xl font-title font-bold tracking-tight">
                Espace professionnel
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Suivez vos demandes de devis, vos rendez-vous confirmés et votre panier de matériaux.
                Vos documents contractuels sont centralisés et traçables.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 bg-brand-800 border border-brand-700 rounded-m text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Session sécurisée
              </span>
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-xs transition-colors"
              >
                <LogOut className="w-4 h-4" /> Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MESSAGES FLASH ===== */}
      <div aria-live="polite">
        {successMsg && (
          <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="flex items-start justify-between gap-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-m px-4 py-3 text-sm">
              <span className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {successMsg}</span>
              <button onClick={() => setSuccessMsg('')} aria-label="Fermer le message"><X className="w-4 h-4 mt-0.5" /></button>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="flex items-start justify-between gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-m px-4 py-3 text-sm">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} aria-label="Fermer le message"><X className="w-4 h-4 mt-0.5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ===== BARRE D'ONGLETS ===== */}
      <nav className="bg-white dark:bg-brand-900 border-b border-neutral-200 dark:border-brand-800" aria-label="Sections de l'espace professionnel">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                aria-current={activeTab === t.id ? 'page' : undefined}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === t.id
                    ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ===== ONGLET : TABLEAU DE BORD ===== */}
      {activeTab === 'dashboard' && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => (
              <button
                key={s.label}
                onClick={() => setActiveTab(s.href)}
                className="text-left bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5 hover:border-accent-500 hover:shadow-elev-2 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  {s.icon}
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </div>
                <p className="text-2xl font-title font-bold text-neutral-900 dark:text-white tabular-nums">{s.value}</p>
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1">{s.label}</p>
              </button>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
            <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white mb-4">Actions rapides</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setQuoteForm(emptyQuoteForm()); setActiveTab('quotes'); }} className={btnPrimary}>
                <Plus className="w-4 h-4" /> Nouveau devis
              </button>
              <button onClick={() => { setAptForm(emptyAptForm()); setActiveTab('appointments'); }} className={btnPrimary}>
                <Calendar className="w-4 h-4" /> Prendre rendez-vous
              </button>
              <button onClick={() => { setDocForm(emptyDocForm()); setActiveTab('documents'); }} className={btnPrimary}>
                <FolderOpen className="w-4 h-4" /> Ajouter un document
              </button>
              <Link href="/catalogue" className={btnGhost}>
                <ShoppingCart className="w-4 h-4" /> Parcourir le catalogue
              </Link>
              <Link href="/assistant" className={btnGhost}>
                <Sparkles className="w-4 h-4" /> Assistant de qualification
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Derniers devis */}
            <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white">Derniers devis</h2>
                <button onClick={() => setActiveTab('quotes')} className="text-xs font-bold text-accent-500 hover:underline">
                  Tout voir
                </button>
              </div>
              {quotes.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Aucun devis pour le moment.</p>
              ) : (
                <ul className="divide-y divide-neutral-200 dark:divide-brand-700">
                  {quotes.slice(0, 4).map(q => (
                    <li key={q.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                          {q.quoteNumber} · {q.clientName}
                        </p>
                        <p className="text-[11px] font-mono text-neutral-500">{formatDate(q.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusStyles[q.status] || ''}`}>{q.status}</span>
                        <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white tabular-nums">{fmt(q.totalTTC)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Prochains rendez-vous */}
            <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white">Prochains rendez-vous</h2>
                <button onClick={() => setActiveTab('appointments')} className="text-xs font-bold text-accent-500 hover:underline">
                  Tout voir
                </button>
              </div>
              {appointments.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Aucun rendez-vous programmé.</p>
              ) : (
                <ul className="divide-y divide-neutral-200 dark:divide-brand-700">
                  {appointments.slice(0, 4).map(a => (
                    <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{a.type}</p>
                        <p className="text-[11px] font-mono text-neutral-500 truncate">{a.subject}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-mono font-bold text-neutral-900 dark:text-white">{a.date}</p>
                        <p className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${statusStyles[a.status] || ''}`}>{a.status}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Complétude du profil */}
          <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white">Complétude du profil</h2>
              <span className="text-xs font-mono font-bold text-accent-500 tabular-nums">{profileCompleteness} %</span>
            </div>
            <div className="h-2.5 bg-neutral-200 dark:bg-brand-800 rounded-full overflow-hidden">
              <div className="h-full bg-accent-500 rounded-full transition-all" style={{ width: `${profileCompleteness}%` }} />
            </div>
            <button onClick={() => setActiveTab('profile')} className={`${btnGhost} mt-4`}>
              <UserRound className="w-4 h-4" /> Compléter mon profil
            </button>
          </div>
        </section>
      )}
      {/* ===== ONGLET : MES DEVIS ===== */}
      {activeTab === 'quotes' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">Mes devis</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{quotes.length} devis · création, modification, suivi des statuts</p>
            </div>
            {!quoteForm && (
              <button onClick={() => setQuoteForm(emptyQuoteForm())} className={btnPrimary}>
                <Plus className="w-4 h-4" /> Nouveau devis
              </button>
            )}
          </div>

          {/* Formulaire devis (création / édition) */}
          {quoteForm && (
            <div className="bg-white dark:bg-brand-900 border-2 border-accent-500 rounded-l p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {quoteForm.mode === 'create' ? 'Créer un devis' : 'Modifier le devis'}
                </h3>
                <button onClick={() => setQuoteForm(null)} aria-label="Fermer le formulaire" className="text-neutral-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls} htmlFor="q-client">Nom du client *</label>
                  <input id="q-client" className={inputCls} value={quoteForm.clientName} onChange={e => setQuoteForm({ ...quoteForm, clientName: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-company">Société</label>
                  <input id="q-company" className={inputCls} value={quoteForm.clientCompany} onChange={e => setQuoteForm({ ...quoteForm, clientCompany: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-email">Email</label>
                  <input id="q-email" type="email" className={inputCls} value={quoteForm.clientEmail} onChange={e => setQuoteForm({ ...quoteForm, clientEmail: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-phone">Téléphone</label>
                  <input id="q-phone" className={inputCls} value={quoteForm.clientPhone} onChange={e => setQuoteForm({ ...quoteForm, clientPhone: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-entity">Entité du groupe</label>
                  <select id="q-entity" className={inputCls} value={quoteForm.entityId} onChange={e => setQuoteForm({ ...quoteForm, entityId: e.target.value as EntityId })}>
                    {entityOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="q-valid">Valable jusqu'au</label>
                  <input id="q-valid" type="date" className={inputCls} value={quoteForm.validUntil} onChange={e => setQuoteForm({ ...quoteForm, validUntil: e.target.value })} />
                </div>
              </div>

              {/* Lignes du devis */}
              <div className="space-y-2">
                <span className={labelCls}>Lignes du devis</span>
                {quoteForm.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 sm:col-span-5">
                      <input
                        className={inputCls}
                        placeholder="Description de la prestation"
                        value={item.description}
                        onChange={e => {
                          const items = [...quoteForm.items];
                          items[idx] = { ...item, description: e.target.value };
                          setQuoteForm({ ...quoteForm, items });
                        }}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="number" min={1} className={inputCls} placeholder="Qté"
                        value={item.quantity}
                        onChange={e => {
                          const items = [...quoteForm.items];
                          items[idx] = { ...item, quantity: Number(e.target.value) };
                          setQuoteForm({ ...quoteForm, items });
                        }}
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <input
                        className={inputCls} placeholder="Unité" value={item.unit}
                        onChange={e => {
                          const items = [...quoteForm.items];
                          items[idx] = { ...item, unit: e.target.value };
                          setQuoteForm({ ...quoteForm, items });
                        }}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-3">
                      <input
                        type="number" min={0} className={inputCls} placeholder="Prix unitaire FCFA"
                        value={item.unitPriceFCFA}
                        onChange={e => {
                          const items = [...quoteForm.items];
                          items[idx] = { ...item, unitPriceFCFA: Number(e.target.value) };
                          setQuoteForm({ ...quoteForm, items });
                        }}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-1">
                      <button
                        onClick={() => setQuoteForm({ ...quoteForm, items: quoteForm.items.filter((_, i) => i !== idx) })}
                        disabled={quoteForm.items.length <= 1}
                        aria-label="Supprimer la ligne"
                        className="w-full flex items-center justify-center px-2 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-m hover:bg-red-100 disabled:opacity-40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setQuoteForm({ ...quoteForm, items: [...quoteForm.items, { description: '', quantity: 1, unit: 'u', unitPriceFCFA: 0 }] })}
                  className={btnGhost}
                >
                  <Plus className="w-4 h-4" /> Ajouter une ligne
                </button>
              </div>

              <div>
                <label className={labelCls} htmlFor="q-notes">Notes</label>
                <textarea id="q-notes" rows={2} className={inputCls} value={quoteForm.notes} onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 dark:border-brand-700 pt-3">
                <p className="text-sm font-mono text-neutral-700 dark:text-neutral-300 tabular-nums">
                  Total HT : <strong>{fmt(draftTotals(quoteForm).ht)}</strong> ·
                  {' '}TTC (18 %) : <strong className="text-accent-500">{fmt(draftTotals(quoteForm).ttc)}</strong>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setQuoteForm(null)} className={btnGhost}>
                    <X className="w-4 h-4" /> Annuler
                  </button>
                  <button onClick={saveQuote} className={btnPrimary}>
                    <Save className="w-4 h-4" /> {quoteForm.mode === 'create' ? 'Créer le devis' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Liste des devis */}
          {quotes.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-brand-800/50 border border-dashed border-neutral-300 dark:border-brand-700 rounded-l p-10 text-center">
              <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Aucun devis. Créez votre première demande de devis.</p>
              <button onClick={() => setQuoteForm(emptyQuoteForm())} className={btnPrimary}>
                <Plus className="w-4 h-4" /> Créer un devis
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map(q => (
                <article key={q.id} className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">{q.quoteNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusStyles[q.status] || ''}`}>{q.status}</span>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                        {q.clientName}{q.clientCompany ? ` · ${q.clientCompany}` : ''} · {entityName(q.entityId)}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        Créé le {formatDate(q.createdAt)} · Valable jusqu'au {formatDate(q.validUntil)} · TTC · {q.items.length} ligne(s)
                      </p>
                    </div>
                    <p className="text-base font-mono font-bold text-accent-500 tabular-nums shrink-0">{fmt(q.totalTTC)}</p>
                  </div>

                  <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    {q.items.map((it, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span className="truncate">{it.quantity} {it.unit} · {it.description}</span>
                        <span className="font-mono tabular-nums shrink-0">{fmt(it.totalPriceFCFA)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    <select
                      aria-label={`Statut du devis ${q.quoteNumber}`}
                      className="px-2 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs font-semibold text-neutral-700 dark:text-neutral-200"
                      value={q.status}
                      onChange={e => setQuoteStatus(q, e.target.value as Quote['status'])}
                    >
                      {QUOTE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {q.status !== 'Accepté' && (
                      <button onClick={() => acceptQuote(q)} className={`${btnPrimary} !bg-emerald-600 hover:!bg-emerald-700`}>
                        <CheckCircle2 className="w-4 h-4" /> Accepter
                      </button>
                    )}
                    <button onClick={() => startEditQuote(q)} className={btnGhost}>
                      <Pencil className="w-4 h-4" /> Modifier
                    </button>
                    <button
                      onClick={() => removeQuote(q)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-m text-xs hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
{/* ===== ONGLET : MES RENDEZ-VOUS ===== */}
      {activeTab === 'appointments' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">Mes rendez-vous</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{appointments.length} rendez-vous · suivi et modification</p>
            </div>
            {!aptForm && (
              <button onClick={() => { setAptForm(emptyAptForm()); }} className={btnPrimary}>
                <Calendar className="w-4 h-4" /> Nouveau rendez-vous
              </button>
            )}
          </div>

          {/* Formulaire rendez-vous (création / édition) */}
          {aptForm && (
            <div className="bg-white dark:bg-brand-900 border-2 border-accent-500 rounded-l p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {aptForm.mode === 'create' ? 'Nouveau rendez-vous' : 'Modifier le rendez-vous'}
                </h3>
                <button onClick={() => setAptForm(null)} aria-label="Fermer le formulaire" className="text-neutral-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls} htmlFor="apt-fullName">Nom complet *</label>
                  <input id="apt-fullName" className={inputCls} value={aptForm.fullName} onChange={e => setAptForm({ ...aptForm, fullName: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-email">Email</label>
                  <input id="apt-email" type="email" className={inputCls} value={aptForm.email} onChange={e => setAptForm({ ...aptForm, email: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-phone">Téléphone</label>
                  <input id="apt-phone" className={inputCls} value={aptForm.phone} onChange={e => setAptForm({ ...aptForm, phone: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-company">Entreprise</label>
                  <input id="apt-company" className={inputCls} value={aptForm.company} onChange={e => setAptForm({ ...aptForm, company: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-entity">Entité du groupe</label>
                  <select id="apt-entity" className={inputCls} value={aptForm.entityId} onChange={e => setAptForm({ ...aptForm, entityId: e.target.value as EntityId })}>
                    {entityOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-date">Date *</label>
                  <input id="apt-date" type="date" className={inputCls} value={aptForm.date} onChange={e => setAptForm({ ...aptForm, date: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-time">Créneau horaire *</label>
                  <select id="apt-time" className={inputCls} value={aptForm.timeSlot} onChange={e => setAptForm({ ...aptForm, timeSlot: e.target.value })}>
                    {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-subject">Objet *</label>
                  <input id="apt-subject" className={inputCls} value={aptForm.subject} onChange={e => setAptForm({ ...aptForm, subject: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="apt-type">Type de rendez-vous</label>
                  <select id="apt-type" className={inputCls} value={aptForm.type} onChange={e => setAptForm({ ...aptForm, type: e.target.value as Appointment['type'] })}>
                    {APT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 dark:border-brand-700 pt-3">
                <button onClick={() => setAptForm(null)} className={btnGhost}>
                  <X className="w-4 h-4" /> Annuler
                </button>
                <button onClick={saveApt} className={btnPrimary}>
                  <Save className="w-4 h-4" /> {aptForm.mode === 'create' ? 'Réserver le rendez-vous' : 'Enregistrer'}
                </button>
              </div>
            </div>
          )}

          {/* Liste des rendez-vous */}
          {appointments.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-brand-800/50 border border-dashed border-neutral-300 dark:border-brand-700 rounded-l p-10 text-center">
              <Calendar className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Aucun rendez-vous. Planifiez votre première rencontre.</p>
              <button onClick={() => { setAptForm(emptyAptForm()); }} className={btnPrimary}>
                <Plus className="w-4 h-4" /> Prendre rendez-vous
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(a => (
                <article key={a.id} className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">{a.id.slice(0, 8)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusStyles[a.status] || ''}`}>{a.status}</span>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                        {a.fullName}{a.company ? ` · ${a.company}` : ''} · {entityName(a.entityId)}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        Le {formatDate(a.date)} à {a.timeSlot} · {a.type} · Créé le {formatDate(a.createdAt)}
                      </p>
                    </div>
                    <p className="text-base font-mono font-bold text-accent-500 tabular-nums shrink-0">Réf: APT-{a.id.slice(-4).toUpperCase()}</p>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    <p><strong>Objet :</strong> {a.subject}</p>
                    {a.company && <p><strong>Entreprise :</strong> {a.company}</p>}
                    {a.email && <p><strong>Email :</strong> {a.email}</p>}
                    {a.phone && <p><strong>Téléphone :</strong> {a.phone}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    <select
                      aria-label={`Statut du rendez-vous ${a.id}`}
                      className="px-2 py-1.5 bg-neutral-100 dark:bg-brand-800 border border-neutral-300 dark:border-brand-700 rounded text-xs font-semibold text-neutral-700 dark:text-neutral-200"
                      value={a.status}
                      onChange={e => setAptStatus(a, e.target.value as Appointment['status'])}
                    >
                      {APT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {a.status !== 'Terminé' && (
                      <button onClick={() => startEditApt(a)} className={btnGhost}>
                        <Pencil className="w-4 h-4" /> Modifier
                      </button>
                    )}
                    <button
                      onClick={() => removeApt(a)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-m text-xs hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}{/* ===== ONGLET : MON PANIER ===== */}
      {activeTab === 'cart' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">Mon panier</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{cart.length} article(s) · générer un devis</p>
            </div>
            <button onClick={() => setActiveTab('quotes')} className={btnGhost}>
              <ArrowRight className="w-4 h-4" /> Passer en devis
            </button>
          </div>

          {/* Liste du panier */}
          {cart.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-brand-800/50 border border-dashed border-neutral-300 dark:border-brand-700 rounded-l p-10 text-center">
              <ShoppingCart className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Votre panier est vide. Ajoutez des produits depuis le catalogue.</p>
              <Link href="/catalogue" className={btnPrimary}>
                <ShoppingCart className="w-4 h-4" /> Parcourir le catalogue
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <article key={item.product.id + '-' + index} className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">{index + 1}.</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{item.product.category}</span>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                        {item.product.name}{item.product.ref ? ` · ${item.product.ref}` : ''}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        {item.product.indicativePriceFCFA.toLocaleString('fr-FR')} FCFA/unité · {item.product.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">Quantité</p>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => changeQty(item.product.id, Number(e.target.value))}
                          className="w-20 px-3 py-2 bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded text-center"
                        />
                      </div>
                      <p className="text-base font-mono font-bold text-accent-500 tabular-nums shrink-0">
                        {(item.product.indicativePriceFCFA * item.quantity).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    {item.product.material && <p className="truncate">{item.product.material}{item.product.usage ? ` · ${item.product.usage}` : ""}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    <button
                      onClick={() => removeCartItem(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-m text-xs hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Retirer
                    </button>
                  </div>
                </article>
              ))}

              {/* Total du panier */}
              <div className="border-t border-neutral-200 dark:border-brand-700 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                    Total ({cart.length} article(s)) :
                  </p>
                  <p className="text-2xl font-title font-bold text-accent-500 tabular-nums">
                    {cartTotal.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      if (cart.length > 0) {
                        quoteFromCart();
                      }
                    }}
                    className={`${btnPrimary} w-full lg:w-auto`}
                  >
                    <Save className="w-4 h-4" /> Générer un devis
                  </button>
                  <button
                    onClick={clearCart}
                    className={`${btnGhost} w-full lg:w-auto`}
                  >
                    <X className="w-4 h-4" /> Vider le panier
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
      {/* ===== ONGLET : CARREAUX P2M (catalogue + générateur de devis) ===== */}
      {activeTab === 'tiles' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">Module Carreaux P2M</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Catalogue, calcul du nombre de cartons (marge de perte + arrondi au carton entier) et devis imprimables.
            </p>
          </div>
          <TilesModule role={isGerantDemo ? 'gerant' : 'vendeur'} />
        </section>
      )}{/* ===== ONGLET : MES DOCUMENTS ===== */}
      {activeTab === 'documents' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">Mes documents</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{documents.length} document(s) · téléchargement et suivi</p>
            </div>
            {!docForm && (
              <button onClick={() => { setDocForm(emptyDocForm()); }} className={btnPrimary}>
                <FolderOpen className="w-4 h-4" /> Nouveau document
              </button>
            )}
          </div>

          {/* Formulaire document (création / édition) */}
          {docForm && (
            <div className="bg-white dark:bg-brand-900 border-2 border-accent-500 rounded-l p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {docForm.mode === 'create' ? 'Nouveau document' : 'Modifier le document'}
                </h3>
                <button onClick={() => setDocForm(null)} aria-label="Fermer le formulaire" className="text-neutral-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls} htmlFor="doc-title">Titre *</label>
                  <input id="doc-title" className={inputCls} value={docForm.title} onChange={e => setDocForm({ ...docForm, title: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-reference">Référence *</label>
                  <input id="doc-reference" className={inputCls} value={docForm.reference} onChange={e => setDocForm({ ...docForm, reference: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-category">Catégorie</label>
                  <select id="doc-category" className={inputCls} value={docForm.category} onChange={e => setDocForm({ ...docForm, category: e.target.value as DocumentItem['category'] })}>
                    {DOC_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-entity">Entité du groupe</label>
                  <select id="doc-entity" className={inputCls} value={docForm.entityId} onChange={e => setDocForm({ ...docForm, entityId: e.target.value as EntityId })}>
                    {entityOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-version">Version</label>
                  <input id="doc-version" className={inputCls} value={docForm.version} onChange={e => setDocForm({ ...docForm, version: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-visibility">Visibilité</label>
                  <select id="doc-visibility" className={inputCls} value={docForm.visibility} onChange={e => setDocForm({ ...docForm, visibility: e.target.value as DocumentItem['visibility'] })}>
                    {VISIBILITIES.map(vis => <option key={vis} value={vis}>{vis}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-fileSize">Taille du fichier</label>
                  <input id="doc-fileSize" className={inputCls} value={docForm.fileSize} onChange={e => setDocForm({ ...docForm, fileSize: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-fileType">Type de fichier</label>
                  <input id="doc-fileType" className={inputCls} value={docForm.fileType} onChange={e => setDocForm({ ...docForm, fileType: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-url">URL / Lien</label>
                  <input id="doc-url" className={inputCls} value={docForm.url} onChange={e => setDocForm({ ...docForm, url: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-publishedAt">Date de publication</label>
                  <input id="doc-publishedAt" type="date" className={inputCls} value={docForm.publishedAt} onChange={e => setDocForm({ ...docForm, publishedAt: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="doc-abstract">Résumé / Abstract</label>
                  <textarea id="doc-abstract" rows={2} className={inputCls} value={docForm.abstract} onChange={e => setDocForm({ ...docForm, abstract: e.target.value })} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 dark:border-brand-700 pt-3">
                <button onClick={() => setDocForm(null)} className={btnGhost}>
                  <X className="w-4 h-4" /> Annuler
                </button>
                <button onClick={saveDoc} className={btnPrimary}>
                  <Save className="w-4 h-4" /> {docForm.mode === 'create' ? 'Ajouter le document' : 'Enregistrer'}
                </button>
              </div>
            </div>
          )}

          {/* Liste des documents */}
          {documents.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-brand-800/50 border border-dashed border-neutral-300 dark:border-brand-700 rounded-l p-10 text-center">
              <FolderOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Aucun document. Ajoutez votre premier document.</p>
              <button onClick={() => { setDocForm(emptyDocForm()); }} className={btnPrimary}>
                <Plus className="w-4 h-4" /> Nouveau document
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(d => (
                <article key={d.id} className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">{d.id.slice(0, 8)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800`}>{d.category}</span>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                        {d.title}{d.reference ? ` · ${d.reference}` : ''}
                      </p>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        {entityName(d.entityId)} · {d.visibility} · Publié le {formatDate(d.publishedAt)} · v{d.version}
                      </p>
                    </div>
                    <p className="text-base font-mono font-bold text-accent-500 tabular-nums shrink-0">REF: DOC-{d.id.slice(-4).toUpperCase()}</p>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    {d.abstract && <p><strong>Résumé :</strong> {d.abstract}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    <button
                      onClick={() => downloadDoc(d)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-brand-800 hover:bg-neutral-200 dark:hover:bg-brand-700 text-neutral-700 dark:text-neutral-200 font-semibold rounded-m text-xs hover:bg-neutral-100 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Télécharger
                    </button>
                    {d.url && d.url !== '#' && (
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 bg-accent-50 dark:bg-accent-600/20 text-accent-600 dark:text-accent-400 border border-accent-200 dark:border-accent-600/40 text-xs font-bold hover:bg-accent-100 dark:hover:bg-accent-600/30 transition-colors">
                        <ArrowRight className="w-3 h-3" /> Ouvrir le lien
                      </a>
                    )}
                    <button onClick={() => startEditDoc(d)} className={btnGhost}>
                      <Pencil className="w-4 h-4" /> Modifier
                    </button>
                    <button
                      onClick={() => removeDoc(d)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-m text-xs hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}{/* ===== ONGLET : MON PROFIL ===== */}
      {activeTab === 'profile' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">Mon profil</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Informations personnelles et de connexion</p>
            </div>
          </div>

          {/* Formulaire de profil */}
          <div className="bg-white dark:bg-brand-900 border-2 border-accent-500 rounded-l p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Modifier mon profil
              </h3>
              <button onClick={() => setActiveTab('dashboard')} aria-label="Fermer le formulaire" className="text-neutral-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls} htmlFor="profile-fullName">Nom complet *</label>
                <input id="profile-fullName" className={inputCls} value={profile?.fullName || ''} onChange={e => {
                  if (profile) {
                    const updatedProfile = {...profile, fullName: e.target.value};
                    setProfile(updatedProfile);
                  }
                }} />
              </div>
              <div>
                <label className={labelCls} htmlFor="profile-company">Entreprise</label>
                <input id="profile-company" className={inputCls} value={profile?.company || ''} onChange={e => {
                  if (profile) {
                    const updatedProfile = {...profile, company: e.target.value};
                    setProfile(updatedProfile);
                  }
                }} />
              </div>
              <div>
                <label className={labelCls} htmlFor="profile-email">Email *</label>
                <input id="profile-email" type="email" className={inputCls} value={profile?.email || ''} onChange={e => {
                  if (profile) {
                    const updatedProfile = {...profile, email: e.target.value};
                    setProfile(updatedProfile);
                  }
                }} />
              </div>
              <div>
                <label className={labelCls} htmlFor="profile-phone">Téléphone *</label>
                <input id="profile-phone" className={inputCls} value={profile?.phone || ''} onChange={e => {
                  if (profile) {
                    const updatedProfile = {...profile, phone: e.target.value};
                    setProfile(updatedProfile);
                  }
                }} />
              </div>
              <div>
                <label className={labelCls} htmlFor="profile-city">Ville</label>
                <input id="profile-city" className={inputCls} value={profile?.city || ''} onChange={e => {
                  if (profile) {
                    const updatedProfile = {...profile, city: e.target.value};
                    setProfile(updatedProfile);
                  }
                }} />
              </div>
              <div>
                <label className={labelCls} htmlFor="profile-sector">Secteur d'activité</label>
                <input id="profile-sector" className={inputCls} value={profile?.sector || ''} onChange={e => {
                  if (profile) {
                    const updatedProfile = {...profile, sector: e.target.value};
                    setProfile(updatedProfile);
                  }
                }} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-brand-700">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Complétude du profil
                </h3>
                <span className="text-xs font-mono font-bold text-accent-500">{profileCompleteness} %</span>
              </div>
              <div className="h-2.5 w-32 bg-neutral-200 dark:bg-brand-800 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full transition-all" style={{ width: `${profileCompleteness}%` }} />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  saveProfile();
                  setActiveTab('dashboard');
                }}
                className={btnPrimary}
              >
                <Save className="w-4 h-4" /> Sauvegarder les modifications
              </button>
            </div>
          </div>
        </section>
      )}{/* ===== ONGLET : JOURNAL D'AUDIT ===== */}
      {activeTab === 'audit' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-neutral-900 dark:text-white">Journal d'audit</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{logs.length} entrée(s) · traçabilité complète</p>
            </div>
          </div>

          {/* Liste du journal d'audit */}
          {logs.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-brand-800/50 border border-dashed border-neutral-300 dark:border-brand-700 rounded-l p-10 text-center">
              <History className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Aucun enregistrement d'activité. Les actions apparaîtront ici lorsqu'elles seront effectuées.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.slice().reverse().map((log) => (
                <article key={log.id} className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">
                          {log.timestamp.slice(0, 10)}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-brand-900/50">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                        {log.user} ({log.role})
                      </p>
                      <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                        {log.timestamp.slice(11, 16)} · {log.resourceType} · {log.resourceId}
                      </p>
                    </div>
                    <p className="text-base font-mono font-bold text-accent-500 tabular-nums shrink-0">
                      #{log.id.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 border-t border-neutral-100 dark:border-brand-800 pt-3">
                    {log.oldValue && <p><strong>Avant :</strong> {log.oldValue}</p>}
                    {log.newValue && <p><strong>Après :</strong> {log.newValue}</p>}
                  </div>

                  <div className="flex items-center justify-end pt-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                      {log.resourceType}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}</main>
    </div>
  );
}