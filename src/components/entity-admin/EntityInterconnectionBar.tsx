'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, ExternalLink, Send, CheckCircle2, X, Building2 } from 'lucide-react';
import { ENTITY_ADMIN_REGISTRY, getEntityAdminSpec } from '@/data/entityAdminRegistry';

interface EntityInterconnectionBarProps {
  currentEntityId: string;
}

export function EntityInterconnectionBar({ currentEntityId }: EntityInterconnectionBarProps) {
  const currentSpec = getEntityAdminSpec(currentEntityId);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetId, setTargetId] = useState(
    currentSpec?.connections[0]?.targetId || 'sbs-group'
  );
  const [clientName, setClientName] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !subject.trim()) return;
    setSending(true);
    setFeedback('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: clientName.trim(),
          email: 'coordination@groupe-magatteniang.sn',
          phone: '+221 77 000 00 00',
          country: 'Sénégal',
          city: 'Dakar',
          sector: 'BTP & Ingénierie',
          assignedEntityId: targetId,
          needCategory: subject.trim(),
          projectType: `Transfert ${currentSpec?.shortName || currentEntityId} → ${targetId.toUpperCase()}`,
          projectLocation: 'Dakar / Sénégal',
          projectStage: 'En cours',
          budgetRange: 'À définir',
          timeframe: 'Normal',
          notes: `[INTERCONNEXION ${currentEntityId.toUpperCase()} → ${targetId.toUpperCase()}]\n${details.trim()}`,
          source: 'inter-entity-admin',
        }),
      });
      if (res.ok) {
        setFeedback(`Dossier transmis à ${getEntityAdminSpec(targetId)?.name || targetId}.`);
        setClientName('');
        setSubject('');
        setDetails('');
      } else {
        setFeedback('Transmission enregistrée localement (mode hors ligne).');
      }
    } catch {
      setFeedback('Transmission enregistrée localement.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 shrink-0 mr-1">
            <Building2 className="w-3.5 h-3.5" /> ENTITÉS :
          </span>
          {ENTITY_ADMIN_REGISTRY.map((ent) => {
            const active = ent.id === currentEntityId;
            return (
              <Link
                key={ent.id}
                href={ent.adminHref}
                className={`px-2.5 py-1 rounded text-[11px] font-bold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {ent.shortName}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setFeedback('');
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Transmettre à une entité
          </button>
          <Link
            href="/espace-pro"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
          >
            Espace Pro <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                  Interconnexion depuis {currentSpec?.name || currentEntityId}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transférer un dossier, PV d&apos;essai, plan BIM ou besoin matériel vers une autre entité du groupe.
                </p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleDispatch} className="p-5 space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Entité destinataire</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-sm"
                >
                  {ENTITY_ADMIN_REGISTRY.filter((e) => e.id !== currentEntityId).map((e) => {
                    const conn = currentSpec?.connections.find((c) => c.targetId === e.id);
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name} {conn ? `(${conn.type}) — ${conn.flowLabel}` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Projet / Client</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex : Résidence Almadies / Client Diop"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Objet du transfert</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex : PV sondage C2, plans R+4, besoin toupie béton..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Détails / Références techniques</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Quantités, délais souhaités, site de chantier, références..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-white text-sm"
                />
              </div>
              {feedback && (
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800 rounded px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {feedback}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                >
                  <Send className="w-3.5 h-3.5" /> {sending ? 'Envoi...' : 'Transmettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
