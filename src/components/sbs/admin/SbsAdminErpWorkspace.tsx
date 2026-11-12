'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Boxes,
  Calendar,
  ShoppingBag,
  Calculator,
  FileSpreadsheet,
  PackageCheck,
  Settings,
  Save,
  Download,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { computeSbsErp, type SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type {
  SbsFactoryConfigData,
  SbsMonthlyLedgerData,
  SbsProductItem,
} from '@/lib/sbsErpDefaults';
import { downloadSbsExcelWorkbook } from '@/lib/sbsExcelExport';
import { fmtFCFA, MONTHS_FR } from './sbsFormat';
import SbsDashboardTab, { type SbsAdminTabId } from './SbsDashboardTab';
import SbsCatalogTab from './SbsCatalogTab';
import SbsJournalierTab from './SbsJournalierTab';
import SbsVentesLocationsTab from './SbsVentesLocationsTab';
import SbsPrixRevientTab from './SbsPrixRevientTab';
import SbsResultatKpiTab from './SbsResultatKpiTab';
import SbsStocksTab from './SbsStocksTab';
import SbsParametresTab from './SbsParametresTab';

interface WorkspacePayload {
  manager: {
    username: string;
    displayName: string;
    role: string;
    entityId: string;
  };
  config: SbsFactoryConfigData;
  products: SbsProductItem[];
  ledger: SbsMonthlyLedgerData;
  computed: SbsErpComputedReport;
  availablePeriods: { year: number; month: number }[];
  auditLogs: { id: string; action: string; actor: string; createdAt: string; details?: any }[];
}

const NAV_TABS: { id: SbsAdminTabId; label: string; shortLabel: string; icon: React.ComponentType<any> }[] = [
  { id: 'dashboard', label: 'Tableau de bord', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'catalog', label: 'Catalogue, Dimensions & Locations', shortLabel: 'Catalogue', icon: Boxes },
  { id: 'journalier', label: 'Suivi Journalier (1–31)', shortLabel: 'Journalier', icon: Calendar },
  { id: 'ventes', label: 'Ventes & Locations', shortLabel: 'Ventes', icon: ShoppingBag },
  { id: 'prix-revient', label: 'Prix de Revient & Compacité', shortLabel: 'Coûts', icon: Calculator },
  { id: 'resultat', label: 'Résultat & Seuil', shortLabel: 'Résultat', icon: FileSpreadsheet },
  { id: 'stocks', label: 'Stocks & Report', shortLabel: 'Stocks', icon: PackageCheck },
  { id: 'parametres', label: 'Paramètres & Sécurité', shortLabel: 'Paramètres', icon: Settings },
];

export default function SbsAdminErpWorkspace({ onLoggedOut }: { onLoggedOut: () => void }) {
  const [activeTab, setActiveTab] = useState<SbsAdminTabId>('dashboard');
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(11);
  const [manager, setManager] = useState<WorkspacePayload['manager'] | null>(null);
  const [config, setConfig] = useState<SbsFactoryConfigData | null>(null);
  const [products, setProducts] = useState<SbsProductItem[]>([]);
  const [ledger, setLedger] = useState<SbsMonthlyLedgerData | null>(null);
  const [availablePeriods, setAvailablePeriods] = useState<{ year: number; month: number }[]>([]);
  const [auditLogs, setAuditLogs] = useState<WorkspacePayload['auditLogs']>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const showToast = useCallback((type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  const loadWorkspace = useCallback(
    async (targetYear: number, targetMonth: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/sbs-industrie/admin/workspace?year=${targetYear}&month=${targetMonth}`,
          { cache: 'no-store' }
        );
        if (res.status === 401) {
          onLoggedOut();
          return;
        }
        const data = (await res.json()) as WorkspacePayload & { error?: string };
        if (!res.ok) {
          showToast('err', data.error || 'Erreur de chargement de l’ERP.');
          return;
        }
        setManager(data.manager);
        setConfig(data.config);
        setProducts(data.products);
        setLedger(data.ledger);
        setAvailablePeriods(data.availablePeriods || []);
        setAuditLogs(data.auditLogs || []);
        setDirty(false);
      } catch {
        showToast('err', 'Erreur réseau lors du chargement de l’ERP.');
      } finally {
        setLoading(false);
      }
    },
    [onLoggedOut, showToast]
  );

  useEffect(() => {
    loadWorkspace(year, month);
  }, [year, month, loadWorkspace]);

  const computed = useMemo(() => {
    if (!config || !ledger) return null;
    return computeSbsErp(config, products, ledger);
  }, [config, products, ledger]);

  const handleSaveWorkspace = async () => {
    if (!config || !ledger) return;
    setSaving(true);
    try {
      const res = await fetch('/api/sbs-industrie/admin/workspace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          month,
          config,
          ledger,
        }),
      });
      if (res.status === 401) {
        onLoggedOut();
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        showToast('err', data.error || 'Échec de l’enregistrement.');
        return;
      }
      setConfig(data.config);
      setProducts(data.products);
      setLedger(data.ledger);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      setDirty(false);
      showToast('ok', `Modifications enregistrées pour ${MONTHS_FR[(month - 1) % 12]} ${year}.`);
    } catch {
      showToast('err', 'Erreur réseau lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProduct = async (mode: 'create' | 'edit', payload: any) => {
    const res = await fetch('/api/sbs-industrie/admin/products', {
      method: mode === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status === 401) {
      onLoggedOut();
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Impossible d’enregistrer le produit.');
    }
    setProducts(data.products);
    showToast(
      'ok',
      mode === 'create'
        ? `Article ${payload.code} ajouté et synchronisé sur la vitrine SBS Industrie.`
        : `Article ${payload.code} mis à jour et synchronisé sur la vitrine SBS Industrie.`
    );
  };

  const handleDeleteProduct = async (id: string, code: string) => {
    const res = await fetch(`/api/sbs-industrie/admin/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.status === 401) {
      onLoggedOut();
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      showToast('err', data.error || 'Suppression impossible.');
      return;
    }
    setProducts(data.products);
    showToast('ok', `Article ${code} retiré du catalogue.`);
  };

  const handleApplyPriceToCatalog = async (product: SbsProductItem, newPrice: number) => {
    await handleSaveProduct('edit', {
      ...product,
      sellingPriceFCFA: newPrice,
    });
  };

  const handleRolloverToNextMonth = async () => {
    if (!config || !ledger || !computed) return;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    // Sauvegarde d'abord le mois courant s'il est modifié
    await handleSaveWorkspace();

    // Charge ou crée le mois suivant, puis injecte les stocks finals actuels comme ouverture
    const resGet = await fetch(
      `/api/sbs-industrie/admin/workspace?year=${nextYear}&month=${nextMonth}`,
      { cache: 'no-store' }
    );
    if (!resGet.ok) {
      showToast('err', 'Impossible de préparer le mois suivant.');
      return;
    }
    const nextWs = (await resGet.json()) as WorkspacePayload;
    const nextLedger: SbsMonthlyLedgerData = {
      ...nextWs.ledger,
      rawMaterialStock: { ...nextWs.ledger.rawMaterialStock },
      productStock: { ...nextWs.ledger.productStock },
    };

    for (const row of computed.stockRows) {
      if (row.category === 'matiere') {
        const cur = nextLedger.rawMaterialStock[row.code] ?? { opening: 0, entries: 0 };
        nextLedger.rawMaterialStock[row.code] = {
          opening: Math.max(0, Number(row.closing.toFixed(2))),
          entries: cur.entries,
        };
      } else {
        const cur = nextLedger.productStock[row.code] ?? { opening: 0, entries: 0 };
        nextLedger.productStock[row.code] = {
          opening: Math.max(0, Math.round(row.closing)),
          entries: cur.entries,
        };
      }
    }

    const resPut = await fetch('/api/sbs-industrie/admin/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: nextYear,
        month: nextMonth,
        ledger: nextLedger,
      }),
    });
    if (!resPut.ok) {
      showToast('err', 'Erreur lors du report des stocks sur le mois suivant.');
      return;
    }

    setYear(nextYear);
    setMonth(nextMonth);
    showToast(
      'ok',
      `Stocks finaux reportés en stock initial de ${MONTHS_FR[(nextMonth - 1) % 12]} ${nextYear}.`
    );
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    const res = await fetch('/api/sbs-industrie/admin/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passwordChange: { currentPassword, newPassword },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Changement de mot de passe refusé.');
    }
    if (data.auditLogs) setAuditLogs(data.auditLogs);
  };

  const handleLogout = async () => {
    await fetch('/api/sbs-industrie/auth/logout', { method: 'POST' });
    onLoggedOut();
  };

  const handlePeriodSwitch = (nextYear: number, nextMonth: number) => {
    if (dirty && !window.confirm('Vous avez des modifications non enregistrées. Changer de période quand même ?')) {
      return;
    }
    setYear(nextYear);
    setMonth(nextMonth);
  };

  if (loading || !config || !ledger || !computed) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 flex flex-col items-center justify-center p-6">
        <RefreshCw className="w-8 h-8 text-accent-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-brand-900 dark:text-white">
          Chargement de l’ERP SBS Industrie...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900 text-brand-900 dark:text-neutral-100">
      {/* Top sticky header */}
      <header className="sticky top-0 z-40 bg-brand-900/95 backdrop-blur-md text-white border-b border-brand-800 shadow-elev-1">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/entites/sbs-industries"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-m bg-brand-800 hover:bg-brand-700 text-xs font-semibold text-neutral-200 border border-brand-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Page publique SBS
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Accès Gestionnaire SBS
                </span>
                <span className="text-xs text-neutral-400 hidden md:inline">
                  Connecté : <strong className="text-white">{manager?.displayName || manager?.username}</strong>
                </span>
              </div>
              <h1 className="font-title font-bold text-base sm:text-lg leading-tight">
                SBS Industrie — ERP Gestion Usine, Préfabrication &amp; Locations
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sélecteur Période */}
            <div className="flex items-center gap-1 bg-brand-800 border border-brand-700 rounded-m px-2 py-1">
              <select
                aria-label="Mois"
                value={month}
                onChange={(e) => handlePeriodSwitch(year, Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
              >
                {MONTHS_FR.map((mName, idx) => (
                  <option key={mName} value={idx + 1} className="text-brand-900">
                    {mName}
                  </option>
                ))}
              </select>
              <select
                aria-label="Année"
                value={year}
                onChange={(e) => handlePeriodSwitch(Number(e.target.value), month)}
                className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
              >
                {Array.from(
                  new Set([2025, 2026, 2027, ...availablePeriods.map((p) => p.year)])
                )
                  .sort()
                  .map((y) => (
                    <option key={y} value={y} className="text-brand-900">
                      {y}
                    </option>
                  ))}
              </select>
            </div>

            {dirty && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px] font-semibold">
                Non enregistré
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveWorkspace}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-m text-xs font-bold shadow-sm transition-colors ${
                dirty
                  ? 'bg-accent-500 hover:bg-accent-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              } disabled:opacity-60`}
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>

            <button
              type="button"
              onClick={() => downloadSbsExcelWorkbook(config, products, ledger, computed)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-m bg-brand-800 hover:bg-brand-700 border border-brand-600 text-xs font-semibold text-neutral-100"
              title="Télécharger le classeur Excel multi-feuilles mis à jour"
            >
              <Download className="w-3.5 h-3.5 text-accent-400" />
              <span className="hidden sm:inline">Export Excel (.xls)</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-m bg-red-600/20 hover:bg-red-600/35 border border-red-500/40 text-xs font-semibold text-red-200"
              title="Fermer la session gestionnaire SBS Industrie"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation 8 modules ERP + Résumé CA live */}
        <div className="bg-brand-950/60 border-t border-brand-800">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto">
            <nav className="flex items-center gap-1 py-1.5">
              {NAV_TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-m text-xs font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-accent-500 text-white shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-brand-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{t.label}</span>
                    <span className="xl:hidden">{t.shortLabel}</span>
                  </button>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-4 text-[11px] text-neutral-300 whitespace-nowrap py-1.5">
              <span>
                CA : <strong className="text-white tabular-nums">{fmtFCFA(computed.incomeStatement.caTotal)}</strong>
              </span>
              <span>
                Résultat :{' '}
                <strong
                  className={`tabular-nums ${
                    computed.incomeStatement.resultatNet >= 0 ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {fmtFCFA(computed.incomeStatement.resultatNet)}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-l shadow-elev-2 border text-xs font-semibold ${
              toast.type === 'ok'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : 'bg-red-900 text-red-50 border-red-700'
            }`}
          >
            {toast.type === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <SbsDashboardTab
            computed={computed}
            ledger={ledger}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'catalog' && (
          <SbsCatalogTab
            products={products}
            computed={computed}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'journalier' && (
          <SbsJournalierTab
            products={products}
            ledger={ledger}
            computed={computed}
            onChangeLedger={(next) => {
              setLedger(next);
              setDirty(true);
            }}
          />
        )}

        {activeTab === 'ventes' && (
          <SbsVentesLocationsTab
            products={products}
            ledger={ledger}
            computed={computed}
            onChangeLedger={(next) => {
              setLedger(next);
              setDirty(true);
            }}
          />
        )}

        {activeTab === 'prix-revient' && (
          <SbsPrixRevientTab
            products={products}
            computed={computed}
            onApplyPriceToCatalog={handleApplyPriceToCatalog}
          />
        )}

        {activeTab === 'resultat' && (
          <SbsResultatKpiTab
            ledger={ledger}
            computed={computed}
            onChangeLedger={(next) => {
              setLedger(next);
              setDirty(true);
            }}
          />
        )}

        {activeTab === 'stocks' && (
          <SbsStocksTab
            ledger={ledger}
            computed={computed}
            onChangeLedger={(next) => {
              setLedger(next);
              setDirty(true);
            }}
            onRolloverToNextMonth={handleRolloverToNextMonth}
          />
        )}

        {activeTab === 'parametres' && (
          <SbsParametresTab
            config={config}
            computed={computed}
            auditLogs={auditLogs}
            onChangeConfig={(next) => {
              setConfig(next);
              setDirty(true);
            }}
            onChangePassword={handleChangePassword}
          />
        )}
      </main>
    </div>
  );
}
