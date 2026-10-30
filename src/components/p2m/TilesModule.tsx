'use client';

/**
 * Module Carreaux P2M — Catalogue + Générateur de devis (onglet de l'espace professionnel).
 * Rôles : « vendeur » (sans prix d'achat/frais/marge) et « gerant » (tout).
 * Formules = classeur CATALOGUE_CARREAUX_DEVIS.xlsx (font foi).
 */
import React from 'react';
import {
  Grid3X3, Plus, Pencil, X, Save, Printer, Trash2, Copy, Search,
  AlertTriangle, Calculator, Lock
} from 'lucide-react';
import {
  computeTile, computeLine, computeTotals, fmtFCFA, fmtM2,
} from '@/lib/tileCalc';
import { TileType } from '@/data/tileCatalog';
import {
  TileQuote, TileQuoteLine, useTileData, updateTile, addTile,
  createTileQuote, updateTileQuote, deleteTileQuote, duplicateTileQuote,
} from '@/lib/tileStore';
import { printTileQuote } from '@/lib/tileQuotePdf';

type Role = 'vendeur' | 'gerant';

const inputCls = 'w-full px-3 py-2 bg-white dark:bg-brand-900 border border-neutral-300 dark:border-brand-700 rounded-m text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-accent-500 transition-colors';
const labelCls = 'block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1';
const btnPrimary = 'inline-flex items-center gap-1.5 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-m text-xs transition-colors';
const btnGhost = 'inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-brand-800 hover:bg-neutral-200 dark:hover:bg-brand-700 text-neutral-700 dark:text-neutral-200 font-semibold rounded-m text-xs transition-colors';

const designation = (t: TileType) => `Carreau ${t.reference} cm (${t.piecesParCarton} pcs/carton)`;

interface TileFormState {
  mode: 'create' | 'edit'; id?: string;
  reference: string; longueurCm: string; largeurCm: string; piecesParCarton: string;
  poidsCartonKg: string; prixAchatCarton: string; fraisCarton: string; prixVenteM2: string;
}
const emptyTileForm = (): TileFormState => ({
  mode: 'create', reference: '', longueurCm: '', largeurCm: '', piecesParCarton: '',
  poidsCartonKg: '', prixAchatCarton: '', fraisCarton: '', prixVenteM2: '',
});

interface DraftLine { tileId: string; surfaceM2: string; }

