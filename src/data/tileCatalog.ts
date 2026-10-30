/**
 * Catalogue de carreaux P2M — issu du classeur CATALOGUE_CARREAUX_DEVIS.xlsx (feuille Catalogue).
 * 8 types d'origine (fichier TYPES_CARREAUX.xlsx) + 21 tailles indicatives (pieces_par_carton = valeur
 * marché à confirmer avec le fournisseur, poids vide).
 *
 * Les prix d'exemple 60×60 (achat 14 400, vente 13 000/m²) sont fictifs — sert uniquement de jeu de test.
 * Champs confidentiels (prixAchat, frais) : ne jamais envoyer au client web du vendeur.
 */

export interface TileType {
  id: string;                // CAR-001…
  reference: string;         // ex. 60×60
  longueurCm: number;
  largeurCm: number;
  piecesParCarton: number;
  poidsCartonKg: number | null;
  prixAchatCarton: number | null; // confidentiel
  fraisCarton: number | null;     // confidentiel
  prixVenteM2: number | null;     // saisi par le vendeur ; null ⇒ non devisable
  source: 'Fichier d\u2019origine' | 'Indicatif';
  actif: boolean;
}

export const INITIAL_TILE_CATALOG: TileType[] = [
  // ---- 8 types d'origine (poids réels du fichier d'origine) ----
  { id: 'CAR-001', reference: '60×120', longueurCm: 120, largeurCm: 60, piecesParCarton: 2, poidsCartonKg: 29, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Fichier d\u2019origine', actif: true },
  { id: 'CAR-002', reference: '60×60', longueurCm: 60, largeurCm: 60, piecesParCarton: 4, poidsCartonKg: 26, prixAchatCarton: 14400, fraisCarton: 0, prixVenteM2: 13000, source: 'Fichier d\u2019origine', actif: true }, // prix FICTIFS (démo/tests)
  { id: 'CAR-003', reference: '30×60', longueurCm: 60, largeurCm: 30, piecesParCarton: 8, poidsCartonKg: 24, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Fichier d\u2019origine', actif: true },
  { id: 'CAR-004', reference: '25×37.5', longueurCm: 37.5, largeurCm: 25, piecesParCarton: 8, poidsCartonKg: 12, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Fichier d\u2019origine', actif: true },
  { id: 'CAR-005', reference: '25×40', longueurCm: 40, largeurCm: 25, piecesParCarton: 9, poidsCartonKg: 15, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Fichier d\u2019origine', actif: true },
  { id: 'CAR-006', reference: '20×30', longueurCm: 30, largeurCm: 20, piecesParCarton: 16, poidsCartonKg: 14, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Fichier d\u2019origine', actif: true },
  { id: 'CAR-007', reference: '30×30', longueurCm: 30, largeurCm: 30, piecesParCarton: 11, poidsCartonKg: 15, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Fichier d\u2019origine', actif: true },
  { id: 'CAR-008', reference: '40×40', longueurCm: 40, largeurCm: 40, piecesParCarton: 10, poidsCartonKg: 21, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Fichier d\u2019origine', actif: true },

  // ---- 21 tailles indicatives (N = valeur marché à confirmer ; poids vide) ----
  { id: 'CAR-009', reference: '20×20', longueurCm: 20, largeurCm: 20, piecesParCarton: 44, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-010', reference: '25×25', longueurCm: 25, largeurCm: 25, piecesParCarton: 30, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-011', reference: '33×33', longueurCm: 33, largeurCm: 33, piecesParCarton: 16, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-012', reference: '45×45', longueurCm: 45, largeurCm: 45, piecesParCarton: 8, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-013', reference: '50×50', longueurCm: 50, largeurCm: 50, piecesParCarton: 8, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-014', reference: '80×80', longueurCm: 80, largeurCm: 80, piecesParCarton: 3, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-015', reference: '100×100', longueurCm: 100, largeurCm: 100, piecesParCarton: 2, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-016', reference: '120×120', longueurCm: 120, largeurCm: 120, piecesParCarton: 2, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-017', reference: '30×90', longueurCm: 90, largeurCm: 30, piecesParCarton: 6, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-018', reference: '60×90', longueurCm: 90, largeurCm: 60, piecesParCarton: 3, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-019', reference: '80×160', longueurCm: 160, largeurCm: 80, piecesParCarton: 2, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-020', reference: '20×120', longueurCm: 120, largeurCm: 20, piecesParCarton: 8, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-021', reference: '25×50', longueurCm: 50, largeurCm: 25, piecesParCarton: 12, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-022', reference: '25×60', longueurCm: 60, largeurCm: 25, piecesParCarton: 10, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-023', reference: '20×60', longueurCm: 60, largeurCm: 20, piecesParCarton: 12, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-024', reference: '15×60', longueurCm: 60, largeurCm: 15, piecesParCarton: 16, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-025', reference: '15×90', longueurCm: 90, largeurCm: 15, piecesParCarton: 12, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-026', reference: '20×45', longueurCm: 45, largeurCm: 20, piecesParCarton: 20, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-027', reference: '25×75', longueurCm: 75, largeurCm: 25, piecesParCarton: 8, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-028', reference: '30×45', longueurCm: 45, largeurCm: 30, piecesParCarton: 12, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
  { id: 'CAR-029', reference: '40×80', longueurCm: 80, largeurCm: 40, piecesParCarton: 5, poidsCartonKg: null, prixAchatCarton: null, fraisCarton: null, prixVenteM2: null, source: 'Indicatif', actif: true },
];
