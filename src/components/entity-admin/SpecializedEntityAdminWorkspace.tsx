'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LogOut,
  Plus,
  RefreshCw,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  FileText,
  FlaskConical,
  Compass,
  Building2,
  Globe,
  Send,
  ExternalLink,
} from 'lucide-react';
import { EntityInterconnectionBar } from './EntityInterconnectionBar';
import { getEntityAdminSpec } from '@/data/entityAdminRegistry';
import type { ManagedEntityId } from '@/lib/entityAuth';

interface SpecializedEntityAdminWorkspaceProps {
  entityId: Extract<ManagedEntityId, 'sbs-labo' | 'serma-btp' | 'sbs-group' | 'pgt'>;
  onLogout: () => void;
}

interface OperationalTask {
  id: string;
  reference: string;
  title: string;
  category: string;
  client: string;
  status: 'À traiter' | 'En cours' | 'Validé' | 'Transmis';
  targetEntity?: string;
  createdAt: string;
  notes?: string;
}

const ENTITY_PRESETS: Record<
  SpecializedEntityAdminWorkspaceProps['entityId'],
  {
    categories: string[];
    defaultTasks: OperationalTask[];
    accentBtn: string;
  }
> = {
  'sbs-labo': {
    categories: [
      'Forage hydraulique & sondage carottage',
      'Limite d’Atterberg (Casagrande)',
      'Écrasement béton / Formulation',
      'Essais CBR / Proctor / Œdométrie',
      'Los Angeles / Micro Deval / Granulométrie',
      'Essai sur site (Cône d’Abrams, Pressiomètre, Pénétro)',
    ],
    defaultTasks: [
      {
        id: 'lab-1',
        reference: 'PV-LAB-2026-01',
        title: 'Campagne forage hydraulique + Atterberg (Casagrande) — Immeuble R+6',
        category: 'Forage hydraulique & sondage carottage',
        client: 'SERMA BTP / Chantier Almadies',
        status: 'Validé',
        targetEntity: 'serma-btp',
        createdAt: '2026-11-17',
        notes: 'PV géotechnique C2 prêt pour modélisation 3D/BIM SERMA BTP.',
      },
      {
        id: 'lab-2',
        reference: 'PV-BET-2026-02',
        title: 'Écrasement éprouvettes béton 7j / 28j & Cône d’Abrams',
        category: 'Écrasement béton / Formulation',
        client: 'SB-S Group / Chantier Diamniadio',
        status: 'En cours',
        targetEntity: 'sbs-group',
        createdAt: '2026-11-18',
      },
    ],
    accentBtn: 'bg-cyan-600 hover:bg-cyan-500',
  },
  'serma-btp': {
    categories: [
      'Modélisation 3D/BIM & Structure',
      'Note de calcul Eurocodes / DTU',
      'Dimensionnement fondations (sur étude SB-S Labo)',
      'Plans d’exécution Gros Œuvre',
      'Audit / Expertise technique',
    ],
    defaultTasks: [
      {
        id: 'serma-1',
        reference: 'BIM-2026-01',
        title: 'Maquette 3D/BIM & descente de charges sur PV SB-S Labo',
        category: 'Modélisation 3D/BIM & Structure',
        client: 'Projet Résidence Hann Mariste',
        status: 'Validé',
        targetEntity: 'sbs-group',
        createdAt: '2026-11-17',
        notes: 'Plans d’exécution transmis à SB-S Group pour démarrage chantier.',
      },
    ],
    accentBtn: 'bg-indigo-600 hover:bg-indigo-500',
  },
  'sbs-group': {
    categories: [
      'Chantier Génie Civil / Ouvrage d’art',
      'Bâtiment / Gros œuvre',
      'Demande engins SB-S Logistik',
      'Commande BPE / Agglos SB-S Industries',
      'Approvisionnement P2M / PGT',
    ],
    defaultTasks: [
      {
        id: 'grp-1',
        reference: 'CH-2026-01',
        title: 'Exécution fondations & élévation sur plans SERMA BTP',
        category: 'Bâtiment / Gros œuvre',
        client: 'Complexe Dakar Plateau',
        status: 'En cours',
        targetEntity: 'sbs-logistik',
        createdAt: '2026-11-18',
        notes: 'Mobilisation grue & pompe béton via SB-S Logistik + BPE SB-S Industries.',
      },
    ],
    accentBtn: 'bg-emerald-600 hover:bg-emerald-500',
  },
  pgt: {
    categories: [
      'Sourcing Dubaï - Ajman',
      'Sourcing Chine / Europe',
      'Transit portuaire & dédouanement Dakar',
      'Réapprovisionnement P2M Showroom',
      'Import équipements chantier SB-S Group',
    ],
    defaultTasks: [
      {
        id: 'pgt-1',
        reference: 'TC-2026-01',
        title: 'Conteneur 40" grès cérame & robinetterie Dubaï → Port de Dakar',
        category: 'Transit portuaire & dédouanement Dakar',
        client: 'P2M Showroom',
        status: 'En cours',
        targetEntity: 'p2m',
        createdAt: '2026-11-18',
        notes: 'Enlèvement prévu avec SB-S Logistik dès bon à délivrer.',
      },
    ],
    accentBtn: 'bg-purple-600 hover:bg-purple-500',
  },
};

