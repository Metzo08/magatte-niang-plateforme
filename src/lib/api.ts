// Client API centralisé pour tous les appels backend
const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

// Type générique pour les réponses API
type ApiResponse<T> = {
  data?: T;
  error?: string;
};

// Fonction utilitaire pour les appels fetch
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || `Erreur ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// === ENTITÉS ===
export const entitiesAPI = {
  getAll: () => fetchAPI<any[]>('/api/entities'),
  getById: (id: string) => fetchAPI<any>(`/api/entities/${id}`),
  create: (data: any) => fetchAPI<any>('/api/entities', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/api/entities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/api/entities/${id}`, { method: 'DELETE' }),
};

// === PROJETS ===
export const projectsAPI = {
  getAll: (params?: { featured?: boolean; status?: string; entityId?: string }) => {
    const query = new URLSearchParams();
    if (params?.featured) query.append('featured', 'true');
    if (params?.status) query.append('status', params.status);
    if (params?.entityId) query.append('entityId', params.entityId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchAPI<any[]>(`/api/projects${queryString}`);
  },
  getBySlug: (slug: string) => fetchAPI<any>(`/api/projects/${slug}`),
  create: (data: any) => fetchAPI<any>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (slug: string, data: any) => fetchAPI<any>(`/api/projects/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (slug: string) => fetchAPI<any>(`/api/projects/${slug}`, { method: 'DELETE' }),
};

// === PRODUITS ===
export const productsAPI = {
  getAll: (params?: { category?: string; availability?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.availability) query.append('availability', params.availability);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchAPI<any[]>(`/api/products${queryString}`);
  },
  getById: (id: string) => fetchAPI<any>(`/api/products/${id}`),
  create: (data: any) => fetchAPI<any>('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/api/products/${id}`, { method: 'DELETE' }),
};

// === LEADS ===
export const leadsAPI = {
  getAll: (params?: { stage?: string; entityId?: string }) => {
    const query = new URLSearchParams();
    if (params?.stage) query.append('stage', params.stage);
    if (params?.entityId) query.append('entityId', params.entityId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchAPI<any[]>(`/api/leads${queryString}`);
  },
  create: (data: any) => fetchAPI<any>('/api/leads', { method: 'POST', body: JSON.stringify(data) }),
};

// === DEVIS ===
export const quotesAPI = {
  getAll: (params?: { status?: string; entityId?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.entityId) query.append('entityId', params.entityId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchAPI<any[]>(`/api/quotes${queryString}`);
  },
  create: (data: any) => fetchAPI<any>('/api/quotes', { method: 'POST', body: JSON.stringify(data) }),
};

// === RENDEZ-VOUS ===
export const appointmentsAPI = {
  getAll: (params?: { entityId?: string; status?: string; date?: string }) => {
    const query = new URLSearchParams();
    if (params?.entityId) query.append('entityId', params.entityId);
    if (params?.status) query.append('status', params.status);
    if (params?.date) query.append('date', params.date);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchAPI<any[]>(`/api/appointments${queryString}`);
  },
  create: (data: any) => fetchAPI<any>('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
};

// === ESSAIS LABO ===
export const labTestsAPI = {
  getAll: (params?: { category?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchAPI<any[]>(`/api/lab-tests${queryString}`);
  },
  create: (data: any) => fetchAPI<any>('/api/lab-tests', { method: 'POST', body: JSON.stringify(data) }),
};

// === RECHERCHE ===
export const searchAPI = {
  search: (query: string) => fetchAPI<{
    entities: any[];
    projects: any[];
    products: any[];
    query: string;
  }>(`/api/search?q=${encodeURIComponent(query)}`),
};

// === CONTACT ===
export const contactAPI = {
  submit: (data: any) => fetchAPI<{ success: boolean; leadNumber: string; message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
};

export default {
  entities: entitiesAPI,
  projects: projectsAPI,
  products: productsAPI,
  leads: leadsAPI,
  quotes: quotesAPI,
  appointments: appointmentsAPI,
  labTests: labTestsAPI,
  search: searchAPI,
  contact: contactAPI,
};