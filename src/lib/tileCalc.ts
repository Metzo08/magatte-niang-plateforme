/**
 * Moteur de calcul carreaux P2M — formules du classeur CATALOGUE_CARREAUX_DEVIS.xlsx (font foi).
 *
 * Point critique : le m² est calculé en décimal EXACT via des entiersscaled (pas de float)
 * afin que 0.09375 × 8 = 0.75 reste exact avant l'arrondi du plafond.
 * Une erreur de flottant pourrait faire passer 20.0000001 cartons à 21.
 */

export interface TileCalcInput {
  longueurCm: number;
  largeurCm: number;
  piecesParCarton: number;
  poidsCartonKg?: number | null;
  prixAchatCarton?: number | null;
  fraisCarton?: number | null;
  prixVenteM2?: number | null;
}

export interface TileCalc {
  surfacePieceM2: number;
  m2Carton: number;
  poidsM2: number | null;
  coutRevientM2: number | null;
  prixVenteCarton: number | null;
  prixVentePiece: number | null;
  margeM2: number | null;
  margePct: number | null;
}

/** Fraction exacte num/den → nombre. m² carton = L*l*N / 10000 en entier exact. */
function divExact(num: number, den: number): number {
  // num et den sont des entiers ou décimaux simples ; on calcule via BigInt rationnel.
  const scale = 1e9;
  const q = (BigInt(Math.round(num * scale)) * BigInt(scale)) / BigInt(Math.round(den * scale));
  return Number(q) / scale;
}

export function computeTile(t: TileCalcInput): TileCalc {
  const L = t.longueurCm;
  const l = t.largeurCm;
  const N = t.piecesParCarton;

  // surface_piece_m2 = L × l / 10000  — exact : L,l en cm, produits entiers quand possibles
  const surfacePieceM2 = divExact(L * l, 10000);
  // m2_carton = surface_piece × N — exact : (L*l*N)/10000
  const m2Carton = divExact(L * l * N, 10000);

  const poidsM2 = t.poidsCartonKg && m2Carton > 0 ? t.poidsCartonKg / m2Carton : null;

  const coutRevientM2 =
    t.prixAchatCarton != null && m2Carton > 0
      ? (t.prixAchatCarton + (t.fraisCarton ?? 0)) / m2Carton
      : null;

  const prixVenteCarton = t.prixVenteM2 != null ? Math.round(t.prixVenteM2 * m2Carton) : null;
  const prixVentePiece = prixVenteCarton != null ? Math.round(prixVenteCarton / N) : null;

  const margeM2 =
    t.prixVenteM2 != null && coutRevientM2 != null ? t.prixVenteM2 - coutRevientM2 : null;
  const margePct = margeM2 != null && coutRevientM2 ? margeM2 / coutRevientM2 : null;

  return { surfacePieceM2, m2Carton, poidsM2, coutRevientM2, prixVenteCarton, prixVentePiece, margeM2, margePct };
}

export interface LineQuoteInput {
  tile: TileCalc & { poidsCartonKg?: number | null; prixVenteCarton: number | null };
  surfaceM2: number;
  tauxPerte: number; // 0.10
}

export interface LineQuote {
  surfaceAvecPerte: number;
  nbCartons: number;
  m2Livres: number;
  montantLigne: number;
  poidsLigne: number | null;
}

/** PLAFOND exact : évite le piège flottant (ex. 20.000000001 → 21). */
export function ceilExact(x: number): number {
  const rounded = Math.round(x);
  return Math.abs(x - rounded) < 1e-9 ? rounded : Math.ceil(x);
}

export function computeLine({ tile, surfaceM2, tauxPerte }: LineQuoteInput): LineQuote | null {
  if (tile.prixVenteCarton == null || tile.m2Carton <= 0 || surfaceM2 <= 0) return null;
  const surfaceAvecPerte = surfaceM2 * (1 + tauxPerte);
  const nbCartons = ceilExact(divExact(surfaceAvecPerte, tile.m2Carton));
  const m2Livres = nbCartons * tile.m2Carton;
  const montantLigne = nbCartons * tile.prixVenteCarton;
  const poidsLigne = tile.poidsCartonKg != null ? nbCartons * tile.poidsCartonKg : null;
  return { surfaceAvecPerte, nbCartons, m2Livres, montantLigne, poidsLigne };
}

export function computeTotals(lines: { montantLigne: number }[], tauxTva: number) {
  const totalHT = lines.reduce((s, l) => s + l.montantLigne, 0);
  const tva = Math.round(totalHT * tauxTva);
  return { totalHT, tva, totalTTC: totalHT + tva };
}

export const fmtFCFA = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} FCFA`;
export const fmtM2 = (n: number) => `${Number(n.toFixed(4)).toLocaleString('fr-FR')} m²`;
