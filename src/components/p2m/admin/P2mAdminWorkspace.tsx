'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  ClipboardList,
  Users,
  Receipt,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Check,
  RefreshCw,
} from 'lucide-react';

interface P2mProductRow {
  id: string;
  ref: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  dimensions: string;
  unit: string;
  indicativePriceFCFA: number;
  isPriceVisible: boolean;
  availability: string;
  leadTime: string;
}

interface P2mNeedRow {
  id: string;
  needNumber: string;
  clientName: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  items: Array<{ sku?: string; name: string; qty: number; unit?: string; unitPrice?: number }>;
  status: string;
  createdAt: string;
}

interface P2mClientRow {
  id: string;
  code: string;
  identifier: string;
  fullName: string;
  company: string;
  phone: string;
  email: string;
  city: string;
}

interface P2mDocRow {
  id: string;
  docNumber: string;
  docType: string;
  clientName: string;
  clientPhone: string;
  totalTTC: number;
  amountPaidFCFA: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

interface P2mAuditRow {
  id: string;
  action: string;
  actor: string;
  ipAddress: string | null;
  createdAt: string;
}

type P2mTab = 'dashboard' | 'catalogue' | 'needs' | 'clients' | 'docs' | 'security';

export function P2mAdminWorkspace({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<P2mTab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);

  const [products, setProducts] = useState<P2mProductRow[]>([]);
  const [needs, setNeeds] = useState<P2mNeedRow[]>([]);
  const [clients, setClients] = useState<P2mClientRow[]>([]);
  const [docs, setDocs] = useState<P2mDocRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<P2mAuditRow[]>([]);
  const [managerName, setManagerName] = useState('Gestionnaire P2M Showroom');

  // Forms
  const [showProdForm, setShowProdForm] = useState(false);
  const [editingProd, setEditingProd] = useState<P2mProductRow | null>(null);
  const [prodForm, setProdForm] = useState({
    ref: '',
    name: '',
    category: 'Carrelages Porcelaine',
    brand: 'P2M Sélection',
    dimensions: '60×60 cm',
    unit: 'm²',
    indicativePriceFCFA: 6000,
    isPriceVisible: true,
    availability: 'En stock',
    leadTime: 'Sous 48h',
  });

  const [showClientForm, setShowClientForm] = useState(false);
  const [clientForm, setClientForm] = useState({
    identifier: '',
    fullName: '',
    company: '',
    phone: '',
    email: '',
    city: 'Dakar',
  });

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });

  const notify = (msg: string, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 4000);
  };

  const loadWorkspace = useCallback(async () => {
    try {
      const res = await fetch('/api/p2m/admin/workspace', { cache: 'no-store' });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.manager?.displayName) setManagerName(data.manager.displayName);
      setProducts(data.products || []);
      setNeeds(data.needs || []);
      setClients(data.clients || []);
      setDocs(data.ordersInvoices || []);
      setAuditLogs(data.auditLogs || []);
    } catch {
      notify('Erreur synchronisation P2M.', true);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProd ? 'PUT' : 'POST';
      const body = editingProd ? { id: editingProd.id, ...prodForm } : prodForm;
      const res = await fetch('/api/p2m/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur produit P2M');
      setShowProdForm(false);
      setEditingProd(null);
      await loadWorkspace();
      notify('Catalogue P2M mis à jour et synchronisé sur /catalogue !');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    }
  };

  const callP2mOp = async (entity: string, action: string, payload: Record<string, unknown>) => {
    const res = await fetch('/api/p2m/admin/workspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity, action, payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur opération P2M');
    return data;
  };

  const totalCA = docs.reduce((s, d) => s + (d.totalTTC || 0), 0);
  const totalPaid = docs.reduce((s, d) => s + (d.amountPaidFCFA || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/95 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              P2M SHOWROOM — Espace Gestionnaire Isolé
            </div>
            <div className="text-[11px] font-mono text-sky-400">
              {managerName} · Cloisonnement strict (Zéro accès SB-S Industrie / SB-S Logistik)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadWorkspace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-sky-300"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Catalogue public</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/p2m/auth/logout', { method: 'POST' });
              onLogout();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 border border-rose-500/30 text-xs text-rose-300 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-bold shadow-2xl border ${
            toast.err
              ? 'bg-rose-950 border-rose-500 text-rose-200'
              : 'bg-emerald-950 border-emerald-500 text-emerald-200'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 p-3 flex lg:flex-col gap-1.5 overflow-x-auto">
          {[
            { key: 'dashboard' as P2mTab, label: 'Tableau de bord', icon: LayoutDashboard },
            { key: 'catalogue' as P2mTab, label: 'Catalogue P2M', icon: Layers, badge: products.length },
            { key: 'needs' as P2mTab, label: 'Besoins P2M', icon: ClipboardList, badge: needs.length },
            { key: 'clients' as P2mTab, label: 'Clients P2M', icon: Users, badge: clients.length },
            { key: 'docs' as P2mTab, label: 'Devis & Factures', icon: Receipt, badge: docs.length },
            { key: 'security' as P2mTab, label: 'Sécurité & Audit', icon: ShieldAlert },
          ].map((item) => {
            const IconComp = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                  active ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      active ? 'bg-slate-950 text-sky-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-400">Chargement P2M...</div>
          ) : tab === 'dashboard' ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white">Tableau de bord P2M Showroom</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">RÉFÉRENCES CATALOGUE</div>
                  <div className="text-2xl font-bold text-sky-400 mt-1">{products.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">BESOINS PANIER P2M</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">{needs.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">DEVIS / FACTURES</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">
                    {totalCA.toLocaleString('fr-FR')} F
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">ENCAISSÉ P2M</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                    {totalPaid.toLocaleString('fr-FR')} F
                  </div>
                </div>
              </div>
            </div>
          ) : tab === 'catalogue' ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Catalogue Carrelages, Marbres & Sanitaires P2M
                  </h2>
                  <p className="text-xs text-slate-400">
                    Synchronisé en direct avec `/catalogue` et `/entites/p2m`.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProd(null);
                    setProdForm({
                      ref: `P2M-${String(products.length + 1).padStart(3, '0')}`,
                      name: '',
                      category: 'Carrelages Porcelaine',
                      brand: 'P2M Sélection',
                      dimensions: '60×60 cm',
                      unit: 'm²',
                      indicativePriceFCFA: 6000,
                      isPriceVisible: true,
                      availability: 'En stock',
                      leadTime: 'Sous 48h',
                    });
                    setShowProdForm((v) => !v);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un produit P2M</span>
                </button>
              </div>

              {showProdForm && (
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Référence *"
                    value={prodForm.ref}
                    onChange={(e) => setProdForm((p) => ({ ...p, ref: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nom du produit *"
                    value={prodForm.name}
                    onChange={(e) => setProdForm((p) => ({ ...p, name: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Marque *"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm((p) => ({ ...p, brand: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Catégorie"
                    value={prodForm.category}
                    onChange={(e) => setProdForm((p) => ({ ...p, category: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Dimensions (ex: 60×120 cm)"
                    value={prodForm.dimensions}
                    onChange={(e) => setProdForm((p) => ({ ...p, dimensions: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Prix indicatif FCFA"
                    value={prodForm.indicativePriceFCFA}
                    onChange={(e) =>
                      setProdForm((p) => ({
                        ...p,
                        indicativePriceFCFA: Number(e.target.value) || 0,
                      }))
                    }
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <select
                    value={prodForm.availability}
                    onChange={(e) => setProdForm((p) => ({ ...p, availability: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="En stock">En stock</option>
                    <option value="Sur commande">Sur commande</option>
                    <option value="Stock limité">Stock limité</option>
                    <option value="Rupture">Rupture</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Unité (m², pièce...)"
                    value={prodForm.unit}
                    onChange={(e) => setProdForm((p) => ({ ...p, unit: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProd ? 'Enregistrer modifications' : 'Créer produit'}</span>
                  </button>
                </form>
              )}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Réf</th>
                      <th className="p-3">Produit</th>
                      <th className="p-3">Catégorie / Dimensions</th>
                      <th className="p-3">Marque</th>
                      <th className="p-3 text-right">Prix FCFA</th>
                      <th className="p-3">Disponibilité</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-sky-400">{p.ref}</td>
                        <td className="p-3 font-bold text-white">{p.name}</td>
                        <td className="p-3 text-slate-300">
                          {p.category} · <span className="font-mono">{p.dimensions}</span>
                        </td>
                        <td className="p-3 text-slate-300">{p.brand}</td>
                        <td className="p-3 text-right font-mono font-bold text-white">
                          {p.indicativePriceFCFA.toLocaleString('fr-FR')} F/{p.unit}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold">
                            {p.availability}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProd(p);
                                setProdForm({
                                  ref: p.ref,
                                  name: p.name,
                                  category: p.category,
                                  brand: p.brand,
                                  dimensions: p.dimensions,
                                  unit: p.unit,
                                  indicativePriceFCFA: p.indicativePriceFCFA,
                                  isPriceVisible: p.isPriceVisible,
                                  availability: p.availability,
                                  leadTime: p.leadTime,
                                });
                                setShowProdForm(true);
                              }}
                              className="p-1.5 rounded bg-slate-800 text-sky-300"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await fetch(`/api/p2m/admin/products?id=${encodeURIComponent(p.id)}`, {
                                  method: 'DELETE',
                                });
                                await loadWorkspace();
                                notify('Produit supprimé.');
                              }}
                              className="p-1.5 rounded bg-slate-800 text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab === 'needs' ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">
                Expressions de besoins reçues (Panier P2M isolé)
              </h2>
              {needs.map((n) => (
                <div
                  key={n.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                        {n.needNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">{n.status}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {n.clientName} {n.company ? `— ${n.company}` : ''} ({n.phone})
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(n.items || []).map((i, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono"
                        >
                          {i.qty} {i.unit} · {i.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {n.status !== 'Converti' && (
                      <button
                        type="button"
                        onClick={async () => {
                          await callP2mOp('need', 'convertToDoc', { id: n.id, docType: 'Devis' });
                          await loadWorkspace();
                          notify('Converti en Devis P2M.');
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                      >
                        Convertir en Devis
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {needs.length === 0 && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400">
                  Aucune expression de besoin reçue depuis le panier P2M.
                </div>
              )}
            </div>
          ) : tab === 'clients' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Clients P2M Showroom</h2>
                <button
                  type="button"
                  onClick={() => setShowClientForm((v) => !v)}
                  className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
                >
                  + Nouveau client P2M
                </button>
              </div>
              {showClientForm && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await callP2mOp('client', 'create', clientForm);
                    setShowClientForm(false);
                    await loadWorkspace();
                    notify('Client P2M ajouté.');
                  }}
                  className="bg-slate-900 border border-sky-500/30 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Nom complet *"
                    value={clientForm.fullName}
                    onChange={(e) => setClientForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Téléphone *"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm((p) => ({ ...p, phone: e.target.value }))}
                    className="px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white font-bold">
                    Créer client
                  </button>
                </form>
              )}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Téléphone</th>
                      <th className="p-3">Ville</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {clients.map((c) => (
                      <tr key={c.id}>
                        <td className="p-3 font-mono font-bold text-sky-400">{c.code}</td>
                        <td className="p-3 font-bold text-white">{c.fullName}</td>
                        <td className="p-3 font-mono">{c.phone}</td>
                        <td className="p-3">{c.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : tab === 'docs' ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Devis, Factures & Règlements P2M</h2>
              {docs.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-400">{d.docNumber}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800">{d.docType}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300">
                        {d.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {d.clientName} · {d.totalTTC.toLocaleString('fr-FR')} FCFA TTC (Payé :{' '}
                      {d.amountPaidFCFA.toLocaleString('fr-FR')} F)
                    </div>
                  </div>
                  {d.amountPaidFCFA < d.totalTTC && (
                    <button
                      type="button"
                      onClick={async () => {
                        await callP2mOp('doc', 'recordPayment', {
                          id: d.id,
                          amountFCFA: d.totalTTC - d.amountPaidFCFA,
                          paymentMethod: 'Wave',
                          paymentRef: `WAVE-${Date.now()}`,
                        });
                        await loadWorkspace();
                        notify(`Facture ${d.docNumber} soldée via Wave !`);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                    >
                      Solder par Wave
                    </button>
                  )}
                </div>
              ))}
              {docs.length === 0 && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400">
                  Aucun devis ou facture P2M émis.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await fetch('/api/p2m/admin/workspace', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pwdForm),
                  });
                  const data = await res.json();
                  if (!res.ok) return notify(data.error || 'Erreur', true);
                  setPwdForm({ currentPassword: '', newPassword: '' });
                  await loadWorkspace();
                  notify('Mot de passe P2M mis à jour.');
                }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md space-y-3 text-xs"
              >
                <h2 className="text-sm font-bold text-white">Changer le mot de passe P2M</h2>
                <input
                  type="password"
                  required
                  placeholder="Mot de passe actuel"
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Nouveau mot de passe (min 8 caractères)"
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white"
                />
                <button type="submit" className="px-4 py-2 rounded bg-sky-500 text-slate-950 font-bold">
                  Mettre à jour
                </button>
              </form>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 text-xs font-mono">
                <h3 className="text-sm font-bold text-white font-sans">Audit P2M</h3>
                {auditLogs.map((a) => (
                  <div key={a.id} className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-sky-400">{a.action}</span>
                    <span className="text-slate-400">
                      {a.actor} · {new Date(a.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
