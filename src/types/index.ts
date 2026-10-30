export type EntityId = 
  | 'serma-btp' 
  | 'sbs-group' 
  | 'sbs-labo' 
  | 'sbs-industries' 
  | 'sbs-logistik' 
  | 'p2m' 
  | 'pgt'
  | 'direction';

export interface EntityInfo {
  id: EntityId;
  name: string;
  tagline: string;
  badge: string;
  color: string;
  colorHex: string;
  accentClass: string;
  mission: string;
  description: string;
  leader: string;
  leaderRole: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  whatsapp: string;
  ctaText: string;
  ctaAction: string;
  expertises: string[];
  equipmentList?: string[];
  synergies: { entityId: EntityId; role: string; benefit: string }[];
  verifiedMetrics: { label: string; value: string; unit?: string; status: 'confirmed' | 'pending' | 'to_update' }[];
  icon: string;
}

export interface ProjectTechnicalData {
  surface?: string;
  steelTonnage?: string; // Tonnage acier
  concreteVolume?: string; // Volume béton
  span?: string; // Portée
  durationMonths?: number;
  earthworkVolume?: string; // Terrassement
  soilTestsCount?: number;
  capacity?: string;
  depthMax?: string;
  piezometerMonitoringMonths?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  location: string;
  region: 'Dakar' | 'Thiès' | 'Saint-Louis' | 'Fatick' | 'Kaolack' | 'Ziguinchor' | 'Autre';
  year: number;
  status: 'Étude' | 'En préparation' | 'En cours' | 'Achevé' | 'Maintenance' | 'Archivé';
  sector: 'Bâtiment' | 'Ouvrage d\'art' | 'Industrie' | 'Infrastructures' | 'Géotechnique' | 'Logistique';
  primaryEntityId: EntityId;
  partnerEntityIds: EntityId[];
  summary: string;
  technicalData: ProjectTechnicalData;
  story: {
    constraints: string;
    solution: string;
    results: string;
  };
  testimonial?: {
    author: string;
    role: string;
    company: string;
    quote: string;
  };
  images: {
    url: string;
    caption: string;
    isHero?: boolean;
  }[];
  isPublished: boolean;
  isFeatured: boolean;
  publicationApproval: 'confirmed' | 'pending';
}

export interface Product {
  id: string;
  ref: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  dimensions: string;
  material: string;
  finish: string;
  color: string;
  usage: string;
  unit: string;
  packaging: string;
  origin: string;
  indicativePriceFCFA: number;
  isPriceVisible: boolean;
  availability: 'En stock' | 'Sur commande' | 'En arrivage' | 'Rupture';
  leadTime: string;
  images: string[];
  specs: Record<string, string>;
  documents?: { name: string; url: string; type: string }[];
}

export interface LabTest {
  id: string;
  code: string;
  name: string;
  category: 'Sols & géotechnique' | 'Bétons & granulats' | 'Enrobés & bitumes' | 'Contrôle in-situ';
  norm: string;
  sampleRequired: string;
  standardDelayDays: number;
  description: string;
  isAvailable: boolean;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  category: 'Terrassement' | 'Levage' | 'Transport & bennes' | 'Bétonnage' | 'Compactage' | 'Énergie' | 'Préfabrication' | 'Accès & coffrage';
  capacity: string;
  power: string;
  availabilityStatus: 'Disponible' | 'Réservé' | 'En mission' | 'Maintenance' | 'Sur réservation';
  location: string;
  driverIncluded: boolean;
  imageUrl: string;
  ratePerDayFCFA?: number;
}

export type LeadStage = 
  | 'Nouveau'
  | 'En qualification'
  | 'Affecté'
  | 'Premier contact'
  | 'Étude du besoin'
  | 'Devis envoyé'
  | 'En négociation'
  | 'Gagné'
  | 'Perdu';

export interface Lead {
  id: string;
  leadNumber: string; // Ex: LEAD-2026-0042
  createdAt: string;
  fullName: string;
  company?: string;
  role?: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  sector: string;
  source: 'Assistant qualification' | 'Devis catalogue' | 'Fiche entité' | 'Contact direct' | 'WhatsApp' | 'Téléchargement';
  needCategory: string;
  projectType: string;
  projectLocation: string;
  projectStage: 'Idée' | 'Étude' | 'Appel d\'offres' | 'Démarrage';
  budgetRange: string;
  timeframe: 'Immédiat' | '1–3 mois' | '3–6 mois' | '> 6 mois';
  assignedEntityId: EntityId;
  assignedToUser?: string;
  score: number;
  scoreBreakdown: { signal: string; points: number }[];
  stage: LeadStage;
  lostReason?: string;
  items?: { title: string; quantity: string; entityId: EntityId; price?: number }[];
  notes: { id: string; author: string; date: string; content: string }[];
  history: { date: string; user: string; action: string; comment?: string }[];
  filesCount: number;
}

export interface Quote {
  id: string;
  quoteNumber: string; // DEV-2026-0184
  leadId?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  entityId: EntityId;
  createdAt: string;
  validUntil: string;
  status: 'Brouillon' | 'Envoyé' | 'En négociation' | 'Accepté' | 'Refusé' | 'Expiré';
  items: {
    productId?: string;
    description: string;
    quantity: number;
    unit: string;
    unitPriceFCFA: number;
    totalPriceFCFA: number;
  }[];
  totalHT: number;
  taxRate: number; // 18% au Sénégal
  totalTTC: number;
  notes: string;
  acceptedAt?: string;
  acceptedBy?: string;
  auditTrail: { date: string; action: string; actor: string }[];
}

export interface DocumentItem {
  id: string;
  title: string;
  reference: string;
  category: 'Plaquette' | 'Fiche technique' | 'Rapport d\'essai' | 'Contrat' | 'Certificat' | 'Publication';
  entityId: EntityId;
  version: string;
  isLatest: boolean;
  visibility: 'Public' | 'Client' | 'Interne' | 'Partenaire';
  requiresForm: boolean;
  isValidatedForAI: boolean;
  downloadCount: number;
  fileSize: string;
  fileType: string;
  url: string;
  publishedAt: string;
  abstract?: string;
  authors?: string[];
}

export interface Appointment {
  id: string;
  type: 'Direction' | 'Consultation technique' | 'Réunion de projet' | 'Visite de chantier' | 'Laboratoire' | 'Commercial';
  entityId: EntityId;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  date: string;
  timeSlot: string;
  subject: string;
  status: 'Confirmé' | 'En attente' | 'Annulé' | 'Terminé';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resourceType: string;
  resourceId: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent: string;
}

export interface RoutingRule {
  id: string;
  priority: number;
  conditionDescription: string;
  categoryMatch?: string;
  subTypeMatch?: string;
  targetEntityId: EntityId;
  isActive: boolean;
}

export interface ScoringRule {
  id: string;
  signalName: string;
  points: number;
  criteria: string;
  isActive: boolean;
}

export interface PublicationItem {
  id: string;
  title: string;
  type: 'Article scientifique' | 'Conférence' | 'Brevet / Innovation' | 'Cours / Enseignement' | 'Presse';
  authors: string[];
  date: string;
  journalOrEvent: string;
  abstract: string;
  keywords: string[];
  downloadUrl?: string;
  doi?: string;
  validatedForAI: boolean;
}
