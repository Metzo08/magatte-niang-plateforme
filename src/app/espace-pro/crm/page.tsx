'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { store } from '@/lib/store';
import { ENTITIES } from '@/data/initialData';
import { Users, FileText, Calendar, Activity, ArrowLeft, ShieldCheck, Gauge, Target, Phone, Mail } from 'lucide-react';

const PIPELINE_STAGES = ['Nouveau', 'En qualification', 'Affecté', 'Premier contact', 'Étude du besoin', 'Devis envoyé', 'En négociation', 'Gagné', 'Perdu'] as const;

const SCORE_COLORS = [
  { min: 80, cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40' },
  { min: 50, cls: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40' },
  { min: 0, cls: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40' },
];

export default function CrmPage() {
  const [leads, setLeads] = React.useState<ReturnType<typeof store.getLeads>>([]);
  const [quotes, setQuotes] = React.useState<ReturnType<typeof store.getQuotes>>([]);
  const [appointments, setAppointments] = React.useState<ReturnType<typeof store.getAppointments>>([]);
  const [logs, setLogs] = React.useState<ReturnType<typeof store.getAuditLogs>>([]);

  React.useEffect(() => {
    setLeads(store.getLeads());
    setQuotes(store.getQuotes());
    setAppointments(store.getAppointments());
    setLogs(store.getAuditLogs());
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const entityName = (id: string) => ENTITIES.find(e => e.id === id)?.name ?? id;

  const avgScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length) : 0;
  const totalPipelineFCFA = quotes.reduce((s, q) => s + q.totalTTC, 0);
  const wonCount = leads.filter(l => l.stage === 'Gagné').length;
  const activeCount = leads.filter(l => l.stage !== 'Gagné' && l.stage !== 'Perdu').length;

  const scoreCls = (score: number) => SCORE_COLORS.find(r => score >= r.min)!.cls;

  const stats = [
    { icon: <Users className="w-5 h-5 text-accent-500" />, label: 'Leads actifs', value: `${activeCount}` },
    { icon: <Gauge className="w-5 h-5 text-accent-500" />, label: 'Score moyen', value: `${avgScore}/100` },
    { icon: <FileText className="w-5 h-5 text-accent-500" />, label: 'Pipeline devis', value: `${(totalPipelineFCFA / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M FCFA` },
    { icon: <Calendar className="w-5 h-5 text-accent-500" />, label: 'RDV confirmés', value: `${appointments.filter(a => a.status === 'Confirmé').length}` },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-brand-900">
      <Breadcrumb items={[{ label: 'Espace professionnel', href: '/espace-pro' }, { label: 'Back-office & CRM direction', href: '/espace-pro/crm' }]} />

      {/* HERO */}
      <section className="bg-brand-900 dark:bg-brand-950 blueprint-grid-dense-dark text-white border-b border-brand-800">
        <div className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/espace-pro" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-accent-500 transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour à l'espace professionnel
          </Link>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-500/15 border border-accent-500/30 rounded-full text-xs font-mono font-bold  tracking-wider text-accent-400 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Accès Direction · Interne
          </span>
          <h1 className="text-3xl sm:text-4xl font-title font-bold tracking-tight mb-3">
            Back-Office & <span className="text-accent-400">CRM direction</span>
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base max-w-3xl">
            Pilotage commercial consolidé : pipeline de leads scorés et routés automatiquement vers
            les 7 entités, devis émis, rendez-vous et journal d'audit conforme CDP.
          </p>
        </div>
      </section>

      <section className="max-w-editorial mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
              <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-m flex items-center justify-center mb-3">
                {s.icon}
              </div>
              <p className="text-2xl font-title font-bold text-neutral-900 dark:text-white tabular-nums">{s.value}</p>
              <p className="text-[11px] font-mono  tracking-wider text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PIPELINE LEADS */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white tracking-tight">
                Pipeline commercial
              </h2>
              <span className="text-xs font-mono text-neutral-500">
                {wonCount} gagné(s) · Taux de conversion {leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0}%
              </span>
            </div>

            {/* Répartition par stade */}
            <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5 mb-5">
              <div className="space-y-2">
                {PIPELINE_STAGES.map(stage => {
                  const count = leads.filter(l => l.stage === stage).length;
                  const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">{stage}</span>
                      <div className="flex-1 h-4 bg-neutral-100 dark:bg-brand-900 rounded overflow-hidden">
                        <div
                          className={`h-full rounded ${stage === 'Gagné' ? 'bg-emerald-500' : stage === 'Perdu' ? 'bg-red-400' : 'bg-accent-500'}`}
                          style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 tabular-nums">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Liste des leads */}
            <div className="space-y-3">
              {leads.map(lead => (
                <div key={lead.id} className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">{lead.leadNumber}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded tabular-nums ${scoreCls(lead.score)}`}>
                          <Target className="w-3 h-3 inline mr-0.5" />{lead.score}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-brand-900 text-neutral-600 dark:text-neutral-400">
                          {lead.stage}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {lead.fullName}{lead.company ? ` — ${lead.company}` : ''}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {lead.needCategory} · {lead.projectLocation} · {lead.budgetRange}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block text-[10px] font-mono font-bold px-2 py-1 rounded bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400">
                        → {entityName(lead.assignedEntityId)}
                      </span>
                      <p className="text-[10px] text-neutral-500 mt-1.5">{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-brand-700 pt-3">
                    <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 hover:text-accent-500">
                      <Phone className="w-3 h-3" /> {lead.phone}
                    </a>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 hover:text-accent-500">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Activity className="w-3 h-3" /> {lead.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDE COLUMN */}
          <div className="space-y-8">
            {/* DEVIS */}
            <div>
              <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-3">
                Devis récents
              </h2>
              <div className="space-y-3">
                {quotes.slice(0, 5).map(q => (
                  <div key={q.id} className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">{q.quoteNumber}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{q.clientCompany || q.clientName}</p>
                    <p className="text-sm font-mono font-bold text-accent-500 tabular-nums mt-1">
                      {q.totalTTC.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                ))}
                {quotes.length === 0 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-brand-800 border border-dashed border-neutral-300 dark:border-brand-700 rounded-l p-4 text-center">
                    Aucun devis émis.
                  </p>
                )}
              </div>
            </div>

            {/* AUDIT LOG */}
            <div>
              <h2 className="text-lg font-title font-bold text-neutral-900 dark:text-white tracking-tight mb-3">
                Journal d'audit <span className="text-xs font-mono font-normal text-neutral-500">(CDP)</span>
              </h2>
              <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l divide-y divide-neutral-200 dark:divide-brand-700">
                {logs.slice(0, 6).map(log => (
                  <div key={log.id} className="p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-accent-600 dark:text-accent-400">{log.action}</span>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">{formatDate(log.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      {log.user} ({log.role}) → {log.resourceId}
                      {log.newValue ? ` · ${log.newValue}` : ''}
                    </p>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="p-4 text-xs text-neutral-500 text-center">Journal vide.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}