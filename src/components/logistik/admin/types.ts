export interface LogistikEquipmentRow {
  id: string;
  code: string;
  title: string;
  category: string;
  brand: string;
  description: string;
  specs: string;
  usage: string;
  imageUrl: string;
  pageNumber: number;
  dailyRateFCFA: number;
  isPriceVisible: boolean;
  availability: 'Disponible' | 'En location' | 'En maintenance' | 'Réservé' | 'Hors service' | string;
  isPublished: boolean;
  sortOrder: number;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogistikClientRow {
  id: string;
  code: string;
  identifier: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  category: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LogistikNeedItem {
  equipmentId?: string;
  code?: string;
  title: string;
  brand?: string;
  category?: string;
  qty: number;
  days: number;
  dailyRateFCFA?: number;
}

export interface LogistikNeedRow {
  id: string;
  needNumber: string;
  clientCode?: string | null;
  clientName: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  siteLocation: string;
  startDate: string;
  durationDays: number;
  withOperator: boolean;
  urgency: string;
  items: LogistikNeedItem[];
  notes?: string | null;
  status: string;
  source: string;
  convertedQuoteId?: string | null;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogistikLineItem {
  equipmentId?: string;
  code?: string;
  title: string;
  brand?: string;
  category?: string;
  qty: number;
  days: number;
  unitRateFCFA: number;
  lineTotalFCFA: number;
}

export interface LogistikQuoteRow {
  id: string;
  quoteNumber: string;
  needId?: string | null;
  clientId?: string | null;
  clientCode: string;
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  items: LogistikLineItem[];
  transportFee: number;
  operatorFee: number;
  cautionAmount: number;
  discountFCFA: number;
  subtotalHT: number;
  taxRate: number;
  totalTTC: number;
  status: string;
  validUntil: string;
  notes?: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogistikInvoiceRow {
  id: string;
  invoiceNumber: string;
  quoteId?: string | null;
  clientId?: string | null;
  clientCode: string;
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  items: LogistikLineItem[];
  subtotalHT: number;
  taxRate: number;
  totalTTC: number;
  amountPaidFCFA: number;
  balanceDueFCFA: number;
  status: string;
  dueDate: string;
  paymentToken: string;
  notes?: string | null;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogistikPaymentRow {
  id: string;
  paymentRef: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  method: string;
  channel: string;
  providerRef: string;
  amountFCFA: number;
  status: string;
  paidAt: string;
  recordedBy: string;
  notes?: string | null;
}

export interface LogistikSavRow {
  id: string;
  ticketNumber: string;
  equipmentId?: string | null;
  equipmentCode: string;
  equipmentTitle: string;
  equipmentBrand: string;
  clientId?: string | null;
  clientName: string;
  clientPhone: string;
  type: string;
  priority: string;
  siteLocation: string;
  operatorName: string;
  startDate: string;
  expectedReturnDate: string;
  actualReturnDate: string;
  meterOut: string;
  meterIn: string;
  conditionNotes: string;
  actionTaken?: string | null;
  costFCFA: number;
  status: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogistikAuditRow {
  id: string;
  action: string;
  actor: string;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}