const ICON_MAP = {
  'sbs-labo': FlaskConical,
  'serma-btp': Compass,
  'sbs-group': Building2,
  pgt: Globe,
};

export function SpecializedEntityAdminWorkspace({
  entityId,
  onLogout,
}: SpecializedEntityAdminWorkspaceProps) {
  const spec = getEntityAdminSpec(entityId)!;
  const preset = ENTITY_PRESETS[entityId];
  const IconComp = ICON_MAP[entityId];
  const storageKey = `mn_entity_ops_${entityId}`;

  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [tasks, setTasks] = useState<OperationalTask[]>(preset.defaultTasks);
  const [formOpen, setFormOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: preset.categories[0],
    client: '',
    notes: '',
    targetEntity: spec.connections[0]?.targetId || '',
  });
  const [flash, setFlash] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setTasks(parsed);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const saveTasks = (next: OperationalTask[]) => {
    setTasks(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entity-admin/${entityId}/workspace`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data.leads) ? data.leads : []);
        setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
        setLabTests(Array.isArray(data.labTests) ? data.labTests : []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [entityId]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const handleLogout = async () => {
    await fetch(`/api/entity-admin/${entityId}/auth`, { method: 'DELETE' });
    onLogout();
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const item: OperationalTask = {
      id: `op-${Date.now()}`,
      reference: `${entityId.toUpperCase()}-${String(tasks.length + 1).padStart(3, '0')}`,
      title: newTask.title.trim(),
      category: newTask.category,
      client: newTask.client.trim() || 'Client / Chantier interne',
      status: 'À traiter',
      targetEntity: newTask.targetEntity || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      notes: newTask.notes.trim(),
    };
    saveTasks([item, ...tasks]);
    setNewTask({ ...newTask, title: '', client: '', notes: '' });
    setFormOpen(false);
    setFlash('Opération enregistrée dans votre espace entité.');
  };

  const handleTransmitTask = async (task: OperationalTask, targetId: string) => {
    try {
      await fetch(`/api/entity-admin/${entityId}/workspace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEntityId: targetId,
          clientName: task.client,
          subject: `${task.reference} · ${task.title}`,
          details: task.notes || task.category,
          priority: 'Normale',
        }),
      });
      saveTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, status: 'Transmis', targetEntity: targetId } : t))
      );
      setFlash(`Dossier ${task.reference} transmis vers ${getEntityAdminSpec(targetId)?.name || targetId}.`);
    } catch {
      setFlash('Erreur lors de la transmission.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <EntityInterconnectionBar currentEntityId={entityId} />

      <header className="border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
              <IconComp className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{spec.name} — Espace Admin</h1>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${spec.badgeColor}`}>
                  {spec.leader}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{spec.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadWorkspace}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualiser
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white ${preset.accentBtn}`}
            >
              <Plus className="w-4 h-4" /> Nouvelle opération
            </button>
            <Link
              href={spec.publicHref}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Vitrine <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/70 border border-red-800/60 text-xs font-semibold text-red-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {flash && (
          <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-700 text-emerald-200 px-4 py-2.5 rounded-lg text-xs font-semibold">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {flash}</span>
            <button type="button" onClick={() => setFlash('')} className="underline">Fermer</button>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Opérations métier actives</p>
            <p className="text-2xl font-bold text-white mt-1">{tasks.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Demandes & transferts reçus</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{leads.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Devis liés à {spec.shortName}</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{quotes.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Entités interconnectées</p>
            <p className="text-2xl font-bold text-sky-400 mt-1">{spec.connections.length}</p>
          </div>
        </div>

        {/* Interconnexions métier */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            Interconnexions directes & indirectes de {spec.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {spec.connections.map((c) => {
              const target = getEntityAdminSpec(c.targetId);
              return (
                <div key={`${c.targetId}-${c.flowLabel}`} className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{c.targetName}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        c.type === 'directe' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {c.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{c.flowLabel}</p>
                  </div>
                  {target && (
                    <Link
                      href={target.adminHref}
                      className="shrink-0 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white"
                    >
                      Ouvrir
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Opérations par activité */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Dossiers & activités {spec.shortName}
            </h2>
            <span className="text-xs text-slate-400">{spec.modules.length} pôles d&apos;activité</span>
          </div>
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-amber-400 font-bold">{t.reference}</span>
                    <span className="text-sm font-bold text-white">{t.title}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{t.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {t.category} · Client/Chantier : <strong className="text-slate-200">{t.client}</strong> · {t.createdAt}
                  </p>
                  {t.notes && <p className="text-xs text-slate-300">{t.notes}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={t.status}
                    onChange={(e) =>
                      saveTasks(
                        tasks.map((item) =>
                          item.id === t.id ? { ...item, status: e.target.value as OperationalTask['status'] } : item
                        )
                      )
                    }
                    className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="À traiter">À traiter</option>
                    <option value="En cours">En cours</option>
                    <option value="Validé">Validé</option>
                    <option value="Transmis">Transmis</option>
                  </select>
                  {spec.connections[0] && (
                    <button
                      type="button"
                      onClick={() => handleTransmitTask(t, t.targetEntity || spec.connections[0].targetId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                    >
                      <Send className="w-3 h-3" /> Transmettre → {getEntityAdminSpec(t.targetEntity || spec.connections[0].targetId)?.shortName}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demandes clients & transferts inter-entités reçus */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-sky-400" />
            Demandes clients & transferts reçus ({leads.length})
          </h2>
          {leads.length === 0 ? (
            <p className="text-xs text-slate-400">
              Aucune nouvelle demande enregistrée en base pour {spec.name} pour le moment. Les transferts depuis les autres entités et l&apos;assistant apparaîtront ici.
            </p>
          ) : (
            <div className="divide-y divide-slate-800">
              {leads.map((l) => {
                const noteText = Array.isArray(l.notes) && l.notes[0]?.content ? l.notes[0].content : '';
                return (
                  <div key={l.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-white">
                        {l.fullName || l.name} · <span className="text-amber-400">{l.needCategory || l.projectType || spec.name}</span>
                      </p>
                      <p className="text-xs text-slate-400 whitespace-pre-line">
                        {noteText || `${l.projectType || ''} ${l.projectLocation ? `· ${l.projectLocation}` : ''}`}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 self-start">
                      {l.stage || l.status || 'Nouveau'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {labTests.length > 0 && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">Essais laboratoire enregistrés ({labTests.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {labTests.slice(0, 6).map((test) => (
                <div key={test.id} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs">
                  <p className="font-bold text-white">{test.name} ({test.code})</p>
                  <p className="text-slate-400 mt-1">{test.category} · Norme : {test.norm}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Nouvelle opération — {spec.name}</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Activité</label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                >
                  {preset.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Intitulé / Prestation</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Ex : Sondage piézométrique, note de calcul R+5..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Client / Chantier</label>
                <input
                  type="text"
                  value={newTask.client}
                  onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
                  placeholder="Nom du client ou chantier"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Entité cible (transmission)</label>
                <select
                  value={newTask.targetEntity}
                  onChange={(e) => setNewTask({ ...newTask, targetEntity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                >
                  {spec.connections.map((c) => <option key={c.targetId} value={c.targetId}>{c.targetName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Observations</label>
                <textarea
                  rows={2}
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setFormOpen(false)} className="px-3 py-2 rounded bg-slate-800 text-xs font-semibold">Annuler</button>
                <button type="submit" className={`px-4 py-2 rounded text-xs font-bold text-white ${preset.accentBtn}`}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
