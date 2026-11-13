'use client';

import React, { useMemo, useState } from 'react';
import {
  Plus,
  Pencil,
  Upload,
  ImageIcon,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  Calculator,
  Sparkles,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import type { SbsErpComputedReport } from '@/lib/sbsErpCalc';
import type { SbsProductFamily, SbsProductItem } from '@/lib/sbsErpDefaults';
import { FAMILY_LABELS, fmtFCFA, fmtPct, SBS_PRESET_IMAGES } from './sbsFormat';

interface ProductDraft {
  mode: 'create' | 'edit';
  id?: string;
  code: string;
  family: SbsProductFamily;
  name: string;
  dimensions: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  unit: string;
  sellingPriceFCFA: string;
  priceMaxFCFA: string;
  isPriceVisible: boolean;
  isPublished: boolean;
  availability: string;
  isRental: boolean;
  imageUrl: string;
  description: string;
  hasFormulation: boolean;
  isSolidBlock: boolean;
  gravier38Brouettes: string;
  gravier03Brouettes: string;
  sableBrouettes: string;
  eauLitres: string;
  rendementPerSac: string;
  volumeExtLitres: string;
  stockOpening: string;
  sortOrder: number;
}

const emptyDraft = (nextOrder: number): ProductDraft => ({
  mode: 'create',
  code: '',
  family: 'agglos-pleins',
  name: '',
  dimensions: '20×20×40 cm',
  lengthCm: '40',
  widthCm: '20',
  heightCm: '20',
  unit: 'pièce',
  sellingPriceFCFA: '700',
  priceMaxFCFA: '',
  isPriceVisible: true,
  isPublished: true,
  availability: 'En stock',
  isRental: false,
  imageUrl: '/images/sbs-industries/flyer-agglos-pleins.jpg',
  description: '',
  hasFormulation: true,
  isSolidBlock: true,
  gravier38Brouettes: '1.5',
  gravier03Brouettes: '2.5',
  sableBrouettes: '1.5',
  eauLitres: '20',
  rendementPerSac: '21',
  volumeExtLitres: '16',
  stockOpening: '0',
  sortOrder: nextOrder,
});

export default function SbsCatalogTab({
  products,
  computed,
  onSaveProduct,
  onDeleteProduct,
}: {
  products: SbsProductItem[];
  computed: SbsErpComputedReport;
  onSaveProduct: (mode: 'create' | 'edit', payload: any) => Promise<void>;
  onDeleteProduct: (id: string, code: string) => Promise<void>;
}) {
  const [filterFamily, setFilterFamily] = useState<'all' | SbsProductFamily>('all');
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !draft) return;
    setUploadingImage(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi de l\'image');
      setDraft({ ...draft, imageUrl: data.url });
    } catch (error: any) {
      setErr(error?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploadingImage(false);
    }
  };

  const costByCode = useMemo(
    () => Object.fromEntries(computed.costRows.map((c) => [c.code, c])),
    [computed.costRows]
  );

  const filtered = useMemo(
    () =>
      products.filter((p) => (filterFamily === 'all' ? true : p.family === filterFamily)),
    [products, filterFamily]
  );

  const openEdit = (p: SbsProductItem) => {
    setErr('');
    setDraft({
      mode: 'edit',
      id: p.id,
      code: p.code,
      family: p.family,
      name: p.name,
      dimensions: p.dimensions,
      lengthCm: p.lengthCm != null ? String(p.lengthCm) : '',
      widthCm: p.widthCm != null ? String(p.widthCm) : '',
      heightCm: p.heightCm != null ? String(p.heightCm) : '',
      unit: p.unit,
      sellingPriceFCFA: String(p.sellingPriceFCFA),
      priceMaxFCFA: p.priceMaxFCFA != null ? String(p.priceMaxFCFA) : '',
      isPriceVisible: p.isPriceVisible,
      isPublished: p.isPublished,
      availability: p.availability,
      isRental: p.isRental,
      imageUrl: p.imageUrl || '/images/sbs-industries/flyer-agglos-pleins.jpg',
      description: p.description || '',
      hasFormulation: p.hasFormulation,
      isSolidBlock: p.isSolidBlock,
      gravier38Brouettes: String(p.gravier38Brouettes),
      gravier03Brouettes: String(p.gravier03Brouettes),
      sableBrouettes: String(p.sableBrouettes),
      eauLitres: String(p.eauLitres),
      rendementPerSac: String(p.rendementPerSac),
      volumeExtLitres: String(p.volumeExtLitres),
      stockOpening: String(p.stockOpening),
      sortOrder: p.sortOrder,
    });
  };

  const applyDimCalc = () => {
    if (!draft) return;
    const L = Number(draft.lengthCm) || 0;
    const l = Number(draft.widthCm) || 0;
    const h = Number(draft.heightCm) || 0;
    if (L > 0 && l > 0 && h > 0) {
      const volL = Number(((L * l * h) / 1000).toFixed(2));
      setDraft({
        ...draft,
        dimensions: `${l}×${h}×${L} cm`,
        volumeExtLitres: String(volL),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setErr('');
    try {
      const numOrNull = (s: string) => (s.trim() === '' ? null : Number(s));
      await onSaveProduct(draft.mode, {
        id: draft.id,
        code: draft.code.trim().toUpperCase(),
        family: draft.family,
        name: draft.name.trim(),
        dimensions: draft.dimensions.trim(),
        lengthCm: numOrNull(draft.lengthCm),
        widthCm: numOrNull(draft.widthCm),
        heightCm: numOrNull(draft.heightCm),
        unit: draft.unit.trim(),
        sellingPriceFCFA: Number(draft.sellingPriceFCFA) || 0,
        priceMaxFCFA: numOrNull(draft.priceMaxFCFA),
        isPriceVisible: draft.isPriceVisible,
        isPublished: draft.isPublished,
        availability: draft.availability,
        isRental: draft.isRental || draft.family === 'location',
        imageUrl: draft.imageUrl.trim() || null,
        description: draft.description.trim() || null,
        hasFormulation: draft.hasFormulation,
        isSolidBlock: draft.isSolidBlock,
        gravier38Brouettes: Number(draft.gravier38Brouettes) || 0,
        gravier03Brouettes: Number(draft.gravier03Brouettes) || 0,
        sableBrouettes: Number(draft.sableBrouettes) || 0,
        eauLitres: Number(draft.eauLitres) || 20,
        rendementPerSac: Math.max(0.1, Number(draft.rendementPerSac) || 1),
        volumeExtLitres: Math.max(0.1, Number(draft.volumeExtLitres) || 1),
        stockOpening: Number(draft.stockOpening) || 0,
        sortOrder: draft.sortOrder,
      });
      setDraft(null);
    } catch (error: any) {
      setErr(error?.message || 'Impossible d’enregistrer le produit.');
    } finally {
      setSaving(false);
    }
  };

  const applySuggested35 = async (p: SbsProductItem, price35: number) => {
    await onSaveProduct('edit', {
      ...p,
      sellingPriceFCFA: Math.round(price35),
    });
  };

  return (
    <div className="space-y-5">
      {/* Header & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l p-4">
        <div>
          <h2 className="font-title font-bold text-lg text-brand-900 dark:text-white">
            Catalogue Produits, Dimensions, Prix &amp; Locations SBS
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
            Toute modification (dimensions, prix, disponibilité, formulations Plein 15×20×40 / 20×20×40, béton ou locations) est synchronisée en direct sur la page publique et dans l&apos;ERP.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setErr('');
            setDraft(emptyDraft(products.length + 1));
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-m bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" /> Ajouter un produit / location
        </button>
      </div>

      {/* Pill Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: `Tous (${products.length})` },
          { id: 'agglos-pleins', label: 'Agglos pleins (15×20×40 · 20×20×40)' },
          { id: 'agglos-creux', label: 'Agglos creux' },
          { id: 'hourdis', label: 'Hourdis' },
          { id: 'paves', label: 'Pavés (/m²)' },
          { id: 'beton', label: 'Béton Prêt à l’Emploi' },
          { id: 'location', label: 'Locations Matériel' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterFamily(f.id as any)}
            className={`px-3 py-1.5 rounded-m text-xs font-bold transition-colors ${
              filterFamily === f.id
                ? 'bg-brand-900 text-white dark:bg-accent-500'
                : 'bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 text-neutral-700 dark:text-neutral-200 hover:border-accent-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table Produits */}
      <div className="bg-white dark:bg-brand-800 border border-neutral-200 dark:border-brand-700 rounded-l overflow-hidden shadow-elev-1">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-brand-900 text-white text-left">
              <tr>
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Désignation &amp; Famille</th>
                <th className="py-3 px-3">Dimensions</th>
                <th className="py-3 px-3 text-right">Tarif public</th>
                <th className="py-3 px-3 text-right">Prix revient</th>
                <th className="py-3 px-3 text-right">Marge catalogue</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-700">
              {filtered.map((p) => {
                const cost = costByCode[p.code];
                return (
                  <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-brand-900/40">
                    <td className="py-3 px-3 font-mono font-bold text-brand-900 dark:text-white">
                      {p.code}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {p.imageUrl && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-9 h-9 rounded object-cover border border-neutral-200 dark:border-brand-700 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                            {p.name}
                            {p.isRental && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] inline-flex items-center gap-0.5">
                                <Wrench className="w-2.5 h-2.5" /> Loc.
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {FAMILY_LABELS[p.family] || p.family}
                            {p.hasFormulation && ` · Rendement ${p.rendementPerSac} u/sac`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-700 dark:text-neutral-200">
                      {p.dimensions}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-brand-900 dark:text-white">
                      {p.priceMaxFCFA
                        ? `${p.sellingPriceFCFA.toLocaleString('fr-FR')}–${p.priceMaxFCFA.toLocaleString('fr-FR')} F`
                        : fmtFCFA(p.sellingPriceFCFA)}
                      <span className="text-neutral-400 font-normal">/{p.unit}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                      {cost ? fmtFCFA(cost.totalCostPricePerUnit, 1) : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      {cost ? (
                        <div className="space-y-0.5">
                          <div
                            className={`font-bold ${
                              cost.catalogMarginFCFA >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}
                          >
                            {fmtFCFA(cost.catalogMarginFCFA, 0)} ({fmtPct(cost.catalogMarginPct)})
                          </div>
                          <button
                            type="button"
                            onClick={() => applySuggested35(p, cost.suggestedPrice35)}
                            className="text-[10px] text-accent-600 hover:underline inline-flex items-center gap-0.5"
                            title="Appliquer le prix conseillé +35 % HT"
                          >
                            <Sparkles className="w-2.5 h-2.5" /> Conseillé +35% : {fmtFCFA(Math.round(cost.suggestedPrice35))}
                          </button>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {p.availability}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500">
                          {p.isPublished ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-500" /> Public
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-neutral-400" /> Masqué
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-brand-700 text-brand-700 dark:text-white"
                          title="Modifier dimensions, prix ou formulation"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                          if (window.confirm(`Confirmer la suppression définitive de ${p.code} (${p.name}) du catalogue SBS Industrie ?`)) {
                            onDeleteProduct(p.id, p.code);
                          }
                        }}
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Édition / Création complète */}
      {draft && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-elev-3">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-brand-700 sticky top-0 bg-white dark:bg-brand-900 z-10">
              <h3 className="font-title font-bold text-lg text-brand-900 dark:text-white">
                {draft.mode === 'create'
                  ? 'Nouveau produit / location SBS Industrie'
                  : `Modifier ${draft.code} — ${draft.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-brand-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5 text-xs">
              {err && (
                <div className="p-3 rounded-m bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-700 dark:text-red-300">
                  {err}
                </div>
              )}

              {/* Section Commerciale & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Code référence *</label>
                  <input
                    type="text"
                    required
                    value={draft.code}
                    onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                    placeholder="ex: AP20"
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-amber-50/50 dark:bg-brand-950 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Famille *</label>
                  <select
                    value={draft.family}
                    onChange={(e) => {
                      const fam = e.target.value as SbsProductFamily;
                      setDraft({
                        ...draft,
                        family: fam,
                        isRental: fam === 'location',
                        isSolidBlock: fam === 'agglos-pleins' || fam === 'paves',
                        hasFormulation: ['agglos-creux', 'agglos-pleins', 'hourdis'].includes(fam),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
                  >
                    <option value="agglos-pleins">Agglos pleins</option>
                    <option value="agglos-creux">Agglos creux</option>
                    <option value="hourdis">Hourdis</option>
                    <option value="paves">Pavés</option>
                    <option value="beton">Béton Prêt à l’Emploi</option>
                    <option value="location">Location Matériel / Coffrage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Disponibilité</label>
                  <select
                    value={draft.availability}
                    onChange={(e) => setDraft({ ...draft, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
                  >
                    <option value="En stock">En stock</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Sur commande">Sur commande</option>
                    <option value="En rupture">En rupture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nom commercial *</label>
                  <input
                    type="text"
                    required
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="ex: Agglo plein 20×20×40"
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-amber-50/50 dark:bg-brand-950"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Libellé Dimensions affiché *</label>
                  <input
                    type="text"
                    required
                    value={draft.dimensions}
                    onChange={(e) => setDraft({ ...draft, dimensions: e.target.value })}
                    placeholder="ex: 20×20×40 cm"
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-amber-50/50 dark:bg-brand-950 font-mono"
                  />
                </div>
              </div>

              {/* Dimensions numériques L x l x h */}
              <div className="p-3 rounded-m bg-neutral-50 dark:bg-brand-950/60 border border-neutral-200 dark:border-brand-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-700 dark:text-neutral-200">
                    Dimensions exactes (cm) — Modifiables à volonté
                  </span>
                  <button
                    type="button"
                    onClick={applyDimCalc}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-600 hover:underline"
                  >
                    <Calculator className="w-3.5 h-3.5" /> Calculer libellé &amp; volume ext. (L)
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Épaisseur / Largeur (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={draft.widthCm}
                      onChange={(e) => setDraft({ ...draft, widthCm: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Hauteur (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={draft.heightCm}
                      onChange={(e) => setDraft({ ...draft, heightCm: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Longueur (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={draft.lengthCm}
                      onChange={(e) => setDraft({ ...draft, lengthCm: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Prix & Unité */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Prix de vente unitaire (F CFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={draft.sellingPriceFCFA}
                    onChange={(e) => setDraft({ ...draft, sellingPriceFCFA: e.target.value })}
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-amber-50/50 dark:bg-brand-950 font-mono font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Prix max fourchette (optionnel, ex: BPE)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={draft.priceMaxFCFA}
                    onChange={(e) => setDraft({ ...draft, priceMaxFCFA: e.target.value })}
                    placeholder="Laisser vide si prix fixe"
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unité *</label>
                  <select
                    value={draft.unit}
                    onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
                  >
                    <option value="pièce">pièce</option>
                    <option value="m²">m²</option>
                    <option value="m³">m³</option>
                    <option value="jour">jour</option>
                    <option value="forfait">forfait</option>
                  </select>
                </div>
              </div>

              {/* Visibilité & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Visuel / Photo catalogue</label>
                  <select
                    value={draft.imageUrl}
                    onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
                  >
                    {SBS_PRESET_IMAGES.map((img) => (
                      <option key={img.url} value={img.url}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.isPublished}
                      onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })}
                    />
                    <span>Afficher sur la page publique</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.isPriceVisible}
                      onChange={(e) => setDraft({ ...draft, isPriceVisible: e.target.checked })}
                    />
                    <span>Afficher le prix</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description commerciale</label>
                <textarea
                  rows={2}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-m border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-950"
                />
              </div>

              {/* Formulation Usine (liée directement au calcul de Prix de revient & Compacité) */}
              <div className="p-4 rounded-m bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.hasFormulation}
                      onChange={(e) => setDraft({ ...draft, hasFormulation: e.target.checked })}
                    />
                    <span>Inclure dans la formulation usine (calcul Prix de Revient &amp; Journalier)</span>
                  </label>
                  {draft.hasFormulation && (
                    <label className="inline-flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.isSolidBlock}
                        onChange={(e) => setDraft({ ...draft, isSolidBlock: e.target.checked })}
                      />
                      <span>Bloc PLEIN (seuil compacité ≥ 85 %)</span>
                    </label>
                  )}
                </div>

                {draft.hasFormulation && (
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                    <div>
                      <label className="block text-[11px] mb-1">3/8 (brou.)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={draft.gravier38Brouettes}
                        onChange={(e) => setDraft({ ...draft, gravier38Brouettes: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">0/3 (brou.)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={draft.gravier03Brouettes}
                        onChange={(e) => setDraft({ ...draft, gravier03Brouettes: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Sable (brou.)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={draft.sableBrouettes}
                        onChange={(e) => setDraft({ ...draft, sableBrouettes: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Eau (L)</label>
                      <input
                        type="number"
                        step="1"
                        value={draft.eauLitres}
                        onChange={(e) => setDraft({ ...draft, eauLitres: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Rendement (u/sac)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={draft.rendementPerSac}
                        onChange={(e) => setDraft({ ...draft, rendementPerSac: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] mb-1">Volume ext. (L)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={draft.volumeExtLitres}
                        onChange={(e) => setDraft({ ...draft, volumeExtLitres: e.target.value })}
                        className="w-full px-2 py-1.5 rounded border border-neutral-300 dark:border-brand-700 bg-white dark:bg-brand-900 tabular-nums"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-200 dark:border-brand-700">
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="px-4 py-2 rounded-m border border-neutral-300 dark:border-brand-700 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-m bg-brand-900 hover:bg-brand-800 dark:bg-accent-500 dark:hover:bg-accent-600 text-white font-bold"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement…' : 'Enregistrer et publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