export default function TilesModule({ role }: { role: Role }) {
  const { tiles, quotes, refresh } = useTileData();
  const isGerant = role === 'gerant';

  // ---- Catalogue ----
  const [search, setSearch] = React.useState('');
  const [tileForm, setTileForm] = React.useState<TileFormState | null>(null);
  const [flash, setFlash] = React.useState('');

  const notify = (m: string) => { setFlash(m); window.setTimeout(() => setFlash(''), 4000); };

  const filtered = tiles.filter(t =>
    !search || t.reference.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  );

  const openEditTile = (t: TileType) => setTileForm({
    mode: 'edit', id: t.id, reference: t.reference,
    longueurCm: String(t.longueurCm), largeurCm: String(t.largeurCm),
    piecesParCarton: String(t.piecesParCarton),
    poidsCartonKg: t.poidsCartonKg != null ? String(t.poidsCartonKg) : '',
    prixAchatCarton: t.prixAchatCarton != null ? String(t.prixAchatCarton) : '',
    fraisCarton: t.fraisCarton != null ? String(t.fraisCarton) : '',
    prixVenteM2: t.prixVenteM2 != null ? String(t.prixVenteM2) : '',
  });

  const saveTile = () => {
    if (!tileForm) return;
    const L = Number(tileForm.longueurCm), l = Number(tileForm.largeurCm), N = parseInt(tileForm.piecesParCarton);
    if (!(L > 0) || !(l > 0) || !(N > 0)) return notify('Longueur, largeur et pièces/carton strictement positives requises.');
    const ref = tileForm.reference.trim() || `${tileForm.longueurCm}×${tileForm.largeurCm}`;
    const num = (s: string) => (s.trim() === '' ? null : Number(s));
    if (tileForm.mode === 'create') {
      addTile({
        reference: ref, longueurCm: L, largeurCm: l, piecesParCarton: N,
        poidsCartonKg: num(tileForm.poidsCartonKg), prixAchatCarton: num(tileForm.prixAchatCarton),
        fraisCarton: num(tileForm.fraisCarton), prixVenteM2: num(tileForm.prixVenteM2),
        source: 'Indicatif',
      });
      notify('Type de carreau ajouté au catalogue.');
    } else if (tileForm.id) {
      updateTile(tileForm.id, {
        reference: ref, longueurCm: L, largeurCm: l, piecesParCarton: N,
        poidsCartonKg: num(tileForm.poidsCartonKg), prixAchatCarton: num(tileForm.prixAchatCarton),
        fraisCarton: num(tileForm.fraisCarton), prixVenteM2: num(tileForm.prixVenteM2),
      });
      notify('Carreau mis à jour.');
    }
    setTileForm(null);
    refresh();
  };

  // ---- Devis ----
  const [clientNom, setClientNom] = React.useState('');
  const [clientTel, setClientTel] = React.useState('');
  const [chantier, setChantier] = React.useState('');
  const [tauxPerte, setTauxPerte] = React.useState(0.10);
  const [tauxTva, setTauxTva] = React.useState(0.18);
  const [validite, setValidite] = React.useState(30);
  const [draftLines, setDraftLines] = React.useState<DraftLine[]>([{ tileId: '', surfaceM2: '' }]);

  const devisables = tiles.filter(t => t.actif && t.prixVenteM2 != null);

  const draft = React.useMemo(() => {
    const lignes: (TileQuoteLine | { error: 'no-price' | 'invalid' })[] = [];
    for (const dl of draftLines) {
      const t = tiles.find(x => x.id === dl.tileId);
      const s = Number(dl.surfaceM2);
      if (!t || !(s > 0)) {
        if (dl.tileId || dl.surfaceM2) lignes.push({ error: 'invalid' } as never);
        continue;
      }
      if (t.prixVenteM2 == null) { lignes.push({ error: 'no-price' } as never); continue; }
      const calc = computeTile(t);
      const line = computeLine({ tile: { ...calc, poidsCartonKg: t.poidsCartonKg, prixVenteCarton: calc.prixVenteCarton! }, surfaceM2: s, tauxPerte });
      if (!line) { lignes.push({ error: 'no-price' } as never); continue; }
      lignes.push({
        tileId: t.id, designation: `${designation(t)} — ${t.reference}`,
        surfaceM2: s, m2Carton: calc.m2Carton, prixVenteM2: t.prixVenteM2,
        prixVenteCarton: calc.prixVenteCarton!, poidsCartonKg: t.poidsCartonKg,
        nbCartons: line.nbCartons, m2Livres: line.m2Livres,
        montantLigne: line.montantLigne, poidsLigne: line.poidsLigne,
      });
    }
    const ok = lignes.filter(l => 'montantLigne' in l) as TileQuoteLine[];
    const totals = computeTotals(ok, tauxTva);
    const hasNoPrice = lignes.some(l => 'error' in l && l.error === 'no-price');
    const hasInvalid = lignes.some(l => 'error' in l && l.error === 'invalid');
    return { lignes, ok, totals, hasNoPrice, hasInvalid };
  }, [draftLines, tiles, tauxPerte, tauxTva]);

  const canEmit = draft.ok.length > 0 && clientNom.trim() && !draft.hasNoPrice && !draft.hasInvalid;

  const emitQuote = (statut: TileQuote['statut']) => {
    if (!canEmit) return notify('Complétez : client, surfaces > 0 et prix de vente saisis.');
    createTileQuote({
      clientNom: clientNom.trim(), clientTelephone: clientTel.trim(), adresseChantier: chantier.trim(),
      validiteJours: validite, tauxPerte, tauxTva, statut, creePar: 'Vendeur P2M',
      lignes: draft.ok, totalHT: draft.totals.totalHT, tva: draft.totals.tva, totalTTC: draft.totals.totalTTC,
    });
    refresh();
    notify(`Devis ${statut === 'brouillon' ? 'enregistré en brouillon' : 'émis'} : ${draft.totals.totalTTC.toLocaleString('fr-FR')} FCFA TTC.`);
    setDraftLines([{ tileId: '', surfaceM2: '' }]);
    setClientNom(''); setClientTel(''); setChantier('');
  };

  return (
    <div className="space-y-10">
      {flash && (
        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 text-emerald-800 rounded-m px-4 py-3 text-sm">{flash}</div>
      )}

      {/* ================= CATALOGUE ================= */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-accent-500" /> Catalogue des carreaux
            </h2>
            <p className="text-xs text-neutral-500">{tiles.filter(t => t.actif).length} types actifs · m²/carton et prix calculés automatiquement</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-neutral-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher 60×60…" className={`${inputCls} !pl-8 !py-1.5 !w-52`} />
            </div>
            {isGerant && (
              <button onClick={() => setTileForm(emptyTileForm())} className={btnPrimary}>
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            )}
          </div>
        </div>

        {/* Formulaire carreau */}
        {tileForm && (
          <div className="bg-white dark:bg-brand-900 border-2 border-accent-500 rounded-l p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">{tileForm.mode === 'create' ? 'Nouveau type de carreau' : `Modifier ${tileForm.reference}`}</h3>
              <button onClick={() => setTileForm(null)} aria-label="Fermer"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div><label className={labelCls}>Référence</label><input className={inputCls} placeholder="60×60" value={tileForm.reference} onChange={e => setTileForm({ ...tileForm, reference: e.target.value })} /></div>
              <div><label className={labelCls}>Longueur (cm) *</label><input type="number" min="0.1" className={inputCls} value={tileForm.longueurCm} onChange={e => setTileForm({ ...tileForm, longueurCm: e.target.value })} /></div>
              <div><label className={labelCls}>Largeur (cm) *</label><input type="number" min="0.1" className={inputCls} value={tileForm.largeurCm} onChange={e => setTileForm({ ...tileForm, largeurCm: e.target.value })} /></div>
              <div><label className={labelCls}>Pièces / carton *</label><input type="number" min="1" className={inputCls} value={tileForm.piecesParCarton} onChange={e => setTileForm({ ...tileForm, piecesParCarton: e.target.value })} /></div>
              <div><label className={labelCls}>Poids carton (kg)</label><input type="number" min="0" className={inputCls} value={tileForm.poidsCartonKg} onChange={e => setTileForm({ ...tileForm, poidsCartonKg: e.target.value })} /></div>
              {isGerant && (<>
                <div><label className={labelCls}>Prix achat carton (F) 🔒</label><input type="number" className={inputCls} value={tileForm.prixAchatCarton} onChange={e => setTileForm({ ...tileForm, prixAchatCarton: e.target.value })} /></div>
                <div><label className={labelCls}>Frais carton (F) 🔒</label><input type="number" className={inputCls} value={tileForm.fraisCarton} onChange={e => setTileForm({ ...tileForm, fraisCarton: e.target.value })} /></div>
              </>)}
              <div><label className={labelCls}>Prix de vente au m² (F)</label><input type="number" min="0" className={inputCls} value={tileForm.prixVenteM2} onChange={e => setTileForm({ ...tileForm, prixVenteM2: e.target.value })} /></div>
            </div>
            {/* Aperçu live */}
            {Number(tileForm.longueurCm) > 0 && Number(tileForm.largeurCm) > 0 && parseInt(tileForm.piecesParCarton) > 0 && (() => {
              const c = computeTile({
                longueurCm: Number(tileForm.longueurCm), largeurCm: Number(tileForm.largeurCm),
                piecesParCarton: parseInt(tileForm.piecesParCarton),
                prixAchatCarton: isGerant && tileForm.prixAchatCarton ? Number(tileForm.prixAchatCarton) : null,
                fraisCarton: isGerant && tileForm.fraisCarton ? Number(tileForm.fraisCarton) : null,
                prixVenteM2: tileForm.prixVenteM2 ? Number(tileForm.prixVenteM2) : null,
              });
              return (
                <div className="bg-neutral-50 dark:bg-brand-800/50 rounded-m px-4 py-3 text-xs font-mono flex flex-wrap gap-x-6 gap-y-1">
                  <span>m²/pièce : <strong>{fmtM2(c.surfacePieceM2)}</strong></span>
                  <span>m²/carton : <strong className="text-accent-500">{fmtM2(c.m2Carton)}</strong></span>
                  {c.prixVenteCarton != null && <span>Prix carton : <strong>{fmtFCFA(c.prixVenteCarton)}</strong></span>}
                  {c.prixVentePiece != null && <span>Prix pièce : <strong>{fmtFCFA(c.prixVentePiece)}</strong></span>}
                  {isGerant && c.coutRevientM2 != null && <span>Coût revient/m² 🔒 : <strong>{fmtFCFA(c.coutRevientM2)}</strong></span>}
                  {isGerant && c.margePct != null && (
                    <span className={c.margePct < 0 ? 'text-red-600 font-bold' : ''}>
                      Marge 🔒 : <strong>{Math.round(c.margePct * 100)} %</strong> {c.margePct < 0 && '⚠ marge négative'}
                    </span>
                  )}
                </div>
              );
            })()}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setTileForm(null)} className={btnGhost}><X className="w-4 h-4" /> Annuler</button>
              <button onClick={saveTile} className={btnPrimary}><Save className="w-4 h-4" /> Enregistrer</button>
            </div>
          </div>
        )}

        {/* Tableau catalogue */}
        <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-brand-800/60 text-left text-neutral-600 dark:text-neutral-300">
                <th className="px-3 py-2.5 font-bold">Réf.</th>
                <th className="px-3 py-2.5 font-bold">Dimensions</th>
                <th className="px-3 py-2.5 font-bold">Pcs/carton</th>
                <th className="px-3 py-2.5 font-bold">m²/carton</th>
                <th className="px-3 py-2.5 font-bold">Prix vente/m²</th>
                <th className="px-3 py-2.5 font-bold">Prix carton</th>
                <th className="px-3 py-2.5 font-bold">Prix pièce</th>
                {isGerant && <th className="px-3 py-2.5 font-bold">🔒 Coût/m²</th>}
                {isGerant && <th className="px-3 py-2.5 font-bold">🔒 Marge</th>}
                <th className="px-3 py-2.5 font-bold">Source</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-800">
              {filtered.map(t => {
                const c = computeTile(t);
                const negatif = c.margePct != null && c.margePct < 0;
                return (
                  <tr key={t.id} className={!t.actif ? 'opacity-40' : ''}>
                    <td className="px-3 py-2 font-mono font-bold">{t.id}</td>
                    <td className="px-3 py-2 font-semibold">{t.reference}</td>
                    <td className="px-3 py-2 tabular-nums">{t.piecesParCarton}</td>
                    <td className="px-3 py-2 tabular-nums font-bold text-accent-500">{fmtM2(c.m2Carton)}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {isGerant ? (
                        <input
                          type="number" min="0" className="w-24 px-2 py-1 border rounded text-xs tabular-nums bg-white dark:bg-brand-900 border-neutral-300 dark:border-brand-700"
                          value={t.prixVenteM2 ?? ''} placeholder="à saisir"
                          onChange={e => { updateTile(t.id, { prixVenteM2: e.target.value === '' ? null : Number(e.target.value) }); refresh(); }}
                        />
                      ) : t.prixVenteM2 != null ? fmtFCFA(t.prixVenteM2) : <span className="text-amber-600 font-semibold">Prix à saisir</span>}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{c.prixVenteCarton != null ? fmtFCFA(c.prixVenteCarton) : '—'}</td>
                    <td className="px-3 py-2 tabular-nums">{c.prixVentePiece != null ? fmtFCFA(c.prixVentePiece) : '—'}</td>
                    {isGerant && <td className="px-3 py-2 tabular-nums">{c.coutRevientM2 != null ? fmtFCFA(c.coutRevientM2) : '—'}</td>}
                    {isGerant && <td className={`px-3 py-2 tabular-nums ${negatif ? 'text-red-600 font-bold' : ''}`}>{c.margePct != null ? `${Math.round(c.margePct * 100)} %` : '—'}{negatif && ' ⚠'}</td>}
                    <td className="px-3 py-2 text-[10px] text-neutral-500">{t.source}</td>
                    <td className="px-3 py-2">
                      {isGerant && (
                        <button onClick={() => openEditTile(t)} aria-label={`Modifier ${t.reference}`} className="text-neutral-400 hover:text-accent-500"><Pencil className="w-3.5 h-3.5" /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={isGerant ? 11 : 8} className="px-3 py-8 text-center text-neutral-500">Aucun carreau trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!isGerant && (
          <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Prix d&apos;achat, frais et marges réservés au gérant — ces données ne sont jamais envoyées à cette session.
          </p>
        )}
      </section>

      {/* ================= NOUVEAU DEVIS ================= */}
      <section className="space-y-4">
        <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent-500" /> Générateur de devis carreaux
        </h2>

        <div className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div><label className={labelCls}>Client *</label><input className={inputCls} value={clientNom} onChange={e => setClientNom(e.target.value)} placeholder="Nom du client" /></div>
            <div><label className={labelCls}>Téléphone</label><input className={inputCls} value={clientTel} onChange={e => setClientTel(e.target.value)} placeholder="+221 …" /></div>
            <div><label className={labelCls}>Adresse chantier</label><input className={inputCls} value={chantier} onChange={e => setChantier(e.target.value)} /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><label className={labelCls}>Perte</label>
                <select className={inputCls} value={tauxPerte} onChange={e => setTauxPerte(Number(e.target.value))}>
                  {[0, 0.05, 0.10, 0.15].map(v => <option key={v} value={v}>{Math.round(v * 100)} %</option>)}
                </select>
              </div>
              <div><label className={labelCls}>TVA</label>
                <select className={inputCls} value={tauxTva} onChange={e => setTauxTva(Number(e.target.value))}>
                  {[0, 0.18].map(v => <option key={v} value={v}>{Math.round(v * 100)} %</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Validité</label>
                <select className={inputCls} value={validite} onChange={e => setValidite(Number(e.target.value))}>
                  {[15, 30, 60].map(v => <option key={v} value={v}>{v} j</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Lignes */}
          <div className="space-y-2">
            <span className={labelCls}>Lignes (marge de perte incluse, arrondi au carton entier)</span>
            {draftLines.map((dl, idx) => {
              const t = tiles.find(x => x.id === dl.tileId);
              return (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-neutral-50 dark:bg-brand-800/40 rounded-m p-2">
                  <div className="col-span-12 sm:col-span-5">
                    <select className={inputCls} value={dl.tileId}
                      onChange={e => { const ls = [...draftLines]; ls[idx] = { ...dl, tileId: e.target.value }; setDraftLines(ls); }}>
                      <option value="">— Choisir un carreau —</option>
                      {devisables.map(x => <option key={x.id} value={x.id}>{designation(x)} — {x.reference}</option>)}
                    </select>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input type="number" min="0" step="0.01" className={inputCls} placeholder="Surface m²"
                      value={dl.surfaceM2} onChange={e => { const ls = [...draftLines]; ls[idx] = { ...dl, surfaceM2: e.target.value }; setDraftLines(ls); }} />
                  </div>
                  <div className="col-span-8 sm:col-span-4 text-xs font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                    {t && Number(dl.surfaceM2) > 0 && t.prixVenteM2 != null && (() => {
                      const c = computeTile(t);
                      const line = computeLine({ tile: { ...c, prixVenteCarton: c.prixVenteCarton! }, surfaceM2: Number(dl.surfaceM2), tauxPerte });
                      if (!line) return null;
                      return (
                        <span>
                          <strong>{line.nbCartons}</strong> cartons · {fmtM2(line.m2Livres)} livrés · <strong className="text-accent-500">{fmtFCFA(line.montantLigne)}</strong>
                          {line.poidsLigne != null && <> · {Math.round(line.poidsLigne)} kg</>}
                        </span>
                      );
                    })()}
                    {t && t.prixVenteM2 == null && <span className="text-amber-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Prix de vente à saisir</span>}
                  </div>
                  <div className="col-span-12 sm:col-span-1 flex justify-end">
                    <button onClick={() => setDraftLines(draftLines.filter((_, i) => i !== idx))} disabled={draftLines.length <= 1}
                      className="px-2 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-m disabled:opacity-40" aria-label="Supprimer la ligne">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            <button onClick={() => setDraftLines([...draftLines, { tileId: '', surfaceM2: '' }])} className={btnGhost}>
              <Plus className="w-4 h-4" /> Ajouter une ligne
            </button>
          </div>

          {/* Totaux */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-neutral-200 dark:border-brand-700 pt-4">
            <div className="text-sm font-mono tabular-nums space-y-0.5">
              <p>Total HT : <strong>{fmtFCFA(draft.totals.totalHT)}</strong></p>
              <p>TVA {Math.round(tauxTva * 100)} % : <strong>{fmtFCFA(draft.totals.tva)}</strong></p>
              <p className="text-base text-accent-500 font-bold">Total TTC : {fmtFCFA(draft.totals.totalTTC)}</p>
              <p className="text-[11px] text-neutral-500">
                {draft.ok.reduce((s, l) => s + l.nbCartons, 0)} cartons · {fmtM2(draft.ok.reduce((s, l) => s + l.m2Livres, 0))} livrés
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => emitQuote('brouillon')} disabled={!canEmit} className={btnGhost + (canEmit ? '' : ' opacity-40 cursor-not-allowed')}>
                <Save className="w-4 h-4" /> Brouillon
              </button>
              <button onClick={() => emitQuote('envoyé')} disabled={!canEmit} className={btnPrimary + (canEmit ? '' : ' opacity-40 cursor-not-allowed')}>
                <Save className="w-4 h-4" /> Émettre le devis
              </button>
            </div>
          </div>
          {(draft.hasInvalid || draft.hasNoPrice) && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              {draft.hasNoPrice && 'Un carreau sans prix de vente bloque l\'émission. '}
              {draft.hasInvalid && 'Vérifiez les lignes : surface > 0 requise.'}
            </p>
          )}
        </div>
      </section>

      {/* ================= LISTE DES DEVIS CARREAUX ================= */}
      <section className="space-y-4">
        <h2 className="text-xl font-title font-bold text-neutral-900 dark:text-white">Devis carreaux ({quotes.length})</h2>
        {quotes.length === 0 ? (
          <p className="text-sm text-neutral-500 border border-dashed border-neutral-300 rounded-l p-8 text-center">
            Aucun devis carreaux. Utilisez le générateur ci-dessus.
          </p>
        ) : (
          <div className="space-y-3">
            {quotes.map(q => (
              <article key={q.id} className="bg-white dark:bg-brand-900 border border-neutral-200 dark:border-brand-700 rounded-l p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm">{q.numero}</span>
                    <span className="ml-2 text-xs text-neutral-500">{new Date(q.date).toLocaleDateString('fr-FR')} · {q.clientNom} · {q.lignes.length} ligne(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-brand-800">{q.statut}</span>
                    <strong className="font-mono text-accent-500">{fmtFCFA(q.totalTTC)}</strong>
                  </div>
                </div>
                <ul className="text-xs text-neutral-600 dark:text-neutral-400 divide-y divide-neutral-100 dark:divide-brand-800">
                  {q.lignes.map((l, i) => (
                    <li key={i} className="flex justify-between py-1">
                      <span>{l.nbCartons} cartons · {l.designation}</span>
                      <span className="font-mono">{fmtFCFA(l.montantLigne)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button onClick={() => printTileQuote(q)} className={btnGhost}><Printer className="w-4 h-4" /> PDF / Imprimer</button>
                  <button onClick={() => { duplicateTileQuote(q); refresh(); notify('Devis dupliqué en brouillon.'); }} className={btnGhost}>
                    <Copy className="w-4 h-4" /> Dupliquer
                  </button>
                  {q.statut === 'brouillon' && (
                    <>
                      <button onClick={() => { updateTileQuote(q.id, { statut: 'envoyé' }); refresh(); notify('Devis émis.'); }} className={btnPrimary}>Émettre</button>
                      <button onClick={() => { if (window.confirm(`Supprimer ${q.numero} ?`)) { deleteTileQuote(q.id); refresh(); } }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-m text-xs font-semibold">
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </>
                  )}
                  {q.statut !== 'brouillon' && (
                    <span className="text-[11px] text-neutral-500 self-center">Devis émis — non modifiable (dupliquez pour modifier).</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
