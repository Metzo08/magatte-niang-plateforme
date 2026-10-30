'use client';

import {
  EntityId,
  Project,
  Product,
  LabTest,
  Equipment,
  Lead,
  LeadStage,
  Quote,
  DocumentItem,
  Appointment,
  AuditLogEntry,
  RoutingRule,
  ScoringRule,
  PublicationItem
} from '../types';
import {
  ENTITIES,
  FOUNDER_PROFILE,
  PROJECTS,
  PRODUCTS_P2M,
  LAB_TESTS,
  EQUIPMENTS,
  PUBLICATIONS,
  INITIAL_LEADS,
  INITIAL_QUOTES,
  INITIAL_DOCUMENTS,
  INITIAL_ROUTING_RULES,
  INITIAL_SCORING_RULES,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

const STORAGE_KEYS = {
  LEADS: 'mn_expert_leads_v2',
  QUOTES: 'mn_expert_quotes_v2',
  PROJECTS: 'mn_expert_projects_v2',
  PRODUCTS: 'mn_expert_products_v2',
  APPOINTMENTS: 'mn_expert_appointments_v2',
  DOCUMENTS: 'mn_expert_documents_v2',
  ROUTING_RULES: 'mn_expert_routing_rules_v2',
  SCORING_RULES: 'mn_expert_scoring_rules_v2',
  AUDIT_LOGS: 'mn_expert_audit_logs_v2',
  CART: 'mn_expert_cart_v2',
  THEME: 'mn_expert_theme_v2',
  SETTINGS: 'mn_expert_settings_v2',
  CDP_CONSENT: 'mn_expert_cdp_consent_v2',
  PROFILE: 'mn_expert_profile_v1'
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PlatformSettings {
  hidePricesGlobally: boolean;
  enableWhatsAppDirect: boolean;
  autoRoutingEnabled: boolean;
  defaultEmailNotifications: boolean;
  maintenanceMode: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  hidePricesGlobally: false,
  enableWhatsAppDirect: true,
  autoRoutingEnabled: true,
  defaultEmailNotifications: true,
  maintenanceMode: false
};

export interface ProProfile {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  sector: string;
  entityId: string;
  notes: string;
}

const DEFAULT_PROFILE: ProProfile = {
  fullName: 'Magatte Niang',
  company: '',
  email: '',
  phone: '',
  city: 'Dakar',
  sector: 'Bâtiment',
  entityId: 'direction',
  notes: ''
};

class PlatformStore {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Generic getter / setter
  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom storage event for sync
      window.dispatchEvent(new Event('storage-update'));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // --- LEADS & CRM ---
  getLeads(): Lead[] {
    return this.getItem<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  }

  getLeadById(id: string): Lead | undefined {
    return this.getLeads().find(l => l.id === id);
  }

  createLead(data: Omit<Lead, 'id' | 'leadNumber' | 'createdAt' | 'score' | 'scoreBreakdown' | 'assignedEntityId' | 'stage' | 'notes' | 'history' | 'filesCount'> & { filesCount?: number; items?: Lead['items'] }): Lead {
    const leads = this.getLeads();
    const leadCount = leads.length + 1;
    const leadNumber = `LEAD-2026-${String(leadCount).padStart(4, '0')}`;
    
    // Evaluate Scoring
    const { score, breakdown } = this.calculateLeadScore(data);

    // Evaluate Routing
    const assignedEntity = this.evaluateRouting(data.needCategory, data.projectType);

    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      leadNumber,
      createdAt: new Date().toISOString(),
      score,
      scoreBreakdown: breakdown,
      assignedEntityId: assignedEntity,
      stage: 'Nouveau',
      notes: [],
      history: [
        {
          date: new Date().toISOString(),
          user: 'Système Automatique',
          action: 'Création du prospect',
          comment: `Routage vers ${assignedEntity} avec un score de qualification de ${score}/100.`
        }
      ],
      filesCount: data.filesCount || 0,
      items: data.items || []
    };

    const updated = [newLead, ...leads];
    this.setItem(STORAGE_KEYS.LEADS, updated);

    // Log in Audit
    this.addAuditLog({
      user: data.fullName || 'Visiteur Public',
      role: 'Prospect',
      action: 'LEAD_SUBMISSION',
      resourceType: 'Lead',
      resourceId: leadNumber,
      newValue: `Score: ${score}, Entité: ${assignedEntity}`
    });

    return newLead;
  }

  updateLeadStage(id: string, stage: LeadStage, lostReason?: string, user = 'Direction / Commercial'): void {
    const leads = this.getLeads();
    const updated = leads.map(l => {
      if (l.id === id) {
        return {
          ...l,
          stage,
          lostReason: stage === 'Perdu' ? lostReason : undefined,
          history: [
            ...l.history,
            {
              date: new Date().toISOString(),
              user,
              action: `Changement de statut: ${stage}`,
              comment: lostReason ? `Motif de perte : ${lostReason}` : undefined
            }
          ]
        };
      }
      return l;
    });

    this.setItem(STORAGE_KEYS.LEADS, updated);

    this.addAuditLog({
      user,
      role: 'Staff BTP',
      action: 'LEAD_STAGE_UPDATE',
      resourceType: 'Lead',
      resourceId: id,
      newValue: stage
    });
  }

  addLeadNote(id: string, author: string, content: string): void {
    const leads = this.getLeads();
    const updated = leads.map(l => {
      if (l.id === id) {
        return {
          ...l,
          notes: [
            ...l.notes,
            { id: `note-${Date.now()}`, author, date: new Date().toISOString(), content }
          ]
        };
      }
      return l;
    });
    this.setItem(STORAGE_KEYS.LEADS, updated);
  }

  // --- LEAD SCORING ALGORITHM ---
  calculateLeadScore(data: { phone?: string; email?: string; budgetRange?: string; timeframe?: string; needCategory?: string; projectStage?: string; source?: string }): { score: number; breakdown: { signal: string; points: number }[] } {
    let score = 0;
    const breakdown: { signal: string; points: number }[] = [];

    // Téléphone renseigné
    if (data.phone && data.phone.trim().length >= 8) {
      score += 10;
      breakdown.push({ signal: 'Téléphone renseigné', points: 10 });
    }

    // Email valide et non jetable
    if (data.email) {
      const email = data.email.toLowerCase();
      const isDisposable = email.includes('mailinator') || email.includes('tempmail') || email.includes('10minutemail') || email.includes('yopmail');
      if (isDisposable) {
        score -= 15;
        breakdown.push({ signal: 'Adresse email jetable détectée', points: -15 });
      } else {
        score += 10;
        breakdown.push({ signal: 'Email professionnel vérifié', points: 10 });
      }
    }

    // Budget cadré
    if (data.budgetRange && data.budgetRange !== 'Non défini' && data.budgetRange !== '') {
      score += 15;
      breakdown.push({ signal: 'Budget estimé renseigné', points: 15 });
    }

    // Échéance urgente
    if (data.timeframe === 'Immédiat' || data.timeframe === '1–3 mois') {
      score += 20;
      breakdown.push({ signal: 'Échéance commerciale urgente (< 3 mois)', points: 20 });
    } else if (data.timeframe === '3–6 mois') {
      score += 10;
      breakdown.push({ signal: 'Échéance moyen terme (3-6 mois)', points: 10 });
    }

    // Stade de projet avancé
    if (data.projectStage === 'Appel d\'offres' || data.projectStage === 'Démarrage') {
      score += 25;
      breakdown.push({ signal: 'Stade de projet avancé (AO / Démarrage)', points: 25 });
    } else if (data.projectStage === 'Étude') {
      score += 10;
      breakdown.push({ signal: 'Projet en phase d\'étude technique', points: 10 });
    }

    // Source
    if (data.source === 'Devis catalogue') {
      score += 20;
      breakdown.push({ signal: 'Demande issue du panier de devis P2M', points: 20 });
    }

    // Normalisation min 0, max 100
    score = Math.max(5, Math.min(100, score));

    return { score, breakdown };
  }

  // --- ROUTING ENGINE ---
  evaluateRouting(needCategory: string, projectType?: string): EntityId {
    const rules = this.getRoutingRules();
    const sorted = [...rules].filter(r => r.isActive).sort((a, b) => a.priority - b.priority);

    const textToMatch = `${needCategory} ${projectType || ''}`.toLowerCase();

    for (const rule of sorted) {
      if (rule.categoryMatch) {
        const cat = rule.categoryMatch.toLowerCase();
        if (
          (cat === 'geotechnique' && (textToMatch.includes('geotech') || textToMatch.includes('labo') || textToMatch.includes('sol') || textToMatch.includes('essai') || textToMatch.includes('beton'))) ||
          (cat === 'materiaux' && (textToMatch.includes('carrel') || textToMatch.includes('sanit') || textToMatch.includes('robinet') || textToMatch.includes('faïence') || textToMatch.includes('p2m'))) ||
          (cat === 'sourcing' && (textToMatch.includes('sourc') || textToMatch.includes('import') || textToMatch.includes('fret') || textToMatch.includes('transit') || textToMatch.includes('conteneur'))) ||
          (cat === 'charpente' && (textToMatch.includes('charpente') || textToMatch.includes('metall') || textToMatch.includes('hangar') || textToMatch.includes('serma') || textToMatch.includes('structure'))) ||
          (cat === 'infrastructures' && (textToMatch.includes('ouvrage') || textToMatch.includes('pont') || textToMatch.includes('route') || textToMatch.includes('vrd') || textToMatch.includes('sbs group'))) ||
          (cat === 'engins' && (textToMatch.includes('engin') || textToMatch.includes('grue') || textToMatch.includes('benne') || textToMatch.includes('camion') || textToMatch.includes('pelle') || textToMatch.includes('location'))) ||
          (cat === 'prefabrication' && (textToMatch.includes('prefab') || textToMatch.includes('pave') || textToMatch.includes('bordure') || textToMatch.includes('dalot') || textToMatch.includes('predalle')))
        ) {
          return rule.targetEntityId;
        }
      }
    }

    return 'direction';
  }

  // --- QUOTES (DEVIS) ---
  getQuotes(): Quote[] {
    return this.getItem<Quote[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTES);
  }

  createQuote(data: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'status' | 'auditTrail'>): Quote {
    const quotes = this.getQuotes();
    const count = quotes.length + 1;
    const quoteNumber = `DEV-2026-${String(count).padStart(4, '0')}`;

    const newQuote: Quote = {
      ...data,
      id: `quote-${Date.now()}`,
      quoteNumber,
      createdAt: new Date().toISOString(),
      status: 'Envoyé',
      auditTrail: [
        {
          date: new Date().toISOString(),
          action: 'Émission du devis chiffré',
          actor: 'Système Commercial'
        }
      ]
    };

    const updated = [newQuote, ...quotes];
    this.setItem(STORAGE_KEYS.QUOTES, updated);

    this.addAuditLog({
      user: data.clientName,
      role: 'Commercial / Client',
      action: 'QUOTE_CREATION',
      resourceType: 'Quote',
      resourceId: quoteNumber,
      newValue: `Total TTC: ${data.totalTTC.toLocaleString('fr-FR')} FCFA`
    });

    return newQuote;
  }

  acceptQuote(id: string, clientName: string): Quote | null {
    const quotes = this.getQuotes();
    let updatedQuote: Quote | null = null;

    const updated = quotes.map(q => {
      if (q.id === id) {
        updatedQuote = {
          ...q,
          status: 'Accepté' as const,
          acceptedAt: new Date().toISOString(),
          acceptedBy: clientName,
          auditTrail: [
            ...q.auditTrail,
            {
              date: new Date().toISOString(),
              action: 'Acceptation et signature électronique en ligne',
              actor: clientName
            }
          ]
        };
        return updatedQuote;
      }
      return q;
    });

    this.setItem(STORAGE_KEYS.QUOTES, updated);

    if (updatedQuote) {
      this.addAuditLog({
        user: clientName,
        role: 'Client',
        action: 'QUOTE_ACCEPTED',
        resourceType: 'Quote',
        resourceId: (updatedQuote as Quote).quoteNumber,
        newValue: 'Statut: Accepté'
      });
    }

    return updatedQuote;
  }

  // --- QUOTES : MISE À JOUR & SUPPRESSION (CRUD ESPACE PRO) ---
  updateQuote(id: string, patch: Partial<Omit<Quote, 'id' | 'quoteNumber'>>): Quote | null {
    const quotes = this.getQuotes();
    let updatedQuote: Quote | null = null;

    const updated = quotes.map(q => {
      if (q.id === id) {
        updatedQuote = {
          ...q,
          ...patch,
          auditTrail: [
            ...q.auditTrail,
            {
              date: new Date().toISOString(),
              action: 'Modification depuis l\'espace professionnel',
              actor: patch.clientName || q.clientName
            }
          ]
        };
        return updatedQuote;
      }
      return q;
    });
    this.setItem(STORAGE_KEYS.QUOTES, updated);

    if (updatedQuote) {
      const q = updatedQuote as Quote;
      this.addAuditLog({
        user: q.clientName,
        role: 'Client',
        action: 'QUOTE_UPDATE',
        resourceType: 'Quote',
        resourceId: q.quoteNumber,
        newValue: `Statut: ${q.status} · Total TTC: ${q.totalTTC.toLocaleString('fr-FR')} FCFA`
      });
    }

    return updatedQuote;
  }

  deleteQuote(id: string): boolean {
    const quotes = this.getQuotes();
    const target = quotes.find(q => q.id === id);
    if (!target) return false;

    this.setItem(STORAGE_KEYS.QUOTES, quotes.filter(q => q.id !== id));
    this.addAuditLog({
      user: target.clientName,
      role: 'Client',
      action: 'QUOTE_DELETE',
      resourceType: 'Quote',
      resourceId: target.quoteNumber,
      oldValue: `Total TTC: ${target.totalTTC.toLocaleString('fr-FR')} FCFA`
    });
    return true;
  }

  // --- APPOINTMENTS : MISE À JOUR & SUPPRESSION (CRUD ESPACE PRO) ---
  updateAppointment(id: string, patch: Partial<Omit<Appointment, 'id' | 'createdAt'>>): Appointment | null {
    const appointments = this.getAppointments();
    let updatedApt: Appointment | null = null;

    const updated = appointments.map(a => {
      if (a.id === id) {
        updatedApt = { ...a, ...patch };
        return updatedApt;
      }
      return a;
    });
    this.setItem(STORAGE_KEYS.APPOINTMENTS, updated);

    if (updatedApt) {
      const a = updatedApt as Appointment;
      this.addAuditLog({
        user: a.fullName,
        role: 'Client',
        action: 'APPOINTMENT_UPDATE',
        resourceType: 'Appointment',
        resourceId: a.id,
        newValue: `${a.date} · ${a.timeSlot} · ${a.status}`
      });
    }

    return updatedApt;
  }

  deleteAppointment(id: string): boolean {
    const appointments = this.getAppointments();
    const target = appointments.find(a => a.id === id);
    if (!target) return false;

    this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments.filter(a => a.id !== id));
    this.addAuditLog({
      user: target.fullName,
      role: 'Client',
      action: 'APPOINTMENT_DELETE',
      resourceType: 'Appointment',
      resourceId: target.id,
      oldValue: `${target.date} · ${target.timeSlot}`
    });
    return true;
  }

  // --- SHOPPING CART (PANIER DE DEVIS P2M) ---
  getCart(): CartItem[] {
    return this.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
  }

  addToCart(product: Product, quantity = 1): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    this.setItem(STORAGE_KEYS.CART, cart);
  }

  updateCartQuantity(productId: string, quantity: number): void {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.product.id !== productId);
    } else {
      cart = cart.map(item => item.product.id === productId ? { ...item, quantity } : item);
    }
    this.setItem(STORAGE_KEYS.CART, cart);
  }

  clearCart(): void {
    this.setItem(STORAGE_KEYS.CART, []);
  }

  // --- APPOINTMENTS (RENDEZ-VOUS) ---
  getAppointments(): Appointment[] {
    return this.getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, [
      {
        id: 'apt-01',
        type: 'Consultation technique',
        entityId: 'serma-btp',
        fullName: 'Ibrahima Ndiaye',
        email: 'i.ndiaye@btp-afrique.com',
        phone: '+221 77 600 22 11',
        company: 'BTP Afrique Ingénierie',
        date: '2026-09-22',
        timeSlot: '10:00 - 11:00',
        subject: 'Étude d\'exécution charpente métallique hangar 2000m²',
        status: 'Confirmé',
        createdAt: '2026-09-14T16:00:00Z'
      }
    ]);
  }

  bookAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment {
    const appointments = this.getAppointments();

    // Check conflict
    const conflict = appointments.find(
      a => a.date === data.date && a.timeSlot === data.timeSlot && a.entityId === data.entityId && a.status === 'Confirmé'
    );
    if (conflict) {
      throw new Error('Ce créneau horaire est déjà réservé pour cette entité. Veuillez en choisir un autre.');
    }

    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: 'Confirmé',
      createdAt: new Date().toISOString()
    };

    const updated = [newApt, ...appointments];
    this.setItem(STORAGE_KEYS.APPOINTMENTS, updated);

    this.addAuditLog({
      user: data.fullName,
      role: 'Prospect / Client',
      action: 'APPOINTMENT_BOOKED',
      resourceType: 'Appointment',
      resourceId: newApt.id,
      newValue: `${data.date} à ${data.timeSlot} avec ${data.entityId}`
    });

    return newApt;
  }

  // --- DOCUMENTS ---
  getDocuments(): DocumentItem[] {
    return this.getItem<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  incrementDocDownload(id: string): void {
    const docs = this.getDocuments();
    const updated = docs.map(d => d.id === id ? { ...d, downloadCount: d.downloadCount + 1 } : d);
    this.setItem(STORAGE_KEYS.DOCUMENTS, updated);
  }

  // --- DOCUMENTS : CRÉATION, MISE À JOUR & SUPPRESSION (CRUD ESPACE PRO) ---
  addDocument(data: Omit<DocumentItem, 'id' | 'downloadCount'>): DocumentItem {
    const docs = this.getDocuments();
    const newDoc: DocumentItem = {
      ...data,
      id: `doc-${Date.now()}`,
      downloadCount: 0
    };
    this.setItem(STORAGE_KEYS.DOCUMENTS, [newDoc, ...docs]);
    this.addAuditLog({
      user: data.title,
      role: 'Administration',
      action: 'DOCUMENT_CREATE',
      resourceType: 'Document',
      resourceId: newDoc.reference,
      newValue: `${newDoc.category} · v${newDoc.version}`
    });
    return newDoc;
  }

  updateDocument(id: string, patch: Partial<Omit<DocumentItem, 'id'>>): DocumentItem | null {
    const docs = this.getDocuments();
    let updatedDoc: DocumentItem | null = null;

    const updated = docs.map(d => {
      if (d.id === id) {
        updatedDoc = { ...d, ...patch };
        return updatedDoc;
      }
      return d;
    });
    this.setItem(STORAGE_KEYS.DOCUMENTS, updated);

    if (updatedDoc) {
      const doc = updatedDoc as DocumentItem;
      this.addAuditLog({
        user: doc.title,
        role: 'Administration',
        action: 'DOCUMENT_UPDATE',
        resourceType: 'Document',
        resourceId: doc.reference,
        newValue: `Visibilité: ${doc.visibility} · v${doc.version}`
      });
    }

    return updatedDoc;
  }

  deleteDocument(id: string): boolean {
    const docs = this.getDocuments();
    const target = docs.find(d => d.id === id);
    if (!target) return false;

    this.setItem(STORAGE_KEYS.DOCUMENTS, docs.filter(d => d.id !== id));
    this.addAuditLog({
      user: target.title,
      role: 'Administration',
      action: 'DOCUMENT_DELETE',
      resourceType: 'Document',
      resourceId: target.reference
    });
    return true;
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLogEntry[] {
    return this.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ipAddress: '196.1.180.24', // Client IP simulée conforme Dakar
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server Engine'
    };
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, [newEntry, ...logs]);
  }

  // --- ROUTING & SCORING RULES CONFIGURATION ---
  getRoutingRules(): RoutingRule[] {
    return this.getItem<RoutingRule[]>(STORAGE_KEYS.ROUTING_RULES, INITIAL_ROUTING_RULES);
  }

  saveRoutingRules(rules: RoutingRule[]): void {
    this.setItem(STORAGE_KEYS.ROUTING_RULES, rules);
    this.addAuditLog({
      user: 'Super Admin',
      role: 'SuperAdmin',
      action: 'UPDATE_ROUTING_RULES',
      resourceType: 'RoutingEngine',
      resourceId: 'Global',
      newValue: `${rules.length} règles sauvegardées`
    });
  }

  getScoringRules(): ScoringRule[] {
    return this.getItem<ScoringRule[]>(STORAGE_KEYS.SCORING_RULES, INITIAL_SCORING_RULES);
  }

  saveScoringRules(rules: ScoringRule[]): void {
    this.setItem(STORAGE_KEYS.SCORING_RULES, rules);
    this.addAuditLog({
      user: 'Super Admin',
      role: 'SuperAdmin',
      action: 'UPDATE_SCORING_RULES',
      resourceType: 'ScoringEngine',
      resourceId: 'Global',
      newValue: `${rules.length} règles de score sauvegardées`
    });
  }

  // --- SETTINGS ---
  getSettings(): PlatformSettings {
    return this.getItem<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  saveSettings(settings: PlatformSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- PROFIL ESPACE PRO (CRUD) ---
  getProfile(): ProProfile {
    return this.getItem<ProProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }

  saveProfile(profile: ProProfile): void {
    this.setItem(STORAGE_KEYS.PROFILE, profile);
    this.addAuditLog({
      user: profile.fullName,
      role: 'Client',
      action: 'PROFILE_UPDATE',
      resourceType: 'Profile',
      resourceId: profile.email || 'profil-local',
      newValue: `${profile.company || 'Particulier'} · ${profile.city}`
    });
  }

  // --- CDP CONSENT ---
  getCDPConsent(): { accepted: boolean; date: string } | null {
    return this.getItem(STORAGE_KEYS.CDP_CONSENT, null);
  }

  setCDPConsent(accepted: boolean): void {
    this.setItem(STORAGE_KEYS.CDP_CONSENT, {
      accepted,
      date: new Date().toISOString()
    });
  }
}

export const store = new PlatformStore();
