'use client';

/**
 * Store du module Carreaux P2M — catalogue + devis (localStorage).
 * Les lignes de devis figent désignation, m²/carton, prix/m² et prix/carton :
 * un devis émis ne change jamais si le catalogue évolue ensuite.
 */
import React from 'react';
import { INITIAL_TILE_CATALOG, TileType } from '../data/tileCatalog';

export interface TileQuoteLine {
  tileId: string;
  designation: string;      // figée
  surfaceM2: number;
  m2Carton: number;         // figé
  prixVenteM2: number;      // figé
  prixVenteCarton: number;  // figé
  poidsCartonKg: number | null;
  nbCartons: number;
  m2Livres: number;
  montantLigne: number;
  poidsLigne: number | null;
}

export interface TileQuote {
  id: string;
  numero: string; // DEV-2026-001
  date: string;
  clientNom: string;
  clientTelephone: string;
  adresseChantier: string;
  validiteJours: number;
  tauxPerte: number;
  tauxTva: number;
  statut: 'brouillon' | 'envoyé' | 'accepté' | 'refusé';
  creePar: string;
  lignes: TileQuoteLine[];
  totalHT: number;
  tva: number;
  totalTTC: number;
}

const K_TILES = 'mn_p2m_tiles_v1';
const K_TQUOTES = 'mn_p2m_tile_quotes_v1';
const K_TSEQ = 'mn_p2m_tile_quote_seq_v1';

function read<T>(key: string, def: T): T {
  if (typeof window === 'undefined') return def;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : def;
  } catch {
    return def;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('storage-update'));
}

// ---------- Catalogue ----------

export function getTiles(): TileType[] {
  return read<TileType[]>(K_TILES, INITIAL_TILE_CATALOG);
}

export function saveTiles(tiles: TileType[]) {
  write(K_TILES, tiles);
}

export function updateTile(id: string, patch: Partial<TileType>) {
  saveTiles(getTiles().map(t => (t.id === id ? { ...t, ...patch } : t)));
}

export function addTile(t: Omit<TileType, 'id' | 'actif'>): TileType {
  const tiles = getTiles();
  const n = tiles.length + 1;
  const nt: TileType = { ...t, id: `CAR-${String(n).padStart(3, '0')}`, actif: true };
  saveTiles([...tiles, nt]);
  return nt;
}

// ---------- Devis carreaux ----------

export function getTileQuotes(): TileQuote[] {
  return read<TileQuote[]>(K_TQUOTES, []);
}

export function nextTileQuoteNumber(): string {
  const year = new Date().getFullYear();
  const seq = read<number>(K_TSEQ, 0) + 1;
  write(K_TSEQ, seq);
  return `DEV-${year}-${String(seq).padStart(3, '0')}`;
}

export function createTileQuote(
  data: Omit<TileQuote, 'id' | 'numero' | 'date' | 'totalHT' | 'tva' | 'totalTTC'> & { totalHT: number; tva: number; totalTTC: number }
): TileQuote {
  const q: TileQuote = {
    ...data,
    id: `tq-${Date.now()}`,
    numero: nextTileQuoteNumber(),
    date: new Date().toISOString(),
  };
  write(K_TQUOTES, [q, ...getTileQuotes()]);
  return q;
}

export function updateTileQuote(id: string, patch: Partial<TileQuote>) {
  write(K_TQUOTES, getTileQuotes().map(q => (q.id === id ? { ...q, ...patch } : q)));
}

export function deleteTileQuote(id: string) {
  write(K_TQUOTES, getTileQuotes().filter(q => q.id !== id));
}

export function duplicateTileQuote(q: TileQuote): TileQuote {
  const copy: TileQuote = {
    ...q,
    id: `tq-${Date.now()}`,
    numero: nextTileQuoteNumber(),
    date: new Date().toISOString(),
    statut: 'brouillon',
  };
  write(K_TQUOTES, [copy, ...getTileQuotes()]);
  return copy;
}

/** Hook de synchronisation du module carreaux. */
export function useTileData() {
  const [tiles, setTiles] = React.useState<TileType[]>([]);
  const [quotes, setQuotes] = React.useState<TileQuote[]>([]);

  const refresh = React.useCallback(() => {
    setTiles(getTiles());
    setQuotes(getTileQuotes());
  }, []);

  React.useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener('storage-update', h);
    return () => window.removeEventListener('storage-update', h);
  }, [refresh]);

  return { tiles, quotes, refresh };
}
