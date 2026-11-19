'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Newspaper, Plus, Edit3, Trash2, X, CheckCircle2, Calendar } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { ENTITY_ADMIN_REGISTRY } from '@/data/entityAdminRegistry';

interface PressArticle {
  id: string;
  title: string;
  date: string;
  abstract: string;
  content?: string;
  journalOrEvent: string;
  authors: string[];
  entityId?: string;
  imageUrl?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  defaultEntityId: string;
}

export function PressArticlesAdminModal({ open, onClose, defaultEntityId }: Props) {
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<PressArticle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    journalOrEvent: 'Communiqué officiel · Groupe Magatte NIANG',
    authors: 'Direction Communication',
    entityId: defaultEntityId,
    abstract: '',
    imageUrl: '',
  });

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/press-articles', { cache: 'no-store' });
      const data = await res.json();
      setArticles(Array.isArray(data.articles) ? data.articles : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) loadArticles();
  }, [open, loadArticles]);

  if (!open) return null;

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      journalOrEvent: 'Communiqué officiel · Groupe Magatte NIANG',
      authors: 'Direction Communication',
      entityId: defaultEntityId,
      abstract: '',
      imageUrl: '',
    });
    setShowForm(true);
    setFeedback('');
  };

  const openEdit = (a: PressArticle) => {
    setEditing(a);
    setForm({
      title: a.title,
      date: a.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      journalOrEvent: a.journalOrEvent || '',
      authors: (a.authors || []).join(', '),
      entityId: a.entityId || defaultEntityId,
      abstract: a.abstract || '',
      imageUrl: a.imageUrl || '',
    });
    setShowForm(true);
    setFeedback('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/press-articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur enregistrement');
      setShowForm(false);
      setEditing(null);
      await loadArticles();
      setFeedback('Communiqué synchronisé en direct sur /mediatheque !');
    } catch (err: any) {
      setFeedback(err?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer définitivement cet article de presse ?')) return;
    try {
      const res = await fetch(`/api/press-articles?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        await loadArticles();
        setFeedback('Article supprimé de la médiathèque.');
      }
    } catch {
      setFeedback('Erreur suppression.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-purple-400" />
              Gestion des Communiqués &amp; Articles de Presse
            </h3>
            <p className="text-xs text-slate-400">
              Synchronisé automatiquement avec la page Médiathèque (/mediatheque).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Nouvel article
            </button>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {feedback && (
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {feedback}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSave} className="bg-slate-950 border border-purple-500/40 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">
                  {editing ? 'Modifier le communiqué' : 'Publier un communiqué / article de presse'}
                </h4>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                  Annuler
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Titre du communiqué / article *"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white sm:col-span-2"
                />
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <select
                  value={form.entityId}
                  onChange={(e) => setForm((p) => ({ ...p, entityId: e.target.value }))}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="all">Écosystème Groupe Magatte NIANG</option>
                  {ENTITY_ADMIN_REGISTRY.map((ent) => (
                    <option key={ent.id} value={ent.id}>{ent.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Source / Journal / Événement"
                  value={form.journalOrEvent}
                  onChange={(e) => setForm((p) => ({ ...p, journalOrEvent: e.target.value }))}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Auteur(s)"
                  value={form.authors}
                  onChange={(e) => setForm((p) => ({ ...p, authors: e.target.value }))}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <textarea
                rows={3}
                required
                placeholder="Résumé / contenu du communiqué *"
                value={form.abstract}
                onChange={(e) => setForm((p) => ({ ...p, abstract: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
              <ImageUploadField
                label="Photo d'illustration (optionnelle)"
                value={form.imageUrl}
                onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                onNotify={(m) => setFeedback(m)}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {editing ? 'Enregistrer modifications' : 'Publier sur la médiathèque'}
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="text-xs text-slate-400">Chargement des communiqués...</p>
          ) : (
            <div className="space-y-2.5">
              {articles.map((a) => (
                <div
                  key={a.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {a.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.imageUrl} alt={a.title} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{a.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{a.abstract}</p>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> {a.date} · {a.journalOrEvent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-red-950/70 hover:bg-red-900 border border-red-800/60 text-xs font-semibold text-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
