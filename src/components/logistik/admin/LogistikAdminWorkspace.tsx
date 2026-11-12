'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus2,
  Receipt,
  CreditCard,
  Users,
  Wrench,
  Truck,
  ShieldAlert,
  LogOut,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { LogistikOperationsTab } from './LogistikOperationsTab';
import { LogistikFleetSavTab } from './LogistikFleetSavTab';
import type {
  LogistikAuditRow,
  LogistikClientRow,
  LogistikEquipmentRow,
  LogistikInvoiceRow,
  LogistikNeedRow,
  LogistikPaymentRow,
  LogistikQuoteRow,
  LogistikSavRow,
} from './types';

type TabKey =
  | 'dashboard'
  | 'needs'
  | 'quotes'
  | 'invoices'
  | 'payments'
  | 'clients'
  | 'sav'
  | 'fleet'
  | 'security';

export function LogistikAdminWorkspace({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);

  const [equipment, setEquipment] = useState<LogistikEquipmentRow[]>([]);
  const [clients, setClients] = useState<LogistikClientRow[]>([]);
  const [needs, setNeeds] = useState<LogistikNeedRow[]>([]);
  const [quotes, setQuotes] = useState<LogistikQuoteRow[]>([]);
  const [invoices, setInvoices] = useState<LogistikInvoiceRow[]>([]);
  const [payments, setPayments] = useState<LogistikPaymentRow[]>([]);
  const [afterSalesLogs, setAfterSalesLogs] = useState<LogistikSavRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<LogistikAuditRow[]>([]);
  const [managerName, setManagerName] = useState('Gestionnaire SB-S Logistik');

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });

  const notify = (msg: string, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 4000);
  };

  const loadWorkspace = useCallback(async () => {
    try {
      const res = await fetch('/api/sbs-logistik/admin/workspace', { cache: 'no-store' });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.manager?.displayName) setManagerName(data.manager.displayName);
      setEquipment(data.equipment || []);
      setClients(data.clients || []);
      setNeeds(data.needs || []);
      setQuotes(data.quotes || []);
      setInvoices(data.invoices || []);
      setPayments(data.payments || []);
      setAfterSalesLogs(data.afterSalesLogs || []);
      setAuditLogs(data.auditLogs || []);
    } catch {
      notify('Erreur synchronisation serveur SB-S Logistik.', true);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const handleLogout = async () => {
    await fetch('/api/sbs-logistik/auth/logout', { method: 'POST' });
    onLogout();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sbs-logistik/admin/workspace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwdForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec');
      setPwdForm({ currentPassword: '', newPassword: '' });
      await loadWorkspace();
      notify('Mot de passe gestionnaire SB-S Logistik mis à jour.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Erreur', true);
    }
  };

  const totalInvoiced = invoices.reduce((s, i) => s + (i.totalTTC || 0), 0);
  const totalCollected = payments.reduce((s, p) => s + (p.amountFCFA || 0), 0);
  const totalDue = invoices.reduce((s, i) => s + (i.balanceDueFCFA || 0), 0);
  const availableEquip = equipment.filter((e) => e.availability === 'Disponible').length;
  const rentedEquip = equipment.filter((e) => e.availability === 'En location').length;
  const openNeeds = needs.filter((n) => n.status === 'Nouveau').length;

  const navItems: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { key: 'needs', label: 'Expressions besoins', icon: ClipboardList, badge: openNeeds },
    { key: 'quotes', label: 'Devis', icon: FilePlus2, badge: quotes.length },
    { key: 'invoices', label: 'Factures', icon: Receipt, badge: invoices.length },
    { key: 'payments', label: 'Paiement en ligne', icon: CreditCard, badge: payments.length },
    { key: 'clients', label: 'Clients', icon: Users, badge: clients.length },
    { key: 'sav', label: 'Suivi SAV / Location', icon: Wrench, badge: afterSalesLogs.length },
    { key: 'fleet', label: 'Parc Engins & Matériels', icon: Truck, badge: equipment.length },
    { key: 'security', label: 'Sécurité & Audit', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER BAR */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              SB-S LOGISTIK — Espace Gestionnaire Dédié
            </div>
            <div className="text-[11px] font-mono text-amber-400">
              Connecté : {managerName} · Cloisonnement strict (Zéro accès P2M / SB-S Industrie)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadWorkspace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <Link
            href="/entites/sbs-logistik"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Vitrine Logistik</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-xs text-rose-300 font-semibold"
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
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 p-3 flex lg:flex-col gap-1.5 overflow-x-auto">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <span className="flex items-center gap-2">
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      active ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-400">
              Chargement des modules d&apos;exploitation SB-S Logistik...
            </div>
          ) : tab === 'dashboard' ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Pilotage Exploitation & Location SB-S Logistik
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Vue consolidée : besoins clients, facturation, encaissements en ligne, parc
                  engins et suivi SAV.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">PARC DISPONIBLE</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {availableEquip} / {equipment.length}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{rentedEquip} engins en location</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">BESOINS À TRAITER</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">{openNeeds}</div>
                  <div className="text-xs text-slate-400 mt-1">{quotes.length} devis enregistrés</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">CHIFFRE FACTURÉ TTC</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">
                    {totalInvoiced.toLocaleString('fr-FR')} F
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{invoices.length} factures émises</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="text-[11px] font-mono text-slate-400">ENCAISSEMENTS & DÛ</div>
                  <div className="text-2xl font-bold text-sky-400 mt-1 font-mono">
                    {totalCollected.toLocaleString('fr-FR')} F
                  </div>
                  <div className="text-xs text-amber-300 mt-1 font-mono">
                    Reste dû : {totalDue.toLocaleString('fr-FR')} F
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">Raccourcis opérationnels</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setTab('needs')}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left"
                    >
                      <div className="font-bold text-amber-400">Expressions de besoins</div>
                      <div className="text-slate-400 mt-0.5">Qualifier & chiffrer</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('fleet')}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left"
                    >
                      <div className="font-bold text-emerald-400">Parc Engins & Marques</div>
                      <div className="text-slate-400 mt-0.5">Disponibilité en 1 clic</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('invoices')}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left"
                    >
                      <div className="font-bold text-sky-400">Factures & Liens en ligne</div>
                      <div className="text-slate-400 mt-0.5">Wave / Orange Money / CB</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('sav')}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left"
                    >
                      <div className="font-bold text-white">Suivi SAV & Locations</div>
                      <div className="text-slate-400 mt-0.5">Sorties / Retours / Pannes</div>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h2 className="text-sm font-bold text-white">Dernières actions tracées</h2>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {auditLogs.slice(0, 8).map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80"
                      >
                        <span className="font-mono text-amber-300">{a.action}</span>
                        <span className="text-slate-400">
                          {a.actor} · {new Date(a.createdAt).toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : tab === 'needs' || tab === 'quotes' || tab === 'invoices' || tab === 'payments' ? (
            <LogistikOperationsTab
              activeSubTab={tab}
              needs={needs}
              quotes={quotes}
              invoices={invoices}
              payments={payments}
              clients={clients}
              equipment={equipment}
              onRefresh={loadWorkspace}
              notify={notify}
            />
          ) : tab === 'clients' || tab === 'sav' || tab === 'fleet' ? (
            <LogistikFleetSavTab
              activeSubTab={tab}
              clients={clients}
              afterSalesLogs={afterSalesLogs}
              equipment={equipment}
              onRefresh={loadWorkspace}
              notify={notify}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg space-y-4">
                <h2 className="text-base font-bold text-white">
                  Modifier le mot de passe Gestionnaire SB-S Logistik
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
                  <input
                    type="password"
                    required
                    placeholder="Mot de passe actuel"
                    value={pwdForm.currentPassword}
                    onChange={(e) =>
                      setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Nouveau mot de passe (min 8 caractères)"
                    value={pwdForm.newPassword}
                    onChange={(e) => setPwdForm((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Mettre à jour le mot de passe
                  </button>
                </form>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">Journal d&apos;Audit Sécurité Logistik</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto text-xs font-mono">
                  {auditLogs.map((a) => (
                    <div
                      key={a.id}
                      className="flex flex-wrap justify-between gap-2 py-2 border-b border-slate-800"
                    >
                      <span className="text-amber-400 font-bold">{a.action}</span>
                      <span className="text-slate-300">
                        {a.actor} · {a.ipAddress || 'local'} ·{' '}
                        {new Date(a.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
